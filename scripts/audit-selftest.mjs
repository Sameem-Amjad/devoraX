#!/usr/bin/env node
/**
 * Self-test of the content-audit rules.
 *
 * A rule nobody has seen fail is a rule nobody can trust: a pattern loosened to
 * silence a false positive can stop catching the thing it exists for, and an
 * audit that passes proves nothing until it has been shown to fail. For each
 * rule family this holds sentences that must be caught and sentences that must
 * pass (a denial such as "No one can guarantee App Store approval" among them),
 * and runs them through the same code the two audits import
 * (scripts/lib/claims-rules.mjs and scripts/lib/page-rules.mjs). It also runs
 * small HTML fixtures through the rendered-page checks, offline.
 *
 *   npm run audit:selftest        exits 0 when every case behaves, 1 otherwise
 *
 * Expected values (the defect window, the audit turnaround) are read from
 * data/terms.ts, as the audits read them; nothing here restates them.
 * Plain Node 20, no dependencies, no network.
 */
import { fileURLToPath } from 'node:url';
import { extract, ownPrices } from './lib/read-data.mjs';
import {
  findHits,
  fieldOf,
  moneyAmounts,
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
  daysSince,
  MARKET_STALE_DAYS,
} from './lib/claims-rules.mjs';
import { parsePage, checkPage, textBlocks } from './lib/page-rules.mjs';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

let passed = 0;
const failures = [];
let family = '';
const section = (name) => { family = name; };
function check(label, ok, detail = '') {
  if (ok) passed++;
  else failures.push(`[${family}] ${label}${detail ? ` (${detail})` : ''}`);
}
const ruleIds = (text, ctx) => findHits(text, ctx).hits.map((h) => h.rule);
/** The text must produce a hit of this rule. */
const caught = (rule, text, ctx = {}) => check(`caught: ${text}`, ruleIds(text, ctx).includes(rule), `wanted ${rule}, got ${ruleIds(text, ctx).join(', ') || 'nothing'}`);
/** The text must not produce a hit of this rule. */
const passes = (rule, text, ctx = {}) => check(`passes: ${text}`, !ruleIds(text, ctx).includes(rule), `${rule} fired`);

/* A small ledger, standing in for data/projectIndex.ts. */
const ledger = { 17: 'devorax-client', 19: 'sameem-direct', 23: 'employer', 35: 'poc', 37: 'demo' };
const engagementOf = (id) => ledger[Number(id)] ?? 'unstated';
const projectNames = [{ id: 17, name: 'Koor' }, { id: 19, name: 'Three28' }, { id: 23, name: 'Pastel' }];

/* ───────────────────────── claims ───────────────────────── */
section('approval');
caught('approval', 'We make sure it passes review the first time.');
caught('approval', 'We keep going until it is approved.');
caught('approval', 'Guaranteed approval on your first submission.');
caught('approval', 'We get it approved.');
caught('approval', 'Our App Store approval rate is high.');
passes('approval', 'No one can guarantee App Store approval.');
passes('approval', 'It is a build that didn\'t pass review.');
passes('approval', 'The stores decide approval. We prepare the app, submit it and answer the reviewers.');
passes('approval', "Apple's own page says a submission that didn't pass review gets a message.");

section('guarantee');
caught('guarantee', 'We guarantee the result.', { offer: true });
caught('guarantee', 'We guarantee approval.', { offer: true });
passes('guarantee', 'We cannot guarantee a launch date.', { offer: true });
passes('guarantee', 'No one can guarantee approval.', { offer: true });
passes('guarantee', '**Can you guarantee approval?** No one can. The stores decide approval.', { offer: true });
passes('guarantee', 'The database guarantees the order of writes.', { offer: false });

