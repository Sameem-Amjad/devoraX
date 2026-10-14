# SEO, GEO and AEO runbook

How search and AI-search visibility works on thedevorax.tech: what is built into
the code, the decisions behind it, how to add a page without breaking it, and
the jobs that can only be done outside the code. The strategy behind all of it
is `Seo_From_AI_Agents.md` in the repo root (section numbers below refer to it).

Last reviewed: 14 October 2026.

## Decisions on record

| Decision | Choice | Date | Where |
|---|---|---|---|
| AI training crawlers (§9.4.1) | Policy A, maximum visibility: every crawler allowed except Bytespider | 14 Oct 2026 | `src/app/robots.ts` |
| AI search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot, …) | Allowed | 14 Oct 2026 | same |
| Organization type | Plain `Organization`, not `ProfessionalService`/LocalBusiness: two people working remotely, no office clients visit | 14 Oct 2026 | `src/app/layout.tsx` |
| Local SEO / Google Business Profile (§10.2) | Not eligible without a staffed office; not pursued | 14 Oct 2026 | none |
| hreflang (§10.3) | None: one English site, one offer | 14 Oct 2026 | none |
| URL scheme | Keep `/services/{id}` and `/projects/{id}`: they are indexed. Moving to slugs needs a 301 per URL and buys little | 14 Oct 2026 | none |
| Self-reported attribution (§12.9) | "How did you hear about us?" stored in `bookings.heard_about` | 14 Oct 2026 | booking modal, `/api/bookings` |
| Studio profiles (`sameAs`) | None for now: the owner removed `linkedin.com/company/devorax` and `github.com/devorax` from `ORG_PROFILES`. The Organization carries no `sameAs` until the studio has profiles it runs; /contact offers Sameem's own LinkedIn instead | 14 Oct 2026 | `src/data/brand.ts` |

## What the code does

**Brand facts, one source.** `src/data/brand.ts` holds the entity statement and
every brand fact (founded 2022, based in Pakistan, two people, the Fiverr record,
client countries, no certifications). The Organization schema, footer, llms.txt,
`/about`, `/press` and `manifest.json` all read from it. Copy the entity
statement word for word into every directory and social profile:

> DevoraX is a two-person software studio, founded in 2022 and based in Pakistan, that finishes and ships stuck apps for founders: payments that work, real iOS and Android apps, and App Store approval.

**Structured data.** Each page renders one JSON-LD `@graph` through
`<JsonLd>` (`src/components/seo/structured-data.tsx`), built with the helpers in
`src/lib/seo.ts`. Nodes connect by stable `@id`s: `/#website`, `/#organization`,
`/#logo`, `/team#sameem-amjad`, `/team#usman`, and per page `#webpage`,
`#breadcrumb`, `#service`, `#article`, `#faq`. The root layout emits the WebSite
and the full Organization on every page. Pages with a visible "Reviewed by Sameem
Amjad" byline carry `reviewedBy` on their WebPage node. No Review or
AggregateRating markup anywhere: Google treats reviews a business hosts about
itself as ineligible (§7.1.10).

**Crawling and indexing.**
- `robots.txt`: one `*` group (blocks `/api/`, `/admin/`), one Bytespider group, the sitemap line.
- `/sitemap.xml` is a sitemap index. Children: `/sitemaps/pages.xml`, `services.xml`, `case-studies.xml` (with project images), `insights.xml`. `<lastmod>` is the date the content last changed, never the build time (`src/lib/sitemap.ts`).
- Every page sets its own canonical. The root layout deliberately sets none, so a page that forgot would otherwise have been a "duplicate" of the homepage.
- IndexNow (Bing, Yandex and others; Bing feeds Copilot): `npm run indexnow` submits only URLs that are new, changed or deleted since the last run (`--dry-run` to preview, `--all` to force). It keeps its state in `.indexnow-state.json`, so the very first run submits every URL once. Saving or deleting a project in the admin dashboard refreshes the cached pages and pings automatically in production.
- `llms.txt` is generated from the same data as the pages. It is experimental: Google ignores it and most AI bots never fetch it (§9.7). Keep it accurate; don't spend more on it.

