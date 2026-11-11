import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { createPublicClient } from "@/lib/public";
import Home from "@/app/_components/home";
import { homeFaqPageSchema } from "@/data/homeFaqs";
import { getSiteStats } from "@/data/siteStats";
import { INDEXABLE_PROJECTS, isHiddenProject } from "@/data/projectIndex";
import { DOOR_LINKS, MARKETPLACE_LINK, MARKET_LINKS } from "@/data/siteNav";
import { JsonLd } from "@/components/seo/structured-data";
import { homeReels, toHomeProject } from "@/lib/homeProjects";
import { ORGANIZATION_ID, SITE_URL, webPageNode } from "@/lib/seo";

// The positioning line first, brand last, 39 chars.
const TITLE = "We Finish and Ship Stuck Apps | DevoraX";
// 154 chars — Google truncates around 155-160. It ends on "store submission",
// not an approval promise: we prepare and submit the app; the stores decide.
const DESCRIPTION =
  "Built with Lovable, Replit, Bolt or Cursor, on Sharetribe, or half-built? We finish and ship it: working payments, iOS and Android apps, store submission.";

/**
 * The homepage's display and label faces, loaded here rather than in the root
 * layout so that only this route preloads them: next/font preloads a face on
 * the routes of the file that declares it. Every other page still ships Inter
 * alone (see the note on fonts in src/app/layout.tsx). globals.css binds the
 * two variables to `font-display` and `font-mono`, with fallbacks for the
 * pages where they are not set.
 *
 * Space Grotesk and JetBrains Mono are the faces the walkthrough posters and
 * the portfolio PDF are already set in. Both are variable fonts: one file each.
 */
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
// Small labels only, none of them the first paint's largest element, and all
// of them regular weight: one static file rather than the variable font.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

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

/** Cards in the work grid: two columns, three rows. */
const FEATURED = 6;
/** Walkthroughs in the hero's showcase window. */
const REELS = 5;

export default async function HomePage() {
  const supabase = createPublicClient();

  // ✅ Fetching data on the server is faster and more secure. The services
  // table is no longer read here: the homepage's service cards are the door
  // pages and the marketplace hub (data/siteNav.ts), not its rows.
  const projectsRes = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = projectsRes.data || [];

  // The projects on the index allowlist first, in its order
  // (data/projectIndex.ts): the homepage's links should reach the pages kept
  // in the index rather than noindex ones. Then featured work, newest first
  // within each group (sort is stable): the three demo builds added on
  // 19 Oct 2026 are newer than every earlier project, and by date alone they
  // would take half the first screen.
  const rank = (id: number | string) => {
    const i = INDEXABLE_PROJECTS.indexOf(Number(id));
    return i === -1 ? INDEXABLE_PROJECTS.length : i;
  };
  const projects = rows
    .filter((p) => !isHiddenProject(p.id))
    .sort((a, b) => rank(a.id) - rank(b.id) || Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  return (
    <>
      {/* Server-rendered so crawlers (and AI crawlers, which don't run JS) see it.
          The FAQPage is generated from the same service questions <FAQSection />
          renders below (data/homeFaqs.ts), and is tied to this page so it does not
          float free in the graph. */}
      <JsonLd graph={[webPage, { ...homeFaqPageSchema, isPartOf: { "@id": webPage["@id"] } }]} />
      <div className={`${display.variable} ${mono.variable}`}>
        <Home
          // Only the cards the grid shows, and only the fields a card prints
          // (lib/homeProjects.ts): the rest of the table stays on the server.
          featured={projects.slice(0, FEATURED).map(toHomeProject)}
          // The walkthroughs the hero's window plays, in the grid's order:
          // the allowlisted builds that have one first, then the newest.
          reels={homeReels(projects, REELS)}
          // Joined to their pages here, on the server, so the client bundle
          // carries three labels and links rather than the pages' data.
          doors={DOOR_LINKS}
          marketplace={MARKETPLACE_LINK}
          // The market pages, linked under the work grid. These are the
          // homepage's only links to them.
          markets={MARKET_LINKS}
          // Fiverr-record figures plus a store-listing count computed from the
          // projects table, so the figure cannot drift out of date.
          stats={getSiteStats(rows)}
          now={new Date()}
        />
      </div>
    </>
  );
}