section('outcome-as-offer');
caught('outcome-as-offer', 'Take your Lovable app to the App Store and Google Play', { field: 'title', heroText: 'A native shell for your web app.' });
caught('outcome-as-offer', 'Get your app into the Google Play store', { field: 'h1', heroText: '' });
caught('outcome-as-offer', 'Put your Base44 app on the App Store? Take your app to the App Store', { field: 'h1', heroText: 'Nothing about approval.' });
passes('outcome-as-offer', 'Take your Lovable app to the App Store and Google Play', { field: 'title', heroText: 'We submit it and answer the reviewers. The stores decide approval.' });
passes('outcome-as-offer', 'Take your app to the App Store, as the founder asked.', { field: 'body', heroText: '' });
passes('outcome-as-offer', 'Prepare and submit your Lovable app', { field: 'title', heroText: '' });
// The audits tell a field from its data path; "h1" ends in a digit.
check('fieldOf reads h1, title, seo_title, meta_description, hero_answer, q', ['[6].h1', '[6].title', '[3].seo_title', '[0].meta_description', '[2].hero_answer', '[4].faqs[1].q'].map(fieldOf).join() === 'h1,title,title,meta,hero,question');
caught('outcome-as-offer', 'Take your Lovable app to the App Store', { path: '[6].h1', heroText: '' });
caught('outcome-as-offer', 'Take your Lovable app to the App Store', { path: '[6].title', heroText: '' });
passes('outcome-as-offer', 'Take your Lovable app to the App Store', { path: '[6].h1', heroText: 'The stores decide approval.' });

section('turnaround');
caught('turnaround', 'Response within 24h, every time.');
caught('turnaround', 'You get a fixed-price proposal within 48 hours.');
caught('turnaround', 'We reply within two business days.');
caught('turnaround', 'Scope, timeline and an honest number.');
caught('turnaround', 'Apple reviews "90% in less than 48 hours".');
passes('turnaround', 'The audit report usually arrives 2 working days after we get access to the code.');
passes('turnaround', 'A finish sprint usually takes 1-2 weeks.');
passes('turnaround', 'Within 30 days, fixes are free.', { flags: new Set(['terms-start']) });
passes('turnaround', 'Credited against fixes committed within 30 days', { flags: new Set(['sourced-price-row']) });
passes('turnaround', 'Apple says it reviews "90% in less than 48 hours" ([Apple](https://developer.apple.com/distribute/app-review/)).');
passes('turnaround', 'Apple says it reviews "90% in less than 48 hours".', { links: ['https://developer.apple.com/distribute/app-review/'] });

section('credential');
caught('credential', 'We are Sharetribe experts.');
caught('credential', "We're a certified agency.");
caught('credential', 'DevoraX is an official partner of Lovable.');
passes('credential', 'We are not certified by Apple or Google.');
passes('credential', 'We are listed in the Experts directory.');
passes('credential', 'DevoraX holds no certifications.');

section('platform-credential');
caught('platform-credential', 'Sameem is a Lovable expert.');
caught('platform-credential', 'We are your Base44 partner for launches.');
passes('platform-credential', 'Lovable lists its own "Lovable partners" in a directory, and we are not one of them.');
passes('platform-credential', 'Do we have to hire a Sharetribe Expert?');
passes('platform-credential', 'The guide was written by two independent Sharetribe Experts.');
passes('platform-credential', 'Browse the Lovable Experts directory.');

section('agency-attribution');
caught('agency-attribution', 'Our clients include founders in four countries.');
caught('agency-attribution', 'Our own clients rate us 5.0.');
caught('agency-attribution', 'Ask one of our client teams.');
caught('agency-attribution', 'DevoraX built the marketplace.');
caught('agency-attribution', 'The app was built by DevoraX.');
passes('agency-attribution', 'A client who hired DevoraX through Fiverr.');
passes('agency-attribution', 'Sameem worked on it as an engineer at another company.');
passes('agency-attribution', 'Clients own the code on final payment.');

section('case-study-label');
caught('case-study-label', 'Read the case study.');
caught('case-study-label', 'Three case studies of our work.', { engagement: 'fiverr' });
caught('case-study-label', 'See the case study of the project: [Three28](/projects/19).', { engagementOf });
caught('case-study-label', "Pastel's case study shows the iOS app.", { engagementOf, projectNames });
caught('case-study-label', "Koor and Pastel each have a case study.", { engagementOf, projectNames });
caught('devorax-case-study', 'A DevoraX case study of the marketplace.', { engagement: 'devorax-client' });
caught('devorax-case-study', "DevoraX's case studies are here.");
passes('case-study-label', 'Tallyfile Case Study', { engagement: 'devorax-client' });
passes('case-study-label', 'We call a page a case study only when a client contracted DevoraX for the work.');
passes('case-study-label', 'See the case study at [Koor](/projects/17).', { engagementOf });
passes('case-study-label', "Koor's case study covers the multi-vendor version.", { engagementOf, projectNames });
passes('case-study-label', 'View case study', { links: ['/projects/17'], engagementOf });
passes('case-study-label', 'The write-up of this project is an engineering write-up.', { engagement: 'sameem-direct' });
passes('devorax-case-study', 'Koor Case Study', { engagement: 'devorax-client' });

