/**
 * Insights: data-backed research articles.
 *
 * These exist for citation, not for keyword volume. They are written from the
 * agency's own delivery record — counts and outcomes that no competitor can
 * reproduce — and they state their own limits, which is what separates a source
 * worth quoting from marketing copy.
 *
 * Content is generated from the real `projects` dataset and passed through an
 * adversarial fact-checker that verifies every table cell against source data.
 * Never hand-add a number here that is not derivable from the project records.
 */
export type InsightTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type InsightSection = {
  heading: string;
  body: string;
  table?: InsightTable;
};

export type Insight = {
  slug: string;
  title: string;
  meta_description: string;
  /** Answer-first opener — the passage most likely to be quoted. */
  summary_answer: string;
  /** Explicit statement of what the dataset is and is not. */
  dataset_note: string;
  sections: InsightSection[];
  key_findings: string[];
  limitations: string[];
  cannot_answer?: string[];
  word_count: number;
};

/** Populated by the research generator. */
export const INSIGHTS: Insight[] = [];

/** When these articles were last substantively revised (honest freshness signal). */
export const INSIGHTS_UPDATED = '2026-09-16T00:00:00.000Z';

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export function allInsightSlugs(): string[] {
  return INSIGHTS.map((i) => i.slug);
}
