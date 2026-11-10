'use client';

/* Every Framer Motion animation on the site honours the visitor's "reduce
 * motion" setting: transform and layout animations are skipped, while opacity
 * fades still run so nothing that starts hidden stays hidden. The CSS effects
 * (the hero's poster row, the scroll reveal) follow the same setting through a
 * media query in globals.css. WCAG 2.2 asks for this. */

import { MotionConfig } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
