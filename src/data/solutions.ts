/**
 * Commercial solution landing pages — the "target now" tier of the keyword plan.
 *
 * These exist because the broad terms are unwinnable. A live SERP check on 26
 * candidates found 29 of 80 original keywords were held by agencies running
 * exact-match URLs with years of link equity behind them; head-on competition on
 * those is not a strategy for a domain with no backlink profile. What survived
 * were narrow queries where the founder's own engineering work covers the exact
 * thing being searched for — "antiques marketplace app development company"
 * rather than "marketplace development", "used car marketplace app development
 * with inspection reports" rather than "car marketplace website development
 * company".
 *
 * Two kinds of page live here, and both say plainly whose work every piece of
 * proof was. The only figures allowed are ones a reader can check today: a store
 * listing, a live site or demo URL, a release month, a public quote.
 *
 * Vertical pages (`kind` absent or 'vertical') are each built on a NAMED,
 * PUBLICLY DESCRIBED project with a write-up on this site. Most of that work is
 * Sameem Amjad's as an employee of other companies (Zencloud, Webrange
 * Solutions, Pastel); the rest is products he worked on whose client is not
 * named here. One of those, Koor on the food truck page, was DevoraX client
 * work (owner decision, 8 Nov 2026), and that page says so; nothing else is
 * presented as a DevoraX client delivery. A vertical page with no real work
 * behind it is the thin content this site was already penalised for carrying,
 * and it would mean claiming expertise that does not exist.
 *
 * Offer pages (`kind: 'offer'`, the door pages) sell steps of the offer ladder
 * in data/offer.ts to founders with an app that is stuck. Owner decision (Nov
 * 2026): an offer page may rest on the method, a published sample audit report,
 * the Fiverr record ("5.0 rating across 50+ projects since January 2022") and
 * correctly attributed related work. It never claims past rescues or their
 * results, never presents employer work as DevoraX client work, and calls
 * nothing a "Case Study" unless DevoraX was contracted for it. A project card
 * must carry its role line and a review its job label, so TypeScript rejects a
 * card without one. Prices are never typed into the copy: the subtitle price,
 * the closing price block and the Offer schema come from `offer_steps`, and the
 * terms come from data/terms.ts.
 *
 * The route is /solutions/{slug} rather than /services/{id} because the services
 * route resolves by database primary key and is owned by the admin dashboard.
 */
import type { OfferStepId } from './offer';
import type { InsightTable } from './insights';

export type SolutionProof = {
  project_id: number;
  name: string;
  one_line: string;
  /** The specific capability this work evidences for this page. */
  what_it_proves: string;
  /**
   * Facts a reader can check today: a store listing, a live site or demo URL, a
   * release month, a public quote. Never an outcome figure nobody can verify.
   * May be empty.
   */
  figures: string[];
};

/** A vertical page: one market, built on named work. */
export type VerticalSolution = {
  kind?: 'vertical';
  slug: string;
  primary_keyword: string;
  h1: string;
  /** Without the " | DevoraX" suffix — the metadata template appends it. */
  title: string;
  meta_description: string;
  hero_answer: string;
  /**
   * Three key points under the introduction: a heading of 2 to 5 words and one
   * or two sentences each, covering ground the introduction does not.
   */
  key_points?: { heading: string; body: string }[];
  sections: { heading: string; body: string }[];
  proof: SolutionProof[];
  included: string[];
  quoted_separately: string[];
  when_not_to_hire: string;
  faqs: { q: string; a: string }[];
  word_count: number;
  /**
   * This page's own revision date (ISO), for the byline, the WebPage
   * dateModified and the sitemap. Without one, SOLUTIONS_UPDATED applies, so
   * revising one vertical page does not re-date the others.
   */
  updated?: string;
  role: 'hub' | 'spoke';
  /** The hub slug this page links up to. Undefined when this page IS the hub. */
  hub?: string;
  /** Sibling solution slugs to cross-link. */
  related_slugs: string[];
  /** The services-table row it sat under. Unused since /services/{id} redirected (7 Nov 2026). */
  service_id?: number;
};

/**
 * One section of an offer page. `body` holds paragraphs separated by a blank
 * line, with links written [anchor text](/path) or [anchor text](https://…).
 */
export type OfferSection = {
  /** Anchor, lowercase-hyphenated: "payments", "sample-report". */
  id?: string;
  /** Phrased as the buyer's question where that reads naturally. */
  heading: string;
  body: string;
  table?: InsightTable;
};

/** Proof on an offer page ("ProofItem" in the content contract). */
export type OfferProof =
  | {
      type: 'project';
      project_id: number;
      name: string;
      /** What Sameem (or Usman) actually did, and for whom, as caseStudyContent.ts says it. */
      role: string;
      /** The capability this work shows for THIS page; never more than the record supports. */
      what_it_proves: string;
      /** Facts a reader can check today: store listings, live URLs, release months. May be empty. */
      figures: string[];
    }
  | {
      type: 'review';
      /** The reviewer's exact Fiverr handle in data/testimonials.ts. */
      username: string;
      /** What the reviewed job was: "a Next.js restructure, not an AI-built app". */
      job: string;
      /** Why it is relevant here; quotes at most one short phrase of the review. */
      note: string;
    }
  | { type: 'asset'; href: string; label: string; what_it_proves: string };

/**
 * A door page: one entry point to the offer ladder, in the shape of `OfferPage`
 * in the content contract (Nov 2026), plus `role` and an optional `service_id`.
 * Text fields render links written [anchor](/path) or [anchor](https://…).
 */
export type OfferSolution = {
  kind: 'offer';
  role: 'offer';
  slug: string;
  primary_keyword: string;
  secondary_keywords: string[];
  /** The door's primary phrase: its anchor text in the nav, the footer, cards and the breadcrumb. */
  nav_label: string;
  h1: string;
  /** At most 50 characters, without the " | DevoraX" the template appends. */
  title: string;
  meta_description: string;
  /** The subtitle's angle. Its price ("From $2,400, with the $400 audit credited to it") is generated from offer_steps. */
  subtitle_lead: string;
  /** The ladder steps this page sells, in order. */
  offer_steps: OfferStepId[];
  /**
   * Page-specific wording for a step's price in the closing price block, where
   * the ladder's own line doesn't fit this page. Same numbers as the ladder:
   * the Offer schema still reads each step's schemaPrice.
   */
  price_notes?: Partial<Record<OfferStepId, string>>;
  /** Two to four sentences: the job, the price and the first step, true on its own. */
  hero_answer: string;
  /**
   * Three key points under the introduction: a heading of 2 to 5 words and one
   * or two sentences each, covering ground the introduction does not.
   */
  key_points?: { heading: string; body: string }[];
  /** "Is this you?": situations in buyers' words, paraphrased, never fake quotes. */
  triggers: string[];
  /** "What we check and do", step by step. */
  process: { heading: string; body: string }[];
  sections: OfferSection[];
  proof: OfferProof[];
  included: string[];
  quoted_separately: string[];
  /** Page-specific questions only; the terms render from data/terms.ts. */
  faqs: { q: string; a: string }[];
  when_not_to_hire: string;
  /** Other doors and solution pages. Slugs not published yet are skipped. */
  related_slugs: string[];
  secondary_cta?: { label: string; href: string };
  /** ISO date: the byline, the WebPage dateModified and the sitemap lastmod. */
  updated: string;
  service_id?: number;
};

export type Solution = VerticalSolution | OfferSolution;

