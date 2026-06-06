import { Metadata } from 'next';
import { createClient } from '@/lib/server';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Code2, Cpu, Layout, Server, Smartphone, Zap } from 'lucide-react';

const BASE_URL = 'https://thedevorax.tech';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore DevoraX\'s full range of software development services — React Native mobile apps, AI-powered Next.js web platforms, cloud architecture, DevOps automation, UI/UX design, and e-commerce solutions.',
  keywords: [
    'mobile app development services',
    'AI web development agency',
    'cloud architecture consulting',
    'DevOps automation services',
    'React Native development',
    'Next.js development agency',
    'UI/UX design services',
    'e-commerce platform development',
    'full-stack software development',
    'custom software development services',
    'DevoraX services',
    'Pakistan software agency',
  ],
  alternates: { canonical: `${BASE_URL}/services` },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${BASE_URL}/services`,
    siteName: 'DevoraX',
    title: 'Services | DevoraX',
    description:
      'Mobile apps, AI platforms, cloud architecture, and more — explore the full DevoraX service catalogue.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'DevoraX Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@devorax_agency',
    creator: '@devorax_agency',
    title: 'Services | DevoraX',
    description: 'Mobile apps, AI platforms, cloud architecture, and more.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, alt: 'DevoraX Services' }],
  },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone, Cpu, Server, Layout, Code2, Zap,
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] || Code2;
  return <Icon className="w-6 h-6" />;
}

const itemListSchema = (services: { id: string | number; title: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'DevoraX Software Development Services',
  description: 'Full-service software development offerings from DevoraX agency',
  numberOfItems: services.length,
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.title,
    url: `${BASE_URL}/services/${s.id}`,
  })),
});

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
  ],
};

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase.from('services').select('*').order('created_at', { ascending: true });
  const list = services || [];

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
                <li className="text-teal-400">Services</li>
              </ol>
            </nav>

            <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
              What We Do
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
              End-to-End Software{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Development Services
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              From native mobile apps to AI-powered web platforms and cloud infrastructure — DevoraX delivers
              production-grade software across the full technology stack. Every engagement starts with a free
              30-minute strategy call and a fixed-price proposal.
            </p>
          </div>
        </header>

        {/* ── Services Grid ── */}
        <section aria-label="Service catalogue" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            {list.length === 0 ? (
              <p className="text-center text-gray-500 py-20">Services are loading — check back shortly.</p>
            ) : (
              <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
                {list.map((service: any) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.id}`}
                      className="group block h-full p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-teal-500/30 hover:bg-[#0d1a1a] transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5 group-hover:bg-teal-500/20 transition-colors">
                        <ServiceIcon name={service.icon} />
                      </div>

                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
                        {service.desc_text}
                      </p>

                      {Array.isArray(service.tags) && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {service.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-[0.65rem] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 group-hover:gap-2.5 transition-all">
                        View service details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ── Why Choose DevoraX ── */}
        <section aria-label="Why choose DevoraX" className="py-20 border-t border-white/5 bg-[#030303]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                One Agency, Full Stack
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                DevoraX is a vertically integrated technology partner. Whether you need a React Native
                app shipped in six weeks, an AI pipeline integrated into your existing platform, or a
                full cloud infrastructure migration — our team of 15+ senior engineers handles every layer.
                No hand-offs, no subcontractors, no surprises.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {[
                  { val: '100+', label: 'Projects Shipped' },
                  { val: '5+',   label: 'Years Operating' },
                  { val: '15+',  label: 'Senior Engineers' },
                  { val: '100%', label: 'IP Ownership' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-5 rounded-xl bg-[#0a0a0a] border border-white/5">
                    <div className="text-2xl font-bold text-teal-400 font-mono mb-1">{s.val}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
              >
                Start a project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
