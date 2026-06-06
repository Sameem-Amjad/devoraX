import { Metadata } from "next";
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import ServiceDetailClient from "@/app/services/[id]/_components/serviceClient";
import { ServiceJsonLd } from "@/components/seo/service-json-Id";

const BASE_URL = "https://thedevorax.tech";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data: service } = await supabase
    .from("services")
    .select("title, description, image")
    .eq("id", id)
    .single();

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${BASE_URL}/services/${id}`;

  return {
    title: service.title,
    description: service.description,
    keywords: [
      service.title,
      "DevoraX service",
      "software development service",
      "mobile app development",
      "AI-powered development",
      "custom software solutions",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
    },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "DevoraX",
      title: `${service.title} | DevoraX`,
      description: service.description,
      images: service.image
        ? [{ url: service.image, width: 1200, height: 630, alt: service.title }]
        : [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: service.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@devorax_agency",
      creator: "@devorax_agency",
      title: `${service.title} | DevoraX`,
      description: service.description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [serviceRes, projectsRes] = await Promise.all([
    supabase.from("services").select("*").eq("id", id).single(),
    supabase.from("projects").select("*").eq("service_id", id),
  ]);

  if (!serviceRes.data) return notFound();

  return (
    <>
      <ServiceJsonLd service={serviceRes.data} />
      <ServiceDetailClient
        service={serviceRes.data}
        initialProjects={projectsRes.data || []}
      />
    </>
  );
}