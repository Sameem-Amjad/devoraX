// Generates the public checklist repository (README.md and LICENSE.md) from the
// checklist entry in src/data/insights.ts, so the README cannot drift from the site.
//
// Usage: node scripts/export-checklist.mjs [outputDir]
// outputDir defaults to strategy/checklist-repo under the repo root. A relative
// outputDir is resolved against the current directory.

import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// The same reader the content audits use: it evaluates the literal's text, so
// nothing here compiles TypeScript.
import { extract } from './lib/read-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INSIGHTS_FILE = path.join(ROOT, 'src', 'data', 'insights.ts');
const DEFAULT_OUT_DIR = path.join(ROOT, 'strategy', 'checklist-repo');

const SLUG = 'vibe-coded-app-security-checklist';
const SITE = 'https://thedevorax.tech';
const PAGE_URL = `${SITE}/insights/${SLUG}`;
const INTRO = `The canonical version of this checklist, with the reasoning behind each check, is at ${PAGE_URL}. This repository holds the same checks and their tests.`;
const LICENCE = 'This checklist is published under the Creative Commons Attribution 4.0 International licence (CC BY 4.0): https://creativecommons.org/licenses/by/4.0/. Credit: DevoraX, https://thedevorax.tech.';

function fail(message) {
  console.error(`export-checklist: ${message}`);
  process.exit(1);
}

// Turns a checklist text value into README text: one line, with links that work on GitHub.
function readmeText(text) {
  const oneLine = String(text).replace(/\s*\r?\n\s*/g, ' ').trim();
  return oneLine.replace(/\[([^\]]*)\]\(([^)\s]*)\)/g, (link, anchor, target) => {
    if (target.startsWith('#')) return `[${anchor}](${PAGE_URL}${target})`;
    if (target.startsWith('/book')) return anchor;
    if (target.startsWith('/')) return `[${anchor}](${SITE}${target})`;
    return link;
  });
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function main() {
  const outDir = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : DEFAULT_OUT_DIR;

  let insights;
  try {
    insights = extract(INSIGHTS_FILE, 'INSIGHTS');
  } catch (err) {
    fail(`could not read INSIGHTS from src/data/insights.ts: ${err.message}`);
  }
  if (!Array.isArray(insights)) fail('INSIGHTS in src/data/insights.ts is not an array');

  const entry = insights.find((i) => i && i.kind === 'checklist' && i.slug === SLUG);
  if (!entry) fail(`no entry with kind "checklist" and slug "${SLUG}" in src/data/insights.ts`);
  if (!Array.isArray(entry.items) || entry.items.length === 0) fail(`the checklist entry "${SLUG}" has no items`);

  entry.items.forEach((item, n) => {
    for (const key of ['id', 'group', 'check', 'test']) {
      if (typeof item[key] !== 'string' || item[key].trim() === '') {
        fail(`item ${n + 1} of "${SLUG}" has no ${key}`);
      }
    }
  });

  const groups = new Map();
  for (const item of entry.items) {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group).push(item);
  }

  const lines = [`# ${readmeText(entry.title)}`, '', INTRO, ''];
  if (entry.updated) {
    const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(entry.updated));
    if (!m) fail(`the "updated" value of "${SLUG}" is not a date: ${entry.updated}`);
    lines.push(`Last updated: ${m[1]}`, '');
  }
  lines.push(`${plural(entry.items.length, 'check')} in ${plural(groups.size, 'group')}.`, '');

  for (const [group, items] of groups) {
    lines.push(`## ${group}`, '');
    for (const item of items) {
      lines.push(
        `### ${readmeText(item.check)}`,
        '',
        `**Test:** ${readmeText(item.test)}`,
        '',
        `[Why it matters, on the checklist page](${PAGE_URL}#item-${item.id})`,
        ''
      );
    }
  }
  lines.push('## Licence', '', LICENCE, '');

  mkdirSync(outDir, { recursive: true });
  const readmePath = path.join(outDir, 'README.md');
  const licencePath = path.join(outDir, 'LICENSE.md');
  writeFileSync(readmePath, lines.join('\n'));
  writeFileSync(licencePath, `${LICENCE}\n`);

  console.log(`Wrote ${readmePath}`);
  console.log(`Wrote ${licencePath}`);
  console.log(`${plural(entry.items.length, 'item')} in ${plural(groups.size, 'group')}`);
}

main();
