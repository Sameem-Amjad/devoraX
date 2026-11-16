/* The booking form's optional brief: a link to the app, what it was built
 * with, the kind of App Store and Google Play developer account the founder
 * has, and the deadline; and, for an app built with Sharetribe, its plan and
 * what it needs built. None is required, so the form a visitor sees first is
 * no longer than it was.
 *
 * Asked because the first question on a call is usually "what is it, and
 * where is it now?". A link and the tool it was built with answer that before
 * the call starts, a deadline says how much the timing matters, and the
 * developer account is the wait that can start before the call does.
 *
 * Plain data, so the modal and /api/bookings share it. The keys of BUILT_WITH
 * are what bookings.built_with stores. The database only bounds the column's
 * length (20261107120000_bookings_lead_tracking.sql), so adding an option here
 * needs no migration. The keys of DEVELOPER_ACCOUNT are the opposite: that
 * migration's check lists them, so a new one needs a migration as well as a
 * line here.
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

/** The answer that asks for the two Sharetribe questions. */
export const BUILT_WITH_SHARETRIBE = "sharetribe" satisfies BuiltWith;

/** Key → label for the founder's App Store and Google Play developer account,
 *  in the order the form lists them. The keys are what
 *  bookings.developer_account stores, and the migration's check lists the same
 *  three. */
export const DEVELOPER_ACCOUNT = {
  none: "No developer account yet",
  personal: "A personal account",
  organisation: "An organisation account",
} as const;

export type DeveloperAccount = keyof typeof DEVELOPER_ACCOUNT;

export const DEVELOPER_ACCOUNT_KEYS = Object.keys(DEVELOPER_ACCOUNT) as DeveloperAccount[];

// An own-property check, not `in`: "toString" in DEVELOPER_ACCOUNT is true.
export const isDeveloperAccount = (value: unknown): value is DeveloperAccount =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(DEVELOPER_ACCOUNT, value);

/** The label for a stored answer, or null when there is none. */
export const developerAccountLabel = (value: unknown): string | null =>
  isDeveloperAccount(value) ? DEVELOPER_ACCOUNT[value] : null;

/** Limits, in characters. The migration's checks hold the same ones. */
export const MAX_APP_LINK = 500;
export const MAX_DEADLINE = 100;
export const MAX_SHARETRIBE_PLAN = 40;
export const MAX_SHARETRIBE_NEED = 500;

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
