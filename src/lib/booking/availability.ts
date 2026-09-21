/* When calls can be booked.
 *
 * This is the one file to edit to change your schedule — the UI, the API and
 * the Google Calendar event all derive from it, so they cannot disagree.
 *
 * Everything here is expressed in HOST_TIMEZONE (your local time). Slots are
 * converted to real instants before they touch the database, which stores
 * timestamptz — so a visitor in London and you in Karachi are always talking
 * about the same moment, whatever each of you sees on screen.
 */

/** IANA zone the working hours below are written in. */
export const HOST_TIMEZONE = "Asia/Karachi";

/** Length of a call. Also the slot grid: 30 => :00 and :30. */
export const SLOT_MINUTES = 30;

/** Days bookable, 0 = Sunday. Default: Monday–Friday. */
export const WORKING_DAYS = [1, 2, 3, 4, 5];

/** Working window in HOST_TIMEZONE, 24h. A call must start AND end inside it. */
export const WORK_START_HOUR = 10; // 10:00
export const WORK_END_HOUR = 18; // 18:00 — last start is 17:30 for a 30m call

/** Don't let someone book a call starting in ten minutes. */
export const MIN_NOTICE_MINUTES = 4 * 60;

/** How far ahead the calendar opens. */
export const MAX_DAYS_AHEAD = 21;

/* ── Timezone helpers ──────────────────────────────────────────
   Done with Intl rather than a date library: Node and every browser ship a
   full IANA database, so this handles DST transitions correctly without
   adding a dependency. */

/** The wall-clock fields an instant shows in `tz`. */
export const partsInZone = (instant: Date, tz: string) => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
  });
  const out: Record<string, string> = {};
  for (const p of fmt.formatToParts(instant)) {
    if (p.type !== "literal") out[p.type] = p.value;
  }
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    year: +out.year,
    month: +out.month,
    day: +out.day,
    // Intl gives "24" for midnight under hour12:false; normalise to 0.
    hour: +out.hour % 24,
    minute: +out.minute,
    second: +out.second,
    weekday: DAYS.indexOf(out.weekday),
  };
};

/** How far `tz` is from UTC at a given instant, in minutes. */
const offsetMinutes = (instant: Date, tz: string) => {
  const p = partsInZone(instant, tz);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return (asUTC - Math.floor(instant.getTime() / 1000) * 1000) / 60000;
};

/**
 * The instant at which `tz` shows the given wall-clock time.
 *
 * Applied twice on purpose: the first guess uses the offset at the UTC
 * interpretation of those fields, which is wrong if the guess lands on the
 * far side of a DST change. Re-deriving from the corrected instant settles
 * it — one iteration is enough for every real-world zone.
 */
export const zonedTimeToInstant = (
  tz: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0
) => {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  let instant = new Date(naive - offsetMinutes(new Date(naive), tz) * 60000);
  instant = new Date(naive - offsetMinutes(instant, tz) * 60000);
  return instant;
};

/* ── Slot generation ─────────────────────────────────────────── */

/** True when `instant` starts a legal slot: right grid, working day, in hours. */
export const isBookableSlot = (instant: Date, now = new Date()) => {
  if (Number.isNaN(instant.getTime())) return false;

  const minsFromNow = (instant.getTime() - now.getTime()) / 60000;
  if (minsFromNow < MIN_NOTICE_MINUTES) return false;
  if (minsFromNow > MAX_DAYS_AHEAD * 24 * 60) return false;

  const p = partsInZone(instant, HOST_TIMEZONE);
  if (!WORKING_DAYS.includes(p.weekday)) return false;
  if (p.second !== 0 || p.minute % SLOT_MINUTES !== 0) return false;

  // The whole call must fit inside the working window, not just its start.
  const startMin = p.hour * 60 + p.minute;
  return startMin >= WORK_START_HOUR * 60 && startMin + SLOT_MINUTES <= WORK_END_HOUR * 60;
};

/** Every bookable slot in the window, ascending. Availability is taken out later. */
export const generateSlots = (now = new Date()): Date[] => {
  const slots: Date[] = [];
  const perDay = ((WORK_END_HOUR - WORK_START_HOUR) * 60) / SLOT_MINUTES;

  for (let dayOffset = 0; dayOffset <= MAX_DAYS_AHEAD; dayOffset++) {
    // Step through days in HOST_TIMEZONE, not UTC, so a day never shifts.
    const probe = new Date(now.getTime() + dayOffset * 86400000);
    const d = partsInZone(probe, HOST_TIMEZONE);
    if (!WORKING_DAYS.includes(d.weekday)) continue;

    for (let i = 0; i < perDay; i++) {
      const mins = WORK_START_HOUR * 60 + i * SLOT_MINUTES;
      const slot = zonedTimeToInstant(
        HOST_TIMEZONE,
        d.year,
        d.month,
        d.day,
        Math.floor(mins / 60),
        mins % 60
      );
      if (isBookableSlot(slot, now)) slots.push(slot);
    }
  }
  return slots.sort((a, b) => a.getTime() - b.getTime());
};

/** "Tue 23 Sep, 3:00 PM PKT" — for emails and the calendar event body. */
export const formatSlot = (instant: Date, tz: string = HOST_TIMEZONE) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(instant);
