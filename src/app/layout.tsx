import type { Metadata, Viewport } from 'next';
import { Inter, Orbitron, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RippleEffect } from '@/components/ui/rippleEffect';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' });
export const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
export const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const BASE_URL = 'https://thedevorax.tech';
const SITE_NAME = 'DevoraX';
const TAGLINE = 'AI-Powered Mobile & Web Development Agency';
const DESCRIPTION =
  'DevoraX is an AI-powered software development agency building high-performance mobile apps, Next.js web platforms, cloud infrastructure, and AI integrations. Trusted by founders and CTOs worldwide.';

const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const TWITTER_HANDLE = '@devorax_agency';

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
  authors: [{ name: 'Sameem Amjad', url: 'https://linkedin.com/in/sameem-amjad-336bb428b' }],
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
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
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
    google: 'google-site-verification-token',
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'DevoraX',
  alternateName: 'Devora',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.png`,
    width: 200,
    height: 60,
  },
  description: DESCRIPTION,
  foundingDate: '2023',
  founders: [{ '@type': 'Person', name: 'Sameem Amjad' }],
  areaServed: 'Worldwide',
  serviceType: [
    'Mobile App Development',
    'Web Development',
    'AI Integration',
    'Cloud Architecture',
    'DevOps Services',
  ],
  sameAs: [
    'https://twitter.com/devorax_agency',
    'https://linkedin.com/company/devorax',
    'https://github.com/devorax',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      areaServed: 'Global',
      availableLanguage: 'English',
      url: `${BASE_URL}/#contact`,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      areaServed: 'Global',
      availableLanguage: 'English',
      url: `${BASE_URL}/#contact`,
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Software Development Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI & Full-Stack Web Development' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud & DevOps' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design Systems' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-Commerce Solutions' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data & Analytics' } },
    ],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: SITE_NAME,
  description: DESCRIPTION,
  publisher: { '@id': `${BASE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-US',
};

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#service`,
  name: 'DevoraX',
  url: BASE_URL,
  description: DESCRIPTION,
  priceRange: '$$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit Card, Bank Transfer, PayPal',
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  hasMap: BASE_URL,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
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
  award: 'AI-Powered Development Excellence',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What services does DevoraX offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DevoraX offers mobile app development (React Native, Flutter), AI-powered web development (Next.js, Python), cloud & DevOps (AWS, Docker, Kubernetes), UI/UX design, e-commerce solutions, and data analytics services.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build a mobile app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depending on complexity, an MVP typically takes 6-10 weeks. Full-featured cross-platform mobile apps generally require 3-6 months with weekly sprint demos throughout development.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the starting cost for a project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MVP projects start at $2,900. Growth & scale solutions start at $7,500. Enterprise transformation projects are custom-quoted. All plans include a free 30-minute discovery call and fixed-price proposal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does DevoraX work with startups?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, DevoraX specializes in working with startups and scaleups. We offer rapid MVP development to validate ideas quickly, then scale architecture to enterprise-grade as the business grows.',
      },
    },
    {
      '@type': 'Question',
      name: 'What AI technologies does DevoraX integrate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DevoraX integrates OpenAI GPT-4, Claude API, LangChain, Hugging Face models, vector databases (Pinecone, Weaviate), and custom ML pipelines into production-ready applications.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can DevoraX maintain and scale our existing application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DevoraX provides post-launch monitoring, feature iteration, performance optimization, and infrastructure scaling as a long-term engineering partner under flexible SLA agreements.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/#services` },
    { '@type': 'ListItem', position: 3, name: 'Work', item: `${BASE_URL}/#work` },
    { '@type': 'ListItem', position: 4, name: 'Pricing', item: `${BASE_URL}/#pricing` },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} ${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        <RippleEffect />
        {children}
      </body>
    </html>
  );
}
