/**
 * What a visitor is served, and the rules applied to it.
 *
 * The rendered audit (scripts/audit-rendered.mjs) fetches pages and hands the
 * HTML to parsePage() and checkPage(); the self-test hands them a fixture. Kept
 * apart from the crawler so the same checks run on both.
 *
 * Reads raw HTML and executes no JavaScript, which is what a crawler that does
 * not render gets. Copy typed straight into page and component files (never in
 * the data files) is caught here and nowhere else.
 */
import {
  findHits,
  findAllow,
  unknownPrices,
  uncreditedAudit,
  termMismatches,
  inSourcedPriceTable,
} from './claims-rules.mjs';

/* ───────────────────────── parsing ───────────────────────── */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', mdash: '—', ndash: '–', hellip: '…', pound: '£', euro: '€', cent: '¢' };
export function decode(s) {
  return s.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (all, dec, hex, name) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return ENTITIES[name.toLowerCase()] ?? all;
  });
}

const attrs = (tag) => {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return out;
};

/** Elements whose children never count as visible copy. */
const SKIP = new Set(['script', 'style', 'svg', 'noscript', 'template', 'head']);
/** Elements that end one block of text and start another. */
const BLOCK = new Set([
  'p', 'li', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'tr', 'table', 'caption',
  'div', 'section', 'article', 'aside', 'header', 'footer', 'nav', 'main', 'blockquote', 'figcaption',
  'dt', 'dd', 'dl', 'summary', 'details', 'button', 'form', 'label', 'br', 'hr', 'pre',
]);

/**
 * The visible text of an HTML fragment as blocks: { text, links } where links
 * are the hrefs of anchors inside the block. Script, style and svg are dropped.
 */
