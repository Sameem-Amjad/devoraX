"use client";
import { motion } from "framer-motion";

const CLIENTS = [
  { name: "FinStart",    abbr: "FS" },
  { name: "ShopFlow",    abbr: "SF" },
  { name: "TechCorp",    abbr: "TC" },
  { name: "NovaMed",     abbr: "NM" },
  { name: "CloudVault",  abbr: "CV" },
  { name: "SwiftPay",    abbr: "SP" },
  { name: "DataSphere",  abbr: "DS" },
  { name: "AeroLogic",   abbr: "AL" },
];

const LogoCard = ({ client }: { client: { name: string; abbr: string } }) => (
  <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-teal-500/20 hover:bg-white/[0.04] transition-all duration-300 group cursor-default select-none whitespace-nowrap">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xs font-mono group-hover:scale-110 transition-transform">
      {client.abbr}
    </div>
    <span className="text-gray-500 font-semibold text-sm group-hover:text-gray-300 transition-colors">
      {client.name}
    </span>
  </div>
);

export const TrustedBySection = () => {
  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <section className="py-16 bg-[#020202] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold text-gray-600 uppercase tracking-widest"
        >
          Trusted by ambitious companies worldwide
        </motion.p>
      </div>

      {/* Single scrolling row */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-4 animate-marquee"
          style={{ width: "max-content" }}
        >
          {doubled.map((c, i) => (
            <LogoCard key={`${c.name}-${i}`} client={c} />
          ))}
        </div>
      </div>
    </section>
  );
};
