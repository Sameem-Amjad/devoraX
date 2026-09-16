/**
 * Commercial solution landing pages — the "target now" tier of the keyword plan.
 *
 * These exist because the broad terms are unwinnable. A live SERP check on 26
 * candidates found 29 of 80 original keywords were held by agencies running
 * exact-match URLs with years of link equity behind them; head-on competition on
 * those is not a strategy for a domain with no backlink profile. What survived
 * were narrow queries where DevoraX has shipped the exact thing being searched
 * for — "antiques marketplace app development company" rather than "marketplace
 * development", "used car marketplace app development with inspection reports"
 * rather than "car marketplace website development company".
 *
 * Every page here is therefore built on a NAMED, DELIVERED project with a
 * published case study. That constraint is the whole point: a solution page with
 * no project behind it is the thin content this site was already penalised for
 * carrying, and it would mean claiming expertise that does not exist.
 *
 * The route is /solutions/{slug} rather than /services/{id} because the services
 * route resolves by database primary key and is owned by the admin dashboard.
 */
export type SolutionProof = {
  project_id: number;
  name: string;
  one_line: string;
  /** The specific capability this build evidences for this page. */
  what_it_proves: string;
  /** Client-reported figures, each phrased as reported. May be empty. */
  figures: string[];
};

export type Solution = {
  slug: string;
  primary_keyword: string;
  h1: string;
  /** Without the " | DevoraX" suffix — the metadata template appends it. */
  title: string;
  meta_description: string;
  hero_answer: string;
  sections: { heading: string; body: string }[];
  proof: SolutionProof[];
  included: string[];
  quoted_separately: string[];
  when_not_to_hire: string;
  faqs: { q: string; a: string }[];
  word_count: number;
  role: 'hub' | 'spoke';
  /** The hub slug this page links up to. Undefined when this page IS the hub. */
  hub?: string;
  /** Sibling solution slugs to cross-link. */
  related_slugs: string[];
  /** Which of the four DB services this sits under, for the breadcrumb and schema. */
  service_id: number;
};

