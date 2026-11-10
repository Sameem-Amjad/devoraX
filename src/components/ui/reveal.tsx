'use client';

/* Scroll reveal that cannot hide content.
 *
 * The children render visible: in the server HTML, for a crawler, and in a
 * browser where JavaScript never runs. After mount, an element that is still
 * below the fold is marked "pending" (hidden, 18px low) and flips to "shown"
 * when it scrolls in; an element already on screen is left alone, so nothing
 * flashes. The two states are plain CSS in globals.css, which also switches
 * the effect off under prefers-reduced-motion.
 *
 * The sections used a Framer Motion `initial={{ opacity: 0 }}` for this, which
 * put opacity:0 into the server HTML of every heading and card on the page. */

import { useEffect, useRef } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds to wait before this element's transition, for a stagger. */
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article';
};

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return undefined;

    el.dataset.reveal = 'pending';
    let done: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.reveal = 'shown';
          observer.disconnect();
          // Once it has arrived, drop the attribute: the "shown" rule sets its
          // own `transition`, which would otherwise outrank the element's own
          // hover transitions for good.
          done = setTimeout(() => delete el.dataset.reveal, 750 + delay);
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (done) clearTimeout(done);
    };
  }, [delay]);

  return (
    <Tag
      // One ref type for the four tags this can render.
      ref={ref as React.Ref<never>}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