**Pages that answer brand questions (§11.5):** `/about` (the entity home),
`/press`, `/pricing`, `/reviews` (the real Fiverr reviews), `/glossary`.

**Accessibility and extraction.** Every page has exactly one
`<main id="main-content">`, a skip link reaches it, and Framer Motion honours
"reduce motion". Text extractors used in AI retrieval keep `<main>` and drop the
navigation (§9.2.2), so a page without one loses its content.

**Security headers.** CSP allow-list (`'unsafe-eval'` only under `next dev`), `X-Frame-Options: DENY`, `X-XSS-Protection: 0`, set in `next.config.ts`. The same file sets `htmlLimitedBots`, so AI crawlers would get metadata in `<head>` even on a dynamically rendered page (every public page is static today).

**Measurement.** GA4 and Clarity, after consent: `booking_open`,
`booking_submit` (with `heard_about`), `contact_click` (email links). The bookings
table records `heard_about`, `booked_from` and `referrer_host`.

## Adding or changing a page

1. Metadata from `pageMetadata({ title, description, path })` in `src/lib/seo.ts`: canonical, Open Graph and Twitter in one go. Title at most about 50 characters (the template adds " | DevoraX"); description 120 to 155.
2. Exactly one `<main id="main-content">` and one `<h1>`; no skipped heading levels.
3. One `<JsonLd graph={[webPageNode(…), breadcrumbNode(…), …]} />`, plus a visible breadcrumb that matches it. Mark up only what the page shows.
4. Open with an answer: the first sentence or two answer the page's main question on their own (§5.2.1, §6.1).
5. Add the URL to the right section in `src/lib/sitemap.ts`, with a real content date. Add it to `llms.txt` if it matters to buyers.
6. Before deploying, run the checks below against a local production build.
7. After deploying, run `npm run indexnow`.

Never change a live URL without a permanent redirect in `next.config.ts`, and
record it in the redirect map below.

## Checks

```bash
npm run build && npm run start            # local production build on :3000
npm run check:seo                          # titles, canonicals, noindex, <main>, H1, JSON-LD, sitemaps, robots, llms.txt
npm run check:seo -- https://thedevorax.tech   # the same against production
npm run audit:content                      # honesty rules on published copy
npm run check:links                        # dead outbound links, including Supabase link columns
```

`check:seo` exits non-zero on any error. Run it before each deploy.

## Redirect map

| From | To | Type | Set in |
|---|---|---|---|
| `http://…` | `https://…` | 308 | Vercel (automatic) |
| `https://www.thedevorax.tech/*` | `https://thedevorax.tech/*` | **307 today, should be 308** | Vercel → Domains (see actions) |
| any path with a trailing slash | the same path without it | 308 | Next.js default |

## Actions outside the code (owner)

In priority order. None of these can be done from the repository.

1. **Apply the Supabase migration** `supabase/migrations/20261014120000_bookings_attribution.sql`. The API keeps working before it is applied (it retries without the new columns), but answers are only stored once it is.
2. **Vercel → Domains:** change the `www.thedevorax.tech` redirect from 307 (temporary) to 308 (permanent), so link signals consolidate on the apex domain (§2.6.2).
3. **Vercel → Firewall:** make sure no bot-protection or "AI bots" rule challenges or blocks crawlers. These rules run before robots.txt. In the logs, Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User and PerplexityBot should all get 200 (§9.5).
4. **Google Search Console:** use a Domain property; submit `https://thedevorax.tech/sitemap.xml` (the index shows indexing per section); under Settings, keep "Search generative AI" on *included*; link GA4; turn on the BigQuery bulk export (§12.1).
5. **Bing Webmaster Tools:** import the site from Search Console, submit the sitemap, and review the **AI Performance** report (Copilot citations and grounding queries) monthly (§12.3).
6. **Brave Search:** search `site:thedevorax.tech` at search.brave.com. Claude's web search draws on Brave's index (§5.3.4).
7. **GA4:** mark `booking_submit` as a key event; register `heard_about` as an event-scoped custom dimension; add an "AI Assistants" channel group placed **above** Referral, with *source matches regex* (§12.2):
   `^(www\.)?(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|claude\.ai|copilot\.microsoft\.com|grok\.com|meta\.ai|chat\.deepseek\.com|chat\.mistral\.ai|you\.com)$`
