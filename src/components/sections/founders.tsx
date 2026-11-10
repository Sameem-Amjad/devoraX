import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BRAND_FACTS, FOUNDER_PROFILES } from "@/data/brand";
import { TERMS } from "@/data/terms";
import CONSTANTS from "@/utils/constants/constants";
import { SectionHeading } from "./sectionHeading";

/**
 * Who does the work: the two people, with their photographs.
 *
 * The About block here showed a stock photo of a code editor with an invented
 * `class FutureBuilder` snippet over it, and four cards repeating the Fiverr
 * figures. A two-person studio's strongest fact is the two people, so they are
 * the picture now. The three paragraphs are the About block's, unchanged.
 *
 * Each line under a name is already published elsewhere on the site:
 *  - Sameem's is the sentence about his store record in the "Can you guarantee
 *    approval?" term (data/terms.ts), read from that file.
 *  - Usman's is the first sentence of his bio on /team (TeamClient.tsx). He is
 *    named by first name only, as everywhere on the site.
 *
 * Both photographs are cropped square from the top. Usman's file carries a
 * small sparkle mark in its bottom-right corner, which the crop leaves out.
 */
const APPROVAL = TERMS.find((t) => t.id === "approval")?.answer ?? "";
/** "Sameem has personally prepared and submitted iOS builds to App Review, …" */
const SAMEEM_RECORD = APPROVAL.slice(APPROVAL.indexOf("Sameem has"));

const LINKEDIN = FOUNDER_PROFILES.find((p) => p.label === "LinkedIn");

const PEOPLE = [
  {
    name: "Sameem Amjad",
    role: "Founder & Lead Architect Engineer",
    photo: "/images/profile_image.jpg",
    // The file is a square portrait inside a decorative ring; enlarged about
    // the face so the ring falls outside the frame.
    photoClass: "origin-[51%_30%] scale-[1.6]",
    line: SAMEEM_RECORD,
    link: LINKEDIN ? { label: "Sameem on LinkedIn", href: LINKEDIN.url } : null,
  },
  {
    name: "Usman",
    role: "CTO",
    photo: "/images/usman_cto.jpeg",
    photoClass: "object-top",
    line: "Full-Stack AI Architect with 5+ years building scalable Generative-AI systems, custom web apps and SaaS platforms.",
    link: null,
  },
];

export const FoundersSection = () => {
  return (
    <section id="about" aria-labelledby="about-heading" className="home-section glow-right scroll-mt-24 bg-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <SectionHeading index="05" label="The studio" headingId="about-heading" title="Who finishes your app" />

          <Reveal className="space-y-5 text-lg leading-relaxed text-paper-dim">
            <p>
              {CONSTANTS.AGENCY_NAME}, founded in 2022, finishes and ships apps that got
              stuck: the AI-built prototype that never went live, the Sharetribe marketplace
              that needs custom features and a real mobile app, the project a previous
              developer left half-done. We are a{" "}
              <span className="font-medium text-paper">two-person studio</span>: Sameem Amjad
              (Founder & Lead Architect Engineer) and Usman (CTO), two senior engineers who work
              on every sprint together. Sometimes a designer or another specialist joins a
              project, and we name them to you before they start.
            </p>
            <p>
              Between us we have built marketplaces, real-time leaderboards, video
              pipelines and travel and legal-tech backends, much of it as engineers at
              other companies. Each project page says who the work was for, where that is
              recorded. We care most about the parts that stop a launch:{" "}
              <span className="font-medium text-paper">payments, native mobile builds and store review</span>.
            </p>
            <p>Then we stay on for the fixes and releases that follow.</p>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6 font-mono text-xs uppercase tracking-[0.14em] text-paper-faint">
            <span>Founded {BRAND_FACTS.founded}</span>
            <span>Pakistan · UTC+5</span>
            <span>One client sprint at a time</span>
          </Reveal>
        </div>

        <div>
          <ul className="grid list-none gap-5 sm:grid-cols-2">
            {PEOPLE.map((person, i) => (
              <Reveal
                as="li"
                key={person.name}
                delay={i * 110}
                className="spotlight flex flex-col rounded-2xl border border-rule bg-ink-raised p-3"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-ink-high">
                  <Image
                    src={person.photo}
                    alt={`${person.name}, ${person.role} at DevoraX`}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                    className={`object-cover ${person.photoClass}`}
                  />
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-paper">{person.name}</h3>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent">{person.role}</p>
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">{person.line}</p>
                  {person.link && (
                    <a
                      href={person.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-paper-dim transition-colors hover:text-accent"
                    >
                      {person.link.label}
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-6">
            <Link
              href="/team"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-paper transition-colors hover:text-accent"
            >
              Meet the team
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
