"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { WorkSection } from "@/components/sections/work";
import { Services } from "@/components/sections/services";
import BookingModal from "@/components/models/bookingModel/bookingModel";
import { AnimatePresence } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";
import { Star, Twitter, Linkedin, Github, Mail, Check } from "lucide-react";
import Logo from "@/components/global/logo";
import { useRouter } from "next/navigation";
export default function HomeClient({ initialProjects, initialServices }: any) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [view, setView] = useState('home');
  const [activeService, setActiveService] = useState(null);
  const router = useRouter();
  if (isAdmin) {
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-teal-500/30 font-sans">
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        setView={setView}
        activeView={view}
      />

      <main>
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <AboutSection />

        {/* ✅ Data passed from Server */}
        <WorkSection projects={initialProjects} />

        <section id="services" >
          <Services
            services={initialServices}
            setView={setView}
            setActiveService={setActiveService}
          />
        </section>

        {/* Pricing & Testimonials (Static) */}
        <section id="pricing" className="py-32 bg-black border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold text-white mb-4">Investment Plans</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {CONSTANTS.PRICING_PLANS.map((plan, idx) => (
                <div key={idx} className={`p-8 rounded-2xl border flex flex-col ${plan.highlight ? 'bg-gradient-to-b from-teal-900/10 to-black border-teal-500/50 shadow-[0_0_30px_rgba(45,212,191,0.1)]' : 'bg-[#0a0a0a] border-white/5'}`}>
                  <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-6 text-white">{plan.price}<span className="text-sm text-gray-500 font-normal">{plan.period}</span></div>
                  <p className="text-sm text-gray-400 mb-8">{plan.description}</p>

                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-teal-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 rounded-lg font-bold transition-all ${plan.highlight ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-black hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#020202]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-16">Trusted by Innovators</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {CONSTANTS.TESTIMONIALS.map((t, i) => (
                <div key={i} className="p-10 rounded-2xl bg-[#080808] border border-white/5 text-left hover:border-teal-500/30 transition-colors">
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 text-emerald-500 fill-emerald-500" />)}
                  </div>
                  <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-800 to-emerald-900 flex items-center justify-center font-bold text-white text-lg">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-xs text-teal-400 uppercase tracking-wider">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer & Admin Toggle */}
      <footer className="bg-black pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div>
              <Logo />
              <p className="text-gray-500 mt-6 max-w-sm">
                Building the future with scalable AI & Cloud solutions.
              </p>
            </div>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-teal-600 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-600 font-mono">
            <p>© 2025 {CONSTANTS.AGENCY_NAME}. All rights reserved.</p>
            <button onClick={() => setIsAdmin(true)} className="hover:text-teal-500 transition-colors">SYSTEM ACCESS</button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isBookingOpen && <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}