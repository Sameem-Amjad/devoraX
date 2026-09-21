# Booking system

A visitor picks a slot on `/book`, it's checked against your real Google
Calendar, saved to Supabase, and Google emails both of you a calendar invite
with a Meet link.

## Status

Google Calendar **is connected and fully working** — verified end to end on
22 Sep 2026:

- a booking creates the event, attaches a Meet link and sends a real invite to
  an external guest address
- the token carries both scopes, so `freeBusy` works: a meeting made anywhere
  else blocks its slot on the site, and a meeting that only partly overlaps a
  slot still blocks it

If Calendar is ever unconfigured, everything else still works — bookings save
and appear in the dashboard, and the confirmation says so honestly rather than
promising an invite that isn't coming.

## First-time setup

### 1. Google Cloud Console

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com).
2. **APIs & Services → Library** → enable **Google Calendar API**.
3. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - App name, your email for support and developer contact
   - Add yourself under **Test users**
   - **Then click "PUBLISH APP".** Left in *Testing*, Google expires your
     refresh token after **seven days** and bookings silently stop reaching
     your calendar. Publishing makes it permanent. The app only ever requests
     calendar access for your own account, so the "unverified app" warning
     appears once, on your own consent screen, and nowhere else.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Type: **Web application**
   - Authorised redirect URI: `http://localhost:53682/callback` (exact)

### 2. Put the client credentials in `.env`

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### 3. Get the refresh token

```bash
npm run setup:google
```

Opens Google's consent screen, catches the redirect, prints your refresh token.
Nothing is written to disk and nothing leaves your machine except to Google.
Paste the line it gives you into `.env`:

```
GOOGLE_REFRESH_TOKEN=...
GOOGLE_CALENDAR_ID=you@example.com   # optional; defaults to your primary
```

Restart `npm run dev`, book a test call, and the invite should land in both
inboxes.

### Scopes

The script requests two, and both matter:

| Scope | For |
|---|---|
| `calendar.events` | Create the booking and invite the guest |
| `calendar.readonly` | Query `freeBusy`, so the site won't offer a slot you're already busy in |

`calendar.events` alone does **not** cover `freeBusy` — Google answers 403 and
availability silently stops respecting anything already on your calendar. If
you authorised before this was fixed, re-run `npm run setup:google`. You'll see
`[booking] freeBusy unavailable (403)` in the server log if the token is short
a scope.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Browser client (no longer touches bookings) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-side booking writes. **Never expose.** |
| `GOOGLE_CLIENT_ID` | for invites | OAuth client |
| `GOOGLE_CLIENT_SECRET` | for invites | OAuth client |
| `GOOGLE_REFRESH_TOKEN` | for invites | From `npm run setup:google` |
| `GOOGLE_CALENDAR_ID` | no | Defaults to `primary` |

## Changing your availability

One file: [`src/lib/booking/availability.ts`](../src/lib/booking/availability.ts).
The UI, the API and the calendar event all derive from it, so they can't disagree.

```ts
HOST_TIMEZONE      = "Asia/Karachi"   // hours below are in this zone
SLOT_MINUTES       = 30               // call length and slot grid
WORKING_DAYS       = [1,2,3,4,5]      // 0 = Sunday
WORK_START_HOUR    = 10               // first slot 10:00
WORK_END_HOUR      = 18               // last start 17:30 for a 30m call
MIN_NOTICE_MINUTES = 4 * 60           // no booking inside 4 hours
MAX_DAYS_AHEAD     = 21               // how far the calendar opens
```

Slots are stored as real instants (`timestamptz`), so a visitor in London and
you in Karachi always mean the same moment. The modal shows each visitor their
own timezone, plus yours underneath when they differ.

## How it fits together

```
/book  →  GET  /api/bookings/availability   free slots
                 ├─ generateSlots()          from availability.ts
                 ├─ minus rows in Supabase   already booked here
                 └─ minus Google freeBusy    busy anywhere else

       →  POST /api/bookings                 create
                 ├─ re-validates the slot    never trusts the client
                 ├─ INSERT                   unique index = no double-booking
                 └─ Google Calendar insert   sends the invite + Meet link
```

## Notes for later

- **Double-booking is enforced by the database**, not by application code — a
  partial unique index on `starts_at`. A race surfaces as `23505`, which the
  API turns into a 409. Don't move that rule into JavaScript.
- **The browser has no access to the `bookings` table.** RLS denies `anon`
  entirely and the grants are revoked; all writes go through the API with the
  service role. Admins read and update via the dashboard under an RLS policy
  keyed on `app_metadata.role`.
- **Legacy columns** `booking_date` and `booking_time` are still written so the
  admin dashboard keeps rendering. Once it reads `starts_at`, drop both columns
  and the lines that populate them in `src/app/api/bookings/route.ts`.
- **Two pre-migration rows** have `starts_at = NULL`. Their old `booking_date`
  was a page-load millisecond timestamp and `booking_time` a zoneless string,
  so any instant derived from them would be a guess. Left alone deliberately.
- **Cancelling**: `cancelCalendarEvent()` exists in
  `src/lib/booking/googleCalendar.ts` but nothing calls it yet. Wiring it to the
  dashboard's "cancelled" status would free the slot and notify the guest.
