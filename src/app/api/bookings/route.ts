/* Create a booking.
 *
 * Replaces the previous flow, where the browser inserted straight into
 * Supabase with the anon key. That meant validation lived in code an attacker
 * controls, and the duplicate check was a SELECT followed by an INSERT — two
 * requests with a gap, so two people could pass the check and both write.
 *
 * Here uniqueness is enforced by the database (a partial unique index on
 * starts_at) and the race surfaces as 23505, which becomes a 409. That is the
 * only correct place for the rule: it holds however many instances are up.
 */

import { NextResponse } from "next/server";
import { SITE_URL } from "@/data/brand";
import { serviceClient } from "@/lib/booking/db";
import { HEARD_ABOUT_V1, isHeardAbout, isLinkChannel } from "@/lib/booking/attribution";
import { MAX_APP_LINK, MAX_DEADLINE, cleanText, isBuiltWith } from "@/lib/booking/brief";
import { createCalendarEvent, calendarConfigured } from "@/lib/booking/googleCalendar";
import {
  isBookableSlot,
  SLOT_MINUTES,
  formatSlot,
  HOST_TIMEZONE,
} from "@/lib/booking/availability";

export const dynamic = "force-dynamic";

const MAX_NAME = 120;
const MAX_NOTES = 2000;
const MAX_PATH = 200;
const MAX_HOST = 255;

// Deliberately loose. Strict email regexes reject valid addresses far more
// often than they catch bad ones, and the address is really verified by
// whether the Google invite arrives.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

/* Attribution: how the visitor heard about us, the page they booked from, the
   site that sent them, the first page of their visit (sent only with analytics
   consent) and the profile a tagged booking link was on
   (lib/booking/attribution.ts); and the optional brief (lib/booking/brief.ts).
   All optional and all from the browser, so anything malformed becomes null
   rather than an error. None of it is worth failing a booking over. */

