/**
 * Third-party prices the site prints, one row per price: what it is, the price
 * as the page prints it, the same amounts as numbers, the page that states it,
 * the day it was read there, and where on this site it is used.
 *
 * Why a table. DevoraX's own prices come from the offer ladder (data/offer.ts).
 * Every other price on a sales page belongs to someone else, changes without
 * notice, and is only as good as the day it was read. Each row carries its
 * source and its read date, and `npm run audit:content` checks them:
 *  - a dollar (or pound) amount in a cost section or price table that no row
 *    here lists is an error;
 *  - a row with no source URL or no read date is an error;
 *  - a row read more than 90 days ago is a warning: read the page again, update
 *    `printed` and `amounts` if the price moved, and set `checked_on` to that day;
 *  - a row that no longer appears where `used_in` says it does is a warning:
 *    remove it, or point `used_in` at its new place.
 *
 * Adding a price. Print it in a door page's table or text first, then add a row
 * here whose `printed` is a piece of that text, character for character. A row
 * is a record of a price a visitor can read, never a price held back for later.
 *
 * `used_in` names a page and a section id: "solutions/{slug}#{section id}" for a
 * door or vertical page, "insights/{slug}#{section id}" for an insight. The
 * audit looks the section up in the data, so the id has to exist.
 *
 * Plain data only, and a plain literal: scripts/content-audit.mjs reads
 * MARKET_PRICES by evaluating its text without compiling TypeScript, so a row
 * cannot call a function or use a value imported from another file. The door
 * tables still hold the prices as typed text; the audit is what ties the two
 * together. `amounts` is empty for a price with no dollar amount (a percentage
 * fee). Currency is the one the page prints: the audit holds a pound amount to
 * the same rule as a dollar one.
 */
export type MarketPrice = {
  /** Stable, lowercase-hyphenated. */
  id: string;
  /** Who sets the price. */
  vendor: string;
  /** What is priced, in a few words. */
  item: string;
  /** The price exactly as the page prints it: a piece of the page's own text. */
  printed: string;
  /** Every amount in `printed`, as numbers (349.5, not "$349.50"). */
  amounts: number[];
  currency: 'USD' | 'GBP';
  /** The vendor's page the price was read from. */
  source_url: string;
  /** The day the page was read: an ISO date. */
  checked_on: string;
  /** Where the site prints it: "solutions/{slug}#{section id}". */
  used_in: string[];
};

