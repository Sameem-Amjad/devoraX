import type { CaseStudyContent } from '@/data/caseStudyContent';
import { CASE_STUDY_CONTENT_UPDATED } from '@/data/caseStudyContent';
import { Byline } from './byline';

/**
 * Long-form case study body, rendered as a SERVER component.
 *
 * Case studies previously carried ~70 words each. Depth matters here more than on
 * any other page type: a case study is the one asset a competitor cannot copy, and
 * it is what AI engines quote when asked who has built a given kind of system.
 * Each section is written as a self-contained passage so it survives being
 * extracted on its own.
 */
export function CaseStudyLongform({ content }: { content?: CaseStudyContent }) {
  if (!content) return null;

  const paragraphs = (body: string) =>
    body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

  return (
    <section className="mt-20 border-t border-white/5 pt-14">
      <div className="max-w-3xl">
        <Byline updated={CASE_STUDY_CONTENT_UPDATED} kind="case study" />
        {/* Answer-first summary — the passage most likely to be quoted. */}
        <p className="mt-8 text-xl leading-relaxed text-gray-200">{content.summary_answer}</p>

        {content.results?.length > 0 && (
          <div className="mt-10 rounded-2xl border border-teal-500/15 bg-teal-500/[0.03] p-6">
            {/* Was headed "Measured outcomes", which claims we measured them. We
                did not: these are figures the client reported or took from their
                own systems. The provenance belongs next to the numbers, not only
                in the terms page, because that is where a reader forms the
                impression and where an AI engine lifts the quote from. */}
            <h2 className="text-sm font-semibold uppercase tracking-widest text-teal-400">
              Outcomes reported by the client
            </h2>
            <ul className="mt-4 space-y-2">
              {content.results.map((r) => (
                <li key={r} className="flex gap-3 text-gray-200">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-teal-500/10 pt-4 text-xs leading-relaxed text-gray-500">
              These figures were reported to us by the client or taken from the
              client&apos;s own systems. We did not independently instrument or
              audit them. See our{' '}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-teal-400"
              >
                terms
              </a>{' '}
              for how we present portfolio results.
            </p>
          </div>
        )}

        {content.sections.map((s) => (
          <div key={s.heading} className="mt-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">{s.heading}</h2>
            {paragraphs(s.body).map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-gray-400">
                {p}
              </p>
            ))}
          </div>
        ))}

        {content.stack_rationale?.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Why this stack</h2>
            <ul className="mt-5 space-y-3">
              {content.stack_rationale.map((s) => (
                <li key={s} className="flex gap-3 text-gray-400">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400/60" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
