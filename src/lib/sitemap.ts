/**
 * The sitemaps: which URLs each section lists, when each one's content last
 * changed, and the XML.
 *
 * /sitemap.xml is an index of four child sitemaps under /sitemaps/ (pages,
 * services, case-studies, insights), so Search Console reports submitted vs
 * indexed per section rather than one number for the whole site. They are route
 * handlers, not app/sitemap.ts, because Next's metadata sitemap can't produce an
 * index and writes values into the XML unescaped. case-studies.xml keeps its
 * name, which Search Console already knows, but lists /projects and only the
 * project pages on the index allowlist (data/projectIndex.ts): the rest are
 * noindex, and a sitemap that lists noindex pages asks for what it forbids.
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
import { CATALOGUE_UPDATED } from '@/data/catalogue';
import { TERMS_DATA_UPDATED } from '@/data/terms';
import { REVIEWS_PAGE_UPDATED } from '@/data/testimonials';
import { FAQS_UPDATED } from '@/data/faqs';
import { PRIVACY_UPDATED, TERMS_UPDATED } from '@/data/legal';
import { GLOSSARY, GLOSSARY_UPDATED } from '@/data/glossary';
import { getCaseStudy, CASE_STUDY_CONTENT_UPDATED } from '@/data/caseStudyContent';
import { INSIGHTS, insightUpdated } from '@/data/insights';
import { SOLUTIONS, solutionUpdated } from '@/data/solutions';
import { isIndexable } from '@/data/projectIndex';
import {
  absoluteMediaUrl,
  durationSeconds,
  projectGallery,
  projectVideo,
  uploadDateTime,
  videoTitle,
} from '@/lib/projectMedia';

export type SitemapVideo = {
  thumbnailLoc: string;
  title: string;
  description: string;
  contentLoc: string;
  /** Whole seconds. */
  duration: number;
  /** ISO 8601 with a time zone. */
  publicationDate: string;
};

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  /** Absolute image URLs shown on the page. */
  images?: string[];
  /** Videos the page plays. */
  videos?: SitemapVideo[];
};

/** Each is served at /sitemaps/{name}.xml. */
export const SECTIONS = ['pages', 'services', 'case-studies', 'insights'] as const;
export type Section = (typeof SECTIONS)[number];

/** Bump this when the copy on the static marketing pages meaningfully changes. */
const STATIC_CONTENT_UPDATED = new Date('2026-09-16T00:00:00.000Z');

/** /contact was rewritten around the booking page, and /book's call hours
 *  gained the evening slots, on 7 Nov 2026. The same day the homepage's work
 *  grid started with the projects on the index allowlist and its service cards
 *  became the door pages, /insights lost the retired "25 production builds"
 *  article, /services was rebuilt around the door pages, and /projects got a
 *  new title and a line saying whose work each project was. */
const PAGES_UPDATED_2026_11_07 = new Date('2026-11-07T00:00:00.000Z');

/** Owner decisions of 8 Nov 2026. The homepage: the Fiverr record and reviews
 *  became the studio's (badge, record strip, reviews heading), the check-in
 *  practices and the specialist line were stated as confirmed, and a row of
 *  market-page links went under the industries grid. /team and /about: who
 *  works on a project, specialists included; /about also links the reviews as
 *  the studio's. (/reviews dates itself in data/testimonials.ts.) */
const PAGES_UPDATED_2026_11_08 = new Date('2026-11-08T00:00:00.000Z');

/** The homepage was rebuilt on 10 Nov 2026: a new hero over the walkthrough
 *  posters, one proof band in place of five repeats of the same figures, six
 *  large project cards, the door pages as a bento grid, the offer ladder as
 *  the process with its terms beside each step, the published terms in place
 *  of "Why DevoraX", the two founders' photographs, and the stack after the
 *  work. Its copy now includes the ladder and the terms, so those dates count
 *  toward it too. */
const HOME_UPDATED_2026_11_10 = new Date('2026-11-10T00:00:00.000Z');

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
type ProjectRow = Row & {
  title: string;
  image: string | null;
  /** jsonb, parsed by src/lib/projectMedia.ts. */
  video: unknown;
  gallery: unknown;
};

/**
 * Project pages resolve by primary key (`.eq('id', id)`), and the site links to
 * /projects/{id}, so the sitemap lists ids: the exact URLs that return 200. It
 * once emitted slugs (404). The services table is no longer read: its
 * /services/{id} pages redirect (next.config.ts), and a sitemap names no URL
 * that redirects.
 *
 * A failed query is logged and lists nothing from that table rather than
 * throwing, so crawlers still get every other URL instead of an error.
 */
