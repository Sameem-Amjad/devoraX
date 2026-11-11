import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BRAND_FACTS, FOUNDER_PROFILES } from "@/data/brand";
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
 * Each line under a name comes from what /team already says (TeamClient.tsx,
 * rewritten 11 Nov 2026):
 *  - Sameem's from the opening of his bio there: backend architecture. His
 *    store record stays word for word in the "Can you guarantee approval?"
 *    term (data/terms.ts), which the pricing section prints beside the launch.
 *  - Usman's from his bio there. He is named by first name only, as everywhere
 *    on the site.
 *
 * Both photographs are cropped square from the top. Usman's file carries a
 * small sparkle mark in its bottom-right corner, which the crop leaves out.
 */
const LINKEDIN = FOUNDER_PROFILES.find((p) => p.label === "LinkedIn");

const PEOPLE = [
  {
    name: "Sameem Amjad",
    role: "Founder & Lead Architect Engineer",
    photo: "/images/profile_image.jpg",
    // The file is a square portrait inside a decorative ring; enlarged about
    // the face so the ring falls outside the frame.
    photoClass: "origin-[51%_30%] scale-[1.6]",
    line: "Software engineer focused on scalable backend architecture, from the database through to the store release.",
    link: LINKEDIN ? { label: "Sameem on LinkedIn", href: LINKEDIN.url } : null,
  },
  {
    name: "Usman",
    role: "CTO",
    photo: "/images/usman_cto.jpeg",
    photoClass: "object-top",
    line: "Full-Stack AI Architect who leads architecture and DevOps across React Native, Flutter and web apps on Kubernetes and AWS.",
    link: null,
  },
];

export const FoundersSection = () => {
  return (
    <section id="about" aria-labelledby="about-heading" className="home-section glow-right scroll-mt-24 bg-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <SectionHeading index="06" label="The studio" headingId="about-heading" title="Who finishes your app" />

          <Reveal className="space-y-5 text-lg leading-relaxed text-paper-dim">
            <p>
              {CONSTANTS.AGENCY_NAME} is{" "}
              <span className="font-medium text-paper">two engineers</span>, Sameem Amjad (Founder &
              Lead Architect Engineer) and Usman (CTO), and both of us work on every sprint. The
              studio was founded in {BRAND_FACTS.founded} and takes one client sprint at a time.
              When a designer or another specialist joins a project, we name them to you before
              they start.
            </p>
            <p>
              Much of what we have shipped was built as engineers at other companies or for
              clients who hired Sameem directly: marketplaces, live leaderboards, video pipelines,
              a flight-risk check and legal-tech backends. Each project page says who the work
              was for.
            </p>
            <p>
              What usually stops a launch is{" "}
              <span className="font-medium text-paper">payments, a native mobile build or store review</span>,
              so that is where we put our closest attention. After launch, we stay on for the
              fixes and releases that follow.
            </p>
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
