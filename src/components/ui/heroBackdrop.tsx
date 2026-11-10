"use client";

/* The hero's backdrop: lights, a grid, and signals running along the grid.
 *
 * The old hero sat on a grid with a teal glow, three drifting blobs and
 * floating bubbles; the first rebuild flattened that to a faint grid and one
 * dim gradient, and the page lost its first impression. This brings the
 * atmosphere back and gives it something to say: the grid is a circuit, and
 * the bubbles are now signals that travel its lines and turn at its nodes.
 *
 * Layers (the CSS is in globals.css):
 *  1. three slow lights (.aurora): radial gradients, moved by CSS;
 *  2. the grid;
 *  3. the grid again in the accent, shown only in a circle around the pointer;
 *  4. a canvas: signals on the grid's lines and a few rising sparks.
 *
 * Cost control: the canvas draws only while the hero is on screen and the tab
 * is visible, caps the device pixel ratio at 2, and uses fewer signals on a
 * narrow screen. Under prefers-reduced-motion it never starts, and the CSS
 * stops the lights. Without JavaScript the lights and the grid still render.
 */

import { useEffect, useRef } from "react";

/** The grid's cell, in CSS pixels. Must match background-size in globals.css. */
const CELL = 56;

type Signal = {
  x: number;
  y: number;
  /** Unit direction along one axis. */
  dx: number;
  dy: number;
  speed: number;
  /** Pixels travelled since the last node. */
  run: number;
  trail: number[];
};

type Spark = { x: number; y: number; r: number; vy: number; phase: number };

const TRAIL = 34;

export function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const host = root?.parentElement;
    if (!root || !canvas || !host) return undefined;

    // ── The pointer's light: two CSS variables, set at most once a frame. ──
    let pointerFrame = 0;
    let px = -999;
    let py = -999;
    const paintPointer = () => {
      pointerFrame = 0;
      root.style.setProperty("--mx", `${px}px`);
      root.style.setProperty("--my", `${py}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const box = root.getBoundingClientRect();
      px = e.clientX - box.left;
      py = e.clientY - box.top;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    };
    const onLeave = () => {
      px = -999;
      py = -999;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });

    const stopPointer = () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
    };

    const ctx = canvas.getContext("2d");
    if (!ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return stopPointer;

    // ── The canvas ──
    let width = 0;
    let height = 0;
    let signals: Signal[] = [];
    let sparks: Spark[] = [];

    const newSignal = (): Signal => {
      const horizontal = Math.random() < 0.5;
      const sign = Math.random() < 0.5 ? 1 : -1;
      return {
        x: Math.round((Math.random() * width) / CELL) * CELL,
        y: Math.round((Math.random() * height) / CELL) * CELL,
        dx: horizontal ? sign : 0,
        dy: horizontal ? 0 : sign,
        speed: 0.9 + Math.random() * 1.3,
        run: 0,
        trail: [],
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = root.clientWidth;
      height = root.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const narrow = width < 768;
      signals = Array.from({ length: narrow ? 8 : 22 }, newSignal);
      sparks = Array.from({ length: narrow ? 14 : 34 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.4,
        vy: 0.12 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let time = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Sparks: small points that rise and twinkle.
      for (const s of sparks) {
        s.y -= s.vy;
        if (s.y < -4) {
          s.y = height + 4;
          s.x = Math.random() * width;
        }
        const alpha = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(time * 1.4 + s.phase));
        ctx.fillStyle = `rgba(153, 246, 228, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Signals: each runs along a grid line and may turn at a node.
      ctx.lineCap = "round";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < signals.length; i++) {
        const s = signals[i];
        s.x += s.dx * s.speed;
        s.y += s.dy * s.speed;
        s.run += s.speed;
        if (s.run >= CELL) {
          // On a node: snap to it, then go straight, or turn one way or the other.
          s.run = 0;
          s.x = Math.round(s.x / CELL) * CELL;
          s.y = Math.round(s.y / CELL) * CELL;
          const roll = Math.random();
          if (roll < 0.32) {
            const turn = roll < 0.16 ? 1 : -1;
            const { dx, dy } = s;
            s.dx = dy * turn;
            s.dy = dx * turn;
          }
        }
        s.trail.push(s.x, s.y);
        if (s.trail.length > TRAIL * 2) s.trail.splice(0, 2);
        if (s.x < -CELL || s.x > width + CELL || s.y < -CELL || s.y > height + CELL) {
          signals[i] = newSignal();
          continue;
        }

        const points = s.trail.length / 2;
        for (let p = 1; p < points; p++) {
          ctx.strokeStyle = `rgba(94, 234, 212, ${(p / points) * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(s.trail[(p - 1) * 2], s.trail[(p - 1) * 2 + 1]);
          ctx.lineTo(s.trail[p * 2], s.trail[p * 2 + 1]);
          ctx.stroke();
        }
        // The head: a bright point inside a faint halo. Two fills rather than
        // a shadow blur, which is the costly way to draw a glow on a canvas.
        ctx.fillStyle = "rgba(45, 212, 191, 0.22)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(204, 251, 241, 0.95)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Run only while the hero is on screen and the tab is in front.
    let onScreen = false;
    const sync = () => {
      const shouldRun = onScreen && !document.hidden;
      if (shouldRun && !frame) frame = requestAnimationFrame(draw);
      if (!shouldRun && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stopPointer();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", resize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora aurora-a left-1/2 top-[-260px] h-[900px] w-[min(1300px,170vw)]" />
      <div className="aurora aurora-b left-[-320px] top-[160px] h-[760px] w-[760px]" />
      <div className="aurora aurora-c right-[-340px] top-[320px] h-[820px] w-[820px]" />
      {/* Dark at the edges, so the light reads as a beam on the headline. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,transparent_30%,rgba(5,6,7,0.82)_100%)]" />

      <div className="hero-grid absolute inset-0" />
      <div className="hero-grid-lit absolute inset-0" />
      <div className="hero-pointer-light absolute inset-0" />
      <canvas ref={canvasRef} className="hero-mask absolute inset-0 h-full w-full" />

      {/* The hero dissolves into the page below it. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}
