/**
 * Renderer for a door page: a SOLUTIONS entry of kind 'offer'.
 *
 * A server component, so every word and every link is in the initial HTML: this
 * is the page an assistant quotes when someone asks who can finish their app.
 * The order follows what a buyer asks in turn: what this is and what it costs,
 * whether it is for them, what we actually do, the related questions, whose
 * work stands behind it, the terms, what is and isn't included, the remaining
 * questions, who should not hire us, then the price and one call to action.
 * Nothing is said twice, with one exception: the first terms row (the start
 * week and when the audit report arrives) also sits under the first call to
 * action, because a founder with a launch date asks it first and the terms
 * block is far down a long page. Both print it through TermAnswer
 * (terms-block.tsx), short form included, so they can't differ.
 *
 * Prices are never typed into the content: the subtitle's price and the closing
 * price block come from `offer_steps` and OFFER_LADDER, the terms from
 * data/terms.ts. A door whose step needs page-specific wording in the price
 * block (`price_notes`, data/solutions.ts) restates the same numbers; the Offer
 * schema still reads each step's schemaPrice. The proof cards carry the role
 * line or the job of each item,
 * and a project card's link takes its label from data/projectIndex.ts: "case
 * study" only for work a client contracted DevoraX for.
 *
 * No <article> elements: extractors such as trafilatura take the first
 * <article> on a page as its whole body (see offer-ladder.tsx).
 */
import Link from 'next/link';
import type { OfferProof, OfferSolution, Solution } from '@/data/solutions';
import { getSolution, solutionLabel, solutionTrail } from '@/data/solutions';
import { offerSteps } from '@/data/offer';
import { CASE_STUDY_CONTENT } from '@/data/caseStudyContent';
import { projectLabelText } from '@/data/projectIndex';
import { NEXT_START_TERM_ID, TERMS } from '@/data/terms';
import { TESTIMONIALS } from '@/data/testimonials';
import { offerSubtitle } from '@/lib/offerPricing';
import { BreadcrumbTrail } from './breadcrumb-trail';
import { Byline } from './byline';
import { DataTable } from './data-table';
import { InlineText, RichText, SmartLink, linkClass } from './rich-text';
import { TermAnswer, TermsBlock } from './terms-block';

const primaryButton =
  'inline-block rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-7 py-3.5 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(45,212,191,0.35)]';
const secondaryButton =
  'inline-block rounded-xl border border-white/10 px-7 py-3.5 font-semibold text-gray-300 transition-colors hover:border-teal-500/40 hover:text-white';
const sectionClass = 'mt-16 border-t border-white/5 pt-12';
const h2Class = 'text-2xl font-bold text-white md:text-3xl';
const cardClass = 'rounded-2xl border border-white/10 bg-[#0a0a0a] p-7';

/** The terms row that pairs the start week with the audit's turnaround. */
const START = TERMS.find((t) => t.id === NEXT_START_TERM_ID);

