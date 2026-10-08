import Link from 'next/link';
import { DOORS, FIT, OFFER_LADDER } from '@/data/offer';

/**
 * The offer, as a server component: the two doors, the ladder from free call
 * to monthly care, and who it is (and is not) for.
 *
 * Rendered on /services, directly under the header, because that is where a
 * founder comparing options lands. Server-rendered so crawlers and AI engines
 * read every step from the initial HTML. Content lives in src/data/offer.ts.
 */
export function OfferLadder() {
  return (
    <>
      {/* ── Two doors ── */}
      <section aria-labelledby="doors-heading" className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 id="doors-heading" className="text-3xl md:text-4xl font-bold text-white">
            Two ways in
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {DOORS.map((d) => (
              <article
                key={d.id}
                id={d.id}
                className="scroll-mt-32 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                  {d.label}
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">{d.title}</h3>
                <p className="mt-4 leading-relaxed text-gray-400">{d.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── The ladder ── */}
      <section
        id="how-we-work"
        aria-labelledby="ladder-heading"
        className="scroll-mt-32 py-20 border-b border-white/5 bg-[#030303]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 id="ladder-heading" className="text-3xl md:text-4xl font-bold text-white">
            How we finish and ship your app
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-gray-400">
            Every step after the call is a fixed price, quoted after the audit. Start
            at the top and stop wherever you like.
          </p>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 list-none">
            {OFFER_LADDER.map((s, i) => (
              <li
                key={s.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-7"
              >
                <span className="font-mono text-xs text-teal-500/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-400">{s.body}</p>
                <p className="mt-5 border-t border-white/5 pt-4 text-xs font-semibold text-teal-400">
                  {s.price}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-gray-500">
            Building something new from scratch? The fixed-price MVP packages on the{' '}
            <Link href="/#pricing" className="text-teal-400 underline underline-offset-4 hover:text-teal-300">
              home page
            </Link>{' '}
            cover new builds.
          </p>
        </div>
      </section>

      {/* ── Fit ── */}
      <section id="fit" aria-labelledby="fit-heading" className="scroll-mt-32 py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 id="fit-heading" className="text-3xl md:text-4xl font-bold text-white">
            Is this for you?
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.03] p-8">
              <h3 className="text-lg font-bold text-white">Good fit</h3>
              <ul className="mt-4 space-y-2">
                {FIT.good.map((f) => (
                  <li key={f} className="flex gap-3 text-gray-300">
                    <span aria-hidden="true" className="text-teal-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
              <h3 className="text-lg font-bold text-white">Not a fit</h3>
              <ul className="mt-4 space-y-2">
                {FIT.notFit.map((f) => (
                  <li key={f} className="flex gap-3 text-gray-400">
                    <span aria-hidden="true" className="text-gray-600">✕</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
