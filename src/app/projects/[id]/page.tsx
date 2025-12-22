"use server"
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/app/projects/[id]/_components/projectClient";

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

  return <ProjectDetailClient project={project} />;
}