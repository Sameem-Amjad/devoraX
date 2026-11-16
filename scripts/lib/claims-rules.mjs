/**
 * The claims rules, shared by every content check.
 *
 * `scripts/content-audit.mjs` runs them over the strings in the data files,
 * `scripts/audit-rendered.mjs` over the pages a visitor is served, and
 * `scripts/audit-selftest.mjs` over sentences that must be caught and
 * sentences that must pass. They import this one module, so a pattern, a
 * negation window or an exemption changed here changes all three: the static and
 * the rendered check cannot drift apart, and the self-test proves the same
 * code the audits run.
 *
 * A hit is excused only by where it comes from (EXEMPT, the allow file), never
 * by loosening a pattern. Plain Node 20, no dependencies.
 */
import { readFileSync } from 'node:fs';
import { extract, moduleConstants } from './read-data.mjs';

/* ───────────────────────── predicates ───────────────────────── */

/** "n't", "not", "never", "no one", "cannot": the forms that turn a claim into its denial. */
export const NEGATION = /n['’]t\b|\bnot\b|\bnever\b|\bno one\b|\bcannot\b/i;

/**
 * Spans inside double quotation marks: straight quotes toggle, curly quotes
 * open and close. Single quotes are skipped on purpose: an apostrophe
 * ("Apple's") cannot be told from a quote.
 */
export function quotedSpans(text) {
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
export const insideQuotes = (text, index) => quotedSpans(text).some(([a, b]) => index > a && index < b);

/** The `n` words before (or after) a match, for negation and proximity tests. */
export const wordsBefore = (text, index, n) => text.slice(0, index).split(/\s+/).filter(Boolean).slice(-n).join(' ');
export const wordsAfter = (text, index, n) => text.slice(index).split(/\s+/).filter(Boolean).slice(0, n).join(' ');

/** A buyer's question is in the buyer's voice ("Do we have to hire…?"), not ours. */
export const isQuestionField = (path) => /(?:^|\.)(?:q|question)$/.test(path || '');
/** A buyer's question: a question field, a block that ends in "?", or the sentence the match sits in. */
const isQuestion = (ctx) =>
  ctx.field === 'question' ||
  isQuestionField(ctx.path) ||
  ctx.isQuestion === true ||
  (typeof ctx.index === 'number' && /\?['"”’*)\]\s]*$/.test(sentenceAt(ctx.text, ctx.index)));

/**
 * Sentences of a text with their offsets. A full stop inside a number or a URL
 * is not a boundary; closing quotes, brackets and markdown emphasis after the
 * stop belong to the sentence ("**Can you guarantee approval?**").
 */
export function sentences(text) {
  const out = [];
  let start = 0;
  const re = /[.!?]['"”’*)\]]*(?=\s|$)|\n/g;
  for (let m; (m = re.exec(text)); ) {
    const end = m.index + m[0].length;
    out.push({ start, end, text: text.slice(start, end) });
    start = end;
  }
  if (start < text.length) out.push({ start, end: text.length, text: text.slice(start) });
  return out.filter((s) => s.text.trim());
}
export const sentenceAt = (text, index) =>
  sentences(text).find((s) => index >= s.start && index < s.end)?.text ?? text;

/**
 * Text that explains the "case study" label rather than using it: "We call a
 * page a case study only when a client contracted DevoraX for the work" (the
 * /terms page). That sentence is the policy itself, so it is the one place the
 * words may appear on a page that is not a client's.
 */
const LABEL_EXPLAINER = [
  /\b(?:we|DevoraX) (?:call|label|use the (?:word|label|term))\b[^.]{0,80}\bcase stud(?:y|ies)\b/i,
  /\bcase stud(?:y|ies)\b[^.]{0,60}\bonly (?:when|for|if)\b|\bonly (?:when|for|if)\b[^.]{0,80}\bcase stud(?:y|ies)\b/i,
];
export const explainsLabel = (text, index) => {
  const s = sentenceAt(text, index);
  return LABEL_EXPLAINER.some((re) => re.test(s));
};

/**
 * The project ids a sentence is about: links to "/projects/32" (markdown in data
 * text, page links in a rendered block), and project names the sentence uses
 * ("Koor's case study"). `names` is a list of { id, name }.
 */
export function projectIdsReferenced(text, index, links = [], names = []) {
  const ids = new Set();
  const sentence = sentenceAt(text, index);
  for (const m of sentence.matchAll(/\/projects\/(\d+)\b/g)) ids.add(Number(m[1]));
  for (const href of links) {
    const m = /\/projects\/(\d+)\b/.exec(href);
    if (m) ids.add(Number(m[1]));
  }
  for (const { id, name } of names) {
    if (new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(sentence)) ids.add(Number(id));
  }
  return [...ids];
}

/** True if a hit's text carries a link to a source: markdown link, bare URL, or a rendered link. */
export const hasSourceLink = (ctx) =>
  /\]\(https?:\/\/|https?:\/\//.test(ctx.text) || (ctx.links || []).some((l) => /^https?:\/\//.test(l));

/* ───────────────────────── the rules ───────────────────────── */

/**
 * Each rule: `re` (global), a `level` (or `levelFor(ctx)`), `why`, and optionally
 *   applies(ctx)  the rule only runs where this is true (a field, an engagement)
 *   allow         a pattern that, found at the match, excuses it (a name that is not a claim)
 *   skip(ctx)     true to excuse the match (a denial, a quotation, a question)
 *
 * ctx: { text, index, match, path?, field?, engagement?, engagementOf?, projectNames?,
 *        heroText?, links?, sales?, offer?, isQuestion?, flags? } where `field` is one of title, h1,
 *        meta, hero, question, body.
 */
export const RULES = [
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
     * built X" claims them for the agency, and "our clients" claims a client base
     * the studio does not have in that sense.
     *
     * Owner decisions of 8 Nov 2026: orders through the Fiverr profile are
     * DevoraX client work (the profile is in Sameem's name but sells the
     * studio's services, and the team delivered them), and so is Koor (17). The
     * pages say "a client who hired DevoraX on Fiverr" or "DevoraX worked on it
     * for a client", which name the engagement without the phrases below, so the
     * rule still catches "DevoraX built" and "our client(s)" laid over employer work.
     */
    re: /\bbuilt by DevoraX\b|\bDevoraX built\b|\bour (?:own )?clients?\b/gi,
    why: 'claims employer or unconfirmed work as DevoraX client work',
  },
  {
    id: 'db-column-name',
    level: 'error',
    /**
     * A literal column from our Supabase schema, printed for visitors. Always
     * wrong, in every genre: nobody outside this repo knows what a stats field is.
     */
    re: /\b(?:stats|techstack|description|result|slug|image) field\b|\beach row['’]s\b|\bevery row of\b/gi,
    why: 'prints a database column name on a public page',
  },
  {
    id: 'approval',
    level: 'error',
    /**
     * No approval promise anywhere. We prepare the app against Apple's and
     * Google's guidelines, submit it and answer the reviewers; the stores decide.
     * Affirmative forms only: a hit with "n't", "not", "never", "no one" or
     * "cannot" in the six words before it is a denial ("No one can guarantee App
     * Store approval", "a build that didn't pass review") and passes.
     */
    re: /\bApp Store approval\b|\buntil (?:it is |the app is )?approved\b|\bapproval guaranteed\b|\bguaranteed approval\b|\bget it approved\b|\bpass(?:es)? (?:app )?review\b/gi,
    skip: ({ text, index }) => NEGATION.test(wordsBefore(text, index, 6)),
    why: 'promises store approval; say what we do (prepare, submit, answer the reviewers) and that the stores decide',
  },
  {
    id: 'guarantee',
    level: 'warn',
    /**
     * A bare "guarantee" in the offer's own voice is read as a promise. The approval
     * forms above are errors; this catches the rest ("we guarantee the result").
     * Denials and a buyer's question ("Can you guarantee approval?") pass.
     */
    re: /\bguarantee[sd]?\b/gi,
    // Technical prose in project studies ("the database guarantees the order")
    // is not a promise about us; only the offer's own voice is held to it.
    applies: (ctx) => ctx.offer === true,
    skip: (ctx) =>
      isQuestion(ctx) ||
      NEGATION.test(wordsBefore(ctx.text, ctx.index, 6)) ||
      // "guaranteed approval" and "approval guaranteed" are already the approval rule's.
      (/^guaranteed$/i.test(ctx.match) && /^\s*approval\b/i.test(ctx.text.slice(ctx.index + ctx.match.length))) ||
      (/^guaranteed$/i.test(ctx.match) && /\bapproval\s+$/i.test(ctx.text.slice(Math.max(0, ctx.index - 10), ctx.index))),
    why: 'a promise word; say what we do and what we will not promise',
  },
  {
    id: 'outcome-as-offer',
    level: 'warn',
    /**
     * "Take your app to the App Store" sells the store's decision as our
     * deliverable. In a page title or H1 it passes only when the same page's
     * hero answer says "The stores decide approval".
     */
    re: /\b(?:take|get|put)\s+your\b[^.]{0,40}\b(?:in)?to the (?:App Store|Google Play)/gi,
    applies: (ctx) => ctx.field === 'title' || ctx.field === 'h1',
    skip: (ctx) => /The stores decide approval/i.test(ctx.heroText || ''),
    why: 'sells the store listing as the outcome; the page must say "The stores decide approval"',
  },
  {
    id: 'turnaround',
    level: 'error',
    /**
     * No turnaround or delivery promise beyond "usually 1–2 weeks" for a finish
     * sprint and the audit turnaround in data/terms.ts. "Response within 24h", "a
     * fixed-price proposal within 48 hours" and "a scope, a timeline and a
     * number" were all on the site once.
     */
    re: /\bwithin\s+(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty-four|forty-eight)\s*(?:h\b|hrs?\b|hours?\b|(?:business |working )?days?\b)|\b(?:24|48|72)\s?h\b|\b(?:24|48|72)[- ]hours?\b|\ba timeline and a number\b|\bscope, timeline and an honest number\b|\bfixed-price proposal within\b|\bresponse within\b/gi,
    why: 'a turnaround promise; use the terms in data/terms.ts ("usually N working days", the start week) instead',
  },
  {
    id: 'credential',
    level: 'error',
    /**
     * No certification, partnership or "expert" claim until a program accepts
     * DevoraX. Self-claims only: a denial ("we are not certified") passes, and
     * so do the names of things that are not claims about us ("Expert Network",
     * "Experts directory", "partner team", "certified compliance posture").
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
    skip: (ctx) =>
      isQuestion(ctx) ||
      insideQuotes(ctx.text, ctx.index) ||
      !/\b(?:[Ww]e|I|DevoraX|Sameem|[Oo]ur)\b/.test(
        `${wordsBefore(ctx.text, ctx.index, 5)} ${wordsAfter(ctx.text, ctx.index + ctx.match.length, 5)}`
      ),
    why: "reads as a platform's accreditation; DevoraX is not listed or certified by it",
  },
  {
    id: 'case-study-label',
    level: 'error',
    /**
     * "Case study" means work a client contracted DevoraX for, and only that
     * (the project-index ledger decides which projects those are). Everywhere
     * else the page is an "engineering write-up". Excused: the study or page of a
     * project whose engagement is devorax-client; text that explains the label
     * itself; and a sentence that is about devorax-client projects only, by link
     * or by name ("Koor's case study"), where the label is true. "DevoraX case
     * study" is a separate rule with no excuse.
     */
    re: /\bcase stud(?:y|ies)\b/gi,
    skip: (ctx) => {
      if (/\bDevoraX(?:['’]s)? $/i.test(ctx.text.slice(Math.max(0, ctx.index - 12), ctx.index))) return true; // reported by devorax-case-study
      if (ctx.engagement === 'devorax-client') return true;
      if (explainsLabel(ctx.text, ctx.index)) return true;
      const ids = projectIdsReferenced(ctx.text, ctx.index, ctx.links, ctx.projectNames);
      return ids.length > 0 && typeof ctx.engagementOf === 'function' && ids.every((id) => ctx.engagementOf(id) === 'devorax-client');
    },
    why: '"case study" is only for work a client contracted DevoraX for; call this an engineering write-up',
  },
  {
    id: 'devorax-case-study',
    level: 'error',
    /** "DevoraX case study" claims the work for the studio in the very words; no engagement excuses it. */
    re: /\bDevoraX(?:['’]s)? case stud(?:y|ies)\b/gi,
    why: '"DevoraX case study" is never right; name the client work or call it an engineering write-up',
  },
  {
    id: 'demo-wording',
    level: 'error',
    /**
     * A demo build or proof of concept was not shipped to anyone. In the study
     * or page of a project whose engagement is demo or poc, "shipped",
     * "launched", "in production" and "live on the App Store / Google Play" are
     * errors; "live demo" is the honest word and passes. A denial ("never
     * launched", "not in production") passes.
     */
    re: /\bshipped\b|\blaunched\b|\bin production\b|\blive (?:on|in) (?:the )?(?:Apple )?(?:App Store|Google Play)\b/gi,
    applies: (ctx) => ctx.engagement === 'demo' || ctx.engagement === 'poc',
    skip: ({ text, index }) => NEGATION.test(wordsBefore(text, index, 4)),
    why: 'a demo or proof of concept is not shipped, launched or in production; say what the demo shows',
  },
  {
    id: 'brand-variant',
    level: 'error',
    /** "Devora" alone was the old alternate name. The brand is "DevoraX"; a variant, if ever wanted, is "thedevorax". */
    re: /\bDevora\b/g,
    why: 'the brand is spelled DevoraX',
  },
  {
    id: 'record-as-document',
    /**
     * "the record states", "named in the record", "project record".
     *
     * Wrong on a sales or portfolio page, where it reads as an internal audit
     * note and tells a prospect our CMS is thin. Legitimate in a research
     * article's methodology, where naming the dataset and its limits is exactly
     * what makes the findings citable. A warning, promoted to an error on a sales
     * or portfolio surface (ctx.sales).
     */
    level: 'warn',
    levelFor: (ctx) => (ctx.sales ? 'error' : 'warn'),
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
 * Hits excused by where they come from. Each says why; none loosens a pattern.
 * `flags` are set by the caller, who knows the source (the static audit knows a
 * string sits in the terms "start" row or in a sourced price table).
 */
export const EXEMPT = [
  {
    rule: 'turnaround',
    why: 'the owner-set audit turnaround in data/terms.ts, the one turnaround the site publishes',
    test: (ctx) => ctx.flags?.has('terms-start'),
  },
  {
    rule: 'turnaround',
    why: "a third party's terms in a dated, sourced market-price table",
    test: (ctx) => ctx.flags?.has('sourced-price-row'),
  },
  {
    rule: 'turnaround',
    why: "a quotation that carries its source link (Apple's App Review times)",
    test: (ctx) => insideQuotes(ctx.text, ctx.index) && hasSourceLink(ctx),
  },
];

/** Where a string sits in the data, from the last key of its path. */
export function fieldOf(path) {
  const last = /([A-Za-z_][A-Za-z0-9_]*)(?:\[\d+\])*$/.exec(path || '')?.[1];
  if (last === 'title' || last === 'seo_title') return 'title';
  if (last === 'h1') return 'h1';
  if (last === 'meta_description') return 'meta';
  if (last === 'hero_answer') return 'hero';
  if (last === 'q' || last === 'question') return 'question';
  return 'body';
}

/**
 * Run every rule over one text. Returns the hits and the matches an exemption
 * excused (kept so a verbose run can show them). The caller applies the allow
 * file on top.
 */
export function findHits(text, ctx = {}) {
  const hits = [];
  const exempt = [];
  const base = { ...ctx, field: ctx.field ?? fieldOf(ctx.path) };
  for (const rule of RULES) {
    if (rule.applies && !rule.applies(base)) continue;
    for (const m of text.matchAll(rule.re)) {
      const c = { ...base, text, index: m.index, match: m[0] };
      if (rule.allow && rule.allow.test(text.slice(m.index, m.index + m[0].length + 20))) continue;
      if (rule.skip && rule.skip(c)) continue;
      const excused = EXEMPT.find((x) => x.rule === rule.id && x.test(c));
      if (excused) { exempt.push({ rule: rule.id, sample: m[0], why: excused.why }); continue; }
      hits.push({
        rule: rule.id,
        level: rule.levelFor ? rule.levelFor(c) : rule.level,
        sample: m[0],
        index: m.index,
        why: rule.why,
        text,
      });
    }
  }
  return { hits, exempt };
}

/* ───────────────────────── prices ───────────────────────── */

const NUM = String.raw`\d(?:[\d,]*\d)?(?:\.\d+)?`;
const MONEY = new RegExp(
  String.raw`(?<cur>US\$|\$|£|€)\s?(?<n>${NUM})(?<mult>\s?(?:k|K|M|million)\b)?|\b(?<n2>${NUM})\s?USD\b`,
  'g'
);

/** Every money amount in a text: { amount, currency: 'USD' | 'GBP' | 'EUR', raw, index }. */
export function moneyAmounts(text) {
  const out = [];
  for (const m of text.matchAll(MONEY)) {
    const g = m.groups;
    let amount = Number((g.n ?? g.n2).replace(/,/g, ''));
    if (g.mult) amount *= /^\s?(?:k|K)$/.test(g.mult) ? 1e3 : 1e6;
    const currency = g.cur === '£' ? 'GBP' : g.cur === '€' ? 'EUR' : 'USD';
    out.push({ amount, currency, raw: m[0], index: m.index });
  }
  return out;
}

/** The amounts of the market-prices rows as { USD: Set, GBP: Set }, for lookups. */
export function marketAmounts(rows) {
  const out = { USD: new Set(), GBP: new Set(), EUR: new Set() };
  for (const r of rows || []) for (const a of r.amounts || []) (out[r.currency] ??= new Set()).add(a);
  return out;
}

/**
 * Amounts in a text that are neither one of DevoraX's own prices nor a listed
 * third-party price. `own` is a Set of USD amounts (the offer ladder plus the two
 * package prices); `market` is marketAmounts().
 */
export function unknownPrices(text, { own, market }) {
  return moneyAmounts(text).filter(
    (a) => !((a.currency === 'USD' && own.has(a.amount)) || market[a.currency]?.has(a.amount))
  );
}

/** Amounts in a third party's text that no market-prices row lists. A coincidence with our own price does not excuse it. */
export function unlistedThirdPartyPrices(text, { market }) {
  return moneyAmounts(text).filter((a) => !market[a.currency]?.has(a.amount));
}

/**
 * Sentences where "$400" stands beside another DevoraX price and nothing says it
 * is credited: the audit is credited to the paid step that follows, and a price
 * list that puts $400 next to $1,200 without saying so reads as two charges.
 */
export function uncreditedAudit(text, { own, auditAmount = 400 }) {
  const out = [];
  for (const s of sentences(text)) {
    const usd = moneyAmounts(s.text).filter((a) => a.currency === 'USD').map((a) => a.amount);
    if (!usd.includes(auditAmount)) continue;
    if (!usd.some((a) => a !== auditAmount && own.has(a))) continue;
    if (/\bcredit/i.test(s.text)) continue;
    out.push(s.text.trim());
  }
  return out;
}

/**
 * A sourced price table: a "Source" column holding a domain, and a date in that
 * cell or in the caption (the third party's price, as read on that day). Used to
 * excuse a third party's own terms there; DevoraX's own row gets no pass.
 */
export function inSourcedPriceTable(table, rowIndex) {
  const row = table?.rows?.[rowIndex];
  if (!table || !row) return false;
  const col = (table.headers || []).findIndex((h) => /^source\b/i.test(h));
  if (col === -1) return false;
  const DATE = /\b\d{1,2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b|\b\d{4}-\d{2}-\d{2}\b/;
  const sourced = /[a-z0-9-]+\.[a-z]{2,}/i.test(row[col] || '');
  const dated = DATE.test(row[col] || '') || DATE.test(table.caption || '');
  return sourced && dated && !/^DevoraX\b/.test(row[0] || '');
}

/**
 * A table of other people's prices, as read on a stated day: a "Price" or "Cost"
 * column and a read date in the caption ("prices read 7 November 2026"). Its
 * non-DevoraX rows may state only amounts the market-prices table lists, even
 * where an amount happens to equal one of our own.
 */
export const isPriceTable = (table) =>
  (table?.headers || []).some((h) => /^(?:price|cost)\b/i.test(h)) &&
  /\bread (?:on )?\d{1,2} [A-Za-z]+ \d{4}|\bprices? read\b/i.test(table?.caption || '');

/** A table row that is about someone else's price: not led by "DevoraX" and not talking about "us" or "our" work. */
export const isThirdPartyRow = (row) =>
  !/^DevoraX\b/.test(row?.[0] || '') && !/\b(?:DevoraX|[Oo]ur|[Uu]s|[Ww]e)\b/.test((row || []).join(' | '));

/* ───────────────────────── market-prices table ───────────────────────── */

export const MARKET_STALE_DAYS = 90;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days between an ISO day and `now`; NaN for anything else. */
export function daysSince(isoDay, now = new Date()) {
  if (typeof isoDay !== 'string' || !ISO_DAY.test(isoDay)) return NaN;
  const t = Date.parse(`${isoDay}T00:00:00.000Z`);
  return Number.isNaN(t) ? NaN : Math.floor((now.getTime() - t) / DAY_MS);
}

const sameSet = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const squash = (s) => String(s).replace(/\s+/g, ' ');

/**
 * Check the market-prices rows. `resolvePlace(place)` returns the text of a
 * page section as one string, or null when the page or section does not exist;
 * the caller (which has the data loaded) supplies it.
 *
 * Errors: a row with no source URL, no valid read date, no printed text, a
 * duplicate id, or `amounts` that disagree with the amounts in `printed`.
 * Warnings: read more than MARKET_STALE_DAYS ago; a row nothing uses (no place,
 * or `printed` found at none of its places); a place that does not exist or
 * does not hold one of the row's amounts.
 */
export function marketIssues(rows, { now = new Date(), resolvePlace } = {}) {
  const issues = [];
  const add = (level, id, rule, detail) => issues.push({ level, id, rule, detail });
  const seen = new Set();
  for (const r of rows) {
    const id = r.id || '(no id)';
    if (seen.has(id)) add('error', id, 'market-row', 'duplicate id');
    seen.add(id);
    if (typeof r.source_url !== 'string' || !/^https?:\/\/[^\s/]+\.[^\s/]+/.test(r.source_url))
      add('error', id, 'market-source', 'no source URL (a third-party price needs the page it was read from)');
    const age = daysSince(r.checked_on);
    if (Number.isNaN(age)) add('error', id, 'market-date', `checked_on "${r.checked_on}" is not an ISO date (YYYY-MM-DD)`);
    else if (daysSince(r.checked_on, now) > MARKET_STALE_DAYS)
      add('warn', id, 'market-stale', `read on ${r.checked_on}, ${daysSince(r.checked_on, now)} days ago (limit ${MARKET_STALE_DAYS}); read the source again and update the row`);
    if (!r.printed) { add('error', id, 'market-row', 'no printed price'); continue; }

    // The numbers must be the ones in the printed text, no more and no fewer.
    const fromPrinted = new Set(moneyAmounts(r.printed).filter((a) => a.currency === r.currency).map((a) => a.amount));
    if (!sameSet(fromPrinted, new Set(r.amounts || [])))
      add('error', id, 'market-row', `amounts [${(r.amounts || []).join(', ')}] differ from the ${r.currency} amounts in "${r.printed}" [${[...fromPrinted].join(', ')}]`);

    if (resolvePlace) {
      const places = r.used_in || [];
      if (!places.length) { add('warn', id, 'market-unused', 'used_in is empty: nothing uses this row'); continue; }
      let found = false;
      for (const place of places) {
        const text = resolvePlace(place);
        if (text == null) { add('warn', id, 'market-unused', `${place} does not exist (page or section id)`); continue; }
        const flat = squash(text);
        if (flat.includes(squash(r.printed))) found = true;
        const holds = (r.amounts || []).length
          ? moneyAmounts(text).some((a) => a.currency === r.currency && r.amounts.includes(a.amount))
          : flat.includes(squash(r.printed));
        if (!holds) add('warn', id, 'market-unused', `${place} no longer prints this price`);
      }
      if (!found) add('warn', id, 'market-unused', `"${r.printed}" is not printed at any of its places: nothing uses this row as written`);
    }
  }
  return issues;
}

/* ───────────────────────── terms parity ───────────────────────── */

const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

/**
 * The two facts terms.ts states and other files restate: the defect window and
 * the audit turnaround. Read from terms.ts, never typed here.
 */
export function termFacts(termsFile = 'src/data/terms.ts') {
  const src = readFileSync(termsFile, 'utf8');
  const terms = extract(termsFile, 'TERMS');
  const defects = terms.find((t) => t.id === 'defects')?.answer ?? '';
  // "fixed free for 35 days after handover"; if the sentence is reworded, the first "N days" in the row.
  const defectDays = Number((/free for (\d+) days/.exec(defects) ?? /\b(\d+)[- ]days?\b/.exec(defects))?.[1]);
  const turnaroundDays = moduleConstants(src).AUDIT_TURNAROUND_WORKING_DAYS;
  return { defectDays, turnaroundDays };
}

const DEFECT_FORMS = [
  /\b(\d+)[- ]days?\s+(?:of\s+)?(?:free\s+)?(?:defect|maintenance|bug)/gi, // "35 days of free maintenance", "35-day defect window"
  /\bfree\s+for\s+(\d+)\s+days\b/gi, // "fixed free for 35 days after handover"
  /\bthe same (\d+) days\b/gi, // "carries the same 35 days"
];
const TURNAROUND_FORM = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+working\s+days?\b/gi;

/**
 * Where a text states one of those facts with a different number. Returns
 * { fact, found, expected, sample }.
 */
export function termMismatches(text, facts) {
  const out = [];
  if (Number.isFinite(facts.defectDays)) {
    for (const re of DEFECT_FORMS) {
      for (const m of text.matchAll(re)) {
        if (Number(m[1]) !== facts.defectDays) out.push({ fact: 'defect window (days)', found: Number(m[1]), expected: facts.defectDays, sample: m[0] });
      }
    }
  }
  if (Number.isFinite(facts.turnaroundDays)) {
    for (const s of sentences(text)) {
      if (!/\b(?:audit|report)\b/i.test(s.text)) continue;
      for (const m of s.text.matchAll(TURNAROUND_FORM)) {
        const n = WORD_NUM[m[1].toLowerCase()] ?? Number(m[1]);
        if (n !== facts.turnaroundDays) out.push({ fact: 'audit turnaround (working days)', found: n, expected: facts.turnaroundDays, sample: m[0] });
      }
    }
  }
  return out;
}

/* ───────────────────────── allow file ───────────────────────── */

const ALLOW_FIELDS = ['where', 'sentence', 'rule', 'reason', 'approver', 'date'];

/**
 * scripts/audit-allow.json: sentence-level exceptions as data. Each entry says
 * where it is (a file under src/ for the static audit, a URL path such as
 * "/pricing" for the rendered one), a distinctive piece of the sentence, the
 * rule it excuses, why, who approved it ("unreviewed" until the owner has) and
 * the date. Structural exemptions (by where a string comes from) stay in code.
 */
export function loadAllow(file = 'scripts/audit-allow.json') {
  let raw;
  try { raw = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { return { entries: [], problems: [`${file} unreadable: ${e.message}`] }; }
  const problems = [];
  const entries = Array.isArray(raw.entries) ? raw.entries : [];
  entries.forEach((e, i) => {
    const missing = ALLOW_FIELDS.filter((f) => typeof e[f] !== 'string' || !e[f].trim());
    if (missing.length) problems.push(`entry ${i + 1} lacks ${missing.join(', ')}`);
    e.used = 0;
  });
  return { entries, problems };
}

/** The entry that excuses a hit at `where` for `rule` whose text holds the entry's sentence, if any. */
export function findAllow(entries, { where, rule, text }) {
  const flat = squash(text);
  const e = entries.find(
    (x) => x.where === where && x.rule === rule && x.sentence && flat.includes(squash(x.sentence))
  );
  if (e) e.used++;
  return e;
}

/** Entries of the kind a given audit judges: "static" = files, "rendered" = URL paths. */
export const allowKind = (entry) => (String(entry.where).startsWith('/') ? 'rendered' : 'static');
