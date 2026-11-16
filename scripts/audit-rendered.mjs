#!/usr/bin/env node
/**
 * Content audit of the rendered site.
 *
 * scripts/content-audit.mjs reads the data files, so it never sees copy typed
 * straight into a page or component (src/app/**, src/components/**): the
 * headings and paragraphs of /pricing, /contact and the home page, a project
 * page's description from the database, the layout's JSON-LD. This fetches what
 * a visitor is served and runs the same rules over it, from the same module
 * (scripts/lib/claims-rules.mjs), so the two cannot drift.
 *
 *   npm run build && npm start          then, in a second terminal:
 *   npm run audit:rendered              audits http://localhost:3000
 *   node scripts/audit-rendered.mjs https://thedevorax.tech --warn-only
 *
 * Coverage: the sitemap index and every URL in it; every other public page
 * reached by following same-origin links (the noindexed /projects/{id} pages are
 * linked from /projects, and /projects is in the sitemap); /llms.txt and
 * /manifest.json. /admin and /api are skipped. Sitemap URLs are production
 * URLs and are fetched from the base you pass.
 *
 * For each page: the title, meta description, H1s, the text inside <main>,
 * og:site_name and the JSON-LD. The shared claims rules run over all of them;
 * on top of those:
 *  - the label rule (a project page may say "Case Study" only when that
 *    project is devorax-client in data/projectIndex.ts; the /terms page's
 *    explanation of the label is allowed) and the demo rule (no "shipped",
 *    "launched", "in production" on a demo or proof-of-concept project page),
 *    both inside the shared rules;
 *  - on the pages where DevoraX states its price, the price rule, the "$400
 *    needs credited" warning, terms parity, and the Offer schema's prices;
 *  - brand parity: no alternateName, and og:site_name and the Organization and
 *    WebSite name equal "DevoraX"; no stray "Devora" in the header or footer;
 *  - /manifest.json's description equals ENTITY_STATEMENT.
 *
 * --list prints every URL audited; --verbose also prints what an exemption or an
 * allow entry excused.
 *
 * Exit 1 if anything at error level is found, unless --warn-only (the rollout
 * runs warn-only for one release, then fails the build). Exit 2 if the site
 * cannot be reached. Requests are polite: four at a time, one UA, a timeout.
 * Plain Node 20, no dependencies.
 */
import { fileURLToPath } from 'node:url';
import { extract, strings, ownPrices } from './lib/read-data.mjs';
import { marketAmounts, termFacts, loadAllow, allowKind } from './lib/claims-rules.mjs';
import { parsePage, checkPage, checkText } from './lib/page-rules.mjs';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

const USAGE = 'usage: node scripts/audit-rendered.mjs [baseUrl] [--warn-only] [--verbose] [--list] [--concurrency N]';
const die = (msg, code = 2) => { console.error(`audit-rendered: ${msg}\n${USAGE}`); process.exit(code); };

let baseArg = 'http://localhost:3000';
let warnOnly = false;
let verbose = false;
let list = false;
let concurrency = 4;
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '-h' || a === '--help') { console.log(USAGE); process.exit(0); }
  else if (a === '--warn-only') warnOnly = true;
  else if (a === '--verbose') verbose = true;
  else if (a === '--list') list = true;
  else if (a === '--concurrency') concurrency = Math.max(1, Math.min(8, Number(argv[++i]) || 4));
  else if (a.startsWith('-')) die(`unknown option ${a}`);
  else baseArg = a;
}

let BASE;
try { BASE = new URL(baseArg).origin; } catch { die(`"${baseArg}" is not a URL`); }
const PROD = 'https://thedevorax.tech';
const MAX_PAGES = 400;

