/**
 * The terms block (data/terms.ts) and the next start date.
 *
 * NextStart is the one component that prints NEXT_START. It compares the
 * date with the moment the page renders, and the pages that show it revalidate
 * hourly, so a week that has passed is replaced by "ask on the call" within the
 * hour rather than advertised until the next deploy. /book and the terms block
 * both render it.
 *
 * TermsBlock renders the rows for one surface: the door pages use 'doors', the
 * short block before what's included; 'pricing' is the full Q&A, for
 * /pricing#terms. Server components, so every answer is in the HTML.
 *
 * TermAnswer prints one row's answer. The terms block uses it for every row,
 * and the door pages and /book use it for the start row they repeat near the
 * top, so a row prints the same words wherever it appears, short form
 * included.
 */
import {
  NEXT_START_TERM_ID,
  TERMS_DATA_UPDATED,
  nextStartLine,
  termAnswer,
  termsFor,
  type Term,
  type TermSurface,
} from '@/data/terms';
import { DateText } from './date-text';

export function NextStart() {
  return <>{nextStartLine(new Date())}</>;
}

/** One row's answer as `surface` prints it; the start row opens with the start week. */
export function TermAnswer({ term, surface }: { term: Term; surface: TermSurface }) {
  return (
    <>
      {term.id === NEXT_START_TERM_ID && (
        <>
          <NextStart />{' '}
        </>
      )}
      {termAnswer(term, surface)}
    </>
  );
}

export function TermsBlock({ surface = 'doors' }: { surface?: 'doors' | 'pricing' }) {
  return (
    <section
      id="terms"
      aria-labelledby="terms-heading"
      className="mt-16 scroll-mt-32 border-t border-white/5 pt-12"
    >
      <h2 id="terms-heading" className="text-2xl font-bold text-white md:text-3xl">
        Start date and terms
      </h2>
      <dl className="mt-8 divide-y divide-white/5 border-y border-white/10">
        {termsFor(surface).map((t) => (
          <div
            key={t.id}
            id={`terms-${t.id}`}
            className="grid scroll-mt-32 gap-2 py-5 sm:grid-cols-[15rem_1fr] sm:gap-8"
          >
            <dt className="font-semibold leading-relaxed text-white">{t.question}</dt>
            <dd className="leading-relaxed text-gray-400">
              <TermAnswer term={t} surface={surface} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-gray-400">
        These terms last changed <DateText iso={TERMS_DATA_UPDATED} />.
      </p>
    </section>
  );
}
