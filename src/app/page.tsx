import type { Metadata } from "next";
import { createPublicClient } from "@/lib/public";
import HomeClient from "@/app/_components/homeClient";
import { faqPageSchema } from "@/data/faqs";
import { getSiteStats } from "@/data/siteStats";
import { INDEXABLE_PROJECTS, isHiddenProject } from "@/data/projectIndex";
import { DOOR_LINKS, MARKETPLACE_LINK, MARKET_LINKS } from "@/data/siteNav";
import { JsonLd } from "@/components/seo/structured-data";
import { ORGANIZATION_ID, SITE_URL, webPageNode } from "@/lib/seo";

// The positioning line first, brand last, 39 chars.
const TITLE = "We Finish and Ship Stuck Apps | DevoraX";
// 154 chars — Google truncates around 155-160. It ends on "store submission",
// not an approval promise: we prepare and submit the app; the stores decide.
const DESCRIPTION =
  "Built with Lovable, Replit, Bolt or Cursor, on Sharetribe, or half-built? We finish and ship it: working payments, iOS and Android apps, store submission.";

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

  // ✅ Fetching data on the server is faster and more secure. The services
  // table is no longer read here: the homepage's service cards are the door
  // pages and the marketplace hub (data/siteNav.ts), not its rows.
  const projectsRes = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // The projects on the index allowlist first, in its order
  // (data/projectIndex.ts): the grid server-renders six cards, and the
  // homepage's links should reach the pages kept in the index rather than
  // noindex ones. Then featured work, newest first within each group (sort is
  // stable): the three demo builds added on 19 Oct 2026 are newer than every
  // earlier project, and by date alone they would take half the first screen.
  const rank = (id: number | string) => {
    const i = INDEXABLE_PROJECTS.indexOf(Number(id));
    return i === -1 ? INDEXABLE_PROJECTS.length : i;
  };
  const projects = (projectsRes.data || []).filter((p) => !isHiddenProject(p.id)).sort(
    (a, b) =>
      rank(a.id) - rank(b.id) || Number(Boolean(b.featured)) - Number(Boolean(a.featured))
  );

  // Pass the data to the Client Component
  return (
    <>
      {/* Server-rendered so crawlers (and AI crawlers, which don't run JS) see it.
          The FAQPage is generated from the same FAQS array <FAQSection /> renders
          below, and is tied to this page so it does not float free in the graph. */}
      <JsonLd graph={[webPage, { ...faqPageSchema, isPartOf: { "@id": webPage["@id"] } }]} />
      <HomeClient
        initialProjects={projects}
        // Joined to their pages here, on the server, so the client bundle
        // carries three labels and links rather than the pages' data.
        doors={DOOR_LINKS}
        marketplace={MARKETPLACE_LINK}
        // The market pages, linked under the industries grid. The grid's
        // cards link to /projects by industry, so these are the homepage's
        // only links to the market pages.
        markets={MARKET_LINKS}
        // Fiverr-record figures plus a store-listing count computed from the
        // projects table, so the counter cannot drift out of date.
        stats={getSiteStats(projectsRes.data || [])}
      />
    </>
  );
}
