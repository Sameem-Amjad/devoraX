import { createClient } from "@/lib/server";
import CaseStudyClient from "./CaseStudyClient";
import { Metadata } from "next";

export const revalidate = 3600;

const BASE_URL = "https://thedevorax.tech";

export const metadata: Metadata = {
  title: "Case Studies",
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
    site: "@devorax_agency",
    creator: "@devorax_agency",
    title: "Case Studies | DevoraX",
    description:
      "Explore our portfolio of high-impact digital products built for global clients.",
    images: [{ url: `${BASE_URL}/og-image.jpg`, alt: "DevoraX Case Studies" }],
  },
  alternates: {
    canonical: `${BASE_URL}/case-study`,
  },
};

export default async function CaseStudyPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return <CaseStudyClient projects={projects || []} />;
}
