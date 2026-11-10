/**
 * FAQ accordion — a server component built on native <details>/<summary>.
 *
 * This was a client accordion that rendered the open panel and nothing else:
 * `{openIdx === idx && <motion.div>…}` unmounts every closed answer, so the
 * server HTML contained 8 questions and exactly 1 answer. Meanwhile the FAQPage
 * structured data on the homepage asserts all 8 question/answer pairs — Google
 * requires that marked-up Q&A content be visible on the page, so 7 of the 8 were
 * asserting text that was not there. It also meant AI crawlers, which do not run
 * JavaScript, read one answer out of eight.
 *
 * <details> keeps every answer in the DOM, opens without JavaScript, is
 * accessible by default, and lets this whole section ship zero client JS.
 *
 * Nov 2026: restyled to the homepage's heading and tokens, with the heading
 * beside the questions on wide screens. The questions, the answers and the
 * markup that carries them did not change.
 */
import { FAQS } from '@/data/faqs';
import { InlineText } from '@/components/seo/rich-text';
import { SectionHeading } from './sectionHeading';

export const FAQSection = () => {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="home-section glow-left scroll-mt-24 bg-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-x-16 px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading index="08" label="FAQ" headingId="faq-heading" title="Questions we always get">
            <p>
              No fluff: straight answers to the things every client asks before
              kicking off a project.
            </p>
          </SectionHeading>
        </div>

        <div>
          <div className="border-t border-rule">
            {FAQS.map((faq, idx) => (
              <details
                key={faq.q}
                // First one open so the section does not read as a wall of
                // collapsed rows; the rest are in the HTML either way.
                open={idx === 0}
                className="group border-b border-rule"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-accent">
                    {faq.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-rule-strong text-paper-dim transition-all duration-300 group-open:rotate-45 group-open:border-accent group-open:text-accent"
                  >
                    {/* A plus that rotates into a cross — one glyph, no icon JS. */}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </span>
                </summary>
                {/* An answer can carry a link ([anchor](/path), lib/richText.ts);
                    the FAQPage JSON-LD gets the same words without the syntax. */}
                <p className="max-w-3xl pb-7 pr-12 leading-relaxed text-paper-dim">
                  <InlineText text={faq.a} />
                </p>
              </details>
            ))}
          </div>

          <p className="mt-10 text-sm text-paper-faint">
            Still have questions?{' '}
            <a
              href="mailto:support@thedevorax.tech"
              className="font-medium text-paper-dim underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Email us directly →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
