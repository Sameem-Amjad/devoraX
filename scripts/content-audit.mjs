#!/usr/bin/env node
/**
 * Content audit for the published corpus.
 *
 * Exists because the same verification mistake was made twice: a hand-written
 * check listed the fields it thought mattered (`summary_answer`, section bodies)
 * and therefore reported "0 instances" while 62 sat in `stack_rationale` and in
 * section headings, which nobody had thought to name. A regex that defines its
 * own scope will always be wrong the moment the shape of the data changes.
 *
 * This walks EVERY string in every content module instead, recursively, and
 * reports the path to each hit. Adding a field to a type cannot hide from it.
 *
 * Nov 2026: the claims rules that can run on the data files were added
 * (approval and turnaround promises, credential claims, "rescue"), with
 * the terms (data/terms.ts), the offer ladder and the entity statement as
 * sources, plus two parity checks: manifest.json's description must be the
 * entity statement, and the NEXT_START week in data/terms.ts must not have
 * passed. A hit is excused only by where it comes from (EXEMPT below), never by
 * loosening a pattern.
 *
 * Usage:  node scripts/content-audit.mjs            (exit 1 if any error-level hit)
 *         node scripts/content-audit.mjs --verbose  (print every hit, not a sample)
 */
import { readFileSync } from 'node:fs';

const VERBOSE = process.argv.includes('--verbose');

/**
 * The plain constants a module declares (`const NAME = 'text'` or a number),
 * so a literal that interpolates one (terms.ts: `${AUDIT_TURNAROUND_WORKING_DAYS}`)
 * or names one (`id: NEXT_START_TERM_ID`) evaluates to what the page renders.
 */
function moduleConstants(src) {
  const scope = {};
  const re = /(?:export\s+)?const\s+([A-Z][A-Z0-9_]*)\s*(?::[^=;]+)?=\s*('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|-?\d+(?:\.\d+)?)\s*;/g;
  for (let m; (m = re.exec(src)); ) scope[m[1]] = eval(m[2]);
  return scope;
}

/**
 * Pull an exported literal (object, array or string) out of a .ts module
 * without compiling it.
 */
function extract(file, exportName) {
  const src = readFileSync(file, 'utf8');
  // The exact name, not a prefix: `export const BRAND_FACTS` is also the start
  // of `export const BRAND_FACTS_UPDATED`, and a prefix match parsed whichever
  // came first. Skips an optional type annotation up to the `=`.
  const found = new RegExp(`export const ${exportName}\\b\\s*(?::[^=]*)?=`).exec(src);
  if (!found) throw new Error(`${exportName} not found in ${file}`);
  let start = src.indexOf('=', found.index) + 1;
  while (start < src.length && /\s/.test(src[start])) start++;
  const openCh = src[start];

  let end = -1;
  if (openCh === '[' || openCh === '{') {
    const closeCh = openCh === '[' ? ']' : '}';
    let depth = 0, inStr = null, esc = false;
    for (let k = start; k < src.length; k++) {
      const ch = src[k];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === inStr) inStr = null;
        continue;
      }
      // Comments inside a literal (terms.ts has one) may hold an apostrophe,
      // which must not open a string.
      if (ch === '/' && src[k + 1] === '/') { k = src.indexOf('\n', k); if (k === -1) break; continue; }
      if (ch === '/' && src[k + 1] === '*') { k = src.indexOf('*/', k + 2) + 1; if (k === 0) break; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
      if (ch === openCh) depth++;
      else if (ch === closeCh) { depth--; if (depth === 0) { end = k; break; } }
    }
  } else if (openCh === '"' || openCh === "'" || openCh === '`') {
    // A string export, such as ENTITY_STATEMENT.
    let esc = false;
    for (let k = start + 1; k < src.length; k++) {
      const ch = src[k];
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === openCh) { end = k; break; }
    }
  }
  if (end === -1) throw new Error(`unbalanced literal for ${exportName} in ${file}`);
  const scope = moduleConstants(src);
  return new Function(...Object.keys(scope), `return (${src.slice(start, end + 1)});`)(
    ...Object.values(scope)
  );
}

