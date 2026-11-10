import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Star } from "lucide-react";
import { POSITIONING } from "@/data/offer";
import { FIVERR_PROFILE_URL } from "@/data/testimonials";
import type { WayIn } from "@/data/siteNav";
import type { HomePoster } from "@/lib/homeProjects";

// Positioning (Oct 2026): one promise and three doors, each with its own page.
// The copy lives in src/data/offer.ts so the hero, /services and llms.txt say
// the same thing, and the doors arrive as props, joined to their pages on the
// server (data/siteNav.ts).
//
// Layout (Nov 2026): the headline, the promise and the booking link, then the
// three doors, then a moving row of walkthrough posters, so real builds are on
// the first screen instead of four screens down. The row is adapted from the
// "Animated Marquee Hero" component on 21st.dev (ravikatiyar162/hero-3), with
// its stock photos swapped for the posters of the walkthroughs in
// public/videos. It replaced a text-only hero over bubbles, fluid blobs and a
// wave: decoration that showed nothing of the work.
//
// A server component: nothing here needs the browser. The h1 is plain HTML, so
// it paints with the first byte and stays the LCP element.
//
// The posters are decoration (the same builds are linked from the work grid
// just below, in the order the index allowlist sets), so the row is hidden from
// assistive technology and carries no links.
type HeroProps = {
  doors: WayIn[];
  posters: HomePoster[];
  /** "16 November 2026", or null once that week has passed (data/terms.ts). */
  startWeek: string | null;
};

// Every booking link on the homepage goes to /book?from=home, which counts the
// booking as made from this page (lib/booking/attribution.ts).
const BOOK_HREF = "/book?from=home";

const TILT = ["-1.6deg", "1.4deg", "-0.8deg", "2deg"];

export const Hero = ({ doors, posters, startWeek }: HeroProps) => {
  // The track holds the posters twice, so the loop has no seam.
  const track = [...posters, ...posters];

  return (
    <section className="relative overflow-hidden border-b border-rule pt-28 md:pt-32">
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[min(900px,100vw)] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(45,212,191,0.14),transparent)]"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* The week a new sprint can start is a published term, set weekly in
            data/terms.ts. Once it has passed, the line falls back to the studio
            badge rather than show a date that is no longer true. */}
        <p className="mx-auto inline-flex max-w-full items-center gap-2.5 rounded-full border border-rule bg-ink-raised px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper-dim">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {startWeek ? `Next sprint start: week of ${startWeek}` : "Two-person product studio · 5.0 on Fiverr"}
        </p>

        <h1 className="mt-6 font-display text-[clamp(2.9rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-paper">
          We finish and ship{" "}
          <br />
          <span className="text-accent">stuck apps</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-paper-dim md:text-xl">
          <span className="text-paper">{POSITIONING.promise}</span> {POSITIONING.audience}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-9">
          <Link
            href={BOOK_HREF}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-ink transition-colors hover:bg-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-auto"
          >
            Book a free 30-minute call
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#work"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-rule-strong px-7 py-3.5 font-semibold text-paper transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-auto"
          >
            See the work
            <ArrowDown aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>

        {/* One line of proof on the first screen; the full record is the band
            under the posters. The Fiverr record is the studio's: the profile
            is in Sameem's name and sells DevoraX's services (owner decision,
            8 Nov 2026). */}
        <p className="mt-7 text-sm leading-relaxed text-paper-faint">
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

        {/* The three doors, each a real link to its page. The link text is the
            page's anchor text everywhere on the site (its nav_label); the label
            above it sits outside the link, and the link's ::after covers the
            tile, so the whole tile is still the click target. */}
        <ul className="mx-auto mt-10 grid max-w-4xl list-none gap-3 text-left sm:grid-cols-3">
          {doors.map((d) => (
            <li
              key={d.id}
              className="group relative rounded-xl border border-rule bg-ink-raised px-5 py-4 transition-colors focus-within:border-accent/60 hover:border-accent/60"
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
      </div>

      {posters.length > 0 && (
        <div
          aria-hidden="true"
          className="marquee-pause relative mt-8 overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:mt-10"
        >
          <div className="animate-marquee-slow flex w-max gap-4 md:gap-6">
            {track.map((poster, i) => (
              <div
                key={`${poster.src}-${i}`}
                className="relative aspect-[16/10] h-36 flex-shrink-0 overflow-hidden rounded-xl border border-rule-strong bg-ink-raised shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] md:h-56"
                style={{ transform: `rotate(${TILT[i % TILT.length]})` }}
              >
                <Image
                  src={poster.src}
                  alt=""
                  fill
                  // Declared a little under the rendered width: these are
                  // moving, decorative thumbnails, and the smaller file is the
                  // better trade on a phone.
                  sizes="(min-width: 768px) 300px, 170px"
                  loading={i < 4 ? "eager" : "lazy"}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
