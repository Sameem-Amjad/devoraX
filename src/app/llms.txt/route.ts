import { SERVICE_CONTENT } from '@/data/serviceContent';
import { CASE_STUDY_CONTENT } from '@/data/caseStudyContent';
import { INSIGHTS } from '@/data/insights';
import { FAQS } from '@/data/faqs';
import { POSITIONING, DOORS, OFFER_LADDER, FIT } from '@/data/offer';

const BASE_URL = 'https://thedevorax.tech';

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

export async function GET() {
  const services = Object.values(SERVICE_CONTENT).sort(
    (a, b) => a.service_id - b.service_id
  );
  const studies = Object.values(CASE_STUDY_CONTENT).sort(
    (a, b) => a.project_id - b.project_id
  );

  const lines: string[] = [
    '# DevoraX',
    '',
    `> ${POSITIONING.headline}: ${POSITIONING.promise.charAt(0).toLowerCase()}${POSITIONING.promise.slice(1)}`,
    `> ${POSITIONING.audience}`,
    '> DevoraX is a two-person studio (Sameem Amjad, founder; Usman, CTO): two senior',
    '> engineers who bring in specialists when a scope needs them. Sameem has a 5.0',
    '> Fiverr rating across 50+ projects since January 2022, for clients in the US,',
    '> UK, Canada and Hong Kong.',
    '',
    '## Two ways in',
    '',
    ...DOORS.map((d) => `- ${d.label} (${d.title}): ${d.body} ${BASE_URL}/services#${d.id}`),
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
    'The case studies below describe products the founders built or worked on. Many',
    'were built while Sameem was an engineer at other companies (Zencloud, Webrange',
    'Solutions, Pastel and earlier employers); those products belong to their owners',
    'and are not DevoraX client projects. Each study says who the work was for and',
    'cites only public evidence: store listings, live sites or demo builds. DevoraX',
    'holds no security or compliance certifications.',
    '',
    `Site: ${BASE_URL}`,
    'Contact: business@thedevorax.tech',
    '',
    '## Services',
    '',
  ];

  for (const s of services) {
    lines.push(`- [${s.title}](${BASE_URL}/services/${s.service_id}): ${s.hero_answer}`);
  }

  lines.push('', '## Case studies', '');
  for (const c of studies) {
    lines.push(`- [${shortName(c.title)}](${BASE_URL}/projects/${c.project_id}): ${c.summary_answer}`);
  }

  if (INSIGHTS.length) {
    lines.push('', '## Research', '');
    for (const a of INSIGHTS) {
      lines.push(`- [${a.title}](${BASE_URL}/insights/${a.slug}): ${a.summary_answer ?? a.meta_description ?? ''}`);
    }
  }

  lines.push('', '## Frequently asked', '');
  for (const f of FAQS) {
    lines.push(`- **${f.q}** ${f.a}`);
  }

  lines.push(
    '',
    '## Other pages',
    '',
    `- [All services](${BASE_URL}/services)`,
    `- [Portfolio](${BASE_URL}/projects)`,
    `- [Case study index](${BASE_URL}/case-study)`,
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
