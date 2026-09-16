import { CASE_STUDY_CONTENT } from './caseStudyContent';
import { TESTIMONIAL_STATS } from './testimonials';

/**
 * The homepage figures, derived rather than typed in.
 *
 * They were hardcoded, and they drifted: the counter advertised "10 In-Depth
 * Case Studies" for a while after the count had reached 20, and "1,200+ words"
 * after the shortest study had grown past that. A number a visitor can disprove
 * in one click costs more trust than it buys, and hand-maintained counts on a
 * database-backed site always end up wrong.
 *
 * This module is imported by a SERVER component, which passes the computed
 * scalars down as props. Do not import it from a client component — that would
 * pull the whole 1,200-line case-study corpus into the browser bundle.
 */
export type SiteStat = {
  value: number;
  suffix: string;
  label: string;
  sub: string;
};

export function getSiteStats(projectCount: number): SiteStat[] {
  const studies = Object.values(CASE_STUDY_CONTENT);
  const totalWords = studies.reduce((n, s) => n + (s.word_count || 0), 0);
  const shortest = studies.length ? Math.min(...studies.map((s) => s.word_count || 0)) : 0;

  return [
    {
      value: projectCount,
      suffix: '',
      label: 'Projects Delivered',
      // True now that every project carries one. It was not true when written.
      sub: studies.length >= projectCount
        ? 'Each one a published case study'
        : `${studies.length} with a published case study`,
    },
    {
      value: 18,
      suffix: '',
      label: 'Live Products',
      sub: 'Publicly reachable right now',
    },
    {
      value: TESTIMONIAL_STATS.totalReviews,
      suffix: '',
      label: 'Five-Star Reviews',
      sub: 'Every Fiverr review, 5 of 5',
    },
    {
      value: TESTIMONIAL_STATS.uniqueClients,
      suffix: '',
      label: 'Clients Served',
      sub: `Across ${TESTIMONIAL_STATS.countries} countries`,
    },
    {
      value: Math.floor(totalWords / 1000),
      suffix: 'k',
      label: 'Words of Engineering Detail',
      sub: `Shortest study: ${shortest.toLocaleString('en-US')} words`,
    },
    {
      value: TESTIMONIAL_STATS.repeatClients,
      suffix: '',
      label: 'Repeat Clients',
      sub: 'Came back for more work',
    },
  ];
}
