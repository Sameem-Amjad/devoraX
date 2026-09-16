"use client";
import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  drift: number;
  phase: number;
}

export const FloatingBubbles = ({ count = 18 }: { count?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Cleanup handles shared by the effect and the deferred start. The cleanup
    // used to be *returned from inside the setTimeout callback*, where React
    // never sees it — so cancelAnimationFrame and removeEventListener never ran
    // and the rAF loop kept painting forever after the component unmounted. Each
    // remount started another one.
    let animId = 0;
    let onResize: (() => void) | null = null;
    let stopped = false;

    // Respect the OS setting — a permanent background animation is exactly what
    // reduced-motion is for, and skipping it also saves the paint cost.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Defer animation start to avoid blocking LCP / TTI
    const startDelay = setTimeout(() => {
      if (stopped || reduceMotion) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      resize();
      onResize = resize;
      window.addEventListener("resize", resize);

      const bubbles: Bubble[] = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * canvas.height,
        r: 3 + Math.random() * 14,
        speed: 0.3 + Math.random() * 0.7,
        opacity: 0.04 + Math.random() * 0.12,
        drift: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
      }));

      let t = 0;
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.012;

        for (const b of bubbles) {
          b.y -= b.speed;
          b.x += b.drift + Math.sin(t + b.phase) * 0.3;

          if (b.y + b.r < 0) {
            b.y = canvas.height + b.r;
            b.x = Math.random() * canvas.width;
          }

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(45,212,191,${b.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Inner highlight
          ctx.beginPath();
          ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(45,212,191,${b.opacity * 0.6})`;
          ctx.fill();
        }

        animId = requestAnimationFrame(draw);
      };

      draw();
    }, 300);

    // The real cleanup: React can actually see this one.
    return () => {
      stopped = true;
      clearTimeout(startDelay);
      if (animId) cancelAnimationFrame(animId);
      if (onResize) window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
