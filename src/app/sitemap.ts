import { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/public';
import { getCaseStudy, CASE_STUDY_CONTENT_UPDATED } from '@/data/caseStudyContent';
import { SERVICE_CONTENT, SERVICE_CONTENT_UPDATED } from '@/data/serviceContent';
import { INSIGHTS, INSIGHTS_UPDATED } from '@/data/insights';
import { SOLUTIONS, SOLUTIONS_UPDATED } from '@/data/solutions';

const BASE_URL = 'https://thedevorax.tech';

/**
 * Bump this when the copy on the static marketing pages meaningfully changes.
 *
 * `lastModified` must reflect a real content change. Wiring `new Date()` into a
 * static sitemap makes every URL look freshly edited on every build, which search
 * engines discount once they notice the timestamps never match the actual page.
 */
const STATIC_CONTENT_UPDATED = new Date('2026-09-16T00:00:00.000Z');

/** Parse a DB timestamp defensively — never emit an Invalid Date into the XML. */
function toDate(value: string | null | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function newest(dates: Date[], fallback: Date): Date {
  if (!dates.length) return fallback;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();

  // NOTE: both detail routes resolve by primary key (`.eq('id', id)`), and the
  // site links to /projects/{id} and /services/{id}. The sitemap must emit the
  // exact URLs that return 200 — previously it emitted slugs (404) for projects
  // and silently dropped services entirely (the table has no slug/updated_at).
  const [projectsRes, servicesRes] = await Promise.all([
    supabase.from('projects').select('id, created_at'),
    supabase.from('services').select('id, created_at'),
  ]);

  if (projectsRes.error) {
    console.error('[sitemap] projects query failed:', projectsRes.error.message);
  }
  if (servicesRes.error) {
    console.error('[sitemap] services query failed:', servicesRes.error.message);
  }

  // Pages whose body copy was substantively rewritten carry the real revision
  // date. Everything else keeps its row timestamp — lastModified must describe an
  // actual content change, not a build.
  const projectEntries: MetadataRoute.Sitemap = (projectsRes.data ?? []).map((project) => {
    const study = getCaseStudy(project.id);
    return {
      url: `${BASE_URL}/projects/${project.id}`,
      // Each study carries its own revision date — the second batch was written
      // later than the first, and reporting one shared date for both would make
      // ten pages claim a freshness they do not have.
      lastModified: study
        ? new Date(study.updated ?? CASE_STUDY_CONTENT_UPDATED)
        : toDate(project.created_at, STATIC_CONTENT_UPDATED),
    };
  });

  const serviceEntries: MetadataRoute.Sitemap = (servicesRes.data ?? []).map((service) => ({
    url: `${BASE_URL}/services/${service.id}`,
    lastModified: SERVICE_CONTENT[Number(service.id)]
      ? new Date(SERVICE_CONTENT_UPDATED)
      : toDate(service.created_at, STATIC_CONTENT_UPDATED),
  }));

  // Index pages are only as fresh as the newest item they list.
  const projectsUpdated = newest(
    projectEntries.map((e) => e.lastModified as Date),
    STATIC_CONTENT_UPDATED
  );
  const servicesUpdated = newest(
    serviceEntries.map((e) => e.lastModified as Date),
    STATIC_CONTENT_UPDATED
  );

  // `priority` and `changeFrequency` are intentionally omitted: Google ignores
  // both, and emitting them adds bytes without adding signal.
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: projectsUpdated },
    { url: `${BASE_URL}/services`, lastModified: servicesUpdated },
    { url: `${BASE_URL}/projects`, lastModified: projectsUpdated },
    { url: `${BASE_URL}/case-study`, lastModified: projectsUpdated },
    { url: `${BASE_URL}/team`, lastModified: STATIC_CONTENT_UPDATED },
    { url: `${BASE_URL}/contact`, lastModified: STATIC_CONTENT_UPDATED },
    // Legal pages are trust signals, so they belong in the index.
    { url: `${BASE_URL}/privacy`, lastModified: STATIC_CONTENT_UPDATED },
    { url: `${BASE_URL}/terms`, lastModified: STATIC_CONTENT_UPDATED },
  ];

  // Research articles. Only listed once published — an empty insights set must not
  // put /insights in the sitemap pointing at nothing.
  const insightEntries: MetadataRoute.Sitemap = INSIGHTS.length
    ? [
        { url: `${BASE_URL}/insights`, lastModified: new Date(INSIGHTS_UPDATED) },
        ...INSIGHTS.map((a) => ({
          url: `${BASE_URL}/insights/${a.slug}`,
          lastModified: new Date(INSIGHTS_UPDATED),
        })),
      ]
    : [];

  // Commercial solution landing pages. Like /insights, only listed once there is
  // something to list — an empty set must not put a hub URL in the index pointing
  // at nothing.
  const solutionEntries: MetadataRoute.Sitemap = SOLUTIONS.map((s) => ({
    url: `${BASE_URL}/solutions/${s.slug}`,
    lastModified: new Date(SOLUTIONS_UPDATED),
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...projectEntries,
    ...insightEntries,
    ...solutionEntries,
  ];
}