section('demo-wording');
caught('demo-wording', 'The app shipped to the App Store last year.', { engagement: 'demo' });
caught('demo-wording', 'We launched it on Google Play.', { engagement: 'demo' });
caught('demo-wording', 'It is live on the App Store.', { engagement: 'poc' });
caught('demo-wording', 'It has been running in production since March.', { engagement: 'poc' });
passes('demo-wording', 'The live demo runs on sample data.', { engagement: 'demo' });
passes('demo-wording', 'It was never launched and is not in production.', { engagement: 'demo' });
passes('demo-wording', 'The app shipped to the App Store last year.', { engagement: 'sameem-direct' });
passes('demo-wording', 'It is live on the App Store.', { engagement: 'devorax-client' });

section('other claims');
caught('client-reported', 'The client reports 2.4M users.');
passes('client-reported', 'The store listing shows 100K+ downloads.');
caught('db-column-name', 'It reads the stats field of each row.');
passes('db-column-name', 'It lists the number of downloads.');
caught('rescue', 'We rescue stalled apps.');
passes('rescue', 'We finish and ship stuck apps.');
caught('brand-variant', 'Devora builds apps.');
passes('brand-variant', 'DevoraX builds apps.');
passes('brand-variant', 'Visit thedevorax.tech.');
caught('record-as-document', 'The record states the client name.');
passes('record-as-document', 'The store listing states the release month.');
check('record-as-document is an error on a sales surface', findHits('The record states it.', { sales: true }).hits[0]?.level === 'error');
check('record-as-document is a warning elsewhere', findHits('The record states it.', { sales: false }).hits[0]?.level === 'warn');

/* ───────────────────────── prices ───────────────────────── */
section('money amounts');
{
  const one = (t) => moneyAmounts(t)[0];
  check('$400', one('$400, credited')?.amount === 400);
  check('$1,200', one('a $1,200 week')?.amount === 1200);
  check('US$25', one('US$25, one time')?.amount === 25);
  check('$349.50', one('$349.50 flat')?.amount === 349.5);
  check('99 USD', one('99 USD per membership year')?.amount === 99);
  check('£1,500', one('From £1,500')?.currency === 'GBP' && one('From £1,500')?.amount === 1500);
  check('$3k', one('about $3k a year')?.amount === 3000);
  check('no amount in a percentage', moneyAmounts('Around 1.5-3% of each transaction').length === 0);
  check('25¢ is not a dollar amount', moneyAmounts('0.25% + 25¢ per payout').length === 0);
}

