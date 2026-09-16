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

          {/* The hub carried 248 words — a heading and a card grid. A listing
              page with no substance of its own has nothing to rank for and
              nothing for an answer engine to quote; it is a router, not a page.
              What follows describes the dataset and its limits, which is also the
              honest thing to publish alongside research this small. */}
          <section className="mt-24 max-w-3xl border-t border-white/5 pt-14">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Where does this research come from?
            </h2>
            <p className="mt-5 leading-relaxed text-gray-400">
              Every article here is derived from the same source: the record of
              work we have actually delivered. That is 25 production builds, their
              technology stacks, the platforms each one shipped to, and whatever
              outcome figures the clients reported back to us. Nothing is drawn
              from a survey we did not run, a benchmark we did not measure, or an
              industry report we did not read in full.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              That makes these articles unusual in one specific way, and it is
              worth being direct about it. Twenty-five projects is a small sample.
              It is large enough to show which technology choices recur and where
              they cluster, and far too small to support a general claim about the
              industry. Where an article reports a proportion, the denominator is
              stated next to it so you can judge the weight of the finding
              yourself.
            </p>

            <h2 className="mt-14 text-2xl font-bold text-white md:text-3xl">
              What can this data not tell you?
            </h2>
            <p className="mt-5 leading-relaxed text-gray-400">
              It cannot tell you what is true of software projects in general. It
              is one agency&apos;s book of work, shaped by the kinds of client who
              approached us and the kinds of problem we were asked to solve, so it
              carries that selection bias in every direction at once. It also
              cannot tell you much about failure, because the projects that reach a
              portfolio are the ones that shipped.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              Outcome figures come with a second caveat. Where a case study reports
              user counts, order volumes or uptime, those are numbers the client
              reported to us or took from their own systems. We did not
              independently instrument or audit them, and we present them as
              client-reported for that reason. Each article restates the limits of
              its own dataset rather than relying on this page to have done it.
            </p>

            <h2 className="mt-14 text-2xl font-bold text-white md:text-3xl">
              Where is the underlying work?
            </h2>
            <p className="mt-5 leading-relaxed text-gray-400">
              The projects these articles are built from are published in full.
              Each one has a long-form engineering case study covering the problem,
              the architecture, the technology choices and the reasoning behind
              them.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/case-study"
                className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
              >
                All case studies
              </Link>
              <Link
                href="/projects"
                className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
              >
                Full portfolio
              </Link>
              <Link
                href="/services"
                className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
              >
                Services
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
