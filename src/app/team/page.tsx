import { Metadata } from "next";
import TeamClient from "./TeamClient";
import { JsonLd } from "@/components/seo/structured-data";
import { FOUNDER_PROFILES } from "@/data/brand";
import {
  CTO_ID,
  FOUNDER_ID,
  FOUNDER_REF,
  ORG_REF,
  SITE_URL,
  absoluteUrl,
  breadcrumbNode,
  webPageNode,
} from "@/lib/seo";

const DESCRIPTION =
  "DevoraX is two people: Sameem Amjad, founder, and Usman, CTO. Two senior engineers who build every project and bring in specialists when a scope needs them.";

export const metadata: Metadata = {
  title: "Our Team — Sameem Amjad and Usman",
  description: DESCRIPTION,
  keywords: [
    "DevoraX team",
    "software development team",
    "React Native engineers",
    "Next.js developers",
    "AI engineers",
    "Pakistan tech team",
    "remote development team",
    "full-stack engineers",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/team`,
    siteName: "DevoraX",
    title: "Our Team | DevoraX",
    description:
      "DevoraX is a two-person studio: Sameem Amjad, founder, and Usman, CTO. The people you talk to are the people writing the code.",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "DevoraX Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team | DevoraX",
    description:
      "DevoraX is a two-person studio: Sameem Amjad, founder, and Usman, CTO.",
    images: [{ url: `${SITE_URL}/og-image.jpg`, alt: "DevoraX Team" }],
  },
  alternates: {
    canonical: `${SITE_URL}/team`,
  },
};

// ── Structured data ──────────────────────────────────────────────────────────
// Person/ProfilePage markup is the strongest entity signal an agency can emit:
// it ties named humans to the Organization, which is what AI search engines
// resolve when they decide whether a brand is a citable authority.
//
// Only real, verifiable people are marked up here: the two TeamClient shows.
// The root layout's Organization carries a stub for each under the same @id
// (lib/seo), so the stubs and these full nodes resolve to one person each.

const PATH = "/team";
const PAGE_URL = absoluteUrl(PATH);
const PAGE_REF = { "@id": `${PAGE_URL}#webpage` };

/**
 * One ProfilePage that owns both people.
 *
 * Previously this page emitted a ProfilePage whose `mainEntity` was the founder,
 * and then a second, entirely detached Person node for the CTO — declared at the
 * top level with nothing pointing at it. A floating Person on a ProfilePage reads
 * as an unrelated entity that happens to share the URL. The CTO is now listed in
 * `about`, which is the property for additional entities a profile page covers.
 */
const profilePage = {
  ...webPageNode({
    path: PATH,
    type: "ProfilePage",
    name: "The DevoraX Team",
    description: DESCRIPTION,
    mainEntity: FOUNDER_ID,
  }),
  about: [FOUNDER_REF, { "@id": CTO_ID }],
};

const founder = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "Sameem Amjad",
  jobTitle: "Founder & Lead Architect Engineer",
  description:
    "Software engineer specializing in scalable backend architectures and high-performance full-stack ecosystems, and founder of DevoraX.",
  image: `${SITE_URL}/images/profile_image.jpg`,
  url: PAGE_URL,
  mainEntityOfPage: PAGE_REF,
  worksFor: ORG_REF,
  // The degree is listed on this page, in the founder's profile card.
  alumniOf: { "@type": "CollegeOrUniversity", name: "COMSATS University" },
  knowsAbout: [
    "Next.js",
    "React Native",
    "Node.js",
    "NestJS",
    "TypeScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "Supabase",
  ],
  // Sameem's own profiles (data/brand.ts), personal site first as the primary
  // identity URL. sameAs lets Google reconcile this person with the same
  // individual elsewhere, so each entry must be a genuinely different property:
  // two URLs for the same profile conflict and stop the entity resolving.
  sameAs: FOUNDER_PROFILES.map((p) => p.url),
};

const cto = {
  "@type": "Person",
  "@id": CTO_ID,
  name: "Usman",
  jobTitle: "Chief Technical Officer",
  description:
    "Full-Stack AI Architect leading architecture and DevOps at DevoraX across React Native, Flutter and high-concurrency web on Kubernetes and AWS.",
  image: `${SITE_URL}/images/usman_cto.jpeg`,
  url: PAGE_URL,
  mainEntityOfPage: PAGE_REF,
  worksFor: ORG_REF,
  knowsAbout: [
    "Generative AI",
    "React Native",
    "Flutter",
    "Kubernetes",
    "AWS",
    "SaaS Architecture",
  ],
  // No sameAs: the site publishes no profile of Usman's to point at.
};

export default function TeamPage() {
  return (
    <>
      <JsonLd
        graph={[profilePage, breadcrumbNode(PATH, [{ name: "Team", path: PATH }]), founder, cto]}
      />
      <TeamClient />
    </>
  );
}
