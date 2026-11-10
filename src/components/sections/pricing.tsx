"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { SectionHeading } from "./sectionHeading";

/**
 * How the work runs and what it costs, in one section with two views.
 *
 * "I already have an app" is the offer ladder (data/offer.ts): six steps, each
 * with its published price, what it covers, and the terms a buyer asks about
 * at that step (data/terms.ts), word for word. "I'm starting from scratch" is
 * the three fixed-price packages for new builds.
 *
 * The homepage used to show a generic five-step process ("Discover, Architect,
 * Build, Launch, Scale") in one section, then the ladder as six small cards
 * above the three packages in another, under one heading. The process said
 * nothing the ladder doesn't say better, and the two price lists in one grid
 * read as one confusing list. The ladder is now the process.
 *
 * Everything is in the server HTML: every step's panel and both views are
 * rendered, and the ones not chosen carry `hidden`. A crawler that runs no
 * JavaScript reads all of it. Below `lg` the steps are an accordion; from `lg`
 * the same markup lays out as a list on the left and the open step's panel on
 * the right (the list items are `display: contents`, so each button and panel
 * is a cell of one grid).
 *
 * The data arrives as props, joined on the server, so this client component
 * imports no data module.
 */
export type LadderStep = {
  id: string;
  title: string;
  body: string;
  price: string;
  /** Terms that belong to this step, as the question a buyer asks and our answer. */
  notes: { question: string; answer: string }[];
  /** The free call's step shows who the work suits instead. */
  fit?: { good: readonly string[]; notFit: readonly string[] };
};

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

const BOOK_HREF = "/book?from=home";

type Mode = "existing" | "new";

const MODES: { id: Mode; label: string }[] = [
  { id: "existing", label: "I already have an app" },
  { id: "new", label: "I'm starting from scratch" },
];

export const PricingSection = ({ steps, plans }: { steps: LadderStep[]; plans: PricingPlan[] }) => {
  const [mode, setMode] = useState<Mode>("existing");
  const [active, setActive] = useState(1); // The audit: where most work starts.

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="home-section glow-right scroll-mt-24 bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          index="03"
          label="How it runs"
          headingId="pricing-heading"
          title="How it runs, and what it costs"
        >
          <p>
            No hidden fees, no surprise invoices. Have an app already? It starts with a $400
            launch-readiness audit, credited to the fix, then $1,200 per week of work.
          </p>
        </SectionHeading>

        {/* Two views of the prices. Buttons with aria-pressed rather than
            tabs: both views are ordinary page content, not an application. */}
        <div className="mb-10 flex flex-col gap-1 rounded-2xl border border-rule bg-ink-raised p-1 sm:inline-flex sm:flex-row sm:rounded-full">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors sm:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                mode === m.id ? "bg-paper text-ink" : "text-paper-dim hover:text-paper"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* ── An app you already have: the ladder ── */}
        <div hidden={mode !== "existing"}>
          <ol className="list-none border-t border-rule lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[repeat(6,auto)_1fr] lg:gap-x-6 lg:gap-y-2 lg:border-t-0">
            {steps.map((step, i) => {
              const open = i === active;
              const number = String(i + 1).padStart(2, "0");
              // The button shows the price up to its first " · "; the panel
              // repeats the whole line only where there is more of it.
              const shortPrice = step.price.split(" · ")[0];
              return (
                <li key={step.id} className="border-b border-rule lg:contents">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`ladder-${step.id}`}
                    onClick={() => setActive(i)}
                    style={{ gridRow: i + 1 }}
                    className={`flex w-full items-center gap-4 py-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:col-start-1 lg:rounded-xl lg:border lg:px-5 lg:py-4 ${
                      open
                        ? "lg:border-accent/40 lg:bg-ink-high"
                        : "lg:border-transparent lg:hover:border-rule lg:hover:bg-ink-raised"
                    }`}
                  >
                    <span className={`font-mono text-xs ${open ? "text-accent" : "text-paper-faint"}`}>{number}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-semibold tracking-[-0.01em] text-paper">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-paper-faint">{shortPrice}</span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 flex-shrink-0 text-paper-faint transition-transform lg:-rotate-90 ${open ? "rotate-180 lg:text-accent" : ""}`}
                    />
                  </button>

                  <div
                    id={`ladder-${step.id}`}
                    hidden={!open}
                    className="pb-8 lg:col-start-2 lg:row-start-1 lg:row-end-[-1] lg:rounded-2xl lg:border lg:border-rule lg:bg-ink-raised lg:p-10"
                  >
                    {/* Below `lg` the step's button, just above, already shows
                        its number and title, so the panel starts at the price. */}
                    <p className="hidden font-mono text-xs uppercase tracking-[0.18em] text-paper-faint lg:block">
                      Step {number} of {String(steps.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 hidden font-display text-4xl font-semibold tracking-[-0.03em] text-paper lg:block">
                      {step.title}
                    </h3>
                    <p
                      className={`mb-4 font-medium text-accent lg:mb-0 lg:mt-3 lg:block lg:text-lg ${
                        shortPrice === step.price ? "hidden" : ""
                      }`}
                    >
                      {step.price}
                    </p>
                    <p className="max-w-2xl leading-relaxed text-paper-dim lg:mt-6">{step.body}</p>

                    {step.fit && (
                      <div className="mt-8 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-semibold text-paper">Good fit</h4>
                          <ul className="mt-3 list-none space-y-2">
                            {step.fit.good.map((f) => (
                              <li key={f} className="flex gap-2.5 text-sm text-paper-dim">
                                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-paper">Not a fit</h4>
                          <ul className="mt-3 list-none space-y-2">
                            {step.fit.notFit.map((f) => (
                              <li key={f} className="flex gap-2.5 text-sm text-paper-faint">
                                <X aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {step.notes.length > 0 && (
                      <dl className="mt-8 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2">
                        {step.notes.map((note) => (
                          <div key={note.question}>
                            <dt className="text-sm font-semibold text-paper">{note.question}</dt>
                            <dd className="mt-2 text-sm leading-relaxed text-paper-dim">{note.answer}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-paper-faint">
              <Link
                href="/services#how-we-work"
                className="text-paper-dim underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                What each step covers, and who it is for
              </Link>
            </p>
            <Link
              href={BOOK_HREF}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition-colors hover:bg-teal-300"
            >
              Book a free 30-minute call
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ── A new build: the published packages ── */}
        <div hidden={mode !== "new"}>
          <h3 className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-paper-faint">
            Building from scratch? Fixed-price packages
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              // No "Most Popular" badge: no sales record backs a ranking of
              // the packages. The highlight stays visual.
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl border p-8 ${
                  plan.highlight ? "border-accent/40 bg-ink-high" : "border-rule bg-ink-raised"
                }`}
              >
                <h4 className="font-display text-lg font-semibold text-paper">{plan.name}</h4>
                <p className="mt-3 flex items-end gap-1.5">
                  <span className="font-display text-4xl font-semibold tracking-[-0.03em] text-paper">{plan.price}</span>
                  {plan.period && <span className="mb-1 text-sm text-paper-faint">{plan.period}</span>}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-paper-dim">{plan.description}</p>

                <ul className="mb-8 mt-6 flex-grow list-none space-y-3 border-t border-rule pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-paper-dim">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={BOOK_HREF}
                  className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-accent text-accent-ink hover:bg-teal-300"
                      : "border border-rule-strong text-paper hover:border-accent hover:text-accent"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-paper-faint">
            All plans include a free 30-min discovery call and fixed-price proposal.{" "}
            <Link
              href={BOOK_HREF}
              className="text-paper-dim underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Book yours today →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
