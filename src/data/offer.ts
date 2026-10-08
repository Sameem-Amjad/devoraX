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
 *    sprint $1,200 per week, monthly care $1,500 a month. Payments and store
 *    launch are still quoted after the audit. The $2,900 / $7,500 packages are
 *    for new builds only.
 *  - No delivery guarantee beyond "usually 1–2 weeks" for a finish sprint.
 *  - No claim about past rescues or results; this describes the offer.
 *  - DevoraX is a two-person studio.
 *
 * Plain data only, so it can be imported from server and client components.
 */

export const POSITIONING = {
  /** The headline. "Finish and ship", never "rescue". */
  headline: 'We finish and ship stuck apps',
  promise: 'Payments that work, real iOS and Android apps, and App Store approval.',
  audience:
    'For founders whose app was built with Lovable, Replit, Bolt or Cursor, runs on Sharetribe, or was left half-built by a previous developer.',
} as const;

export type Door = {
  /** Anchor id on /services. */
  id: string;
  label: string;
  title: string;
  body: string;
};

/** The two ways in. */
export const DOORS: Door[] = [
  {
    id: 'ai-built-apps',
    label: 'AI-built apps',
    title: 'Built with Lovable, Replit, Bolt or Cursor',
    body:
      'The demo works, but sign-in breaks, the database is open to anyone, payments never went live or there is no app in the stores. We fix the code, lock down the data, connect Stripe and ship it to the App Store and Google Play.',
  },
  {
    id: 'marketplaces',
    label: 'Marketplaces',
    title: 'Running on Sharetribe, or left half-built',
    body:
      'Custom Sharetribe features, Stripe Connect payouts to your sellers, and the native iOS and Android app, which Sharetribe does not ship. Or we pick up a marketplace a previous developer left unfinished.',
  },
];

export type OfferStep = {
  title: string;
  body: string;
  /** How it is priced. Never a new number. */
  price: string;
};

export const OFFER_LADDER: OfferStep[] = [
  {
    title: 'Free 30-minute call',
    body: 'Tell us where the app is stuck and what has to happen by when. We tell you whether an audit makes sense.',
    price: 'Free',
  },
  {
    title: 'Launch-readiness audit',
    body:
      'A review of your code, database security, payments, hosting and store readiness. You keep the written report whatever you decide. An investor-ready version covers what technical due diligence will ask. It is an engineering review, not a security certification.',
    price: '$400, credited to the fix if you go ahead',
  },
  {
    title: 'Finish sprint',
    body: 'We fix what the audit found and get the app to launch. The audit says how many weeks it needs, so you know the total before work starts.',
    price: '$1,200 per week · usually 1–2 weeks',
  },
  {
    title: 'Payments',
    body:
      'Stripe checkout and subscriptions, and Connect payouts to sellers for marketplaces, set up in your own Stripe account.',
    price: 'Fixed price, quoted after the audit',
  },
  {
    title: 'iOS & Android launch',
    body:
      'Native features such as push notifications and deep links, then submission to the App Store and Google Play until approved.',
    price: 'Fixed price, quoted after the audit',
  },
  {
    title: 'Monthly care',
    body: 'Fixes, updates and new releases after launch.',
    price: '$1,500 per month',
  },
];

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
