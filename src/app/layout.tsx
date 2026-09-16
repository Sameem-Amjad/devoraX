import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RippleEffect } from '@/components/ui/rippleEffect';
import { CookieConsent } from '@/components/ui/cookieConsent';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

/**
 * One font, and it is actually applied.
 *
 * This was previously four families — Inter, Orbitron, Geist and Geist_Mono —
 * each declaring a CSS variable (`--font-inter`, `--font-orbitron`, …) that no
 * rule anywhere in the project ever read. There is no `tailwind.config`, and
 * `globals.css` is a bare `@import "tailwindcss"`, so nothing mapped those
 * variables to a `font-family`. The result was ~112 KB of woff2 preloaded and
 * render-blocking on every page for typefaces the browser never used.
 *
 * `--font-inter` is now bound to Tailwind's `font-sans` in globals.css, so the
 * one font that ships is the one the site renders in.
 */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const BASE_URL = 'https://thedevorax.tech';
const SITE_NAME = 'DevoraX';
const TAGLINE = 'AI-Powered Mobile & Web Development Agency';
const DESCRIPTION =
  'DevoraX is an AI-powered software development agency building high-performance mobile apps, Next.js web platforms, cloud infrastructure, and AI integrations. Trusted by founders and CTOs worldwide.';

const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

// ── Comprehensive keyword strategy covering high-intent, long-tail, and brand terms ──
const KEYWORDS = [
  // Core service keywords
  'AI-powered development agency',
  'React Native app development',
  'Next.js development agency',
  'mobile app development company',
  'custom software development',
  'full-stack web development',
  'cloud architecture services',
  'DevOps consulting',
  // Long-tail high-intent
  'hire React Native developers',
  'hire Next.js developers',
  'AI integration services for startups',
  'MVP development agency',
  'SaaS product development',
  'enterprise software development',
  'cross-platform mobile app development',
  'custom AI solutions for business',
  // Technology-specific
  'Flutter development company',
  'TypeScript development agency',
  'Node.js backend development',
  'Python AI development',
  'AWS cloud solutions',
  'Docker Kubernetes DevOps',
  'PostgreSQL Supabase development',
  'OpenAI LangChain integration',
  // Industry + solution
  'fintech mobile app development',
  'e-commerce platform development',
  'SaaS dashboard development',
  'real-time analytics platform',
  'headless CMS development',
  'GraphQL API development',
  // Brand + trust
  'DevoraX agency',
  'Devora tech agency',
  'Pakistan software development company',
  'remote software development team',
  'agile software development',
  'startup technology partner',
  'CTO as a service',
  'dedicated development team',
];

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: `${SITE_NAME} | ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: 'Sameem Amjad', url: 'https://www.linkedin.com/in/sameem-amjad-dev/' }],
  creator: 'DevoraX Agency',
  publisher: 'DevoraX',
  category: 'Technology',
  applicationName: SITE_NAME,

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Open Graph ──
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${TAGLINE}`,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'DevoraX — AI-Powered Mobile & Web Development Agency',
        type: 'image/jpeg',
      },
    ],
  },

  // ── Twitter / X ──
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | ${TAGLINE}`,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        alt: 'DevoraX Agency',
      },
    ],
  },

  // ── Canonical + Alternate ──
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
      'en-GB': BASE_URL,
    },
  },

  // ── Verification (add actual codes when available) ──
  verification: {
    google: 'oC4qTo34TX-z--ZSvnNKptARN2-JVXSL5PbCrsHsNNg',
  },

  // ── Icons (Next.js App Router auto-picks icon.tsx + apple-icon.tsx) ──
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.svg',
    apple: [{ url: '/apple-icon', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/favicon.svg', color: '#22d3ee' }],
  },

  // ── PWA / Manifest ──
  manifest: '/manifest.json',

  // ── Additional meta ──
  other: {
    'theme-color': '#020202',
    'color-scheme': 'dark',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': SITE_NAME,
    // Geo targeting
    'geo.region': 'PK',
    'geo.placename': 'Pakistan',
    // Dublin Core
    'DC.title': SITE_NAME,
    'DC.description': DESCRIPTION,
    'DC.creator': 'Sameem Amjad',
    'DC.subject': 'Software Development, AI, Mobile Apps, Web Development',
    'DC.language': 'en',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020202' },
    { media: '(prefers-color-scheme: light)', color: '#020202' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ── JSON-LD Schemas ──────────────────────────────────────────────────────────

/**
 * One connected entity graph, not a pile of disconnected nodes.
 *
 * Previously `Organization` (#organization) and `ProfessionalService` (#service)
 * were two separate top-level nodes describing the same company, with nothing
 * linking them — so a consumer had no way to know they were one entity and could
 * reasonably read them as two. The founder was a blank node with no `@id` and no
 * `sameAs`, attached via the superseded `founders` property, which is a dead end:
 * it asserts a person exists but gives nothing to reconcile them against.
 *
 * Now: `ProfessionalService` is a sub-type of `Organization`, so this is a single
 * node carrying both sets of properties, and the founder is a real `Person` node
 * with a stable `@id` that the /team ProfilePage can point at.
 */
// Must stay identical to the ids in app/team/page.tsx, which carries the full
// Person nodes. Referencing them by @id here keeps one description of each
// person instead of two partial ones.
const PERSON_ID = `${BASE_URL}/team#sameem-amjad`;
const CTO_ID = `${BASE_URL}/team#usman`;

