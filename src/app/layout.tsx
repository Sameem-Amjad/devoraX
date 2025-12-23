import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import { Inter, Orbitron } from 'next/font/google'; // Optimizing fonts is crucial for Core Web Vitals

// 1. Font Optimization (CLS reduction)
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

// 2. Base Metadata Configuration
const siteConfig = {
  name: 'Devora',
  description: 'Devora is an AI-powered development agency specializing in React Native, Next.js, and Cloud Architecture. We build scalable digital products for innovators.',
  url: 'https://thedevorax.tech', // Replace with your actual domain
  ogImage: 'https://thedevorax.tech/og-image.jpg',
  twitterHandle: '@devorax_agency',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Devora | AI-Powered Mobile & Web Development Agency',
    template: '%s | Devora', // e.g., "Services | Devora"
  },
  description: siteConfig.description,
  keywords: [
    'React Native Development',
    'Next.js Agency',
    'AI Integration',
    'Cloud Architecture',
    'Mobile App Development',
    'DevOps Services'
  ],
  authors: [{ name: 'Sameem Amjad', url: '[https://linkedin.com/in/sameem-amjad-336bb428b](https://linkedin.com/in/sameem-amjad-336bb428b)' }],
  creator: 'Devora Agency',

  // 3. Crawler Directives (The "Extreme" Part)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 4. Social Media Optimization
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Devora Agency - Future of Tech - We Make It Happen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },

  // 5. Canonical URLs (Prevents duplicate content penalties)
  alternates: {
    canonical: './',
  },

  // 6. Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} scroll-smooth`}>
      <head>
        {/* 7. JSON-LD for Organization (Rich Snippet) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': '[https://schema.org](https://schema.org)',
              '@type': 'Organization',
              name: 'Devora',
              url: '[https://thedevorax.tech](https://thedevorax.tech)',
              logo: '[https://thedevorax.tech/logo.png](https://thedevorax.tech/logo.png)',
              sameAs: [
                '[https://twitter.com/devorax_agency](https://twitter.com/devorax_agency)',
                '[https://linkedin.com/company/devora](https://linkedin.com/company/devora)',
                '[https://github.com/devora](https://github.com/devora)'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+92-300-6285190', // Replace
                contactType: 'sales',
                areaServed: 'Global',
                availableLanguage: 'English'
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
