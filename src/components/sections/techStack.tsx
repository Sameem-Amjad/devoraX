"use client";
import { motion } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";

const ROW_1 = CONSTANTS.TECH_STACK.slice(0, 12);
const ROW_2 = CONSTANTS.TECH_STACK.slice(12);

const MarqueeRow = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden relative">
      <div
        className={`flex gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-gray-400 text-sm font-medium whitespace-nowrap hover:border-teal-500/40 hover:text-teal-300 transition-colors cursor-default"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export const TechStackSection = () => {
  return (
    <section className="py-20 bg-black border-t border-white/5 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,184,166,0.03)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold text-gray-600 uppercase tracking-widest"
        >
          Technologies we master
        </motion.p>
      </div>

      <div className="space-y-4">
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </div>
    </section>
  );
};