// The path only. A query string or hash can carry tokens or personal details,
// and nothing here needs them.
const cleanPath = (value: unknown): string | null => {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  const path = value.split(/[?#]/, 1)[0];
  return path.length <= MAX_PATH ? path : null;
};

// A full page load from one of our own pages makes us the referrer, which says
// nothing about how the visitor found the site.
const OWN_HOST = new URL(SITE_URL).hostname;
const cleanHost = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const host = value.toLowerCase();
  if (host.length > MAX_HOST || !/^[a-z0-9.-]+$/.test(host)) return null;
  return host === OWN_HOST || host === `www.${OWN_HOST}` ? null : host;
};

/* Insert errors caused by optional columns rather than the booking. The
   columns come from migrations applied by hand, and this code may be live
   before the newest one: until then PostgREST refuses the unknown columns
   (PGRST204, or Postgres's 42703 if PostgREST's schema cache is out of date).
   23514, a failed check, means attribution.ts and a migration's list of
   answers have drifted apart, or a heard_about answer is newer than the
   database. Each one rejects the whole insert, so retrying with fewer fields
   cannot write the booking twice. */
const SCHEMA_ERRORS = new Set(["PGRST204", "42703", "23514"]);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("Malformed request");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, MAX_NOTES) : null;
  const visitorTimezone = typeof body.timezone === "string" ? body.timezone.slice(0, 64) : null;
  const attribution = {
    heard_about: isHeardAbout(body.heardAbout) ? body.heardAbout : null,
    booked_from: cleanPath(body.bookedFrom),
    referrer_host: cleanHost(body.referrerHost),
  };
  // The form-written columns 20261107120000_bookings_lead_tracking.sql adds;
  // the owner-set ones (qualified, new_channel, developer_account and the
  // rest) are never sent.
  const leadTracking = {
    landing_path: cleanPath(body.landingPath),
    lead_channel: isLinkChannel(body.leadChannel) ? body.leadChannel : null,
    app_link: cleanText(body.appLink, MAX_APP_LINK),
    built_with: isBuiltWith(body.builtWith) ? body.builtWith : null,
    deadline: cleanText(body.deadline, MAX_DEADLINE),
  };

  if (!name || name.length > MAX_NAME) return bad("Please give a name");
  if (!EMAIL_RE.test(email)) return bad("That email address doesn't look right");
  if (typeof body.startsAt !== "string") return bad("Please pick a time");

  const startsAt = new Date(body.startsAt);
  if (Number.isNaN(startsAt.getTime())) return bad("Please pick a time");

  // Slot rules are re-checked here rather than trusted from the client. The
  // modal only offers legal slots, but the modal is not what guards this.
  if (!isBookableSlot(startsAt)) {
    return bad("That time isn't available. Please pick another slot.", 422);
  }

  try {
    const supabase = serviceClient();

    // Light abuse check. Not a real rate limiter, but it stops the obvious
    // case of one address filling the whole calendar.
    const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .neq("status", "cancelled")
      .gte("created_at", dayAgo);

    if ((count ?? 0) >= 3) {
      return bad("You already have several calls booked. Reply to the invite to add more.", 429);
    }

    const booking = {
      name,
      email,
      starts_at: startsAt.toISOString(),
      duration_minutes: SLOT_MINUTES,
      visitor_timezone: visitorTimezone,
      notes,
      status: "pending",
      // Legacy columns, still written so the admin dashboard keeps
      // rendering until it reads starts_at. Remove with the columns.
      booking_date: startsAt.toISOString().slice(0, 10),
      booking_time: formatSlot(startsAt),
    };
    const insertBooking = (row: Record<string, unknown>) =>
      supabase.from("bookings").insert(row).select("id").single();

    /* Three tiers, so a missing migration costs only the fields it adds:
       everything; then the booking with the 20261014120000 attribution, its
       answer kept only if that migration's check allows it; then the booking
       alone. Each fallback is logged, every time rather than once per
       instance: bookings are few, and each line says which tier saved one and
       why. The last line is the one the post-deploy check looks for. */
    const tiers = [
      { row: { ...booking, ...attribution, ...leadTracking }, log: "" },
      {
        row: {
          ...booking,
          ...attribution,
          heard_about:
            attribution.heard_about && HEARD_ABOUT_V1.includes(attribution.heard_about)
              ? attribution.heard_about
              : null,
        },
        log: "[booking] saving bookings without the lead tracking fields (tier 2 of 3):",
      },
      { row: booking, log: "[booking] saving bookings without attribution (tier 3 of 3):" },
    ];

    let result = await insertBooking(tiers[0].row);
    for (let i = 1; i < tiers.length && result.error && SCHEMA_ERRORS.has(result.error.code); i++) {
      console.warn(tiers[i].log, result.error.code, result.error.message);
      result = await insertBooking(tiers[i].row);
    }
    const { data, error } = result;

    if (error) {
      // 23505 = unique violation: someone took this slot in between.
      if (error.code === "23505") {
        return bad("Sorry, that slot was just taken. Please pick another.", 409);
      }
      throw error;
    }

    /* The booking is saved; the calendar event is best-effort from here. If
       Google fails we must not lose or duplicate the row, so the failure is
       logged and the response says plainly whether an invite went out —
       rather than showing a confirmation that promises one that never comes. */
    let invited = false;
    if (calendarConfigured()) {
      try {
        const event = await createCalendarEvent({
          name,
          email,
          startsAt,
          notes,
          visitorTimezone,
        });
        if (event) {
          invited = true;
          await supabase
            .from("bookings")
            .update({ google_event_id: event.eventId, status: "confirmed" })
            .eq("id", data.id);
        }
      } catch (err) {
        console.error("[booking] calendar event failed for booking", data.id, err);
      }
    }

    return NextResponse.json({
      success: true,
      invited,
      startsAt: startsAt.toISOString(),
      hostTimezone: HOST_TIMEZONE,
    });
  } catch (err) {
    console.error("[booking]", err);
    return NextResponse.json({ error: "Could not save your booking" }, { status: 500 });
  }
}
