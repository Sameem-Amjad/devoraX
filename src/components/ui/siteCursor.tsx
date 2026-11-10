"use client";

/* The site's cursor: a dot, a ring that lags behind it, and a trail.
 *
 * Ported from Sameem's portfolio (Sameem-Amjad-3D, src/components/fx.jsx:
 * CustomCursor and CursorTrail) with the same springs, sizes and drawing, in
 * this site's colours: the accent teal for the dot and the trail, the paper
 * tone for the ring, over this site's near-black. The portfolio's are acid
 * lime on warm black.
 *
 *  - The dot sits on the pointer; the ring follows on a spring, grows over
 *    anything clickable and tightens while the button is down.
 *  - The trail is a canvas: a jittered "lightning" line through the pointer's
 *    last positions, and diamond shards thrown off as it moves.
 *
 * Where it runs: only with a mouse or trackpad (hover: hover, pointer: fine),
 * so never on a phone, and not on /admin, where the native cursor stays.
 * Under prefers-reduced-motion nothing here mounts and the native cursor
 * stays: a cursor that lags and sheds sparks is exactly the motion that
 * setting asks to be spared. The native cursor is hidden by a class on
 * <body>, set only once this component has decided to run, so a browser
 * without JavaScript keeps its cursor.
 *
 * One change from the portfolio: the trail's loop stops when there is nothing
 * left to draw and starts again on the next movement. There it ran every
 * frame for as long as the page was open.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** What makes the ring grow: the portfolio's list, plus the FAQ's <summary> and selects. */
const INTERACTIVE = "[data-cursor], a, button, input, textarea, select, label, summary, [role='button']";

/** The trail's colours, as "r,g,b": this site's accent family. */
const GLOW = "45,212,191"; // teal-400, the accent
const CORE = "204,251,241"; // teal-100
const SHARD_WARM = "45,212,191";
const SHARD_COOL = "110,231,183"; // emerald-300

type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  rot: number;
  vr: number;
  cool: boolean;
};

