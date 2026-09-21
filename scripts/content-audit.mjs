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
 * Usage:  node scripts/content-audit.mjs            (exit 1 if any error-level hit)
 *         node scripts/content-audit.mjs --verbose  (print every hit, not a sample)
 */
import { readFileSync } from 'node:fs';

const VERBOSE = process.argv.includes('--verbose');

/** Pull an exported object/array literal out of a .ts module without compiling it. */
function extract(file, exportName) {
  const src = readFileSync(file, 'utf8');
  const decl = src.indexOf(`export const ${exportName}`);
  if (decl === -1) throw new Error(`${exportName} not found in ${file}`);
  const open = src.search.call(src, /[[{]/) && (() => {
    const i = src.indexOf('=', decl) + 1;
    let j = i;
    while (j < src.length && /\s/.test(src[j])) j++;
    return j;
  })();
  const start = open;
  const openCh = src[start];
  const closeCh = openCh === '[' ? ']' : '}';
  let depth = 0, inStr = null, esc = false, end = -1;
  for (let k = start; k < src.length; k++) {
    const ch = src[k];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === openCh) depth++;
    else if (ch === closeCh) { depth--; if (depth === 0) { end = k; break; } }
  }
  if (end === -1) throw new Error(`unbalanced literal for ${exportName} in ${file}`);
  return eval('(' + src.slice(start, end + 1) + ')');
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

const RULES = [
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
    id: 'self-superlative',
    level: 'warn',
    re: /\bwhere we are strongest\b|\bbest[- ]in[- ]class\b|\bindustry[- ]leading\b|\bunmatched\b|\bsecond to none\b/gi,
    why: 'unsupported self-grading',
  },
];

/** A figure is fine if its own sentence, or the one before it, names the source. */
const FIGURE = /\b\d+(?:\.\d+)?%|\$[\d,]+|\b\d[\d,.]*\s?(?:k|K|M|m|B|million|billion)\+?\b/;
const ATTRIBUTED =
  /client[- ]report|the client|reported by|client['’]s own|client['’]s systems|as reported|we (?:have not|did not|have no|publish no)|published (?:starting|tiers)|indicative|our own|not independently|not audited|is recorded|are recorded|the project records|not identified/i;
/**
 * Figures that are not client outcome claims and need no attribution: properties
 * of the build itself, standards, and OUR OWN published pricing — "$2,900 MVP
 * Starter" is our number, not a client's, so demanding a client attribution on
 * it is noise rather than rigour.
 */
const NOT_AN_OUTCOME =
  /inspection point|codebase|version|ISO |27001|GDPR|SOC ?2|http|px\b|\bv\d|\$2,900|\$7,500|MVP Starter|Growth projects|custom-scoped/i;

/** Pages selling or showcasing work. No methodology excuse applies here. */
const SALES_SURFACES = new Set(['CASE_STUDY_CONTENT', 'SERVICE_CONTENT', 'SOLUTIONS', 'FAQS']);

const SOURCES = [
  ['src/data/caseStudyContent.ts', 'CASE_STUDY_CONTENT'],
  ['src/data/serviceContent.ts', 'SERVICE_CONTENT'],
  ['src/data/insights.ts', 'INSIGHTS'],
  ['src/data/solutions.ts', 'SOLUTIONS'],
  ['src/data/faqs.ts', 'FAQS'],
  ['src/data/testimonials.ts', 'TESTIMONIALS'],
];

let errors = 0, warnings = 0;
const report = [];

for (const [file, name] of SOURCES) {
  let data;
  try { data = extract(file, name); }
  catch (e) { report.push([`${file}`, 'error', 'parse', e.message]); errors++; continue; }

  const hits = {};
  let figureHits = [];

  for (const [path, text] of strings(data)) {
    for (const rule of RULES) {
      const m = text.match(rule.re);
      if (m) {
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
    //  - `results[]` entries are bare label:value pairs ('Occupancy Rate: 87%')
    //    rendered inside a panel headed "Outcomes reported by the client" with a
    //    provenance note beneath it. The attribution lives in the component, not
    //    the string, so requiring it inline would force redundant prose.
    const selfDerived =
      (name === 'INSIGHTS' && /\b(?:25|our|we)\b/i.test(text)) ||
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

  console.log(`${name.padEnd(22)} ${summary.length ? summary.join('  ') : 'clean'}`);
}

if (report.length) {
  console.log('');
  for (const [where, level, id, detail] of report) {
    console.log(`  ${level === 'error' ? '✗' : '!'} [${id}] ${where}\n      ${detail}`);
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
