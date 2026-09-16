/**
 * Renderer for a commercial solution landing page.
 *
 * A server component, so every word and every link is in the initial HTML —
 * search crawlers and AI engines do not execute JavaScript, and this is the page
 * type most likely to be quoted when someone asks an assistant who builds X.
 *
 * The section order follows what a buyer actually asks, in the order they ask it:
 * what this is, what you get, who has already had it built, how it works, what it
 * costs, and who should not hire us. That last one is not decoration — a page
 * that cannot say who it is wrong for reads as a brochure.
 */
import Link from 'next/link';
import type { Solution } from '@/data/solutions';
import { getSolution } from '@/data/solutions';
import { CASE_STUDY_CONTENT } from '@/data/caseStudyContent';
import { Byline } from './byline';
import { SOLUTIONS_UPDATED } from '@/data/solutions';

function paragraphs(body: string) {
  return body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

export function SolutionPage({ solution }: { solution: Solution }) {
  const hub = solution.hub ? getSolution(solution.hub) : undefined;
  const related = solution.related_slugs
    .map((s) => getSolution(s))
    .filter(Boolean) as Solution[];

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <li>
              <Link href="/" className="hover:text-teal-400">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/services" className="hover:text-teal-400">Services</Link>
            </li>
            {hub && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/solutions/${hub.slug}`} className="hover:text-teal-400">
                    {hub.h1}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="text-teal-400">{solution.h1}</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
          {solution.h1}
        </h1>

        <div className="mt-8">
          <Byline updated={SOLUTIONS_UPDATED} kind="service page" />
        </div>

        {/* Answer-first: the passage most likely to be extracted and quoted. */}
        <p className="mt-8 text-xl leading-relaxed text-gray-200">{solution.hero_answer}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-7 py-3.5 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(45,212,191,0.35)]"
          >
            Book a scoping call
          </Link>
          <Link
            href="/case-study"
            className="rounded-xl border border-white/10 px-7 py-3.5 font-semibold text-gray-300 transition-colors hover:border-teal-500/40 hover:text-white"
          >
            Read the case studies
          </Link>
        </div>

        {/* ── Proof, high on the page: this is the argument ── */}
        {solution.proof.length > 0 && (
          <section className="mt-16 border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Builds that prove it
            </h2>
            <div className="mt-8 space-y-8">
              {solution.proof.map((p) => {
                const study = CASE_STUDY_CONTENT[p.project_id];
                return (
                  <article
                    key={p.project_id}
                    className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-7"
                  >
                    <h3 className="text-lg font-bold text-white">
                      <Link
                        href={`/projects/${p.project_id}`}
                        className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                      >
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-3 leading-relaxed text-gray-400">{p.one_line}</p>
                    <p className="mt-3 leading-relaxed text-gray-400">
                      <span className="text-gray-300">What it proves: </span>
                      {p.what_it_proves}
                    </p>
                    {p.figures.length > 0 && (
                      <>
                        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                          {p.figures.map((f) => (
                            <li key={f} className="font-mono text-sm text-teal-400">
                              {f}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-xs text-gray-500">
                          Reported by the client, not independently audited by DevoraX.
                        </p>
                      </>
                    )}
                    {study && (
                      <p className="mt-4 text-sm">
                        <Link
                          href={`/projects/${p.project_id}`}
                          className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
                        >
                          Read the {study.word_count.toLocaleString('en-US')}-word engineering
                          case study
                        </Link>
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Scope: what is in, what is quoted separately ── */}
        <section className="mt-16 border-t border-white/5 pt-12">
          <h2 className="text-2xl font-bold text-white md:text-3xl">What a build includes</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-400">
                In base scope
              </h3>
              <ul className="mt-4 space-y-2">
                {solution.included.map((i) => (
                  <li key={i} className="flex gap-3 text-gray-300">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    <span className="leading-relaxed">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* Naming what is NOT included is the part buyers remember, and it is
                  the difference between a fixed price and a fixed price with an
                  argument at the end of it. */}
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Scoped and quoted separately
              </h3>
              <ul className="mt-4 space-y-2">
                {solution.quoted_separately.map((i) => (
                  <li key={i} className="flex gap-3 text-gray-500">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-700" />
                    <span className="leading-relaxed">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── The long-form body ── */}
        <section className="mt-16 border-t border-white/5 pt-12">
          {solution.sections.map((s) => (
            <div key={s.heading} className="mt-12 first:mt-0">
              <h2 className="text-2xl font-bold text-white md:text-3xl">{s.heading}</h2>
              {paragraphs(s.body).map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-gray-400">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </section>

        {/* ── Disqualifier ── */}
        <section className="mt-16">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-7">
            <h2 className="text-xl font-bold text-white">When not to hire us for this</h2>
            <p className="mt-4 leading-relaxed text-gray-400">{solution.when_not_to_hire}</p>
          </div>
        </section>

        {/* ── FAQs, in <details> so every answer is in the HTML ── */}
        {solution.faqs.length > 0 && (
          <section className="mt-16 border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Questions buyers ask</h2>
            <div className="mt-8 space-y-3">
              {solution.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-white/5 bg-[#0a0a0a] p-6 open:border-teal-500/30"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-300 group-open:text-white [&::-webkit-details-marker]:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-gray-400">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── Cluster links: this is what makes it a cluster rather than a page ── */}
        {(hub || related.length > 0) && (
          <section className="mt-16 border-t border-white/5 pt-12">
            <h2 className="text-xl font-bold text-white">Related work</h2>
            <ul className="mt-6 space-y-3">
              {hub && (
                <li>
                  <Link
                    href={`/solutions/${hub.slug}`}
                    className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                  >
                    {hub.h1}
                  </Link>
                  <span className="text-gray-600"> — the broader service this sits under</span>
                </li>
              )}
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/solutions/${r.slug}`}
                    className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                  >
                    {r.h1}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/services/${solution.service_id}`}
                  className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
                >
                  Full service overview
                </Link>
              </li>
            </ul>
          </section>
        )}

        <section className="mt-16 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Start with a scoping call</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-400">
            A free 30-minute call to work out what you are building and what is actually hard
            about it. If there is a fit you get a written fixed-price proposal. If there is
            not, we will say so on the call.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-block rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-4 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(45,212,191,0.35)]"
          >
            Book a call
          </Link>
        </section>
      </div>
    </main>
  );
}