function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const points: { x: number; y: number }[] = []; // recent positions: the lightning path
    const shards: Shard[] = []; // crystal particles
    let mx = -200;
    let my = -200;
    let lastX = mx;
    let lastY = my;
    let started = false;
    let raf = 0;
    /** Frames since the pointer last moved. */
    let still = 0;

    const loop = () => {
      // The path through the last sixteen positions.
      points.push({ x: mx, y: my });
      if (points.length > 16) points.shift();

      // Shards are thrown off while the pointer moves.
      const dx = mx - lastX;
      const dy = my - lastY;
      const speed = Math.hypot(dx, dy);
      still = speed > 0 ? 0 : still + 1;
      if (started && speed > 2 && shards.length < 44) {
        const count = speed > 30 ? 2 : 1;
        const dir = Math.atan2(dy, dx);
        for (let i = 0; i < count; i++) {
          const ang = dir + rand(-0.9, 0.9);
          const sp = rand(0.3, 2.4);
          shards.push({
            x: mx + rand(-4, 4),
            y: my + rand(-4, 4),
            vx: Math.cos(ang) * sp - dx * 0.02,
            vy: Math.sin(ang) * sp - dy * 0.02,
            life: 1,
            decay: rand(0.014, 0.03),
            size: rand(3, 9),
            rot: rand(0, Math.PI),
            vr: rand(-0.22, 0.22),
            cool: Math.random() < 0.5,
          });
        }
      }
      lastX = mx;
      lastY = my;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      // The lightning line. A cheap glow: a wide faint stroke under a bright
      // thin core. No shadowBlur, which costs a blur on every call.
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const t = i / points.length; // brighter near the pointer
        const jitter = (1 - t) * 6;
        const cx = (p0.x + p1.x) / 2 + rand(-jitter, jitter);
        const cy = (p0.y + p1.y) / 2 + rand(-jitter, jitter);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo(cx, cy, p1.x, p1.y);
        ctx.strokeStyle = `rgba(${GLOW},${0.05 + t * 0.12})`;
        ctx.lineWidth = (0.6 + t * 1.8) * 4;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo(cx, cy, p1.x, p1.y);
        ctx.strokeStyle = `rgba(${CORE},${0.18 + t * 0.6})`;
        ctx.lineWidth = 0.6 + t * 1.3;
        ctx.stroke();
      }

      // The shards: layered translucent diamonds (halo, body, core). The
      // additive blend gives the glow.
      for (let i = shards.length - 1; i >= 0; i--) {
        const s = shards[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;
        s.vy = s.vy * 0.97 + 0.02;
        s.rot += s.vr;
        s.life -= s.decay;
        if (s.life <= 0) {
          shards.splice(i, 1);
          continue;
        }
        const a = s.life;
        const sz = s.size * (0.35 + s.life * 0.65);
        const rgb = s.cool ? SHARD_COOL : SHARD_WARM;
        const diamond = (scale: number, width: number) => {
          ctx.beginPath();
          ctx.moveTo(0, -sz * scale);
          ctx.lineTo(sz * width, 0);
          ctx.lineTo(0, sz * scale);
          ctx.lineTo(-sz * width, 0);
          ctx.closePath();
        };
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        diamond(1.9, 1.1);
        ctx.fillStyle = `rgba(${rgb},${a * 0.12})`;
        ctx.fill();
        diamond(1, 0.58);
        ctx.fillStyle = `rgba(${rgb},${a * 0.55})`;
        ctx.fill();
        diamond(0.42, 0.24);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.5})`;
        ctx.fill();
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";

      // Nothing left to draw once the line has collapsed onto the pointer and
      // the last shard has faded: stop until the pointer moves again.
      if (shards.length === 0 && still > 18) {
        ctx.clearRect(0, 0, w, h);
        points.length = 0;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!started) {
        started = true;
        lastX = mx;
        lastY = my;
      }
      if (!raf && !document.hidden) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]" />;
}

function CursorDot() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 550, damping: 32, mass: 0.35 });
  const ry = useSpring(y, { stiffness: 550, damping: 32, mass: 0.35 });
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    document.body.classList.add("custom-cursor-on");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const interactive = (t: EventTarget | null) => t instanceof Element && t.closest(INTERACTIVE) !== null;
    const over = (e: MouseEvent) => {
      if (interactive(e.target)) setHover(true);
    };
    const out = (e: MouseEvent) => {
      if (interactive(e.target)) setHover(false);
    };
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    return () => {
      document.body.classList.remove("custom-cursor-on");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="cursor-dot"
        style={{ x, y, marginLeft: -3.5, marginTop: -3.5 }}
        animate={{ scale: down ? 0.6 : 1 }}
      />
      <motion.div
        aria-hidden="true"
        className="cursor-ring"
        style={{ x: rx, y: ry, marginLeft: -19, marginTop: -19 }}
        animate={{ scale: hover ? 1.7 : down ? 0.85 : 1, opacity: hover ? 1 : 0.55 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  );
}

/** True where the custom cursor should run: a fine pointer and motion allowed. */
function useCursorEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setEnabled(fine.matches && !calm.matches);
    // Decided after mount, in a callback: the server cannot know the device,
    // and the first render must match its HTML.
    const first = requestAnimationFrame(decide);
    fine.addEventListener("change", decide);
    calm.addEventListener("change", decide);
    return () => {
      cancelAnimationFrame(first);
      fine.removeEventListener("change", decide);
      calm.removeEventListener("change", decide);
    };
  }, []);
  return enabled;
}

export function SiteCursor() {
  const pathname = usePathname();
  const enabled = useCursorEnabled();
  if (!enabled || pathname?.startsWith("/admin")) return null;
  return (
    <>
      <CursorTrail />
      <CursorDot />
    </>
  );
}
