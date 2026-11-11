/**
 * "What we build" on /services: the whole catalogue (data/catalogue.ts).
 *
 * Every category, every sub-service with the projects behind it, and each
 * category's six questions, with an anchor per category (/services#{id}) and
 * per question block (/services#{id}-questions), which the homepage tabs link
 * to. The questions are native <details>, so every answer is in the server
 * HTML, and the page's FAQPage node is built from the same array
 * (lib/catalogue.ts).
 *
 * Owner's brief, 11 Nov 2026: the catalogue is not a set of offers. It prints
 * no prices and links only existing pages: the project pages, the industry
 * filters on /projects, the four services and Monthly care on /pricing.
 *
 * Server components; plain <div>s, never <article>s (see services-hub-content).
 */
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATALOGUE, type CatalogueCategory } from '@/data/catalogue';
import { questionsAnchor, resolveIndustry, resolveRef, serviceAnchor, type ResolvedRef } from '@/lib/catalogue';
import { InlineText, RichText } from './rich-text';

const textLink = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

function Ref({ r }: { r: ResolvedRef }) {
  return (
    <>
      <Link href={r.href} className={textLink} {...(r.external ? { target: '_blank', rel: 'noopener' } : {})}>
        {r.text}
      </Link>{' '}
      <span className="text-gray-500">({r.label}{r.note ? `; ${r.note}` : ''})</span>
    </>
  );
}

function Category({ c, n }: { c: CatalogueCategory; n: number }) {
  const startHere = c.start_here.map(serviceAnchor);
  return (
    <div id={c.id} className="scroll-mt-32 border-t border-white/5 pt-14">
      <p className="font-mono text-xs text-teal-500/70">{String(n).padStart(2, '0')}</p>
      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{c.name}</h3>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-300">{c.description}</p>
      <RichText text={c.intro} className="mt-4 max-w-3xl leading-relaxed text-gray-400" linkClassName={textLink} />

      {startHere.length > 0 && (
        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">Start here</span>
          {startHere.map((s) => (
            <Link key={s.href} href={s.href} className="inline-flex items-center gap-1.5 font-semibold text-teal-400 underline underline-offset-4 hover:text-teal-300">
              {s.text}
              <ArrowRight aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
            </Link>
          ))}
        </p>
      )}

      <ul className="mt-8 grid list-none gap-4 md:grid-cols-3">
        {c.key_points.map((k) => (
          <li key={k.heading} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
            <h4 className="font-bold text-white">{k.heading}</h4>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">{k.body}</p>
          </li>
        ))}
      </ul>

      <h4 className="mt-12 text-sm font-semibold uppercase tracking-widest text-gray-500">What it covers</h4>
      <dl className="mt-4 divide-y divide-white/5 border-y border-white/10">
        {c.sub_services.map((s) => {
          const refs = s.refs.map(resolveRef);
          return (
            <div key={s.name} className="grid gap-2 py-5 md:grid-cols-[18rem_1fr] md:gap-8">
              <dt className="font-semibold text-white">{s.name}</dt>
              <dd className="text-gray-400">
                <p className="leading-relaxed">{s.line}</p>
                {refs.length > 0 ? (
                  <ul className="mt-3 list-none space-y-1.5 text-sm leading-relaxed">
                    {refs.map((r) => (
                      <li key={`${r.href}-${r.text}-${r.note ?? ''}`}>
                        <Ref r={r} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">No project to show for this yet.</p>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      {c.industries && c.industries.length > 0 && (
        <>
          <h4 className="mt-12 text-sm font-semibold uppercase tracking-widest text-gray-500">By industry</h4>
          <dl className="mt-4 divide-y divide-white/5 border-y border-white/10">
            {c.industries.map((i) => {
              const industry = resolveIndustry(i.slug, i.projects);
              return (
                <div key={i.slug} className="grid gap-2 py-5 md:grid-cols-[18rem_1fr] md:gap-8">
                  <dt>
                    <Link href={industry.href} className={`font-semibold ${textLink}`}>
                      {industry.label}
                    </Link>
                  </dt>
                  <dd>
                    <ul className="list-none space-y-1.5 text-sm leading-relaxed text-gray-400">
                      {industry.refs.map((r) => (
                        <li key={r.href}>
                          <Ref r={r} />
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              );
            })}
          </dl>
        </>
      )}

      <h4 id={questionsAnchor(c)} className="mt-12 scroll-mt-32 text-xl font-bold text-white">
        Questions about {c.name}
      </h4>
      <div className="mt-6 space-y-3">
        {c.faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border border-white/5 bg-[#0a0a0a] p-6 open:border-teal-500/30">
            <summary className="cursor-pointer list-none font-semibold text-gray-300 group-open:text-white [&::-webkit-details-marker]:hidden">
              {f.q}
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              <InlineText text={f.a} linkClassName={textLink} />
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CatalogueFull() {
  return (
    <section id="what-we-build" aria-labelledby="catalogue-heading" className="scroll-mt-24 border-b border-white/5 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 id="catalogue-heading" className="text-3xl font-bold text-white md:text-4xl">
          What we build
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-gray-400">
          Every kind of work behind the four services above, with the projects that show it and the
          questions founders ask about it. None of it is a separate offer: each starts with the free
          30-minute call, and each project page says who the work was for.
        </p>

        <nav aria-label="Kinds of work" className="mt-8">
          <ol className="grid list-none gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {CATALOGUE.map((c, i) => (
              <li key={c.id} className="flex gap-3">
                <span aria-hidden="true" className="font-mono text-sm text-teal-500/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <a href={`#${c.id}`} className="text-gray-300 underline underline-offset-4 hover:text-teal-400">
                  {c.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 space-y-14">
          {CATALOGUE.map((c, i) => (
            <Category key={c.id} c={c} n={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
