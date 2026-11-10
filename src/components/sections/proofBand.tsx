import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { FIVERR_PROFILE_URL } from "@/data/testimonials";
import type { SiteStat } from "@/data/siteStats";

/**
 * The studio's record, once.
 *
 * The same figures used to appear five times on the homepage: a strip in the
 * hero, a "client record" block straight under it, four cards in the About
 * section, a "Numbers you can check" counter near the bottom and the intro to
 * the reviews. This band is the one place that lists them, with the link to
 * check them beside it.
 *
 * Every figure comes from src/data/siteStats.ts, where each is something a
 * buyer can check today: the public Fiverr record, the team page, or a store
 * listing linked from the portfolio (that count is computed from the projects
 * table on the server). The values are plain text in the server HTML: no
 * count-up from zero, which once published "0+" to every crawler.
 */
export const ProofBand = ({ stats }: { stats: SiteStat[] }) => {
  return (
    <section aria-labelledby="proof-heading" className="border-b border-rule bg-ink">
      <Reveal className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="proof-heading" className="font-display text-2xl font-semibold tracking-[-0.02em] text-paper">
            Numbers you can check
          </h2>
          <a
            href={FIVERR_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm text-paper-dim underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Check the profile on Fiverr
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end bg-ink-raised p-6">
              <dt className="mt-3">
                <span className="block text-sm font-medium text-paper">{stat.label}</span>
                <span className="mt-1 block font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.1em] text-paper-faint">
                  {stat.sub}
                </span>
              </dt>
              <dd className="font-display text-4xl font-semibold tabular-nums tracking-[-0.03em] text-paper md:text-5xl">
                {stat.value.toFixed(stat.decimals ?? 0)}
                {stat.suffix && <span className="text-accent">{stat.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
};
