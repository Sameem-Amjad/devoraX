/* Google Analytics 4 and Microsoft Clarity, loaded from the bundle rather
 * than pasted into the layout as the vendors' stock inline snippets.
 *
 * Creating the tags from JS at runtime keeps them out of the server-rendered
 * HTML, so hydration has nothing new to reconcile, and lets them wait until
 * the page has loaded so neither competes with first paint or LCP.
 *
 * Page views on client-side navigation come from GA4's Enhanced measurement
 * ("page changes based on browser history events"), which is on by default
 * for the data stream, and Clarity follows history changes on its own. No
 * manual page_view hook is needed.
 *
 * The IDs are NEXT_PUBLIC_ vars and so ship to the browser. That is fine —
 * both are public by design. Both are read at build time, so a change in
 * Vercel needs a redeploy.
 *
 * Consent (the banner in components/ui/cookieConsent.tsx):
 * - EEA, UK and Switzerland: no analytics cookies until the visitor accepts.
 *   Clarity behaves that way there on its own; GA gets a region default
 *   below. Both still measure cookie-free, each page view on its own.
 * - Everywhere else: cookies on, unless the visitor declines.
 * - Ad storage is always denied: in GA's defaults, and in every choice sent
 *   to Clarity. The site runs no ads.
 * A stored choice is re-sent on every page load, ahead of each tag's first
 * hit.
 *
 * /admin is never measured. Its pages show booking names and emails, and a
 * Clarity recording would capture them. */

type Consent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const isProd = process.env.NODE_ENV === "production";

// EU-27 + Iceland, Liechtenstein, Norway, + UK and Switzerland.
const OPT_IN_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO",
  "GB", "CH",
];

export const CONSENT_KEY = "analytics-consent";
// Ask again after six months, so an old answer is not treated as permanent.
const CONSENT_MAX_AGE = 1000 * 60 * 60 * 24 * 182;
const OPEN_EVENT = "privacy-choices:open";
const CHANGE_EVENT = "analytics-consent:change";

/* "granted" | "denied" | null (never asked, expired, or storage blocked). */
export const readConsent = (): Consent | null => {
  try {
    const { v, t } = JSON.parse(window.localStorage.getItem(CONSENT_KEY) ?? "null") || {};
    if ((v === "granted" || v === "denied") && Date.now() - t < CONSENT_MAX_AGE) return v;
  } catch {
    /* blocked storage or a malformed value: treat as unanswered */
  }
  return null;
};

// GA's cookies (_ga, _ga_<stream>) and Clarity's first-party ones (_clck,
// _clsk). Clarity drops its own on a denial too, but only from the next page
// load; this clears them at the moment of the click.
const clearAnalyticsCookies = () => {
  const domain = window.location.hostname.replace(/^www\./, "");
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!/^_(ga|clck|clsk)/.test(name)) continue;
    for (const d of ["", `; domain=${domain}`, `; domain=.${domain}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${d}`;
    }
  }
};

const sendConsent = (state: Consent) => {
  window.gtag?.("consent", "update", { analytics_storage: state });
  window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: state });
  if (state === "denied") clearAnalyticsCookies();
};

/* Called by the banner. Remembers the answer and tells both tools now. */
export const setConsent = (state: Consent) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: state, t: Date.now() }));
  } catch {
    /* not remembered: the banner returns next visit, which is the safe side */
  }
  sendConsent(state);
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

/* Subscribe for useSyncExternalStore, with readConsent as the snapshot. */
export const onConsentChange = (fn: () => void) => {
  window.addEventListener(CHANGE_EVENT, fn);
  return () => window.removeEventListener(CHANGE_EVENT, fn);
};

/* The footer's "Privacy choices" button. The banner listens for this. */
export const openPrivacyChoices = () => window.dispatchEvent(new Event(OPEN_EVENT));
export const onOpenPrivacyChoices = (fn: () => void) => {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
};

/* The admin area is never measured (see the top of this file). */
export const isUnmeasuredPage = () => window.location.pathname.startsWith("/admin");

let started = false;

/* Events fired before initAnalytics runs. It waits for the load event and an
   idle moment, but booking_open on a direct visit to /book fires during
   hydration, long before that, and was being dropped. They are held here and
   sent, in order, once the tags exist and their consent defaults are queued.
   Capped, so a page that never finishes loading can't grow it without end. */
const pending: [string, Record<string, unknown> | undefined][] = [];

export const initAnalytics = () => {
  // Skip in dev and in builds without an ID so local testing never pollutes
  // production data.
  if (!isProd || started || typeof window === "undefined" || isUnmeasuredPage()) return;
  started = true;

  const stored = readConsent();

  if (id) {
    window.dataLayer = window.dataLayer || [];
    // gtag.js reads Arguments objects off the dataLayer, not arrays, so this
    // has to be a plain function pushing `arguments`.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    // Defaults must be queued before "config" so the first hit obeys them.
    // The more specific region entry wins over the global one.
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    window.gtag("consent", "default", { analytics_storage: "denied", region: OPT_IN_REGIONS });
    if (stored) window.gtag("consent", "update", { analytics_storage: stored });
    window.gtag("js", new Date());
    window.gtag("config", id);

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s);
  }

  if (clarityId) {
    // Clarity's own stub: queue calls until the tag arrives and drains them.
    window.clarity =
      window.clarity ||
      function clarity() {
        // eslint-disable-next-line prefer-rest-params
        (window.clarity!.q = window.clarity!.q || []).push(arguments);
      };
    if (stored) window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: stored });

    const c = document.createElement("script");
    c.async = true;
    c.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`;
    document.head.appendChild(c);
  }

  // Anything tracked before this point, now that the tags are set up.
  for (const [name, params] of pending.splice(0)) track(name, params);

  // contact_click, for emails: one listener on the document covers every
  // mailto: link, including ones rendered after this runs. Capture phase, so
  // a handler that stops propagation can't hide the click.
  document.addEventListener(
    "click",
    (e) => {
      if (!(e.target instanceof Element) || isUnmeasuredPage()) return;
      if (e.target.closest('a[href^="mailto:"]')) {
        track("contact_click", { method: "email", page_path: window.location.pathname });
      }
    },
    true
  );
};

/* Fire a custom event: a GA event, and a Clarity event of the same name so
   recordings can be filtered to the visitors who did it. A no-op for any tool
   that never loaded (dev, blocked by an ad blocker, no ID, /admin), so call
   sites never need to guard. */
export const track = (name: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  if (!started) {
    if (analyticsEnabled && !isUnmeasuredPage() && pending.length < 50) pending.push([name, params]);
    return;
  }
  window.gtag?.("event", name, params);
  window.clarity?.("event", name);
};

/* Which tools are active in this build. The banner, the footer button and
   the privacy page use these so they name only what is really measuring,
   and show nothing where nothing is. */
export const gaEnabled = Boolean(id) && isProd;
export const clarityEnabled = Boolean(clarityId) && isProd;
export const analyticsEnabled = gaEnabled || clarityEnabled;
export const analyticsTools = [gaEnabled && "Google Analytics", clarityEnabled && "Microsoft Clarity"]
  .filter(Boolean)
  .join(" and ");
