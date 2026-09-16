import { MetadataRoute } from 'next';
import { createClient } from '@/lib/server';

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
  const supabase = await createClient();

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

  const projectEntries: MetadataRoute.Sitemap = (projectsRes.data ?? []).map((project) => ({
    url: `${BASE_URL}/projects/${project.id}`,
    lastModified: toDate(project.created_at, STATIC_CONTENT_UPDATED),
  }));

  const serviceEntries: MetadataRoute.Sitemap = (servicesRes.data ?? []).map((service) => ({
    url: `${BASE_URL}/services/${service.id}`,
    lastModified: toDate(service.created_at, STATIC_CONTENT_UPDATED),
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
  ];

  return [...staticEntries, ...serviceEntries, ...projectEntries];
}
