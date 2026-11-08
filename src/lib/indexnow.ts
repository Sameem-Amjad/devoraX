import 'server-only';
import { SITE_URL, absoluteUrl } from '@/lib/seo';
import { isIndexable } from '@/data/projectIndex';

/**
 * Tell IndexNow (Bing, Yandex, Naver, Seznam, Yep) that pages were published,
 * updated or deleted, so they are recrawled soon rather than whenever the
 * crawler next comes round. Google does not take part; Bing's index grounds
 * Copilot. scripts/indexnow.mjs covers changes that ship in a deploy.
 *
 * Best effort: a failed or slow ping is logged and dropped, never thrown, so it
 * can't fail the save that triggered it. Only production pings: a save made on
 * a local or preview deployment either isn't in production's data or hasn't
 * refreshed production's cached pages, so a crawler sent now would find
 * nothing new.
 *
 * Hardcoding the key is fine: IndexNow verifies it by fetching it from the
 * site, so it is public by design, at
 * https://thedevorax.tech/206ac19bf00249b5ffddb3961620044f.txt. Not a secret.
 */
const KEY = process.env.INDEXNOW_KEY ?? '206ac19bf00249b5ffddb3961620044f';

/**
 * Paths that permanently redirect (next.config.ts). The deploy-time run
 * (scripts/indexnow.mjs) reports each once, when it leaves the sitemap; a
 * project save has no reason to send them again.
 */
const REDIRECTED = new Set([
  '/case-study',
  '/insights/what-we-measured-across-25-production-builds',
  '/services/1',
  '/services/2',
  '/services/3',
  '/services/4',
]);

/**
 * Whether a path is one search engines should come and read: not a redirect,
 * and not a project page off the index allowlist (data/projectIndex.ts), which
 * is noindex. A deleted allowlisted project still counts, so the engines see
 * its 404.
 */
function worthPinging(path: string): boolean {
  if (REDIRECTED.has(path)) return false;
  const project = /^\/projects\/(\d+)$/.exec(path);
  return project ? isIndexable(project[1]) : true;
}

/** `paths` are site paths ("/projects/12"), not absolute URLs. */
export async function notifyIndexNow(paths: string[]): Promise<void> {
  const wanted = paths.filter(worthPinging);
  if (process.env.VERCEL_ENV !== 'production' || !wanted.length) return;

  const urlList = [...new Set(wanted.map(absoluteUrl))];
  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(5000),
    });
    // 200 = accepted, 202 = accepted pending key validation. Both are success.
    if (res.status !== 200 && res.status !== 202) {
      console.error(`[indexnow] HTTP ${res.status} for ${urlList.join(', ')}`);
    }
  } catch (err) {
    console.error(`[indexnow] request failed for ${urlList.join(', ')}:`, err);
  }
}
