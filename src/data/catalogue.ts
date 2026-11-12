/**
 * "What we build": the catalogue of work behind the four services.
 *
 * Ten categories, each with its sub-services, the projects that show it and
 * six questions. The homepage's "What we build" tabs, the full catalogue on
 * /services (with an FAQPage node for its questions) and llms.txt all read
 * this one file, so they cannot disagree.
 *
 * The catalogue is not a set of offers (owner decision, 11 Nov 2026): it
 * carries no prices, has no pages of its own and creates no URLs. A category
 * that matches one of the four services names it in `start_here`, and the
 * service is where a buyer starts.
 *
 * Claims rules, the same as every other sales surface (scripts/content-audit.mjs
 * reads CATALOGUE):
 *  - A project is named with its label from CATALOGUE_PROJECTS, word for word,
 *    so nobody reads employer or client work as DevoraX's. The labels follow
 *    PROJECT_ENGAGEMENT in data/projectIndex.ts and the attribution sentence
 *    of each project's study.
 *  - Where the record limits what Sameem did (the Dooz backend, the Bondly
 *    backend he led, the Loopedin backend he built, Pastel's iOS app as an
 *    employee), the project's `part` says so wherever it is listed.
 *  - A sub-service with no project shows none: never an invented or borrowed
 *    one. A Fiverr review says what the job was in 12 words or fewer.
 *  - Hidden projects (2, 3) are never linked. OpenAI is named only in the
 *    tools list: no project uses it. VoiceDesk's knowledge-base answers are
 *    described as such, not as RAG, until the method is confirmed. Hear With
 *    You's story model and any Firebase push are left out until confirmed.
 *
 * Plain data only, and CATALOGUE is a plain literal, so the audit script can
 * read it without compiling TypeScript and client components can import it.
 */

/** A pointer from a sub-service, a category or a FAQ to the evidence for it. */
export type CatalogueRef =
  /** A project page, /projects/{id}, with an optional note on which part shows the work. */
  | { project: number; note?: string }
  /** A Fiverr review on /reviews: the reviewer's handle and what the job was. */
  | { review: string; job: string }
  /** One of the four service pages, by its slug in data/solutions.ts. */
  | { service: string }
  /** One of our own live sites. */
  | { site: string; label: string }
  /** The Monthly care step of the offer ladder, on /pricing. No price is printed. */
  | { step: 'care' };

export type CatalogueKeyPoint = { heading: string; body: string };

export type CatalogueSubService = {
  /** Fixed by the owner: printed exactly as written. */
  name: string;
  /** One line, 10 to 20 words. */
  line: string;
  /** Empty when there is no project to show yet. */
  refs: CatalogueRef[];
};

export type CatalogueIndustry = {
  /** A slug from data/industries.ts; the link is /projects?industry={slug}. */
  slug: string;
  projects: number[];
};

export type CatalogueCategory = {
  /** The anchor on /services: /services#{id}. */
  id: string;
  /** Fixed by the owner: printed exactly as written. */
  name: string;
  /** 30 to 45 words. */
  description: string;
  /** 3 or 4 sentences, 60 to 90 words. May hold [anchor](/path) links. */
  intro: string;
  key_points: CatalogueKeyPoint[];
  /** The service pages to start from, by slug. */
  start_here: string[];
  sub_services: CatalogueSubService[];
  industries?: CatalogueIndustry[];
  /** Three to six refs for the homepage tab: the category's strongest evidence. */
  featured: CatalogueRef[];
  /** Six questions in the buyer's words; answers of 40 to 90 words. */
  faqs: { q: string; a: string }[];
};

/** When the catalogue's copy last changed. Feeds the /services sitemap entry. */
export const CATALOGUE_UPDATED = '2026-11-11T00:00:00.000Z';

/**
 * Every project the catalogue names: its short name, its label (word for word,
 * owner's list of 11 Nov 2026) and, where the record limits Sameem's part,
 * that part. Ids 2 and 3 are hidden and must never appear here.
 */
export const CATALOGUE_PROJECTS: Record<number, { name: string; label: string; part?: string }> = {
  8: { name: 'Bondly', label: 'As an engineer at Webrange Solutions', part: 'led the backend' },
  10: { name: 'Outstride / Ginger', label: 'As an engineer at Webrange Solutions' },
  11: { name: 'AI Art Stylization Platform', label: 'No public link and no named client' },
  14: { name: 'Food Magnet', label: 'As an engineer at Zencloud' },
  17: { name: 'Koor', label: 'DevoraX client' },
  18: { name: 'CEDMAT', label: 'Sameem worked on this build' },
  19: { name: 'Three28', label: "Sameem's direct client" },
  20: { name: 'Coffee Shop Web App', label: 'As an engineer at Fleact Tech' },
  21: { name: 'Augment Fit', label: 'Sameem worked on this build' },
  22: { name: 'Waitmate', label: 'Sameem worked on this build' },
  23: { name: 'Pastel', label: "Sameem's employer, Pastel", part: "its iOS app, as Pastel's employee since April 2026" },
  24: { name: 'Pathana', label: 'As an engineer at ivector' },
  25: { name: 'Dooz Inspected Cars', label: "Sameem's direct client", part: 'the shared NestJS backend' },
  26: { name: 'Loopedin', label: 'As an engineer at Zencloud', part: 'built the backend' },
  27: { name: 'e-fuldmagt', label: 'As an engineer at Zencloud' },
  28: { name: 'TAL', label: 'As an engineer at Webrange Solutions' },
  29: { name: 'Barfly', label: 'As an engineer at Zencloud' },
  30: { name: 'JUJU', label: "Sameem's direct client" },
  31: { name: 'WOD Pro League', label: 'As an engineer at Zencloud' },
  32: { name: 'Afriva', label: 'As an engineer at Webrange Solutions' },
  33: { name: 'ConstrAction', label: 'DevoraX client, hired through Fiverr' },
  34: { name: 'Hear With You', label: "Sameem's direct client" },
  35: { name: 'AR Lip Filler Preview', label: 'Proof of concept' },
  36: { name: 'SiteWrite', label: 'Demo build' },
  37: { name: 'FirstPass', label: 'Demo build' },
  38: { name: 'iDecorwala', label: "Sameem's direct client" },
  39: { name: 'Pianissimo Online', label: 'DevoraX client, hired through Fiverr' },
  40: { name: 'VoiceDesk', label: 'DevoraX client, hired through Fiverr' },
  41: { name: 'Mint Choc Media', label: 'Client project' },
  42: { name: 'Royal Malt', label: 'Client project' },
  43: { name: 'GentleR', label: 'Client project' },
  44: { name: 'SolNotary', label: 'Client project' },
  45: { name: 'CAD Interior Studio', label: 'Proof of concept, built for a client' },
  46: { name: 'ExpertProfile.AI', label: 'Client project' },
  47: { name: 'SteamBlast Arena', label: 'Client project' },
  48: { name: 'Bevy Irie', label: 'Client project' },
  49: { name: 'Triagely', label: 'DevoraX client' },
  50: { name: 'Tallyfile', label: 'DevoraX client' },
  51: { name: 'Biscuit', label: 'DevoraX client' },
  52: { name: 'LinguaBridge', label: 'Sameem worked on this build' },
  53: { name: 'LearnHub', label: 'Sameem worked on this build' },
};

/** The label a reader sees beside one of our own sites. */
export const OWN_SITE_LABEL = 'Our own live site';

