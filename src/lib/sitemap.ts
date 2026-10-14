/**
 * The sitemaps: which URLs each section lists, when each one's content last
 * changed, and the XML.
 *
 * /sitemap.xml is an index of four child sitemaps under /sitemaps/ (pages,
 * services, case studies, insights), so Search Console reports submitted vs
 * indexed per section rather than one number for the whole site. They are route
 * handlers, not app/sitemap.ts, because Next's metadata sitemap can't produce an
 * index and writes values into the XML unescaped.
 *
 * `lastModified` must reflect a real content change. Wiring `new Date()` into a
 * sitemap makes every URL look freshly edited on every build, which search
 * engines discount once they notice the timestamps never match the actual page.
 * `changefreq` and `priority` are omitted: Google ignores both.
 */
import { createPublicClient } from '@/lib/public';
import { absoluteUrl } from '@/lib/seo';
import { BRAND_FACTS_UPDATED } from '@/data/brand';
import { OFFER_UPDATED } from '@/data/offer';
import { TESTIMONIALS_UPDATED } from '@/data/testimonials';
import { PRIVACY_UPDATED, TERMS_UPDATED } from '@/data/legal';
import { GLOSSARY, GLOSSARY_UPDATED } from '@/data/glossary';
import { getCaseStudy, CASE_STUDY_CONTENT_UPDATED } from '@/data/caseStudyContent';
import { SERVICE_CONTENT, SERVICE_CONTENT_UPDATED } from '@/data/serviceContent';
import { INSIGHTS, INSIGHTS_UPDATED } from '@/data/insights';
import { SOLUTIONS, SOLUTIONS_UPDATED } from '@/data/solutions';

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  /** Absolute image URLs shown on the page. */
  images?: string[];
};

/** Each is served at /sitemaps/{name}.xml. */
export const SECTIONS = ['pages', 'services', 'case-studies', 'insights'] as const;
export type Section = (typeof SECTIONS)[number];

/** Bump this when the copy on the static marketing pages meaningfully changes. */
const STATIC_CONTENT_UPDATED = new Date('2026-09-16T00:00:00.000Z');

/** /team (banner, card), /contact (channels, hours), /book (what the call
 *  covers), the homepage (banner, reviews link) and the /insights hub (recount
 *  to 26 entries) changed on 14 Oct 2026. */
const PAGES_UPDATED_2026_10_14 = new Date('2026-10-14T00:00:00.000Z');

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

// ── Rows ──

type Row = { id: number | string; created_at: string | null };
type ProjectRow = Row & { image: string | null };

/**
 * Both detail routes resolve by primary key (`.eq('id', id)`), and the site
 * links to /projects/{id} and /services/{id}, so the sitemap lists ids: the
 * exact URLs that return 200. It once emitted slugs for projects (404) and
 * dropped services entirely (the table has no slug or updated_at).
 *
 * A failed query is logged and lists nothing from that table rather than
 * throwing, so crawlers still get every other URL instead of an error.
 */
async function selectRows<T>(table: 'projects' | 'services', columns: string): Promise<T[]> {
  try {
    const { data, error } = await createPublicClient().from(table).select(columns).order('id');
    if (!error) return (data ?? []) as T[];
    console.error(`[sitemap] ${table} query failed:`, error.message);
  } catch (err) {
    console.error(`[sitemap] ${table} query failed:`, err);
  }
  return [];
}

export const fetchProjects = () => selectRows<ProjectRow>('projects', 'id, created_at, image');
export const fetchServices = () => selectRows<Row>('services', 'id, created_at');

/**
 * The `image` column holds junk as well as URLs: '', the string 'null', values
 * wrapped in quotes. Unwrap the quotes as the project page does, then keep only
 * an absolute http(s) URL.
 */
function projectImage(raw: unknown): string | undefined {
  const value = typeof raw === 'string' ? raw.trim().replace(/^"+|"+$/g, '') : '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function projectEntries(projects: ProjectRow[]): SitemapEntry[] {
  return projects.map((project) => {
    const study = getCaseStudy(project.id);
    const image = projectImage(project.image);
    return {
      url: absoluteUrl(`/projects/${project.id}`),
      // A rewritten study carries its own revision date: the second batch was
      // written later than the first, and one shared date would make ten pages
      // claim a freshness they do not have. The rest keep their row timestamp.
      lastModified: study
        ? new Date(study.updated ?? CASE_STUDY_CONTENT_UPDATED)
        : toDate(project.created_at, STATIC_CONTENT_UPDATED),
      ...(image ? { images: [image] } : {}),
    };
  });
}

/** Index pages are only as fresh as the newest item they list. */
function projectsUpdated(projects: ProjectRow[]): Date {
  return newest(
    projectEntries(projects).map((e) => e.lastModified),
    STATIC_CONTENT_UPDATED
  );
}

// ── Sections: one function per child sitemap ──

