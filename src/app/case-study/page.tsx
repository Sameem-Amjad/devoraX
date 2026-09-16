import { createPublicClient } from "@/lib/public";
import CaseStudyClient from "./CaseStudyClient";
import { Metadata } from "next";

export const revalidate = 3600;

const BASE_URL = "https://thedevorax.tech";

export const metadata: Metadata = {
  title: "Case Studies — Real Client Results",
  description:
    "Explore our portfolio of high-impact digital products — web apps, mobile apps, AI solutions, and more built for global clients.",
  keywords: [
    "DevoraX case studies",
    "software development portfolio",
    "mobile app portfolio",
    "AI project examples",
    "Next.js case studies",
    "React Native portfolio",
    "web development work",
    "client projects",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/case-study`,
    siteName: "DevoraX",
    title: "Case Studies | DevoraX",
    description:
      "Explore our portfolio of high-impact digital products — web apps, mobile apps, AI solutions, and more built for global clients.",
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "DevoraX Case Studies" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | DevoraX",
    description:
      "Explore our portfolio of high-impact digital products built for global clients.",
    images: [{ url: `${BASE_URL}/og-image.jpg`, alt: "DevoraX Case Studies" }],
  },
  alternates: {
    canonical: `${BASE_URL}/case-study`,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Case Studies", item: `${BASE_URL}/case-study` },
  ],
};

/** Hub/pillar pages should expose the collection they link to as an ItemList. */
const itemListSchema = (projects: { id: number | string; title: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "DevoraX Case Studies",
  description:
    "Client projects delivered by DevoraX across web, mobile, AI and cloud.",
  numberOfItems: projects.length,
  itemListElement: projects.map((project, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: project.title,
    // Must match the URLs that actually resolve (routes look up by id).
    url: `${BASE_URL}/projects/${project.id}`,
  })),
});

export default async function CaseStudyPage() {
  const supabase = createPublicClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const list = projects || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema(list)) }}
      />
      <CaseStudyClient projects={list} />
    </>
  );
}
