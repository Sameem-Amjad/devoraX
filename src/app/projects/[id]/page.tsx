import { Metadata } from 'next';
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/app/projects/[id]/_components/projectClient";
import { ProjectJsonLd } from '@/components/seo/json-ld';

const BASE_URL = 'https://thedevorax.tech';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data: project } = await supabase
    .from('projects')
    .select('title, description, image, tags')
    .eq('id', id)
    .single();

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${BASE_URL}/projects/${id}`;

  return {
    title: project.title,
    description: project.description,
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
      description: project.description,
      images: [{ url: project.image, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@devorax_agency',
      creator: '@devorax_agency',
      title: `${project.title} | DevoraX Case Study`,
      description: project.description,
      images: [{ url: project.image, alt: project.title }],
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
  </>;
}