import { CASE_STUDY_CONTENT } from '@/data/caseStudyContent';
import { INSIGHTS } from '@/data/insights';
import { solutionLabel, solutionsInOrder } from '@/data/solutions';
import { INDEXABLE_PROJECTS, PROJECT_NAMES } from '@/data/projectIndex';
import { FAQS } from '@/data/faqs';
import { TESTIMONIALS_UPDATED } from '@/data/testimonials';
import { OFFER_LADDER, FIT } from '@/data/offer';
import { DOOR_LINKS, MARKETPLACE_LINK } from '@/data/siteNav';
import { BRAND_FACTS, ENTITY_STATEMENT, SITE_URL } from '@/data/brand';
import { termText, termsFor } from '@/data/terms';
import { createPublicClient } from '@/lib/public';
import { plainText } from '@/lib/richText';

const BASE_URL = SITE_URL;

/** The day the reviews on /reviews were last copied from Fiverr, as "17 September 2026". */
const REVIEWS_COPIED = new Date(TESTIMONIALS_UPDATED).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const revalidate = 3600;

/**
 * llms.txt, generated from the same data the pages render.
 *
 * It was a hand-maintained file in /public and it had already drifted: it listed
 * six services when the site publishes four (inventing "E-Commerce Solutions" and
 * "Data & Analytics"), and it omitted the case studies and research articles —
 * the most substantial content on the site — entirely. A static file describing a
 * database-backed site goes stale the first time the data changes.
 *
 * Worth being clear about what this is: Google has said it does not use llms.txt,
 * and no major engine has confirmed it as a ranking input. It costs almost
 * nothing to emit correctly, so it stays, but it is not a ranking lever and the
 * work that matters is the rendered HTML.
 */
function shortName(title: string) {
  const head = title.split(':')[0].trim();
  return head.length > 3 ? head : title;
}

type WriteUp = { id: number; name: string; summary: string };

/**
 * The projects kept in the index (data/projectIndex.ts), in its order: only
 * those, because this file lists pages for engines to read, and the other
 * project pages are noindex. Each gets its study's short title and opening
 * passage. A project with no study yet (Hear With You) gets its row in the
 * projects table, the same title and description its page shows.
 *
 * Only ids the table still holds are listed, so a deleted project never leaves
 * a link to a 404 here. If the query fails, the studies alone are listed, as
 * this file did before it read the table, and the failure is logged.
 */
async function writeUps(): Promise<WriteUp[]> {
  let rows: Map<number, { title: string | null; description: string | null }> | null = null;
  try {
    const { data, error } = await createPublicClient()
      .from('projects')
      .select('id, title, description')
      .in('id', [...INDEXABLE_PROJECTS]);
    if (error) console.error('[llms.txt] projects query failed:', error.message);
    else rows = new Map((data ?? []).map((p) => [Number(p.id), p]));
  } catch (err) {
    console.error('[llms.txt] projects query failed:', err);
  }

  return INDEXABLE_PROJECTS.flatMap((id) => {
    const study = CASE_STUDY_CONTENT[id];
    const row = rows?.get(id);
    if (rows ? !row : !study) return [];
    const name = study ? shortName(study.title) : row?.title?.trim() || PROJECT_NAMES[id];
    const summary = study?.summary_answer ?? row?.description?.replace(/\s+/g, ' ').trim() ?? '';
    return name ? [{ id, name, summary }] : [];
  });
}

