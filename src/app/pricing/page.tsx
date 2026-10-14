import Link from 'next/link';
import { FAQS } from '@/data/faqs';
import { FIT, OFFER_LADDER, OFFER_UPDATED, POSITIONING } from '@/data/offer';
import { ORG_REF, absoluteUrl, breadcrumbNode, pageMetadata, webPageNode } from '@/lib/seo';
import { JsonLd } from '@/components/seo/structured-data';
import { BreadcrumbTrail } from '@/components/seo/breadcrumb-trail';
import { BookCallCta } from '@/components/seo/book-call-cta';
import { DateText } from '@/components/seo/date-text';

/**
 * The answer to "how much does it cost to finish my app?", and the page a
 * "DevoraX pricing" search should land on (SEO guide §11.5).
 *
 * Every price on it comes from OFFER_LADDER (data/offer.ts), which is also what
 * /services, the home page and llms.txt print, so the four cannot quote
 * different numbers. The schema prices are parsed from the same strings the
 * table shows, never typed in a second time.
 */

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
 * The FAQs about money and terms: what it costs, who owns the code once it is
 * paid for, what happens after launch, and NDAs. Picked by question, so each
 * answer renders verbatim from data/faqs.ts and the FAQPage node describes only
 * what this page shows.
 */
const PRICING_FAQS = FAQS.filter((f) =>
  /\bcost\b|\bown the code\b|\bafter launch\b|\bNDAs?\b/i.test(f.q)
);

/**
 * Schema price for one ladder step, read from the string the table prints:
 * "Free" → 0, "$400, …" → 400, "$1,200 per week" → a weekly unit price,
 * "From $1,200 …" → a minimum price. A price written in a shape this does not
 * recognise gets no schema price rather than a guessed one.
 */
function offerPrice(price: string) {
  const usd = (s: string) => Number(s.replace(/,/g, ''));
  if (/^free\b/i.test(price)) return { price: 0, priceCurrency: 'USD' };
  const from = price.match(/^from \$([\d,]+)/i);
  if (from) {
    return {
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: usd(from[1]),
        priceCurrency: 'USD',
      },
    };
  }
  const per = price.match(/^\$([\d,]+) per (week|month)\b/i);
  if (per) {
    return {
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: usd(per[1]),
        priceCurrency: 'USD',
        unitText: per[2].toLowerCase(),
      },
    };
  }
  const flat = price.match(/^\$([\d,]+)/);
  if (flat) return { price: usd(flat[1]), priceCurrency: 'USD' };
  return {};
}

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
      ...offerPrice(s.price),
    })),
  },
};

const faqNode = PRICING_FAQS.length
  ? {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: PRICING_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }
  : null;

export default function PricingPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            name: H1,
            description: DESCRIPTION,
            about: `${PAGE_URL}#service`,
            dateModified: OFFER_UPDATED,
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
            Prices last changed <DateText iso={OFFER_UPDATED} />
          </p>

          {/* Answer first, with the real numbers: the passage an answer engine
              is most likely to lift for "how much does it cost to finish my app". */}
          <p className="mt-6 text-xl leading-relaxed text-gray-200">
            Finishing an app you already have starts with a $400 launch-readiness audit,
            credited to the fix if you go ahead. The fix is a finish sprint at $1,200 per
            week, usually 1–2 weeks, and the audit says how many weeks it needs, so you
            know the total before work starts.
          </p>
          <p className="mt-4 leading-relaxed text-gray-400">
            Payments start from $1,200, with Connect payouts to sellers from $2,400. An iOS
            and Android launch starts from $2,400, and monthly care after launch is $1,500
            per month. The first 30-minute call is free, there is no hourly billing, and
            what we quote is what you pay.
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
          </section>

          <section aria-labelledby="how-set" className="mt-14">
            <h2 id="how-set" className="scroll-mt-32 text-2xl font-bold text-white">
              How is the price set?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              The launch-readiness audit sets it. The audit reviews your code, database
              security, payments, hosting and store readiness, then says how many weeks of
              finish sprint the fix needs, so you know the total before work starts. You keep
              the written report whatever you decide, and the $400 is credited to the fix if
              you go ahead.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              Payments and the iOS and Android launch are priced from a starting point. Stripe
              checkout and subscriptions start from $1,200, Connect payouts to sellers from
              $2,400, and the launch from $2,400. A full React Native build is quoted after
              the audit.
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
              proposal.{' '}
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

          {PRICING_FAQS.length > 0 && (
            <section aria-labelledby="faq" className="mt-14">
              <h2 id="faq" className="scroll-mt-32 text-2xl font-bold text-white">
                Questions about price and terms
              </h2>
              <div className="mt-6 space-y-8">
                {PRICING_FAQS.map((f) => (
                  <div key={f.q}>
                    <h3 className="text-lg font-semibold text-white">{f.q}</h3>
                    <p className="mt-2 leading-relaxed text-gray-400">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <BookCallCta />
        </div>
      </main>
    </>
  );
}
