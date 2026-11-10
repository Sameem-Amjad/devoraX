import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { INDUSTRIES, industryHref } from "@/data/industries";
import type { NavLink } from "@/data/primaryNav";
import type { HomeProject } from "@/lib/homeProjects";
import { SectionHeading } from "./sectionHeading";
import { ProjectCard } from "./workCard";

/**
 * The work, second on the page.
 *
 * Six projects in two columns, so each cover is about twice the width it had
 * in the old three-column grid, and each card states the one thing about the
 * product a reader can check (the row's `result`) with links to check it. The
 * order is the server page's: the index allowlist first (data/projectIndex.ts),
 * so the homepage's project links reach the pages kept in the index.
 *
 * The grid used to end in a "Load more" button that revealed the rest of the
 * table on the homepage. The rest is one click away on /projects, which has
 * the industry filter; this section links to it and to each industry.
 *
 * The industries used to be a section of their own, ten cards about a screen
 * and a half tall. They are a row of links here: same destinations
 * (/projects filtered to one industry), same labels (data/industries.ts). The
 * market pages keep their row too. These are the homepage's only links to
 * them, so the row must stay.
 */
type WorkSectionProps = {
  projects: HomeProject[];
  /** The vertical market pages (data/siteNav.ts), joined on the server. */
  markets: NavLink[];
};

export const WorkSection = ({ projects, markets }: WorkSectionProps) => {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24 border-b border-rule bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          index="01"
          label="Work"
          headingId="work-heading"
          title="Work you can check"
          aside={
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-rule-strong px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
            >
              See all work
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          }
        >
          <p>
            Products our founders built or worked on, including work done as engineers at other
            companies. Each project page says who it was for, where that is recorded.
          </p>
        </SectionHeading>

        <ul className="grid list-none gap-5 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.id} delay={(i % 2) * 90}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 grid gap-8 border-t border-rule pt-10 lg:grid-cols-[14rem_1fr]">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-paper-faint">Find work by industry</h3>
          <div>
            <ul className="flex list-none flex-wrap gap-2">
              {INDUSTRIES.map((industry) => (
                <li key={industry.slug}>
                  <Link
                    href={industryHref(industry.slug)}
                    className="inline-block rounded-full border border-rule px-4 py-2 text-sm text-paper-dim transition-colors hover:border-accent hover:text-accent"
                  >
                    {industry.label}
                  </Link>
                </li>
              ))}
            </ul>

            {markets.length > 0 && (
              <p className="mt-6 text-sm leading-relaxed text-paper-faint">
                Pages for specific markets:{" "}
                {markets.map((m, i) => (
                  <React.Fragment key={m.href}>
                    {i > 0 && " · "}
                    <Link
                      href={m.href}
                      className="text-paper-dim underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {m.label}
                    </Link>
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
