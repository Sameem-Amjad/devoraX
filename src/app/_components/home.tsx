import { Hero } from "@/components/sections/hero";
import { ProofBand } from "@/components/sections/proofBand";
import { WorkSection } from "@/components/sections/work";
import { Services } from "@/components/sections/services";
import { PricingSection, type LadderStep } from "@/components/sections/pricing";
import { TermsSection } from "@/components/sections/termsSection";
import { FoundersSection } from "@/components/sections/founders";
import { ReviewsSection } from "@/components/sections/reviews";
import { StackSection } from "@/components/sections/stack";
import { FAQSection } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/ctaSection";
import { FIT, OFFER_LADDER, type OfferStepId } from "@/data/offer";
import { TERMS, nextStartLine, nextStartWeek, termText } from "@/data/terms";
import type { SiteStat } from "@/data/siteStats";
import type { WayIn } from "@/data/siteNav";
import type { NavLink } from "@/data/primaryNav";
import type { HomeProject, HomeReel } from "@/lib/homeProjects";
import { SpotlightTracker } from "@/components/ui/spotlightTracker";
import CONSTANTS from "@/utils/constants/constants";

/**
 * The homepage, in the order a buyer asks its questions: what you do, whether
 * it can be checked, the work, which offer fits, how it runs and what it
 * costs, the terms, who does it, what clients said, the stack, the questions,
 * the ask.
 *
 * A server component. It was one "use client" file that imported every
 * section, so each section's code shipped to the browser whether or not it
 * did anything there. The sections are server components now, except the
 * ones that hold state or draw (the hero's backdrop and showcase window, the
 * pricing views, a project card's walkthrough preview) and the scroll reveal.
 *
 * Sections that left the page in Nov 2026, and where their content went:
 *  - the Fiverr-record strip, the hero's stat strip, the About cards and the
 *    "Numbers you can check" counter: one band, <ProofBand />;
 *  - the technology marquee and the toolbox grid: <StackSection />, after the
 *    work;
 *  - the five-step process and the ladder cards: <PricingSection />;
 *  - "Why DevoraX": <TermsSection />, the published terms;
 *  - the industries grid: a row of links at the foot of <WorkSection />.
 * The section ids other pages or old links may point at (#work, #services,
 * #pricing, #about, #testimonials, #tools, #faq) are all still on the page.
 */
type HomeProps = {
  /** The projects the work grid shows, in order (see src/app/page.tsx). */
  featured: HomeProject[];
  /** Walkthroughs for the hero's showcase window. */
  reels: HomeReel[];
  /** The three door pages and the marketplace hub, joined on the server (data/siteNav.ts). */
  doors: WayIn[];
  marketplace: WayIn;
  /** The vertical market pages, linked under the work grid (data/siteNav.ts). */
  markets: NavLink[];
  stats: SiteStat[];
  /** When this render happened: the start week is read against it. */
  now: Date;
};

/**
 * The terms a buyer asks about at each step of the ladder, by their ids in
 * data/terms.ts. Each is printed beside its step as the question and the
 * answer, word for word.
 */
const STEP_TERMS: Record<OfferStepId, string[]> = {
  call: [],
  audit: ["start", "audit-credit"],
  sprint: ["check-ins", "overrun"],
  payments: ["payments-only"],
  launch: ["store-rejection", "approval"],
  care: ["defects"],
};

function ladderSteps(now: Date): LadderStep[] {
  return OFFER_LADDER.map((step) => ({
    id: step.id,
    title: step.title,
    body: step.body,
    price: step.price,
    notes: STEP_TERMS[step.id]
      .map((id) => TERMS.find((t) => t.id === id))
      .filter((t): t is (typeof TERMS)[number] => Boolean(t))
      .map((t) => ({ question: t.question, answer: termText(t, "pricing", now) })),
    ...(step.id === "call" ? { fit: FIT } : {}),
  }));
}

export default function Home({ featured, reels, doors, marketplace, markets, stats, now }: HomeProps) {
  return (
    <div className="min-h-screen bg-ink font-sans text-paper selection:bg-accent/30">
      {/* Header and footer are rendered site-wide from the root layout. */}
      {/* Lights the card under the pointer (.spotlight in globals.css). */}
      <SpotlightTracker />
      <main id="main-content">
        <Hero doors={doors} reels={reels} startWeek={nextStartWeek(now)} />
        <ProofBand stats={stats} />
        <WorkSection projects={featured} markets={markets} />
        <Services doors={doors} marketplace={marketplace} />
        <PricingSection steps={ladderSteps(now)} plans={CONSTANTS.PRICING_PLANS} />
        <TermsSection />
        <FoundersSection />
        <ReviewsSection />
        <StackSection />
        <FAQSection />
        <CTASection startLine={nextStartLine(now)} />
      </main>
    </div>
  );
}
