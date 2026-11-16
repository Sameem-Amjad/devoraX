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
 * passed. A hit is excused only by where it comes from (EXEMPT in
 * scripts/lib/claims-rules.mjs) or by an entry in scripts/audit-allow.json,
 * never by loosening a pattern.
 *
 * Later in Nov 2026 the rules moved into scripts/lib/claims-rules.mjs, which
 * this script, the rendered audit (scripts/audit-rendered.mjs) and the
 * self-test (scripts/audit-selftest.mjs) all import, so they cannot drift. This
 * file keeps what only a data walk can do:
 *  - the label and demo rules know a project's engagement (data/projectIndex.ts)
 *    and read it from the study's id;
 *  - the price rule: every dollar amount in a sales field must be one of
 *    DevoraX's own prices (the offer ladder plus the two package prices, read
 *    from the files) or a third-party price listed in data/marketPrices.ts; the
 *    rows of that table are themselves checked (source, read date, still used);
 *  - terms parity: the defect window and the audit turnaround are stated in
 *    data/terms.ts and typed again elsewhere; a copy with another number fails;
 *  - brand parity on BRAND_FACTS.
 *
 * Usage:  node scripts/content-audit.mjs            (exit 1 if any error-level hit)
 *         node scripts/content-audit.mjs --verbose  (print every hit, not a sample)
 */
import { readFileSync } from 'node:fs';
import { extract, strings, at, stringLiterals, ownPrices } from './lib/read-data.mjs';
import {
  RULES,
  findHits,
  marketAmounts,
  unknownPrices,
  unlistedThirdPartyPrices,
  uncreditedAudit,
  inSourcedPriceTable,
  isPriceTable,
  isThirdPartyRow,
  marketIssues,
  termFacts,
  termMismatches,
  loadAllow,
  findAllow,
  allowKind,
} from './lib/claims-rules.mjs';

const VERBOSE = process.argv.includes('--verbose');

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
  'CATALOGUE', 'CATALOGUE_PROJECTS',
]);

/**
 * Where DevoraX states a price, so where the price rule applies: every string
 * of the pages and lists that sell (door and vertical pages, FAQS, TERMS, the
 * ladder, the doors, positioning, the catalogue), and the checklist insight,
 * which states the audit's price. Not the project studies and not the research
 * articles: they quote public figures of their own, which the unattributed-figure
 * warning below covers, and a "$3,000 MVP" article is about that number.
 */
