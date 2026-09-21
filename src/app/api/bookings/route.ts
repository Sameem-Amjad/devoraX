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
import { serviceClient } from "@/lib/booking/db";
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

// Deliberately loose. Strict email regexes reject valid addresses far more
// often than they catch bad ones, and the address is really verified by
// whether the Google invite arrives.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

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

  if (!name || name.length > MAX_NAME) return bad("Please give a name");
  if (!EMAIL_RE.test(email)) return bad("That email address doesn't look right");
  if (typeof body.startsAt !== "string") return bad("Please pick a time");

  const startsAt = new Date(body.startsAt);
  if (Number.isNaN(startsAt.getTime())) return bad("Please pick a time");

  // Slot rules are re-checked here rather than trusted from the client. The
  // modal only offers legal slots, but the modal is not what guards this.
  if (!isBookableSlot(startsAt)) {
    return bad("That time isn't available — please pick another slot", 422);
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
      return bad("You already have several calls booked — reply to the invite to add more.", 429);
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
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
      })
      .select("id")
      .single();

    if (error) {
      // 23505 = unique violation: someone took this slot in between.
      if (error.code === "23505") {
        return bad("Sorry — that slot was just taken. Please pick another.", 409);
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
