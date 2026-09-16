"use client";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Every figure here is checkable against something on this site or on a public
 * profile. That is the point.
 *
 * The previous set was not: "98% Client Satisfaction (based on post-project
 * surveys)" described surveys that do not exist, "40% Faster Delivery vs industry
 * average" cited a benchmark nobody ran, "70% Returning Clients" was contradicted
 * by the review record (3 of 16 clients repeat), and "15+ Senior Engineers"
 * contradicted the team page. Numbers a visitor can disprove in one click cost
 * more trust than they buy.
 */
const STATS = [
  { value: 25, suffix: "",  label: "Projects Delivered",  sub: "Each one a published case study" },
  { value: 18, suffix: "",  label: "Live Products",       sub: "Publicly reachable right now" },
  { value: 20, suffix: "",  label: "Five-Star Reviews",   sub: "Every Fiverr review, 5 of 5" },
  { value: 16, suffix: "",  label: "Clients Served",      sub: "Across 4 countries" },
  { value: 10, suffix: "",  label: "In-Depth Case Studies", sub: "1,200+ words of engineering detail" },
  { value: 3,  suffix: "",  label: "Repeat Clients",      sub: "Came back for more work" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return controls.stop;
  }, [inView, to, suffix, count]);

  // Server-render the REAL value, not "0". AI crawlers and non-JS fetchers never
  // run the count-up effect, so this component previously published six zeros —
  // "0+ Products Shipped", "0% Client Satisfaction" — as the site's only
  // machine-readable business facts. The animation still runs from 0 on the
  // client because `count` starts at 0; only the SSR/first-paint text changes.
  return (
    <span ref={ref} className="tabular-nums">
      {`${to}${suffix}`}
    </span>
  );
}

export const StatsCounterSection = ({ stats }: { stats?: typeof STATS }) => {
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
            Results that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              speak for themselves
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
                <CountUp to={stat.value} suffix={stat.suffix} />
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
