#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Yandex, Naver, Seznam, Yep).
 *
 * Google does NOT participate in IndexNow — this does nothing for Google Search.
 * It matters here because Bing's index backs Bing Copilot and contributes to
 * other AI answer engines, so it is a cheap way to get fresh pages discovered
 * on the non-Google side.
 *
 *   npm run indexnow                    # what changed since the last submission
 *   npm run indexnow -- --dry-run       # print what would be sent; send and save nothing
 *   npm run indexnow -- --all           # every URL in the sitemap, changed or not
 *   npm run indexnow -- <url> [<url>]   # exactly these URLs
 *
 * Run it after a deploy. It reads the live /sitemap.xml, a plain <urlset> or a
 * <sitemapindex> (then every child sitemap), and by default submits only URLs
 * that are new, whose <lastmod> changed, or that left the sitemap (deleted
 * pages: the engines recrawl them and see the 404). IndexNow is for URLs that
 * changed, not for resubmitting the whole site on every deploy.
 *
 * What was submitted is kept in .indexnow-state.json (git-ignored), written only
 * after IndexNow accepts it (HTTP 200 or 202). With no state file, every URL
 * counts as new. Explicit URLs are sent as given and leave the state alone.
 * Project saves in the admin dashboard ping on their own (src/lib/indexnow.ts).
 */
import { readFileSync, writeFileSync } from 'node:fs';

const HOST = 'thedevorax.tech';
const ORIGIN = `https://${HOST}`;
const SITEMAP = `${ORIGIN}/sitemap.xml`;
const BATCH_SIZE = 10_000; // IndexNow's limit per request
const KEY_FILE = new URL('../.indexnow-key', import.meta.url);
const STATE_FILE = new URL('../.indexnow-state.json', import.meta.url);

const args = process.argv.slice(2);
const options = args.filter((a) => a.startsWith('--'));
const explicitUrls = args.filter((a) => !a.startsWith('--'));
const ALL = options.includes('--all');
const DRY_RUN = options.includes('--dry-run');

const unknown = options.filter((o) => o !== '--all' && o !== '--dry-run');
if (unknown.length) {
  console.error(`Unknown option ${unknown.join(', ')}. Options: --all, --dry-run.`);
  process.exit(1);
}
if (ALL && explicitUrls.length) {
  console.error('Pass --all or a list of URLs, not both.');
  process.exit(1);
}

// ── Reading the sitemap ──
// Regexes are enough for the sitemap XML this site serves; this is not a
// general XML parser.

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const unescapeXml = (s) =>
  s.replace(/&(?:#x([0-9a-fA-F]+)|#(\d+)|(amp|lt|gt|quot|apos));/g, (_, hex, dec, name) =>
    name ? ENTITIES[name] : String.fromCodePoint(hex ? parseInt(hex, 16) : Number(dec))
  );

/** The contents of every <name>…</name> element in `xml`. */
const elements = (xml, name) =>
  [...xml.matchAll(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, 'g'))].map((m) => m[1]);

/** The unescaped text of the first <name> element in `xml`. */
const textOf = (xml, name) => {
  const [inner] = elements(xml, name);
  return inner === undefined ? undefined : unescapeXml(inner.trim());
};

