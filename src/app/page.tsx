import type { Metadata } from "next";
import { createPublicClient } from "@/lib/public";
import HomeClient from "@/app/_components/homeClient";
import { faqPageSchema } from "@/data/faqs";
import { getSiteStats } from "@/data/siteStats";
import { JsonLd } from "@/components/seo/structured-data";
import { ORGANIZATION_ID, SITE_URL, webPageNode } from "@/lib/seo";

// The positioning line first, brand last, 39 chars.
const TITLE = "We Finish and Ship Stuck Apps | DevoraX";
// 156 chars — Google truncates around 155-160.
const DESCRIPTION =
  "Built with Lovable, Replit, Bolt or Cursor, on Sharetribe, or half-built? We finish and ship it: working payments, iOS and Android apps, App Store approval.";

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s | DevoraX" template — without it
  // this rendered as "DevoraX | … | DevoraX" with the brand duplicated.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
};

// ✅ Caching works here
export const revalidate = 3600;

// The homepage is about the company, so the page node points at the full
// Organization the root layout emits. No breadcrumb: Home is the root of every
// trail, not a step in one.
const webPage = webPageNode({
  path: "/",
  name: TITLE,
  description: DESCRIPTION,
  about: ORGANIZATION_ID,
  breadcrumb: false,
});

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
          The FAQPage is generated from the same FAQS array <FAQSection /> renders
          below, and is tied to this page so it does not float free in the graph. */}
      <JsonLd graph={[webPage, { ...faqPageSchema, isPartOf: { "@id": webPage["@id"] } }]} />
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
