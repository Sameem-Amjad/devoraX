"use client";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MessageSquare } from "lucide-react";
import { FloatingBubbles } from "@/components/ui/floatingBubbles";

export const CTASection = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  return (
    <section className="py-32 bg-[#020202] relative overflow-hidden border-t border-white/5">
      {/* Swimming bubbles */}
      <FloatingBubbles count={14} />

      {/* Layered glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,_rgba(20,184,166,0.08)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Top edge line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-6 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            Ready to build?
          </span>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8">
            Let's build your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">
              next big thing.
            </span>
          </h2>

          {/* Sub-copy */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed">
            Whether you have a fully-formed spec or just an idea on a napkin — our team
            is ready to take it to production. No fluff, no delays, just results.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenBooking}
              className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black rounded-xl font-bold shadow-[0_0_40px_rgba(45,212,191,0.45)] hover:shadow-[0_0_60px_rgba(45,212,191,0.65)] transition-all flex items-center justify-center gap-2.5"
            >
              <CalendarDays className="w-5 h-5" />
              Book a Free Strategy Call
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              href="mailto:business@thedevorax.tech"
              className="group w-full sm:w-auto px-10 py-4 border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 hover:border-teal-500/40 transition-all flex items-center justify-center gap-2.5"
            >
              <MessageSquare className="w-5 h-5 group-hover:text-teal-400 transition-colors" />
              Send us a Message
            </motion.a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            {[
              "✓ Free 30-min discovery call",
              "✓ Fixed-price proposals",
              "✓ NDA on request",
              "✓ Response within 24h",
            ].map((item) => (
              <span key={item} className="font-medium">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
