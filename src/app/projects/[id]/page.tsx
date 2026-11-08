import { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient } from "@/lib/public";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/app/projects/[id]/_components/projectClient";
import { ProjectJsonLd, projectImageUrl } from '@/components/seo/json-ld';
import { CaseStudyLongform } from '@/components/seo/case-study-longform';
import { RelatedReading } from '@/components/seo/related-reading';
import { getCaseStudy } from '@/data/caseStudyContent';
import { doorsCiting } from '@/data/doorsCiting';
import { isHiddenProject, isIndexable, projectPageName, projectPageTitle } from '@/data/projectIndex';

const BASE_URL = 'https://thedevorax.tech';

/**
 * Only the allowlisted projects stay in the index (data/projectIndex.ts).
 * Every other project page, including one added to the database later, is
 * noindex but still followed, so the links on it keep counting.
 *
 * A page-level googleBot replaces the root layout's rather than merging with
 * it, so every directive the layout sets has to be repeated here.
 * max-video-preview had been lost that way, which mattered once these pages
 * started carrying walkthrough videos.
 */
function projectRobots(id: string): Metadata['robots'] {
  if (!isIndexable(id)) {
    return { index: false, follow: true, googleBot: { index: false, follow: true } };
  }
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = createPublicClient();
  const { id } = await params;
  if (isHiddenProject(id)) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
      robots: { index: false, follow: false },
    };
  }
  const { data: project, error } = await supabase
    .from('projects')
    .select('title, description, content, image, tags')
    .eq('id', id)
    .single();

  if (!project) {
    // Only de-index when the row genuinely does not exist (PGRST116 = no rows).
    // A transient DB/network error must NOT emit `noindex` on an allowlisted
    // page: that would hand Googlebot a de-indexing directive for a page that
    // is actually fine.
    const genuinelyMissing = !error || error.code === 'PGRST116';
    if (genuinelyMissing) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.',
        robots: { index: false, follow: false },
      };
    }
    // An id off the allowlist is noindex whatever the database says, so an
    // outage can't put it back in the index; an allowlisted one keeps the
    // layout's robots, as before.
    return {
      title: 'Software Project Portfolio',
      description:
        'Marketplaces, real-time apps, media backends and AI builds that DevoraX\'s founders built or worked on, including as employees of other companies.',
      alternates: { canonical: `${BASE_URL}/projects/${id}` },
      ...(isIndexable(id) ? {} : { robots: projectRobots(id) }),
    };
  }

  const canonicalUrl = `${BASE_URL}/projects/${id}`;

  // Project titles alone ("Loopedin", "Afriva") fall under the ~30-char floor
  // once rendered, and some descriptions are far under 120. Qualify the title
  // and top the description up from `content` rather than shipping a stub.
  // The qualifier is the page's label: "Case Study" only for work a client
  // contracted DevoraX for, otherwise "Engineering Write-up". "DevoraX Case
  // Study" over an employer's product said DevoraX delivered it.
  const title = projectPageTitle(id, project.title);
  // Prefer the hand-written, fact-checked description from the long-form study.
  const study = getCaseStudy(id);
  const base = (study?.meta_description || project.description || '').replace(/\s+/g, ' ').trim();
  const extra = (project.content || '').replace(/\s+/g, ' ').trim();
  let description = base;
  if (description.length < 120 && extra) {
    description = `${base} ${extra}`.trim();
  }
  if (description.length > 155) {
    const cut = description.slice(0, 155);
    description = cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-—]$/, '') + '…';
  }

  // Several projects have an empty/placeholder image. Emitting og:image with an
  // empty url is invalid, so fall back to the site card. projectImageUrl() is
  // shared with the Article node, so both agree on which projects have one.
  //
  // width/height are only declared for the local card, whose dimensions we know.
  // The Supabase project images are source PNGs of arbitrary size (several are
  // multi-megabyte and none are 1200x630), and every one of them was previously
  // shipped with a hardcoded 1200x630 — a dimension assertion that was simply
  // false. Omitting the numbers lets the consumer measure the real image instead
  // of laying out against a wrong one.
  const remoteImage = projectImageUrl(project.image);
  const alt = projectPageName(id, project.title);
  const ogImage = remoteImage
    ? { url: remoteImage, alt }
    : { url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt };
  // The social title is the page title with the suffix the template adds to
  // <title>, which Open Graph and Twitter titles don't get.
  const socialTitle = `${title} | DevoraX`;

  return {
    title,
    description,
    // No "DevoraX project": most of these were built for an employer or for
    // a client who hired Sameem directly, and each page says whose work it was.
    keywords: [
      project.title,
      'engineering write-up',
      'mobile app development',
      'web development portfolio',
      ...(Array.isArray(project.tags) ? project.tags : []),
    ],
    robots: projectRobots(id),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: 'DevoraX',
      title: socialTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Prerender every project page at build time and refresh them on the ISR clock.
 *
 * These routes were rendered per-request: the Supabase helper they used called
 * `cookies()`, which opts the route into dynamic rendering and makes any
 * `revalidate` value inert. Every crawl of every project URL therefore paid a
 * cold round-trip to Supabase before the first byte. With a cookie-free client
 * and `generateStaticParams`, the HTML is built once and served from cache.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('projects').select('id');
  if (error || !data) {
    // Don't fail the build on a transient DB error — fall back to on-demand
    // rendering for this route rather than shipping no project pages at all.
    console.error('[projects/[id]] generateStaticParams failed:', error?.message);
    return [];
  }
  return data.filter((p) => !isHiddenProject(p.id)).map((p) => ({ id: String(p.id) }));
}

