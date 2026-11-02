"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart, UtensilsCrossed, Plane, Trophy, Video, FileSignature, HardHat, GraduationCap,
  Building2, HeartPulse, ArrowRight,
} from "lucide-react";
import React from "react";
import { getIndustry, industryHref, type IndustrySlug } from "@/data/industries";

// Only industries with a real product in the portfolio, and each card names it.
//
// This grid previously claimed "deep expertise across every vertical", with
// FinTech ("core banking systems built to handle millions of transactions"),
// HealthTech ("HIPAA-compliant patient portals", HL7/FHIR), PropTech and Energy
// cards that no project in the portfolio supports, and PCI DSS / HIPAA tags that
// read as compliance capability. DevoraX holds no certifications and has run no
// audits. Several products below were built while Sameem was an engineer at
// other companies; the project pages say which.
//
// Real Estate and Health came back on 2 Nov 2026, each naming the projects that
// now back it. The titles come from src/data/industries.ts, and each card links
// to /projects filtered to that industry.
const INDUSTRIES: {
  slug: IndustrySlug;
  icon: React.ReactNode;
  description: string;
  tags: string[];
  gradient: string;
  border: string;
}[] = [
  {
    slug: "real-estate",
    icon: <Building2 className="w-7 h-7 text-amber-400" />,
    description: "Bevy Irie's website for landlords abroad, SiteWrite's offline RICS survey app, CAD Interior Studio's walkable 3D homes and ConstrAction's contract generator.",
    tags: ["Next.js", "Offline PWA", "three.js"],
    gradient: "from-amber-500/15 to-orange-500/5",
    border: "hover:border-amber-500/30",
  },
  {
    slug: "marketplaces",
    icon: <ShoppingCart className="w-7 h-7 text-orange-400" />,
    description: "Multi-vendor marketplaces with separate buyer, seller and admin surfaces: Afriva, Pastel's iOS app and the Dooz used-car marketplace.",
    tags: ["Next.js", "Supabase", "Sharetribe", "NestJS"],
    gradient: "from-orange-500/15 to-amber-500/5",
    border: "hover:border-orange-500/30",
  },
  {
    slug: "food-hospitality",
    icon: <UtensilsCrossed className="w-7 h-7 text-emerald-400" />,
    description: "Food Magnet's live food-truck locations, Koor's home-chef ordering app, VoiceDesk's AI receptionist for hotels and restaurants, and Royal Malt's drink launch site.",
    tags: ["Live GPS", "Voice AI", "React Native"],
    gradient: "from-emerald-500/15 to-teal-500/5",
    border: "hover:border-emerald-500/30",
  },
  {
    slug: "education",
    icon: <GraduationCap className="w-7 h-7 text-violet-400" />,
    description: "Pathana's planning platform from high school to career readiness, SteamBlast Arena's multiplayer maths and literacy game, and Pianissimo Online's piano academy.",
    tags: ["Next.js", "Socket.IO", "Phaser"],
    gradient: "from-violet-500/15 to-purple-500/5",
    border: "hover:border-violet-500/30",
  },
  {
    slug: "media",
    icon: <Video className="w-7 h-7 text-pink-400" />,
    description: "HLS video and real-time messaging on LoopedIn, JUJU's media-processing backend, ExpertProfile.AI's publishing CMS and Mint Choc Media's studio site.",
    tags: ["AWS MediaConvert", "FFmpeg", "Supabase"],
    gradient: "from-pink-500/15 to-rose-500/5",
    border: "hover:border-pink-500/30",
  },
  {
    slug: "legal-finance",
    icon: <FileSignature className="w-7 h-7 text-blue-400" />,
    description: "e-fuldmagt, a Danish digital power-of-attorney service with MitID sign-in and generated PDFs, and SolNotary, which seals text on Solana and publishes it for an exact payment.",
    tags: ["MitID", "PDF generation", "Solana"],
    gradient: "from-blue-500/15 to-cyan-500/5",
    border: "hover:border-blue-500/30",
  },
  {
    slug: "health",
    icon: <HeartPulse className="w-7 h-7 text-rose-400" />,
    description: "GentleR, a calm journal whose entries only their writer can read, and a live in-browser preview of lip filler results for aesthetic clinics.",
    tags: ["Row-level security", "MediaPipe", "WebGL2"],
    gradient: "from-rose-500/15 to-pink-500/5",
    border: "hover:border-rose-500/30",
  },
  {
    slug: "fitness",
    icon: <Trophy className="w-7 h-7 text-yellow-400" />,
    description: "Real-time competition leaderboards on WOD Pro League, and an admin panel for a trainer-and-client fitness platform.",
    tags: ["Socket.io", "Redis", "Flutter"],
    gradient: "from-yellow-500/15 to-green-500/5",
    border: "hover:border-yellow-500/30",
  },
  {
    slug: "workforce",
    icon: <HardHat className="w-7 h-7 text-teal-400" />,
    description: "TAL, a UK welfare app that maps facilities for mobile workers, and CEDMAT, a documentation app for roller-shutter installers.",
    tags: ["Google Maps API", "Flutter", "Elasticsearch"],
    gradient: "from-teal-500/15 to-cyan-500/5",
    border: "hover:border-teal-500/30",
  },
  {
    slug: "travel",
    icon: <Plane className="w-7 h-7 text-sky-400" />,
    description: "Barfly, a flight-transfer risk check inside got2.travel that scores connections using Duffel flight data.",
    tags: ["Duffel API", "Node.js", "Heuristics"],
    gradient: "from-sky-500/15 to-blue-500/5",
    border: "hover:border-sky-500/30",
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

        {/* Grid: centred rows, so a short last row sits in the middle */}
        <div className="flex flex-wrap justify-center gap-5">
          {INDUSTRIES.map((industry, idx) => (
            <motion.div
              key={industry.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 4) * 0.06 }}
              className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
            >
              <Link
                href={industryHref(industry.slug)}
                className={`group flex flex-col h-full p-6 rounded-2xl bg-[#080808] border border-white/5 ${industry.border} transition-all duration-300 relative overflow-hidden`}
              >
                {/* Gradient bg */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex flex-col flex-1">
                  <div className="mb-4">{industry.icon}</div>
                  <h3 className="text-base font-bold text-white mb-2">{getIndustry(industry.slug)?.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {industry.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {industry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.6rem] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-gray-600 font-medium group-hover:border-white/15 group-hover:text-gray-400 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 group-hover:gap-2.5 transition-all">
                    See the work
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