section('price');
{
  const { own } = ownPrices();
  const market = marketAmounts([
    { amounts: [99], currency: 'USD' },
    { amounts: [95], currency: 'GBP' },
  ]);
  const unknown = (t) => unknownPrices(t, { own, market }).map((a) => a.amount);
  check('our own price passes', unknown('The audit costs $400, credited to the fix.').length === 0);
  check('the package prices pass', unknown('MVP Starter from $2,900 and Growth from $7,500.').length === 0);
  check('a listed third-party price passes', unknown("Apple's program is $99 a year.").length === 0);
  check('a listed pound price passes', unknown('A paid review costs £95.').length === 0);
  check('an unlisted dollar amount is caught', unknown('The audit costs $450.').join() === '450');
  check('an invented DevoraX price is caught', unknown('Care is $2,000 a month.').join() === '2000');
  check('a pound amount does not borrow a dollar listing', unknown('A review for £400.').join() === '400');
  check('an unlisted third-party price is caught', unlistedThirdPartyPrices('Hosting is $29 a month.', { market }).length === 1);
  check("a third party's price equal to ours is still caught", unlistedThirdPartyPrices('From $1,200 a month.', { market }).length === 1);
  check('a listed third-party price passes the strict check', unlistedThirdPartyPrices('$99 a year', { market }).length === 0);

  check('$400 beside another DevoraX price without "credited" is caught', uncreditedAudit('The audit is $400 and a finish sprint is $1,200 a week.', { own }).length === 1);
  check('$400 with "credited" passes', uncreditedAudit('The audit is $400, credited to the fix, and a finish sprint is $1,200 a week.', { own }).length === 0);
  check('$400 alone passes', uncreditedAudit('The audit is $400.', { own }).length === 0);
  check('$400 and another price in different sentences passes', uncreditedAudit('The audit is $400. A finish sprint is $1,200 a week.', { own }).length === 0);
  check('$400 beside a third-party price passes', uncreditedAudit('The audit is $400; another firm charges $4,000.', { own }).length === 0);

  const sourced = { caption: 'Prices read 7 November 2026', headers: ['Vendor', 'Price', 'Source'], rows: [['Vendor A', '$10', 'a.example.com'], ['DevoraX, audit', '$400', 'thedevorax.tech']] };
  check('a third party row of a dated, sourced table is excused', inSourcedPriceTable(sourced, 0));
  check("DevoraX's own row of that table is not", !inSourcedPriceTable(sourced, 1));
  check('a table with no Source column is not sourced', !inSourcedPriceTable({ ...sourced, headers: ['Vendor', 'Price'] }, 0));
  check('a table with no date is not sourced', !inSourcedPriceTable({ ...sourced, caption: 'Prices' }, 0));
  check('a price table is told by its Price column and read date', isPriceTable(sourced));
  check('a table without a read date is not a price table', !isPriceTable({ ...sourced, caption: 'Prices' }));
  check('a DevoraX row is not a third-party row', !isThirdPartyRow(['DevoraX, audit', '$400', 'x']));
  check('a row about "our" work is not a third-party row', !isThirdPartyRow(['A custom app', 'A developer you hire, such as us', '$1,200']));
  check('a vendor row is a third-party row', isThirdPartyRow(['Vendor A', 'From $10', 'a.example.com']));
}

section('market prices table');
{
  const now = new Date('2026-12-01T00:00:00Z');
  const row = (over = {}) => ({
    id: 'r1', vendor: 'V', item: 'I', printed: '$10 a month', amounts: [10], currency: 'USD',
    source_url: 'https://v.example.com/pricing', checked_on: '2026-11-07', used_in: ['solutions/x#cost'], ...over,
  });
  const place = (text) => (p) => (p === 'solutions/x#cost' ? text : null);
  const issues = (rows, text = 'Hosting: $10 a month') => marketIssues(rows, { now, resolvePlace: place(text) });
  const has = (list, level, rule) => list.some((i) => i.level === level && i.rule === rule);

  check('a complete, used, fresh row is clean', issues([row()]).length === 0);
  check('no source URL is an error', has(issues([row({ source_url: '' })]), 'error', 'market-source'));
  check('a source that is not a URL is an error', has(issues([row({ source_url: 'v.example.com' })]), 'error', 'market-source'));
  check('no checked_on is an error', has(issues([row({ checked_on: '' })]), 'error', 'market-date'));
  check('a checked_on that is not an ISO date is an error', has(issues([row({ checked_on: '7 Nov 2026' })]), 'error', 'market-date'));
  check(`older than ${MARKET_STALE_DAYS} days is a warning`, has(issues([row({ checked_on: '2026-08-01' })]), 'warn', 'market-stale'));
  check(`exactly ${MARKET_STALE_DAYS} days is not stale`, !has(issues([row({ checked_on: '2026-09-02' })]), 'warn', 'market-stale'));
  check('daysSince counts whole days', daysSince('2026-11-07', now) === 24);
  check('a row nothing uses (printed text gone) is a warning', has(issues([row()], 'Hosting: $12 a month'), 'warn', 'market-unused'));
  check('a row whose page does not exist is a warning', has(issues([row({ used_in: ['solutions/gone#cost'] })]), 'warn', 'market-unused'));
  check('a row with no used_in is a warning', has(issues([row({ used_in: [] })]), 'warn', 'market-unused'));
  check('amounts that differ from the printed text are an error', has(issues([row({ amounts: [11] })]), 'error', 'market-row'));
  check('a duplicate id is an error', has(issues([row(), row()]), 'error', 'market-row'));
  check('a percentage row (no amounts) is clean', issues([row({ printed: 'Around 2% of each sale', amounts: [] })], 'Fees: Around 2% of each sale').length === 0);
  // The real table must at least be self-consistent: sources, dates and amounts.
  const real = extractSafe('src/data/marketPrices.ts', 'MARKET_PRICES');
  check('src/data/marketPrices.ts reads', Array.isArray(real) && real.length > 0);
  if (Array.isArray(real)) {
    const errs = marketIssues(real, { now: new Date() }).filter((i) => i.level === 'error');
    check('src/data/marketPrices.ts has no row with a missing source, date or wrong amounts', errs.length === 0, errs.map((e) => `${e.id}: ${e.detail}`).join('; '));
  }
}

