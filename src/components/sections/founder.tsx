"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Star, MapPin, ExternalLink, Award,
  Code2, Server, Smartphone, Zap, Globe,
  Briefcase, GraduationCap,
} from "lucide-react";

const STATS = [
  { value: "5+",   label: "Years Exp."      },
  { value: "100+", label: "Projects"        },
  { value: "5.0",  label: "Fiverr Rating"   },
  { value: "56",   label: "Client Reviews"  },
];

const SKILLS = [
  { group: "Frontend",    items: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "React Native", "Flutter"] },
  { group: "Backend",     items: ["Node.js", "Nest.js", "Express.js", "BullMQ", "Microservices"] },
  { group: "Database",    items: ["MongoDB", "PostgreSQL", "Redis", "Supabase", "Firebase"] },
  { group: "Cloud",       items: ["AWS EC2/S3", "Docker", "Kubernetes", "CI/CD", "GitHub Actions"] },
];

const PROJECTS = [
  {
    icon: Zap,
    name: "Wodpro",
    desc: "Global fitness league — live leaderboards with millisecond latency",
    stack: "Socket.io · Redis · Stripe",
    accent: "from-teal-500 to-emerald-500",
    glow: "rgba(20,184,166,0.15)",
  },
  {
    icon: Server,
    name: "JUJU",
    desc: "Media streaming & high-volume upload processing pipeline",
    stack: "Node.js · FFmpeg · BullMQ · AWS S3",
    accent: "from-cyan-500 to-blue-500",
    glow: "rgba(6,182,212,0.15)",
  },
  {
    icon: Globe,
    name: "Barfly",
    desc: "Real-time flight disruption risk prediction engine",
    stack: "Duffel API · Node.js · AWS · Algorithms",
    accent: "from-violet-500 to-purple-500",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    icon: Code2,
    name: "Afriva",
    desc: "Multi-vendor eCommerce with RBAC & SSR",
    stack: "Next.js 15 · Supabase · Stripe",
    accent: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.15)",
  },
  {
    icon: Smartphone,
    name: "Bondly",
    desc: "Pet-care subscription ecosystem with real-time notifications",
    stack: "Node.js · Firebase · MongoDB · Stripe",
    accent: "from-pink-500 to-rose-500",
    glow: "rgba(236,72,153,0.15)",
  },
  {
    icon: Briefcase,
    name: "e-fuldmagt",
    desc: "GDPR-compliant digital authorization platform",
    stack: "Nest.js · MongoDB · AWS · Swagger",
    accent: "from-orange-500 to-amber-500",
    glow: "rgba(249,115,22,0.15)",
  },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sameem-amjad-dev/",
    color: "hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5",
  },
  {
    label: "Fiverr",
    href: "https://www.fiverr.com/sameemamjad",
    color: "hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/5",
  },
  {
    label: "Website",
    href: "https://thedevorax.tech/",
    color: "hover:border-teal-500/40 hover:text-teal-400 hover:bg-teal-500/5",
  },
];

