"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Play } from "lucide-react";
import type { HomeProject } from "@/lib/homeProjects";

/**
 * One project on the homepage: a large cover, what the product is, the one
 * fact about it a reader can check today, and the places to check it.
 *
 * The cover is the walkthrough's poster when the project has a walkthrough,
 * otherwise the row's image, otherwise a typographic cover. The last case is
 * not hypothetical: Hear With You, the first project on the page, had no image
 * in the projects table until 10 Nov 2026, and its card rendered an empty
 * black box. The typographic cover is for the next row that arrives without
 * one.
 *
 * With a mouse, pointing at a card plays the walkthrough inside the cover,
 * muted, from 30% in: the recordings open with their poster and a title card,
 * and the product itself starts later. Touch devices and visitors who ask for
 * reduced motion get the poster; the full walkthrough, with sound and
 * captions, is on the project page.
 */

/**
 * Art direction for two covers. Both are collages whose margins carry badges
 * and figures the row's own text does not state (a Google Play badge on an app
 * that is on the App Store only, a "98% customer trust" tile). The card shows
 * the product screens at the centre of each, enlarged, which also makes them
 * legible at this size. `origin` is the point that stays put while the image
 * is scaled. Replacing a cover with a plain screenshot makes its entry here
 * unnecessary.
 */
const COVER_FOCUS: Record<number, { origin: string; scale: number }> = {
  19: { origin: "74% 15%", scale: 1.5 },
  25: { origin: "63% 24.5%", scale: 1.5 },
};

/** "https://www.dooz.com/en/cars" → "dooz.com". */
function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Live site";
  }
}

/** The first sentence of a description, for the typographic cover. */
function firstSentence(text: string): string {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

export function ProjectCard({ project }: { project: HomeProject }) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  const cover = project.video?.poster ?? project.image;
  const focus = COVER_FOCUS[project.id];
  const places = [
    project.ios && { label: "App Store", href: project.ios },
    project.android && { label: "Google Play", href: project.android },
    project.web && { label: host(project.web), href: project.web },
  ].filter((p): p is { label: string; href: string } => Boolean(p));

  const startPreview = (e: React.PointerEvent) => {
    if (!project.video || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setHovered(true);
  };
  const stopPreview = () => {
    setHovered(false);
    setPlaying(false);
  };

  return (
    <article
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
      className="group relative flex h-full flex-col rounded-2xl border border-rule bg-ink-raised p-3 transition-colors duration-300 focus-within:border-rule-strong hover:border-rule-strong"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink-high">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-cover ${focus ? "" : "transition-transform duration-700 ease-out group-hover:scale-[1.03]"}`}
            style={focus ? { transformOrigin: focus.origin, transform: `scale(${focus.scale})` } : undefined}
          />
        ) : (
          // No image on the row: what the product is, in its description's
          // first sentence, set large on the house grid. Hidden from assistive
          // technology because the same sentence is read out just below.
          <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-end p-6 md:p-9">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(45,212,191,0.22),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <span className="relative max-w-[24ch] font-display text-[clamp(1.35rem,2.5vw,2.1rem)] font-medium leading-[1.12] tracking-[-0.025em] text-paper">
              {firstSentence(project.description)}
            </span>
          </div>
        )}

        {project.video && hovered && (
          <video
            src={project.video.src}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              if (Number.isFinite(v.duration)) v.currentTime = v.duration * 0.3;
            }}
            onPlaying={() => setPlaying(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
          />
        )}

        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/80 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-paper">
          {project.category}
        </span>

        {project.video && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/80 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-paper">
            <Play aria-hidden="true" className="h-2.5 w-2.5 fill-accent text-accent" />
            Walkthrough {project.video.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-6 md:px-4">
        <h3 className="flex items-start justify-between gap-4 font-display text-2xl font-semibold tracking-[-0.02em] text-paper">
          {/* The card's one internal link. Its ::after covers the card, so the
              whole card opens the project page; the links below sit above it. */}
          <Link href={`/projects/${project.id}`} className="after:absolute after:inset-0 after:rounded-2xl after:content-['']">
            {project.title}
          </Link>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 h-5 w-5 flex-shrink-0 text-paper-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </h3>

        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-paper-dim">{project.description}</p>

        {project.result && (
          <p className="mt-4 flex gap-2.5 text-sm leading-relaxed text-paper">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            {project.result}
          </p>
        )}

        {(places.length > 0 || project.tags.length > 0) && (
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-6">
            {places.map((p) => (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-1 rounded-full border border-rule-strong px-3 py-1 text-xs font-medium text-paper-dim transition-colors hover:border-accent hover:text-accent"
              >
                {p.label}
                <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
              </a>
            ))}
            {project.tags.length > 0 && (
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-paper-faint">
                {project.tags.slice(0, 3).join(" · ")}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
