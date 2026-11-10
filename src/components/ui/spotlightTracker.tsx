"use client";

/* One pointer listener that lights whichever card the pointer is over.
 *
 * A card opts in with the class `spotlight` (globals.css): its ::before is a
 * soft radial light centred on --sx/--sy. This component sets those two
 * variables on the card under the pointer. One delegated listener for the
 * page, rather than a client component around every card, so the cards stay
 * server-rendered. Mouse and trackpad only; touch has no hover to light.
 */

import { useEffect } from "react";

export function SpotlightTracker() {
  useEffect(() => {
    let frame = 0;
    let card: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--sx", `${x - box.left}px`);
      card.style.setProperty("--sy", `${y - box.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !(e.target instanceof Element)) return;
      card = e.target.closest<HTMLElement>(".spotlight");
      if (!card) return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