/* ── inputs, read from the data files ── */
const ENGAGEMENT = extract('src/data/projectIndex.ts', 'PROJECT_ENGAGEMENT');
const engagementOf = (id) => ENGAGEMENT[Number(id)] ?? 'unstated';
const projectNames = (() => {
  const names = new Map();
  try { for (const [id, p] of Object.entries(extract('src/data/catalogue.ts', 'CATALOGUE_PROJECTS'))) names.set(Number(id), p.name); } catch { /* names are an aid, not a requirement */ }
  try { for (const [id, n] of Object.entries(extract('src/data/projectIndex.ts', 'PROJECT_NAMES'))) names.set(Number(id), n); } catch { /* same */ }
  return [...names].map(([id, name]) => ({ id, name }));
})();
const { own } = ownPrices();
const market = marketAmounts(extract('src/data/marketPrices.ts', 'MARKET_PRICES'));
const facts = termFacts();
const allow = loadAllow();
const ENTITY_STATEMENT = extract('src/data/brand.ts', 'ENTITY_STATEMENT');
const env = (path) => ({ path, engagementOf, projectNames, own, market, facts, allow: allow.entries });

/* ── fetching ── */
const UA = 'devorax-content-audit/1.0 (+https://thedevorax.tech)';
async function get(url, accept = 'text/html,application/xhtml+xml,text/plain,*/*;q=0.8') {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
    return { status: res.status, type: res.headers.get('content-type') || '', body: await res.text(), url: res.url };
  } catch (e) {
    return { status: 0, type: '', body: '', url, error: e.cause?.code || e.message };
  }
}

