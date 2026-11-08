import type { Metadata } from 'next';
import Link from 'next/link';
import { INSIGHTS, isChecklist } from '@/data/insights';
import { JsonLd } from '@/components/seo/structured-data';
import { SITE_URL, absoluteUrl, breadcrumbNode, webPageNode } from '@/lib/seo';

// Two kinds of entry since 7 Nov 2026: research drawn from the portfolio, and
// a checklist drawn from platform documentation. The copy covers both, and
// says the portfolio includes employer work, as the intro below does.
const DESCRIPTION =
  'Research from the 26 entries in the DevoraX portfolio, including employer work, with its limits stated, and a security checklist for AI-built apps.';
const SOCIAL_DESCRIPTION =
  'Research from the DevoraX portfolio, including employer work, with its limits stated, and a launch checklist built from platform documentation.';

export const metadata: Metadata = {
  title: 'Engineering Insights & Research',
  description: DESCRIPTION,
  keywords: [
    'software engineering research',
    'React Native vs Flutter production',
    'Supabase vs Firebase marketplace',
    'portfolio stack data',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: `${SITE_URL}/insights` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/insights`,
    siteName: 'DevoraX',
    title: 'Engineering Insights & Research | DevoraX',
    description: SOCIAL_DESCRIPTION,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'DevoraX Insights' }],
  },
  // Without its own block the page inherited the homepage's Twitter card.
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Insights & Research | DevoraX',
    description: SOCIAL_DESCRIPTION,
    images: [{ url: `${SITE_URL}/og-image.jpg`, alt: 'DevoraX Insights' }],
  },
};

const PATH = '/insights';
const ITEM_LIST_ID = `${absoluteUrl(PATH)}#itemlist`;

// A collection page whose main entity is the list of articles on it, so the
// list is tied to this URL rather than floating beside it.
const graph = [
  webPageNode({
    path: PATH,
    type: 'CollectionPage',
    name: 'Engineering Insights & Research',
    description: DESCRIPTION,
    mainEntity: ITEM_LIST_ID,
  }),
  breadcrumbNode(PATH, [{ name: 'Insights', path: PATH }]),
  {
    '@type': 'ItemList',
    '@id': ITEM_LIST_ID,
    name: 'DevoraX Engineering Research',
    numberOfItems: INSIGHTS.length,
    itemListElement: INSIGHTS.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: a.title,
      url: absoluteUrl(`/insights/${a.slug}`),
    })),
  },
];

export default function InsightsPage() {
  return (
    <>
      <JsonLd graph={graph} />

      <main id="main-content" className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Engineering insights</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
            Research drawn from the projects in this site&apos;s portfolio, including
            work done as employees of other companies, rather than industry
            commentary. Each piece states what its dataset can and cannot show.
            There is also a security and launch checklist for AI-built apps, built
            from the platforms&apos; own documentation as read on the date it shows.
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
                  {/* A checklist is not drawn from the portfolio data, so it is
                      not labelled data-backed; its size is its number of checks. */}
                  <p className="mt-5 font-mono text-xs uppercase tracking-widest text-teal-500/70">
                    {isChecklist(a)
                      ? `${a.items.length} checks · checklist`
                      : `${a.word_count.toLocaleString('en-US')} words · data-backed`}
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
              Every research article here is derived from the same source: the 26 entries
              in this site&apos;s portfolio, their technology stacks, the
              platforms each one runs on, and the public links behind them. Those
              entries are not all DevoraX client work. Many are products Sameem
              worked on as an engineer at other companies, some have no public link,
              and a few links are demo builds; each project page says which, where
              that is recorded. Nothing
              is drawn from a survey we did not run, a benchmark we did not measure,
              or an industry report we did not read in full.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              That makes these articles unusual in one specific way, and it is
              worth being direct about it. Twenty-six entries is a small sample.
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
              is one small portfolio, shaped by the employers Sameem worked for, the
              clients who approached us and the kinds of problem we were asked to
              solve, so it carries that selection bias in every direction at once.
              It also cannot tell you much about failure, because the projects that
              reach a portfolio are the ones that shipped.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              It cannot tell you how these products perform in use. The portfolio
              publishes no usage, revenue or uptime figures, because none could be
              checked against a public source. The only figures it carries are ones
              a reader can verify, such as a download band on a store listing. Each
              article restates the limits of its own dataset rather than relying on
              this page to have done it.
            </p>

            <h2 className="mt-14 text-2xl font-bold text-white md:text-3xl">
              Where is the underlying work?
            </h2>
            {/* "Case study" is kept for work a client contracted DevoraX for
                (data/projectIndex.ts), and /case-study now redirects to
                /projects. Hear With You has a project page but no long-form
                write-up yet, hence "most". "Write-up" covers both labels:
                Koor's page is a case study, the rest engineering write-ups. */}
            <p className="mt-5 leading-relaxed text-gray-400">
              The projects these articles are built from are published in full.
              Each one has a project page that says who the work was for, where that
              is recorded, and most have a long-form write-up covering the problem,
              the architecture, the technology choices and the reasoning behind
              them.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/projects"
                className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
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
