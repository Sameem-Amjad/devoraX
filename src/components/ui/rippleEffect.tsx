"use client";
import { useEffect } from "react";

export const RippleEffect = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Create up to 3 concentric ripple rings
      for (let i = 0; i < 3; i++) {
        const ripple = document.createElement("div");
        ripple.className = "water-ripple";
        ripple.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          transform: translate(-50%, -50%) scale(0);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid rgba(45,212,191,${0.5 - i * 0.13});
          pointer-events: none;
          z-index: 9999;
          animation: water-ripple ${0.7 + i * 0.25}s ease-out ${i * 0.1}s forwards;
        `;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1200 + i * 250);
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick, { passive: true });
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
    };
  }, []);

  return null;
};
