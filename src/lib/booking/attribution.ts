/* "How did you hear about us?", the booking form's optional question, and the
 * one list of its answers.
 *
 * Asked because analytics can't see most of what it is for: someone who read
 * about DevoraX in ChatGPT tends to arrive by typing the address or searching
 * the name, so their visit counts as Direct or Google. Asking is the most
 * reliable single signal of AI-assistant influence available.
 *
 * Plain data, so the modal and /api/bookings share it. The keys are what the
 * database stores, and the check constraint in
 * supabase/migrations/20261014120000_bookings_attribution.sql lists the same
 * ones: a new answer needs a migration as well as a line here.
 */

/** Key → label, in the order the form lists them. */
export const HEARD_ABOUT = {
  search: "Google or another search engine",
  ai_assistant: "ChatGPT, Claude, Perplexity or another AI assistant",
  fiverr: "Fiverr",
  linkedin: "LinkedIn",
  referral: "A recommendation",
  other: "Somewhere else",
} as const;

export type HeardAbout = keyof typeof HEARD_ABOUT;

export const HEARD_ABOUT_KEYS = Object.keys(HEARD_ABOUT) as HeardAbout[];

// An own-property check, not `in`: "toString" in HEARD_ABOUT is true.
export const isHeardAbout = (value: unknown): value is HeardAbout =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(HEARD_ABOUT, value);

/** The label for a stored answer, or null when there is none. */
export const heardAboutLabel = (value: unknown): string | null =>
  isHeardAbout(value) ? HEARD_ABOUT[value] : null;
