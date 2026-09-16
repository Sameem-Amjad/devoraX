/**
 * Commercial solution landing pages — the "target now" tier of the keyword plan.
 *
 * These exist because the broad terms are unwinnable. A live SERP check on 26
 * candidates found 29 of 80 original keywords were held by agencies running
 * exact-match URLs with years of link equity behind them; head-on competition on
 * those is not a strategy for a domain with no backlink profile. What survived
 * were narrow queries where DevoraX has shipped the exact thing being searched
 * for — "antiques marketplace app development company" rather than "marketplace
 * development", "used car marketplace app development with inspection reports"
 * rather than "car marketplace website development company".
 *
 * Every page here is therefore built on a NAMED, DELIVERED project with a
 * published case study. That constraint is the whole point: a solution page with
 * no project behind it is the thin content this site was already penalised for
 * carrying, and it would mean claiming expertise that does not exist.
 *
 * The route is /solutions/{slug} rather than /services/{id} because the services
 * route resolves by database primary key and is owned by the admin dashboard.
 */
export type SolutionProof = {
  project_id: number;
  name: string;
  one_line: string;
  /** The specific capability this build evidences for this page. */
  what_it_proves: string;
  /** Client-reported figures, each phrased as reported. May be empty. */
  figures: string[];
};

export type Solution = {
  slug: string;
  primary_keyword: string;
  h1: string;
  /** Without the " | DevoraX" suffix — the metadata template appends it. */
  title: string;
  meta_description: string;
  hero_answer: string;
  sections: { heading: string; body: string }[];
  proof: SolutionProof[];
  included: string[];
  quoted_separately: string[];
  when_not_to_hire: string;
  faqs: { q: string; a: string }[];
  word_count: number;
  role: 'hub' | 'spoke';
  /** The hub slug this page links up to. Undefined when this page IS the hub. */
  hub?: string;
  /** Sibling solution slugs to cross-link. */
  related_slugs: string[];
  /** Which of the four DB services this sits under, for the breadcrumb and schema. */
  service_id: number;
};

export const SOLUTIONS: Solution[] = [];

export const SOLUTIONS_UPDATED = '2026-09-17T00:00:00.000Z';

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

export function allSolutionSlugs(): string[] {
  return SOLUTIONS.map((s) => s.slug);
}

export function solutionsInCluster(hubSlug: string): Solution[] {
  return SOLUTIONS.filter((s) => s.hub === hubSlug);
}
