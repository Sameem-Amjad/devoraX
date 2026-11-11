/**
 * "Questions we always get": four tabs, one per service, each holding that
 * service's six questions in native <details> (owner's brief, 11 Nov 2026).
 *
 * Every answer is in the server HTML. The tab buttons are the only client
 * code (components/ui/tabSet.tsx), and the panels not chosen carry `hidden`
 * rather than unmounting, so the homepage's FAQPage node (data/homeFaqs.ts)
 * still describes text that is on the page. An earlier client accordion
 * rendered one answer out of eight while the markup asserted all eight.
 *
 * The section id stays "faq": other pages and old links point at /#faq. The
 * ten general questions it used to show are on /contact and in llms.txt.
 */
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { HomeFaqGroup } from '@/data/homeFaqs';
import { InlineText } from '@/components/seo/rich-text';
import { TabSet } from '@/components/ui/tabSet';
import { SectionHeading } from './sectionHeading';

const answerLink =
  'text-paper underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent';

export const FAQSection = ({ groups }: { groups: HomeFaqGroup[] }) => {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="home-section glow-left scroll-mt-24 bg-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-x-16 px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading index="09" label="FAQ" headingId="faq-heading" title="Questions we always get">
            <p>
              Pick the service closest to your app. Each tab holds the six questions founders ask us
              about it before they book.
            </p>
          </SectionHeading>
        </div>

        <div>
          <TabSet label="Questions by service" tabs={groups.map((g) => ({ id: `faq-${g.id}`, label: g.label }))}>
            {groups.map((g) => (
              <div key={g.id}>
                <div className="border-t border-rule">
                  {g.faqs.map((faq, idx) => (
                    <details
                      key={faq.q}
                      // First one open so the panel does not read as a wall of
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
                          {/* A plus that rotates into a cross: one glyph, no icon JS. */}
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M7 1v12M1 7h12" />
                          </svg>
                        </span>
                      </summary>
                      {/* An answer can carry a link ([anchor](/path), lib/richText.ts);
                          the FAQPage JSON-LD gets the same words without the syntax. */}
                      <p className="max-w-3xl pb-7 pr-12 leading-relaxed text-paper-dim">
                        <InlineText text={faq.a} linkClassName={answerLink} />
                      </p>
                    </details>
                  ))}
                </div>
                <p className="mt-6">
                  <Link
                    href={g.href}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-paper transition-colors hover:text-accent"
                  >
                    {g.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </p>
              </div>
            ))}
          </TabSet>

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
