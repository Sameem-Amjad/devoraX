/**
 * Insights: data-backed research articles.
 *
 * These exist for citation, not for keyword volume. They are written from the
 * agency's own delivery record — counts and outcomes that no competitor can
 * reproduce — and they state their own limits, which is what separates a source
 * worth quoting from marketing copy.
 *
 * Content is generated from the real `projects` dataset and passed through an
 * adversarial fact-checker that verifies every table cell against source data.
 * Never hand-add a number here that is not derivable from the project records.
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
    "title": "What We Measured Across 25 Production Builds",
    "meta_description": "One agency's 25-project delivery record, recounted field by field: stored public links, stack frequency, and 57 stat values with their known defects.",
    "summary_answer": "Across 25 production builds, 18 (72%) store at least one public link and 19 contribute at least one quantified stat value, 57 in total, of which 52 are numeric. The clearest pattern is backend concentration: 13 of 25 run a Node-family backend, and Node.js and AWS tie at nine projects each.",
    "dataset_note": "This is n=25 shipped projects from a single software agency, counted from that agency's own structured project entries. It is not a market survey, a random sample or a controlled study. Eighteen projects store at least one public link, seven store none, and none of the links were fetched or checked live for this article. The 57 quantified figures are the values we store alongside each project, 52 of them numeric and five non-numeric descriptors. Nothing we store records who supplied or measured them, none were independently audited or instrumented by us, and none carry a measurement date, a baseline or a comparison condition. There is no control group and no cancelled-project data, so the record is survivorship-limited by construction. Read every figure as \"in this agency's record of 25 builds\", never as an industry rate.",
    "sections": [
      {
        "heading": "What exactly is in this dataset?",
        "body": "The dataset is one agency's delivery record: 25 production projects, each stored as a structured row with a title, a category label, a tag list, a declared tech stack, a problem/solution/result narrative, a stats object and three link fields for web, Android and iOS. All 25 rows carry a non-empty problem, solution and result. The stats objects hold 95 entries in total. Fifty-seven of those were captured as quantified values in the aggregate pass; the other 38 are purely qualitative strings such as \"Bank-grade\", \"Real-time\" or \"High\". Nineteen of the 25 projects contribute at least one quantified value and six contribute none. Eighteen projects store at least one URL. Every figure below comes from counting those rows directly. Nothing is estimated, extrapolated or benchmarked, because no benchmark was run, and wherever the precomputed aggregate file disagrees with a direct recount of the rows, this article publishes both numbers instead of quietly choosing one."
      },
      {
        "heading": "How many of the 25 builds store a link a reader can open?",
        "body": "Verifiability is worth counting first, because a portfolio claim nobody can open is not evidence. Eighteen of the 25 builds store at least one URL, which is 72% of the record. Counting by the link's actual domain rather than by which field it sits in, 15 store a web address, seven store a Google Play URL and seven store an Apple App Store URL. Those rows overlap, since one project can publish to all three surfaces, so they deliberately sum to more than 25. One correction is baked into the table. The Three28 Creator Platform row stores an App Store URL inside its android field, so a naive field-based count reports eight Android and six iOS; counting by domain gives seven and seven. Seven projects, 28% of the record, store no link at all. The rows give no reason for that, so none is offered here.",
        "table": {
          "caption": "Stored public links across 25 production builds, counted by the link's domain rather than by which field holds it. The first three rows overlap and do not sum to 25.",
          "headers": [
            "Link type",
            "Projects",
            "Share of 25"
          ],
          "rows": [
            [
              "Web URL",
              "15",
              "60%"
            ],
            [
              "Google Play URL",
              "7",
              "28%"
            ],
            [
              "Apple App Store URL",
              "7",
              "28%"
            ],
            [
              "At least one URL stored",
              "18",
              "72%"
            ],
            [
              "No URL stored",
              "7",
              "28%"
            ]
          ]
        }
      },
      {
        "heading": "What shipping shapes appear in the record?",
        "body": "Grouping the same 25 builds by published surface, rather than by link type, gives mutually exclusive buckets that sum cleanly to 25. Web-only is the largest group at nine projects, 36% of the record. Five projects, 20%, publish to web, Google Play and the App Store together. Three reach a mobile store with no web surface at all: two on Google Play only and one on the App Store only. One publishes to web and the App Store without a Play listing. Seven store no link. The pattern in our record is that full three-surface delivery is the exception rather than the norm, and that a single web surface is the most common shipping shape by a clear margin. That is a statement about what these 25 clients asked for and what reached a stored link, not a claim about the market. A different 25 projects would redistribute these buckets.",
        "table": {
          "caption": "The 25 builds by published surface, again counted by link domain. Buckets are mutually exclusive and sum to 25.",
          "headers": [
            "Shipping shape",
            "Projects",
            "Share of 25"
          ],
          "rows": [
            [
              "Web only",
              "9",
              "36%"
            ],
            [
              "No URL stored",
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
              "Web + App Store, no Play listing",
              "1",
              "4%"
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
        "heading": "Which technologies appear most often across the 25 builds?",
        "body": "Technology frequency is counted with one explicit rule: a project counts once for a technology if that name appears in the project's tag list or among its declared tech stack entries. Prose mentions inside descriptions are excluded, because prose is inconsistent between rows. Under that rule Node.js and AWS tie at nine projects each, React.js follows at eight and Firebase at seven. The source file disagrees with itself here and the disagreement is worth naming: its top_technologies list gives AWS eight and React.js seven, while its stack_counts field gives nine and eight. The gap is a single row, Food Magnet: Vender, whose declared stack entries read \"AWS Lambda Functions (Backend)\" and \"React.js (Admin Dashboard)\". Under the rule as written those count, so this table publishes nine and eight and flags that an exact-string match would return one fewer for each.",
        "table": {
          "caption": "Technology frequency, counted once per project where the name appears in the tag list or the declared tech stack. Projects use several technologies, so rows do not sum to 25. Exact-string matching instead of substring matching would return AWS 8 and React.js 7.",
          "headers": [
            "Technology",
            "Projects (of 25)",
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
              "React.js",
              "8",
              "32%"
            ],
            [
              "Firebase",
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
              "3",
              "12%"
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
        "body": "The technology table is a floor, not a census, and the record shows exactly why. Twenty of the 25 projects list precisely two tech stack entries, typically one frontend and one backend. Only five list more, and only one lists eight. A list that stops at two names cannot describe a stack that runs to a dozen dependencies. The proof is in the narratives: MongoDB, Redis, Socket.io, PostgreSQL and Vercel are each described in one or two project write-ups, yet every one of them scores zero across all 25 tag and tech stack lists. The S3 storage service is named in five narratives and in no tag or recorded tech stack. Relaxing the rule to a substring match across the narrative prose as well raises Node.js from nine to 13 and AWS from nine to 13. Read every line in the technology table as a minimum."
      },
      {
        "heading": "Does the record favour React Native or Flutter?",
        "body": "Eleven of the 25 builds name a cross-platform mobile framework in their tags or declared stack: six React Native and five Flutter. The two sets do not overlap at all. No row uses both, and no row names a native-only stack such as Swift, SwiftUI, Kotlin or Jetpack Compose anywhere in its tags or techstack. Of the six React Native projects, four store a public store listing; of the five Flutter projects, three do. Within a sample this size the gap between six and five carries no statistical weight, and the record cannot test whether framework choice relates to anything else, so that question sits in the list of things this dataset cannot settle. What the record does support is narrower: across 11 mobile builds here the default was cross-platform, and not one of the 25 rows declares a native iOS or Android toolchain."
      },
      {
        "heading": "What kinds of outcomes do the stat fields hold?",
        "body": "The 57 quantified values are not one kind of thing, and treating them as a single pile overstates what they show. Twenty-five are scale or volume counts across 13 projects: active users, completed orders, verified vehicles. Nine are rate, growth or efficiency figures across seven projects. Eight are satisfaction or rating values across eight projects. Five are explicitly revenue-labelled figures across five projects. Five are reliability or technical measures across three projects. The last five are not outcomes at all but configuration or compliance descriptors, such as encrypted storage or GDPR and ISO 27001 alignment, that were captured alongside genuine measurements. Stripping those out leaves 52 numeric values. One judgement call is worth flagging: Dooz's \"1.2B+ JD Total Transactions\" is a monetary figure counted under scale, because the row labels it transaction volume rather than revenue.",
        "table": {
          "caption": "The 57 quantified stat values grouped by what they measure. Every value is stored in the project row; none was independently audited. Project counts overlap, so that column does not sum to 19.",
          "headers": [
            "Metric family",
            "Values",
            "Projects",
            "Example from the record"
          ],
          "rows": [
            [
              "Scale / volume counts",
              "25",
              "13",
              "Loopedin Platform, Active Users, 2.4M+"
            ],
            [
              "Rate, growth or efficiency",
              "9",
              "7",
              "Augment Fit Platform, Retention Rate, 87.3%"
            ],
            [
              "Satisfaction or rating",
              "8",
              "8",
              "Waitmate Platform, Customer Satisfaction, 4.8/5"
            ],
            [
              "Revenue-labelled",
              "5",
              "5",
              "Afriva E-Commerce Platform, Total Revenue, $1.2M"
            ],
            [
              "Reliability or technical",
              "5",
              "3",
              "FinTech Mobile App, Uptime, 99.9%"
            ],
            [
              "Configuration / compliance descriptor",
              "5",
              "4",
              "Digital Power of Attorney Platform, Compliance, GDPR & ISO 27001"
            ],
            [
              "Total",
              "57",
              "19 distinct",
              "52 of 57 are numeric"
            ]
          ]
        }
      },
      {
        "heading": "What shape do the 57 recorded values take?",
        "body": "The shape of the values says as much as the values do. Each of the 57 was assigned to exactly one bucket, in this order: percentage, monetary, rating scale, rounded count, exact-looking count, then non-numeric descriptor. Nineteen are percentages, and five of those 19 are the identical string 98%, sitting on five separate projects. That is the shape of a rounded self-assessment rather than five independent measurements landing on the same figure. Seventeen more are rounded floors ending in a plus sign, like \"20,000+\" or \"2.4M+\", which are approximations by construction. Only seven read as exact instrument counts, such as \"12,778\" and \"128,540\". Two counts land on 52 here by coincidence and should not be confused: 52 of the 57 values are numeric, and 52 of the 57 are distinct strings. Only 98% and 100% appear more than once.",
        "table": {
          "caption": "The 57 quantified values by written form. Each value is assigned to exactly one bucket in the priority order given in the text, so the rows sum to 57.",
          "headers": [
            "Value shape",
            "Values",
            "What the record shows"
          ],
          "rows": [
            [
              "Percentage",
              "19",
              "98% appears five times; 100% appears twice"
            ],
            [
              "Rounded count ending in \"+\"",
              "17",
              "\"20,000+\", \"2.4M+\" — a stated floor, not a reading"
            ],
            [
              "Exact-looking count",
              "7",
              "\"12,778\", \"128,540\", \"156\""
            ],
            [
              "Monetary",
              "6",
              "five revenue-labelled, one transaction volume in JD"
            ],
            [
              "Rating on a five-point-style scale",
              "3",
              "\"4.8 out of 5\", \"4.8/5\", \"4.9+\""
            ],
            [
              "Non-numeric descriptor",
              "5",
              "\"GDPR & ISO 27001\", \"24/7\", \"Docker/K8s\""
            ],
            [
              "Total",
              "57",
              "52 distinct strings across the 57 values"
            ]
          ]
        }
      },
      {
        "heading": "What does the record show about stack concentration?",
        "body": "Two concentrations stand out in our record. First, backends: nine rows name Node.js and four name NestJS, with no overlap between the sets, so 13 of 25 builds, 52%, run a Node-family backend. Second, managed backend services: seven name Firebase and three name Supabase, again with no overlap, so 10 of 25, 40%, lean on a backend-as-a-service rather than a self-managed data layer. Taking React.js, Next.js, React Native and the bare React tag together gives 18 of 25, 72%, touching the React ecosystem somewhere. Container orchestration is the opposite story: Kubernetes appears in exactly one row. The self-assigned category labels agree, with six rows titled \"Node.js Backend & AWS\" and four \"React Native & Node.js\". Nothing in the record says a house standard was imposed; this is simply what the stored stacks add up to."
      },
      {
        "heading": "What would make this record more citable next time?",
        "body": "The most useful output of counting your own record is the list of things you wish you had captured. Five gaps are visible. No recorded figure carries a measurement date, so a revenue figure cannot be placed on a time basis. No percentage change is paired with a baseline, which is what turns a reported improvement into evidence. Nothing we store records who supplied or measured any value, so provenance has to be assumed rather than read. The tech stack list caps most projects at two entries, which is why the technology counts are a floor. And one project stores an App Store URL in its Android link, the kind of quiet error that inflates a platform count. The only date any project carries is the timestamp from when its entry was created, which dates the CMS entry rather than the build. None of these are hard to fix at capture time and all are impossible to fix retroactively."
      }
    ],
    "key_findings": [
      "18 of 25 production builds (72%) store at least one public URL and 7 store none; counted by link domain, 15 are web addresses, 7 Google Play and 7 Apple App Store.",
      "13 of 25 projects (52%) run a Node-family backend: 9 name Node.js and 4 name NestJS, with no overlap between the two sets.",
      "Node.js and AWS tie as the most frequent technologies at 9 of 25 projects each, under the rule 'named in the tag list or the declared tech stack'.",
      "Mobile work splits 6 React Native to 5 Flutter across 11 projects, and no project names a native iOS or Android toolchain in any tag or recorded tech stack.",
      "Only 5 of 25 builds shipped to web, Google Play and the App Store together; 9 shipped web-only and 3 reached a single mobile store with no web surface.",
      "Of 57 quantified stat values, 52 are numeric and 5 are configuration or compliance descriptors; 19 are percentages, and the string 98% appears on five separate projects."
    ],
    "limitations": [
      "n=25 from a single agency. These are one team's clients, sectors and budgets, not a random or representative sample of software projects.",
      "Provenance is not stored. No field in either source records who supplied or measured any stat value. None were independently audited, instrumented by us, or checked against a client's analytics, so every outcome figure should be read as self-reported.",
      "No control group and no baseline. A reported '20% operational efficiency increase' has no recorded before-state or comparison condition, so it cannot be treated as a measured effect.",
      "The technology counts are a floor, not a census. 20 of the 25 projects cap their recorded tech stack at two entries, and MongoDB, Redis, Socket.io, PostgreSQL and Vercel each appear in project narratives while scoring zero across all 25 tag and tech stack lists.",
      "The source aggregate file disagrees with itself on two counts: its top_technologies list gives AWS 8 and React.js 7 while its stack_counts field gives 9 and 8. This article publishes the values consistent with its stated rule (9 and 8) and names the discrepancy rather than hiding it.",
      "Stat values carry no measurement date and no consistent time basis. '$1.2M Total Revenue' and '$28,450 Monthly Revenue' are not comparable quantities.",
      "21 of the 57 values are rounded approximations ending in a plus sign, such as '20,000+' and '2.4M+'. They are floors stated by the source, not precise readings.",
      "Outcome metrics are unevenly distributed: 19 of 25 projects supply all 57 and 6 supply none. Food Magnet: Vender stores 11 stat entries, none of which is a quantified outcome.",
      "One row stores an Apple App Store URL inside its android field. Counts here are taken by link domain, which corrects for it, but a field-based count of the same data would report 8 Android and 6 iOS.",
      "Links were counted as present in the rows. They were not fetched or checked live, so 'public link' here means 'a URL is stored', not 'the page resolves today'.",
      "The record contains shipped projects only. There is no entry for cancelled, abandoned or failed work, making every pattern here survivorship-limited.",
      "The only timestamp on any row is created_at, which dates the CMS entry (8 rows in 2025, 17 in 2026) rather than the build or the delivery."
    ],
    "cannot_answer": [
      "Is React Native faster, cheaper or more maintainable than Flutter? The record holds no benchmarks, build times, bundle sizes, crash rates or defect counts for either.",
      "Does framework choice relate to whether an app reaches a public store? With 6 React Native and 5 Flutter projects and no test performed, the record cannot support a correlation claim in either direction.",
      "Did any stack choice cause any reported outcome? With no control group and no counterfactual, the record can show co-occurrence and nothing more.",
      "What did these builds cost, or how many developer hours did they take? No cost, effort or team-size data is stored in any row.",
      "How long did each project run from kickoff to launch? The only date on a row is its created_at timestamp, which dates the record rather than the build.",
      "How do these figures compare to industry averages? n=25 from one agency cannot establish or test an industry baseline.",
      "Are these products still live and maintained today? Links were read from the rows rather than fetched, and no uptime, release cadence or maintenance status is stored.",
      "Which technology choices failed, and why? Only shipped projects are recorded, so there is no failure data to analyse.",
      "Who supplied or measured each stat value? No field records provenance, so even the conservative 'self-reported' reading is an assumption rather than a stored fact.",
      "What is the combined end-user total across the portfolio? The user figures use incompatible definitions (active users, total users, student reach, workers supported) and 21 of 57 values are rounded floors, so they cannot legitimately be summed."
    ],
    "word_count": 2431
  },
  {
    "slug": "react-native-vs-flutter-production-experience",
    "title": "React Native vs Flutter: Evidence From 11 Production Apps",
    "meta_description": "Eleven shipped cross-platform apps, counted from the delivery record: which reached both app stores, which backends recurred, and what the data cannot settle.",
    "summary_answer": "Across 11 production cross-platform apps, three of five Flutter builds are listed on both Google Play and the App Store, against one of six React Native builds. Four of five Flutter builds also shipped a React or Next.js web surface, against one of six. This is delivery history, not a performance benchmark.",
    "dataset_note": "The dataset is 25 delivered projects from a single agency portfolio, 11 of which record a cross-platform mobile framework in their tags or recorded tech stack: 6 React Native, 5 Flutter. Framework attribution uses only those two structured lists. Every other technology count uses one rule applied uniformly to every project in every table: the technology is named anywhere in the project record, meaning the category, the tags, the recorded tech stack, the stored figures, or the written problem, solution, result and narrative text. Release status is read from the stored web, Android and iOS links. Outcome figures come from the figures stored with each project and are client- or project-reported, never independently audited. There is no control group, no randomisation, no paired build of the same app in both frameworks, and no controlled performance testing of any kind. It is a delivery record, not an experiment.",
    "sections": [
      {
        "heading": "What exactly did we ship with React Native and Flutter?",
        "body": "Across 25 portfolio projects, 11 record a cross-platform mobile framework in their tags or techstack fields: six React Native and five Flutter. That structured-field rule matters at the edges. Dooz Inspected Cars lists Angular and NestJS in techstack and React Native only in its tags, so it counts. Waitmate Platform names React Native in its content and solution text but carries neither a tag nor a techstack entry, so it does not, which is why our React Native figure is six rather than seven. The remaining 14 projects record no mobile framework, which is not the same as being web-only. Outstride carries both a Google Play and an App Store URL, and Pastel Marketplace carries an App Store URL, yet neither record names the framework behind those apps. The table below is therefore the entire comparison set, and every column is read from the project records rather than inferred.",
        "table": {
          "caption": "All 11 cross-platform mobile builds in the 25-project portfolio, with backend and store links as recorded in each project record.",
          "headers": [
            "Project",
            "Framework",
            "Vertical",
            "Recorded backend",
            "Public store listing"
          ],
          "rows": [
            [
              "FinTech Mobile App",
              "React Native",
              "Banking / FinTech",
              "Node.js",
              "None recorded"
            ],
            [
              "AgroBridge",
              "React Native",
              "Agricultural marketplace",
              "Firebase",
              "None recorded"
            ],
            [
              "Koor Food Delivery",
              "React Native",
              "Food delivery",
              "NestJS",
              "Google Play"
            ],
            [
              "CEDMAT Roller Shutter App",
              "React Native",
              "Industrial / IoT field tooling",
              "NestJS",
              "Google Play"
            ],
            [
              "Three28 Creator Platform",
              "React Native",
              "Creator monetisation",
              "NestJS",
              "One Apple URL (stored in android field)"
            ],
            [
              "Dooz Inspected Cars",
              "React Native",
              "Automotive marketplace",
              "NestJS",
              "Google Play + App Store"
            ],
            [
              "Food Magnet: Vender",
              "Flutter",
              "Food truck discovery",
              "AWS Lambda functions",
              "Google Play + App Store"
            ],
            [
              "JUJU Streaming Platform",
              "Flutter",
              "Media streaming",
              "Node.js",
              "None recorded"
            ],
            [
              "Digital Power of Attorney Platform",
              "Flutter",
              "Legal / govtech",
              "Node.js + Express",
              "None recorded"
            ],
            [
              "TAL Workforce Platform",
              "Flutter",
              "Workforce welfare",
              "Node.js + Express",
              "Google Play + App Store"
            ],
            [
              "WOD Pro League",
              "Flutter",
              "Fitness competition",
              "Node.js",
              "Google Play + App Store"
            ]
          ]
        }
      },
      {
        "heading": "How is each framework attribution actually recorded?",
        "body": "Framework labels come from hand-maintained fields, so it is worth showing where each one sits before comparing anything built on top of them. Eight of the 11 builds name their framework in both tags and techstack. Three do not. Dooz Inspected Cars is React Native in tags only, because its techstack lists the Angular web client and the NestJS backend instead. Digital Power of Attorney is Flutter in tags only, its techstack naming Node.js and Express. JUJU Streaming is the reverse, Flutter in techstack only, with its tags describing the backend. The free-text category field is less consistent still, which is why we do not use it for attribution: Food Magnet's category is Food Industry, a vertical rather than a stack, and three Flutter builds carry the category Node.js Backend & AWS with no mention of Flutter. None of this changes the totals of six and five, but it explains why every count here names the fields it reads.",
        "table": {
          "caption": "Where the framework label for each of the 11 builds is recorded, plus the free-text category field as stored.",
          "headers": [
            "Build",
            "Framework",
            "In tags",
            "In techstack",
            "category field as recorded"
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
              "Food Magnet: Vender",
              "Flutter",
              "Yes",
              "Yes",
              "Food Industry"
            ],
            [
              "JUJU Streaming Platform",
              "Flutter",
              "No",
              "Yes",
              "Node.js Backend & AWS"
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
        "heading": "Which framework reached public app stores more often in our record?",
        "body": "Public store release is the outcome these records capture most consistently, because every project stores its own web, android and ios link fields. In our record, three of five Flutter builds are listed on both Google Play and the Apple App Store: Food Magnet, TAL Workforce and WOD Pro League. One of six React Native builds is on both, Dooz Inspected Cars. React Native is not absent from the stores. Four of six carry at least one public store listing, against three of five for Flutter. The difference is in how those listings are distributed. Of the four React Native builds with a listing, two are Google Play only, one is Apple only and one is on both; all three Flutter builds with a listing are on both stores. One data-hygiene note belongs here rather than in a footnote: Three28 Creator Platform stores an apps.apple.com URL in its android field, so we count it as an Apple listing filed in the wrong column.",
        "table": {
          "caption": "Recorded public release status by framework, counted from the web, android and ios link fields of each project record.",
          "headers": [
            "Recorded release outcome",
            "React Native (n=6)",
            "Flutter (n=5)"
          ],
          "rows": [
            [
              "Listed on both Google Play and the App Store",
              "1",
              "3"
            ],
            [
              "Google Play listing recorded",
              "3",
              "3"
            ],
            [
              "Apple App Store URL recorded (any field)",
              "2",
              "3"
            ],
            [
              "At least one public store listing",
              "4",
              "3"
            ],
            [
              "Public web URL recorded",
              "1",
              "4"
            ],
            [
              "No public link of any kind recorded",
              "2",
              "1"
            ]
          ]
        }
      },
      {
        "heading": "What backends did each framework actually pair with?",
        "body": "One rule governs every row below: a technology counts when it is named anywhere in the project record, including the free-text category field and the written narrative, not only in tags and techstack. Under that rule the sharpest split is NestJS, named behind four of six React Native builds and none of the five Flutter builds. Express is close to its mirror image, named in two of five Flutter builds and none of the React Native builds. Node.js itself is named in four of six React Native records and four of five Flutter records, so the runtime is not a point of difference at all. Firebase leans React Native, three of six against one of five. AWS is named in all five Flutter records and three of six React Native records, while MongoDB and serverless AWS Lambda appear only on the Flutter side, and Elasticsearch and PostgreSQL only on the React Native side.",
        "table": {
          "caption": "Technologies named anywhere in the project record (category, tags, techstack, stats or written narrative), counted per framework. Every row uses this single rule.",
          "headers": [
            "Technology named in record",
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
              "2"
            ],
            [
              "Firebase",
              "3",
              "1"
            ],
            [
              "AWS (any service)",
              "3",
              "5"
            ],
            [
              "AWS Lambda / serverless architecture",
              "0",
              "2"
            ],
            [
              "MongoDB",
              "0",
              "2"
            ],
            [
              "PostgreSQL",
              "1",
              "0"
            ],
            [
              "Elasticsearch",
              "2",
              "0"
            ],
            [
              "Stripe",
              "0",
              "1"
            ],
            [
              "Redis or Socket.io",
              "0",
              "1"
            ],
            [
              "Companion React, Next.js or Angular web surface",
              "1",
              "4"
            ]
          ]
        }
      },
      {
        "heading": "Is the NestJS split really a runtime difference?",
        "body": "No, and reading it as one would be the easiest mistake to make with this table. NestJS is a framework that runs on Node.js, so the four React Native builds behind it are Node.js services too. The records say so directly: Koor, Three28 and Dooz are all filed under the category React Native & Node.js while their techstack names NestJS. The two descriptions sit at different levels rather than in conflict. Counted honestly, five of six React Native builds name a Node.js-family backend, NestJS four times and plain Node.js once, and four of five Flutter builds name Node.js outright. AgroBridge names only Firebase; Food Magnet names AWS Lambda functions without naming a runtime at all. What differs is the shape above the runtime: our React Native work used the opinionated NestJS structure, our Flutter work used Express, plain Node services and, twice, AWS Lambda. That describes our staffing and architecture habits, not the frameworks."
      },
      {
        "heading": "Did the two frameworks land in the same verticals?",
        "body": "No, and this is the single most important limit on the comparison. Not one vertical in our portfolio was built twice, once in each framework. React Native carried banking, an agricultural marketplace, food delivery, industrial roller-shutter field tooling, creator monetisation and an automotive marketplace. Flutter carried food truck discovery, media streaming, digital power of attorney, workforce welfare and fitness competition. Two React Native projects carry a FinTech tag, the FinTech Mobile App and Dooz; no Flutter project does. Three of the five Flutter records centre on live location or live competition data: Food Magnet tracks food truck locations, TAL offers real-time location services and WOD Pro League runs real-time leaderboards. Because the workloads never overlap, any difference in release outcomes between the two groups is confounded with the difference in what the apps were asked to do, who the client was and what the contract covered. There is no like-for-like pair anywhere in these 11 builds."
      },
      {
        "heading": "Does either framework arrive with a companion web surface more often?",
        "body": "In our record, yes, and the gap is wide. Four of five Flutter builds shipped alongside a React or Next.js web surface described in the project record. Food Magnet pairs a Flutter app with a React.js admin dashboard. TAL Workforce pairs Flutter with a React.js admin dashboard and Next.js for the website. WOD Pro League pairs Flutter with a React administrative dashboard. The Digital Power of Attorney platform pairs Flutter mobile with React.js on the web. Only JUJU Streaming names no web surface. On the React Native side, one of six names a companion web client: Dooz Inspected Cars, which used Angular for its web interface. The link fields show the same pattern independently, with four of five Flutter builds carrying a public web URL against one of six React Native builds. The plain reading is that Flutter reached us on engagements already scoped as multi-surface products. That is a statement about the briefs we won, not about framework capability."
      },
      {
        "heading": "What do the client-reported outcome numbers actually say?",
        "body": "They say less about frameworks than their volume suggests. The portfolio carries 57 extracted outcome entries across 25 projects, 19 of which have at least one. Twenty-five of those entries belong to the 11 mobile builds: 11 spread across five React Native projects and 14 across four Flutter projects. AgroBridge and Food Magnet carry none, and Food Magnet is instructive, because it has the longest list of stored figures in the portfolio at 11 entries and every one is a stack or configuration label rather than an outcome. On the React Native side the record shows 120,000+ completed orders and a 4.8 out of 5 rating for Koor, 99.9% uptime and 50k+ daily transactions for the FinTech app, and 98% customer satisfaction across 20,000+ verified vehicles for Dooz. On the Flutter side, 128,540 users and 3.6M streams for JUJU, 5,000+ workers across 2,500+ partner venues for TAL, and 12,778 athletes for WOD Pro League. All are client- or project-reported and none was independently audited by us."
      },
      {
        "heading": "Why is this delivery experience rather than a benchmark?",
        "body": "Because we never ran the experiment that would make it one. We did not build the same screen twice, did not measure frame times, cold start, memory or binary size, and did not instrument either framework under load. Team composition, briefs, budgets and delivery years all differed between projects, and none of those variables is captured in the records we are counting. The counting itself has soft edges worth naming: framework attribution rests on hand-maintained tags and techstack fields, one project stores an Apple URL in its android field, and the source facts file disagrees with itself on two unrelated totals, listing React.js as both seven and eight and AWS as both eight and nine. The mobile framework counts of six and five reconcile in both passes, and we re-derived every published number directly from the raw project records, which is why this article rests on recounted values rather than on any precomputed aggregate."
      }
    ],
    "key_findings": [
      "In our record, 3 of 5 Flutter builds are listed on both Google Play and the Apple App Store, versus 1 of 6 React Native builds.",
      "React Native was not store-absent: 4 of 6 builds carry at least one public store listing, but only 1 of those 4 is on both stores.",
      "NestJS is named behind 4 of 6 React Native builds and 0 of 5 Flutter builds; Express appears in 2 of 5 Flutter builds and 0 React Native builds.",
      "Node.js itself is named in 4 of 6 React Native records and 4 of 5 Flutter records, so the runtime is not a point of difference between the two groups.",
      "4 of 5 Flutter builds shipped with a React or Next.js companion web surface, against 1 of 6 for React Native.",
      "No vertical in the portfolio was built in both frameworks, so there is no like-for-like pair to compare anywhere in these 11 builds."
    ],
    "limitations": [
      "n=11 mobile builds from one agency portfolio of 25 projects. This is far too small and too self-selected to support any industry-wide claim.",
      "No controlled comparison was run. No paired build, no benchmark harness, no instrumentation, no control group.",
      "The two framework groups cover completely different verticals, so release outcomes are confounded with brief, client, budget and delivery year.",
      "Framework attribution depends on hand-maintained tags and techstack fields. Waitmate Platform names React Native in its narrative and solution text but carries no tag or techstack entry, so it is excluded from the 6.",
      "Only 8 of the 11 builds name their framework in both tags and techstack; 3 name it in one field only, and the free-text category field is inconsistent enough that we do not use it for attribution.",
      "Store status is inferred from stored link fields, which can be stale, and absence of a link is not proof that an app never shipped.",
      "Three28 Creator Platform stores an Apple App Store URL in its android field, so raw per-platform counts need this manual correction.",
      "Two projects outside the comparison set, Outstride and Pastel Marketplace, carry app store URLs without any mobile framework recorded, so portfolio-wide store presence is wider than these 11 builds.",
      "All outcome metrics are client- or project-reported and were not independently audited. They measure product traction, not framework behaviour, and 2 of the 11 mobile builds carry none at all.",
      "The source facts file disagrees with itself on two totals (React.js as 7 and 8, AWS as 8 and 9), so every figure published here was recounted from the raw project records instead."
    ],
    "cannot_answer": [
      "Which framework renders faster, starts faster, or uses less memory. We ran no performance test of any kind.",
      "Which framework produces smaller app binaries. Bundle size is not recorded for any project.",
      "Which framework is cheaper to hire for, or what either skill set costs in any market.",
      "Which framework took fewer developer-hours or shipped sooner. No effort or timeline data exists in these records.",
      "Whether the NestJS-versus-Express difference reflects any technical fit with either framework. The records show which team built what, not why.",
      "Whether either framework caused any of the client-reported outcome numbers. The workloads and businesses never overlap.",
      "Which framework produces more crash-free sessions or better store ratings at scale. Only one rating value exists in the entire mobile set.",
      "How either framework behaves on older Android hardware, on tablets, or offline. Device-level data is not captured.",
      "Whether apps with no recorded store link were cancelled, released privately, or released and later delisted.",
      "Which framework Outstride and Pastel Marketplace were built in, or whether Waitmate's described React Native app ever shipped. Those records name no framework and carry no matching store link."
    ],
    "word_count": 2294
  },
  {
    "slug": "supabase-vs-firebase-marketplace-backends",
    "title": "Supabase vs Firebase for Marketplace Backends: What 25 Shipped Projects Show",
    "meta_description": "Ten shipped builds, seven on one backend and three on the other, with zero overlap: what one agency portfolio shows, and what it cannot.",
    "summary_answer": "Across 25 projects, ten name Supabase or Firebase in tags or tech stack and none uses both: seven Firebase, three Supabase. In our record Firebase shipped alongside mobile frameworks and existing AWS backends, while all three Supabase builds were role-based React web dashboards. That split reflects product shape, not measured backend performance.",
    "dataset_note": "This dataset is 25 client projects delivered by a single software agency, exported from our own portfolio database. Each record carries a title, category, tags, a tech stack list, a problem/solution/result narrative, a free-form set of figures and optional public links; all 25 carry all three narrative sections and a set of figures. Outcome figures are client-reported or project-reported, not independently audited by us or by anyone else. There is no control group, no random assignment, no shared measurement window and no instrumentation of the running systems. Backend attribution is derived from the tags and the recorded tech stack, with narrative-only mentions counted separately and labelled as such wherever they appear, including where they cut against our own reading. This is a record of what one team chose to build and what clients told us happened afterwards.",
    "sections": [
      {
        "heading": "How many of our builds actually used Supabase, and how many used Firebase?",
        "body": "Across the 25 projects in our portfolio, ten name one of these two backends in their tags or tech stack fields: seven Firebase, three Supabase. No project in the record uses both. That split is the first honest finding here, and it holds under two different counting rules, which is why we trust it. Two further projects mention a backend only in their written narrative. CEDMAT Roller Shutter App describes a NestJS and Firebase backend without carrying the Firebase tag, and ConstrActive Platform describes Supabase for database management without carrying the Supabase tag. We count those separately throughout, because tag data and prose data are different grades of evidence. Counting prose mentions too, the split becomes eight Firebase to four Supabase, and still no project uses both. Every figure below comes from these same 25 records, and each one states which counting rule produced it.",
        "table": {
          "caption": "All 10 projects naming Supabase or Firebase in tags or tech stack, plus the 2 narrative-only mentions. Live surfaces are public links recorded in the project files.",
          "headers": [
            "Project",
            "Backend",
            "Evidence",
            "Category as filed",
            "Live surfaces"
          ],
          "rows": [
            [
              "Bondly Pet Care Platform",
              "Firebase",
              "Tags + tech stack",
              "Node.js & Firebase",
              "Web"
            ],
            [
              "AgroBridge",
              "Firebase",
              "Tags + tech stack",
              "React Native & Firebase",
              "None recorded"
            ],
            [
              "Food Magnet: Vender",
              "Firebase",
              "Tags + tech stack",
              "Food Industry",
              "Web, Android, iOS"
            ],
            [
              "Koor Food Delivery",
              "Firebase",
              "Tags only",
              "React Native & Node.js",
              "Android"
            ],
            [
              "Coffee Shop Web App",
              "Firebase",
              "Tags + tech stack",
              "Next.js & Firebase",
              "Web"
            ],
            [
              "Pastel Marketplace",
              "Firebase",
              "Tags + tech stack",
              "Next.js & Firebase",
              "Web, iOS"
            ],
            [
              "Pathana Platform",
              "Firebase",
              "Tags only",
              "Next.js & Serverless APIs",
              "Web"
            ],
            [
              "Augment Fit Platform",
              "Supabase",
              "Tags + tech stack",
              "React.js Frontend",
              "Web"
            ],
            [
              "Waitmate Platform",
              "Supabase",
              "Tags + tech stack",
              "React.js & Supabase",
              "Web"
            ],
            [
              "Afriva E-Commerce Platform",
              "Supabase",
              "Tags + tech stack",
              "Next.js & Microservices",
              "Web"
            ],
            [
              "CEDMAT Roller Shutter App",
              "Firebase",
              "Narrative text only",
              "React Native & AWS",
              "Android"
            ],
            [
              "ConstrActive Platform",
              "Supabase",
              "Narrative text only",
              "Node.js Backend & AWS",
              "Web"
            ]
          ]
        }
      },
      {
        "heading": "Which backend did we reach for when the product was a marketplace?",
        "body": "Five of the 25 projects describe themselves as a marketplace or a multi-vendor platform in their own text. Three of those five sit on Firebase: AgroBridge, a mobile agricultural marketplace; Koor Food Delivery, connecting customers to home chefs; and Pastel Marketplace, a luxury antiques platform. One sits on Supabase: Afriva, a multi-vendor e-commerce ecosystem with separate admin, manager, seller and buyer dashboards. The fifth, AI E-Commerce Ecosystem, uses neither, running on Next.js with Docker and Kubernetes. So in our record Firebase carried the marketplace work three times to Supabase's once. With five projects in the group, that ratio describes our history and nothing more. Afriva is the only one of the five whose record enumerates four distinct user roles, each with its own dashboard. Against our own thesis, though: Food Magnet, a Firebase build outside this group, lists the same four roles in the figures stored with it while naming only one dashboard, on the admin side.",
        "table": {
          "caption": "The 5 projects that describe themselves as a marketplace or multi-vendor platform. Headline figures are client-reported or project-reported, taken verbatim from the figures stored with each project.",
          "headers": [
            "Project",
            "Backend",
            "How the record describes it",
            "Client-reported headline figures"
          ],
          "rows": [
            [
              "Pastel Marketplace",
              "Firebase",
              "Luxury marketplace for antiques and vintage, buyers and sellers worldwide",
              "12k+ curated items; 2.8k+ verified sellers; 48k+ collectors"
            ],
            [
              "Koor Food Delivery",
              "Firebase",
              "Marketplace connecting customers with home chefs",
              "120,000+ order completions; 4.8 out of 5 user rating"
            ],
            [
              "AgroBridge",
              "Firebase",
              "Mobile marketplace and management platform",
              "No numeric stats recorded"
            ],
            [
              "Afriva E-Commerce Platform",
              "Supabase",
              "Multi-vendor e-commerce ecosystem, admin/manager/seller/buyer dashboards",
              "$1.2M total revenue; 1,245 active vendors; 120+ cities"
            ],
            [
              "AI E-Commerce Ecosystem",
              "Neither",
              "Multi-vendor marketplace on Next.js with Docker and Kubernetes",
              "No numeric stats recorded"
            ]
          ]
        }
      },
      {
        "heading": "Does the relational versus document data model show up in what we shipped?",
        "body": "Not directly, and we will not pretend otherwise. No project record in our dataset names Firestore or Realtime Database. The string postgres appears in exactly one record across all 25, and it belongs to Dooz Inspected Cars, a NestJS build using neither Supabase nor Firebase. So the data model debate that dominates every comparison article is simply absent from our own files. What the records do show is a difference in product shape. All three Supabase builds describe a dashboard: Augment Fit tracks sessions and performance, Waitmate manages reservations, staff and multi-location operations, and Afriva runs role-separated dashboards over inventory, orders and delivery. Only two of seven Firebase builds mention a dashboard. Conversely, five of seven Firebase records use the phrase real-time, against two of three Supabase records. Those are patterns in how we described our own work. They are consistent with two different product shapes, but they measure neither database engine."
      },
      {
        "heading": "Was Firebase the whole backend, or one service inside a larger stack?",
        "body": "In our record, usually the latter. Five of the seven Firebase projects list Firebase in their tech stack field. The other two, Koor Food Delivery and Pathana Platform, carry the Firebase tag while naming a different primary stack, React Native with NestJS and Next.js with Node.js respectively. Where the records say what Firebase was doing, they are specific: real-time delivery on Koor, authentication and data storage on Pathana, real-time sync and push notifications on Food Magnet, and a stats entry reading Realtime: Firebase on AgroBridge. Bondly names Firebase in its tags, tech stack and category but never states its role, and separately credits OneSignal for notifications. Four of the seven Firebase records also name AWS. Supabase appears differently. All three Supabase projects list it in the tech stack field, and each describes it as the data layer rather than one service among several. Not one of the three names AWS anywhere in its record."
      },
      {
        "heading": "Which platforms did each backend actually ship to?",
        "body": "Of the 25 projects, 18 have at least one public link: 15 web, 8 Android, 6 iOS. Inside the two backend groups the pattern diverges. All three Supabase projects are live on the web, and none has an App Store or Play Store listing. The Firebase group is more mixed: five of seven have a public web link and three of seven have a mobile store listing, with Food Magnet on both Android and iOS, Koor on Android and Pastel on iOS. AgroBridge has no public link recorded at all. One caution about the portfolio-wide totals: Three28 Creator Platform stores an Apple App Store URL in its android field while its ios field is empty, so the 8 and the 6 reproduce our fields rather than reality. Three28 names neither backend, so no comparison figure here is affected. The likeliest explanation for the split is simply what these particular clients hired us to build.",
        "table": {
          "caption": "Counts for the 10 tag-or-tech-stack projects, derived from the tags, tech stack, category, stats and web/android/ios fields. Each row names the field it was counted from; the one row counted from prose says so.",
          "headers": [
            "Measure (and field it is counted from)",
            "Supabase group (n=3)",
            "Firebase group (n=7)"
          ],
          "rows": [
            [
              "Public web link",
              "3 of 3",
              "5 of 7"
            ],
            [
              "Mobile app store listing",
              "0 of 3",
              "3 of 7"
            ],
            [
              "No public link recorded",
              "0 of 3",
              "1 of 7"
            ],
            [
              "Names React.js or Next.js in tags or tech stack",
              "3 of 3",
              "4 of 7"
            ],
            [
              "Names React Native or Flutter in tags or tech stack",
              "0 of 3",
              "3 of 7"
            ],
            [
              "Names React Native or Flutter anywhere, prose included",
              "1 of 3 (Waitmate, prose only)",
              "3 of 7"
            ],
            [
              "Backend named in the tech stack field",
              "3 of 3",
              "5 of 7"
            ],
            [
              "Backend named in the filed category string",
              "1 of 3",
              "4 of 7"
            ],
            [
              "Record mentions a dashboard (prose)",
              "3 of 3",
              "2 of 7"
            ],
            [
              "Record mentions real-time (prose)",
              "2 of 3",
              "5 of 7"
            ],
            [
              "Record names AWS anywhere",
              "0 of 3",
              "4 of 7"
            ],
            [
              "Public web link on a vercel.app domain",
              "3 of 3",
              "1 of 7"
            ],
            [
              "Names Stripe in tags or tech stack",
              "0 of 3",
              "2 of 7"
            ],
            [
              "At least one stats entry containing a numeral",
              "3 of 3",
              "4 of 7"
            ]
          ]
        }
      },
      {
        "heading": "What frontend stacks and hosting did each backend pair with?",
        "body": "Across the whole portfolio, counted from tags and tech stack, Next.js appears in 5 projects, React Native in 6, Flutter in 5, Node.js in 9 and NestJS in 4. Inside the backend groups the pairings are distinct. All three Supabase builds pair with the React family on the web: React.js on Augment Fit and Waitmate, Next.js 15 on Afriva. None names React Native or Flutter in tags or tech stack. One qualifier we owe you: Waitmate's narrative text does name React Native for mobile accessibility, the same grade of evidence we flagged for CEDMAT and ConstrActive, though Waitmate has no store listing. The seven Firebase builds spread wider: Next.js on Coffee Shop, Pastel and Pathana; React Native on AgroBridge and Koor; Flutter with a React.js admin dashboard on Food Magnet; a Node.js service on Bondly. Hosting differs too. All three Supabase web links are vercel.app domains, against one of five Firebase web links."
      },
      {
        "heading": "How complete are the outcome numbers on each side?",
        "body": "Every one of the 25 projects carries a set of stored figures, 95 entries in total. Fifty-seven of those contain a numeral, and those 57 come from 19 projects, so six projects contribute no numbers at all. Some numeral-bearing entries are labels rather than measurements: Infra: Docker/K8s, Compliance: GDPR and ISO 27001, Access to Facilities: 24/7. Coverage inside the comparison is uneven in a way that matters. All three Supabase projects carry numeric figures; only four of the seven Firebase projects do. Bondly, AgroBridge and Food Magnet report none, and Food Magnet is the sharpest case, with eleven stored figures and not one numeral among them. Every figure is client-reported or project-reported, and we audited none of them. The table below transcribes all of it. These describe businesses at different stages, in different markets, measuring different things, and arithmetic across the two columns would be meaningless.",
        "table": {
          "caption": "Every numeral-bearing stats entry for all 12 projects that name either backend, transcribed verbatim, including the three Firebase builds that record none. All values are client-reported or project-reported and were not independently verified.",
          "headers": [
            "Project",
            "Backend",
            "Numeral-bearing stats entries, verbatim"
          ],
          "rows": [
            [
              "Augment Fit Platform",
              "Supabase",
              "Total Revenue $18,230; Retention Rate 87.3%; User Growth +12.5%; Subscriber Increase +18.2%"
            ],
            [
              "Waitmate Platform",
              "Supabase",
              "Total Revenue $24,680; Occupancy Rate 87%; Today's Bookings 156; Customer Satisfaction 4.8/5"
            ],
            [
              "Afriva E-Commerce Platform",
              "Supabase",
              "Total Revenue $1.2M; Active Vendors 1245; Regions Covered 120+ Cities"
            ],
            [
              "Pastel Marketplace",
              "Firebase",
              "Curated Items 12k+; Happy Collectors 48k+; Verified Sellers 2.8k+; Positive Reviews 98%"
            ],
            [
              "Pathana Platform",
              "Firebase",
              "User Rating 4.9+; Success Rate 85%; Student Reach 10k+; School Partnerships 500+"
            ],
            [
              "Coffee Shop Web App",
              "Firebase",
              "Site Load Time 95% Lighthouse Score; Customer Retention Increased by 15%; Mobile Responsiveness 100%"
            ],
            [
              "Koor Food Delivery",
              "Firebase",
              "User Ratings 4.8 out of 5; Order Completion 120,000+"
            ],
            [
              "Bondly Pet Care Platform",
              "Firebase",
              "None (3 stats entries, no numerals)"
            ],
            [
              "AgroBridge",
              "Firebase",
              "None (3 stats entries, no numerals)"
            ],
            [
              "Food Magnet: Vender",
              "Firebase",
              "None (11 stats entries, no numerals)"
            ],
            [
              "ConstrActive Platform",
              "Supabase (narrative only)",
              "Monthly Revenue $28,450; Projects Handled 350+; Satisfaction Rate 98%"
            ],
            [
              "CEDMAT Roller Shutter App",
              "Firebase (narrative only)",
              "Operational Efficiency Increase 20%"
            ]
          ]
        }
      },
      {
        "heading": "What does the way we filed these records tell you?",
        "body": "One more layer, because it shapes everything above: these are catalogue entries we wrote, not instrumented logs. Four of the seven Firebase projects name Firebase in the category string we filed them under, against one of three Supabase projects. Augment Fit is filed as React.js Frontend and Afriva as Next.js and Microservices, though both run on Supabase, so anyone counting by category alone would reach different numbers than we do. Twenty-two of the 25 records are flagged as featured, including all three Supabase builds and five of the seven Firebase ones, which makes this a showcase rather than a census of everything we shipped. The only date field is the record's own created_at timestamp. It takes four distinct values across 25 projects and puts all three Supabase records on a single day, so it marks when we wrote the entry, not when we delivered the work. No chronology is available here."
      },
      {
        "heading": "What should a team take from a portfolio of this size?",
        "body": "Take the shape, not the verdict. With 25 projects overall and a three-versus-seven split inside the comparison, nothing here establishes that either backend is faster, cheaper, more reliable or better suited to marketplaces in general. What it does establish is a real pattern in one agency's decisions across shipped products. When the brief was a role-separated web dashboard with transactional workflows, we reached for Supabase, and it was the whole data layer. When the brief was a mobile-first product needing real-time sync, push notifications or drop-in authentication next to an existing AWS backend, we reached for Firebase, and it was one component among several. Both patterns produced live products with client-reported traction. If your brief resembles Afriva, the Supabase precedent in our record is the relevant one. If it resembles Koor or Food Magnet, the Firebase precedent is. Neither replaces a load test, a cost model, or a spike built against your own data."
      }
    ],
    "key_findings": [
      "Of 25 projects, 10 name Supabase or Firebase in tags or tech stack: 7 Firebase, 3 Supabase, and zero use both; adding the 2 narrative-only mentions makes it 8 and 4, still with no overlap.",
      "All 3 Supabase builds shipped to the web on vercel.app domains with no app store listing; 3 of the 7 Firebase builds have an Android or iOS listing, and 1 has no public link at all.",
      "Of 5 projects that call themselves a marketplace or multi-vendor platform, 3 run on Firebase, 1 on Supabase, and 1 on neither.",
      "Firebase read as a component rather than the whole backend: 2 of 7 carry the tag while naming a different primary stack, and 4 of 7 also name AWS, against 0 of 3 on the Supabase side.",
      "Outcome coverage is uneven: all 3 Supabase records carry numeric stats against 4 of 7 Firebase records, and Food Magnet has 11 stats entries with no numeral among them.",
      "No record in the dataset names Firestore or Realtime Database, and the only Postgres mention belongs to Dooz Inspected Cars, which uses neither backend."
    ],
    "limitations": [
      "n=25 projects from a single agency, with only 3 Supabase and 7 Firebase builds in the comparison; group sizes this small cannot support a general recommendation.",
      "Backend selection was driven by client briefs, budgets and pre-existing systems we did not control, so the two groups are not comparable populations and were never randomly assigned.",
      "All outcome figures are client-reported or project-reported from a free-form list of figures we keep with each project. We did not audit, instrument or independently verify any of them, and the projects launched at different times in different markets.",
      "Outcome reporting is uneven across the groups. Three of the seven Firebase builds record no numeral at all, so the metrics table under-represents that group by construction and cannot be read as a scoreboard.",
      "Backend attribution relies on tags and tech stack fields, which are self-maintained. CEDMAT and ConstrActive name a backend only in prose and are reported separately rather than merged into the headline counts.",
      "Waitmate's narrative names React Native for mobile accessibility although its tags and tech stack do not, so the Supabase group's zero for native mobile frameworks holds only under the tags-and-tech-stack rule, and we state both readings.",
      "Three28 Creator Platform stores an Apple App Store URL in its android field with an empty ios field, so the portfolio-wide 8 Android and 6 iOS reproduce our fields rather than reality. Three28 is in neither backend group.",
      "The source facts file gives conflicting counts for AWS (9 vs 8) and React.js (8 vs 7) under two different counting rules, so we published neither figure. Supabase, Firebase, Next.js, Node.js and NestJS counts agreed under both rules.",
      "22 of the 25 records are flagged as featured, so this is a curated showcase, not a complete census of what the agency has shipped.",
      "The only date field is the record's created_at timestamp, which marks when the catalogue entry was written, not when the work was delivered. No project ordering or timeline analysis is possible.",
      "The angle we set out to test assumed ConstrActive was a Supabase marketplace build. The records show it names Supabase only in narrative text and is a CRM and subscription platform, not a marketplace, so it is excluded from the marketplace counts.",
      "Records describe finished state, not process. Nothing captures what was tried and abandoned, what was migrated, or what a build cost to maintain after handover."
    ],
    "cannot_answer": [
      "Which backend is faster. No load tests, latency measurements or throughput benchmarks were run on any project in this dataset.",
      "Which backend is cheaper to run. No hosting invoices, pricing tiers or cost-per-user figures exist in these records, at any scale.",
      "How development time or effort compared. No developer-hours, sprint counts, timelines or team sizes are recorded for any project.",
      "How the two behave under scale or contention. Nothing here measures concurrent writes, hot partitions, query performance on large tables, or read amplification.",
      "Whether row-level security or Firestore security rules proved easier to get right. No security review findings or incident records are in the dataset.",
      "How migration between the two goes. No project in our record moved from one backend to the other, so we have no migration experience to report.",
      "Whether either choice caused the client-reported outcomes. With no control group and no baseline, the revenue, rating and volume figures cannot be attributed to a backend decision.",
      "Whether Supabase can back a native mobile app in practice. Waitmate's prose names React Native but the record shows no store listing, and no other Supabase build names a mobile framework, so we have no shipped example either way.",
      "What Firebase was actually doing on Bondly. The record names it in tags, tech stack and category but never states its role, and credits OneSignal for notifications.",
      "How either compares to the alternatives we did not use here, such as raw Postgres, PlanetScale, AWS Amplify or Appwrite.",
      "What happens to marketplace builds beyond our size range. Our largest client-reported marketplace figures are 1,245 vendors and 12k+ listings; we cannot speak to behaviour above that.",
      "Bundle size, cold-start behaviour or offline sync quality on mobile. These were never captured in any project record."
    ],
    "word_count": 1460
  },
  {
    "slug": "sharetribe-vs-custom-marketplace-build",
    "title": "Sharetribe vs Custom Marketplace Development: Where the Line Actually Falls",
    "meta_description": "Where Sharetribe is the right answer, where a custom marketplace build is, and how that line fell inside three marketplaces one agency actually shipped.",
    "summary_answer": "Use Sharetribe when your marketplace is a standard listing-and-commission transaction and you have not yet proved supply. For a large share of marketplaces that is the permanent answer, not a stage. Build custom when the domain data model, the role surfaces or native apps are the product. The line can also run through one project: our Pastel Marketplace is a custom Next.js storefront on Sharetribe's transaction layer. We never built the alternative, so read that as description, not verdict.",
    "dataset_note": "Three marketplaces from DevoraX's 25-project record sit behind this piece: Pastel, Afriva and Dooz, each with a published case study. Every scale figure is client-reported and unaudited. We ran no paired build, no cost model and no migration, and we have never operated Sharetribe or a Shopify multi-vendor app as a whole platform. A record of delivered work cannot show what failed.",
    "sections": [
      {
        "heading": "What is actually being compared here?",
        "body": "Three options are on the table, not two. The first is a hosted marketplace product such as Sharetribe, where the vendor operates the infrastructure and supplies the marketplace transaction as a configurable process: enquiry, payment, fulfilment, completion, commission, payout. You configure it; you do not deploy it.\n\nThe second is an existing commerce platform with a multi-vendor app layered on top, most commonly Shopify. We have never built one, so it gets a section of its own below rather than a column in the table, and we describe it only where its vendors do.\n\nThe third is a custom application, where the data model, the role surfaces and the hosting are yours. The binary in the question is false in one important way: Sharetribe sells both a no-code hosted product and a developer platform that exposes the same transaction engine over an API. A custom frontend on a bought transaction layer is a real position, and it is the one most comparisons omit.",
        "table": {
          "caption": "Structural differences between a hosted marketplace product and a custom build, described as general characteristics rather than a feature scorecard. No pricing appears here. The Shopify-plus-app column has been dropped: we have never run one, and we are not going to describe someone else's object model as though we had.",
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
              "Supplied as a configurable process; Pastel's frontend consumes it as a modelled state machine",
              "Whatever you model, at the cost of modelling it"
            ],
            [
              "Data model",
              "Users, listings and transactions as the platform defines them, extended with custom fields",
              "Yours to define: Dooz models versioned inspection records, which the client reports at 150+ points per vehicle"
            ],
            [
              "Setup work",
              "Configuration",
              "Engineering, plus environments, CI and hosting"
            ],
            [
              "Native iOS and Android apps",
              "Not the default path; a native client is a custom build against the API",
              "Pastel ships iOS; Dooz ships Google Play and the App Store"
            ]
          ]
        }
      },
      {
        "heading": "Why does an agency that builds custom marketplaces run Sharetribe inside one?",
        "body": "Pastel Marketplace is a custom build in our record, a Next.js storefront on Firebase live at mypastel.com and on the Apple App Store, and its transaction layer is Sharetribe. The case study calls using it rather than writing a payment flow from scratch the single most consequential decision on the project.\n\nThe reasoning is worth repeating. A marketplace payment is not a checkout. Money moves from a buyer to the platform, is held while a one-of-one antique is packed and shipped, and is released to the seller only once the exchange completes, with commissions, refunds, disputes and cross-border payouts attached. That surface area is larger than the storefront itself.\n\nSharetribe supplies it as a modelled state machine built for two-sided commerce, so the frontend reads a transaction's current state rather than taking custody of funds. What that decision does not tell you is whether the whole project should have been hosted. We never built that version, so the record establishes the choice was consequential, not that it was correct."
      },
      {
        "heading": "When is Sharetribe clearly the right answer?",
        "body": "There are four situations in which we would tell you not to hire us, and they are common. First, you have not proved supply. A marketplace with no sellers has nothing to transact, and no framework choice changes that; we hold no failure data, so treat that as mechanics rather than a finding. Until sellers list and buyers pay, every engineering hour funds a hypothesis.\n\nSecond, your transaction is standard: list, buy or book, pay, fulfil, release, commission. Third, your differentiation is not software, because curation, community and category expertise are not code. Fourth, your budget is below the build, and our own floor is $2,900.\n\nOne thing worth being plain about, because vendor pages are not: for many marketplaces the hosted product is the permanent answer rather than a stage before us. A configured marketplace taking real money is a finished business, not a prototype. That you will inevitably outgrow it is a sales line, and we have no evidence for it."
      },
      {
        "heading": "When is Shopify with a multi-vendor app the better choice?",
        "body": "We have never built this arrangement, so nothing here comes from our record. We describe it only as its vendors do: Shopify is a commerce platform for running a store, and multi-vendor capability is added by third-party apps installed on top.\n\nIt is right when you are the merchant of record and your vendors are really suppliers. If the catalogue behaves like products with variants and stock levels, if one party owns the customer relationship, and if you want an existing payments, tax and shipping ecosystem without integrating it, take that route. Configuration is less work than construction, and our custom floor is $2,900 before any change budget. For that reader this is the destination, not a stepping stone.\n\nThe requirements that pushed Afriva onto its own schema were four role-separated dashboards, each querying only the slice its role is entitled to with authorisation in the data layer, and one checkout splitting into child shipments on independent timelines. Whether a given app expresses those is a question for its documentation."
      },
      {
        "heading": "What did Pastel, Afriva and Dooz need that an off-the-shelf product does not give you?",
        "body": "Three projects in our record are the marketplaces this article rests on, each needing custom code for a different reason. We have not audited the record for every project that might be called marketplace-shaped, so read three as the evidence behind this piece, not a census of our marketplace work.\n\nPastel needed a catalogue where every listing is a one-of-one object carrying provenance rather than attributes, where seller verification is account state checked when a listing is created, and where curated collections cut across categories. Its transaction layer is still bought. Afriva needed four role-separated dashboards over managed Postgres, atomic stock decrements when one item enters several baskets at once, a parent purchase that splits into child shipments, and delivery status streamed from the database, not polled.\n\nDooz needed structured inspection records, which the client reports at 150+ points per vehicle, versioned so older reports still render and indexed so condition becomes a search facet, feeding an AI valuation. The common thread is the data model, not the payment flow.",
        "table": {
          "caption": "The three marketplaces behind this article, each with a published case study. Every scale figure is client-reported and was not audited or instrumented by us.",
          "headers": [
            "Marketplace",
            "Transaction layer",
            "What forced the custom build",
            "Live surfaces",
            "Client-reported scale"
          ],
          "rows": [
            [
              "Pastel Marketplace (Next.js, Firebase)",
              "Sharetribe",
              "One-of-one provenance listings, curated collections cutting across categories, seller verification as account state",
              "mypastel.com, Apple App Store",
              "The client reports 12k+ curated items, 48k+ collectors, 2.8k+ verified sellers, 98% positive reviews"
            ],
            [
              "Afriva (Next.js 15, Supabase)",
              "Not named in the record; order and inventory state sit in the platform's own Postgres schema",
              "Four role-separated dashboards, parent orders splitting into per-vendor shipments, realtime delivery tracking",
              "afriva-buyer.vercel.app",
              "The client reports 1,245 active vendors, $1.2M total revenue, 120+ cities covered"
            ],
            [
              "Dooz Inspected Cars (Angular, React Native, NestJS, PostgreSQL)",
              "Not named in the record; NestJS owns the business rules and PostgreSQL the transactional guarantees",
              "Structured, versioned inspection records, AI valuation, financing and insurance quotes inside the buying flow",
              "dooz.com, Google Play, Apple App Store",
              "The client reports 20,000+ verified vehicles, 1.2B+ JD in total transactions, 150+ inspection points per vehicle, 98% satisfaction"
            ]
          ]
        }
      },
      {
        "heading": "How do the cost shapes actually differ?",
        "body": "The headline price is the least interesting number in this decision, and it is also the one we are least able to give you. A hosted product is operating expenditure: a subscription plus payment processing, with no capital outlay. A custom build is capital expenditure plus a change budget, and it is the change budget that kills projects rather than the build price.\n\nOur own model is a fixed-price proposal rather than hourly billing, with indicative starting points of $2,900 for an MVP Starter and $7,500 for Growth, and Enterprise quoted per project. Those are starting points, not quotes. Nothing in the shape of Dooz, three clients over one backend, versioned inspections, an AI valuation service, financing and insurance integrations, fits the smaller band.\n\nWe will not tell you what the alternatives cost. Two things are worth pricing yourself: the configuration, design and data-migration labour a hosted setup still takes, and what a custom build does at ten times the volume, where re-architecture is an engineering ticket like any other.",
        "table": {
          "caption": "Where each cost number has to come from. The only figures stated here are DevoraX's own indicative starting points; we quote no third-party pricing anywhere, because we hold no invoices and ran no cost model.",
          "headers": [
            "Cost line",
            "What we can state from our own record",
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
              "None. We charge no recurring fee and do not resell hosting; you pay your own infrastructure providers directly.",
              "The vendor's current pricing page. Hosted marketplace products and commerce platforms are sold as tiered subscriptions; multi-vendor apps are priced by their own publishers, on models that vary."
            ],
            [
              "Payment processing",
              "Nothing. We integrate processors; we do not set their rates and we hold no invoices.",
              "Your payment processor's current rates, plus any platform fee a marketplace product takes on top of them. Both have to be read from current terms."
            ],
            [
              "Cost of a change",
              "On a custom build, every change is an engineering ticket that someone has to scope, price and schedule.",
              "On a configured product, a change is available only within what the product supports. Whether yours is supported is a question for the vendor's documentation."
            ],
            [
              "What you hold at the end",
              "Our contracts transfer code and IP to the client on final payment.",
              "What a vendor account leaves you with if you stop paying is set by that vendor's terms. We have not tested any of them."
            ]
          ]
        }
      },
      {
        "heading": "Which parts should you never build yourself, even inside a custom build?",
        "body": "Even when the answer is custom, the answer is not custom everywhere. Pastel is the worked example: Next.js owns the storefront, Firebase owns accounts, data and media, Sharetribe owns the transaction, Shippo owns fulfilment. The two components carrying legal and financial risk, money movement and insured cross-border shipping, were bought. The two that define the product were kept.\n\nThe rule we apply is simple. If a component is regulated, adversarial, or maintained against somebody else's changing API, buy it. Multi-carrier shipping is the clearest case: a framed print, a chandelier and a chest of drawers share no packaging profile, dimensional weight or obvious carrier, and sellers are not logistics professionals.\n\nDooz applies the same rule at a different boundary. What it built is what makes it a product: inspection modelled as versioned data, valuation resolved server-side, and PostgreSQL guarantees that let a reservation, a listing state change and a financial record commit or fail as one unit. Financing and insurance quotes come from third parties on someone else's latency budget."
      },
      {
        "heading": "What does our record prove about this choice, and what does it not?",
        "body": "Less than the confidence of these headings suggests, so here are the bounds. DevoraX has been building since 2019, has 25 delivered projects all with published case studies, and holds 20 five-star Fiverr reviews from 16 clients across four countries. Three of those projects are the marketplaces here. A record of delivered work is by construction a record of what went well enough to publish, so nothing cancelled or abandoned would appear in it, and we do not claim there is nothing to appear.\n\nWe have never built the same marketplace twice, once hosted and once custom. There is no paired test, no migration in either direction and no instrumentation of either approach. The scale figures are what clients told us, not what we measured.\n\nWe are also an interested party. We sell custom builds, and the four situations listed earlier are precisely the ones where we lose the sale. They are here because for a large share of readers the honest answer is the product we did not build."
      },
      {
        "heading": "How should you decide, in order?",
        "body": "Answer four questions in sequence, stopping at the first clear no. Has supply proved itself? If sellers are not already listing, buy a hosted marketplace and spend the difference on recruiting them. For many marketplaces that is where this decision ends permanently, and there is nothing second-best about ending it there.\n\nDoes your transaction fit a standard process: list, buy or book, pay, fulfil, release, commission? If it does and your catalogue is ordinary too, a configured product is the finished answer and you should stop here rather than build around it. Pastel keeps a bought transaction layer inside a custom build, but that shape only becomes relevant once the next question is also a yes.\n\nDoes your domain need a data model the platform does not have: structured inspections, provenance, role-separated tenancy, multi-shipment orders? Do you need surfaces it does not produce, as two of our three do with native apps? Reach the fourth question with yes answers and a funded change budget, and a custom build is defensible."
      }
    ],
    "key_findings": [
      "The build-versus-buy line ran through the middle of one of our own projects, not around it: Pastel Marketplace is a custom Next.js and Firebase build whose transaction layer is Sharetribe, which its case study calls the single most consequential decision on the project.",
      "In all three marketplaces the custom part was the domain data model and the role surfaces, not the payment flow: Afriva runs four role-separated dashboards with authorisation pushed into the data layer, Pastel treats seller verification as account state, and Dooz models inspections as versioned, indexed data.",
      "Two of the three ship an app store presence (Pastel on iOS, Dooz on Google Play and the App Store), which a hosted web marketplace product does not produce by default.",
      "For a marketplace with a standard transaction, an ordinary catalogue and unproven supply, a hosted product is the permanent answer rather than a stage before a custom build. Nothing in our record shows anyone outgrowing one, because our record contains no such case either way.",
      "Our indicative custom starting points are $2,900 (MVP Starter) and $7,500 (Growth), and nothing in the shape of Dooz fits the smaller band, so for some specifications the honest answer is to cut scope or stay hosted.",
      "Every scale figure here is client-reported and unaudited: 12k+ items, 48k+ collectors and 2.8k+ verified sellers for Pastel; 1,245 vendors and $1.2M revenue for Afriva; 20,000+ vehicles, 1.2B+ JD in transactions and 150+ inspection points per vehicle for Dooz."
    ],
    "limitations": [
      "Three marketplaces with case studies inside a 25-project record from one small agency. A record of delivered work is selection-biased by construction: no cancelled, abandoned or failed marketplace could appear in it, and we have not audited the record for every project that might be called marketplace-shaped.",
      "We have never built the same marketplace twice, once on a hosted product and once custom. There is no paired test, no A/B and no migration in either direction, so every comparison here is engineering reasoning rather than measurement.",
      "We have not run Sharetribe or a Shopify multi-vendor app as an entire client platform. Our direct experience of Sharetribe is its transaction layer inside Pastel, which is why the Shopify column was dropped from the structural table rather than filled with an object model we have never worked in.",
      "All outcome figures are client-reported and were not audited or instrumented by us. None carries a measurement date, a baseline or a comparison condition.",
      "DevoraX sells custom builds, so we have a commercial interest in this answer. The only prices in this article are our own indicative starting points, which are not quotes; no third-party pricing is stated anywhere, including in the cost table."
    ],
    "cannot_answer": [
      "What Sharetribe, Shopify or any multi-vendor app will cost you at your transaction volume. We hold no invoices and quote no third-party prices, so those figures have to come from the vendors' current terms.",
      "Whether Pastel would have performed as well fully hosted, or Afriva on an off-the-shelf product. No counterfactual was built, so the comparison is untested.",
      "Whether any of the client-reported figures were caused by the build-versus-buy decision. There is no control group and no baseline anywhere in this record.",
      "How hard it is to migrate from a hosted marketplace to custom code, or back. No project in our record has made that move, so we have no migration experience to report."
    ],
    "word_count": 1681
  },
  {
    "slug": "what-a-3000-mvp-budget-gets-you",
    "title": "What a $3,000 MVP Budget Actually Gets You (And What It Does Not)",
    "meta_description": "What a $3,000 MVP budget actually buys, and what it does not, checked against our published $2,900 starting tier and five live builds.",
    "summary_answer": "Roughly $3,000 buys one working surface for one primary audience, a narrow set of features, and a managed stack you do not have to operate. It does not buy role-separated dashboards, an app-store release, verified multi-tenancy or a security assessment. What it depends on is roles: each additional kind of user adds a surface, a permission boundary and a full test pass. If your difference from an off-the-shelf product is a preference rather than a rule, rent instead.",
    "dataset_note": "This draws on 25 delivered projects from one two-person agency, five examined closely: Coffee Shop, Augment Fit, Waitmate, Pathana and Afriva. No project record stores a price, timeline, team size or developer-hour count, so nothing here evidences what any build cost. Outcome figures are client-reported and unaudited. The 25 are our own published book of work, not a sample: no record stores a delivery or failure status.",
    "sections": [
      {
        "heading": "What does a $3,000 MVP budget actually buy?",
        "body": "A budget in that range buys one working surface, for one primary audience, doing a small number of things well, on a managed platform somebody else operates. Our own published starting points are an MVP Starter from $2,900, Growth from $7,500 and Enterprise scoped individually. Those are starting points rather than quotes: every engagement is priced as a fixed sum in a proposal written after a free 30-minute discovery call, and we do not bill hourly. The caveat comes first, because it governs everything below. None of the 25 project records behind this article stores a price. We are not going to tell you that any named build was delivered for $2,900, because we did not record that, and a number invented to make an argument land is worth nothing to a reader spending real money.\n\nWhat the records do support is a description of scope shapes, and the smallest shape among the five examined here is the Coffee Shop Web App. One public web surface. One audience, the customer. Three named features: an interactive menu, customer testimonials and integrated e-commerce. A stack of Next.js for server rendering, React for the interface and Firebase for content and data, which means no server to run and no database to operate. No second operational surface, no separate admin product, no real-time requirement, no mobile release. That is the shape a starting-tier budget can hold: a single front door, a single kind of user behind it, and a content and transaction path a non-developer can keep current. Read it as a scope illustration and not as a recommendation, because the fifth section below explains why we would tell a reader arriving with exactly that brief to rent instead."
      },
      {
        "heading": "Why is $3,000 a scope number rather than a price?",
        "body": "Because the fixed price is the output, not the input. A proposal prices a defined scope, so the only thing a smaller budget can move is what sits inside that scope. That is a more useful conversation than asking for a discount on a rate, and it is why the discovery call happens before the number. It helps to know the shape of the supplier too. DevoraX has been operating since 2019 and is two people, Sameem Amjad and Usman. We hold no cost accounting in any project record, no price, no hours and no allocation, so we are not going to explain the tier by describing an overhead structure we never measured. What our own site does publish alongside the price is the working arrangement: a dedicated project manager as a single point of contact, direct Slack access, weekly demos and a shared project board.\n\nWhat actually moves the number is structural rather than cosmetic. How many distinct kinds of user need their own screens. Whether money changes hands inside the product. Whether anything has to stay correct under contention, such as a seat, a table or a unit of stock two people can claim at the same moment. Whether the product must exist in an app store as well as a browser. Whether the data is sensitive enough that isolation between tenants has to hold by construction rather than by careful coding. Each of those is a step change, not a percentage increase, because each adds a surface, a permission boundary and a set of failure cases somebody has to test. Colour schemes, copy and the number of marketing pages are small against any of them. Our site also publishes a typical four-to-six-week timeline for an MVP, though no project record stores what any build actually took, so read that as a plan rather than a measurement."
      },
      {
        "heading": "What does scope actually look like across five live products?",
        "body": "Five of our 25 builds are useful calibration here, because all five carry a live web link and a published case study, and they sit at visibly different levels of scope. One caution about the selection before the table. All five are web-only, and that is a property of which five we picked rather than of the budget or of the market: nine of the 25 project records carry a Google Play or App Store listing. Waitmate is the case worth naming, because its case study puts React Native in the stack for mobile access while the Android and iOS fields in its record are both empty, so a mobile client appears in the architecture with no store listing behind it in what we hold.\n\nRead the table by counting surfaces and roles rather than features. Coffee Shop has one of each. Augment Fit's record names two surfaces, an admin panel and a user dashboard. Waitmate's stack names a React.js dashboard alongside a React Native client. Pathana is the instructive one: its record names one platform and three parties reading one shared record, so the roles multiply while the surfaces do not. Afriva names four separate dashboards. Named feature counts stay inside a narrow band of three to four across all five, which is the point, because features are cheap relative to the number of places and permission levels each one has to be correct in. We have dropped the column an earlier draft carried placing each build against our starting tier. No project record stores a price, so that column was judgement printed beside counted facts, and in a grid it read as data.",
        "table": {
          "caption": "Five live DevoraX builds by recorded scope. Every column is counted from the project records and the published case studies. No column here is a price or a price proxy: no project record stores what any build was sold for, so this table cannot be read against our published tiers.",
          "headers": [
            "Build",
            "Public links in our record",
            "Surfaces the record names",
            "Distinct user roles the record names",
            "Named features",
            "Real-time requirement named"
          ],
          "rows": [
            [
              "Coffee Shop Web App",
              "Web only",
              "1 (public site)",
              "1 (the visiting customer)",
              "Interactive menu, customer testimonials, integrated e-commerce",
              "No"
            ],
            [
              "Augment Fit Platform",
              "Web only",
              "2 (admin panel, user dashboard)",
              "2 named (trainers, users); no operational role named for the admin panel",
              "Session and performance tracking, BMI classification, workout plan building",
              "No"
            ],
            [
              "Waitmate Platform",
              "Web only",
              "2 in the stack (React.js web dashboard, React Native mobile client)",
              "Not enumerated in the record",
              "Smart reservations, table management, real-time analytics, multi-location support",
              "Yes (real-time analytics)"
            ],
            [
              "Pathana Platform",
              "Web only",
              "1 (one platform; the record names no separate surfaces)",
              "3 (students, counsellors, families) over one shared record",
              "Personalised roadmaps, milestone tracking, counsellor collaboration, data-driven dashboards",
              "Yes (real-time propagation)"
            ],
            [
              "Afriva E-Commerce Platform",
              "Web only",
              "4 role dashboards (admin, manager, seller, buyer)",
              "4 (admin, manager, seller, buyer)",
              "Inventory management, order processing, real-time delivery tracking",
              "Yes (real-time delivery tracking)"
            ]
          ]
        }
      },
      {
        "heading": "What does a $3,000 budget specifically not buy?",
        "body": "It does not buy role separation. Afriva's four dashboards are four products sharing a schema: each queries a different slice of the data, each enforces a different permission set, and the case study's structural point is that a change to seller tooling cannot quietly regress the buyer checkout path. That is a property of the architecture, not evidence of a process. We hold no recorded test matrix, review step or release procedure for any project in the portfolio, so nothing here should be read as a description of how we test. It does not buy institutional multi-tenancy either. Pathana's case study states the requirement and stops there: isolation across the 500+ school partnerships the client reports has to hold by construction rather than by careful coding. No record documents that the isolation was implemented, and no assessment verifies it.\n\nIt does not buy a native release. All five reference builds are reachable in a browser and none carries a store listing in our record, while nine of the 25 records do, and a store release is a second build with its own review process and its own release cadence. It does not buy assurance: none of the five examined records contains a penetration test, a security assessment, a load test or an uptime SLA. Be precise about what that does and does not mean, because we do market an SLA. Long-term SLA and 24/7 DevOps monitoring are published features of the Enterprise tier, and the FinTech record carries a client-reported 99.9% uptime, which is a client figure rather than an assurance artefact. None of that sits in a starting-tier engagement, which carries one month of support, after which the system is yours to run and the code and IP are yours on final payment."
      },
      {
        "heading": "When is the honest answer not to hire an agency like us at all?",
        "body": "Frequently, and here is the version with no hedge on it. If you are a single-location cafe, restaurant, salon, gym or retailer who needs a branded site with a menu or catalogue and online ordering, rent. Hosted commerce platforms and site builders solve that exact shape as a subscription, and they arrive with payment handling, hosting, updates and a support contract that keeps renewing for as long as you pay. That is the Coffee Shop scope shape, and renting is the right answer for a reader arriving with that brief today. We will not tell you the Coffee Shop client should have rented, because no record tells us why custom was chosen there, but the recommendation to a new reader with that brief is not ambiguous. The same holds for appointment and session booking for a small team, and for an internal dashboard over data you already hold.\n\nThe table below is deliberately two-sided, because owning software has costs as surely as renting it does. Renting is a fee that never stops and a data model you configure rather than design. Owning is a hosting bill, a maintenance burden, support only for as long as it is contracted, one month at our starting tier, and key-person risk with a two-person supplier. The test you can apply on your own is whether the thing your product does differently is a preference or a rule. If your difference is a preference, our own brand, our own layout, our own copy, rent. If it is a rule the hosted product cannot express, this capacity is contested, this payout splits four ways, this record is legally restricted, that is where custom starts earning the money. Afriva's record names four role dashboards; whether that could have been rented, the record does not say.",
        "table": {
          "caption": "Where renting usually beats custom at this budget, and what renting costs in return. Third-party products are described by commercial model and positioning only. We have quoted no current price for any of them, packaging in this space changes, and each vendor should be checked directly.",
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
              "Your own hosting bill, your own upgrades, and support only for as long as it is contracted; our starting tier includes one month",
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
        "body": "Roles are the multiplier that ruins budgets, and they are almost never counted properly at the start. Each distinct kind of user adds three things at once. It adds a surface, because a screen trying to serve two mandates usually serves neither; Augment Fit's record names two of them, an admin panel and a user dashboard, and its case study is explicit that neither one's screens were published, so the reasoning is about why products of this kind separate surfaces at all rather than about how these were laid out. It adds an authorisation boundary, because cross-account visibility is exactly the capability an ordinary account is designed to withhold, and that boundary has to be enforced where the data lives rather than in each screen that reads it. And it adds a test matrix, because every feature now has to be verified once per role that can reach it.\n\nPathana illustrates the third cost most clearly, and it does so without adding a single surface. Three parties look at one student's record with three different mandates: the student owns the work, the counsellor advises and intervenes, the family needs visibility without editing rights that would distort the record. That is one data model and three correct answers to the question of what this screen shows, and getting it wrong in a school product is not a cosmetic defect. The planning consequence is the one people resist: a second role is not ten per cent more work, and a fourth role is not four times the first, because boundaries multiply where features add. If your brief names three kinds of user in its first sentence, a starting-tier budget is the wrong frame for it, and the useful move is to cut to one role and ship, not to compress three."
      },
      {
        "heading": "Do the client-reported results on these builds tell you what the budget bought?",
        "body": "No, and it is worth being exact about why. Every figure our records carry is reported by the client rather than measured or audited by us. The client reports that Afriva carries 1,245 active vendors and $1.2M in total revenue across more than 120 cities. The client reports that Pathana reaches more than 10,000 students across 500+ school partnerships with an 85% success rate. Waitmate's record lists $24,680 in total revenue, 87% occupancy and 4.8/5 customer satisfaction, all client-reported. Augment Fit's lists $18,230 in revenue and 87.3% retention on the same basis. The Coffee Shop record lists a 95% Lighthouse score and customer retention increased by 15%. Not one of them carries a measurement window, a baseline or a stated method.\n\nMore importantly for a reader with a budget, none of them is a statement about cost. They describe the state of a live product, often well after the build, and the distance between what a thing cost to make and what it went on to do is the entire business. Reading a portfolio figure as a price signal is the specific error this article exists to prevent. One structural caution about the dataset itself: 25 projects is small, it is our own book of work, and we chose which five to examine. No record stores a delivery, launch or failure status of any kind, so we cannot tell you how many ran late, ran over or were abandoned. What we can tell you is that 18 of the 25 records carry a public link and seven carry none, and that all 25 have a case study published on our site whether a link exists or not. A portfolio is not a base rate."
      },
      {
        "heading": "What should you actually do with roughly $3,000?",
        "body": "Three answers, and only one of them involves hiring anybody. If your product is the default shape of a category with mature hosted products in it, rent one, spend nothing on engineering, and revisit in a year when you know which constraint actually hurts. That is the answer for anyone whose difference from the category default is a preference rather than a rule, and the Coffee Shop scope shape sits squarely inside it. If your product has one primary audience, a handful of features, and one rule the hosted products cannot express, a starting-tier custom build is a real option: one surface, one audience, a managed backend, a live link at the end. If your brief names three user roles, a store release, a compliance obligation or contention over finite capacity, this budget buys a half-built version of that, and the move is to cut to one role and ship it rather than to find a supplier who will agree to all of it at this price.\n\nTwo practical notes if you do spend it. Keep some of it back. A starting tier includes one month of support and then the system is yours to run, so a budget entirely consumed at launch leaves nothing for the first real bug and nothing for the hosting bill either. And insist the scope is written down as a fixed price against a specific list before anyone starts, which is how we work and is the only structure under which a small budget is safe for both sides. If a supplier cannot tell you what falls out of scope at your number, they have not scoped it, and the shortfall surfaces later as either an invoice or an argument. Ask the same supplier what they would tell you to rent instead, because the answer tells you what the proposal is really for."
      }
    ],
    "key_findings": [
      "All five reference builds are web-only in our record, but that is a property of the selection rather than of the budget: nine of the 25 project records carry a Google Play or App Store listing. Waitmate's case study names React Native for mobile access while its Android and iOS link fields are both empty.",
      "Surfaces and roles, not features, separate the five: Coffee Shop names one surface and one audience, Augment Fit and Waitmate two surfaces each, Pathana one platform with three parties over a shared record, and Afriva four role dashboards, while named feature counts stay within a band of three to four throughout.",
      "No project record stores a price, a timeline or a team size, so this article makes no claim that any named build was delivered at the $2,900 starting tier, and it carries no table column placing one there.",
      "Our published starting points are MVP Starter from $2,900, Growth from $7,500 and Enterprise custom-scoped, each priced as a fixed sum in a proposal after a free 30-minute discovery call. The MVP Starter includes one month of support; a long-term SLA and 24/7 DevOps monitoring are published Enterprise features, not starting-tier ones.",
      "None of the five examined records contains a penetration test, a security assessment, a load test or an uptime SLA. The portfolio does carry a client-reported 99.9% uptime on the FinTech record, which is a client figure rather than an assurance artefact.",
      "18 of the 25 records carry a public link and seven carry none, while all 25 carry a published case study. No record stores a delivery, launch or failure status, so the portfolio cannot be read as a success rate in either direction."
    ],
    "limitations": [
      "n=25 projects from a single two-person agency, and we chose which five to examine. No record stores a delivery, launch or failure status, so nothing here estimates the odds of a $3,000 build succeeding, and the portfolio should not be read as one.",
      "No price, effort, duration or team-size data exists in any project record. Every statement about what a budget buys rests on scope shape and general engineering reasoning, not on cost accounting.",
      "All outcome figures are client-reported, with no baseline, measurement window or stated method, and none was audited or instrumented by us.",
      "The five builds were selected for carrying live web links and detailed case studies, which is exactly why all five are web-only. The nine store-listed projects in the portfolio are not represented here at all, so this article says nothing about what a mobile build involves.",
      "Third-party products are described by commercial model and positioning only. We have quoted no current price for any of them, packaging in this space changes, and the right build-versus-rent answer changes with it."
    ],
    "cannot_answer": [
      "What any of the five named builds was actually sold for. No project record stores a price, so the relationship between these scopes and our published tiers is inference, not evidence.",
      "How long any build actually took. Our own site publishes a typical four-to-six-week MVP timeline, but no project record stores a real duration, sprint count or developer-hour figure, so nothing here verifies that published figure against delivery.",
      "What a build costs to run and maintain after handover. No hosting invoices, platform bills or post-launch support costs exist anywhere in the records.",
      "Whether $2,900 is competitive against other suppliers. We hold no competitor quotes and did not price-check anybody for this article."
    ],
    "word_count": 2511
  }
];

/** When these articles were last substantively revised (honest freshness signal). */
export const INSIGHTS_UPDATED = '2026-09-16T00:00:00.000Z';

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export function allInsightSlugs(): string[] {
  return INSIGHTS.map((i) => i.slug);
}
