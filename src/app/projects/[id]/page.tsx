"use server"
import { Metadata } from 'next';
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/app/projects/[id]/_components/projectClient";
import { ProjectJsonLd } from '@/components/seo/json-ld';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data: project } = await supabase
    .from('projects')
    .select('title, description, image')
    .eq('id', id)
    .single();

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Devora Case Study`,
      description: project.description,
      images: [{ url: project.image }], // Ensure this is a real URL
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