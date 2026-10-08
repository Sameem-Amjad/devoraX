"use client";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Every figure here is checkable against a public profile or a store listing.
 * That is the point.
 *
 * Earlier sets were not. "98% Client Satisfaction" described surveys that do not
 * exist, "15+ Senior Engineers" contradicted the team page, and later "Projects
 * Delivered" and "Live Products" counted work Sameem did as an employee of other
 * companies, and builds with no public link, as DevoraX deliveries. The review
 * and client counts disagreed with each other across the site. Numbers a visitor
 * can disprove in one click cost more trust than they buy.
 *
 * The server passes the real values (see src/data/siteStats.ts); these literals
 * are only a fallback.
 */
type Stat = { value: number; suffix: string; label: string; sub: string; decimals?: number };

const STATS: Stat[] = [
  { value: 5,  decimals: 1, suffix: "",  label: "Fiverr Rating",        sub: "Public profile, linked below" },
  { value: 50, suffix: "+", label: "Fiverr Projects",      sub: "Since January 2022" },
  { value: 4,  suffix: "",  label: "Client Countries",     sub: "US, UK, Canada, Hong Kong" },
  { value: 4,  suffix: "+", label: "Years of Client Work", sub: "On Fiverr since 2022" },
  { value: 2,  suffix: "",  label: "Senior Engineers",     sub: "Specialists added when needed" },
];

function CountUp({ to, suffix, decimals = 0 }: { to: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = `${v.toFixed(decimals)}${suffix}`;
      },
    });
    return controls.stop;
  }, [inView, to, suffix, decimals, count]);

  // Server-render the REAL value, not "0". AI crawlers and non-JS fetchers never
  // run the count-up effect, so this component previously published six zeros —
  // "0+ Products Shipped", "0% Client Satisfaction" — as the site's only
  // machine-readable business facts. The animation still runs from 0 on the
  // client because `count` starts at 0; only the SSR/first-paint text changes.
  return (
    <span ref={ref} className="tabular-nums">
      {`${to.toFixed(decimals)}${suffix}`}
    </span>
  );
}

export const StatsCounterSection = ({ stats }: { stats?: Stat[] }) => {
  // Server-computed figures win; the literals below are only a fallback so the
  // section still renders if the prop is ever missing.
  const rows = stats && stats.length ? stats : STATS;
  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,184,166,0.05)_0%,_transparent_65%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-teal-500/25 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            By the numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
            Numbers you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              can check
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {rows.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="flex flex-col items-center text-center p-8 bg-[#080808] hover:bg-[#0e0e0e] transition-colors group"
            >
              <div className="text-4xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mb-2 group-hover:drop-shadow-[0_0_12px_rgba(45,212,191,0.5)] transition-all">
                <CountUp to={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-[0.65rem] text-gray-600 uppercase tracking-wider">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
