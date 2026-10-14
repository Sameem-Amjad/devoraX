/**
 * Brand facts: the one place that says who DevoraX is.
 *
 * Search engines and AI assistants reconcile what they know about a company
 * across every page and profile that describes it, and inconsistent sources
 * produce wrong answers. The footer had already drifted: it still described a
 * general software studio building "mobile apps, AI and full-stack web
 * platforms, and cloud infrastructure" a week after the positioning moved to
 * finishing stuck apps. Everything that states a brand fact now reads it from
 * here: the Organization schema in the root layout, the footer, llms.txt, and
 * the /about and /press pages. A directory profile (LinkedIn, Clutch, Fiverr)
 * should copy these lines word for word.
 *
 * Only facts already published and checkable: the founding year Sameem
 * confirmed on 9 Oct 2026, the two people on /team, "Pakistan · Remote" and the
 * client countries from the founder section, the call hours on /contact, and
 * the public Fiverr record.
 *
 * BRAND_FACTS is a plain literal so scripts/content-audit.mjs can read it
 * without compiling TypeScript.
 */

export const SITE_URL = 'https://thedevorax.tech';

/**
 * The entity statement. Use it verbatim wherever the company is described in a
 * sentence; do not paraphrase it per page.
 */
export const ENTITY_STATEMENT =
  'DevoraX is a two-person software studio, founded in 2022 and based in Pakistan, that finishes and ships stuck apps for founders: payments that work, real iOS and Android apps, and App Store approval.';

export const BRAND_FACTS = {
  name: 'DevoraX',
  /** How people shorten it. Schema alternateName only, never visible copy. */
  alternateName: 'Devora',
  founded: '2022',
  basedIn: 'Pakistan, working remotely with clients worldwide',
  team: 'Two people: Sameem Amjad, Founder & Lead Architect Engineer, and Usman, CTO',
  whatWeDo:
    'Finish and ship stuck apps: payments that work, real iOS and Android apps, and App Store approval',
  whoItIsFor:
    'Founders whose app was built with Lovable, Replit, Bolt or Cursor, runs on Sharetribe, or was left half-built by a previous developer',
  trackRecord: "Sameem Amjad's Fiverr profile: 5.0 rating across 50+ projects since January 2022",
  clientCountries: 'United States, United Kingdom, Canada and Hong Kong',
  certifications: 'None. DevoraX holds no security or compliance certifications.',
  // The hours the booking system offers (WORK_START_HOUR / WORK_END_HOUR in
  // lib/booking/availability.ts). Change both together.
  callHours: 'Monday to Friday, 10 am to 6 pm PKT (UTC+5)',
  salesEmail: 'business@thedevorax.tech',
  supportEmail: 'support@thedevorax.tech',
};

/** Revision date of BRAND_FACTS. Feeds the /about and /press sitemap entries. */
export const BRAND_FACTS_UPDATED = '2026-10-14T00:00:00.000Z';

export type Profile = { label: string; url: string };

/**
 * Profiles the studio controls. The Organization's sameAs lists exactly these,
 * and the footer links to each, so the links run in both directions.
 */
export const ORG_PROFILES: Profile[] = [
  // { label: 'LinkedIn', url: 'https://www.linkedin.com/company/devorax' },
  // { label: 'GitHub', url: 'https://github.com/devorax' },
];

/** Sameem's own profiles: the founder's Person sameAs on /team. */
export const FOUNDER_PROFILES: Profile[] = [
  { label: 'Personal site', url: 'https://sameemamjad.com' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sameem-amjad-dev/' },
  { label: 'Fiverr', url: 'https://www.fiverr.com/sameemamjad' },
];
