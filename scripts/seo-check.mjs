#!/usr/bin/env node
/**
 * SEO and AI-extraction regression check for the rendered site.
 *
 * Exists because the failures that cost search traffic are rarely in a diff
 * anyone reads. One deploy can add `noindex` to every page, drop the canonical
 * from a template, or ship JSON-LD that no longer parses, and nothing in the
 * build notices (guide §13.8). The guide asks for a check that fails when a key
 * template loses its title, canonical, H1 or schema, or gains noindex. This is
 * that check, run over every URL the sitemap publishes rather than a hand-picked
 * list, so a new route is covered the day it ships.
 *
 *   npm run build && npm start             then, in a second terminal:
 *   npm run check:seo                      checks http://localhost:3000
 *   node scripts/seo-check.mjs https://thedevorax.tech --json /tmp/seo.json
 *
 * It reads raw HTML and executes no JavaScript, because that is what the AI
 * crawlers get: OAI-SearchBot, Claude-SearchBot and PerplexityBot do not render.
 * The word count inside <main> stands in for the extraction test in guide
 * §9.2.2: pipelines keep <main> and drop navigation, so a page whose prose is
 * not in <main> in the server HTML gives them nothing to cite.
 *
 * Requests send OAI-SearchBot's user agent on purpose. Next 16 writes metadata
 * into <head> before streaming only for user agents on its own bot list, and
 * OAI-SearchBot is not on it: on a dynamic route its title and canonical can
 * arrive in <body>. This sees what that crawler is actually served.
 *
 * Sitemap URLs are production URLs. They are fetched from the base you pass, but
 * canonicals are compared against production, because that is what they must
 * name in every environment. Set SEO_CHECK_PROD to check another origin.
 *
 * Exit code 1 if anything at error level was found, so CI can gate on it.
 * Warnings are reported and never fail the run. No dependencies: Node 20+.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const USAGE = 'usage: node scripts/seo-check.mjs [baseUrl] [--json out.json]';

const die = (msg) => {
  console.error(`seo-check: ${msg}\n${USAGE}`);
  process.exit(2);
};

let baseArg = 'http://localhost:3000';
let jsonOut = null;
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '-h' || a === '--help') {
    console.log(USAGE);
    process.exit(0);
  } else if (a === '--json') {
    jsonOut = argv[++i];
    if (!jsonOut) die('--json needs a file path');
  } else if (a.startsWith('--json=')) {
    jsonOut = a.slice('--json='.length);
  } else if (a.startsWith('-')) {
    die(`unknown option ${a}`);
  } else {
    baseArg = a;
  }
}

const originOf = (value, what) => {
  try {
    const u = new URL(value);
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.origin;
  } catch {
    /* fall through to the error below */
  }
  return die(`${what} is not an http(s) URL: ${value}`);
};

const BASE = originOf(baseArg, 'base URL');
const PROD = originOf(process.env.SEO_CHECK_PROD || 'https://thedevorax.tech', 'SEO_CHECK_PROD');

const UA = 'Mozilla/5.0 (compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot)';
const TIMEOUT_MS = 20_000;
const CONCURRENCY = 4;

// Guide §3.2.1 and §3.2.2. The hard title bounds match the guide's own §13.8
// test; between them and the soft bounds, a title still works but gets cut or
// reads thin in results.
const TITLE_HARD = [10, 70];
const TITLE_SOFT = [30, 65];
const DESCRIPTION_SOFT = [70, 160];
const THIN_MAIN_WORDS = 150;

/* ───────────────────────────── fetching ───────────────────────────── */

let requestCount = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * GET with redirects left alone. A sitemap URL that redirects is itself the
 * bug, and following it would report the destination's health instead.
 * Retries once, and only on network failure: a 404 or 500 is an answer.
 */
async function get(url, accept = '*/*') {
  let error;
  for (let attempt = 1; attempt <= 2; attempt++) {
    requestCount++;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    const started = Date.now();
    try {
      const res = await fetch(url, {
        redirect: 'manual',
        signal: ctl.signal,
        headers: { 'user-agent': UA, accept },
      });
      // Read the body under the same timer: a server can stall mid-stream.
      const body = await res.text();
      return {
        url,
        status: res.status,
        contentType: res.headers.get('content-type') || '',
        location: res.headers.get('location'),
        xRobotsTag: res.headers.get('x-robots-tag'),
        body,
        ms: Date.now() - started,
      };
    } catch (err) {
      error =
        err.name === 'AbortError'
          ? `timed out after ${TIMEOUT_MS / 1000} s`
          : err.cause?.code || err.cause?.message || err.message;
    } finally {
      clearTimeout(timer);
    }
    if (attempt === 1) await sleep(1000);
  }
  return { url, status: 0, error, contentType: '', location: null, xRobotsTag: null, body: '' };
}

const describe = (res) => {
  if (res.status === 0) return res.error?.startsWith('timed out') ? res.error : `network error (${res.error})`;
  const type = res.contentType ? ` ${res.contentType.split(';')[0]}` : '';
  if (res.status >= 300 && res.status < 400) return `HTTP ${res.status} → ${res.location ?? '(no Location)'}`;
  return `HTTP ${res.status}${type}`;
};

/** Run `fn` over `items`, at most `limit` at a time, keeping input order. */
async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    })
  );
  return out;
}

/** Same path and query, served from the base under test. */
const toBase = (url) => {
  const u = new URL(url);
  return new URL(u.pathname + u.search, BASE).href;
};

/** Same path and query, on production: what a canonical has to name. */
const toProd = (url) => {
  const u = new URL(url);
  return new URL(u.pathname + u.search, PROD).href;
};

/** Normalised for comparison: "https://x.tech" and "https://x.tech/" are one URL. */
const normalize = (url) => {
  try {
    const u = new URL(url);
    u.hash = '';
    return u.href;
  } catch {
    return null;
  }
};

const pathOf = (url) => {
  const u = new URL(url);
  return u.pathname + u.search;
};

/* ─────────────────────────── problem records ─────────────────────────── */

/**
 * `items` carries the full list for --json; the console shows the message,
 * which names the first few.
 */
const add = (target, level, code, message, items) =>
  target.problems.push(items ? { level, code, message, items } : { level, code, message });

