import { Metadata } from "next";
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import ServiceDetailClient from "@/app/services/[id]/_components/serviceClient";
import { ServiceJsonLd } from "@/components/seo/service-json-Id";
import { ServiceLongform } from "@/components/seo/service-longform";
import { getServiceContent } from "@/data/serviceContent";

const BASE_URL = "https://thedevorax.tech";

/** Trim to a clean word boundary so descriptions land in the 120-160 band. */
function clampDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\-—]$/, "") + "…";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;

  // The services table has columns: id, title, icon, desc_text, desc_long,
  // features, created_at. Selecting `description`/`image` (which do not exist)
  // made this query fail, so every service page fell into the "not found"
  // branch below and shipped `noindex` — silently de-indexing all of them.
  const { data: service, error } = await supabase
    .from("services")
    .select("title, desc_text, desc_long")
    .eq("id", id)
    .single();

  if (!service) {
    // Only de-index when the row genuinely does not exist (PGRST116 = no rows).
    // A transient DB/network error must NOT emit `noindex` — that would hand
    // Googlebot a de-indexing directive for a page that is actually fine.
    const genuinelyMissing = !error || error.code === "PGRST116";
    if (genuinelyMissing) {
      return {
        title: "Service Not Found",
        description: "The requested service could not be found.",
        robots: { index: false, follow: false },
      };
    }
    return {
      title: "Software Development Services",
      description:
        "React Native and Flutter apps, AI-powered Next.js platforms, cloud architecture and DevOps automation — six specialist practices, one delivery team.",
      alternates: { canonical: `${BASE_URL}/services/${id}` },
    };
  }

  const canonicalUrl = `${BASE_URL}/services/${id}`;
  // Prefer the hand-written, fact-checked description from the long-form content;
  // fall back to clamping the short DB copy.
  const longform = getServiceContent(id);
  const description =
    longform?.meta_description || clampDescription(service.desc_long || service.desc_text || "");
  // "Mobile Innovation" alone is far under the 30-char floor once rendered;
  // the qualifier keeps the title descriptive and keyword-bearing.
  const title = `${service.title} Services`;
  const ogImage = { url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `${service.title} — DevoraX` };

  return {
    title,
    description,
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
      title: `${title} | DevoraX`,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@devorax_agency",
      creator: "@devorax_agency",
      title: `${title} | DevoraX`,
      description,
      images: [ogImage],
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
      {/* Server-rendered long-form copy: these pages carried ~25 words before,
          far under the coverage floor needed to rank for commercial queries. */}
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <ServiceLongform content={getServiceContent(id)} />
      </div>
    </>
  );
}