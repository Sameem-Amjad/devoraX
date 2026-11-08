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

/**
 * Bookable windows on every working day, in HOST_TIMEZONE hours (24h; 9.5 is
 * 09:30). A call must start AND end inside one window, so the last start in
 * each is SLOT_MINUTES before its end. Windows must not overlap or cross
 * midnight.
 *
 * The evening window is for founders in the Americas: 19:00 to 23:00 in
 * Karachi is 9 am to 1 pm in New York (10 am to 2 pm while the US is on
 * daylight saving time). BRAND_FACTS.callHours in data/brand.ts states these
 * hours in words; change both together.
 */
export const WORK_WINDOWS: readonly { start: number; end: number }[] = [
  { start: 10, end: 18 }, // 10:00 to 18:00, last start 17:30
  { start: 19, end: 23 }, // 19:00 to 23:00, last start 22:30
];

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

const pad2 = (n: number) => String(n).padStart(2, "0");

/** HOST_TIMEZONE's UTC offset as schema.org writes it, e.g. "+05:00". */
export const hostUtcOffset = (at = new Date()) => {
  const mins = offsetMinutes(at, HOST_TIMEZONE);
  const abs = Math.abs(mins);
  return `${mins < 0 ? "-" : "+"}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
};

/** A window hour (9.5 = 09:30) as "09:30:00", the form schema.org times take. */
export const clockTime = (hour: number) => {
  const mins = Math.round(hour * 60);
  return `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}:00`;
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

/** True when a call starting `startMin` minutes after midnight (host time)
 *  fits inside one window: its start and its end, not just its start. */
const fitsAWindow = (startMin: number) =>
  WORK_WINDOWS.some((w) => startMin >= w.start * 60 && startMin + SLOT_MINUTES <= w.end * 60);

/** True when `instant` starts a legal slot: right grid, working day, in hours. */
export const isBookableSlot = (instant: Date, now = new Date()) => {
  if (Number.isNaN(instant.getTime())) return false;

  const minsFromNow = (instant.getTime() - now.getTime()) / 60000;
  if (minsFromNow < MIN_NOTICE_MINUTES) return false;
  if (minsFromNow > MAX_DAYS_AHEAD * 24 * 60) return false;

  const p = partsInZone(instant, HOST_TIMEZONE);
  if (!WORKING_DAYS.includes(p.weekday)) return false;
  if (p.second !== 0 || p.minute % SLOT_MINUTES !== 0) return false;

  return fitsAWindow(p.hour * 60 + p.minute);
};

/** Every bookable slot in the horizon, ascending. Availability is taken out later. */
export const generateSlots = (now = new Date()): Date[] => {
  const slots: Date[] = [];

  for (let dayOffset = 0; dayOffset <= MAX_DAYS_AHEAD; dayOffset++) {
    // Step through days in HOST_TIMEZONE, not UTC, so a day never shifts.
    const probe = new Date(now.getTime() + dayOffset * 86400000);
    const d = partsInZone(probe, HOST_TIMEZONE);
    if (!WORKING_DAYS.includes(d.weekday)) continue;

    // Every start on the day's grid that fits a window. Walking the whole day
    // rather than each window keeps the slots in order and never lists one
    // twice.
    for (let mins = 0; mins + SLOT_MINUTES <= 24 * 60; mins += SLOT_MINUTES) {
      if (!fitsAWindow(mins)) continue;
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

/** "Tue 23 Sep, 3:00 pm GMT+5": the bookings table's booking_time and the
 *  calendar event body. hourCycle "h12", not hour12: true, which lets the
 *  runtime pick h11, where 12:30 pm prints as "0:30 pm" (Node 20 does). */
export const formatSlot = (instant: Date, tz: string = HOST_TIMEZONE) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
    timeZoneName: "short",
  }).format(instant);
