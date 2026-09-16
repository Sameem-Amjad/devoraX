import type { ServiceContent } from '@/data/serviceContent';
import { SERVICE_CONTENT_UPDATED } from '@/data/serviceContent';
import { Byline } from './byline';

/**
 * Long-form service copy, rendered as a SERVER component.
 *
 * Service pages previously carried ~28 words of body text, far below the
 * topical-coverage floor needed to rank for commercial queries. This renders the
 * structured long-form content with a real heading hierarchy (h2/h3) so both
 * search crawlers and AI engines — which do not execute JavaScript — can read and
 * quote self-contained passages directly from the initial HTML.
 */
export function ServiceLongform({ content }: { content?: ServiceContent }) {
  if (!content) return null;

  const paragraphs = (body: string) =>
    body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

  return (
    <section className="mt-24 border-t border-white/5 pt-16">
      <div className="max-w-3xl">
        <Byline updated={SERVICE_CONTENT_UPDATED} kind="service overview" />
        {/* Answer-first lead: the most quotable definition sits at the top. */}
        <p className="mt-8 text-xl leading-relaxed text-gray-200">{content.hero_answer}</p>

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

        {content.deliverables?.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white md:text-3xl">What you receive</h2>
            <ul className="mt-5 space-y-3">
              {content.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-gray-300">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.faq?.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Common questions</h2>
            <dl className="mt-6 space-y-8">
              {content.faq.map((f) => (
                <div key={f.q}>
                  <dt className="text-lg font-semibold text-white">{f.q}</dt>
                  <dd className="mt-2 leading-relaxed text-gray-400">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
