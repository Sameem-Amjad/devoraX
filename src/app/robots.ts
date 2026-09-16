import { MetadataRoute } from 'next';

const BASE_URL = 'https://thedevorax.tech';

/**
 * Crawler policy.
 *
 * Two different classes of AI crawler get conflated constantly — they are not
 * the same thing and must be decided separately:
 *
 *  1. SEARCH / CITATION crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot)
 *     decide whether you can be surfaced and cited in AI answers. Blocking these
 *     removes DevoraX from ChatGPT Search / Claude / Perplexity results. These are
 *     explicitly allowed below.
 *
 *  2. TRAINING crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended,
 *     Applebot-Extended) only gather data for model training. Blocking them is a
 *     content-licensing decision and does NOT reduce search visibility:
 *       - Blocking GPTBot does NOT affect ChatGPT Search (that is OAI-SearchBot).
 *       - Blocking Google-Extended does NOT affect Google Search or AI Overviews
 *         (those follow Googlebot).
 *     GPTBot stays disallowed here as a deliberate licensing choice.
 *
 * Note: user-triggered fetchers (ChatGPT-User, Claude-User, Google-Agent) ignore
 * robots.txt by design, so listing them has no effect — use server-side controls
 * if you ever need to stop those.
 */
export default function robots(): MetadataRoute.Robots {
  const privatePaths = ['/api/', '/admin/'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },

      // ── AI search & citation crawlers: explicitly allowed ──
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: privatePaths },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: privatePaths },
      { userAgent: 'PerplexityBot', allow: '/', disallow: privatePaths },

      // ── Training-only crawlers: licensing decision, no search impact ──
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