8. **Profiles (§11.2):** the studio has no company profiles on the site now. When you create a LinkedIn company page (and a GitHub organization, if you want one), use the entity statement as the description, link it to https://thedevorax.tech, and add it to `ORG_PROFILES` in `src/data/brand.ts`: the footer, the `/about` page and the Organization's `sameAs` all pick it up from there. Put the same statement on Fiverr.
9. **Directories and reviews (§8.4):** create Clutch and GoodFirms profiles using the facts in `src/data/brand.ts`, word for word, and ask finished clients for a review there as well as on Fiverr.
10. **`devorax.vercel.app`:** an older deployment titled "DeVoraX", with no canonical, is live. If it is yours, delete it or point it at the domain so it can't compete for the brand name.
11. **After the first deploy:** run `npm run indexnow` once (it submits all 56 URLs, then only changes), and check that GA4 and Clarity still load. The production CSP no longer allows `'unsafe-eval'`; neither tool needs it, but a CSP error in the browser console would show at once if one did.
12. **Content only the owner can supply:** the `/team` banner image still says "2+ Years Experience" while the page says 4+; `/projects/34` (Hear With You) has no long-form case study yet (about 200 words, against 1,700+ elsewhere).

## Monthly and quarterly

- **Monthly:** `npm run check:seo -- https://thedevorax.tech`; Search Console page indexing and Bing AI Performance; `npm run check:links`; an AI accuracy check: ask ChatGPT (search on), Claude (web search on), Perplexity, Gemini and Copilot "What is DevoraX?", "What does DevoraX charge?" and "Who founded DevoraX?", and fix wrong facts at their source (§11.6).
- **AI visibility sample (§12.7):** run each prompt below three times per platform; record whether DevoraX is mentioned and whether thedevorax.tech is cited. This is a starter set: replace it with real phrasing from Fiverr briefs and discovery calls, and keep 50 or more.
  - "Who can finish my Lovable app and get it into the App Store?"
  - "My Replit app works but Stripe payments never went live. Who can fix it?"
  - "Sharetribe developer who can build the native iOS and Android apps"
  - "How much does it cost to finish an app built with Bolt or Cursor?"
  - "Stripe Connect payouts for a Sharetribe marketplace: who sets that up?"
  - "React Native vs Flutter for a marketplace app"
  - "Is DevoraX legit?" / "DevoraX reviews" / "DevoraX pricing"
- **Quarterly:** re-check AI crawler names against the vendors' docs (§9.3) and update `robots.ts` if a new bot appears; refresh the prompt list; review this file.

## Deliberately not done

- **Slug URLs** for services and projects: indexed numeric URLs stay.
- **Nonce-based CSP** (§13.2): it would force every page to render per request, giving up static generation. The allow-list CSP stays.
- **Programmatic pages** (§10.1) and **location pages** (§10.2): no real data or offices to justify them.
- **`llms-full.txt` and Markdown mirrors**: experimental, with no platform using them (§9.6, §9.7).
- **AI-usage policy and accessibility statement pages** (§11.7): both need the owner's real policy, not invented text.
- **Remaining low-contrast text:** the shared elements (footer, breadcrumbs, bylines) now pass WCAG AA; some page-specific muted labels do not, and the "SYSTEM ACCESS" admin link stays dim on purpose. Lighthouse accessibility is 96 on every page checked (the guide's bar is 95).
- **Off-site work** (§8): directories, PR, guest articles, community answers and open source can't be done in code. The actions above are the start.
