import { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/brand';

/**
 * Crawler policy: maximum visibility. Sameem chose this on 14 Oct 2026
 * (docs/SEO.md, "Decisions on record"): every crawler may read the site except
 * Bytespider.
 *
 * AI companies send three kinds of bot, and each is its own decision:
 *
 *  1. TRAINING crawlers (GPTBot, ClaudeBot, CCBot, meta-externalagent, and the
 *     Google-Extended and Applebot-Extended tokens) collect pages for future
 *     models. Allowed: this is a marketing site whose copy exists to be read and
 *     remembered, and a model trained on it is more likely to know DevoraX when
 *     it answers without searching. The cost is bandwidth. Bytespider is the
 *     exception: it is reported to crawl abusively and to honour robots.txt
 *     inconsistently, so if it ignores the rule below, block it in the Vercel
 *     firewall.
 *  2. SEARCH / INDEX crawlers (Googlebot, Bingbot, OAI-SearchBot,
 *     Claude-SearchBot, PerplexityBot, Applebot) build the indexes that search
 *     results and AI answers cite. Blocking one removes the site from them.
 *  3. USER-TRIGGERED fetchers (ChatGPT-User, Claude-User, Perplexity-User) fetch
 *     a page because someone asked about it. Several vendors say these may not
 *     follow robots.txt at all.
 *
 * So every crawler falls through to the one `*` group, with no named group per
 * bot. A crawler obeys only the most specific group that matches it, so a named
 * group that repeats `*` silently stops receiving any rule later added to `*`.
 * Add a named group only for a bot that must be treated differently.
 *
 * Vercel's firewall and bot-protection rules run before robots.txt is ever
 * read: a challenge there blocks a crawler this file allows. Keep them in
 * agreement with this policy.
 *
 * No Host line: it is a non-standard extension that Google ignores, and the
 * www → apex redirect and every page's canonical already name the host.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