export const SOLUTIONS: Solution[] = [
  {
    "slug": "multi-vendor-marketplace-development",
    "primary_keyword": "multi vendor marketplace development company",
    "h1": "Multi-Vendor Marketplace Development: Buyer, Vendor and Admin on One Backend",
    "title": "Multi-Vendor Marketplace Development",
    "meta_description": "Multi-vendor marketplace development from a two-person studio whose founder worked on Afriva and Dooz. Buyer app, vendor portal, admin. Fixed price.",
    "hero_answer": "DevoraX builds multi-vendor marketplaces from scratch: a buyer storefront or app, a vendor portal and an admin console over one backend, for founders whose model a template won't carry. The marketplace work behind this page is Sameem Amjad's, done for others: Afriva as an engineer at Webrange Solutions, Dooz Inspected Cars' shared NestJS backend for Dooz directly, and Pastel's iOS app as Pastel's employee since April 2026, separate from DevoraX work. A new build starts with a free 30-minute call and a written fixed-price proposal. Already on Sharetribe? [Our Sharetribe developers page](/solutions/sharetribe-developers) covers custom features and a native app.",
    "key_points": [
      {
        "heading": "Vendor rules in the database",
        "body": "A vendor's right to change only its own stock and orders is enforced in the database schema, so a request sent around the interface meets the same rule."
      },
      {
        "heading": "Exclusions written down",
        "body": "Native apps on top of a web build, multi-carrier shipping and live location tracking are listed as separate work before you sign, so the fixed price stays fixed."
      },
      {
        "heading": "One order record for all",
        "body": "Buyers, vendors and your admin see the same order record and its status, so nobody has to send an email to ask where an order is."
      }
    ],
    "sections": [
      {
        "heading": "What does a multi-vendor marketplace build include, and what is quoted separately?",
        "body": "A marketplace is four products sharing one database. A buyer surface for browse, search and checkout. A vendor portal for listings, stock and an order queue. An admin console for oversight of the catalogue and the order queue. A backend that owns the rules all three read.\n\nBase scope covers those four, plus one payment provider integration, order records with status visible to buyer and vendor, server-rendered catalogue pages so the listings are indexable, and deployment to a live environment you can open and inspect.\n\nWhat sits outside base scope is listed too, because agencies leave it ambiguous. Native iOS and Android clients on top of a web build are separate work. So are multi-carrier shipping, live location tracking, and third-party quote integrations such as financing or insurance. Each is a real integration with its own failure modes. Pretending one is a line item inside a fixed price is how fixed prices stop being fixed."
      },
      {
        "heading": "Who is this for, and which marketplace model is closest to mine?",
        "body": "This is for someone who has decided that independent sellers, rather than a single inventory, is the model, and that a template will not carry it. If a Shopify multi-vendor app covers what you need, use it. A custom build starts to pay when the vendor relationship is itself the product: verification states, inspection data, per-vendor terms, or a catalogue where every item is a single unit that retires on sale.\n\nThree of the four products named below have their own page, because the models differ more than the word marketplace suggests. Collectibles and one-of-one resale is covered at [/solutions/antiques-marketplace-app-development](/solutions/antiques-marketplace-app-development). High-ticket assets with published condition reports is at [/solutions/used-car-marketplace-app-development](/solutions/used-car-marketplace-app-development). Mobile vendor discovery, where the vendor moves and the customer is trying to find it, is at [/solutions/food-truck-ordering-app-development](/solutions/food-truck-ordering-app-development). Afriva, a general-goods marketplace, is the closest reference for a conventional catalogue with sellers, stock levels and delivery."
      },
      {
        "heading": "Which marketplaces has DevoraX's founder worked on?",
        "body": "Three: Afriva, built at Webrange Solutions; Pastel, the antiques marketplace where Sameem works as Pastel's employee; and Dooz Inspected Cars, Dooz's own used-car marketplace in Jordan, which hired Sameem directly.\n\nAfriva is a four-role marketplace on Next.js 15 and Supabase: admin, manager, seller and buyer dashboards with real-time order tracking. Sameem worked on it as an engineer at Webrange Solutions, on the Next.js 15 front end, the seller dashboard for inventory, pricing and order status, and the Supabase data layer. Its public link is a demo build of the buyer storefront, at afriva-buyer.vercel.app.\n\nPastel is a US-based marketplace for antiques, vintage decor and collectible art, built on Sharetribe and live at mypastel.com and on the App Store. Since April 2026 Sameem has been a Senior Software Developer on Pastel's team, as Pastel's employee, working on its iOS app, which first launched in November 2025, before he joined. DevoraX work is separate from his job at Pastel. Dooz Inspected Cars runs an Angular web client and iOS and Android apps over one backend, and Dooz hired Sameem directly to work on that shared NestJS backend. Dooz's Google Play listing shows 100K+ downloads.\n\nFood Magnet, also named on this page, is not a marketplace. It is a food truck discovery platform: a Flutter app and a React admin console on AWS Lambda, with live location tracking and Stripe. Sameem worked on it as an engineer at Zencloud, on a product that already existed. It is adjacent work, not a fourth marketplace."
      },
      {
        "heading": "How do you keep one vendor from reading another vendor's data?",
        "body": "A vendor boundary is a database property, not an interface one. A client-side check hides a button; it does not stop a request, because the request can be issued without the interface. Ownership is expressed in the schema, and the check runs where every client has to pass.\n\nOn Afriva that meant managed Postgres rather than a document store. Vendors own products, products appear in orders, orders split into shipments, and foreign keys and constraints give one authoritative place to state that a seller cannot mutate another seller's stock. Supabase also bundles authentication with the database, so the identity that signed a user in is the identity Postgres sees on the query, which removes the drift between what the interface believes and what the database permits.\n\nDooz's backend reaches the same place differently: valuation, inspection status and listing availability resolve server-side, so NestJS owns the rules and the three clients render state."
      },
      {
        "heading": "What happens when one basket spans several vendors?",
        "body": "This is where the complexity concentrates. It is the difference between a marketplace and a shop. One buyer checkout becomes several vendor orders with separate dispatch timelines, so the data model has to represent a parent purchase and its child shipments, then reassemble them into one legible screen.\n\nStock is the concurrency problem underneath it. With vendors listing independently, the same item can enter several baskets at once, so inventory decrements have to be atomic in the database rather than read-modify-write in application code. On a catalogue of single units, as with Pastel and Dooz, it is sharper still: a sold item has to disappear from search, saved lists and every client immediately, because stale availability destroys the trust the platform exists to create.\n\nStatus is the third piece. On Afriva, Supabase Realtime streams Postgres changes over a websocket, so a buyer's tracking view updates from the same row operations just edited. No polling interval, no reconciliation step."
      },
      {
        "heading": "How does the build run, and what do you need from me?",
        "body": "It starts with a free 30-minute discovery call. For a new build, the output is a written fixed-price proposal setting out scope, what is included, what is excluded, and the price. Nothing is built before that document is agreed.\n\nAlready built, or left half-built? Most work starts with the $400 audit, credited to the fix. Two exceptions: Sharetribe Web Template work with no custom code is quoted from your requirements, and a payments-only fix can be quoted on the free call. New builds get a fixed-price proposal, from $2,900. Every step and its price is on the [pricing page](/pricing), and [the vibe code audit page](/solutions/fix-vibe-coded-app) sets out what the $400 audit checks.\n\nWhat we need from you is decisions, not documents. Who the roles are and what each is allowed to do. What states a vendor account can be in, and what each state permits. What a completed order means, and who is owed money at that point. Whether the catalogue holds stock-keeping items with quantities or single units that retire when sold. Those four answers determine the schema, and the schema is the expensive thing to change later.\n\nWe also need access to whatever the integrations require: a payment provider, hosting, and any third-party service the scope names. Your marketplace runs on your own accounts by default: the Apple and Google developer accounts, Stripe and hosting. If you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account."
      },
      {
        "heading": "How is it priced?",
        "body": "A new build is fixed price, agreed in writing before work starts. No hourly billing and no retainer required to reach launch. The published starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are indicative starting points, not quotes. A four-role marketplace with split fulfilment and a payment integration is not an MVP Starter build, and we would rather say so here than on the call.\n\nFixed price is only honest if scope is honest, which is why the exclusions are stated on this page rather than discovered in month two. Add a requirement mid-build and it is quoted as a change, and you decide whether to take it. The alternative, absorbing it silently, is how an agency ends up shipping the cheapest possible version of something it promised.\n\nSameem Amjad and Usman do the work. Sometimes a designer or another specialist joins a project, and we name them to you before they start. You are not handed to an account manager after signing."
      },
      {
        "heading": "What happens after launch, and who owns the code?",
        "body": "You own all code and IP on final payment, and the accounts the marketplace runs on are yours by default, as the build section above says.\n\nDefects in the work we delivered are fixed free for 35 days after handover. After that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change, and you can choose between them once you can see the traffic.\n\nVendor onboarding is the part marketplace buyers ask about most. Afriva has admin and manager surfaces for catalogue and order oversight, and Pastel lets sellers open shops and list their own pieces. How a new vendor is reviewed and approved is your policy to set, and recruiting and vetting sellers stays yours."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If a Shopify multi-vendor app, Sharetribe's hosted product or a marketplace template covers your model, buy it. It is cheaper than anything here and it will be running next week. Pastel itself is built on Sharetribe rather than on custom payment code, and the case for that generalises: marketplace money movement is a state machine with commissions, held funds, refunds, disputes and cross-border payouts, and reimplementing it is a poor trade without a reason.\n\nDo not hire us if you need a committed launch date before anyone has seen the scope. We do not publish build timelines and will not invent one on a call.\n\nDo not hire us if you need a certified compliance posture. DevoraX holds no certifications and has run no compliance audits, and a marketplace carrying regulated financial products should hire a firm that can evidence one. And if you have not yet decided what a vendor is allowed to do, that decision comes before a supplier does."
      }
    ],
    "proof": [
      {
        "project_id": 32,
        "name": "Afriva E-Commerce Platform",
        "one_line": "A four-role multi-vendor marketplace on Next.js 15 and Supabase, with separate admin, manager, seller and buyer dashboards and real-time order tracking. Sameem worked on it as an engineer at Webrange Solutions.",
        "what_it_proves": "Role-separated dashboards from one deployment, vendor ownership expressed in the Postgres schema rather than the interface, and order tracking streamed from database changes instead of polled. The closest reference for a conventional catalogue marketplace with sellers, stock and delivery.",
        "figures": [
          "Demo build of the buyer storefront at afriva-buyer.vercel.app"
        ]
      },
      {
        "project_id": 23,
        "name": "Pastel Marketplace",
        "one_line": "A US-based marketplace for antiques, vintage decor and collectible art, built on Sharetribe and live on the web, iOS and Android. Since April 2026 Sameem has worked on its iOS app as a Senior Software Developer on Pastel's team, as Pastel's employee. DevoraX work is separate from his job at Pastel.",
        "what_it_proves": "A live catalogue of one-of-one pieces that retire on sale rather than decrementing stock, with marketplace money movement handled by Sharetribe's transaction process rather than custom checkout code, and web and app clients reading one marketplace. Sameem's part, in his job at Pastel, is the iOS app.",
        "figures": [
          "Live at mypastel.com",
          "On the App Store as Pastel - Antique Marketplace (id6753628917), first released November 2025"
        ]
      },
      {
        "project_id": 25,
        "name": "Dooz Inspected Cars",
        "one_line": "A used-car marketplace in Jordan: an Angular web client and iOS and Android apps over one NestJS and PostgreSQL backend. Dooz hired Sameem directly for that shared backend.",
        "what_it_proves": "A catalogue where every listing is a unique unit, inspection reports published as part of the listing, a financing calculator and insurance in the buying flow, and valuation and availability resolved behind one API so three clients cannot disagree on a price.",
        "figures": [
          "Live at dooz.com",
          "On Google Play as com.dooz.app, where the listing shows 100K+ downloads (https://play.google.com/store/apps/details?id=com.dooz.app)",
          "On the App Store as Dooz Cars (id1627030530)"
        ]
      },
      {
        "project_id": 14,
        "name": "Food Magnet",
        "one_line": "A food truck discovery and vendor platform: a Flutter mobile app and a React admin dashboard on an AWS Lambda serverless backend. Sameem worked on this existing product as an engineer at Zencloud.",
        "what_it_proves": "Two clients, one mobile and one admin web, over a single serverless backend, with four user roles: admin, manager, vendor and customer. Live vendor location tracking, Stripe payments, and Firebase plus OneSignal for realtime updates and push. It is not a marketplace build: it covers discovery, menus and vendor profiles rather than a multi-vendor checkout.",
        "figures": [
          "Live at foodmagnet.app",
          "On Google Play as com.foodmagnet.foodTruck",
          "On the App Store as Food Magnet Vendor (id6444549450)"
        ]
      }
    ],
    "included": [
      "Buyer-facing storefront or app: catalogue browse, search, filtering and checkout",
      "Vendor portal: listing creation, stock and inventory, and an order queue",
      "Admin console: catalogue oversight, order oversight and user management",
      "Role-separated authentication, with authorisation enforced on the server rather than in the interface",
      "A relational schema in which vendor ownership of listings, stock and orders is a database constraint",
      "One payment provider integration for checkout",
      "Order records with status visible to the buyer, the vendor and the admin",
      "Server-rendered catalogue and listing pages, so the marketplace is indexable rather than an empty shell",
      "Deployment to a live environment you can open and inspect",
      "A written fixed-price scope agreed before any code is written"
    ],
    "quoted_separately": [
      "Native iOS and Android clients added on top of a web build",
      "Multi-carrier and insured shipping integrations",
      "Live location tracking of vendors or couriers, as on Food Magnet",
      "Third-party quote integrations such as financing or insurance, as on Dooz",
      "Support and maintenance after the 35-day defect window: monthly care at $1,500 a month, or a single release quoted per change",
      "New features after handover, quoted before they start",
      "Vendor recruitment, catalogue data entry and content production"
    ],
    "when_not_to_hire": "If a Shopify multi-vendor app, Sharetribe's hosted product or an off-the-shelf template covers your model, buy it. It is cheaper and faster than a custom build, and Pastel itself is built on Sharetribe rather than on custom payment code. Do not hire us if you need a committed launch date before anyone has seen the scope; dates come after the scope is agreed, not before. Do not hire us if you need a certified compliance posture. DevoraX holds no certifications and has run no compliance audits, and a marketplace carrying regulated financial products should hire a firm that can evidence one.",
    "faqs": [
      {
        "q": "Should I use Sharetribe or a Shopify multi-vendor app instead of a custom build?",
        "a": "If your model fits one, yes: they cost less and run straight away. A custom build pays off when the vendor relationship is the product, such as verification states, inspection data, per-vendor terms or a catalogue of single units that retire when sold. [Pastel](/projects/23) (Sameem's employer, Pastel), where Sameem works on the iOS app as Pastel's employee, is itself built on Sharetribe. Already on Sharetribe? See [Sharetribe Developers](/solutions/sharetribe-developers)."
      },
      {
        "q": "How long does a marketplace build take?",
        "a": "We don't publish build timelines, and we won't give you one on a first call. A two-role catalogue and a four-role platform with split fulfilment and live tracking are different projects. The written proposal after the discovery call fixes the scope, the exclusions and the price. For a marketplace that already exists, a finish sprint usually takes 1–2 weeks, and the audit sets the number of weeks first."
      },
      {
        "q": "Can you build the mobile apps as well as the web marketplace?",
        "a": "Yes, quoted separately from the web build, because apps have their own release process. At [Pastel](/projects/23) (Sameem's employer, Pastel), Sameem has worked on the iOS app as Pastel's employee since April 2026, separately from DevoraX work. [Dooz Inspected Cars](/projects/25) (Sameem's direct client) hired him for the NestJS backend that its iOS and Android apps share with its website."
      },
      {
        "q": "Do you handle marketplace payments and payouts to vendors?",
        "a": "Payments through a provider, yes; payouts to vendors need more care. Payouts, held funds, commissions and disputes are a much larger surface than checkout, which is why a hosted engine such as Sharetribe runs them through its own transaction process. [Food Magnet](/projects/14) (As an engineer at Zencloud) takes payments through Stripe. Which route suits you depends on your commission model and where your sellers are."
      },
      {
        "q": "Who owns the marketplaces you show as examples?",
        "a": "Their own businesses, not DevoraX. [Afriva](/projects/32) (As an engineer at Webrange Solutions) was built at Webrange Solutions. [Pastel](/projects/23) (Sameem's employer, Pastel) is Pastel's own antiques marketplace, where Sameem works on the iOS app as its employee. [Dooz Inspected Cars](/projects/25) (Sameem's direct client) is Dooz's own used-car marketplace in Jordan, which hired him for its shared NestJS backend. DevoraX is how Sameem and Usman take this work directly now."
      },
      {
        "q": "What is the first step for a new marketplace?",
        "a": "A free 30-minute discovery call. Bring your roles, your commission model and whether the catalogue holds stock-keeping items or single units, because those answers shape the schema. For a new build, the output is a written fixed-price proposal covering scope, exclusions and price. If a template would serve you better, the proposal will say so."
      }
    ],
    "word_count": 3275,
    "updated": "2026-11-11T00:00:00.000Z",
    "role": "hub",
    "related_slugs": [
      "antiques-marketplace-app-development",
      "used-car-marketplace-app-development",
      "food-truck-ordering-app-development"
    ],
    "service_id": 2
  },
  {
    "slug": "antiques-marketplace-app-development",
    "primary_keyword": "antiques marketplace app development company",
    "h1": "Antiques marketplace app development for provenance-led resale",
    "title": "Antiques Marketplace App Development",
    "meta_description": "Antiques marketplace app development for one-of-one listings, seller shops, held funds and insured shipping, from a two-person studio. Fixed price.",
    "hero_answer": "DevoraX is a two-person software studio that builds marketplaces for one-of-one goods. Its founder, Sameem Amjad, works on the iOS app of Pastel, a live antiques marketplace at mypastel.com: since April 2026 he has been a Senior Software Developer on Pastel's team, as Pastel's employee. DevoraX work is separate from his job at Pastel. The studio takes antiques, collectibles and consignment marketplace builds directly. A new build is fixed price, quoted after a free 30-minute call.",
    "sections": [
      {
        "heading": "What does an antiques marketplace build include?",
        "body": "Base scope is a working two-sided marketplace. A buyer-facing storefront with curated collections and individual listing pages. Seller onboarding with verification held on the account. Listing creation built around heavy photography and a provenance narrative. A transaction flow that holds funds between payment and fulfilment. Shipping with rates, labels, tracking and insured cover. An admin console for curation and order oversight.\n\nPastel shows one way to split that work. It is built on Sharetribe, which carries the marketplace and its transaction process, and it uses Shippo for shipping labels. The two parts that hold legal and financial risk, money movement and cross-border logistics, sit inside platforms built for them instead of being reimplemented in application code. A custom build can make the same split or own more of the stack itself; the proposal says which, and why.\n\nThe full in-scope and out-of-scope lists are on this page. The short version is that the marketplace works end to end, and anything requiring a commercial contract of yours is scoped and quoted separately."
      },
      {
        "heading": "Who is this built for?",
        "body": "Businesses trading one-of-one goods where the value sits in the object's history rather than a spec sheet. Antiques dealers, collectibles resale platforms, estate and consignment businesses, and anyone running a curated catalogue where each item sells once and is then gone.\n\nThe defining constraint is the data model, not the category. A conventional catalogue assumes a product record with variants, stock depth and a price repeated across identical units. An antique inverts all three. Each listing is a single record whose worth is carried by provenance, condition and the evidence behind them, and once it sells it has to retire cleanly rather than decrement a count.\n\nIf your catalogue has restock, SKUs and repeat units, the general page is the better starting point: [/solutions/multi-vendor-marketplace-development](/solutions/multi-vendor-marketplace-development). Come back here when the objects are unique and trust is the thing you are actually selling."
      },
      {
        "heading": "What antiques marketplace work stands behind this page?",
        "body": "One product in the category. Pastel is a US-based marketplace for antiques, vintage decor and collectible art, built on Sharetribe, running publicly at mypastel.com and listed on the App Store as Pastel - Antique Marketplace. Sameem Amjad, DevoraX's founder, has been a Senior Software Developer on Pastel's team, as Pastel's employee, since April 2026, working on its iOS app. The iOS app first launched in November 2025, before he joined. Pastel is his employer, not a DevoraX client, and DevoraX work is separate from his job at Pastel. The write-up is at [/projects/23](/projects/23).\n\nAfriva is the second reference, for the operations side rather than the category. It is a four-role marketplace on Next.js 15 and Supabase, with admin, manager, seller and buyer dashboards and order tracking streamed from Postgres. Sameem worked on it as an engineer at Webrange Solutions. Its public link is a demo build of the buyer storefront, at afriva-buyer.vercel.app, and the write-up is at [/projects/32](/projects/32).\n\nPastel's storefront and app, and Afriva's demo, are open to inspection before you speak to us."
      },
      {
        "heading": "How do you model provenance and one-of-one listings?",
        "body": "Provenance is narrative and evidence, not attributes, so it does not fit a variant table. In an antiques marketplace the weight of a listing sits on photography and the supporting history: where the piece came from, who owned it, what condition it is in now, and what backs those claims. Pastel describes every listing as telling a story, with documentation that lets buyers shop with confidence. The images have to substitute for handling the object.\n\nThat has two engineering consequences. Image handling becomes the dominant cost on every page, so image sizing, delivery and caching deserve design time of their own rather than a default. And listing state becomes delicate. A sold piece is gone permanently, so the catalogue has to retire it cleanly instead of decrementing inventory, and every surface showing it has to agree that it is gone.\n\nIt is also why that state belongs on the backend. When a web storefront and one or more apps read the same listing, the rule that a piece is sold has to live in one place, rather than in a second implementation of the same rule on each client."
      },
      {
        "heading": "How do you keep one seller's data out of another seller's hands?",
        "body": "Verified status belongs on the account rather than drawn in the interface. It has to be stored, checked when a listing is created, and surfaced anywhere that seller appears. A buyer who sees the mark on a profile but not on the listing learns to distrust both, which is the whole reason it lives in one place.\n\nSeparation itself belongs in the data layer. Afriva's backend is managed Postgres through Supabase, so vendors owning products and products appearing in orders live in the schema rather than being reassembled in application code. That is where an ownership rule goes: expressed once and checked by the database, rather than implied by which button a screen renders. Supabase also bundles authentication with the database, so the identity that signs a user in is the identity the query runs as. Hiding a button is not a permission model.\n\nThe tenancy question in more depth: [/solutions/multi-vendor-marketplace-development](/solutions/multi-vendor-marketplace-development)."
      },
      {
        "heading": "How is money held between payment and the piece arriving?",
        "body": "A marketplace payment is not a checkout. Funds move from buyer to platform, are held while the piece is packed and shipped, and reach the seller once the exchange completes. Commissions, refunds, disputes and payouts to sellers in different countries all hang off that single flow. Sharetribe, which Pastel is built on, models it as a state machine, so the path between enquiry, payment, fulfilment and completion is enforced by infrastructure built for two-sided commerce. Each storefront or app reads a transaction's current state and never takes custody of funds.\n\nShipping is the other half, and it is where antiques marketplaces usually break. Every sale is a one-off shipment. A framed print, a chandelier and a chest of drawers share no packaging profile, no dimensional weight and no obvious carrier, and sellers are not logistics professionals. A multi-carrier service such as Shippo, which Pastel uses for labels, sits in front of many carriers behind one interface: rate selection, label purchase, tracking and insured cover. For an irreplaceable object there is no replacement unit, so cover has to attach to the shipment itself."
      },
      {
        "heading": "What does the build look like, and what do you need from me?",
        "body": "It starts with a free 30-minute discovery call. After it you get a written fixed-price proposal with the scope enumerated. Nothing is built before you have agreed that document, and we do not bill hourly.\n\nWhat we need from you is the commercial decisions, because they drive the data model and we cannot invent them. Your category and period taxonomy. Your verification policy, meaning what a seller supplies before they get the mark and who reviews it. Your commission and refund rules. Which countries you ship to and what you will not ship at all. Your photography standard for listings. And accounts in your own name with the payment and shipping providers: your marketplace runs on your own accounts by default, because the money and the carrier relationships should be yours from the first day. If you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account.\n\nWe deliberately publish no build timeline. Scope determines it, and quoting a duration before the scope exists is how these projects go wrong."
      },
      {
        "heading": "How is it priced, and what happens after launch?",
        "body": "Fixed price. You get a written proposal after the discovery call and the number does not move unless the scope does. Published starting points are MVP Starter from $2,900, Growth from $7,500, and Enterprise custom-scoped. They are indicative starting points, not quotes. A marketplace with held funds, seller verification and insured international shipping does not sit at the entry tier, and we will say so on the call rather than after you have signed something.\n\nYou own all code and IP on final payment. It lives in a repository you control and deploys to accounts in your name by default; if you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account. There is no licence, no hosting lock, and nothing you have to keep paying us for in order to keep trading.\n\nDefects in the work we delivered are fixed free for 35 days after handover. After that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If you need timed auctions with live bidding, reserve prices and proxy bids, do not hire us. Nothing in the DevoraX portfolio includes an auction engine, and bidding concurrency is its own discipline. Buy an auction platform, or hire a team that has shipped one.\n\nIf you want people you can redirect week to week on an hourly retainer, we are the wrong shape: the scope has to settle before the work starts.\n\nIf your budget sits below our published MVP starting point, a hosted marketplace product will serve you better than a custom build. Sharetribe, which Pastel is built on, sells its own platform, and starting there and replacing it later is a legitimate plan. DevoraX is also two people, Sameem Amjad and Usman. If you need ten engineers next month, that is not us."
      }
    ],
    "proof": [
      {
        "project_id": 23,
        "name": "Pastel Marketplace",
        "one_line": "A US-based marketplace for antiques, vintage decor and collectible art, built on Sharetribe and live at mypastel.com and on the App Store. Since April 2026 Sameem has worked on its iOS app as a Senior Software Developer on Pastel's team, as Pastel's employee. DevoraX work is separate from his job at Pastel.",
        "what_it_proves": "The category itself: one-of-one listings weighted on photography and documentation, seller shops, a Sharetribe transaction process that carries each order from payment to fulfilment, and shipping labels bought inside the marketplace. Sameem's part, in his job at Pastel, is the iOS app.",
        "figures": [
          "Live at mypastel.com",
          "On the App Store as Pastel - Antique Marketplace (id6753628917), first released November 2025"
        ]
      },
      {
        "project_id": 32,
        "name": "Afriva E-Commerce Platform",
        "one_line": "A four-role multi-vendor marketplace on Next.js 15 and Supabase, with separate admin, manager, seller and buyer dashboards and order tracking streamed from Postgres. Sameem worked on it as an engineer at Webrange Solutions.",
        "what_it_proves": "The operations side an antiques platform needs once real sellers are on it: role-separated dashboards each querying their own slice, a relational Postgres model where ownership can be expressed in the schema rather than in interface checks, and delivery status that reaches the buyer as an event instead of a poll.",
        "figures": [
          "Demo build of the buyer storefront at afriva-buyer.vercel.app"
        ]
      }
    ],
    "included": [
      "Buyer storefront with curated collections and one-of-one listing pages, server-rendered so individual pieces are indexable",
      "Seller onboarding with verified status stored on the account and checked when a listing is created",
      "Listing creation built for heavy photography and a provenance and condition narrative",
      "Clean retirement of sold items rather than stock decrements, consistent across every surface",
      "Marketplace transaction flow holding funds between payment and fulfilment, with commission and payout handling",
      "Multi-carrier shipping integration: rate selection, label purchase, tracking and insured cover",
      "Admin console for composing and publishing curated collections without a code change",
      "Order and delivery status visible to both buyer and seller",
      "Deployment to hosting and third-party accounts in your name by default, with the code in a repository you own"
    ],
    "quoted_separately": [
      "iOS and Android apps on top of the web marketplace, each priced as its own line",
      "Timed auctions, live bidding and reserve prices. Nothing in the DevoraX portfolio includes an auction engine",
      "Integrations with third-party appraisal, authentication or certificate services",
      "Migration of an existing catalogue and its photography from your current platform",
      "Support and maintenance after the 35-day defect window: monthly care at $1,500 a month, or a single release quoted per change",
      "New features after handover, quoted before they start",
      "Storefront localisation and multi-currency display beyond what the payment and shipping providers give you"
    ],
    "when_not_to_hire": "If you need timed auctions with live bidding, reserve prices and proxy bids, hire someone else. Nothing in the DevoraX portfolio includes an auction engine, and bidding concurrency is its own discipline. If you want an hourly team you can redirect weekly, our fixed-price model will frustrate you. If your budget sits below our published MVP starting point, a hosted marketplace product such as Sharetribe will serve you better. And DevoraX is two people.",
    "faqs": [
      {
        "q": "Have you actually built an antiques marketplace, or just marketplaces in general?",
        "a": "Not as DevoraX: no DevoraX client has commissioned one yet. DevoraX's founder, Sameem Amjad, works on one in his job: Pastel, a live antiques marketplace at mypastel.com, built on Sharetribe. Since April 2026 he has been a Senior Software Developer on Pastel's team, as Pastel's employee, working on its iOS app, which first launched in November 2025, before he joined. DevoraX work is separate from his job at Pastel, and the write-up is at [/projects/23](/projects/23)."
      },
      {
        "q": "Do you build a mobile app as well as the web marketplace?",
        "a": "Yes, as a separately priced line. Sameem works on Pastel's iOS app in his job there: since April 2026 he has been a Senior Software Developer on Pastel's team, as Pastel's employee. So a marketplace app over a shared backend is familiar ground, and DevoraX work is separate from his job at Pastel. In a proposal, iOS and Android each get their own line rather than being thrown in with the web build."
      },
      {
        "q": "How do you stop one seller reading another seller's data?",
        "a": "In the data layer, not the interface. Afriva's backend is Postgres through Supabase, which is where an ownership rule belongs: expressed once in the schema and checked by the database rather than implied by which button renders. Supabase bundles authentication with the database, so the identity that signs a user in is the identity the query runs under. Hiding a button is not a permission model."
      },
      {
        "q": "Can you build timed auctions and live bidding?",
        "a": "Not on evidence we can show you. Nothing in the DevoraX portfolio includes an auction engine, so this page will not tell you otherwise. If auctions are the core of your product, hire a team that has built one. If they are a later phase sitting on top of a fixed-price marketplace, raise it at the scoping call and we will tell you plainly whether we would take it."
      },
      {
        "q": "Should I use Sharetribe or commission a custom build?",
        "a": "Possibly both. Pastel is built on Sharetribe. Marketplace money movement is a state machine with commissions, refunds, disputes and cross-border payouts, and reimplementing it in application code is a large and risky surface. If Sharetribe's own front end will do, start there. A custom storefront or app on top of it earns its cost when browsing is the product, which is usually true in antiques."
      },
      {
        "q": "What does an antiques marketplace cost to build?",
        "a": "You get a fixed price in writing after a free 30-minute discovery call, and it does not move unless the scope does. Published starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are indicative starting points rather than quotes. A build with held funds, seller verification and insured international shipping sits above the entry tier, and we will say so on the call."
      },
      {
        "q": "Who owns the code when it is finished?",
        "a": "You do. All code and IP transfer to you on final payment. It lives in a repository you control and, by default, deploys to accounts in your name, including the payment and shipping providers; if you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account. There is no licence fee and nothing you have to keep paying us in order to keep the marketplace running. If you want us to keep working on it after the 35-day defect window, monthly care is $1,500 a month, or a single release is quoted per change."
      },
      {
        "q": "How do you handle insured shipping for fragile, irreplaceable pieces?",
        "a": "Through one multi-carrier integration rather than carrier-by-carrier work. Shippo, which Pastel uses for labels, is one such service. The seller sees rate options, buys a label, and the shipment becomes trackable for both parties. Insurance attaches to the shipment itself, which matters because a one-of-one object has no replacement unit. We do not underwrite anything. We integrate the provider that does and keep the tracking state visible while the piece is in transit."
      }
    ],
    "word_count": 2709,
    "updated": "2026-11-08T00:00:00.000Z",
    "role": "spoke",
    "hub": "multi-vendor-marketplace-development",
    "related_slugs": [
      "used-car-marketplace-app-development"
    ],
    "service_id": 2
  },
  {
    "slug": "used-car-marketplace-app-development",
    "primary_keyword": "used car marketplace app development with inspection reports",
    "h1": "Used car marketplace app development, with inspection reports inside the listing",
    "title": "Used Car Marketplace App Development",
    "meta_description": "Used car marketplace development: inspection reports inside the listing, financing, insurance and dealer accounts. Fixed price, from a two-person studio.",
    "hero_answer": "DevoraX builds used-car marketplaces where the inspection report is part of the listing rather than a PDF sent on request. The reference is Dooz Inspected Cars, a used-car marketplace in Jordan with an Angular web client, iOS and Android apps, inspection reports inside the listing, and financing and insurance in the buying flow. Dooz hired DevoraX's founder, Sameem Amjad, directly to work on the NestJS backend those three clients share. It is live on the web and both app stores, and its Google Play listing shows 100K+ downloads.",
    "sections": [
      {
        "heading": "What do you actually get in a used car marketplace build?",
        "body": "Three layers, and they are not equally hard. The catalogue is the straightforward part: vehicles, photos, faceted search over make, model, year, mileage and price, server-rendered so listing pages are readable by crawlers. The inspection layer is the part most quotes underestimate. The transaction layer, where a reservation, a financing application and a unique physical asset must agree, is where the engineering cost sits.\n\nBase scope is listed in full below. In short: a buyer-facing web marketplace, a dealer account with its own listing tools, an admin console for reviewing inspections and approving listings, structured inspection records rendered inside the listing, a server-side financing calculator, and reservation handling so a sold car leaves search everywhere at once.\n\nNative apps, insurer integrations and automated valuation are each quoted on their own rather than folded into a base price."
      },
      {
        "heading": "Has DevoraX's founder worked on one of these before?",
        "body": "Once, and the product is public, so you can check it rather than take anyone's word. Dooz Inspected Cars runs at dooz.com, the Android app is on Google Play as com.dooz.app, where the listing shows 100K+ downloads, and the iOS app is on the App Store as Dooz Cars. Sameem Amjad, DevoraX's founder, worked on the NestJS backend that serves all three.\n\nThe product addresses the problem this page describes. Buyers struggle to verify a used car's condition, and financing complicated enough pushes deals offline. On Dooz every listed car is an inspected car, the inspection report is published as part of the listing, and a financing calculator and insurance sit in the same flow as a vehicle whose condition has already been established. The write-up is at [/projects/25](/projects/25)."
      },
      {
        "heading": "How does an inspection become something a buyer can filter on?",
        "body": "By being data rather than a document. A PDF tells a buyer about one car. A structured inspection lets them compare every car against the same rubric, which is the point of a verified marketplace.\n\nDooz publishes the inspection report as part of the listing rather than sending it on request. On the Dooz backend, PostgreSQL is the system of record, and vehicles, inspection records, listings and transactions are held as related data rather than as documents.\n\nFor your own build, that shape sets requirements we put in the proposal rather than leave to discovery. Each checkpoint needs its own identity and result so it can be queried. The rubric needs versioning, because a report captured under one revision still has to render after the checklist changes. Photographic evidence needs to be addressable per point and delivered efficiently to a phone. Those are scope lines for your system."
      },
      {
        "heading": "How do financing and insurance fit into the buying flow?",
        "body": "Buying, financing and insuring in one place is an integration problem more than an interface problem. A financing calculator has to model term, rate and deposit consistently, and the figure on the listing page has to be the figure at checkout. Dooz resolves financing terms, valuation, inspection status and listing availability server-side rather than in the clients.\n\nInsurance is harder because the quote is not yours. A third-party response arrives on someone else's latency budget and can be slow or absent. Anything the platform does not control is treated as unreliable by design: timeouts, retries and an explicit degraded state, so one slow insurer does not block the rest of the flow.\n\nNestJS module boundaries let listings, inspections, valuation, financing and insurance live as separate domains behind stable interfaces, as they do on the Dooz backend, and typed contracts mean a partner changing a field fails at compile time rather than showing a buyer a wrong number."
      },
      {
        "heading": "How do you keep dealer accounts separated from each other?",
        "body": "A marketplace with independent dealers is a multi-vendor system, and the rule that matters is that one seller cannot read or mutate another seller's stock. The wrong place to enforce that is the interface. A dashboard that hides a row is a presentation decision; a query that cannot return the row is a boundary.\n\nAfriva is the work that evidences this. Four roles, admin, manager, seller and buyer, each with a dashboard querying only the slice of data that role is entitled to, on Supabase's managed Postgres. Because Supabase bundles authentication with the database, the identity that signs a user in is the identity Postgres sees on the query, so ownership rules live once in the schema rather than in every screen. Sameem worked on Afriva as an engineer at Webrange Solutions, and its public link is a demo build.\n\nAfriva is general-goods e-commerce, not automotive. It evidences the separation model; Dooz supplies the vehicle domain."
      },
      {
        "heading": "What does the build process look like, and what do you need from me?",
        "body": "It starts with a free 30-minute discovery call and ends with a written fixed-price proposal listing scope line by line. There is no hourly billing, so the scoping conversation has to be honest on both sides. An under-specified fixed price is bad for you and worse for us.\n\nThe thing we need from you first is the inspection rubric. Not a description of it, the actual checklist, with the points, the result types and the pass criteria, because that document determines the data model and every filter built on top of it. We also need to know which lenders and insurers you intend to work with and whether they expose an API, whether listings come from your own inspectors or independent dealers, and where existing inventory lives. If you do not have a rubric yet, that is a scoping conversation rather than a blocker."
      },
      {
        "heading": "How is this priced?",
        "body": "Fixed price, in writing, after the discovery call. DevoraX publishes indicative starting points: MVP Starter from $2,900, Growth from $7,500, Enterprise custom-scoped. Those are starting points for the tiers, not quotes for this build. A marketplace with a structured inspection layer, dealer accounts and lender integrations does not sit in the entry tier, and we would rather say so here than in a third meeting.\n\nWhat moves the number is rarely the catalogue. It is the count of third-party integrations, the depth of the inspection rubric, whether native apps ship alongside the web marketplace, and whether existing inventory has to be migrated. Each is its own line in the proposal, so one can be cut without reopening the whole scope.\n\nNo hourly billing means we absorb the cost of our own estimation errors. It also means a scope change is re-quoted in writing rather than quietly absorbed."
      },
      {
        "heading": "What happens after launch, and who owns the code?",
        "body": "You own all code and IP on final payment. That is not a negotiated extra. The repository, the schema, the deployment configuration and the inspection data model are yours, and nothing is retained as a bargaining chip.\n\nDefects in the work we delivered are fixed free for 35 days after handover. After that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change. If you have your own engineers, handover is a repository and a walkthrough, and you may need neither.\n\nTwo things to plan for regardless of who maintains it. Third-party integrations break on someone else's schedule, so a lender changing a payload is an operational event rather than a build defect. And the inspection rubric will change. A checklist that grows or reorganises has to leave reports captured under the old revision still readable, which is why rubric versioning is base scope in the first release rather than a repair job after the first revision."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If what you want is a classifieds board, where sellers post, buyers call and nobody verifies anything, do not commission a custom build. An off-the-shelf listings platform does that for a fraction of the cost, and the inspection engineering would be dead weight. If verification is not part of your product, nothing on this page applies to you.\n\nDo not hire us to run the inspection operation. We build the software that captures, versions and publishes a report. Recruiting inspectors and standing up the physical network is a different business, and not one we have done.\n\nAnd if procurement requires hourly billing, a named team of five, or a compliance certification on file, we are the wrong supplier. DevoraX is two people, Sameem Amjad and Usman, founded in 2022, and we work fixed-price. We will not clear those bars."
      }
    ],
    "proof": [
      {
        "project_id": 25,
        "name": "Dooz Inspected Cars",
        "one_line": "A used-car marketplace in Jordan for buying, financing and insuring inspected vehicles: an Angular web client and iOS and Android apps over one NestJS backend on PostgreSQL. Dooz hired Sameem directly for that shared backend.",
        "what_it_proves": "A used-car marketplace where the inspection report is published as part of the listing, with a financing calculator and insurance in the same flow, and valuation, financing terms and listing availability resolved server-side so the web client and both apps show the same answer. Live on the web, Google Play and the App Store.",
        "figures": [
          "Live at dooz.com",
          "On Google Play as com.dooz.app, where the listing shows 100K+ downloads (https://play.google.com/store/apps/details?id=com.dooz.app)",
          "On the App Store as Dooz Cars (id1627030530)"
        ]
      },
      {
        "project_id": 32,
        "name": "Afriva E-Commerce Platform",
        "one_line": "A multi-vendor e-commerce marketplace on Next.js 15 and Supabase, with separate admin, manager, seller and buyer dashboards and real-time delivery tracking over Postgres changes. Sameem worked on it as an engineer at Webrange Solutions.",
        "what_it_proves": "Seller separation pushed down into the data layer rather than left as a UI concern, four role-scoped dashboards from one deployment, and server-rendered catalogue pages a crawler can read. General goods rather than automotive, so it evidences the multi-vendor mechanics a dealer marketplace needs, not vehicle domain knowledge.",
        "figures": [
          "Demo build of the buyer storefront at afriva-buyer.vercel.app"
        ]
      }
    ],
    "included": [
      "Buyer-facing web marketplace with server-rendered listing and category pages, so the catalogue is indexable rather than an empty shell",
      "Faceted vehicle search over make, model, year, mileage, price and inspection outcomes, indexed and paginated server-side",
      "Structured inspection records: every checkpoint stored with its own identity and result, photographic evidence addressable per point, and a versioned rubric so historic reports still render",
      "The inspection report rendered inside the listing, not attached as a downloadable file",
      "Seller or dealer accounts with listing creation, stock state and a dashboard scoped to their own inventory",
      "Admin console for reviewing inspections, approving listings and policing the catalogue",
      "Ownership and role rules enforced in the database schema, not only in the interface",
      "Financing calculator with term, rate and deposit resolved server-side so every screen shows the same figure",
      "Reservation and availability handling, so a reserved or sold vehicle disappears from search and saved lists everywhere",
      "Buyer accounts, saved vehicles and enquiry capture"
    ],
    "quoted_separately": [
      "Native iOS and Android apps alongside the web marketplace. Dooz has both, but they are a separate line rather than base scope",
      "Insurer quote integrations. Each partner is scoped individually, because the work depends entirely on what API they expose and what it returns",
      "Lender and payment gateway integrations beyond the first",
      "Automated or AI-assisted valuation. It depends on having enough structured condition data to price against, which a new catalogue does not have on day one",
      "Migration of existing inventory from a dealer management system or a supplier feed",
      "Monitoring after handover",
      "Support and maintenance after the 35-day defect window: monthly care at $1,500 a month, or a single release quoted per change"
    ],
    "when_not_to_hire": "If your model is a classifieds board, where sellers post, buyers call and nobody verifies anything, do not pay for a custom build. An off-the-shelf listings platform does that cheaply, and the inspection layer is the only part it cannot do. Skip us too if you need the inspection operation itself staffed: we build the software that captures and publishes a report, not the inspector network. And if procurement requires hourly billing or five named engineers on your standups, DevoraX is two people working fixed-price and will not clear that bar.",
    "faqs": [
      {
        "q": "Can you attach a full inspection report to every listing?",
        "a": "Yes. On Dooz the inspection report is published as part of the listing rather than sent on request. For your build we model each checkpoint as a record rather than a document, because that is what makes condition comparable across a catalogue instead of readable one PDF at a time, and it is what lets buyers filter on inspection outcomes alongside make, model, year, mileage and price."
      },
      {
        "q": "Do I get mobile apps as well as a web marketplace?",
        "a": "Dooz has both: an Angular web marketplace plus iOS and Android apps, all on one NestJS backend, which is the part Sameem worked on. For a new build, the web marketplace is base scope and the apps are quoted separately. React Native or Flutter means one codebase serves both stores, so a listing or financing flow is implemented once and behaves the same on each. What that is worth against a web-only scope comes out of the discovery call."
      },
      {
        "q": "Can buyers apply for financing and get insurance inside the app?",
        "a": "On Dooz, financing and insurance sit in the same flow as a vehicle whose condition has already been established, which is the point of the product. For your build, each lender or insurer is scoped and quoted individually, because the work depends on whether that partner exposes a usable API and how reliable its responses are."
      },
      {
        "q": "Who was Dooz built for?",
        "a": "For Dooz, which hired Sameem directly. It is the company's own used-car marketplace in Jordan, and he worked on the shared NestJS backend behind its web client and its iOS and Android apps. It is live at dooz.com, on the App Store as Dooz Cars, and on Google Play, where the listing shows 100K+ downloads."
      },
      {
        "q": "What will it cost?",
        "a": "We do not quote before a discovery call and we do not bill hourly. You get a written fixed price after a free 30-minute call. Published starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are starting points, not quotes. A marketplace with a real inspection layer and lender integrations sits above the entry tier."
      },
      {
        "q": "Who owns the code when it is finished?",
        "a": "You do, on final payment: code, IP, schema and deployment configuration. Nothing is withheld to secure a maintenance contract. After the 35-day defect window, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change, and if you have your own engineers you may want neither."
      },
      {
        "q": "How do you stop one dealer from seeing another dealer's stock?",
        "a": "By enforcing ownership in the database rather than the interface. On Afriva, which Sameem worked on as an engineer at Webrange Solutions, each role queries only the slice of data it is entitled to, and because Supabase bundles authentication with Postgres, the identity that signs a user in is the identity the database sees on the query. A hidden row is a presentation choice; a query that cannot return it is a boundary."
      },
      {
        "q": "Is this the same build as a general multi-vendor marketplace?",
        "a": "The vendor mechanics overlap: seller accounts, role-separated dashboards, ownership rules in the schema, order state that has to stay fresh on every surface. What differs is uniqueness, since every car is one unit rather than a stock item with a quantity, plus the inspection layer itself. For general goods, start from our multi-vendor marketplace development page."
      }
    ],
    "word_count": 2601,
    "updated": "2026-11-08T00:00:00.000Z",
    "role": "spoke",
    "hub": "multi-vendor-marketplace-development",
    "related_slugs": [
      "antiques-marketplace-app-development"
    ],
    "service_id": 2
  },
  {
    "slug": "food-truck-ordering-app-development",
    "primary_keyword": "food truck ordering app development company",
    "h1": "Food truck ordering app development: live location, menus and ordering",
    "title": "Food Truck Ordering App Development",
    "meta_description": "Food truck ordering app development by a two-person studio whose founder worked on Food Magnet, a live food truck platform, at Zencloud. Fixed price.",
    "hero_answer": "DevoraX builds discovery and ordering apps for food trucks and other mobile vendors, whether you run your own trucks or sign up independent ones. Two products sit behind that. DevoraX's founder, Sameem Amjad, worked on Food Magnet, an existing food truck discovery and vendor platform, as an engineer at Zencloud. Koor is a homemade-food ordering marketplace DevoraX worked on for a client (not named here). Food Magnet covers the food truck side, Koor the ordering side. Fixed price after a free 30-minute discovery call.",
    "sections": [
      {
        "heading": "What is included in a food truck ordering app build?",
        "body": "Base scope is what the two food platforms behind this page contain between them. A customer app that finds nearby vendors and reads current menus. A vendor surface for updating location, menu items, availability and profile. A web admin dashboard for the people who run the platform rather than trade on it. Card payments through Stripe. Push notifications. A realtime channel so an open screen stays in step with the backend instead of polling.\n\nWhich product evidences which matters. Food Magnet covers discovery, live location tracking, menus, vendor profiles and four roles. Koor covers ordering and live order status, on home chefs rather than trucks. The proposal says which half each line came from.\n\nAnything neither product evidences sits outside base scope. Nothing in the DevoraX portfolio covers point-of-sale hardware, kitchen printers or accounting systems, so they will not appear on a proposal as though they were routine. Running costs sit outside the fixed price: AWS, Firebase, Stripe fees and store developer accounts are billed to you by those vendors."
      },
      {
        "heading": "Who is this built for?",
        "body": "Three kinds of buyer. An operator who wants a branded ordering app for their own trucks. A platform business signing up independent vendors and taking a cut, which is a two-sided marketplace where the supply side happens to move. And market or event organisers who need the vendors on a site to be findable and orderable from a phone while that site is open.\n\nThe common property is that location is state rather than an address. A restaurant can be indexed once and relied on for years. A truck's position has a short useful life, and so does its menu. That one fact changes how search, caching, ranking and notifications have to be built, which is why a generic restaurant ordering template rarely survives contact with a vendor that moves. If your platform is multi-vendor first and mobility is secondary, the weight of the work moves from freshness to vendor onboarding and catalogue structure, which is closer to Koor than to Food Magnet. Say which one you are on the call, because the two scope differently."
      },
      {
        "heading": "What food platform work stands behind this page?",
        "body": "Two products, one for each half of this page.\n\nFood Magnet is a food truck discovery and vendor engagement platform. It runs as a Flutter mobile app with a React admin dashboard over a serverless AWS Lambda backend, with Firebase for realtime updates, Firebase and OneSignal for push, and Stripe for payments. Live truck location tracking is part of the product, and it has four user roles: admin, manager, vendor and customer. Sameem worked on it as an engineer at Zencloud, on a product that already existed. His work covered React and TypeScript web surfaces, vendor dashboards and admin panels, live GPS tracking, menus, bookings, Apple Pay and Google Pay, and AWS Lambda APIs. It is published at foodmagnet.app, on Google Play as com.foodmagnet.foodTruck, and on the App Store as Food Magnet Vendor.\n\nKoor covers the ordering half, on home chefs rather than food trucks. It is a homemade-food marketplace on React Native and NestJS, with Elasticsearch for discovery, Firebase for live order status and AWS for hosting. It was DevoraX client work, for a client not named here, and Sameem worked on it. The customer app is on Google Play as com.koor_user, first released in October 2025."
      },
      {
        "heading": "How does live location tracking work when the vendor keeps moving?",
        "body": "Live location tracking is part of Food Magnet, and Sameem worked on its live GPS tracking. The engineering problem is the same for any vendor that moves.\n\nPosition is continuous state, not a request-response value. It changes while the vendor is working and loses its worth as it ages, so the system needs a write path running on its own schedule rather than only when someone taps something. On the device the trade is between truthfulness and cost, because frequent sampling keeps the data accurate and spends battery and cellular data on a handset the vendor is also using to run a business.\n\nOn the read side, proximity is a spatial query with a freshness constraint attached, and the failure mode deserves as much attention as the happy path. A position that cannot be refreshed is better shown as unknown than as a stale value presented with the confidence of a live one. A confident wrong answer costs a customer a wasted journey."
      },
      {
        "heading": "How is vendor, operator and customer data kept separate?",
        "body": "Food Magnet has four roles across two clients: admin, manager, vendor and customer, on a mobile app and a web dashboard. That configuration is exactly where authorization tends to go wrong, because each client can look correct while enforcing a slightly different reading of the same rule.\n\nA check in the client is a user interface decision. It is useful for hiding controls a person cannot use, and it is not a security boundary, because the request it guards can be issued without going through the interface at all. The boundary belongs where every client passes through, which on Food Magnet is the Lambda layer, and on Koor is the single NestJS service allowed to write authoritative order data.\n\nThe same reasoning is why an admin dashboard is a separate web client rather than a privileged mode inside the consumer app. Keeping operational capability out of the app customers install limits what a compromised customer session can reach. The rules inside that structure are yours to define."
      },
      {
        "heading": "How does the build run, and what do you need from us?",
        "body": "It starts with a free 30-minute discovery call. We come out of that with enough to write a fixed-price proposal: the screen set, the role model, the integrations, and what is explicitly excluded. You get it in writing before committing to anything. There is no hourly billing, so a scope change is a conversation about a revised fixed price rather than a surprise on an invoice.\n\nWhat we need from you is short but has to be real. A named person who can make decisions without convening a committee. Your menu and vendor data model, or enough examples that we can derive it. Your own Stripe account, and Apple and Google developer accounts in your company's name: your app runs on your own accounts by default, so the money lands in your account and not ours. If you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account.\n\nDevoraX has been running since 2022 and is two people: Sameem Amjad and Usman."
      },
      {
        "heading": "How is this priced?",
        "body": "Fixed price, always, written after the discovery call. Published starting points are MVP Starter from $2,900, Growth from $7,500, and Enterprise custom-scoped. Those are indicative starting points rather than quotes, and a platform with live tracking, four roles, payments and two mobile targets is not a starter build.\n\nWhat moves the number is mostly surface count and role count rather than a list of features. One customer app on one platform is a different job from a customer app, a vendor surface and an admin dashboard. Four roles cost more than two, because the authorization work behind them is real. Shipping iOS as well as Android adds store review and device testing even where one codebase produces both binaries.\n\nThird-party running costs are yours and not marked up: AWS or Firebase usage, Stripe's processing fees, developer account fees."
      },
      {
        "heading": "What happens after launch, and who owns the code?",
        "body": "You own all code and IP on final payment. No licence-back, no hosting lock, no arrangement where the repository stays with us. It is handed over in your accounts, on your infrastructure, and you can take it to another developer the week after launch.\n\nDefects in the work we delivered are fixed free for 35 days after handover. After that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If you need point-of-sale integration, kitchen hardware, a driver dispatch and routing engine, or a named compliance regime signed off, nothing in the DevoraX portfolio covers those, and your budget is the wrong place to learn them. Hire a supplier with that exact scope already in their portfolio.\n\nIf you need a supplier who has already shipped ordering and checkout inside a food truck product, we are not it. Food Magnet is the food truck half. Koor is the ordering half, and its vendors are home chefs. That gap is real and you should price it into the decision.\n\nIf you need a contractual delivery date you can hold a supplier to, look elsewhere: we do not publish build timelines and will not invent one on a first call to win the work. And if you want a large team, an account manager and a round-the-clock support desk, we are two people. You deal directly with whoever writes the code, and there is nobody else to hand the work to when they are unavailable."
      }
    ],
    "proof": [
      {
        "project_id": 14,
        "name": "Food Magnet",
        "one_line": "A food truck discovery and vendor engagement platform built as a Flutter mobile app and a React admin dashboard over a serverless AWS Lambda backend, live on web, Android and iOS. Sameem worked on this existing product as an engineer at Zencloud.",
        "what_it_proves": "The food truck half: live truck location tracking, menu management, vendor profiles, a four-role model of admin, manager, vendor and customer, Stripe payments, Firebase realtime updates and Firebase plus OneSignal push, on three published surfaces.",
        "figures": [
          "Live at foodmagnet.app",
          "On Google Play as com.foodmagnet.foodTruck",
          "On the App Store as Food Magnet Vendor (id6444549450)"
        ]
      },
      {
        "project_id": 17,
        "name": "Koor Food Delivery",
        "one_line": "A homemade-food marketplace on React Native and NestJS, with Elasticsearch for discovery, Firebase for live order status and AWS (EC2, S3, CloudFront) for hosting. DevoraX client work, for a client not named here; Sameem worked on it.",
        "what_it_proves": "The ordering half, on home chefs rather than food trucks: search over a supply that changes constantly, live order status pushed rather than polled, and authoritative order writes held behind a single service layer.",
        "figures": [
          "On Google Play as com.koor_user, first released October 2025"
        ]
      }
    ],
    "included": [
      "Customer mobile app for finding nearby vendors, reading current menus and placing orders, on Android and iOS from one codebase (Flutter or React Native)",
      "Vendor surface for updating location, menu items, availability and profile",
      "Live location tracking for vendors that move during a working day",
      "React web admin dashboard for the people operating the platform",
      "Role model with authorization enforced server-side (Food Magnet has admin, manager, vendor and customer)",
      "Card payments through Stripe, including idempotent webhook handling",
      "Push notifications via Firebase Cloud Messaging and OneSignal",
      "Realtime order and status updates pushed over a Firebase subscription instead of client polling",
      "Cloud object storage and CDN delivery for menu and vendor imagery",
      "Search and discovery over changing vendor supply (Elasticsearch, as on Koor)"
    ],
    "quoted_separately": [
      "Cloud and third-party running costs: AWS, Firebase and Stripe processing fees, billed to you by those vendors",
      "Apple and Google developer accounts and store submission fees",
      "Support and maintenance after the 35-day defect window: monthly care at $1,500 a month, or a single release quoted per change",
      "Menu content, vendor onboarding data and food photography",
      "A second mobile platform where only one is in the agreed base scope",
      "Brand identity and design work beyond the agreed screen set"
    ],
    "when_not_to_hire": "Not us if you need point-of-sale integration, kitchen hardware, a driver dispatch and routing engine, or a named compliance regime signed off. Nothing in the DevoraX portfolio covers those. Not us if you need a supplier that has already shipped ordering and checkout inside a food truck product: in the work behind this page, those are two different products. Not us if you need a contractual delivery date, because we do not publish build timelines and will not invent one. Not us if you want an account manager and a round-the-clock support desk, because DevoraX is two people. And if a $2,900 to $7,500 range is above budget, a no-code ordering product will serve you better.",
    "faqs": [
      {
        "q": "Have you actually built a food truck app, or just a restaurant app?",
        "a": "DevoraX's founder, Sameem Amjad, has worked on one: Food Magnet, a food truck discovery and vendor platform with live truck location tracking, menu management and vendor profiles, which he worked on as an engineer at Zencloud. It is published on web, Android and iOS. Koor, a homemade-food ordering marketplace on React Native and NestJS that DevoraX worked on for a client (not named here), covers the ordering half, on home chefs rather than trucks. Both have pages on this site: read them before the call."
      },
      {
        "q": "Can you build the customer app, the vendor app and the admin dashboard?",
        "a": "Food Magnet runs a Flutter mobile app and a React web admin dashboard over one AWS Lambda backend, with four roles: admin, manager, vendor and customer. Whether vendors get a separate app or a role inside one app is a scoping decision we make on the call. Both cost more than a single-surface customer app, and the proposal states which one you are buying. Koor's case study covers the multi-vendor version of the same problem."
      },
      {
        "q": "Do you ship iOS as well as Android?",
        "a": "Food Magnet is on the web, Google Play and the App Store. Koor's customer app is published on Google Play. Flutter and React Native both produce iOS and Android builds from one codebase, so the second platform is mostly store review, device testing and release work rather than a second build. It is still a priced line in the proposal either way."
      },
      {
        "q": "How accurate will the live location be?",
        "a": "Accuracy on a moving vendor is a trade against battery and cellular data on a phone the vendor is also using to work. The question worth arguing about on your project is what the app shows when a position cannot be refreshed. Stale data presented as live is the expensive failure."
      },
      {
        "q": "Do you take a percentage of orders or transactions?",
        "a": "No. We charge a fixed price for the build and nothing on your revenue. Food Magnet takes payments through Stripe, and Stripe's processing fees are billed to you directly by Stripe rather than through us. Your Stripe account, your money. The same applies to AWS, Firebase and app store developer fees, which are not marked up."
      },
      {
        "q": "What happens if something breaks after launch?",
        "a": "Defects in the work we delivered are fixed free for 35 days after handover. After that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change. You own the code and IP on final payment, and the app runs on your own accounts by default (if you ask us to hold one, we transfer it to you at handover), so you are never locked to us. For the App Store and Google Play, that means moving the app to your own developer account."
      },
      {
        "q": "What does a build like this cost?",
        "a": "Fixed price after a free 30-minute discovery call. Published starting points are MVP Starter from $2,900, Growth from $7,500 and Enterprise custom-scoped, and those are indicative rather than quotes. A platform with live tracking, four roles, payments and two mobile targets sits above the starter tier. There is no hourly billing, so a scope change is a revised fixed price you agree to first."
      },
      {
        "q": "Why would I trust a two-person team with this?",
        "a": "Check rather than trust. DevoraX has been running since 2022. Our Fiverr profile, which is in Sameem's name, shows a 5.0 rating across 50+ projects since January 2022, for clients in the US, UK, Canada and Hong Kong. Both food products on this page can be downloaded today, Food Magnet from both app stores and Koor from Google Play, and their write-ups say whose work each one was."
      }
    ],
    "word_count": 2621,
    "updated": "2026-11-08T00:00:00.000Z",
    "role": "spoke",
    "hub": "multi-vendor-marketplace-development",
    "related_slugs": [
      "used-car-marketplace-app-development"
    ],
    "service_id": 1
  },
  {
    "slug": "crossfit-competition-app-development",
    "primary_keyword": "crossfit competition leaderboard app development company",
    "h1": "CrossFit Competition and Leaderboard App Development",
    "title": "CrossFit Competition App Development",
    "meta_description": "Competition and leaderboard app development: server-side ranking and live standings, by an engineer who worked on WOD Pro League at Zencloud. Fixed price.",
    "hero_answer": "DevoraX is a two-person studio that builds competition and leaderboard software for functional fitness. Its founder, Sameem Amjad, worked on one such platform as an engineer at Zencloud: WOD Pro League, a Flutter athlete app, a React organizer dashboard and a Node.js backend where scoring and ranking are computed server-side and pushed live over Socket.io and Redis. Sameem's part was the backend. The league's organizers are quoted on zencloudtechnologies.com saying more than 600 athletes joined in its first season. Founded 2022, fixed-price.",
    "sections": [
      {
        "heading": "What do you actually ship in a competition and leaderboard app?",
        "body": "A base build is three surfaces on one backend. Athletes get a Flutter app compiled to native iOS and Android from a single codebase and submitted to both stores. Organizers get a React dashboard for creating events, defining divisions, publishing workouts, reviewing submitted scores and managing qualification. Both talk to a Node.js service layer where the scoring and ranking logic lives.\n\nThat last point is the whole design. Ranking is never computed on a phone. A leaderboard calculated client-side is a leaderboard that can disagree with the phone next to it, and in competition that disagreement becomes a dispute. Centralising ranking gives one authoritative answer that every client renders identically, and it lets competition rules change without an app store release.\n\nReal-time delivery runs over persistent Socket.io channels rather than polling, so a submitted score propagates as an event instead of on someone's next request. Ranked score data sits in Redis, so position and range queries are answered in memory instead of re-sorting a relational table on every submission."
      },
      {
        "heading": "Who is this built for?",
        "body": "Anyone whose product is a ranking. Online qualifiers, multiple divisions, workouts released on a schedule, scores submitted against a deadline, a qualification cut at the end. If the standings are wrong or late, nothing else about the app matters to an athlete.\n\nSameem has worked on that shape once, as an engineer at Zencloud, on WOD Pro League. The problem it addressed was specific: athletes needed one platform to compete online across regions, with standings tracked as scores came in. That is the shape the work evidences.\n\nBe honest about your own scale on the discovery call. A one-off throwdown for a single affiliate does not need Redis, Socket.io and a serverless backend, and we will tell you so. This architecture earns its cost when submissions arrive in deadline-hour bursts rather than a trickle."
      },
      {
        "heading": "What competition platform work stands behind this page?",
        "body": "One product. WOD Pro League is a functional fitness competition platform: a Flutter athlete app for iOS and Android, a web platform, a React administrative dashboard, and a Node.js backend on AWS with Redis and Socket.io handling real-time data. Sameem Amjad, DevoraX's founder, worked on its backend as an engineer at Zencloud: the Node.js and Express services and the Socket.io and Redis leaderboard. It was Zencloud's project, and Zencloud's own site credits it.\n\nThe one public figure comes from the league's organizers, who are quoted on zencloudtechnologies.com saying that more than 600 athletes joined in the first season. The engineering write-up is at [/projects/31](/projects/31)."
      },
      {
        "heading": "How does the leaderboard hold up at a submission deadline?",
        "body": "Competition traffic is not flat. It clusters around workout releases and submission deadlines, then falls away between events. The peak decides whether athletes trust the platform.\n\nThree decisions carry that load in WOD Pro League. Redis holds the ranked score data, because a leaderboard is a ranking query and re-sorting a primary database on every submission does not survive a burst. Socket.io replaces polling with persistent push channels, and its transport negotiation and reconnection matter because athletes move between cellular and wifi mid-session. AWS Lambda scales out per invocation and back down afterwards, so capacity follows the competition calendar rather than a fixed fleet sized for the average.\n\nTiming is the quieter problem: deadlines are held in absolute time on the server and shown in local time in the client, so a cutoff means the same instant everywhere."
      },
      {
        "heading": "How separate are the athlete side and the organizer side?",
        "body": "Separate clients, one shared backend. Three client surfaces, the Flutter athlete app, the web platform and the React administrative dashboard, sit on one Node.js service layer. The athlete app submits and displays. It cannot compute or alter a rank, because the scoring and ranking logic lives on the server, which is what makes every surface agree.\n\nBe clear on what that is: separation of surfaces and of authority, not of data. Server-side ranking alone does not stop a tampered client posting a false score through the same API; submission validation and judging do, and both are rules you define.\n\nIf you need a written access model, or several organizers running isolated competitions from one instance, raise it on the call. Role-separated dashboards over one shared backend is a pattern described on our multi-vendor marketplace development page, at [/solutions/multi-vendor-marketplace-development](/solutions/multi-vendor-marketplace-development)."
      },
      {
        "heading": "What does the build process look like, and what do you need from us?",
        "body": "It starts with a free 30-minute discovery call and ends with a written fixed-price proposal before any code is written. We do not bill hourly. The proposal names what is in scope and what is not, because a fixed price is only meaningful if both halves are written down.\n\nWhat we need from you is your rulebook, written down. Scoring formats per workout type, how divisions are structured, tie-break rules, what counts as a valid submission, and the qualification criteria. Those are the requirements the ranking pipeline is built from. Vague answers here are the most reliable cause of rework later.\n\nPractically, we also need brand assets, and an app store release needs Apple Developer and Google Play accounts. Your app runs on your own accounts by default: the Apple and Google developer accounts, Stripe and hosting, including the cloud account the backend runs in. If you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account. If judging involves video review, show us how you judge today."
      },
      {
        "heading": "How is this priced?",
        "body": "Fixed price, after the discovery call, in writing. Published tiers start at $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are indicative starting points rather than quotes, and a competition platform with real-time ranking, an organizer dashboard and two app store releases sits above an MVP Starter number.\n\nThe honest driver of cost is not screen count. It is how complicated your scoring rules are and how many of them there are. One workout type with a single ranking formula is a small build. Points tables across multiple divisions, scaled and prescribed categories, tie-breaks resolved on secondary fields, and a qualification cut with manual overrides is a much larger one, because each rule is logic that has to be correct when an athlete challenges a placement.\n\nYou get the number once we have read your rulebook. If scope changes during the build, it is re-quoted in writing rather than absorbed quietly and recovered elsewhere."
      },
      {
        "heading": "What happens after launch, and who owns the code?",
        "body": "You own all code and IP on final payment. That covers the Flutter app, the backend services, the admin dashboard and the infrastructure configuration. That transfer is the commitment we publish, and it is the one worth holding us to in writing.\n\nDefects in the work we delivered are fixed free for 35 days after handover. After that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change. Competition platforms have a particular operational shape: the risk is concentrated into a few hours around a deadline, so the useful question is not a generic uptime promise but who is reachable during your qualifier window and how you reach them. Settle that before your first event, not during it.\n\nDevoraX is two people, Sameem Amjad and Usman, working since 2022. Price that constraint in. It also means the people who wrote your ranking pipeline are the people who answer when it misbehaves."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "Do not hire us for on-site live event production: heat scheduling against physical floor lanes, judge tablets running offline in a venue with no signal, arena screen graphics. The competition work behind this page is online competition with real-time leaderboards. Nothing in the DevoraX portfolio covers venue floor operations, and buying that from a team learning it during your event is a bad trade for both of us.\n\nSkip us too if you need coverage in your timezone on a rota, or an agency with a bench it can surge onto a fixed event date. Two people cannot honestly promise either.\n\nAnd if you only need scoring for one gym's internal throwdown, a spreadsheet or an existing off-the-shelf scoring tool will beat a custom build on both cost and time to your first event. Come back when you are running qualifiers at a scale that breaks them."
      }
    ],
    "proof": [
      {
        "project_id": 31,
        "name": "WOD Pro League",
        "one_line": "A functional fitness competition platform: a Flutter athlete app for iOS and Android, a web platform and a React administrative dashboard on a Node.js and AWS backend, with Redis and Socket.io driving real-time leaderboards. Sameem worked on the backend as an engineer at Zencloud.",
        "what_it_proves": "The core of what this page sells: server-side scoring and ranking that every client renders identically, live leaderboard delivery over persistent Socket.io channels, Redis-backed ranking for deadline-hour submission bursts, and serverless capacity that follows a competition calendar. It was Zencloud's project.",
        "figures": [
          "Organizers' quote on zencloudtechnologies.com: \"more than 600 athletes joined\" in the first season"
        ]
      }
    ],
    "included": [
      "Flutter athlete app compiled to native iOS and Android from one codebase, submitted to the App Store and Google Play",
      "React organizer dashboard for creating events, defining divisions, publishing workouts, reviewing submitted scores and managing qualification",
      "Node.js service layer where all scoring and ranking logic runs server-side, never on the client",
      "Redis-backed ranking, so leaderboard position and range queries are answered in memory rather than by re-sorting a relational table",
      "Live standings pushed over Socket.io, with transport negotiation and reconnection for athletes moving between cellular and wifi mid-session",
      "Score submission and review flow, with qualification status visible to athletes and editable by staff",
      "Deadlines held in absolute time on the server and presented in each athlete's local time",
      "Deployment on AWS serverless compute with S3 object storage",
      "Handover of all source code and IP on final payment"
    ],
    "quoted_separately": [
      "Video submission upload, judging queue and appeals trail",
      "Entry fee payments, prize payouts and subscription billing",
      "Wearable and fitness device integrations such as Apple Watch, Garmin or Whoop",
      "On-site live event tooling: heat scheduling against floor lanes, offline judge tablets, arena screen graphics",
      "Roles, permissions and access rules beyond separate athlete and organizer clients, and any anti-cheat or submission-validation tooling",
      "Multi-tenant hosting where independent federations share one deployment with partitioned data",
      "Monitoring after handover",
      "Support, maintenance and app store releases after the 35-day defect window: monthly care at $1,500 a month, or a single release quoted per change"
    ],
    "when_not_to_hire": "Do not hire us for on-site live event production. Heat scheduling against floor lanes, offline judge tablets in a venue with no signal, arena screen graphics: nothing in the DevoraX portfolio covers those, and your event is the wrong place for us to learn. Skip us if you need timezone coverage on a rota or a bench to surge onto a fixed date, because two people cannot promise it. And for one gym's internal throwdown, a spreadsheet will beat a custom build on cost and on time to your first event.",
    "faqs": [
      {
        "q": "Will the athlete app be Flutter or React Native?",
        "a": "Either works, and the choice is made in discovery. WOD Pro League's athlete app was Flutter, compiled from one Dart codebase to iOS and Android; Sameem's part was the backend it talked to. Flutter renders its own widgets through a compiled pipeline, which keeps a long leaderboard list scrolling predictably while incoming socket events change it underneath the athlete reading it."
      },
      {
        "q": "Can the leaderboard update live while scores are still being submitted?",
        "a": "Yes, that is the core of the build. Connected clients hold persistent Socket.io channels and receive standings changes as pushed events instead of polling for them. Ranked score data sits in Redis, so a position query is answered in memory. WOD Pro League ran this pattern, and the Socket.io and Redis leaderboard was the part Sameem built as an engineer at Zencloud."
      },
      {
        "q": "What stops an athlete submitting a false score?",
        "a": "Your rules do, not our architecture. Ranking ran server-side in WOD Pro League, so no client could rewrite a placement, but a tampered client could still post a score through the same API. Video review, judging queues and appeals are quoted as a separate workstream. Tell us how you verify a score today and it gets priced as defined work."
      },
      {
        "q": "How long does a build like this take?",
        "a": "We do not publish build timelines, and you should be wary of any agency that quotes one before reading your scoring rules. The schedule falls out of how many ranking formats, divisions and tie-break rules exist, plus app store review, which nobody controls. You get a date alongside the fixed price in the written proposal, after the discovery call."
      },
      {
        "q": "Can you take entry fee payments and pay out prize money?",
        "a": "Payments are scoped and quoted separately. WOD Pro League integrated Stripe. Bring your payment provider, the jurisdictions you sell into and your payout model to the discovery call, and entry fees, prize payouts or subscriptions get priced as defined work."
      },
      {
        "q": "Can several federations run on one installation, each seeing only their own data?",
        "a": "That is multi-tenancy, and it is a different data model from the one WOD Pro League ran. Nothing in the DevoraX portfolio includes tenant-partitioned competition hosting, so treat it as scoped work rather than something proven. It is answerable, but it has to be decided before the schema is written rather than retrofitted. Our multi-vendor marketplace development page covers role-separated dashboards on a shared backend, which is related but not the same thing."
      },
      {
        "q": "Who owns the app once it is built?",
        "a": "You do. All code and IP transfer on final payment, including the Flutter app, the backend services, the admin dashboard and the infrastructure configuration. The build ships under your own accounts by default: the Apple and Google developer accounts, Stripe and hosting. If you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account."
      },
      {
        "q": "Can I see WOD Pro League?",
        "a": "Not any more: the league's own site and its App Store and Google Play listings are no longer live. What remains public is Zencloud's own page crediting the project, where the organizers are quoted saying more than 600 athletes joined in the first season, and the engineering write-up at [/projects/31](/projects/31). It was Zencloud's project; Sameem worked on its backend as an engineer there."
      }
    ],
    "word_count": 2406,
    "updated": "2026-11-08T00:00:00.000Z",
    "role": "spoke",
    "related_slugs": [
      "food-truck-ordering-app-development"
    ],
    "service_id": 1
  },
  {
    "slug": "duffel-api-integration-development",
    "primary_keyword": "Duffel API integration development for travel booking platforms",
    "h1": "Duffel API integration development for travel booking platforms",
    "title": "Duffel API Integration for Travel Platforms",
    "meta_description": "Duffel API integration for travel booking platforms, from an engineer who worked on a Duffel risk module at Zencloud, live in got2.travel. Fixed price.",
    "hero_answer": "DevoraX is a two-person software studio founded in 2022. Its founder, Sameem Amjad, has worked on one Duffel API integration for a live travel product, as an engineer at Zencloud: Barfly, a Node.js risk module that pairs Duffel flight data with heuristic rules to assess transfer risk on codeshare and non-codeshare itineraries. It runs inside got2.travel. DevoraX now takes Duffel integration work directly, at a fixed price.",
    "sections": [
      {
        "heading": "What does a Duffel API integration from DevoraX include?",
        "body": "The base scope is the integration and the layer you own around it. Duffel sits behind your own Node.js service rather than in your front end, so credentials never reach a browser and supplier behaviour can change without shipping a client release.\n\nInside that service we build the itinerary model. A connecting flight is not one product. It is two or more separately operated segments joined by a layover, and on a codeshare the carrier that sells a segment is not the carrier that operates it. We carry marketing and operating identity separately through the model instead of collapsing them into a single airline field, because any rule that depends on a carrier has to know which carrier it means.\n\nScoring and annotation sit on top of that structure. The full base scope is listed below, and so is what we quote separately. Order creation and ticketing are on the second list for a reason set out further down."
      },
      {
        "heading": "What Duffel work stands behind this page?",
        "body": "Barfly. It is a flight transfer risk assessment module on Node.js that integrates Duffel API data with heuristic algorithms to assess disruption risk for codeshare and non-codeshare itineraries, with React.js on the interface side. It runs inside got2.travel, a live travel product. Sameem Amjad, DevoraX's founder, architected the module as an engineer at Zencloud, from the Duffel integration to the risk heuristics. It was Zencloud's project for got2.travel. The write-up is at [/projects/29](/projects/29).\n\nThat is one project, not a portfolio of them. What it evidences is the engineering: a Duffel integration taken into a live product, with domain logic built on top of it."
      },
      {
        "heading": "Where does the Barfly work stop?",
        "body": "At search and assessment. Barfly takes Duffel flight data and assesses transfer risk on codeshare and non-codeshare itineraries. Order creation, payment and ticketing are scoped and quoted as new work, so if your product needs booking through to an issued ticket, weigh that when you compare us against an agency that has already shipped it.\n\nThe stack is Node.js, with React.js on the interface side, and the risk model works from airline protocols and aviation variables. Native iOS and Android apps are quoted separately. Know the shape of the evidence before a call, not after one."
      },
      {
        "heading": "Who is this page for?",
        "body": "Travel booking platforms, OTAs and metasearch products that have decided to integrate Duffel and want the integration, and whatever sits on top of it, built once and properly.\n\nThe closest fit to the Barfly work is a platform whose difficulty is in the reasoning over itineraries rather than in the distribution itself. Connection risk, disruption exposure, ranking that is not purely price, or any rule set that has to know which carrier actually operates a segment. That is the problem Barfly addresses. If you are searching flights and displaying them with no derived logic on top, the integration is smaller than this page describes and you may not need an agency for it.\n\nCorporate travel tools and vertical booking products with their own policy rules are the same shape of problem: rules that have to run over a normalized itinerary structure rather than over per-carrier formats."
      },
      {
        "heading": "How do you keep supplier, agent and traveller data separate?",
        "body": "This matters when more than one party lives inside your platform: agencies booking under their own accounts, suppliers beyond flights, or white-labelled partners with their own customers.\n\nThe method is the same on any platform. Tenancy belongs in the data model from the first migration rather than being retrofitted. Every row that belongs to a party carries that party's identifier, the identifier is derived from the authenticated session and never from a request parameter, and the check is enforced server-side on every read and write.\n\nIf a genuine multi-party marketplace is the product rather than a side effect of it, say so before we quote. That is a different build with a different data model at its centre, and we would scope it as its own project rather than as an extension of a Duffel integration."
      },
      {
        "heading": "What does the build look like, and what do you need from us?",
        "body": "It starts with a free 30-minute discovery call, after which you get a written fixed-price proposal with the scope stated line by line. Nothing begins before you have that document and have agreed to it.\n\nWhat we need from you is a Duffel account and test credentials in your own name, because that account is a commercial relationship between you and Duffel. Your product runs on your own accounts by default, and if you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account. We also need the product decisions only you can make: which markets, which cabin classes, what happens when a search returns nothing, and what your rules are if we are building rules. If the scoring logic is yours, we need it written down before we quote it.\n\nOne named contact who can answer a question the same week is worth more than any process. Sameem Amjad runs the engagement. Usman is the other half of the team."
      },
      {
        "heading": "How is a Duffel integration priced?",
        "body": "Fixed price. There is no hourly billing. After the discovery call you get a written proposal with a fixed figure against a defined scope, and if the scope changes we requote in writing rather than letting a number drift upward.\n\nPublished starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are indicative starting points and not a quote for your build. A search integration dropped into an existing React front end and a full engine with its own rule set are different projects and will not carry the same number.\n\nThe reason we work this way is unglamorous. A fixed price moves the estimating risk onto us, which is where it belongs, and it gives you a figure you can take to a board rather than a range you have to defend."
      },
      {
        "heading": "What happens after launch?",
        "body": "You own everything. All code and IP transfer to you on final payment. The repository is yours, the Duffel account is yours, and there is no license to renew and no runtime dependency on DevoraX.\n\nDefects in the work we delivered are fixed free for 35 days after handover. After that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change. It is worth saying what that is not: DevoraX is two named people, so there is no round-the-clock rota and we will not pretend there is.\n\nTaking the work in-house after handover is a normal outcome rather than a failure of the relationship. The handover document exists so that another engineer can pick the integration up without calling us."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If your distribution requirement is GDS, meaning Amadeus, Sabre or Travelport, or direct NDC connections to carriers, hire a supplier who has those running in production. Nothing in the DevoraX portfolio includes them, and you should not fund the learning.\n\nIf you need someone on call around the clock for a live booking desk, two people cannot honestly provide it. If you need IATA accreditation, consolidator relationships or a regulated payments operation, those are commercial and regulatory problems rather than engineering ones and we do not solve them.\n\nIf you already have a working Duffel integration and want extra hands by the hour to extend it, the fixed-price model will frustrate you. And if the only thing you need is flight search rendered on a page with no derived logic above it, that is a smaller job than this page describes and you may not need an agency for it."
      }
    ],
    "proof": [
      {
        "project_id": 29,
        "name": "Barfly Risk Engine",
        "one_line": "A Node.js flight transfer risk module that integrates the Duffel API with heuristic algorithms to assess risk on codeshare and non-codeshare itineraries, with React.js on the interface side. Sameem worked on it as an engineer at Zencloud, and it runs inside got2.travel.",
        "what_it_proves": "A Duffel integration taken into a live travel product, with domain logic built on top of it: codeshare and non-codeshare itineraries handled as distinct cases rather than collapsed into one path, and a heuristic layer that turns airline protocols and aviation variables into an assessment computed on demand. It was Zencloud's project.",
        "figures": [
          "Live inside got2.travel"
        ]
      }
    ],
    "included": [
      "Duffel API integration behind your own Node.js service, so API credentials never reach a browser",
      "An itinerary model that carries marketing and operating carrier separately, so codeshare and non-codeshare segments are handled as distinct cases",
      "Flight search against Duffel, normalized into one structure your product can reason over instead of per-carrier formats",
      "A heuristic rule layer above that structure, written so every output can be traced back to the rule that produced it",
      "Failure handling on the upstream path: timeouts, error responses, empty result sets, partial data, and results that have gone stale between search and use",
      "Separate test and live credentials, configured per environment and never committed to the repository",
      "React front-end work for search and results, or integration into your existing React application",
      "Outbound request and response logging, so a failure in production can be diagnosed after the fact",
      "Written handover covering what was built, how it is configured and how to run it"
    ],
    "quoted_separately": [
      "Duffel order creation, payment and ticketing. The Barfly work covers the search and assessment path, so this is scoped, quoted and priced as new work",
      "Post-booking servicing: changes, cancellations, refunds, ancillaries and seat selection",
      "Your Duffel account, airline content arrangements and payment processing fees, which are commercial relationships between you and your providers rather than part of a build",
      "Additional supplier APIs for hotels, rail or cars, and the reconciliation layer between them",
      "A multi-supplier or multi-agency marketplace layer, which is a different build with its own data model and is scoped and quoted as its own project",
      "Native iOS and Android apps"
    ],
    "when_not_to_hire": "If you need GDS distribution, meaning Amadeus, Sabre or Travelport, or direct NDC connections to carriers, hire an agency that already runs those in production. Nothing in the DevoraX portfolio includes them. If you need round-the-clock on-call cover for a live booking desk, DevoraX is two named people and cannot provide it. If you need IATA accreditation, consolidator relationships or a regulated payments operation, those are commercial and regulatory problems rather than engineering ones and we do not solve them. If you want hourly hands on an integration you already have, the fixed-price model will not suit you.",
    "faqs": [
      {
        "q": "Have you actually shipped a Duffel integration, or only worked with similar APIs?",
        "a": "One, as employer work. Sameem built Barfly, a Duffel-based risk module on a Node.js backend, as an engineer at Zencloud, and it runs inside got2.travel. The write-up is at [/projects/29](/projects/29). It is one project rather than five. If you want a supplier with a long list of travel integrations behind them, we are not it."
      },
      {
        "q": "Does Barfly book flights through Duffel, or only search them?",
        "a": "Barfly works on the search and assessment path. Booking through to an issued ticket is work we scope and quote as new, and when you compare us against an agency that has already shipped ticketing, price the difference in evidence honestly."
      },
      {
        "q": "Who was Barfly built for?",
        "a": "For got2.travel, where it runs today. Sameem built the risk module as an engineer at Zencloud, and it was Zencloud's project. DevoraX is the two-person studio through which he and Usman now take this kind of work directly."
      },
      {
        "q": "Can you build the risk scoring, or only the API plumbing?",
        "a": "Both. Barfly is the scoring layer, not only the integration underneath it. It synthesizes airline protocols and aviation variables through heuristic algorithms rather than a trained model. Connection risk is conditional on two flights and the relationship between them, which is why it cannot be reduced to arithmetic on departure and arrival timestamps."
      },
      {
        "q": "Why heuristics rather than a machine learning model?",
        "a": "Airline protocols are stated rules, so a rule-based engine can encode them without first accumulating a labelled history of outcomes. Rules are also legible: you can see which one produced a given output, which matters when a traveller acts on it. The cost is a ceiling on subtlety and hand maintenance of every rule. If you already hold outcome data, that tradeoff changes and we will say so."
      },
      {
        "q": "What will it cost?",
        "a": "You get a written fixed price after a free 30-minute discovery call. No hourly billing. Published starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped, and those are indicative rather than quotes. A search integration into an existing front end and a full rules engine are different projects with different numbers."
      },
      {
        "q": "Who owns the code?",
        "a": "You do, on final payment, including all IP. The repository is yours, the Duffel account is in your own name, and the product runs on your own accounts by default: the Apple and Google developer accounts, Stripe and hosting. If you ask us to hold one for you, we transfer it to you at handover, so there is nothing to unwind if you take the work in-house later. For the App Store and Google Play, that means moving the app to your own developer account. We hold no license over anything built for you and the system has no runtime dependency on DevoraX."
      },
      {
        "q": "Can you work inside our existing platform instead of starting fresh?",
        "a": "Usually yes, if it is a JavaScript or TypeScript stack. Barfly is Node.js with a React.js interface. On an existing codebase we want a read-only look before quoting, because a fixed price on code nobody has read is a guess, and we would rather not guess at your expense."
      }
    ],
    "word_count": 2276,
    "updated": "2026-11-08T00:00:00.000Z",
    "role": "spoke",
    "related_slugs": [
      "multi-vendor-marketplace-development"
    ],
    "service_id": 3
  },
  {
    "kind": "offer",
    "role": "offer",
    "slug": "lovable-app-to-app-store",
    "primary_keyword": "lovable to app store",
    "secondary_keywords": [
      "lovable app to app store",
      "publish lovable app to app store",
      "convert lovable to ios app",
      "convert lovable to mobile app",
      "publish lovable app to google play",
      "base44 to app store",
      "replit to play store",
      "can lovable publish to app store",
      "lovable react native"
    ],
    "nav_label": "Lovable App to the App Store",
    "h1": "Take your Lovable, Base44 or Replit app to the App Store and Google Play",
    "title": "Lovable App to the App Store and Google Play",
    "meta_description": "Lovable app to the App Store and Google Play, or a Base44 or Replit app: native features, store listing, privacy forms, review answers. From $2,400.",
    "subtitle_lead": "The work a wrapper leaves to you: native features, the store listing and privacy forms, Google Play testing and App Review answers. In-app purchase or a US web-checkout link is a separate line in your launch quote.",
    "offer_steps": [
      "audit",
      "launch"
    ],
    "price_notes": {
      "audit": "$400, credited to the launch if you go ahead",
      "launch": "From $2,400 (two weeks of our work) · in-app purchase, a US web-checkout link or a React Native rebuild is quoted separately"
    },
    "hero_answer": "A Lovable app reaches the App Store and Google Play inside a native shell, or for some apps a React Native rebuild, and as of November 2026 Lovable has no built-in way to package and submit it. DevoraX does that work for Lovable, Base44 and Replit apps: after a free 30-minute call, a $400 launch-readiness audit says what your app needs, and the launch starts from $2,400 with the audit credited to it. We prepare the app against Apple's and Google's guidelines, submit it and answer the reviewers. The stores decide approval.",
    "key_points": [
      {
        "heading": "Native features, not a website",
        "body": "Apple can reject an app that is too close to a website. We add what a phone app is expected to have, such as push notifications and deep links, before the first submission."
      },
      {
        "heading": "Try it on your phone",
        "body": "You install TestFlight and Google Play internal testing builds on your own phone and try the real app before anything goes to review."
      },
      {
        "heading": "In-app purchase decided early",
        "body": "If the app sells digital features, the audit says whether you need in-app purchase or a US web-checkout link, storefront by storefront. Building it is a separate line in your quote."
      }
    ],
    "triggers": [
      "Your Lovable app works in the browser, and now users, a client or an investor expect to find it in the App Store and Google Play.",
      "You looked for a button in Lovable that publishes to the App Store and found there isn't one.",
      "Your app charges for a subscription or premium features through Stripe, and you don't know what Apple and Google will let you keep.",
      "Your Base44 app's store files are ready, but you sell digital content and Base44 can't take in-app purchases yet.",
      "Replit got your iOS build into TestFlight, and Google Play is still missing.",
      "Apple rejected the app, maybe more than once, saying it is too close to a website.",
      "You need push notifications in a store app, or a native feature the web app can't give you."
    ],
    "process": [
      {
        "heading": "Check the app against both stores' rules",
        "body": "The $400 launch-readiness audit reviews your code, database security, payments, hosting and store readiness. On the store side it asks five questions. Does the app do more than your website (Apple's guideline 4.2)? What does it sell, and in which storefronts (3.1.1 and Google Play's Payments policy)? Can people delete their account inside the app (5.1.1(v))? What must your App Privacy details and Google Play's Data safety form declare? And does your Play account need the 12-tester closed test?\n\nThe audit starts once we can read your code. A Lovable project can be shared through GitHub: Lovable can export and two-way sync its code with a GitHub repository on any plan ([Lovable's GitHub docs](https://docs.lovable.dev/integrations/github), read 7 November 2026). The report ends with a verdict for your app (PWA, wrapper or React Native rebuild) and a list of what the launch needs, counted in $1,200 weeks of our work (the launch from $2,400 is two), so you know the total before work starts. It is an engineering review, not a security certification. [The terms below](#terms) say when it arrives."
      },
      {
        "heading": "Start the accounts early",
        "body": "The app needs an Apple Developer Program membership and a Google Play developer account (the fees are in the cost section below). Your app runs on your own accounts by default: the Apple and Google developer accounts, Stripe and hosting. If you ask us to hold one for you, we transfer it to you at handover, and you own all code and IP on final payment. For the App Store and Google Play, that means moving the app to your own developer account.\n\nPublishing under a company name? As of November 2026, Apple needs a D-U-N-S Number, and [its help page](https://developer.apple.com/help/account/membership/D-U-N-S/) says to allow up to 5 business days to receive one from Dun & Bradstreet, then up to 2 business days for Apple to receive it. A Google Play organisation account needs one too, according to [Google's account types page](https://support.google.com/googleplay/android-developer/answer/13634885). Request it the day you book."
      },
      {
        "heading": "Wrap or rebuild, then add the native parts",
        "body": "For a wrapper, we bundle your built Lovable app inside a Capacitor shell (the wrapper section below says why), which converts the Lovable app to an iOS app and an Android app without rewriting its screens. The iOS build is made and uploaded with Xcode, Apple's Mac app, and the Android build with the Android build tools.\n\nThen come the native parts your app needs: push notifications, deep links, a sign-in option Apple accepts and account deletion inside the app. In-app purchase or a US web-checkout link, if your app sells digital features, is a separate line in your launch quote. If the audit calls for a React Native rebuild instead, that is quoted after the audit."
      },
      {
        "heading": "Test on your phone, submit, answer the reviewers",
        "body": "Before anything goes to review, you install the build on your own phone (the TestFlight question below explains how). If your Play account needs the closed test, it runs at this stage.\n\nWe fill in the store listing, App Privacy details and Google Play's Data safety form, submit with review notes and a demo account for the reviewer, then answer App Review and Google Play review and resubmit when they ask for changes. [The terms below](#terms) say what that costs during a launch."
      }
    ],
    "sections": [
      {
        "id": "lovable",
        "heading": "Can Lovable publish to the App Store itself?",
        "body": "No. As of November 2026, [Lovable's publishing docs](https://docs.lovable.dev/features/publish) say it \"has no built-in flow that packages and submits your project to the App Store or Google Play\"; publishing deploys to a web URL. The docs give two routes: make the app a Progressive Web App that people add to their home screen, or wrap it in a native shell with Capacitor \"outside of Lovable\" and submit that shell to the stores, which they call \"the right path when you need access to native device APIs (camera, push notifications, biometrics, etc.)\". The Lovable mobile app is for building projects from your phone, not for turning one into an app your users install.\n\nSo to publish a Lovable app to the App Store, you add a native layer outside Lovable. Base44 and Replit do more of this themselves, as the table shows; whatever a builder doesn't do is work for you or for whoever you hire.",
        "table": {
          "caption": "What each builder does itself, as of November 2026 (from Lovable's, Base44's and Replit's docs, read 7 November 2026)",
          "headers": [
            "Builder",
            "Store build or files",
            "iOS submission",
            "Google Play",
            "In-app purchase",
            "Push notifications"
          ],
          "rows": [
            [
              "Lovable",
              "None: publishing deploys to a web URL",
              "Not built in",
              "Not built in",
              "Not built in",
              "Through a Capacitor wrapper built outside Lovable"
            ],
            [
              "Base44",
              "Generates an iOS IPA and an Android AAB; downloading them needs its Builder plan or higher",
              "You upload the IPA, for example with Apple's Transporter app, and submit in App Store Connect",
              "You upload the AAB in Play Console",
              "Not supported yet (no Apple In-App Purchase or Google Play Billing)",
              "Can be added when it generates the store files"
            ],
            [
              "Replit",
              "Builds a React Native and Expo app",
              "Guided: it submits builds to TestFlight, and you promote one to the App Store in App Store Connect; needs an Apple Developer Program membership",
              "Publishing not yet supported",
              "RevenueCat, set up by Replit's Agent",
              "Set up by Replit's Agent; on iOS it needs a TestFlight build to test"
            ]
          ]
        }
      },
      {
        "id": "wrapper-or-react-native",
        "heading": "Wrapper, PWA or React Native: which does my Lovable app need?",
        "body": "A PWA puts your app on a home screen but in neither store. A Capacitor wrapper keeps your Lovable code and adds a native shell around it. A React Native rebuild replaces your screens with native ones. The audit picks one for your app and says why. The same three routes apply to a web app built with Bolt or Cursor.\n\nThe PWA is, in Lovable's words, \"the fastest path and works from any modern mobile browser\". If your users only need an icon on their phone, stop there and spend nothing on the stores.\n\nTo convert a Lovable app to a mobile app for the stores, Lovable's docs point to a Capacitor wrapper, and one detail decides how well it holds up. The docs say to wrap your published URL, but Capacitor's own [configuration reference](https://capacitorjs.com/docs/config) says loading an external URL \"is intended for use with live-reload servers\" and \"is not intended for use in production\". So we bundle your built app inside the binary: its screens ship with the app instead of loading from your website, and a change you make in Lovable reaches users with the next store build rather than instantly. Native features then come from Capacitor plugins.\n\nOne more check comes first. As of November 2026, new Lovable projects use TanStack Start, which renders pages on the server: Lovable's [upgrade docs](https://docs.lovable.dev/features/upgrade-to-tanstack-start) say it became the default for new projects on 13 May 2026. Such a project has to be set up to produce static files before it can be bundled, and the audit checks which stack yours is on.\n\nCan Lovable build React Native apps? Not as of November 2026: its docs say \"Lovable does not generate projects in React Native\" and suggest prototyping in Lovable, then rebuilding the screens in React Native outside it. A rebuild costs more and leaves you with two codebases, the web app and the store app, so it pays when the app needs native performance or features a web view handles badly. Three28, below, is a React Native app on the App Store that Sameem worked on, and the [React Native vs Flutter write-up](/insights/react-native-vs-flutter-production-experience) compares the two across the 12 cross-platform builds in his portfolio."
      },
      {
        "id": "in-app-purchase",
        "heading": "Can I use Stripe in my iOS app, or do I need in-app purchase?",
        "body": "For physical goods and services used outside the app, yes, in every storefront: guideline 3.1.3(e) says those apps \"must use purchase methods other than in-app purchase\". For digital features unlocked in the app, in-app purchase is the rule (3.1.1). A US storefront app may also link to your Stripe checkout on the web (3.1.1(a)), while other storefronts allow a link or another payment provider only with an entitlement Apple offers in some regions. The quotes here are from Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), last updated 16 October 2026 and read on 7 November 2026.\n\nGuideline 3.1.1 opens: \"If you want to unlock features or functionality within your app, (by way of example: subscriptions, in-game currencies, game levels, access to premium content, or unlocking a full version), you must use in-app purchase.\" On the US storefront, 3.1.1(a) says Apple's entitlements \"are not required for developers to include buttons, external links, or other calls to action in their United States storefront apps\", so a US app may send people to your Stripe checkout on the web. That lifts the ban on links only. 3.1.1 still covers features unlocked inside the app, and 3.1.3(b) lets an app unlock what people bought on the web only \"provided those items are also available as in-app purchases within the app\". Whether a US app can rely on the web link alone is App Review's decision.\n\nOutside the US storefront, apps and their metadata \"may not include buttons, external links, or other calls to action\" that point to other ways to pay, unless the app holds an entitlement Apple offers in that region. As of November 2026, Apple's [External Purchase documentation](https://developer.apple.com/documentation/storekit/external-purchase) covers other payment providers inside the app in the EU and South Korea, and links to outside purchases in regions including the EU, Japan and Brazil, each under its own entitlement and terms. Guideline 3.1.3 also lists apps that may use other purchase methods, such as reader apps (3.1.3(a)) and real-time services between two people (3.1.3(d)). Apple can still reject an app.\n\nGoogle Play works differently. Its [Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738), read 7 November 2026, requires Google Play's billing system for digital content and features sold in the app, and says that billing system must not be used for physical goods and services. Another billing system, or a link that sends people out of the app to pay, is allowed only in eligible countries or regions, after enrolling in Google's program for that region. The United States is one: Google's [external content links program](https://support.google.com/googleplay/android-developer/answer/16470497) lets an enrolled app link US users to buy in-app digital items on the web \"in lieu of or alongside Google Play Billing\", and a separate US program allows another billing system inside the app. Google runs programs for other regions too, including the EEA, the UK, Japan and Australia. Each needs Google's APIs in the app and carries a Google service fee.\n\nIn a Lovable app, in-app purchases live in the native layer you add, not in Lovable, and a wrapper can carry them: Capacitor's docs have an [in-app purchases guide](https://capacitorjs.com/docs/guides/in-app-purchases), and RevenueCat publishes an [SDK for Capacitor apps](https://www.revenuecat.com/docs/getting-started/installation/capacitor). The work is the products in App Store Connect and Play Console, the purchase screen, a server-side check so your web app and your store app agree on who has paid, and a way to restore purchases (3.1.1 asks for one). Then come sandbox tests and review notes, since guideline 2.1(b) wants in-app purchases \"complete, up-to-date, visible to the reviewer and functional\". Sameem has shipped in-app purchase through StoreKit, Play Billing or RevenueCat. The audit says which route your app needs, and your launch quote prices it as a separate line before work starts."
      },
      {
        "id": "base44",
        "heading": "Can my Base44 app have in-app purchases?",
        "body": "Not yet. As of November 2026, [Base44's store guide](https://docs.base44.com/documentation/building-your-app/uploading-to-app-stores) says \"Base44 apps don't support Apple In-App Purchase or Google Play Billing yet\". Otherwise, getting a Base44 app to the App Store is mostly done inside Base44: it scans the app against Apple's and Google's guidelines, generates the iOS and Android files, can add push notifications, and runs your published app \"inside a secure web view\", so most content changes reach the app without a new store version.\n\nRevenueCat is not a way round it. The same page says RevenueCat's native SDK and in-app purchase plugins \"need access to the native layer, which Base44 apps don't expose. They don't work, they can break your build, and your app is still rejected.\"\n\nFor an iOS app that isn't a reader app, Base44 lists three options: remove paid digital content from the iOS app and keep selling it on the web version; release the iOS app only on the US App Store and link to your website for the purchase, where \"Apple can still reject the app during review\"; or wait until Base44 supports in-app purchase. On Android, its page says not to add a button or link that sends people to pay on your website, because Google allows that only through its own program, which needs native support Base44 apps don't have. The Android app may still show content people have already bought on the web.\n\nThere is a fourth route: move the app's code out of Base44's wrapper into a native build that can use StoreKit and Play Billing. Base44's [developer docs](https://docs.base44.com/developers/app-code/local-development/github) describe two-way GitHub sync of your app's code on the Builder plan or higher, which is where that build would start. It is a bigger job, quoted after the audit, and the audit first checks whether one of Base44's own options is enough."
      },
      {
        "id": "replit",
        "heading": "Can Replit publish my app to the App Store and Google Play?",
        "body": "To the App Store, yes; to Google Play, not yet. As of November 2026, [Replit's mobile docs](https://docs.replit.com/features/artifact-types/building-mobile-apps) say it builds apps in React Native with Expo and guides you through TestFlight and App Store submission, which needs an Apple Developer Program membership. The same page says: \"Publishing to Google Play is not yet supported by Replit.\"\n\nSo taking a Replit app to the Play Store is the gap: a release build signed for Google Play, the store listing, the [Data safety form](https://support.google.com/googleplay/android-developer/answer/10787469) that Google requires \"including apps on closed, open, or production testing tracks\", and, for a personal account created after 13 November 2023, the 12-tester closed test below.\n\nReplit's Agent can set up RevenueCat for in-app purchases, and its [payments page](https://docs.replit.com/build/mobile-payments) says you can't route around in-app purchase with an external payment link. The rules allow more in the US: on Apple's US storefront, 3.1.1(a) allows that link, within the limits set out above, and on Google Play so does Google's US external content links program, after enrolment and for a service fee."
      },
      {
        "id": "app-review",
        "heading": "Will Apple reject my Lovable app as just a website?",
        "body": "It can. Guideline 4.2 asks for \"features, content, and UI that elevate it beyond a repackaged website\", and a shell that shows your site with its web menus and links gives a reviewer nothing more. The fix is to make the app do things the website can't and to show the reviewer where they are. Sameem's [guide to the guideline 4.2 rejection](https://sameemamjad.com/guides/app-store-guideline-4-2-minimum-functionality) covers the changes and the reply.\n\nOther rules apply to wrapped web apps too, all read on 7 November 2026. Guideline 2.1(a) rejects apps that crash or show placeholder content and asks for demo account details when the app has a login. 4.8 says an app that signs people in with a third-party or social login, such as Google Sign-In, must also offer an equivalent login. That login has to limit data collection to name and email, let people keep their email private and not collect their interactions with the app for advertising without consent. Apps that use only their own sign-in are among the exceptions.\n\n5.1.1(v) says: \"If your app supports account creation, you must also offer account deletion within the app.\" Apple's [App Privacy details](https://developer.apple.com/app-store/app-privacy-details/) must declare what your app and its third-party code collect, and Apple says that information \"is required to submit new apps and app updates\". And 4.2.6 rejects apps \"created from a commercialized template or app generation service\" unless they are \"submitted directly by the provider of the app's content\", a rule aimed at services that submit apps for their clients. Guideline 5.2.1 also asks that apps be submitted by the person or legal entity that owns or has licensed the app's intellectual property, so whose developer account the app goes out under matters: by default it is your own. Our [launch checklist's Store review group](/insights/vibe-coded-app-security-checklist#group-store-review) turns these rules into tests you can run yourself before you submit.\n\nThe 2026 reports of Apple blocking \"vibe coding\" apps were about builder apps that generate and run code inside themselves, which guideline 2.5.2 forbids. 9to5Mac reported on 30 March 2026, crediting The Information, that Apple had blocked updates to the Replit and Vibecode apps and removed another, Anything, under guideline 2.5.2. In a statement to 9to5Mac, Apple said the problem was not vibe coding apps per se. Those actions were about the builder apps themselves, not about apps made with them."
      },
      {
        "id": "google-play-testing",
        "heading": "Does Google Play's 12 testers for 14 days rule apply to me?",
        "body": "Only if you publish from a personal Play Console account created after 13 November 2023. Google's [testing requirements page](https://support.google.com/googleplay/android-developer/answer/14151465), read 7 November 2026, says those accounts \"must run a closed test for their app with a minimum of 12 testers who have been opted in continuously for at least 14 days\". They then apply for production access by answering questions about the test, the app and its readiness. Until then, Production stays disabled in Play Console, and Google says its review of that application usually takes seven days or less but can take longer. So publishing a Lovable app to Google Play from such an account includes at least 14 days of closed testing, then Google's production access review.\n\nGoogle counts only testers who opt in to the closed test and stay opted in for 14 days in a row. Its page says the most common way to recruit them is through your personal and professional networks, so start before the build is ready. We set up the closed test and the production access application; the testers are people you bring, and we don't sell tester services. Sameem's [guide to the 12-tester rule](https://sameemamjad.com/guides/google-play-closed-testing-12-testers-14-days) covers what resets the clock and when an organisation account is the better route."
      },
      {
        "id": "cost",
        "heading": "What does it cost to take a Lovable app to the App Store and Google Play?",
        "body": "Going from Lovable to the App Store and Google Play means two store fees, whoever does the work: Apple's developer program is $99 a year and Google Play's registration is US$25 once. Beyond that, the price depends on the route, from a monthly wrapper subscription to a flat-fee rebuild service to our audit and launch. Third-party prices below were read on each seller's own page on 7 November 2026 and may change; DevoraX sells the last two rows.",
        "table": {
          "caption": "What publishing a Lovable app costs (prices read 7 November 2026)",
          "headers": [
            "Option",
            "Price",
            "What it covers",
            "Source"
          ],
          "rows": [
            [
              "Apple Developer Program",
              "$99 a year (Apple: \"99 USD per membership year\"; may vary by region)",
              "TestFlight and App Store distribution",
              "[developer.apple.com](https://developer.apple.com/programs/enroll/)"
            ],
            [
              "Google Play developer account",
              "US$25, one time",
              "Publishing on Google Play",
              "[support.google.com](https://support.google.com/googleplay/android-developer/answer/6112435)"
            ],
            [
              "Twinr (wrapper subscription)",
              "$25 a month for its Basic plan on monthly billing, plus session bundles as your app's traffic grows; in-app purchase and deep linking start on the $85-a-month Standard plan",
              "Wraps your web app as iOS and Android apps, with push",
              "twinr.dev/pricing-plans"
            ],
            [
              "LetsDeployIt (publishing service)",
              "$349.50 flat for one store and $499.50 for both, shown as reduced from $699 and $999; $99.50 for the React Native code alone",
              "Rebuilds the screens in React Native and Expo, prepares the listings and submits; three months of care included, then $99 a month",
              "letsdeploy.it/lovable-to-app-store"
            ],
            [
              "Foresight Mobile (paid review)",
              "£95",
              "A review of an AI-built app's code, security, stability and account ownership",
              "foresightmobile.com/blog/lovable-to-app-store"
            ],
            [
              "DevoraX launch-readiness audit",
              "$400, credited to the launch if you go ahead",
              "A written review of code, database security, payments, hosting and store readiness",
              "[Pricing](/pricing)"
            ],
            [
              "DevoraX iOS and Android launch",
              "From $2,400, two weeks of our work; a full React Native build is quoted after the audit",
              "Native features such as push and deep links, the store listing, App Privacy details and the Data safety form, testing, submission and review answers; in-app purchase or a US web-checkout link is a separate line in your launch quote",
              "[Pricing](/pricing)"
            ]
          ]
        }
      },
      {
        "id": "cheaper-options",
        "heading": "Is there a cheaper way to publish my app to the stores?",
        "body": "Often, yes. Our launch costs more than most routes in the table above, so take a cheaper one whenever your situation matches a row below. Each is described from its own page or docs, read on 7 November 2026. Wrappers can handle purchases too: Median's [in-app purchase docs](https://docs.median.co/docs/iap) (updated 20 January 2026) say its plugin \"provides full support for integrating Apple's StoreKit and Google Play Billing libraries\".",
        "table": {
          "caption": "Which route fits your app (as of November 2026)",
          "headers": [
            "Your situation",
            "A cheaper route that may be enough",
            "Why"
          ],
          "rows": [
            [
              "A Base44 app that sells nothing digital",
              "Base44's own store files",
              "It scans the app, generates both files and can add push; you upload them"
            ],
            [
              "A Replit app that only needs iOS",
              "Replit's guided TestFlight and App Store flow",
              "Replit submits builds to TestFlight and you promote one to the App Store; Google Play is the part it doesn't do yet"
            ],
            [
              "You sell physical goods or services used outside the app",
              "A wrapper and the Stripe checkout you already have",
              "Apple requires a payment method other than in-app purchase for these (3.1.3(e)), and Google Play's billing must not be used for them"
            ],
            [
              "Your iOS app is for Apple's US storefront only, and what people pay for is used on your website rather than unlocked in the app",
              "A wrapper and a link to your Stripe checkout",
              "3.1.1(a) allows the link in US storefront apps; App Review decides, and 3.1.1 and 3.1.3(b) still govern anything unlocked inside the app. On Google Play, the same link needs Google's US program and its fee"
            ],
            [
              "A working web app that needs a store listing, push and simple in-app purchase",
              "A wrapper service such as Twinr or Median",
              "The native layer is already built: Twinr includes in-app purchase from its $85-a-month Standard plan, and Median offers a per-app license with native plugins, its in-app purchase plugin among them, as add-ons"
            ],
            [
              "You want the screens rebuilt natively for a flat fee",
              "A publishing service such as LetsDeployIt",
              "A flat fee per plan (one store or both) with resubmissions included, and it refunds the fee if it can't get a policy-compliant app through review"
            ],
            [
              "You only want a second opinion before you submit",
              "A paid review such as Foresight Mobile's",
              "It costs less than our audit"
            ],
            [
              "Rejected already, selling digital goods in several storefronts, or needing native work none of these covers",
              "Our audit, then the launch",
              "Native features, the store listing and privacy forms, both stores' testing and the review answers in one launch, with in-app purchase or a US web-checkout link as a separate line in your launch quote"
            ]
          ]
        }
      },
      {
        "id": "submissions",
        "heading": "Has anyone at DevoraX submitted apps to the stores before?",
        "body": "Yes. Sameem Amjad, DevoraX's founder, has personally prepared and submitted iOS builds to App Review, published Android apps to Google Play production, shipped in-app purchase and answered store rejections. Usman, DevoraX's CTO, sometimes helps with that part, and [the terms below](#terms) say who works on your app. [Our Fiverr record](/reviews), on the profile in Sameem's name, is a 5.0 rating across 50+ projects since January 2022.\n\nThe proof below shows three apps now in the stores that Sameem built or worked on: Hear With You, Three28 and Dooz Cars. Each card says only what his part was in that app; the submission record above isn't tied to any of them. None of them was built with Lovable, Base44 or Replit. They show the app and backend work behind apps in the stores, and the builder-specific steps on this page are our method, checked against each builder's docs."
      }
    ],
    "proof": [
      {
        "type": "project",
        "project_id": 34,
        "name": "Hear With You",
        "role": "A client hired Sameem directly for it, March to May 2026: he built the Flutter app, the NestJS backend, the Next.js admin dashboard and landing page, and the cloud infrastructure and deployment pipeline.",
        "what_it_proves": "A cross-platform Flutter app with its own backend, admin and deployment pipeline, now on the App Store. It is not a Lovable app, so it shows the native app and backend work rather than the Lovable-specific steps.",
        "figures": [
          "App Store: apps.apple.com/us/app/hear-with-you/id6766187555",
          "On the App Store since June 2026"
        ]
      },
      {
        "type": "project",
        "project_id": 19,
        "name": "Three28",
        "role": "Three28 hired Sameem Amjad, DevoraX's founder, directly, and he worked on the app, which is built on React Native and NestJS with the backend hosted on AWS.",
        "what_it_proves": "A React Native app on the App Store since July 2024. React Native is what a Lovable app's screens are rebuilt in when the audit says a wrapper won't carry it; Three28 itself is not a Lovable app.",
        "figures": [
          "App Store: apps.apple.com/us/app/three28/id6504447934",
          "On the App Store since July 2024"
        ]
      },
      {
        "type": "project",
        "project_id": 25,
        "name": "Dooz Inspected Cars",
        "role": "Dooz hired Sameem directly, and he worked on its shared NestJS backend, which serves the Angular web app at dooz.com and the React Native apps for iOS and Android.",
        "what_it_proves": "The backend half of a store launch: one NestJS API serving an iOS app, an Android app and a website. It is backend work, not proof of store submission.",
        "figures": [
          "On the App Store as Dooz Cars (id1627030530)",
          "On Google Play as com.dooz.app"
        ]
      },
      {
        "type": "review",
        "username": "cedric_coleman",
        "job": "A OneSignal push, in-app and email notification integration for existing iOS and Android apps (the review doesn't say how they were built)",
        "note": "Push is one of the native features Lovable's docs send to a Capacitor wrapper. The reviewer describes a \"full OneSignal integration for both iOS and Android apps\"."
      },
      {
        "type": "asset",
        "href": "/insights/vibe-coded-app-security-checklist#group-store-review",
        "label": "The vibe-coded app security and launch checklist",
        "what_it_proves": "The store checks from this page, each with a test, so you can check your app yourself before you pay anyone."
      }
    ],
    "included": [
      "The launch-readiness audit: your code, database security, payments, hosting and store readiness, in a written report you keep whatever you decide",
      "A verdict on PWA, wrapper or React Native rebuild for your app, with reasons",
      "A verdict on in-app purchase for your app: StoreKit, Play Billing or RevenueCat, or a US web-checkout link, storefront by storefront (building it is a separate line in your launch quote)",
      "Release builds for iOS and Android, with your built app bundled inside the wrapper",
      "Native features such as push notifications and deep links",
      "The store listing, App Privacy details and Google Play's Data safety form",
      "TestFlight and Google Play internal testing builds you install on your own phone",
      "Google Play's closed test and production access application, where your account needs them",
      "Submission to the App Store and Google Play, with review notes and a demo account for the reviewer"
    ],
    "quoted_separately": [
      "In-app purchase (StoreKit, Play Billing or RevenueCat) or a US web-checkout link: a separate line in your launch quote",
      "A full React Native rebuild, quoted after the audit",
      "Fixes the audit finds outside the store launch: a finish sprint at $1,200 a week",
      "Stripe checkout or subscriptions on the web, if they aren't set up yet: the Payments step, from $1,200",
      "Updates and new releases after handover, beyond the free defect fixes in [the terms above](#terms): monthly care at $1,500 a month, or a single release quoted per change",
      "Apple's and Google's developer fees, which you pay to them directly"
    ],
    "faqs": [
      {
        "q": "Apple rejected my app. Can you take it from here?",
        "a": "Yes, if a change to the app can answer the reason Apple gave. Bring the rejection message to the free call: we read which guideline it cites and what the reviewer saw, and tell you whether the audit comes first. If no change can answer it, we say so there. Otherwise the work is quoted before it starts, then we change the app, reply in App Store Connect and resubmit. The stores decide approval."
      },
      {
        "q": "Can I try my Lovable app on my iPhone before it goes to the App Store?",
        "a": "Yes, through Apple's TestFlight app, once a build is uploaded to App Store Connect. As of November 2026, [Apple](https://developer.apple.com/testflight/) lets up to 100 members of your development team with certain App Store Connect roles test as internal testers, while external testers need your first build to clear Apple's TestFlight review. On Android, Google Play's internal testing track does the same job."
      },
      {
        "q": "Can my Lovable app send push notifications?",
        "a": "Yes, in two ways. Added to the home screen as a web app, it can receive web push on iPhone and iPad from iOS and iPadOS 16.4, according to [WebKit](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/), if it is built to use it. In a store app, Lovable's docs put push on a Capacitor wrapper built outside Lovable, which needs credentials from your Apple developer account and, for Android, Firebase. Sameem's guide covers [the missing push capability on iOS](https://sameemamjad.com/guides/onesignal-missing-push-capability-ios)."
      },
      {
        "q": "Can I put a Base44 app on Google Play?",
        "a": "Yes. Base44 generates the Google Play file, an AAB, and you upload it in Play Console. Plan for two things. Google Play Billing isn't supported in Base44 apps yet, so digital sales inside the app need another route. And a personal Play account created after 13 November 2023 has to finish the 12-tester closed test before it can publish to production."
      },
      {
        "q": "How long before my app is in the stores?",
        "a": "We can't promise a date, because Apple and Google run their own reviews. Our part is counted in weeks: the audit gives the number before work starts, and the launch from $2,400 is two weeks of our work. Then come the outside waits: a D-U-N-S Number if you publish as a company, at least 14 days of closed testing and Google's production access review for a new personal Play account, and App Review."
      },
      {
        "q": "If I change my app in Lovable, do store users get the change straight away?",
        "a": "No, not in a bundled app. Its screens ship inside the app rather than loading from your website, so each change reaches users only through a new store build. That is why we suggest waiting until the app settles before the launch, or using the web version in the meantime. After launch, new store builds go through monthly care or a single release quoted per change."
      }
    ],
    "when_not_to_hire": "If one of the cheaper routes in the table above fits your app, take it: it will cost less than our launch. If your app still changes every day in Lovable, a bundled wrapper means a new store build for each change, so wait until it settles or use the PWA for now.\n\nIf you need someone to promise that Apple and Google will accept the app, we won't: no one can guarantee approval, because the stores decide. And if your launch date depends on a review finishing by a set day, we can't promise review times, because Apple and Google set them.",
    "related_slugs": [
      "fix-vibe-coded-app",
      "sharetribe-developers"
    ],
    "secondary_cta": {
      "label": "Why Apple rejects some wrapped web apps (guideline 4.2)",
      "href": "https://sameemamjad.com/guides/app-store-guideline-4-2-minimum-functionality"
    },
    "updated": "2026-11-11T00:00:00.000Z"
  },
  {
    "kind": "offer",
    "role": "offer",
    "slug": "sharetribe-developers",
    "primary_keyword": "sharetribe developers",
    "secondary_keywords": [
      "sharetribe development company",
      "sharetribe custom code",
      "sharetribe multi vendor",
      "sharetribe multi language"
    ],
    "nav_label": "Sharetribe Developers",
    "h1": "Sharetribe developers for custom features and the native iOS and Android app",
    "title": "Sharetribe Developers: Custom Code and Native App",
    "meta_description": "Sharetribe developers for custom features, payout changes and a native iOS and Android app. Features quoted in $1,200 sprint weeks from your requirements.",
    "subtitle_lead": "Custom features, changes to seller payouts and the native iOS and Android app, for marketplaces already on Sharetribe. Feature work is quoted in sprint weeks from your requirements; on the free call we tell you whether an audit comes first.",
    "offer_steps": [
      "audit",
      "sprint",
      "payments",
      "launch"
    ],
    "price_notes": {
      "audit": "$400, credited to the paid step that follows if you go ahead",
      "sprint": "$1,200 per week · the number of weeks is in your quote",
      "payments": "Only for a marketplace moving off Sharetribe's built-in payments, which most don't need ([why](#payouts)): from $1,200 (one week of our work) · Connect payouts from $2,400 (two weeks)",
      "launch": "From $2,400 (two weeks of our work) · first, a full React Native build, quoted in $1,200 sprint weeks after the $400 audit, which is credited to it"
    },
    "hero_answer": "DevoraX adds custom features, payout changes and a native app to Sharetribe marketplaces. For a marketplace already on Sharetribe, custom features are quoted in $1,200 sprint weeks. A native app is a full React Native build, quoted in $1,200 sprint weeks after the $400 audit, which is credited to it, and its iOS and Android launch starts from $2,400. The first step is a free 30-minute call, where we tell you whether the audit comes first: it does for a native app, or when your marketplace runs custom code from another developer or an AI coding tool, and the $400 is then credited to the paid step that follows.",
    "key_points": [
      {
        "heading": "Console first, code second",
        "body": "If what you need is a Console setting, such as fields, categories, texts or access control, we tell you to set it yourself rather than pay a developer."
      },
      {
        "heading": "Tried in Dev, then Live",
        "body": "Custom features and transaction process changes are built and tested in your Dev environment before they reach Live, so real payments never meet untested code."
      },
      {
        "heading": "Earlier code checked first",
        "body": "If a previous developer, you or an AI coding tool changed your template's code, the audit checks it before real payments run through it."
      }
    ],
    "triggers": [
      "You need something Sharetribe's no-code Console can't do: a marketplace in several languages at once, one cart across several sellers, a refundable deposit, or a different rule for when sellers get paid.",
      "Some of your sellers bank in countries Sharetribe's built-in Stripe payouts don't reach, and you need to know which payout route could work before anyone writes code.",
      "Customers ask for an app in the App Store and Google Play, and you can't tell whether a wrapper, a template or a custom app is worth the money.",
      "Someone changed your template's code (a previous developer, you, or an AI coding tool) and you want it checked before real payments run through it.",
      "You're still exploring options and want to keep costs down, so you need to know what you can set up yourself and what needs a developer."
    ],
    "process": [
      {
        "heading": "A free call about your marketplace as it runs today",
        "body": "We go through what you want built, which Sharetribe plan you're on, where your sellers bank, and whether your copy of the Sharetribe Web Template carries custom code. If what you need turns out to be a Console setting, we say so, and you won't need us for it.\n\nCalls run Monday to Friday, 10 am to 6 pm and 7 pm to 11 pm Pakistan time (UTC+5). The evening slots are 9 am to 1 pm US Eastern, or 10 am to 2 pm while the US is on daylight saving time."
      },
      {
        "heading": "The $400 audit, when there is code to read or a full app to quote",
        "body": "We have to read custom code someone else wrote, by hand or with an AI coding tool, before we can price work on it. So a marketplace that already runs such code starts with the audit, and a full React Native app is quoted in $1,200 sprint weeks after it. In the audit we review your code, database security, payments, hosting and store readiness, and you keep the written report whatever you decide. It is an engineering review, not a security certification. The $400 is credited to the paid step that follows, and [the terms below](#terms) say when the report arrives.\n\nSharetribe Web Template work with no custom code is quoted from your requirements. If your marketplace is still the no-code version Sharetribe hosts for you, and you need template work rather than an app, we skip this step."
      },
      {
        "heading": "A quote in sprint weeks",
        "body": "From your requirements, or from the audit, we quote the number of sprint weeks at $1,200 a week before work starts. If the work takes longer than the audit or the written quote estimated, we finish the agreed scope at no extra cost. [The terms below](#terms) say when the next sprint can start."
      },
      {
        "heading": "Built in your Dev environment, then released to Live",
        "body": "We write and test custom code against your marketplace's Dev environment, which comes with Sharetribe's Build plan, so we try changes to the transaction process there before real money touches them. Releasing the code needs the Live plan and a host for the customised frontend. Sharetribe also warns that Dev and Live need the same configuration, since a listing field used in Dev but missing in Live may break your marketplace ([its article on AI-assisted coding](https://www.sharetribe.com/help/en/articles/16691041-what-you-can-and-can-t-do-with-ai-assisted-coding-vibecoding), 11 September 2026)."
      },
      {
        "heading": "The app and the stores, if you need them",
        "body": "For the iOS and Android launch we add native features such as push notifications and deep links, and fill in the store listing, App Privacy details and Google Play's Data safety form. We prepare the app against Apple's and Google's guidelines, submit it and answer the reviewers. The stores decide approval. [The native app section below](#native-app) compares the routes to an app and what each costs."
      }
    ],
    "sections": [
      {
        "id": "custom-code",
        "heading": "Sharetribe custom code: which features need it, and which plan runs it live?",
        "body": "As of November 2026, anything Sharetribe's Console can set stays a setting: listing and user types, fields, categories, monetisation, texts, pages, branding, search and access control ([Sharetribe's article on AI-assisted coding](https://www.sharetribe.com/help/en/articles/16691041-what-you-can-and-can-t-do-with-ai-assisted-coding-vibecoding), 11 September 2026). Most features beyond those settings need custom code, though you can wire up a few, such as a subscription fee or identity verification, with Zapier instead. Custom code means you self-host the marketplace website, your own copy of the Sharetribe Web Template, which talks to Sharetribe's backend through its APIs ([how customising with code works](https://www.sharetribe.com/help/en/articles/8463062-how-to-customize-your-marketplace-with-code), 1 October 2026).\n\nThe Build plan is enough to write and test custom code in your Dev environment; putting it in front of real users needs the Live plan. Some help articles still say Extend, which Sharetribe now lists as a legacy plan beside Live. Hosting the customised frontend costs extra every month, and [the cost table below](#cost) has the figures.\n\nSharetribe keeps releasing new versions of the template, and taking one into a customised marketplace is optional. Its [cost article](https://www.sharetribe.com/help/en/articles/8496118-how-much-does-it-cost-to-customize-your-marketplace-with-code) says the merge \"might take no more than 15 minutes\" when nothing conflicts, and \"can take significant development work\" when your code and the release change the same feature. Ask any developer how their changes will keep that cost down.",
        "table": {
          "caption": "What founders ask Sharetribe developers for, and what each takes, from Sharetribe's Help Center (read 7 November 2026)",
          "headers": [
            "What you want",
            "What Sharetribe's help says it takes",
            "How we price it"
          ],
          "rows": [
            [
              "New listing fields, categories, user types, texts or pages",
              "Console settings, no code",
              "Nothing: set them yourself in Console"
            ],
            [
              "A multi-language marketplace, with every text in two or more languages at once",
              "\"Sharetribe does not support multiple languages in your marketplace without coding\" ([languages article](https://www.sharetribe.com/help/en/articles/8418391-supported-languages-and-locales), 6 October 2026)",
              "Sprint weeks"
            ],
            [
              "A multi-vendor shopping cart: one checkout across several sellers",
              "It touches \"data, payments, and the transaction process\", and Sharetribe advises against it unless a developer is involved",
              "Sprint weeks"
            ],
            [
              "A refundable deposit, an extendable booking, or a different rule for when sellers get paid",
              "Transaction process changes ([examples](https://www.sharetribe.com/help/en/articles/11093617-what-features-can-be-built-with-custom-coding)); Sharetribe's AI-coding article says these \"can be considered high risk\" and recommends a developer \"to implement or at least review these changes\"",
              "Sprint weeks"
            ],
            [
              "A monthly fee for the right to post listings",
              "No code: a Stripe payment page, access control in Console and Zapier ([subscription guide](https://www.sharetribe.com/help/en/articles/10125628-how-to-charge-a-subscription-fee-for-user-rights))",
              "Set it up yourself, or sprint weeks to build it into the code"
            ],
            [
              "A new look, extra steps in listing creation, extra checkout fields",
              "Custom code; Sharetribe says visual changes are where AI-assisted coding \"shines\" and flow changes are \"a step up\"",
              "Sprint weeks, or the $400 audit (credited) to review what you built with AI"
            ],
            [
              "Paying sellers outside the 36 countries Sharetribe's Stripe integration pays out to",
              "A different payment system, built with custom code",
              "Not on our price list: [see payment gateways below](#payments)"
            ],
            [
              "A native iOS and Android app",
              "A wrapper, a certified template or a custom app",
              "A full React Native build, quoted in $1,200 sprint weeks after the $400 audit, which is credited to it, then the launch from $2,400: [see the native app section](#native-app)"
            ]
          ]
        }
      },
      {
        "id": "native-app",
        "heading": "Wrapper, template or custom app: who builds your Sharetribe marketplace's native iOS and Android app?",
        "body": "As of November 2026, Sharetribe \"doesn't offer a mobile app out of the box\" ([how to build a mobile app](https://www.sharetribe.com/help/en/articles/12166610-how-to-build-a-mobile-app), 1 October 2026). It lists three routes: Twinr's no-code wrapper, a certified template from Journeyhorizon or DevsCrew, or an app built from scratch on Sharetribe's APIs. Every route runs on the same backend as your website. Each also needs the Live plan (or the legacy Lite plan) once real users get the app, though you can build and test on Build ([Sharetribe's mobile app page](https://www.sharetribe.com/features/marketplace-mobile-app/)).\n\nIf your flows are standard, the wrapper or a template costs less up front, and its provider helps with submission. A wrapper can sell in-app purchases: Twinr's Standard plan includes them for Apple and Google. One review risk for a wrapper is guideline 4.2 of Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality) (last updated 16 October 2026), which asks for \"features, content, and UI that elevate it beyond a repackaged website\". Sameem's guide covers [what to change after a 4.2 rejection](https://sameemamjad.com/guides/app-store-guideline-4-2-minimum-functionality). For a wrapper or a template, plan on your own Apple developer account. Under guideline 4.2.6, apps made from a commercial template or app generation service are rejected unless they are \"submitted directly by the provider of the app's content\".\n\nHiring a Sharetribe developer to build a native iOS and Android app from scratch is worth its cost when your transaction process is far from Sharetribe's defaults. The same goes when the app needs screens your website doesn't have, or when you want to own all of the app's code. That is the route we offer: a full React Native build on Sharetribe's APIs, quoted in $1,200 sprint weeks after the $400 audit, which is credited to it, then the iOS and Android launch from $2,400. Sameem has personally prepared and submitted iOS builds to App Review and published Android apps to Google Play production. He has shipped in-app purchase (StoreKit, Play Billing or RevenueCat) and answered store rejections; Usman sometimes helps.\n\nPublishing under your company? Request a D-U-N-S Number the day you decide. Apple says to allow up to 5 business days to receive it from D&B, then up to 2 business days for Apple to receive it ([Apple's D-U-N-S page](https://developer.apple.com/help/account/membership/D-U-N-S/), read 7 November 2026). A Google Play organisation account needs one too ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/13634885)). The full comparison, including what App Review asks of a marketplace app, is in [Does Sharetribe have a mobile app?](https://sameemamjad.com/guides/sharetribe-mobile-app)",
        "table": {
          "caption": "Three routes to an iOS and Android app for a Sharetribe marketplace, with each provider's published price (read 7 November 2026)",
          "headers": [
            "Route",
            "Who builds and maintains it",
            "Price, as published",
            "Best when"
          ],
          "rows": [
            [
              "Twinr wrapper (no code)",
              "You, in Twinr's builder. If the subscription stops, Twinr deactivates the app from the next billing cycle",
              "Basic $25 and Standard (in-app purchase, deep links) $85 a month, billed monthly; annual billing saves up to 20%; session bundles extra as traffic grows (twinr.dev/pricing-plans). Sharetribe customers get 25% off for life, though [Sharetribe's Twinr article](https://www.sharetribe.com/help/en/articles/13406654-build-a-mobile-app-with-twinr) says in one place that the Basic plan is excluded, so confirm before counting on it",
              "You're still testing whether customers want an app at all"
            ],
            [
              "Journeyhorizon template",
              "Journeyhorizon builds and ships it in Flutter, with shared hosting and one build a month. It keeps the copyright and licenses the code to you",
              "$199 setup, then $249 a month, or $199 a month paid annually; the setup fee excludes changes the stores' policies require. Extending the app with custom code is $349 a month, paid annually, with a 2-year minimum (journeyh.io/sharetribe-mobile-app-template)",
              "Standard Sharetribe flows, and you want a native app soon"
            ],
            [
              "DevsCrew template",
              "DevsCrew configures, hosts and updates it. You own the customisations it builds; a minimum support commitment may apply before code handover",
              "Standard flows from $179 a month billed annually, setup from $299; customised marketplaces from $499 a month billed annually, setup from $2,600, with a 4-month support commitment ([Sharetribe's DevsCrew article](https://www.sharetribe.com/help/en/articles/16040656-build-a-mobile-marketplace-app-with-the-sharetribe-mobile-template-by-devscrew); devscrew.co/sharetribe-mobile-template)",
              "The same, when owning the customisations matters to you"
            ],
            [
              "A custom app on Sharetribe's APIs",
              "A developer you hire, such as us. With us, all code and IP are yours on final payment",
              "A full React Native build, quoted in $1,200 sprint weeks after the $400 audit, which is credited to it, then our iOS and Android launch from $2,400 ([our price list](/pricing))",
              "Your transaction process is far from Sharetribe's defaults, or the app is the product"
            ]
          ]
        }
      },
      {
        "id": "payouts",
        "heading": "How do payouts to our sellers work on Sharetribe, and what can a developer change?",
        "body": "As of November 2026, if your sellers bank in one of the 36 countries Sharetribe lists, seller payouts are built in. On a no-code marketplace you create a Stripe account, follow Sharetribe's [Stripe setup article](https://www.sharetribe.com/help/en/articles/8413086-how-to-set-up-stripe-for-payments-on-your-marketplace) and add your keys in Console. A custom-coded marketplace also sets the Stripe publishable key in its hosted frontend, as Sharetribe's [deployment guide](https://www.sharetribe.com/docs/template/how-to-deploy-template-to-production/#environment-variables) describes. The built-in payments run on Stripe Connect with Custom accounts: the buyer pays at checkout, Stripe holds the money, and Sharetribe's transaction process triggers the payout. Funds can be held for up to 90 days in most countries and up to 2 years for US-based accounts. Once a payout is triggered, Stripe takes roughly 5 to 10 business days to reach the seller's bank ([how Stripe payouts work](https://www.sharetribe.com/help/en/articles/8794582-how-stripe-payouts-work), 6 October 2026).\n\nA developer changes the transaction process: when the payout triggers, a refundable deposit, an extendable booking, how refunds and cancellations work. Sharetribe says: \"The default number of days that it takes for the payout to trigger can be changed with code customization by modifying the transaction process.\" We quote that work in sprint weeks and test the changed process in your Dev environment before it reaches Live.\n\nBecause Sharetribe's built-in integration already pays sellers through Stripe Connect, most Sharetribe marketplaces don't need our Payments step. It applies only to a marketplace moving off Sharetribe's built-in payments and payouts: Stripe checkout and subscriptions from $1,200, and Connect payouts from $2,400, as on our [price list](/pricing). Stripe's own fees for paying sellers are in [the cost table below](#cost).",
        "table": {
          "caption": "When Sharetribe triggers a seller's payout by default (Sharetribe help, 6 October 2026, read 7 November 2026)",
          "headers": [
            "Transaction type",
            "The payout triggers when"
          ],
          "rows": [
            [
              "Calendar booking",
              "2 days after the booking period ends, or when you mark the order complete in Console"
            ],
            [
              "Purchase",
              "The buyer marks the order received, or 14 days after the seller marks it delivered, or you mark it received after a dispute"
            ],
            [
              "Price negotiation",
              "The buyer marks the order received after delivery, or 14 days after the seller marks it delivered, or you mark it received in Console"
            ],
            [
              "Digital download",
              "7 days after the purchase, or when you mark the transaction complete in Console"
            ]
          ]
        }
      },
      {
        "id": "payments",
        "heading": "Sellers outside the built-in Stripe countries: which Sharetribe payment gateway or payout route works?",
        "body": "As of November 2026, Sharetribe's built-in Stripe integration pays sellers only to bank accounts in 36 listed countries. No African country is on the list, and Mexico counts only for marketplaces within Mexico. For anyone else Sharetribe says \"you must integrate a different payment system\" by custom coding, and that the hardest part is \"finding a system that satisfies all your requirements\" ([countries Stripe pays out to](https://www.sharetribe.com/help/en/articles/8418388-countries-and-currencies-supported-by-stripe)). Its AI-coding article adds that a new gateway touches your checkout page, listing pages and transaction process, and advises against building one with AI tools.\n\nBefore anyone writes code, Sharetribe's [developer guide to third-party gateways](https://www.sharetribe.com/docs/how-to/payments/how-to-integrate-3rd-party-payment-gateway/) says to confirm a few things with the provider. Does it work in your country, and does it support a marketplace flow that verifies sellers and splits payments? Does it handle your currencies, pay out to your sellers' countries and give you live access? And what are its fees? The guide also warns about collecting every payment into your own account and paying sellers by hand: \"You could be considered as holding other people's money\", and in many countries that needs a licence.\n\nOur Payments step covers Stripe, for a marketplace moving off Sharetribe's built-in payments. Another gateway or Stripe Global Payouts is not on our price list, and we haven't built either. On the call we tell you whether we would take it on, and how we would quote it. Ask a lawyer whether your business needs a money transmission licence.",
        "table": {
          "caption": "Payout routes beyond Sharetribe's built-in Stripe Connect, and who each can reach (Stripe's and Sharetribe's docs, read 7 November 2026)",
          "headers": [
            "Route",
            "Who it can pay",
            "What it needs",
            "What it means on Sharetribe"
          ],
          "rows": [
            [
              "Stripe Connect cross-border payouts",
              "Connected accounts in the US, UK, EEA, Canada or Switzerland, from a platform in one of those regions; Stripe offers no self-serve cross-border payouts anywhere else ([Stripe's cross-border payouts](https://docs.stripe.com/connect/connect-cross-border-payouts))",
              "One of the funds flows Stripe supports for it, which include destination charges and separate charges and transfers \"without on_behalf_of\"",
              "Sharetribe lists on_behalf_of among the Stripe features its integration relies on, so ask Sharetribe whether this route applies to your setup. Almost every country it covers is already on Sharetribe's list (Croatia and Hungary are among the exceptions), and it can't reach sellers outside those regions"
            ],
            [
              "Stripe Global Payouts",
              "Stripe's headline is \"more than 160 markets\"; its recipient table lists 107 countries (crypto wallets have their own list), including Kenya, South Africa, Egypt and Morocco but not Ghana or Nigeria ([Stripe's recipient countries](https://docs.stripe.com/global-payouts/recipient-countries))",
              "A platform business located in the UK or US (Australia and 21 EU countries can request a private preview), Stripe Treasury, and possibly a licence: Stripe says it is \"best for businesses that already hold the licenses required to move money themselves\" ([Stripe's Global Payouts overview](https://docs.stripe.com/global-payouts))",
              "It is not Sharetribe's built-in Connect flow: payouts go from your platform's own Stripe financial account and aren't tied to payments, so tracking what each seller is owed becomes your code's job ([Stripe's comparison](https://docs.stripe.com/connect/cross-border-payouts-to-recipients/compare-global-payouts))"
            ],
            [
              "Another payment provider, such as PayPal",
              "Whoever that provider can pay out to",
              "The provider's approval for your business: \"Using PayPal requires being approved by PayPal\"",
              "Custom code across checkout, listing pages and the transaction process; Sharetribe's developer guide names PayPal Commerce Platform, MANGOPAY and Adyen for Platforms as examples"
            ]
          ]
        }
      },
      {
        "id": "cost",
        "heading": "What do Sharetribe developers cost, and what else does a custom-coded marketplace cost to run?",
        "body": "Sharetribe's own cost article says most developers charge by the hour and that the total \"can vary greatly depending on the complexity of the changes you need\" (its range is in the table below). So compare quotes on the total price for your scope, not on an hourly rate. We quote in $1,200 sprint weeks up front, with the number of weeks stated in the quote before work starts, and if the work runs over, we finish the quoted scope at no extra cost ([the overrun term below](#terms-overrun)).\n\nAsk any Sharetribe development company you talk to, us included, five questions. Which of these features is a Console setting? Which plan does the work need live? Where will they test transaction process changes before real payments? What happens to the custom code when Sharetribe ships a new template release? And which Sharetribe marketplace can they show you, and whose work was it?\n\nBesides the developer, a custom-coded marketplace pays Sharetribe, its frontend host and Stripe, and once it has an app, Apple and Google:",
        "table": {
          "caption": "Costs of running a custom-coded Sharetribe marketplace, from each provider's own page (read 7 November 2026)",
          "headers": [
            "Cost",
            "Price, as published",
            "Source"
          ],
          "rows": [
            [
              "A developer's custom work, by Sharetribe's estimate",
              "\"Simple changes might get done quickly, costing you only a few hundred dollars\", while complex projects \"could cost tens of thousands\"",
              "[Sharetribe's cost article](https://www.sharetribe.com/help/en/articles/8496118-how-much-does-it-cost-to-customize-your-marketplace-with-code)"
            ],
            [
              "Sharetribe Build plan: code access, Dev and Test only",
              "$39 a month",
              "[Sharetribe pricing](https://www.sharetribe.com/pricing/)"
            ],
            [
              "Sharetribe Live plan: real users and payments, custom code and apps live",
              "$199 a month billed yearly, or $259 billed monthly; usage above 1M credits a month is billed separately",
              "[Sharetribe pricing](https://www.sharetribe.com/pricing/)"
            ],
            [
              "Hosting the customised frontend",
              "About $39 a month on Render (its $25 Pro plan plus about $14 of compute), by Sharetribe's cost article; Sharetribe's pricing page says Render's $19 a month plan \"takes you pretty far\"",
              "[Sharetribe's cost article](https://www.sharetribe.com/help/en/articles/8496118-how-much-does-it-cost-to-customize-your-marketplace-with-code); [Sharetribe pricing](https://www.sharetribe.com/pricing/)"
            ],
            [
              "Stripe's processing fees",
              "Around 1.5-3% of each transaction in a typical case, Sharetribe says",
              "[Sharetribe pricing](https://www.sharetribe.com/pricing/)"
            ],
            [
              "Stripe Connect fees for paying sellers",
              "In the US, $2 a month for each seller paid out that month, plus 0.25% + 25¢ per payout; other countries differ",
              "[Stripe Connect pricing](https://stripe.com/connect/pricing); [Sharetribe on Stripe's fees](https://www.sharetribe.com/help/en/articles/8803821-stripe-s-processing-fees)"
            ],
            [
              "Apple Developer Program",
              "99 USD per membership year",
              "[Apple Developer Program](https://developer.apple.com/programs/whats-included/)"
            ],
            [
              "Google Play developer account",
              "US$25, one time",
              "[Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435)"
            ]
          ]
        }
      },
      {
        "id": "cant-show-yet",
        "heading": "What can't you show us yet?",
        "body": "We have not built or customised a Sharetribe marketplace for a DevoraX client yet. The only live Sharetribe marketplace in Sameem's portfolio is Pastel, where he works as a Senior Software Developer on Pastel's own team, as Pastel's employee; that job is separate from DevoraX work.\n\nWe have no seller payouts to show you: our record holds no Stripe Connect payouts, Global Payouts or other gateway integration. ConstrAction and FirstPass show Stripe payments and subscriptions, which is different work.\n\nDevoraX isn't listed on Sharetribe's Experts Marketplace, so Sharetribe hasn't vetted us; that vetting is why it recommends its Experts.\n\nWe have no public demo of a customised Sharetribe marketplace for you to click through.\n\nThe section below lists what you can check: each project with a line saying whose work it was, and links you can open today. [Our Fiverr record](/reviews) is a 5.0 rating across 50+ projects since January 2022."
      }
    ],
    "proof": [
      {
        "type": "project",
        "project_id": 23,
        "name": "Pastel",
        "role": "Employer work, not DevoraX work: since April 2026 Sameem has worked on Pastel as a Senior Software Developer on Pastel's own team, as Pastel's employee, on its iOS marketplace app. That app first launched in November 2025, before he joined. DevoraX work is separate from his job at Pastel.",
        "what_it_proves": "Sameem's work, as Pastel's employee, on the iOS app of a live marketplace that runs on Sharetribe: an app that reads the same listings and transaction states as Pastel's website and Android app. It is Pastel's product and Sameem's job, not a DevoraX client project.",
        "figures": [
          "Live at mypastel.com",
          "On the App Store as Pastel - Antique Marketplace (id6753628917), first released November 2025",
          "On Google Play as com.anoptico.pastel"
        ]
      },
      {
        "type": "project",
        "project_id": 25,
        "name": "Dooz Inspected Cars",
        "role": "Dooz hired Sameem directly. He worked on the shared NestJS backend behind Dooz's web, iOS and Android apps. Dooz is a custom-built marketplace, not a Sharetribe one.",
        "what_it_proves": "One backend serving an Angular website and React Native apps for iOS and Android, on a marketplace where every listing is a unique car. That is the shape a Sharetribe marketplace takes once a native app sits beside its website. It is not Sharetribe work and not payouts work.",
        "figures": [
          "Live at dooz.com",
          "On the App Store as Dooz Cars (id1627030530)",
          "On Google Play as com.dooz.app"
        ]
      },
      {
        "type": "project",
        "project_id": 33,
        "name": "ConstrAction",
        "role": "A client hired DevoraX through its Fiverr profile, which is in Sameem's name, and Sameem built it as the full-stack engineer.",
        "what_it_proves": "Stripe one-off payments and subscriptions with webhooks on a live product: a contractor pays per contract or on an unlimited monthly plan, and a contractor without a plan meets checkout at the paywall. That is the kind of work our Payments step covers. It is not Stripe Connect: no one is paid out.",
        "figures": [
          "Live at constraction.ca",
          "Demo on sample data, with Stripe in test mode: demoprojectsforclients.sameemamjad.com/projects/constraction"
        ]
      },
      {
        "type": "project",
        "project_id": 37,
        "name": "FirstPass",
        "role": "A demo build on sample data: Sameem built it as the full-stack engineer. It has no live product.",
        "what_it_proves": "Free, Basic, Pro and School plans billed through Stripe in an app with students, instructors and administrators. Payments run in Stripe test mode, so you can try the upgrade path without a real charge. A demo, and not seller payouts.",
        "figures": [
          "Live demo on sample data: demoprojectsforclients.sameemamjad.com/projects/firstpass",
          "Payments in the demo run in Stripe test mode"
        ]
      },
      {
        "type": "project",
        "project_id": 19,
        "name": "Three28",
        "role": "Three28 hired Sameem directly, and he worked on the app, which is built on React Native and NestJS with the backend hosted on AWS.",
        "what_it_proves": "A React Native app with its own backend, live on the App Store since July 2024. React Native is what a full app build on our price list uses. It is not a marketplace on Sharetribe.",
        "figures": [
          "On the App Store since July 2024 (apps.apple.com/us/app/three28/id6504447934)"
        ]
      },
      {
        "type": "review",
        "username": "matthew4l2",
        "job": "Stripe payment integration and a user dashboard in a Next.js 15 app; the review mentions no marketplace, Sharetribe or seller payouts",
        "note": "A Fiverr buyer on Stripe work Sameem did for them: he \"integrated Stripe payment API\". Next.js is a React framework, and React is what Sharetribe says custom code needs beyond look-and-feel changes."
      }
    ],
    "included": [
      "Custom features on your copy of the Sharetribe Web Template, built and tested in your Dev environment, then released to Live",
      "Transaction process changes, tried in Dev before they touch real payments",
      "Deployment of the customised frontend to your own hosting account, by default",
      "The Payments step, only for a marketplace moving off Sharetribe's built-in payments, which most Sharetribe marketplaces don't need ([the payouts answer](#payouts) says why): Stripe checkout and subscriptions, and Connect payouts to sellers, set up in your own Stripe account by default",
      "iOS and Android launch: native features such as push notifications and deep links, the store listing, App Privacy details and the Data safety form, then the builds, the submission, and answering App Review and Google Play review for the agreed scope, as [the terms above](#terms) say. The stores decide approval.",
      "The audit, when the call shows you need one: a written report on your custom code, database security, payments, hosting and store readiness, yours whatever you decide",
      "All code and IP are yours on final payment"
    ],
    "quoted_separately": [
      "A full React Native app on Sharetribe's APIs, quoted in $1,200 sprint weeks after the $400 audit, which is credited to it",
      "A payment system other than Stripe, or Stripe Global Payouts: not on our price list; we tell you on the call whether we would take it on",
      "Monthly care after the free defect fixes in [the terms above](#terms): fixes, updates and new releases at $1,500 a month, or a single release quoted per change"
    ],
    "faqs": [
      {
        "q": "Do we have to hire a Sharetribe Expert, or can another developer work on our marketplace?",
        "a": "No, an Expert isn't required. Sharetribe's [guide to hiring a developer](https://www.sharetribe.com/help/en/articles/8506408-how-to-hire-a-developer-to-customize-your-marketplace-with-code) (6 May 2026) says \"hiring a Sharetribe Expert is not mandatory to customize Sharetribe\". For anything beyond look-and-feel changes, it names JavaScript, React and building interfaces from components as the skills needed. DevoraX isn't listed on Sharetribe's Experts Marketplace, so judge us on [our Fiverr record](/reviews) and the free call."
      },
      {
        "q": "Can our Sharetribe marketplace use PayPal instead of Stripe?",
        "a": "Only with custom code, and only after PayPal approves your business. As of November 2026, Sharetribe's help says PayPal \"is not available to use for most new marketplace businesses\" and that \"Using PayPal requires being approved by PayPal\" ([countries and currencies Stripe supports](https://www.sharetribe.com/help/en/articles/8418388-countries-and-currencies-supported-by-stripe)). Ask PayPal first. We have not built a PayPal integration on Sharetribe, and it is not on our price list."
      },
      {
        "q": "Will our marketplace's iOS app have to use Apple's in-app purchase?",
        "a": "Not for physical goods or services used outside the app. As of November 2026, Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) say those must be paid for by other methods, such as Apple Pay or card entry (3.1.3(e)), which is where Sharetribe's Stripe checkout fits. Digital features unlocked in the app, such as a paid seller membership, can fall under in-app purchase (3.1.1), and \"One-to-few and one-to-many real-time services must use in-app purchase\" (3.1.3(d)). [The Lovable page](/solutions/lovable-app-to-app-store#in-app-purchase) has both stores' rules."
      },
      {
        "q": "We built features on the Sharetribe template with an AI coding tool. Can you review them before we go live?",
        "a": "Yes. That is when the $400 audit comes first, credited to the paid step that follows. Sharetribe's [article on AI-assisted coding](https://www.sharetribe.com/help/en/articles/16691041-what-you-can-and-can-t-do-with-ai-assisted-coding-vibecoding) (11 September 2026) draws the line: \"For most people, if it's about money, identity, or private data, hiring a professional developer is recommended.\" Two checks in [our security checklist](/insights/vibe-coded-app-security-checklist), keeping secret keys out of the browser and deciding prices on the server, apply to a Sharetribe template too."
      },
      {
        "q": "Does Sharetribe come with a mobile app?",
        "a": "No native one. Sharetribe does not ship an iOS or Android app, so the choice is between a wrapper, a template and a custom app. A wrapper or a template costs less up front if your flows are standard. A custom app is a full React Native build on Sharetribe's APIs, reading the same listings and transactions as your website, and the audit comes before it."
      },
      {
        "q": "We already take payments through Sharetribe. Do we need your Payments step?",
        "a": "Probably not. Our Payments step is for a marketplace moving off Sharetribe's built-in payments, and most Sharetribe marketplaces don't need it: those payments already pay sellers through Stripe Connect. If some sellers bank in countries Sharetribe's built-in Stripe payouts don't reach, we look at which payout route could work before anyone writes code."
      }
    ],
    "when_not_to_hire": "If what you need is a Console setting (fields, categories, texts, pages, access control), set it yourself and keep the developer's fee; Sharetribe's support chat can point you to the right screen. If your flows are standard and you want an app soon, a wrapper or a certified template costs less up front: [the native app section](#native-app) compares them.\n\nIf you want a developer Sharetribe has vetted, hire from Sharetribe's Experts Marketplace: we aren't listed there yet. If no payment provider has agreed to pay your sellers where they live, settle that before paying anyone for code. And if you're no longer sure Sharetribe is the right base, read [where the line between Sharetribe and a custom build falls](/insights/sharetribe-vs-custom-marketplace-build) first.",
    "related_slugs": [
      "multi-vendor-marketplace-development",
      "lovable-app-to-app-store",
      "fix-vibe-coded-app"
    ],
    "secondary_cta": {
      "label": "Compare the three routes to a Sharetribe app",
      "href": "https://sameemamjad.com/guides/sharetribe-mobile-app"
    },
    "updated": "2026-11-11T00:00:00.000Z"
  },
  {
    "kind": "offer",
    "role": "offer",
    "slug": "fix-vibe-coded-app",
    "primary_keyword": "vibe code audit",
    "secondary_keywords": [
      "fix my vibe coded app",
      "fix vibe coded app",
      "vibe coded app audit",
      "vibe coding audit",
      "vibe code security audit",
      "vibe code security review",
      "lovable production ready",
      "is base44 production ready",
      "ai generated code audit"
    ],
    "nav_label": "Vibe Code Audit",
    "h1": "A $400 vibe code audit, then we fix and finish your Lovable, Base44, Replit or Bolt app",
    "title": "Vibe Code Audit ($400), Then We Fix Your App",
    "meta_description": "Vibe code audit for Lovable, Base44, Replit and Bolt apps: $400, credited to the fix, then a finish sprint at $1,200 a week, usually 1-2 weeks.",
    "subtitle_lead": "Keep, harden or rebuild: the audit decides, part by part, before any fix is priced. Only payments broken? The free call can skip the audit.",
    "offer_steps": [
      "audit",
      "sprint",
      "payments",
      "care"
    ],
    "hero_answer": "DevoraX's vibe code audit is a $400 engineering review of an app built with Lovable, Base44, Replit, Bolt or Cursor, and the $400 is credited to the fix if you go ahead. We read the code, check its database rules, secrets, payments, hosting and store readiness, and give you a written report with a keep, harden or rebuild verdict for each part and the fix estimated in $1,200 sprint weeks (a finish sprint usually takes 1-2 weeks). It is not a security certification, and it does not replace a penetration test. Book the free 30-minute call first: we tell you there whether your app needs the audit at all.",
    "key_points": [
      {
        "heading": "Starts where your scan stops",
        "body": "We begin from what your builder's own security scan already reported, so you never pay us to repeat a check you can run yourself for free."
      },
      {
        "heading": "Tested the way outsiders would",
        "body": "We send real requests signed out and as a second test user, and run a test-mode purchase to check that access follows payment."
      },
      {
        "heading": "A report you keep",
        "body": "The written report is yours whatever you decide: fix the app yourself, hand the report to another developer, or hire us to do the work."
      }
    ],
    "triggers": [
      "The app works in the demo, but it has been stuck at 90% for weeks: sign-in, payments or deploys keep breaking.",
      "Every fix you prompt breaks something else, so each small edit feels like a gamble and burns credits.",
      "Your builder or Supabase shows security warnings you don't know how to fix, and you've been clicking past them.",
      "A first paying customer, a client or an investor has asked whether the app is production-ready.",
      "Users pay, but the app never unlocks what they paid for, or the subscribe button leads nowhere.",
      "You want the app and its data off Lovable Cloud, in a Supabase project you control."
    ],
    "process": [
      {
        "heading": "A free 30-minute call decides whether you need the audit",
        "body": "Tell us what the app does, who uses it and what has to happen by when, and we'll say whether you need the audit. An app with no users, no payments and no deadline yet may not need us at all.\n\nCalls run Monday to Friday, 10 am to 6 pm and 7 pm to 11 pm Pakistan time (UTC+5). The evening slots are 9 am to 1 pm US Eastern, or 10 am to 2 pm while the US is on daylight saving time."
      },
      {
        "heading": "You give us read access to the code",
        "body": "A GitHub repository is simplest. As of November 2026, Lovable's Git sync works on every plan, Base44's two-way GitHub sync needs its Builder plan or higher, and Replit's Git pane pushes to GitHub. For Bolt, Cursor or Claude Code projects, a repository or a copy of the code works the same way. Lovable's sync carries the database migration files, where Lovable records the schema and access-rule changes it makes from the chat. Rules changed outside the chat may not be in those files, which is one reason the audit also tests the running app.\n\nWe also ask for a test account for each kind of user and, if you take payments, a way to run a test-mode checkout. The report's clock starts when we have access; [the terms below](#terms) say when it usually arrives."
      },
      {
        "heading": "We read the code and test it the way an outsider would",
        "body": "The audit covers five areas: code, database security, payments, hosting and store readiness. We start from what your builder's own scan already reported, so you don't pay us to repeat it. Data rules get real requests, sent signed out and as a second test user who shouldn't see the first user's records. Payments get a test-mode purchase to check that access follows it, and we read how the code handles renewals, failed payments and cancellations.\n\nIf the app is headed for the App Store or Google Play, the store-readiness part lists what the launch will need, and [Lovable app to the App Store](/solutions/lovable-app-to-app-store) covers that work. Sameem Amjad, DevoraX's founder, has personally prepared and submitted iOS builds to App Review, published Android apps to Google Play production, shipped in-app purchase with StoreKit, Play Billing or RevenueCat, and answered store rejections. Usman, DevoraX's CTO, sometimes helps. The stores decide approval."
      },
      {
        "heading": "You get a written report with a verdict for each part",
        "body": "Each part of the app gets a keep, harden or rebuild verdict with reasons, and the fix is estimated in $1,200 sprint weeks before any work is priced. The report is yours whatever you decide: fix it yourself, hand it to another developer, or hire us. [See what the report contains](#sample-report)."
      },
      {
        "heading": "We fix and finish it in sprints",
        "body": "A finish sprint is $1,200 a week and usually takes 1-2 weeks, with the $400 audit credited to it. We fix what the audit found and get the app to launch; the start date in [the terms below](#terms) says when the next sprint can begin. Payments (from $1,200) and the iOS and Android launch (from $2,400) follow if you need them. If the work runs past the audit's estimate, [the overrun term below](#terms-overrun) applies."
      }
    ],
    "sections": [
      {
        "id": "audit-vs-scan",
        "heading": "What does a vibe code audit add to Lovable's built-in scans?",
        "body": "Mostly what a static scan can't confirm by reading code: whether your app's rules match what your business means, whether access really follows payment when the app runs, and whether the app can be recovered, run and handed over. As of November 2026, [Lovable's security overview](https://docs.lovable.dev/features/security) describes a Quick scan that runs every time you publish and a Deep scan that runs when someone starts it (Enterprise plans can also schedule it). It says the two 'do not replace a thorough security review', and for apps handling sensitive data or critical functionality it suggests 'an additional professional security review'. So on security, a vibe code security review overlaps with Lovable's scans, and our time goes where they stop.\n\nRun the Deep scan before you book anyone. As of November 2026, both scans are free; asking Lovable in the chat to review or fix findings uses credits, and Try to fix all draws on 10 free fixes first. If you'd rather work through the checks yourself first, our [vibe coding security checklist](/insights/vibe-coded-app-security-checklist) has a test for each.",
        "table": {
          "caption": "Lovable's two scans as its docs describe them on 7 November 2026, and what our vibe code security audit adds",
          "headers": [
            "Area",
            "Lovable's scans, per its docs",
            "What the audit adds"
          ],
          "rows": [
            [
              "Database access rules",
              "Quick scan: tables without row-level security, rules that let everyone through, leaked-password protection off. Deep scan: also server code that bypasses those rules",
              "Requests sent signed out and as a second user, to see what actually comes back"
            ],
            [
              "Secrets",
              "Deep scan: secrets in source code or the repository, and access tokens that are easy to guess",
              "Which keys are live, where each one runs, and who holds the account to rotate it"
            ],
            [
              "Payments",
              "Deep scan: prices, fulfilment or paid features a customer can change or reach without paying",
              "A test-mode purchase to check access follows it, and a read of how the code handles renewals, failed payments and cancellations"
            ],
            [
              "Dependencies",
              "Quick scan: known vulnerabilities in npm packages; only critical ones become findings",
              "Nothing extra: we read the scan's results rather than repeat it"
            ],
            [
              "Testing the running app",
              "Static analysis only: the scans read code and configuration. Live testing comes from the optional Aikido AI pentest, billed by Aikido",
              "The requests above; the FAQ below covers penetration tests"
            ],
            [
              "Hosting and recovery",
              "Not a scan area",
              "Test and live environments, daily backups (Lovable keeps about 14 days of them), domains, and which accounts hold the app"
            ],
            [
              "Store readiness",
              "Not a scan area",
              "What an App Store or Google Play launch would need, if you're going there"
            ],
            [
              "What you get",
              "Findings labelled Critical, Warning or Info, with fixes Lovable can attempt",
              "A keep, harden or rebuild verdict for each part, and the fix estimated in $1,200 sprint weeks"
            ]
          ]
        }
      },
      {
        "id": "production-ready",
        "heading": "Is my Lovable, Base44 or Replit app production-ready?",
        "body": "Is Lovable production-ready? Its docs say the backend is: as of November 2026, they call the built-in backend 'a production-ready environment from day one', meaning the database, real-time updates, user authentication and storage it sets up. Whether your app is production-ready depends on the rules your code and policies enforce, and each platform says, in its own words, that a clean scan isn't the end of it. Lovable's FAQ says its scans 'support secure development but do not guarantee it'. [Base44's security overview](https://docs.base44.com/Setting-up-your-app/security-overview) says 'You are responsible for your app's security settings', and its publish panel warns about open risks without stopping you publishing. [Replit's docs](https://docs.replit.com/features/security/security-scan-levels) say 'A passing publish check is not a guarantee that your application code has no vulnerabilities.'\n\nThe scans are still worth running. As of November 2026, Base44's scan looks for data that is too open, exposed credentials and backend functions that answer without sign-in, and adds static code analysis on its Builder plan and above. Replit's Security Center runs free dependency checks at Level 1; Level 2 adds an Agent review of your source code and Level 3 a black-box test of the running preview, both on paid plans and billed as Agent usage. Lovable's two scans are in the table above. So is Base44 production-ready? Its overview lists SOC 2 Type II for the platform itself, confirmed by independent audit. That covers Base44, not your app: in the audit's terms, your app still has to pass the five tests below.\n\nWhat makes vibe code production-ready, in the audit's terms, is five tests holding, whichever tool wrote it. A stranger and a second user can't read or change data that isn't theirs. No live secret is reachable from the browser. The app's idea of who has paid matches Stripe's, including after renewals, failed payments and cancellations. You can restore yesterday's data and roll back a bad deploy. And someone other than the AI can change the code without breaking the rest. That is the gap an AI-generated code audit is for."
      },
      {
        "id": "keep-harden-rebuild",
        "heading": "Can you clean up and fix my vibe-coded app without rebuilding it?",
        "body": "Rebuilding is not the default. Cleaning up a vibe-coded app means deciding, part by part, what to keep, what to harden and what to rebuild. The audit gives each part (sign-in, data rules, payments, each main feature, hosting) its own verdict, with reasons, before any work is priced.\n\nKeep means we found nothing there worth fixing, so we leave it alone. Harden means the structure is sound but the production layer is missing, such as row-level security policies, server-side checks, webhook verification or error handling, so we fix it in place. Rebuild means fixing that part would cost more than replacing it, or its design can't take the fixes it needs, so we replace that part, not the whole app.\n\nAgencies sell this work as vibe code cleanup services. Ours is priced from the verdicts: hardening and any part rebuilds are estimated in $1,200 sprint weeks. If most of the app comes back 'rebuild', the report says so plainly, and starting over is a new build, priced with the fixed-price packages on the [pricing page](/pricing), from $2,900."
      },
      {
        "id": "cost",
        "heading": "What does a vibe code audit cost, and what does the $400 cover?",
        "body": "$400, credited to the fix if you go ahead. That buys the review of your code, database security, payments, hosting and store readiness, the written report you keep, and the fix estimated in $1,200 sprint weeks, so you know the total before work starts. If the audit says two sprint weeks, the total is $2,400: $400 for the audit and $2,400 for the sprint, less the $400 credit. Which paid steps take the credit, and when you pay, are in [the terms below](#terms). Our [pricing page](/pricing) lists this step as the launch-readiness audit: it's the same $400 step.\n\nIn the table below, prices for a vibe coding audit run from $199 for the smallest tier to $4,500 and up for one with fixes included. They buy different things: some stop at a report, some include the fixes, some are priced per site or by risk tier. The table shows what each vendor's own page said on 7 November 2026. It isn't the whole market, and prices change, so check the source before you compare. DevoraX sells one of these options: the $400 audit, credited to the fix.\n\nWhen a cheaper option is the better buy: if your app is a single small feature and you only want a written list of what to fix yourself, a from-$199 tier like Valletta's Starter costs less than ours.",
        "table": {
          "caption": "Published prices for vibe code audits, read on 7 November 2026",
          "headers": [
            "Vendor and offer",
            "Price as published",
            "What it buys, per the vendor's page",
            "Source"
          ],
          "rows": [
            [
              "Valletta Software, Starter audit",
              "From $199",
              "A single-feature MVP under 5,000 lines of code",
              "vallettasoftware.com/blog/post/vibe-coding-audit, read 7 Nov 2026"
            ],
            [
              "Valletta Software, Standard audit",
              "From $799",
              "A multi-feature SaaS of 5,000 to 25,000 lines",
              "vallettasoftware.com/blog/post/vibe-coding-audit, read 7 Nov 2026"
            ],
            [
              "Valletta Software, Investor-ready audit",
              "From $1,499",
              "A pre-raise diligence package, any size",
              "vallettasoftware.com/blog/post/vibe-coding-audit, read 7 Nov 2026"
            ],
            [
              "RapidDev, Lovable security audit",
              "$1,000 fixed",
              "A read-only review of a standard Lovable app; the fee is credited if they do the fixes",
              "rapidevelopers.com/lovable-security-audit, read 7 Nov 2026"
            ],
            [
              "Digital Spirit Technology, Triage Scan",
              "$1,500 per site",
              "A security, performance and SEO audit with a severity-ranked report and a walkthrough call; no fixes",
              "digitalspirittech.com/services/vibe-code-audit/, read 7 Nov 2026"
            ],
            [
              "Digital Spirit Technology, Audit + Remediation",
              "From $4,500 per site",
              "The Triage Scan, plus fixes for every Critical and High issue and a re-test",
              "digitalspirittech.com/services/vibe-code-audit/, read 7 Nov 2026"
            ],
            [
              "SpotDev, Safe to Ship audit",
              "From £1,500, excluding VAT",
              "One app reviewed and signed off by their CTO, with a keep, fix or rebuild recommendation; 20% of the fee credited against fixes committed within 30 days",
              "spotdev.co.uk/services/vibe-code-audit, read 7 Nov 2026"
            ],
            [
              "Damian Galarza, Vibe Code Audit",
              "From $4,000",
              "A pre-production review of security, auth, data isolation and deploy readiness, at a fixed price set before it starts",
              "damiangalarza.com/vibe-code-audit/, read 7 Nov 2026"
            ],
            [
              "DevoraX, vibe code audit (this page)",
              "$400, credited to the fix",
              "Code, database security, payments, hosting and store readiness, with a keep, harden or rebuild verdict for each part and the fix estimated in $1,200 sprint weeks",
              "thedevorax.tech/pricing"
            ]
          ]
        }
      },
      {
        "id": "data-exposed",
        "heading": "My app's data is exposed. What should I do right now?",
        "body": "If a scan, a user or a stranger has shown you data that should be private, secure your vibe-coded app before you book anyone, starting with these steps.\n\nRotate any secret key that sat in browser code or a public repository, at the provider that issued it, such as Stripe or your AI provider. Then update the copy your backend uses, or the app breaks wherever it relied on the old key. Deleting a key from the code isn't enough, because anyone who copied it can still use it: Lovable's docs say secrets in frontend code 'should be considered compromised'. Treat a leaked Supabase secret key (sb_secret_..., or the older service_role key) as the most urgent, because it bypasses every row-level security policy (Supabase's docs, November 2026). On Lovable's built-in backend, Lovable fills in those Supabase keys itself (its secrets docs, November 2026), so ask Lovable's support to replace a leaked one.\n\nTurn on row-level security for every table your scan lists, then add policies. Until you add them, the app may look empty rather than broken: Supabase's docs say that once RLS is enabled, no data is accessible through the API with a publishable key until you create policies. As of November 2026, Lovable lists every policy under More → Database → Manage → Policies, but that view is read-only: you add or change a policy by asking Lovable in the project chat, and the Quick scan re-checks them. Base44's scan, as of November 2026, offers a one-click fix for data permissions, though its docs warn that on an app without required sign-in the fix can break a page visitors use without logging in. Sameem's guide to [Supabase's 'RLS disabled in public' warning](https://sameemamjad.com/guides/supabase-rls-disabled-in-public) has the SQL and the test.\n\nCheck file storage too: Supabase's docs say anyone with a public bucket's file link can open the file. Then test like a stranger: open the app signed out in a private window, then as a second test user, and try to reach the first user's records.\n\nDon't remove the database or restore an old backup in a hurry. On Lovable, a restore loses everything written after that backup, and removing the database deletes its backups and your users' accounts for good (Lovable's docs, November 2026). If personal data was readable, ask a lawyer whether you must tell your users or a regulator: that depends on where you and they are. Then book the free call and tell us what you saw."
      },
      {
        "id": "payments",
        "heading": "Only my Stripe payments are broken. Do I need the audit?",
        "body": "Not always. If the rest of the app is sound, the free call can skip the audit and quote the Payments step: Stripe checkout and subscriptions, set up in your own Stripe account by default, from $1,200 for one week of our work.\n\nA symptom founders often describe: the payment goes through, and the app never unlocks anything. For apps on Lovable's built-in payments, [Lovable's payments docs](https://docs.lovable.dev/features/payments) name one cause as of November 2026. Lovable registers two webhook endpoints in your Stripe or Paddle account for each environment, and if the Lovable Stripe webhook endpoint for your app is deleted, 'purchases still succeed, but subscriptions never activate and features never unlock'. A duplicate endpoint pointing at the same URL delivers events your app can't verify.\n\nWith [your own Stripe account connected](https://docs.lovable.dev/integrations/stripe) instead, Lovable's docs (November 2026) say there's no webhook by default: the app asks Stripe directly. They add that a subscription is recognised when the email the user signs in with matches the one on their Stripe customer record, so a customer who typed a different email at checkout pays and still looks unpaid.\n\nAs of November 2026, built-in payments need Lovable's Pro plan or higher, and older React + Vite apps need Lovable's built-in backend for them. On built-in payments, Lovable's Stripe checkout is embedded only; with your own Stripe account, Stripe Checkout opens in a new tab. Live checkout on built-in payments won't work until the go-live steps are done, including a privacy policy, terms and a refund policy on the live site.\n\nAs of November 2026, [Base44's payments docs](https://docs.base44.com/documentation/setting-up-your-app/setting-up-payments) put the Base44 Stripe integration on the Builder plan or above and say its current flow 'was released in January 2026 and replaces the old Stripe flow'. They suggest confirming each payment on the success page 'instead of relying on webhooks alone', but renewals, failed payments and cancellations arrive later, when nobody is on that page. If a Base44 Stripe webhook runs through a backend function on an app that requires login, Base44's docs warn that the security scan's fix for functions anyone can call can break it, so test payments again after applying that fix.\n\nAs of November 2026, [Replit's Stripe docs](https://docs.replit.com/features/monetization/stripe-payments) put the Replit Stripe integration on paid plans only (Core and Pro), with one connection method per environment. Its sandbox can't take real payments until you install the Replit Integrated Payments app from the Publish pane.\n\nTwo of Sameem's guides walk through two of these failures step by step: [the webhook signature error](https://sameemamjad.com/guides/stripe-webhook-no-signatures-found-matching-expected-signature) and [paid on Stripe, still locked out](https://sameemamjad.com/guides/stripe-payment-succeeded-but-no-access)."
      },
      {
        "id": "leave-lovable-cloud",
        "heading": "Can you move my Lovable app off Lovable Cloud?",
        "body": "In steps, not in one click. As of November 2026, [Lovable's backup docs](https://docs.lovable.dev/features/database-backups) say it doesn't move a project off its built-in backend in one step, and [its hosting and ownership page](https://docs.lovable.dev/tips-tricks/deployment-hosting-ownership) names managed or self-hosted Supabase as the supported destinations. A Lovable Cloud to Supabase migration means exporting the database, downloading the storage files, moving the code with Git sync and setting up the rest again. The export includes your users' accounts and password hashes, but not storage files, Edge Function code, secrets or sign-in provider settings. An older React + Vite app on Lovable's built-in payments needs that backend, so first switch its payments to your own Stripe account or upgrade the app to TanStack Start (Lovable's payments docs). There's no Lovable Cloud migration by DevoraX on record yet: the audit lists what your app uses on the built-in backend and estimates the move in sprint weeks."
      },
      {
        "id": "due-diligence",
        "heading": "Preparing for your investor's technical due diligence?",
        "body": "Expect your investor's reviewer to check three things in an AI-built app: who owns what, whether real users' data is protected, and whether someone other than its builder can run and change it. Ownership comes first. As of November 2026, [Lovable's hosting and ownership docs](https://docs.lovable.dev/tips-tricks/deployment-hosting-ownership) say your apps, code and content made with it 'are yours, subject to third-party rights such as open-source licenses'. So a reviewer will check your packages' licences and whether a secret ever sat in the repository's history. They will also check that the repository, hosting, Stripe and store accounts belong to your company, not a freelancer's personal login. For the work we do, you own all code and IP on final payment.\n\nThe audit's investor-ready version adds a page written for your investor's technical reviewer. It says who commissioned the review, its date and scope, and the ownership points above, and that DevoraX may be hired to fix the findings but you don't have to hire us. It is the same $400 audit step, and it doesn't replace a penetration test: the FAQ below covers what to do if your investor asks for one.\n\nThe full list is in our [technical due diligence checklist](/insights/vibe-coded-app-security-checklist#investor-due-diligence)."
      },
      {
        "id": "sample-report",
        "heading": "What's in the audit report?",
        "body": "Each vibe-coded app audit ends in a written report with the same structure, so you can see its shape before you pay. We haven't published a sample report yet, so this section describes exactly what the report contains.\n\nScope comes first: what we read and tested, on what date, and which version of the code. Then a one-page summary: the keep, harden or rebuild verdict for each part, with its reasons, and what to fix first.\n\nThen the findings. Each one says where it is, what could go wrong, how we confirmed it and how to fix it, and carries a severity label. Where your builder's own scan already flagged something, the finding says so.\n\nThen the estimate: the fix in $1,200 sprint weeks, what each week covers and what would be quoted separately. Last, if you ask for it, the investor-ready page described in the due diligence answer above."
      },
      {
        "id": "after-launch",
        "heading": "Who fixes what breaks after launch?",
        "body": "For anything we delivered, [the terms below](#terms) say what we fix free and for how long. After that, fixes, updates and new releases go through monthly care, our vibe code maintenance plan, at $1,500 a month, or a single release quoted per change.\n\nThe risk that is specific to AI-built apps is the next prompt: the AI can rewrite code we hardened. As of November 2026, once a Lovable project is published, auto-fix can add a few of its newest critical database and dependency findings to each build request you send. Depending on your workspace setting, it can't be turned off for that project. Base44 saves a checkpoint before each security fix it applies, so you can revert one that misbehaves (Base44's docs, November 2026). Before each release, run your builder's scan again and re-run the checks in your audit report."
      }
    ],
    "proof": [
      {
        "type": "asset",
        "href": "/insights/vibe-coded-app-security-checklist",
        "label": "The vibe-coded app security and launch checklist",
        "what_it_proves": "The open self-check: each item with a test, to run yourself before you pay anyone."
      },
      {
        "type": "asset",
        "href": "/reviews",
        "label": "Our Fiverr record: 5.0 rating across 50+ projects since January 2022",
        "what_it_proves": "A public record of delivered work for clients in the United States, United Kingdom, Canada and Hong Kong, with every review shown as written. The reviews describe web, mobile and payments work; none mentions an AI-built app."
      },
      {
        "type": "review",
        "username": "irmairvin",
        "job": "a Next.js restructure, not an AI-built app",
        "note": "Relevant to working inside a codebase that already exists, which is what a finish sprint does. The reviewer wrote that after the restructure the codebase was 'clean, scalable, and production-ready'."
      },
      {
        "type": "review",
        "username": "matthew4l2",
        "job": "Stripe payments and a user dashboard in a Next.js 15 app, not an AI-built app",
        "note": "Relevant to the Payments step: the reviewer wrote that Sameem 'integrated Stripe payment API' in the app."
      },
      {
        "type": "project",
        "project_id": 33,
        "name": "ConstrAction",
        "role": "A client hired DevoraX through its Fiverr profile, which is in Sameem's name, and Sameem built it as the full-stack engineer: a bilingual contract generator for Quebec contractors on Next.js 15, Supabase and Stripe.",
        "what_it_proves": "Stripe billing in both shapes the Payments step covers, a one-off payment per contract and an unlimited monthly plan, on a live site.",
        "figures": [
          "Live site: constraction.ca",
          "Live demo on sample data: demoprojectsforclients.sameemamjad.com/projects/constraction"
        ]
      },
      {
        "type": "project",
        "project_id": 37,
        "name": "FirstPass",
        "role": "A demo build on sample data, with no live product: Sameem built it as the full-stack engineer.",
        "what_it_proves": "Four plans (Free, Basic, Pro and School) billed through Stripe, with an upgrade and checkout path you can try yourself in Stripe test mode.",
        "figures": [
          "Live demo on sample data: demoprojectsforclients.sameemamjad.com/projects/firstpass",
          "Payments in the demo run in Stripe test mode"
        ]
      }
    ],
    "included": [
      "A review of your code, database security, payments, hosting and store readiness",
      "Tests of your data rules with real requests, signed out and as a second user, and a test-mode purchase if you take payments",
      "A written report you keep whatever you decide, with a keep, harden or rebuild verdict for each part",
      "The fix estimated in $1,200 sprint weeks before any work is priced",
      "The investor-ready page, if you ask for it",
      "Finish sprints that fix what the audit found, at $1,200 a week",
      "Stripe checkout and subscriptions, set up in your own Stripe account by default, from $1,200",
      "Monthly care after the free defect fixes in [the terms above](#terms): fixes, updates and new releases at $1,500 a month, or a single release quoted per change"
    ],
    "quoted_separately": [
      "Stripe Connect payouts to sellers, from $2,400",
      "The iOS and Android launch, from $2,400: see [Lovable app to the App Store](/solutions/lovable-app-to-app-store)",
      "A full React Native build, quoted after the audit",
      "A Lovable Cloud to Supabase migration, estimated in sprint weeks by the audit",
      "New features beyond the audited scope",
      "Starting over from scratch, priced as a new build on the [pricing page](/pricing)"
    ],
    "faqs": [
      {
        "q": "Does the audit replace a penetration test?",
        "a": "No. It is an engineering review, not a security certification, and it doesn't replace the third-party penetration test some investors ask for. As of November 2026, Lovable offers AI pentests through an Aikido connector, billed by Aikido, and Replit's Level 3 scan adds a black-box test of the running preview. If an investor asks for a pentest, ask whether an AI pentest will do. Either way, the order is audit, fix, then test."
      },
      {
        "q": "I vibe-coded my app. Do I need a developer at all?",
        "a": "Not always. If the app has no users yet, takes no payments, holds no one else's personal data and isn't headed for the App Store or Google Play, keep building it yourself and work through our [security checklist](/insights/vibe-coded-app-security-checklist). Bring someone in when money, other people's data or a store review is involved, or when every fix you prompt breaks something else."
      },
      {
        "q": "My last developer left the app half-built. Can you pick it up?",
        "a": "Yes, the same way: the audit reads what's there, whether a person or an AI wrote it, and gives each part a keep, harden or rebuild verdict. First, check that the repository, hosting, domain, Stripe and store accounts are in your name or your company's, not only the previous developer's. If they aren't, getting access transferred comes first, and we go through it on the call."
      },
      {
        "q": "Which builders and stacks can you audit?",
        "a": "Anything we can read as a codebase: apps built with Lovable, Base44, Replit, Bolt, Cursor or Claude Code, or written by a person. The related work we show, [ConstrAction](/projects/33) (DevoraX client, hired through Fiverr) and [FirstPass](/projects/37) (Demo build), runs on Next.js, Supabase and Stripe. We have no past audit to show yet, and no sample report is published."
      },
      {
        "q": "Will you sign an NDA before you read our code?",
        "a": "Yes, on request, before the call. We treat your business model, technical specs and proprietary information as strictly confidential, whether or not an NDA is in place. Read access to a GitHub repository is the simplest way to share the code, and you can revoke that access once the report arrives."
      },
      {
        "q": "Can you move my app off Lovable Cloud into a Supabase project I control?",
        "a": "Yes, as separate work the audit estimates in sprint weeks. As of November 2026, Lovable's built-in backend runs on Supabase's open-source foundation, so the data and its access rules can move to a Supabase project in your own account. The audit reads those rules first, because a migration is the right moment to fix any that are wrong."
      }
    ],
    "when_not_to_hire": "Don't hire us if you haven't run your builder's own scan yet: on Lovable the Quick and Deep scans are free as of November 2026, and fixing what they find may be all a small app needs. Don't hire us when one bug is all that's wrong, either. One bug you can name and reproduce? A fixed-price gig will cost less.\n\nDon't hire us if you need a compliance certification such as SOC 2, HIPAA or PCI: DevoraX holds no security or compliance certifications, and the audit isn't one. And if you need a team of five, or a committed launch date for your app before anyone has read its code, we're the wrong fit. DevoraX is [two engineers](/team) in Pakistan (UTC+5). The audit's estimate comes first, and a finish sprint usually takes 1-2 weeks.",
    "related_slugs": [
      "lovable-app-to-app-store",
      "sharetribe-developers",
      "multi-vendor-marketplace-development"
    ],
    "secondary_cta": {
      "label": "See what the audit report contains",
      "href": "#sample-report"
    },
    "updated": "2026-11-11T00:00:00.000Z"
  }
];

