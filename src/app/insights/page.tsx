import type { Metadata } from 'next';
import Link from 'next/link';
import { INSIGHTS } from '@/data/insights';

const BASE_URL = 'https://thedevorax.tech';

export const metadata: Metadata = {
  title: 'Engineering Insights & Research',
  description:
    'Data-backed research from 25 shipped production builds — stack choices, platform mix and measured outcomes, with the limits of the dataset stated openly.',
  keywords: [
    'software engineering research',
    'React Native vs Flutter production',
    'Supabase vs Firebase marketplace',
    'agency delivery data',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: `${BASE_URL}/insights` },
  openGraph: {
    type: 'website',
    url: `${BASE_URL}/insights`,
    siteName: 'DevoraX',
    title: 'Engineering Insights & Research | DevoraX',
    description:
      'Data-backed research from 25 shipped production builds, with the limits of the dataset stated openly.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'DevoraX Insights' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Insights', item: `${BASE_URL}/insights` },
  ],
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'DevoraX Engineering Research',
  numberOfItems: INSIGHTS.length,
  itemListElement: INSIGHTS.map((a, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: a.title,
    url: `${BASE_URL}/insights/${a.slug}`,
  })),
};

export default function InsightsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <main className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Engineering insights</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
            Research drawn from our own delivery record rather than industry
            commentary. Each piece states what its dataset can and cannot show.
          </p>

          {INSIGHTS.length === 0 ? (
            <p className="mt-16 text-gray-500">Research articles are being published shortly.</p>
          ) : (
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {INSIGHTS.map((a) => (
                <Link
                  key={a.slug}
                  href={`/insights/${a.slug}`}
                  className="group rounded-2xl border border-white/10 bg-[#0a0a0a] p-7 transition-all hover:border-teal-500/40"
                >
                  <h2 className="text-xl font-bold text-white transition-colors group-hover:text-teal-400">
                    {a.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{a.meta_description}</p>
                  <p className="mt-5 font-mono text-xs uppercase tracking-widest text-teal-500/70">
                    {a.word_count.toLocaleString('en-US')} words · data-backed
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
