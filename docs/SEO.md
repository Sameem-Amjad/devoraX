# SEO, GEO and AEO runbook

How search and AI-search visibility works on thedevorax.tech: what is built into
the code, the decisions behind it, how to add a page without breaking it, and
the jobs that can only be done outside the code. The strategy behind all of it
is `Seo_From_AI_Agents.md` in the repo root (section numbers below refer to it).

Last reviewed: 8 November 2026.

## Decisions on record

| Decision | Choice | Date | Where |
|---|---|---|---|
| AI training crawlers (§9.4.1) | Policy A, maximum visibility: every crawler allowed except Bytespider | 14 Oct 2026 | `src/app/robots.ts` |
| AI search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot, …) | Allowed | 14 Oct 2026 | same |
| Organization type | Plain `Organization`, not `ProfessionalService`/LocalBusiness: two people working remotely, no office clients visit | 14 Oct 2026 | `src/app/layout.tsx` |
| Local SEO / Google Business Profile (§10.2) | Not eligible without a staffed office; not pursued | 14 Oct 2026 | none |
| hreflang (§10.3) | None: one English site, one offer | 14 Oct 2026 | none |
| URL scheme | Keep `/projects/{id}`: moving to slugs needs a 301 per URL and buys little. Which project pages are indexed is the allowlist below. Service and landing pages live at `/solutions/{slug}`; the four `/services/{id}` pages were retired (see the redirect map) | 7 Nov 2026 | `next.config.ts` |
| Self-reported attribution (§12.9) | "How did you hear about us?" stored in `bookings.heard_about` | 14 Oct 2026 | booking modal, `/api/bookings` |
| Booking path and lead tracking | Every booking link goes to `/book`, with `?from=` naming the page or profile; the first page of a visit is kept only with analytics consent; weekday call windows 10:00 to 18:00 and 19:00 to 23:00 PKT | 7 Nov 2026 | `/book`, booking modal, `/api/bookings`, migration 20261107120000, `src/lib/booking/` |
| Project pages in the index | Only `/projects/34`, `/19`, `/25`, `/33` and `/37` are indexable (`INDEXABLE_PROJECTS`). Every other `/projects/{id}`, including rows added later, is `noindex, follow` and stays on `/projects` for visitors. The sitemap, the footer, the homepage's work grid, llms.txt and the admin's IndexNow ping read the list. An id joins it when its page is rewritten around what Sameem did on it | 7 Nov 2026 | `src/data/projectIndex.ts` |
| "Case Study" label | Only for projects whose `PROJECT_ENGAGEMENT` value is `devorax-client`, client work DevoraX did: Koor (project 17) from 8 Nov 2026. Every other project page is an "engineering write-up" in its title, JSON-LD name, byline and the links to it, including the `fiverr` projects, where a client hired DevoraX through its Fiverr profile (in Sameem Amjad's name). Engagements are read from each study's attribution sentence | 8 Nov 2026 | `src/data/projectIndex.ts` |
| Retired URLs | `/case-study` (it listed the same projects as `/projects`); the "25 production builds" insight, which search engines had never crawled; `/services/1` to `/4`, the four service pages, replaced by the door pages and the `/services` hub. The `services` table keeps its rows, because `projects.service_id` points at them; nothing renders them. All permanent (308); see the redirect map | 7 Nov 2026 | `next.config.ts` |
| Service pages | `/services` is the hub: the three door pages, new marketplace builds, the offer ladder and the market pages, with no database grid. A door page (`kind: 'offer'` in `src/data/solutions.ts`) sells steps of the offer ladder at the published prices, and the site's links to it use its `nav_label` as anchor text: the hero, the homepage cards, the footer, `/services` and llms.txt | 7 Nov 2026 | `src/data/offer.ts` (`DOORS`), `src/data/siteNav.ts` |
| Studio profiles (`sameAs`) | None for now: the owner removed `linkedin.com/company/devorax` and `github.com/devorax` from `ORG_PROFILES`. The Organization carries no `sameAs` until the studio has profiles it runs; /contact offers Sameem's own LinkedIn instead | 14 Oct 2026 | `src/data/brand.ts` |

## What the code does

**Brand facts, one source.** `src/data/brand.ts` holds the entity statement and
every brand fact (founded 2022, based in Pakistan, two people, the Fiverr record,
client countries, no certifications). The Organization schema, footer, llms.txt,
`/about` and `/press` read from it. `public/manifest.json` is a static file, so
it holds a copy of the entity statement as its description; `npm run
audit:content` fails if the two differ. Copy the entity statement word for word
into every directory and social profile:

> DevoraX is a two-person software studio, founded in 2022 and based in Pakistan, that finishes and ships stuck apps for founders: payments that work, and real iOS and Android apps, prepared and submitted to the App Store and Google Play.

**Structured data.** Each page renders one JSON-LD `@graph` through
`<JsonLd>` (`src/components/seo/structured-data.tsx`), built with the helpers in
`src/lib/seo.ts`. Nodes connect by stable `@id`s: `/#website`, `/#organization`,
`/#logo`, `/team#sameem-amjad`, `/team#usman`, and per page `#webpage`,
`#breadcrumb`, `#service`, `#article`, `#faq`. The root layout emits the WebSite
and the full Organization on every page; its `hasOfferCatalog` lists each door
page's `#service` node, generated from `src/data/solutions.ts`. A door page's
Service carries Offers built from the offer ladder (`src/lib/offerPricing.ts`,
the same helper `/pricing` uses), and its FAQPage covers only the questions it
shows. Pages with a visible "Reviewed by Sameem
Amjad" byline carry `reviewedBy` on their WebPage node. No Review or
AggregateRating markup anywhere: Google treats reviews a business hosts about
itself as ineligible (§7.1.10).

**Crawling and indexing.**
- `robots.txt`: one `*` group (blocks `/api/`, `/admin/`), one Bytespider group, the sitemap line.
- `/sitemap.xml` is a sitemap index. Children: `/sitemaps/pages.xml`, `services.xml` (`/services` and every `/solutions/{slug}` page), `case-studies.xml` (`/projects` and the allowlisted project pages, with their images; the file keeps its old name), `insights.xml` (`/insights`, its articles and checklists, and `/glossary`). `<lastmod>` is the date the content last changed, never the build time (`src/lib/sitemap.ts`). A door page, a checklist and a vertical page with its own `updated` carry that date, so adding one page doesn't re-date the others.
- Project pages off the allowlist in `src/data/projectIndex.ts` carry `noindex, follow`, and the sitemap, llms.txt and the footer leave them out. They still render, and `/projects` still lists them.
- Every page sets its own canonical. The root layout deliberately sets none, so a page that forgot would otherwise have been a "duplicate" of the homepage.
- IndexNow (Bing, Yandex and others; Bing feeds Copilot): `npm run indexnow` submits only URLs that are new, changed or deleted since the last run (`--dry-run` to preview, `--all` to force). It keeps its state in `.indexnow-state.json`, so the very first run submits every URL once. Saving or deleting a project in the admin dashboard refreshes the cached pages and pings automatically in production; the ping leaves out project pages off the allowlist and redirected paths (`src/lib/indexnow.ts`).
- `llms.txt` is generated from the same data as the pages. It is experimental: Google ignores it and most AI bots never fetch it (§9.7). Keep it accurate; don't spend more on it.
- Links: the header's menu is `src/data/primaryNav.ts`, which imports nothing, so the header (a client component) doesn't ship the site's content data to the browser. Every other list of links (the footer's door pages and hub, the allowlisted projects, the company pages) is built in `src/data/siteNav.ts`, server-side. Call hours and booking windows: docs/BOOKING.md, "Changing your availability".

