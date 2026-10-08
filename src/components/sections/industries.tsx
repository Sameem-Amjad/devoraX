"use client";
import { motion } from "framer-motion";
import { ShoppingCart, UtensilsCrossed, Plane, Trophy, Video, FileSignature, HardHat, GraduationCap } from "lucide-react";
import React from "react";

// Only industries with a real product in the portfolio, and each card names it.
//
// This grid previously claimed "deep expertise across every vertical", with
// FinTech ("core banking systems built to handle millions of transactions"),
// HealthTech ("HIPAA-compliant patient portals", HL7/FHIR), PropTech and Energy
// cards that no project in the portfolio supports, and PCI DSS / HIPAA tags that
// read as compliance capability. DevoraX holds no certifications and has run no
// audits. Several products below were built while Sameem was an engineer at
// other companies; the project pages say which.
const INDUSTRIES: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  border: string;
}[] = [
  {
    icon: <ShoppingCart className="w-7 h-7 text-orange-400" />,
    title: "Marketplaces & E-Commerce",
    description: "Multi-vendor marketplaces with separate buyer, seller and admin surfaces: Afriva, Pastel's iOS app and the Dooz used-car marketplace.",
    tags: ["Next.js", "Supabase", "Sharetribe", "NestJS"],
    gradient: "from-orange-500/15 to-amber-500/5",
    border: "hover:border-orange-500/30",
  },
  {
    icon: <UtensilsCrossed className="w-7 h-7 text-emerald-400" />,
    title: "Food & Delivery",
    description: "Food Magnet's live food-truck locations and vendor menus, and Koor, a home-chef ordering app.",
    tags: ["Live GPS", "AWS Lambda", "React Native"],
    gradient: "from-emerald-500/15 to-teal-500/5",
    border: "hover:border-emerald-500/30",
  },
  {
    icon: <Plane className="w-7 h-7 text-sky-400" />,
    title: "Travel",
    description: "Barfly, a flight-transfer risk check inside got2.travel that scores connections using Duffel flight data.",
    tags: ["Duffel API", "Node.js", "Heuristics"],
    gradient: "from-sky-500/15 to-blue-500/5",
    border: "hover:border-sky-500/30",
  },
  {
    icon: <Trophy className="w-7 h-7 text-yellow-400" />,
    title: "Fitness & Sport",
    description: "Real-time competition leaderboards on WOD Pro League, and an admin panel for a trainer-and-client fitness platform.",
    tags: ["Socket.io", "Redis", "Flutter"],
    gradient: "from-yellow-500/15 to-green-500/5",
    border: "hover:border-yellow-500/30",
  },
  {
    icon: <Video className="w-7 h-7 text-pink-400" />,
    title: "Social, Video & Creators",
    description: "HLS video and real-time messaging on LoopedIn, JUJU's media-processing backend, and Three28's creator-priced video.",
    tags: ["AWS MediaConvert", "FFmpeg", "BullMQ"],
    gradient: "from-pink-500/15 to-rose-500/5",
    border: "hover:border-pink-500/30",
  },
  {
    icon: <FileSignature className="w-7 h-7 text-blue-400" />,
    title: "Legal Tech & Digital Identity",
    description: "e-fuldmagt, a Danish digital power-of-attorney service: MitID sign-in through Criipto and generated PDF documents, built to GDPR requirements.",
    tags: ["MitID", "OIDC", "PDF generation"],
    gradient: "from-blue-500/15 to-cyan-500/5",
    border: "hover:border-blue-500/30",
  },
  {
    icon: <HardHat className="w-7 h-7 text-teal-400" />,
    title: "Field & Workforce Apps",
    description: "TAL, a UK welfare app that maps facilities for mobile workers, and CEDMAT, a documentation app for roller-shutter installers.",
    tags: ["Google Maps API", "Flutter", "Elasticsearch"],
    gradient: "from-teal-500/15 to-cyan-500/5",
    border: "hover:border-teal-500/30",
  },
  {
    icon: <GraduationCap className="w-7 h-7 text-violet-400" />,
    title: "Education",
    description: "Pathana, a planning platform that takes students from high school to career readiness, with views for counsellors and families.",
    tags: ["Next.js", "Firebase", "Serverless"],
    gradient: "from-violet-500/15 to-purple-500/5",
    border: "hover:border-violet-500/30",
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
            Industries We Have{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Worked In
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Each card names real products from the portfolio. Several were built while
            Sameem was an engineer at other companies; each project page says which.
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