function extractSafe(file, name) {
  try { return extract(file, name); } catch { return null; }
}

/* ───────────────────────── terms parity ───────────────────────── */
section('terms parity');
{
  const facts = termFacts();
  check('terms.ts yields a defect window and an audit turnaround', Number.isFinite(facts.defectDays) && Number.isFinite(facts.turnaroundDays), JSON.stringify(facts));
  const d = facts.defectDays, other = d + 5, t = facts.turnaroundDays, otherT = t + 1;
  const bad = (text) => termMismatches(text, facts).length > 0;
  check('another defect window is caught', bad(`Defects are fixed free for ${other} days after handover.`));
  check('another window in "days of free maintenance" is caught', bad(`Every build includes ${other} days of free maintenance after launch.`));
  check('another window in "-day defect window" is caught', bad(`After the ${other}-day defect window, monthly care applies.`));
  check('another window in "the same N days" is caught', bad(`A sprint carries the same ${other} days.`));
  check('the terms.ts defect window passes', !bad(`Defects are fixed free for ${d} days after handover, and every build includes ${d} days of free maintenance after the ${d}-day defect window.`));
  check('another audit turnaround is caught', bad(`The audit report usually arrives ${otherT} working days after we get access.`));
  check('the terms.ts audit turnaround passes', !bad(`The audit report usually arrives ${t} working days after we get access.`));
  check('an unrelated number of days passes', !bad('Google Play needs 12 testers for 14 days, and D&B takes up to 5 business days.'));
  check('working days in a sentence about something else pass', !bad('The team works 5 working days a week.'));
  // Every sentence of terms.ts itself agrees with its own facts.
  const own = extract('src/data/terms.ts', 'TERMS').filter((x) => termMismatches(x.answer, facts).length);
  check('data/terms.ts agrees with itself', own.length === 0, own.map((x) => x.id).join(', '));
}

/* ───────────────────────── allow file ───────────────────────── */
section('allow file');
{
  const entries = [
    { where: 'src/data/x.ts', sentence: 'only a Sharetribe Expert', rule: 'platform-credential', reason: 'r', approver: 'unreviewed', date: '2026-11-16', used: 0 },
  ];
  check('an entry excuses its own sentence, rule and place', Boolean(findAllow(entries, { where: 'src/data/x.ts', rule: 'platform-credential', text: 'He is  only a Sharetribe\nExpert here.' })));
  check('an entry does not excuse another rule', !findAllow(entries, { where: 'src/data/x.ts', rule: 'credential', text: 'only a Sharetribe Expert' }));
  check('an entry does not excuse another place', !findAllow(entries, { where: 'src/data/y.ts', rule: 'platform-credential', text: 'only a Sharetribe Expert' }));
  check('an entry does not excuse another sentence', !findAllow(entries, { where: 'src/data/x.ts', rule: 'platform-credential', text: 'a different sentence' }));
  check('a used entry is counted, so an unused one can be called stale', entries[0].used === 1);
  const real = loadAllow();
  check('scripts/audit-allow.json is valid', real.problems.length === 0, real.problems.join('; '));
  check('every allow entry has an approver', real.entries.every((e) => e.approver), '');
}