const listSome = (items, n = 3) =>
  items.length <= n ? items.join(', ') : `${items.slice(0, n).join(', ')} and ${items.length - n} more`;

const clip = (s, n = 60) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const count = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The response fields worth keeping in the results, and that `describe` reads. */
const meta = (res) => ({ url: res.url, status: res.status, contentType: res.contentType, location: res.location, error: res.error });

/* ─────────────────────────────── text ─────────────────────────────── */

// React escapes only & < > " ' in markup. The rest are here because copy
// pasted into data files, and old static markup, carry them.
const NAMED_ENTITIES = new Map(
  Object.entries({
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
    ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“',
    rdquo: '”', laquo: '«', raquo: '»', middot: '·', bull: '•', copy: '©',
    reg: '®', trade: '™', times: '×', rarr: '→', larr: '←', deg: '°',
    euro: '€', pound: '£', shy: '\u00ad', zwj: '\u200d', zwnj: '\u200c',
  })
);

function decodeEntities(s) {
  if (!s.includes('&')) return s;
  return s.replace(
    /&(?:#(\d{1,7})|#[xX]([0-9a-fA-F]{1,6})|([A-Za-z][A-Za-z0-9]{1,31}));?/g,
    (m, dec, hex, name) => {
      if (name) return m.endsWith(';') && NAMED_ENTITIES.has(name) ? NAMED_ENTITIES.get(name) : m;
      const cp = dec ? Number.parseInt(dec, 10) : Number.parseInt(hex, 16);
      const valid = cp > 0 && cp <= 0x10ffff && !(cp >= 0xd800 && cp <= 0xdfff);
      return valid ? String.fromCodePoint(cp) : '\ufffd';
    }
  );
}

const collapse = (s) => s.replace(/\s+/g, ' ').trim();
const charLength = (s) => [...s].length;
const countWords = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/**
 * For "does this text appear on the page": entities decoded, typographic quotes
 * folded, whitespace collapsed, case ignored. A curly apostrophe in the schema
 * and a straight one on the page is not the misrepresentation §7.1.9 is about.
 */
const comparable = (s) =>
  collapse(
    decodeEntities(String(s))
      .normalize('NFKC')
      .replace(/[\u2018\u2019\u201b\u2032]/g, "'")
      .replace(/[\u201c\u201d\u2033]/g, '"')
  ).toLowerCase();

/* ────────────────────────────── HTML ────────────────────────────── */

/*
 * A small tokenizer rather than regexes over the whole document, for one reason
 * above all: every Next.js page repeats its markup inside the React Server
 * Components payload, an inline <script> full of escaped JSX. A regex for
 * `application/ld+json` finds every JSON-LD block twice, and one for `<h1`
 * can match inside a string. Script contents have to be skipped, which means
 * knowing where each script ends.
 */

// Elements whose content is never markup. noscript is among them because that
// is how a browser with scripting on parses it, and Google renders with
// scripting on; read as markup, the tracking pixel <img> inside one would be
// reported as a page image without alt text.
const RAW_TEXT = new Set(['script', 'style', 'noscript', 'iframe', 'noembed', 'noframes', 'xmp']);
// Elements whose content is text with entities, never tags.
const RCDATA = new Set(['title', 'textarea']);
const HEADING = /^h([1-6])$/;

const TAG_OPEN = /<([a-zA-Z][^\s/>]*)/y;
const TAG_CLOSE = /<\/([a-zA-Z][^\s/>]*)[^>]*>/y;
const ATTRIBUTE = /([^\s"'>/=][^\s"'>/=]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*)))?/y;
const closers = new Map();

function readStartTag(html, at) {
  TAG_OPEN.lastIndex = at;
  const m = TAG_OPEN.exec(html);
  if (!m) return null;
  const attrs = Object.create(null);
  let i = TAG_OPEN.lastIndex;
  let selfClosing = false;
  while (i < html.length) {
    const ch = html[i];
    if (ch === '>') {
      i++;
      break;
    }
    if (ch === '/') {
      if (html[i + 1] === '>') {
        selfClosing = true;
        i += 2;
        break;
      }
      i++;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    ATTRIBUTE.lastIndex = i;
    const a = ATTRIBUTE.exec(html);
    if (!a) {
      i++;
      continue;
    }
    const key = a[1].toLowerCase();
    // The first occurrence wins, as in a browser.
    if (!(key in attrs)) attrs[key] = decodeEntities(a[2] ?? a[3] ?? a[4] ?? '');
    i = ATTRIBUTE.lastIndex;
  }
  return { name: m[1].toLowerCase(), attrs, selfClosing, end: i };
}

/** Where raw content ends (`</name`) and where parsing resumes. */
function findClose(html, name, from) {
  let re = closers.get(name);
  if (!re) closers.set(name, (re = new RegExp(`</${name}[\\s/>]`, 'ig')));
  re.lastIndex = from;
  const m = re.exec(html);
  if (!m) return { contentEnd: html.length, next: html.length };
  const gt = html.indexOf('>', m.index);
  return { contentEnd: m.index, next: gt === -1 ? html.length : gt + 1 };
}

/**
 * One pass over the document, collecting what the checks need. Text inside
 * <svg> (icon titles) and <template> (inert, never rendered) is not page copy.
 *
 * Every tag boundary counts as whitespace, inline tags included. The site sets
 * stack chips side by side with nothing between them
 * (`<span>React</span><span>Next.js</span>`), which a browser shows as two
 * words; joining inline tags merged a whole row of chips into one. The price is
 * that "Devora<span>X</span>" counts as two words, which is noise at this
 * scale, and the FAQ comparison ignores whitespace for exactly this reason.
 */
function parseHtml(html) {
  const doc = { titles: [], metas: [], links: [], headings: [], mains: [], images: [], jsonld: [] };
  const text = [];
  const mainText = [];
  let mainDepth = 0;
  let svgDepth = 0;
  let templateDepth = 0;
  let inHead = false;
  let heading = null;

  const hidden = () => svgDepth > 0 || templateDepth > 0;
  const emit = (s) => {
    text.push(s);
    if (mainDepth) mainText.push(s);
    if (heading) heading.parts.push(s);
  };
  const closeHeading = () => {
    if (!heading) return;
    heading.text = collapse(heading.parts.join(''));
    delete heading.parts;
    heading = null;
  };

  let i = 0;
  const n = html.length;
  while (i < n) {
    const lt = html.indexOf('<', i);
    const stop = lt === -1 ? n : lt;
    if (stop > i && !hidden()) emit(decodeEntities(html.slice(i, stop)));
    if (lt === -1) break;
    i = lt;
    const next = html[i + 1];

    // Comments are not word boundaries: React writes `<!-- -->` between two
    // adjacent text nodes of the same sentence.
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i + 4);
      i = end === -1 ? n : end + 3;
      continue;
    }
    if (next === '!' || next === '?') {
      const cdata = html.startsWith('<![CDATA[', i);
      const end = html.indexOf(cdata ? ']]>' : '>', i);
      i = end === -1 ? n : end + (cdata ? 3 : 1);
      continue;
    }

    if (next === '/') {
      TAG_CLOSE.lastIndex = i;
      const m = TAG_CLOSE.exec(html);
      if (!m) {
        if (!hidden()) emit('<');
        i++;
        continue;
      }
      i = TAG_CLOSE.lastIndex;
      const name = m[1].toLowerCase();
      if (templateDepth) {
        if (name === 'template') templateDepth--;
        continue;
      }
      if (name === 'svg' || name === 'math') {
        svgDepth = Math.max(0, svgDepth - 1);
        continue;
      }
      if (svgDepth) continue;
      emit(' ');
      if (name === 'head') inHead = false;
      else if (name === 'main') mainDepth = Math.max(0, mainDepth - 1);
      else if (HEADING.test(name)) closeHeading();
      continue;
    }

    const tag = readStartTag(html, i);
    if (!tag) {
      // A bare "<" in text.
      if (!hidden()) emit('<');
      i++;
      continue;
    }
    i = tag.end;
    const { name, attrs } = tag;

    if (RAW_TEXT.has(name)) {
      const { contentEnd, next: resume } = findClose(html, name, i);
      const isJsonLd =
        name === 'script' && (attrs.type || '').trim().toLowerCase() === 'application/ld+json';
      if (isJsonLd && !templateDepth) doc.jsonld.push(html.slice(i, contentEnd));
      i = resume;
      continue;
    }
    if (RCDATA.has(name)) {
      const { contentEnd, next: resume } = findClose(html, name, i);
      const content = decodeEntities(html.slice(i, contentEnd));
      i = resume;
      if (hidden()) continue;
      // An SVG <title> is an icon's label. Only a document title counts.
      if (name === 'title') doc.titles.push({ text: collapse(content), inHead });
      else emit(` ${content} `);
      continue;
    }

    if (templateDepth) {
      if (name === 'template' && !tag.selfClosing) templateDepth++;
      continue;
    }
    if (name === 'template') {
      if (!tag.selfClosing) templateDepth++;
      continue;
    }
    if (name === 'svg' || name === 'math') {
      if (!tag.selfClosing) svgDepth++;
      continue;
    }
    if (svgDepth) continue;

    emit(' ');
    if (name === 'head') inHead = true;
    else if (name === 'body') inHead = false;
    else if (name === 'main') {
      doc.mains.push(attrs);
      if (!tag.selfClosing) mainDepth++;
    } else if (HEADING.test(name)) {
      closeHeading();
      heading = { level: Number(name[1]), parts: [] };
      doc.headings.push(heading);
    } else if (name === 'meta') doc.metas.push({ attrs, inHead });
    else if (name === 'link') doc.links.push({ attrs, inHead });
    else if (name === 'img') doc.images.push(attrs);
  }
  closeHeading();

  doc.text = collapse(text.join(''));
  doc.mainText = collapse(mainText.join(''));
  return doc;
}

const relTokens = (rel) => (rel || '').toLowerCase().split(/\s+/).filter(Boolean);

/**
 * "noindex, nofollow", "max-snippet:0", and in X-Robots-Tag a user-agent
 * prefix ("googlebot: noindex") that scopes what follows. All of them count:
 * a noindex aimed at one crawler still removes the page from that engine.
 */
const VALUED_DIRECTIVES = new Set(['max-snippet', 'max-image-preview', 'max-video-preview', 'unavailable_after']);
function robotsDirectives(value) {
  const out = [];
  for (let part of String(value).split(',')) {
    part = part.trim().toLowerCase();
    const scoped = /^([a-z0-9_.-]+)\s*:\s*(.*)$/.exec(part);
    if (scoped && !VALUED_DIRECTIVES.has(scoped[1])) part = scoped[2].trim();
    if (part) out.push(part.replace(/\s*:\s*/, ':'));
  }
  return out;
}

function checkRobotsDirectives(r, value, where) {
  const directives = robotsDirectives(value);
  const blocking = directives.filter((d) => d === 'noindex' || d === 'none' || d === 'nosnippet');
  if (blocking.length) add(r, 'error', 'noindex', `${blocking.join(', ')} in ${where}`);
  if (directives.some((d) => /^max-snippet:0+$/.test(d)))
    add(r, 'warn', 'max-snippet', `max-snippet:0 in ${where}: no text can be quoted from the page`);
}

/* ─────────────────────────────── JSON-LD ─────────────────────────────── */

/** "https://schema.org/Review" and "schema:Review" are both "Review". */
const typesOf = (node) =>
  node && typeof node === 'object' && node['@type'] != null
    ? [].concat(node['@type']).map((t) => String(t).replace(/^.*[/:#]/, ''))
    : [];

const isReference = (v) =>
  v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 1 && typeof v['@id'] === 'string';

// Review markup about yourself is what Google's review-snippet policy calls
// self-serving: it earns no stars and invites a manual action. ClaimReview is a
// fact-check, a different thing.
const isReviewType = (t) => t !== 'ClaimReview' && /(?:Review|AggregateRating)$/.test(t);

function checkJsonLd(r, doc, pageUrl) {
  const info = { blocks: doc.jsonld.length, nodes: [], faqQuestions: [] };
  r.jsonld = info;
  if (!doc.jsonld.length) {
    add(r, 'error', 'jsonld-missing', 'no application/ld+json block');
    return;
  }
  const parsed = [];
  doc.jsonld.forEach((raw, k) => {
    try {
      parsed.push(JSON.parse(raw));
    } catch (err) {
      add(r, 'error', 'jsonld-parse', `block ${k + 1} of ${doc.jsonld.length} does not parse: ${err.message}`);
    }
  });
  // The root layout emits the site-wide graph (WebSite + Organization) as its
  // own block and each page adds one graph of its own, so two blocks is the
  // design. Only a second *page* block is worth a warning.
  const isSiteBlock = (j) => {
    const nodes = Array.isArray(j?.['@graph']) ? j['@graph'] : [j];
    return nodes.length > 0 && nodes.every((n) => /\/#(?:website|organization)$/.test(String(n?.['@id'] ?? '')));
  };
  const pageBlocks = parsed.filter((j) => !isSiteBlock(j)).length + (doc.jsonld.length - parsed.length);
  if (pageBlocks > 1)
    add(r, 'warn', 'jsonld-blocks', `${pageBlocks} JSON-LD blocks besides the site-wide one; guide §7.1.9 wants one @graph per page`);
  // Nothing parsed: every check below would only restate the parse error.
  if (!parsed.length) return;

  // A node is anything carrying @id plus something else, wherever it sits:
  // inside @graph, a top-level array, or nested as a property value (the
  // founder Person inside the Organization). A bare {"@id"} is a reference.
  const defined = new Map();
  const references = new Set();
  const objects = [];
  const walk = (v) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (!v || typeof v !== 'object') return;
    objects.push(v);
    if (typeof v['@id'] === 'string') {
      if (isReference(v)) references.add(v['@id']);
      else {
        if (!defined.has(v['@id'])) defined.set(v['@id'], []);
        defined.get(v['@id']).push(v);
      }
    }
    for (const [k, child] of Object.entries(v)) if (k !== '@id') walk(child);
  };
  parsed.forEach(walk);

  info.nodes = [...defined].map(([id, nodes]) => ({
    id,
    type: [...new Set(nodes.flatMap(typesOf))].join(', ') || null,
  }));

  if (![...defined.keys()].some((id) => id.endsWith('/#organization')))
    add(r, 'error', 'org-missing', 'no Organization node with an @id ending "/#organization"');

  // The same @id is one entity, and JSON-LD merges every definition of it.
  // Two definitions that type it differently ("Person" here, "Organization"
  // there) make the merged entity both: an error. One that restates it with
  // fewer of the same types (the Organization repeated inline as a publisher)
  // adds no new claim, but it is a second copy that can drift from the first,
  // and a reference by @id is what the guide asks for: a warning.
  for (const [id, nodes] of defined) {
    const variants = [
      ...new Map(
        nodes
          .filter((n) => n['@type'] != null)
          .map((n) => {
            const types = [...new Set(typesOf(n))].sort();
            return [types.join(' + '), types];
          })
      ).values(),
    ];
    if (variants.length < 2) continue;
    const label = (types) => types.join(' + ');
    const widest = variants.reduce((a, b) => (b.length > a.length ? b : a));
    const nested = variants.every((types) => types.every((t) => widest.includes(t)));
    const short = id.replace(PROD, '');
    if (nested)
      add(r, 'warn', 'type-restated', `${short} is defined as ${label(widest)} and restated as ${variants.filter((v) => v !== widest).map(label).join(' and as ')}; reference it by @id instead`);
    else add(r, 'error', 'type-conflict', `${short} is defined as ${variants.map(label).join(' and as ')}`);
  }

  // A reference to a node this page never defines points at nothing on this
  // page. If the id lives under another path (the founder's Person node on
  // /team), engines may join it up from that page, so it is only a warning.
  const pagePath = new URL(pageUrl).pathname;
  const unresolved = [];
  const crossPage = [];
  for (const id of references) {
    if (defined.has(id)) continue;
    let u;
    try {
      u = new URL(id);
    } catch {
      continue;
    }
    if (u.origin !== PROD) continue;
    (u.pathname === pagePath ? unresolved : crossPage).push(id.replace(PROD, ''));
  }
  if (unresolved.length)
    add(r, 'error', 'ref-unresolved', `@id reference to a node not defined on this page: ${listSome(unresolved)}`, unresolved);
  if (crossPage.length)
    add(r, 'warn', 'ref-cross-page', `@id reference to a node defined on another page: ${listSome(crossPage)}`, crossPage);

  // Structured data must describe what the visitor can see (guide §7.1.9).
  // An FAQ whose questions are not on the page is the misrepresentation case.
  const visible = comparable(doc.text);
  const visibleTight = visible.replace(/ /g, '');
  const questions = new Set();
  for (const node of objects) {
    if (!typesOf(node).includes('FAQPage')) continue;
    for (let q of [].concat(node.mainEntity ?? [])) {
      if (isReference(q)) q = defined.get(q['@id'])?.[0] ?? q;
      if (typesOf(q).includes('Question') && typeof q.name === 'string') questions.add(q.name);
    }
  }
  info.faqQuestions = [...questions];
  const missing = info.faqQuestions
    .filter((name) => {
      const needle = comparable(name);
      // Without whitespace too: a tag boundary inside the question on the page
      // ("What is <em>X</em>?") can add or drop a space without changing it.
      return !visible.includes(needle) && !visibleTight.includes(needle.replace(/ /g, ''));
    })
    .map((name) => `"${clip(collapse(name))}"`);
  if (missing.length)
    add(r, 'error', 'faq-mismatch', `FAQPage question not in the visible text: ${listSome(missing, 2)}`, missing);

  const reviews = new Set();
  for (const node of objects) {
    for (const t of typesOf(node)) if (isReviewType(t)) reviews.add(t);
    for (const k of ['review', 'reviews', 'aggregateRating']) if (k in node) reviews.add(k);
  }
  if (reviews.size)
    add(r, 'error', 'review-markup', `self-serving review markup (${[...reviews].join(', ')}); Google ignores it for a business's own pages and may penalise it`);
}

/* ─────────────────────────────── pages ─────────────────────────────── */

async function checkPage(page) {
  const res = await get(page.fetchUrl, 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8');
  const r = { url: page.url, path: page.path, fetched: page.fetchUrl, status: res.status, ms: res.ms ?? null, problems: [] };
  if (res.status !== 200) {
    add(r, 'error', 'status', `expected 200, got ${describe(res)}`);
    return r;
  }
  // A PDF or JSON file in the sitemap would otherwise fail every check below
  // and bury the one thing wrong with it.
  if (!/^(?:text\/html|application\/xhtml\+xml)\b/i.test(res.contentType)) {
    add(r, 'error', 'status', `expected an HTML page, got ${describe(res)}`);
    return r;
  }
  const doc = parseHtml(res.body);

  // <title>
  r.title = doc.titles[0]?.text ?? null;
  if (doc.titles.length !== 1) add(r, 'error', 'title-count', `${doc.titles.length} <title> elements, expected 1`);
  if (r.title != null) {
    const len = (r.titleLength = charLength(r.title));
    if (len < TITLE_HARD[0] || len > TITLE_HARD[1])
      add(r, 'error', 'title-length', `title is ${len} characters, outside ${TITLE_HARD.join('-')}: "${r.title}"`);
    else if (len < TITLE_SOFT[0] || len > TITLE_SOFT[1])
      add(r, 'warn', 'title-length', `title is ${len} characters, outside ${TITLE_SOFT.join('-')}: "${r.title}"`);
  }

  // meta description
  const descriptions = doc.metas.filter((m) => (m.attrs.name || '').trim().toLowerCase() === 'description');
  if (descriptions.length !== 1)
    add(r, 'error', 'description-count', `${descriptions.length} meta descriptions, expected 1`);
  if (descriptions.length) {
    r.description = collapse(descriptions[0].attrs.content || '');
    const len = (r.descriptionLength = charLength(r.description));
    if (len < DESCRIPTION_SOFT[0] || len > DESCRIPTION_SOFT[1])
      add(r, 'warn', 'description-length', `meta description is ${len} characters, outside ${DESCRIPTION_SOFT.join('-')}`);
  }

  // canonical: one, naming this page's production URL exactly. Resolved and
  // normalised, so "https://x.tech" and "https://x.tech/" compare equal, while
  // a trailing-slash or http:// mismatch on a deeper path still fails.
  const canonicals = doc.links.filter((l) => relTokens(l.attrs.rel).includes('canonical'));
  r.canonical = canonicals.map((l) => l.attrs.href ?? null);
  if (canonicals.length !== 1) {
    add(r, 'error', 'canonical', `${canonicals.length} <link rel="canonical"> elements, expected 1`);
  } else {
    const href = (canonicals[0].attrs.href ?? '').trim();
    let resolved = null;
    try {
      // An empty href would resolve to the page itself and pass, but it names
      // nothing: search engines discard it.
      if (href) resolved = new URL(href, page.url).href;
    } catch {
      /* reported below */
    }
    if (resolved !== page.url) add(r, 'error', 'canonical', `canonical is "${href}", expected ${page.url}`);
  }

  // indexing directives, in markup and in the header
  const robotMetas = doc.metas.filter((m) => ['robots', 'googlebot'].includes((m.attrs.name || '').trim().toLowerCase()));
  r.robots = robotMetas.map((m) => `${m.attrs.name}: ${m.attrs.content ?? ''}`);
  for (const m of robotMetas)
    checkRobotsDirectives(r, m.attrs.content ?? '', `<meta name="${m.attrs.name}" content="${m.attrs.content ?? ''}">`);
  if (res.xRobotsTag) {
    r.xRobotsTag = res.xRobotsTag;
    checkRobotsDirectives(r, res.xRobotsTag, `X-Robots-Tag: ${res.xRobotsTag}`);
  }

  // Metadata that arrives after <body> opens. Google ignores a canonical in
  // the body, and a crawler that reads only <head> misses all of it. Next
  // streams metadata this way to user agents outside its bot list on dynamic
  // routes, and the user agent here is one of those.
  const late = [
    doc.titles.some((t) => !t.inHead) && '<title>',
    descriptions.some((m) => !m.inHead) && 'meta description',
    canonicals.some((l) => !l.inHead) && 'canonical',
    robotMetas.some((m) => !m.inHead) && 'robots meta',
  ].filter(Boolean);
  if (late.length) add(r, 'warn', 'head-metadata', `${late.join(', ')} outside <head>`);

  // headings
  r.headings = doc.headings.map((h) => `h${h.level} ${clip(h.text, 80)}`);
  const h1s = doc.headings.filter((h) => h.level === 1);
  r.h1 = h1s.map((h) => h.text);
  if (h1s.length !== 1)
    add(r, 'error', 'h1-count', `${h1s.length} <h1> elements, expected 1${h1s.length > 1 ? `: ${listSome(h1s.map((h) => `"${clip(h.text, 40)}"`))}` : ''}`);
  // Going down more than one level at a time (h2 → h4) breaks the outline
  // screen readers and passage extractors navigate by. Going back up is fine.
  const skips = [];
  for (let k = 1; k < doc.headings.length; k++) {
    const [prev, cur] = [doc.headings[k - 1], doc.headings[k]];
    if (cur.level > prev.level + 1) skips.push(`h${prev.level}→h${cur.level} "${clip(cur.text, 40)}"`);
  }
  if (skips.length) add(r, 'warn', 'heading-skip', `heading levels skip: ${listSome(skips)}`, skips);

  // <main>: the landmark extractors keep, and the skip link's target.
  r.mainCount = doc.mains.length;
  if (doc.mains.length !== 1) add(r, 'error', 'main-count', `${doc.mains.length} <main> elements, expected 1`);
  if (!doc.mains.some((a) => a.id === 'main-content')) {
    const ids = doc.mains.map((a) => a.id).filter(Boolean);
    add(r, 'warn', 'main-id', doc.mains.length
      ? `<main> has ${ids.length ? `id="${ids.join('", "')}"` : 'no id'}, expected id="main-content" (the skip link's target)`
      : 'no <main id="main-content"> for the skip link to land on');
  }

  // What a non-rendering extractor keeps (guide §9.2.2).
  r.words = doc.mains.length ? countWords(doc.mainText) : null;
  r.bodyWords = countWords(doc.text);
  if (r.words != null && r.words < THIN_MAIN_WORDS)
    add(r, 'warn', 'thin-main', `${r.words} words inside <main>; extractors keep <main>, and under ${THIN_MAIN_WORDS} gives them little to cite`);

  // images
  const shortSrc = (src = '') => {
    const optimised = /\/_next\/image\?(?:.*&)?url=([^&]+)/.exec(src);
    const target = optimised ? decodeURIComponent(optimised[1]) : src;
    return clip(target.replace(/^https?:\/\/[^/]+/, '').split('?')[0] || '(no src)', 50);
  };
  r.images = doc.images.length;
  const noAlt = doc.images.filter((a) => !('alt' in a)).map((a) => shortSrc(a.src));
  if (noAlt.length) add(r, 'error', 'img-alt', `${noAlt.length} <img> without an alt attribute: ${listSome(noAlt)}`, noAlt);
  // next/image's `fill` sizes the image from its parent, so it has no
  // width/height by design. Anything else without both shifts layout as it loads.
  const noSize = doc.images
    .filter((a) => a['data-nimg'] !== 'fill' && (!a.width || !a.height))
    .map((a) => shortSrc(a.src));
  if (noSize.length) add(r, 'warn', 'img-size', `${noSize.length} <img> without width and height: ${listSome(noSize)}`, noSize);

  checkJsonLd(r, doc, page.url);

  const hreflang = doc.links.filter((l) => relTokens(l.attrs.rel).includes('alternate') && 'hreflang' in l.attrs);
  if (hreflang.length)
    add(r, 'warn', 'hreflang', `${hreflang.length} hreflang alternates (${listSome(hreflang.map((l) => l.attrs.hreflang))}); the site is single-language by decision`);

  return r;
}

/* ──────────────────────────── robots.txt ──────────────────────────── */

/**
 * Groups per RFC 9309: consecutive User-agent lines open one group, and the
 * group runs until a User-agent line follows a rule. Every group naming an
 * agent applies to it, so the `*` rules are merged across groups.
 */
function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let current = null;
  for (const raw of text.split(/\r\n|\r|\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === 'user-agent') {
      if (!current || current.closed) groups.push((current = { agents: [], rules: [], closed: false }));
      current.agents.push(value);
    } else if (key === 'allow' || key === 'disallow') {
      if (!current) continue; // a rule before any User-agent belongs to nobody
      current.rules.push({ type: key, path: value });
      current.closed = true;
    } else if (key === 'crawl-delay') {
      if (current) current.closed = true;
    } else if (key === 'sitemap') {
      sitemaps.push(value);
    }
  }
  return { groups: groups.map(({ agents, rules }) => ({ agents, rules })), sitemaps };
}

/** Google's matching: `*` wildcards, `$` anchors, longest match wins, Allow wins a tie. */
function robotsVerdict(rules, path) {
  let best = null;
  for (const rule of rules) {
    if (!rule.path) continue; // "Disallow:" with no path allows everything
    const anchored = rule.path.endsWith('$');
    const body = anchored ? rule.path.slice(0, -1) : rule.path;
    const pattern = body.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    if (!new RegExp(`^${pattern}${anchored ? '$' : ''}`).test(path)) continue;
    if (!best || rule.path.length > best.path.length || (rule.path.length === best.path.length && rule.type === 'allow'))
      best = rule;
  }
  return best;
}

async function checkRobots() {
  const res = await get(`${BASE}/robots.txt`, 'text/plain,*/*;q=0.8');
  const r = { ...meta(res), groups: [], sitemaps: [], problems: [], info: [] };
  if (res.status !== 200 || !/^text\/plain\b/i.test(res.contentType))
    add(r, 'error', 'robots-fetch', `expected 200 text/plain, got ${describe(res)}`);
  if (res.status !== 200) return r;

  const { groups, sitemaps } = parseRobots(res.body);
  Object.assign(r, { groups, sitemaps });

  const expected = `${PROD}/sitemap.xml`;
  if (!sitemaps.includes(expected)) add(r, 'error', 'robots-sitemap', `no "Sitemap: ${expected}" line`);

  const star = groups.filter((g) => g.agents.includes('*')).flatMap((g) => g.rules);
  if (!groups.some((g) => g.agents.includes('*'))) r.info.push('no User-agent: * group');
  if (star.some((rule) => rule.type === 'disallow' && rule.path === '/'))
    add(r, 'error', 'robots-disallow-all', 'User-agent: * has "Disallow: /", which blocks every crawler without its own group');
  // Googlebot renders with the CSS and JS under /_next/. Blocked, it sees an
  // unstyled shell and can judge the page unusable on mobile.
  for (const asset of ['/_next/static/chunks/main.js', '/_next/static/css/app.css', '/_next/image?url=%2Fx.png&w=640&q=75']) {
    const rule = robotsVerdict(star, asset);
    if (rule?.type === 'disallow') {
      add(r, 'error', 'robots-next', `User-agent: * blocks ${asset.split('?')[0]} via "Disallow: ${rule.path}"; Googlebot needs /_next/ to render`);
      break;
    }
  }

  for (const g of groups) {
    const rules = g.rules.length ? g.rules.map((x) => `${x.type === 'allow' ? 'Allow' : 'Disallow'}: ${x.path || '(empty)'}`).join(' · ') : '(no rules)';
    r.info.push(`User-agent: ${g.agents.join(', ')} → ${rules}`);
  }
  return r;
}

/* ───────────────────────────── sitemaps ───────────────────────────── */

const xmlText = (s) => decodeEntities(s.trim().replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1')).trim();

// W3C Datetime, the only format the sitemap protocol accepts: a date, or a
// date and time with a zone. "2026-10-08 12:00" or "Oct 8, 2026" are not it.
const W3C_DATETIME = /^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?)?)?$/;

function lastmodProblem(value) {
  const m = W3C_DATETIME.exec(value);
  if (!m) return 'is not a W3C datetime';
  const [, y, mo = '01', d = '01', h = '00', mi = '00', s = '00'] = m;
  const probe = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
  // Round-trip, because Date.UTC quietly turns 2026-02-30 into 2 March.
  if (probe.getUTCMonth() !== +mo - 1 || probe.getUTCDate() !== +d || +h > 23 || +mi > 59 || +s > 59)
    return 'is not a real date';
  const when = Date.parse(m[4] ? value : `${y}-${mo}-${d}T00:00:00Z`);
  // A bare date is midnight UTC but may be "today" somewhere ahead of UTC; a
  // full timestamp only gets slack for clock drift between hosts.
  const slack = m[4] ? 10 * 60_000 : 14 * 3_600_000;
  if (when > Date.now() + slack) return 'is in the future';
  return null;
}

async function fetchSitemap(url, out) {
  const res = await get(url, 'application/xml,text/xml;q=0.9,*/*;q=0.8');
  const file = { ...meta(res), kind: null, entries: 0 };
  out.files.push(file);
  if (res.status !== 200 || !/xml/i.test(res.contentType))
    add(out, 'error', 'sitemap-fetch', `${pathOf(url)}: expected 200 with an XML content type, got ${describe(res)}`);
  if (res.status !== 200) return null;

  const xml = res.body.replace(/<!--[\s\S]*?-->/g, '');
  file.kind = /<sitemapindex[\s>]/.test(xml) ? 'sitemapindex' : /<urlset[\s>]/.test(xml) ? 'urlset' : null;
  if (!file.kind) {
    add(out, 'error', 'sitemap-fetch', `${pathOf(url)}: neither <urlset> nor <sitemapindex>`);
    return null;
  }
  // Exact <loc>, never a prefixed one: <image:loc> inside a <url> is an image.
  const block = file.kind === 'sitemapindex' ? /<sitemap\s*>([\s\S]*?)<\/sitemap\s*>/g : /<url\s*>([\s\S]*?)<\/url\s*>/g;
  const entries = [...xml.matchAll(block)].map(([, inner]) => ({
    loc: /<loc\s*>([\s\S]*?)<\/loc\s*>/.exec(inner)?.[1],
    lastmod: /<lastmod\s*>([\s\S]*?)<\/lastmod\s*>/.exec(inner)?.[1],
  })).map((e) => ({ loc: e.loc == null ? null : xmlText(e.loc), lastmod: e.lastmod == null ? null : xmlText(e.lastmod) }));
  file.entries = entries.length;
  return { kind: file.kind, entries, source: pathOf(url) };
}

/** Each <loc>, wherever it is listed, must be an https URL on production. */
function checkLoc(out, entry, source, { allowTrailingSlash = false } = {}) {
  if (!entry.loc) {
    add(out, 'error', 'sitemap-loc', `${source}: an entry has no <loc>`);
    return null;
  }
  let u;
  try {
    u = new URL(entry.loc);
  } catch {
    add(out, 'error', 'sitemap-loc', `${source}: <loc> is not a URL: ${entry.loc}`);
    return null;
  }
  if (u.protocol !== 'https:' || u.origin !== PROD)
    add(out, 'error', 'sitemap-loc', `${source}: ${entry.loc} is not on ${PROD}`);
  if (!allowTrailingSlash && u.pathname !== '/' && u.pathname.endsWith('/'))
    add(out, 'warn', 'sitemap-trailing-slash', `${source}: ${entry.loc} ends in a slash; every other URL on the site does not`);
  if (entry.lastmod != null) {
    const why = lastmodProblem(entry.lastmod);
    if (why) add(out, 'error', 'sitemap-lastmod', `${source}: <lastmod>${entry.lastmod}</lastmod> for ${entry.loc} ${why}`);
  }
  return u;
}

async function checkSitemaps() {
  const out = { files: [], urls: [], problems: [] };
  const root = await fetchSitemap(`${BASE}/sitemap.xml`, out);
  if (!root) return out;

  let urlSets = [root];
  if (root.kind === 'sitemapindex') {
    // Child sitemaps are fetched from the base too: on a preview deployment
    // the production copies would describe the wrong build.
    const children = root.entries.map((e) => checkLoc(out, e, root.source, { allowTrailingSlash: true })).filter(Boolean);
    const fetched = await pool(children, CONCURRENCY, (u) => fetchSitemap(toBase(u.href), out));
    urlSets = [];
    for (const child of fetched.filter(Boolean)) {
      if (child.kind === 'sitemapindex')
        add(out, 'error', 'sitemap-fetch', `${child.source}: a sitemap index inside a sitemap index; the protocol does not allow nesting`);
      else urlSets.push(child);
    }
  }

  const seen = new Map();
  for (const set of urlSets) {
    for (const entry of set.entries) {
      const u = checkLoc(out, entry, set.source);
      if (!u) continue;
      const key = normalize(u.href);
      if (seen.has(key)) {
        seen.get(key).count++;
        continue;
      }
      seen.set(key, { count: 1, loc: entry.loc, lastmod: entry.lastmod, sitemap: set.source });
    }
  }
  for (const [key, v] of seen) {
    if (v.count > 1) add(out, 'error', 'sitemap-duplicate', `${v.loc} is listed ${v.count} times`);
    out.urls.push({ url: key, loc: v.loc, lastmod: v.lastmod, sitemap: v.sitemap });
  }
  if (!out.urls.length) add(out, 'error', 'sitemap-empty', 'the sitemap lists no URLs');
  return out;
}

/* ───────────────────────────── llms.txt ───────────────────────────── */

async function checkLlms(sitemapUrls) {
  const res = await get(`${BASE}/llms.txt`, 'text/plain,text/markdown;q=0.9,*/*;q=0.8');
  const r = { ...meta(res), links: [], problems: [] };
  if (res.status !== 200 || !/^text\/(?:plain|markdown)\b/i.test(res.contentType))
    add(r, 'error', 'llms-fetch', `expected 200 text/plain or text/markdown, got ${describe(res)}`);
  if (res.status !== 200) return r;

  // Bare, angle-bracketed or inside a Markdown link: stop at whitespace,
  // brackets and quotes, then drop sentence punctuation the URL ended on.
  const esc = PROD.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${esc}(?![\\w.-])[^\\s<>"'()\\[\\]]*`, 'g');
  const found = new Set();
  for (const [m] of res.body.matchAll(re)) found.add(normalize(m.replace(/[.,;:!?*_]+$/, '')));
  found.delete(null);

  const listed = new Set(sitemapUrls);
  r.links = [...found].map((url) => ({ url, inSitemap: listed.has(url), status: null }));
  // Anything outside the sitemap must at least resolve. A 308 counts against
  // it: llms.txt should name the final URL, as a sitemap does.
  await pool(r.links.filter((l) => !l.inSitemap), CONCURRENCY, async (link) => {
    const x = await get(toBase(link.url));
    link.status = x.status;
    if (x.status !== 200) add(r, 'error', 'llms-link', `${pathOf(link.url)} is not in the sitemap and returns ${describe(x)}`);
  });
  return r;
}

/* ─────────────────────────────── run ─────────────────────────────── */

const startedAt = new Date();
console.log(`seo-check · ${BASE} · canonical origin ${PROD} · as OAI-SearchBot\n`);

const SYMBOL = { error: '✗', warn: '!' };
const printProblems = (heading, problems, info = []) => {
  if (!problems.length && !info.length) return;
  console.log(heading);
  const sorted = [...problems].sort((a, b) => (a.level === b.level ? 0 : a.level === 'error' ? -1 : 1));
  for (const p of sorted) console.log(`  ${SYMBOL[p.level]} [${p.code}] ${p.message}`);
  for (const line of info) console.log(`  ℹ ${line}`);
};

const robots = await checkRobots();
printProblems(`robots.txt (${describe(robots)})`, robots.problems, robots.info);

const sitemaps = await checkSitemaps();
const kinds = sitemaps.files
  .map((f) => `${pathOf(f.url)}: ${f.kind ? `${f.kind}, ${count(f.entries, 'entry', 'entries')}` : describe(f)}`)
  .join(' · ');
console.log(`\nsitemaps (${kinds}) → ${count(sitemaps.urls.length, 'URL')}`);
printProblems('', sitemaps.problems);

const targets = sitemaps.urls.map((u) => ({ url: toProd(u.url), fetchUrl: toBase(u.url), path: pathOf(u.url) }));
if (targets.length) console.log(`\npages (${targets.length}), problems only:`);
const pages = await pool(targets, CONCURRENCY, checkPage);
for (const p of pages) printProblems(p.path, p.problems);

const llms = await checkLlms(sitemaps.urls.map((u) => u.url));
const outside = llms.links.filter((l) => !l.inSitemap).length;
console.log(`\nllms.txt (${describe(llms)}) → ${count(llms.links.length, 'link')} to ${PROD}, ${outside} outside the sitemap`);
printProblems('', llms.problems);

/* ───────────────────────────── summary ───────────────────────────── */

const sources = [
  ['robots.txt', robots.problems],
  ['sitemap.xml', sitemaps.problems],
  ...pages.map((p) => [p.path, p.problems]),
  ['llms.txt', llms.problems],
];
const byCode = new Map();
let errors = 0;
let warnings = 0;
for (const [where, problems] of sources) {
  for (const p of problems) {
    if (p.level === 'error') errors++;
    else warnings++;
    const key = `${p.level}:${p.code}`;
    if (!byCode.has(key)) byCode.set(key, { level: p.level, code: p.code, count: 0, where: [] });
    const entry = byCode.get(key);
    entry.count++;
    if (!entry.where.includes(where)) entry.where.push(where);
  }
}

/** "/projects/1, /projects/2, /projects/3" → "/projects/{1,2,3}". */
function compactPaths(paths) {
  if (paths.length === pages.length && paths.length > 3 && paths.every((p) => p.startsWith('/'))) return 'every page';
  const groups = new Map();
  for (const p of paths) {
    const cut = p.startsWith('/') ? p.lastIndexOf('/') : -1;
    const head = cut > 0 ? p.slice(0, cut + 1) : p;
    if (!groups.has(head)) groups.set(head, []);
    groups.get(head).push(cut > 0 ? p.slice(cut + 1) : '');
  }
  return [...groups]
    .map(([head, tails]) => (tails.length > 2 ? `${head}{${tails.join(',')}}` : tails.map((t) => head + t).join(', ')))
    .join(', ');
}

const seconds = ((Date.now() - startedAt.getTime()) / 1000).toFixed(1);
console.log(`\n${'─'.repeat(72)}`);
console.log(`${count(pages.length, 'page')} checked · ${count(requestCount, 'request')} in ${seconds} s · ${errors} error(s), ${warnings} warning(s)`);
for (const level of ['error', 'warn']) {
  const rows = [...byCode.values()].filter((e) => e.level === level).sort((a, b) => b.where.length - a.where.length);
  if (!rows.length) continue;
  console.log(`\n${level === 'error' ? 'errors' : 'warnings'} by check:`);
  for (const e of rows) {
    const scope = `${e.count}×${e.where.length !== e.count ? ` on ${e.where.length}` : ''}`;
    console.log(`  ${SYMBOL[level]} ${e.code.padEnd(22)} ${scope.padEnd(10)} ${compactPaths(e.where)}`);
  }
}

if (pages.length) {
  console.log(`\nwords inside <main>, ascending (under ${THIN_MAIN_WORDS} is flagged):`);
  const rows = [...pages].sort((a, b) => (a.words ?? -1) - (b.words ?? -1));
  for (const p of rows) {
    const words = p.words == null ? '—' : String(p.words);
    const note =
      p.status !== 200 ? `  (HTTP ${p.status || 'error'})`
      : p.words == null ? `  (no <main>; ${p.bodyWords} words in the whole page)`
      : p.words < THIN_MAIN_WORDS ? '  !' : '';
    console.log(`  ${words.padStart(6)}  ${p.path}${note}`);
  }
}

if (robots.status === 0 && llms.status === 0 && sitemaps.files.every((f) => f.status === 0))
  console.log(`\nNothing answered at ${BASE}. For a local check, start the site first: npm run build && npm start`);

if (jsonOut) {
  const file = resolve(process.cwd(), jsonOut);
  mkdirSync(dirname(file), { recursive: true });
  const summary = { pages: pages.length, requests: requestCount, seconds: Number(seconds), errors, warnings, byCode: [...byCode.values()] };
  writeFileSync(
    file,
    JSON.stringify({ base: BASE, production: PROD, userAgent: UA, startedAt: startedAt.toISOString(), summary, robots, sitemaps, pages, llms }, null, 2)
  );
  console.log(`\nfull results → ${file}`);
}

console.log(errors ? `\n✗ ${errors} error(s)` : '\n✓ no errors');
process.exitCode = errors ? 1 : 0;
