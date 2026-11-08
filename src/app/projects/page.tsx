import { Metadata } from 'next';
import { createPublicClient } from '@/lib/public';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { JsonLd } from '@/components/seo/structured-data';
import { absoluteUrl, breadcrumbNode, webPageNode } from '@/lib/seo';
import { projectIndustry } from '@/data/industries';
import { ProjectsGrid } from './_components/projectsGrid';

const BASE_URL = 'https://thedevorax.tech';
export const revalidate = 3600;

// Also the name and description of the CollectionPage node below. Title 48
// characters, 58 with " | DevoraX": what the portfolio holds, in the words
// of its own description.
const TITLE = 'Portfolio: Marketplaces, Real-Time and AI Builds';
const DESCRIPTION =
  'Marketplaces, real-time apps, media backends and AI builds that DevoraX\'s founders built or worked on, including as employees of other companies.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'DevoraX portfolio',
    'software development projects',
    'mobile app portfolio',
    'React Native portfolio',
    'Next.js project examples',
    'AI app development examples',
    'fintech app development',
    'SaaS product portfolio',
    'software agency work',
    'custom software examples',
  ],
  alternates: { canonical: `${BASE_URL}/projects` },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${BASE_URL}/projects`,
    siteName: 'DevoraX',
    title: `${TITLE} | DevoraX`,
    description: 'Products DevoraX\'s founders built or worked on, including as employees elsewhere. Each page says who the work was for, where that is recorded.',
    // The page title, not "DevoraX Projects": the portfolio is not all DevoraX work.
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | DevoraX`,
    description: 'Products DevoraX\'s founders built or worked on, including as employees elsewhere.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, alt: TITLE }],
  },
};

const PATH = '/projects';
const PAGE_URL = absoluteUrl(PATH);

const itemListNode = (projects: { id: string | number; title: string }[]) => ({
  '@type': 'ItemList',
  '@id': `${PAGE_URL}#projects`,
  name: 'DevoraX Project Portfolio',
  description: 'Software products built or engineered by DevoraX\'s founders, including work done as employees elsewhere',
  numberOfItems: projects.length,
  itemListElement: projects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.title,
    url: `${BASE_URL}/projects/${p.id}`,
  })),
});

export default async function ProjectsPage() {
  const supabase = createPublicClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  const list = projects || [];

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: 'CollectionPage',
            mainEntity: `${PAGE_URL}#projects`,
          }),
          breadcrumbNode(PATH, [{ name: 'Projects', path: PATH }]),
          itemListNode(list),
        ]}
      />

      <main id="main-content" className="min-h-screen bg-[#020202] text-white">
        {/* ── Page Header ── */}
        <header className="relative pt-36 pb-20 bg-[#020202] border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.07)_0%,_transparent_60%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-10 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-gray-400">
                <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-teal-400" aria-current="page">Projects</li>
              </ol>
            </nav>

            <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
              Portfolio
            </span>

            {/* The H1 says what the title says. It was "Products We've Shipped",
                which claimed for DevoraX the products Sameem worked on as an
                employee of other companies, as the paragraph below explains. */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
              Portfolio: marketplaces, real-time and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                AI builds
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              Products our founders built or worked on: marketplaces, real-time apps, media backends
              and AI builds. Many were built while Sameem was an engineer at other companies, some have
              no public link, and a few links are demo builds. Each project page says which, where that
              is recorded, and links only to what you can check. Pick your industry to see the work closest to yours.
            </p>
          </div>
        </header>

        {/* ── Projects Grid ── */}
        <section aria-label="Project portfolio" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            {list.length === 0 ? (
              <p className="text-center text-gray-500 py-20">Projects are loading. Check back shortly.</p>
            ) : (
              <ProjectsGrid
                projects={list.map((p) => ({
                  id: p.id,
                  title: p.title,
                  image: p.image ?? null,
                  featured: Boolean(p.featured),
                  video: p.video ?? null,
                  category: p.category ?? null,
                  description: p.description ?? null,
                  industry: projectIndustry(p)?.slug ?? null,
                }))}
              />
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section aria-labelledby="start-project-heading" className="py-20 border-t border-white/5 bg-[#030303]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 id="start-project-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build yours?
            </h2>
            {/* Says whose work this was. The old line claimed every product in
                the portfolio for DevoraX, including work Sameem did as an
                employee or for clients who hired him, and promised delivery on
                time and on budget. */}
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Some of this work Sameem did for clients, some as an employee of other companies, and
              some are demos and builds made for no client. Each page says which, where that is
              recorded. Tell us what you&apos;re building on a free 30-minute call, and we&apos;ll
              tell you whether an audit makes sense and what it costs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {/* /book counts the booking as made from this page, the page
                  before it, so the link needs no ?from=. */}
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
              >
                Book a free 30-minute call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 hover:border-teal-500/40 font-bold rounded-xl transition-all"
              >
                View our services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