/* ───────────────────────── rendered pages ───────────────────────── */
section('rendered pages');
{
  const { own } = ownPrices();
  const market = marketAmounts([{ amounts: [99], currency: 'USD' }]);
  const facts = termFacts();
  const env = (path) => ({ path, engagementOf, projectNames, own, market, facts, allow: [] });
  const page = ({ title = 'A page | DevoraX', desc = 'A description.', h1 = 'A heading', main = '<p>Fine.</p>', site = 'DevoraX', ld = '' } = {}) => `<!doctype html><html><head><title>${title}</title>
    <meta name="description" content="${desc}"/><meta name="DC.description" content="not the description"/><meta property="og:site_name" content="${site}"/>
    ${ld ? `<script type="application/ld+json">${ld}</script>` : ''}</head>
    <body><header><a href="/">DevoraX</a></header><main id="main-content"><h1>${h1}</h1>${main}</main><footer>Footer</footer>
    <script>var x = "Case Study shipped within 24h";</script></body></html>`;
  const run = (path, html) => checkPage(parsePage(html), env(path));
  const rules = (path, html) => run(path, html).hits.map((h) => h.rule);

  check('a clean page has no hit', run('/about', page()).hits.length === 0, JSON.stringify(run('/about', page()).hits));
  check('script text is not page copy', !rules('/about', page()).includes('case-study-label'));
  check('the real meta description is read, not DC.description', parsePage(page({ desc: 'Real one.' })).description === 'Real one.');
  check('the H1 is read', parsePage(page({ h1: 'Hello' })).h1s[0] === 'Hello');

  check('"Case Study" on a project that is not devorax-client is caught', rules('/projects/19', page({ main: '<p>A Case Study of the work.</p>' })).includes('case-study-label'));
  check('"Case Study" in the title of a non-client project is caught', rules('/projects/19', page({ title: 'Three28 Case Study | DevoraX' })).includes('case-study-label'));
  check('"Case Study" on a devorax-client project passes', !rules('/projects/17', page({ title: 'Koor Case Study | DevoraX', main: '<p>The Case Study.</p>' })).includes('case-study-label'));
  check('the /terms explanation of the label passes', !rules('/terms', page({ main: '<p>We call a page a case study only when a client contracted DevoraX for the work.</p>' })).includes('case-study-label'));
  check('a card that links to a devorax-client project passes', !rules('/projects', page({ main: '<a href="/projects/17"><div>Koor</div><div>View case study</div></a>' })).includes('case-study-label'));
  check('a card that links to another project is caught', rules('/projects', page({ main: '<a href="/projects/19"><div>Three28</div><div>View case study</div></a>' })).includes('case-study-label'));
  check('"DevoraX case study" is caught on a client page', rules('/projects/17', page({ main: '<p>A DevoraX case study.</p>' })).includes('devorax-case-study'));
  check('"our clients" in a component is caught', rules('/about', page({ main: '<p>Trusted by our clients.</p>' })).includes('agency-attribution'));

  check('"shipped" on a demo project page is caught', rules('/projects/37', page({ main: '<p>The app shipped last year.</p>' })).includes('demo-wording'));
  check('"launched" on a proof-of-concept page is caught', rules('/projects/35', page({ main: '<p>We launched it.</p>' })).includes('demo-wording'));
  check('"live demo" on a demo page passes', !rules('/projects/37', page({ main: '<p>Open the live demo.</p>' })).includes('demo-wording'));
  check('"shipped" on a non-demo project page passes', !rules('/projects/19', page({ main: '<p>The app shipped last year.</p>' })).includes('demo-wording'));

  check('an approval promise in <main> is caught', rules('/about', page({ main: '<p>We get it approved.</p>' })).includes('approval'));
  check('a denial in <main> passes', !rules('/about', page({ main: '<p>No one can guarantee App Store approval.</p>' })).includes('approval'));
  check('an approval promise in the meta description is caught', rules('/about', page({ desc: 'We get it approved.' })).includes('approval'));
  check('a turnaround promise in an H1 is caught', rules('/about', page({ h1: 'Response within 24h' })).includes('turnaround'));
  check('outcome-as-offer in an H1 warns without the sentence', run('/solutions/x', page({ h1: 'Take your app to the App Store' })).hits.some((h) => h.rule === 'outcome-as-offer' && h.level === 'warn'));
  check('outcome-as-offer in an H1 passes when the page says the stores decide', !rules('/solutions/x', page({ h1: 'Take your app to the App Store', main: '<p>The stores decide approval.</p>' })).includes('outcome-as-offer'));
  check('a question block ending in "?" passes the platform rule', !rules('/about', page({ main: '<button>Do we have to hire a Sharetribe Expert?</button>' })).includes('platform-credential'));

  check('an unlisted price on a door page is caught', rules('/solutions/x', page({ main: '<p>The audit is $450.</p>' })).includes('price'));
  check('our price on a door page passes', !rules('/solutions/x', page({ main: '<p>The audit is $400, credited to the fix.</p>' })).includes('price'));
  check('a price on a project page is out of scope', !rules('/projects/19', page({ main: '<p>Plans from $24,680.</p>' })).includes('price'));
  check('"$400" beside $1,200 without "credited" warns on a door page', rules('/solutions/x', page({ main: '<p>The audit is $400 and a sprint is $1,200 a week.</p>' })).includes('price-400-credited'));
  check('another defect window on /pricing is caught', rules('/pricing', page({ main: '<p>Defects are fixed free for 60 days after handover.</p>' })).includes('terms-parity'));
  check('a third party row of a sourced table is excused for turnaround', !rules('/solutions/x', page({ main: '<table><caption>Prices read 7 November 2026</caption><thead><tr><th>Vendor</th><th>Price</th><th>Terms</th><th>Source</th></tr></thead><tbody><tr><td>Vendor A</td><td>$99 a year</td><td>Credit within 30 days</td><td>a.example.com, read 7 Nov 2026</td></tr></tbody></table>' })).includes('turnaround'));
  check('DevoraX\'s own row of that table is not excused', rules('/solutions/x', page({ main: '<table><caption>Prices read 7 November 2026</caption><thead><tr><th>Vendor</th><th>Price</th><th>Terms</th><th>Source</th></tr></thead><tbody><tr><td>DevoraX, audit</td><td>$400, credited</td><td>Reply within 24 hours</td><td>thedevorax.tech, read 7 Nov 2026</td></tr></tbody></table>' })).includes('turnaround'));

  const ldOrg = (extra = '') => JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'Organization', name: 'DevoraX', ...JSON.parse(extra || '{}') }, { '@type': 'WebSite', name: 'DevoraX' }] });
  check('og:site_name other than DevoraX is caught', rules('/about', page({ site: 'Devora' })).includes('brand-parity'));
  check('an alternateName on the Organization is caught', rules('/about', page({ ld: ldOrg('{"alternateName":"Devora"}') })).includes('brand-parity'));
  check('an Organization name other than DevoraX is caught', rules('/about', page({ ld: JSON.stringify({ '@type': 'Organization', name: 'Devora' }) })).includes('brand-parity'));
  check('matching brand data passes', !rules('/about', page({ ld: ldOrg() })).includes('brand-parity'));
  check('"Devora" alone in the header is caught', rules('/about', page().replace('<a href="/">DevoraX</a>', '<a href="/">Devora</a>')).includes('brand-variant'));
  check('an Offer price that is not ours is caught on a door page', rules('/solutions/x', page({ ld: JSON.stringify({ '@type': 'Offer', price: 450 }) })).includes('price'));
  check('an Offer price that is ours passes', !rules('/solutions/x', page({ ld: JSON.stringify({ '@type': 'Offer', price: 400 }) })).includes('price'));

  check('a JSON-LD name that says "Case Study" on a non-client project page is caught', rules('/projects/19', page({ ld: JSON.stringify({ '@type': 'WebPage', name: 'Three28 Case Study' }) })).includes('case-study-label'));
  check('a JSON-LD name that says "Case Study" on a devorax-client page passes', !rules('/projects/17', page({ ld: JSON.stringify({ '@type': 'WebPage', name: 'Koor Case Study' }) })).includes('case-study-label'));
  check('a JSON-LD answer that promises approval is caught', rules('/about', page({ ld: JSON.stringify({ '@type': 'Answer', text: 'Yes, we get it approved.' }) })).includes('approval'));

  const blocks = textBlocks('<p>One <strong>two</strong></p><ul><li>Three</li><li>Four <a href="/projects/17">link</a></li></ul>');
  check('blocks split at block elements and join inline ones', blocks.map((b) => b.text).join('|') === 'One two|Three|Four link');
  check('a block carries its links', blocks[2].links[0] === '/projects/17');
}

/* ───────────────────────── result ───────────────────────── */
if (failures.length) {
  console.log(`${failures.length} case(s) failed, ${passed} passed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`audit self-test: ${passed} cases passed`);
