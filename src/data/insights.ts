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
    "dataset_note": "This is n=25 shipped projects from a single software agency, counted from that agency's own structured project rows. It is not a market survey, a random sample or a controlled study. Eighteen rows store at least one public link, seven store none, and none of the links were fetched or checked live for this article. The 57 quantified figures are values stored in each row's stats field, 52 of them numeric and five non-numeric descriptors. No field records who supplied or measured them, none were independently audited or instrumented by us, and none carry a measurement date, a baseline or a comparison condition. There is no control group and no cancelled-project data, so the record is survivorship-limited by construction. Read every figure as \"in this agency's record of 25 builds\", never as an industry rate.",
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
        "body": "The technology table is a floor, not a census, and the record shows exactly why. Twenty of the 25 rows store precisely two techstack entries, typically one frontend and one backend. Only five store more, and only one stores eight. A field that stops at two names cannot describe a stack that runs to a dozen dependencies. The proof is in the narratives: MongoDB, Redis, Socket.io, PostgreSQL and Vercel are each described in one or two project write-ups, yet every one of them scores zero across all 25 tag lists and techstack fields. The S3 storage service is named in five narratives and in no tag or techstack field. Relaxing the rule to a substring match across the narrative prose as well raises Node.js from nine to 13 and AWS from nine to 13. Read every row in the technology table as a minimum."
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
        "body": "The most useful output of counting your own record is the list of fields you wish you had captured. Five gaps are visible. No stat value carries a measurement date, so a revenue figure cannot be placed on a time basis. No percentage change is paired with a baseline, which is what turns a reported improvement into evidence. No field records who supplied or measured any value, so provenance has to be assumed rather than read. The techstack field caps most rows at two entries, which is why the technology counts are a floor. And one row stores an App Store URL in its android field, the kind of quiet error that inflates a platform count. The only date any row carries is its own created_at row timestamp, which dates the CMS entry rather than the build. None of these are hard to fix at capture time and all are impossible to fix retroactively."
      }
    ],
    "key_findings": [
      "18 of 25 production builds (72%) store at least one public URL and 7 store none; counted by link domain, 15 are web addresses, 7 Google Play and 7 Apple App Store.",
      "13 of 25 projects (52%) run a Node-family backend: 9 name Node.js and 4 name NestJS, with no overlap between the two sets.",
      "Node.js and AWS tie as the most frequent technologies at 9 of 25 projects each, under the rule 'named in the tag list or the declared tech stack'.",
      "Mobile work splits 6 React Native to 5 Flutter across 11 projects, and no project names a native iOS or Android toolchain in any tag or techstack field.",
      "Only 5 of 25 builds shipped to web, Google Play and the App Store together; 9 shipped web-only and 3 reached a single mobile store with no web surface.",
      "Of 57 quantified stat values, 52 are numeric and 5 are configuration or compliance descriptors; 19 are percentages, and the string 98% appears on five separate projects."
    ],
    "limitations": [
      "n=25 from a single agency. These are one team's clients, sectors and budgets, not a random or representative sample of software projects.",
      "Provenance is not stored. No field in either source records who supplied or measured any stat value. None were independently audited, instrumented by us, or checked against a client's analytics, so every outcome figure should be read as self-reported.",
      "No control group and no baseline. A reported '20% operational efficiency increase' has no recorded before-state or comparison condition, so it cannot be treated as a measured effect.",
      "The technology counts are a floor, not a census. 20 of the 25 rows cap their techstack field at two entries, and MongoDB, Redis, Socket.io, PostgreSQL and Vercel each appear in project narratives while scoring zero across all 25 tag and techstack fields.",
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
    "dataset_note": "The dataset is 25 delivered projects from a single agency portfolio, 11 of which record a cross-platform mobile framework in their tags or techstack fields: 6 React Native, 5 Flutter. Framework attribution uses only those two structured fields. Every other technology count uses one rule applied uniformly to every row of every table: the technology is named anywhere in the project record, meaning the category, tags, techstack or stats fields or the written problem, solution, result and narrative text. Release status is read from the stored web, android and ios link fields. Outcome figures come from each project's stats field and are client- or project-reported, never independently audited. There is no control group, no randomisation, no paired build of the same app in both frameworks, and no controlled performance testing of any kind. It is a delivery record, not an experiment.",
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
        "body": "They say less about frameworks than their volume suggests. The portfolio carries 57 extracted outcome entries across 25 projects, 19 of which have at least one. Twenty-five of those entries belong to the 11 mobile builds: 11 spread across five React Native projects and 14 across four Flutter projects. AgroBridge and Food Magnet carry none, and Food Magnet is instructive, because it has the largest stats field in the portfolio at 11 keys and every one is a stack or configuration label rather than an outcome. On the React Native side the record shows 120,000+ completed orders and a 4.8 out of 5 rating for Koor, 99.9% uptime and 50k+ daily transactions for the FinTech app, and 98% customer satisfaction across 20,000+ verified vehicles for Dooz. On the Flutter side, 128,540 users and 3.6M streams for JUJU, 5,000+ workers across 2,500+ partner venues for TAL, and 12,778 athletes for WOD Pro League. All are client- or project-reported and none was independently audited by us."
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
    "dataset_note": "This dataset is 25 client projects delivered by a single software agency, exported from our own portfolio database. Each record carries a title, category, tags, a tech stack list, a problem/solution/result narrative, a free-form stats field and optional public links; all 25 carry all three narrative fields and a stats field. Outcome figures are client-reported or project-reported, not independently audited by us or by anyone else. There is no control group, no random assignment, no shared measurement window and no instrumentation of the running systems. Backend attribution is derived from the tags and tech stack fields, with narrative-only mentions counted separately and labelled as such wherever they appear, including where they cut against our own reading. This is a record of what one team chose to build and what clients told us happened afterwards.",
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
        "body": "Five of the 25 projects describe themselves as a marketplace or a multi-vendor platform in their own text. Three of those five sit on Firebase: AgroBridge, a mobile agricultural marketplace; Koor Food Delivery, connecting customers to home chefs; and Pastel Marketplace, a luxury antiques platform. One sits on Supabase: Afriva, a multi-vendor e-commerce ecosystem with separate admin, manager, seller and buyer dashboards. The fifth, AI E-Commerce Ecosystem, uses neither, running on Next.js with Docker and Kubernetes. So in our record Firebase carried the marketplace work three times to Supabase's once. With five projects in the group, that ratio describes our history and nothing more. Afriva is the only one of the five whose record enumerates four distinct user roles, each with its own dashboard. Against our own thesis, though: Food Magnet, a Firebase build outside this group, lists the same four roles in its stats field while naming only one dashboard, on the admin side.",
        "table": {
          "caption": "The 5 projects that describe themselves as a marketplace or multi-vendor platform. Headline figures are client-reported or project-reported, taken verbatim from each record's stats field.",
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
        "body": "Every one of the 25 records carries a stats field, 95 entries in total. Fifty-seven of those contain a numeral, and those 57 come from 19 projects, so six projects contribute no numbers at all. Some numeral-bearing entries are labels rather than measurements: Infra: Docker/K8s, Compliance: GDPR and ISO 27001, Access to Facilities: 24/7. Coverage inside the comparison is uneven in a way that matters. All three Supabase records carry numeric stats; only four of the seven Firebase records do. Bondly, AgroBridge and Food Magnet report none, and Food Magnet is the sharpest case, with eleven stats entries and not one numeral among them. Every figure is client-reported or project-reported, and we audited none of them. The table below transcribes all of it. These describe businesses at different stages, in different markets, measuring different things, and arithmetic across the two columns would be meaningless.",
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
      "All outcome figures are client-reported or project-reported from a free-form stats field. We did not audit, instrument or independently verify any of them, and the projects launched at different times in different markets.",
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
