import Link from 'next/link';
import { FIT, OFFER_LADDER, OFFER_UPDATED, POSITIONING, PRICES_UPDATED } from '@/data/offer';
import { DOOR_LINKS } from '@/data/siteNav';
import { TERMS_DATA_UPDATED, termText, termsFor } from '@/data/terms';
import { ORG_REF, absoluteUrl, breadcrumbNode, pageMetadata, webPageNode } from '@/lib/seo';
import { offerPrice } from '@/lib/offerPricing';
import { JsonLd } from '@/components/seo/structured-data';
import { BreadcrumbTrail } from '@/components/seo/breadcrumb-trail';
import { BookCallCta } from '@/components/seo/book-call-cta';
import { DateText } from '@/components/seo/date-text';
import { TermsBlock } from '@/components/seo/terms-block';

/**
 * The answer to "how much does it cost to finish my app?", and the page a
 * "DevoraX pricing" search should land on (SEO guide §11.5).
 *
 * Every price on it comes from OFFER_LADDER (data/offer.ts), which is also what
 * /services, the home page and llms.txt print, so the four cannot quote
 * different numbers. The schema prices come from each step's schemaPrice,
 * through the same helper the door pages use (lib/offerPricing.ts).
 */

/* Hourly, so the start date in the terms (data/terms.ts) is checked against
   the day the page is served: a week that has passed becomes "ask on the
   call" within the hour, as on /book and the door pages. */
export const revalidate = 3600;

const PATH = '/pricing';
const PAGE_URL = absoluteUrl(PATH);
const H1 = 'What it costs to finish and ship your app';
const DESCRIPTION =
  'Finishing an app: a $400 audit credited to the fix, then $1,200 per week, usually 1–2 weeks. Payments from $1,200, the iOS and Android launch from $2,400.';
const TRAIL = [{ name: 'Pricing', path: PATH }];

export const metadata = pageMetadata({
  title: 'Pricing: What It Costs to Finish Your App',
  description: DESCRIPTION,
  path: PATH,
  imageAlt: 'DevoraX pricing',
});

const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

/**
 * The full terms Q&A (#terms) is this page's FAQ: every row of data/terms.ts
 * marked 'pricing', the one source of terms the door pages, the listing kit and
 * /terms also follow. It replaced a pick of the homepage FAQS, which restated
 * some of the same terms in other words.
 */
const PRICING_TERMS = termsFor('pricing');

/** The page changed when its steps or prices did, or when the terms it prints did. */
const PAGE_UPDATED = OFFER_UPDATED > TERMS_DATA_UPDATED ? OFFER_UPDATED : TERMS_DATA_UPDATED;

/**
 * The free call has no schemaPrice, because no door page sells it, but this
 * catalogue lists it, and price 0 is how an Offer says it is free.
 */
const FREE = { price: 0, priceCurrency: 'USD' } as const;

const serviceNode = {
  '@type': 'Service',
  '@id': `${PAGE_URL}#service`,
  name: 'Finishing and shipping a stuck app',
  description: `${POSITIONING.promise} ${POSITIONING.audience}`,
  provider: ORG_REF,
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  url: PAGE_URL,
  mainEntityOfPage: { '@id': `${PAGE_URL}#webpage` },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'How we finish and ship your app',
    itemListElement: OFFER_LADDER.map((s) => ({
      '@type': 'Offer',
      name: s.title,
      description: s.body,
      ...(s.id === 'call' ? FREE : offerPrice(s)),
    })),
  },
};

/**
 * The FAQPage for the terms block, answer for answer as TermsBlock renders them
 * (termText is the plain-text form of what TermAnswer prints). Built when the
 * page renders, because the start-date row opens with nextStartLine(), which
 * depends on the day.
 */
function termsFaqNode(now: Date) {
  return {
    '@type': 'FAQPage',
    '@id': `${PAGE_URL}#terms`,
    mainEntity: PRICING_TERMS.map((t) => ({
      '@type': 'Question',
      name: t.question,
      acceptedAnswer: { '@type': 'Answer', text: termText(t, 'pricing', now) },
    })),
  };
}

