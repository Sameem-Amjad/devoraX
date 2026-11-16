/* The dashboard's report of bookings by channel, worked out from the rows it
 * has already loaded.
 *
 * A booking's channel is lead_channel, the profile a tagged link came from or
 * one the owner set, and failing that the answer to "How did you hear about
 * us?". The two share keys where they name the same place (linkedin, contra,
 * upwork, fiverr, community, directory), so those land in one row. Pure, so it
 * can be checked without a browser.
 */

import {
  heardAboutLabel,
  isLeadChannel,
  leadChannelLabel,
} from "./attribution";

/** The booking columns the report reads. Rows from before a migration lack
 *  some of them, which counts the same as null. */
export type ReportedBooking = {
  lead_channel?: string | null;
  heard_about?: string | null;
  qualified?: boolean | null;
  new_channel?: boolean | null;
  first_step_paid?: string | null;
};

export type ChannelRow = {
  /** The stored key, or null for bookings with no channel and no answer. */
  key: string | null;
  label: string;
  bookings: number;
  qualified: number;
  /** Qualified, and flagged as coming through a new channel. */
  qualifiedNew: number;
  firstStepPaid: number;
};

const blank = (key: string | null, label: string): ChannelRow => ({
  key,
  label,
  bookings: 0,
  qualified: 0,
  qualifiedNew: 0,
  firstStepPaid: 0,
});

const present = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

/** The key a booking is grouped under. */
export const channelKey = (b: ReportedBooking): string | null =>
  present(b.lead_channel) ? b.lead_channel : present(b.heard_about) ? b.heard_about : null;

// A channel's own short label first ("A directory"), then the form's longer
// answer, then the key as stored: one this build has no label for is shown,
// not hidden.
const channelLabel = (key: string | null): string => {
  if (key === null) return "Not said";
  return (isLeadChannel(key) ? leadChannelLabel(key) : null) ?? heardAboutLabel(key) ?? key;
};

/** One row per channel, the busiest first with "Not said" last, and the
 *  totals across all of them. */
export function channelReport(bookings: readonly ReportedBooking[]): {
  rows: ChannelRow[];
  total: ChannelRow;
} {
  const byKey = new Map<string | null, ChannelRow>();
  const total = blank(null, "All bookings");

  for (const b of bookings) {
    const key = channelKey(b);
    let row = byKey.get(key);
    if (!row) {
      row = blank(key, channelLabel(key));
      byKey.set(key, row);
    }
    for (const target of [row, total]) {
      target.bookings += 1;
      if (b.qualified === true) {
        target.qualified += 1;
        if (b.new_channel === true) target.qualifiedNew += 1;
      }
      if (present(b.first_step_paid)) target.firstStepPaid += 1;
    }
  }

  const rows = [...byKey.values()].sort((a, b) => {
    if ((a.key === null) !== (b.key === null)) return a.key === null ? 1 : -1;
    return b.bookings - a.bookings || a.label.localeCompare(b.label);
  });
  return { rows, total };
}
