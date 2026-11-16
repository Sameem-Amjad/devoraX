/**
 * Reading the site's data files without compiling TypeScript.
 *
 * Shared by the static audit (scripts/content-audit.mjs), the rendered audit
 * (scripts/audit-rendered.mjs) and the self-test, so all three read a literal
 * the same way. The constraint that shapes every data file the audit reads: a
 * literal is evaluated as text with only its own module's plain constants in
 * scope, so it cannot reference an imported value. Do not design a data file
 * whose literal needs an import to evaluate.
 */
import { readFileSync } from 'node:fs';

/**
 * The plain constants a module declares (`const NAME = 'text'` or a number),
 * so a literal that interpolates one (terms.ts: `${AUDIT_TURNAROUND_WORKING_DAYS}`)
 * or names one (`id: NEXT_START_TERM_ID`) evaluates to what the page renders.
 */
export function moduleConstants(src) {
  const scope = {};
  const re = /(?:export\s+)?const\s+([A-Z][A-Z0-9_]*)\s*(?::[^=;]+)?=\s*('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|-?\d+(?:\.\d+)?)\s*;/g;
  for (let m; (m = re.exec(src)); ) scope[m[1]] = eval(m[2]);
  return scope;
}

/**
 * Pull an exported literal (object, array or string) out of a .ts module
 * without compiling it.
 */
export function extract(file, exportName) {
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
export function* strings(node, path = '') {
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
export function at(root, path) {
  let node = root;
  for (const m of path.matchAll(/\[(\d+)\]|\.?([A-Za-z_$][\w$]*)/g)) {
    if (node == null) return undefined;
    node = node[m[1] !== undefined ? Number(m[1]) : m[2]];
  }
  return node;
}

/** The quoted string literals in a source file's text, for files that hold copy but no exported literal. */
export function stringLiterals(src) {
  const out = [];
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g;
  for (let m; (m = re.exec(src)); ) out.push((m[1] ?? m[2]).replace(/\\(['"\\])/g, '$1'));
  return out;
}

/**
 * The two new-build package prices, read from the pricing plans in
 * constants.tsx (`price: "$2,900"`). Read rather than typed into the audit, so a
 * price change there changes what the audit allows.
 */
export function packagePrices(file = 'src/utils/constants/constants.tsx') {
  const src = readFileSync(file, 'utf8');
  const block = /const PRICING_PLANS\s*=\s*\[([\s\S]*?)\n\];/.exec(src)?.[1] ?? '';
  const amounts = [];
  for (const m of block.matchAll(/\bprice:\s*["']\$\s?(\d[\d,]*(?:\.\d+)?)["']/g)) {
    amounts.push(Number(m[1].replace(/,/g, '')));
  }
  return amounts;
}

/**
 * Every amount DevoraX itself may state: the OFFER_LADDER's schema amounts and
 * the dollar amounts in each step's printed price, plus the package prices.
 */
export function ownPrices(offerFile = 'src/data/offer.ts', constantsFile = 'src/utils/constants/constants.tsx') {
  const own = new Set();
  const ladder = extract(offerFile, 'OFFER_LADDER');
  for (const step of ladder) {
    if (typeof step.schemaPrice?.amount === 'number') own.add(step.schemaPrice.amount);
    for (const m of (step.price || '').matchAll(/\$\s?(\d[\d,]*(?:\.\d+)?)/g)) own.add(Number(m[1].replace(/,/g, '')));
  }
  const packages = packagePrices(constantsFile);
  for (const a of packages) own.add(a);
  return { own, ladder, packages };
}
