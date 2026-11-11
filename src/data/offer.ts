/**
 * Positioning and offer ladder — the single source for both.
 *
 * Decided for both of Sameem's sites (Oct 2026): lead with finishing and
 * shipping apps that got stuck, for non-technical founders whose app was built
 * with Lovable, Replit, Bolt or Cursor, runs on Sharetribe, or was left
 * half-built by a previous developer. The hero, the services hub, the home
 * pricing section and llms.txt all read from here so the wording cannot drift.
 *
 * Honesty rules still apply (claims ledger, Oct 2026):
 *  - Prices Sameem set on 2026-10-09: audit $400 (credited to the fix), finish
 *    sprint $1,200 per week, monthly care $1,500 a month. Payments from $1,200
 *    (Connect payouts from $2,400) and iOS & Android launch from $2,400 were the
 *    recommended prices he asked to publish the same day, in weeks of the
 *    $1,200 sprint. The $2,900 / $7,500 packages are for new builds only.
 *  - Billing (owner decision, 8 Nov 2026): the launch and Payments are billed
 *    weekly in advance in $1,200 weeks, like sprints. The launch from $2,400
 *    is two weeks of our work, Payments from $1,200 one week, Connect payouts
 *    from $2,400 two weeks. The schema prices did not change.
 *  - Launch scope (8 Nov 2026): the store listing, App Privacy details and the
 *    Data safety form are included; in-app purchase or a US web-checkout link
 *    is a separate line in the launch quote, so no copy may put it inside
 *    "From $2,400".
 *  - No delivery guarantee beyond "usually 1–2 weeks" for a finish sprint. The
 *    launch publishes no "usually N weeks": only that it is two weeks of our
 *    work, then the stores' and Dun & Bradstreet's own waits.
 *  - No claim about past rescues or results; this describes the offer.
 *  - No approval promise (owner decision, 7 Nov 2026): we prepare the app,
 *    submit it and answer the reviewers; the stores decide approval. The
 *    promise below uses the entity statement's words (data/brand.ts).
 *  - DevoraX is a two-person studio.
 *
 * Plain data only, so it can be imported from server and client components.
 */

/** When the steps, their wording or their prices last changed. Feeds the
 *  /pricing and /services sitemap entries. 8 Nov 2026: the launch's scope, the
 *  launch and Payments billed in $1,200 weeks, the accounts default, and one
 *  release quoted per change as an alternative to monthly care. */
export const OFFER_UPDATED = '2026-11-08T00:00:00.000Z';

/** When the prices themselves last changed (the payments and launch prices
 *  Sameem set on 9 Oct 2026). /pricing prints it as "Prices last changed". */
export const PRICES_UPDATED = '2026-10-09T00:00:00.000Z';

export const POSITIONING = {
  /** The headline. "Finish and ship", never "rescue". */
  headline: 'We finish and ship stuck apps',
  promise:
    'Payments that work, and real iOS and Android apps, prepared and submitted to the App Store and Google Play.',
  audience:
    'For founders whose app was built with Lovable, Replit, Bolt or Cursor, runs on Sharetribe, or was left half-built by a previous developer.',
} as const;

export type Door = {
  /** Anchor id of this door's section on /services. */
  id: string;
  /**
   * The page this door leads to, by its slug in data/solutions.ts. Every link
   * to it uses that page's own label as anchor text (a door page's nav_label),
   * so the label is not repeated here.
   */
  slug: string;
  /** Who it is for, in a few words: the small label above the link. */
  label: string;
  /** The situation, as the door's heading on /services. */
  title: string;
  /**
   * Two or three sentences on the work. No prices: the price line beside it is
   * generated from the page's offer_steps, so it cannot drift from the ladder.
   */
  body: string;
};

/**
 * The three ways in for an app that already exists, one door page each, in the
 * order every list of them uses. The home hero, the homepage's service cards,
 * the /services door sections, the footer and llms.txt all read them. Until
 * 7 Nov 2026 there were two doors ("AI-built apps", "Marketplaces"), each
 * linking to an anchor on /services; each now leads to its own page.
 */
export const DOORS: Door[] = [
  {
    id: 'app-store',
    slug: 'lovable-app-to-app-store',
    label: 'AI-built app, not in the stores yet',
    title: 'Built with Lovable, Base44 or Replit, and not in the stores yet',
    body:
      "We put your Lovable, Base44 or Replit web app into a native shell, add phone features such as push notifications and prepare the store listing and privacy forms. Then we submit it to the App Store and Google Play and answer the reviewers. In-app purchase is quoted separately. The stores decide approval.",
  },
  {
    id: 'sharetribe',
    slug: 'sharetribe-developers',
    label: 'Marketplace on Sharetribe',
    title: 'Running on Sharetribe, and needing custom code or an app',
    body:
      "For a marketplace already on Sharetribe: custom features the Console can't set up, changes to when and how sellers are paid, and a native iOS and Android app on Sharetribe's APIs. We quote feature work in sprint weeks once we have your requirements, and the free call settles whether an audit is needed first.",
  },
  {
    id: 'vibe-code-audit',
    slug: 'fix-vibe-coded-app',
    label: 'AI-built app that keeps breaking',
    title: 'Built with Lovable, Base44, Replit, Bolt or Cursor, and stuck',
    body:
      "Your app works in the demo but breaks in use: sign-in, data rules or payments. The audit reads the code and gives each part a keep, harden or rebuild verdict, and if you go ahead, finish sprints fix what it found. The report is an engineering review, not a security certification.",
  },
];

