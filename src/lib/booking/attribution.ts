/* "How did you hear about us?", the booking form's optional question, and the
 * one list of its answers; the lead channels, the profiles a tagged booking
 * link (/book?from=linkedin) can come from; and what a ?from= value means.
 *
 * Asked because analytics can't see most of what it is for: someone who read
 * about DevoraX in ChatGPT tends to arrive by typing the address or searching
 * the name, so their visit counts as Direct or Google. Asking is the most
 * reliable single signal of AI-assistant influence available.
 *
 * Plain data, so the modal, /book and /api/bookings share it. The keys are
 * what the database stores, and check constraints list the same ones:
 * heard_about in supabase/migrations/20261014120000_bookings_attribution.sql,
 * extended by 20261107120000_bookings_lead_tracking.sql, which also holds
 * lead_channel's. A new answer or channel needs a migration as well as a line
 * here.
 *
 * Apply 20261107120000 before deploying code that sends the newer answers or
 * fields. If it is not applied yet, /api/bookings falls back rather than fail
 * the booking: it saves the booking with the older attribution (an answer the
 * old check refuses is saved as null), failing that the booking alone, and
 * logs which tier fired.
 */

/** Key → label, in the order the form lists them. */
export const HEARD_ABOUT = {
  search: "Google or another search engine",
  ai_assistant: "ChatGPT, Claude, Perplexity or another AI assistant",
  fiverr: "Fiverr",
  upwork: "Upwork",
  contra: "Contra",
  linkedin: "LinkedIn",
  community: "Reddit, a forum or a community",
  directory: "A directory, such as Sharetribe Experts or Clutch",
  referral: "A recommendation",
  other: "Somewhere else",
} as const;

export type HeardAbout = keyof typeof HEARD_ABOUT;

export const HEARD_ABOUT_KEYS = Object.keys(HEARD_ABOUT) as HeardAbout[];

/** The answers 20261014120000's check allows. If the API has to fall back to
 *  that schema, any newer answer is saved as null rather than costing the
 *  booking its page and referrer too. */
export const HEARD_ABOUT_V1: readonly HeardAbout[] = [
  "search",
  "ai_assistant",
  "fiverr",
  "linkedin",
  "referral",
  "other",
];

// An own-property check, not `in`: "toString" in HEARD_ABOUT is true.
export const isHeardAbout = (value: unknown): value is HeardAbout =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(HEARD_ABOUT, value);

/** The label for a stored answer, or null when there is none. */
export const heardAboutLabel = (value: unknown): string | null =>
  isHeardAbout(value) ? HEARD_ABOUT[value] : null;

/**
 * Where a lead came from, as bookings.lead_channel stores it. A booking link
 * on one of the studio's profiles sets it (LINK_CHANNELS); the owner tags the
 * rest by hand at first contact, which is why the list is longer.
 */
export const LEAD_CHANNELS = [
  "sharetribe-experts",
  "contra",
  "clutch",
  "linkedin",
  "upwork",
  "fiverr",
  "community",
  "directory",
] as const;

export type LeadChannel = (typeof LEAD_CHANNELS)[number];

const LEAD_CHANNEL_LABELS: Record<LeadChannel, string> = {
  "sharetribe-experts": "Sharetribe Experts",
  contra: "Contra",
  clutch: "Clutch",
  linkedin: "LinkedIn",
  upwork: "Upwork",
  fiverr: "Fiverr",
  community: "A community",
  directory: "A directory",
};

export const isLeadChannel = (value: unknown): value is LeadChannel =>
  typeof value === "string" && (LEAD_CHANNELS as readonly string[]).includes(value);

/** The label for a stored channel, or null when there is none. */
export const leadChannelLabel = (value: unknown): string | null =>
  isLeadChannel(value) ? LEAD_CHANNEL_LABELS[value] : null;

/** The channels a booking link can carry: /book?from=contra and so on. */
export const LINK_CHANNELS: readonly LeadChannel[] = [
  "sharetribe-experts",
  "contra",
  "clutch",
  "linkedin",
  "upwork",
];

export const isLinkChannel = (value: unknown): value is LeadChannel =>
  typeof value === "string" && (LINK_CHANNELS as readonly string[]).includes(value);

/** The slugs /book?from= can name, read on the server from the page data. */
export type BookingPages = { solutions: readonly string[]; insights: readonly string[] };

// Pages with a booking link that have no slug to name them by.
const FIXED_PAGES: Record<string, string> = {
  home: "/",
  pricing: "/pricing",
  services: "/services",
};

/**
 * What a /book?from= value says: the page the booking link was on, as the
 * path the booking stores in booked_from, or the profile it was on, as a lead
 * channel. Anything else says nothing, including the slug of a page that does
 * not exist: the value comes from a URL anyone can edit, so only names this
 * site uses are trusted.
 */
export function resolveBookingLink(
  from: string | null | undefined,
  pages: BookingPages
): { bookedFrom?: string; leadChannel?: LeadChannel } {
  const value = from?.trim().toLowerCase();
  if (!value) return {};
  if (isLinkChannel(value)) return { leadChannel: value };
  if (Object.prototype.hasOwnProperty.call(FIXED_PAGES, value)) {
    return { bookedFrom: FIXED_PAGES[value] };
  }
  // A project's id: its page is /projects/{id}.
  if (/^\d{1,9}$/.test(value)) return { bookedFrom: `/projects/${Number(value)}` };
  if (pages.solutions.includes(value)) return { bookedFrom: `/solutions/${value}` };
  if (pages.insights.includes(value)) return { bookedFrom: `/insights/${value}` };
  return {};
}
