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
 */
import { FAQS } from '@/data/faqs';

export const FAQSection = () => {
  return (
    <section
      id="faq"
      className="py-32 bg-[#030303] border-t border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(20,184,166,0.04)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Questions we{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              always get
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            No fluff — straight answers to the things every client asks before
            kicking off a project.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <details
              key={faq.q}
              // First one open so the section does not read as a wall of
              // collapsed rows; the rest are in the HTML either way.
              open={idx === 0}
              className="group rounded-xl border border-white/5 bg-[#080808] transition-colors duration-300 open:bg-[#0c0c0c] open:border-teal-500/30 hover:border-white/20"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 list-none [&::-webkit-details-marker]:hidden">
                <h3 className="font-semibold text-[0.95rem] text-gray-300 transition-colors group-open:text-white">
                  {faq.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-500 transition-all duration-300 group-open:bg-teal-500/20 group-open:text-teal-400 group-open:rotate-45"
                >
                  {/* A plus that rotates into a cross — one glyph, no icon JS. */}
                  <svg
                    width="14"
                    height="14"
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
              <p className="px-6 pb-6 text-sm text-gray-400 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-gray-600 text-sm">
            Still have questions?{' '}
            <a
              href="mailto:support@thedevorax.tech"
              className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
            >
              Email us directly →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