/**
 * New marketplace builds, on the marketplace hub page. Shown beside the doors on
 * the homepage and /services, but not a door: it sells a new build at a fixed
 * price rather than a step of the ladder, so it has no generated price line.
 */
export const MARKETPLACE_BUILD: Door = {
  id: 'new-marketplace',
  slug: 'multi-vendor-marketplace-development',
  label: 'New marketplace',
  title: 'Building a multi-vendor marketplace',
  body:
    "A new marketplace where independent sellers list and buyers order: a storefront or buyer app, a vendor portal and an admin console, all reading one backend. We build it when a template such as Sharetribe won't carry your model, at a fixed price agreed in writing before work starts.",
};

/**
 * Stable ids for the ladder steps. A door page names the steps it sells by id
 * (`offer_steps` in data/solutions.ts), and its subtitle price, its closing
 * price block and its Offer schema are all looked up from them.
 */
export type OfferStepId = 'call' | 'audit' | 'sprint' | 'payments' | 'launch' | 'care';

/**
 * A step's price in a form code can read, for the Offer schema and the
 * generated "From $2,400" lines on the door pages. It restates the visible
 * `price` and must change with it; it never carries a number `price` does not
 * show. The schema used to parse these numbers out of the display strings,
 * which breaks the first time someone rewords one.
 */
export type SchemaPrice = {
  amount: number;
  currency: 'USD';
  /** A price per week or per month: a UnitPriceSpecification. */
  unit?: 'WEEK' | 'MONTH';
  /** "From $X": X is the lowest price (minPrice), not the price. */
  from?: boolean;
};

export type OfferStep = {
  id: OfferStepId;
  title: string;
  body: string;
  /** How it is priced. Never a new number. */
  price: string;
  /** Absent for the free call: no door sells it, so it has no schema price. */
  schemaPrice?: SchemaPrice;
};

export const OFFER_LADDER: OfferStep[] = [
  {
    id: 'call',
    title: 'Free 30-minute call',
    body: 'Tell us where the app is stuck and what has to happen by when. We tell you whether an audit makes sense.',
    price: 'Free',
  },
  {
    id: 'audit',
    title: 'Launch-readiness audit',
    body:
      "A review of your code, database security, payments, hosting and store readiness. You keep the written report whatever you decide. An investor-ready version adds a page for your investor's technical reviewer. It is an engineering review, not a security certification, and it doesn't replace a penetration test.",
    price: '$400, credited to the fix if you go ahead',
    schemaPrice: { amount: 400, currency: 'USD' },
  },
  {
    id: 'sprint',
    title: 'Finish sprint',
    body: 'We fix what the audit found and get the app to launch. The audit says how many weeks it needs, so you know the total before work starts.',
    price: '$1,200 per week · usually 1–2 weeks',
    schemaPrice: { amount: 1200, currency: 'USD', unit: 'WEEK' },
  },
  {
    id: 'payments',
    title: 'Payments',
    body:
      'Stripe checkout and subscriptions, and Connect payouts to sellers for marketplaces, set up in your own Stripe account by default.',
    price: 'From $1,200 (one week of our work) · Connect payouts from $2,400 (two weeks)',
    schemaPrice: { amount: 1200, currency: 'USD', from: true },
  },
  {
    id: 'launch',
    title: 'iOS & Android launch',
    body:
      "Native features such as push notifications and deep links, the store listing, App Privacy details and Google Play's Data safety form. We prepare the app against Apple's and Google's guidelines, submit it to the App Store and Google Play and answer the reviewers. The stores decide approval. In-app purchase or a US web-checkout link is a separate line in the launch quote.",
    price: 'From $2,400 (two weeks of our work) · a full React Native build is quoted after the audit',
    schemaPrice: { amount: 2400, currency: 'USD', from: true },
  },
  {
    id: 'care',
    title: 'Monthly care',
    body: 'Fixes, updates and new releases after the 35 days of free defect fixes. A single release can be quoted per change instead.',
    price: '$1,500 per month',
    schemaPrice: { amount: 1500, currency: 'USD', unit: 'MONTH' },
  },
];

/** The ladder steps with these ids, in the order given. */
export function offerSteps(ids: readonly OfferStepId[]): OfferStep[] {
  return ids
    .map((id) => OFFER_LADDER.find((s) => s.id === id))
    .filter((s): s is OfferStep => Boolean(s));
}

export const FIT = {
  good: [
    'You have real users',
    'You have a launch date',
    'A client is waiting on the app',
    'Money is on the line',
  ],
  notFit: [
    'Hobby projects with no users and no deadline',
    'Equity-only offers',
    'WordPress or Shopify theme work',
  ],
} as const;