export const CATALOGUE: CatalogueCategory[] = [
  // ── 1 ───────────────────────────────────────────────────────────────────
  {
    id: 'full-stack-web-development',
    name: 'Full-Stack Web Development',
    description:
      'Web applications from the database to the screen: products built around one workflow, tools a business runs on, admin dashboards, React and Next.js front ends and Node.js back ends. Every project below is labelled with who it was built for.',
    intro:
      'A web app is three layers that have to agree: the screens people use, the server that holds the rules and the database that keeps the records. We work across all three, mostly in Next.js, React, Node.js and NestJS, with Supabase or PostgreSQL underneath. Some products below are live sites you can open today and others are demos on sample data, and each one is labelled. If your web app already exists and has stalled, start with the [Vibe Code Audit](/solutions/fix-vibe-coded-app).',
    key_points: [
      {
        heading: 'Roles from one codebase',
        body: 'Admins, staff, sellers and buyers can each get their own screens from one deployment, with every screen reading only the data its role is allowed to see.',
      },
      {
        heading: 'Pages search engines can read',
        body: 'Public pages are rendered on the server, so a crawler or an AI assistant reads real content instead of an empty page waiting for JavaScript to run.',
      },
      {
        heading: 'Live links, labelled demos',
        body: 'Where a product is live, we link the site you can open. Where it is not, its demo runs on sample data and its page says so.',
      },
    ],
    start_here: [],
    sub_services: [
      {
        name: 'Custom web application development',
        line: 'Products built around one specific workflow, from a contract generator to an online piano school.',
        refs: [
          { project: 32 },
          { project: 33 },
          { project: 39 },
          { project: 46 },
          { project: 43 },
        ],
      },
      {
        name: 'Business web applications',
        line: 'Web tools a company runs on every day: legal documents, product catalogues, travel checks and property reports.',
        refs: [
          { project: 27 },
          { project: 38 },
          { project: 29 },
          { project: 48 },
          { project: 36 },
        ],
      },
      {
        name: 'Admin dashboards and management systems',
        line: 'Back-office screens where staff manage users, orders, content and plans without touching the code.',
        refs: [
          { project: 34, note: 'the Next.js admin dashboard' },
          { project: 32, note: 'one dashboard per role' },
          { project: 10, note: 'React admin dashboard' },
          { project: 33, note: 'admin panel' },
          { project: 14, note: 'React web dashboards' },
          { project: 21, note: 'admin panel' },
          { project: 22, note: 'demo deployment' },
        ],
      },
      {
        name: 'Frontend development (React, Next.js)',
        line: 'Interfaces in React and Next.js, from one-page launch sites to dense admin panels and storefronts.',
        refs: [
          { project: 10 },
          { project: 32 },
          { project: 33 },
          { project: 38 },
          { project: 41 },
          { project: 42 },
          { project: 48 },
          { project: 52, note: 'a translation agency marketing site' },
          { project: 28, note: 'React venue search' },
          { project: 20 },
          { review: 'irmairvin', job: 'A Next.js landing page for an appointment app' },
          { review: 'smith3131', job: 'Alignment, spacing and responsiveness fixes to a Figma website design' },
        ],
      },
      {
        name: 'Backend development (Node.js, NestJS, Express)',
        line: 'APIs and server logic in Node.js, NestJS and Express that a website and its apps can share.',
        refs: [
          { project: 25 },
          { project: 26 },
          { project: 34 },
          { project: 40 },
          { project: 8 },
          { project: 19 },
          { project: 17 },
          { project: 30 },
        ],
      },
    ],
    featured: [{ project: 33 }, { project: 34 }, { project: 38 }, { project: 32 }, { project: 39 }],
    faqs: [
      {
        q: 'Can my web app work in two languages?',
        a: 'Yes, and it is easier to plan from the start than to add later. [ConstrAction](/projects/33) (DevoraX client, hired through Fiverr) produces contracts in English or French with next-intl, [Pianissimo Online](/projects/39) (DevoraX client, hired through Fiverr) runs in English and Spanish, and [e-fuldmagt](/projects/27) (As an engineer at Zencloud) has a Danish and English interface. Adding a language afterwards means hunting down every piece of text written straight into the code.',
      },
      {
        q: 'Can my site run on cheap shared hosting?',
        a: "If it has no server logic, yes. [Royal Malt](/projects/42) (Client project) was built with TanStack Start and React 19, then prerendered to plain HTML, because the client's cPanel shared hosting has no Node.js. A site with sign-in, payments or a database needs a server or a platform such as Vercel or Supabase, and we tell you which on the free call.",
      },
      {
        q: 'Will people be able to find my web app on Google?',
        a: 'We can make every public page readable by search engines, but nobody can promise a ranking. [iDecorwala](/projects/38) (Sameem\'s direct client) sends finished HTML from the server, with metadata, a sitemap and a separate page for each product range. Where a site ranks then depends on its content and on who links to it, which no developer controls.',
      },
      {
        q: "Can my team change the website's content without a developer?",
        a: 'Yes, when the content lives in a database or a CMS rather than in the code. [ExpertProfile.AI](/projects/46) (Client project) is run from a no-code CMS: editors manage articles, experts, events and team roles, and a published article appears on the site within seconds. [iDecorwala](/projects/38) (Sameem\'s direct client) keeps its products and articles in Supabase for the same reason.',
      },
      {
        q: 'Should my web app be built with Next.js or plain React?',
        a: 'Next.js if strangers should find its pages in search, plain React if almost everything sits behind a login. Next.js can render each page on the server, so a crawler reads real content. [Mint Choc Media](/projects/41) (Client project) is React with Vite, a single page that needs no server, while [Afriva](/projects/32) (As an engineer at Webrange Solutions) uses Next.js 15 for a public storefront and its dashboards.',
      },
      {
        q: 'Can different kinds of users each get their own dashboard?',
        a: 'Yes, from one app and one database. [Afriva](/projects/32) (As an engineer at Webrange Solutions) has separate dashboards for admins, managers, sellers and buyers, and each one queries only the slice of data its role is entitled to. [Hear With You](/projects/34) (Sameem\'s direct client) pairs its customer app with a Next.js admin dashboard for the people who run the service.',
      },
    ],
  },

  // ── 2 ───────────────────────────────────────────────────────────────────
  {
    id: 'ai-engineering-automation',
    name: 'AI Engineering & Automation',
    description:
      "AI built into products people use: a voice receptionist that answers calls and books, stories read in a listener's own cloned voice, and face tracking in the browser. Each example names the models and services it runs on.",
    intro:
      "The AI work here is product work: the model is one part, and the calls, data, bookings and admin around it are the rest. [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) is the main example, a white-label receptionist on Deepgram, Twilio and Gemini or Claude. [Hear With You](/projects/34) (Sameem's direct client) reads stories in the listener's own voice, cloned with ElevenLabs. Where a project shows only part of a sub-service, its line says which part.",
    key_points: [
      {
        heading: 'Answers from your own content',
        body: "Each VoiceDesk agent answers only from its business's own knowledge base, so a caller hears what that business wrote rather than a model's guess.",
      },
      {
        heading: 'A person can step in',
        body: 'When a call needs a human, VoiceDesk passes it on by warm transfer, so the caller is never left talking to an agent that cannot help.',
      },
      {
        heading: 'Every call kept',
        body: 'A live call feed keeps a transcript and an AI summary of each call, so an owner can see what the agent said and what it booked.',
      },
    ],
    start_here: [],
    sub_services: [
      {
        name: 'AI application development',
        line: 'Products where AI does the core job, built together with the app, backend and admin around it.',
        refs: [
          { project: 40 },
          { project: 34 },
          { project: 35, note: 'in-browser face tracking' },
          { project: 45, note: 'AI style concepts kept apart from the buildable design; the demo shows labelled demo renders' },
          { project: 49, note: "support triage for an online store: categories, priorities, drafts and wholesale lead scores" },
          { project: 50, note: 'invoice PDFs read by AI, every number checked in plain code' },
          { project: 51, note: 'an FAQ chat assistant for a grooming salon' },
        ],
      },
      {
        name: 'AI voice agent development',
        line: 'Voice agents that hold a real-time conversation in the browser or over the phone, and can be interrupted.',
        refs: [{ project: 40 }],
      },
      {
        name: 'AI receptionist and customer support automation',
        line: 'An agent that answers calls, checks availability, books and hands the caller to a person when needed.',
        refs: [
          { project: 40 },
          { project: 49, note: 'a support inbox sorted and drafted for review; nothing is sent automatically' },
          { project: 51, note: "a website chat that answers from the salon's FAQ and passes anything else to its email" },
        ],
      },
      {
        name: 'Conversational AI integration',
        line: "A conversation layer joined to a business's own tools, templates and call records.",
        refs: [{ project: 40 }, { project: 51, note: 'a chat widget dropped into a Wix site with one script tag' }],
      },
      {
        name: 'Answers from your own knowledge base (RAG)',
        line: 'Agents that answer only from the documents and facts a business gives them, not from the open web.',
        refs: [
          { project: 40, note: "answers drawn only from each business's own knowledge base" },
          { project: 51, note: 'the whole FAQ in the prompt rather than retrieval, read from a Supabase table' },
        ],
      },
      {
        name: 'AI-powered storytelling applications',
        line: 'Apps that create personalised stories and read them aloud in a voice the listener knows.',
        refs: [{ project: 34 }],
      },
      {
        name: 'AI voice generation and voice cloning',
        line: "Speech generated inside an app, including a listener's own voice cloned for them to hear.",
        refs: [
          { project: 34, note: "the listener's own voice, cloned with ElevenLabs Professional Voice Cloning" },
          { project: 40, note: 'Deepgram speech-to-text and text-to-speech' },
        ],
      },
      {
        name: 'LLM integration (Claude, Gemini, OpenAI)',
        line: "Language models wired into a product's own logic, with the model chosen for each job.",
        refs: [
          { project: 40, note: 'Gemini through Google AI Studio, and Claude' },
          { project: 49, note: 'Gemini, with a second model when the first is busy' },
          { project: 50, note: 'Gemini returning structured fields that code then checks' },
          { project: 51, note: 'Gemini behind a Vercel function, with a backup model' },
        ],
      },
      {
        name: 'AI workflow and business process automation',
        line: 'The steps after a conversation done for you: bookings confirmed by SMS, leads captured, calls transferred.',
        refs: [
          { project: 40, note: 'booking with SMS confirmation, lead capture, warm transfer' },
          { project: 49, note: 'an exported inbox sorted, drafted and lead-scored in one run' },
          { project: 50, note: 'a folder of invoices turned into one checked CSV' },
        ],
      },
      {
        name: 'AI tool calling and external API integration',
        line: 'Agents that use real tools mid-conversation: availability checks, bookings, lookups and cancellations.',
        refs: [{ project: 40 }],
      },
      {
        name: 'AI image generation',
        line: 'Image models that restyle only the region of a picture a user selects, leaving the rest untouched.',
        refs: [{ project: 11, note: 'SAM picks the region, Stable Diffusion restyles it' }],
      },
    ],
    featured: [{ project: 40 }, { project: 34 }, { project: 35 }, { project: 45 }],
    faqs: [
      {
        q: 'Can an AI receptionist take bookings over the phone?',
        a: 'Yes. [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) answers calls in real time, checks availability, books, sends an SMS confirmation, and can look up or cancel a booking during the same call. Its templates cover hotel stays, restaurant tables, clinic appointments and service visits. Joining it to the booking system you already use is scoped on the free call, because every system exposes different tools.',
      },
      {
        q: 'Will an AI agent make things up when it talks to my customers?',
        a: "It can, so we limit what it may draw on and keep a record you can check. [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) answers only from each business's own knowledge base, hands a caller to a person by warm transfer when needed, and logs every call with a transcript and an AI summary. No model is right every time, so plan to read those summaries.",
      },
      {
        q: 'Which AI model would you use for my product?',
        a: "The one that fits the job, and choosing it is part of scoping. [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) runs its conversations on Gemini, through a Google AI Studio API key, or on Claude, with Deepgram for speech-to-text and text-to-speech. OpenAI's models are in our toolset too, but no project on this site uses them yet, so we show none.",
      },
      {
        q: "Can my app read text aloud in a user's own voice?",
        a: "Yes. [Hear With You](/projects/34) (Sameem's direct client) reads each personalised story in the listener's own voice, cloned with ElevenLabs Professional Voice Cloning. Sameem built its Flutter app, NestJS backend and Next.js admin, and it runs on DigitalOcean. It has been on the App Store since June 2026. For spoken replies without cloning, [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) uses Deepgram's text-to-speech.",
      },
      {
        q: 'Can AI features run in the browser instead of on a server?',
        a: "Some can, which keeps the camera feed on the user's own device. [AR Lip Filler Preview](/projects/35) (Proof of concept) tracks the face with MediaPipe in the phone's browser and reshapes the lips live in WebGL2; its FastAPI and PostgreSQL backend keeps the before-and-after pairs a user saves. Image generation, as in the [AI Art Stylization Platform](/projects/11) (No public link and no named client), still runs on a server.",
      },
      {
        q: 'Can agencies sell an AI receptionist under their own brand?',
        a: 'Yes, that is how [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) works. It is a multi-tenant, white-label platform: each agency runs receptionists for its own clients under its own brand and domain, and each business gets its own agent and knowledge base. A live call feed shows transcripts, AI call summaries and analytics. The public demo runs on sample businesses.',
      },
    ],
  },

  // ── 3 ───────────────────────────────────────────────────────────────────
  {
    id: 'mobile-app-development',
    name: 'Mobile App Development',
    description:
      'Apps for iPhone and Android, mostly in React Native or Flutter, with the backend behind them and the work of getting them into the App Store and Google Play. We prepare and submit the builds; the stores decide approval.',
    intro:
      "Most of the mobile work shown here is cross-platform: one React Native or Flutter codebase for both stores, over a NestJS or Node.js backend. [Hear With You](/projects/34) (Sameem's direct client) and [Three28](/projects/19) (Sameem's direct client) are on the App Store, and [Koor](/projects/17) (DevoraX client) is on Google Play. Sameem has personally prepared and submitted iOS builds to App Review, published Android apps to Google Play, shipped in-app purchase and answered store rejections.",
    key_points: [
      {
        heading: 'One codebase, both stores',
        body: 'React Native and Flutter let one codebase ship to iPhone and Android, so a fix reaches both sets of users in the same release.',
      },
      {
        heading: 'The backend comes with it',
        body: 'Most apps here have their own NestJS or Node.js backend, and the API behind an app usually decides whether people find it reliable.',
      },
      {
        heading: 'Store work is included',
        body: "The store listing, App Privacy details, Google Play's Data safety form and the replies to reviewers belong to a launch, not to a list of extras.",
      },
    ],
    start_here: ['lovable-app-to-app-store'],
    sub_services: [
      {
        name: 'React Native app development',
        line: 'iOS and Android apps from one React Native codebase, usually over a NestJS backend.',
        refs: [
          { project: 19, note: 'on the App Store since July 2024' },
          { project: 17, note: 'on Google Play since October 2025' },
          { project: 18, note: 'on Google Play' },
        ],
      },
      {
        name: 'Flutter app development',
        line: 'Cross-platform apps written in Flutter, with the backend and the admin built to match.',
        refs: [{ project: 34 }],
      },
      {
        name: 'iOS app development',
        line: 'iPhone apps prepared for App Review, from the first TestFlight build to the store listing.',
        refs: [{ project: 34, note: 'on the App Store' }, { project: 23 }, { project: 19 }],
      },
      {
        name: 'Android app development',
        line: 'Android apps published to Google Play, including the testing tracks a new developer account needs.',
        refs: [{ project: 17 }, { project: 18 }],
      },
      {
        name: 'Cross-platform mobile apps',
        line: 'One app for both stores, so features and fixes reach every user together.',
        refs: [{ project: 34 }, { project: 19 }, { project: 17 }, { project: 18 }],
      },
      {
        name: 'Mobile app backends and integration',
        line: 'The APIs, notifications and data an app needs, often shared with a website and an admin.',
        refs: [
          { project: 34 },
          { project: 25, note: 'one backend for web, iOS and Android' },
          { project: 8 },
          { project: 19 },
          { project: 17 },
          { project: 26 },
          { project: 30 },
          { review: 'cedric_coleman', job: 'OneSignal push, in-app and email notifications on iOS and Android' },
        ],
      },
      {
        name: 'Work on existing mobile apps',
        line: 'Changes to a live app someone else started, made without breaking it for the people using it.',
        refs: [
          { project: 23, note: 'a live iOS app that launched before Sameem joined' },
          { project: 14, note: 'an existing product' },
          { review: 'robertfelt0n', job: 'UI fixes in a mobile app' },
        ],
      },
      {
        name: 'Store submission and launch',
        line: 'Builds, listings, privacy forms, submission and the replies to App Review and Google Play review.',
        refs: [{ project: 34, note: 'on the App Store since June 2026' }, { service: 'lovable-app-to-app-store' }],
      },
    ],
    featured: [{ project: 34 }, { project: 19 }, { project: 17 }, { project: 18 }, { project: 23 }],
    faqs: [
      {
        q: 'Should my app be built in React Native or Flutter?',
        a: "Either ships one codebase to both stores, so the choice usually follows the code and skills you already have. [Three28](/projects/19) (Sameem's direct client) and [Koor](/projects/17) (DevoraX client) are React Native, and [Hear With You](/projects/34) (Sameem's direct client) is Flutter. If your web app is written in React, React Native lets more of that knowledge carry across to the phone.",
      },
      {
        q: 'Can you add in-app purchase to my app?',
        a: 'Yes. Sameem has shipped in-app purchase with StoreKit, Play Billing or RevenueCat. Whether you need it depends on what the app sells: digital features unlocked inside the app usually have to use it, while physical goods and services used outside the app must not. [Lovable App to the App Store](/solutions/lovable-app-to-app-store#in-app-purchase) sets out both stores\' rules as of November 2026.',
      },
      {
        q: 'Should I publish my app as a company or as an individual?',
        a: 'Either works, and each route has its own wait. Publishing as a company needs a D-U-N-S Number first. A personal Google Play account created after 13 November 2023 has to run a closed test with 12 testers, for at least 14 days, before Google grants production access. We look at which route suits your business on the free call, before any build is made.',
      },
      {
        q: 'Can my app and my website share one backend?',
        a: "Yes, and it keeps prices, stock and rules the same everywhere. [Dooz Inspected Cars](/projects/25) (Sameem's direct client) serves an Angular website and iOS and Android apps from one NestJS backend, which is the part Dooz hired Sameem to work on. Its Google Play listing shows 100K+ downloads. One backend also means a changed rule ships once rather than three times.",
      },
      {
        q: 'Can you fix the screens in my existing mobile app?',
        a: 'Yes. A Fiverr client, [robertfelt0n](/reviews), hired Sameem to fix the UI issues in a mobile app and said it came out "very professional and clean". Larger changes start with reading the code, because on a live app every change reaches users as a new store build, and a careless one reaches all of them.',
      },
      {
        q: "Can my app use the phone's location, camera and notifications?",
        a: "Yes, with a stated reason for each. [Koor](/projects/17) (DevoraX client) uses location to detect the delivery address and track orders, the camera and storage so chefs can upload photos of their dishes, and notifications to report each stage of an order. The App Store's privacy details and Google Play's Data safety form, both part of a launch, declare every one of them.",
      },
    ],
  },

  // ── 4 ───────────────────────────────────────────────────────────────────
  {
    id: 'saas-mvp-development',
    name: 'SaaS & MVP Development',
    description:
      'Subscription software and first versions built to test an idea with real users: sign-up, plans and billing, the core feature and an admin. Several examples are demo builds on sample data, and they are labelled as demos.',
    intro:
      'A first version should do one job well enough that people will use it or pay for it. We build that job first, with sign-in, Stripe billing and an admin around it. [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) and [ConstrAction](/projects/33) (DevoraX client, hired through Fiverr) are the closest examples, and [FirstPass](/projects/37) (Demo build) lets you try a Stripe upgrade in test mode. A new build gets a written fixed-price proposal before any code is written.',
    key_points: [
      {
        heading: 'Billing in version one',
        body: 'Plans and checkout go into the first version, so the product can charge its customers on launch day rather than in a later phase.',
      },
      {
        heading: 'Demos you can open',
        body: 'FirstPass, SiteWrite and VoiceDesk have demos on sample data with recorded walkthroughs, so you can judge how we build before you book a call.',
      },
      {
        heading: 'Scope written first',
        body: 'The proposal lists what the first version includes and what it leaves out, so each new idea during the build becomes a decision, not a surprise.',
      },
    ],
    start_here: [],
    sub_services: [
      {
        name: 'SaaS application development',
        line: 'Subscription software that many customers sign up to, each one seeing only their own data.',
        refs: [{ project: 40, note: 'white-label' }, { project: 33 }, { project: 46 }],
      },
      {
        name: 'MVP planning and development',
        line: 'A first version cut down to the one job its users must be able to finish.',
        refs: [{ project: 40 }, { project: 33 }, { project: 34 }, { project: 37 }, { project: 36 }],
      },
      {
        name: 'Technical feasibility and proofs of concept',
        line: 'A working prototype that shows whether the risky part of an idea can be built at all.',
        refs: [{ project: 35 }, { project: 45 }],
      },
      {
        name: 'Subscription billing',
        line: 'Stripe plans, upgrades and access that follows what each customer has paid for.',
        refs: [
          { project: 8, note: 'Stripe subscriptions with service credits' },
          { project: 33, note: 'per contract or an unlimited monthly plan' },
          { project: 37, note: 'four plans, Stripe in test mode' },
          { project: 30 },
          { project: 14 },
          { project: 53, note: 'three tiers that gate courses and files' },
        ],
      },
    ],
    featured: [{ project: 40 }, { project: 33 }, { project: 37 }, { project: 36 }, { project: 35 }],
    faqs: [
      {
        q: 'What should go into the first version of my product?',
        a: 'The one job a user must be able to finish, plus what it takes to sign in and pay. [ConstrAction](/projects/33) (DevoraX client, hired through Fiverr) centres on one flow: a contractor answers guided questions and gets a ready-to-sign contract in English or French, paid per contract or on an unlimited monthly plan. Anything that does not serve that flow can wait for version two.',
      },
      {
        q: 'Can I see something like my product working before I commit?',
        a: 'Often, yes. Several builds here have demos on sample data with recorded walkthroughs: [FirstPass](/projects/37) (Demo build) for subscription plans, [SiteWrite](/projects/36) (Demo build) for an offline survey app, and [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) for an AI receptionist, including a real voice call. None of them is your product, but each shows how we build.',
      },
      {
        q: 'Should I build a proof of concept before the full product?',
        a: "Yes, when the risky part is whether the idea can be built at all. [AR Lip Filler Preview](/projects/35) (Proof of concept) tested live lip reshaping in a phone browser, and [CAD Interior Studio](/projects/45) (Proof of concept, built for a client) tested turning an architect's IFC file into a 3D home that customers furnish. Neither is a live product: each answered one question first.",
      },
      {
        q: 'Can I charge different prices for different plans?',
        a: 'Yes, through Stripe. [FirstPass](/projects/37) (Demo build) bills Free, Basic, Pro and School plans, and you can try its upgrade path in Stripe test mode. [ConstrAction](/projects/33) (DevoraX client, hired through Fiverr) charges either per contract or for an unlimited monthly plan, and a contractor without a plan meets checkout at a paywall enforced on the server.',
      },
      {
        q: 'Can my product start as a web app and become a mobile app later?',
        a: "Yes. A web app can go into the stores inside a native shell, or be rebuilt in React Native if a shell will not carry it, and keeping the rules in an API from day one makes either step easier. [Hear With You](/projects/34) (Sameem's direct client) shows where that leads: a Flutter app, a Next.js admin and a landing page, all reading one NestJS backend.",
      },
      {
        q: 'Does my MVP need an admin panel?',
        a: 'Usually, because someone has to manage users, content and plans without editing the database by hand. [Augment Fit](/projects/21) (Sameem worked on this build) is an admin panel for a trainer platform, with growth tracking and a workout-plan builder. [Waitmate](/projects/22) (Sameem worked on this build) does the same job for restaurants, with reservations, tables and staff, in a demo deployment.',
      },
    ],
  },

  // ── 5 ───────────────────────────────────────────────────────────────────
  {
    id: 'marketplace-ecommerce-development',
    name: 'Marketplace & E-commerce Development',
    description:
      'Marketplaces where many sellers meet many buyers, and shops that sell for one business: storefronts, vendor portals, orders, stock and payments. Already on Sharetribe, or planning a new marketplace? The two services linked here are where to start.',
    intro:
      "A marketplace is several products sharing one database: what buyers browse, what sellers manage and what you oversee. The work behind this group includes [Afriva](/projects/32) (As an engineer at Webrange Solutions), a four-role marketplace with real-time order tracking, and [Koor](/projects/17) (DevoraX client), which connects customers with home chefs. [Dooz Inspected Cars](/projects/25) (Sameem's direct client) appears for its shared NestJS backend, and [Pastel](/projects/23) (Sameem's employer, Pastel) only for Sameem's work on its iOS app.",
    key_points: [
      {
        heading: 'Sellers run their own shop',
        body: 'A vendor portal lets each seller manage listings, prices, stock and orders without asking you, as the seller dashboard on Afriva does.',
      },
      {
        heading: 'Money in your own account',
        body: 'Stripe runs in an account your business owns, so the payments and their records stay with you, whoever maintains the code later.',
      },
      {
        heading: 'One basket, several sellers',
        body: 'A basket that spans several vendors becomes one purchase with a separate order for each vendor, shown back to the buyer on a single screen.',
      },
    ],
    start_here: ['sharetribe-developers', 'multi-vendor-marketplace-development'],
    sub_services: [
      {
        name: 'Multi-vendor marketplace development',
        line: 'Platforms where many independent sellers list and sell to many buyers through one site or app.',
        refs: [{ project: 23 }, { project: 32 }, { project: 25 }, { project: 17 }, { project: 8 }],
      },
      {
        name: 'E-commerce development',
        line: 'Online shops and ordering for a single business, from the product catalogue to the checkout.',
        refs: [
          { project: 10 },
          { project: 32 },
          { project: 20, note: 'online ordering' },
          { review: 'cedric_coleman', job: 'A website with an order system' },
        ],
      },
      {
        name: 'Automotive marketplace development',
        line: 'Car listings with inspection reports, financing and insurance inside the buying flow.',
        refs: [{ project: 25 }],
      },
      {
        name: 'Buyer and seller portals',
        line: 'Separate signed-in areas for the people who buy and the people who sell, over the same records.',
        refs: [
          { project: 32 },
          { project: 25, note: 'the backend behind listings' },
          { project: 23 },
          { project: 17, note: 'customers and home chefs' },
        ],
      },
      {
        name: 'Vendor management systems',
        line: 'Tools for sellers to manage inventory, pricing, menus and orders without needing your help.',
        refs: [{ project: 32, note: 'a seller dashboard for inventory, pricing and orders' }, { project: 14 }],
      },
      {
        name: 'Marketplace payments',
        line: 'Checkout, cards and wallet payments for platforms where money moves between several parties.',
        refs: [{ project: 8 }, { project: 14, note: 'Apple Pay and Google Pay' }],
      },
      {
        name: 'Subscription-based platforms',
        line: 'Platforms people pay for every month, with access that follows the plan they hold.',
        refs: [{ project: 8 }, { project: 33 }, { project: 30 }, { project: 53, note: 'tiered course access' }],
      },
      {
        name: 'Inventory and order management',
        line: 'Stock levels, order status and order history that buyers, sellers and staff all see the same way.',
        refs: [
          { project: 10, note: 'product, inventory and live order data' },
          { project: 32 },
          { project: 17, note: 'real-time orders' },
        ],
      },
      {
        name: 'Payment gateway integration',
        line: 'Stripe and other payment providers joined to checkout, plans, registrations and paid content.',
        refs: [
          { project: 33 },
          { project: 8 },
          { project: 37 },
          { project: 31, note: 'Stripe registrations' },
          { project: 19, note: 'creators sell videos at prices they set' },
          { project: 44, note: 'payments in SOL, USDC or USDT' },
          { review: 'matthew4l2', job: 'Stripe and a user dashboard in a Next.js 15 app' },
        ],
      },
    ],
    featured: [{ project: 32 }, { project: 17 }, { project: 25 }, { project: 23 }, { project: 10 }],
    faqs: [
      {
        q: 'Can sellers on my marketplace manage their own stock and orders?',
        a: 'Yes, through a vendor portal of their own. On [Afriva](/projects/32) (As an engineer at Webrange Solutions), Sameem worked on the seller dashboard for inventory, pricing and order status. On [Koor](/projects/17) (DevoraX client), home chefs set their own prices, promotions and availability and manage orders as they arrive. You keep oversight from an admin console that reads the same records.',
      },
      {
        q: 'Can customers pay with Apple Pay and Google Pay?',
        a: 'Yes. On [Food Magnet](/projects/14) (As an engineer at Zencloud), an existing product, Sameem\'s work included Apple Pay and Google Pay payments alongside subscription management and serverless APIs on AWS Lambda. Wallet payments sit on top of a payment provider such as Stripe, so the provider account is set up first and the wallet buttons come after it.',
      },
      {
        q: 'Can buyers search a large catalogue quickly?',
        a: 'Yes, with a search engine built for it rather than a plain database filter. [Koor](/projects/17) (DevoraX client) uses Elasticsearch to search across chefs and dishes, and [CEDMAT](/projects/18) (Sameem worked on this build) uses it to find installation guides and technical documents. Search like this pays for itself once a catalogue outgrows a short list.',
      },
      {
        q: 'Can I accept payments in crypto?',
        a: 'Yes, for exact payments in SOL, USDC or USDT. [SolNotary](/projects/44) (Client project) publishes a sealed text only after a payment of the exact amount, carrying a reference memo, arrives on Solana. Its demo runs on Solana devnet, where every transaction is real but uses test SOL with no value. Most marketplaces still start with card payments through Stripe.',
      },
      {
        q: 'Can a small business take orders online without a full marketplace?',
        a: 'Yes, and a shop for one business is far simpler than a marketplace. [Coffee Shop Web App](/projects/20) (As an engineer at Fleact Tech) is a café site with an interactive menu, store locations and online ordering. A Fiverr client, [cedric_coleman](/reviews), hired Sameem for a website with an order system and described the ordering as "smooth".',
      },
      {
        q: 'Can a marketplace handle items that sell only once?',
        a: "Yes, but each item then needs its own record, and a sold item has to leave every screen at once. [Dooz Inspected Cars](/projects/25) (Sameem's direct client) lists used cars where every listing is a unique car with its own inspection report, and availability is settled in the shared NestJS backend Sameem worked on, so the website and both apps agree.",
      },
    ],
  },

  // ── 6 ───────────────────────────────────────────────────────────────────
  {
    id: 'backend-api-development',
    name: 'Backend Engineering & API Development',
    description:
      "The server side most users never see: APIs, databases, sign-in, live updates and the outside services an app depends on. Much of Sameem's portfolio is backend work, including Dooz's shared NestJS API and Loopedin's video and messaging backend.",
    intro:
      "A backend holds the rules every client has to obey, so a price, a permission or a booking means the same thing on the web and in the app. We build backends in Node.js, NestJS and Express, over PostgreSQL, Supabase, MongoDB or Firebase, with Socket.IO where updates must arrive live. [Loopedin](/projects/26) (As an engineer at Zencloud) and [Dooz Inspected Cars](/projects/25) (Sameem's direct client) are backend work through and through.",
    key_points: [
      {
        heading: 'Rules checked on the server',
        body: 'Prices, permissions and access are decided on the server for every request, because anything decided only inside the app can be bypassed.',
      },
      {
        heading: 'Live where it matters',
        body: 'Scores, chats, matches and order status use Socket.IO or Supabase Realtime, so people see a change as it happens instead of after a refresh.',
      },
      {
        heading: "Each user's data kept apart",
        body: 'Row-level security and role-based access let the database itself refuse any request for records that belong to another user of the app.',
      },
    ],
    start_here: [],
    sub_services: [
      {
        name: 'Custom REST API development',
        line: 'APIs that websites, mobile apps and admin tools all call to get the same answers.',
        refs: [{ project: 25 }, { project: 40 }, { project: 34 }, { project: 27 }, { project: 30 }, { project: 8 }],
      },
      {
        name: 'NestJS backend development',
        line: 'Structured NestJS services for apps that will grow well past a handful of endpoints.',
        refs: [{ project: 34 }, { project: 25 }, { project: 19 }, { project: 17 }, { project: 18 }],
      },
      {
        name: 'Node.js and Express backend development',
        line: 'Lean Node.js and Express services for media, messaging, risk checks, games and registrations.',
        refs: [
          { project: 40 },
          { project: 26 },
          { project: 29 },
          { project: 27 },
          { project: 47 },
          { project: 31 },
          { project: 30 },
        ],
      },
      {
        name: 'Database architecture and management',
        line: 'Schemas and access rules designed so the data stays correct as the product and its users grow.',
        refs: [{ project: 33 }, { project: 34, note: 'PostgreSQL' }, { project: 32 }, { project: 43 }, { project: 44 }],
      },
      {
        name: 'PostgreSQL and Supabase development',
        line: 'Postgres databases, often through Supabase, with sign-in, file storage and row-level security.',
        refs: [
          { project: 53, note: 'row-level security on every table' },
          { project: 33 },
          { project: 32 },
          { project: 34, note: 'PostgreSQL' },
          { project: 40 },
          { project: 39 },
          { project: 37 },
          { project: 43 },
          { project: 46 },
          { project: 44 },
          { project: 47 },
        ],
      },
      {
        name: 'MongoDB and Firebase development',
        line: 'Document databases and Firebase services for records that vary in shape and data that updates live.',
        refs: [{ project: 8 }, { project: 10 }, { project: 17 }, { project: 14 }, { project: 20 }],
      },
      {
        name: 'Real-time application development',
        line: 'Features that change on every screen at once: scores, chats, orders, calls and game moves.',
        refs: [
          { project: 40 },
          { project: 26 },
          { project: 31, note: 'live leaderboards' },
          { project: 47, note: 'server-run matches' },
          { project: 39 },
          { project: 17 },
          { project: 32, note: 'real-time order tracking' },
        ],
      },
      {
        name: 'WebSocket and Socket.IO integration',
        line: 'Long-lived connections that carry voice, messages and game moves between devices and the server.',
        refs: [{ project: 40 }, { project: 26 }, { project: 31 }, { project: 47 }],
      },
      {
        name: 'Authentication and authorization systems',
        line: 'Sign-in and permissions, from ordinary accounts to national digital ID and crypto wallet signatures.',
        refs: [
          { project: 53, note: 'plan tiers and admin roles' },
          { project: 32, note: 'role-based access' },
          { project: 27, note: 'MitID sign-in through Criipto' },
          { project: 44, note: 'wallet-signature sign-in' },
          { project: 30, note: 'role-based access control' },
          { project: 43, note: 'row-level security' },
          { project: 46 },
        ],
      },
      {
        name: 'Third-party API integration',
        line: 'Payment, maps, flight, identity, telephony and voice services joined to your own app.',
        refs: [
          { project: 8, note: 'Stripe and OneSignal' },
          { project: 29, note: 'Duffel' },
          { project: 40, note: 'Twilio, Deepgram and Google AI Studio' },
          { project: 34, note: 'ElevenLabs' },
          { project: 27, note: 'Criipto' },
          { project: 28, note: 'Google Maps' },
          { review: 'cedric_coleman', job: 'OneSignal notifications on iOS and Android' },
          { review: 'matthew4l2', job: 'Stripe payments in a Next.js 15 app' },
        ],
      },
    ],
    featured: [{ project: 25 }, { project: 26 }, { project: 40 }, { project: 34 }, { project: 31 }],
    faqs: [
      {
        q: 'Should my backend use NestJS or plain Express?',
        a: "NestJS for a backend that will keep growing, Express for a small, focused service. NestJS gives every module a set place, which helps when several apps share one API, as on [Dooz Inspected Cars](/projects/25) (Sameem's direct client) and [Hear With You](/projects/34) (Sameem's direct client). [e-fuldmagt](/projects/27) (As an engineer at Zencloud) keeps its access rules in an Express API, a thin layer that suits a service built around a few decisions.",
      },
      {
        q: 'Should my app use PostgreSQL or MongoDB?',
        a: 'PostgreSQL when your records relate to each other, MongoDB when each record varies in shape. [Afriva](/projects/32) (As an engineer at Webrange Solutions) uses Postgres through Supabase, because vendors own products, products appear in orders and constraints keep that true. [TAL](/projects/28) (As an engineer at Webrange Solutions) stores venues in MongoDB, whose geospatial indexes find the nearest ones to a worker.',
      },
      {
        q: 'Can my app show changes live without users refreshing the page?',
        a: 'Yes. [SteamBlast Arena](/projects/47) (Client project) runs every match on the server over Socket.IO, ten times a second, and tells each player what happened, and [Pianissimo Online](/projects/39) (DevoraX client, hired through Fiverr) uses Supabase Realtime for its notifications and community. Live features need long-running connections, so they are planned into the hosting rather than added at the end.',
      },
      {
        q: "How do you stop one customer from seeing another customer's data?",
        a: 'We enforce it in the database, not only in the interface. [GentleR](/projects/43) (Client project) uses row-level security in Postgres, so a journal entry can only be read by the person who wrote it, whatever request is sent. [ExpertProfile.AI](/projects/46) (Client project) uses the same approach for its editors. A hidden button on its own stops nobody.',
      },
      {
        q: 'Can users sign in with a national ID or a crypto wallet?',
        a: "Yes, both have been built. [e-fuldmagt](/projects/27) (As an engineer at Zencloud) verifies people with Denmark's MitID through Criipto, using OpenID Connect, before they create a power of attorney. [SolNotary](/projects/44) (Client project) signs users in with a Solana wallet signature instead of a password. Others, such as [GentleR](/projects/43) (Client project), use Supabase Auth.",
      },
      {
        q: "Can you connect my app to another company's API?",
        a: "Yes, it is a large share of backend work. Sameem has joined products to Duffel's flight data on [Barfly](/projects/29) (As an engineer at Zencloud), Google Maps on [TAL](/projects/28) (As an engineer at Webrange Solutions), Twilio and Deepgram on [VoiceDesk](/projects/40) (DevoraX client, hired through Fiverr) and ElevenLabs on [Hear With You](/projects/34) (Sameem's direct client). Each service has its own limits and failure modes, which we read before quoting.",
      },
    ],
  },

  // ── 7 ───────────────────────────────────────────────────────────────────
  {
    id: 'cloud-devops-engineering',
    name: 'Cloud & DevOps Engineering',
    description:
      'Getting an app online and keeping it there: hosting on AWS, DigitalOcean or Vercel, Docker, deployment pipelines, media processing and server setup. Ongoing fixes and releases after launch run through the Monthly care step.',
    intro:
      "Code that works on a laptop still has to run somewhere, update safely and stay up. [Hear With You](/projects/34) (Sameem's direct client) runs on DigitalOcean with Docker and its own deployment pipeline, and [Loopedin](/projects/26) (As an engineer at Zencloud) turns video uploads into adaptive streams with AWS MediaConvert. Our own sites, sameemamjad.com and thedevorax.tech, are live, and we look after both ourselves.",
    key_points: [
      {
        heading: 'Repeatable releases',
        body: 'A deployment pipeline ships every release the same way, so going live is a routine step rather than an evening of manual commands.',
      },
      {
        heading: 'Same build everywhere',
        body: "Docker packages an app with what it needs to run, so it behaves on the server the way it did on the developer's machine.",
      },
      {
        heading: 'Slow jobs in the background',
        body: 'Video transcoding and other heavy jobs run in queues or serverless pipelines, so uploads finish fast and the app keeps responding.',
      },
    ],
    start_here: [],
    sub_services: [
      {
        name: 'AWS cloud integration',
        line: "Storage, servers, serverless functions and media services on AWS, sized to the app's real load.",
        refs: [
          { project: 26, note: 'MediaConvert' },
          { project: 8 },
          { project: 30, note: 'S3 and EC2' },
          { project: 31, note: 'Lambda and S3' },
          { project: 27, note: 'S3' },
          { project: 19 },
          { project: 17 },
          { project: 18 },
          { project: 14, note: 'Lambda' },
          { review: 'monica_lisa', job: 'A React app on AWS EC2 with Nginx and SSL' },
        ],
      },
      {
        name: 'DigitalOcean deployment and infrastructure',
        line: 'Apps and their databases hosted on DigitalOcean, with a deployment set up for every release.',
        refs: [{ project: 34 }],
      },
      {
        name: 'Docker containerization',
        line: 'Apps packaged in containers so every environment runs exactly the same build.',
        refs: [{ project: 34 }, { project: 31 }, { project: 8 }, { project: 28 }],
      },
      {
        name: 'CI/CD pipeline development',
        line: 'Pipelines that build and deploy each change the same way, without manual steps in between.',
        refs: [{ project: 34, note: 'its deployment pipeline' }],
      },
      {
        name: 'Production deployment and hosting',
        line: 'Apps and sites put live on the host that suits them, from Vercel to shared hosting.',
        refs: [
          { site: 'https://sameemamjad.com', label: 'sameemamjad.com' },
          { site: 'https://thedevorax.tech', label: 'thedevorax.tech' },
          { project: 33, note: 'live at constraction.ca' },
          { project: 34, note: 'on DigitalOcean' },
          { project: 42, note: 'prerendered to run on shared hosting' },
          { review: 'monica_lisa', job: 'A React app deployed to AWS EC2 on a custom domain' },
        ],
      },
      {
        name: 'Cloud-based media processing',
        line: 'Uploads turned into streams and smaller files in the background, ready for playback on phones.',
        refs: [
          { project: 26, note: 'adaptive HLS streams' },
          { project: 30, note: 'FFmpeg transcoding and job queues' },
        ],
      },
      {
        name: 'Server configuration and optimization',
        line: 'Web servers, SSL certificates and custom domains configured on a server you own.',
        refs: [{ review: 'monica_lisa', job: 'Nginx, SSL and a custom domain' }],
      },
      {
        name: 'Application monitoring and maintenance',
        line: 'Watching a live app for errors and keeping it updated once it has launched.',
        refs: [{ project: 34 }, { project: 31 }, { project: 8 }, { project: 28 }, { step: 'care' }],
      },
    ],
    featured: [{ project: 34 }, { project: 26 }, { project: 30 }, { project: 31 }],
    faqs: [
      {
        q: 'Should my app run on AWS, DigitalOcean or Vercel?',
        a: "It depends on what the app has to run. A Next.js site with no long-running jobs suits Vercel. [Hear With You](/projects/34) (Sameem's direct client) runs its NestJS backend and PostgreSQL on DigitalOcean with Docker, and [WOD Pro League](/projects/31) (As an engineer at Zencloud) uses AWS Lambda for bursts of work beside a long-running service for its live leaderboards. We recommend one on the free call.",
      },
      {
        q: 'Can you put my app on my own AWS server with a domain and SSL?',
        a: 'Yes. A Fiverr client, [monica_lisa](/reviews), hired Sameem to deploy a React app on AWS EC2, connect it to the client\'s domain and set up Nginx and SSL, and wrote that everything was "configured perfectly". The server stays in your own AWS account, and we hand over notes on what was set up so another developer can follow it.',
      },
      {
        q: 'How do you handle large video uploads?',
        a: "Away from the main request, so the upload finishes quickly and the processing happens in the background. On [Loopedin](/projects/26) (As an engineer at Zencloud), uploads go to an AWS MediaConvert pipeline that produces adaptive HLS streams for phones. On [JUJU](/projects/30) (Sameem's direct client), FFmpeg jobs run in BullMQ queues on AWS, and paid media plays through signed links.",
      },
      {
        q: 'Does my app need Docker?',
        a: "Not always, but it helps once a backend has several parts or runs on more than one server. Docker packages the app with everything it needs, so it runs the same in every environment. Sameem's Docker and monitoring work includes [Hear With You](/projects/34) (Sameem's direct client), [WOD Pro League](/projects/31) (As an engineer at Zencloud), [Bondly](/projects/8) (As an engineer at Webrange Solutions) and [TAL](/projects/28) (As an engineer at Webrange Solutions).",
      },
      {
        q: 'Can you set up automatic deployments for my app?',
        a: "Yes. [Hear With You](/projects/34) (Sameem's direct client) ships through a deployment pipeline Sameem built with its cloud infrastructure, so every release follows the same steps. Manual deployments are where small mistakes creep in, such as a missed setting or an old file, so we automate them wherever the hosting allows it.",
      },
      {
        q: "Can my app's images and videos load quickly for users far away?",
        a: 'Yes, by serving them from a content delivery network close to each user. [Koor](/projects/17) (DevoraX client) keeps its food photos in AWS S3 and delivers them through CloudFront, so pictures load without slowing the app. Video needs adaptive streaming as well, which lowers the quality on a weak connection instead of stopping the playback.',
      },
    ],
  },

  // ── 8 ───────────────────────────────────────────────────────────────────
  {
    id: 'software-architecture-consulting',
    name: 'Software Architecture & Consulting',
    description:
      'The decisions that are expensive to change later: how an app is split, where its rules live and how it joins other systems. For code that already exists, the written review is the Vibe Code Audit.',
    intro:
      "Architecture is deciding where each rule, record and job belongs before code depends on it. [Hear With You](/projects/34) (Sameem's direct client) needed an app, a backend, an admin and hosting to work as one product, and [Dooz Inspected Cars](/projects/25) (Sameem's direct client) serves three apps from one NestJS backend. The Vibe Code Audit is an engineering review of existing code, not a security certification. Two sub-services below have no project to show yet, and they say so.",
    key_points: [
      {
        heading: 'Decide before you build',
        body: 'Roles, money flows and who owns which data are settled in writing first, because the database schema is the costliest thing to change later.',
      },
      {
        heading: 'One set of rules',
        body: 'Business rules live in one API, so a website and two apps cannot disagree about a price, a permission or whether an item is still for sale.',
      },
      {
        heading: 'Gaps stated plainly',
        body: "Where we have no project to show, such as database optimisation or documentation, this group says so instead of borrowing someone else's work.",
      },
    ],
    start_here: ['fix-vibe-coded-app'],
    sub_services: [
      {
        name: 'Software architecture and system design',
        line: 'How the app, backend, admin and hosting fit together, decided before the code depends on it.',
        refs: [
          { project: 34, note: 'app, backend, admin and infrastructure' },
          { project: 40 },
          { project: 25, note: 'one backend for three apps' },
          { project: 26, note: 'the video pipeline' },
        ],
      },
      {
        name: 'Restructuring existing code',
        line: 'Untangling a working codebase so that one change stops breaking unrelated parts of it.',
        refs: [{ review: 'irmairvin', job: 'Optimising and restructuring a Next.js app' }],
      },
      {
        name: 'Codebase auditing',
        line: 'A written keep, harden or rebuild verdict for each part of an existing app. No sample report is published yet.',
        refs: [{ service: 'fix-vibe-coded-app' }],
      },
      {
        name: 'Database optimization',
        line: 'Faster queries and cleaner schemas for a database that has slowed down as it grew.',
        refs: [],
      },
      {
        name: 'Technical and API documentation',
        line: 'Written guides to a system and its API, for the next developer who has to work on it.',
        refs: [],
      },
      {
        name: 'System integration and migration',
        line: 'New capabilities joined to systems that are already running, on their terms rather than ours.',
        refs: [
          { project: 27, note: 'MitID sign-in' },
          { project: 29, note: 'a risk check built into got2.travel' },
        ],
      },
    ],
    featured: [{ project: 34 }, { project: 25 }, { project: 40 }, { project: 26 }],
    faqs: [
      {
        q: 'Can I read a sample audit report before paying for one?',
        a: "Not yet: we haven't published a sample audit report. The [Vibe Code Audit](/solutions/fix-vibe-coded-app#sample-report) page describes the report's structure instead: the scope and code version, a one-page summary with a keep, harden or rebuild verdict for each part, findings with severity labels and how to fix them, and the estimate. Ask about anything in it on the free call.",
      },
      {
        q: 'Should my app be split into microservices?',
        a: "Rarely at first. One well-structured backend is easier to run, and [Dooz Inspected Cars](/projects/25) (Sameem's direct client) serves a website and two apps from a single NestJS backend. Splitting pays off when one part carries very different load, as video does: [Loopedin](/projects/26) (As an engineer at Zencloud) runs its video pipeline apart from messaging, so each can scale on its own.",
      },
      {
        q: 'Can you tidy up a messy codebase without starting again?',
        a: 'Usually, yes. A Fiverr client, [irmairvin](/reviews), hired Sameem to optimise and restructure a Next.js app and wrote that the codebase became "clean, scalable, and production-ready". Restructuring keeps what works and changes how it is organised, which is why it starts with reading the code rather than rewriting it from the top.',
      },
      {
        q: 'Will you document my system so another developer can take over?',
        a: 'Yes, documentation is part of the handover, so your own team can carry on without us. We have no standalone documentation project to show yet. The closest thing to judge is the structure of the written audit report, set out on the [Vibe Code Audit](/solutions/fix-vibe-coded-app#sample-report) page.',
      },
      {
        q: 'Can you build a feature into a system another company already runs?',
        a: 'Yes. [Barfly](/projects/29) (As an engineer at Zencloud) is a flight-transfer risk check that runs inside got2.travel, a live trip-planning site, where it shows a risk level, a reason and a predicted delay for each layover. [e-fuldmagt](/projects/27) (As an engineer at Zencloud) relies on Criipto to run MitID checks for it. Work like this starts from the other system\'s rules, not ours.',
      },
      {
        q: 'Can you make my database faster?',
        a: 'We can look into it, but we have no database optimisation project to show yet, so we will not claim a track record. If your app has slowed down, the audit reads the code and the database it runs on, and the report says which parts to keep, harden or rebuild before any fix is priced. You decide from there.',
      },
    ],
  },

  // ── 9 ───────────────────────────────────────────────────────────────────
  {
    id: 'finishing-modernizing-existing-apps',
    name: 'Finishing & Modernizing Existing Apps',
    description:
      'Apps that already exist and have stalled, whether an AI builder, a freelancer or an earlier team wrote them: fixes, new features, speed, integrations and deployment, through to launch. This is the core of what DevoraX does.',
    intro:
      'Most founders who call us have an app that almost works. The Vibe Code Audit reads it first and gives each part a keep, harden or rebuild verdict, and finish sprints then fix what it found. No finished AI-built app is shown here yet: the Fiverr reviews below are for work on existing apps, none of them described as AI-built, and each says what the job was. If the last step is the App Store or Google Play, see Lovable App to the App Store.',
    key_points: [
      {
        heading: 'Read before we quote',
        body: 'We read the code before pricing a fix, because an estimate for an app nobody has opened is only a guess with a number on it.',
      },
      {
        heading: 'Keep what works',
        body: 'Verdicts are given part by part, so sound code stays as it is and only the broken pieces are hardened or rebuilt.',
      },
      {
        heading: 'Launch is the target',
        body: 'A finish sprint aims at launch rather than a ticket count: payments working, the app deployed and, where needed, submitted to the stores.',
      },
    ],
    start_here: ['fix-vibe-coded-app', 'lovable-app-to-app-store'],
    sub_services: [
      {
        name: 'Finishing AI-built apps (Lovable, Bolt, Replit, Cursor)',
        line: 'Taking an app an AI builder started through the audit and finish sprints, all the way to launch.',
        refs: [{ service: 'fix-vibe-coded-app' }, { service: 'lovable-app-to-app-store' }],
      },
      {
        name: 'Working in an existing codebase',
        line: 'New features added inside code someone else wrote, following the patterns it already uses.',
        refs: [
          { project: 23 },
          { project: 14 },
          { review: 'matthew4l2', job: 'Features added to an existing Next.js 15 app' },
        ],
      },
      {
        name: 'Production bug fixing',
        line: 'Bugs in a live app found, reproduced and fixed without breaking the parts that already work.',
        refs: [
          { review: 'irmairvin', job: 'Fixed an issue, responsive and bug-free' },
          { review: 'robertfelt0n', job: 'Mobile UI fixes' },
        ],
      },
      {
        name: 'Performance optimization and refactoring',
        line: 'Slow pages and tangled code made faster and easier to change without a rewrite.',
        refs: [{ review: 'irmairvin', job: 'A Next.js app restructured, with noticeable performance improvements' }],
      },
      {
        name: 'Third-party integration fixes',
        line: 'Push, payment and other outside services that misbehave, set up again properly on each platform.',
        refs: [{ review: 'cedric_coleman', job: 'OneSignal on iOS and Android' }],
      },
      {
        name: 'Production deployment troubleshooting',
        line: 'Apps that run on a laptop but fail on the server, configured until they run live.',
        refs: [{ review: 'monica_lisa', job: 'A React app put live on AWS EC2' }],
      },
      {
        name: 'Existing application maintenance',
        line: 'Fixes, updates and new releases for a live app after the main work is handed over.',
        refs: [{ project: 23, note: 'ongoing work on a live app' }, { step: 'care' }],
      },
    ],
    featured: [
      { project: 23 },
      { project: 14 },
      { review: 'matthew4l2', job: 'Features added to an existing Next.js 15 app' },
      { review: 'irmairvin', job: 'A Next.js app restructured, with noticeable performance improvements' },
    ],
    faqs: [
      {
        q: 'My Lovable app almost works. What does finishing it involve?',
        a: 'An audit first, then finish sprints. The [Vibe Code Audit](/solutions/fix-vibe-coded-app) reads the code, tests its data rules and payments, and gives each part a keep, harden or rebuild verdict, with the fix estimated in sprint weeks. Sprints then fix what it found and get the app to launch; a finish sprint usually takes 1–2 weeks. We have no finished AI-built app to show here yet.',
      },
      {
        q: 'Can you add features to an app that is already live?',
        a: 'Yes, inside the code it already has. A Fiverr client, [matthew4l2](/reviews), hired Sameem to add Stripe payments and a user dashboard to an existing Next.js 15 app. On [Food Magnet](/projects/14) (As an engineer at Zencloud), an existing product, his work covered dashboards, menus, bookings and payments. New work follows the patterns already in the codebase, so the app stays consistent.',
      },
      {
        q: 'My app has become slow. Can you speed it up?',
        a: 'Often, yes. A Fiverr client, [irmairvin](/reviews), hired Sameem to optimise and restructure a Next.js app and wrote of "noticeable performance improvements" afterwards. We start by finding where the time actually goes, in page rendering, database queries or the size of the code sent to the browser, before changing anything.',
      },
      {
        q: 'Push notifications stopped arriving in my app. Can you fix them?',
        a: 'Usually, once we see how they were set up. A Fiverr client, [cedric_coleman](/reviews), hired Sameem for a full OneSignal integration of push, in-app and email notifications on iOS and Android; that was a new integration, not a repair. His guide on [OneSignal push not working on iOS](https://sameemamjad.com/guides/onesignal-push-not-working-ios) covers the common causes you can check yourself first.',
      },
      {
        q: 'Can you fix just one bug that keeps coming back?',
        a: 'Yes, though one bug you can name and reproduce costs less as a fixed-price gig on our Fiverr profile than as a sprint. A Fiverr client, [irmairvin](/reviews), hired Sameem for a fix like that and wrote: "Fixed my issue perfectly." When the bugs keep multiplying, the audit is the better place to start.',
      },
      {
        q: 'My web app looks broken on phones. Can you fix the layout?',
        a: 'Yes. A Fiverr client, [irmairvin](/reviews), hired Sameem for a Next.js landing page and wrote that it "works perfectly on mobile, tablet, and desktop". Another, [smith3131](/reviews), had us fix alignment, spacing, typography and responsiveness in an existing Figma website design. On a live app we fix the layout in the code and check it on real screen sizes.',
      },
    ],
  },

  // ── 10 ──────────────────────────────────────────────────────────────────
  {
    id: 'specialized-business-software',
    name: 'Specialized Business Software',
    description:
      'Software for particular trades and markets: legal documents, used cars, travel, pet care, fitness, communities, video and PDF reports. Each line names the product behind it and who it was built for, and industry links open the matching projects.',
    intro:
      "Some products need knowledge of a field as much as code: a power of attorney signed with Denmark's MitID, a contract a Quebec contractor can sign, a flight connection that may break. [e-fuldmagt](/projects/27) (As an engineer at Zencloud), [ConstrAction](/projects/33) (DevoraX client, hired through Fiverr) and [Barfly](/projects/29) (As an engineer at Zencloud) cover those three. DevoraX holds no certifications, so regulated work that needs one is not for us.",
    key_points: [
      {
        heading: "The field's rules first",
        body: 'Each product starts from how the trade really works, such as Quebec contract types or Danish digital signatures, before any screen is designed.',
      },
      {
        heading: 'Documents ready to sign',
        body: "Contracts, powers of attorney and survey reports come out as PDFs built from the user's own answers, ready to sign, send or file.",
      },
      {
        heading: 'Proof by industry',
        body: 'The industry links open every project in that field, each with its label, so you can check the work nearest to yours.',
      },
    ],
    start_here: [],
    sub_services: [
      {
        name: 'LegalTech application development',
        line: 'Contracts, powers of attorney and proofs of record built around how legal documents are really used.',
        refs: [{ project: 33 }, { project: 27 }, { project: 44, note: 'on-chain notarization' }],
      },
      {
        name: 'Automotive software development',
        line: 'Software for selling inspected used cars, where condition and price come from one backend.',
        refs: [{ project: 25 }],
      },
      {
        name: 'Travel and flight integration systems',
        line: 'Flight data joined to travel products, such as a risk check on tight connections.',
        refs: [{ project: 29 }],
      },
      {
        name: 'Pet-care management applications',
        line: 'Pet owners matched with local carers, with subscriptions and service credits behind the bookings.',
        refs: [{ project: 8 }],
      },
      {
        name: 'Social and community applications',
        line: 'Feeds, events, messages and creator spaces that give a community a reason to come back.',
        refs: [
          { project: 26 },
          { project: 39, note: 'community feed and direct messages' },
          { project: 19, note: 'creator platform' },
        ],
      },
      {
        name: 'Video processing and streaming systems',
        line: 'Video uploads transcoded, streamed to phones and protected for the viewers who paid for them.',
        refs: [{ project: 26 }, { project: 30 }, { project: 19, note: 'video upload and delivery' }],
      },
      {
        name: 'Fitness and competition platforms',
        line: 'Competitions with live leaderboards, and admin tools for trainers and their clients.',
        refs: [{ project: 31 }, { project: 21 }],
      },
      {
        name: 'Document generation and PDF automation',
        line: 'Ready-to-sign contracts and finished reports produced from a form in one click.',
        refs: [
          { project: 33 },
          { project: 27, note: 'generated PDFs' },
          { project: 36, note: 'one-click PDF reports' },
          { project: 50, note: 'the other direction: invoice data read out of PDFs' },
        ],
      },
      {
        name: 'Subscription billing systems',
        line: 'Recurring billing tied to what each customer may use, through plans, credits or paid access.',
        refs: [{ project: 8 }, { project: 33 }, { project: 37 }, { project: 30 }, { project: 53 }],
      },
    ],
    industries: [
      { slug: 'education', projects: [24, 37, 39, 47, 53] },
      { slug: 'food-hospitality', projects: [17, 14, 40, 42, 20] },
      { slug: 'real-estate', projects: [33, 48, 36, 45, 38] },
      { slug: 'health', projects: [43, 35] },
      { slug: 'workforce', projects: [28, 18] },
    ],
    featured: [{ project: 27 }, { project: 33 }, { project: 29 }, { project: 25 }, { project: 31 }, { project: 26 }],
    faqs: [
      {
        q: 'Can you build software that produces legal documents?',
        a: 'Yes, and we have worked on three kinds. [ConstrAction](/projects/33) (DevoraX client, hired through Fiverr) generates bilingual construction contracts for Quebec contractors, [e-fuldmagt](/projects/27) (As an engineer at Zencloud) creates Danish powers of attorney with REST APIs built to GDPR requirements, and [SolNotary](/projects/44) (Client project) seals a text on Solana. If the work needs a certification, ask on the call first: DevoraX holds none.',
      },
      {
        q: 'Can my app turn a form into a finished PDF?',
        a: "Yes. [ConstrAction](/projects/33) (DevoraX client, hired through Fiverr) turns a contractor's answers into a ready-to-sign contract in English or French with React-PDF, and [e-fuldmagt](/projects/27) (As an engineer at Zencloud) generates power-of-attorney documents with PDF-Lib. [SiteWrite](/projects/36) (Demo build) produces a branded RICS survey report in one click, even after a surveyor has worked offline all day.",
      },
      {
        q: 'Have you worked on anything in my industry?',
        a: 'Possibly: [the portfolio](/projects) can be filtered by industry, and each project there says who it was for. Education, food and hospitality, real estate and construction, health and wellbeing, and field and workforce each have at least two projects, listed with their labels under this group. If yours is missing, the free call is where we say honestly whether our work is close enough.',
      },
      {
        q: 'Can my travel product use live flight data?',
        a: 'Yes. [Barfly](/projects/29) (As an engineer at Zencloud) combines flight data from the Duffel API with heuristic rules to assess the risk that a delay breaks each layover, for codeshare and non-codeshare itineraries, and it runs inside got2.travel. [The Duffel API integration page](/solutions/duffel-api-integration-development) sets out what that work involves and what it does not cover.',
      },
      {
        q: 'Can you build a live leaderboard for a fitness competition?',
        a: "Yes. On [WOD Pro League](/projects/31) (As an engineer at Zencloud), Sameem's part was the real-time leaderboard on Socket.io and Redis, the backend that takes registrations and the Stripe integration. The organisers' testimonial on zencloudtechnologies.com says more than 600 athletes joined in the first season. [Augment Fit](/projects/21) (Sameem worked on this build) covers the trainer side, with workout plans.",
      },
      {
        q: 'Can creators sell their own videos in my app?',
        a: "Yes. [Three28](/projects/19) (Sameem's direct client) lets creators upload videos, sell them to fans at prices they set and sell merchandise alongside them; it has been on the App Store since July 2024. [JUJU](/projects/30) (Sameem's direct client) sells access by subscription instead, and its backend checks each request before it signs a playback link.",
      },
    ],
  },
];
