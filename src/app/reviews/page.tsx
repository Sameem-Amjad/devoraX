import { BRAND_FACTS } from '@/data/brand';
import {
  FIVERR_PROFILE_URL,
  TESTIMONIALS,
  TESTIMONIALS_UPDATED,
  TESTIMONIAL_STATS,
} from '@/data/testimonials';
import { ORGANIZATION_ID, breadcrumbNode, pageMetadata, webPageNode } from '@/lib/seo';
import { JsonLd } from '@/components/seo/structured-data';
import { BreadcrumbTrail } from '@/components/seo/breadcrumb-trail';
import { BookCallCta } from '@/components/seo/book-call-cta';
import { DateText } from '@/components/seo/date-text';

/**
 * Every review in data/testimonials.ts, for "DevoraX reviews" searches and for
 * assistants asked whether DevoraX is legitimate (SEO guide §11.5).
 *
 * Shown, never marked up: no Review or AggregateRating node. Reviews of a
 * business on its own site are self-serving under Google's rules, ineligible
 * for review rich results, and risk a manual action (see data/testimonials.ts).
 * The page links to the Fiverr profile instead, so the source does the vouching.
 */

const PATH = '/reviews';
const H1 = 'DevoraX client reviews';
const STATS = TESTIMONIAL_STATS;
const DESCRIPTION = `${STATS.totalReviews} client reviews quoted as written on Sameem Amjad's public Fiverr profile, from ${STATS.uniqueClients} clients in the US, UK, Canada and Hong Kong${STATS.allFiveStar ? ', all five-star' : ''}.`;
const TRAIL = [{ name: 'Reviews', path: PATH }];

export const metadata = pageMetadata({
  title: 'DevoraX Reviews: Client Feedback from Fiverr',
  description: DESCRIPTION,
  path: PATH,
  imageAlt: 'DevoraX client reviews',
});

const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

/** The reviewers' countries in order of first appearance, as one phrase. */
const COUNTRIES = [...new Set(TESTIMONIALS.map((t) => t.country))];
const COUNTRY_LIST =
  COUNTRIES.length > 1
    ? `${COUNTRIES.slice(0, -1).join(', ')} and ${COUNTRIES[COUNTRIES.length - 1]}`
    : COUNTRIES.join('');

export default function ReviewsPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            name: H1,
            description: DESCRIPTION,
            about: ORGANIZATION_ID,
            dateModified: TESTIMONIALS_UPDATED,
          }),
          breadcrumbNode(PATH, TRAIL),
        ]}
      />
      <main id="main-content" className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-5xl px-6">
          <BreadcrumbTrail trail={TRAIL} />
          <h1 className="text-4xl font-bold text-white md:text-5xl">{H1}</h1>

          <div className="max-w-3xl">
            <p className="mt-6 text-xl leading-relaxed text-gray-200">
              DevoraX&apos;s client reviews come from{' '}
              <a href={FIVERR_PROFILE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Sameem Amjad&apos;s public Fiverr profile
              </a>
              , and every one on this page is quoted as written there, so anyone can check
              it. Where Fiverr cuts a long review short, the quote ends with an ellipsis (…). The {STATS.totalReviews} reviews are from {STATS.uniqueClients} different
              clients, {STATS.repeatClients} of them repeat clients, in {STATS.countries}{' '}
              countries
              {STATS.allFiveStar ? `, and all ${STATS.totalReviews} are five-star` : ''}.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              The home page shows six of them. This page shows all {STATS.totalReviews}.
            </p>

            <section aria-labelledby="source" className="mt-14">
              <h2 id="source" className="text-2xl font-bold text-white">
                Where do these reviews come from?
              </h2>
              <p className="mt-4 leading-relaxed text-gray-400">
                Each review was written on Fiverr by the client who placed the order. The
                names below are the reviewers&apos; public Fiverr usernames, so every quote
                can be matched to the profile.
              </p>
              <dl className="mt-6 divide-y divide-white/5 border-y border-white/10">
                <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-white">Source</dt>
                  <dd className="text-gray-400">
                    <a href={FIVERR_PROFILE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {FIVERR_PROFILE_URL.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-white">Track record</dt>
                  <dd className="text-gray-400">{BRAND_FACTS.trackRecord}</dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-white">Reviewers based in</dt>
                  <dd className="text-gray-400">{COUNTRY_LIST}</dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-white">Last copied</dt>
                  <dd className="text-gray-400">
                    <DateText iso={TESTIMONIALS_UPDATED} />
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <section aria-labelledby="all-reviews" className="mt-14">
            <h2 id="all-reviews" className="text-2xl font-bold text-white">
              What have clients said?
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {TESTIMONIALS.map((t, i) => (
                <li key={`${t.username}-${i}`}>
                  <figure className="flex h-full flex-col rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
                    <blockquote cite={FIVERR_PROFILE_URL} className="flex-grow">
                      <p className="leading-relaxed text-gray-300">{t.text}</p>
                    </blockquote>
                    <figcaption className="mt-4 border-t border-white/5 pt-4 text-sm text-gray-400">
                      {t.username}, {t.country}, {t.rating}/5
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>

          <div className="max-w-3xl">
            <BookCallCta />
          </div>
        </div>
      </main>
    </>
  );
}
