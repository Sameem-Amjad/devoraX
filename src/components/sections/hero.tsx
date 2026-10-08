"use client";
import { CircuitBackground } from "../ui/circuitBackground";
import { FloatingBubbles } from "../ui/floatingBubbles";
import { FluidBackground } from "../ui/fluidBackground";
import { WaveDivider } from "../ui/waveDivider";
import Link from "next/link";
import { motion } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";
import { POSITIONING, DOORS } from "@/data/offer";
import { Mail, ArrowRight, ChevronDown } from "lucide-react";

// Positioning (Oct 2026): one promise, two doors. The copy lives in
// src/data/offer.ts so the hero, /services and llms.txt say the same thing.
// The headline used to rotate through "Mobile Apps / AI Platforms / ...", which
// described a generic agency; it is now static, which also keeps the LCP text
// stable on first paint.
export const Hero = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden min-h-screen flex flex-col justify-center">
      <CircuitBackground />
      <FluidBackground />
      <FloatingBubbles count={12} />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal-600/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

        {/* Agency badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-teal-500/5 border border-teal-500/20 mb-10 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          <span className="text-[0.72rem] font-semibold text-teal-200 tracking-widest uppercase">
            Two-Person Product Studio · 5.0 on Fiverr
          </span>
        </motion.div>

        {/* Main headline — starts visible for LCP; only y-position animates */}
        <motion.h1
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.05] mb-6"
        >
          We finish and ship
          <br />
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r ${CONSTANTS.PRIMARY_GRADIENT} drop-shadow-[0_0_30px_rgba(45,212,191,0.35)]`}
          >
            stuck apps
          </span>
        </motion.h1>

        {/* Subheadline — starts visible, only slides up */}
        <motion.p
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-5 leading-relaxed"
        >
          <span className="text-white font-medium">{POSITIONING.promise}</span>{" "}
          {POSITIONING.audience}
        </motion.p>

        {/* Two doors: AI-built apps and marketplaces. Real links into /services. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto mb-12 text-left"
        >
          {DOORS.map((d) => (
            <Link
              key={d.id}
              href={`/services#${d.id}`}
              className="group block rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-sm hover:border-teal-500/40 hover:bg-teal-500/[0.05] transition-colors"
            >
              <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-teal-400">
                {d.label}
              </span>
              <span className="mt-1 flex items-center justify-between gap-3 text-sm font-semibold text-white">
                {d.title}
                <ArrowRight className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onOpenBooking}
            className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:shadow-[0_0_55px_rgba(45,212,191,0.65)] hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            Book a Free 30-Minute Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="mailto:business@thedevorax.tech"
            className="w-full sm:w-auto px-10 py-4 bg-transparent text-white border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:bg-white/5 hover:border-teal-500/50 group"
          >
            <Mail className="w-5 h-5 group-hover:text-teal-400 transition-colors" />
            Get in Touch
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-24 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {/* Verifiable figures only, all on the public Fiverr profile. "100+
              Projects", "15+ Expert Engineers" and "100% Client Success Rate" were
              contradicted by the portfolio, the team page and the review record;
              the later "25 Projects Delivered" and "18 Live Products" counted
              employer work and builds with no public link as DevoraX deliveries,
              and the review count disagreed with other pages. */}
          {[
            { label: "Fiverr Rating", val: "5.0" },
            { label: "Fiverr Projects", val: "50+" },
            { label: "Client Countries", val: "4" },
            { label: "Years on Fiverr", val: "4+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold mb-1 font-mono text-transparent bg-clip-text bg-gradient-to-r ${CONSTANTS.PRIMARY_GRADIENT}`}>
                {stat.val}
              </div>
              <div className="text-[0.65rem] text-gray-500 uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="swim-float flex flex-col items-center gap-1 text-gray-600 cursor-pointer">
            <span className="text-[0.6rem] uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* Wave transition into next section */}
      <WaveDivider fromColor="transparent" toColor="#020202" height={70} />
    </section>
  );
};
