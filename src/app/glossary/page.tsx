import Link from 'next/link';
import { GLOSSARY, GLOSSARY_UPDATED } from '@/data/glossary';
import { absoluteUrl, breadcrumbNode, pageMetadata, webPageNode } from '@/lib/seo';
import { JsonLd } from '@/components/seo/structured-data';
import { BreadcrumbTrail } from '@/components/seo/breadcrumb-trail';
import { BookCallCta } from '@/components/seo/book-call-cta';
import { DateText } from '@/components/seo/date-text';

/**
 * Definitions of the terms the services, solutions and articles rely on (SEO
 * guide §4.2.4). Each one opens with "X is…" and stands on its own, because a
 * definition is the passage an answer engine lifts whole.
 *
 * The visible <dl> and the DefinedTermSet are both built from GLOSSARY
 * (data/glossary.ts), so the markup cannot describe a term the page does not
 * show. Each term's anchor is its @id, so a citation can point at one entry.
 */

const PATH = '/glossary';
const PAGE_URL = absoluteUrl(PATH);
const H1 = 'App launch, payments and marketplace glossary';
const DESCRIPTION =
  'Plain definitions of the terms that come up when an app is finished and shipped: App Store review, Stripe Connect, Sharetribe, Supabase, RLS and more.';
const TRAIL = [{ name: 'Glossary', path: PATH }];

export const metadata = pageMetadata({
  title: 'Glossary: App Launch, Payments and Marketplaces',
  description: DESCRIPTION,
  path: PATH,
  imageAlt: 'DevoraX glossary',
});

const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

const TERMS = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

const termSetNode = {
  '@type': 'DefinedTermSet',
  '@id': `${PAGE_URL}#terms`,
  name: H1,
  url: PAGE_URL,
  hasDefinedTerm: TERMS.map((t) => ({
    '@type': 'DefinedTerm',
    '@id': `${PAGE_URL}#${t.id}`,
    name: t.term,
    description: t.definition,
    url: `${PAGE_URL}#${t.id}`,
    inDefinedTermSet: { '@id': `${PAGE_URL}#terms` },
  })),
};

export default function GlossaryPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            type: 'CollectionPage',
            name: H1,
            description: DESCRIPTION,
            mainEntity: `${PAGE_URL}#terms`,
            dateModified: GLOSSARY_UPDATED,
          }),
          breadcrumbNode(PATH, TRAIL),
          termSetNode,
        ]}
      />
      <main id="main-content" className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <BreadcrumbTrail trail={TRAIL} />
          <h1 className="text-4xl font-bold text-white md:text-5xl">{H1}</h1>
          <p className="mt-4 text-sm text-gray-400">
            Last updated <DateText iso={GLOSSARY_UPDATED} />
          </p>

          <p className="mt-6 text-xl leading-relaxed text-gray-200">
            Plain definitions of {TERMS.length} terms that come up when a stuck app is
            finished and shipped: the app stores, Stripe payments, marketplaces, the tools
            apps are built with, and DevoraX&apos;s own launch-readiness audit and finish
            sprint.
          </p>
          <p className="mt-4 leading-relaxed text-gray-400">
            Each definition stands on its own and, where we have one, links to the DevoraX
            page that covers the subject in more depth.
          </p>

          <nav aria-labelledby="jump-heading" className="mt-10">
            <h2 id="jump-heading" className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              Jump to a term
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {TERMS.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="inline-block rounded-full border border-white/10 px-3 py-1 text-sm text-gray-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                  >
                    {t.term}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="terms-heading" className="mt-14">
            <h2 id="terms-heading" className="text-2xl font-bold text-white">
              Terms, A to Z
            </h2>
            <dl className="mt-4 divide-y divide-white/5">
              {TERMS.map((t) => (
                <div key={t.id} className="py-7">
                  {/* scroll-mt clears the fixed 96px header when a jump link lands here. */}
                  <dt id={t.id} className="scroll-mt-32 text-xl font-bold text-white">
                    <dfn className="not-italic">{t.term}</dfn>
                  </dt>
                  <dd className="mt-3">
                    <p className="leading-relaxed text-gray-400">{t.definition}</p>
                    {t.related && (
                      <p className="mt-3 text-sm">
                        <Link href={t.related.href} className={linkClass}>
                          {t.related.label}
                        </Link>
                      </p>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <BookCallCta />
        </div>
      </main>
    </>
  );
}
