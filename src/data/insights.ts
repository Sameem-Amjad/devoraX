/**
 * Insights: data-backed research articles.
 *
 * These exist for citation, not for keyword volume. They are written from the
 * 25 entries in the DevoraX portfolio: products DevoraX's founder, Sameem Amjad,
 * built or worked on, many of them as an employee of other companies. They are
 * not a record of DevoraX client work, and they state their own limits, which is
 * what separates a source worth quoting from marketing copy.
 *
 * Every count is computed by a script from the structured fields of the
 * `projects` table (tags, tech stack, category label, web/android/ios links),
 * never from free-text descriptions. Who each project was for (employer, no
 * named client, no client) follows the claims ledger. Never hand-add a number
 * here that is not derivable from those fields or from a public, checkable source.
 */
export type InsightTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type InsightSection = {
  heading: string;
  body: string;
  table?: InsightTable;
};

export type Insight = {
  slug: string;
  title: string;
  meta_description: string;
  /** Answer-first opener — the passage most likely to be quoted. */
  summary_answer: string;
  /** Explicit statement of what the dataset is and is not. */
  dataset_note: string;
  sections: InsightSection[];
  key_findings: string[];
  limitations: string[];
  cannot_answer?: string[];
  word_count: number;
};

/** Populated by the research generator. */
export const INSIGHTS: Insight[] = [
  {
    "slug": "what-we-measured-across-25-production-builds",
    "title": "What the 25 DevoraX Portfolio Entries Show About Stacks and Links",
    "meta_description": "The 25 entries in the DevoraX portfolio, counted field by field: whose work each was, which links a reader can open, and which stacks recur.",
    "summary_answer": "The DevoraX portfolio holds 25 entries: products and builds that DevoraX's founder, Sameem Amjad, built or worked on, 11 of them while employed as an engineer at other companies. Fifteen of the 25 store at least one public link, eight of them a live app store listing, and ten store none. The clearest stack pattern is backend concentration: 13 of 25 name a Node-family backend, and Node.js and AWS tie at nine entries each.",
    "dataset_note": "This is n=25: every entry in the DevoraX portfolio, counted from its structured fields (tag list, declared tech stack, category label, and web, Google Play and App Store links) with a script rather than by hand. It is not a record of DevoraX client work. Eleven entries are products Sameem Amjad worked on as an engineer at other companies (Zencloud, Webrange Solutions, Pastel and previous employers), nine have no named client, and five have no client and no public link. It is not a market survey, a random sample or a controlled study, and it holds no cost, effort, timeline or outcome data. Links are counted as stored, and three of the web links are demo builds rather than production sites. Read every figure as \"in these 25 portfolio entries\", never as an industry rate.",
    "sections": [
      {
        "heading": "What exactly is in this dataset?",
        "body": "The dataset is the DevoraX portfolio: 25 entries, each stored with a title, a category label, a tag list, a declared tech stack and three link fields for web, Android and iOS. It is a portfolio of products that DevoraX's founder, Sameem Amjad, has built or worked on. Eleven entries are products Sameem worked on as an engineer at other companies: five at Zencloud, three at Webrange Solutions, one at Pastel, his current employer, and two at previous employers. Nine more have no named client, and the last five have no client and no public link.\n\nEvery figure below comes from counting the entries' structured fields directly. Nothing is estimated, extrapolated or benchmarked, because no benchmark was run. Free-text descriptions are not counted, because their wording varies from entry to entry and a count built on prose would measure the writing rather than the product.",
        "table": {
          "caption": "The 25 entries by the context in which the work was done, with the links each group stores.",
          "headers": [
            "Context",
            "Entries",
            "Any public link",
            "App store listing"
          ],
          "rows": [
            [
              "Engineer at another company (Zencloud 5, Webrange Solutions 3, Pastel 1, previous employers 2)",
              "11",
              "8",
              "4"
            ],
            [
              "No named client",
              "9",
              "7",
              "4"
            ],
            [
              "No client and no public link",
              "5",
              "0",
              "0"
            ],
            [
              "Total",
              "25",
              "15",
              "8"
            ]
          ]
        }
      },
      {
        "heading": "How many of the 25 entries store a link a reader can open?",
        "body": "Verifiability is worth counting first, because a portfolio entry nobody can open is not evidence. Fifteen of the 25 entries store at least one URL, 60% of the portfolio. Counting by the link's domain, 12 store a web address, seven a Google Play listing and six an Apple App Store listing. Those overlap, since one product can publish to all three surfaces, so they deliberately sum to more than 25.\n\nNot every link is a production product. Three of the 12 web addresses are demo builds on vercel.app: Coffee Shop, Waitmate and Afriva. Eight entries link to a live app store listing: Food Magnet, Koor, CEDMAT, Three28, Pastel, Dooz, LoopedIn and TAL. Ten entries, 40%, store no link at all. Five of those are the builds with no client; the other five are Outstride, Augment Fit, JUJU, WOD Pro League and ConstrActive, which have no working public address today.",
        "table": {
          "caption": "Stored public links across the 25 entries, counted by the link's domain rather than by which field holds it. The web, Google Play and App Store rows overlap and do not sum to 25.",
          "headers": [
            "Link type",
            "Entries",
            "Share of 25"
          ],
          "rows": [
            [
              "Web URL",
              "12",
              "48%"
            ],
            [
              "Web URL that is a demo build on vercel.app",
              "3",
              "12%"
            ],
            [
              "Google Play URL",
              "7",
              "28%"
            ],
            [
              "Apple App Store URL",
              "6",
              "24%"
            ],
            [
              "At least one app store listing",
              "8",
              "32%"
            ],
            [
              "At least one URL stored",
              "15",
              "60%"
            ],
            [
              "No URL stored",
              "10",
              "40%"
            ]
          ]
        }
      },
      {
        "heading": "Which surfaces do the entries link to?",
        "body": "Grouping the same 25 entries by the surfaces they link to, rather than by link type, gives mutually exclusive buckets that sum cleanly to 25. No link at all is the largest group, at ten entries, 40%. Web-only is next at seven, 28%, and three of those seven are demo builds. Five entries, 20%, link to web, Google Play and the App Store together: Food Magnet, Pastel, Dooz, LoopedIn and TAL. Three reach a mobile store with no web surface: Koor and CEDMAT on Google Play only, Three28 on the App Store only.\n\nFull three-surface presence is the exception in this portfolio, and a single web surface is the most common linked shape. That says what these 25 products publish today, not what the market builds, and a different 25 projects would redistribute every bucket.",
        "table": {
          "caption": "The 25 entries by linked surface, counted by link domain. Buckets are mutually exclusive and sum to 25.",
          "headers": [
            "Linked surfaces",
            "Entries",
            "Share of 25"
          ],
          "rows": [
            [
              "No URL stored",
              "10",
              "40%"
            ],
            [
              "Web only",
              "7",
              "28%"
            ],
            [
              "Web + Google Play + App Store",
              "5",
              "20%"
            ],
            [
              "Google Play only, no web",
              "2",
              "8%"
            ],
            [
              "App Store only, no web",
              "1",
              "4%"
            ],
            [
              "Total",
              "25",
              "100%"
            ]
          ]
        }
      },
      {
        "heading": "Which technologies appear most often across the 25 entries?",
        "body": "Technology frequency is counted with one explicit rule: an entry counts once for a technology if that name appears in its tag list or among its declared tech stack items. Free-text descriptions are excluded. Under that rule Node.js and AWS tie at nine entries each, Firebase follows at eight and React.js at seven. One detail of the rule is worth stating: Food Magnet's declared stack items read \"AWS Lambda Functions (Backend)\" and \"React.js (Admin Dashboard)\", and a name counts wherever it appears inside an item, so Food Magnet counts for AWS. A count that accepted only the bare string \"AWS\" would give AWS eight.\n\nThese are the stacks of the products, not a record of DevoraX's own technology decisions. Eleven of the 25 were built inside other companies, where the stack was set within that company rather than chosen by DevoraX.",
        "table": {
          "caption": "Technology frequency across the 25 entries, counted once per entry where the name appears in the tag list or the declared tech stack. Entries use several technologies, so rows do not sum to 25.",
          "headers": [
            "Technology",
            "Entries (of 25)",
            "Share"
          ],
          "rows": [
            [
              "Node.js",
              "9",
              "36%"
            ],
            [
              "AWS",
              "9",
              "36%"
            ],
            [
              "Firebase",
              "8",
              "32%"
            ],
            [
              "React.js",
              "7",
              "28%"
            ],
            [
              "React Native",
              "6",
              "24%"
            ],
            [
              "Next.js",
              "5",
              "20%"
            ],
            [
              "Flutter",
              "5",
              "20%"
            ],
            [
              "NestJS",
              "4",
              "16%"
            ],
            [
              "Stripe",
              "3",
              "12%"
            ],
            [
              "Supabase",
              "2",
              "8%"
            ],
            [
              "TypeScript",
              "2",
              "8%"
            ],
            [
              "Kubernetes",
              "1",
              "4%"
            ]
          ]
        }
      },
      {
        "heading": "Why should the technology counts be read as a floor?",
        "body": "The technology table is a floor, not a census, and the entries show exactly why. Nineteen of the 25 declare exactly two tech stack items, typically one frontend and one backend. Only six declare more, and one declares eight. A list that stops at two names cannot describe a stack that runs to a dozen dependencies.\n\nThe project descriptions show what falls through the gap: MongoDB on Bondly, Socket.io and Redis on WOD Pro League and LoopedIn, PostgreSQL through Supabase on Afriva, and Fluent-FFmpeg, BullMQ and S3 signed URLs on JUJU. MongoDB, Redis, Socket.io, PostgreSQL and S3 each score zero across all 25 tag and tech stack lists. Vercel hosts three of the web links and appears in none of them either. Read every line in the technology table as a minimum."
      },
      {
        "heading": "Does the portfolio favour React Native or Flutter?",
        "body": "Eleven of the 25 entries name a cross-platform mobile framework in their tags or declared stack: six React Native and five Flutter. The two sets do not overlap, and no entry names a native-only toolchain such as Swift, SwiftUI, Kotlin or Jetpack Compose. Of the six React Native entries, four link to a store listing; of the five Flutter entries, two do.\n\nThe split follows context more closely than preference. All five Flutter entries are products Sameem worked on as an employee, at Zencloud or a previous employer, while none of the six React Native entries is: two have no client and four have no named client. Within a sample this size the gap between six and five carries no statistical weight, and the portfolio cannot test whether framework choice relates to anything else. What it does support is narrower: across these eleven mobile builds the default was cross-platform."
      },
      {
        "heading": "What does the portfolio show about stack concentration?",
        "body": "Two concentrations stand out. First, backends: nine entries name Node.js and four name NestJS, with no overlap between the sets, so 13 of 25, 52%, name a Node-family backend. Second, managed backend services: eight name Firebase and two Supabase, again with no overlap, so 10 of 25, 40%, lean on a backend-as-a-service rather than a self-managed data layer. Taking React.js, Next.js, React Native and the bare React tag together gives 17 of 25, 68%, touching the React ecosystem somewhere.\n\nContainer orchestration is the opposite story: Kubernetes appears in exactly one entry, the AI E-Commerce Ecosystem, which has no client and no public link. The category labels agree with the tags, with six entries labelled \"Node.js Backend & AWS\" and four labelled \"React Native & Node.js\"."
      },
      {
        "heading": "What would make this portfolio more citable next time?",
        "body": "The most useful output of counting a portfolio is the list of things it should have captured. Four gaps are visible. No entry records the context of the work, whether it was done as an employee, for a direct client or as a self-initiated build, so this article has had to add it by hand. No entry records when the work was done: the only date is the timestamp from when the entry was created, which dates the portfolio entry rather than the build. The tech stack list caps most entries at two items, which is why the technology counts are a floor. And links are not re-checked automatically, so a domain that lapses or changes hands keeps pointing somewhere else until someone notices. None of these is hard to fix at capture time, and all are hard to fix afterwards."
      }
    ],
    "key_findings": [
      "15 of the 25 portfolio entries (60%) store at least one public URL and 10 store none; by link domain, 12 are web addresses (3 of them demo builds on vercel.app), 7 Google Play and 6 Apple App Store.",
      "11 of the 25 entries are products Sameem Amjad worked on as an engineer at other companies, 9 have no named client, and 5 have no client and no public link.",
      "8 entries link to a live app store listing: Food Magnet, Koor, CEDMAT, Three28, Pastel, Dooz, LoopedIn and TAL.",
      "13 of 25 entries (52%) name a Node-family backend: 9 name Node.js and 4 name NestJS, with no overlap between the two sets.",
      "Node.js and AWS tie as the most frequent technologies at 9 of 25 entries each, under the rule 'named in the tag list or the declared tech stack'.",
      "Mobile work splits 6 React Native to 5 Flutter across 11 entries, no entry names a native iOS or Android toolchain, and all 5 Flutter entries were employer projects.",
      "Only 5 of 25 entries link to web, Google Play and the App Store together; 7 link to the web only and 3 reach a single mobile store with no web surface."
    ],
    "limitations": [
      "n=25 from one small studio's portfolio. These are the products one engineer has worked on across several employers and projects, not a random or representative sample of software projects.",
      "Context is not a field in the data. Whether each entry was employer work, has no named client or has no client was added by hand for this article.",
      "The technology counts are a floor, not a census. 19 of the 25 entries cap their declared tech stack at two items, and the project descriptions name MongoDB, Redis, Socket.io, PostgreSQL and S3 on individual builds while those five score zero across all 25 tag and tech stack lists.",
      "Counts use structured fields only. Free-text descriptions were not counted, so a technology mentioned only in prose does not appear in any table.",
      "Links were counted as stored. A stored URL means a page is linked, not that it is a production system: 3 of the 12 web links are demo builds.",
      "The portfolio contains finished or showcased work only. There is no entry for cancelled, abandoned or failed work, so every pattern here is survivorship-limited.",
      "The only timestamp on any entry is its creation date, which dates the portfolio entry (8 in 2025, 17 in 2026) rather than the build.",
      "22 of the 25 entries are flagged as featured, so this is a curated showcase rather than a complete list of everything Sameem has worked on."
    ],
    "cannot_answer": [
      "Is React Native faster, cheaper or more maintainable than Flutter? The portfolio holds no benchmarks, build times, bundle sizes, crash rates or defect counts for either.",
      "Does framework choice relate to whether an app reaches a public store? With 6 React Native and 5 Flutter entries, and the Flutter group made up entirely of employer projects, the portfolio cannot support a correlation claim in either direction.",
      "Did any stack choice cause any business outcome? The portfolio holds no outcome data, no control group and no counterfactual.",
      "What did these builds cost, or how many developer hours did they take? No cost, effort or team-size data is stored in any entry.",
      "How long did each project run from kickoff to launch? The only date on an entry is its creation date, which dates the portfolio entry rather than the build.",
      "How do these figures compare to industry averages? n=25 from one portfolio cannot establish or test an industry baseline.",
      "Which technology choices failed, and why? Only finished or showcased work is in the portfolio, so there is no failure data to analyse.",
      "Who chose each stack? On the employer projects the decision sat inside another company, and no entry records who made it."
    ],
    "word_count": 2291
  },
  {
    "slug": "react-native-vs-flutter-production-experience",
    "title": "React Native vs Flutter: What 11 Cross-Platform Builds in One Portfolio Show",
    "meta_description": "Eleven cross-platform builds from the DevoraX portfolio, compared by store presence, backend and context, and what the data cannot settle.",
    "summary_answer": "Across the eleven cross-platform mobile builds in the DevoraX portfolio, two of five Flutter builds link to both Google Play and the App Store, against one of six React Native builds, while four of the six React Native builds link to at least one store against two of the five Flutter builds. Context differs more than framework: all five Flutter builds are products Sameem Amjad worked on as an employee of other companies, and none of the React Native builds is. This is a portfolio count, not a performance benchmark.",
    "dataset_note": "The dataset is the 25 entries in the DevoraX portfolio: products that DevoraX's founder, Sameem Amjad, built or worked on, many of them as an engineer at other companies. Eleven name a cross-platform mobile framework in their tags or declared tech stack: 6 React Native, 5 Flutter. Every count uses the structured fields only, meaning the category label, the tag list, the declared tech stack and the web, Google Play and App Store links, and was produced by a script rather than by hand. Free-text descriptions are not counted. There is no control group, no randomisation, no paired build of the same app in both frameworks and no performance testing of any kind, and the portfolio holds no outcome data. It is a portfolio, not an experiment.",
    "sections": [
      {
        "heading": "Which builds in the portfolio use React Native or Flutter?",
        "body": "Of the 25 portfolio entries, eleven name a cross-platform mobile framework in their tags or tech stack: six React Native and five Flutter. That structured-field rule matters at the edges. Dooz Inspected Cars lists Angular and NestJS in its tech stack and React Native only in its tags, so it counts. The remaining fourteen entries name no mobile framework, which is not the same as having no app: Pastel and LoopedIn link app store listings, yet neither entry names the framework behind its app.\n\nThe table below is therefore the entire comparison set. It carries the context of each build, because context turns out to separate the two groups more cleanly than anything technical does.",
        "table": {
          "caption": "All 11 cross-platform mobile builds in the 25-entry portfolio, with declared backend, context and the store listings each entry links.",
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
              "No client named",
              "App Store"
            ],
            [
              "Dooz Inspected Cars",
              "React Native",
              "Used-car marketplace, Jordan",
              "NestJS",
              "No client named",
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
              "Engineer at a previous employer",
              "Google Play + App Store"
            ],
            [
              "JUJU Streaming Platform",
              "Flutter",
              "Media streaming",
              "Node.js",
              "Engineer at a previous employer",
              "None"
            ],
            [
              "WOD Pro League",
              "Flutter",
              "Fitness competition",
              "Node.js",
              "Engineer at Zencloud",
              "None"
            ]
          ]
        }
      },
      {
        "heading": "How is each framework attribution recorded?",
        "body": "Framework labels come from hand-maintained fields, so it is worth showing where each one sits before comparing anything built on top of them. Eight of the eleven builds name their framework in both tags and tech stack. Three do not. Dooz Inspected Cars is React Native in tags only, because its tech stack lists the Angular web client and the NestJS backend instead. Digital Power of Attorney is Flutter in tags only, its tech stack naming Node.js and Express. JUJU Streaming is the reverse, Flutter in tech stack only, with its tags describing the backend.\n\nThe category label is less consistent still, which is why it is not used for attribution: Food Magnet's category is Food Industry, a vertical rather than a stack, and three Flutter builds carry the category Node.js Backend & AWS with no mention of Flutter. None of this changes the totals of six and five, but it explains why every count here names the fields it reads.",
        "table": {
          "caption": "Where the framework label for each of the 11 builds is recorded, plus the category label as stored.",
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
            ]
          ]
        }
      },
      {
        "heading": "Which framework's builds link to public app stores more often?",
        "body": "Store presence is read from each entry's web, Android and iOS links. Two of the five Flutter builds link to both Google Play and the Apple App Store: Food Magnet and TAL. One of the six React Native builds does, Dooz. React Native is not absent from the stores; it is the more store-present group overall. Four of six React Native builds link at least one store listing, against two of five Flutter builds. Of those four, Koor and CEDMAT are on Google Play only and Three28 is on the App Store only.\n\nThe builds with no link at all split evenly and for different reasons. Two Flutter builds have no public link: JUJU, which has none listed, and WOD Pro League, whose site and store listings no longer resolve. Two React Native builds, the FinTech Mobile App and AgroBridge, have no client and no public link.",
        "table": {
          "caption": "Linked public release status by framework, counted from the web, Android and iOS links of each entry.",
          "headers": [
            "Linked release status",
            "React Native (n=6)",
            "Flutter (n=5)"
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
              "2"
            ],
            [
              "At least one store listing linked",
              "4",
              "2"
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
        "body": "One rule governs every row below: a technology counts when it is named in the entry's category label, tags or declared tech stack. Under that rule the sharpest split is NestJS, named behind four of six React Native builds and none of the five Flutter builds. Express appears once, behind the Flutter-based Digital Power of Attorney platform; the project descriptions of WOD Pro League and TAL name a Node.js and Express backend on both, which those entries' fields do not record. Node.js itself is named in four of six React Native entries and four of five Flutter entries, so the runtime is not a point of difference.\n\nAWS is named in all five Flutter entries and three of six React Native entries. Serverless AWS Lambda appears only on the Flutter side, in Food Magnet, and Elasticsearch only on the React Native side, in Koor. Firebase appears in two React Native entries and one Flutter entry.",
        "table": {
          "caption": "Technologies named in the category label, tags or declared tech stack, counted per framework. Every row uses this single rule; free-text descriptions are not counted.",
          "headers": [
            "Technology named",
            "React Native (n=6)",
            "Flutter (n=5)"
          ],
          "rows": [
            [
              "NestJS",
              "4",
              "0"
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
        "body": "No, and reading it as one would be the easiest mistake to make with this table. NestJS is a framework that runs on Node.js, so the four React Native builds behind it are Node.js services too. The entries say so directly: Koor, Three28 and Dooz carry the category React Native & Node.js while their tech stack names NestJS. The two descriptions sit at different levels rather than in conflict. Counted that way, five of six React Native builds name a Node-family backend, NestJS four times and plain Node.js once, and four of five Flutter builds name Node.js outright. AgroBridge names only Firebase; Food Magnet names AWS Lambda functions without naming a runtime.\n\nWhat differs is the shape above the runtime: the React Native builds used the opinionated NestJS structure, the Flutter builds used Express, plain Node services and, on Food Magnet, AWS Lambda. Because every Flutter build was employer work and no React Native build was, that split describes different teams and contexts, not the frameworks."
      },
      {
        "heading": "Did the two frameworks land in the same verticals?",
        "body": "No, and this is the most important limit on the comparison, alongside context. No vertical in the portfolio was built twice, once in each framework. React Native carried a banking app, an agricultural marketplace, food delivery, a roller-shutter installer app, creator monetisation and a used-car marketplace. Flutter carried food-truck discovery, media streaming, digital power of attorney, workforce welfare and fitness competition. Two React Native entries carry a FinTech tag, the FinTech Mobile App and Dooz; no Flutter entry does. Three of the five Flutter products centre on live location or live competition data: Food Magnet tracks food-truck locations, TAL helps mobile workers find nearby facilities and WOD Pro League runs real-time leaderboards.\n\nBecause the workloads never overlap, and because the Flutter builds all came from Sameem's employers while the React Native builds did not, any difference in store presence between the two groups is confounded with what the apps were asked to do, who commissioned them and what the work covered. There is no like-for-like pair anywhere in these eleven builds."
      },
      {
        "heading": "Does either framework arrive with a companion web surface more often?",
        "body": "In this portfolio, yes. Three of five Flutter entries name a React.js web surface in their tags or tech stack: Food Magnet pairs its Flutter app with a React.js admin dashboard, and TAL Workforce and the Digital Power of Attorney platform both carry a React.js tag. On the React Native side, one of six names a companion web client: Dooz Inspected Cars, which lists Angular for its web interface. The link fields point the same way independently, with three of five Flutter builds linking a web address against one of six React Native builds.\n\nThe likeliest reading is that these Flutter products were multi-surface products, with the mobile app as one surface among several. That is a statement about these particular projects, not about what either framework can do."
      },
      {
        "heading": "Why is this portfolio evidence rather than a benchmark?",
        "body": "Because nobody ran the experiment that would make it one. No screen was built twice, no frame times, cold starts, memory or binary sizes were measured, and neither framework was instrumented under load. Team composition, employer, brief, budget and year all differed between projects, and none of those variables is captured in the fields being counted. The counting has soft edges worth naming: framework attribution rests on hand-maintained tags and tech stack lists, and three of the eleven builds name their framework in only one of the two. Every number published here was counted from the 25 portfolio entries with a script, not taken from any precomputed summary."
      }
    ],
    "key_findings": [
      "2 of 5 Flutter builds link to both Google Play and the Apple App Store, against 1 of 6 React Native builds.",
      "React Native is the more store-present group overall: 4 of 6 React Native builds link at least one store listing, against 2 of 5 Flutter builds.",
      "All 5 Flutter builds are products Sameem Amjad worked on as an employee, at Zencloud or a previous employer; none of the 6 React Native builds is, so framework is confounded with context.",
      "NestJS is named behind 4 of 6 React Native builds and 0 of 5 Flutter builds; Node.js itself is named in 4 of 6 and 4 of 5, so the runtime is not a point of difference.",
      "3 of 5 Flutter builds name a React.js web surface in their tags or tech stack, against 1 of 6 React Native builds (Dooz, with Angular).",
      "No vertical in the portfolio was built in both frameworks, so there is no like-for-like pair anywhere in these 11 builds."
    ],
    "limitations": [
      "n=11 mobile builds from one portfolio of 25 entries. This is far too small and too self-selected to support any industry-wide claim.",
      "The portfolio is not a record of DevoraX client work. The 5 Flutter builds were employer projects at Zencloud or previous employers; 4 React Native builds have no named client and 2 have no client at all.",
      "No controlled comparison was run. No paired build, no benchmark harness, no instrumentation, no control group.",
      "The two framework groups cover completely different verticals, so store presence is confounded with brief, employer, budget and year.",
      "Framework attribution depends on hand-maintained tags and tech stack lists. Only 8 of the 11 builds name their framework in both; 3 name it in one only, and the category label is too inconsistent to use for attribution.",
      "Store presence is read from stored links. Absence of a link is not proof that an app never reached a store, and a link that resolves today may not resolve tomorrow.",
      "Two entries outside the comparison set, Pastel and LoopedIn, link app store listings without naming a mobile framework, so store presence across the portfolio is wider than these 11 builds.",
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
    "word_count": 2441
  },
  {
    "slug": "supabase-vs-firebase-marketplace-backends",
    "title": "Supabase vs Firebase for Marketplace Backends: What 10 Portfolio Builds Show",
    "meta_description": "Ten builds from the DevoraX portfolio, eight naming Firebase and two Supabase with no overlap: what they show about product shape, and what they cannot.",
    "summary_answer": "Of the 25 entries in the DevoraX portfolio, ten name Supabase or Firebase in their tags or tech stack and none uses both: eight Firebase, two Supabase. Firebase sits alongside mobile frameworks, AWS services and, on Pastel, Sharetribe, while both Supabase builds are React-family web dashboards: Afriva, a demo build, and Augment Fit, which has no public link. With only two Supabase builds, that split describes product shape in one portfolio, not measured backend performance.",
    "dataset_note": "The dataset is the 25 entries in the DevoraX portfolio: products that DevoraX's founder, Sameem Amjad, built or worked on, many as an engineer at other companies. Of the ten builds compared here, four were employer projects (Food Magnet at Zencloud, Bondly and Afriva at Webrange Solutions, and Pastel, where Sameem works now), five have no named client and one, AgroBridge, has no client at all. Counts use structured fields only: category label, tags, declared tech stack and web, Google Play and App Store links. Backend attribution comes from the tags and tech stack. There is no control group, no random assignment, no shared measurement window, no instrumentation of the running systems and no outcome data. On the employer projects the backend was chosen inside another company. This is a record of which backends these products use, not a test of either.",
    "sections": [
      {
        "heading": "How many builds in the portfolio use Supabase, and how many use Firebase?",
        "body": "Across the 25 portfolio entries, ten name one of these two backends in their tags or tech stack: eight Firebase, two Supabase. No entry uses both. That split is the first finding, and the Supabase side is very small. Waitmate, a hospitality admin demo, is not on it: the public demo is a Next.js app on Firebase.\n\nThree further entries name one of the backends only in their written description, not in their tags or tech stack: Outstride and CEDMAT on Firebase, and ConstrActive, a construction CRM built on GoHighLevel, Supabase and Stripe. Of the three, only CEDMAT has a public link, on Google Play. Counting them, the split becomes ten Firebase to three Supabase, still with no overlap. Every other figure below comes from the ten tagged entries.",
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
              "No client named",
              "Demo build on vercel.app"
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
              "Engineer at Pastel",
              "Web, Google Play, App Store"
            ],
            [
              "Pathana Platform",
              "Firebase",
              "Tags only",
              "Next.js & Serverless APIs",
              "No client named",
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
              "Next.js & Microservices",
              "Engineer at Webrange Solutions",
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
        "body": "Seven of the 25 products are two-sided marketplaces, where one set of users lists, sells or provides and another buys or books. That grouping is a classification made for this article from what each product is, not a field in the data. Four of the seven name Firebase: Pastel, an antiques marketplace that runs on Sharetribe with Firebase in its tech stack; Koor, food delivery from home chefs; Bondly, pet care; and AgroBridge, an agricultural marketplace. One sits on Supabase: Afriva, a multi-vendor marketplace with separate admin, manager, seller and buyer roles. Two use neither: the AI E-Commerce Ecosystem runs on Next.js with Docker and Kubernetes, and Dooz Inspected Cars on a NestJS backend.\n\nSo in this portfolio Firebase appears in the marketplace work four times to Supabase's once, and on Pastel it is not the marketplace engine at all; Sharetribe is. With seven products in the group, that ratio describes this portfolio and nothing more. Afriva is the only one of the seven built around four distinct roles, each with its own dashboard. Of the four marketplaces naming Firebase, Pastel, Koor and Bondly have a public link; AgroBridge has no client and no public link.",
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
              "Sameem works on Pastel's iOS app as an engineer at Pastel",
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
              "Engineer at Webrange Solutions",
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
              "No client named; Sameem worked on its NestJS backend",
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
        "body": "Of the 25 entries, 15 link to at least one public surface: 12 web, seven Google Play, six App Store. Inside the two backend groups the pattern diverges. Neither Supabase build has a production link: Afriva is a demo build on vercel.app, and Augment Fit has no public link. Neither has an app store listing.\n\nThe Firebase group is more mixed: six of eight link a web address, two of them the Coffee Shop and Waitmate demo builds, and three of eight link a store listing, with Food Magnet and Pastel on both Google Play and the App Store and Koor on Google Play. AgroBridge has no public link. The likeliest explanation for the split is what these particular products were built to be, not anything about the backends.",
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
              "Web link that is not a demo build",
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
              "3 of 8"
            ]
          ]
        }
      },
      {
        "heading": "What frontend stacks and hosting did each backend pair with?",
        "body": "Across the whole portfolio, counted from tags and tech stack, Next.js appears in five entries, React Native in six, Flutter in five, Node.js in nine and NestJS in four. Inside the backend groups the pairings are distinct. Both Supabase builds pair with the React family on the web: React.js on Augment Fit, and Next.js on Afriva, which runs Next.js 15 with the App Router. Neither names React Native or Flutter.\n\nThe eight Firebase builds spread wider: Next.js on Coffee Shop, Waitmate and Pathana; React Native on AgroBridge and Koor; Flutter with a React.js admin dashboard on Food Magnet; a Node.js service on Bondly; and on Pastel, Sharetribe with an iOS app. Hosting, as far as the links show, does not separate the groups: the one Supabase web link is a vercel.app demo build, as are two of the six Firebase web links, and no entry names Vercel in its tags or tech stack."
      },
      {
        "heading": "What does the way the entries are filed tell you?",
        "body": "One more layer, because it shapes everything above: these are portfolio entries written by hand, not instrumented logs. Three of the eight Firebase entries name Firebase in their category label, against neither of the two Supabase entries. Augment Fit is filed as React.js Frontend and Afriva as Next.js & Microservices, though both run on Supabase, so anyone counting by category alone would miss the Supabase side entirely.\n\nTwenty-two of the 25 entries are flagged as featured, including both Supabase builds and six of the eight Firebase ones, which makes this a showcase rather than a census of everything Sameem has worked on. The only date on an entry is its creation timestamp. Across the 25 entries it takes four distinct dates, and both Supabase entries were created on the same day, so it marks when the entry was written, not when the work was done. No chronology is available here."
      },
      {
        "heading": "What should a team take from a portfolio of this size?",
        "body": "Take the shape, not the verdict. With 25 entries overall and a two-versus-eight split inside the comparison, nothing here establishes that either backend is faster, cheaper, more reliable or better suited to marketplaces in general. What it does show is a pattern in the products themselves. Where the product was a role-separated web dashboard with transactional workflows, as on Afriva, Supabase was the whole data layer. Where the product was mobile-first and needed real-time sync, push notifications or drop-in authentication next to AWS services, as on Food Magnet and Koor, Firebase was one component among several. Waitmate shows the pattern is not a rule: a dashboard can sit on Firebase too.\n\nRead those choices as precedents rather than as DevoraX's house view. If your brief resembles Afriva, the Supabase precedent is the relevant one. If it resembles Koor or Food Magnet, the Firebase precedent is. Neither replaces a load test, a cost model, or a spike built against your own data."
      }
    ],
    "key_findings": [
      "Of 25 portfolio entries, 10 name Supabase or Firebase in tags or tech stack: 8 Firebase, 2 Supabase, and none uses both.",
      "Neither of the 2 Supabase builds has a production link: 1 is a demo build on vercel.app and 1 has no public link. 3 of the 8 Firebase builds link an app store listing.",
      "Of 7 two-sided marketplace products in the portfolio, 4 name Firebase (Pastel's marketplace engine is Sharetribe), 1 runs on Supabase and 2 use neither.",
      "Firebase reads as a component rather than the whole backend: 2 of 8 carry the tag while declaring a different primary stack, and 4 of 8 also name AWS, against 0 of 2 on the Supabase side.",
      "Both Supabase builds are React-family web dashboards, but dashboards are not exclusive to Supabase here: Waitmate, a hospitality admin demo, runs on Next.js and Firebase.",
      "No entry names Firestore, Realtime Database or PostgreSQL in its tags or tech stack, so the data-model debate is absent from the portfolio's own fields."
    ],
    "limitations": [
      "n=25 entries from one portfolio, with only 2 Supabase and 8 Firebase builds in the comparison; group sizes this small cannot support a general recommendation, and 2 builds cannot characterise Supabase at all.",
      "Backend selection was driven by briefs, budgets, employers and pre-existing systems, so the two groups are not comparable populations and were never randomly assigned.",
      "The portfolio holds no outcome, cost or performance data for any build, so nothing here can be read as a scoreboard.",
      "Backend attribution relies on hand-maintained tags and tech stack lists. Outstride, CEDMAT and ConstrActive name a backend only in their written description, so they are reported separately rather than merged into the headline counts.",
      "The marketplace group is a classification of what each product is, made for this article, not a field in the data.",
      "22 of the 25 entries are flagged as featured, so this is a curated showcase, not a complete census.",
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
    "word_count": 2689
  },
  {
    "slug": "sharetribe-vs-custom-marketplace-build",
    "title": "Sharetribe vs Custom Marketplace Development: Where the Line Actually Falls",
    "meta_description": "Where Sharetribe is the right answer, where a custom marketplace build is, and how that line falls in three real marketplaces from the DevoraX portfolio.",
    "summary_answer": "Use Sharetribe when your marketplace is a standard listing-and-commission transaction and you have not yet proved supply. For a large share of marketplaces that is the permanent answer, not a stage. Build custom when the domain data model, the role surfaces or native apps are the product. The line can also run through one project: Pastel, the antiques marketplace where DevoraX's founder Sameem Amjad works as an engineer, runs its marketplace on Sharetribe and adds iOS and Android apps, which Sharetribe does not produce by default. Nobody built the fully custom alternative, so read that as description, not verdict.",
    "dataset_note": "Three marketplaces from the DevoraX portfolio sit behind this piece. Two are employer projects: Sameem Amjad, DevoraX's founder, builds Pastel's iOS app as a software engineer at Pastel (since April 2026; the iOS app launched in November 2025, before he joined), and he worked on Afriva, whose public link is a demo build, as an engineer at Webrange Solutions. He worked on the NestJS backend of the third, Dooz, whose client is not named here. Nobody ran a paired build, a cost model or a migration, and DevoraX has never operated Sharetribe or a Shopify multi-vendor app as a whole platform. A portfolio cannot show what failed.",
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
        "body": "Pastel is an antiques and vintage marketplace built on Sharetribe, with its web marketplace at mypastel.com and apps on the App Store and Google Play. Sameem Amjad, DevoraX's founder, works on its iOS marketplace app as a software engineer at Pastel. Pastel is his employer, not a DevoraX client, so the choice of Sharetribe was Pastel's.\n\nThe reasoning behind that kind of choice is worth setting out. A marketplace payment is not a checkout. Money moves from a buyer to the platform, is held while a one-of-one antique is packed and shipped, and is released to the seller only once the exchange completes, with commissions, refunds, disputes and cross-border payouts attached. That surface area is larger than the storefront itself.\n\nSharetribe supplies it as a modelled state machine built for two-sided commerce, so the web marketplace and the apps read a transaction's current state rather than taking custody of funds. The custom engineering sits where Sharetribe stops: it does not produce iOS and Android apps by default, so those are separate builds. What Pastel does not tell you is whether a fully custom marketplace would have served it better. Nobody built that version, so the example shows the split is workable, not that it was the best possible choice."
      },
      {
        "heading": "When is Sharetribe clearly the right answer?",
        "body": "There are four situations in which DevoraX would tell you not to hire it, and they are common. First, you have not proved supply. A marketplace with no sellers has nothing to transact, and no framework choice changes that; the portfolio holds no failure data, so treat that as mechanics rather than a finding. Until sellers list and buyers pay, every engineering hour funds a hypothesis.\n\nSecond, your transaction is standard: list, buy or book, pay, fulfil, release, commission. Third, your differentiation is not software, because curation, community and category expertise are not code. Fourth, your budget is below the build, and DevoraX's published starting price is $2,900.\n\nOne thing worth being plain about, because vendor pages are not: for many marketplaces the hosted product is the permanent answer rather than a stage before a custom build. A configured marketplace taking real money is a finished business, not a prototype. That you will inevitably outgrow it is a sales line, and there is no evidence for it here."
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
              "Sameem works on Pastel's iOS app as an engineer at Pastel",
              "mypastel.com; App Store; Google Play"
            ],
            [
              "Afriva (Next.js 15, Supabase)",
              "Not named in the portfolio; order and inventory state sit in the platform's own Postgres schema",
              "Four role dashboards (admin, manager, seller, buyer), real-time order tracking",
              "Sameem worked on it as an engineer at Webrange Solutions",
              "Demo build at afriva-buyer.vercel.app"
            ],
            [
              "Dooz Inspected Cars (Angular, React Native, NestJS)",
              "Not named in the portfolio; one NestJS backend serves the web, iOS and Android apps",
              "An inspection report and grade on every car, financing and insurance alongside the listings",
              "Sameem worked on the shared NestJS backend",
              "dooz.com; Google Play (100K+ downloads); App Store"
            ]
          ]
        }
      },
      {
        "heading": "How do the cost shapes actually differ?",
        "body": "The headline price is the least interesting number in this decision, and it is also the one this article is least able to give you. A hosted product is operating expenditure: a subscription plus payment processing, with no capital outlay. A custom build is capital expenditure plus a change budget, and it is the change budget that kills projects rather than the build price.\n\nDevoraX's own model is a fixed-price proposal rather than hourly billing, with indicative starting points of $2,900 for an MVP Starter and $7,500 for Growth, and Enterprise quoted per project. Those are starting points, not quotes. Nothing shaped like Dooz, with web, iOS and Android apps over one shared backend, an inspection report on every listing and financing and insurance alongside, fits the smaller band.\n\nThis article will not tell you what the alternatives cost. Two things are worth pricing yourself: the configuration, design and data-migration labour a hosted setup still takes, and what a custom build does at ten times the volume, where re-architecture is an engineering ticket like any other.",
        "table": {
          "caption": "Where each cost number has to come from. The only figures stated here are DevoraX's own indicative starting points; no third-party pricing is quoted anywhere, because DevoraX holds no invoices and ran no cost model.",
          "headers": [
            "Cost line",
            "What DevoraX can state about its own pricing",
            "Where the real number has to come from"
          ],
          "rows": [
            [
              "Build or setup",
              "Fixed-price proposals starting at $2,900 (MVP Starter) and $7,500 (Growth), Enterprise quoted per project. Indicative starting points, not quotes.",
              "Any setup cost on a hosted product, including configuration, design and data-migration labour, has to come from whoever does that work."
            ],
            [
              "Subscription",
              "None. DevoraX charges no recurring fee and does not resell hosting; you pay your own infrastructure providers directly.",
              "The vendor's current pricing page. Hosted marketplace products and commerce platforms are sold as tiered subscriptions; multi-vendor apps are priced by their own publishers, on models that vary."
            ],
            [
              "Payment processing",
              "Nothing. DevoraX integrates processors; it does not set their rates and holds no invoices.",
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
        "body": "Less than the confidence of these headings suggests, so here are the bounds. DevoraX is a two-person studio that has been building since 2019. Its founder, Sameem Amjad, holds a 5.0 rating on Fiverr across 50+ projects since January 2022, for clients in the US, UK, Canada and Hong Kong. Two of the three marketplaces here are employer projects. A portfolio is by construction a record of what went well enough to show, so nothing cancelled or abandoned would appear in it.\n\nNobody has built the same marketplace twice, once hosted and once custom. There is no paired test, no migration in either direction and no instrumentation of either approach.\n\nDevoraX is also an interested party. It sells custom builds, and the four situations listed earlier are precisely the ones where it loses the sale. They are here because for a large share of readers the honest answer is a product DevoraX did not build."
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
      "Two of the three are employer projects: Pastel, where Sameem works now, and Afriva, at Webrange Solutions. On the third, Dooz, Sameem worked on the shared NestJS backend."
    ],
    "limitations": [
      "Three marketplaces inside a 25-entry portfolio from a two-person studio. A portfolio is selection-biased by construction: no cancelled, abandoned or failed marketplace could appear in it, and the portfolio was not audited for every product that might be called marketplace-shaped.",
      "Two of the three are employer projects, and no entry records a DevoraX scope or price for any of them, so none of them shows how DevoraX itself scopes or prices a marketplace.",
      "Nobody built the same marketplace twice, once on a hosted product and once custom. There is no paired test, no A/B and no migration in either direction, so every comparison here is engineering reasoning rather than measurement.",
      "DevoraX has not run Sharetribe or a Shopify multi-vendor app as an entire platform. The direct experience of Sharetribe behind this article is Pastel, where Sameem works on the iOS app, which is why the structural table has no Shopify column.",
      "The portfolio holds no outcome data for these marketplaces, and even if it did, too much else differs between the three businesses for it to show whether build-versus-buy was the right call.",
      "DevoraX sells custom builds, so it has a commercial interest in this answer. The only prices in this article are its own indicative starting points, which are not quotes; no third-party pricing is stated anywhere, including in the cost table."
    ],
    "cannot_answer": [
      "What Sharetribe, Shopify or any multi-vendor app will cost you at your transaction volume. DevoraX holds no invoices and quotes no third-party prices, so those figures have to come from the vendors' current terms.",
      "Whether Pastel would have done better on a fully custom marketplace, or Afriva on an off-the-shelf product. No counterfactual was built, so the comparison is untested.",
      "Whether the build-versus-buy decision made any of these businesses more or less successful. There is no outcome data, no control group and no baseline.",
      "How hard it is to migrate from a hosted marketplace to custom code, or back. No product in the portfolio has made that move."
    ],
    "word_count": 2932
  },
  {
    "slug": "what-a-3000-mvp-budget-gets-you",
    "title": "What a $3,000 MVP Budget Actually Gets You (And What It Does Not)",
    "meta_description": "What a $3,000 MVP budget buys and what it does not, checked against the published $2,900 DevoraX starting tier and five web builds from its portfolio.",
    "summary_answer": "Roughly $3,000 buys one working surface for one primary audience, a narrow set of features, and a managed stack you do not have to operate. It does not buy role-separated dashboards, an app-store release, verified multi-tenancy or a security assessment. What it depends on is roles: each additional kind of user adds a surface, a permission boundary and a full test pass. If your difference from an off-the-shelf product is a preference rather than a rule, rent instead.",
    "dataset_note": "This draws on the 25 entries in the DevoraX portfolio, products that DevoraX's founder, Sameem Amjad, built or worked on, many as an engineer at other companies, and examines five web builds closely: Coffee Shop, Augment Fit, Waitmate, Pathana and Afriva. None of the five is a DevoraX engagement with a recorded price: Afriva was employer work at Webrange Solutions, and the other four have no named client. No entry stores a price, timeline, team size or developer-hour count, so nothing here evidences what any build cost. The five are used for their scope shapes only.",
    "sections": [
      {
        "heading": "What does a $3,000 MVP budget actually buy?",
        "body": "A budget in that range buys one working surface, for one primary audience, doing a small number of things well, on a managed platform somebody else operates. DevoraX's published starting points are an MVP Starter from $2,900, Growth from $7,500 and Enterprise scoped individually. Those are starting points rather than quotes: every engagement is priced as a fixed sum in a proposal written after a free 30-minute discovery call, and DevoraX does not bill hourly. None of the 25 portfolio entries behind this article stores a price, so the builds below show scope, not cost.\n\nWhat the portfolio does support is a description of scope shapes, and the smallest shape among the five examined here is the Coffee Shop Web App, a cafe website demo build hosted on Vercel at coffee-shop-original.vercel.app. One public web surface. One audience, the customer. Four named features: a menu with prices, a gallery, store locations and an order button. A stack of Next.js with server-side rendering and Firebase for menu content, which means no server to run and no database to operate. No second operational surface, no separate admin product, no real-time requirement, no mobile release. That is the shape a starting-tier budget can hold: a single front door, a single kind of user behind it, and content a non-developer can keep current. Read it as a scope illustration and not as a recommendation, because a later section explains why a reader arriving with exactly that brief should rent instead."
      },
      {
        "heading": "Why is $3,000 a scope number rather than a price?",
        "body": "Because the fixed price is the output, not the input. A proposal prices a defined scope, so the only thing a smaller budget can move is what sits inside that scope. That is a more useful conversation than asking for a discount on a rate, and it is why the discovery call happens before the number. It helps to know the shape of the supplier too. DevoraX has been operating since 2019 and is two people, Sameem Amjad and Usman, who bring in specialists when a scope needs them. No portfolio entry holds any cost accounting, no price, no hours and no allocation, so this article will not explain the tier by describing an overhead structure nobody measured. What the DevoraX site does publish alongside the price is the working arrangement: direct Slack access, weekly demos and a shared project board.\n\nWhat actually moves the number is structural rather than cosmetic. How many distinct kinds of user need their own screens. Whether money changes hands inside the product. Whether anything has to stay correct under contention, such as a seat, a table or a unit of stock two people can claim at the same moment. Whether the product must exist in an app store as well as a browser. Whether the data is sensitive enough that isolation between tenants has to hold by construction rather than by careful coding. Each of those is a step change, not a percentage increase, because each adds a surface, a permission boundary and a set of failure cases somebody has to test. Colour schemes, copy and the number of marketing pages are small against any of them. Timelines follow the same logic: any duration in a proposal is an estimate for that scope, and no portfolio entry stores how long a build actually took."
      },
      {
        "heading": "What does scope actually look like across five web builds?",
        "body": "Five of the 25 portfolio entries are useful calibration here, because they are web products described in enough detail to count surfaces and roles, and they sit at visibly different levels of scope. Be clear about what they are before reading the table. Pathana is live at pathana.net. Coffee Shop, Waitmate and Afriva are demo builds on vercel.app. Augment Fit has no public link. Sameem worked on Afriva as an engineer at Webrange Solutions. All five are web-only, and that is a property of which five were picked rather than of the budget or of the market: eight of the 25 entries link a live Google Play or App Store listing.\n\nRead the table by counting surfaces and roles rather than features. Coffee Shop has one of each. Augment Fit is one admin panel with dashboards for two named roles, trainers and clients. Waitmate is a hospitality admin demo for reservations, tables and staff. Pathana is the instructive one: one platform where three parties, students, counsellors and families, get shared views of the same plans, so the roles multiply while the surfaces do not. Afriva has four separate role dashboards. Named feature counts stay inside a narrow band of three to four across all five, which is the point, because features are cheap relative to the number of places and permission levels each one has to be correct in. No entry stores a price, so the table has no column placing any build against the DevoraX tiers.",
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
              "Demo build (coffee-shop-original.vercel.app)",
              "No client named",
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
              "No client named",
              "1 (one platform; no separate surfaces described)",
              "3 (students, counsellors, families) with shared views",
              "Personalised roadmaps, milestone tracking, career exploration, shared views",
              "No"
            ],
            [
              "Afriva E-Commerce Platform",
              "Demo build (afriva-buyer.vercel.app)",
              "Engineer at Webrange Solutions",
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
        "body": "It does not buy role separation. Four role dashboards like Afriva's are four products sharing a schema: each queries a different slice of the data, each enforces a different permission set, and a change to seller tooling must not quietly regress the buyer checkout path. That is a property of the architecture, not evidence of a process. The portfolio holds no test matrix, review step or release procedure for any entry, so nothing here should be read as a description of how DevoraX tests. It does not buy institutional multi-tenancy either. A product like Pathana, where counsellors and families see students' records, has to keep each student's data visible only to the right people by construction rather than by careful coding, and the portfolio documents no assessment of how any build does that.\n\nIt does not buy a native release. All five reference builds are web products, while eight of the 25 entries link a live store listing, and a store release is a second build with its own review process and its own release cadence. It does not buy assurance: none of the five has a penetration test, a security assessment, a load test or an uptime SLA behind it, and DevoraX holds no certifications and has run no compliance audits. A starting-tier engagement carries one month of support, after which the system is yours to run and the code and IP are yours on final payment."
      },
      {
        "heading": "When is the honest answer not to hire an agency like DevoraX at all?",
        "body": "Frequently, and here is the version with no hedge on it. If you are a single-location cafe, restaurant, salon, gym or retailer who needs a branded site with a menu or catalogue and online ordering, rent. Hosted commerce platforms and site builders solve that exact shape as a subscription, and they arrive with payment handling, hosting, updates and a support contract that keeps renewing for as long as you pay. That is the Coffee Shop scope shape, and renting is the right answer for a reader arriving with that brief today. The same holds for appointment and session booking for a small team, and for an internal dashboard over data you already hold.\n\nThe table below is deliberately two-sided, because owning software has costs as surely as renting it does. Renting is a fee that never stops and a data model you configure rather than design. Owning is a hosting bill, a maintenance burden, support only for as long as it is contracted, one month at the DevoraX starting tier, and key-person risk with a two-person supplier. The test you can apply on your own is whether the thing your product does differently is a preference or a rule. If your difference is a preference, your own brand, your own layout, your own copy, rent. If it is a rule the hosted product cannot express, this capacity is contested, this payout splits four ways, this record is legally restricted, that is where custom starts earning the money. Afriva has four role dashboards; whether that could have been rented, nothing in the portfolio says.",
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
              "Your own hosting bill, your own upgrades, and support only for as long as it is contracted; the DevoraX starting tier includes one month",
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
        "body": "No, and it is worth being exact about why. A portfolio entry describes a product, not a price. None of the 25 entries stores what a build cost, how long it took or who paid for it, and the five examined here are not DevoraX price points in disguise. Reading any portfolio as a price signal, this one included, is the specific error this article exists to prevent.\n\nOne structural caution about the dataset itself: 25 entries is small, it is one engineer's body of work across several employers and projects, and this article chose which five to examine. No entry stores a delivery, launch or failure status of any kind, so the portfolio cannot tell you how many projects ran late, ran over or were abandoned. What it can tell you is that fifteen of the 25 entries link to something public, three of those links are demo builds, and ten link to nothing. A portfolio is not a base rate."
      },
      {
        "heading": "What should you actually do with roughly $3,000?",
        "body": "Three answers, and only one of them involves hiring anybody. If your product is the default shape of a category with mature hosted products in it, rent one, spend nothing on engineering, and revisit in a year when you know which constraint actually hurts. That is the answer for anyone whose difference from the category default is a preference rather than a rule, and the Coffee Shop scope shape sits squarely inside it. If your product has one primary audience, a handful of features, and one rule the hosted products cannot express, a starting-tier custom build is a real option: one surface, one audience, a managed backend, a live link at the end. If your brief names three user roles, a store release, a compliance obligation or contention over finite capacity, this budget buys a half-built version of that, and the move is to cut to one role and ship it rather than to find a supplier who will agree to all of it at this price.\n\nTwo practical notes if you do spend it. Keep some of it back. A starting tier includes one month of support and then the system is yours to run, so a budget entirely consumed at launch leaves nothing for the first real bug and nothing for the hosting bill either. And insist the scope is written down as a fixed price against a specific list before anyone starts, which is how DevoraX works and is the only structure under which a small budget is safe for both sides. If a supplier cannot tell you what falls out of scope at your number, they have not scoped it, and the shortfall surfaces later as either an invoice or an argument. Ask the same supplier what they would tell you to rent instead, because the answer tells you what the proposal is really for."
      }
    ],
    "key_findings": [
      "All five reference builds are web products, a property of the selection rather than of the budget: 8 of the 25 portfolio entries link a live Google Play or App Store listing.",
      "Surfaces and roles, not features, separate the five: Coffee Shop has one surface and one audience, Augment Fit one admin panel serving two named roles, Waitmate one admin dashboard, Pathana one platform with three parties sharing views, and Afriva four role dashboards, while named feature counts stay within a band of three to four throughout.",
      "No portfolio entry stores a price, a timeline or a team size, so none of the five named builds is evidence of what $2,900 buys.",
      "DevoraX's published starting points are MVP Starter from $2,900, Growth from $7,500 and Enterprise custom-scoped, each priced as a fixed sum in a proposal after a free 30-minute discovery call. The MVP Starter includes one month of support.",
      "None of the five has a penetration test, a security assessment, a load test or an uptime SLA behind it, and DevoraX holds no certifications and has run no compliance audits.",
      "15 of the 25 entries link to something public, 3 of those links are demo builds, and 10 link to nothing. No entry stores a delivery, launch or failure status, so the portfolio cannot be read as a success rate in either direction."
    ],
    "limitations": [
      "n=25 portfolio entries, the body of work of a two-person studio's founder, and this article chose which five to examine. No entry stores a delivery, launch or failure status, so nothing here estimates the odds of a $3,000 build succeeding.",
      "The five examined builds illustrate scope shapes, not DevoraX pricing.",
      "No price, effort, duration or team-size data exists in any entry. Every statement about what a budget buys rests on scope shape and general engineering reasoning, not on cost accounting.",
      "The five builds were selected for being web products described in enough detail to count surfaces and roles, which is why all five are web-only. The 8 store-listed entries in the portfolio are not represented here, so this article says nothing about what a mobile build involves.",
      "Only one of the five, Pathana, is a live production site; three are demo builds and one has no public link, so their scope is described from the portfolio rather than from a product you can inspect in full.",
      "Third-party products are described by commercial model and positioning only. No current price is quoted for any of them, packaging in this space changes, and the right build-versus-rent answer changes with it."
    ],
    "cannot_answer": [
      "What any of the five named builds cost. No entry stores a price, so the relationship between these scopes and the published DevoraX tiers is inference, not evidence.",
      "How long any build actually took. No entry stores a real duration, sprint count or developer-hour figure.",
      "What a build costs to run and maintain after handover. No hosting invoices, platform bills or post-launch support costs exist anywhere in the portfolio.",
      "Whether $2,900 is competitive against other suppliers. DevoraX holds no competitor quotes and did not price-check anybody for this article."
    ],
    "word_count": 3296
  }
];

/** When these articles were last substantively revised (honest freshness signal). */
export const INSIGHTS_UPDATED = '2026-10-08T00:00:00.000Z';

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export function allInsightSlugs(): string[] {
  return INSIGHTS.map((i) => i.slug);
}
