import { Metadata } from "next";
import TeamClient from "./TeamClient";

const BASE_URL = "https://thedevorax.tech";

export const metadata: Metadata = {
  title: "Our Team — Engineers & AI Architects",
  description:
    "Meet the engineers, architects and DevOps specialists who design, build and ship every product — led by our founder and chief technical officer.",
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
    url: `${BASE_URL}/team`,
    siteName: "DevoraX",
    title: "Our Team | DevoraX",
    description:
      "Meet the people behind DevoraX — a multidisciplinary team of engineers, designers, and DevOps specialists building the world's next digital products.",
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "DevoraX Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team | DevoraX",
    description:
      "Meet the people behind DevoraX — engineers, designers, and DevOps specialists.",
    images: [{ url: `${BASE_URL}/og-image.jpg`, alt: "DevoraX Team" }],
  },
  alternates: {
    canonical: `${BASE_URL}/team`,
  },
};

// ── Structured data ──────────────────────────────────────────────────────────
// Person/ProfilePage markup is the strongest entity signal an agency can emit:
// it ties named humans to the Organization, which is what AI search engines
// resolve when they decide whether a brand is a citable authority.
//
// Only real, verifiable people are marked up here. The remaining cards in
// TeamClient are placeholder entries — marking those up would publish
// fabricated people as structured data and create a content/schema mismatch.

const ORGANIZATION_ID = `${BASE_URL}/#organization`;
// Must stay identical to PERSON_ID in app/layout.tsx. The founder was previously
// `/#sameem-amjad` here and a separate blank node in the root layout, so the two
// never resolved to one person.
const FOUNDER_ID = `${BASE_URL}/team#sameem-amjad`;
const CTO_ID = `${BASE_URL}/team#usman`;

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${BASE_URL}/team#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Team', item: `${BASE_URL}/team` },
  ],
};

/**
 * One ProfilePage that owns both people.
 *
 * Previously this page emitted a ProfilePage whose `mainEntity` was the founder,
 * and then a second, entirely detached Person node for the CTO — declared at the
 * top level with nothing pointing at it. A floating Person on a ProfilePage reads
 * as an unrelated entity that happens to share the URL. The CTO is now listed in
 * `about`, which is the property for additional entities a profile page covers.
 */
const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${BASE_URL}/team#webpage`,
  url: `${BASE_URL}/team`,
  name: 'The DevoraX Team',
  isPartOf: { '@id': `${BASE_URL}/#website` },
  breadcrumb: { '@id': `${BASE_URL}/team#breadcrumb` },
  mainEntity: { '@id': FOUNDER_ID },
  about: [{ '@id': FOUNDER_ID }, { '@id': CTO_ID }],
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: 'en-US',
};

const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': FOUNDER_ID,
  name: 'Sameem Amjad',
  jobTitle: 'Founder & CEO',
  description:
    'Software engineer specializing in scalable backend architectures and high-performance full-stack ecosystems, and founder of DevoraX.',
  image: `${BASE_URL}/images/profile_image.jpg`,
  url: `${BASE_URL}/team`,
  mainEntityOfPage: { '@id': `${BASE_URL}/team#webpage` },
  worksFor: { '@id': ORGANIZATION_ID },
  knowsAbout: [
    'Next.js',
    'React Native',
    'Node.js',
    'NestJS',
    'TypeScript',
    'AWS',
    'Docker',
    'Kubernetes',
    'PostgreSQL',
    'Supabase',
  ],
  // Distinct properties for the same person, which is what sameAs is for:
  // it lets Google reconcile the founder described here with the same
  // individual elsewhere. The personal site is listed first as the primary
  // identity URL. Note the earlier caution still applies — two URLs for the
  // *same* profile conflict and stop an entity resolving, so each entry here
  // must be a genuinely different property.
  sameAs: [
    'https://sameemamjad.com',
    'https://www.linkedin.com/in/sameem-amjad-dev/',
    'https://www.fiverr.com/sameemamjad',
  ],
};

const ctoSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': CTO_ID,
  name: 'Usman',
  jobTitle: 'Chief Technical Officer',
  description:
    'Full-Stack AI Architect leading architecture and DevOps at DevoraX across React Native, Flutter and high-concurrency web on Kubernetes and AWS.',
  image: `${BASE_URL}/images/usman_cto.jpeg`,
  url: `${BASE_URL}/team`,
  mainEntityOfPage: { '@id': `${BASE_URL}/team#webpage` },
  worksFor: { '@id': ORGANIZATION_ID },
  knowsAbout: [
    'Generative AI',
    'React Native',
    'Flutter',
    'Kubernetes',
    'AWS',
    'SaaS Architecture',
  ],
};

export default function TeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ctoSchema) }}
      />
      <TeamClient />
    </>
  );
}