export default function PricingPage() {
  const faqNode = PRICING_TERMS.length ? termsFaqNode(new Date()) : null;
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            name: H1,
            description: DESCRIPTION,
            about: `${PAGE_URL}#service`,
            dateModified: PAGE_UPDATED,
          }),
          breadcrumbNode(PATH, TRAIL),
          serviceNode,
          faqNode,
        ]}
      />
      <main id="main-content" className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <BreadcrumbTrail trail={TRAIL} />
          <h1 className="text-4xl font-bold text-white md:text-5xl">{H1}</h1>
          <p className="mt-4 text-sm text-gray-400">
            Prices last changed <DateText iso={PRICES_UPDATED} />
          </p>

          {/* Answer first, with the real numbers: the passage an answer engine
              is most likely to lift for "how much does it cost to finish my app". */}
          <p className="mt-6 text-xl leading-relaxed text-gray-200">
            Finishing an app you already have usually starts with a $400 launch-readiness
            audit, credited to the fix if you go ahead. The fix is a finish sprint at $1,200
            per week, usually 1–2 weeks, and the audit says how many weeks it needs, so you
            know the total before work starts.
          </p>
          <p className="mt-4 leading-relaxed text-gray-400">
            Payments start from $1,200, with Connect payouts to sellers from $2,400, and an
            iOS and Android launch starts from $2,400. Both are billed like sprints, in
            $1,200 weeks paid in advance. Monthly care after launch is $1,500 per month. The
            first 30-minute call is free and there is no hourly billing. What we quote is
            what you pay: if the work takes longer than the audit or the written quote
            estimated, we finish the agreed scope at no extra cost.
          </p>

          <section aria-labelledby="prices" className="mt-14">
            <h2 id="prices" className="scroll-mt-32 text-2xl font-bold text-white">
              What does each step cost?
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="mb-3 text-left text-xs uppercase tracking-widest text-teal-400">
                  Each step for an app you already have, in order, with prices in US dollars.
                  Start at the top and stop wherever you like.
                </caption>
                <thead>
                  <tr className="border-b border-white/15">
                    <th scope="col" className="py-3 pr-6 font-semibold text-white">
                      Step
                    </th>
                    <th scope="col" className="py-3 pr-6 font-semibold text-white">
                      What you get
                    </th>
                    <th scope="col" className="py-3 font-semibold text-white">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {OFFER_LADDER.map((s) => (
                    <tr key={s.title} className="border-b border-white/5">
                      <th scope="row" className="py-4 pr-6 align-top font-semibold text-white">
                        {s.title}
                      </th>
                      <td className="py-4 pr-6 align-top leading-relaxed text-gray-400">{s.body}</td>
                      <td className="py-4 align-top font-semibold text-teal-400">{s.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Every door's price block links here, so the steps link back to
                the doors that sell them. */}
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Which steps you need depends on where the app is stuck:{' '}
              {DOOR_LINKS.map((d, i) => (
                <span key={d.slug}>
                  {i > 0 ? (i === DOOR_LINKS.length - 1 ? ' or ' : ', ') : ''}
                  <Link href={d.href} className={linkClass}>
                    {d.anchor}
                  </Link>
                </span>
              ))}
              .
            </p>
          </section>

          <section aria-labelledby="how-set" className="mt-14">
            <h2 id="how-set" className="scroll-mt-32 text-2xl font-bold text-white">
              How is the price set?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              Most work starts with the $400 audit, credited to the fix. Two exceptions:
              Sharetribe Web Template work with no custom code is quoted from your
              requirements, and a payments-only fix can be quoted on the free call.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              Where there is an audit, it sets the price. The launch-readiness audit reviews
              your code, database security, payments, hosting and store readiness, then says
              how many weeks of finish sprint the fix needs, so you know the total before
              work starts. You keep the written report whatever you decide, and the $400 is
              credited to the fix if you go ahead.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              Payments and the iOS and Android launch are priced from a starting point and
              billed like sprints, weekly in advance in $1,200 weeks. Stripe checkout and
              subscriptions start from $1,200, one week of our work; Connect payouts to sellers
              from $2,400, two weeks; and the launch from $2,400, two weeks. The launch includes
              the store listing, App Privacy details and Google Play&apos;s Data safety form, and
              in-app purchase or a US web-checkout link is a separate line in the launch quote.
              A full React Native build is quoted after the audit.
            </p>
          </section>

          <section aria-labelledby="new-builds" className="mt-14">
            <h2 id="new-builds" className="scroll-mt-32 text-2xl font-bold text-white">
              What does a new app built from scratch cost?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              New builds from scratch use the fixed-price MVP packages: MVP Starter from
              $2,900, Growth &amp; Scale from $7,500, and Enterprise Transformation, priced
              custom. Each starts with a free 30-minute discovery call and a fixed-price
              proposal, and MVP Starter and Growth &amp; Scale include 35 days of free
              maintenance after launch.{' '}
              <Link href="/#pricing" className={linkClass}>
                Compare the MVP packages on the home page
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="fit" className="mt-14">
            <h2 id="fit" className="scroll-mt-32 text-2xl font-bold text-white">
              Who is this for, and who isn&apos;t it for?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">{POSITIONING.audience}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/[0.03] p-6">
                <h3 className="text-lg font-bold text-white">A good fit</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-gray-300 marker:text-teal-400">
                  {FIT.good.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
                <h3 className="text-lg font-bold text-white">Not a fit</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-gray-400 marker:text-gray-600">
                  {FIT.notFit.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* #terms: the full Q&A the door pages and /terms point to. */}
          <TermsBlock surface="pricing" />

          <BookCallCta from="pricing" />
        </div>
      </main>
    </>
  );
}
