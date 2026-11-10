import Link from "next/link";
import { ArrowUpRight, ShieldCheck, ShoppingCart, Smartphone, Store } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import type { WayIn } from "@/data/siteNav";
import { SectionHeading } from "./sectionHeading";

// The three door pages and the marketplace hub (7 Nov 2026). The cards and
// their copy come from data/offer.ts through data/siteNav.ts, the same source
// as the hero, /services and the footer. Nothing was added to the four: an
// earlier grid padded them to eight with services no page sells.
//
// Layout (Nov 2026): a bento grid, two wide cards and two narrow ones, adapted
// from the "Bento Grid" component on 21st.dev (kokonutd/bento-grid). It
// replaced four equal columns in which the first card's copy ran to 26 lines
// beside 9-line neighbours. Each card ends in a small diagram of what the work
// involves, drawn from the words of its own body copy and nothing else.
//
// Each card's link text is its page's anchor text everywhere on the site (a
// door page's nav_label) and nothing else: the label, the copy and the price
// sit outside the link. The link's ::after covers the whole card, so the card
// is still one click target.
type Visual =
  | { kind: "flow"; steps: string[] }
  | { kind: "verdicts" }
  | { kind: "surfaces"; parts: string[]; base: string };

const STYLE: Record<string, { icon: React.ReactNode; status: string; wide: boolean; visual: Visual }> = {
  "app-store": {
    icon: <Smartphone className="h-5 w-5" aria-hidden="true" />,
    status: "App you already have",
    wide: true,
    visual: {
      kind: "flow",
      steps: ["Native shell", "Store listing", "App Privacy details", "Data safety form", "Submission"],
    },
  },
  sharetribe: {
    icon: <Store className="h-5 w-5" aria-hidden="true" />,
    status: "App you already have",
    wide: false,
    visual: { kind: "flow", steps: ["Custom features", "Seller payouts", "iOS and Android app"] },
  },
  "vibe-code-audit": {
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    status: "App you already have",
    wide: false,
    visual: { kind: "verdicts" },
  },
  "new-marketplace": {
    icon: <ShoppingCart className="h-5 w-5" aria-hidden="true" />,
    status: "New build",
    wide: true,
    visual: {
      kind: "surfaces",
      parts: ["Buyer app or storefront", "Vendor portal", "Admin console"],
      base: "One backend",
    },
  },
};
const FALLBACK = STYLE["app-store"];

// A chip's shape and its colours are separate strings: two text-colour
// utilities on one element are settled by the stylesheet's order, not the
// class attribute's.
const chipShape = "rounded-md border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em]";
const chipPlain = `${chipShape} border-rule bg-white/[0.03] text-paper-dim`;
const chipAccent = `${chipShape} border-accent/40 bg-accent/[0.06] text-accent`;

function CardVisual({ visual, wide }: { visual: Visual; wide: boolean }) {
  if (visual.kind === "verdicts") {
    // The audit's three verdicts, in the words of the card's own copy.
    return (
      <div aria-hidden="true" className="flex flex-wrap gap-2">
        <span className={`${chipShape} border-emerald-400/40 bg-emerald-400/[0.06] text-emerald-300`}>Keep</span>
        <span className={`${chipShape} border-amber-400/40 bg-amber-400/[0.06] text-amber-300`}>Harden</span>
        <span className={`${chipShape} border-rose-400/40 bg-rose-400/[0.06] text-rose-300`}>Rebuild</span>
      </div>
    );
  }
  if (visual.kind === "surfaces") {
    return (
      <div aria-hidden="true">
        <div className="grid grid-cols-3 gap-2">
          {visual.parts.map((part) => (
            <span key={part} className={`${chipPlain} flex min-h-16 items-center justify-center text-center`}>
              {part}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {visual.parts.map((part) => (
            <span key={part} className="mx-auto h-5 w-px bg-rule-strong" />
          ))}
        </div>
        <span className={`${chipAccent} block py-3 text-center`}>{visual.base}</span>
      </div>
    );
  }
  if (wide) {
    // The steps down a rail, the last one in the accent.
    return (
      <ol aria-hidden="true" className="list-none space-y-3 border-l border-rule-strong pl-6">
        {visual.steps.map((step, i) => {
          const last = i === visual.steps.length - 1;
          return (
            <li key={step} className="relative flex items-center gap-3">
              <span
                className={`absolute -left-[1.78rem] h-2 w-2 rounded-full ${last ? "bg-accent" : "bg-paper-faint"}`}
              />
              <span className="font-mono text-[0.62rem] text-paper-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className={last ? chipAccent : chipPlain}>{step}</span>
            </li>
          );
        })}
      </ol>
    );
  }
  return (
    <div aria-hidden="true" className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {visual.steps.map((step, i) => (
        <span key={step} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-paper-faint">→</span>}
          <span className={i === visual.steps.length - 1 ? chipAccent : chipPlain}>{step}</span>
        </span>
      ))}
    </div>
  );
}

export const Services = ({ doors, marketplace }: { doors: WayIn[]; marketplace: WayIn }) => {
  const cards = [...doors, marketplace];

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="home-section glow-left scroll-mt-24 bg-ink py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="02" label="Ways in" headingId="services-heading" title="Where is your app stuck?">
          <p>
            Three ways in for an app you already have, and fixed-price builds for a new
            marketplace. Each one starts with a free 30-minute call.
          </p>
        </SectionHeading>

        <ul className="grid list-none grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card, idx) => {
            const style = STYLE[card.id] ?? FALLBACK;
            return (
              <Reveal
                as="li"
                key={card.id}
                delay={(idx % 2) * 90}
                className={`spotlight group relative flex flex-col overflow-hidden rounded-2xl border border-rule bg-ink-raised p-6 transition-all duration-300 focus-within:border-accent/50 hover:-translate-y-0.5 hover:border-rule-strong md:p-8 ${style.wide ? "md:col-span-2" : ""}`}
              >
                {/* The dotted field that fades in under the pointer. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:6px_6px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="relative flex items-center justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-rule bg-white/[0.04] text-accent">
                    {style.icon}
                  </span>
                  <span className="rounded-full border border-rule bg-white/[0.04] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper-faint">
                    {style.status}
                  </span>
                </div>

                {/* A wide card sets its copy beside its diagram; a narrow one
                    stacks them. */}
                <div
                  className={`mt-8 flex-grow ${
                    style.wide ? "md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center md:gap-12" : ""
                  }`}
                >
                  <div>
                    <span className="relative font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">
                      {card.label}
                    </span>
                    <h3 className="relative mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-paper md:text-[1.75rem]">
                      {/* z-10 lifts the ::after over the positioned text below,
                          so a click anywhere on the card lands here. */}
                      <Link href={card.href} className="after:absolute after:inset-0 after:z-10 after:content-['']">
                        {card.anchor}
                      </Link>
                    </h3>
                    <p className="relative mt-4 text-[0.95rem] leading-relaxed text-paper-dim">{card.body}</p>
                  </div>

                  <div className={`relative mt-8 ${style.wide ? "md:mt-0" : ""}`}>
                    <CardVisual visual={style.visual} wide={style.wide} />
                  </div>
                </div>

                <div className="relative mt-8 flex items-end justify-between gap-6 border-t border-rule pt-5">
                  <p className="text-sm font-medium text-paper">{card.price}</p>
                  {/* Visual cue only: the link is the heading above. */}
                  <span
                    aria-hidden="true"
                    className="flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-paper-faint transition-colors group-hover:text-accent"
                  >
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