/** Every string in a nested structure, with a dotted path to each. */
function* strings(node, path = '') {
  if (typeof node === 'string') { yield [path, node]; return; }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) yield* strings(node[i], `${path}[${i}]`);
    return;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) yield* strings(v, path ? `${path}.${k}` : k);
  }
}

/** The value at a path that strings() produced, e.g. "[8].sections[3].table". */
function at(root, path) {
  let node = root;
  for (const m of path.matchAll(/\[(\d+)\]|\.?([A-Za-z_$][\w$]*)/g)) {
    if (node == null) return undefined;
    node = node[m[1] !== undefined ? Number(m[1]) : m[2]];
  }
  return node;
}

/**
 * Spans inside double quotation marks: straight quotes toggle, curly quotes
 * open and close. Single quotes are skipped on purpose: an apostrophe
 * ("Apple's") cannot be told from a quote.
 */
function quotedSpans(text) {
  const spans = [];
  let open = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (open === -1) open = i;
      else { spans.push([open, i]); open = -1; }
    } else if (ch === '“') open = i;
    else if (ch === '”' && open !== -1) { spans.push([open, i]); open = -1; }
  }
  return spans;
}
const insideQuotes = (text, index) => quotedSpans(text).some(([a, b]) => index > a && index < b);

/** The `n` words before (or after) a match, for negation and proximity tests. */
const wordsBefore = (text, index, n) => text.slice(0, index).split(/\s+/).filter(Boolean).slice(-n).join(' ');
const wordsAfter = (text, index, n) => text.slice(index).split(/\s+/).filter(Boolean).slice(0, n).join(' ');

