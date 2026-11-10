"use client";

/* The analytics consent banner, and the component that starts analytics.
 *
 * Both tools load either way; the answer decides whether they may use
 * cookies. Declining keeps measurement cookie-free (each page view stands
 * alone) and clears any analytics cookies already set. What happens before
 * an answer depends on the visitor's region — see the top of
 * lib/analytics.ts. The footer's "Privacy choices" button reopens this.
 *
 * Accept and Decline are styled the same: declining has to be as easy as
 * accepting.
 *
 * Renders nothing until after mount, and nothing at all in a build without
 * an analytics ID or on /admin — with no tracking there is nothing to
 * consent to. */

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  analyticsEnabled,
  analyticsTools,
  initAnalytics,
  isUnmeasuredPage,
  onConsentChange,
  onOpenPrivacyChoices,
  readConsent,
  setConsent,
} from "@/lib/analytics";

// The old banner's key. Its answers were to "this site runs no analytics",
// so they are not consent to analytics and are not carried over.
const LEGACY_KEY = "devorax-cookie-consent";

/* Analytics waits for the load event and then an idle moment, so gtag
   (~175 KB) and Clarity (~25 KB) never compete with the hero for first
   paint and LCP. The cost is that a visitor who leaves before the page
   finishes loading isn't counted. A consent answer given before then is
   stored, and initAnalytics reads it. */
const afterLoad = (fn: () => void) => {
  const idle = () =>
    "requestIdleCallback" in window
      ? window.requestIdleCallback(fn, { timeout: 2000 })
      : setTimeout(fn, 0);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
};

const choiceButton =
  "flex-1 md:flex-none py-2 px-4 md:px-6 rounded-lg border border-white/15 text-gray-200 text-sm font-medium hover:text-white hover:border-teal-400 transition-colors";

// The server has no localStorage, so it renders "unknown" (no banner), and
// the stored answer is read only after hydration.
const serverConsent = () => "unknown" as const;

export function CookieConsent() {
  const consent = useSyncExternalStore(onConsentChange, readConsent, serverConsent);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled || isUnmeasuredPage()) return undefined;
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* storage blocked: nothing to clean up */
    }
    afterLoad(initAnalytics);
    return onOpenPrivacyChoices(() => setReopened(true));
  }, []);

  function choose(state: "granted" | "denied") {
    setConsent(state);
    setReopened(false);
  }

  const visible =
    analyticsEnabled &&
    consent !== "unknown" &&
    !isUnmeasuredPage() &&
    (consent === null || reopened);
  if (!visible) return null;

  // data-nosnippet keeps the banner's wording out of search snippets and AI
  // answers. It never reaches the server HTML, but Googlebot runs JavaScript
  // and can read it in the rendered page.
  //
  // Layout (Nov 2026): a low bar across the bottom on wide screens, text
  // beside the two buttons, and a short sheet in small type on a phone. It
  // was a tall card in the bottom-right corner, which sat on top of the
  // hero: on a phone it covered the sub-headline and two of the three door
  // links for every first-time visitor. The wording did not change.
  return (
    <div
      data-nosnippet
      role="region"
      aria-label="Privacy choices"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-white/10 bg-[#0d0d0d]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-md md:inset-x-auto md:bottom-5 md:left-1/2 md:flex md:w-[min(82rem,calc(100vw-3rem))] md:-translate-x-1/2 md:items-center md:gap-6 md:px-6"
    >
      {/* Accepting also lets the site keep the page a visit began on and send
          it with a booking (lib/booking/visit.ts), so the banner says so: the
          answer has to cover everything it allows. */}
      <p className="mb-3 text-xs leading-relaxed text-gray-300 md:mb-0 md:flex-1">
        This site uses {analyticsTools} to see how visitors use it: pages,
        clicks and scrolling. Accept to allow their cookies, and to send the
        page your visit began on with any call you book; decline and each page
        view is counted without them. No ads, and nothing you type into a form
        is recorded.{" "}
        {/* Descriptive anchor text: Lighthouse's SEO audit fails a bare
            "Learn more", which tells a crawler nothing about the target. */}
        <a
          href="/privacy"
          className="text-teal-400 underline underline-offset-2 hover:text-teal-300 transition-colors"
        >
          Read our privacy policy
        </a>
      </p>
      <div className="flex gap-3 md:flex-shrink-0">
        <button type="button" onClick={() => choose("denied")} className={choiceButton}>
          Decline
        </button>
        <button type="button" onClick={() => choose("granted")} className={choiceButton}>
          Accept
        </button>
      </div>
    </div>
  );
}