async function fetchXml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url}: HTTP ${res.status}`);
  return res.text();
}

/**
 * Every URL the sitemap lists, with its <lastmod> ('' when it has none). A
 * sitemap that fails to load aborts the run, so its URLs are never mistaken for
 * deleted pages.
 */
async function readSitemap(url, inIndex = false) {
  const xml = await fetchXml(url);
  if (/<urlset[\s>]/.test(xml)) {
    return new Map(
      elements(xml, 'url')
        .map((u) => [textOf(u, 'loc'), textOf(u, 'lastmod') ?? ''])
        .filter(([loc]) => loc)
    );
  }
  if (/<sitemapindex[\s>]/.test(xml) && !inIndex) {
    const children = elements(xml, 'sitemap').map((s) => textOf(s, 'loc'));
    const maps = await Promise.all(children.map((child) => readSitemap(child, true)));
    return new Map(maps.flatMap((m) => [...m]));
  }
  throw new Error(`${url} is not a sitemap${inIndex ? ' (an index may list only urlsets)' : ''}`);
}

// ── State: what was last accepted, URL → lastmod ──

function readState() {
  let text;
  try {
    text = readFileSync(STATE_FILE, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return { submittedAt: null, urls: new Map() };
    throw err;
  }
  try {
    const state = JSON.parse(text);
    return { submittedAt: state.submittedAt, urls: new Map(Object.entries(state.urls ?? {})) };
  } catch (err) {
    throw new Error(
      `.indexnow-state.json is unreadable (${err.message}). Delete it to start over; the next run then submits every URL.`
    );
  }
}

function writeState(urls) {
  const state = { submittedAt: new Date().toISOString(), urls: Object.fromEntries(urls) };
  writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
}

// ── Submitting ──

function readKey() {
  try {
    return readFileSync(KEY_FILE, 'utf8').trim();
  } catch {
    console.error('Missing .indexnow-key at the repo root. It must contain the same key as public/<key>.txt');
    process.exit(1);
  }
}

/** POSTs in batches of BATCH_SIZE and returns the URLs IndexNow accepted. */
async function submit(urls) {
  const key = readKey();
  const accepted = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const urlList = urls.slice(i, i + BATCH_SIZE);
    try {
      const res = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key, keyLocation: `${ORIGIN}/${key}.txt`, urlList }),
      });
      // 200 = accepted, 202 = accepted pending key validation. Both are success.
      console.log(`IndexNow -> HTTP ${res.status} for ${urlList.length} URL(s)`);
      if (res.status === 200 || res.status === 202) accepted.push(...urlList);
      else console.error(await res.text());
    } catch (err) {
      console.error(`IndexNow request failed for ${urlList.length} URL(s): ${err.message}`);
    }
  }
  return accepted;
}

const requests = (n) => `${Math.ceil(n / BATCH_SIZE)} request(s)`;

async function main() {
  if (explicitUrls.length) {
    for (const url of explicitUrls) console.log(`  ${url}`);
    if (DRY_RUN) {
      console.log(`Dry run: would send ${explicitUrls.length} URL(s) in ${requests(explicitUrls.length)}. Nothing sent.`);
      return 0;
    }
    return (await submit(explicitUrls)).length === explicitUrls.length ? 0 : 1;
  }

  const current = await readSitemap(SITEMAP);
  if (!current.size) throw new Error(`${SITEMAP} lists no URLs; refusing to treat every page as deleted.`);
  const previous = readState();

  // URL → why it is being sent.
  const pending = new Map();
  for (const [url, lastmod] of current) {
    if (!previous.urls.has(url)) pending.set(url, 'new');
    else if (previous.urls.get(url) !== lastmod) pending.set(url, 'changed');
    else if (ALL) pending.set(url, 'unchanged');
  }
  for (const url of previous.urls.keys()) {
    if (!current.has(url)) pending.set(url, 'removed');
  }

  console.log(
    `${SITEMAP}: ${current.size} URLs. ` +
      (previous.submittedAt
        ? `Last submission: ${previous.submittedAt}.`
        : 'No previous submission, so every URL counts as new.')
  );
  for (const [url, why] of pending) console.log(`  ${why.padEnd(9)} ${url}`);

  if (!pending.size) {
    console.log('Nothing new, changed or removed. Nothing to send.');
    return 0;
  }
  if (DRY_RUN) {
    console.log(
      `Dry run: would send ${pending.size} URL(s) in ${requests(pending.size)}. Nothing sent; state unchanged.`
    );
    return 0;
  }

  const accepted = await submit([...pending.keys()]);
  if (accepted.length) {
    // Record only what was accepted, so a rejected batch is retried next run.
    const next = new Map(previous.urls);
    for (const url of accepted) {
      if (current.has(url)) next.set(url, current.get(url));
      else next.delete(url);
    }
    writeState(next);
  }
  return accepted.length === pending.size ? 0 : 1;
}

try {
  process.exitCode = await main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
}
