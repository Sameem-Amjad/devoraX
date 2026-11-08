import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { DoorSections, MarketPages } from '@/components/seo/services-hub-content';
import { OfferLadder } from '@/components/seo/offer-ladder';
import { JsonLd } from '@/components/seo/structured-data';
import { TERMS } from '@/data/terms';
import { breadcrumbNode, pageMetadata, webPageNode } from '@/lib/seo';

export const revalidate = 3600;

/*
 * The services hub, rebuilt on 7 Nov 2026 around the three door pages and the
 * offer ladder. It used to list the four rows of the services table, each
 * linking to a /services/{id} page; those pages redirect now (next.config.ts),
 * and the rows stay in the database because projects.service_id points at them.
 *
 * Title 45 characters, 55 with " | DevoraX"; description 152. The description
 * names the steps a founder pays for, at the ladder's prices (data/offer.ts):
 * change them together.
 */
const TITLE = 'Services and Prices: Audit, Finish and Launch';
const DESCRIPTION =
  'Services and prices for a stuck app: a $400 audit credited to the fix, finish sprints at $1,200 a week, Stripe payments, and the iOS and Android launch.';

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/services', imageAlt: 'DevoraX services and prices' }),
  keywords: [
    'vibe code audit',
    'lovable app to app store',
    'sharetribe developers',
    'finish an AI-built app',
    'app store launch for a web app',
    'stripe payments setup',
    'multi vendor marketplace development',
    'DevoraX services',
    'DevoraX pricing',
  ],
};

const PATH = '/services';

// Who does the work, specialists included, from the terms row the door pages
// and /pricing print (data/terms.ts), so this page can't say something
// different. It used to add its own specialist sentence after it.
const WHO_WORKS = TERMS.find((t) => t.id === 'who-works')?.answer;

export default function ServicesPage() {
  return (
    <>
      {/* A CollectionPage: the page is a set of links to the service pages.
          No Offer or price markup here: /pricing and the door pages carry it,
          each for what it sells. */}
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            name: TITLE,
            description: DESCRIPTION,
            type: 'CollectionPage',
          }),
          breadcrumbNode(PATH, [{ name: 'Services', path: PATH }]),
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
                <li className="text-teal-400" aria-current="page">Services</li>
              </ol>
            </nav>

            <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
              What We Do
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
              Services and prices:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                audit, finish and launch
              </span>
            </h1>
            {/* The quoting sentence is the one /pricing and the FAQ use, word for word. */}
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              We finish and ship stuck apps: payments that work, and real iOS and Android apps,
              prepared and submitted to the App Store and Google Play. The stores decide approval.
              Most work starts with the $400 audit, credited to the fix. Two exceptions:
              Sharetribe Web Template work with no custom code is quoted from your requirements,
              and a payments-only fix can be quoted on the free call.
            </p>
          </div>
        </header>

        {/* ── The three doors, then new marketplace builds ── */}
        <DoorSections />

        {/* ── The ladder and who it is for ── */}
        <OfferLadder />

        {/* ── The vertical pages ── */}
        <MarketPages />

        {/* ── Who does the work ── */}
        <section aria-labelledby="who-heading" className="py-20 bg-[#030303]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="who-heading" className="text-3xl md:text-4xl font-bold text-white mb-6">
                Two engineers on every sprint
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-4">
                DevoraX is a two-person studio, founded in 2022 and based in Pakistan. The
                people on the call are the people writing the code. {WHO_WORKS}
              </p>
              <p className="text-gray-500 mb-10">
                The start date, how we keep in touch, what happens if the work runs over, store
                rejections, payment, the audit credit and who holds the accounts are all in{' '}
                <Link href="/pricing#terms" className="text-teal-400 underline underline-offset-4 hover:text-teal-300">
                  the terms on the pricing page
                </Link>
                .
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {[
                  // "5+ Years Operating" was removed when it appeared to
                  // contradict the schema's foundingDate — but the schema was the
                  // wrong one. Tenure is shown as an exact year rather than a count
                  // that drifts every January: 2022, confirmed by Sameem on 9 Oct 2026.
                  // "25 Projects Shipped" counted employer work and builds with no
                  // public link as DevoraX deliveries, and the review count
                  // disagreed with other pages; both are replaced with figures on
                  // the public Fiverr profile.
                  { val: '5.0', label: 'Fiverr Rating' },
                  { val: '2022', label: 'Operating Since' },
                  { val: '50+', label: 'Fiverr Projects' },
                  { val: '100%', label: 'IP Ownership' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-5 rounded-xl bg-[#0a0a0a] border border-white/5">
                    <div className="text-2xl font-bold text-teal-400 font-mono mb-1">{s.val}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Every project starts with the free call, booked on /book;
                  ?from= records this page as where the booking came from. */}
              <Link
                href="/book?from=services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
              >
                Book a free 30-minute call
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
