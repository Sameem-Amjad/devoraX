"use server";
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import ServiceDetailClient from "@/app/services/[id]/_components/serviceClient";
import { ServiceJsonLd } from "@/components/seo/service-json-Id";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch data on the server - user never sees these queries!
  const [serviceRes, projectsRes] = await Promise.all([
    supabase.from('services').select('*').eq('id', id).single(),
    supabase.from('projects').select('*').eq('service_id', id)
  ]);

  if (!serviceRes.data) return notFound();

  return (
    <>
      <ServiceJsonLd service={projectsRes.data} />
      <ServiceDetailClient
        service={serviceRes.data}
        initialProjects={projectsRes.data || []}
      />
    </>
  );
}