function Dot({ muted = false }: { muted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${muted ? 'bg-gray-700' : 'bg-teal-400'}`}
    />
  );
}

function ProofCard({ proof, page }: { proof: OfferProof; page: string }) {
  if (proof.type === 'project') {
    // Only a write-up in caseStudyContent.ts gets the "write-up" link; some
    // projects (Hear With You) have a page but no long-form study yet.
    const study = CASE_STUDY_CONTENT[proof.project_id];
    return (
      <div className={cardClass}>
        <h3 className="text-lg font-bold text-white">
          <Link href={`/projects/${proof.project_id}`} className={linkClass}>
            {proof.name}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-gray-300">
          <InlineText text={proof.role} />
        </p>
        <p className="mt-3 leading-relaxed text-gray-400">
          <span className="text-gray-300">What it shows: </span>
          <InlineText text={proof.what_it_proves} />
        </p>
        {proof.figures.length > 0 && (
          <>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              What you can check
            </p>
            {/* overflow-wrap: anywhere, because a figure is often a bare
                URL or store id with nowhere to break, and on a phone it
                pushed the whole page sideways. */}
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {proof.figures.map((f) => (
                <li key={f} className="min-w-0 font-mono text-sm text-teal-400 [overflow-wrap:anywhere]">
                  <InlineText text={f} />
                </li>
              ))}
            </ul>
          </>
        )}
        {study && (
          <p className="mt-4 text-sm">
            <Link
              href={`/projects/${proof.project_id}`}
              className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
            >
              Read the {projectLabelText(proof.project_id)}
            </Link>
          </p>
        )}
      </div>
    );
  }

  if (proof.type === 'review') {
    // A review card names a reviewer the /reviews page shows, or the build
    // stops: a handle that is not in testimonials.ts cannot be checked.
    const review = TESTIMONIALS.find((t) => t.username === proof.username);
    if (!review) {
      throw new Error(
        `/solutions/${page}: review proof "${proof.username}" is not a Fiverr handle in src/data/testimonials.ts`
      );
    }
    return (
      <div className={cardClass}>
        <h3 className="text-lg font-bold text-white">
          A Fiverr review from {review.username}, {review.country}
        </h3>
        <p className="mt-3 leading-relaxed text-gray-300">
          <span className="text-gray-400">The job: </span>
          <InlineText text={proof.job} />
        </p>
        <p className="mt-3 leading-relaxed text-gray-400">
          <InlineText text={proof.note} />
        </p>
        <p className="mt-4 text-sm">
          <Link href="/reviews" className="text-gray-400 underline underline-offset-4 hover:text-teal-400">
            Read every review, as written
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <h3 className="text-lg font-bold text-white">
        <SmartLink href={proof.href}>{proof.label}</SmartLink>
      </h3>
      <p className="mt-3 leading-relaxed text-gray-400">
        <span className="text-gray-300">What it shows: </span>
        <InlineText text={proof.what_it_proves} />
      </p>
    </div>
  );
}

export function OfferPage({ offer }: { offer: OfferSolution }) {
  const bookHref = `/book?from=${encodeURIComponent(offer.slug)}`;
  const steps = offerSteps(offer.offer_steps);
  const call = offerSteps(['call'])[0];
  // Slugs that are not published yet (a door that ships later) are skipped.
  const related = offer.related_slugs
    .filter((slug) => slug !== offer.slug)
    .map((slug) => getSolution(slug))
    .filter((s): s is Solution => Boolean(s));

  return (
    <main id="main-content" className="min-h-screen bg-[#020202] text-white">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <BreadcrumbTrail trail={solutionTrail(offer)} />

        <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">{offer.h1}</h1>
        <p className="mt-5 text-lg leading-relaxed text-gray-300">
          {offerSubtitle(offer.subtitle_lead, offer.offer_steps)}
        </p>

        <div className="mt-8">
          <Byline updated={offer.updated} kind="service page" />
        </div>

        {/* Answer-first: the passage most likely to be extracted and quoted. */}
        <p className="mt-8 text-xl leading-relaxed text-gray-200">
          <InlineText text={offer.hero_answer} />
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={bookHref} className={primaryButton}>
            Book a free 30-minute call
          </Link>
          {offer.secondary_cta && (
            <SmartLink href={offer.secondary_cta.href} className={secondaryButton}>
              {offer.secondary_cta.label}
            </SmartLink>
          )}
        </div>

        {START && (
          <p className="mt-5 text-sm leading-relaxed text-gray-400">
            <TermAnswer term={START} surface="doors" />{' '}
            <a href="#terms" className={linkClass}>
              Start date and terms
            </a>
          </p>
        )}

        {offer.triggers.length > 0 && (
          <section aria-labelledby="triggers-heading" className={sectionClass}>
            <h2 id="triggers-heading" className={h2Class}>
              Is this you?
            </h2>
            <ul className="mt-6 space-y-3">
              {offer.triggers.map((t) => (
                <li key={t} className="flex gap-3 text-gray-300">
                  <Dot />
                  <span className="leading-relaxed">
                    <InlineText text={t} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {offer.process.length > 0 && (
          <section aria-labelledby="process-heading" className={sectionClass}>
            <h2 id="process-heading" className={h2Class}>
              What we check and do
            </h2>
            <ol className="mt-8 list-none space-y-8">
              {offer.process.map((p, i) => (
                <li key={p.heading} className="flex gap-5">
                  <span aria-hidden="true" className="mt-1 font-mono text-sm text-teal-500/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{p.heading}</h3>
                    <RichText text={p.body} className="mt-3 leading-relaxed text-gray-400" />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {offer.sections.length > 0 && (
          <section className={sectionClass}>
            {offer.sections.map((s) => (
              <div key={s.heading} id={s.id} className="mt-14 scroll-mt-32 first:mt-0">
                <h2 className={h2Class}>{s.heading}</h2>
                <RichText text={s.body} />
                {s.table && <DataTable table={s.table} />}
              </div>
            ))}
          </section>
        )}

        {offer.proof.length > 0 && (
          <section aria-labelledby="proof-heading" className={sectionClass}>
            <h2 id="proof-heading" className={h2Class}>
              The work behind this page
            </h2>
            <div className="mt-8 space-y-8">
              {offer.proof.map((p, i) => (
                <ProofCard key={`${p.type}-${i}`} proof={p} page={offer.slug} />
              ))}
            </div>
          </section>
        )}

        <TermsBlock />

        {(offer.included.length > 0 || offer.quoted_separately.length > 0) && (
          <section aria-labelledby="scope-heading" className={sectionClass}>
            <h2 id="scope-heading" className={h2Class}>
              What is included
            </h2>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-400">
                  Included
                </h3>
                <ul className="mt-4 space-y-2">
                  {offer.included.map((i) => (
                    <li key={i} className="flex gap-3 text-gray-300">
                      <Dot />
                      <span className="leading-relaxed">
                        <InlineText text={i} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                  Quoted separately
                </h3>
                <ul className="mt-4 space-y-2">
                  {offer.quoted_separately.map((i) => (
                    <li key={i} className="flex gap-3 text-gray-500">
                      <Dot muted />
                      <span className="leading-relaxed">
                        <InlineText text={i} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* In <details> so every answer is in the HTML. */}
        {offer.faqs.length > 0 && (
          <section aria-labelledby="faq-heading" className={sectionClass}>
            <h2 id="faq-heading" className={h2Class}>
              Questions buyers ask
            </h2>
            <div className="mt-8 space-y-3">
              {offer.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-white/5 bg-[#0a0a0a] p-6 open:border-teal-500/30"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-300 group-open:text-white [&::-webkit-details-marker]:hidden">
                    {f.q}
                  </summary>
                  <RichText text={f.a} className="mt-4 text-sm leading-relaxed text-gray-400" />
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-7">
            <h2 className="text-xl font-bold text-white">When not to hire us for this</h2>
            <RichText text={offer.when_not_to_hire} />
          </div>
        </section>

        {related.length > 0 && (
          <nav aria-labelledby="related-heading" className={sectionClass}>
            <h2 id="related-heading" className="text-xl font-bold text-white">
              Related services
            </h2>
            <ul className="mt-6 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/solutions/${r.slug}`} className={linkClass}>
                    {solutionLabel(r)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* The price and the one call to action. Titles and prices only: each
            step's own description lives on /pricing. */}
        <section aria-labelledby="price-heading" className={`mt-16 ${cardClass} md:p-8`}>
          <h2 id="price-heading" className="text-2xl font-bold text-white">
            What it costs
          </h2>
          {steps.length > 0 && (
            <dl className="mt-6 divide-y divide-white/5 border-y border-white/10">
              {steps.map((s) => (
                <div key={s.id} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <dt className="font-semibold text-white">{s.title}</dt>
                  <dd className="font-semibold text-teal-400">
                    <InlineText text={offer.price_notes?.[s.id] ?? s.price} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-5 leading-relaxed text-gray-400">
            {call?.body} Every step and its price is on the{' '}
            <Link href="/pricing" className={linkClass}>
              pricing page
            </Link>
            .
          </p>
          <Link href={bookHref} className={`mt-7 ${primaryButton}`}>
            Book a free 30-minute call
          </Link>
        </section>
      </div>
    </main>
  );
}