export const SOLUTIONS: Solution[] = [
  {
    "slug": "multi-vendor-marketplace-development",
    "primary_keyword": "multi vendor marketplace development company",
    "h1": "Multi-Vendor Marketplace Development Company: Three Marketplaces We Have Shipped",
    "title": "Multi-Vendor Marketplace Development",
    "meta_description": "Three multi-vendor marketplaces shipped and live: Afriva, Pastel and Dooz. Buyer surface, vendor portal, admin console, payments. Fixed price, agreed first.",
    "hero_answer": "DevoraX is a software agency, founded in 2019, that builds multi-vendor marketplaces: a buyer storefront or app, a vendor portal, an admin console, payments, search and order tracking over one backend. Three are live and publicly inspectable right now. Afriva, Pastel Marketplace and Dooz Inspected Cars. It is for operators who have decided a template will not fit.",
    "sections": [
      {
        "heading": "What does a multi-vendor marketplace build include, and what is quoted separately?",
        "body": "A marketplace is four products sharing one database. A buyer surface for browse, search and checkout. A vendor portal for listings, stock and an order queue. An admin console for oversight of the catalogue and the order queue. A backend that owns the rules all three read.\n\nBase scope covers those four, plus one payment provider integration, order records with status visible to buyer and vendor, server-rendered catalogue pages so the listings are indexable, and deployment to a live environment you can open and inspect.\n\nWhat sits outside base scope is listed too, because agencies leave it ambiguous. Native iOS and Android clients on top of a web build are separate work. So are multi-carrier shipping, live location tracking, and third-party quote integrations such as financing or insurance. Each is a real integration with its own failure modes. Pretending one is a line item inside a fixed price is how fixed prices stop being fixed."
      },
      {
        "heading": "Who is this for, and which marketplace model is closest to mine?",
        "body": "This is for someone who has decided that independent sellers, rather than a single inventory, is the model, and that a template will not carry it. If a Shopify multi-vendor app covers what you need, use it. A custom build starts to pay when the vendor relationship is itself the product: verification states, inspection data, per-vendor terms, or a catalogue where every item is a single unit that retires on sale.\n\nThree of the four builds named below have their own page, because the models differ more than the word marketplace suggests. Collectibles and one-of-one resale is covered at /solutions/antiques-marketplace-app-development. High-ticket assets with published condition reports is at /solutions/used-car-marketplace-app-development. Mobile vendor discovery, where the vendor moves and the customer is trying to find it, is at /solutions/food-truck-ordering-app-development. Afriva, the general-goods build, is the closest reference for a conventional catalogue marketplace with sellers, stock levels and delivery."
      },
      {
        "heading": "Which marketplaces has DevoraX actually shipped?",
        "body": "Three, each with a published case study and reachable without a demo. Afriva is a four-role marketplace on Next.js 15 and Supabase: admin, manager, seller and buyer dashboards with real-time delivery tracking. The client reports 1,245 active vendors, $1.2M in revenue and 120+ cities covered. The buyer storefront is at afriva-buyer.vercel.app.\n\nPastel Marketplace trades antiques on Next.js and Firebase, with Sharetribe carrying the transaction and Shippo insured shipping; the client reports 12k+ curated items and 2.8k+ verified sellers. Dooz Inspected Cars runs Angular web and React Native apps over NestJS and PostgreSQL, with a 150+ point inspection modelled as data rather than a PDF; the client reports 20,000+ verified vehicles and 1.2B+ JD in transactions.\n\nThe fourth build named here is not a marketplace. Food Magnet is a food truck discovery platform: a Flutter app and React admin console on AWS Lambda, with live location tracking and Stripe. Its record has no buyer checkout, no vendor order queue and no outcome figures. It is adjacent work, not a fourth marketplace."
      },
      {
        "heading": "How do you keep one vendor from reading another vendor's data?",
        "body": "A vendor boundary is a database property, not an interface one. A client-side check hides a button; it does not stop a request, because the request can be issued without the interface. Ownership is expressed in the schema, and the check runs where every client has to pass.\n\nOn Afriva that meant managed Postgres rather than a document store. Vendors own products, products appear in orders, orders split into shipments, and foreign keys and constraints give one authoritative place to state that a seller cannot mutate another seller's stock. Supabase also bundles authentication with the database, so the identity that signed a user in is the identity Postgres sees on the query, which removes the drift between what the interface believes and what the database permits.\n\nDooz reaches the same place differently: valuation, inspection status and listing availability resolve server-side, so NestJS owns the rules and the three clients render state. Food Magnet's case study does not publish its permission model, so this page does not describe one."
      },
      {
        "heading": "What happens when one basket spans several vendors?",
        "body": "This is where the complexity concentrates. It is the difference between a marketplace and a shop. One buyer checkout becomes several vendor orders with separate dispatch timelines, so the data model has to represent a parent purchase and its child shipments, then reassemble them into one legible screen.\n\nStock is the concurrency problem underneath it. With vendors listing independently, the same item can enter several baskets at once, so inventory decrements have to be atomic in the database rather than read-modify-write in application code. On a catalogue of single units, as with Pastel and Dooz, it is sharper still: a sold item has to disappear from search, saved lists and every client immediately, because stale availability destroys the trust the platform exists to create.\n\nStatus is the third piece. On Afriva, Supabase Realtime streams Postgres changes over a websocket, so a buyer's tracking view updates from the same row operations just edited. No polling interval, no reconciliation step."
      },
      {
        "heading": "How does the build run, and what do you need from me?",
        "body": "It starts with a free 30-minute discovery call. The output is a written fixed-price proposal setting out scope, what is included, what is excluded, and the price. Nothing is built before that document is agreed.\n\nWhat we need from you is decisions, not documents. Who the roles are and what each is allowed to do. What states a vendor account can be in, and what each state permits. What a completed order means, and who is owed money at that point. Whether the catalogue holds stock-keeping items with quantities or single units that retire when sold. Those four answers determine the schema, and the schema is the expensive thing to change later.\n\nWe also need access to whatever the integrations require: a payment provider, hosting, and any third-party service the scope names. Who holds each of those accounts is settled in the proposal, per project, rather than promised as a policy here. The one ownership commitment we do make is in the section below."
      },
      {
        "heading": "How is it priced?",
        "body": "Fixed price, agreed in writing before work starts. No hourly billing and no retainer required to reach launch. The published starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are indicative starting points, not quotes. A four-role marketplace with split fulfilment and a payment integration is not an MVP Starter build, and we would rather say so here than on the call.\n\nFixed price is only honest if scope is honest, which is why the exclusions are stated on this page rather than discovered in month two. Add a requirement mid-build and it is quoted as a change, and you decide whether to take it. The alternative, absorbing it silently, is how an agency ends up shipping the cheapest possible version of something it promised.\n\nTwo people do the work: Sameem Amjad and Usman. You are not handed to an account manager after signing."
      },
      {
        "heading": "What happens after launch, and who owns the code?",
        "body": "You own all code and IP on final payment. That is the ownership commitment, stated at its edges. Owning the code is not owning every account the platform runs on: where hosting, payment and third-party accounts sit is a per-project decision recorded in the proposal, not a guarantee this page makes.\n\nSupport after launch is quoted separately rather than assumed. A support arrangement priced into a build fee is either padding, if you do not need it, or inadequate, if you do. Decide it once you can see the traffic.\n\nVendor onboarding deserves a direct answer, because it is what marketplace buyers most want proven and what our record does not prove. Pastel holds seller verification as a property of an account, stored and checked when a listing is created. Afriva has admin and manager surfaces for catalogue and order oversight. Neither case study describes the workflow by which a vendor is reviewed and approved, so this page does not claim one was built. Recruiting and vetting sellers stays yours."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If a Shopify multi-vendor app, Sharetribe's hosted product or a marketplace template covers your model, buy it. It is cheaper than anything here and it will be running next week. We used Sharetribe ourselves on Pastel for exactly that reason: marketplace money movement is a state machine with commissions, held funds, refunds, disputes and cross-border payouts, and reimplementing it is a poor trade without a reason.\n\nDo not hire us if you need a committed launch date before anyone has seen the scope. We do not publish delivery timelines and will not invent one on a call.\n\nDo not hire us if you need a certified compliance posture. DevoraX holds no certifications and has run no audits, and a marketplace carrying regulated financial products should hire a firm that can evidence one. And if you have not yet decided what a vendor is allowed to do, that decision comes before a supplier does."
      }
    ],
    "proof": [
      {
        "project_id": 32,
        "name": "Afriva E-Commerce Platform",
        "one_line": "A four-role multi-vendor marketplace on Next.js 15 and Supabase, with separate admin, manager, seller and buyer dashboards and real-time delivery tracking.",
        "what_it_proves": "Role-separated dashboards shipped from one deployment, vendor ownership enforced by the Postgres schema rather than the interface, and order tracking streamed from database changes instead of polled. The closest reference build for a conventional catalogue marketplace with sellers, stock and delivery.",
        "figures": [
          "The client reports 1,245 active vendors on the platform",
          "The client reports $1.2M in total revenue transacted through the marketplace",
          "The client reports coverage across 120+ cities"
        ]
      },
      {
        "project_id": 23,
        "name": "Pastel Marketplace",
        "one_line": "A luxury antiques marketplace on Next.js and Firebase, with Sharetribe carrying the transaction layer and Shippo carrying insured global shipping.",
        "what_it_proves": "Single-unit catalogues that retire cleanly on sale rather than decrementing stock, seller verification held as an account property checked at listing time, curated collections composed without a code change, and marketplace money movement handled as a modelled state machine rather than a checkout. Ships on web and iOS from one backend.",
        "figures": [
          "The client reports 12k+ curated items",
          "The client reports 2.8k+ verified sellers",
          "The client reports 48k+ collectors",
          "The client reports a 98% positive review rate"
        ]
      },
      {
        "project_id": 25,
        "name": "Dooz Inspected Cars",
        "one_line": "A verified used-vehicle marketplace: an Angular web client and React Native iOS and Android apps over a NestJS and PostgreSQL backend.",
        "what_it_proves": "Faceted search across a large catalogue where every listing is a unique unit, a 150+ point inspection modelled as queryable data rather than an attached document, valuation resolved behind the API so three clients cannot disagree on a price, and ACID transactions holding reservations and financial records consistent under concurrency.",
        "figures": [
          "The client reports 20,000+ verified vehicles",
          "The client reports 1.2B+ JD in total transactions supported",
          "The client reports a 98% customer satisfaction rate",
          "The client's record puts each vehicle at 150+ inspection points"
        ]
      },
      {
        "project_id": 14,
        "name": "Food Magnet",
        "one_line": "A food truck discovery and vendor engagement platform: a Flutter mobile app and a React admin dashboard on an AWS Lambda serverless backend.",
        "what_it_proves": "Two clients, one mobile and one admin web, over a single serverless backend, with four user roles named in the record: admin, manager, vendor and customer. Live vendor location tracking, Stripe payments, and Firebase plus OneSignal for realtime and push. Published on web, Google Play and the App Store. It is not a marketplace build: the record covers discovery, menus and vendor profiles, not a buyer checkout or a vendor order queue, and it does not publish how the four roles are enforced.",
        "figures": []
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
      "Deployment to a live environment you can open and inspect, as every named build here is",
      "A written fixed-price scope agreed before any code is written"
    ],
    "quoted_separately": [
      "Native iOS and Android clients added on top of a web build",
      "Multi-carrier and insured shipping integrations of the kind Pastel uses",
      "Live location tracking of vendors or couriers, as on Food Magnet",
      "Third-party quote integrations such as financing or insurance, as on Dooz",
      "Ongoing support, maintenance and feature work after handover",
      "Vendor recruitment, catalogue data entry and content production"
    ],
    "when_not_to_hire": "If a Shopify multi-vendor app, Sharetribe's hosted product or an off-the-shelf template covers your model, buy it. It is cheaper and faster than a custom build, and we used Sharetribe ourselves on Pastel rather than reimplement marketplace payments. Do not hire us if you need a committed launch date before anyone has seen the scope; we do not publish timelines. Do not hire us if you need a certified compliance posture. DevoraX holds no certifications and has run no audits, and a marketplace carrying regulated financial products should hire a firm that can evidence one.",
    "faqs": [
      {
        "q": "Should I use Sharetribe or a Shopify multi-vendor app instead of a custom build?",
        "a": "If your model fits one, yes. They are cheaper and they run immediately. A custom build pays off when the vendor relationship is the product: verification states, inspection data, per-vendor terms, or a catalogue of single units that retire when sold. The two are not exclusive either. Pastel is a custom Next.js and Firebase marketplace that uses Sharetribe for the transaction layer, because marketplace money movement is not worth rewriting."
      },
      {
        "q": "How long does a marketplace build take?",
        "a": "We do not publish a timeline and will not give you one on a first call. Marketplace scope varies too much. A two-role catalogue and a four-role platform with split fulfilment, live tracking and third-party quote integrations are different projects. The written proposal after the discovery call fixes the scope, the exclusions and the price. If you need a committed date before anyone has seen the scope, we are the wrong supplier."
      },
      {
        "q": "Can you build mobile apps as well as the web marketplace?",
        "a": "Yes, and three of the four builds here ship on the stores. Dooz runs React Native on iOS and Android over the same NestJS backend as its Angular web client. Food Magnet is a Flutter app with a React admin console. Pastel ships on web and iOS. Mobile clients are quoted separately from a web build, because they are separate work with their own release process."
      },
      {
        "q": "Do you handle marketplace payments and vendor payouts?",
        "a": "Payments through a provider, yes. Afriva and Food Magnet both integrate one. Payouts, held funds, commissions and disputes are a much larger surface than checkout, and on Pastel we used Sharetribe's transaction process rather than build that state machine ourselves. Which approach suits you depends on your commission model and where your sellers are, and that is one of the things the discovery call decides."
      },
      {
        "q": "What happens if the scope changes after we start?",
        "a": "It is quoted as a change and you decide. The fixed price covers the scope in the signed proposal. A new requirement gets its own price before any work goes into it, so you are never handed an invoice you did not agree to, and we are never quietly cutting quality elsewhere to absorb it. Changes are handled in writing and priced before the work, not after it."
      },
      {
        "q": "Who actually writes the code?",
        "a": "Two people. Sameem Amjad and Usman. DevoraX has been running since 2019 and has delivered 25 projects, every one of which has a published case study on this site. You will not be handed to an account manager, and you will not discover at kickoff that the people on the call are not the people building it."
      },
      {
        "q": "Are the figures on this page yours or the client's?",
        "a": "The client's. Every number here, 1,245 active vendors on Afriva, 20,000+ verified vehicles on Dooz, 12k+ curated items on Pastel, is reported by the client who owns that platform. DevoraX did not measure or audit them. Food Magnet publishes no outcome figures, so none are quoted for it. What we can evidence directly is that the products are live and the case studies are public."
      },
      {
        "q": "What is the first step?",
        "a": "A free 30-minute discovery call. Bring your role model, your commission model, and your view on whether the catalogue holds stock-keeping items or single units. The output is a written fixed-price proposal covering scope, exclusions and price. If the honest answer is that a template would serve you better, that is what the proposal will say."
      }
    ],
    "word_count": 1434,
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
    "meta_description": "We built Pastel, a live antiques marketplace with verified sellers, held funds and insured global shipping. Fixed price, and the case study is public.",
    "hero_answer": "DevoraX is a software agency. We built Pastel Marketplace, a live antiques marketplace at mypastel.com with verified sellers, curated collections, funds held between payment and fulfilment, and insured global shipping. That is one antiques build, not a portfolio in the category. It suits dealers, consignment businesses and collector platforms trading one-of-one pieces. Fixed price, quoted after a free 30-minute call.",
    "sections": [
      {
        "heading": "What do you actually ship in an antiques marketplace build?",
        "body": "Base scope is a working two-sided marketplace. A buyer-facing storefront with curated collections and individual listing pages. Seller onboarding with verification held on the account. Listing creation built around heavy photography and a provenance narrative. A transaction flow that holds funds between payment and fulfilment. Shipping with rates, labels, tracking and insured cover. An admin console for curation and order oversight.\n\nOn Pastel Marketplace that split across four systems rather than one. Next.js renders the storefront. Firebase holds accounts, listing data and media. Sharetribe carries the transaction. Shippo carries the shipment. The two parts that hold legal and financial risk, money movement and cross-border logistics, sit inside platforms built for them instead of being reimplemented in application code.\n\nThe full in-scope and out-of-scope lists are on this page. The short version is that the marketplace works end to end, and anything requiring a commercial contract of yours is scoped and quoted separately."
      },
      {
        "heading": "Who is this built for?",
        "body": "Businesses trading one-of-one goods where the value sits in the object's history rather than a spec sheet. Antiques dealers, collectibles resale platforms, estate and consignment businesses, and anyone running a curated catalogue where each item sells once and is then gone.\n\nThe defining constraint is the data model, not the category. A conventional catalogue assumes a product record with variants, stock depth and a price repeated across identical units. An antique inverts all three. Each listing is a single record whose worth is carried by provenance, condition and the evidence behind them, and once it sells it has to retire cleanly rather than decrement a count.\n\nIf your catalogue has restock, SKUs and repeat units, the general page is the better starting point: /solutions/multi-vendor-marketplace-development. Come back here when the objects are unique and trust is the thing you are actually selling."
      },
      {
        "heading": "Which builds prove you have done this before?",
        "body": "Pastel Marketplace is the direct proof, and it is one build rather than a category portfolio. It is a luxury antiques marketplace on Next.js and Firebase, running publicly at mypastel.com, and the product is also listed on the App Store as Pastel Antique Marketplace. The client reports 12k+ curated items, 2.8k+ verified sellers, 48k+ collectors and a 98% positive review rate. Those are the client's figures, not measurements we took. The case study is at /projects/23.\n\nAfriva E-Commerce Platform is the second. It is a four-role marketplace on Next.js 15 and Supabase, with admin, manager, seller and buyer dashboards and delivery tracking streamed from Postgres. The client reports $1.2M transacted, 1,245 active vendors and coverage across 120+ cities. It runs at afriva-buyer.vercel.app and the case study is at /projects/32.\n\nBoth front ends are open to inspection before you speak to us. What a visitor cannot see from outside is the seller and admin side of either platform, and the case studies describe that rather than demonstrate it."
      },
      {
        "heading": "How do you model provenance and one-of-one listings?",
        "body": "Provenance is narrative and evidence, not attributes, so it does not fit a variant table. On Pastel the weight of a listing sits on photography and the supporting history: where the piece came from, who owned it, what condition it is in now, and what backs those claims. The images have to substitute for handling the object.\n\nThat has two engineering consequences. Image handling becomes the dominant cost on every page, which is part of why the storefront is rendered with Next.js and uses its image pipeline. And listing state becomes delicate. A sold piece is gone permanently, so the catalogue has to retire it cleanly instead of decrementing inventory, and every surface showing it has to agree that it is gone.\n\nIt is also why that state belongs on the backend. Pastel's accounts and listing data sit in Firebase and its transactions in Sharetribe, so every client reads the same state rather than a second implementation of the same rules."
      },
      {
        "heading": "How do you keep one seller's data out of another seller's hands?",
        "body": "Verified status belongs on the account rather than drawn in the interface. It has to be stored, checked when a listing is created, and surfaced anywhere that seller appears. A buyer who sees the mark on a profile but not on the listing learns to distrust both, which is the whole reason it lives in one place.\n\nSeparation itself belongs in the data layer. Afriva's backend is managed Postgres through Supabase, so vendors owning products and products appearing in orders live in the schema rather than being reassembled in application code. That is where an ownership rule goes: expressed once and checked by the database, rather than implied by which button a screen renders. Supabase also bundles authentication with the database, so the identity that signs a user in is the identity the query runs as. We publish no security assessment of Afriva and do not offer its schema as a guarantee, but hiding a button is not a permission model.\n\nThe tenancy question in more depth: /solutions/multi-vendor-marketplace-development."
      },
      {
        "heading": "How is money held between payment and the piece arriving?",
        "body": "A marketplace payment is not a checkout. Funds move from buyer to platform, are held while the piece is packed and shipped, and reach the seller once the exchange completes. Commissions, refunds, disputes and payouts to sellers in different countries all hang off that single flow. On Pastel we used Sharetribe, which models it as a state machine, so the path between enquiry, payment, fulfilment and completion is enforced by infrastructure built for two-sided commerce. The frontend reads a transaction's current state and never takes custody of funds.\n\nShipping is the other half, and it is where antiques marketplaces usually break. Every sale is a one-off shipment. A framed print, a chandelier and a chest of drawers share no packaging profile, no dimensional weight and no obvious carrier, and sellers are not logistics professionals. Shippo sits in front of many carriers behind one interface: rate selection, label purchase, tracking and insured cover. For an irreplaceable object there is no replacement unit, so cover has to attach to the shipment itself."
      },
      {
        "heading": "What does the build look like, and what do you need from me?",
        "body": "It starts with a free 30-minute discovery call. After it you get a written fixed-price proposal with the scope enumerated. Nothing is built before you have agreed that document, and we do not bill hourly.\n\nWhat we need from you is the commercial decisions, because they drive the data model and we cannot invent them. Your category and period taxonomy. Your verification policy, meaning what a seller supplies before they get the mark and who reviews it. Your commission and refund rules. Which countries you ship to and what you will not ship at all. Your photography standard for listings. And accounts in your own name with the payment and shipping providers, because the money and the carrier relationships should be yours from the first day rather than ours.\n\nWe deliberately publish no delivery timeline. Scope determines it, and quoting a duration before the scope exists is how these projects go wrong."
      },
      {
        "heading": "How is it priced, and what happens after launch?",
        "body": "Fixed price. You get a written proposal after the discovery call and the number does not move unless the scope does. Published starting points are MVP Starter from $2,900, Growth from $7,500, and Enterprise custom-scoped. They are indicative starting points, not quotes. A marketplace with held funds, seller verification and insured international shipping does not sit at the entry tier, and we will say so on the call rather than after you have signed something.\n\nYou own all code and IP on final payment. It lives in a repository you control and deploys to accounts in your name. There is no licence, no hosting lock, and nothing you have to keep paying us for in order to keep trading.\n\nSupport after launch is quoted separately. A marketplace with live sellers and money moving through it needs a different arrangement from one still in soft launch, so we price the one you actually have."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If you need timed auctions with live bidding, reserve prices and proxy bids, do not hire us. No project we have delivered includes an auction engine, and bidding concurrency is its own discipline. Buy an auction platform, or hire a team that has shipped one.\n\nIf a native mobile app is the core of the product, start elsewhere. The stack we publish for Pastel is Next.js and Firebase, so native mobile is work we would scope from scratch. And if you want people you can redirect week to week on an hourly retainer, we are the wrong shape: the scope has to settle before the work starts.\n\nIf your budget sits below our published MVP starting point, a hosted marketplace product will serve you better than a custom build. Sharetribe, which we used on Pastel, sells its own platform, and starting there and replacing it later is a legitimate plan. DevoraX is also two people, Sameem Amjad and Usman. If you need ten engineers next month, that is not us."
      }
    ],
    "proof": [
      {
        "project_id": 23,
        "name": "Pastel Marketplace",
        "one_line": "A luxury antiques marketplace on Next.js and Firebase, with Sharetribe carrying the transaction and Shippo carrying insured global shipping, live at mypastel.com.",
        "what_it_proves": "This is the build itself: one-of-one listings weighted on provenance and photography, verified seller status held on the account, a transaction layer that holds funds between payment and fulfilment, and insured multi-carrier shipping. The catalogue is the part an outsider can check directly. The transaction and shipping behaviour sits behind a purchase, so we describe it rather than invite you to verify it from the storefront.",
        "figures": [
          "The client reports 12k+ curated items",
          "The client reports 48k+ collectors",
          "The client reports 2.8k+ verified sellers",
          "The client reports a 98% positive review rate"
        ]
      },
      {
        "project_id": 32,
        "name": "Afriva E-Commerce Platform",
        "one_line": "A four-role multi-vendor marketplace on Next.js 15 and Supabase, with separate admin, manager, seller and buyer dashboards and delivery tracking streamed from Postgres.",
        "what_it_proves": "The operations side an antiques platform needs once real sellers are on it: role-separated dashboards each querying their own slice, a relational Postgres model where ownership can be expressed in the schema rather than in interface checks, and delivery status that reaches the buyer as an event instead of a poll.",
        "figures": [
          "The client reports $1.2M in total revenue through the marketplace",
          "The client reports 1,245 active vendors",
          "The client reports coverage across 120+ cities"
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
      "Deployment to hosting and third-party accounts in your name, with the code in a repository you own"
    ],
    "quoted_separately": [
      "Any native mobile app, iOS or Android. The stack we publish for Pastel is Next.js and Firebase, so native mobile is scoped as new work",
      "Timed auctions, live bidding and reserve prices. No project of ours evidences an auction engine",
      "Integrations with third-party appraisal, authentication or certificate services",
      "Migration of an existing catalogue and its photography from your current platform",
      "Ongoing support, maintenance and feature work after handover",
      "Storefront localisation and multi-currency display beyond what the payment and shipping providers give you"
    ],
    "when_not_to_hire": "If you need timed auctions with live bidding, reserve prices and proxy bids, hire someone else. No DevoraX project includes an auction engine, and bidding concurrency is its own discipline. If a native mobile app is the core of the product, start elsewhere: the stack we publish for Pastel is Next.js and Firebase. If you want an hourly team you can redirect weekly, our fixed-price model will frustrate you. If your budget sits below our published MVP starting point, a hosted marketplace product such as Sharetribe will serve you better. And DevoraX is two people.",
    "faqs": [
      {
        "q": "Have you actually built an antiques marketplace, or just marketplaces in general?",
        "a": "One antiques marketplace, and it is live. Pastel Marketplace runs at mypastel.com with verified sellers, curated collections, funds held between payment and fulfilment and insured global shipping. The client reports 12k+ curated items and 2.8k+ verified sellers. That is a single build in this category rather than a shelf of them, which is the honest answer. The full case study is public at /projects/23."
      },
      {
        "q": "Do you build a mobile app as well as the web marketplace?",
        "a": "Not on evidence we can show you. The stack we publish for Pastel is Next.js and Firebase. The product is listed on the App Store as Pastel Antique Marketplace, but that listing evidences the product, not who wrote the mobile client, so we do not claim it as our work. Treat native mobile as new work with its own line in the proposal rather than something thrown in."
      },
      {
        "q": "How do you stop one seller reading another seller's data?",
        "a": "In the data layer, not the interface. Afriva's backend is Postgres through Supabase, which is where an ownership rule belongs: expressed once in the schema and checked by the database rather than implied by which button renders. Supabase bundles authentication with the database, so the identity that signs a user in is the identity the query runs under. We publish no security assessment of that build. Hiding a button is not a permission model."
      },
      {
        "q": "Can you build timed auctions and live bidding?",
        "a": "We have not shipped one. None of our 25 delivered projects includes an auction engine, so we will not tell you we have done it. If auctions are the core of your product, hire a team that has built one. If they are a later phase sitting on top of a fixed-price marketplace, raise it at the scoping call and we will tell you plainly whether we would take it."
      },
      {
        "q": "Should I use Sharetribe or commission a custom build?",
        "a": "Possibly both. On Pastel we used Sharetribe for the transaction layer and built the storefront ourselves. Marketplace money movement is a state machine with commissions, refunds, disputes and cross-border payouts, and reimplementing it in application code is a large and risky surface. If Sharetribe's own front end will do, start there. A custom storefront earns its cost when browsing is the product, which is usually true in antiques."
      },
      {
        "q": "What does an antiques marketplace cost to build?",
        "a": "You get a fixed price in writing after a free 30-minute discovery call, and it does not move unless the scope does. Published starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are indicative starting points rather than quotes. A build with held funds, seller verification and insured international shipping sits above the entry tier, and we will say so on the call."
      },
      {
        "q": "Who owns the code when it is finished?",
        "a": "You do. All code and IP transfer to you on final payment. It lives in a repository you control and deploys to accounts in your name, including the payment and shipping providers. There is no licence fee and nothing you have to keep paying us in order to keep the marketplace running. If you want us to keep building afterwards, that is a separate quoted arrangement."
      },
      {
        "q": "How do you handle insured shipping for fragile, irreplaceable pieces?",
        "a": "Through one multi-carrier integration rather than carrier-by-carrier work. On Pastel that is Shippo. The seller sees rate options, buys a label, and the shipment becomes trackable for both parties. Insurance attaches to the shipment itself, which matters because a one-of-one object has no replacement unit. We do not underwrite anything. We integrate the provider that does and keep the tracking state visible while the piece is in transit."
      }
    ],
    "word_count": 1494,
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
    "meta_description": "We built Dooz Inspected Cars: inspections published inside the listing, financing and insurance in one flow. The client reports 20,000+ verified vehicles.",
    "hero_answer": "DevoraX builds used-car marketplaces where the inspection report is part of the listing rather than a PDF sent on request. We shipped Dooz Inspected Cars: an Angular web marketplace, React Native iOS and Android apps, and a NestJS backend on PostgreSQL, with financing and insurance in one flow. The client reports 150+ inspection points per vehicle. It is live on the web and both app stores.",
    "sections": [
      {
        "heading": "What do you actually get in a used car marketplace build?",
        "body": "Three layers, and they are not equally hard. The catalogue is the straightforward part: vehicles, photos, faceted search over make, model, year, mileage and price, server-rendered so listing pages are readable by crawlers. The inspection layer is the part most quotes underestimate. The transaction layer, where a reservation, a financing application and a unique physical asset must agree, is where the engineering cost sits.\n\nBase scope is listed in full below. In short: a buyer-facing web marketplace, a dealer account with its own listing tools, an admin console for reviewing inspections and approving listings, structured inspection records rendered inside the listing, a server-side financing calculator, and reservation handling so a sold car leaves search everywhere at once.\n\nNative apps, insurer integrations and automated valuation are things we have shipped, but each is quoted on its own rather than folded into a base price."
      },
      {
        "heading": "Have you actually built one of these before?",
        "body": "Yes, once, and it is publicly installable, so you can check rather than take our word. Dooz Inspected Cars runs at dooz.com, the Android app is on Google Play as com.dooz.app, and the iOS app is on the App Store as Dooz Cars. All three are served by the same NestJS backend.\n\nDooz was built against the exact problem this page describes. Buyers could not verify condition because inspection protocols were insufficient, and financing was complex enough to push deals offline. Every listed car is an inspected car, the inspection is published as part of the listing, and financing and insurance attach to a vehicle whose condition has already been established.\n\nThe client reports 150+ inspection points per vehicle, 20,000+ verified vehicles, 1.2B+ JD in total transactions supported, and a 98% customer satisfaction rate. Those come from the client's systems; DevoraX did not measure or audit them. The full case study is at /projects/25."
      },
      {
        "heading": "How does a 150+ point inspection become something a buyer can filter on?",
        "body": "By being data rather than a document. A PDF tells a buyer about one car. A structured inspection lets them compare every car against the same rubric, which is the point of a verified marketplace.\n\nOn Dooz that shows up in what a buyer can search on: make, model, year, mileage, price, financing eligibility and inspection outcomes, at once. The client reports 150+ inspection points per vehicle. PostgreSQL is the system of record, and vehicles, inspection records, listings and transactions are held as related data rather than as documents.\n\nFor your own build, that shape sets requirements we put in the proposal rather than leave to discovery. Each checkpoint needs its own identity and result so it can be queried. The rubric needs versioning, because a report captured under one revision still has to render after the checklist changes. Photographic evidence needs to be addressable per point and delivered efficiently to a phone. Those are scope lines for your system, not a description of anyone else's schema."
      },
      {
        "heading": "How do financing and insurance fit into the buying flow?",
        "body": "Buying, financing and insuring in one place is an integration problem more than an interface problem. A financing calculator has to model term, rate and deposit consistently, and the figure on the listing page has to be the figure at checkout. On Dooz, financing terms, valuation, inspection status and listing availability all resolve server-side rather than in the clients.\n\nInsurance is harder because the quote is not yours. A third-party response arrives on someone else's latency budget and can be slow or absent. Anything the platform does not control is treated as unreliable by design: timeouts, retries and an explicit degraded state, so one slow insurer does not block the rest of the flow.\n\nNestJS module boundaries let listings, inspections, valuation, financing and insurance live as separate domains behind stable interfaces, which is how Dooz is put together, and typed contracts mean a partner changing a field fails at compile time rather than showing a buyer a wrong number."
      },
      {
        "heading": "How do you keep dealer accounts separated from each other?",
        "body": "A marketplace with independent dealers is a multi-vendor system, and the rule that matters is that one seller cannot read or mutate another seller's stock. The wrong place to enforce that is the interface. A dashboard that hides a row is a presentation decision; a query that cannot return the row is a boundary.\n\nAfriva is the build that evidences this. Four roles, admin, manager, seller and buyer, each with a dashboard querying only the slice of data that role is entitled to, on Supabase's managed Postgres. Because Supabase bundles authentication with the database, the identity that signs a user in is the identity Postgres sees on the query, so ownership rules live once in the schema rather than in every screen. The client reports 1,245 active vendors and $1.2M in revenue across 120+ cities.\n\nAfriva is general-goods e-commerce, not automotive. It evidences the separation model; Dooz supplies the vehicle domain."
      },
      {
        "heading": "What does the build process look like, and what do you need from me?",
        "body": "It starts with a free 30-minute discovery call and ends with a written fixed-price proposal listing scope line by line. There is no hourly billing, so the scoping conversation has to be honest on both sides. An under-specified fixed price is bad for the client and worse for us.\n\nThe thing we need from you first is the inspection rubric. Not a description of it, the actual checklist, with the points, the result types and the pass criteria, because that document determines the data model and every filter built on top of it. We also need to know which lenders and insurers you intend to work with and whether they expose an API, whether listings come from your own inspectors or independent dealers, and where existing inventory lives. If you do not have a rubric yet, that is a scoping conversation rather than a blocker."
      },
      {
        "heading": "How is this priced?",
        "body": "Fixed price, in writing, after the discovery call. DevoraX publishes indicative starting points: MVP Starter from $2,900, Growth from $7,500, Enterprise custom-scoped. Those are starting points for the tiers, not quotes for this build. A marketplace with a structured inspection layer, dealer accounts and lender integrations does not sit in the entry tier, and we would rather say so here than in a third meeting.\n\nWhat moves the number is rarely the catalogue. It is the count of third-party integrations, the depth of the inspection rubric, whether native apps ship alongside the web marketplace, and whether existing inventory has to be migrated. Each is its own line in the proposal, so one can be cut without reopening the whole scope.\n\nNo hourly billing means we absorb the cost of our own estimation errors. It also means a scope change is re-quoted in writing rather than quietly absorbed."
      },
      {
        "heading": "What happens after launch, and who owns the code?",
        "body": "You own all code and IP on final payment. That is not a negotiated extra. The repository, the schema, the deployment configuration and the inspection data model are yours, and nothing is retained as a bargaining chip.\n\nOngoing support is quoted separately, because it is a different commitment from a build and bundling the two produces a vague retainer neither side reads. If you have your own engineers, handover is a repository and a walkthrough. If not, say so during discovery and we will scope it.\n\nTwo things to plan for regardless of who maintains it. Third-party integrations break on someone else's schedule, so a lender changing a payload is an operational event rather than a build defect. And the inspection rubric will change. A checklist that grows or reorganises has to leave reports captured under the old revision still readable, which is why rubric versioning is base scope in the first release rather than a repair job after the first revision."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If what you want is a classifieds board, where sellers post, buyers call and nobody verifies anything, do not commission a custom build. An off-the-shelf listings platform does that for a fraction of the cost, and the inspection engineering would be dead weight. If verification is not part of your product, nothing on this page applies to you.\n\nDo not hire us to run the inspection operation. We build the software that captures, versions and publishes a report. Recruiting inspectors and standing up the physical network is a different business, and not one we have done.\n\nAnd if procurement requires hourly billing, a named team of five, or a compliance certification on file, we are the wrong supplier. DevoraX is two people, Sameem Amjad and Usman, founded in 2019, and we work fixed-price. We will not clear those bars."
      }
    ],
    "proof": [
      {
        "project_id": 25,
        "name": "Dooz Inspected Cars",
        "one_line": "An all-in-one platform for buying, financing and insuring verified used vehicles, built as an Angular web marketplace and React Native iOS and Android apps over a NestJS backend on PostgreSQL.",
        "what_it_proves": "A used-car marketplace where the inspection is published as part of the listing and buyers filter on inspection outcomes alongside make, model, year, mileage, price and financing eligibility, with valuation, financing terms and listing availability resolving server-side against a vehicle whose condition has already been established. Live on the web, Google Play and the App Store.",
        "figures": [
          "The client reports 150+ inspection points per vehicle",
          "The client reports 20,000+ verified vehicles on the platform",
          "The client reports 1.2B+ JD in total transactions supported",
          "The client reports a 98% customer satisfaction rate"
        ]
      },
      {
        "project_id": 32,
        "name": "Afriva E-Commerce Platform",
        "one_line": "A multi-vendor e-commerce marketplace on Next.js 15 and Supabase, with separate admin, manager, seller and buyer dashboards and real-time delivery tracking over Postgres changes.",
        "what_it_proves": "Seller separation pushed down into the data layer rather than left as a UI concern, four role-scoped dashboards shipping from one deployment, and server-rendered catalogue pages a crawler can read. General goods rather than automotive, so it evidences the multi-vendor mechanics a dealer marketplace needs, not vehicle domain knowledge.",
        "figures": [
          "The client reports 1,245 active vendors",
          "The client reports $1.2M in total revenue",
          "The client reports coverage across 120+ cities"
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
      "Native iOS and Android apps alongside the web marketplace. Dooz has both, built in React Native from one codebase, but they are a separate line rather than base scope",
      "Insurer quote integrations. Each partner is scoped individually, because the work depends entirely on what API they expose and what it returns",
      "Lender and payment gateway integrations beyond the first",
      "Automated or AI-assisted valuation. It depends on having enough structured condition data to price against, which a new catalogue does not have on day one",
      "Migration of existing inventory from a dealer management system or a supplier feed",
      "Support, monitoring and maintenance after handover"
    ],
    "when_not_to_hire": "If your model is a classifieds board, where sellers post, buyers call and nobody verifies anything, do not pay for a custom build. An off-the-shelf listings platform does that cheaply, and the inspection layer is the only part it cannot do. Skip us too if you need the inspection operation itself staffed: we build the software that captures and publishes a report, not the inspector network. And if procurement requires hourly billing or five named engineers on your standups, DevoraX is two people working fixed-price and will not clear that bar.",
    "faqs": [
      {
        "q": "Can you attach a full inspection report to every listing?",
        "a": "Yes. On Dooz the inspection is published as part of the listing rather than sent on request, and the client reports 150+ inspection points per vehicle. Buyers filter on inspection outcomes alongside make, model, year, mileage and price. For your build we model each checkpoint as a record rather than a document, because that is what makes condition comparable across a catalogue instead of readable one PDF at a time."
      },
      {
        "q": "Do I get mobile apps as well as a web marketplace?",
        "a": "Dooz has both: an Angular web marketplace plus React Native iOS and Android apps, all on one NestJS backend. For a new build, the web marketplace is base scope and the apps are quoted separately. React Native means one codebase serves both stores, so a listing or financing flow is implemented once and behaves the same on each. What that is worth against a web-only scope comes out of the discovery call."
      },
      {
        "q": "Can buyers apply for financing and get insurance inside the app?",
        "a": "On Dooz, yes. Financing and insurance attach to a vehicle whose condition has already been established, which is the point of the product. For your build, each lender or insurer is scoped and quoted individually, because the work depends on whether that partner exposes a usable API and how reliable its responses are."
      },
      {
        "q": "Are the figures on this page yours or the client's?",
        "a": "The client's, all of them. On Dooz: 150+ inspection points per vehicle, 20,000+ verified vehicles, 1.2B+ JD in total transactions and a 98% customer satisfaction rate. On Afriva: 1,245 active vendors, $1.2M in revenue and coverage across 120+ cities. Every one comes from the clients' own systems. DevoraX did not measure or audit any of them, and the published case studies say the same thing."
      },
      {
        "q": "What will it cost?",
        "a": "We do not quote before a discovery call and we do not bill hourly. You get a written fixed price after a free 30-minute call. Published starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are starting points, not quotes. A marketplace with a real inspection layer and lender integrations sits above the entry tier."
      },
      {
        "q": "Who owns the code when it is finished?",
        "a": "You do, on final payment: code, IP, schema and deployment configuration. Nothing is withheld to secure a maintenance contract. Support after launch is a separate quote because it is a separate commitment, and if you have your own engineers you may not want it at all."
      },
      {
        "q": "How do you stop one dealer from seeing another dealer's stock?",
        "a": "By enforcing ownership in the database rather than the interface. On Afriva each role queries only the slice of data it is entitled to, and because Supabase bundles authentication with Postgres, the identity that signs a user in is the identity the database sees on the query. A hidden row is a presentation choice; a query that cannot return it is a boundary."
      },
      {
        "q": "Is this the same build as a general multi-vendor marketplace?",
        "a": "The vendor mechanics overlap: seller accounts, role-separated dashboards, ownership rules in the schema, order state that has to stay fresh on every surface. What differs is uniqueness, since every car is one unit rather than a stock item with a quantity, plus the inspection layer itself. For general goods, start from our multi-vendor marketplace development page."
      }
    ],
    "word_count": 1444,
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
    "h1": "A food truck ordering app development company with a live food truck platform and a live food ordering marketplace",
    "title": "Food Truck Ordering App Development",
    "meta_description": "Food truck ordering app development by a two-person team. Proof: Food Magnet, a live food truck platform, and Koor, a live food ordering marketplace.",
    "hero_answer": "DevoraX builds discovery and ordering apps for food trucks and other mobile vendors, whether you run your own trucks or sign up independent ones. Two live projects sit behind that: Food Magnet, a food truck discovery and vendor platform, and Koor, a homemade-food ordering marketplace. Neither is a food truck ordering app on its own. Fixed price after a free 30-minute discovery call.",
    "sections": [
      {
        "heading": "What is included in a food truck ordering app build?",
        "body": "Base scope is what our two shipped food platforms already contain between them. A customer app that finds nearby vendors and reads current menus. A vendor surface for updating location, menu items, availability and profile. A web admin dashboard for the people who run the platform rather than trade on it. Card payments through Stripe. Push notifications. A realtime channel so an open screen stays in step with the backend instead of polling.\n\nWhich project evidences which matters. Food Magnet's record covers discovery, live location tracking, menus, vendor profiles and four roles, and describes no customer ordering or checkout flow. Koor's record covers ordering and live order status, on home chefs rather than trucks. The proposal says which half each line came from.\n\nAnything neither project evidences sits outside base scope. We have published no work on point-of-sale hardware, kitchen printers or accounting systems, so we will not put them on a proposal as though they were routine. Running costs sit outside the fixed price: AWS, Firebase, Stripe fees and store developer accounts are billed to you by those vendors."
      },
      {
        "heading": "Who is this built for?",
        "body": "Three kinds of buyer. An operator who wants a branded ordering app for their own trucks. A platform business signing up independent vendors and taking a cut, which is a two-sided marketplace where the supply side happens to move. And market or event organisers who need the vendors on a site to be findable and orderable from a phone while that site is open.\n\nThe common property is that location is state rather than an address. A restaurant can be indexed once and relied on for years. A truck's position has a short useful life, and so does its menu. That one fact changes how search, caching, ranking and notifications have to be built, which is why a generic restaurant ordering template rarely survives contact with a vendor that moves. If your platform is multi-vendor first and mobility is secondary, the weight of the work moves from freshness to vendor onboarding and catalogue structure, which is closer to what Koor's case study describes than to Food Magnet's. Say which one you are on the call, because the two scope differently."
      },
      {
        "heading": "Which builds prove DevoraX has done this before?",
        "body": "Two, both live, both with a full public case study on this site. Between them they cover the two halves of this page, and neither covers both on its own.\n\nFood Magnet is a food truck discovery and vendor engagement platform. It runs as a Flutter mobile app with a React admin dashboard over a serverless AWS Lambda backend, with Firebase for realtime updates, Firebase and OneSignal for push, and Stripe for payments. Live food truck location tracking is a named part of the stack, and the platform has four user roles: admin, manager, vendor and customer. It is published at foodmagnet.app, on Google Play under com.foodmagnet.foodTruck, and on the App Store. Its record covers discovery, tracking, menus and vendor engagement, not a customer order flow, and the study states we have not published what Stripe charges or on whose behalf. The recorded outcome is descriptive rather than numeric: increased vendor visibility and real-time discovery for customers.\n\nKoor covers the ordering half, on home chefs rather than food trucks. It is a homemade-food marketplace on React Native and NestJS, with Elasticsearch for discovery, Firebase for live order status and AWS for hosting. The client reports 120,000+ completed orders and a 4.8 out of 5 user rating. The customer app is on Google Play under com.koor_user."
      },
      {
        "heading": "How does live location tracking work when the vendor keeps moving?",
        "body": "Live location tracking is named in Food Magnet's stack, but we have not published how it is implemented, so what follows is general reasoning rather than an account of that code.\n\nPosition is continuous state, not a request-response value. It changes while the vendor is working and loses its worth as it ages, so the system needs a write path running on its own schedule rather than only when someone taps something. On the device the trade is between truthfulness and cost, because frequent sampling keeps the data accurate and spends battery and cellular data on a handset the vendor is also using to run a business.\n\nOn the read side, proximity is a spatial query with a freshness constraint attached, and the failure mode deserves as much attention as the happy path. A position that cannot be refreshed is better shown as unknown than as a stale value presented with the confidence of a live one. A confident wrong answer costs a customer a wasted journey."
      },
      {
        "heading": "How is vendor, operator and customer data kept separate?",
        "body": "Food Magnet has four roles across two clients: admin, manager, vendor and customer, on a mobile app and a web dashboard. That configuration is exactly where authorization tends to go wrong, because each client can look correct while enforcing a slightly different reading of the same rule.\n\nA check in the client is a user interface decision. It is useful for hiding controls a person cannot use, and it is not a security boundary, because the request it guards can be issued without going through the interface at all. The boundary belongs where every client passes through, which on Food Magnet is the Lambda layer, and on Koor is the single NestJS service allowed to write authoritative order data.\n\nThe same reasoning is why an admin dashboard is a separate web client rather than a privileged mode inside the consumer app. Keeping operational capability out of the app customers install limits what a compromised customer session can reach. We have not published either project's permission table, so the structure is what we can state and the rules inside it are yours to define."
      },
      {
        "heading": "How does the build run, and what do you need from us?",
        "body": "It starts with a free 30-minute discovery call. We come out of that with enough to write a fixed-price proposal: the screen set, the role model, the integrations, and what is explicitly excluded. You get it in writing before committing to anything. There is no hourly billing, so a scope change is a conversation about a revised fixed price rather than a surprise on an invoice.\n\nWhat we need from you is short but has to be real. A named person who can make decisions without convening a committee. Your menu and vendor data model, or enough examples that we can derive it. Your own Stripe account, because the money should land in your account and not pass through ours. Apple and Google developer accounts in your company's name, for the same reason.\n\nDevoraX has been running since 2019 and is two people: Sameem Amjad and Usman."
      },
      {
        "heading": "How is this priced?",
        "body": "Fixed price, always, written after the discovery call. Published starting points are MVP Starter from $2,900, Growth from $7,500, and Enterprise custom-scoped. Those are indicative starting points rather than quotes, and a platform with live tracking, four roles, payments and two mobile targets is not a starter build.\n\nWhat moves the number is mostly surface count and role count rather than a list of features. One customer app on one platform is a different job from a customer app, a vendor surface and an admin dashboard. Four roles cost more than two, because the authorization work behind them is real. Shipping iOS as well as Android adds store review and device testing even where one codebase produces both binaries.\n\nThird-party running costs are yours and not marked up: AWS or Firebase usage, Stripe's processing fees, developer account fees."
      },
      {
        "heading": "What happens after launch, and who owns the code?",
        "body": "You own all code and IP on final payment. No licence-back, no hosting lock, no arrangement where the repository stays with us. It is handed over in your accounts, on your infrastructure, and you can take it to another developer the week after launch.\n\nSupport after launch is scoped and quoted separately rather than folded into the build price. We would rather quote it against what the product actually needs once it is live than charge you in advance for a retainer neither of us can size yet.\n\nEvery project we deliver gets a published case study, including the parts we could not evidence. Food Magnet's study states plainly that its outcome carries no metrics and that the tracking implementation was never published. Twenty-five delivered projects, twenty-five public studies."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If you need point-of-sale integration, kitchen hardware, a driver dispatch and routing engine, or a named compliance regime signed off, we have not shipped those and will not learn on your budget. Hire a supplier with that exact scope already in their portfolio.\n\nIf you need a supplier who has already shipped ordering and checkout inside a food truck product, we are not it. Food Magnet is the food truck half and its record describes no order flow. Koor is the ordering half and its vendors are home chefs. That gap is real and you should price it into the decision.\n\nIf you need a contractual delivery date you can hold a supplier to, look elsewhere: we do not publish timelines and will not invent one on a first call to win the work. And if you want a large team, an account manager and a 24/7 support desk, we are two people. You deal directly with whoever writes the code, and there is nobody else to hand the work to when they are unavailable."
      }
    ],
    "proof": [
      {
        "project_id": 14,
        "name": "Food Magnet",
        "one_line": "A food truck discovery and vendor engagement platform built as a Flutter mobile app and a React admin dashboard over a serverless AWS Lambda backend, live on web, Android and iOS.",
        "what_it_proves": "The food truck half: live truck location tracking, menu management, vendor profiles, a four-role model of admin, manager, vendor and customer, Stripe payments, Firebase realtime updates and Firebase plus OneSignal push, shipped to three published surfaces. It does not evidence a customer ordering and checkout flow, and the record names Stripe under payments without stating what is charged or by whom.",
        "figures": []
      },
      {
        "project_id": 17,
        "name": "Koor Food Delivery",
        "one_line": "A homemade-food marketplace on React Native and NestJS, with Elasticsearch for discovery, Firebase for live order status and AWS (EC2, S3, CloudFront) for hosting.",
        "what_it_proves": "The ordering and delivery half at real volume, on home chefs rather than food trucks: search over a supply that changes constantly, live order status pushed rather than polled, and authoritative order writes held behind a single service layer.",
        "figures": [
          "The client reports 120,000+ completed orders",
          "The client reports a user rating of 4.8 out of 5"
        ]
      }
    ],
    "included": [
      "Customer mobile app for finding nearby vendors, reading current menus and placing orders, on Android and iOS from one codebase (Flutter or React Native)",
      "Vendor surface for updating location, menu items, availability and profile",
      "Live location tracking for vendors that move during a working day",
      "React web admin dashboard for the people operating the platform",
      "Role model with authorization enforced server-side (Food Magnet ships admin, manager, vendor and customer)",
      "Card payments through Stripe, including idempotent webhook handling",
      "Push notifications via Firebase Cloud Messaging and OneSignal",
      "Realtime order and status updates pushed over a Firebase subscription instead of client polling",
      "Cloud object storage and CDN delivery for menu and vendor imagery",
      "Search and discovery over changing vendor supply (Elasticsearch, as used on Koor)"
    ],
    "quoted_separately": [
      "Cloud and third-party running costs: AWS, Firebase and Stripe processing fees, billed to you by those vendors",
      "Apple and Google developer accounts and store submission fees",
      "Post-launch support and maintenance, scoped once the product is live and taking real traffic",
      "Menu content, vendor onboarding data and food photography",
      "A second mobile platform where only one is in the agreed base scope",
      "Brand identity and design work beyond the agreed screen set"
    ],
    "when_not_to_hire": "Not us if you need point-of-sale integration, kitchen hardware, a driver dispatch and routing engine, or a named compliance regime signed off. We have shipped none of those. Not us if you need a supplier that has already shipped ordering and checkout inside a food truck product: for us those are two different projects. Not us if you need a contractual delivery date, because we do not publish timelines and will not invent one. Not us if you want an account manager and a 24/7 support desk, because DevoraX is two people. And if a $2,900 to $7,500 range is above budget, a no-code ordering product will serve you better.",
    "faqs": [
      {
        "q": "Have you actually built a food truck app, or just a restaurant app?",
        "a": "Food Magnet is a food truck discovery and vendor engagement platform with live truck location tracking, menu management and vendor profiles, published on web, Android and iOS. Its record describes no customer ordering or checkout flow. Koor is a homemade-food ordering marketplace on React Native and NestJS, so it evidences the ordering half, on home chefs rather than trucks. Both case studies state those limits. Read them before the call."
      },
      {
        "q": "Can you build the customer app, the vendor app and the admin dashboard?",
        "a": "Food Magnet ships a Flutter mobile app and a React web admin dashboard over one AWS Lambda backend, with four roles: admin, manager, vendor and customer. Whether vendors get a separate app or a role inside one app is a scoping decision we make on the call. Both cost more than a single-surface customer app, and the proposal states which one you are buying. Koor's case study covers the multi-vendor version of the same problem."
      },
      {
        "q": "Do you ship iOS as well as Android?",
        "a": "Food Magnet is on the web, Google Play and the App Store. Koor's customer app is published on Google Play. Flutter and React Native both produce iOS and Android builds from one codebase, so the second platform is mostly store review, device testing and release work rather than a second build. It is still a priced line in the proposal either way."
      },
      {
        "q": "How accurate will the live location be?",
        "a": "We have not published Food Magnet's tracking implementation and will not claim a figure for it. In general, accuracy on a moving vendor is a trade against battery and cellular data on a phone the vendor is also using to work. The question worth arguing about on your project is what the app shows when a position cannot be refreshed. Stale data presented as live is the expensive failure."
      },
      {
        "q": "Do you take a percentage of orders or transactions?",
        "a": "No. We charge a fixed price for the build and nothing on your revenue. Food Magnet's record names Stripe under payments, and Stripe's processing fees are billed to you directly by Stripe rather than through us. Your Stripe account, your money. The same applies to AWS, Firebase and app store developer fees, which are not marked up."
      },
      {
        "q": "What happens if something breaks after launch?",
        "a": "You own the code and IP on final payment, hosted in your own accounts, so you are never locked to us. Support after launch is scoped and quoted separately once the product is live and we can both see what it actually needs. We would rather quote that against real usage than sell you a retainer neither of us can size in advance."
      },
      {
        "q": "What does a build like this cost?",
        "a": "Fixed price after a free 30-minute discovery call. Published starting points are MVP Starter from $2,900, Growth from $7,500 and Enterprise custom-scoped, and those are indicative rather than quotes. A platform with live tracking, four roles, payments and two mobile targets sits above the starter tier. There is no hourly billing, so a scope change is a revised fixed price you agree to first."
      },
      {
        "q": "Why would I trust a two-person team with this?",
        "a": "Check rather than trust. DevoraX has been running since 2019, has delivered 25 projects, and every one has a published case study on this site, including the ones whose outcomes carry no numbers. Our public Fiverr profile shows 20 five-star reviews from 16 clients across four countries, three of them repeat clients. Food Magnet and Koor are both downloadable today."
      }
    ],
    "word_count": 1576,
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
    "meta_description": "We built one competition and leaderboard platform: WOD Pro League, in Flutter and Node.js. The client reports 12,778 athletes. Fixed-price, code is yours.",
    "hero_answer": "DevoraX is a two-person studio that builds competition and leaderboard software for functional fitness. We have shipped one: WOD Pro League, a Flutter athlete app on iOS and Android, a React organizer dashboard, and a Node.js backend where scoring and ranking are computed server-side. The client reports 12,778 athletes and 8,567 submitted scores. Founded 2019, fixed-price, case study published.",
    "sections": [
      {
        "heading": "What do you actually ship in a competition and leaderboard app?",
        "body": "A base build is three surfaces on one backend. Athletes get a Flutter app compiled to native iOS and Android from a single codebase and submitted to both stores. Organizers get a React dashboard for creating events, defining divisions, publishing workouts, reviewing submitted scores and managing qualification. Both talk to a Node.js service layer where the scoring and ranking logic lives.\n\nThat last point is the whole design. Ranking is never computed on a phone. A leaderboard calculated client-side is a leaderboard that can disagree with the phone next to it, and in competition that disagreement becomes a dispute. Centralising ranking gives one authoritative answer that every client renders identically, and it lets competition rules change without an app store release.\n\nReal-time delivery runs over persistent Socket.io channels rather than polling, so a submitted score propagates as an event instead of on someone's next request. Ranked score data sits in Redis, so position and range queries are answered in memory instead of re-sorting a relational table on every submission."
      },
      {
        "heading": "Who is this built for?",
        "body": "Anyone whose product is a ranking. Online qualifiers, multiple divisions, workouts released on a schedule, scores submitted against a deadline, a qualification cut at the end. If the standings are wrong or late, nothing else about the app matters to an athlete.\n\nWe have built that shape once, for one operator. The WOD Pro League record does not describe its client as a federation, a gym chain or an event organizer, so we do not list them as segments we serve. What the record does state is the problem the build addressed: athletes lacked a comprehensive platform to compete across global regions with real-time tracking and analysis. That platform runs global online competition, and that is the shape we can show you.\n\nBe honest about your own scale on the discovery call. A one-off throwdown for a single affiliate does not need Redis, Socket.io and a serverless backend, and we will tell you so. This architecture earns its cost when submissions arrive in deadline-hour bursts rather than a trickle."
      },
      {
        "heading": "Which build proves you have done this before?",
        "body": "One build, and it is public. WOD Pro League is a global functional fitness competition platform: a Flutter app on the App Store and Google Play, a web platform at wodproleague.es, a React administrative dashboard, and a Node.js backend on AWS with Redis and Socket.io handling real-time data.\n\nThe client reports 12,778 total athletes and 8,567 submitted scores, competitions listed as 24/7 active, a 68.3% qualification rate, and reach across more than 120 countries. Those are the client's figures, not measurements DevoraX took or audited. The one that carries technical weight is the submitted-score count, because every entry is a write that had to be accepted, ranked and pushed out to connected clients without breaking the integrity of a live leaderboard.\n\nYou do not have to take any of this on description. The web platform, the iOS app and the Android app are all live and inspectable, and the full engineering case study is published on this site at /projects/31."
      },
      {
        "heading": "How does the leaderboard hold up at a submission deadline?",
        "body": "Competition traffic is not flat. It clusters around workout releases and submission deadlines, then falls away between events. The peak decides whether athletes trust the platform.\n\nThree decisions carry that load in WOD Pro League. Redis holds the ranked score data, because a leaderboard is a ranking query and re-sorting a primary database on every submission does not survive a burst. Socket.io replaces polling with persistent push channels, and its transport negotiation and reconnection matter because athletes move between cellular and wifi mid-session. AWS Lambda scales out per invocation and back down afterwards, so capacity follows the competition calendar rather than a fixed fleet sized for the average.\n\nWe publish no concurrency, latency or throughput figures and will not estimate any; the only counts in the record are the client's, and they are cumulative totals, not peak load. Timing is the quieter problem: deadlines are held in absolute time on the server and shown in local time in the client, so a cutoff means the same instant everywhere."
      },
      {
        "heading": "How separate are the athlete side and the organizer side?",
        "body": "Separate clients, one shared backend. The record describes three client surfaces, the Flutter athlete app, the web platform and the React administrative dashboard, sitting on one Node.js service layer. The athlete app submits and displays. It cannot compute or alter a rank, because the scoring and ranking logic lives on the server, which is what makes every surface agree.\n\nBe clear on what that is: separation of surfaces and of authority, not of data. Nothing in the WOD Pro League record documents roles, permissions, row-level access or anti-cheat, so we will not describe an access model we cannot evidence. Server-side ranking alone does not stop a tampered client posting a false score through the same API; submission validation and judging do, and both are rules you define.\n\nIf you need a written access model, or several organizers running isolated competitions from one instance, raise it on the call. Role-separated dashboards over one shared backend is a pattern we describe on our multi-vendor marketplace development page, at /solutions/multi-vendor-marketplace-development."
      },
      {
        "heading": "What does the build process look like, and what do you need from us?",
        "body": "It starts with a free 30-minute discovery call and ends with a written fixed-price proposal before any code is written. We do not bill hourly. The proposal names what is in scope and what is not, because a fixed price is only meaningful if both halves are written down.\n\nWhat we need from you is your rulebook, written down. Scoring formats per workout type, how divisions are structured, tie-break rules, what counts as a valid submission, and the qualification criteria. Those are the requirements the ranking pipeline is built from. Vague answers here are the most reliable cause of rework later.\n\nPractically, we also need brand assets, and an app store release needs Apple Developer and Google Play accounts. Whose accounts those are, and whose cloud account the backend runs in, is settled in the proposal rather than assumed in either direction, so decide it before the first release instead of after it. If judging involves video review, show us how you judge today."
      },
      {
        "heading": "How is this priced?",
        "body": "Fixed price, after the discovery call, in writing. Published tiers start at $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are indicative starting points rather than quotes, and a competition platform with real-time ranking, an organizer dashboard and two app store releases sits above an MVP Starter number.\n\nThe honest driver of cost is not screen count. It is how complicated your scoring rules are and how many of them there are. One workout type with a single ranking formula is a small build. Points tables across multiple divisions, scaled and prescribed categories, tie-breaks resolved on secondary fields, and a qualification cut with manual overrides is a much larger one, because each rule is logic that has to be correct when an athlete challenges a placement.\n\nYou get the number once we have read your rulebook. If scope changes during the build, it is re-quoted in writing rather than absorbed quietly and recovered elsewhere."
      },
      {
        "heading": "What happens after launch, and who owns the code?",
        "body": "You own all code and IP on final payment. That covers the Flutter app, the backend services, the admin dashboard and the infrastructure configuration. That transfer is the commitment we publish, and it is the one worth holding us to in writing.\n\nSupport after handover is scoped and quoted separately rather than assumed. Competition platforms have a particular operational shape: the risk is concentrated into a few hours around a deadline, so the useful question is not a generic uptime promise but who is reachable during your qualifier window and how you reach them. Settle that before your first event, not during it.\n\nDevoraX is two people, Sameem Amjad and Usman, working since 2019 across 25 delivered projects, every one with a published case study. Price that constraint in. It also means the people who wrote your ranking pipeline are the people who answer when it misbehaves."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "Do not hire us for on-site live event production: heat scheduling against physical floor lanes, judge tablets running offline in a venue with no signal, arena screen graphics. We have shipped online competition with real-time leaderboards. We have not shipped venue floor operations, and buying that from a team learning it during your event is a bad trade for both of us.\n\nSkip us too if you need coverage in your timezone on a rota, or an agency with a bench it can surge onto a fixed event date. Two people cannot honestly promise either.\n\nAnd if you only need scoring for one gym's internal throwdown, a spreadsheet or an existing off-the-shelf scoring tool will beat a custom build on both cost and time to your first event. Come back when you are running qualifiers at a scale that breaks them."
      }
    ],
    "proof": [
      {
        "project_id": 31,
        "name": "WOD Pro League",
        "one_line": "A global functional fitness competition platform: a Flutter athlete app on iOS and Android, a web platform at wodproleague.es, and a React administrative dashboard, all on a Node.js and AWS backend with Redis and Socket.io driving real-time leaderboards.",
        "what_it_proves": "That DevoraX has shipped what this page sells: server-side scoring and ranking that every client renders identically, live leaderboard delivery over persistent Socket.io channels, Redis-backed ranking built for deadline-hour submission bursts, serverless capacity that follows a competition calendar, and an organizer dashboard covering events, divisions, workouts, score review and qualification. Shipped to both app stores and publicly inspectable. It does not evidence access control, anti-cheat, multi-tenancy, payments or video judging.",
        "figures": [
          "The client reports 12,778 total athletes",
          "The client reports 8,567 submitted scores",
          "The client reports a 68.3% qualification rate",
          "The client reports competitions running 24/7 active",
          "The client reports reach across more than 120 countries"
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
      "Ongoing support, monitoring and app store release management after handover"
    ],
    "when_not_to_hire": "Do not hire us for on-site live event production. Heat scheduling against floor lanes, offline judge tablets in a venue with no signal, arena screen graphics: we have not shipped those, and your event is the wrong place for us to learn. Skip us if you need timezone coverage on a rota or a bench to surge onto a fixed date, because two people cannot promise it. And for one gym's internal throwdown, a spreadsheet will beat a custom build on cost and on time to your first event.",
    "faqs": [
      {
        "q": "Is the athlete app built in React Native?",
        "a": "No. WOD Pro League's athlete app is Flutter, compiled from one Dart codebase to native iOS and Android builds, and both are live on the App Store and Google Play. Flutter renders its own widgets through a compiled pipeline, which keeps a long leaderboard list scrolling predictably while incoming socket events mutate it underneath the athlete reading it."
      },
      {
        "q": "Can the leaderboard update live while scores are still being submitted?",
        "a": "Yes, that is the core of the build. Connected clients hold persistent Socket.io channels and receive standings changes as pushed events instead of polling for them. Ranked score data sits in Redis, so a position query is answered in memory. WOD Pro League runs this pattern, and the client reports 8,567 submitted scores through it."
      },
      {
        "q": "What stops an athlete submitting a false score?",
        "a": "Your rules do, not our architecture. Ranking runs server-side in WOD Pro League, so no client can rewrite a placement, but a tampered client can still post a score through the same API. The record documents no anti-cheat or validation tooling on that build, so we claim none. Video review, judging queues and appeals are quoted as a separate workstream. Tell us how you verify a score today and it gets priced as defined work."
      },
      {
        "q": "How long does a build like this take?",
        "a": "We do not publish timelines, and you should be wary of any agency that quotes one before reading your scoring rules. The schedule falls out of how many ranking formats, divisions and tie-break rules exist, plus app store review, which nobody controls. You get a date alongside the fixed price in the written proposal, after the discovery call."
      },
      {
        "q": "Can you take entry fee payments and pay out prize money?",
        "a": "Payments are scoped and quoted separately. Nothing in the WOD Pro League record covers entry fees, payouts or subscription billing, so we are not going to imply we have shipped it. Bring your payment provider, the jurisdictions you sell into and your payout model to the discovery call, and it gets priced as defined work."
      },
      {
        "q": "Can several federations run on one installation, each seeing only their own data?",
        "a": "That is multi-tenancy, and it is a different data model from the one WOD Pro League runs. We have not shipped tenant-partitioned competition hosting, so treat it as scoped work rather than something we have proven. It is answerable, but it has to be decided before the schema is written rather than retrofitted. Our multi-vendor marketplace development page covers role-separated dashboards on a shared backend, which is related but not the same thing."
      },
      {
        "q": "Who owns the app once it is built?",
        "a": "You do. All code and IP transfer on final payment, including the Flutter app, the backend services, the admin dashboard and the infrastructure configuration. Whose Apple Developer, Google Play and cloud accounts the build ships under is a scoping decision, not something we state as house practice, so get it named in the proposal before the first release."
      },
      {
        "q": "How do I verify you actually shipped this?",
        "a": "Open it. WOD Pro League is live on the web at wodproleague.es, on the App Store, and on Google Play. The full engineering case study, including the architecture decisions and the client's reported figures, is published at /projects/31. All 25 DevoraX projects have a published case study, so nothing here is a private reference."
      }
    ],
    "word_count": 1502,
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
    "meta_description": "Duffel API integration for travel booking platforms. We shipped Barfly Risk Engine on Node.js and Duffel, live at got2.travel. Fixed price, code is yours.",
    "hero_answer": "DevoraX is a software agency founded in 2019. We have built one Duffel API integration for a live travel product: Barfly Risk Engine, a Node.js system that pairs Duffel flight data with heuristic algorithms to score transfer risk on codeshare and non-codeshare itineraries in real time. It is live at got2.travel and the case study is public.",
    "sections": [
      {
        "heading": "What does a Duffel API integration from DevoraX include?",
        "body": "The base scope is the integration and the layer you own around it. Duffel sits behind your own Node.js service rather than in your front end, so credentials never reach a browser and supplier behaviour can change without shipping a client release.\n\nInside that service we build the itinerary model. A connecting flight is not one product. It is two or more separately operated segments joined by a layover, and on a codeshare the carrier that sells a segment is not the carrier that operates it. We carry marketing and operating identity separately through the model instead of collapsing them into a single airline field, because any rule that depends on a carrier has to know which carrier it means.\n\nScoring and annotation sit on top of that structure. The full base scope is listed below, and so is what we quote separately. Order creation and ticketing are on the second list for a reason we set out further down."
      },
      {
        "heading": "Which build proves DevoraX has shipped this?",
        "body": "Barfly Risk Engine. It is a Node.js flight transfer risk assessment system that integrates the Duffel API with heuristic algorithms to produce real-time risk predictions for codeshare and non-codeshare itineraries, with React.js as the interface technology. The build also includes an AI travel assistant, disruption prediction and a global flight risk index. It is live at got2.travel and the full case study is at /projects/29.\n\nThe client reports 88% on-time performance and 78% flight risk prediction accuracy, describes user satisfaction as high, and gives the disruption prediction level as moderate. Those four figures are the whole of the reported numbers. DevoraX did not measure or audit them and how they were arrived at has not been published, so they are reproduced exactly as reported.\n\nThat is one project, not a portfolio of them. DevoraX has delivered 25 projects since 2019, each with a published case study. Barfly is the one that evidences Duffel."
      },
      {
        "heading": "What does the Barfly record not prove?",
        "body": "The published record covers the search and assessment path. It does not document order creation, payment or ticketing, so this page claims none. If your product needs booking through to an issued ticket, that is work we will scope and quote against proof that stops short of it.\n\nNor does it describe the internals. It states that the engine treats codeshare and non-codeshare itineraries as distinct cases, but not the schema behind that, so the data modelling described above is method rather than a delivered artefact. The same holds for the AI travel assistant, disruption prediction and risk index.\n\nThe project is categorised as Node.js Backend and AWS, but the technologies named for it are React.js and Node.js only. No hosting topology, database, cache or queue is published, so none is claimed. The risk model's inputs are given as airline protocols and aviation variables and no further. Barfly is a web product with no Android or iOS build. Know the shape of the evidence before a call, not after one."
      },
      {
        "heading": "Who is this page for?",
        "body": "Travel booking platforms, OTAs and metasearch products that have decided to integrate Duffel and want the integration, and whatever sits on top of it, built once and properly.\n\nThe closest fit to what we have shipped is a platform whose difficulty is in the reasoning over itineraries rather than in the distribution itself. Connection risk, disruption exposure, ranking that is not purely price, or any rule set that has to know which carrier actually operates a segment. That is the problem Barfly is. If you are searching flights and displaying them with no derived logic on top, the integration is smaller than this page describes and you may not need an agency for it.\n\nCorporate travel tools and vertical booking products with their own policy rules are the same shape of problem: rules that have to run over a normalized itinerary structure rather than over per-carrier formats."
      },
      {
        "heading": "How do you keep supplier, agent and traveller data separate?",
        "body": "This matters when more than one party lives inside your platform: agencies booking under their own accounts, suppliers beyond flights, or white-labelled partners with their own customers.\n\nBe clear about the evidence first. The Barfly record documents no multi-tenant model, so nothing here claims we have shipped one, and no other page on this site is offered as proof of it either. What we will state is method. Tenancy belongs in the data model from the first migration rather than being retrofitted. Every row that belongs to a party carries that party's identifier, the identifier is derived from the authenticated session and never from a request parameter, and the check is enforced server-side on every read and write.\n\nIf a genuine multi-party marketplace is the product rather than a side effect of it, say so before we quote. That is a different build with a different data model at its centre, and we would scope it as its own project rather than as an extension of a Duffel integration."
      },
      {
        "heading": "What does the build look like, and what do you need from us?",
        "body": "It starts with a free 30-minute discovery call, after which you get a written fixed-price proposal with the scope stated line by line. Nothing begins before you have that document and have agreed to it.\n\nWhat we need from you is a Duffel account and test credentials in your own name, because that account is a commercial relationship between you and Duffel and should never sit with a supplier. We also need the product decisions only you can make: which markets, which cabin classes, what happens when a search returns nothing, and what your rules are if we are building rules. If the scoring logic is yours, we need it written down before we quote it.\n\nOne named contact who can answer a question the same week is worth more than any process. Sameem Amjad runs the engagement. Usman is the other half of the team."
      },
      {
        "heading": "How is a Duffel integration priced?",
        "body": "Fixed price. There is no hourly billing. After the discovery call you get a written proposal with a fixed figure against a defined scope, and if the scope changes we requote in writing rather than letting a number drift upward.\n\nPublished starting points are $2,900 for MVP Starter and $7,500 for Growth, with Enterprise custom-scoped. Those are indicative starting points and not a quote for your build. A search integration dropped into an existing React front end and a full engine with its own rule set are different projects and will not carry the same number.\n\nThe reason we work this way is unglamorous. A fixed price moves the estimating risk onto us, which is where it belongs, and it gives you a figure you can take to a board rather than a range you have to defend."
      },
      {
        "heading": "What happens after launch?",
        "body": "You own everything. All code and IP transfer to you on final payment. The repository is yours, the Duffel account was always yours, and there is no license to renew and no runtime dependency on DevoraX.\n\nSupport is scoped and quoted separately, and it is worth saying what it is not. DevoraX is two named people, so there is no 24/7 rota and we will not pretend there is. What we offer is a defined arrangement with an agreed response window during working hours, written into the proposal so you know what you bought before you buy it.\n\nTaking the work in-house after handover is a normal outcome rather than a failure of the relationship. The handover document exists so that another engineer can pick the integration up without calling us."
      },
      {
        "heading": "When should you not hire DevoraX for this?",
        "body": "If your distribution requirement is GDS, meaning Amadeus, Sabre or Travelport, or direct NDC connections to carriers, hire a supplier who has those running in production. We have not shipped them and you should not fund the learning.\n\nIf you need someone on call around the clock for a live booking desk, two people cannot honestly provide it. If you need IATA accreditation, consolidator relationships or a regulated payments operation, those are commercial and regulatory problems rather than engineering ones and we do not solve them.\n\nIf you already have a working Duffel integration and want extra hands by the hour to extend it, the fixed-price model will frustrate you. And if the only thing you need is flight search rendered on a page with no derived logic above it, that is a smaller job than this page describes and you may not need an agency for it."
      }
    ],
    "proof": [
      {
        "project_id": 29,
        "name": "Barfly Risk Engine",
        "one_line": "A Node.js flight transfer risk assessment system that integrates the Duffel API with heuristic algorithms to produce real-time risk predictions for codeshare and non-codeshare itineraries, with React.js as the interface technology, live at got2.travel.",
        "what_it_proves": "That DevoraX has taken a Duffel integration into a live travel product and built domain logic on top of it. The record documents an engine that treats codeshare and non-codeshare itineraries as distinct cases rather than collapsing them into one path, and a heuristic layer that synthesizes airline protocols and aviation variables into an assessment computed on demand rather than prepared offline. The build also carries an AI travel assistant, disruption prediction and a global flight risk index. The internals of those three are not published, so no conclusion about the delivered architecture is drawn from them here.",
        "figures": [
          "The client reports 88% on-time performance",
          "The client reports 78% flight risk prediction accuracy",
          "The client reports user satisfaction as high",
          "The client reports the disruption prediction level as moderate"
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
      "Duffel order creation, payment and ticketing. Our published proof covers the search and assessment path, so this is scoped, quoted and priced as new work",
      "Post-booking servicing: changes, cancellations, refunds, ancillaries and seat selection",
      "Your Duffel account, airline content arrangements and payment processing fees, which are commercial relationships between you and your providers rather than part of a build",
      "Additional supplier APIs for hotels, rail or cars, and the reconciliation layer between them",
      "A multi-supplier or multi-agency marketplace layer, which is a different build with its own data model and is scoped and quoted as its own project",
      "Native iOS and Android apps. Barfly is a web product and there is no published mobile build for it"
    ],
    "when_not_to_hire": "If you need GDS distribution, meaning Amadeus, Sabre or Travelport, or direct NDC connections to carriers, hire an agency that already runs those in production. We have not shipped them. If you need round-the-clock on-call cover for a live booking desk, DevoraX is two named people and cannot provide it. If you need IATA accreditation, consolidator relationships or a regulated payments operation, those are commercial and regulatory problems rather than engineering ones and we do not solve them. If you want hourly hands on an integration you already have, the fixed-price model will not suit you.",
    "faqs": [
      {
        "q": "Have you actually shipped a Duffel integration, or only worked with similar APIs?",
        "a": "Shipped one. Barfly Risk Engine integrates the Duffel API on a Node.js backend and is live at got2.travel. The full case study is published at /projects/29, including a section on what it deliberately does not claim. It is one project rather than five. If you want a supplier with a long list of travel integrations behind them, we are not it."
      },
      {
        "q": "Does Barfly book flights through Duffel, or only search them?",
        "a": "The published record covers the search and assessment path. It does not document order creation, payment or ticketing, so we do not claim it. Booking through to an issued ticket is work we will scope and quote, and when you compare us against an agency that has already shipped ticketing, price the difference in evidence honestly."
      },
      {
        "q": "Where do the 78% and 88% figures come from?",
        "a": "The client reports them. DevoraX did not measure or audit either figure, and how they were arrived at has not been published, so we reproduce them as reported and read nothing further into them. The same applies to the high user satisfaction rating and the moderate disruption prediction level. Four client-reported figures, and no others exist."
      },
      {
        "q": "Can you build the risk scoring, or only the API plumbing?",
        "a": "Both. Barfly is the scoring engine, not only the integration underneath it. It synthesizes airline protocols and aviation variables through heuristic algorithms rather than a trained model. Connection risk is conditional on two flights and the relationship between them, which is why it cannot be reduced to arithmetic on departure and arrival timestamps."
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
        "a": "You do, on final payment, including all IP. The repository is yours and the Duffel account is in your name from the first day, so there is nothing to unwind if you take the work in-house later. We hold no license over anything built for you and the system has no runtime dependency on DevoraX."
      },
      {
        "q": "Can you work inside our existing platform instead of starting fresh?",
        "a": "Usually yes, if it is a JavaScript or TypeScript stack. Barfly is Node.js with a React.js interface. On an existing codebase we want a read-only look before quoting, because a fixed price on code nobody has read is a guess, and we would rather not guess at your expense."
      }
    ],
    "word_count": 1419,
    "role": "spoke",
    "related_slugs": [
      "multi-vendor-marketplace-development"
    ],
    "service_id": 3
  }
];

export const SOLUTIONS_UPDATED = '2026-09-17T00:00:00.000Z';

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

export function allSolutionSlugs(): string[] {
  return SOLUTIONS.map((s) => s.slug);
}

export function solutionsInCluster(hubSlug: string): Solution[] {
  return SOLUTIONS.filter((s) => s.hub === hubSlug);
}
