/**
 * Insights: data-backed research articles, and checklists.
 *
 * These exist for citation, not for keyword volume. The research articles are
 * written from the 26 entries in the DevoraX portfolio: products DevoraX's
 * founder, Sameem Amjad, built or worked on, many of them as an employee of
 * other companies. They are not a record of DevoraX client work, and they state
 * their own limits, which is what separates a source worth quoting from
 * marketing copy.
 *
 * In the research articles every count is computed by a script from the
 * structured fields of the `projects` table (tags, tech stack, category label,
 * web/android/ios links), never from free-text descriptions. Who each project
 * was for (employer, direct client work, no named client, no client) follows
 * Sameem's answers of 9 Oct 2026. Never hand-add a number here that is not
 * derivable from those fields or from a public, checkable source.
 *
 * A checklist (`kind: 'checklist'`, Nov 2026) is not drawn from the portfolio.
 * Each item is a check, what goes wrong when it fails, and a test a founder or a
 * developer can run; platform facts in it come from the platform's own docs,
 * dated. It states what it is based on and what it cannot tell you, like the
 * research does, and it carries its own `updated` date, so publishing or
 * revising one does not re-date the research articles.
 */
export type InsightTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type InsightSection = {
  /** Anchor, lowercase-hyphenated: "investor-due-diligence". */
  id?: string;
  heading: string;
  body: string;
  table?: InsightTable;
};

/** One check on a checklist page, rendered at #item-{id}. */
export type ChecklistItem = {
  /** Short and stable, because pages link to it: "rls-enabled". */
  id: string;
  /** The heading it is listed under: "Data access", "Secrets", "Payments". */
  group: string;
  /** The check, imperative, one sentence. */
  check: string;
  /** What goes wrong if it fails, in a sentence or two. */
  why: string;
  /** How a founder or developer tests it: a query, a request, a setting to open. */
  test: string;
};

type InsightBase = {
  slug: string;
  /** The visible H1 and the Article headline. */
  title: string;
  /**
   * The <title> and social title, when `title` is too long for a results page:
   * at most 50 characters, so "{seo_title} | DevoraX" stays within 60. Primary
   * term first, and it must say what the article says, nothing more.
   */
  seo_title?: string;
  /**
   * First publication (ISO), taken from the commit that added the article.
   * Feeds datePublished; `updated` (or INSIGHTS_UPDATED) is the dateModified.
   */
  published?: string;
  meta_description: string;
  /** Answer-first opener — the passage most likely to be quoted. */
  summary_answer: string;
  sections: InsightSection[];
  limitations: string[];
  cannot_answer?: string[];
  /** This page's own revision date (ISO). Without one, INSIGHTS_UPDATED applies. */
  updated?: string;
};

export type ResearchInsight = InsightBase & {
  kind?: 'research';
  /** Explicit statement of what the dataset is and is not. */
  dataset_note: string;
  key_findings: string[];
  word_count: number;
};

export type ChecklistInsight = InsightBase & {
  kind: 'checklist';
  /** What the checklist is based on (sources, dates) and what it is not. */
  dataset_note?: string;
  key_findings?: string[];
  items: ChecklistItem[];
  /** Counted from the rendered text when absent. */
  word_count?: number;
  updated: string;
};

export type Insight = ResearchInsight | ChecklistInsight;

/**
 * Populated by the research generator; checklists are written by hand.
 *
 * Retired 7 Nov 2026: the portfolio-wide count, "What the 26 DevoraX Portfolio
 * Entries Show About Stacks and Links", at
 * /insights/what-we-measured-across-25-production-builds. Search engines had
 * never crawled it, and its slug promised 25 builds the page didn't count. The
 * URL 301s to /insights (next.config.ts), so don't regenerate it under that
 * slug. The other research articles still draw on the same 26 entries.
 */
