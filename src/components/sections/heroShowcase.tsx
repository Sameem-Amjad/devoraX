"use client";

/* The hero's centrepiece: a window that plays the walkthroughs.
 *
 * A studio that says it ships software should show software running on the
 * first screen. This is a browser window, tipped back in perspective so its
 * top edge rises into the first screen, that lies flat as the visitor scrolls
 * to it and plays a recorded walkthrough of a real build, muted. Under it sit
 * the other walkthroughs; choosing one swaps the recording.
 *
 * What it plays is the project's own walkthrough from public/videos, started
 * 30% in, because each recording opens with its poster and a title card. The
 * caption is the row's title, stack line and `result` sentence, and nothing
 * else. There are no links here on purpose: the first project links on the
 * page have to be the index allowlist's, in its order, and those are the work
 * grid's, just below (data/projectIndex.ts).
 *
 * Cost and courtesy:
 *  - The video element exists only while the window is on screen, with
 *    preload="none", so nothing is fetched for a visitor who never scrolls.
 *  - It plays by itself only with a mouse or trackpad, never under
 *    prefers-reduced-motion or the browser's data-saver. On a phone the
 *    poster shows with a play button, and the visitor decides.
 *  - The tilt is tied to scroll through Framer Motion and is skipped under
 *    reduced motion.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Check, Play } from "lucide-react";
import type { HomeReel } from "@/lib/homeProjects";

/** How long one walkthrough plays before the next takes over. */
const DWELL_MS = 11000;

/** True where video may start by itself: a fine pointer, motion allowed, no data-saver. */
function mayAutoplay(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !connection?.saveData
  );
}

export function HeroShowcase({ reels }: { reels: HomeReel[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();

  // 0 when the window's top edge enters the screen, 1 when it is a third of
  // the way down from the top: tipped back at first, flat by then.
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 0.98", "start 0.28"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const lift = useTransform(scrollYProgress, [0, 1], [0.45, 1]);

  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  /** The visitor pressed play (touch devices) or picked a walkthrough. */
  const [asked, setAsked] = useState(false);
  const [picked, setPicked] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        setOnScreen(visible);
        if (visible) setAutoplay(mayAutoplay());
        else setPlaying(false);
      },
      { threshold: 0.3 }
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = onScreen && (autoplay || asked);
  const rotating = shouldPlay && playing && !picked && reels.length > 1;

  // Move on to the next walkthrough, until the visitor picks one.
  useEffect(() => {
    if (!rotating) return undefined;
    const timer = setTimeout(() => {
      setPlaying(false);
      setActive((i) => (i + 1) % reels.length);
    }, DWELL_MS);
    return () => clearTimeout(timer);
  }, [rotating, active, reels.length]);

  if (reels.length === 0) return null;
  const reel = reels[active];

  const choose = (index: number) => {
    setPicked(true);
    setAsked(true);
    if (index !== active) {
      setPlaying(false);
      setActive(index);
    }
  };

  return (
    <div ref={wrapRef} className="relative mx-auto mt-12 max-w-5xl px-4 [perspective:1500px] md:mt-14 md:px-6">
      {/* The light the window stands in. */}
      <motion.div
        aria-hidden="true"
        style={still ? undefined : { opacity: lift }}
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[26rem] max-w-4xl rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,0.32),transparent)]"
      />

      <motion.div
        style={still ? undefined : { rotateX, scale, transformOrigin: "50% 0%" }}
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0a0c0d] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(45,212,191,0.08)]"
      >
        {/* Window chrome */}
        <div className="flex h-11 items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          </span>
          <span className="mx-auto flex min-w-0 max-w-[70%] items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-paper-dim">
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-accent ${playing ? "opacity-70 motion-safe:animate-ping" : "opacity-0"}`}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="truncate">Walkthrough · {reel.title}</span>
          </span>
          <span className="hidden font-mono text-[0.65rem] text-paper-faint sm:block">{reel.length}</span>
        </div>

        {/* The stage: the poster, and the recording over it once it plays. */}
        <div ref={stageRef} className="relative aspect-[16/10] bg-black">
          <Image
            key={reel.poster}
            src={reel.poster}
            alt={`${reel.title}: the walkthrough's opening frame`}
            fill
            sizes="(min-width: 1024px) 976px, 100vw"
            // The window's top edge is on the first screen, so the first
            // poster is fetched early; the others wait until chosen.
            loading={active === 0 ? "eager" : "lazy"}
            fetchPriority={active === 0 ? "high" : "auto"}
            className="object-cover"
          />

          {shouldPlay && (
            <video
              key={reel.src}
              src={reel.src}
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
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
            />
          )}

          {!shouldPlay && !autoplay && (
            <button
              type="button"
              onClick={() => setAsked(true)}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/25 bg-black/80 px-5 py-3 text-sm font-semibold text-paper shadow-[0_0_40px_-8px_rgba(45,212,191,0.7)]"
            >
              <Play aria-hidden="true" className="h-4 w-4 fill-accent text-accent" />
              Play the walkthrough
            </button>
          )}
        </div>

        {/* Caption: the row's own words. */}
        <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 text-left md:flex-row md:items-center md:justify-between md:gap-10 md:px-6">
          <div className="flex-shrink-0">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent">{reel.category}</p>
            <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] text-paper">{reel.title}</p>
          </div>
          {reel.result && (
            <p className="flex gap-2.5 text-sm leading-relaxed text-paper-dim md:max-w-xl">
              <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
              {reel.result}
            </p>
          )}
        </div>
      </motion.div>

      {/* The other walkthroughs. */}
      {reels.length > 1 && (
        <ul className="scrollbar-hide -mx-4 mt-5 flex list-none gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {reels.map((r, i) => {
            const current = i === active;
            return (
              <li key={r.id} className="w-36 flex-shrink-0 md:w-auto">
                <button
                  type="button"
                  aria-pressed={current}
                  aria-label={`Show the ${r.title} walkthrough`}
                  onClick={() => choose(i)}
                  className={`group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    current
                      ? "border-accent shadow-[0_0_30px_-8px_rgba(45,212,191,0.8)]"
                      : "border-white/10 opacity-60 hover:border-white/30 hover:opacity-100"
                  }`}
                >
                  <Image src={r.poster} alt="" fill sizes="190px" loading="lazy" className="object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <span className="absolute inset-x-2.5 bottom-2 truncate text-left font-mono text-[0.58rem] uppercase tracking-[0.12em] text-paper">
                    {r.title}
                  </span>
                  {current && rotating && (
                    <span
                      key={`${r.id}-${active}`}
                      className="reel-progress absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                      style={{ animationDuration: `${DWELL_MS}ms` }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
