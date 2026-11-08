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
WORK_WINDOWS       = [                // a call must fit inside one window
  { start: 10, end: 18 },             //   10:00 to 18:00, last start 17:30
  { start: 19, end: 23 },             //   19:00 to 23:00, last start 22:30
]
MIN_NOTICE_MINUTES = 4 * 60           // no booking inside 4 hours
MAX_DAYS_AHEAD     = 21               // how far the calendar opens
```

The evening window is for founders in the Americas: 19:00 to 23:00 in Karachi
is 9 am to 1 pm US Eastern (10 am to 2 pm while the US is on daylight saving
time). Two places state the hours in words and must change with the windows:
`BRAND_FACTS.callHours` in `src/data/brand.ts` (shown on /book, /contact,
/about and /press) and the time-zone answer in `src/data/terms.ts`. The
Organization schema's `hoursAvailable` in the root layout is generated from
`WORK_WINDOWS`, so it follows on its own.

Slots are stored as real instants (`timestamptz`), so a visitor in London and
you in Karachi always mean the same moment. The modal shows each visitor their
own timezone, plus yours underneath when they differ.

### What the visitor sees

- **Waking hours first.** A day lists its slots that start from 7 am up to
  10 pm in the visitor's time first. The rest sit behind a "Show N more times,
  before 7 am or from 10 pm your time" button: in US Eastern winter time the
  10:00 to 18:00 window falls between midnight and 8 am. A day with no slot in
  those hours shows every slot.
- **The day it opens on** is the first day with a slot in those hours, not
  simply the first day. In US winter time, from Friday morning to Sunday
  evening, a US Central visitor's first day is Sunday with 11 pm only, so they
  land on Monday; Sydney on a Friday evening lands on Monday rather than a
  Saturday of small-hours slots. Los Angeles opens on Sunday, because its 9 pm
  and 9:30 pm slots count. With no such day at all, it opens on the first day.
- **No hidden selection.** Collapsing the list clears a time picked from it,
  and changing the day clears the time and collapses the list, so the form
  never confirms a time that is not on screen.
- **Layout.** The dialog's body is as tall as the screen allows (up to 46rem;
  the screen's height less 10rem), shows its scrollbar, and fades along its
  bottom edge while there is more below. From 375px wide the times sit four to
  a row. On a full day the name field shows without scrolling at 1440x900,
  1366x768 and 390x844, and the whole dialog fits a 320x568 phone and a
  landscape one.

### Time format

Every booking time is formatted with `hourCycle: "h12"`, never `hour12: true`.
With `hour12` the runtime chooses the 12-hour cycle, and Node 20 chooses h11,
which prints 12:30 pm as "0:30 pm". This covers the modal, `formatSlot()` (the
legacy `booking_time` column) and the invite's "Their local time" line. A
booking saved before this fix by a runtime that chooses h11 can show a noon
slot as "0:00 pm" or "0:30 pm" in `booking_time`; its `starts_at` is right.

The invite's title and first line ("Free 30-minute call") take the length from
`SLOT_MINUTES`. The site's pages say "free 30-minute call" in their own copy,
so change those with it.

## What a booking records

Besides the name, email, time and optional message, each booking stores where
it came from and the visitor's optional brief. Everything here is optional,
and anything malformed is saved as null rather than failing the booking.

| Column | What it holds | Set by |
|---|---|---|
| `heard_about` | "How did you hear about us?" (keys in `src/lib/booking/attribution.ts`) | the form |
| `booked_from` | The page the booking came from: a `/book?from=` value turned into its path, else the page on this site the visitor was on before `/book`, else the page the form is on | the browser |
| `referrer_host` | The site that sent the visitor, hostname only | the browser |
| `landing_path` | The first page of the visit, sent only if the visitor accepted analytics | the browser |
| `lead_channel` | The profile a tagged link came from (`/book?from=linkedin`), or a channel you set by hand | the link, or you |
| `app_link`, `built_with`, `deadline` | The optional brief, folded under "Add details about your app" | the form |
| `qualified`, `qualified_note`, `first_step_paid` | Your assessment after the call, and the first paid step bought | you, in the Supabase table editor |
| `new_channel`, `developer_account`, `sharetribe_plan`, `sharetribe_need` | Whether the lead came through a new channel (set at first contact); the kind of App Store and Google Play developer account the founder has (`none`, `personal` or `organisation`; an organisation needs a D-U-N-S Number); and, for a Sharetribe marketplace, its plan and what it needs built. The form doesn't ask for these, and the API never sends them | you, in the Supabase table editor |

**Tagged links.** `/book?from=` accepts a page's own name (any solution or
insight slug, `home`, `pricing`, `services`, or a project id such as `34`) and
records that page as `booked_from`; or a profile (`sharetribe-experts`,
`contra`, `clutch`, `linkedin`, `upwork`), recorded as `lead_channel`. Anything
else is ignored. Put the profile links on the profiles themselves, for example
`https://thedevorax.tech/book?from=linkedin`.

**Before deploying,** apply `supabase/migrations/20261107120000_bookings_lead_tracking.sql`
with `supabase db push --linked`. If the code goes out first, `/api/bookings`
still saves every booking, in three tiers, and logs the tier it fell back to:
everything; then the booking with `heard_about`, `booked_from` and
`referrer_host` (`[booking] saving bookings without the lead tracking fields`);
then the booking alone (`[booking] saving bookings without attribution`). After
each deploy, book one test call per door page, delete it, and check the Vercel
logs for either line.

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
