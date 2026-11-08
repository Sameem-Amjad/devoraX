/**
 * The site's internal link graph, in one place.
 *
 * Previously there was no site-wide navigation at all: `layout.tsx` rendered only
 * `{children}`, and the header/footer lived inside the homepage client component.
 * Every page except `/` and the old /case-study therefore shipped with no header, and
 * every page except `/` shipped with no footer — so most of the site was reachable
 * only from the homepage, and several long-form pages were crawl dead-ends.
 *
 * The footer once pointed six service anchors at the single URL /services, then
 * one anchor at each of the four /services/{id} pages. Those pages were retired
 * on 7 Nov 2026 (they redirect: next.config.ts). The footer's service links are
 * now the three door pages and the marketplace hub, each under the one anchor
 * text every link to it uses.
 *
 * Server code only. The header (a client component) takes its menu from
 * primaryNav.ts, which imports nothing: the lists here are built from the case
 * studies, the articles and the solution pages, and importing this module from
 * the browser ships all of that data.
 */
import { CASE_STUDY_CONTENT } from './caseStudyContent';
import { INSIGHTS } from './insights';
import { DOORS, MARKETPLACE_BUILD, type Door } from './offer';
import { getSolution, isOffer, solutionsInOrder } from './solutions';
import { INDEXABLE_PROJECTS, PROJECT_NAMES } from './projectIndex';
import { offerPriceLine } from '@/lib/offerPricing';
import type { NavLink } from './primaryNav';

export { PRIMARY_NAV, type NavLink } from './primaryNav';

/** A door, or the marketplace hub, joined to the page it leads to. */
export type WayIn = Door & {
  href: string;
  /**
   * The anchor text of every link to the page: a door page's nav_label (the
   * phrase it is named for), or the hub's short title.
   */
  anchor: string;
  /**
   * How a door's work is priced ("From $2,400, with the $400 audit credited to
   * it", or "Sprints at $1,200 a week, ..." where the page sells several
   * steps), generated from the steps its page sells (lib/offerPricing.ts).
   * Empty for the hub, whose new builds are quoted per project.
   */
  price: string;
};

/**
 * Looks the page up by slug and stops the build if it is missing or of the
 * wrong kind, rather than shipping a link to a 404 or a door with no price.
 */
function wayIn(door: Door, kind: 'offer' | 'hub'): WayIn {
  const page = getSolution(door.slug);
  const href = `/solutions/${door.slug}`;
  if (kind === 'offer') {
    if (!page || !isOffer(page)) {
      throw new Error(`data/offer.ts: door "${door.id}" names "${door.slug}", which is not a door page in data/solutions.ts`);
    }
    return { ...door, href, anchor: page.nav_label, price: offerPriceLine(page.offer_steps) };
  }
  if (!page || isOffer(page) || page.role !== 'hub') {
    throw new Error(`data/offer.ts: "${door.id}" names "${door.slug}", which is not the hub page in data/solutions.ts`);
  }
  return { ...door, href, anchor: page.title, price: '' };
}

/** The three door pages, in DOORS order. */
export const DOOR_LINKS: WayIn[] = DOORS.map((d) => wayIn(d, 'offer'));

/** New marketplace builds: the hub page, shown beside the doors. */
export const MARKETPLACE_LINK: WayIn = wayIn(MARKETPLACE_BUILD, 'hub');

/**
 * The vertical pages other than the hub, by their short titles. Each rests on a
 * named product and says whose work it was. The footer carries only the doors
 * and the hub now, so /services lists these, and each keeps a link from a page
 * one click from anywhere on the site.
 */
export const MARKET_LINKS: NavLink[] = solutionsInOrder()
  .filter((s) => !isOffer(s) && s.role === 'spoke')
  .map((s) => ({ href: `/solutions/${s.slug}`, label: s.title }));

/** "Loopedin Platform: Scaling Short-Form Video…" → "Loopedin Platform". */
function shortName(title: string): string {
  const head = title.split(':')[0].trim();
  return head.length > 3 ? head : title;
}

/**
 * Deep links to the projects kept in the index (data/projectIndex.ts), in its
 * order: the work the offer rests on, linked from every page rather than
 * sitting two clicks deep behind a filtered grid. This used to be the first
 * eight studies by id, which were builds with no client and employer work.
 *
 * Each is named by its study's short title, or by PROJECT_NAMES while it has
 * no study. An id with neither stops the build, rather than shipping a footer
 * link with no name.
 */
export const WORK_LINKS: NavLink[] = INDEXABLE_PROJECTS.map((id) => {
  const study = CASE_STUDY_CONTENT[id];
  const label = study ? shortName(study.title) : PROJECT_NAMES[id];
  if (!label) {
    throw new Error(
      `INDEXABLE_PROJECTS: project ${id} has no study in caseStudyContent.ts and no name in PROJECT_NAMES (src/data/projectIndex.ts)`
    );
  }
  return { href: `/projects/${id}`, label };
});

export const INSIGHT_LINKS: NavLink[] = INSIGHTS.map((a) => ({
  href: `/insights/${a.slug}`,
  label: a.title,
}));

/**
 * About, Pricing, Reviews and Press kit answer what a buyer checking a vendor
 * searches for ("DevoraX pricing", "DevoraX reviews"); the Glossary defines the
 * site's terms. The footer puts each one click from every page without
 * crowding the header.
 */
export const COMPANY_LINKS: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
  { href: '/insights', label: 'Engineering Insights' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/press', label: 'Press kit' },
];

export const LEGAL_LINKS: NavLink[] = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];
