import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { TERMS, termAnswer } from "@/data/terms";
import { SectionHeading } from "./sectionHeading";

/**
 * Six of the published terms, in the words /pricing#terms uses.
 *
 * This section used to be "Why DevoraX": six cards such as "Less Time on
 * Setup" and "Data-Driven Decisions", claims any studio can make. What a
 * buyer can hold a studio to is its terms, and these are already written and
 * owner-confirmed (data/terms.ts), so the homepage prints them rather than
 * paraphrasing them into benefits. The text is read from that file through
 * termAnswer(), the function every other surface prints a term through, so
 * the homepage cannot drift from the pricing page.
 *
 * The audit credit and the terms tied to one step are in the pricing section
 * above, beside the step they belong to.
 *
 * A server component: the answers are in the HTML.
 */
const SHOWN = ["overrun", "defects", "ownership", "check-ins", "who-works", "store-rejection"];

export const TermsSection = () => {
  const rows = SHOWN.map((id) => TERMS.find((t) => t.id === id)).filter(
    (t): t is (typeof TERMS)[number] => Boolean(t)
  );

  return (
    <section aria-labelledby="terms-heading" className="border-b border-rule bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          index="04"
          label="Terms"
          headingId="terms-heading"
          title="What you can hold us to"
          aside={
            <Link
              href="/pricing#terms"
              className="group inline-flex items-center gap-2 rounded-full border border-rule-strong px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
            >
              Read every term
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          }
        >
          <p>The same terms as on our pricing page, in the same words.</p>
        </SectionHeading>

        <ul className="grid list-none gap-x-16 md:grid-cols-2">
          {rows.map((term, i) => (
            <Reveal as="li" key={term.id} delay={(i % 2) * 90} className="border-t border-rule py-8">
              <div className="flex gap-4">
                <span aria-hidden="true" className="mt-1.5 font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-paper">{term.question}</h3>
              </div>
              <p className="mt-3 pl-9 leading-relaxed text-paper-dim">{termAnswer(term, "doors")}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};
