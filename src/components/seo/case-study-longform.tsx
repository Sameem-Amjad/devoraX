import type { CaseStudyContent } from '@/data/caseStudyContent';
import { CASE_STUDY_CONTENT_UPDATED } from '@/data/caseStudyContent';
import { Byline } from './byline';

/** A section heading as an element id, for aria-labelledby. */
const slug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Long-form case study body, rendered as a SERVER component.
 *
 * Case studies previously carried ~70 words each. Depth matters here more than on
 * any other page type: a case study is the one asset a competitor cannot copy, and
 * it is what AI engines quote when asked who has built a given kind of system.
 * Each section is written as a self-contained passage so it survives being
 * extracted on its own.
 *
 * The root is a plain <div>: the page wraps this and the project's hero in one
 * <article>, so the h1 and the study read as a single document.
 */
export function CaseStudyLongform({ content }: { content?: CaseStudyContent }) {
  if (!content) return null;

  const paragraphs = (body: string) =>
    body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

  return (
    <div className="mt-20 border-t border-white/5 pt-14">
      <div className="max-w-3xl">
        <Byline updated={content.updated ?? CASE_STUDY_CONTENT_UPDATED} kind="case study" />
        {/* Answer-first summary — the passage most likely to be quoted. */}
        <p className="mt-8 text-xl leading-relaxed text-gray-200">{content.summary_answer}</p>

        {content.results?.length > 0 && (
          <section
            aria-labelledby="what-you-can-check"
            className="mt-10 rounded-2xl border border-teal-500/15 bg-teal-500/[0.03] p-6"
          >
            {/* Was "Measured outcomes", then "Outcomes reported by the client".
                Both carried usage, revenue and uptime figures that public data
                contradicted or nothing backed, and several of these projects
                were never DevoraX client work. The box now lists only facts a
                reader can check today: a store listing, a release month, a live
                site, a demo URL. Studies with nothing public to check omit it. */}
            <h2
              id="what-you-can-check"
              className="text-sm font-semibold uppercase tracking-widest text-teal-400"
            >
              What you can check
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
              Each item points to something public: a store listing, a live site
              or a demo build. See our{' '}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-teal-400"
              >
                terms
              </a>{' '}
              for how we present portfolio results.
            </p>
          </section>
        )}

        {content.sections.map((s) => (
          <section key={s.heading} aria-labelledby={slug(s.heading)} className="mt-12">
            <h2 id={slug(s.heading)} className="text-2xl font-bold text-white md:text-3xl">
              {s.heading}
            </h2>
            {paragraphs(s.body).map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-gray-400">
                {p}
              </p>
            ))}
          </section>
        ))}

        {content.stack_rationale?.length > 0 && (
          <section aria-labelledby="why-this-stack" className="mt-14">
            <h2 id="why-this-stack" className="text-2xl font-bold text-white md:text-3xl">
              Why this stack
            </h2>
            <ul className="mt-5 space-y-3">
              {content.stack_rationale.map((s) => (
                <li key={s} className="flex gap-3 text-gray-400">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400/60" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
