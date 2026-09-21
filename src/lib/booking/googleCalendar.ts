/* Google Calendar, over plain fetch.
 *
 * Only two endpoints are needed — refresh an access token, insert an event —
 * so this avoids the `googleapis` package, which pulls in the discovery
 * client for every Google product and dwarfs the rest of this app.
 *
 * Creating the event with both parties as attendees and sendUpdates=all is
 * what makes the booking real: Google emails the invite, attaches the .ics,
 * puts it on your phone and handles the reminder. That is the "confirmation
 * email" — writing our own would duplicate it worse.
 *
 * Every function here fails soft. A booking that is saved but missing its
 * calendar event is recoverable; losing the booking because Google had a bad
 * minute is not.
 */

import { HOST_TIMEZONE, SLOT_MINUTES, formatSlot } from "./availability";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export type BookingForEvent = {
  name: string;
  email: string;
  startsAt: Date;
  notes?: string | null;
  /** IANA zone the visitor booked in, shown in the invite so both see their own. */
  visitorTimezone?: string | null;
};

export const calendarConfigured = () =>
  Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
  );

/* Access tokens last an hour. Cached in module scope so a burst of bookings
   doesn't re-auth each time; serverless may still cold-start, which is fine. */
let cached: { token: string; expiresAt: number } | null = null;

const accessToken = async (): Promise<string> => {
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // invalid_grant means the refresh token was revoked or expired — the app
    // is probably still in "Testing" on the OAuth consent screen, where
    // Google expires refresh tokens after seven days. Publishing it fixes
    // this permanently; see scripts/google-calendar-setup.mjs.
    throw new Error(
      `google token refresh failed (${res.status}): ${body.error ?? "unknown"}` +
        (body.error === "invalid_grant"
          ? " — refresh token revoked or expired; re-run `npm run setup:google`"
          : "")
    );
  }

  cached = {
    token: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  return cached.token;
};

/**
 * Creates the call on your calendar and invites the visitor.
 * Returns the event id (stored so the booking can be cancelled later), or
 * null if Calendar isn't configured or the call failed.
 */
export const createCalendarEvent = async (
  b: BookingForEvent
): Promise<{ eventId: string; htmlLink?: string } | null> => {
  if (!calendarConfigured()) return null;

  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  const end = new Date(b.startsAt.getTime() + SLOT_MINUTES * 60_000);

  const event = {
    summary: `Strategy call — ${b.name} × DevoraX`,
    description: [
      `30-minute consultation booked from the DevoraX site.`,
      ``,
      `Name:  ${b.name}`,
      `Email: ${b.email}`,
      b.visitorTimezone ? `Their timezone: ${b.visitorTimezone}` : null,
      b.visitorTimezone
        ? `Their local time: ${formatSlot(b.startsAt, b.visitorTimezone)}`
        : null,
      b.notes ? `\nWhat they want to discuss:\n${b.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    start: { dateTime: b.startsAt.toISOString(), timeZone: HOST_TIMEZONE },
    end: { dateTime: end.toISOString(), timeZone: HOST_TIMEZONE },
    attendees: [{ email: b.email, displayName: b.name }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 10 },
      ],
    },
    // Ask Google to attach a Meet link, so neither side has to send one.
    conferenceData: {
      createRequest: {
        requestId: `devorax-${b.startsAt.getTime()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const url =
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events` +
    `?sendUpdates=all&conferenceDataVersion=1`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${await accessToken()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`calendar insert failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const created = await res.json();
  return { eventId: created.id, htmlLink: created.htmlLink };
};

/** Cancels the event and notifies the attendee. Safe to call with null. */
export const cancelCalendarEvent = async (eventId: string | null | undefined) => {
  if (!eventId || !calendarConfigured()) return false;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const res = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
    { method: "DELETE", headers: { authorization: `Bearer ${await accessToken()}` } }
  );
  // 410 means it was already cancelled — the desired end state either way.
  return res.ok || res.status === 410;
};

/**
 * Busy intervals from your real calendar for the given window.
 *
 * Without this, the site would happily book over anything already on your
 * calendar that wasn't booked through the site. Returns [] when Calendar is
 * unconfigured or errors, so the site degrades to database-only availability
 * rather than refusing every booking.
 */
export const fetchBusy = async (from: Date, to: Date): Promise<Array<[number, number]>> => {
  if (!calendarConfigured()) return [];
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  try {
    const res = await fetch(`${CALENDAR_API}/freeBusy`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${await accessToken()}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        timeMin: from.toISOString(),
        timeMax: to.toISOString(),
        items: [{ id: calendarId }],
      }),
    });
    if (!res.ok) return [];

    const body = await res.json();
    const busy = body.calendars?.[calendarId]?.busy ?? [];
    return busy.map((b: { start: string; end: string }) => [
      new Date(b.start).getTime(),
      new Date(b.end).getTime(),
    ]);
  } catch {
    return [];
  }
};
