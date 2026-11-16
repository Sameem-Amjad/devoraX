/* The columns of a booking that the owner sets, not the visitor: whether the
 * lead came through a new channel, whether the call was qualified and why,
 * the first paid step it led to, and its channel. They were set in the
 * Supabase table editor until the admin dashboard gained the controls
 * (20261107120000_bookings_lead_tracking.sql describes the columns).
 *
 * Plain data and one validator, so the dashboard's controls and the server
 * action that saves them agree on what a value may be. The action runs on a
 * public endpoint, so it does not trust the dashboard to have checked.
 *
 * null means "not assessed yet" and is always a valid value: the owner can
 * clear any of them, and the dashboard's report counts only what is set.
 */

import { OFFER_LADDER, type OfferStepId } from "@/data/offer";
import { isLeadChannel, type LeadChannel } from "./attribution";
import { cleanText } from "./brief";

/** The steps first_step_paid can name: every rung of the offer ladder that
 *  costs something, so the free call is not one. Read from the ladder, so a
 *  step added there appears here. */
export const FIRST_STEPS = OFFER_LADDER.filter((step) => step.id !== "call");

const FIRST_STEP_IDS: readonly string[] = FIRST_STEPS.map((step) => step.id);

export const isFirstStep = (value: unknown): value is OfferStepId =>
  typeof value === "string" && FIRST_STEP_IDS.includes(value);

/** The step's title for a stored id, or null when there is none. */
export const firstStepLabel = (value: unknown): string | null =>
  FIRST_STEPS.find((step) => step.id === value)?.title ?? null;

/** Limit for qualified_note, in characters. The column has no check, so this
 *  is the only bound. */
export const MAX_QUALIFIED_NOTE = 300;

/** The columns, each optional: a key that is present is saved, null clears it. */
export type LeadPatch = {
  new_channel?: boolean | null;
  qualified?: boolean | null;
  qualified_note?: string | null;
  first_step_paid?: OfferStepId | null;
  lead_channel?: LeadChannel | null;
};

const isBooleanOrNull = (value: unknown): value is boolean | null =>
  value === null || typeof value === "boolean";

/**
 * A patch as the database may take it, or the reason it may not. Keys this
 * file does not know are ignored; a known key with a value it does not allow
 * fails the whole patch, so nothing is saved half-way. A note is cleaned the
 * way the booking form's text answers are (one line, trimmed, cut to the
 * limit), and one with nothing left becomes null.
 */
export function cleanLeadPatch(input: unknown): { patch: LeadPatch } | { error: string } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { error: "Nothing to save" };
  }
  const given = input as Record<string, unknown>;
  const patch: LeadPatch = {};

  if (given.new_channel !== undefined) {
    if (!isBooleanOrNull(given.new_channel)) return { error: "That value isn't allowed for new channel" };
    patch.new_channel = given.new_channel;
  }
  if (given.qualified !== undefined) {
    if (!isBooleanOrNull(given.qualified)) return { error: "That value isn't allowed for qualified" };
    patch.qualified = given.qualified;
  }
  if (given.qualified_note !== undefined) {
    if (given.qualified_note !== null && typeof given.qualified_note !== "string") {
      return { error: "That value isn't allowed for the note" };
    }
    patch.qualified_note = cleanText(given.qualified_note, MAX_QUALIFIED_NOTE);
  }
  if (given.first_step_paid !== undefined) {
    if (given.first_step_paid !== null && !isFirstStep(given.first_step_paid)) {
      return { error: "That value isn't allowed for the first step paid" };
    }
    patch.first_step_paid = given.first_step_paid;
  }
  if (given.lead_channel !== undefined) {
    if (given.lead_channel !== null && !isLeadChannel(given.lead_channel)) {
      return { error: "That value isn't allowed for the channel" };
    }
    patch.lead_channel = given.lead_channel;
  }

  return Object.keys(patch).length ? { patch } : { error: "Nothing to save" };
}