export const INSIGHTS: Insight[] = [
  {
    "slug": "react-native-vs-flutter-production-experience",
    "title": "React Native vs Flutter: What 12 Cross-Platform Builds in One Portfolio Show",
    "seo_title": "React Native vs Flutter: What 12 Builds Show",
    "published": "2026-09-16T00:00:00.000Z",
    "meta_description": "Twelve cross-platform builds from the DevoraX portfolio, compared by store presence, backend and context, and what the data cannot settle.",
    "summary_answer": "Across the twelve cross-platform mobile builds in the DevoraX portfolio, two of six Flutter builds link to both Google Play and the App Store, against one of six React Native builds, while four of the six React Native builds link to at least one store against three of the six Flutter builds. Context differs more than framework: four of the six Flutter builds were Sameem Amjad's work as an employee of other companies, and none of the six React Native builds was. This is a portfolio count, not a performance benchmark.",
    "dataset_note": "The dataset is the 26 entries in the DevoraX portfolio: products that DevoraX's founder, Sameem Amjad, built or worked on, many of them as an engineer at other companies. Twelve name a cross-platform mobile framework in their tags or declared tech stack: 6 React Native, 6 Flutter. Every count uses the structured fields only, meaning the category label, the tag list, the declared tech stack and the web, Google Play and App Store links, and was produced by a script rather than by hand. Free-text descriptions are not counted. There is no control group, no randomisation, no paired build of the same app in both frameworks and no performance testing of any kind, and the portfolio holds no outcome data. It is a portfolio, not an experiment.",
    "sections": [
      {
        "heading": "Which builds in the portfolio use React Native or Flutter?",
        "body": "Of the 26 portfolio entries, twelve name a cross-platform mobile framework in their tags or tech stack: six React Native and six Flutter. That structured-field rule matters at the edges. Dooz Inspected Cars lists Angular and NestJS in its tech stack and React Native only in its tags, so it counts. The remaining thirteen entries name no mobile framework, which is not the same as having no app: Pastel and LoopedIn link app store listings, yet neither entry names the framework behind its app. Pastel is Sameem's employer, and its app is not DevoraX work: he has been a Senior Software Developer on Pastel's team, as Pastel's employee, since April 2026, and its iOS app launched before he joined.\n\nThe table below is therefore the entire comparison set. It carries the context of each build, because context turns out to separate the two groups more cleanly than anything technical does.",
        "table": {
          "caption": "All 12 cross-platform mobile builds in the 26-entry portfolio, with declared backend, context and the store listings each entry links.",
          "headers": [
            "Build",
            "Framework",
            "Product",
            "Declared backend",
            "Context",
            "Store listing linked"
          ],
          "rows": [
            [
              "FinTech Mobile App",
              "React Native",
              "Banking app",
              "Node.js",
              "No client, no public link",
              "None"
            ],
            [
              "AgroBridge",
              "React Native",
              "Agricultural marketplace",
              "Firebase",
              "No client, no public link",
              "None"
            ],
            [
              "Koor Food Delivery",
              "React Native",
              "Food delivery from home chefs",
              "NestJS",
              "No client named",
              "Google Play"
            ],
            [
              "CEDMAT Roller Shutter App",
              "React Native",
              "Roller-shutter installer app",
              "NestJS",
              "No client named",
              "Google Play"
            ],
            [
              "Three28 Creator Platform",
              "React Native",
              "Creator video monetisation",
              "NestJS",
              "Direct client work",
              "App Store"
            ],
            [
              "Dooz Inspected Cars",
              "React Native",
              "Used-car marketplace, Jordan",
              "NestJS",
              "Direct client work",
              "Google Play + App Store"
            ],
            [
              "Food Magnet: Vendor",
              "Flutter",
              "Food-truck discovery",
              "AWS Lambda functions",
              "Engineer at Zencloud",
              "Google Play + App Store"
            ],
            [
              "Digital Power of Attorney Platform",
              "Flutter",
              "Danish digital power of attorney",
              "Node.js + Express",
              "Engineer at Zencloud",
              "None"
            ],
            [
              "TAL Workforce Platform",
              "Flutter",
              "Welfare app for mobile workers, UK",
              "Node.js",
              "Engineer at Webrange Solutions",
              "Google Play + App Store"
            ],
            [
              "JUJU Streaming Platform",
              "Flutter",
              "Media streaming",
              "Node.js",
              "Direct client work",
              "None"
            ],
            [
              "WOD Pro League",
              "Flutter",
              "Fitness competition",
              "Node.js",
              "Engineer at Zencloud",
              "None"
            ],
            [
              "Hear With You",
              "Flutter",
              "AI storytelling in the listener's cloned voice",
              "NestJS",
              "Direct client work",
              "App Store"
            ]
          ]
        }
      },
      {
        "heading": "How is each framework attribution recorded?",
        "body": "Framework labels come from hand-maintained fields, so it is worth showing where each one sits before comparing anything built on top of them. Nine of the twelve builds name their framework in both tags and tech stack. Three do not. Dooz Inspected Cars is React Native in tags only, because its tech stack lists the Angular web client and the NestJS backend instead. Digital Power of Attorney is Flutter in tags only, its tech stack naming Node.js and Express. JUJU Streaming is the reverse, Flutter in tech stack only, with its tags describing the backend.\n\nThe category label is less consistent still, which is why it is not used for attribution: Food Magnet's category is Food Industry, a vertical rather than a stack, and three Flutter builds carry the category Node.js Backend & AWS with no mention of Flutter. None of this changes the totals of six and six, but it explains why every count here names the fields it reads.",
        "table": {
          "caption": "Where the framework label for each of the 12 builds is recorded, plus the category label as stored.",
          "headers": [
            "Build",
            "Framework",
            "In tags",
            "In tech stack",
            "Category label as stored"
          ],
          "rows": [
            [
              "FinTech Mobile App",
              "React Native",
              "Yes",
              "Yes",
              "React Native & Node.js"
            ],
            [
              "AgroBridge",
              "React Native",
              "Yes",
              "Yes",
              "React Native & Firebase"
            ],
            [
              "Koor Food Delivery",
              "React Native",
              "Yes",
              "Yes",
              "React Native & Node.js"
            ],
            [
              "CEDMAT Roller Shutter App",
              "React Native",
              "Yes",
              "Yes",
              "React Native & AWS"
            ],
            [
              "Three28 Creator Platform",
              "React Native",
              "Yes",
              "Yes",
              "React Native & Node.js"
            ],
            [
              "Dooz Inspected Cars",
              "React Native",
              "Yes",
              "No",
              "React Native & Node.js"
            ],
            [
              "Food Magnet: Vendor",
              "Flutter",
              "Yes",
              "Yes",
              "Food Industry"
            ],
            [
              "Digital Power of Attorney Platform",
              "Flutter",
              "Yes",
              "No",
              "Node.js Backend & AWS"
            ],
            [
              "TAL Workforce Platform",
              "Flutter",
              "Yes",
              "Yes",
              "Node.js Backend & AWS"
            ],
            [
              "JUJU Streaming Platform",
              "Flutter",
              "No",
              "Yes",
              "Node.js Backend & AWS"
            ],
            [
              "WOD Pro League",
              "Flutter",
              "Yes",
              "Yes",
              "Flutter & Node.js"
            ],
            [
              "Hear With You",
              "Flutter",
              "Yes",
              "Yes",
              "Flutter & NestJS"
            ]
          ]
        }
      },
      {
        "heading": "Which framework's builds link to public app stores more often?",
        "body": "Store presence is read from each entry's web, Android and iOS links. Two of the six Flutter builds link to both Google Play and the Apple App Store: Food Magnet and TAL. One of the six React Native builds does, Dooz. React Native is not absent from the stores; it is the more store-present group overall. Four of six React Native builds link at least one store listing, against three of six Flutter builds. Of those four, Koor and CEDMAT are on Google Play only and Three28 is on the App Store only.\n\nThe builds with no link at all split evenly and for different reasons. Two Flutter builds have no public link: JUJU, which has none listed, and WOD Pro League, whose site and store listings no longer resolve. Two React Native builds, the FinTech Mobile App and AgroBridge, have no client and no public link.",
        "table": {
          "caption": "Linked public release status by framework, counted from the web, Android and iOS links of each entry.",
          "headers": [
            "Linked release status",
            "React Native (n=6)",
            "Flutter (n=6)"
          ],
          "rows": [
            [
              "Linked on both Google Play and the App Store",
              "1",
              "2"
            ],
            [
              "Google Play listing linked",
              "3",
              "2"
            ],
            [
              "Apple App Store listing linked",
              "2",
              "3"
            ],
            [
              "At least one store listing linked",
              "4",
              "3"
            ],
            [
              "Web URL linked",
              "1",
              "3"
            ],
            [
              "No public link of any kind",
              "2",
              "2"
            ]
          ]
        }
      },
      {
        "heading": "What backends did each framework pair with?",
        "body": "One rule governs every row below: a technology counts when it is named in the entry's category label, tags or declared tech stack. Under that rule the sharpest split is NestJS, named behind four of six React Native builds and one of the six Flutter builds. Express appears once, behind the Flutter-based Digital Power of Attorney platform; the project descriptions of WOD Pro League and TAL name a Node.js and Express backend on both, which those entries' fields do not record. Node.js itself is named in four of six React Native entries and four of six Flutter entries, so the runtime is not a point of difference.\n\nAWS is named in five of six Flutter entries and three of six React Native entries. Serverless AWS Lambda appears only on the Flutter side, in Food Magnet, and Elasticsearch only on the React Native side, in Koor. Firebase appears in two React Native entries and one Flutter entry.",
        "table": {
          "caption": "Technologies named in the category label, tags or declared tech stack, counted per framework. Every row uses this single rule; free-text descriptions are not counted.",
          "headers": [
            "Technology named",
            "React Native (n=6)",
            "Flutter (n=6)"
          ],
          "rows": [
            [
              "NestJS",
              "4",
              "1"
            ],
            [
              "Node.js",
              "4",
              "4"
            ],
            [
              "Express",
              "0",
              "1"
            ],
            [
              "Firebase",
              "2",
              "1"
            ],
            [
              "AWS (any service)",
              "3",
              "5"
            ],
            [
              "AWS Lambda",
              "0",
              "1"
            ],
            [
              "Elasticsearch",
              "1",
              "0"
            ],
            [
              "Stripe",
              "0",
              "1"
            ],
            [
              "React.js web surface",
              "0",
              "3"
            ],
            [
              "Angular web surface",
              "1",
              "0"
            ]
          ]
        }
      },
      {
        "heading": "Is the NestJS split really a runtime difference?",
        "body": "No, and reading it as one would be the easiest mistake to make with this table. NestJS is a framework that runs on Node.js, so the four React Native builds behind it are Node.js services too. The entries say so directly: Koor, Three28 and Dooz carry the category React Native & Node.js while their tech stack names NestJS. The two descriptions sit at different levels rather than in conflict. Counted that way, five of six React Native builds name a Node-family backend, NestJS four times and plain Node.js once, and four of six Flutter builds name Node.js outright. AgroBridge names only Firebase; Food Magnet names AWS Lambda functions without naming a runtime. Hear With You names NestJS.\n\nWhat differs is the shape above the runtime: the React Native builds used the opinionated NestJS structure, the Flutter builds mostly used Express, plain Node services and, on Food Magnet, AWS Lambda, with NestJS only behind Hear With You. Because four of the six Flutter builds were employer work and no React Native build was, that split describes different teams and contexts, not the frameworks."
      },
      {
        "heading": "Did the two frameworks land in the same verticals?",
        "body": "No, and this is the most important limit on the comparison, alongside context. No vertical in the portfolio was built twice, once in each framework. React Native carried a banking app, an agricultural marketplace, food delivery, a roller-shutter installer app, creator monetisation and a used-car marketplace. Flutter carried food-truck discovery, media streaming, digital power of attorney, workforce welfare, fitness competition and AI storytelling. Two React Native entries carry a FinTech tag, the FinTech Mobile App and Dooz; no Flutter entry does. Three of the six Flutter products centre on live location or live competition data: Food Magnet tracks food-truck locations, TAL helps mobile workers find nearby facilities and WOD Pro League runs real-time leaderboards.\n\nBecause the workloads never overlap, and because most of the Flutter builds came from Sameem's employers while none of the React Native builds did, any difference in store presence between the two groups is confounded with what the apps were asked to do, who commissioned them and what the work covered. There is no like-for-like pair anywhere in these twelve builds."
      },
      {
        "heading": "Does either framework arrive with a companion web surface more often?",
        "body": "In this portfolio, yes. Four of six Flutter entries name a React-family web surface in their tags or tech stack: Food Magnet pairs its Flutter app with a React.js admin dashboard, TAL Workforce and the Digital Power of Attorney platform both carry a React.js tag, and Hear With You names Next.js for its admin dashboard and landing page. On the React Native side, one of six names a companion web client: Dooz Inspected Cars, which lists Angular for its web interface. The link fields point the same way independently, with three of six Flutter builds linking a web address against one of six React Native builds.\n\nThe likeliest reading is that these Flutter products were multi-surface products, with the mobile app as one surface among several. That is a statement about these particular projects, not about what either framework can do."
      },
      {
        "heading": "Why is this portfolio evidence rather than a benchmark?",
        "body": "Because nobody ran the experiment that would make it one. No screen was built twice, no frame times, cold starts, memory or binary sizes were measured, and neither framework was instrumented under load. Team composition, employer, brief, budget and year all differed between projects, and none of those variables is captured in the fields being counted. The counting has soft edges worth naming: framework attribution rests on hand-maintained tags and tech stack lists, and three of the twelve builds name their framework in only one of the two. Every number published here was counted from the 26 portfolio entries with a script, not taken from any precomputed summary."
      }
    ],
    "key_findings": [
      "2 of 6 Flutter builds link to both Google Play and the Apple App Store, against 1 of 6 React Native builds.",
      "React Native is the more store-present group overall: 4 of 6 React Native builds link at least one store listing, against 3 of 6 Flutter builds.",
      "4 of 6 Flutter builds are products Sameem Amjad worked on as an employee, at Zencloud or Webrange Solutions, and JUJU and Hear With You were direct client work; none of the 6 React Native builds was employer work, so framework is confounded with context.",
      "NestJS is named behind 4 of 6 React Native builds and 1 of 6 Flutter builds; Node.js itself is named in 4 of 6 and 4 of 6, so the runtime is not a point of difference.",
      "4 of 6 Flutter builds name a React-family (React.js or Next.js) web surface in their tags or tech stack, against 1 of 6 React Native builds (Dooz, with Angular).",
      "No vertical in the portfolio was built in both frameworks, so there is no like-for-like pair anywhere in these 12 builds."
    ],
    "limitations": [
      "n=12 mobile builds from one portfolio of 26 entries. This is far too small and too self-selected to support any industry-wide claim.",
      "The portfolio is not only a record of DevoraX client work. 4 of the 6 Flutter builds were employer projects at Zencloud or Webrange Solutions, and JUJU and Hear With You were direct client work; of the 6 React Native builds, 2 were direct client work, 2 have no named client and 2 have no client at all.",
      "No controlled comparison was run. No paired build, no benchmark harness, no instrumentation, no control group.",
      "The two framework groups cover completely different verticals, so store presence is confounded with brief, employer, budget and year.",
      "Framework attribution depends on hand-maintained tags and tech stack lists. Only 9 of the 12 builds name their framework in both; 3 name it in one only, and the category label is too inconsistent to use for attribution.",
      "Store presence is read from stored links. Absence of a link is not proof that an app never reached a store, and a link that resolves today may not resolve tomorrow.",
      "Two entries outside the comparison set, Pastel and LoopedIn, link app store listings without naming a mobile framework, so neither is counted here. Pastel's listings are employer work, not DevoraX work: Pastel is Sameem's employer, and its iOS app launched before he joined in April 2026.",
      "Free-text descriptions were not counted, so technologies named only in prose, such as Express on WOD Pro League and TAL, are missing from the backend table."
    ],
    "cannot_answer": [
      "Which framework renders faster, starts faster, or uses less memory. No performance test of any kind was run.",
      "Which framework produces smaller app binaries. Bundle size is not recorded for any entry.",
      "Which framework is cheaper to hire for, or what either skill set costs in any market.",
      "Which framework took fewer developer-hours or reached release sooner. No effort or timeline data exists in the portfolio.",
      "Whether the NestJS-versus-Express difference reflects any technical fit with either framework. The entries show which stack each product used, not why.",
      "Whether either framework affected any product's commercial results. The portfolio holds no outcome data, and the workloads and businesses never overlap.",
      "Which framework produces more crash-free sessions or better store ratings at scale. No crash or rating data is counted here.",
      "How either framework behaves on older Android hardware, on tablets, or offline. Device-level data is not captured.",
      "Whether builds with no store link were cancelled, released privately, or released and later delisted.",
      "Which framework the Pastel and LoopedIn apps use. Their entries name no mobile framework."
    ],
    "word_count": 2539,
    "updated": "2026-11-08T00:00:00.000Z"
  },
  {
    "slug": "supabase-vs-firebase-marketplace-backends",
    "title": "Supabase vs Firebase for Marketplace Backends: What 10 Portfolio Builds Show",
    "seo_title": "Supabase vs Firebase for Marketplace Backends",
    "published": "2026-09-16T00:00:00.000Z",
    "meta_description": "Ten builds from the DevoraX portfolio, eight naming Firebase and two Supabase with no overlap: what they show about product shape, and what they cannot.",
    "summary_answer": "Of the 26 entries in the DevoraX portfolio, ten name Supabase or Firebase in their tags or tech stack and none uses both: eight Firebase, two Supabase. Firebase sits alongside mobile frameworks, AWS services and, on Pastel, Sharetribe (Pastel is Sameem's employer: he has been a Senior Software Developer on Pastel's team, as Pastel's employee, since April 2026). Both Supabase builds are React-family web dashboards: Afriva, built for a DevoraX client, whose live demo has shopper and seller logins, and Augment Fit, which has no public link. With only two Supabase builds, that split describes product shape in one portfolio, not measured backend performance.",
    "dataset_note": "The dataset is the 26 entries in the DevoraX portfolio: products that DevoraX's founder, Sameem Amjad, built or worked on, many as an engineer at other companies. Of the ten builds compared here, five were employer projects (Food Magnet at Zencloud, Bondly at Webrange Solutions, Coffee Shop at Fleact Tech, Pathana at ivector, and Pastel, where Sameem has been a Senior Software Developer on Pastel's team, as Pastel's employee, since April 2026), one, Afriva, was built for a DevoraX client, three have no named client and one, AgroBridge, has no client at all. Counts use structured fields only: category label, tags, declared tech stack and web, Google Play and App Store links. Backend attribution comes from the tags and tech stack. There is no control group, no random assignment, no shared measurement window, no instrumentation of the running systems and no outcome data. On the employer projects the backend was chosen inside another company. This is a record of which backends these products use, not a test of either.",
    "sections": [
      {
        "heading": "How many builds in the portfolio use Supabase, and how many use Firebase?",
        "body": "Across the 26 portfolio entries, ten name one of these two backends in their tags or tech stack: eight Firebase, two Supabase. No entry uses both. That split is the first finding, and the Supabase side is very small. Waitmate, a hospitality admin dashboard, is not on it: its public demo is a Next.js app on Firebase.\n\nThree further entries name one of the backends only in their written description, not in their tags or tech stack: Outstride and CEDMAT on Firebase, and ConstrActive, a construction CRM built on GoHighLevel, Supabase and Stripe. Of the three, only CEDMAT has a public link, on Google Play. Counting them, the split becomes ten Firebase to three Supabase, still with no overlap. Every other figure below comes from the ten tagged entries.",
        "table": {
          "caption": "All 10 entries naming Supabase or Firebase in tags or tech stack, plus the 3 that name one only in their description. Links are those stored with each entry.",
          "headers": [
            "Build",
            "Backend",
            "Where it is named",
            "Category label",
            "Context",
            "Links"
          ],
          "rows": [
            [
              "Bondly Pet Care Platform",
              "Firebase",
              "Tags + tech stack",
              "Node.js & Firebase",
              "Engineer at Webrange Solutions",
              "Web"
            ],
            [
              "AgroBridge",
              "Firebase",
              "Tags + tech stack",
              "React Native & Firebase",
              "No client, no public link",
              "None"
            ],
            [
              "Food Magnet: Vendor",
              "Firebase",
              "Tags + tech stack",
              "Food Industry",
              "Engineer at Zencloud",
              "Web, Google Play, App Store"
            ],
            [
              "Koor Food Delivery",
              "Firebase",
              "Tags only",
              "React Native & Node.js",
              "No client named",
              "Google Play"
            ],
            [
              "Coffee Shop Web App",
              "Firebase",
              "Tags + tech stack",
              "Next.js & Firebase",
              "Engineer at Fleact Tech",
              "Build on vercel.app"
            ],
            [
              "Waitmate Platform",
              "Firebase",
              "Tags + tech stack",
              "Next.js Demo Build",
              "No client named",
              "Demo build on vercel.app"
            ],
            [
              "Pastel Marketplace",
              "Firebase",
              "Tech stack only",
              "Sharetribe & iOS",
              "Senior Software Developer on Pastel's team, as Pastel's employee, since April 2026",
              "Web, Google Play, App Store"
            ],
            [
              "Pathana Platform",
              "Firebase",
              "Tags only",
              "Next.js & Serverless APIs",
              "Engineer at ivector",
              "Web"
            ],
            [
              "Augment Fit Platform",
              "Supabase",
              "Tags + tech stack",
              "React.js Frontend",
              "No client named",
              "None"
            ],
            [
              "Afriva E-Commerce Platform",
              "Supabase",
              "Tags + tech stack",
              "Next.js & Supabase",
              "DevoraX client",
              "Demo build on vercel.app"
            ],
            [
              "Outstride / Ginger Storefront",
              "Firebase",
              "Description only",
              "React.js Frontend",
              "Engineer at Webrange Solutions",
              "None"
            ],
            [
              "CEDMAT Roller Shutter App",
              "Firebase",
              "Description only",
              "React Native & AWS",
              "No client named",
              "Google Play"
            ],
            [
              "ConstrActive Platform",
              "Supabase",
              "Description only",
              "Node.js Backend & AWS",
              "No client named",
              "None"
            ]
          ]
        }
      },
      {
        "heading": "Which backend did the marketplaces in the portfolio use?",
        "body": "Seven of the 26 products are two-sided marketplaces, where one set of users lists, sells or provides and another buys or books. That grouping is a classification made for this article from what each product is, not a field in the data. Four of the seven name Firebase: Pastel, an antiques marketplace that runs on Sharetribe with Firebase in its tech stack; Koor, food delivery from home chefs; Bondly, pet care; and AgroBridge, an agricultural marketplace. One sits on Supabase: Afriva, a multi-vendor marketplace with separate admin, manager, seller and buyer roles. Two use neither: the AI E-Commerce Ecosystem runs on Next.js with Docker and Kubernetes, and Dooz Inspected Cars on a NestJS backend.\n\nSo in this portfolio Firebase appears in the marketplace work four times to Supabase's once, and on Pastel it is not the marketplace engine at all; Sharetribe is. With seven products in the group, that ratio describes this portfolio and nothing more. Afriva is the only one of the seven built around four distinct roles, each with its own dashboard. Of the four marketplaces naming Firebase, Pastel, Koor and Bondly have a public link; AgroBridge has no client and no public link.",
        "table": {
          "caption": "The 7 two-sided marketplaces in the portfolio, with the context of each and where it can be seen.",
          "headers": [
            "Product",
            "Backend",
            "What it is",
            "Context",
            "Where you can see it"
          ],
          "rows": [
            [
              "Pastel Marketplace",
              "Sharetribe, with Firebase in its tech stack",
              "Antiques and vintage marketplace",
              "Sameem works on Pastel's iOS app as a Senior Software Developer on Pastel's team, as Pastel's employee, since April 2026",
              "mypastel.com; App Store; Google Play"
            ],
            [
              "Koor Food Delivery",
              "Firebase",
              "Food delivery from home chefs to customers",
              "No client named",
              "Google Play (com.koor_user)"
            ],
            [
              "Bondly Pet Care Platform",
              "Firebase",
              "Pet-care marketplace linking owners with care professionals",
              "Engineer at Webrange Solutions (led the backend)",
              "bondlypets.com"
            ],
            [
              "AgroBridge",
              "Firebase",
              "Mobile agricultural marketplace",
              "No client",
              "No public link"
            ],
            [
              "Afriva E-Commerce Platform",
              "Supabase",
              "Multi-vendor marketplace with admin, manager, seller and buyer roles",
              "DevoraX client",
              "Demo build at afriva-buyer.vercel.app"
            ],
            [
              "AI E-Commerce Ecosystem",
              "Neither (Next.js, Docker, Kubernetes)",
              "Multi-vendor marketplace with AI recommendations",
              "No client",
              "No public link"
            ],
            [
              "Dooz Inspected Cars",
              "Neither (NestJS)",
              "Used-car marketplace in Jordan",
              "Direct client work; Dooz hired Sameem directly for its NestJS backend",
              "dooz.com; Google Play (100K+ downloads); App Store"
            ]
          ]
        }
      },
      {
        "heading": "Does the relational versus document data model show up in these builds?",
        "body": "Not directly, and this article will not pretend otherwise. No entry names Firestore, Realtime Database or PostgreSQL in its tags or tech stack, so the data-model debate that dominates most comparison articles is absent from the portfolio's own fields. Supabase is managed PostgreSQL underneath, and Afriva's project description names PostgreSQL through Supabase; Firebase's databases are document stores.\n\nWhat the entries do show is a difference in product shape, with one exception that matters. Both Supabase builds are dashboards: Afriva gives each of its four roles a dashboard over inventory, orders and delivery, and Augment Fit is an admin panel for a fitness platform. But Waitmate, a hospitality admin dashboard for reservations, tables and staff, runs on Next.js and Firebase, so dashboards are not a Supabase-only shape here. The other Firebase builds are mostly consumer-facing: a coffee-shop site, a delivery app, a food-truck finder, a pet-care marketplace, an antiques marketplace. Those are patterns in what the products are. They are consistent with different product shapes, but they measure neither database engine."
      },
      {
        "heading": "Was Firebase the whole backend, or one service inside a larger stack?",
        "body": "In this portfolio, usually the latter. Six of the eight Firebase entries list Firebase in their tech stack. The other two, Koor and Pathana, carry the Firebase tag while declaring a different primary stack: React Native with NestJS, and Next.js with Node.js. Where an entry says what Firebase was doing, it is specific: Food Magnet's tech stack reads \"Firebase (Realtime & Notifications)\", next to AWS Lambda functions for the backend and Stripe for payments; on Koor, Firebase handles the real-time order updates beside a NestJS backend and Elasticsearch search; on Pathana, it handles authentication and data. On Pastel, Firebase sits next to Sharetribe, which runs the marketplace itself. Bondly names Firebase in its tags, tech stack and category, while its backend centres on Node.js and MongoDB, with OneSignal for push notifications.\n\nFour of the eight Firebase entries also name AWS. Supabase appears differently: both Supabase entries list it in their tech stack, it is the data layer in each, and neither names AWS anywhere in its fields."
      },
      {
        "heading": "Which platforms does each backend's group link to?",
        "body": "Of the 26 entries, 16 link to at least one public surface: 12 web, seven Google Play, seven App Store. Inside the two backend groups the pattern diverges. Neither Supabase build has a production link: Afriva's public link is a demo build on vercel.app, and Augment Fit has no public link. Neither has an app store listing.\n\nThe Firebase group is more mixed: six of eight link a web address, two of them the Coffee Shop and Waitmate builds on vercel.app, and three of eight link a store listing, with Food Magnet and Pastel on both Google Play and the App Store and Koor on Google Play. AgroBridge has no public link. The likeliest explanation for the split is what these particular products were built to be, not anything about the backends.",
        "table": {
          "caption": "Counts for the 10 tag-or-tech-stack entries, derived from the tags, tech stack, category label and web, Google Play and App Store links. Each row names what it is counted from.",
          "headers": [
            "Measure (and what it is counted from)",
            "Supabase group (n=2)",
            "Firebase group (n=8)"
          ],
          "rows": [
            [
              "Web link stored",
              "1 of 2",
              "6 of 8"
            ],
            [
              "Web link to a production site (not vercel.app)",
              "0 of 2",
              "4 of 8"
            ],
            [
              "App store listing linked",
              "0 of 2",
              "3 of 8"
            ],
            [
              "No public link",
              "1 of 2",
              "1 of 8"
            ],
            [
              "Names React.js or Next.js in tags or tech stack",
              "2 of 2",
              "4 of 8"
            ],
            [
              "Names React Native or Flutter in tags or tech stack",
              "0 of 2",
              "3 of 8"
            ],
            [
              "Backend named in the tech stack list",
              "2 of 2",
              "6 of 8"
            ],
            [
              "Backend named in the category label",
              "0 of 2",
              "3 of 8"
            ],
            [
              "Names AWS in category, tags or tech stack",
              "0 of 2",
              "4 of 8"
            ],
            [
              "Names Stripe in tags or tech stack",
              "0 of 2",
              "2 of 8"
            ],
            [
              "Employer project",
              "1 of 2",
              "5 of 8"
            ]
          ]
        }
      },
      {
        "heading": "What frontend stacks and hosting did each backend pair with?",
        "body": "Across the whole portfolio, counted from tags and tech stack, Next.js appears in six entries, React Native in six, Flutter in six, Node.js in nine and NestJS in five. Inside the backend groups the pairings are distinct. Both Supabase builds pair with the React family on the web: React.js on Augment Fit, and Next.js on Afriva, which runs Next.js 15 with the App Router. Neither names React Native or Flutter.\n\nThe eight Firebase builds spread wider: Next.js on Coffee Shop, Waitmate and Pathana; React Native on AgroBridge and Koor; Flutter with a React.js admin dashboard on Food Magnet; a Node.js service on Bondly; and on Pastel, Sharetribe with an iOS app. Hosting, as far as the links show, does not separate the groups: the one Supabase web link is a build on vercel.app, as are two of the six Firebase web links, and no entry names Vercel in its tags or tech stack."
      },
      {
        "heading": "What does the way the entries are filed tell you?",
        "body": "One more layer, because it shapes everything above: these are portfolio entries written by hand, not instrumented logs. Three of the eight Firebase entries name Firebase in their category label, against neither of the two Supabase entries. Augment Fit is filed as React.js Frontend and Afriva as Next.js & Microservices, though both run on Supabase, so anyone counting by category alone would miss the Supabase side entirely.\n\nTwenty-three of the 26 entries are flagged as featured, including both Supabase builds and six of the eight Firebase ones, which makes this a showcase rather than a census of everything Sameem has worked on. The only date on an entry is its creation timestamp. Across the 26 entries it takes five distinct dates, and both Supabase entries were created on the same day, so it marks when the entry was written, not when the work was done. No chronology is available here."
      },
      {
        "heading": "What should a team take from a portfolio of this size?",
        "body": "Take the shape, not the verdict. With 26 entries overall and a two-versus-eight split inside the comparison, nothing here establishes that either backend is faster, cheaper, more reliable or better suited to marketplaces in general. What it does show is a pattern in the products themselves. Where the product was a role-separated web dashboard with transactional workflows, as on Afriva, Supabase was the whole data layer. Where the product was mobile-first and needed real-time sync, push notifications or drop-in authentication next to AWS services, as on Food Magnet and Koor, Firebase was one component among several. Waitmate shows the pattern is not a rule: a dashboard can sit on Firebase too.\n\nRead those choices as precedents rather than as DevoraX's house view. If your brief resembles Afriva, the Supabase precedent is the relevant one. If it resembles Koor or Food Magnet, the Firebase precedent is. Neither replaces a load test, a cost model, or a spike built against your own data."
      }
    ],
    "key_findings": [
      "Of 26 portfolio entries, 10 name Supabase or Firebase in tags or tech stack: 8 Firebase, 2 Supabase, and none uses both.",
      "Neither of the 2 Supabase builds has a production link: 1 links a demo build on vercel.app and 1 has no public link. 3 of the 8 Firebase builds link an app store listing.",
      "Of 7 two-sided marketplace products in the portfolio, 4 name Firebase (Pastel's marketplace engine is Sharetribe), 1 runs on Supabase and 2 use neither.",
      "Firebase reads as a component rather than the whole backend: 2 of 8 carry the tag while declaring a different primary stack, and 4 of 8 also name AWS, against 0 of 2 on the Supabase side.",
      "Both Supabase builds are React-family web dashboards, but dashboards are not exclusive to Supabase here: Waitmate, a hospitality admin dashboard, runs on Next.js and Firebase.",
      "No entry names Firestore, Realtime Database or PostgreSQL in its tags or tech stack, so the data-model debate is absent from the portfolio's own fields."
    ],
    "limitations": [
      "n=26 entries from one portfolio, with only 2 Supabase and 8 Firebase builds in the comparison; group sizes this small cannot support a general recommendation, and 2 builds cannot characterise Supabase at all.",
      "Backend selection was driven by briefs, budgets, employers and pre-existing systems, so the two groups are not comparable populations and were never randomly assigned.",
      "The portfolio holds no outcome, cost or performance data for any build, so nothing here can be read as a scoreboard.",
      "Backend attribution relies on hand-maintained tags and tech stack lists. Outstride, CEDMAT and ConstrActive name a backend only in their written description, so they are reported separately rather than merged into the headline counts.",
      "The marketplace group is a classification of what each product is, made for this article, not a field in the data.",
      "23 of the 26 entries are flagged as featured, so this is a curated showcase, not a complete census.",
      "The only date on an entry is its creation timestamp, which marks when the entry was written, not when the work was done. No timeline analysis is possible.",
      "Entries describe finished state, not process. Nothing captures what was tried and abandoned, what was migrated, or what a build cost to maintain after handover."
    ],
    "cannot_answer": [
      "Which backend is faster. No load tests, latency measurements or throughput benchmarks were run on any build in this dataset.",
      "Which backend is cheaper to run. No hosting invoices, pricing tiers or cost-per-user figures exist in the portfolio, at any scale.",
      "How development time or effort compared. No developer-hours, sprint counts, timelines or team sizes are recorded for any entry.",
      "How the two behave under scale or contention. Nothing here measures concurrent writes, hot partitions, query performance on large tables, or read amplification.",
      "Whether row-level security or Firestore security rules proved easier to get right. No security review findings or incident records are in the dataset.",
      "How migration between the two goes. No build in the portfolio moved from one backend to the other.",
      "Whether either backend affected any product's commercial results. The portfolio holds no outcome data, no control group and no baseline.",
      "Whether Supabase can back a native mobile app in practice. Neither Supabase build names a mobile framework, so the portfolio has no example either way.",
      "How either compares to alternatives not used here, such as raw Postgres, PlanetScale, AWS Amplify or Appwrite.",
      "Bundle size, cold-start behaviour or offline sync quality on mobile. These were never captured in any entry."
    ],
    "word_count": 2712,
    "updated": "2026-11-08T00:00:00.000Z"
  },
  {
    "slug": "sharetribe-vs-custom-marketplace-build",
    "title": "Sharetribe vs Custom Marketplace Development: Where the Line Actually Falls",
    "seo_title": "Sharetribe vs Custom Marketplace Development",
    "published": "2026-09-17T00:00:00.000Z",
    "meta_description": "Where Sharetribe is the right answer, where a custom marketplace build is, and how that line falls in three real marketplaces from the DevoraX portfolio.",
    "summary_answer": "Use Sharetribe when your marketplace is a standard listing-and-commission transaction and you have not yet proved supply. For a large share of marketplaces that is the permanent answer, not a stage. Build custom when the domain data model, the role surfaces or native apps are the product. The line can also run through one project: Pastel, the antiques marketplace where DevoraX's founder Sameem Amjad works as a Senior Software Developer on Pastel's team, as Pastel's employee, runs its marketplace on Sharetribe and adds iOS and Android apps, which Sharetribe does not produce by default. Nobody built the fully custom alternative, so read that as description, not verdict.",
    "dataset_note": "Three marketplaces from the DevoraX portfolio sit behind this piece. One is an employer project: Sameem Amjad, DevoraX's founder, works on Pastel's iOS app as a Senior Software Developer on Pastel's team, as Pastel's employee (since April 2026; the iOS app launched in November 2025, before he joined; DevoraX work is separate from his job at Pastel). Afriva was built for a DevoraX client, and its live demo has shopper and seller logins. The third, Dooz, is his direct client work: Dooz hired him directly, and he worked on its shared NestJS backend. Nobody ran a paired build, a cost model or a migration, and DevoraX has never operated Sharetribe or a Shopify multi-vendor app as a whole platform. A portfolio cannot show what failed.",
    "sections": [
      {
        "heading": "What is actually being compared here?",
        "body": "Three options are on the table, not two. The first is a hosted marketplace product such as Sharetribe, where the vendor operates the infrastructure and supplies the marketplace transaction as a configurable process: enquiry, payment, fulfilment, completion, commission, payout. You configure it; you do not deploy it.\n\nThe second is an existing commerce platform with a multi-vendor app layered on top, most commonly Shopify. It gets a section of its own below rather than a column in the table.\n\nThe third is a custom application, where the data model, the role surfaces and the hosting are yours. The binary in the question is false in one important way: Sharetribe sells both a no-code hosted product and a developer platform that exposes the same transaction engine over an API. A custom frontend on a bought transaction layer is a real position, and it is the one most comparisons omit.",
        "table": {
          "caption": "Structural differences between a hosted marketplace product and a custom build, described as general characteristics rather than a feature scorecard. No pricing appears here, and Shopify with a multi-vendor app is covered in its own section below.",
          "headers": [
            "Dimension",
            "Hosted marketplace product (Sharetribe-type)",
            "Custom build"
          ],
          "rows": [
            [
              "Who operates the infrastructure",
              "The vendor",
              "You, or an agency you pay"
            ],
            [
              "Transaction process",
              "Supplied as a configurable process that the web marketplace and any native app read as a modelled state machine",
              "Whatever you model, at the cost of modelling it"
            ],
            [
              "Data model",
              "Users, listings and transactions as the platform defines them, extended with custom fields",
              "Yours to define: Dooz attaches an inspection report and grade to every car, and buyers can filter by it"
            ],
            [
              "Setup work",
              "Configuration",
              "Engineering, plus environments, CI and hosting"
            ],
            [
              "Native iOS and Android apps",
              "Not the default path; a native client is a custom build against the API",
              "Pastel and Dooz both have iOS and Android apps"
            ]
          ]
        }
      },
      {
        "heading": "Why does Pastel run on Sharetribe and still need custom apps?",
        "body": "Pastel is an antiques and vintage marketplace built on Sharetribe, with its web marketplace at mypastel.com and apps on the App Store and Google Play. Since April 2026 Sameem Amjad, DevoraX's founder, has worked on its iOS marketplace app as a Senior Software Developer on Pastel's team, as Pastel's employee. Pastel is his employer, not a DevoraX client, so the choice of Sharetribe was Pastel's, and DevoraX work is separate from his job at Pastel.\n\nThe reasoning behind that kind of choice is worth setting out. A marketplace payment is not a checkout. Money moves from a buyer to the platform, is held while a one-of-one antique is packed and shipped, and is released to the seller only once the exchange completes, with commissions, refunds, disputes and cross-border payouts attached. That surface area is larger than the storefront itself.\n\nSharetribe supplies it as a modelled state machine built for two-sided commerce, so the web marketplace and the apps read a transaction's current state rather than taking custody of funds. The custom engineering sits where Sharetribe stops: it does not produce iOS and Android apps by default, so those are separate builds. What Pastel does not tell you is whether a fully custom marketplace would have served it better. Nobody built that version, so the example shows the split is workable, not that it was the best possible choice."
      },
      {
        "heading": "When is Sharetribe clearly the right answer?",
        "body": "There are four situations in which DevoraX would tell you not to hire it for a custom build, and they are common. First, you have not proved supply. A marketplace with no sellers has nothing to transact, and no framework choice changes that; the portfolio holds no failure data, so treat that as mechanics rather than a finding. Until sellers list and buyers pay, every engineering hour funds a hypothesis.\n\nSecond, your transaction is standard: list, buy or book, pay, fulfil, release, commission. Third, your differentiation is not software, because curation, community and category expertise are not code. Fourth, your budget is below the build, and DevoraX's published starting price for a new build is $2,900.\n\nOne thing worth being plain about, because vendor pages are not: for many marketplaces the hosted product is the permanent answer rather than a stage before a custom build. A configured marketplace taking real money is a finished business, not a prototype. That you will inevitably outgrow it is a sales line, and there is no evidence for it here."
      },
      {
        "heading": "When is Shopify with a multi-vendor app the better choice?",
        "body": "DevoraX has never built this arrangement, so nothing here comes from the portfolio. It is described only as its vendors describe it: Shopify is a commerce platform for running a store, and multi-vendor capability is added by third-party apps installed on top.\n\nIt is right when you are the merchant of record and your vendors are really suppliers. If the catalogue behaves like products with variants and stock levels, if one party owns the customer relationship, and if you want an existing payments, tax and shipping ecosystem without integrating it, take that route. Configuration is less work than construction, and DevoraX's custom starting price is $2,900 before any change budget. For that reader this is the destination, not a stepping stone.\n\nThe requirements that push a marketplace like Afriva onto its own schema are the ones a multi-vendor app would have to express: four role-separated dashboards (admin, manager, seller and buyer), each seeing only the slice of data its role is entitled to, and a checkout that may split into several sellers' shipments on independent timelines. Whether a given app expresses those is a question for its documentation."
      },
      {
        "heading": "What did Pastel, Afriva and Dooz need that an off-the-shelf product does not give you?",
        "body": "Three marketplaces in the DevoraX portfolio are the evidence this article rests on, each needing custom code for a different reason. The portfolio was not audited for every product that might be called marketplace-shaped, so read three as the evidence behind this piece, not a census.\n\nPastel is the case where very little of the marketplace is custom: listings, sellers and transactions run on Sharetribe, and the custom work is the iOS and Android apps that buyers and sellers use on their phones. Afriva, a four-role marketplace on Next.js 15 and Supabase, needs a dashboard per role over one managed Postgres schema, stock that stays correct when one item enters several baskets at once, and order status that updates in real time rather than on refresh.\n\nDooz, a used-car marketplace in Jordan, needs an inspection report attached to every car, with the inspection grade usable as a search filter, and financing and insurance offered alongside the listings. The common thread is that the custom part is the data model or the surfaces.",
        "table": {
          "caption": "The three marketplaces behind this article, with the context of Sameem's work on each and where each can be seen today.",
          "headers": [
            "Marketplace",
            "Transaction layer",
            "What pushed it to custom code",
            "Context",
            "Where you can see it"
          ],
          "rows": [
            [
              "Pastel (Sharetribe, Firebase, iOS app)",
              "Sharetribe",
              "iOS and Android apps, which Sharetribe does not produce by default",
              "Sameem works on Pastel's iOS app as a Senior Software Developer on Pastel's team, as Pastel's employee, since April 2026",
              "mypastel.com; App Store; Google Play"
            ],
            [
              "Afriva (Next.js 15, Supabase)",
              "Not named in the portfolio; order and inventory state sit in the platform's own Postgres schema",
              "Four role dashboards (admin, manager, seller, buyer), real-time order tracking",
              "Built for a DevoraX client",
              "Demo build at afriva-buyer.vercel.app"
            ],
            [
              "Dooz Inspected Cars (Angular, React Native, NestJS)",
              "Not named in the portfolio; one NestJS backend serves the web, iOS and Android apps",
              "An inspection report and grade on every car, financing and insurance alongside the listings",
              "Direct client work: Dooz hired Sameem directly for the shared NestJS backend",
              "dooz.com; Google Play (100K+ downloads); App Store"
            ]
          ]
        }
      },
      {
        "heading": "How do the cost shapes actually differ?",
        "body": "The headline price is the least interesting number in this decision, and it is also the one this article is least able to give you. A hosted product is operating expenditure: a subscription plus payment processing, with no capital outlay. A custom build is capital expenditure plus a change budget, and it is the change budget that kills projects rather than the build price.\n\nDevoraX's own model for a new build is a fixed-price proposal rather than hourly billing, with indicative starting points of $2,900 for an MVP Starter and $7,500 for Growth, and Enterprise quoted per project. Those are starting points, not quotes. Nothing shaped like Dooz, with web, iOS and Android apps over one shared backend, an inspection report on every listing and financing and insurance alongside, fits the smaller band.\n\nThis article will not tell you what the alternatives cost. Two things are worth pricing yourself: the configuration, design and data-migration labour a hosted setup still takes, and what a custom build does at ten times the volume, where re-architecture is an engineering ticket like any other.",
        "table": {
          "caption": "Where each cost number has to come from. The only figures stated here are DevoraX's own published prices; no third-party pricing is quoted anywhere, because DevoraX holds no invoices and ran no cost model.",
          "headers": [
            "Cost line",
            "What DevoraX can state about its own pricing",
            "Where the real number has to come from"
          ],
          "rows": [
            [
              "Build or setup",
              "For a new build, fixed-price proposals starting at $2,900 (MVP Starter) and $7,500 (Growth), Enterprise quoted per project. Indicative starting points, not quotes.",
              "Any setup cost on a hosted product, including configuration, design and data-migration labour, has to come from whoever does that work."
            ],
            [
              "Subscription",
              "No platform subscription, and DevoraX does not resell hosting: you pay your own infrastructure providers directly. Every build includes 35 days of free maintenance after launch for bugs in what was built; after that, fixes, updates and new releases go through monthly care at $1,500 a month, or a single release quoted per change.",
              "The vendor's current pricing page. Hosted marketplace products and commerce platforms are sold as tiered subscriptions; multi-vendor apps are priced by their own publishers, on models that vary."
            ],
            [
              "Payment processing",
              "DevoraX sets up Stripe payments from $1,200, and Stripe Connect payouts to sellers from $2,400. It does not set processing rates and holds no invoices.",
              "Your payment processor's current rates, plus any platform fee a marketplace product takes on top of them. Both have to be read from current terms."
            ],
            [
              "Cost of a change",
              "On a custom build, every change is an engineering ticket that someone has to scope, price and schedule.",
              "On a configured product, a change is available only within what the product supports. Whether yours is supported is a question for the vendor's documentation."
            ],
            [
              "What you hold at the end",
              "DevoraX contracts transfer the code and IP to you on final payment.",
              "What a vendor account leaves you with if you stop paying is set by that vendor's terms. DevoraX has not tested any of them."
            ]
          ]
        }
      },
      {
        "heading": "Which parts should you never build yourself, even inside a custom build?",
        "body": "Even when the answer is custom, the answer is not custom everywhere. Pastel is the worked example: Sharetribe runs the marketplace and owns the transaction, so money movement, the component carrying the most legal and financial risk, was bought, and the engineering effort goes into the mobile apps that Sharetribe does not supply.\n\nThe rule worth applying is simple. If a component is regulated, adversarial, or maintained against somebody else's changing API, buy it. Multi-carrier shipping is the clearest case: a framed print, a chandelier and a chest of drawers share no packaging profile, dimensional weight or obvious carrier, and sellers are not logistics professionals.\n\nDooz shows the same rule at a different boundary. The part that makes it a product, an inspection report and grade on every car that buyers can search by, is the part worth owning. Financing and insurance sit alongside the listings, and in a product of this kind the quotes behind them typically come from partners, on someone else's latency budget."
      },
      {
        "heading": "What does this portfolio prove about the choice, and what does it not?",
        "body": "Less than the confidence of these headings suggests, so here are the bounds. DevoraX is a two-person studio that has been building since 2022. Its Fiverr profile, which is in Sameem Amjad's name, shows a 5.0 rating across 50+ projects since January 2022, for clients in the US, UK, Canada and Hong Kong. Two of the three marketplaces here are employer projects, and Dooz hired Sameem directly. A portfolio is by construction a record of what went well enough to show, so nothing cancelled or abandoned would appear in it.\n\nNobody has built the same marketplace twice, once hosted and once custom. There is no paired test, no migration in either direction and no instrumentation of either approach.\n\nDevoraX is also an interested party. It sells custom builds, and the four situations listed earlier are precisely the ones where it loses the custom-build sale. They are here because for a large share of readers the honest answer is a product DevoraX did not build."
      },
      {
        "heading": "How should you decide, in order?",
        "body": "Answer four questions in sequence, stopping at the first clear no. Has supply proved itself? If sellers are not already listing, buy a hosted marketplace and spend the difference on recruiting them. For many marketplaces that is where this decision ends permanently, and there is nothing second-best about ending it there.\n\nDoes your transaction fit a standard process: list, buy or book, pay, fulfil, release, commission? If it does and your catalogue is ordinary too, a configured product is the finished answer and you should stop here rather than build around it. Stopping here does not rule out custom work later: Pastel runs its marketplace on Sharetribe and adds mobile apps on top.\n\nDoes your domain need a data model the platform does not have: structured inspections, provenance, role-separated tenancy, multi-shipment orders? Do you need surfaces it does not produce, as Pastel and Dooz do with iOS and Android apps? Reach the fourth question with yes answers and a funded change budget, and a custom build is defensible."
      }
    ],
    "key_findings": [
      "The build-versus-buy line can run through the middle of one product rather than around it: Pastel runs its marketplace on Sharetribe and has iOS and Android apps, which Sharetribe does not produce by default.",
      "In all three marketplaces the custom part that defines the product is the data model or the surfaces: Afriva has four role dashboards, Dooz attaches an inspection report to every car, and Pastel's custom work is its mobile apps on a Sharetribe marketplace.",
      "Pastel and Dooz both have native iOS and Android apps, which a hosted web marketplace product does not produce by default.",
      "For a marketplace with a standard transaction, an ordinary catalogue and unproven supply, a hosted product is the permanent answer rather than a stage before a custom build. Nothing in the portfolio shows anyone outgrowing one, because it contains no such case either way.",
      "DevoraX's published custom starting points are $2,900 (MVP Starter) and $7,500 (Growth), and nothing shaped like Dooz fits the smaller band, so for some specifications the honest answer is to cut scope or stay hosted.",
      "One of the three is an employer project: Pastel, where Sameem has been a Senior Software Developer on Pastel's team, as Pastel's employee, since April 2026. Afriva was built for a DevoraX client, and Dooz hired Sameem directly to work on its shared NestJS backend."
    ],
    "limitations": [
      "Three marketplaces inside a 26-entry portfolio from a two-person studio. A portfolio is selection-biased by construction: no cancelled, abandoned or failed marketplace could appear in it, and the portfolio was not audited for every product that might be called marketplace-shaped.",
      "One of the three is an employer project, one was built for a DevoraX client and the third was Sameem's direct client work. No entry records a scope or price for any of them, so none shows how DevoraX itself scopes or prices a marketplace.",
      "Nobody built the same marketplace twice, once on a hosted product and once custom. There is no paired test, no A/B and no migration in either direction, so every comparison here is engineering reasoning rather than measurement.",
      "DevoraX has not run Sharetribe or a Shopify multi-vendor app as an entire platform. The direct experience of Sharetribe behind this article is Pastel, where Sameem works on the iOS app as Pastel's employee, which is why the structural table has no Shopify column.",
      "The portfolio holds no outcome data for these marketplaces, and even if it did, too much else differs between the three businesses for it to show whether build-versus-buy was the right call.",
      "DevoraX sells custom builds, so it has a commercial interest in this answer. The only prices in this article are its own published prices, and the build tiers among them are starting points, not quotes; no third-party pricing is stated anywhere, including in the cost table."
    ],
    "cannot_answer": [
      "What Sharetribe, Shopify or any multi-vendor app will cost you at your transaction volume. DevoraX holds no invoices and quotes no third-party prices, so those figures have to come from the vendors' current terms.",
      "Whether Pastel would have done better on a fully custom marketplace, or Afriva on an off-the-shelf product. No counterfactual was built, so the comparison is untested.",
      "Whether the build-versus-buy decision made any of these businesses more or less successful. There is no outcome data, no control group and no baseline.",
      "How hard it is to migrate from a hosted marketplace to custom code, or back. No product in the portfolio has made that move."
    ],
    "word_count": 3025,
    "updated": "2026-11-08T00:00:00.000Z"
  },
  {
    "slug": "what-a-3000-mvp-budget-gets-you",
    "title": "What a $3,000 MVP Budget Actually Gets You (And What It Does Not)",
    "seo_title": "$3,000 MVP Budget: What It Buys, What It Doesn't",
    "published": "2026-09-17T00:00:00.000Z",
    "meta_description": "What a $3,000 MVP budget buys and what it does not, checked against the published $2,900 DevoraX starting tier and five web builds from its portfolio.",
    "summary_answer": "Roughly $3,000 buys one working surface for one primary audience, a narrow set of features, and a managed stack you do not have to operate. It does not buy role-separated dashboards, an app-store release, verified multi-tenancy or a security assessment. What it depends on is roles: each additional kind of user adds a surface, a permission boundary and a full test pass. If your difference from an off-the-shelf product is a preference rather than a rule, rent instead.",
    "dataset_note": "This draws on the 26 entries in the DevoraX portfolio, products that DevoraX's founder, Sameem Amjad, built or worked on, many as an engineer at other companies, and examines five web builds closely: Coffee Shop, Augment Fit, Waitmate, Pathana and Afriva. None of the five comes with a recorded price: two were employer work (Coffee Shop at Fleact Tech and Pathana at ivector), Afriva was built for a DevoraX client, and Augment Fit and Waitmate have no named client. No entry stores a price, timeline, team size or developer-hour count, so nothing here evidences what any build cost. The five are used for their scope shapes only.",
    "sections": [
      {
        "heading": "What does a $3,000 MVP budget actually buy?",
        "body": "A budget in that range buys one working surface, for one primary audience, doing a small number of things well, on a managed platform somebody else operates. DevoraX's published starting points are an MVP Starter from $2,900, Growth from $7,500 and Enterprise scoped individually. Those are starting points rather than quotes: every new build is priced as a fixed sum in a proposal written after a free 30-minute discovery call, and DevoraX does not bill hourly. None of the 26 portfolio entries behind this article stores a price, so the builds below show scope, not cost.\n\nWhat the portfolio does support is a description of scope shapes, and the smallest shape among the five examined here is the Coffee Shop Web App, a cafe website Sameem built as an engineer at Fleact Tech, hosted on Vercel at coffee-shop-original.vercel.app. One public web surface. One audience, the customer. Four named features: a menu with prices, a gallery, store locations and an order button. A stack of Next.js with server-side rendering and Firebase for menu content, which means no server to run and no database to operate. No second operational surface, no separate admin product, no real-time requirement, no mobile release. That is the shape a starting-tier budget can hold: a single front door, a single kind of user behind it, and content a non-developer can keep current. Read it as a scope illustration and not as a recommendation, because a later section explains why a reader arriving with exactly that brief should rent instead."
      },
      {
        "heading": "Why is $3,000 a scope number rather than a price?",
        "body": "Because the fixed price is the output, not the input. A proposal prices a defined scope, so the only thing a smaller budget can move is what sits inside that scope. That is a more useful conversation than asking for a discount on a rate, and it is why the discovery call happens before the number. It helps to know the shape of the supplier too. DevoraX has been operating since 2022 and is two people, Sameem Amjad and Usman, who work on every sprint together. Sometimes a designer or another specialist joins a project, and DevoraX names them to the client before they start. No portfolio entry holds any cost accounting, no price, no hours and no allocation, so this article will not explain the tier by describing an overhead structure nobody measured. What the DevoraX site does publish alongside the price is the working arrangement: every week a video demo of progress and a short written update, plus a shared project board (Jira, Linear, Trello or similar) and a Slack or WhatsApp channel with Sameem and Usman.\n\nWhat actually moves the number is structural rather than cosmetic. How many distinct kinds of user need their own screens. Whether money changes hands inside the product. Whether anything has to stay correct under contention, such as a seat, a table or a unit of stock two people can claim at the same moment. Whether the product must exist in an app store as well as a browser. Whether the data is sensitive enough that isolation between tenants has to hold by construction rather than by careful coding. Each of those is a step change, not a percentage increase, because each adds a surface, a permission boundary and a set of failure cases somebody has to test. Colour schemes, copy and the number of marketing pages are small against any of them. Timelines follow the same logic: any duration in a proposal is an estimate for that scope, and no portfolio entry stores how long a build actually took."
      },
      {
        "heading": "What does scope actually look like across five web builds?",
        "body": "Five of the 26 portfolio entries are useful calibration here, because they are web products described in enough detail to count surfaces and roles, and they sit at visibly different levels of scope. Be clear about what they are before reading the table. Pathana is live at pathana.net. Coffee Shop is hosted at coffee-shop-original.vercel.app, and Waitmate's and Afriva's public links are demo builds on vercel.app. Augment Fit has no public link. Three of the five were employer work, as the Context column shows. All five are web-only, and that is a property of which five were picked rather than of the budget or of the market: nine of the 26 entries link a live Google Play or App Store listing.\n\nRead the table by counting surfaces and roles rather than features. Coffee Shop has one of each. Augment Fit is one admin panel with dashboards for two named roles, trainers and clients. Waitmate is a hospitality admin dashboard for reservations, tables and staff. Pathana is the instructive one: one platform where three parties, students, counsellors and families, get shared views of the same plans, so the roles multiply while the surfaces do not. Afriva has four separate role dashboards. Named feature counts stay inside a narrow band of three to four across all five, which is the point, because features are cheap relative to the number of places and permission levels each one has to be correct in. No entry stores a price, so the table has no column placing any build against the DevoraX tiers.",
        "table": {
          "caption": "Five web builds from the DevoraX portfolio by described scope. No column here is a price or a price proxy: no entry stores what any build was sold for, so this table cannot be read against the published tiers.",
          "headers": [
            "Build",
            "Public link today",
            "Context",
            "Surfaces described",
            "Distinct user roles described",
            "Named features",
            "Real-time requirement named"
          ],
          "rows": [
            [
              "Coffee Shop Web App",
              "Web build (coffee-shop-original.vercel.app)",
              "Engineer at Fleact Tech",
              "1 (public site)",
              "1 (the visiting customer)",
              "Menu with prices, gallery, store locations, order button",
              "No"
            ],
            [
              "Augment Fit Platform",
              "None",
              "No client named",
              "1 admin panel, with dashboards for trainers and clients",
              "2 named (trainers, clients)",
              "Session and progress dashboard, user-growth tracking, BMI classification, workout-plan builder",
              "No"
            ],
            [
              "Waitmate Platform",
              "Demo build (waitmate.vercel.app)",
              "No client named",
              "1 (admin dashboard)",
              "Not enumerated",
              "Reservations, table management, staff management, multi-location views",
              "No"
            ],
            [
              "Pathana Platform",
              "pathana.net",
              "Engineer at ivector",
              "1 (one platform; no separate surfaces described)",
              "3 (students, counsellors, families) with shared views",
              "Personalised roadmaps, milestone tracking, career exploration, shared views",
              "No"
            ],
            [
              "Afriva E-Commerce Platform",
              "Demo build (afriva-buyer.vercel.app)",
              "DevoraX client",
              "4 role dashboards (admin, manager, seller, buyer)",
              "4 (admin, manager, seller, buyer)",
              "Inventory and pricing, order status, real-time delivery tracking",
              "Yes (real-time delivery tracking)"
            ]
          ]
        }
      },
      {
        "heading": "What does a $3,000 budget specifically not buy?",
        "body": "It does not buy role separation. Four role dashboards like Afriva's are four products sharing a schema: each queries a different slice of the data, each enforces a different permission set, and a change to seller tooling must not quietly regress the buyer checkout path. That is a property of the architecture, not evidence of a process. The portfolio holds no test matrix, review step or release procedure for any entry, so nothing here should be read as a description of how DevoraX tests. It does not buy institutional multi-tenancy either. A product like Pathana, where counsellors and families see students' records, has to keep each student's data visible only to the right people by construction rather than by careful coding, and the portfolio documents no assessment of how any build does that.\n\nIt does not buy a native release. All five reference builds are web products, while nine of the 26 entries link a live store listing, and a store release is a second build with its own review process and its own release cadence. It does not buy assurance: none of the five has a penetration test, a security assessment, a load test or an uptime SLA behind it, and DevoraX holds no certifications and has run no compliance audits. A starting-tier build includes 35 days of free maintenance after launch, for bugs in what was built, with new features quoted separately; after that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change, and the code and IP are yours on final payment."
      },
      {
        "heading": "When is the honest answer not to hire an agency like DevoraX at all?",
        "body": "Frequently, and here is the version with no hedge on it. If you are a single-location cafe, restaurant, salon, gym or retailer who needs a branded site with a menu or catalogue and online ordering, rent. Hosted commerce platforms and site builders solve that exact shape as a subscription, and they arrive with payment handling, hosting, updates and a support contract that keeps renewing for as long as you pay. That is the Coffee Shop scope shape, and renting is the right answer for a reader arriving with that brief today. The same holds for appointment and session booking for a small team, and for an internal dashboard over data you already hold.\n\nThe table below is deliberately two-sided, because owning software has costs as surely as renting it does. Renting is a fee that never stops and a data model you configure rather than design. Owning is a hosting bill, a maintenance burden, support only for as long as it is contracted (35 days of free maintenance at the DevoraX starting tier, then monthly care or a single release quoted per change), and key-person risk with a two-person supplier. The test you can apply on your own is whether the thing your product does differently is a preference or a rule. If your difference is a preference, your own brand, your own layout, your own copy, rent. If it is a rule the hosted product cannot express, this capacity is contested, this payout splits four ways, this record is legally restricted, that is where custom starts earning the money. Afriva has four role dashboards; whether that could have been rented, nothing in the portfolio says.",
        "table": {
          "caption": "Where renting usually beats custom at this budget, and what renting costs in return. Third-party products are described by commercial model and positioning only. No current price is quoted for any of them, packaging in this space changes, and each vendor should be checked directly.",
          "headers": [
            "If your brief is...",
            "Mature rentable category",
            "What renting costs you",
            "What custom costs you",
            "When custom is the honest answer"
          ],
          "rows": [
            [
              "A brand site with a menu or catalogue and online ordering",
              "Hosted site builders and hosted commerce platforms, Shopify and Squarespace among them, sold as a subscription",
              "A recurring fee for as long as you use it, and a catalogue and checkout you configure rather than design",
              "Your own hosting bill, your own upgrades, and support only for as long as it is contracted; the DevoraX starting tier includes 35 days of free maintenance after launch, then monthly care at $1,500 a month, or a single release quoted per change",
              "When the ordering, pricing or fulfilment logic genuinely will not fit the platform's model"
            ],
            [
              "Appointment or session booking",
              "Hosted scheduling products, Calendly among them, sold as a subscription",
              "A recurring fee that commonly scales with the number of users, and booking rules limited to what the product expresses",
              "Contention handling, calendar sync and notifications all become yours to build and then to keep working",
              "When capacity, contention or multi-location rules exceed what the product can express"
            ],
            [
              "A two-sided marketplace",
              "Marketplace platforms, Sharetribe among them, sold as a subscription rather than built from scratch",
              "A recurring fee, and a transaction, role and payout model you configure rather than design",
              "Payments, payouts, disputes and vendor onboarding all become yours to build and to operate",
              "When the role, fulfilment or payout model on offer cannot express your transaction"
            ],
            [
              "An internal dashboard over data you already hold",
              "Internal-tool and low-code builders, Retool among them, sold as a subscription",
              "A recurring fee that commonly scales with the number of users, and an interface assembled from the product's own components",
              "Build time before anyone can use it, plus ongoing maintenance of a tool that earns no revenue directly",
              "When the dashboard is a product your customers see rather than an internal tool"
            ]
          ]
        }
      },
      {
        "heading": "How much does each additional user role really cost?",
        "body": "Roles are the multiplier that ruins budgets, and they are almost never counted properly at the start. Each distinct kind of user adds three things at once. It adds a surface, because a screen trying to serve two mandates usually serves neither; Augment Fit, for example, puts separate dashboards for trainers and for clients inside one admin panel. It adds an authorisation boundary, because cross-account visibility is exactly the capability an ordinary account is designed to withhold, and that boundary has to be enforced where the data lives rather than in each screen that reads it. And it adds a test matrix, because every feature now has to be verified once per role that can reach it.\n\nPathana illustrates the third cost most clearly, and it does so without adding a single surface. Three parties look at one student's record with three different mandates: the student owns the work, the counsellor advises and intervenes, the family needs visibility without editing rights that would distort the record. That is one data model and three correct answers to the question of what this screen shows, and getting it wrong in a product holding students' records is not a cosmetic defect. The planning consequence is the one people resist: a second role is not ten per cent more work, and a fourth role is not four times the first, because boundaries multiply where features add. If your brief names three kinds of user in its first sentence, a starting-tier budget is the wrong frame for it, and the useful move is to cut to one role and ship, not to compress three."
      },
      {
        "heading": "Can a portfolio tell you what a budget buys?",
        "body": "No, and it is worth being exact about why. A portfolio entry describes a product, not a price. None of the 26 entries stores what a build cost, how long it took or who paid for it, and the five examined here are not DevoraX price points in disguise. Reading any portfolio as a price signal, this one included, is the specific error this article exists to prevent.\n\nOne structural caution about the dataset itself: 26 entries is small, it is one engineer's body of work across several employers and projects, and this article chose which five to examine. No entry stores a delivery, launch or failure status of any kind, so the portfolio cannot tell you how many projects ran late, ran over or were abandoned. What it can tell you is that sixteen of the 26 entries link to something public, three of those links are builds on vercel.app rather than production sites, and ten link to nothing. A portfolio is not a base rate."
      },
      {
        "heading": "What should you actually do with roughly $3,000?",
        "body": "Three answers, and only one of them involves hiring anybody. If your product is the default shape of a category with mature hosted products in it, rent one, spend nothing on engineering, and revisit in a year when you know which constraint actually hurts. That is the answer for anyone whose difference from the category default is a preference rather than a rule, and the Coffee Shop scope shape sits squarely inside it. If your product has one primary audience, a handful of features, and one rule the hosted products cannot express, a starting-tier custom build is a real option: one surface, one audience, a managed backend, a live link at the end. If your brief names three user roles, a store release, a compliance obligation or contention over finite capacity, this budget buys a half-built version of that, and the move is to cut to one role and ship it rather than to find a supplier who will agree to all of it at this price.\n\nTwo practical notes if you do spend it. Keep some of it back. A starting tier includes 35 days of free maintenance after launch, for bugs in what was built, and after that fixes and updates come from monthly care, a single release quoted per change, or your own budget, so a budget entirely consumed at launch leaves nothing for them, nothing for new features and nothing for the hosting bill either. And insist the scope is written down as a fixed price against a specific list before anyone starts, which is how DevoraX works and is the only structure under which a small budget is safe for both sides. If a supplier cannot tell you what falls out of scope at your number, they have not scoped it, and the shortfall surfaces later as either an invoice or an argument. Ask the same supplier what they would tell you to rent instead, because the answer tells you what the proposal is really for."
      }
    ],
    "key_findings": [
      "All five reference builds are web products, a property of the selection rather than of the budget: 9 of the 26 portfolio entries link a live Google Play or App Store listing.",
      "Surfaces and roles, not features, separate the five: Coffee Shop has one surface and one audience, Augment Fit one admin panel serving two named roles, Waitmate one admin dashboard, Pathana one platform with three parties sharing views, and Afriva four role dashboards, while named feature counts stay within a band of three to four throughout.",
      "No portfolio entry stores a price, a timeline or a team size, so none of the five named builds is evidence of what $2,900 buys.",
      "DevoraX's published starting points are MVP Starter from $2,900, Growth from $7,500 and Enterprise custom-scoped, each priced as a fixed sum in a proposal after a free 30-minute discovery call. The MVP Starter includes 35 days of free maintenance after launch, for bugs in what was built; after that, fixes and new releases go through monthly care at $1,500 a month, or a single release quoted per change.",
      "None of the five has a penetration test, a security assessment, a load test or an uptime SLA behind it, and DevoraX holds no certifications and has run no compliance audits.",
      "16 of the 26 entries link to something public, 3 of those links are builds on vercel.app rather than production sites, and 10 link to nothing. No entry stores a delivery, launch or failure status, so the portfolio cannot be read as a success rate in either direction."
    ],
    "limitations": [
      "n=26 portfolio entries, the body of work of a two-person studio's founder, and this article chose which five to examine. No entry stores a delivery, launch or failure status, so nothing here estimates the odds of a $3,000 build succeeding.",
      "The five examined builds illustrate scope shapes, not DevoraX pricing.",
      "No price, effort, duration or team-size data exists in any entry. Every statement about what a budget buys rests on scope shape and general engineering reasoning, not on cost accounting.",
      "The five builds were selected for being web products described in enough detail to count surfaces and roles, which is why all five are web-only. The 9 store-listed entries in the portfolio are not represented here, so this article says nothing about what a mobile build involves.",
      "Only one of the five, Pathana, is a live production site; three are builds on vercel.app and one has no public link, so their scope is described from the portfolio rather than from a product you can inspect in full.",
      "Third-party products are described by commercial model and positioning only. No current price is quoted for any of them, packaging in this space changes, and the right build-versus-rent answer changes with it."
    ],
    "cannot_answer": [
      "What any of the five named builds cost. No entry stores a price, so the relationship between these scopes and the published DevoraX tiers is inference, not evidence.",
      "How long any build actually took. No entry stores a real duration, sprint count or developer-hour figure.",
      "What a build costs to run and maintain after handover. No hosting invoices, platform bills or post-launch support costs exist anywhere in the portfolio.",
      "Whether $2,900 is competitive against other suppliers. DevoraX holds no competitor quotes and did not price-check anybody for this article."
    ],
    "word_count": 3484,
    "updated": "2026-11-08T00:00:00.000Z"
  },
  {
    "kind": "checklist",
    "slug": "vibe-coded-app-security-checklist",
    "title": "The vibe-coded app security and launch checklist",
    "seo_title": "Vibe Coding Security Checklist for App Launch",
    "meta_description": "Vibe coding security checklist for Lovable and other AI-built apps: a test for every check, App Store review items and what Lovable's own scan covers.",
    "summary_answer": "A vibe coding security checklist tests your app the way a stranger would. Before launch, four answers should be no. Can a signed-out visitor read private rows? Is a secret key in your app's JavaScript? Can anyone unlock paid features without a verified payment? Is any account the app runs on held outside your company? Each of the 50 checks below comes with a test you can run yourself, ending with what Apple and Google check before a mobile app goes live. Run them alongside Lovable's own scans. As of November 2026, the Quick scan runs at every publish and the Deep scan when someone starts it (or on an Enterprise schedule), and Lovable's docs say neither replaces \"a thorough security review\". The tests assume Lovable with Supabase or its built-in backend; Base44, Bolt, Replit and Cursor apps need the same checks in other settings.",
    "dataset_note": "This vibe-coded app security checklist assumes two test accounts, A and B, each with some data, plus a private browser window and the DevTools Network tab. A few tests use a SQL editor (Supabase's, or More → Database → Manage on Lovable's built-in backend) or curl in a terminal. Run the abuse tests with your test accounts and your own email address and phone number, and delete test content afterwards. Every platform fact, figure and menu path was read on 7 November 2026 from that platform's own pages, which the text names. This is not a penetration test or a certification, it quotes no statistics on how often apps fail these checks, and the Tested by DevoraX column in the scan table is pending. DevoraX, which publishes it, also sells a $400 [vibe code audit](/solutions/fix-vibe-coded-app) of your code, database security, payments, hosting and store readiness; you don't need it to use the checks. Free to reuse under CC BY 4.0 with a link to this page; the passages quoted from Apple, Google, Lovable, Supabase, Stripe and others stay under their owners' terms.",
    "sections": [
      {
        "id": "how-to-test",
        "heading": "How do I run a vibe coding security check on my app?",
        "body": "Work through the checks above in order, testing the app the way a stranger would. Your app's database address and public key ship in the JavaScript every visitor downloads: Lovable's [secrets docs](https://docs.lovable.dev/features/secrets) say its VITE_ values are \"embedded into the client bundle at build time\". Supabase's API key docs say publishable keys aren't meant to protect against anyone using \"the Network inspector in the browser\". So the question is never whether someone can reach your database, only what it answers, and most checks end with a request sent without your session, or with another user's.\n\nStart with [Data access](#group-data-access) and [Secrets](#group-secrets), because one open table or one secret key in the browser exposes every user at once. Then do [Sign-in](#group-sign-in), [Payments](#group-payments) and [Input and abuse](#group-input-and-abuse), then [Hosting and recovery](#group-hosting-and-recovery) and [Ownership](#group-ownership). For a mobile app, finish with [Store review](#group-store-review). Write down each result with the date, because a test describes only the version you ran it on.\n\nIf you would rather hand it over, our [vibe code audit](/solutions/fix-vibe-coded-app) reviews your code, database security, payments, hosting and store readiness. It costs $400, credited to the paid step that follows if you go ahead, and you keep the written report whatever you decide. It is an engineering review, not a security certification. Its page lists the start date, the report turnaround and the payment terms."
      },
      {
        "id": "lovable-scan",
        "heading": "What does Lovable's security scan check, and what can you check yourself?",
        "body": "As of November 2026, Lovable runs two built-in scans, described in its [security overview](https://docs.lovable.dev/features/security), and running either is free. The Quick scan runs every time you publish and checks your database rules, your npm dependencies and any MCP server your app exposes.\n\nThe Deep scan includes all of that and also reads your application code. It runs when someone starts it: from the Security view, from the workspace Security center (admins and owners on Business and Enterprise plans) or, since 29 October 2026, from the project chat. Enterprise plans can also schedule it, and publishing an app whose MCP integration allows access without sign-in starts one in the background. Asking in the chat for a security review runs both scans and explains the findings; the scans are free, but the conversation uses credits.\n\nLovable's docs are plain about the limits: the scans \"do not replace a thorough security review\". Both are static analysis, which reads code and settings. Testing the running app with real attack payloads comes through the optional Aikido connector, billed by Aikido.\n\nThe table maps each area Lovable lists to the checks on this page. Its last row lists what this page tests that Lovable's security docs don't mention, which says nothing either way about whether the scans catch it. The Tested by DevoraX column reads pending on every row: we have not yet run the scans against known faults ourselves, so the table reports what Lovable's documentation says, not what we observed.",
        "table": {
          "caption": "What Lovable's built-in scans cover, as listed in its security overview on 7 November 2026, and where this page tests the same area.",
          "headers": [
            "Area (Lovable's wording, shortened)",
            "Quick scan, at every publish",
            "Deep scan, when started",
            "Tests on this page",
            "Tested by DevoraX"
          ],
          "rows": [
            [
              "Tables without row-level security, and access rules that let everyone through",
              "Yes",
              "Yes",
              "[Scans](#item-deep-scan), [RLS on every table](#item-rls-enabled), [signed-out read](#item-signed-out-read), [open policies](#item-open-policies)",
              "pending"
            ],
            [
              "Leaked-password protection turned off",
              "Yes",
              "Yes",
              "[Sign-in settings](#item-account-settings)",
              "pending"
            ],
            [
              "File storage rules",
              "Yes",
              "Yes",
              "[Storage buckets](#item-storage-buckets)",
              "pending"
            ],
            [
              "Known vulnerabilities in npm dependencies (only critical-rated ones become findings, minus some Lovable judges can't affect its apps or are unlikely to be exploited)",
              "Yes",
              "Yes",
              "[Dependencies](#item-dependencies)",
              "pending"
            ],
            [
              "An MCP server your app exposes without authentication",
              "Yes",
              "Yes",
              "Not covered here",
              "pending"
            ],
            [
              "Access control and authorization, including server code that bypasses the database's rules and privileged actions that don't check the caller's role",
              "No",
              "Yes",
              "[Cross-user access](#item-cross-user), [privilege columns](#item-privilege-columns), [server functions](#item-server-functions), [admin actions](#item-admin-only)",
              "pending"
            ],
            [
              "Unauthenticated and abusable endpoints",
              "No",
              "Yes",
              "[Server functions](#item-server-functions), [rate limits](#item-rate-limits), [uploads](#item-uploads)",
              "pending"
            ],
            [
              "Unsafe input and injection",
              "No",
              "Yes",
              "[Text shown as text](#item-stored-scripts)",
              "pending"
            ],
            [
              "Leaked secrets and credentials in code or the repository",
              "No",
              "Yes",
              "[Secrets in the browser](#item-bundle-secrets), [Git history](#item-git-history)",
              "pending"
            ],
            [
              "Payments and billing: prices, fulfillment or paid features a customer can change or reach without paying",
              "No",
              "Yes",
              "[Server-side prices](#item-server-prices), [access from the webhook](#item-access-from-webhook)",
              "pending"
            ],
            [
              "Authentication and account security: sign-in, account recovery and token checks",
              "No",
              "Yes",
              "[Sign-in links](#item-auth-urls), [protected pages](#item-private-window)",
              "pending"
            ],
            [
              "Error messages and logs that reveal internal details or personal data",
              "No",
              "Yes",
              "[Error responses](#item-error-leaks)",
              "pending"
            ],
            [
              "Not listed in Lovable's security docs on 7 November 2026: a real live-mode purchase, duplicate webhook events, renewals and refunds, auth email delivery, backups and restores, your own domain, account ownership, App Store and Google Play rules",
              "Not listed",
              "Not listed",
              "[Payments](#group-payments), [auth emails](#item-auth-email-delivery), [Hosting and recovery](#group-hosting-and-recovery), [Ownership](#group-ownership), [Store review](#group-store-review)",
              "pending"
            ]
          ]
        }
      },
      {
        "id": "store-review",
        "heading": "App store submission checklist: what do Apple and Google check before launch?",
        "body": "Apple checks that the app does more than your website (guideline 4.2) and that a reviewer can sign in (2.1(a)). It also checks how the app sells digital features (3.1.1), whether people can delete their account in the app (5.1.1(v)), whether it links a privacy policy (5.1.1(i)) and whether its App Privacy details declare its data use. Use the [Store review group](#group-store-review) above as your Apple app review checklist, next to [Apple's App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), last updated 16 October 2026.\n\nGoogle Play adds its own checks, as of November 2026. Personal accounts created after 13 November 2023 need a closed test with 12 testers for 14 days, and every new app needs a Data safety form and a target of API level 36. Each of these has a test in the group above.\n\nFor digital features, the storefront matters. On the US storefront, an app may include buttons or links to your web checkout without an entitlement (3.1.1(a)). That lifts the ban on links only. Guideline 3.1.1 still says that to unlock features or functionality \"you must use in-app purchase\". Guideline 3.1.3(b) lets an app unlock what people bought on your website only \"provided those items are also available as in-app purchases within the app\". App Review decides whether a US app can rely on the web link alone.\n\nIn other storefronts, digital features use in-app purchase unless an entitlement or a 3.1.3 exception applies. Apple can still reject an app. A wrapped app can sell through in-app purchase when its wrapper supports it: as of November 2026, Median documents a plugin for StoreKit and Google Play Billing, and RevenueCat publishes a Capacitor SDK. You still have to set up the products, the purchase flow, the server-side record of who bought what, and the answers for App Review.\n\nOn Android, as of November 2026, Google Play's [Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738) requires its billing system for digital features and subscriptions unless an exception applies. For US users, Play Console Help says developers may link out or offer another billing system by following that policy and Google's alternative billing or external content links programs. Developers enrolled in those programs report to Google and pay its service fees. [What applies where, rule by rule](/solutions/lovable-app-to-app-store#in-app-purchase).\n\nSameem has personally prepared and submitted iOS builds to App Review, published Android apps to Google Play production, shipped in-app purchase with StoreKit, Play Billing or RevenueCat, and answered store rejections; Usman sometimes helps. If you want us to take the launch on, we prepare the app against Apple's and Google's guidelines, submit it and answer the reviewers. The stores decide approval. The iOS and Android launch starts from $2,400, with the $400 audit credited to it if you start with one: see [Lovable app to the App Store](/solutions/lovable-app-to-app-store)."
      },
      {
        "id": "retest-after-prompts",
        "heading": "How do I re-run a vibe coding security test after a prompt changes sign-in or Stripe?",
        "body": "Treat any prompt that touches sign-in, payments, tables or policies as a release. As of November 2026, Lovable's [built-in backend docs](https://docs.lovable.dev/features/cloud) set Modify database and Change data to Always allow by default, so the agent can change schema, policies and rows without asking. Its database docs add that every draft \"uses the same database as your project\", so with Change data on Always allow, a quick interface prompt can reach live data. Once you have real users, everyone who edits the project should set both permissions to Ask each time in their own account settings ([agent permissions](#item-agent-permissions)).\n\nBefore you publish, look at what changed. Lovable's version history, or the commit in your synced GitHub repository, shows the files the prompt touched. Lovable records each database change as a migration file in your code, under drizzle/migrations/ (older projects keep earlier files under supabase/migrations/), so a changed policy shows up there.\n\nThen re-run the tests that matter: [signed-out read](#item-signed-out-read), [cross-user access](#item-cross-user), [privilege columns](#item-privilege-columns), [sign-in links](#item-auth-urls), [webhook signature](#item-webhook-signature) and [access from the webhook](#item-access-from-webhook). Keep test users A and B, and a Stripe sandbox customer, ready for it. Publishing runs the Quick scan, which covers database rules, dependencies and MCP exposure only. Payments, authentication and server code are Deep scan areas, so after a change there, start a Deep scan before you publish."
      },
      {
        "id": "before-launch",
        "heading": "What should I do before launching an app built with Lovable?",
        "body": "Work backwards from the date, because the slowest steps aren't in your code. A company Apple developer account needs a D-U-N-S Number first ([check](#item-own-developer-account)). A personal Google Play account created after 13 November 2023 needs 14 days of closed testing and then a production-access review ([check](#item-play-closed-test)). On 7 November 2026, [Apple's App Review page](https://developer.apple.com/distribute/app-review/) said it was \"typically reviewing at least 50% of submissions in less than 24 hours and 90% in less than 48 hours\", so leave room for a second round.\n\nThen go in this order. Move the repository and every account into your company's name ([Ownership](#group-ownership)). Start the D-U-N-S request and the closed test if you are going to the stores. Run Lovable's Quick and Deep scans, and resolve or justify every finding. Work through Data access, Secrets, Sign-in and Payments, and make one real purchase in live mode. Restore a backup into a copy, move your links to your own domain, and only then submit.\n\nIf you are going to the stores, this page covers the compliance half of an app store launch checklist; screenshots, store keywords and launch-day plans come after. Want a second pair of eyes before you submit? [Book a free 30-minute call](/book?from=vibe-coded-app-security-checklist)."
      },
      {
        "id": "investor-due-diligence",
        "heading": "What investors check in an app built with Lovable",
        "body": "Investors' technical due diligence questions are about risk a demo can't show: who owns the code and the accounts, whether user data is protected, and what it will cost to keep building. madewithlove's technical due diligence checklist (updated 24 June 2026, written for SaaS acquisitions) assesses five areas: team, process, engineering, security and fit. Under security it lists authentication, authorisation and secrets management, known vulnerabilities and patching, audit logging and incident response, and certifications such as SOC 2 or ISO 27001.\n\nVariant Systems' guide to due diligence on AI-generated codebases (12 February 2026) adds the questions an AI-built app raises: which tools wrote the code, what each tool's terms say about IP, and whether anyone has scanned the code for copyleft licences.\n\nUse the questions below as a founder-side tech due diligence checklist, and have evidence ready for each. Who owns the code? As of November 2026, [Lovable's hosting and ownership docs](https://docs.lovable.dev/tips-tricks/deployment-hosting-ownership) say the apps, code and content you create with it \"are yours, subject to third-party rights such as open-source licenses\". Is the repository in the company's GitHub account, with its history ([check](#item-repo-owned))? Have the licences of your dependencies been checked ([check](#item-licences))?\n\nWhere does the data live: on Lovable's built-in backend (which Lovable says uses Supabase's open-source foundation) or in your own Supabase project, and can you export it ([check](#item-export-path))? Are row-level security, secrets and sign-in sound ([Data access](#group-data-access), [Secrets](#group-secrets), [Sign-in](#group-sign-in))? Which third parties receive user data ([check](#item-privacy-answers))? Has a backup been restored ([check](#item-restore-test))? Who holds the domain, Stripe and store accounts ([check](#item-accounts-owned))? What incidents have there been, and what changed after them?\n\nLovable's [Trust center](https://docs.lovable.dev/features/trust-center) can add evidence. Once you enable it, it publishes security facts Lovable observed about your live app at /.well-known/trust.html, though Lovable's docs call it \"informational, not a certification\" and \"not an audit\".\n\nOur launch-readiness audit has an investor-ready version. It states who commissioned the review, its date and its scope, and it says that DevoraX may be hired to fix what it finds, though you don't have to hire us. Beside the code, database security, payments, hosting and store readiness, it covers who owns the code under the terms of the tool that built the app. It also covers third-party licences, secrets in the repository and whether the accounts are in your company's name.\n\nIt answers the code and account questions above, not the team, process and certification questions in madewithlove's list. It is an engineering review, not a security certification, and it doesn't replace the third-party penetration test some investors ask for. It costs $400, credited to the paid step that follows if you go ahead, and you keep the written report whatever you decide. [Book a free 30-minute call](/book?from=vibe-coded-app-security-checklist) to see whether it fits your round."
      },
      {
        "id": "cheaper-options",
        "heading": "When is a free tool, or someone else's service, the better buy?",
        "body": "Often. If your app has no sign-in, no payments and no user data, a brochure site for example, Lovable's Quick scan and the [Hosting and recovery](#group-hosting-and-recovery) checks are enough for a vibe-coded website security check. A paid review would mostly confirm what they show. If one check fails and its linked guide explains the fix, fix that check yourself. Lovable's Deep scan is free to run, Supabase's Security Advisor ships with the platform, and [Supabase's production checklist](https://supabase.com/docs/guides/deployment/going-into-prod) (updated 2 November 2026) covers project settings this page doesn't.\n\nOther free security checklists for vibe-coded apps cover ground this one leaves out. Lovable's own [security best practices](https://docs.lovable.dev/tips-tricks/security-best-practices) page ends with a seven-point list to confirm before publishing; it says what to confirm, and the tests here show how. Replit's [security checklist](https://docs.replit.com/learn/security-checklist) fits apps built on Replit. As of 7 November 2026, the boxed-dev/vibe-coding-security repository on GitHub lists 69 developer-level checks, including AI-agent and LLM items this page doesn't cover. Astra's checklist (dated 3 November 2026) has six browser tests that take about ten minutes.\n\nWe read six other vibe coding security checklists that day: Replit's, Astra's, BSS Commerce's, Cleveroad's, Fingerprint's and boxed-dev's. None of them covers App Store or Google Play review, which is why this page has a Store review group.\n\nPay someone when the stakes call for it. Lovable's docs suggest an additional professional security review for apps handling sensitive data or critical functionality, and health and financial data are the clearest cases. Its optional Aikido connector runs AI penetration tests on the running app, billed by Aikido. A security firm is the right buy when an investor wants a formal penetration test report. Our audit sits between the free tools and a pentest: an engineering review of your code, database security, payments, hosting and store readiness."
      },
      {
        "id": "questions",
        "heading": "Vibe coding security checklist: common questions",
        "body": "Are vibe-coded apps secure?\n\nNot automatically, and not hopelessly either. An app built with Lovable, Base44, Bolt or Replit is as secure as its access rules, keys and server checks. The failures this page tests for, such as open tables, secret keys in the browser, functions that don't check the caller and features unlocked from a success page, are settings and code you can test and fix.\n\nIs vibe coding a security risk?\n\nIt can be. One documented example is [CVE-2025-48757](https://nvd.nist.gov/vuln/detail/CVE-2025-48757), published on the US National Vulnerability Database on 30 May 2025. Its entry says an insufficient row-level security policy in Lovable through 15 April 2025 \"allows remote unauthenticated attackers to read or write to arbitrary database tables of generated sites\". Lovable disputes it, on the grounds that each customer is responsible for protecting their application's data. The practical risk is code that ships faster than anyone reviews it, so test access from outside, keep secrets on the server, and [re-test after every prompt](#retest-after-prompts) that touches data, sign-in or payments.\n\nIs Lovable secure?\n\nAs of November 2026, Lovable has real protections: scans at every publish and on request ([what each covers](#lovable-scan)) and a Secrets manager that keeps keys out of the browser. Since 25 July 2026 it also revokes Lovable workspace API keys found in public GitHub repositories.\n\nIt has had a platform incident too. In \"Our response to the April 2026 incident\" (22 April 2026), Lovable says that between 3 February and 20 April 2026, any Lovable user with a project link could potentially read the source code and chat history of public projects. It says \"Private projects and Lovable Cloud were never impacted\", and that it has since made historically public projects private.\n\nLovable's docs put your app's security on you: \"You are responsible for ensuring that your app meets the security requirements appropriate for its use case, especially if it handles sensitive data or performs critical functions.\" The checks above cover the part that is yours.\n\nIf Lovable's security check shows no issues, is my app ready to launch?\n\nNot yet. A clean Quick scan covers database rules, dependencies and MCP exposure, and the Deep scan covers application code once someone runs it. Lovable's docs don't describe either scan as testing Stripe live mode, auth emails, backups, your domain or store review ([what each scan covers](#lovable-scan)). Both are reviews of your code and settings, not tests of the running app. Check that both scan cards say Up to date, read the Ignored findings list, then work through this page.\n\nDoes Apple require account deletion inside the app?\n\nYes, if people can create an account in it. Guideline 5.1.1(v) says: \"If your app supports account creation, you must also offer account deletion within the app.\" The [account deletion check](#item-account-deletion) covers what Apple's help page and Google Play add, with a test."
      }
    ],
    "items": [
      {
        "id": "deep-scan",
        "group": "Data access",
        "check": "Run Lovable's Quick and Deep scans, or Supabase's Security Advisor, and resolve or justify every finding, including ignored ones.",
        "why": "As of November 2026, Lovable's Quick scan runs at every publish, but the Deep scan, which reads your application code, runs when someone starts it (or on a schedule, on Enterprise plans). A finding someone chose to ignore drops out of the count but stays listed with the reason they picked.",
        "test": "In Lovable's Security view, both scan cards should read Up to date, the open findings count should be zero, and every entry under Ignored findings should carry a reason you would defend to an investor. On your own Supabase project, open the Security Advisor in the dashboard (or run supabase db advisors) and expect no errors."
      },
      {
        "id": "rls-enabled",
        "group": "Data access",
        "check": "Turn on row-level security (RLS) for every table in your public schema.",
        "why": "Your Supabase address and public key are in the JavaScript every visitor downloads, so anyone can query your tables directly. Supabase's RLS guide (updated 3 November 2026) says a table in an exposed schema without RLS \"is readable and writable by any role with a grant on it\".",
        "test": "Open the SQL editor (in the Supabase dashboard, or More → Database → Manage → SQL editor on Lovable's built-in backend) and run: select tablename from pg_tables where schemaname = 'public' and not rowsecurity; The result should be empty. On Lovable's built-in backend, More → Database → Manage → Policies also lists each table's policies. Fix steps: [RLS disabled in public](https://sameemamjad.com/guides/supabase-rls-disabled-in-public)."
      },
      {
        "id": "signed-out-read",
        "group": "Data access",
        "check": "Confirm a signed-out stranger can read only the rows you meant to publish.",
        "why": "RLS can be on and still let everyone in: Supabase's docs warn that a policy for signed-out visitors written as using ( true ) gives every one of them read access to the rows it covers.",
        "test": "On your live app, open DevTools → Network and find a request to your-project.supabase.co/rest/v1/. Note the project address and the apikey header, which is your public key. In a terminal, run for each table: curl \"https://YOUR-PROJECT.supabase.co/rest/v1/TABLE?select=*&limit=5\" -H \"apikey: YOUR_PUBLIC_KEY\". Private tables should return [] or a permission error; only content you meant to publish should come back. No such request in the Network tab? Your app reads data through server code, so use the [server functions check](#item-server-functions) instead."
      },
      {
        "id": "open-policies",
        "group": "Data access",
        "check": "Read every policy and replace any that lets everyone through on private data.",
        "why": "A policy whose condition is simply true lets every user it applies to through, which switches RLS off for that table in practice. Lovable's Quick scan looks for \"access rules that let everyone through\".",
        "test": "Run: select tablename, policyname, cmd, roles, qual, with_check from pg_policies where schemaname = 'public'; Any row on a private table whose qual or with_check is just true needs a real condition, such as auth.uid() = user_id. Supabase's Security Advisor also flags permissive policies and tables that have RLS on but no policy."
      },
      {
        "id": "cross-user",
        "group": "Data access",
        "check": "Check that one signed-in user cannot read or change another user's records.",
        "why": "A rule that only checks that someone is signed in lets every customer see every other customer's data. Lovable's Deep scan describes this area as users \"who can view or change data that is not theirs\".",
        "test": "Signed in as test user A, open DevTools → Network, find the request that loads A's records, right-click it and choose Copy → Copy as fetch. Paste it into the Console, swap A's id for B's (or delete the filter), and run it: the response should be empty. Repeat with a request that edits or deletes a record: B's data must not change."
      },
      {
        "id": "privilege-columns",
        "group": "Data access",
        "check": "Make sure users can't give themselves a role, a plan or credits by editing their own record.",
        "why": "A policy that lets users update their own row lets them change every column in it unless some are protected. Supabase's docs add that user_metadata \"can be modified by authenticated end users\", so it must never decide permissions.",
        "test": "Edit your own profile in the app as a normal user and copy that request as fetch. In the Console, change the body to set role to admin, plan to your top tier or credits to 9999, and send it. Reload: nothing should have changed. Then search your policies and code for user_metadata: any permission check that reads it has to move to a table users can't write."
      },
      {
        "id": "views-and-functions",
        "group": "Data access",
        "check": "Check database views and SQL functions, which can skip RLS.",
        "why": "Supabase's RLS guide says views \"bypass RLS by default\", so a view over a protected table can hand out every row, and a security definer function in an exposed schema runs with its creator's privileges.",
        "test": "Run: select table_name from information_schema.views where table_schema = 'public'; and query each view with the signed-out curl test above. On your own Supabase project, the Security Advisor flags security definer views, and security definer functions that signed-out or signed-in users can execute."
      },
      {
        "id": "storage-buckets",
        "group": "Data access",
        "check": "Keep private files in private storage buckets, and stop public buckets from listing their contents.",
        "why": "A public bucket serves any file to anyone who has its address, and Supabase's Security Advisor has a separate check for public buckets that allow listing. Lovable's Quick scan reviews file storage rules as part of its database review.",
        "test": "List your buckets and check each one's public setting against what it holds: avatars can be public; invoices, ID documents and private uploads should not be. Copy the address of a private file and open it in a private window: it should fail. If you use signed links, wait until one expires and try it again."
      },
      {
        "id": "server-functions",
        "group": "Data access",
        "check": "Make every edge function, server function and API route check who is calling before it reads or changes data.",
        "why": "Server code often runs with the service role, which bypasses RLS, so the function itself has to check the caller. Lovable's security best practices page puts it plainly: \"A function running on the server is still callable by a client\".",
        "test": "List your functions (More → Edge functions on Lovable's built-in backend, or supabase/functions in the repository). Call each one as a stranger, with only your public key: curl -i -X POST \"https://YOUR-PROJECT.supabase.co/functions/v1/NAME\" -H \"apikey: YOUR_PUBLIC_KEY\" -H \"Content-Type: application/json\" -d '{}'. If your public key is a legacy one (a long key starting eyJ), also add -H \"Authorization: Bearer YOUR_PUBLIC_KEY\"; Supabase's API key docs say keys starting sb_publishable_ go on the apikey header only. Anything that acts for a user should answer 401 or 403. Then call it signed in as A with B's ids in the body: it should refuse. For server routes in a TanStack Start app, paste a copied request into the Console of a private window."
      },
      {
        "id": "admin-only",
        "group": "Data access",
        "check": "Protect admin pages and admin actions on the server, not by hiding the menu.",
        "why": "Hiding a link changes what the page shows, not what the data calls answer. Lovable's Deep scan checks that \"privileged actions check the caller's role rather than only that they signed in\".",
        "test": "Signed in as a normal user, type your admin address (for example /admin) into the browser. Then copy a request from your own admin session as fetch and run it in the normal user's Console. Both should fail with no data in the response, whatever the page shows."
      },
      {
        "id": "bundle-secrets",
        "group": "Secrets",
        "check": "Keep secret keys out of everything the browser downloads.",
        "why": "Front-end values are public: Vite's docs say VITE_ variables \"are bundled into your source code at build time\", and Lovable's docs treat them as public too, fit only for values such as the Supabase URL and publishable key. A secret Stripe key or a Supabase service role key there gives away your money or your whole database.",
        "test": "On the live site, open DevTools → Sources and press Ctrl+Shift+F (Cmd+Option+F on a Mac) to search every loaded file for sk_live_, sk_test_, rk_live_, sb_secret_, whsec_ and the first characters of each other secret key you use. Expect no matches. If you find a long key starting eyJ, decode it in the Console: JSON.parse(atob('PASTE_KEY'.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role prints anon for the public key; service_role means your secret key is exposed."
      },
      {
        "id": "server-side-api-calls",
        "group": "Secrets",
        "check": "Call paid services (AI models, email, SMS) from server code, never straight from the browser.",
        "why": "A key the browser uses is a key anyone can copy and spend. Lovable's docs say values in its Secrets manager are \"injected into your Edge Functions automatically, and never reach the browser\".",
        "test": "Use each AI, email or SMS feature with DevTools → Network open. The requests should go to your own backend (your-project.supabase.co/functions/v1/ or your own /api routes), never directly to the provider's API with your key in a header."
      },
      {
        "id": "git-history",
        "group": "Secrets",
        "check": "Check your Git history and old messages for keys, and replace any key that ever left your control.",
        "why": "Deleting a key from today's code leaves it in earlier commits, and Supabase's docs say a secret key must never travel \"over chat, email, or SMS\", so a key that did is no longer secret.",
        "test": "In a fresh clone, run: git log -p --all | grep -nE \"sk_live_|rk_live_|sb_secret_|whsec_\" and repeat with the first characters of your other secret keys. Expect no output. Replace every key found there, ever pasted into a chat, an email or a past developer's hands, or kept in a Lovable project that was ever public: Lovable's post of 22 April 2026 says public projects' code and chat history were historically open by design, and readable by any Lovable user with the project link from 3 February to 20 April 2026. Create the new key at the provider, update it in Lovable's Secrets (More → Settings → Secrets) or at your host, and check that a request with the old key fails. In Stripe, set the old key's expiration to Now when you rotate it; otherwise both keys work for up to 7 days."
      },
      {
        "id": "auth-urls",
        "group": "Sign-in",
        "check": "Make every sign-up email, password reset and social sign-in land on your real domain.",
        "why": "Supabase's docs say the Site URL \"is critical for email confirmations and password resets\", and Lovable's docs say that when sign-in works in preview but fails on the published app, missing redirect URLs are \"usually the reason\". On Lovable's built-in backend, publishing sets the Site URL to your lovable.app address and adds a custom domain to the redirect list.",
        "test": "On your production domain, on a phone as well as a laptop: sign up with a new address and confirm it from the email, sign out, reset the password, and sign in with each social provider. Every link should land on your own domain, signed in, never on localhost or a preview address. Then check Site URL and Redirect URLs in your auth settings (More → Users → Settings → Advanced on Lovable's built-in backend)."
      },
      {
        "id": "account-settings",
        "group": "Sign-in",
        "check": "Require email confirmation, a minimum password length of 8 or more, and leaked-password protection.",
        "why": "Lovable's docs note that without confirmation \"anyone can sign up with an address they don't own\", and call the leaked-password check \"the highest-value setting\". As of November 2026, Supabase makes leaked password protection available on the Pro Plan and above for your own projects.",
        "test": "Sign up with an address you control and try to sign in before clicking the confirmation link: it should be refused. Then try to sign up with the password password123: it should be rejected. On Lovable's built-in backend the settings are under More → Users → Settings → Email (Auto-confirm email off, Password HIBP check on); on your own project, in Supabase Auth's settings."
      },
      {
        "id": "auth-email-delivery",
        "group": "Sign-in",
        "check": "Send sign-in emails through a real email provider before launch, and set the hourly limit for launch day.",
        "why": "Supabase's built-in sender is \"not meant for production use\": unless you set up custom SMTP it delivers only to your team's addresses, and on 7 November 2026 its limit was 2 messages per hour. Lovable's built-in backend also caps auth emails per hour, and raising that cap means setting up email sending first.",
        "test": "Sign up five new accounts within an hour, using addresses outside your team. All five confirmation emails should arrive, from your own domain, and not in spam. Compare the hourly limit (Authentication → Rate Limits in Supabase, or Advanced in Lovable's email settings) with the sign-ups you expect on launch day. As of November 2026, Supabase starts the limit at 30 emails an hour once custom SMTP is set up, and you raise it on the Rate Limits page. If you see \"email rate limit exceeded\", follow [the fix for Supabase's email rate limit](https://sameemamjad.com/guides/supabase-email-rate-limit-exceeded)."
      },
      {
        "id": "private-window",
        "group": "Sign-in",
        "check": "Make protected pages refuse signed-out visitors before any private data loads.",
        "why": "A page that redirects to sign-in after loading may already have fetched the data. Lovable's best practices say to \"use frontend auth state only to control UI, never to enforce access\".",
        "test": "Copy the address of a page that shows private data (a dashboard, an invoice, a profile) and open it in a private window. You should land on sign-in, and DevTools → Network should show no response containing that data, not even for a moment."
      },
      {
        "id": "live-mode",
        "group": "Payments",
        "check": "Before launch, make one real purchase in live mode with your own card, then refund it.",
        "why": "Test mode proves the code, not the live setup: live keys, products and webhook endpoints are separate, and Stripe's docs say an endpoint's signing secret differs between test and live. On Lovable's built-in payments, checkout on the published app takes real cards only after the go-live steps.",
        "test": "On the published app, buy the cheapest plan with a real card. In the Stripe Dashboard (live mode, not the sandbox), check the payment, check the webhook delivery got a 2xx response, and check your account received the paid feature. Then refund it and confirm the app does what your terms say."
      },
      {
        "id": "webhook-signature",
        "group": "Payments",
        "check": "Verify Stripe's signature on every webhook before acting on it.",
        "why": "Stripe's docs say that without verification \"an attacker could send fake webhook events to your endpoint to trigger actions like fulfilling orders, granting account access, or modifying records\".",
        "test": "Send your webhook address (listed under your webhook endpoints in Stripe) a fake event: curl -i -X POST \"YOUR_WEBHOOK_URL\" -H \"Content-Type: application/json\" -d '{\"type\":\"checkout.session.completed\"}'. It should answer 400 or 401, and nothing in your database should change. If real events fail the signature check instead, see [No signatures found matching the expected signature](https://sameemamjad.com/guides/stripe-webhook-no-signatures-found-matching-expected-signature)."
      },
      {
        "id": "webhook-duplicates",
        "group": "Payments",
        "check": "Handle the same event arriving twice, or out of order, without granting or charging twice.",
        "why": "Stripe's [webhook docs](https://docs.stripe.com/webhooks) say endpoints \"might occasionally receive the same event more than once\", and that events can arrive in a different order from the one in which they were created.",
        "test": "In the Stripe Dashboard, open a delivered checkout or invoice event and click Resend (or, with the Stripe CLI, run stripe events resend EVENT_ID --webhook-endpoint=ENDPOINT_ID). The app should not create a second order, add credits twice or send a second receipt."
      },
      {
        "id": "access-from-webhook",
        "group": "Payments",
        "check": "Unlock paid features from the webhook or a server-side check with Stripe, never from the success page.",
        "why": "Anyone can open a success page by its address, and a feature granted only there goes missing whenever a buyer closes the tab before it loads.",
        "test": "Complete a test checkout with Stripe's test card 4242 4242 4242 4242 and confirm your user's plan changes in the database. Then, as a different unpaid test user, open your success page address directly with any session id: nothing should unlock. If paying users don't get access, see [Stripe payment succeeded but no access](https://sameemamjad.com/guides/stripe-payment-succeeded-but-no-access)."
      },
      {
        "id": "server-prices",
        "group": "Payments",
        "check": "Decide prices, and what each purchase unlocks, on the server, never from values the browser sends.",
        "why": "If the browser sends the amount or the plan, a buyer can edit it. Lovable's Deep scan has an area for \"prices, fulfillment, or paid features that a customer can change or reach without paying\".",
        "test": "Start a checkout with DevTools → Network open and find the request that creates it. Copy it as fetch, change the amount, quantity or price id to a cheaper one, and send it. The checkout that opens should still show the real price, and paying should unlock only what was paid for."
      },
      {
        "id": "subscription-lifecycle",
        "group": "Payments",
        "check": "Test renewals, failed payments, cancellations and refunds, not only the first payment.",
        "why": "Stripe sends invoice.payment_failed when a renewal payment fails and customer.subscription.deleted when a subscription ends; an app that ignores them keeps giving paid access.",
        "test": "In your Stripe sandbox, open a test user's subscription and use Run simulation to move past the renewal date: the plan should stay active. Change that customer's card to 4000 0000 0000 0341, which Stripe's docs say attaches but fails when charged, and move past the next renewal: the app should react. Cancel another test subscription and refund a test payment: access should end when your terms say, and the user should see why."
      },
      {
        "id": "stored-scripts",
        "group": "Input and abuse",
        "check": "Make sure text users type is always shown as text and never runs as code.",
        "why": "Input that runs in another user's browser can act with that user's session. Lovable's Deep scan looks for \"untrusted input that reaches a query, a command, a file path, a browser, an email, an AI prompt, or an exported spreadsheet\".",
        "test": "Using test accounts (on a staging copy if real users could see the field), save <img src=x onerror=alert(document.domain)> in every field another user or an admin will see: name, bio, comment, message, listing title. View it from another account and from the admin view. No pop-up should appear, and the text should show exactly as typed. Do the same for fields that end up in emails or CSV exports, then delete the test content."
      },
      {
        "id": "rate-limits",
        "group": "Input and abuse",
        "check": "Limit how often anyone can sign up, request codes, send messages or call your AI features.",
        "why": "Endpoints that send email or SMS, or call a paid AI model, cost money per request. Lovable's Deep scan covers \"functions and routes that anyone can trigger, upload to, or use to send messages without permission\".",
        "test": "Pick one such request in DevTools → Network and copy it as fetch, with your own email address or phone number in it. In the Console, type for (let i = 0; i < 30; i++) await followed by the pasted fetch call, press Enter and watch the Status column in the Network tab. After a handful of calls you should see 429 Too Many Requests or a refusal, not 30 successes. Check the sign-up and email limits under Authentication → Rate Limits in Supabase too."
      },
      {
        "id": "ai-spend",
        "group": "Input and abuse",
        "check": "Cap what your AI features can spend, per user in the app and in total at the provider.",
        "why": "A free account that can call a paid model without limit is a direct line to your bill.",
        "test": "As a free user, keep using the AI feature until a limit message appears; if it never does, there is no per-user cap. Then open your AI provider's billing settings and set a monthly budget or alert. For AI built into a Lovable app, watch its spend under More → Usage."
      },
      {
        "id": "uploads",
        "group": "Input and abuse",
        "check": "Enforce file type and size limits for uploads on the server or the storage bucket, not just in the form.",
        "why": "A check that runs only in the browser can be skipped, so anyone could store files of any type or size in your storage. Supabase's docs say a bucket can be created with rules that restrict the type and size of files it accepts.",
        "test": "Through your app, try a file well above your size limit and a type you don't accept (for example an .html file renamed to .jpg). Then confirm the limit also exists outside the form: in each bucket's allowed file types and size limit, or in the server function that receives the upload."
      },
      {
        "id": "restore-test",
        "group": "Hosting and recovery",
        "check": "Know where your backups are, and restore one into a copy before launch.",
        "why": "As of November 2026, Lovable's built-in backend keeps one backup a day for about 14 days, and Supabase backs up Pro, Team and Enterprise projects daily and recommends that free-plan projects export their own. Neither kind includes storage files, and a backup you have never restored is a guess.",
        "test": "On Lovable's built-in backend, More → Database → Manage → Backups should list daily backups. Export the database (More → Database → Manage → Settings → Export data), download it from More → Storage, have a developer load it into a scratch database with pg_restore, and compare row counts in your main tables. On your own Supabase project, check Database → Backups, or on the Free plan run supabase db dump and restore the file into a scratch project."
      },
      {
        "id": "own-domain",
        "group": "Hosting and recovery",
        "check": "Run the app on a domain you own, over HTTPS, with every other address redirecting to it.",
        "why": "Lovable's terms (last updated 28 August 2026) say it \"retains all ownership rights in the lovable.app domain and all subdomains\" and may reclaim a subdomain, so your users, sign-in links and store listings should point at an address you control.",
        "test": "Run curl -sI http://yourdomain.com and curl -sI https://www.yourdomain.com. Each should answer 301 or 308, with a Location header pointing at the one https address you chose. Open that address in a browser: there should be no certificate warning."
      },
      {
        "id": "deep-links",
        "group": "Hosting and recovery",
        "check": "Make every page load when it is opened directly or refreshed.",
        "why": "A single-page app hosted without a rewrite rule returns 404 for any address except the home page, which breaks emailed links, shared links and bookmarks.",
        "test": "Open a deep address such as https://yourdomain.com/settings/billing in a new tab, and refresh a signed-in page. Both should load the page, not a 404. Fix: [404 on refresh in a single-page app](https://sameemamjad.com/guides/fix-404-on-refresh-single-page-app)."
      },
      {
        "id": "security-headers",
        "group": "Hosting and recovery",
        "check": "Send the basic security headers as real HTTP headers.",
        "why": "They tell browsers to stay on HTTPS, not to guess file types and not to let other sites frame your app. MDN notes that X-Frame-Options set in a meta tag \"has no effect\".",
        "test": "Run curl -sI https://yourdomain.com and look for strict-transport-security, x-content-type-options: nosniff, and either content-security-policy with frame-ancestors or x-frame-options. For a Lovable-hosted app, the optional Trust center (Project settings → Publishing, off by default since 17 August 2026) lists which of these Lovable observed on the live version."
      },
      {
        "id": "error-leaks",
        "group": "Hosting and recovery",
        "check": "Keep stack traces, SQL and internal details out of error responses.",
        "why": "Error text that names tables, columns or file paths tells an attacker where to aim. Lovable's Deep scan has an area for \"error messages and logs that reveal internal details or personal data\".",
        "test": "With DevTools → Network open, cause errors on purpose: submit a form with a field missing, open a record id that doesn't exist, upload a file type you don't accept. Read each failed response: a short message is fine; SQL, stack traces, table names or keys are not."
      },
      {
        "id": "dependencies",
        "group": "Hosting and recovery",
        "check": "Fix critical and high dependency vulnerabilities, and remove packages the app doesn't use.",
        "why": "As of November 2026, Lovable's docs say only critical-rated dependency vulnerabilities become findings; high and medium ones appear only in the Security view's dependency list, so they never reach the findings count. Nobody may have checked the packages the AI chose either.",
        "test": "In the repository, run npm audit --omit=dev and expect no critical or high results, or a written reason for each one you keep. Then read package.json: for any name you don't recognise, check its npm page links to a real repository with recent releases, and remove it if the app doesn't import it."
      },
      {
        "id": "error-alerts",
        "group": "Hosting and recovery",
        "check": "Make sure a person hears about errors in the live app before customers report them.",
        "why": "Without logs and an alert, a failing webhook or a broken sign-in can run for days unnoticed. Lovable's built-in backend keeps backend logs under More → Logs.",
        "test": "Cause a harmless error on purpose and find it in your logs (More → Logs on Lovable's built-in backend, or Logs in the Supabase dashboard). Then check it reaches a person without anyone looking: an error-tracking alert by email or chat, and an uptime monitor on your domain."
      },
      {
        "id": "repo-owned",
        "group": "Ownership",
        "check": "Keep the code in a GitHub repository your company owns, and check it builds from a fresh clone.",
        "why": "Lovable creates and updates repositories in whichever GitHub account or organisation you connect, so a repository under a freelancer's or co-founder's personal account is under their control. Investors ask who owns the code.",
        "test": "On GitHub, open the repository's Settings: your company's account or organisation should own it, with you as an admin, and its latest commit should match what is live. Clone it into an empty folder, install the packages and build it (npm install, then npm run build): it should succeed without files that exist only on someone's laptop."
      },
      {
        "id": "licences",
        "group": "Ownership",
        "check": "List the licences of the packages your app ships, and give a reason for any copyleft one you keep.",
        "why": "A copyleft licence such as the GPL or AGPL comes with conditions on sharing source code, and Variant Systems' due diligence guide (12 February 2026) asks whether anyone has scanned an AI-built codebase for copyleft licences.",
        "test": "In the repository, after npm install, run npx license-checker --production --summary, which counts your production dependencies by licence. Then run it without --summary to find the package behind any GPL, LGPL or AGPL entry. Each one needs a written reason: why the app needs it and whether an alternative exists."
      },
      {
        "id": "accounts-owned",
        "group": "Ownership",
        "check": "Hold every account the app runs on in your company's name: domain, Lovable workspace, Supabase, Stripe, email sender, and the Apple and Google developer accounts.",
        "why": "Whoever owns an account can change or close it. Lovable's built-in payments create a Stripe account for the project that you take over by claiming it when you go live.",
        "test": "Make a table with one row per service: account owner, your role, and whether two-factor sign-in is on. In each dashboard's team or users page, your company should hold the owner role (in App Store Connect, the Account Holder). If Lovable set up Stripe for you, finish the Claim your Stripe account step in its Payments tab."
      },
      {
        "id": "two-factor",
        "group": "Ownership",
        "check": "Turn on two-factor sign-in for every account that can change the app, and remove people who have left.",
        "why": "One stolen password on GitHub, Lovable, Supabase, Stripe or your domain registrar is enough to change the live app or move the money.",
        "test": "Using the table above, turn on two-factor sign-in for every row, and remove anyone who no longer works on the app from each members list. Then replace the keys they could see: Stripe's docs recommend rotating keys when team members with access to them leave."
      },
      {
        "id": "agent-permissions",
        "group": "Ownership",
        "check": "Decide what Lovable's agent may change in your live database without asking you.",
        "why": "As of November 2026, Lovable's docs list Modify database (schema and policy changes) and Change data as Always allow by default on the built-in backend, so a prompt can change tables, policies and rows with no review step.",
        "test": "Open Account settings → Preferences → Agent permissions and set Modify database and Change data to Ask each time once real users have signed up. Lovable saves these settings per account (changelog, 21 September 2026), so everyone with edit access to the project sets them in their own account. Then have each of them request a small schema change in the chat: Lovable should stop and ask before applying it."
      },
      {
        "id": "export-path",
        "group": "Ownership",
        "check": "Know how you would move the app off the platform: database, storage files, code, secrets and sign-in settings.",
        "why": "Lovable's docs say it \"does not transfer a project to another backend in one step\", and its database export leaves out storage files, edge function code, secrets, sign-in provider settings and API keys.",
        "test": "Do a dry run: export the database, download your storage files from More → Storage, and confirm the GitHub repository holds the edge function code. List where each secret and sign-in setting lives so a developer could recreate them, and keep the export somewhere other than the project's own storage."
      },
      {
        "id": "guideline-4-2",
        "group": "Store review",
        "check": "Give the iOS app something a website can't do, and make sure a reviewer finds it in the first minute.",
        "why": "Apple's [guideline 4.2](https://developer.apple.com/app-store/review/guidelines/#4.2) says: \"Your app should include features, content, and UI that elevate it beyond a repackaged website.\" A wrapper that only shows your site gives the reviewer nothing more.",
        "test": "Install the TestFlight build and write down what it does that Safari on the same address doesn't: push notifications, offline use, camera or file access, Sign in with Apple, widgets. If the list is empty, plan native features before you submit. More: [guideline 4.2 minimum functionality](https://sameemamjad.com/guides/app-store-guideline-4-2-minimum-functionality)."
      },
      {
        "id": "own-developer-account",
        "group": "Store review",
        "check": "Submit under your own or your company's Apple developer account, not under the account of a template provider or app-building service.",
        "why": "Guideline 4.2.6 says apps created from \"a commercialized template or app generation service will be rejected unless they are submitted directly by the provider of the app's content\". Enrolling as a company needs a D-U-N-S Number, and as of November 2026 Apple says to allow up to 5 business days to get it from D&B, then up to 2 for Apple.",
        "test": "In App Store Connect, the seller name on the app should be you or your company, and your role should be Account Holder or Admin. Enrolling as a company? Look up or request the D-U-N-S Number on day one. More: [submitting a Lovable app under your own account](/solutions/lovable-app-to-app-store#app-review)."
      },
      {
        "id": "iap-or-us-link",
        "group": "Store review",
        "check": "Decide how the iOS app sells digital features in each storefront: in-app purchase, plus, on the US storefront, an optional button or link to your web checkout (3.1.1(a)).",
        "why": "Guideline 3.1.1 says that to unlock features or functionality, subscriptions included, \"you must use in-app purchase\", and 3.1.3(b) lets an app unlock what people bought on your website only \"provided those items are also available as in-app purchases within the app\". Physical goods and services used outside the app must not use in-app purchase (3.1.3(e)).",
        "test": "List every button in the iOS build that takes money and what it opens: Apple's purchase sheet, your web checkout, or a checkout for physical goods. Each should match its storefront's rule. Under 3.1.1(a), a button or link to your web checkout is allowed in the US storefront version without an entitlement. That lifts the ban on links only, and App Review decides whether a US app can rely on the web link alone. In other storefronts, digital features need in-app purchase unless an entitlement or a 3.1.3 exception applies. More: [in-app purchase or Stripe, rule by rule](/solutions/lovable-app-to-app-store#in-app-purchase)."
      },
      {
        "id": "iap-works",
        "group": "Store review",
        "check": "Make every in-app purchase complete, visible to the reviewer and working, with a way to restore it.",
        "why": "Guideline 2.1(b) asks for in-app purchases that are \"complete, up-to-date, visible to the reviewer and functional\", and 3.1.1 asks for \"a restore mechanism for any restorable in-app purchases\".",
        "test": "On the review build, buy each product with a sandbox tester account, delete and reinstall the app, and tap Restore Purchases: the purchase should come back. Check that your server records each purchase against the right user, so access follows them to the web too if you promise that. More: [in-app purchase in a wrapped Lovable app](/solutions/lovable-app-to-app-store#in-app-purchase)."
      },
      {
        "id": "review-access",
        "group": "Store review",
        "check": "Give App Review a working demo account, and keep the backend running during review.",
        "why": "Guideline 2.1(a) asks for demo account details, with your back-end service turned on, whenever an app has a login, and says Apple rejects builds that crash or show obvious technical problems.",
        "test": "On a fresh install, over mobile data, sign in with the demo details you will enter in App Store Connect and reach every paid or gated screen. Make sure the account won't expire, run out of trial or ask for an emailed code while the review is open. More: [what App Review checks in a Lovable app](/solutions/lovable-app-to-app-store#app-review)."
      },
      {
        "id": "account-deletion",
        "group": "Store review",
        "check": "Let users delete their account and its data from inside the app, and give Google Play a web page for deletion requests.",
        "why": "Apple's 5.1.1(v): \"If your app supports account creation, you must also offer account deletion within the app.\" Apple's help page says offering only deactivation \"is insufficient\", and Google Play asks for an in-app path plus \"a web link resource\" for deletion requests.",
        "test": "In the store build, create an account, add some data and delete the account from settings. In the database, the user and their rows should be gone, or kept only where the law requires it and the app said so. Open the web deletion link without the app: it should accept a request. If you offer Sign in with Apple, Apple's [account deletion page](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion/) says to revoke the user's tokens through its REST API. More: [Apple's rules for wrapped apps](/solutions/lovable-app-to-app-store#app-review)."
      },
      {
        "id": "privacy-answers",
        "group": "Store review",
        "check": "Make the privacy policy, Apple's App Privacy answers and Google's Data safety form match what the app and its services collect.",
        "why": "Apple's App Privacy page asks you to cover the data practices of third-party code you add to the app, and guideline 5.1.1(i) asks for a privacy policy link in App Store Connect and inside the app. Google Play says problems in the Data safety form's deletion answers get new submissions and updates rejected.",
        "test": "List every service the app sends data to (Supabase or Lovable's backend, Stripe, analytics, error tracking, push, the AI provider) and what each receives. Compare that list with your privacy policy, the App Privacy answers in App Store Connect and the Data safety form in Play Console. Then open the privacy policy from inside the app. More: [App Privacy and the other review rules](/solutions/lovable-app-to-app-store#app-review)."
      },
      {
        "id": "play-closed-test",
        "group": "Store review",
        "check": "On a personal Google Play account created after 13 November 2023, run a closed test with at least 12 testers for 14 days in a row before applying for production.",
        "why": "As of November 2026, [Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465) says these accounts \"must run a closed test for their app with a minimum of 12 testers who have been opted in continuously for at least 14 days\", and production stays disabled until they do.",
        "test": "In Play Console, open your closed testing track and check how many testers are opted in and when the twelfth joined. Plan the Android launch at least 14 days after that, plus Google's review of your production-access application, which Play Console Help says \"usually takes seven days or less, but can occasionally take longer\". Google can ask for more testing if fewer than 12 testers stayed opted in or tester engagement was too low, and a tester who opts out and back in starts their 14 days again. More: [12 testers for 14 days](https://sameemamjad.com/guides/google-play-closed-testing-12-testers-14-days)."
      },
      {
        "id": "login-services",
        "group": "Store review",
        "check": "If the iOS app offers Google or another social sign-in, also offer an option that meets guideline 4.8, such as Sign in with Apple.",
        "why": "Guideline 4.8 asks apps that use a third-party login for the main account to also offer a login service that limits data to name and email, lets users keep their email private and doesn't collect app interactions for advertising without consent. Apps that use only their own sign-in are exempt.",
        "test": "Open the sign-in screen of the iOS build. If it shows Google, Facebook or another social button, check that Sign in with Apple (or another service that meets 4.8) is there too and works end to end on a device, including the return to the app; Lovable's redirect URLs accept custom schemes such as myapp://callback for this. More: [guideline 4.8 and the other review rules](/solutions/lovable-app-to-app-store#app-review)."
      },
      {
        "id": "android-target-api",
        "group": "Store review",
        "check": "Build the Android app for Google Play's current target API level.",
        "why": "Since 31 August 2026, Google Play has required new apps and app updates to target Android 16 (API level 36) or higher.",
        "test": "Check targetSdkVersion in the Android project before you build the release bundle: it should be 36 or higher. In a Capacitor wrapper it sits in android/variables.gradle, and Capacitor's docs pair target SDK 36 with Capacitor 8, so an older Capacitor version means upgrading first."
      }
    ],
    "limitations": [
      "The checks are written for apps on Supabase or Lovable's built-in backend. Apps from Base44, Bolt, Replit or Cursor need the same checks, but their settings sit elsewhere and the SQL tests may not apply.",
      "Platform facts were read on 7 November 2026. Lovable, Supabase, Stripe, Apple and Google change their products and rules often, so open the linked source before relying on a date, a limit or a menu path.",
      "A test can show that a check fails. Passing every test doesn't prove an app is secure.",
      "The Lovable scan table reports Lovable's documentation, not our own results; its Tested by DevoraX column is pending.",
      "AI-specific risks such as prompt injection and agent tool permissions are covered only through the spend cap and input checks, and MCP servers are not covered here (Lovable's Quick scan checks for one exposed without authentication).",
      "It quotes no statistics on how often these failures occur, because we have not verified a primary source for one.",
      "It is not legal advice about privacy law, store agreements or platform terms."
    ],
    "cannot_answer": [
      "Whether your app is secure overall. Testing, a third-party penetration test included, can find problems but cannot prove there are none.",
      "What Apple or Google will decide about your app. The stores decide approval.",
      "Whether your app meets GDPR, HIPAA, PCI DSS or other regulations.",
      "How long fixes will take or what they will cost for your app, which depends on what the checks find."
    ],
    "updated": "2026-11-07T00:00:00.000Z"
  }
];

/**
 * When the research articles were last substantively revised (honest freshness
 * signal). A page with its own `updated` uses that instead.
 */
export const INSIGHTS_UPDATED = '2026-10-09T00:00:00.000Z';

export function isChecklist(i: Insight): i is ChecklistInsight {
  return i.kind === 'checklist';
}

/** The page's revision date: the byline, dateModified and the sitemap lastmod. */
export function insightUpdated(i: Insight): string {
  return i.updated ?? INSIGHTS_UPDATED;
}

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export function allInsightSlugs(): string[] {
  return INSIGHTS.map((i) => i.slug);
}