// ✅ This ensures the page is fast and SEO friendly
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Hidden projects (data/projectIndex.ts) are off the site: their URLs 404.
  if (isHiddenProject(id)) return notFound();
  const supabase = createPublicClient();

  // Fetch project data strictly on the server
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) return notFound();

  const study = getCaseStudy(id);
  // The door pages that cite this project as proof. Rendered here, on the
  // server, so the solution pages' data stays out of the browser bundle.
  const doors = doorsCiting(id);
  // One list of crumbs for the visible breadcrumb and the BreadcrumbList, so
  // the two can't disagree. Projects, the one portfolio index (/case-study now
  // redirects to it): these pages live under /projects, and a breadcrumb has
  // to describe the path that actually exists.
  const trail = [
    { name: 'Projects', path: '/projects' },
    { name: project.title, path: `/projects/${project.id}` },
  ];

  return <>
    <ProjectJsonLd project={project} trail={trail} />
    <main id="main-content">
      {/* One <article> from the h1 through the long-form study. Extractors such
          as trafilatura take the first <article> on a page as its body, so
          wrapping only the study would have cost them the h1, the project story
          and the tech stack. RelatedReading stays outside it. */}
      <article>
        <ProjectDetailClient project={project} trail={trail} />
        {/* Server-rendered long-form study: these pages carried ~70 words before,
            far under the depth that makes a case study citable or rankable. */}
        {study && (
          <div className="mx-auto max-w-7xl px-6">
            <CaseStudyLongform content={study} />
          </div>
        )}
      </article>
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="max-w-3xl">
          {/* Outside RelatedReading, which renders nothing for a project
              with no study (34). */}
          {doors.length > 0 && (
            <nav aria-labelledby="cited-on" className="mt-16 border-t border-white/5 pt-10">
              <h2 id="cited-on" className="text-xl font-bold text-white">
                Services that cite this work
              </h2>
              <ul className="mt-4 space-y-2">
                {doors.map((door) => (
                  <li key={door.slug}>
                    <Link
                      href={`/solutions/${door.slug}`}
                      className="font-medium text-teal-400 underline underline-offset-4 hover:text-teal-300"
                    >
                      {door.nav_label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <RelatedReading projectId={id} />
        </div>
      </div>
    </main>
  </>;
}