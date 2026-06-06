import { Metadata } from 'next';
import { createClient } from '@/lib/server';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const BASE_URL = 'https://thedevorax.tech';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Browse DevoraX\'s portfolio of shipped products — fintech apps, AI e-commerce platforms, SaaS dashboards, React Native mobile apps, and Next.js web applications built for clients worldwide.',
  keywords: [
    'DevoraX portfolio',
    'software development projects',
    'mobile app case studies',
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
    title: 'Projects | DevoraX',
    description: 'Our portfolio of shipped digital products — mobile apps, AI platforms, SaaS tools, and more.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'DevoraX Projects' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@devorax_agency',
    creator: '@devorax_agency',
    title: 'Projects | DevoraX',
    description: 'Our portfolio of shipped digital products.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, alt: 'DevoraX Projects' }],
  },
};

const itemListSchema = (projects: { id: string | number; title: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'DevoraX Project Portfolio',
  description: 'Software products and digital applications built by DevoraX',
  numberOfItems: projects.length,
  itemListElement: projects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.title,
    url: `${BASE_URL}/projects/${p.id}`,
  })),
});

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: `${BASE_URL}/projects` },
  ],
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  const list = projects || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema(list)) }}
      />

      <main className="min-h-screen bg-[#020202] text-white">
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
              <ol className="flex items-center gap-2 text-xs text-gray-600">
                <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-teal-400">Projects</li>
              </ol>
            </nav>

            <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
              Our Work
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
              Products We&apos;ve{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Shipped
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              A selection of digital products we&apos;ve designed, engineered, and launched — from fintech mobile
              apps and AI e-commerce ecosystems to SaaS dashboards and cloud-native platforms. Each project
              is a fixed-scope, fixed-price engagement with full IP transfer on delivery.
            </p>
          </div>
        </header>

        {/* ── Projects Grid ── */}
        <section aria-label="Project portfolio" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            {list.length === 0 ? (
              <p className="text-center text-gray-500 py-20">Projects are loading — check back shortly.</p>
            ) : (
              <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
                {list.map((project: any) => {
                  const hasImage =
                    project.image &&
                    project.image !== 'null' &&
                    String(project.image).startsWith('http');

                  return (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.id}`}
                        className="group block h-full rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-teal-500/30 transition-all duration-300 overflow-hidden"
                      >
                        {/* Thumbnail */}
                        <div className="h-52 relative overflow-hidden bg-[#111]">
                          {hasImage ? (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-black flex items-center justify-center">
                              <span className="text-4xl font-bold text-teal-500/20 font-mono">
                                {project.title?.charAt(0)}
                              </span>
                            </div>
                          )}
                          {project.featured && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-[0.6rem] font-bold uppercase tracking-wide">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {project.category && (
                            <div className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-2">
                              {project.category}
                            </div>
                          )}
                          <h2 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors line-clamp-2">
                            {project.title}
                          </h2>
                          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                            {project.description}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 group-hover:gap-2.5 transition-all">
                            View case study
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section aria-label="Start a project" className="py-20 border-t border-white/5 bg-[#030303]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build yours?
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Every product in our portfolio started with a 30-minute call. Tell us what you&apos;re building
              and we&apos;ll scope it, price it, and deliver it — on time, on budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
              >
                Start a project
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
