import 'server-only';
import { SITE_URL, absoluteUrl } from '@/lib/seo';

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

/** `paths` are site paths ("/projects/12"), not absolute URLs. */
export async function notifyIndexNow(paths: string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== 'production' || !paths.length) return;

  const urlList = [...new Set(paths.map(absoluteUrl))];
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
