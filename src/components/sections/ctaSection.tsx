import Link from "next/link";
import { ArrowRight, Check, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * The last section: one ask, in the offer's own words.
 *
 * The headline was "Let's build your next big thing.", a line for a general
 * agency, over floating bubbles. It now asks what the free call asks
 * (data/offer.ts: "Tell us where the app is stuck…"), and the paragraph under
 * it is unchanged.
 *
 * The booking link goes to /book?from=home, the same booking page and label as
 * everywhere else on the site. The start-week sentence is the published term
 * (data/terms.ts), rendered on the server page and passed in, so it is the
 * same sentence the door pages print and falls back the same way when its
 * week has passed.
 *
 * No turnaround promise here ("Response within 24h" went in October), and
 * "Fixed-price proposals" stays out: only new builds get one.
 */
const SIGNALS = ["Free 30-min discovery call", "Prices published up front", "NDA on request"];

export const CTASection = ({ startLine }: { startLine: string }) => {
  return (
    <section aria-labelledby="cta-heading" className="home-section bg-ink py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[min(1000px,100vw)] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(45,212,191,0.12),transparent)]"
      />

      <Reveal className="relative mx-auto max-w-5xl px-6 text-center">
        <h2
          id="cta-heading"
          className="text-balance font-display text-[clamp(2.4rem,6.6vw,5rem)] font-semibold leading-[1] tracking-[-0.04em] text-paper"
        >
          Tell us where your app <span className="text-shimmer">is stuck</span>
        </h2>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-paper-dim md:text-xl">
          Whether your app is stuck before launch, stuck in App Store review or still an
          idea, start with a free 30-minute call. We will tell you what it takes to ship.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/book?from=home"
            className="btn-glow group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-accent-ink transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-auto"
          >
            Book a free 30-minute call
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="mailto:business@thedevorax.tech"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rule-strong px-8 py-4 font-semibold text-paper transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-auto"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            Send us a Message
          </a>
        </div>

        <p className="mt-8 font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-paper-faint">{startLine}</p>

        <ul className="mt-8 flex list-none flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-paper-dim">
          {SIGNALS.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
};
