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
    // Defer animation start to avoid blocking LCP / TTI
    const startDelay = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animId: number;

      const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      resize();
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

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", resize);
      };
    }, 300);

    return () => clearTimeout(startDelay);
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