/** "n't", "not", "never", "no one", "cannot": the forms that turn a claim into its denial. */
const NEGATION = /n['’]t\b|\bnot\b|\bnever\b|\bno one\b|\bcannot\b/i;

/** A buyer's question is in the buyer's voice ("Do we have to hire…?"), not ours. */
const isQuestionField = (path) => /(?:^|\.)(?:q|question)$/.test(path);

const RULES = [
  {
    id: 'client-reported',
    level: 'error',
    /**
     * "The client reports 2.4M users." Public data contradicted several of these
     * figures and nothing backed the rest, and several "clients" were employers.
     * Since the Oct 2026 claims ledger a figure is published only if a reader can
     * check it today (a store listing, a live site, the Fiverr record), so the
     * client's word is not a source and the phrasing itself is the regression.
     */
    re: /\bclient[- ]reported\b|\b(?:the )?client reports\b|\breported (?:to us )?by the client\b|\bas reported by\b|\boutcomes reported\b/gi,
    why: "presents a figure on the client's word; publish only figures a reader can check",
  },
  {
    id: 'agency-attribution',
    level: 'error',
    /**
     * Most portfolio products were built while Sameem was an employee elsewhere,
     * for clients who hired him directly, or have no confirmed client. "DevoraX
     * built X" claims them for the agency.
     *
     * Owner decisions of 8 Nov 2026: orders through the Fiverr profile are
     * DevoraX client work (the profile is in Sameem's name but sells the
     * studio's services, and the team delivered them), and so is Koor (17). The
     * pattern stays as it was: those pages say "a client who hired DevoraX on
     * Fiverr" or "DevoraX worked on it for a client", which name the engagement
     * without the phrases below, so the rule still catches "DevoraX built" and
     * "our client" laid over employer work.
     */
    re: /\bbuilt by DevoraX\b|\bDevoraX built\b|\bour client\b/gi,
    why: 'claims employer or unconfirmed work as DevoraX client work',
  },
  {
    id: 'db-column-name',
    level: 'error',
    /**
     * A literal column from our Supabase schema, printed for visitors. Always
     * wrong, in every genre — nobody outside this repo knows what a stats field is.
     */
    re: /\b(?:stats|techstack|description|result|slug|image) field\b|\beach row['’]s\b|\bevery row of\b/gi,
    why: 'prints a database column name on a public page',
  },
  {
    id: 'approval',
    level: 'error',
    /**
     * Owner decision (7 Nov 2026): no approval promise anywhere. We prepare the
     * app against Apple's and Google's guidelines, submit it and answer the
     * reviewers; the stores decide. Affirmative forms only: a hit with "n't",
     * "not", "never", "no one" or "cannot" in the six words before it is a
     * denial ("No one can guarantee App Store approval", "a build that didn't
     * pass review") and passes.
     */
    re: /\bApp Store approval\b|\buntil (?:it is |the app is )?approved\b|\bapproval guaranteed\b|\bguaranteed approval\b|\bget it approved\b|\bpass(?:es)? (?:app )?review\b/gi,
    skip: ({ text, index }) => NEGATION.test(wordsBefore(text, index, 6)),
    why: 'promises store approval; say what we do (prepare, submit, answer the reviewers) and that the stores decide',
  },
  {
    id: 'turnaround',
    level: 'error',
    /**
     * No turnaround or delivery promise beyond "usually 1–2 weeks" for a finish
     * sprint and the owner-set audit turnaround in data/terms.ts. "Response
     * within 24h", "a fixed-price proposal within 48 hours" and "a scope, a
     * timeline and a number" were all on the site once.
     */
    re: /\bwithin\s+(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty-four|forty-eight)\s*(?:h\b|hrs?\b|hours?\b|(?:business |working )?days?\b)|\b(?:24|48|72)\s?h\b|\b(?:24|48|72)[- ]hours?\b|\ba timeline and a number\b|\bscope, timeline and an honest number\b|\bfixed-price proposal within\b|\bresponse within\b/gi,
    why: 'a turnaround promise; use the terms in data/terms.ts ("usually N working days", the start week) instead',
  },
  {
    id: 'credential',
    level: 'error',
    /**
     * No certification, partnership or "expert" claim until a program accepts
     * DevoraX. Self-claims only: a denial ("we are not
     * certified") passes, and so do the names of things that are not claims
     * about us ("Expert Network", "Experts directory", "partner team",
     * "certified compliance posture").
     */
    re: /\b(?:we are|we['’]re|DevoraX is|our team is)\b[^.]{0,40}\b(?:experts?|certified|partners?)\b/gi,
    allow: /\bExperts? (?:Network|directory|Marketplace)\b|\bpartner team\b|\bcertified compliance posture\b/i,
    skip: ({ match }) => /n['’]t\b|\bnot\b|\bnever\b|\bno\b/i.test(match),
    why: 'a credential self-claim; say what the work is ("developer for apps built with Lovable")',
  },
  {
    id: 'platform-credential',
    level: 'error',
    /**
     * "Lovable expert", "Sharetribe Expert", "Base44 partner" next to us: these
     * read as a platform's accreditation, which DevoraX does not hold. Flagged
     * when "we", "I", "DevoraX", "Sameem" or "our" is within five words, outside
     * quotation marks (a platform's own words, quoted, pass) and outside a
     * buyer's question ("Do we have to hire a Sharetribe Expert?").
     */
    re: /\b(?:Lovable|Base44|Sharetribe|Replit|Bolt)\s+(?:experts?|partners?)\b/gi,
    allow: /\bExperts? (?:Network|directory|Marketplace)\b/i,
    skip: ({ text, index, match, path }) =>
      isQuestionField(path) ||
      insideQuotes(text, index) ||
      !/\b(?:[Ww]e|I|DevoraX|Sameem|[Oo]ur)\b/.test(
        `${wordsBefore(text, index, 5)} ${wordsAfter(text, index + match.length, 5)}`
      ),
    why: "reads as a platform's accreditation; DevoraX is not listed or certified by it",
  },
  {
    id: 'record-as-document',
    /**
     * "the record states", "named in the record", "project record".
     *
     * Wrong on a sales or portfolio page, where it reads as an internal audit
     * note and tells a prospect our CMS is thin. Legitimate in a research
     * article's methodology, where naming the dataset and its limits is exactly
     * what makes the findings citable. Reported as a warning so the genre can
     * decide; `--strict` promotes it for the files where it is never acceptable.
     */
    level: 'warn',
    re: /\bthe record (?:states|says|names|lists|describes|documents|reports|covers|shows|gives|carries|leaves|claims|contains)\b|\bnamed in the record\b|\bproject record\b|\bthe record['’]s\b|\brecord['’]s (?:own|frontend|backend|scalability)\b/gi,
    why: 'reads as an internal audit note rather than a page for a reader',
  },
  {
    id: 'marketing-fluff',
    level: 'warn',
    re: /\bcutting[- ]edge\b|\bseamless(?:ly)?\b|\bworld[- ]class\b|\bleverag(?:e|ing)\b|\bempower(?:s|ing)?\b|\bbespoke\b|\bgame[- ]chang/gi,
    why: 'banned house-style terms',
  },
  {
    id: 'rescue',
    level: 'warn',
    /** "Finish and ship", never "rescue" (offer.ts); nor a claim about past rescues. */
    re: /\brescu(?:e|ed|es|ing)\b/gi,
    why: '"finish and ship", never "rescue"',
  },
  {
    id: 'self-superlative',
    level: 'warn',
    re: /\bwhere we are strongest\b|\bbest[- ]in[- ]class\b|\bindustry[- ]leading\b|\bunmatched\b|\bsecond to none\b/gi,
    why: 'unsupported self-grading',
  },
];

/**
 * A third party's own terms or prices, quoted in a market-price table that
 * names its source and the day it was read: a "Source" column holding a
 * domain, and a date in that cell or in the caption. DevoraX's own row in such
 * a table is still ours, so it gets no pass.
 */
function inSourcedPriceTable(data, path) {
  const m = /^(.*\.table)\.rows\[(\d+)\]\[\d+\]$/.exec(path);
  if (!m) return false;
  const table = at(data, m[1]);
  const row = table?.rows?.[Number(m[2])];
  if (!table || !row) return false;
  const col = (table.headers || []).findIndex((h) => /^source\b/i.test(h));
  if (col === -1) return false;
  const DATE = /\b\d{1,2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b|\b\d{4}-\d{2}-\d{2}\b/;
  const sourced = /[a-z0-9-]+\.[a-z]{2,}/i.test(row[col] || '');
  const dated = DATE.test(row[col] || '') || DATE.test(table.caption || '');
  return sourced && dated && !/^DevoraX\b/.test(row[0] || '');
}

/** Hits excused by their source. Each says why; none loosens a pattern. */
const EXEMPT = [
  {
    rule: 'turnaround',
    why: 'the owner-set audit turnaround in data/terms.ts, the one turnaround the site publishes',
    test: ({ name, data, path }) => name === 'TERMS' && at(data, path.replace(/\.[^.]+$/, ''))?.id === 'start',
  },
  {
    rule: 'turnaround',
    why: "a third party's terms in a dated, sourced market-price table",
    test: ({ data, path }) => inSourcedPriceTable(data, path),
  },
  {
    rule: 'turnaround',
    why: "a quotation that carries its source link (Apple's App Review times)",
    test: ({ text, index }) => insideQuotes(text, index) && /\]\(https:\/\/|https:\/\//.test(text),
  },
];

/** A figure is fine if its own sentence, or the one before it, names the source. */
const FIGURE = /\b\d+(?:\.\d+)?%|\$[\d,]+|\b\d[\d,.]*\s?(?:k|K|M|m|B|million|billion)\+?\b/;
// "The client reports" used to count as attribution. It no longer does (see
// the client-reported rule): the source has to be something a reader can open.
const ATTRIBUTED =
  /Google Play|App Store|store listing|listing shows|organisers['’]|Fiverr|we (?:have not|did not|have no|publish no)|published (?:starting|tiers)|indicative|our own|not independently|not audited|is recorded|are recorded|the project records|not identified/i;
/**
 * Figures that are not client outcome claims and need no attribution: properties
 * of the build itself, standards, and OUR OWN published pricing — "$2,900 MVP
 * Starter", the $400 audit, the $1,200 sprint week, the $1,500 care plan and the
 * $2,400 Connect / store-launch steps are our numbers, not a client's, so
 * demanding a client attribution on them is noise rather than rigour.
 */
const NOT_AN_OUTCOME =
  /inspection point|codebase|version|ISO |27001|GDPR|SOC ?2|http|px\b|\bv\d|\$2,900|\$7,500|MVP Starter|Growth projects|custom-scoped|\$400|\$1,200|\$1,500|\$2,400|care plan|launch-readiness audit/i;

/** Pages selling or showcasing work. No methodology excuse applies here. */
const SALES_SURFACES = new Set([
  'CASE_STUDY_CONTENT', 'SOLUTIONS', 'FAQS',
  'TERMS', 'OFFER_LADDER', 'POSITIONING', 'DOORS', 'MARKETPLACE_BUILD', 'ENTITY_STATEMENT',
]);

const SOURCES = [
  ['src/data/caseStudyContent.ts', 'CASE_STUDY_CONTENT'],
  // serviceContent.ts left with the /services/{id} pages on 7 Nov 2026.
  ['src/data/insights.ts', 'INSIGHTS'],
  ['src/data/solutions.ts', 'SOLUTIONS'],
  ['src/data/faqs.ts', 'FAQS'],
  ['src/data/testimonials.ts', 'TESTIMONIALS'],
  ['src/data/brand.ts', 'BRAND_FACTS'],
  ['src/data/brand.ts', 'ENTITY_STATEMENT'],
  ['src/data/glossary.ts', 'GLOSSARY'],
  // The terms every door page, /pricing#terms and the listing kit print.
  ['src/data/terms.ts', 'TERMS'],
  // The offer itself: the ladder, the promise, the three doors and the
  // marketplace hub's card, which the homepage, /services and llms.txt print.
  ['src/data/offer.ts', 'OFFER_LADDER'],
  ['src/data/offer.ts', 'POSITIONING'],
  ['src/data/offer.ts', 'DOORS'],
  ['src/data/offer.ts', 'MARKETPLACE_BUILD'],
];

let errors = 0, warnings = 0;
const report = [];
const loaded = {};

for (const [file, name] of SOURCES) {
  let data;
  try { data = extract(file, name); }
  catch (e) { report.push([`${file}`, 'error', 'parse', e.message]); errors++; continue; }
  loaded[name] = data;

  const hits = {};
  const exempt = [];
  let figureHits = [];

  for (const [path, text] of strings(data)) {
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      for (const m of text.matchAll(rule.re)) {
        const ctx = { name, data, path, text, index: m.index, match: m[0] };
        if (rule.allow && rule.allow.test(text.slice(m.index, m.index + m[0].length + 20))) continue;
        if (rule.skip && rule.skip(ctx)) continue;
        const excused = EXEMPT.find((x) => x.rule === rule.id && x.test(ctx));
        if (excused) { exempt.push({ path, rule: rule.id, sample: m[0], why: excused.why }); continue; }
        // Sales and portfolio surfaces have no methodology excuse for it.
        const level =
          rule.id === 'record-as-document' && SALES_SURFACES.has(name)
            ? 'error'
            : rule.level;
        (hits[rule.id] ??= []).push({ path, sample: m[0], level, text });
      }
    }
    // Unattributed outcome figures, checked sentence by sentence.
    const sents = text.split(/(?<=[.!?])\s+/);
    // Research articles compute their own percentages over our 25-project book
    // of work. Those are self-derived rather than client-reported, and each
    // article states its dataset and its limits up front, so they are exempt.
    // Two whole-field exemptions rather than per-sentence ones:
    //  - INSIGHTS computes its own percentages over our 25-project book of work.
    //    Self-derived, not client-reported, and each article states its dataset.
    //  - `results[]` entries are short checkable facts ('Google Play: 100K+
    //    downloads') rendered inside a panel headed "What you can check", with a
    //    note beneath it that each item points to something public. The source
    //    lives in the item and the component, so inline prose would be redundant.
    const selfDerived =
      (name === 'INSIGHTS' && /\b(?:25|26|our|we)\b/i.test(text)) ||
      /(?:^|\.)results\[/.test(path) ||
      // Table cells are bare values ("60%", "$24,680"). Their provenance lives in
      // the table's own caption and in the article's dataset_note, both of which
      // this audit checks separately. A cell cannot carry a clause.
      /\.table\.rows\[/.test(path);
    sents.forEach((s, i) => {
      if (!FIGURE.test(s) || NOT_AN_OUTCOME.test(s) || selfDerived) return;
      const ctx = (sents[i - 1] || '') + ' ' + s;
      if (!ATTRIBUTED.test(ctx)) figureHits.push({ path, text: s.trim() });
    });
  }

  const summary = [];
  for (const rule of RULES) {
    const h = hits[rule.id] || [];
    if (!h.length) continue;
    const lvl = h[0].level;
    if (lvl === 'error') errors += h.length; else warnings += h.length;
    summary.push(`${rule.id}=${h.length}`);
    const show = VERBOSE ? h : h.slice(0, 3);
    for (const x of show) report.push([`${name}.${x.path}`, x.level, rule.id, `"${x.sample}" — ${rule.why}`]);
    if (!VERBOSE && h.length > 3) report.push([`${name}`, lvl, rule.id, `…and ${h.length - 3} more (--verbose to list)`]);
  }
  if (figureHits.length) {
    warnings += figureHits.length;
    summary.push(`unattributed-figure=${figureHits.length}`);
    const show = VERBOSE ? figureHits : figureHits.slice(0, 3);
    for (const x of show) report.push([`${name}.${x.path}`, 'warn', 'unattributed-figure', x.text.slice(0, 120)]);
    if (!VERBOSE && figureHits.length > 3) report.push([`${name}`, 'warn', 'unattributed-figure', `…and ${figureHits.length - 3} more`]);
  }
  if (exempt.length) {
    summary.push(`exempt=${exempt.length}`);
    if (VERBOSE) for (const x of exempt) report.push([`${name}.${x.path}`, 'info', `${x.rule} (exempt)`, `"${x.sample}" — ${x.why}`]);
  }

  console.log(`${name.padEnd(22)} ${summary.length ? summary.join('  ') : 'clean'}`);
}

/**
 * Parity: facts that live in two places must say the same thing.
 *  - public/manifest.json is static, so it holds a copy of the entity
 *    statement; a stale copy is what profiles and app installs would show.
 *  - NEXT_START is set by hand each week. The pages fall back to "ask on the
 *    call" once its week has passed, but a stale date is a release blocker.
 */
const parity = [];
try {
  const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'));
  if (typeof loaded.ENTITY_STATEMENT === 'string' && manifest.description !== loaded.ENTITY_STATEMENT) {
    parity.push(['public/manifest.json', 'manifest', 'description differs from ENTITY_STATEMENT in src/data/brand.ts; copy it word for word']);
  }
} catch (e) {
  parity.push(['public/manifest.json', 'manifest', `unreadable: ${e.message}`]);
}
{
  const termsSrc = readFileSync('src/data/terms.ts', 'utf8');
  const day = /export const NEXT_START\s*=\s*'(\d{4}-\d{2}-\d{2})'/.exec(termsSrc)?.[1];
  const start = day ? Date.parse(`${day}T00:00:00.000Z`) : NaN;
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  if (Number.isNaN(start)) {
    parity.push(['src/data/terms.ts', 'next-start', 'NEXT_START is missing or not an ISO day']);
  } else if (Date.now() >= start + WEEK_MS) {
    parity.push(['src/data/terms.ts', 'next-start', `the week of NEXT_START (${day}) has passed; set the next start week and NEXT_START_UPDATED`]);
  }
}
for (const [where, id, detail] of parity) report.push([where, 'error', id, detail]);
errors += parity.length;
console.log(`${'PARITY'.padEnd(22)} ${parity.length ? parity.map(([, id]) => id).join('  ') : 'clean'}`);

if (report.length) {
  console.log('');
  for (const [where, level, id, detail] of report) {
    const mark = level === 'error' ? '✗' : level === 'info' ? '·' : '!';
    console.log(`  ${mark} [${id}] ${where}\n      ${detail}`);
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
