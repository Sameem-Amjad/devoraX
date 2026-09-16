#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Yandex, Naver, Seznam, Yep).
 *
 * Google does NOT participate in IndexNow — this does nothing for Google Search.
 * It matters here because Bing's index backs Bing Copilot and contributes to
 * other AI answer engines, so it is a cheap way to get fresh pages discovered
 * on the non-Google side.
 *
 *   node scripts/indexnow.mjs                 # submit every URL in the sitemap
 *   node scripts/indexnow.mjs <url> [<url>]   # submit specific URLs
 */
import { readFileSync } from 'node:fs';

const HOST = 'thedevorax.tech';
const ORIGIN = `https://${HOST}`;

let key;
try {
  key = readFileSync(new URL('../.indexnow-key', import.meta.url), 'utf8').trim();
} catch {
  console.error('Missing .indexnow-key at the repo root. It must contain the same key as public/<key>.txt');
  process.exit(1);
}

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const urlList = process.argv.slice(2).length ? process.argv.slice(2) : await sitemapUrls();
if (!urlList.length) {
  console.error('No URLs to submit.');
  process.exit(1);
}

const body = {
  host: HOST,
  key,
  keyLocation: `${ORIGIN}/${key}.txt`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

// 200 = accepted, 202 = accepted pending key validation. Both are success.
console.log(`IndexNow -> HTTP ${res.status} for ${urlList.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
