import type { Metadata } from "next";
import { createPublicClient } from "@/lib/public";
import HomeClient from "@/app/_components/homeClient";
import { faqPageSchema } from "@/data/faqs";
import { getSiteStats } from "@/data/siteStats";

const BASE_URL = "https://thedevorax.tech";

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s | DevoraX" template — without it
  // this rendered as "DevoraX | … | DevoraX" with the brand duplicated.
  // The positioning line first, brand last, 39 chars.
  title: { absolute: "We Finish and Ship Stuck Apps | DevoraX" },
  // 156 chars — Google truncates around 155-160.
  description:
    "Built with Lovable, Replit, Bolt or Cursor, on Sharetribe, or half-built? We finish and ship it: working payments, iOS and Android apps, App Store approval.",
  alternates: {
    canonical: BASE_URL,
  },
};

// ✅ Caching works here
export const revalidate = 3600;

export default async function Home() {
  const supabase = createPublicClient();

  // ✅ Fetching data on the server is faster and more secure
  const [projectsRes, servicesRes] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("services").select("*")
  ]);

  // Pass the data to the Client Component
  return (
    <>
      {/* Server-rendered so crawlers (and AI crawlers, which don't run JS) see it.
          Generated from the same FAQS array <FAQSection /> renders below. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <HomeClient
        initialProjects={projectsRes.data || []}
        initialServices={servicesRes.data || []}
        // Fiverr-record figures plus a store-listing count computed from the
        // projects table, so the counter cannot drift out of date.
        stats={getSiteStats(projectsRes.data || [])}
      />
    </>
  );
}