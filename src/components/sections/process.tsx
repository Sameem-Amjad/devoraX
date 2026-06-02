"use client";
import { motion } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  teal:   { border: "border-teal-500/40",   bg: "bg-teal-500/10",   text: "text-teal-400",   glow: "shadow-[0_0_20px_rgba(20,184,166,0.3)]" },
  cyan:   { border: "border-cyan-500/40",   bg: "bg-cyan-500/10",   text: "text-cyan-400",   glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]" },
  emerald:{ border: "border-emerald-500/40",bg: "bg-emerald-500/10",text: "text-emerald-400",glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]" },
  blue:   { border: "border-blue-500/40",   bg: "bg-blue-500/10",   text: "text-blue-400",   glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]" },
  violet: { border: "border-violet-500/40", bg: "bg-violet-500/10", text: "text-violet-400", glow: "shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
};

export const ProcessSection = () => {
  return (
    <section className="py-32 bg-[#030303] border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,184,166,0.04)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            Our Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            How We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Build
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A proven, transparent process from first conversation to long-term partnership.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[3.5rem] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {CONSTANTS.PROCESS_STEPS.map((step, idx) => {
              const c = COLOR_MAP[step.color] ?? COLOR_MAP.teal;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Number circle */}
                  <div
                    className={`relative w-16 h-16 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-6 transition-all duration-300 group-hover:${c.glow} group-hover:scale-110`}
                  >
                    <span className="text-2xl">{step.icon}</span>
                    <span
                      className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-black border ${c.border} flex items-center justify-center text-[0.6rem] font-bold font-mono ${c.text}`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold text-white mb-3 group-hover:${c.text} transition-colors`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow connector (mobile/tablet) */}
                  {idx < CONSTANTS.PROCESS_STEPS.length - 1 && (
                    <div className="lg:hidden mt-6 text-gray-700 text-xl">↓</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-600 text-sm">
            Average time from kickoff to first production deploy:{" "}
            <span className="text-teal-400 font-semibold">4–6 weeks</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