**Pages that answer brand questions (§11.5):** `/about` (the entity home),
`/press`, `/pricing` (every step's price, and the full terms at `#terms`),
`/reviews` (the real Fiverr reviews), `/glossary`.

**Page types.**
- Door pages, `/solutions/{slug}` with `kind: 'offer'`: `lovable-app-to-app-store`, `sharetribe-developers` and `fix-vibe-coded-app`. Rendered by `src/components/seo/offer-page.tsx`, with the terms block from `src/data/terms.ts` and two links to `/book?from={slug}`.
- Vertical pages, `/solutions/{slug}` without a kind: the marketplace hub and its market pages, each built on named work. Rendered by `src/components/seo/solution-page.tsx`.
- Research articles and checklists, `/insights/{slug}` (`src/data/insights.ts`); a checklist has `kind: 'checklist'`.
- Project pages, `/projects/{id}`, from the projects table plus `src/data/caseStudyContent.ts`; indexable only on the allowlist above.

**Accessibility and extraction.** Every page has exactly one
`<main id="main-content">`, a skip link reaches it, and Framer Motion honours
"reduce motion". Text extractors used in AI retrieval keep `<main>` and drop the
navigation (§9.2.2), so a page without one loses its content.

**Security headers.** CSP allow-list (`'unsafe-eval'` only under `next dev`), `X-Frame-Options: DENY`, `X-XSS-Protection: 0`, set in `next.config.ts`. The same file sets `htmlLimitedBots`, so AI crawlers would get metadata in `<head>` even on a dynamically rendered page (every public page is static today).

**Measurement.** GA4 and Clarity, after consent: `booking_open`,
`booking_submit` (with `heard_about` and `booked_from`), `contact_click` (email
links). The bookings table records `heard_about`, `booked_from` and
`referrer_host`; from migration 20261107120000 also `landing_path` (with
consent), `lead_channel`, the optional brief, and the columns the owner fills
in by hand in the Supabase table editor: `new_channel`, `qualified`,
`qualified_note`, `first_step_paid`, `developer_account`, `sharetribe_plan` and
`sharetribe_need` (docs/BOOKING.md, "What a booking records"). Every booking
link goes to `/book`; links tagged `/book?from=…` say which page or profile a
booking came from. So `booking_open` fires on `/book`, even for a booking
started on the homepage; count bookings by page with `booking_submit`'s
`booked_from`.

## Adding or changing a page

1. Metadata from `pageMetadata({ title, description, path })` in `src/lib/seo.ts`: canonical, Open Graph and Twitter in one go. Title at most about 50 characters (the template adds " | DevoraX"); description 120 to 155.
2. Exactly one `<main id="main-content">` and one `<h1>`; no skipped heading levels.
3. One `<JsonLd graph={[webPageNode(…), breadcrumbNode(…), …]} />`, plus a visible breadcrumb that matches it. Mark up only what the page shows.
4. Open with an answer: the first sentence or two answer the page's main question on their own (§5.2.1, §6.1).
5. Add the URL to the right section in `src/lib/sitemap.ts`, with a real content date. Add it to `llms.txt` if it matters to buyers. A new project page needs none of this: it is `noindex, follow` and out of the sitemap and llms.txt until its id is added to `INDEXABLE_PROJECTS` in `src/data/projectIndex.ts`. Give it an entry in `PROJECT_ENGAGEMENT` there, from who the client contracted with.
6. Before deploying, run the checks below against a local production build.
7. After deploying, run `npm run indexnow`.

Never change a live URL without a permanent redirect in `next.config.ts`, and
record it in the redirect map below.

### Adding a door page

1. Add a `SOLUTIONS` entry in `src/data/solutions.ts` with `kind: 'offer'` and `role: 'offer'`, in the shape the `OfferSolution` type documents: a `nav_label` (the anchor text of every link to the page), a `title` of 50 characters or fewer, a `meta_description` of 120 to 155, a `subtitle_lead` with no price in it, the `offer_steps` it sells (the subtitle's price, the closing price block and the Offer schema are generated from them), sections with `id` anchors, a role line on every project in `proof` and a job on every review (the review's handle must be in `src/data/testimonials.ts`, or the build stops), and `updated`. Body text takes paragraphs separated by a blank line and links written `[anchor](/path)` or `[anchor](https://…)`.
2. Add a `DOORS` entry in `src/data/offer.ts`: its `slug`, a short `label`, a `title` and two or three sentences of `body`, with no prices. The hero, the homepage cards, the `/services` door sections, the footer and llms.txt read it, and the build stops if the slug isn't a door page.
3. Nothing else needs wiring: the route, the sitemap, llms.txt, the Organization's `hasOfferCatalog`, the terms block and `/book?from={slug}` all read `SOLUTIONS`.
4. Run the checks below, deploy, then `npm run indexnow`.

### Adding a checklist

1. Add an `INSIGHTS` entry in `src/data/insights.ts` with `kind: 'checklist'`. Each item (`id`, `group`, `check`, `why`, `test`) renders at `#item-{id}` and each group at `#group-{group name, lowercased and hyphenated}`; other pages link to those anchors, so never change an item's `id`. A section with an `id` renders at `#{id}`.
2. Give it its own `updated`: the byline, the Article schema and the sitemap use it, so the research articles keep their dates.
3. `/insights` labels it "N checks · checklist"; the sitemap, llms.txt and `/book?from={slug}` pick it up from `INSIGHTS`. Run the checks, deploy, then `npm run indexnow`.

## Checks

```bash
npm run build && npm run start            # local production build on :3000
npm run check:seo                          # titles, canonicals, noindex, <main>, H1, JSON-LD, sitemaps, robots, llms.txt
npm run check:seo -- https://thedevorax.tech   # the same against production
npm run audit:content                      # honesty rules on the content files (see below)
npm run check:links                        # dead outbound links, including Supabase link columns
```

`check:seo` exits non-zero on any error. Run it before each deploy.

`audit:content` reads every string in the content files (`src/data/`) and exits
non-zero on any error: a promise that a store will approve the app (denials such
as "no one can guarantee approval" pass), a turnaround promise (a reply or
delivery "within" so many hours or days), a credential claim ("we are …
certified/experts/partners"), a figure on a client's word, an employer project
claimed as DevoraX's, `manifest.json`'s description differing from the entity
statement, or a `NEXT_START` week in `src/data/terms.ts` that has passed (update
it weekly with `NEXT_START_UPDATED`). The terms' audit turnaround, a third
party's terms in a dated, sourced price table and a quotation that carries its
source link are exempt.

## Redirect map

| From | To | Type | Set in |
|---|---|---|---|
| `http://…` | `https://…` | 308 | Vercel (automatic) |
| `https://www.thedevorax.tech/*` | `https://thedevorax.tech/*` | 308 | Vercel → Domains: `www.thedevorax.tech` added as its own entry, "Redirect to Another Domain" (14 Oct 2026). Without that entry Vercel falls back to a 307 |
| any path with a trailing slash | the same path without it | 308 | Next.js default |
| `/case-study` | `/projects` | 308 | `next.config.ts` (7 Nov 2026) |
| `/insights/what-we-measured-across-25-production-builds` | `/insights` | 308 | `next.config.ts` (7 Nov 2026) |
| `/services/1` (mobile app development) | `/solutions/lovable-app-to-app-store` | 308 | `next.config.ts` (7 Nov 2026) |
| `/services/2` (AI and full-stack web development) | `/solutions/fix-vibe-coded-app` | 308 | `next.config.ts` (7 Nov 2026) |
| `/services/3` (cloud architecture and DevOps) | `/services` | 308 | `next.config.ts` (7 Nov 2026) |
| `/services/4` (UI/UX design systems) | `/services` | 308 | `next.config.ts` (7 Nov 2026) |

## Actions outside the code (owner)

None of these can be done from the repository.

### Deploy day: the door pages, the booking path and the project allowlist

Before the day: the checks above pass on a local production build, and item 13's look at the 16-month export is done. Then, in this order:

1. ~~**Apply the booking migration, before deploying:**~~ Done 8 Nov 2026 with `supabase db push --linked`; all twelve new columns are readable. `supabase db push --linked` applies `supabase/migrations/20261107120000_bookings_lead_tracking.sql`. Check that the `bookings` table now has its twelve new columns, `landing_path` through `sharetribe_need`. If the code went out first, bookings would still save, without the new fields (docs/BOOKING.md, "Before deploying").
2. ~~**Deploy:** push to `main`; Vercel builds and deploys it.~~ Done 8 Nov 2026 (pull request #1, after the migration).
3. ~~**Smoke-test the doors and redirects**~~ Done 8 Nov 2026: the four pages return 200 with their own canonicals, the six redirects return 308 to their targets, and `check:seo` passes on production. on https://thedevorax.tech: `/solutions/lovable-app-to-app-store`, `/solutions/sharetribe-developers`, `/solutions/fix-vibe-coded-app` and `/insights/vibe-coded-app-security-checklist` return 200, each with its own URL as its canonical; `/case-study`, `/insights/what-we-measured-across-25-production-builds` and `/services/1` to `/4` return 308 to their targets in the redirect map (`curl -sI https://thedevorax.tech/services/1` shows the status and the `location`). Then run `npm run check:seo -- https://thedevorax.tech`.
4. ~~**Make one test booking per door**~~ Done 8 Nov 2026: each row held its door's `booked_from`, the first also its brief, and each invite was created with a Meet link, so the lead tracking fields saved first time. The rows and events were deleted afterwards (the events without cancellation emails). with your own email address, through `/book?from=lovable-app-to-app-store`, `/book?from=sharetribe-developers` and `/book?from=fix-vibe-coded-app`. In Supabase, each row's `booked_from` is that door's `/solutions/…` path, and the optional brief holds what you typed. The Vercel logs show neither `[booking] saving bookings without the lead tracking fields` nor `[booking] saving bookings without attribution`. Then delete the three rows in the Supabase table editor (the dashboard can't delete bookings) and the three events in Google Calendar (deleting a row doesn't cancel its event).
5. ~~**Run IndexNow:**~~ Done 8 Nov 2026: 70 URLs, HTTP 200. `npm run indexnow -- --dry-run` to see the list, then `npm run indexnow`. It sends the new and changed pages and the URLs that left the sitemap: the redirected paths and the project pages now marked noindex.
6. **Request indexing in Search Console** for the three door pages and the checklist: URL Inspection, then "Request indexing", once each.
7. **Register the GA4 dimensions:** `booked_from` and `heard_about`, event-scoped, with `booking_submit` kept as the key event (item 7 below). `booking_open` now fires on `/book`, so a report that filters it on `/` stops counting the homepage's bookings.
8. **Update `NEXT_START` every Monday:** set it and `NEXT_START_UPDATED` in `src/data/terms.ts`, then deploy. From the Monday after the week it names, the pages say "Ask on the call: our next start date is updated weekly." and `npm run audit:content` fails until it is updated. Change the start week the same day wherever a marketplace listing prints it.

A week after deploying, run Bing Webmaster Tools' URL Inspection on each door page (item 5 below).

### Other actions

In priority order.

1. ~~Apply the Supabase migration~~ Done 14 Oct 2026 (`supabase db push --linked`); PostgREST accepts the new columns.
   ~~**Again for the booking-path release:** deploy day, step 1.~~ Done 8 Nov 2026.
2. ~~Vercel www redirect 307 → 308~~ Done 14 Oct 2026, verified live (§2.6.2).
3. **Vercel → Firewall:** make sure no bot-protection or "AI bots" rule challenges or blocks crawlers. These rules run before robots.txt. In the logs, Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User and PerplexityBot should all get 200 (§9.5).
4. **Google Search Console:** use a Domain property; submit `https://thedevorax.tech/sitemap.xml` (the index shows indexing per section); under Settings, keep "Search generative AI" on *included*; link GA4; turn on the BigQuery bulk export (§12.1).
5. **Bing Webmaster Tools:** import the site from Search Console, submit the sitemap, and review the **AI Performance** report (Copilot citations and grounding queries) monthly (§12.3).
6. **Brave Search:** search `site:thedevorax.tech` at search.brave.com. Claude's web search draws on Brave's index (§5.3.4).
7. **GA4:** mark `booking_submit` as a key event; register `heard_about` and `booked_from` as event-scoped custom dimensions; add an "AI Assistants" channel group placed **above** Referral, with *source matches regex* (§12.2):
   `^(www\.)?(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|claude\.ai|copilot\.microsoft\.com|grok\.com|meta\.ai|chat\.deepseek\.com|chat\.mistral\.ai|you\.com)$`
8. **Profiles (§11.2):** the studio has no company profiles on the site now. When you create a LinkedIn company page (and a GitHub organization, if you want one), use the entity statement as the description, link it to https://thedevorax.tech, and add it to `ORG_PROFILES` in `src/data/brand.ts`: the footer, the `/about` page and the Organization's `sameAs` all pick it up from there. Put the same statement on Fiverr.
9. **Directories and reviews (§8.4):** create a Clutch profile using the facts in `src/data/brand.ts`, word for word (GoodFirms can wait). Before asking for a Clutch review, record who the client's contract and invoices were with: ask only where that was DevoraX, or where the client agrees the studio did the work, and ask the reviewer to describe the engagement as it happened; otherwise ask for a LinkedIn recommendation for Sameem. Orders through DevoraX's Fiverr profile (in Sameem Amjad's name) count as DevoraX's; read Fiverr's terms before asking a Fiverr client for a review anywhere else.
10. **`devorax.vercel.app`:** an older deployment titled "DeVoraX", with no canonical, is live. If it is yours, delete it or point it at the domain so it can't compete for the brand name.
11. **After the first deploy:** ~~run `npm run indexnow` once~~ (done 14 Oct 2026: 56 URLs, HTTP 200; later runs send only changes). Check that GA4 and Clarity load once their IDs are set in Vercel. The production CSP no longer allows `'unsafe-eval'`; neither tool needs it, but a CSP error in the browser console would show at once if one did.
12. **Content only the owner can supply:** `/projects/34` (Hear With You) has no long-form write-up yet (about 200 words, against 1,700+ elsewhere). The `/team` banner was corrected to "4+ Years" on 14 Oct 2026.
13. **The index-hygiene release (allowlist, `/case-study` 301):** before deploying it, look up the 35 project pages that leave the index in Search Console's 16-month Performance export (Pages tab). Any page with clicks gets an individual look first: keep it off the allowlist, rewrite it and add it, or 301 it to its sameemamjad.com/work twin (ids 1, 2, 3, 11 and 12 have no twin, so noindex is their only option). Deploy day's IndexNow run (step 5) submits the URLs that left the sitemap, so Bing recrawls them and finds the noindex or the redirect. Google drops the noindexed pages as it recrawls them; watch "Excluded by 'noindex' tag" grow in the Page indexing report, and indexed ÷ submitted for `case-studies.xml`.
14. **The door-page release (`/services/{id}` redirects):** deploy day's IndexNow run (step 5) also submits `/services/1` to `/4`, which left the sitemap, so Bing recrawls them and follows the redirects. Request indexing once for each door page and the checklist (step 6); repeating the request doesn't speed anything up. The `services` table's rows stay: `projects.service_id` points at them.

## Monthly and quarterly

- **Monthly:** `npm run check:seo -- https://thedevorax.tech`; Search Console page indexing and Bing AI Performance; `npm run check:links`; an AI accuracy check: ask ChatGPT (search on), Claude (web search on), Perplexity, Gemini and Copilot "What is DevoraX?", "What does DevoraX charge?" and "Who founded DevoraX?", and fix wrong facts at their source (§11.6).
- **AI visibility sample (§12.7):** run each prompt below once a month on ChatGPT search, Perplexity and Copilot; once a door page or listing shows up in any engine, three times each on ChatGPT, Perplexity, Claude, Gemini and Copilot. Record mentions, citations (including DevoraX's own listings, and whether a cited door is indexed only in Bing) and every third-party list cited; fix wrong facts at their source within a week.
  - "Who can take my Lovable app to the App Store with in-app purchases?"
  - "Can I use Stripe in my iOS app instead of in-app purchase?"
  - "Can I put a Base44 app on Google Play?"
  - "Sharetribe developer who can build a native iOS app"
  - "Who can audit my vibe-coded app before launch, and what does it cost?"
  - "Who can clean up my vibe-coded app?"
  - "How do I move my Lovable app off Lovable Cloud?"
  - "My investor wants technical due diligence on an app built with Lovable. What will they check, and who can review it first?"
  - "What is DevoraX (thedevorax.tech)?"
  - "Is DevoraX a legit app studio?"
  - "DevoraX reviews"
- **Quarterly:** re-check AI crawler names against the vendors' docs (§9.3) and update `robots.ts` if a new bot appears; refresh the prompt list; review this file.

## Deliberately not done

- **Slug URLs** for projects: indexed numeric URLs stay. (The service pages moved to `/solutions/{slug}` when the door pages replaced them.)
- **Nonce-based CSP** (§13.2): it would force every page to render per request, giving up static generation. The allow-list CSP stays.
- **Programmatic pages** (§10.1) and **location pages** (§10.2): no real data or offices to justify them.
- **`llms-full.txt` and Markdown mirrors**: experimental, with no platform using them (§9.6, §9.7).
- **AI-usage policy and accessibility statement pages** (§11.7): both need the owner's real policy, not invented text.
- **Remaining low-contrast text:** the shared elements (footer, breadcrumbs, bylines) now pass WCAG AA; some page-specific muted labels do not, and the "SYSTEM ACCESS" admin link stays dim on purpose. Lighthouse accessibility is 96 on every page checked (the guide's bar is 95).
- **Off-site work** (§8): directories, PR, guest articles, community answers and open source can't be done in code. The actions above are the start.
