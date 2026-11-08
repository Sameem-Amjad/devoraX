/* The booking form's optional brief: a link to the app, what it was built
 * with, and the deadline. None is required, and the form asks for nothing
 * else, so it stays short.
 *
 * Asked because the first question on a call is usually "what is it, and
 * where is it now?". A link and the tool it was built with answer that before
 * the call starts, and a deadline says how much the timing matters.
 *
 * Plain data, so the modal and /api/bookings share it. The keys of BUILT_WITH
 * are what bookings.built_with stores. The database only bounds the column's
 * length (20261107120000_bookings_lead_tracking.sql), so adding an option here
 * needs no migration.
 */

/** Key → label, in the order the form lists them. */
export const BUILT_WITH = {
  lovable: "Lovable",
  base44: "Base44",
  replit: "Replit",
  bolt: "Bolt",
  cursor: "Cursor",
  sharetribe: "Sharetribe",
  custom: "Custom code",
  other: "Other",
} as const;

export type BuiltWith = keyof typeof BUILT_WITH;

export const BUILT_WITH_KEYS = Object.keys(BUILT_WITH) as BuiltWith[];

// An own-property check, not `in`: "toString" in BUILT_WITH is true.
export const isBuiltWith = (value: unknown): value is BuiltWith =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(BUILT_WITH, value);

/** The label for a stored answer, or null when there is none. */
export const builtWithLabel = (value: unknown): string | null =>
  isBuiltWith(value) ? BUILT_WITH[value] : null;

/** Limits, in characters. The migration's checks hold the same ones. */
export const MAX_APP_LINK = 500;
export const MAX_DEADLINE = 100;

/**
 * A free-text answer as it is stored: one line, trimmed, cut to `max`
 * characters, or null when nothing is left. Kept as typed rather than
 * validated: "not live yet" in the link field still tells us something, and
 * none of it is worth failing a booking over. Cut by code point, so an emoji
 * at the limit is never split in half; control characters become spaces.
 */
export const cleanText = (value: unknown, max: number): string | null => {
  if (typeof value !== "string") return null;
  const text = value.replace(/[\s\p{Cc}]+/gu, " ").trim();
  if (!text) return null;
  return Array.from(text).slice(0, max).join("").trim();
};

/**
 * A stored app link as an address the dashboard can open, or null when it is
 * not one. Only http and https: the value was typed by a visitor, and a
 * javascript: link must never become a clickable href. "myapp.com", as people
 * often type it, opens as https.
 */
export const appLinkHref = (value: unknown): string | null => {
  if (typeof value !== "string" || /\s/.test(value)) return null;
  const candidate = /^https?:\/\//i.test(value)
    ? value
    : /^[a-z0-9-]+(\.[a-z0-9-]+)+(?:[/?#]\S*)?$/i.test(value)
      ? `https://${value}`
      : null;
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
};
