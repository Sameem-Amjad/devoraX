'use client';

/* Every Framer Motion animation on the site honours the visitor's "reduce
 * motion" setting: transform and layout animations are skipped, while opacity
 * fades still run so nothing that starts hidden stays hidden. The canvas
 * effects (RippleEffect, FloatingBubbles) check the same media query
 * themselves. WCAG 2.2 asks for this, and the hero is heavily animated. */

import { MotionConfig } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