async function selectRows<T>(table: 'projects', columns: string): Promise<T[]> {
  try {
    const { data, error } = await createPublicClient().from(table).select(columns).order('id');
    if (!error) return (data ?? []) as T[];
    console.error(`[sitemap] ${table} query failed:`, error.message);
  } catch (err) {
    console.error(`[sitemap] ${table} query failed:`, err);
  }
  return [];
}

export const fetchProjects = () =>
  selectRows<ProjectRow>('projects', 'id, created_at, title, image, video, gallery');

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
    // The card image plus the gallery screenshots, once each: a new project's
    // card image is also its first screenshot.
    const images = [
      ...new Set([image, ...projectGallery(project.gallery).map((g) => projectImage(g.src))]),
    ].filter((src): src is string => Boolean(src));
    const video = projectVideo(project.video);
    return {
      url: absoluteUrl(`/projects/${project.id}`),
      // A rewritten study carries its own revision date: the second batch was
      // written later than the first, and one shared date would make ten pages
      // claim a freshness they do not have. The rest keep their row timestamp.
      lastModified: study
        ? new Date(study.updated ?? CASE_STUDY_CONTENT_UPDATED)
        : toDate(project.created_at, STATIC_CONTENT_UPDATED),
      ...(images.length ? { images } : {}),
      ...(video
        ? {
            videos: [
              {
                thumbnailLoc: absoluteMediaUrl(video.poster),
                title: videoTitle(project.title),
                description: video.caption,
                contentLoc: absoluteMediaUrl(video.src),
                duration: durationSeconds(video.duration),
                publicationDate: uploadDateTime(video.uploadDate),
              },
            ],
          }
        : {}),
    };
  });
}

/**
 * Index pages are only as fresh as the newest item they list. The homepage and
 * /projects list every project, noindex ones included, so every one counts.
 */
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
    // The homepage lists projects and prints every FAQ answer, the offer
    // ladder and six of the terms.
    {
      url: absoluteUrl('/'),
      lastModified: newest(
        [projectsUpdated(projects), HOME_UPDATED_2026_11_10, new Date(FAQS_UPDATED), new Date(OFFER_UPDATED), new Date(TERMS_DATA_UPDATED), new Date(CATALOGUE_UPDATED)],
        HOME_UPDATED_2026_11_10
      ),
    },
    // /about prints the brand facts and its own copy; the page's dateModified
    // is the newer of the same two.
    { url: absoluteUrl('/about'), lastModified: newest([brandFacts, PAGES_UPDATED_2026_11_08], PAGES_UPDATED_2026_11_08) },
    { url: absoluteUrl('/team'), lastModified: PAGES_UPDATED_2026_11_08 },
    // /pricing prints the prices (data/offer.ts) and, under #terms, every term
    // (data/terms.ts), so it is as fresh as the newer of the two.
    { url: absoluteUrl('/pricing'), lastModified: newest([new Date(OFFER_UPDATED), new Date(TERMS_DATA_UPDATED)], new Date(OFFER_UPDATED)) },
    // The reviews' copy date, or the page's own wording, whichever is newer.
    { url: absoluteUrl('/reviews'), lastModified: new Date(REVIEWS_PAGE_UPDATED) },
    { url: absoluteUrl('/press'), lastModified: brandFacts },
    // /contact prints every FAQ answer (data/faqs.ts), so it is as fresh as
    // the newer of its own rewrite and those answers.
    { url: absoluteUrl('/contact'), lastModified: newest([PAGES_UPDATED_2026_11_07, new Date(FAQS_UPDATED)], PAGES_UPDATED_2026_11_07) },
    // /book prints the start date and the audit turnaround from data/terms.ts.
    { url: absoluteUrl('/book'), lastModified: newest([PAGES_UPDATED_2026_11_07, new Date(TERMS_DATA_UPDATED)], PAGES_UPDATED_2026_11_07) },
    // Legal pages are trust signals, so they belong in the index.
    { url: absoluteUrl('/privacy'), lastModified: new Date(PRIVACY_UPDATED) },
    { url: absoluteUrl('/terms'), lastModified: new Date(TERMS_UPDATED) },
  ];
}

/**
 * /services and the solution pages. The four /services/{id} pages left on
 * 7 Nov 2026: they redirect to the door pages or to /services.
 */
