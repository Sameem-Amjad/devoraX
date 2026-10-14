import type { ServiceContent } from '@/data/serviceContent';
import { SERVICE_CONTENT_UPDATED } from '@/data/serviceContent';
import { Byline } from './byline';

/** A section heading as an element id, for aria-labelledby. */
const slug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Long-form service copy, rendered as a SERVER component.
 *
 * Service pages previously carried ~28 words of body text, far below the
 * topical-coverage floor needed to rank for commercial queries. This renders the
 * structured long-form content with a real heading hierarchy (h2/h3) so both
 * search crawlers and AI engines — which do not execute JavaScript — can read and
 * quote self-contained passages directly from the initial HTML.
 *
 * The root is a plain <div>: the page wraps this and the service's hero in one
 * <article>, so the h1 and the long-form read as a single document.
 */
export function ServiceLongform({ content }: { content?: ServiceContent }) {
  if (!content) return null;

  const paragraphs = (body: string) =>
    body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

  return (
    <div className="mt-24 border-t border-white/5 pt-16">
      <div className="max-w-3xl">
        <Byline updated={SERVICE_CONTENT_UPDATED} kind="service overview" />
        {/* Answer-first lead: the most quotable definition sits at the top. */}
        <p className="mt-8 text-xl leading-relaxed text-gray-200">{content.hero_answer}</p>

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

        {content.deliverables?.length > 0 && (
          <section aria-labelledby="what-you-receive" className="mt-14">
            <h2 id="what-you-receive" className="text-2xl font-bold text-white md:text-3xl">
              What you receive
            </h2>
            <ul className="mt-5 space-y-3">
              {content.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-gray-300">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {content.faq?.length > 0 && (
          <section aria-labelledby="common-questions" className="mt-14">
            <h2 id="common-questions" className="text-2xl font-bold text-white md:text-3xl">
              Common questions
            </h2>
            <dl className="mt-6 space-y-8">
              {content.faq.map((f) => (
                <div key={f.q}>
                  <dt className="text-lg font-semibold text-white">{f.q}</dt>
                  <dd className="mt-2 leading-relaxed text-gray-400">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * FAQPage node for the "Common questions" list above. That list renders every
 * entry of `content.faq`, open rather than collapsed, so building the node from
 * the same array means it can only describe questions a reader can see.
 */
export function serviceFaqNode(url: string, content?: ServiceContent) {
  if (!content?.faq?.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    isPartOf: { '@id': `${url}#webpage` },
    mainEntity: content.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
