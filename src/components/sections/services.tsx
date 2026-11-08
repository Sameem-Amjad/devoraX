"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, ShoppingCart, Smartphone, Store } from "lucide-react";
import type { WayIn } from "@/data/siteNav";

// The three door pages and the marketplace hub (7 Nov 2026). This grid used to
// show eight cards: the four database services, whose /services/{id} pages now
// redirect, and four fillers ("E-Commerce Solutions", "Data & Analytics", "API &
// Integrations", "Secure-by-Default Builds") that described no page and no
// offer. The cards and their copy come from data/offer.ts through
// data/siteNav.ts, the same source as the hero, /services and the footer.
//
// Each card's link text is its page's anchor text everywhere on the site (a
// door page's nav_label) and nothing else: the label, the copy and the price
// sit outside the link. The link's ::after covers the whole card, so the card
// is still one click target.
const STYLE: Record<string, { icon: React.ReactNode; gradient: string; glow: string }> = {
  "app-store": {
    icon: <Smartphone className="w-6 h-6" aria-hidden="true" />,
    gradient: "from-teal-500 to-emerald-500",
    glow: "rgba(20,184,166,0.3)",
  },
  sharetribe: {
    icon: <Store className="w-6 h-6" aria-hidden="true" />,
    gradient: "from-cyan-500 to-blue-500",
    glow: "rgba(6,182,212,0.3)",
  },
  "vibe-code-audit": {
    icon: <ShieldCheck className="w-6 h-6" aria-hidden="true" />,
    gradient: "from-violet-500 to-purple-500",
    glow: "rgba(139,92,246,0.3)",
  },
  "new-marketplace": {
    icon: <ShoppingCart className="w-6 h-6" aria-hidden="true" />,
    gradient: "from-orange-500 to-amber-500",
    glow: "rgba(249,115,22,0.3)",
  },
};
const FALLBACK = STYLE["app-store"];

export const Services = ({ doors, marketplace }: { doors: WayIn[]; marketplace: WayIn }) => {
  const cards = [...doors, marketplace];

  return (
    <section id="services" aria-labelledby="services-heading" className="py-32 bg-black relative border-t border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-900/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            What We Do
          </span>
          <h2 id="services-heading" className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Where is your app{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              stuck?
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Three ways in for an app you already have, and fixed-price builds for a new
            marketplace. Each one starts with a free 30-minute call.
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 list-none">
          {cards.map((card, idx) => {
            const style = STYLE[card.id] ?? FALLBACK;
            return (
              <motion.li
                key={card.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className="group relative p-7 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/15 focus-within:border-teal-500/40 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Gradient top accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${style.glow.replace("0.3", "0.2")}, transparent)`, border: `1px solid ${style.glow}` }}
                >
                  {style.icon}
                </div>

                <span className="relative text-[0.65rem] font-semibold uppercase tracking-widest text-teal-400 mb-2">
                  {card.label}
                </span>
                <h3 className="text-lg font-bold text-white mb-3">
                  {/* z-10 lifts the ::after over the text below, which is
                      positioned, so a click anywhere on the card lands here. */}
                  <Link
                    href={card.href}
                    className="after:absolute after:inset-0 after:z-10 after:content-['']"
                  >
                    {card.anchor}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed relative flex-grow">
                  {card.body}
                </p>

                {card.price && (
                  <p className="relative mt-5 text-xs font-semibold text-teal-400">{card.price}</p>
                )}

                {/* Visual cue only: the link is the heading above. */}
                <div
                  aria-hidden="true"
                  className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-gray-600 group-hover:text-teal-400 transition-colors relative"
                >
                  <span>Learn more</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