export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;

const organizationSchema = {
  '@context': 'https://schema.org',
  // Both types on one node: DevoraX is an Organization *and* the professional
  // service being described. Two nodes for one entity was the bug.
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORGANIZATION_ID,
  name: 'DevoraX',
  legalName: 'DevoraX',
  // Kept as a schema-level variant rather than in the visible copy: people do
  // shorten it, and this is where that belongs.
  alternateName: 'Devora',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${BASE_URL}/#logo`,
    url: `${BASE_URL}/apple-icon`,
    width: 180,
    height: 180,
    caption: 'DevoraX',
  },
  image: { '@id': `${BASE_URL}/#logo` },
  description: DESCRIPTION,
  // Full ISO 8601 rather than a bare year.
  foundingDate: '2023-01-01',
  // Minimal stubs, not bare references: a consumer reading this page alone must
  // be able to resolve them. The full Person nodes live on /team under the same
  // @id, so the two merge into one entity rather than reading as duplicates.
  founder: {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Sameem Amjad',
    url: `${BASE_URL}/team`,
  },
  employee: [
    { '@type': 'Person', '@id': PERSON_ID, name: 'Sameem Amjad', url: `${BASE_URL}/team` },
    { '@type': 'Person', '@id': CTO_ID, name: 'Usman', url: `${BASE_URL}/team` },
  ],
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  knowsAbout: [
    'React Native',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'Kubernetes',
    'OpenAI',
    'LangChain',
    'PostgreSQL',
    'Supabase',
  ],
  priceRange: '$$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit Card, Bank Transfer, PayPal',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  sameAs: ['https://linkedin.com/company/devorax', 'https://github.com/devorax'],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'business@thedevorax.tech',
      areaServed: 'Global',
      availableLanguage: 'English',
      url: `${BASE_URL}/contact`,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@thedevorax.tech',
      areaServed: 'Global',
      availableLanguage: 'English',
      url: `${BASE_URL}/contact`,
    },
  ],
  // The catalogue now matches the four services the site actually publishes, and
  // each entry resolves to that service's own page node. It previously listed six
  // — including "E-Commerce Solutions" and "Data & Analytics", which do not exist
  // — and none of the six linked anywhere.
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Software Development Services',
    itemListElement: [
      { '@type': 'Service', '@id': `${BASE_URL}/services/1#service`, name: 'Mobile App Development' },
      { '@type': 'Service', '@id': `${BASE_URL}/services/2#service`, name: 'AI & Full-Stack Web Development' },
      { '@type': 'Service', '@id': `${BASE_URL}/services/3#service`, name: 'Cloud Architecture & DevOps' },
      { '@type': 'Service', '@id': `${BASE_URL}/services/4#service`, name: 'UI/UX Design Systems' },
    ],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: BASE_URL,
  name: SITE_NAME,
  description: DESCRIPTION,
  publisher: { '@id': ORGANIZATION_ID },
  // NOTE: no `potentialAction`/SearchAction — the site has no /search route, so
  // declaring one describes an endpoint that does not exist. (Google also
  // retired the sitelinks search box, so it earns nothing even when valid.)
  inLanguage: 'en-US',
};

// NOTE: FAQPage schema lives on the homepage (app/page.tsx), generated from the
// same FAQS array the visible <FAQSection /> renders. It must not be emitted
// site-wide: structured data may only describe content visible on that page.
//
// NOTE: BreadcrumbList is emitted per-route (see /services, /projects, /contact,
// and the detail pages). A single flat list of every top-level page is a nav
// menu, not a breadcrumb trail, and repeating it on every URL is incorrect.

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased bg-[#020202] text-white">
        <RippleEffect />
        {/* Header and footer live here so every route has them. They used to be
            rendered inside the homepage client component, which left most of the
            site with no navigation and no outbound links at all. */}
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieConsent />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js');})}`,
          }}
        />
      </body>
    </html>
  );
}