/** A URL on this site, as a path, or null for anything else or anything skipped. */
function sitePath(href, from) {
  let u;
  try { u = new URL(href, from); } catch { return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  if (u.origin !== BASE && u.origin !== PROD) return null;
  let p = u.pathname.replace(/\/+$/, '') || '/';
  if (/^\/(?:admin|api)(?:\/|$)/.test(p)) return null;
  if (/\.(?:png|jpe?g|gif|webp|avif|svg|ico|pdf|zip|css|js|map|woff2?|ttf|mp4|webm|xml|rss|json|txt)$/i.test(p)) return null;
  return p;
}

const sitemapPaths = async () => {
  const root = await get(`${BASE}/sitemap.xml`, 'application/xml,text/xml,*/*;q=0.8');
  if (root.status !== 200) die(`${BASE}/sitemap.xml returned ${root.status || root.error}; is the site running?`);
  const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  let urls = [];
  if (/<sitemapindex[\s>]/.test(root.body)) {
    for (const child of locs(root.body)) {
      // Child sitemaps carry production URLs; fetch them from the base.
      const r = await get(`${BASE}${new URL(child).pathname}`, 'application/xml,text/xml,*/*;q=0.8');
      if (r.status === 200) urls.push(...locs(r.body));
      else console.error(`audit-rendered: sitemap ${child} returned ${r.status || r.error}`);
    }
  } else urls = locs(root.body);
  return urls.map((u) => sitePath(u, BASE)).filter(Boolean);
};

/* ── the crawl ── */
const results = new Map(); // path -> { hits, excused, note }
const queue = [];
const queued = new Set();
const enqueue = (p) => { if (p && !queued.has(p) && queued.size < MAX_PAGES) { queued.add(p); queue.push(p); } };

for (const p of await sitemapPaths()) enqueue(p);
enqueue('/');

async function audit(path) {
  const res = await get(`${BASE}${path}`);
  if (res.status !== 200) {
    results.set(path, { hits: [{ level: 'warn', rule: 'fetch', where: 'response', sample: String(res.status || res.error), detail: 'could not be audited: not a 200' }], excused: [] });
    return;
  }
  if (!/html/i.test(res.type)) return;
  // A redirect lands on another page; audit it under its own path, once.
  const finalPath = sitePath(res.url, BASE);
  if (finalPath === null) return; // it redirected off this site; not ours to audit

  if (finalPath !== path) { enqueue(finalPath); return; }
  const page = parsePage(res.body);
  const out = checkPage(page, env(path));
  if (!page.hasMain) out.hits.push({ level: 'warn', rule: 'no-main', where: 'markup', sample: '<main>', detail: 'no <main> element: only the title, description and H1 were read' });
  results.set(path, out);
  for (const m of res.body.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) enqueue(sitePath(m[1], `${BASE}${path}`));
}

async function pool() {
  const workers = Array.from({ length: concurrency }, async () => {
    for (;;) {
      const next = queue.shift();
      if (next === undefined) {
        if (inFlight === 0) return;
        await new Promise((r) => setTimeout(r, 25));
        continue;
      }
      inFlight++;
      try { await audit(next); } finally { inFlight--; }
    }
  });
  await Promise.all(workers);
}
let inFlight = 0;
await pool();
const crawled = results.size;

/* ── the two text surfaces ── */
{
  const llms = await get(`${BASE}/llms.txt`, 'text/plain,text/markdown;q=0.9,*/*;q=0.8');
  if (llms.status === 200) results.set('/llms.txt', checkText(llms.body.split('\n'), env('/llms.txt')));
  else results.set('/llms.txt', { hits: [{ level: 'warn', rule: 'fetch', where: 'response', sample: String(llms.status || llms.error), detail: 'could not be audited: not a 200' }], excused: [] });

  const mf = await get(`${BASE}/manifest.json`, 'application/json,*/*;q=0.8');
  if (mf.status === 200) {
    let out;
    try {
      const json = JSON.parse(mf.body);
      out = checkText([...strings(json)].map(([, t]) => t), env('/manifest.json'));
      if (json.description !== ENTITY_STATEMENT)
        out.hits.push({ level: 'error', rule: 'manifest', where: 'description', sample: String(json.description).slice(0, 80), detail: 'differs from ENTITY_STATEMENT in src/data/brand.ts; copy it word for word' });
    } catch (e) {
      out = { hits: [{ level: 'error', rule: 'manifest', where: 'body', sample: e.message, detail: '/manifest.json does not parse' }], excused: [] };
    }
    results.set('/manifest.json', out);
  } else results.set('/manifest.json', { hits: [{ level: 'warn', rule: 'fetch', where: 'response', sample: String(mf.status || mf.error), detail: 'could not be audited: not a 200' }], excused: [] });
}

/* ── report ── */
let errors = 0, warnings = 0, excusedTotal = 0;
const paths = [...results.keys()].sort();
for (const path of paths) {
  const { hits, excused } = results.get(path);
  excusedTotal += excused.length;
  const shown = hits.filter((h) => verbose || h.level !== 'info');
  for (const h of hits) { if (h.level === 'error') errors++; else if (h.level === 'warn') warnings++; }
  if (!shown.length && !(verbose && excused.length)) continue;
  console.log(`\n${path}`);
  for (const h of shown) {
    const mark = h.level === 'error' ? '✗' : h.level === 'info' ? '·' : '!';
    console.log(`  ${mark} [${h.rule}] ${h.where}: "${String(h.sample).slice(0, 100)}"\n      ${h.detail}`);
  }
  if (verbose) for (const x of excused) console.log(`  · [${x.rule} (excused)] ${x.where}: "${String(x.sample).slice(0, 100)}" — ${x.why}`);
}

// Allow entries for URLs: one that excused nothing on a page this run read is stale.
for (const e of allow.entries) {
  if (allowKind(e) !== 'rendered') continue;
  if (!results.has(e.where)) { console.log(`\n  · [allow-unchecked] ${e.where} was not part of this run; its entry for "${e.sentence}" was not tested`); continue; }
  if (!e.used) { console.log(`\n  ! [allow-stale] scripts/audit-allow.json: no match for "${e.sentence}" (${e.rule}) on ${e.where}; remove the entry`); warnings++; }
  else if (e.approver === 'unreviewed') console.log(`\n  · [allow-unreviewed] ${e.where}: "${e.sentence}" (${e.rule}) still needs the owner's sign-off`);
}
for (const p of allow.problems) { console.log(`  ✗ [allow-file] ${p}`); errors++; }

if (list) console.log(`\nURLs audited:\n${paths.map((p) => `  ${p}`).join('\n')}`);
console.log(`\naudited ${results.size} URL(s) (${crawled} pages, plus /llms.txt and /manifest.json) on ${BASE}: ${errors} error(s), ${warnings} warning(s), ${excusedTotal} excused${warnOnly && errors ? ' (--warn-only: not failing)' : ''}`);
process.exit(errors > 0 && !warnOnly ? 1 : 0);