/**
 * When the vertical pages were last revised, for those without their own
 * `updated`. Offer pages always carry their own. 7 Nov 2026: the hub and the
 * antiques page took dates of their own when they gained the audit paragraph
 * and the Pastel employment wording. 8 Nov 2026: every vertical page took a
 * date of its own (the accounts default, the after-launch terms and, on the
 * food truck page, Koor as DevoraX client work), so this date now applies to
 * none of them.
 */
export const SOLUTIONS_UPDATED = '2026-10-08T00:00:00.000Z';

export function isOffer(s: Solution): s is OfferSolution {
  return s.kind === 'offer';
}

/** Anchor text for links to a page: an offer's nav_label, a vertical's H1. */
export function solutionLabel(s: Solution): string {
  return isOffer(s) ? s.nav_label : s.h1;
}

/** The page's revision date, for the byline, the WebPage node and the sitemap. */
export function solutionUpdated(s: Solution): string {
  return s.updated ?? SOLUTIONS_UPDATED;
}

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

export function allSolutionSlugs(): string[] {
  return SOLUTIONS.map((s) => s.slug);
}

const ROLE_ORDER: Record<Solution['role'], number> = { offer: 0, hub: 1, spoke: 2 };

/** Door pages first, then the hub, then its spokes: the order every list of these pages uses. */
export function solutionsInOrder(): Solution[] {
  return [...SOLUTIONS].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);
}

export function solutionsInCluster(hubSlug: string): VerticalSolution[] {
  return SOLUTIONS.filter((s): s is VerticalSolution => !isOffer(s) && s.hub === hubSlug);
}

/**
 * The breadcrumb trail after Home, for both the visible breadcrumb and the
 * BreadcrumbList, so the two always name the same pages. Offers sit directly
 * under /services; a spoke shows its hub by the hub's short title.
 */
export function solutionTrail(s: Solution): { name: string; path: string }[] {
  const path = `/solutions/${s.slug}`;
  const services = { name: 'Services', path: '/services' };
  if (isOffer(s)) return [services, { name: s.nav_label, path }];
  const hub = s.hub ? getSolution(s.hub) : undefined;
  return [
    services,
    ...(hub ? [{ name: hub.title, path: `/solutions/${hub.slug}` }] : []),
    { name: s.h1, path },
  ];
}
