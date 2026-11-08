/**
 * The header's menu, on its own so the header can import it without the rest
 * of the link graph.
 *
 * The header is a client component, and it took PRIMARY_NAV from siteNav.ts,
 * which builds its other lists from the case studies, the research articles and
 * the solution pages. Because those lists are computed when the module loads,
 * the bundler kept all of that data, about 850 KB of it, in a chunk every page
 * downloaded and parsed for a menu of four links. This module imports nothing.
 * siteNav.ts re-exports both names, so server code keeps one import path.
 */
export type NavLink = { href: string; label: string };

/**
 * Top-level routes, in the order a visitor would work through them. "Case
 * Studies" (/case-study) left on 7 Nov 2026: it listed the same projects as
 * Work, under a label that only DevoraX client work may carry, and now
 * redirects there.
 */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Work' },
  { href: '/insights', label: 'Insights' },
  { href: '/team', label: 'Team' },
];
