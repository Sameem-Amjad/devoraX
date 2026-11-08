import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, Mail, Linkedin } from 'lucide-react';
import { JsonLd } from '@/components/seo/structured-data';
import { FAQS } from '@/data/faqs';
import { InlineText } from '@/components/seo/rich-text';
import { BRAND_FACTS, FOUNDER_PROFILES } from '@/data/brand';
import { OFFER_LADDER } from '@/data/offer';
import { ORGANIZATION_ID, SITE_URL, breadcrumbNode, webPageNode } from '@/lib/seo';

/* A short page that leads with the booking page and gives the email address.
   It used to promise a reply "within one business day" and a fixed-price
   proposal "within 48 hours". Those were promises, not practices anyone had
   confirmed, and the site makes no turnaround promise anywhere now. Its own
   "Book a Free Strategy Call" card ended in an email link, so a visitor who
   came here from the header's "Book a Call" had no way to book at all; the
   header goes to /book now, and so does this page's first button. */

const DESCRIPTION =
  'Book a free 30-minute call with Sameem Amjad about your app, or email business@thedevorax.tech. Weekday calls, with evening slots for US time zones.';

// Title 23 characters, 33 with " | DevoraX", and the same words as the H1. It
// was "Contact Us — Book a Free Strategy Call": an em dash, and a "strategy
// call" the page doesn't offer.
const TITLE = 'Book a Call or Email Us';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/contact`,
    siteName: 'DevoraX',
    title: `${TITLE} | DevoraX`,
    description:
      'Book a free 30-minute call about your app, or email us. Weekday calls, with evening slots for US time zones.',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Contact DevoraX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | DevoraX`,
    description: 'Book a free 30-minute call about your app, or email us.',
    images: [{ url: `${SITE_URL}/og-image.jpg`, alt: 'Contact DevoraX' }],
  },
};

const PATH = '/contact';

// The page's main entity is the company itself. It points at the full
// Organization in the root layout rather than re-declaring a partial copy here:
// the old inline one carried its own name, email and sameAs list, and the
// LinkedIn URL in it had already drifted from the one in the layout.
const graph = [
  webPageNode({
    path: PATH,
    type: 'ContactPage',
    name: 'Contact DevoraX',
    description: DESCRIPTION,
    mainEntity: ORGANIZATION_ID,
  }),
  breadcrumbNode(PATH, [{ name: 'Contact', path: PATH }]),
];

const FOUNDER_LINKEDIN = FOUNDER_PROFILES.find((p) => p.label === 'LinkedIn')!.url;

// The first two rungs of the offer ladder: the call, and the audit it usually
// leads to. Read from data/offer.ts so this page says what /pricing says.
const CALL = OFFER_LADDER[0];
const AUDIT = OFFER_LADDER[1];

const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

// Printed in full rather than assembled in the browser: the address is
// already in the HTML of every page (the footer's email link, /book, /press),
// so hiding it here kept it only from visitors without JavaScript.
const OTHER_CHANNELS = [
  {
    Icon: Mail,
    label: 'Email',
    value: BRAND_FACTS.salesEmail,
    href: `mailto:${BRAND_FACTS.salesEmail}`,
    description: "For anything that doesn't need a call, or when no time on the calendar suits you.",
    external: false,
  },
  // Twitter/X channel removed: @devorax_agency returns 404 on both x.com and
  // twitter.com. Advertising a contact channel that does not exist is worse than
  // offering one fewer.
  // The studio's LinkedIn and GitHub links went when the owner removed them
  // from ORG_PROFILES (14 Oct 2026): neither is a profile DevoraX runs. The
  // founder's own LinkedIn is, and he is who you would be talking to.
  {
    Icon: Linkedin,
    label: 'LinkedIn',
    value: 'Sameem Amjad',
    href: FOUNDER_LINKEDIN,
    description: 'Message the founder directly.',
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd graph={graph} />

      <main id="main-content" className="min-h-screen bg-[#020202] text-white">
        {/* ── Header: the call first, then the email address ── */}
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
              <ol className="flex items-center gap-2 text-xs text-gray-400">
                <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-teal-400">Contact</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
              Book a call or email us
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              The quickest way to start is a free 30-minute call with Sameem Amjad, who
              founded DevoraX. {CALL.body}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-5">
              {/* No ?from=: /book counts the booking as made from this page,
                  the page before it. */}
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
              >
                <CalendarDays className="w-5 h-5" />
                Book a free 30-minute call
                <ArrowRight className="w-4 h-4" />
              </Link>
              {/* Text rather than a second button, so the address can wrap
                  onto its own line on a narrow phone. */}
              <p className="text-gray-400">
                Or email{' '}
                <a href={`mailto:${BRAND_FACTS.salesEmail}`} className={`font-semibold ${linkClass}`}>
                  {BRAND_FACTS.salesEmail}
                </a>
              </p>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
              Calls run {BRAND_FACTS.callHours} The booking page shows every time in your own
              time zone.
            </p>
          </div>
        </header>

        {/* ── Other ways to reach us ── */}
        <section aria-labelledby="channels-heading" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 id="channels-heading" className="text-2xl font-bold text-white mb-8">
              Other ways to reach us
            </h2>
            <ul className="grid gap-4 md:grid-cols-2 list-none">
              {OTHER_CHANNELS.map(({ Icon, label, value, href, description, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="group flex h-full items-start gap-5 p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-teal-500/30 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">{label}</div>
                      {/* An email address has no spaces to break at. */}
                      <div className="text-white font-semibold group-hover:text-teal-300 transition-colors [overflow-wrap:anywhere]">
                        {value}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{description}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What happens after you get in touch ── */}
        <section aria-label="What happens next" className="py-20 border-t border-white/5 bg-[#030303]">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-3xl font-bold text-white">What happens after you book a call?</h2>
            <p className="mt-5 leading-relaxed text-gray-400">
              Booking reserves a 30-minute slot for a conversation. It does not
              commit you to anything, and either side can reschedule. The form
              needs your name, your email and a time; everything else on it is
              optional. What it stores, and why, is set out in our{' '}
              <Link href="/privacy" className={linkClass}>
                privacy policy
              </Link>
              .
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              On the call we work out where the app is stuck, what already exists
              and which parts of it are actually hard. For an app that already
              exists, the usual next step is the launch-readiness audit:{' '}
              {AUDIT.price.toLowerCase()}. A new build gets a written proposal
              with a fixed price and a scope. Every step and its price is on the{' '}
              <Link href="/pricing" className={linkClass}>
                pricing page
              </Link>
              . If we are not the right fit, we say so on the call.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              You do not need a specification to have this conversation. If you
              have an idea and no documents, that is a normal starting point.
            </p>

            <h2 className="mt-14 text-3xl font-bold text-white">
              Common questions before getting in touch
            </h2>
            {/* Was a link to /#faq. Sending someone to another page to read the
                answers means this page answers nothing itself — and a crawler or
                AI engine reading /contact sees a stub. The answers are rendered
                here, from the same array the homepage uses. */}
            <div className="mt-8 space-y-3">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-white/5 bg-[#0a0a0a] p-6 open:border-teal-500/30"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-300 group-open:text-white [&::-webkit-details-marker]:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-gray-400">
                    <InlineText text={f.a} />
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/services"
                className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
              >
                What we build
              </Link>
              {/* Was "Engineering case studies" to /case-study, which now
                  redirects to /projects. */}
              <Link
                href="/projects"
                className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
              >
                Our work
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
              >
                Terms of service
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
