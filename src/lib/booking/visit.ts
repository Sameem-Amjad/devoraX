/* What a booking can say about the visit that led to it, gathered in the
 * browser. VisitTracker (components/ui/visitTracker.tsx) feeds it from the
 * root layout on every route change; the booking modal reads it when the form
 * is sent.
 *
 * - The page before /book. A booking link without ?from= (the header's "Book
 *   a Call", for one) would otherwise record every booking as made on /book,
 *   which says nothing about the page that sent the visitor there.
 * - The first page of the visit, sent as landing_path. First-touch data kept
 *   on the device needs consent, so it reaches sessionStorage only once the
 *   visitor has accepted analytics (readConsent() === "granted") and is
 *   removed if they decline. Until then it stays in memory, so accepting on
 *   the third page still records the page the visit began on.
 * - The profile a tagged booking link came from (/book?from=linkedin), kept
 *   for the rest of the page load so a visitor who looks around before
 *   booking keeps it.
 *
 * Everything except the stored landing path lives in module memory: like
 * document.referrer, it is never written to the device and is gone when the
 * tab is. Browser-only; nothing here runs on the server.
 */

import { analyticsEnabled, isUnmeasuredPage, readConsent } from "@/lib/analytics";
import type { LeadChannel } from "./attribution";

/** sessionStorage key for the landing path. The privacy page names it. */
export const LANDING_PATH_KEY = "devorax-landing-path";

let current: string | null = null;
let previous: string | null = null;
let landing: string | null = null;
let channel: LeadChannel | null = null;

/* The path of an address on this site, or null for anywhere else. */
const ownPath = (address: string): string | null => {
  try {
    const url = new URL(address);
    return url.origin === window.location.origin ? url.pathname : null;
  } catch {
    return null;
  }
};

/* Consent as the analytics banner records it, in a build that has a banner. */
const consented = () =>
  analyticsEnabled && !isUnmeasuredPage() && readConsent() === "granted";

/** Store or remove the landing path to match the visitor's answer to the banner. */
export function syncLandingPath(): void {
  try {
    if (!consented()) {
      window.sessionStorage.removeItem(LANDING_PATH_KEY);
      return;
    }
    // The first page of the tab's session wins: a reload or a later page load
    // in the same tab does not overwrite it.
    if (landing && !window.sessionStorage.getItem(LANDING_PATH_KEY)) {
      window.sessionStorage.setItem(LANDING_PATH_KEY, landing);
    }
  } catch {
    /* storage blocked: the booking goes without a landing path */
  }
}

/**
 * Record a route change. The first one of a page load is the landing page,
 * and the page before it is the referrer when that was a page on this site: a
 * link opened in a new tab, or a full page load from one of our own pages.
 */
export function noteRoute(path: string): void {
  if (path === current) return;
  if (current === null) {
    landing = path;
    const from = document.referrer ? ownPath(document.referrer) : null;
    previous = from && from !== path ? from : null;
  } else {
    previous = current;
  }
  current = path;
  syncLandingPath();
}

/** The page on this site the visitor was on before this one, if any. */
export const routeBefore = (): string | null => previous;

/** The landing path to send with a booking: only with consent, as stored. */
export function landingPath(): string | null {
  if (!consented()) return null;
  try {
    return window.sessionStorage.getItem(LANDING_PATH_KEY);
  } catch {
    return null;
  }
}

/** Remember the profile a tagged booking link came from. */
export function noteLeadChannel(value: LeadChannel): void {
  channel = value;
}

/** The profile this page load's tagged booking link came from, if any. */
export const visitLeadChannel = (): LeadChannel | null => channel;
