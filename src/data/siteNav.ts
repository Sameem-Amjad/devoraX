/**
 * The site's internal link graph, in one place.
 *
 * Previously there was no site-wide navigation at all: `layout.tsx` rendered only
 * `{children}`, and the header/footer lived inside the homepage client component.
 * Every page except `/` and `/case-study` therefore shipped with no header, and
 * every page except `/` shipped with no footer — so most of the site was reachable
 * only from the homepage, and several long-form pages were crawl dead-ends.
 *
 * The footer also pointed six different service anchors ("Mobile Development",
 * "AI & Web", "Cloud & DevOps", "UI/UX Design", "E-Commerce", "Data Analytics")
 * at the single URL /services. Two of those services do not exist, and six
 * distinct anchor texts on one target tells a search engine nothing about any of
 * them. Each service now has one descriptive anchor and its own URL.
 */
import { SERVICE_CONTENT } from './serviceContent';
import { CASE_STUDY_CONTENT } from './caseStudyContent';
import { INSIGHTS } from './insights';
import { SOLUTIONS } from './solutions';

export type NavLink = { href: string; label: string };

/** Top-level routes, in the order a visitor would work through them. */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Work' },
  { href: '/case-study', label: 'Case Studies' },
  { href: '/insights', label: 'Insights' },
  { href: '/team', label: 'Team' },
];

/**
 * One descriptive anchor per service, each pointing at its own page.
 * Deliberately not the raw `title` from the DB ("Mobile Innovation" on its own
 * describes nothing) and deliberately not the long-form H1 either.
 */
const SERVICE_ANCHOR: Record<number, string> = {
  1: 'Mobile App Development',
  2: 'AI & Full-Stack Web Development',
  3: 'Cloud Architecture & DevOps',
  4: 'UI/UX Design Systems',
};

export const SERVICE_LINKS: NavLink[] = Object.values(SERVICE_CONTENT)
  .sort((a, b) => a.service_id - b.service_id)
  .map((s) => ({
    href: `/services/${s.service_id}`,
    label: SERVICE_ANCHOR[s.service_id] ?? s.title,
  }));

/** "Loopedin Platform: Scaling Short-Form Video…" → "Loopedin Platform". */
function shortName(title: string): string {
  const head = title.split(':')[0].trim();
  return head.length > 3 ? head : title;
}

/**
 * Deep links into the long-form case studies. These are the pages carrying the
 * site's real content, so they get linked from every page rather than sitting
 * two clicks deep behind a filtered grid.
 */
export const CASE_STUDY_LINKS: NavLink[] = Object.values(CASE_STUDY_CONTENT)
  .sort((a, b) => a.project_id - b.project_id)
  .map((c) => ({
    href: `/projects/${c.project_id}`,
    label: shortName(c.title),
  }));

export const INSIGHT_LINKS: NavLink[] = INSIGHTS.map((a) => ({
  href: `/insights/${a.slug}`,
  label: a.title,
}));

/**
 * Solution landing pages, hub first. These are the pages built against the
 * keywords that survived a live SERP check, so they need to be reachable from
 * every page rather than sitting behind a service page two clicks deep.
 */
export const SOLUTION_LINKS: NavLink[] = [...SOLUTIONS]
  .sort((a, b) => (a.role === 'hub' ? -1 : b.role === 'hub' ? 1 : 0))
  .map((s) => ({ href: `/solutions/${s.slug}`, label: s.h1 }));

export const COMPANY_LINKS: NavLink[] = [
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
  { href: '/insights', label: 'Engineering Insights' },
];

export const LEGAL_LINKS: NavLink[] = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];