export function serviceEntries(): SitemapEntry[] {
  return [
    // The hub prints the doors' copy, the ladder's steps and prices
    // (data/offer.ts) and the catalogue (data/catalogue.ts), so it is as fresh
    // as the newest of its rebuild and those. The homepage also prints the
    // catalogue and, since 11 Nov 2026, the service pages' questions.
    {
      url: absoluteUrl('/services'),
      lastModified: newest(
        [PAGES_UPDATED_2026_11_07, new Date(OFFER_UPDATED), new Date(CATALOGUE_UPDATED)],
        PAGES_UPDATED_2026_11_07
      ),
    },
    // Commercial solution landing pages. A door page carries its own revision
    // date, so publishing one does not re-date the vertical pages.
    ...SOLUTIONS.map((s) => ({
      url: absoluteUrl(`/solutions/${s.slug}`),
      lastModified: new Date(solutionUpdated(s)),
    })),
  ];
}

/**
 * /projects and the project pages on the index allowlist. Every other project
 * page is noindex, and /case-study now redirects to /projects, so neither is
 * listed: a sitemap names only URLs that should be indexed.
 */
export function caseStudyEntries(projects: ProjectRow[]): SitemapEntry[] {
  return [
    // /projects lists every project, and its own copy last changed on 8 Nov 2026.
    {
      url: absoluteUrl('/projects'),
      lastModified: newest([projectsUpdated(projects), PAGES_UPDATED_2026_11_08], PAGES_UPDATED_2026_11_08),
    },
    ...projectEntries(projects.filter((p) => isIndexable(p.id))),
  ];
}

export function insightEntries(): SitemapEntry[] {
  // Each article's own revision date where it has one (the checklist does), so
  // adding a page does not re-date the others. The hub is as fresh as the
  // newest article it lists, and never older than its own copy (last changed
  // on 8 Nov 2026).
  const articles = INSIGHTS.map((a) => ({
    url: absoluteUrl(`/insights/${a.slug}`),
    lastModified: new Date(insightUpdated(a)),
  }));
  // A hub is listed only once it has something to list: an empty set must not
  // put /insights or /glossary in the index pointing at nothing.
  return [
    ...(INSIGHTS.length
      ? [
          {
            url: absoluteUrl('/insights'),
            lastModified: newest(
              [...articles.map((e) => e.lastModified), PAGES_UPDATED_2026_11_08],
              PAGES_UPDATED_2026_11_08
            ),
          },
        ]
      : []),
    ...articles,
    ...(GLOSSARY.length
      ? [{ url: absoluteUrl('/glossary'), lastModified: new Date(GLOSSARY_UPDATED) }]
      : []),
  ];
}

/** Every section, querying the projects table once. The index needs all four for its dates. */
export async function buildAllSections(): Promise<Record<Section, SitemapEntry[]>> {
  const projects = await fetchProjects();
  return {
    pages: pageEntries(projects),
    services: serviceEntries(),
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
const VIDEO_NS = 'http://www.google.com/schemas/sitemap-video/1.1';

/** A <video:video> block. Google requires thumbnail, title, description and a content or player location. */
function videoXml(v: SitemapVideo): string {
  return [
    '    <video:video>',
    `      <video:thumbnail_loc>${escapeXml(v.thumbnailLoc)}</video:thumbnail_loc>`,
    `      <video:title>${escapeXml(v.title)}</video:title>`,
    `      <video:description>${escapeXml(v.description)}</video:description>`,
    `      <video:content_loc>${escapeXml(v.contentLoc)}</video:content_loc>`,
    `      <video:duration>${v.duration}</video:duration>`,
    `      <video:publication_date>${escapeXml(v.publicationDate)}</video:publication_date>`,
    '    </video:video>',
  ].join('\n');
}

export function urlsetXml(entries: SitemapEntry[]): string {
  // Only a sitemap that lists an image (or a video) declares that namespace.
  const hasImages = entries.some((e) => e.images?.length);
  const hasVideos = entries.some((e) => e.videos?.length);
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
      ...(e.videos ?? []).map(videoXml),
      '  </url>',
    ].join('\n')
  );
  return [
    XML_DECLARATION,
    `<urlset xmlns="${SITEMAP_NS}"${hasImages ? ` xmlns:image="${IMAGE_NS}"` : ''}${
      hasVideos ? ` xmlns:video="${VIDEO_NS}"` : ''
    }>`,
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