export async function GET() {
  const listed = await writeUps();

  const lines: string[] = [
    '# DevoraX',
    '',
    // The entity statement verbatim, then the facts it leaves out, all read from
    // data/brand.ts. These lines were hand-written copies of the same facts.
    `> ${ENTITY_STATEMENT}`,
    `> Who it is for: ${BRAND_FACTS.whoItIsFor}.`,
    `> Team: ${BRAND_FACTS.team}.`,
    `> Track record: ${BRAND_FACTS.trackRecord}.`,
    `> Fiverr clients in: ${BRAND_FACTS.clientCountries}.`,
    '',
    // The doors and the hub, each under the anchor text the site's own links
    // use, with the same copy as the homepage cards and /services.
    '## Ways in',
    '',
    ...[...DOOR_LINKS, MARKETPLACE_LINK].map(
      (d) => `- [${d.anchor}](${BASE_URL}${d.href}): ${d.title}. ${d.body}${d.price ? ` Price: ${d.price}.` : ''}`
    ),
    '',
    '## How it works',
    '',
    ...OFFER_LADDER.map((o, i) => `${i + 1}. ${o.title}: ${o.body} Price: ${o.price}.`),
    '',
    'New builds from scratch use the fixed-price MVP packages (from $2,900 and from $7,500).',
    '',
    `Good fit: ${FIT.good.map((f) => f.charAt(0).toLowerCase() + f.slice(1)).join('; ')}.`,
    `Not a fit: ${FIT.notFit.join('; ')}.`,
    '',
    // Generic on purpose: each listed write-up says in its own words who the
    // work was for, so this paragraph cannot drift from the allowlist.
    'The engineering write-ups below describe products Sameem Amjad built or worked',
    'on. Each one says who the work was for and cites only public evidence: store',
    'listings, live sites, demo builds and walkthrough videos recorded on them. The',
    'full portfolio also shows work Sameem did as an engineer at other companies',
    '(Zencloud, Webrange Solutions, ivector and Fleact Tech) and, since April 2026,',
    "as a Senior Software Developer on Pastel's team, as Pastel's employee; those",
    'products belong to their owners, and DevoraX work is separate from his job at',
    'Pastel. Koor, a homemade-food ordering marketplace, is DevoraX client work:',
    'DevoraX worked on it for a client (not named here), and the food truck ordering',
    `page describes it (${BASE_URL}/solutions/food-truck-ordering-app-development).`,
    '"Case study" is used only for work a client contracted DevoraX for. DevoraX',
    'holds no security or compliance certifications.',
    '',
    `Site: ${BASE_URL}`,
    `Contact: ${BRAND_FACTS.salesEmail}`,
    '',
    '## Services',
    '',
  ];

  // The solution pages, door pages first, under the anchor text the site's own
  // links use: a door's nav_label, a vertical page's H1. The four
  // /services/{id} pages that led this list redirect now (next.config.ts), and
  // a redirecting link has no place here.
  for (const s of solutionsInOrder()) {
    lines.push(`- [${solutionLabel(s)}](${BASE_URL}/solutions/${s.slug}): ${plainText(s.hero_answer)}`);
  }

  lines.push('', '## Engineering write-ups', '');
  for (const w of listed) {
    lines.push(`- [${w.name}](${BASE_URL}/projects/${w.id})${w.summary ? `: ${w.summary}` : ''}`);
  }

  if (INSIGHTS.length) {
    // The checklist sits beside the research articles, so the heading names both.
    lines.push('', '## Research and checklists', '');
    for (const a of INSIGHTS) {
      lines.push(`- [${a.title}](${BASE_URL}/insights/${a.slug}): ${a.summary_answer ?? a.meta_description ?? ''}`);
    }
  }

  lines.push('', '## Frequently asked', '');
  for (const f of FAQS) {
    lines.push(`- **${f.q}** ${plainText(f.a)}`);
  }

  // The terms /pricing#terms prints, word for word and with this hour's start
  // week (data/terms.ts), so an engine reading only this file gets the same
  // start date, payment and credit answers as the pages.
  lines.push('', '## Terms', '');
  const now = new Date();
  for (const t of termsFor('pricing')) {
    lines.push(`- **${t.question}** ${termText(t, 'pricing', now)}`);
  }

  lines.push(
    '',
    '## Company',
    '',
    // The booking page, so an assistant asked how to talk to DevoraX has the
    // URL rather than only "free 30-minute call".
    `- [Book a free 30-minute call](${BASE_URL}/book): with Sameem Amjad. Calls run ${BRAND_FACTS.callHours}`,
    `- [About DevoraX](${BASE_URL}/about): the fact sheet, the two people who run the studio, and how an engagement works`,
    `- [Pricing](${BASE_URL}/pricing): what each step costs, from the free call to monthly care, and how the price is set`,
    // The reviews as last copied, not "every" review: the profile can have
    // gained some since.
    `- [Reviews](${BASE_URL}/reviews): client reviews quoted as written from DevoraX's Fiverr profile, which is in Sameem Amjad's name, last copied ${REVIEWS_COPIED}`,
    `- [Press kit](${BASE_URL}/press): the company description, fact sheet, logo files, and bios and photos`,
    `- [Glossary](${BASE_URL}/glossary): definitions of the app launch, payments and marketplace terms the site uses`
  );

  lines.push(
    '',
    '## Other pages',
    '',
    `- [Services and prices](${BASE_URL}/services)`,
    // Also the index of the write-ups: /case-study, the old "Case study
    // index", redirects here.
    `- [Portfolio](${BASE_URL}/projects)`,
    `- [Team](${BASE_URL}/team)`,
    `- [Contact](${BASE_URL}/contact)`,
    `- [Privacy policy](${BASE_URL}/privacy)`,
    `- [Terms of service](${BASE_URL}/terms)`,
    ''
  );

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
