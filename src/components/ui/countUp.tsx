"use client";

/* A figure that counts up when it scrolls into view.
 *
 * The server HTML, and so every crawler and any browser without JavaScript,
 * carries the real value: the count-up only rewrites the text for the second
 * and a half it runs, and ends on the same value. An earlier counter on this
 * site rendered "0" on the server and published "0+ Fiverr projects" to every
 * AI crawler. Skipped under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";

const DURATION_MS = 1500;

export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    const final = value.toFixed(decimals);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const eased = 1 - (1 - t) ** 3;
          el.textContent = t < 1 ? (value * eased).toFixed(decimals) : final;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      el.textContent = final;
    };
  }, [value, decimals]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}