export const MARKET_PRICES: MarketPrice[] = [
  // --- Store accounts and platform plans -----------------------------------
  {
    id: 'apple-developer-program',
    vendor: 'Apple',
    item: 'Apple Developer Program, per year',
    printed: '$99 a year',
    amounts: [99],
    currency: 'USD',
    source_url: 'https://developer.apple.com/programs/enroll/',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost'],
  },
  {
    id: 'apple-developer-program-whats-included',
    vendor: 'Apple',
    item: 'Apple Developer Program, per membership year, as Apple words it',
    printed: '99 USD per membership year',
    amounts: [99],
    currency: 'USD',
    source_url: 'https://developer.apple.com/programs/whats-included/',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#cost'],
  },
  {
    id: 'google-play-developer-account',
    vendor: 'Google',
    item: 'Google Play developer account, one time',
    printed: 'US$25, one time',
    amounts: [25],
    currency: 'USD',
    source_url: 'https://support.google.com/googleplay/android-developer/answer/6112435',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost', 'solutions/sharetribe-developers#cost'],
  },

  // --- Wrapper and publishing services (Lovable door, Sharetribe door) -----
  {
    id: 'twinr-basic',
    vendor: 'Twinr',
    item: 'Wrapper subscription, Basic plan, billed monthly',
    printed: '$25 a month for its Basic plan on monthly billing',
    amounts: [25],
    currency: 'USD',
    source_url: 'https://twinr.dev/pricing-plans',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost', 'solutions/sharetribe-developers#native-app'],
  },
  {
    id: 'twinr-standard',
    vendor: 'Twinr',
    item: 'Wrapper subscription, Standard plan (in-app purchase, deep links), billed monthly',
    printed: '$85-a-month Standard plan',
    amounts: [85],
    currency: 'USD',
    source_url: 'https://twinr.dev/pricing-plans',
    checked_on: '2026-11-07',
    used_in: [
      'solutions/lovable-app-to-app-store#cost',
      'solutions/lovable-app-to-app-store#cheaper-options',
      'solutions/sharetribe-developers#native-app',
    ],
  },
  {
    id: 'letsdeployit-one-store',
    vendor: 'LetsDeployIt',
    item: 'Publishing service, one store, flat fee',
    printed: '$349.50 flat for one store',
    amounts: [349.5],
    currency: 'USD',
    source_url: 'https://letsdeploy.it/lovable-to-app-store',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost'],
  },
  {
    id: 'letsdeployit-both-stores',
    vendor: 'LetsDeployIt',
    item: 'Publishing service, both stores, flat fee',
    printed: '$499.50 for both',
    amounts: [499.5],
    currency: 'USD',
    source_url: 'https://letsdeploy.it/lovable-to-app-store',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost'],
  },
  {
    id: 'letsdeployit-list-prices',
    vendor: 'LetsDeployIt',
    item: 'The list prices its two flat fees are shown as reduced from',
    printed: 'reduced from $699 and $999',
    amounts: [699, 999],
    currency: 'USD',
    source_url: 'https://letsdeploy.it/lovable-to-app-store',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost'],
  },
  {
    id: 'letsdeployit-code-only',
    vendor: 'LetsDeployIt',
    item: 'The React Native code alone',
    printed: '$99.50 for the React Native code alone',
    amounts: [99.5],
    currency: 'USD',
    source_url: 'https://letsdeploy.it/lovable-to-app-store',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost'],
  },
  {
    id: 'letsdeployit-care',
    vendor: 'LetsDeployIt',
    item: 'Care after the three included months, per month',
    printed: 'then $99 a month',
    amounts: [99],
    currency: 'USD',
    source_url: 'https://letsdeploy.it/lovable-to-app-store',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost'],
  },
  {
    id: 'foresight-mobile-review',
    vendor: 'Foresight Mobile',
    item: "Paid review of an AI-built app's code, security, stability and account ownership",
    printed: '£95',
    amounts: [95],
    currency: 'GBP',
    source_url: 'https://foresightmobile.com/blog/lovable-to-app-store',
    checked_on: '2026-11-07',
    used_in: ['solutions/lovable-app-to-app-store#cost'],
  },

  // --- Sharetribe door: app templates --------------------------------------
  {
    id: 'journeyhorizon-template',
    vendor: 'Journeyhorizon',
    item: 'Sharetribe mobile app template: setup, then monthly (or annual billing)',
    printed: '$199 setup, then $249 a month, or $199 a month paid annually',
    amounts: [199, 249],
    currency: 'USD',
    source_url: 'https://journeyh.io/sharetribe-mobile-app-template',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#native-app'],
  },
  {
    id: 'journeyhorizon-custom-code',
    vendor: 'Journeyhorizon',
    item: 'Extending the template with custom code, paid annually, 2-year minimum',
    printed: '$349 a month, paid annually',
    amounts: [349],
    currency: 'USD',
    source_url: 'https://journeyh.io/sharetribe-mobile-app-template',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#native-app'],
  },
  {
    id: 'devscrew-standard',
    vendor: 'DevsCrew',
    item: 'Sharetribe mobile template, standard flows: monthly billed annually, and setup',
    printed: 'Standard flows from $179 a month billed annually, setup from $299',
    amounts: [179, 299],
    currency: 'USD',
    source_url: 'https://devscrew.co/sharetribe-mobile-template',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#native-app'],
  },
  {
    id: 'devscrew-customised',
    vendor: 'DevsCrew',
    item: 'Sharetribe mobile template, customised marketplaces: monthly billed annually, and setup',
    printed: 'customised marketplaces from $499 a month billed annually, setup from $2,600',
    amounts: [499, 2600],
    currency: 'USD',
    source_url: 'https://devscrew.co/sharetribe-mobile-template',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#native-app'],
  },

  // --- Sharetribe door: what a custom-coded marketplace costs to run -------
  {
    id: 'sharetribe-build-plan',
    vendor: 'Sharetribe',
    item: 'Build plan: code access, Dev and Test only, per month',
    printed: '$39 a month',
    amounts: [39],
    currency: 'USD',
    source_url: 'https://www.sharetribe.com/pricing/',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#cost'],
  },
  {
    id: 'sharetribe-live-plan',
    vendor: 'Sharetribe',
    item: 'Live plan: real users and payments, custom code and apps live, billed yearly or monthly',
    printed: '$199 a month billed yearly, or $259 billed monthly',
    amounts: [199, 259],
    currency: 'USD',
    source_url: 'https://www.sharetribe.com/pricing/',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#cost'],
  },
  {
    id: 'render-hosting-estimate',
    vendor: "Render, by Sharetribe's estimate",
    item: 'Hosting the customised frontend, per month',
    printed: 'About $39 a month on Render (its $25 Pro plan plus about $14 of compute)',
    amounts: [39, 25, 14],
    currency: 'USD',
    source_url: 'https://www.sharetribe.com/help/en/articles/8496118-how-much-does-it-cost-to-customize-your-marketplace-with-code',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#cost'],
  },
  {
    id: 'render-19-plan',
    vendor: "Render, as Sharetribe's pricing page names it",
    item: 'A smaller hosting plan, per month',
    printed: "Render's $19 a month plan",
    amounts: [19],
    currency: 'USD',
    source_url: 'https://www.sharetribe.com/pricing/',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#cost'],
  },
  {
    id: 'stripe-processing-fees',
    vendor: 'Stripe, as Sharetribe describes it',
    item: 'Processing fees, a share of each transaction',
    printed: 'Around 1.5-3% of each transaction in a typical case, Sharetribe says',
    amounts: [],
    currency: 'USD',
    source_url: 'https://www.sharetribe.com/pricing/',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#cost'],
  },
  {
    id: 'stripe-connect-us',
    vendor: 'Stripe',
    item: 'Connect fees for paying sellers, US',
    printed: '$2 a month for each seller paid out that month, plus 0.25% + 25¢ per payout',
    amounts: [2],
    currency: 'USD',
    source_url: 'https://stripe.com/connect/pricing',
    checked_on: '2026-11-07',
    used_in: ['solutions/sharetribe-developers#cost'],
  },

  // --- Vibe code audit door: what other firms charge for an audit ----------
  {
    id: 'valletta-starter-audit',
    vendor: 'Valletta Software',
    item: 'Starter audit',
    printed: 'From $199',
    amounts: [199],
    currency: 'USD',
    source_url: 'https://vallettasoftware.com/blog/post/vibe-coding-audit',
    checked_on: '2026-11-07',
    used_in: ['solutions/fix-vibe-coded-app#cost'],
  },
  {
    id: 'valletta-standard-audit',
    vendor: 'Valletta Software',
    item: 'Standard audit',
    printed: 'From $799',
    amounts: [799],
    currency: 'USD',
    source_url: 'https://vallettasoftware.com/blog/post/vibe-coding-audit',
    checked_on: '2026-11-07',
    used_in: ['solutions/fix-vibe-coded-app#cost'],
  },
  {
    id: 'valletta-investor-ready-audit',
    vendor: 'Valletta Software',
    item: 'Investor-ready audit',
    printed: 'From $1,499',
    amounts: [1499],
    currency: 'USD',
    source_url: 'https://vallettasoftware.com/blog/post/vibe-coding-audit',
    checked_on: '2026-11-07',
    used_in: ['solutions/fix-vibe-coded-app#cost'],
  },
  {
    id: 'rapiddev-lovable-security-audit',
    vendor: 'RapidDev',
    item: 'Lovable security audit',
    printed: '$1,000 fixed',
    amounts: [1000],
    currency: 'USD',
    source_url: 'https://rapidevelopers.com/lovable-security-audit',
    checked_on: '2026-11-07',
    used_in: ['solutions/fix-vibe-coded-app#cost'],
  },
  {
    id: 'digital-spirit-triage-scan',
    vendor: 'Digital Spirit Technology',
    item: 'Triage Scan, per site',
    printed: '$1,500 per site',
    amounts: [1500],
    currency: 'USD',
    source_url: 'https://digitalspirittech.com/services/vibe-code-audit/',
    checked_on: '2026-11-07',
    used_in: ['solutions/fix-vibe-coded-app#cost'],
  },
  {
    id: 'digital-spirit-audit-remediation',
    vendor: 'Digital Spirit Technology',
    item: 'Audit + Remediation, per site',
    printed: 'From $4,500 per site',
    amounts: [4500],
    currency: 'USD',
    source_url: 'https://digitalspirittech.com/services/vibe-code-audit/',
    checked_on: '2026-11-07',
    used_in: ['solutions/fix-vibe-coded-app#cost'],
  },
  {
    id: 'spotdev-safe-to-ship',
    vendor: 'SpotDev',
    item: 'Safe to Ship audit, excluding VAT',
    printed: 'From £1,500, excluding VAT',
    amounts: [1500],
    currency: 'GBP',
    source_url: 'https://spotdev.co.uk/services/vibe-code-audit',
    checked_on: '2026-11-07',
    used_in: ['solutions/fix-vibe-coded-app#cost'],
  },
  {
    id: 'damian-galarza-vibe-code-audit',
    vendor: 'Damian Galarza',
    item: 'Vibe Code Audit',
    printed: 'From $4,000',
    amounts: [4000],
    currency: 'USD',
    source_url: 'https://damiangalarza.com/vibe-code-audit/',
    checked_on: '2026-11-07',
    used_in: ['solutions/fix-vibe-coded-app#cost'],
  },
];