const PRICE_SCOPE = new Set([
  'SOLUTIONS', 'FAQS', 'TERMS', 'OFFER_LADDER', 'POSITIONING', 'DOORS', 'MARKETPLACE_BUILD',
  'CATALOGUE', 'CATALOGUE_PROJECTS', 'BRAND_FACTS', 'ENTITY_STATEMENT', 'CONSTANTS',
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
  // "What we build" (11 Nov 2026): the catalogue the homepage tabs, /services
  // and llms.txt print, and the project labels it names work by.
  ['src/data/catalogue.ts', 'CATALOGUE'],
  ['src/data/catalogue.ts', 'CATALOGUE_PROJECTS'],
];

let errors = 0, warnings = 0;
const report = [];
const loaded = {};

/* ── shared inputs, all read from the files ── */
const allow = loadAllow();
for (const p of allow.problems) { report.push(['scripts/audit-allow.json', 'error', 'allow-file', p]); errors++; }

const ENGAGEMENT = extract('src/data/projectIndex.ts', 'PROJECT_ENGAGEMENT');
const engagementOf = (id) => ENGAGEMENT[Number(id)] ?? 'unstated';
// Project names, so a sentence about "Koor's case study" is known to be about a
// project whose engagement is devorax-client (see the case-study-label rule).
const projectNames = (() => {
  const names = new Map();
  try { for (const [id, p] of Object.entries(extract('src/data/catalogue.ts', 'CATALOGUE_PROJECTS'))) names.set(Number(id), p.name); } catch { /* the audit still runs without names */ }
  try { for (const [id, n] of Object.entries(extract('src/data/projectIndex.ts', 'PROJECT_NAMES'))) names.set(Number(id), n); } catch { /* same */ }
  return [...names].map(([id, name]) => ({ id, name }));
})();

let own = new Set(), market = marketAmounts([]), marketRows = [], facts = {};
try { own = ownPrices().own; }
catch (e) { report.push(['src/data/offer.ts', 'error', 'parse', `own prices: ${e.message}`]); errors++; }
try { marketRows = extract('src/data/marketPrices.ts', 'MARKET_PRICES'); market = marketAmounts(marketRows); }
catch (e) { report.push(['src/data/marketPrices.ts', 'error', 'parse', e.message]); errors++; }
try {
  facts = termFacts();
  if (!Number.isFinite(facts.defectDays) || !Number.isFinite(facts.turnaroundDays)) throw new Error(`could not read the defect window or the audit turnaround (${JSON.stringify(facts)})`);
} catch (e) { report.push(['src/data/terms.ts', 'error', 'parse', e.message]); errors++; }

/** Where a table cell sits: { table, row, rowIndex } for "...table.rows[r][c]", else null. */
function tableCell(data, path) {
  const m = /^(.*\.table)\.rows\[(\d+)\]\[\d+\]$/.exec(path);
  if (!m) return null;
  const table = at(data, m[1]);
  const rowIndex = Number(m[2]);
  return table?.rows?.[rowIndex] ? { table, row: table.rows[rowIndex], rowIndex } : null;
}
const parentPath = (path) => path.replace(/\.[A-Za-z_$][\w$]*$/, '');

/**
 * Run the sources through every check. A string can come from a data export (a
 * parsed literal, strings with dotted paths) or, for constants.tsx, from the
 * quoted literals in the file; the latter get the price and parity checks only.
 */
function auditSource({ file, name, data, items }) {
  const hits = {};   // rule id -> [{ path, sample, level, text }]
  const exempt = [];
  const allowed = [];
  const figureHits = [];
  const priceChecks = name === 'INSIGHTS' || PRICE_SCOPE.has(name);
  const rulesOn = name !== 'CONSTANTS';

  const record = (rule, level, path, sample, text, why) => {
    const entry = findAllow(allow.entries, { where: file, rule, text });
    if (entry) { allowed.push({ path, rule, sample, why: entry.reason }); return; }
    (hits[rule] ??= []).push({ path, sample, level, text, why });
  };

  for (const [path, text] of items) {
    if (rulesOn) {
      const idMatch = name === 'CASE_STUDY_CONTENT' ? /^(\d+)\./.exec(path) : null;
      const cell = data ? tableCell(data, path) : null;
      const flags = new Set();
      if (name === 'TERMS' && at(data, path.replace(/\.[^.]+$/, ''))?.id === 'start') flags.add('terms-start');
      if (cell && inSourcedPriceTable(cell.table, cell.rowIndex)) flags.add('sourced-price-row');
      const ctx = {
        path,
        flags,
        engagementOf,
        projectNames,
        engagement: idMatch ? engagementOf(idMatch[1]) : undefined,
        heroText: data ? at(data, parentPath(path))?.hero_answer : undefined,
        sales: SALES_SURFACES.has(name),
        // The offer's own voice: sales surfaces other than the project studies.
        offer: SALES_SURFACES.has(name) && name !== 'CASE_STUDY_CONTENT',
      };
      const found = findHits(text, ctx);
      for (const x of found.exempt) exempt.push({ path, ...x });
      for (const h of found.hits) record(h.rule, h.level, path, h.sample, text, h.why);
    }

    // Prices: only where DevoraX states its own (see PRICE_SCOPE). The checklist
    // is the one insight in scope.
    const inScope =
      priceChecks && (name !== 'INSIGHTS' || at(data, path.replace(/^(\[\d+\]).*$/, '$1'))?.kind === 'checklist');
    if (inScope) {
      const cell = data ? tableCell(data, path) : null;
      // A third party's row in a table of read prices may state only listed
      // prices, even where one equals ours; everywhere else, ours or listed.
      const strict = cell && isPriceTable(cell.table) && isThirdPartyRow(cell.row);
      const bad = strict ? unlistedThirdPartyPrices(text, { market }) : unknownPrices(text, { own, market });
      for (const a of bad) {
        record(
          'price', 'error', path, a.raw, text,
          strict
            ? "a third party's price that no row of src/data/marketPrices.ts lists"
            : "not one of DevoraX's prices (the offer ladder, the two packages) and not a row of src/data/marketPrices.ts"
        );
      }
      for (const s of uncreditedAudit(text, { own })) {
        record('price-400-credited', 'warn', path, '$400', s, 'the $400 audit stands beside another DevoraX price without saying it is credited');
      }
    }

    // Terms parity: a restated fact must say what data/terms.ts says.
    if (name !== 'TERMS' && Number.isFinite(facts.defectDays)) {
      for (const m of termMismatches(text, facts)) {
        record('terms-parity', 'error', path, m.sample, text, `states ${m.found} for the ${m.fact}; data/terms.ts says ${m.expected}`);
      }
    }

    // Unattributed outcome figures, checked sentence by sentence.
    if (!rulesOn) continue;
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
  const ruleIds = [...RULES.map((r) => r.id), 'price', 'price-400-credited', 'terms-parity'];
  for (const id of ruleIds) {
    const h = hits[id] || [];
    if (!h.length) continue;
    const errs = h.filter((x) => x.level === 'error').length;
    errors += errs;
    warnings += h.length - errs;
    summary.push(`${id}=${h.length}`);
    const show = VERBOSE ? h : h.slice(0, 3);
    for (const x of show) report.push([`${name}.${x.path}`, x.level, id, `"${x.sample}" — ${x.why}`]);
    if (!VERBOSE && h.length > 3) report.push([`${name}`, h[0].level, id, `…and ${h.length - 3} more (--verbose to list)`]);
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
  if (allowed.length) {
    summary.push(`allowed=${allowed.length}`);
    if (VERBOSE) for (const x of allowed) report.push([`${name}.${x.path}`, 'info', `${x.rule} (allowed)`, `"${x.sample}" — ${x.why}`]);
  }
  console.log(`${name.padEnd(22)} ${summary.length ? summary.join('  ') : 'clean'}`);
}

for (const [file, name] of SOURCES) {
  let data;
  try { data = extract(file, name); }
  catch (e) { report.push([`${file}`, 'error', 'parse', e.message]); errors++; continue; }
  loaded[name] = data;
  auditSource({ file, name, data, items: strings(data) });
}

// constants.tsx holds the two package prices and the plan features (one says
// "35 Days Free Maintenance"). It exports no literal this can parse, so its
// quoted strings go through the price and parity checks.
try {
  const file = 'src/utils/constants/constants.tsx';
  const items = stringLiterals(readFileSync(file, 'utf8')).map((t, i) => [`literal[${i}]`, t]);
  auditSource({ file, name: 'CONSTANTS', data: null, items });
} catch (e) { report.push(['src/utils/constants/constants.tsx', 'error', 'parse', e.message]); errors++; }

/**
 * The market-prices table: one row per third-party price, with its source and
 * read date. A section is looked up by its id in the door or insight data, and
 * its heading, body and table cells are read as one text.
 */
{
  const sectionText = (place) => {
    const m = /^(solutions|insights)\/([^#]+)(?:#(.+))?$/.exec(place);
    if (!m) return null;
    const list = m[1] === 'solutions' ? loaded.SOLUTIONS : loaded.INSIGHTS;
    const entry = (list || []).find((e) => e.slug === m[2]);
    if (!entry) return null;
    const target = m[3] ? (entry.sections || []).find((s) => s.id === m[3]) : entry;
    if (!target) return null;
    return [...strings(target)].map(([, t]) => t).join('\n');
  };
  const issues = marketIssues(marketRows, { resolvePlace: sectionText });
  const nErr = issues.filter((i) => i.level === 'error').length;
  const summary = issues.length ? [...new Set(issues.map((i) => i.rule))].map((r) => `${r}=${issues.filter((i) => i.rule === r).length}`) : [];
  errors += nErr;
  warnings += issues.length - nErr;
  for (const i of issues) report.push([`MARKET_PRICES.${i.id}`, i.level, i.rule, i.detail]);
  console.log(`${'MARKET_PRICES'.padEnd(22)} rows=${marketRows.length}${summary.length ? '  ' + summary.join('  ') : '  clean'}`);
}

/**
 * Parity: facts that live in two places must say the same thing.
 *  - public/manifest.json is static, so it holds a copy of the entity
 *    statement; a stale copy is what profiles and app installs would show.
 *  - NEXT_START is set by hand each week. The pages fall back to "ask on the
 *    call" once its week has passed, but a stale date is a release blocker.
 *  - The brand is "DevoraX" and nothing else: BRAND_FACTS has that name and no
 *    alternateName (the schema and og:site_name are built from it).
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
if (loaded.BRAND_FACTS) {
  if (loaded.BRAND_FACTS.name !== 'DevoraX') parity.push(['src/data/brand.ts', 'brand', `BRAND_FACTS.name is "${loaded.BRAND_FACTS.name}"; it must be "DevoraX"`]);
  if ('alternateName' in loaded.BRAND_FACTS) parity.push(['src/data/brand.ts', 'brand', 'BRAND_FACTS has an alternateName; the brand has no alternate name']);
}
for (const [where, id, detail] of parity) report.push([where, 'error', id, detail]);
errors += parity.length;
console.log(`${'PARITY'.padEnd(22)} ${parity.length ? parity.map(([, id]) => id).join('  ') : 'clean'}`);

/**
 * Allow entries that excuse nothing any more: the sentence was fixed or moved,
 * and the entry should go. Only entries this audit judges (a file under src/,
 * as opposed to a URL path, which the rendered audit judges).
 */
for (const e of allow.entries) {
  if (allowKind(e) === 'static' && !e.used) {
    report.push([`scripts/audit-allow.json`, 'warn', 'allow-stale', `no match for "${e.sentence}" (${e.rule}) in ${e.where}; remove the entry`]);
    warnings++;
  }
  if (allowKind(e) === 'static' && e.approver === 'unreviewed') {
    report.push([`scripts/audit-allow.json`, 'info', 'allow-unreviewed', `"${e.sentence}" (${e.rule}) in ${e.where} still needs the owner's sign-off`]);
  }
}

if (report.length) {
  console.log('');
  for (const [where, level, id, detail] of report) {
    if (level === 'info' && !VERBOSE && id !== 'allow-unreviewed') continue;
    const mark = level === 'error' ? '✗' : level === 'info' ? '·' : '!';
    console.log(`  ${mark} [${id}] ${where}\n      ${detail}`);
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
