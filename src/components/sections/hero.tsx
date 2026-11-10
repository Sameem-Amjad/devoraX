import Link from "next/link";
import { ArrowDown, ArrowRight, Star } from "lucide-react";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { POSITIONING } from "@/data/offer";
import { FIVERR_PROFILE_URL } from "@/data/testimonials";
import type { WayIn } from "@/data/siteNav";
import type { HomeReel } from "@/lib/homeProjects";
import { HeroShowcase } from "./heroShowcase";

// Positioning (Oct 2026): one promise and three doors, each with its own page.
// The copy lives in src/data/offer.ts so the hero, /services and llms.txt say
// the same thing, and the doors arrive as props, joined to their pages on the
// server (data/siteNav.ts).
//
// The first screen (Nov 2026, second pass). The first rebuild of this hero put
// real work on it but stripped the atmosphere the old one had, and it landed
// flat. This one is built to be looked at:
//  - a living backdrop (components/ui/heroBackdrop.tsx): the old hero's grid,
//    glow and drifting lights, plus signals that run along the grid and a
//    light that follows the pointer;
//  - the headline rising into focus, with "stuck apps" in the moving brand
//    gradient;
//  - a window, tipped back in perspective, that lies flat on scroll and plays
//    a recorded walkthrough of a real build (./heroShowcase.tsx).
// The doors follow the window, so the window's top edge is on the first screen.
//
// This file is a server component. The h1 and the promise are plain HTML and
// animate by transform and blur only, never opacity, so they are painted from
// the first frame and the largest contentful paint is not held back.
type HeroProps = {
  doors: WayIn[];
  /** Walkthroughs for the showcase window (lib/homeProjects.ts). */
  reels: HomeReel[];
  /** "16 November 2026", or null once that week has passed (data/terms.ts). */
  startWeek: string | null;
};

// Every booking link on the homepage goes to /book?from=home, which counts the
// booking as made from this page (lib/booking/attribution.ts).
const BOOK_HREF = "/book?from=home";

export const Hero = ({ doors, reels, startWeek }: HeroProps) => {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* The week a new sprint can start is a published term, set weekly in
            data/terms.ts. Once it has passed, the line falls back to the studio
            badge rather than show a date that is no longer true. */}
        <p className="fade-up mx-auto inline-flex max-w-full items-center gap-2.5 rounded-full border border-accent/25 bg-ink-raised/80 px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper-dim shadow-[0_0_30px_-10px_rgba(45,212,191,0.6)]">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {startWeek ? `Next sprint start: week of ${startWeek}` : "Two-person product studio · 5.0 on Fiverr"}
        </p>

        <h1 className="rise-in mt-6 font-display text-[clamp(2.9rem,9.4vw,6.9rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-paper md:mt-8">
          We finish and ship{" "}
          <br />
          <span className="text-shimmer">stuck apps</span>
        </h1>

        <p
          className="rise-in mx-auto mt-6 max-w-2xl text-base leading-relaxed text-paper-dim md:mt-7 md:text-xl"
          style={{ animationDelay: "90ms" }}
        >
          <span className="text-paper">{POSITIONING.promise}</span> {POSITIONING.audience}
        </p>

        <div
          className="fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-9"
          style={{ animationDelay: "220ms" }}
        >
          <Link
            href={BOOK_HREF}
            className="btn-glow group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-accent-ink transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-auto"
          >
            Book a free 30-minute call
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#work"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-rule-strong bg-ink/40 px-8 py-4 font-semibold text-paper transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-auto"
          >
            See the work
            <ArrowDown aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>

        {/* One line of proof on the first screen; the full record is the band
            under the hero. The Fiverr record is the studio's: the profile is
            in Sameem's name and sells DevoraX's services (owner decision,
            8 Nov 2026). */}
        <p className="fade-up mt-7 text-sm leading-relaxed text-paper-faint" style={{ animationDelay: "320ms" }}>
          <Star aria-hidden="true" className="mr-1.5 inline h-3.5 w-3.5 -translate-y-px fill-accent text-accent" />
          5.0 on Fiverr across 50+ projects since January 2022.{" "}
          <a
            href={FIVERR_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-paper-dim underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Check the profile on Fiverr
          </a>
        </p>
      </div>

      {/* Transform and blur, not opacity: the window's first poster is on the
          first screen and should be painted from the first frame. */}
      <div className="rise-in relative" style={{ animationDelay: "160ms" }}>
        <HeroShowcase reels={reels} />
      </div>

      {/* The three doors, each a real link to its page. The link text is the
          page's anchor text everywhere on the site (its nav_label); the label
          above it sits outside the link, and the link's ::after covers the
          tile, so the whole tile is still the click target. */}
      <ul className="relative mx-auto mt-14 grid max-w-5xl list-none gap-3 px-6 text-left sm:grid-cols-3 md:mt-20">
        {doors.map((d) => (
          <li
            key={d.id}
            className="spotlight group relative rounded-xl border border-rule bg-ink-raised px-5 py-4 transition-colors focus-within:border-accent/60 hover:border-accent/60"
          >
            <span className="block font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper-faint">
              {d.label}
            </span>
            <span className="mt-1.5 flex items-center justify-between gap-3 text-sm font-semibold text-paper">
              <Link href={d.href} className="after:absolute after:inset-0 after:content-['']">
                {d.anchor}
              </Link>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 flex-shrink-0 text-paper-faint transition-all group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
