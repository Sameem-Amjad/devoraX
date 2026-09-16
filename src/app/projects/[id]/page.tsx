import { Metadata } from 'next';
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/app/projects/[id]/_components/projectClient";
import { ProjectJsonLd } from '@/components/seo/json-ld';
import { CaseStudyLongform } from '@/components/seo/case-study-longform';
import { getCaseStudy } from '@/data/caseStudyContent';

const BASE_URL = 'https://thedevorax.tech';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data: project, error } = await supabase
    .from('projects')
    .select('title, description, content, image, tags')
    .eq('id', id)
    .single();

  if (!project) {
    // Only de-index when the row genuinely does not exist (PGRST116 = no rows).
    // A transient DB/network error must NOT emit `noindex` — that would hand
    // Googlebot a de-indexing directive for a page that is actually fine.
    const genuinelyMissing = !error || error.code === 'PGRST116';
    if (genuinelyMissing) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.',
        robots: { index: false, follow: false },
      };
    }
    return {
      title: 'Software Project Portfolio',
      description:
        'Fintech apps, AI e-commerce platforms, SaaS dashboards and React Native builds — real products shipped to production for clients worldwide.',
      alternates: { canonical: `${BASE_URL}/projects/${id}` },
    };
  }

  const canonicalUrl = `${BASE_URL}/projects/${id}`;

  // Project titles alone ("Loopedin", "Afriva") fall under the ~30-char floor
  // once rendered, and some descriptions are far under 120. Qualify the title
  // and top the description up from `content` rather than shipping a stub.
  const title = `${project.title} Case Study`;
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
  // empty url is invalid, so fall back to the site card.
  const rawImage = (project.image || '').trim().replace(/^"+|"+$/g, '');
  const imageUrl = rawImage.startsWith('http') ? rawImage : `${BASE_URL}/og-image.jpg`;
  const ogImage = { url: imageUrl, width: 1200, height: 630, alt: `${project.title} — DevoraX case study` };

  return {
    title,
    description,
    keywords: [
      project.title,
      'DevoraX project',
      'software development case study',
      'mobile app development',
      'web development portfolio',
      ...(Array.isArray(project.tags) ? project.tags : []),
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: 'DevoraX',
      title: `${project.title} | DevoraX Case Study`,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | DevoraX Case Study`,
      description,
      images: [ogImage],
    },
  };
}

// ✅ This ensures the page is fast and SEO friendly
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch project data strictly on the server
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) return notFound();

  return <>
    <ProjectJsonLd project={project} />
    <ProjectDetailClient project={project} />
    {/* Server-rendered long-form study: these pages carried ~70 words before,
        far under the depth that makes a case study citable or rankable. */}
    <div className="mx-auto max-w-7xl px-6 pb-20">
      <CaseStudyLongform content={getCaseStudy(id)} />
    </div>
  </>;
}