"use client";
import { motion } from "framer-motion";
import { CreditCard, Heart, ShoppingCart, Rocket, Building2, GraduationCap, Car, Zap } from "lucide-react";
import React from "react";

const INDUSTRIES: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  border: string;
}[] = [
  {
    icon: <CreditCard className="w-7 h-7 text-emerald-400" />,
    title: "FinTech & Banking",
    description: "Payment platforms, trading apps, digital wallets, and core banking systems built to handle millions of transactions securely.",
    tags: ["PCI DSS", "KYC/AML", "Real-time Payments"],
    gradient: "from-emerald-500/15 to-teal-500/5",
    border: "hover:border-emerald-500/30",
  },
  {
    icon: <Heart className="w-7 h-7 text-blue-400" />,
    title: "HealthTech & MedTech",
    description: "HIPAA-compliant patient portals, telemedicine platforms, wearable integrations, and AI-powered diagnostic tools.",
    tags: ["HIPAA", "HL7/FHIR", "IoT Wearables"],
    gradient: "from-blue-500/15 to-cyan-500/5",
    border: "hover:border-blue-500/30",
  },
  {
    icon: <ShoppingCart className="w-7 h-7 text-orange-400" />,
    title: "E-Commerce & Retail",
    description: "High-conversion storefronts, AI recommendation engines, inventory management systems, and omnichannel retail platforms.",
    tags: ["Headless CMS", "AR Try-On", "Real-time Inventory"],
    gradient: "from-orange-500/15 to-amber-500/5",
    border: "hover:border-orange-500/30",
  },
  {
    icon: <Rocket className="w-7 h-7 text-violet-400" />,
    title: "SaaS & Startups",
    description: "From zero to Series A — MVPs, product-market-fit iterations, and scalable multi-tenant architectures built for rapid growth.",
    tags: ["Multi-tenant", "Freemium", "Usage Billing"],
    gradient: "from-violet-500/15 to-purple-500/5",
    border: "hover:border-violet-500/30",
  },
  {
    icon: <Building2 className="w-7 h-7 text-teal-400" />,
    title: "PropTech & Real Estate",
    description: "Property listing platforms, virtual tour experiences, smart building IoT dashboards, and investment analytics tools.",
    tags: ["3D Tours", "IoT Sensors", "Market Analytics"],
    gradient: "from-teal-500/15 to-cyan-500/5",
    border: "hover:border-teal-500/30",
  },
  {
    icon: <GraduationCap className="w-7 h-7 text-pink-400" />,
    title: "EdTech & Learning",
    description: "LMS platforms, AI tutoring systems, live cohort experiences, and adaptive learning engines that personalize at scale.",
    tags: ["AI Tutoring", "Live Cohorts", "Gamification"],
    gradient: "from-pink-500/15 to-rose-500/5",
    border: "hover:border-pink-500/30",
  },
  {
    icon: <Car className="w-7 h-7 text-sky-400" />,
    title: "Mobility & Logistics",
    description: "Fleet management platforms, ride-hailing apps, last-mile delivery tracking, and route optimization powered by ML.",
    tags: ["Real-time GPS", "Route ML", "Fleet IoT"],
    gradient: "from-sky-500/15 to-blue-500/5",
    border: "hover:border-sky-500/30",
  },
  {
    icon: <Zap className="w-7 h-7 text-yellow-400" />,
    title: "Energy & CleanTech",
    description: "Smart grid monitoring, EV charging networks, carbon tracking platforms, and renewable energy management dashboards.",
    tags: ["Smart Grid", "EV Charging", "Carbon API"],
    gradient: "from-yellow-500/15 to-green-500/5",
    border: "hover:border-yellow-500/30",
  },
];

export const IndustriesSection = () => {
  return (
    <section className="py-32 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/8 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            Industries
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Deep Expertise Across{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Every Vertical
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We don't just write code — we understand the domain, the regulations,
            and the user psychology of the industry we're building for.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INDUSTRIES.map((industry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className={`group p-6 rounded-2xl bg-[#080808] border border-white/5 ${industry.border} transition-all duration-300 relative overflow-hidden`}
            >
              {/* Gradient bg */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div className="mb-4">{industry.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{industry.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {industry.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {industry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.6rem] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-gray-600 font-medium group-hover:border-white/15 group-hover:text-gray-400 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