export function textBlocks(html) {
  const blocks = [];
  let buf = '';
  let links = [];
  const stack = []; // open elements: { tag, href }
  const flush = () => {
    const text = decode(buf).replace(/\s+/g, ' ').trim();
    if (text) {
      // A card is often one anchor around several blocks: each block carries the
      // hrefs of the anchors that enclose it, as well as its own.
      const enclosing = stack.map((e) => e.href).filter(Boolean);
      blocks.push({ text, links: [...new Set([...links, ...enclosing])] });
    }
    buf = '';
    links = [];
  };
  const hidden = () => stack.some((e) => SKIP.has(e.tag));
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>|([^<]+)/g;
  for (let m; (m = re.exec(html)); ) {
    if (m[4] !== undefined) {
      if (!hidden()) buf += m[4];
      continue;
    }
    if (m[2] === undefined) continue; // a comment
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    const selfClosing = /\/\s*$/.test(m[3]) || ['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tag);
    if (!closing) {
      const a = attrs(m[3]);
      if (!SKIP.has(tag) && !hidden()) {
        if (BLOCK.has(tag)) flush();
        if (tag === 'a' && a.href) links.push(a.href);
        // An image's alt text is copy a crawler reads.
        if (tag === 'img' && a.alt) buf += ` ${a.alt} `;
      }
      if (!selfClosing) stack.push({ tag, href: tag === 'a' ? a.href : undefined });
    } else {
      let i = stack.length - 1;
      while (i >= 0 && stack[i].tag !== tag) i--;
      if (BLOCK.has(tag) && !hidden()) flush();
      if (i !== -1) stack.length = i;
    }
  }
  flush();
  return blocks;
}

/**
 * A table as blocks, one per cell, with the table's meaning kept: a cell of a
 * third party's row in a table that names its source and the day it was read
 * carries the 'sourced-price-row' flag, the same exemption the static audit
 * gives that row. The caption and headers come out as blocks too.
 */
function tableBlocks(tableHtml) {
  const flat = (html) => textBlocks(html);
  const caption = flat(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i.exec(tableHtml)?.[1] ?? '').map((b) => b.text).join(' ');
  const rows = [];
  for (const tr of tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [];
    for (const c of tr[1].matchAll(/<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
      const bs = flat(c[2]);
      cells.push({ kind: c[1].toLowerCase(), text: bs.map((b) => b.text).join(' '), links: bs.flatMap((b) => b.links) });
    }
    if (cells.length) rows.push(cells);
  }
  const headRow = rows.find((r) => r.every((c) => c.kind === 'th'));
  const body = rows.filter((r) => r !== headRow);
  const table = { caption, headers: (headRow || []).map((c) => c.text), rows: body.map((r) => r.map((c) => c.text)) };
  const out = [];
  if (caption) out.push({ text: caption, links: [] });
  for (const c of headRow || []) if (c.text) out.push({ text: c.text, links: [] });
  body.forEach((r, i) => {
    const flags = inSourcedPriceTable(table, i) ? new Set(['sourced-price-row']) : undefined;
    for (const c of r) if (c.text) out.push({ text: c.text, links: c.links, flags });
  });
  return out;
}

/** The blocks of a region of HTML, tables read as tables. */
function regionBlocks(html) {
  const out = [];
  let last = 0;
  for (const m of html.matchAll(/<table\b[\s\S]*?<\/table>/gi)) {
    out.push(...textBlocks(html.slice(last, m.index)), ...tableBlocks(m[0]));
    last = m.index + m[0].length;
  }
  out.push(...textBlocks(html.slice(last)));
  return out;
}

/** Everything the checks read from one HTML page. */
export function parsePage(html) {
  const title = decode(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '').replace(/\s+/g, ' ').trim();
  const meta = {};
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    const key = (a.name || a.property || '').toLowerCase();
    if (key && a.content !== undefined && !(key in meta)) meta[key] = a.content;
  }
  const mainMatch = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  const mainHtml = mainMatch ? mainMatch[1] : '';
  const body = /<body\b[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;
  const h1s = [];
  for (const m of body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)) {
    const t = decode(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (t) h1s.push(t);
  }
  const jsonld = [];
  const jsonldErrors = [];
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { jsonld.push(JSON.parse(m[1])); } catch (e) { jsonldErrors.push(e.message); }
  }
  return {
    title,
    description: meta['description'],
    robots: meta['robots'],
    ogSiteName: meta['og:site_name'],
    h1s,
    main: regionBlocks(mainHtml),
    // Header, nav and footer, outside <main>: only the brand-spelling rule reads these.
    outside: textBlocks(body.replace(/<main\b[\s\S]*?<\/main>/i, '')),
    hasMain: Boolean(mainMatch),
    jsonld,
    jsonldErrors,
  };
}

/** Every object with an @type in a JSON-LD value, however deeply nested. */
export function* jsonldNodes(value) {
  if (Array.isArray(value)) { for (const v of value) yield* jsonldNodes(v); return; }
  if (value && typeof value === 'object') {
    if (value['@type']) yield value;
    for (const v of Object.values(value)) yield* jsonldNodes(v);
  }
}
const typesOf = (node) => [].concat(node['@type']);

/* ───────────────────────── page classes ───────────────────────── */

/**
 * Pages where DevoraX states its own prices, so where the price and parity
 * rules read the whole text: the home page, the pricing and services pages, the
 * contact and booking pages, every door and vertical page, the checklist that
 * states the audit's price, and llms.txt.
 */
export const isOfferSurface = (path) =>
  path === '/' ||
  /^\/(?:pricing|services|contact|book)$/.test(path) ||
  /^\/solutions\/[^/]+$/.test(path) ||
  path === '/insights/vibe-coded-app-security-checklist' ||
  path === '/llms.txt';

/** Portfolio and offer pages, as opposed to the research articles and the glossary. */
export const isSalesSurface = (path) => !/^\/insights\//.test(path) && path !== '/glossary';

export const projectIdOf = (path) => {
  const m = /^\/projects\/(\d+)$/.exec(path);
  return m ? Number(m[1]) : null;
};

/* ───────────────────────── checking ───────────────────────── */

/**
 * Check one page. `page` is parsePage() output (or the same shape for a text
 * file: main = lines). `env`:
 *   path        the URL path ("/pricing")
 *   engagementOf, projectNames   from the project ledger
 *   own, market ({ own: Set, market })   the price sets
 *   facts       termFacts()
 *   allow       the allow-file entries
 * Returns { hits: [{ level, rule, where, sample, detail }], excused: [...] }.
 */
export function checkPage(page, env) {
  const hits = [];
  const excused = [];
  const { path } = env;
  const projectId = projectIdOf(path);
  const engagement = projectId == null ? undefined : env.engagementOf(projectId);
  const offerSurface = isOfferSurface(path);
  const mainText = page.main.map((b) => b.text).join('\n');

  const note = (level, rule, where, sample, detail, text) => {
    const entry = text != null && env.allow ? findAllow(env.allow, { where: path, rule, text }) : null;
    if (entry) { excused.push({ rule, where, sample, why: entry.reason }); return; }
    hits.push({ level, rule, where, sample, detail });
  };

  const fields = [];
  if (page.title) fields.push({ where: 'title', field: 'title', text: page.title });
  if (page.description) fields.push({ where: 'meta description', field: 'meta', text: page.description });
  for (const h of page.h1s) fields.push({ where: 'h1', field: 'h1', text: h });
  for (const b of page.main) fields.push({ where: 'main', field: 'body', text: b.text, links: b.links, flags: b.flags, isQuestion: /\?\s*$/.test(b.text) });

  for (const f of fields) {
    const found = findHits(f.text, {
      field: f.field,
      engagement,
      engagementOf: env.engagementOf,
      projectNames: env.projectNames,
      heroText: mainText,
      links: f.links,
      flags: f.flags,
      isQuestion: f.isQuestion,
      sales: isSalesSurface(path),
      offer: offerSurface,
    });
    for (const x of found.exempt) excused.push({ rule: x.rule, where: f.where, sample: x.sample, why: x.why });
    for (const h of found.hits) note(h.level, h.rule, f.where, h.sample, h.why, f.text);

    if (offerSurface) {
      for (const a of unknownPrices(f.text, { own: env.own, market: env.market })) {
        note('error', 'price', f.where, a.raw, "not one of DevoraX's prices and not a row of src/data/marketPrices.ts", f.text);
      }
      for (const s of uncreditedAudit(f.text, { own: env.own })) {
        note('warn', 'price-400-credited', f.where, '$400', 'the $400 audit stands beside another DevoraX price without saying it is credited', s);
      }
      for (const m of termMismatches(f.text, env.facts)) {
        note('error', 'terms-parity', f.where, m.sample, `states ${m.found} for the ${m.fact}; data/terms.ts says ${m.expected}`, f.text);
      }
    }
  }

  // Brand spelling reads the header and footer too: the old "Devora" rendered in the logo.
  for (const b of page.outside) {
    for (const h of findHits(b.text, { field: 'body' }).hits.filter((x) => x.rule === 'brand-variant')) {
      note('error', h.rule, 'header/footer', h.sample, h.why, b.text);
    }
  }

  // Demo and proof-of-concept pages are held to the demo wording via findHits
  // above; nothing else to do here. Brand parity next.
  if (page.ogSiteName !== undefined && page.ogSiteName !== 'DevoraX')
    note('error', 'brand-parity', 'og:site_name', page.ogSiteName, 'og:site_name must be "DevoraX"');
  for (const node of page.jsonld.flatMap((j) => [...jsonldNodes(j)])) {
    const types = typesOf(node);
    if (types.includes('Organization') || types.includes('WebSite')) {
      if ('alternateName' in node)
        note('error', 'brand-parity', `schema ${types.join('/')}`, JSON.stringify(node.alternateName), 'the brand has no alternateName');
      if (node.name !== 'DevoraX')
        note('error', 'brand-parity', `schema ${types.join('/')}`, String(node.name), 'the name must be "DevoraX"');
    }
    // The Offer schema states a DevoraX price: it must be one of ours.
    if (offerSurface && (types.includes('Offer') || types.includes('UnitPriceSpecification') || types.includes('PriceSpecification') || types.includes('AggregateOffer'))) {
      for (const key of ['price', 'minPrice', 'maxPrice', 'lowPrice', 'highPrice']) {
        if (node[key] === undefined) continue;
        const n = Number(String(node[key]).replace(/,/g, ''));
        if (Number.isFinite(n) && n > 0 && !env.own.has(n))
          note('error', 'price', `schema ${types.join('/')}`, `${key} ${node[key]}`, "an Offer price that is not one of DevoraX's prices", String(node[key]));
      }
    }
  }

  // The structured data's own words (a WebPage name, an Article description) are
  // copy a crawler reads and the page may not show. Run the claims rules over
  // them; a hit the visible text already has is not reported twice.
  const seen = new Set(hits.map((h) => `${h.rule}|${h.sample}`));
  const SKIP_KEYS = new Set(['@id', '@type', '@context', 'url', 'item', 'image', 'logo', 'sameAs', 'contentUrl', 'thumbnailUrl', 'embedUrl', 'email', 'telephone', 'inLanguage', 'dateModified', 'datePublished', 'lastReviewed']);
  const ldStrings = function* (value, key = '') {
    if (typeof value === 'string') { if (!SKIP_KEYS.has(key) && /\s/.test(value) && !/^https?:\/\//.test(value)) yield [key, value]; return; }
    if (Array.isArray(value)) { for (const v of value) yield* ldStrings(v, key); return; }
    if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) yield* ldStrings(v, k);
  };
  for (const [key, text] of page.jsonld.flatMap((j) => [...ldStrings(j)])) {
    const found = findHits(text, {
      field: 'body', engagement, engagementOf: env.engagementOf, projectNames: env.projectNames,
      heroText: mainText, sales: isSalesSurface(path), offer: offerSurface, isQuestion: /\?\s*$/.test(text),
    });
    for (const h of found.hits) {
      if (seen.has(`${h.rule}|${h.sample}`)) continue;
      note(h.level, h.rule, `JSON-LD ${key}`, h.sample, h.why, text);
    }
  }
  if (page.jsonldErrors.length) note('error', 'jsonld-parse', 'JSON-LD', page.jsonldErrors[0], 'a JSON-LD block does not parse');
  return { hits, excused };
}

/** Check a plain-text surface (llms.txt, manifest.json strings): each line is a block. */
export function checkText(lines, env) {
  const page = {
    title: '', description: undefined, ogSiteName: undefined, h1s: [], jsonld: [], jsonldErrors: [],
    main: lines.map((text) => ({ text, links: [...text.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]) })).filter((b) => b.text.trim()),
    hasMain: true,
  };
  page.outside = [];
  return checkPage(page, env);
}