export function pageEntries(projects: ProjectRow[]): SitemapEntry[] {
  const brandFacts = new Date(BRAND_FACTS_UPDATED);
  return [
    // The homepage lists projects.
    { url: absoluteUrl('/'), lastModified: newest([projectsUpdated(projects), PAGES_UPDATED_2026_10_14], PAGES_UPDATED_2026_10_14) },
    { url: absoluteUrl('/about'), lastModified: brandFacts },
    { url: absoluteUrl('/team'), lastModified: PAGES_UPDATED_2026_10_14 },
    { url: absoluteUrl('/pricing'), lastModified: new Date(OFFER_UPDATED) },
    { url: absoluteUrl('/reviews'), lastModified: new Date(TESTIMONIALS_UPDATED) },
    { url: absoluteUrl('/press'), lastModified: brandFacts },
    { url: absoluteUrl('/contact'), lastModified: PAGES_UPDATED_2026_10_14 },
    { url: absoluteUrl('/book'), lastModified: PAGES_UPDATED_2026_10_14 },
    // Legal pages are trust signals, so they belong in the index.
    { url: absoluteUrl('/privacy'), lastModified: new Date(PRIVACY_UPDATED) },
    { url: absoluteUrl('/terms'), lastModified: new Date(TERMS_UPDATED) },
  ];
}

export function serviceEntries(services: Row[]): SitemapEntry[] {
  // Services with long-form copy carry its revision date; the rest keep their
  // row timestamp.
  const details = services.map((service) => ({
    url: absoluteUrl(`/services/${service.id}`),
    lastModified: SERVICE_CONTENT[Number(service.id)]
      ? new Date(SERVICE_CONTENT_UPDATED)
      : toDate(service.created_at, STATIC_CONTENT_UPDATED),
  }));
  return [
    {
      url: absoluteUrl('/services'),
      lastModified: newest(details.map((e) => e.lastModified), STATIC_CONTENT_UPDATED),
    },
    ...details,
    // Commercial solution landing pages.
    ...SOLUTIONS.map((s) => ({
      url: absoluteUrl(`/solutions/${s.slug}`),
      lastModified: new Date(SOLUTIONS_UPDATED),
    })),
  ];
}

export function caseStudyEntries(projects: ProjectRow[]): SitemapEntry[] {
  const hubs = projectsUpdated(projects);
  return [
    { url: absoluteUrl('/projects'), lastModified: hubs },
    { url: absoluteUrl('/case-study'), lastModified: hubs },
    ...projectEntries(projects),
  ];
}

export function insightEntries(): SitemapEntry[] {
  const articles = new Date(INSIGHTS_UPDATED);
  // A hub is listed only once it has something to list: an empty set must not
  // put /insights or /glossary in the index pointing at nothing.
  return [
    ...(INSIGHTS.length ? [{ url: absoluteUrl('/insights'), lastModified: newest([articles, PAGES_UPDATED_2026_10_14], articles) }] : []),
    ...INSIGHTS.map((a) => ({ url: absoluteUrl(`/insights/${a.slug}`), lastModified: articles })),
    ...(GLOSSARY.length
      ? [{ url: absoluteUrl('/glossary'), lastModified: new Date(GLOSSARY_UPDATED) }]
      : []),
  ];
}

/** Every section, querying each table once. The index needs all four for its dates. */
export async function buildAllSections(): Promise<Record<Section, SitemapEntry[]>> {
  const [projects, services] = await Promise.all([fetchProjects(), fetchServices()]);
  return {
    pages: pageEntries(projects),
    services: serviceEntries(services),
    'case-studies': caseStudyEntries(projects),
    insights: insightEntries(),
  };
}

/** The index lists each non-empty section, dated by the newest URL in it. */
export function indexEntries(sections: Record<Section, SitemapEntry[]>): SitemapEntry[] {
  return SECTIONS.filter((name) => sections[name].length).map((name) => ({
    url: absoluteUrl(`/sitemaps/${name}.xml`),
    lastModified: newest(
      sections[name].map((e) => e.lastModified),
      STATIC_CONTENT_UPDATED
    ),
  }));
}

// ── XML ──

const XML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&apos;',
  '"': '&quot;',
};

/** The sitemap protocol requires these five escaped in every value, URLs included. */
export function escapeXml(value: string): string {
  return value.replace(/[&<>'"]/g, (c) => XML_ENTITIES[c]);
}

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const IMAGE_NS = 'http://www.google.com/schemas/sitemap-image/1.1';

export function urlsetXml(entries: SitemapEntry[]): string {
  // Only a sitemap that lists an image declares the image namespace.
  const hasImages = entries.some((e) => e.images?.length);
  const urls = entries.map((e) =>
    [
      '  <url>',
      `    <loc>${escapeXml(e.url)}</loc>`,
      // lastmod before image:image: the schema puts extension elements last.
      `    <lastmod>${e.lastModified.toISOString()}</lastmod>`,
      // Location only: Google no longer reads image:title or image:caption.
      ...(e.images ?? []).map(
        (src) => `    <image:image><image:loc>${escapeXml(src)}</image:loc></image:image>`
      ),
      '  </url>',
    ].join('\n')
  );
  return [
    XML_DECLARATION,
    `<urlset xmlns="${SITEMAP_NS}"${hasImages ? ` xmlns:image="${IMAGE_NS}"` : ''}>`,
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

export function sitemapIndexXml(children: SitemapEntry[]): string {
  const sitemaps = children.map((c) =>
    [
      '  <sitemap>',
      `    <loc>${escapeXml(c.url)}</loc>`,
      `    <lastmod>${c.lastModified.toISOString()}</lastmod>`,
      '  </sitemap>',
    ].join('\n')
  );
  return [XML_DECLARATION, `<sitemapindex xmlns="${SITEMAP_NS}">`, ...sitemaps, '</sitemapindex>', ''].join(
    '\n'
  );
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
