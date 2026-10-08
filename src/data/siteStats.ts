/**
 * The homepage figures, derived or sourced rather than typed in loosely.
 *
 * Every figure here must be something a buyer can check today: Sameem's public
 * Fiverr record (5.0 rating, 50+ projects since January 2022, clients in the US,
 * UK, Canada and Hong Kong), the team page (two people), or a store listing
 * linked from the portfolio. Earlier versions showed "Projects Delivered",
 * "Live Products", "Five-Star Reviews" and "Clients Served" counts. The first two
 * counted employer work and builds with no public link as DevoraX deliveries, and
 * the review and client counts disagreed with each other across the site. None of
 * those is shown any more.
 *
 * The store-app count is computed from the projects table, so it cannot drift
 * when a listing is added or a link dies.
 *
 * This module is imported by a SERVER component, which passes the computed
 * scalars down as props.
 */
export type SiteStat = {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  /** Digits after the decimal point when rendering `value`. Defaults to 0. */
  decimals?: number;
};

type ProjectLinks = { android?: string | null; ios?: string | null };

const STORE_URL = /^https?:\/\/(apps\.apple\.com|play\.google\.com)\//;

/** Portfolio entries with at least one App Store or Google Play listing. */
export function countStoreApps(projects: ProjectLinks[]): number {
  return projects.filter(
    (p) => STORE_URL.test(p.android ?? '') || STORE_URL.test(p.ios ?? '')
  ).length;
}

export function getSiteStats(projects: ProjectLinks[]): SiteStat[] {
  return [
    {
      value: 5,
      decimals: 1,
      suffix: '',
      label: 'Fiverr Rating',
      sub: 'Public profile, linked below',
    },
    {
      value: 50,
      suffix: '+',
      label: 'Fiverr Projects',
      sub: 'Since January 2022',
    },
    {
      value: 4,
      suffix: '',
      label: 'Client Countries',
      sub: 'US, UK, Canada, Hong Kong',
    },
    {
      value: 4,
      suffix: '+',
      label: 'Years of Client Work',
      sub: 'On Fiverr since 2022',
    },
    {
      value: countStoreApps(projects),
      suffix: '',
      label: 'Apps on the Stores',
      sub: 'Portfolio apps, incl. employer work',
    },
    {
      value: 2,
      suffix: '',
      label: 'Senior Engineers',
      sub: 'Specialists added when needed',
    },
  ];
}
