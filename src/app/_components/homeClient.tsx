"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { TrustedBySection } from "@/components/sections/trustedBy";
import { WaveDivider } from "@/components/ui/waveDivider";

// Below-fold sections: lazy-loaded to reduce initial JS bundle and TBT
const TechStackSection = dynamic(() => import("@/components/sections/techStack").then(m => ({ default: m.TechStackSection })));
const ToolsSection = dynamic(() => import("@/components/sections/toolsSection").then(m => ({ default: m.ToolsSection })));
const AboutSection = dynamic(() => import("@/components/sections/about").then(m => ({ default: m.AboutSection })));
const WorkSection = dynamic(() => import("@/components/sections/work").then(m => ({ default: m.WorkSection })));
const Services = dynamic(() => import("@/components/sections/services").then(m => ({ default: m.Services })));
const ProcessSection = dynamic(() => import("@/components/sections/process").then(m => ({ default: m.ProcessSection })));
const WhyUsSection = dynamic(() => import("@/components/sections/whyUs").then(m => ({ default: m.WhyUsSection })));
const IndustriesSection = dynamic(() => import("@/components/sections/industries").then(m => ({ default: m.IndustriesSection })));
const StatsCounterSection = dynamic(() => import("@/components/sections/statsCounter").then(m => ({ default: m.StatsCounterSection })));
const FAQSection = dynamic(() => import("@/components/sections/faq").then(m => ({ default: m.FAQSection })));
const CTASection = dynamic(() => import("@/components/sections/ctaSection").then(m => ({ default: m.CTASection })));
const BookingModal = dynamic(() => import("@/components/models/bookingModel/bookingModel"));
import { AnimatePresence, motion } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";
import { TESTIMONIALS, TESTIMONIAL_STATS, FIVERR_PROFILE_URL } from "@/data/testimonials";
import { Star, Check, ArrowRight, Quote } from "lucide-react";

export default function HomeClient({ initialProjects, initialServices }: any) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [view, setView] = useState("home");
  const [activeService, setActiveService] = useState(null);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-teal-500/30 font-sans">
      {/* Header and footer are now rendered site-wide from the root layout. */}
      <main>
        {/* ── Hero ── */}
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />

        {/* ── Trusted By ── */}
        <TrustedBySection />

        {/* ── Tech stack marquee ── */}
        <TechStackSection />

        {/* ── Tools ── */}
        <ToolsSection />

        {/* ── About ── */}
        <AboutSection />

        <WaveDivider fromColor="#030303" toColor="#020202" height={60} />

        {/* ── Work portfolio ── */}
        <WorkSection projects={initialProjects} />
        <WaveDivider fromColor="#020202" toColor="#000000" height={60} />

        {/* ── Services ── */}
        <Services
          services={initialServices}
          setView={setView}
          setActiveService={setActiveService}
        />
        <WaveDivider fromColor="#000000" toColor="#030303" height={60} />

        {/* ── How We Work ── */}
        <ProcessSection />
        <WaveDivider fromColor="#030303" toColor="#0a0a0a" height={60} />

        {/* ── Why Us ── */}
        <WhyUsSection />
        <WaveDivider fromColor="#030303" toColor="#000000" height={60} />

        {/* ── Industries ── */}
        <IndustriesSection />
        <WaveDivider fromColor="#000000" toColor="#020202" height={60} />

        {/* ── Stats Counter ── */}
        <StatsCounterSection />

        {/* ── Pricing ── */}
        <section id="pricing" className="py-32 bg-black border-t border-white/5 relative overflow-hidden">
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
                Pricing
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                Transparent{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  Investment Plans
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                No hidden fees, no surprise invoices. Fixed-price proposals so you always know what you're getting.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {CONSTANTS.PRICING_PLANS.map((plan, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative p-8 rounded-2xl border flex flex-col transition-all duration-300 ${
                    plan.highlight
                      ? "bg-gradient-to-b from-teal-900/20 to-black border-teal-500/40 shadow-[0_0_40px_rgba(45,212,191,0.12)]"
                      : "bg-[#0a0a0a] border-white/5 hover:border-white/15"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-black text-xs font-bold tracking-wide">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-end gap-1 mb-4">
                      <span className="text-4xl font-bold text-white font-mono">{plan.price}</span>
                      <span className="text-sm text-gray-500 mb-1">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>

                  <ul className="space-y-3.5 mb-8 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-teal-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-teal-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className={`group w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-black hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-teal-500/30"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-gray-600 text-sm mt-10"
            >
              All plans include a free 30-min discovery call and fixed-price proposal.{" "}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="text-teal-400 hover:underline"
              >
                Book yours today →
              </button>
            </motion.p>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" aria-label="Client Testimonials" className="py-32 bg-[#020202] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
                Client Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                Trusted by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  Innovators
                </span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Every review below is a real, public Fiverr review — {TESTIMONIAL_STATS.totalReviews}{" "}
                five-star ratings from {TESTIMONIAL_STATS.uniqueClients} clients across{" "}
                {TESTIMONIAL_STATS.countries} countries.{" "}
                <a
                  href={FIVERR_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                >
                  Verify them on Fiverr
                </a>
                .
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.slice(0, 6).map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-2xl bg-[#080808] border border-white/5 hover:border-teal-500/25 transition-all duration-300 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Verified-delivery badge. Replaces invented outcome metrics
                      like "300% performance boost" with something checkable. */}
                  {t.hasDeliveryProof && (
                    <span className="self-start mb-5 text-[0.65rem] font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 uppercase tracking-wider">
                      Delivery screenshot attached
                    </span>
                  )}

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <Quote className="w-6 h-6 text-teal-500/30 mb-3" />
                  <p className="text-gray-300 mb-8 leading-relaxed flex-grow">
                    {t.text}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-800 to-emerald-900 flex items-center justify-center font-bold text-white text-base flex-shrink-0">
                      {t.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{t.username}</div>
                      <div className="text-xs text-teal-400 mt-0.5">
                        {t.country} · Verified Fiverr review
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQSection />

        {/* ── CTA ── */}
        <CTASection onOpenBooking={() => setIsBookingOpen(true)} />
      </main>


      <AnimatePresence>
        {isBookingOpen && (
          <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
