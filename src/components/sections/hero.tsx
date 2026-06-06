"use client";
import { CircuitBackground } from "../ui/circuitBackground";
import { FloatingBubbles } from "../ui/floatingBubbles";
import { FluidBackground } from "../ui/fluidBackground";
import { WaveDivider } from "../ui/waveDivider";
import { motion, AnimatePresence } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";
import { Mail, ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const ROTATING_WORDS = ["Mobile Apps", "AI Platforms", "Cloud Systems", "Web Experiences", "SaaS Products"];

const TECH_PILLS = [
  { label: "Next.js", color: "bg-white/5 border-white/10 text-gray-300" },
  { label: "React Native", color: "bg-teal-500/10 border-teal-500/20 text-teal-300" },
  { label: "Python AI", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300" },
  { label: "AWS", color: "bg-orange-500/10 border-orange-500/20 text-orange-300" },
  { label: "Flutter", color: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
  { label: "Docker", color: "bg-sky-500/10 border-sky-500/20 text-sky-300" },
];

export const Hero = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

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
            Award-Winning Digital Agency · Est. 2019
          </span>
        </motion.div>

        {/* Main headline — starts visible for LCP; only y-position animates */}
        <motion.h1
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.05] mb-6"
        >
          We build exceptional
          <br />
          <span className="inline-flex items-center justify-center gap-3">
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${CONSTANTS.PRIMARY_GRADIENT} drop-shadow-[0_0_30px_rgba(45,212,191,0.35)]`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.4 }}
                  className="inline-block"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </motion.h1>

        {/* Subheadline — starts visible, only slides up */}
        <motion.p
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-5 leading-relaxed"
        >
          {CONSTANTS.AGENCY_NAME} is a full-service technology agency. We fuse{" "}
          <span className="text-teal-400 font-medium">AI innovation</span> with scalable engineering to
          turn your boldest ideas into market-ready products.
        </motion.p>

        {/* Tech pill row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {TECH_PILLS.map((pill) => (
            <span
              key={pill.label}
              className={`px-3 py-1 rounded-full border text-xs font-medium ${pill.color} backdrop-blur-sm`}
            >
              {pill.label}
            </span>
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
            Book a Free Strategy Call
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
          {[
            { label: "Projects Shipped", val: "100+" },
            { label: "Years of Excellence", val: "5+" },
            { label: "Client Success Rate", val: "100%" },
            { label: "Expert Engineers", val: "15+" },
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