export const FounderSection = () => {
  return (
    <section
      id="founder"
      className="bg-[#030303] border-t border-white/5 relative overflow-hidden"
    >
      {/* ── Ambient glows ── */}
      <div className="absolute top-60 right-0 w-[700px] h-[700px] bg-teal-900/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-cyan-900/8 blur-[130px] rounded-full pointer-events-none" />

      {/* ── Banner ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden"
      >
        <Image
          src="/images/banner.png"
          alt="Sameem Amjad — DevoraX"
          fill
          className="object-cover object-top"
          priority
        />
        {/* gradient fade into section bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#030303]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/60 via-transparent to-[#030303]/60" />

        {/* "Meet the Founder" pill — top left */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 left-6 md:left-10"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-md">
            Meet the Founder
          </span>
        </motion.div>
      </motion.div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 pb-28 -mt-28 relative z-10">
        <div className="grid lg:grid-cols-[320px_1fr] gap-10 xl:gap-16 items-start">

          {/* ══ LEFT: Profile card ══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center lg:items-start"
          >
            {/* Profile photo */}
            <div className="relative mb-6 group">
              {/* Animated glow ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-teal-400/20 via-emerald-400/10 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
              {/* Gradient border ring */}
              <div className="relative p-[2.5px] rounded-full bg-gradient-to-br from-teal-400 via-emerald-300 to-cyan-400 shadow-[0_0_30px_rgba(45,212,191,0.25)]">
                <div className="p-[2.5px] rounded-full bg-[#030303]">
                  <div className="relative w-44 h-44 rounded-full overflow-hidden">
                    <Image
                      src="/images/profile_image.png"
                      alt="Sameem Amjad"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Available dot */}
              <div className="absolute bottom-3 right-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-emerald-500/40 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span className="text-[0.6rem] font-semibold text-emerald-400 uppercase tracking-wider">
                  Available
                </span>
              </div>
            </div>

            {/* Name & title */}
            <h2 className="text-3xl font-bold text-white text-center lg:text-left leading-tight">
              Sameem Amjad
            </h2>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-semibold text-sm mt-1.5 text-center lg:text-left">
              Founder & CEO · DevoraX
            </p>
            <p className="text-gray-500 text-xs mt-0.5 text-center lg:text-left">
              Full-Stack Architect · Cloud Engineer
            </p>

            {/* Location */}
            <div className="flex items-center gap-1.5 mt-3 text-gray-500 text-xs">
              <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
              <span>Pakistan · Remote-first · Global Clients</span>
            </div>

            {/* Fiverr badge */}
            <div className="flex items-center gap-2.5 mt-4 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-colors">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                ))}
              </div>
              <span className="text-white font-bold text-sm font-mono">5.0</span>
              <span className="text-gray-500 text-xs">· 56 reviews · Fiverr</span>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-2 mt-4">
              {SOCIALS.map(({ label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 text-xs font-medium transition-all duration-200 cursor-pointer ${color}`}
                >
                  <ExternalLink className="w-3 h-3" />
                  {label}
                </a>
              ))}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-6 w-full">
              {STATS.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-teal-500/15 transition-colors text-center"
                >
                  <div className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                    {value}
                  </div>
                  <div className="text-[0.6rem] text-gray-500 uppercase tracking-wider mt-0.5">
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Education & certs */}
            <div className="mt-5 w-full space-y-2">
              {[
                { icon: GraduationCap, text: "COMSATS University — B.Sc. CS, 2023" },
                { icon: Award, text: "GDSC Islamabad — Web Dev, 2023" },
                { icon: Award, text: "Fiverr — Online Freelancing Essentials, 2024" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <Icon className="w-3.5 h-3.5 text-teal-400/70 flex-shrink-0" />
                  <span className="text-xs text-gray-400 leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ══ RIGHT: Details ══ */}
          <div className="space-y-10 pt-4 lg:pt-32">

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <p className="text-gray-200 text-lg leading-relaxed">
                I'm a{" "}
                <span className="text-white font-semibold">
                  Software Engineer specializing in scalable backend architectures
                </span>{" "}
                and high-performance full-stack ecosystems. I don't just build
                applications — I engineer secure, data-driven systems that solve
                complex business problems.
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                As the{" "}
                <span className="text-teal-400 font-medium">Founder & CEO of DevoraX</span>,
                I lead a multidisciplinary team of developers, designers, and DevOps
                engineers delivering production-grade solutions to global clients. From
                real-time fitness platforms and media streaming backends to
                GDPR-compliant enterprise systems — I bring deep expertise across the
                MERN stack, Next.js, cloud infrastructure, and mobile apps.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                My approach combines{" "}
                <span className="text-gray-300">clean, maintainable code</span> with
                robust cloud infrastructure on AWS — ensuring every product is
                lightning-fast, scalable, and built to last.
              </p>
            </motion.div>

            {/* Tech stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
                Tech Stack
              </span>
              <div className="mt-4 space-y-3">
                {SKILLS.map(({ group, items }) => (
                  <div key={group} className="flex flex-wrap items-start gap-2">
                    <span className="text-[0.6rem] text-gray-600 uppercase tracking-widest mt-1.5 w-20 flex-shrink-0">
                      {group}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-gray-400 hover:border-teal-500/25 hover:text-teal-400 transition-all duration-150 cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notable Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
                Notable Projects
              </span>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
                {PROJECTS.map(({ icon: Icon, name, desc, stack, accent, glow }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    style={{ "--glow": glow } as React.CSSProperties}
                    className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden cursor-default"
                  >
                    {/* Top shimmer on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Hover glow spot */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                      style={{ background: `radial-gradient(ellipse at 30% 50%, var(--glow) 0%, transparent 70%)` }}
                    />

                    {/* Icon */}
                    <div className={`relative w-9 h-9 rounded-xl bg-gradient-to-br ${accent} p-[1.5px] mb-3`}>
                      <div className="w-full h-full rounded-[10px] bg-[#080808] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white/80" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="font-bold text-white text-sm mb-1">{name}</div>
                      <div className="text-gray-500 text-xs leading-relaxed mb-2.5">{desc}</div>
                      <div className="text-[0.6rem] font-mono text-teal-500/60 tracking-wide">
                        {stack}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};
