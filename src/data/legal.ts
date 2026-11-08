/**
 * Revision dates of the legal pages. Each page renders its visible "Last
 * updated" line and its WebPage dateModified from these, and the sitemap
 * reports the same value, so the three cannot disagree. They live here because
 * a page file may only export Next.js route fields.
 */
// 7 Nov 2026: the booking form's optional app questions, the landing page
// (with analytics consent only) and the profile a booking link came from.
export const PRIVACY_UPDATED = '2026-11-07';
// 7 Nov 2026: the portfolio section calls project pages "engineering
// write-ups", and keeps "case study" for work a client contracted DevoraX for.
// The same day, "Pricing information" made the published step prices and
// terms (data/terms.ts, /pricing#terms) the defaults every proposal starts
// from, and the portfolio and intellectual property sections stopped calling
// employer work "work we performed".
// 8 Nov 2026 (owner decisions): the portfolio section names a client who
// hired DevoraX through its Fiverr profile (in Sameem Amjad's name), calls the
// Fiverr record ours, and says a page gives who the work was for where that is
// recorded; "Pricing information" lists the terms as /pricing#terms now has
// them, check-ins and the accounts included.
export const TERMS_UPDATED = '2026-11-08';
