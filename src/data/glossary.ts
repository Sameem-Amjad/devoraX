/**
 * Glossary of the terms the site's services and articles rely on.
 *
 * Rendered on /glossary as a definition list with one anchor per term, and
 * marked up from this same array as a DefinedTermSet, so the visible text and
 * the structured data cannot drift apart.
 *
 * Definitions describe stable facts about each tool or practice. Anything that
 * changes month to month (prices, tester counts, review times) stays out, so
 * the page cannot go quietly wrong. A plain literal, so
 * scripts/content-audit.mjs can read it without compiling TypeScript.
 */
export type GlossaryTerm = {
  /** Anchor id on /glossary, e.g. "stripe-connect". */
  id: string;
  term: string;
  /** Answer-first definition, roughly 40 to 80 words. */
  definition: string;
  /** Where DevoraX covers it in depth, when a page does. */
  related?: { href: string; label: string };
};

/**
 * Alphabetical. The AI app builders and editors are described as tools, without
 * a verdict on them: the founders who use them are who DevoraX works for. The
 * two DevoraX offers (the audit and the finish sprint) restate offer.ts, minus
 * the prices, which live on /pricing.
 */
export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'app-store-connect',
    term: 'App Store Connect',
    definition:
      "App Store Connect is Apple's web portal for publishing and managing apps on the App Store. Developers enrolled in the Apple Developer Program use it to create an app, upload builds, add screenshots and descriptions, set pricing and availability, invite TestFlight testers and submit each version for App Store review. Sales, crash and ratings reports are there too.",
    related: { href: '/services/1', label: 'Mobile app development, through to store release' },
  },
  {
    id: 'app-store-review',
    term: 'App Store review',
    definition:
      "App Store review is Apple's check of every new app and every update before it reaches the App Store. A reviewer tests the build against the App Review Guidelines, which cover safety, performance, business, design and legal requirements, then approves it or rejects it with the guideline it breaks. A rejected build can be fixed and resubmitted, or the decision appealed.",
    related: { href: '/pricing', label: 'What the iOS and Android launch includes and costs' },
  },
  {
    id: 'bolt',
    term: 'Bolt',
    definition:
      'Bolt, at bolt.new, is an AI app builder made by StackBlitz. A user describes a web app in plain language and Bolt writes the code and runs it inside the browser, so the app can be previewed, changed with further prompts and deployed without a local setup. The code can also be downloaded and continued in an ordinary code editor.',
    related: { href: '/pricing', label: 'What it costs to finish an AI-built app' },
  },
  {
    id: 'cursor',
    term: 'Cursor',
    definition:
      'Cursor is an AI code editor built on Visual Studio Code. A developer opens a codebase in it, and its AI features explain code, suggest edits and change several files at once from plain-language instructions. It is an editor, not a hosting service: running, testing and deploying the app all happen outside it.',
    related: { href: '/pricing', label: 'What it costs to finish an AI-built app' },
  },
  {
    id: 'deep-link',
    term: 'Deep link',
    definition:
      "A deep link is a link that opens a specific screen inside a mobile app, such as a listing, an order or a password reset, instead of the app's home screen. Apple's Universal Links and Android's App Links use ordinary web addresses, so the same link opens the app when it is installed and the website when it is not.",
    related: { href: '/pricing', label: 'What the iOS and Android launch includes and costs' },
  },
  {
    id: 'duffel-api',
    term: 'Duffel API',
    definition:
      'The Duffel API is a flights API from the travel technology company Duffel. Through one interface, a travel product can search airline offers, book a chosen offer as an order and manage that order afterwards, instead of connecting to each airline separately. Each offer lists its itinerary segment by segment, naming the airline that sells and the airline that operates each flight.',
    related: {
      href: '/solutions/duffel-api-integration-development',
      label: 'Duffel API integration development',
    },
  },
  {
    id: 'finish-sprint',
    term: 'Finish sprint',
    definition:
      "A finish sprint is DevoraX's fixed-price block of work that fixes what a launch-readiness audit found and gets the app to launch. It is priced by the week, and the audit says how many weeks the fix needs, so the total is known before work starts. Payments and the iOS and Android launch follow as separate steps when the app needs them.",
    related: { href: '/pricing', label: 'How the finish sprint is priced' },
  },
  {
    id: 'firebase',
    term: 'Firebase',
    definition:
      "Firebase is Google's platform of backend services for mobile and web apps. It bundles Cloud Firestore, a NoSQL document database, with sign-in, file storage, hosting, serverless functions and Cloud Messaging for push notifications. Apps read and write data straight from the device, and Firebase security rules decide what each signed-in user may access.",
    related: {
      href: '/insights/supabase-vs-firebase-marketplace-backends',
      label: 'Supabase vs Firebase for marketplace backends',
    },
  },
  {
    id: 'flutter',
    term: 'Flutter',
    definition:
      "Flutter is Google's open-source framework for building iOS, Android, web and desktop apps from one codebase, written in the Dart language. Instead of using each platform's native interface components, it draws the whole interface with its own rendering engine, so an app looks the same everywhere, and mobile release builds compile to native machine code.",
    related: {
      href: '/insights/react-native-vs-flutter-production-experience',
      label: 'React Native vs Flutter across one portfolio',
    },
  },
  {
    id: 'google-play-console',
    term: 'Google Play Console',
    definition:
      "Google Play Console is Google's dashboard for publishing Android apps on Google Play. Developers use it to set up the store listing, upload app bundles, run internal, closed and open testing tracks, roll releases out to users, and read crash reports, ratings and reviews. Apps are checked against Google Play's developer policies before they are published.",
    related: { href: '/services/1', label: 'Mobile app development, through to store release' },
  },
  {
    id: 'launch-readiness-audit',
    term: 'Launch-readiness audit',
    definition:
      "A launch-readiness audit is DevoraX's review of an app before it launches: its code, database security, payments, hosting and store readiness. The owner keeps the written report whatever they decide, and the audit says how many weeks the fix needs. An investor-ready version covers what technical due diligence will ask. It is an engineering review, not a security certification.",
    related: { href: '/pricing', label: 'What the launch-readiness audit covers and costs' },
  },
  {
    id: 'lovable',
    term: 'Lovable',
    definition:
      'Lovable is an AI app builder for web applications. A user describes the app in plain language and Lovable writes the code, a React front end that usually connects to Supabase for its database and sign-in, and can publish it from the browser. The code can be synced to GitHub, so a developer can keep working on it outside Lovable.',
    related: { href: '/pricing', label: 'What it costs to finish an AI-built app' },
  },
  {
    id: 'mvp',
    term: 'MVP (minimum viable product)',
    definition:
      'An MVP, or minimum viable product, is the smallest version of a product that real users can use, built to test whether the core idea works before more money goes into it. It serves one main audience with the few features that deliver the core value, and leaves everything else for later releases.',
    related: {
      href: '/insights/what-a-3000-mvp-budget-gets-you',
      label: 'What a small MVP budget buys, and what it does not',
    },
  },
  {
    id: 'nextjs',
    term: 'Next.js',
    definition:
      'Next.js is an open-source React framework for building web applications, maintained by Vercel. It can render pages on the server or at build time, so complete HTML reaches browsers and search engines, and a single project holds the interface, the routing and server code such as API endpoints. It runs on Vercel or on any Node.js host.',
    related: { href: '/services/2', label: 'AI and full-stack web development' },
  },
  {
    id: 'online-marketplace',
    term: 'Online marketplace',
    definition:
      'An online marketplace is a platform where independent sellers list goods or services and buyers purchase from them, while the operator runs search, checkout and payments and usually takes a commission. Unlike a single-seller shop, it needs seller accounts, orders split by seller, and a way to pay each seller their share of every sale.',
    related: {
      href: '/solutions/multi-vendor-marketplace-development',
      label: 'Multi-vendor marketplace development',
    },
  },
  {
    id: 'postgresql',
    term: 'PostgreSQL',
    definition:
      'PostgreSQL, often called Postgres, is an open-source relational database. It stores data in tables linked by keys and uses constraints and transactions to keep related records consistent, so an order cannot point at a listing that does not exist. Supabase is built on it, and it suits apps whose data is structured and related, such as accounts, listings and orders.',
    related: {
      href: '/insights/supabase-vs-firebase-marketplace-backends',
      label: 'Supabase vs Firebase for marketplace backends',
    },
  },
  {
    id: 'push-notification',
    term: 'Push notification',
    definition:
      "A push notification is a message an app's server sends to a user's device, shown even when the app is closed. On iOS it travels through Apple Push Notification service (APNs) and on Android through Firebase Cloud Messaging (FCM). Users can allow or block notifications for each app, and services such as OneSignal send to both platforms from one place.",
    related: { href: '/pricing', label: 'What the iOS and Android launch includes and costs' },
  },
  {
    id: 'react-native',
    term: 'React Native',
    definition:
      "React Native is an open-source framework, created by Meta, for building iOS and Android apps with JavaScript or TypeScript and React. It renders each platform's own native interface components rather than a web page, and most of the code is shared between the two platforms, with native modules where a feature needs device-specific code.",
    related: {
      href: '/insights/react-native-vs-flutter-production-experience',
      label: 'React Native vs Flutter across one portfolio',
    },
  },
  {
    id: 'replit',
    term: 'Replit',
    definition:
      'Replit is a browser-based platform for writing, running and hosting software without a local setup. Its built-in AI agent can create a whole application from plain-language instructions and keep changing it on request, and finished apps can be deployed from Replit to a public web address.',
    related: { href: '/pricing', label: 'What it costs to finish an AI-built app' },
  },
  {
    id: 'row-level-security',
    term: 'Row-level security (RLS)',
    definition:
      "Row-level security (RLS) is a PostgreSQL feature that decides, row by row, which records each user may read or change, using policies attached to the table. Supabase relies on it because apps query the database straight from the browser or phone: a table left without RLS can be read or changed by anyone holding the app's public API key, which ships inside the app.",
    related: {
      href: '/solutions/multi-vendor-marketplace-development',
      label: "Keeping one vendor out of another vendor's data",
    },
  },
  {
    id: 'sharetribe',
    term: 'Sharetribe',
    definition:
      'Sharetribe is a hosted platform for building and running online marketplaces. It provides listings, search, user accounts, messaging and a configurable transaction process with Stripe payments and a commission for the operator, both as a no-code product and as a developer platform whose API allows custom features. It does not produce native iOS and Android apps by default.',
    related: {
      href: '/insights/sharetribe-vs-custom-marketplace-build',
      label: 'Sharetribe vs a custom marketplace build',
    },
  },
  {
    id: 'stripe',
    term: 'Stripe',
    definition:
      "Stripe is a payments platform for online businesses. Through its API and hosted tools, a business can accept cards and other payment methods, run subscriptions and invoices, and send payouts, while refunds, disputes and reports are handled in the Stripe Dashboard. Each business has its own Stripe account, and the money it collects is paid out to that business's bank account.",
    related: { href: '/pricing', label: 'What Stripe payments cost to set up' },
  },
  {
    id: 'stripe-checkout',
    term: 'Stripe Checkout',
    definition:
      "Stripe Checkout is a payment page that Stripe builds, hosts and maintains. The app sends the customer to it, Stripe collects the card or other payment details and handles extra authentication such as 3D Secure, and the customer returns to the app once the payment succeeds. It handles one-time payments and subscriptions, and keeps card details off the app's own servers.",
    related: { href: '/pricing', label: 'What Stripe payments cost to set up' },
  },
  {
    id: 'stripe-connect',
    term: 'Stripe Connect',
    definition:
      "Stripe Connect is Stripe's product for platforms and marketplaces that take payments on behalf of other people. Each seller or provider gets a connected account and goes through Stripe's identity checks. Buyers pay through the platform, the platform can keep a commission on each sale, and Stripe pays each seller's share out to their bank account.",
    related: { href: '/pricing', label: 'What Stripe Connect payouts cost to set up' },
  },
  {
    id: 'supabase',
    term: 'Supabase',
    definition:
      'Supabase is an open-source backend platform built on PostgreSQL. Each project includes a Postgres database with generated APIs, user sign-in, file storage, realtime updates and serverless edge functions. Apps often query it directly from the browser or phone, so access to data is controlled in the database itself with row-level security policies.',
    related: {
      href: '/insights/supabase-vs-firebase-marketplace-backends',
      label: 'Supabase vs Firebase for marketplace backends',
    },
  },
  {
    id: 'technical-due-diligence',
    term: 'Technical due diligence',
    definition:
      "Technical due diligence is the review an investor or buyer makes of a company's software before committing money. It asks who owns the code, how the system is built and hosted, how user data is protected, how much technical debt there is, and whether the product can be maintained and scaled. Its findings can change the valuation or the terms of the deal.",
    related: { href: '/pricing', label: 'The launch-readiness audit and its investor-ready version' },
  },
  {
    id: 'testflight',
    term: 'TestFlight',
    definition:
      "TestFlight is Apple's service for testing iOS apps before they are released. The developer uploads a build to App Store Connect and invites testers by email or a public link, and testers install it through the TestFlight app and send feedback. Builds shared with testers outside the developer's own team go through Apple's beta app review first.",
    related: { href: '/services/1', label: 'Mobile app development, through to store release' },
  },
];

// After GLOSSARY on purpose: the content audit once matched exports by name prefix and parsed this line instead.
export const GLOSSARY_UPDATED = '2026-10-14T00:00:00.000Z';
