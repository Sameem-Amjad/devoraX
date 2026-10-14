import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RippleEffect } from '@/components/ui/rippleEffect';
import { CookieConsent } from '@/components/ui/cookieConsent';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MotionProvider } from '@/components/ui/motionProvider';
import { JsonLd } from '@/components/seo/structured-data';
import { BRAND_FACTS, ENTITY_STATEMENT, ORG_PROFILES, SITE_URL } from '@/data/brand';
import { POSITIONING } from '@/data/offer';
import { CTO_ID, FOUNDER_ID, LOGO_ID, ORGANIZATION_ID, WEBSITE_ID } from '@/lib/seo';

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

const BASE_URL = SITE_URL;
const SITE_NAME = BRAND_FACTS.name;
const TAGLINE = 'We Finish and Ship Stuck Apps';
// The entity statement, verbatim (see data/brand.ts). It is the fallback meta
// description and the description in the Organization and WebSite nodes.
const DESCRIPTION = ENTITY_STATEMENT;

const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

// ── Comprehensive keyword strategy covering high-intent, long-tail, and brand terms ──
const KEYWORDS = [
  // Positioning: finishing and shipping apps that got stuck
  'finish my app',
  'Lovable app developer',
  'Replit app developer',
  'Bolt app developer',
  'Cursor app developer',
  'Sharetribe developer',
  'Sharetribe mobile app',
  'App Store submission help',
  'Stripe Connect marketplace payments',
  'launch readiness audit',
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

  // ── Canonical: deliberately not set here ──
  // A canonical in the root layout is inherited by every page that does not
  // declare its own, so one forgotten page would have told Google it was a
  // duplicate of the homepage. Each page declares its own canonical instead;
  // scripts/seo-check.mjs fails the check for any page without one.
  //
  // No hreflang either. It used to declare en-US and en-GB "versions" that were
  // both the homepage URL. The site is one English site with one offer, which
  // is the case hreflang is not for.

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
 * `Organization` (#organization) and `ProfessionalService` (#service) were once
 * two unlinked top-level nodes for one company, then one node typed as both.
 * It is now a plain Organization. ProfessionalService is a LocalBusiness type,
 * meant for a staffed office that clients visit, and it carried LocalBusiness
 * properties (opening hours, price range, payment methods) that described a
 * shopfront DevoraX does not have. DevoraX is two people working remotely from
 * Pakistan, so the node now says that: a country address, two employees, and
 * the discovery-call hours on the sales contact point, where they belong.
 *
 * Emitted on every page, not only the homepage: every page's graph points at
 * ORGANIZATION_ID, and a crawler or AI system reading one page on its own should
 * be able to resolve who published it without fetching a second URL.
 */
const organizationNode = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: BRAND_FACTS.name,
  legalName: BRAND_FACTS.name,
  // Kept as a schema-level variant rather than in the visible copy: people do
  // shorten it, and this is where that belongs.
  alternateName: BRAND_FACTS.alternateName,
  url: BASE_URL,
  slogan: POSITIONING.headline,
  logo: {
    '@type': 'ImageObject',
    '@id': LOGO_ID,
    url: `${BASE_URL}/logo.png`,
    contentUrl: `${BASE_URL}/logo.png`,
    width: 512,
    height: 512,
    caption: BRAND_FACTS.name,
  },
  image: { '@id': LOGO_ID },
  description: DESCRIPTION,
  // Full ISO 8601 rather than a bare year. 2022 confirmed by the founder on
  // 9 Oct 2026 (the site said 2019 before that). It matches "4+ years" and
  // Fiverr since January 2022.
  foundingDate: '2022-01-01',
  address: { '@type': 'PostalAddress', addressCountry: 'PK' },
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 2 },
  // Minimal stubs, not bare references: a consumer reading this page alone must
  // be able to resolve them. The full Person nodes live on /team under the same
  // @id, so the two merge into one entity rather than reading as duplicates.
  founder: {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: 'Sameem Amjad',
    url: `${BASE_URL}/team`,
  },
  employee: [
    { '@type': 'Person', '@id': FOUNDER_ID, name: 'Sameem Amjad', url: `${BASE_URL}/team` },
    { '@type': 'Person', '@id': CTO_ID, name: 'Usman', url: `${BASE_URL}/team` },
  ],
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  knowsAbout: [
    'Stripe',
    'Stripe Connect',
    'Sharetribe',
    'App Store submission',
    'Google Play submission',
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
  // Profiles the studio controls (data/brand.ts); the footer links to each.
  // Omitted while there are none: an empty sameAs says nothing.
  ...(ORG_PROFILES.length ? { sameAs: ORG_PROFILES.map((p) => p.url) } : {}),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: BRAND_FACTS.salesEmail,
      areaServed: 'Worldwide',
      availableLanguage: 'English',
      url: `${BASE_URL}/contact`,
      // The discovery-call hours the booking system offers, in PKT (UTC+5).
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00:00+05:00',
        closes: '18:00:00+05:00',
      },
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: BRAND_FACTS.supportEmail,
      areaServed: 'Worldwide',
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

const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: BASE_URL,
  // Google reads `name` and `alternateName` here when it picks the site name it
  // shows in results.
  name: SITE_NAME,
  alternateName: BRAND_FACTS.alternateName,
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
        <JsonLd graph={[websiteNode, organizationNode]} />
        {/* No preconnect to fonts.googleapis.com: next/font serves Inter from
            this origin, so that connection was opened on every page and never
            used. */}
      </head>
      <body className="antialiased bg-[#020202] text-white">
        {/* First focusable element on every page, so a keyboard user can jump
            past the header. Every page's <main> carries id="main-content". */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-teal-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to main content
        </a>
        <RippleEffect />
        <MotionProvider>
          {/* Header and footer live here so every route has them. They used to be
              rendered inside the homepage client component, which left most of the
              site with no navigation and no outbound links at all. */}
          <SiteHeader />
          {children}
          <SiteFooter />
        </MotionProvider>
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
