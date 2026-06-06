import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, MessageSquare, Twitter, Linkedin, Github, Clock } from 'lucide-react';
import { ObfuscatedEmail } from '@/components/ui/obfuscatedEmail';

const BASE_URL = 'https://thedevorax.tech';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with DevoraX. Book a free 30-minute strategy call, send us a project brief, or reach out directly. We typically respond within one business day.',
  keywords: [
    'contact DevoraX',
    'hire software development agency',
    'book discovery call',
    'software development inquiry',
    'mobile app development quote',
    'web development consultation',
    'AI development agency contact',
    'custom software quote',
  ],
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${BASE_URL}/contact`,
    siteName: 'DevoraX',
    title: 'Contact | DevoraX',
    description: 'Book a free strategy call or send us a project brief. We respond within one business day.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Contact DevoraX' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@devorax_agency',
    creator: '@devorax_agency',
    title: 'Contact | DevoraX',
    description: 'Book a free strategy call or send us a project brief.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, alt: 'Contact DevoraX' }],
  },
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact DevoraX',
  url: `${BASE_URL}/contact`,
  description: 'Contact page for DevoraX software development agency',
  mainEntity: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'DevoraX',
    email: 'business@thedevorax.tech',
    url: BASE_URL,
    sameAs: [
      'https://twitter.com/devorax_agency',
      'https://linkedin.com/company/devorax',
      'https://github.com/devorax',
    ],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE_URL}/contact` },
  ],
};

const CONTACT_CHANNELS = [
  {
    Icon: Mail,
    label: 'Email us',
    value: null,
    emailUser: 'business',
    emailDomain: 'thedevorax.tech',
    href: 'mailto:business@thedevorax.tech',
    description: 'For project enquiries and proposals',
  },
  {
    Icon: Twitter,
    label: 'Twitter / X',
    value: '@devorax_agency',
    href: 'https://twitter.com/devorax_agency',
    description: 'Quick questions and updates',
    external: true,
  },
  {
    Icon: Linkedin,
    label: 'LinkedIn',
    value: 'DevoraX Agency',
    href: 'https://linkedin.com/company/devorax',
    description: 'Professional network and announcements',
    external: true,
  },
  {
    Icon: Github,
    label: 'GitHub',
    value: 'github.com/devorax',
    href: 'https://github.com/devorax',
    description: 'Open-source work and contributions',
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <main className="min-h-screen bg-[#020202] text-white">
        {/* ── Header ── */}
        <header className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
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
                <li className="text-teal-400">Contact</li>
              </ol>
            </nav>

            <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
              Get In Touch
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
              Let&apos;s Build Something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Exceptional
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              Every project starts with a conversation. Book a free 30-minute strategy call and we&apos;ll
              review your requirements, recommend the right approach, and deliver a fixed-price proposal
              within 48 hours — no commitment required.
            </p>
          </div>
        </header>

        {/* ── Main content ── */}
        <section aria-label="Contact options" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              {/* Left — channels */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">Contact Channels</h2>
                <ul className="space-y-4 list-none">
                  {CONTACT_CHANNELS.map(({ Icon, label, value, emailUser, emailDomain, href, description, external }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="group flex items-start gap-5 p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-teal-500/30 transition-all"
                      >
                        <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">{label}</div>
                          <div className="text-white font-semibold group-hover:text-teal-300 transition-colors">
                            {emailUser && emailDomain
                              ? <ObfuscatedEmail user={emailUser} domain={emailDomain} />
                              : value}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{description}</div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Response time */}
                <div className="mt-8 p-5 rounded-xl border border-white/5 bg-[#0a0a0a] flex items-start gap-4">
                  <Clock className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Typical response time</p>
                    <p className="text-sm text-gray-500">
                      We respond to all project enquiries within <strong className="text-teal-400">1 business day</strong>.
                      Discovery calls are available Monday–Friday, 9 am–6 pm PKT (UTC+5).
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — book call CTA */}
              <div className="lg:sticky lg:top-32">
                <div className="p-10 rounded-3xl bg-gradient-to-b from-teal-900/20 to-black border border-teal-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.08)_0%,_transparent_60%)] pointer-events-none" />
                  <div className="relative z-10">
                    <MessageSquare className="w-8 h-8 text-teal-400 mb-5" />
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Book a Free Strategy Call
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-8">
                      In 30 minutes we&apos;ll review your project, identify the right technical approach, and
                      walk through a realistic timeline and budget estimate. No sales pitch, just straight talk.
                    </p>

                    <ul className="space-y-3 mb-8">
                      {[
                        'Free, no-commitment discovery session',
                        'Fixed-price proposal delivered within 48 h',
                        'Full IP & source code ownership on delivery',
                        'Weekly sprint demos from day one',
                      ].map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm text-gray-300">
                          <span className="w-5 h-5 rounded-full bg-teal-500/15 flex items-center justify-center flex-shrink-0 mt-0.5 text-teal-400 text-xs font-bold">✓</span>
                          {point}
                        </li>
                      ))}
                    </ul>

                    <a
                      href="mailto:business@thedevorax.tech?subject=Project%20Enquiry%20%E2%80%94%20Discovery%20Call%20Request"
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
                    >
                      Send project brief
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Services link */}
                <div className="mt-6 p-5 rounded-xl border border-white/5 bg-[#0a0a0a] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Explore our services</p>
                    <p className="text-xs text-gray-500 mt-0.5">See what we offer before reaching out</p>
                  </div>
                  <Link
                    href="/services"
                    className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors group"
                  >
                    View services
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FAQ teaser ── */}
        <section aria-label="Common questions" className="py-20 border-t border-white/5 bg-[#030303]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Have more questions?</h2>
            <p className="text-gray-400 mb-8">
              We&apos;ve answered the most common questions about timelines, pricing, IP ownership, and process
              on our homepage.
            </p>
            <Link
              href="/#faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors group"
            >
              Read the FAQ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
