import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CATALOGUE, type CatalogueCategory } from "@/data/catalogue";
import { questionsAnchor, resolveRef, serviceAnchor, type ResolvedRef } from "@/lib/catalogue";
import { TabSet } from "@/components/ui/tabSet";
import { SectionHeading } from "./sectionHeading";

/**
 * "What we build": the ten kinds of work behind the four services, as ten
 * tabs (data/catalogue.ts, owner's brief of 11 Nov 2026).
 *
 * It sits after "Where is your app stuck?", so the first project links on the
 * homepage are still the work grid's, in the index allowlist's order. Each
 * tab holds the category's description, its three key points, its
 * sub-services, three to six of its strongest projects with their labels, and
 * a link to its questions on /services. No prices and no new pages: the
 * catalogue is not a set of offers, and a category that matches a service
 * sends the reader there.
 *
 * A server component. The tab buttons are the only client code
 * (components/ui/tabSet.tsx), and every panel is in the server HTML.
 */
const linkClass =
  "font-medium text-paper underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent";

function RefLine({ r }: { r: ResolvedRef }) {
  return (
    <>
      <Link
        href={r.href}
        className={linkClass}
        {...(r.external ? { target: "_blank", rel: "noopener" } : {})}
      >
        {r.text}
      </Link>
      <span className="ml-2 inline-block rounded-md border border-rule px-1.5 py-0.5 align-middle font-mono text-[0.6rem] uppercase tracking-[0.08em] text-paper-faint">
        {r.label}
      </span>
      {r.note && <span className="mt-1 block text-sm text-paper-faint">{r.note}</span>}
    </>
  );
}

function CategoryPanel({ category }: { category: CatalogueCategory }) {
  const featured = category.featured.map(resolveRef);
  const startHere = category.start_here.map(serviceAnchor);

  return (
    <div className="rounded-2xl border border-rule bg-ink-raised p-6 md:p-8">
      <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-paper md:text-3xl">{category.name}</h3>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-paper-dim">{category.description}</p>

      {startHere.length > 0 && (
        <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">Start here</span>
          {startHere.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group inline-flex items-center gap-1.5 font-semibold text-paper transition-colors hover:text-accent"
            >
              {s.text}
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </p>
      )}

      <ul className="mt-8 grid list-none gap-3 md:grid-cols-3">
        {category.key_points.map((k) => (
          <li key={k.heading} className="rounded-xl border border-rule bg-white/[0.02] p-5">
            <h4 className="font-display text-base font-semibold text-paper">{k.heading}</h4>
            <p className="mt-2 text-sm leading-relaxed text-paper-dim">{k.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-paper-faint">What it covers</h4>
          <ul className="mt-4 list-none divide-y divide-rule border-y border-rule">
            {category.sub_services.map((s) => (
              <li key={s.name} className="py-3">
                <span className="block text-[0.95rem] font-medium text-paper">{s.name}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-paper-dim">{s.line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-paper-faint">Work that shows it</h4>
          <ul className="mt-4 list-none space-y-4">
            {featured.map((r) => (
              <li key={`${r.href}-${r.text}`} className="leading-snug">
                <RefLine r={r} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-10 border-t border-rule pt-5">
        <Link
          href={`/services#${questionsAnchor(category)}`}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-paper transition-colors hover:text-accent"
        >
          Questions about {category.name}, answered
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </p>
    </div>
  );
}

export const CatalogueSection = () => {
  return (
    <section
      id="what-we-build"
      aria-labelledby="build-heading"
      className="home-section glow-left scroll-mt-24 bg-ink py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          index="03"
          label="Catalogue"
          headingId="build-heading"
          title="What we build"
          aside={
            <Link
              href="/services#what-we-build"
              className="group inline-flex items-center gap-2 rounded-full border border-rule-strong px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
            >
              The full catalogue
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          }
        >
          <p>
            Ten kinds of work sit behind those four services. Each tab shows what the work covers
            and the projects that show it, labelled with who they were built for.
          </p>
        </SectionHeading>

        <TabSet
          label="What we build, by kind of work"
          layout="side"
          tabs={CATALOGUE.map((c) => ({ id: `build-${c.id}`, label: c.name }))}
        >
          {CATALOGUE.map((c) => (
            <CategoryPanel key={c.id} category={c} />
          ))}
        </TabSet>
      </div>
    </section>
  );
};
