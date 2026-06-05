"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Star, MapPin, ExternalLink, Award,
  Code2, Server, Smartphone, Zap, Globe, Briefcase,
  GraduationCap, Twitter, Linkedin, Github,
} from "lucide-react";
import Logo from "@/components/global/logo";

// ── Founder data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "5+",   label: "Years Exp."     },
  { value: "100+", label: "Projects"       },
  { value: "5.0",  label: "Fiverr Rating"  },
  { value: "56",   label: "Reviews"        },
];

const SKILLS = [
  { group: "Frontend",  items: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "React Native", "Flutter"] },
  { group: "Backend",   items: ["Node.js", "Nest.js", "Express.js", "BullMQ", "Microservices"] },
  { group: "Database",  items: ["MongoDB", "PostgreSQL", "Redis", "Supabase", "Firebase"] },
  { group: "Cloud",     items: ["AWS EC2/S3", "Docker", "Kubernetes", "CI/CD", "GitHub Actions"] },
];

const PROJECTS = [
  { icon: Zap,       name: "Wodpro",     desc: "Global fitness league — live leaderboards",          stack: "Socket.io · Redis · Stripe",          accent: "from-teal-500 to-emerald-500",   glow: "rgba(20,184,166,0.15)" },
  { icon: Server,    name: "JUJU",       desc: "Media streaming & upload processing pipeline",        stack: "Node.js · FFmpeg · BullMQ · AWS S3",  accent: "from-cyan-500 to-blue-500",      glow: "rgba(6,182,212,0.15)"  },
  { icon: Globe,     name: "Barfly",     desc: "Real-time flight disruption risk prediction",         stack: "Duffel API · Node.js · AWS",          accent: "from-violet-500 to-purple-500",  glow: "rgba(139,92,246,0.15)" },
  { icon: Code2,     name: "Afriva",     desc: "Multi-vendor eCommerce with RBAC & SSR",             stack: "Next.js 15 · Supabase · Stripe",      accent: "from-emerald-500 to-teal-500",   glow: "rgba(16,185,129,0.15)" },
  { icon: Smartphone,name: "Bondly",     desc: "Pet-care subscription with realtime notifications",   stack: "Node.js · Firebase · Stripe",         accent: "from-pink-500 to-rose-500",      glow: "rgba(236,72,153,0.15)" },
  { icon: Briefcase, name: "e-fuldmagt", desc: "GDPR-compliant digital authorization platform",       stack: "Nest.js · MongoDB · AWS",             accent: "from-orange-500 to-amber-500",   glow: "rgba(249,115,22,0.15)" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sameem-amjad-dev/", hover: "hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5" },
  { label: "Fiverr",   href: "https://www.fiverr.com/sameemamjad",            hover: "hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/5" },
  { label: "Website",  href: "https://thedevorax.tech/",                       hover: "hover:border-teal-500/40 hover:text-teal-400 hover:bg-teal-500/5" },
];

// ── Dummy team data ───────────────────────────────────────────────────────────

const TEAM = [
  {
    initials: "AR",
    name: "Ali Raza",
    role: "Lead Frontend Engineer",
    bio: "Pixel-perfect UI craftsman. Specializes in Next.js architecture, animation systems, and building component libraries at scale.",
    skills: ["React.js", "Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    gradient: "from-teal-500 to-emerald-500",
    location: "Lahore, Pakistan",
    since: "2022",
  },
  {
    initials: "ZK",
    name: "Zara Khan",
    role: "Full-Stack Engineer",
    bio: "End-to-end product builder with a focus on clean APIs, database performance, and scalable SaaS backends.",
    skills: ["Node.js", "Nest.js", "PostgreSQL", "Redis", "AWS"],
    gradient: "from-cyan-500 to-blue-500",
    location: "Karachi, Pakistan",
    since: "2022",
  },
  {
    initials: "UB",
    name: "Usman Baig",
    role: "Mobile Developer",
    bio: "Cross-platform mobile specialist building polished iOS/Android experiences with React Native and Flutter.",
    skills: ["React Native", "Flutter", "Firebase", "Expo", "Swift"],
    gradient: "from-violet-500 to-purple-500",
    location: "Islamabad, Pakistan",
    since: "2023",
  },
  {
    initials: "FS",
    name: "Fatima Shah",
    role: "UI/UX Designer",
    bio: "Human-centered designer who translates complex user problems into elegant, intuitive interfaces and seamless experiences.",
    skills: ["Figma", "Prototyping", "Design Systems", "User Research", "Motion"],
    gradient: "from-pink-500 to-rose-500",
    location: "Multan, Pakistan",
    since: "2023",
  },
  {
    initials: "HM",
    name: "Hassan Malik",
    role: "DevOps & Cloud Engineer",
    bio: "Infrastructure specialist ensuring 99.99% uptime. Builds CI/CD pipelines and cloud-native systems on AWS and GCP.",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    gradient: "from-orange-500 to-amber-500",
    location: "Faisalabad, Pakistan",
    since: "2023",
  },
  {
    initials: "NQ",
    name: "Nadia Qureshi",
    role: "Backend & AI Engineer",
    bio: "Backend architect with a growing focus on LLM integrations, RAG pipelines, and building intelligent backend systems.",
    skills: ["Python", "FastAPI", "LangChain", "OpenAI", "MongoDB"],
    gradient: "from-lime-500 to-green-500",
    location: "Peshawar, Pakistan",
    since: "2024",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function TeamClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-teal-500/30 font-sans">

      {/* ── Top bar ── */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => router.push('/')}><Logo /></div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      <main className="pt-20">

        {/* ════════════════════════════════════════════════
            FOUNDER SECTION
        ════════════════════════════════════════════════ */}
        <section id="founder" className="bg-[#030303] relative overflow-hidden">

          {/* Ambient glows */}
          <div className="absolute top-60 right-0 w-[700px] h-[700px] bg-teal-900/8 blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-cyan-900/8 blur-[130px] rounded-full pointer-events-none" />

          {/* Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#030303]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/60 via-transparent to-[#030303]/60" />

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute top-6 left-6 md:left-10"
            >
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-md">
                Meet the Founder
              </span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-6 pb-24 -mt-28 relative z-10">
            <div className="grid lg:grid-cols-[320px_1fr] gap-10 xl:gap-16 items-start">

              {/* Left: Profile card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center lg:items-start"
              >
                {/* Photo */}
                <div className="relative mb-6 group">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-teal-400/20 via-emerald-400/10 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
                  <div className="relative p-[2.5px] rounded-full bg-gradient-to-br from-teal-400 via-emerald-300 to-cyan-400 shadow-[0_0_30px_rgba(45,212,191,0.25)]">
                    <div className="p-[2.5px] rounded-full bg-[#030303]">
                      <div className="relative w-44 h-44 rounded-full overflow-hidden">
                        <Image src="/images/profile_image.png" alt="Sameem Amjad" fill className="object-cover" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-emerald-500/40 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    <span className="text-[0.6rem] font-semibold text-emerald-400 uppercase tracking-wider">Available</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-white text-center lg:text-left leading-tight">Sameem Amjad</h1>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-semibold text-sm mt-1.5 text-center lg:text-left">
                  Founder & CEO · DevoraX
                </p>
                <p className="text-gray-500 text-xs mt-0.5 text-center lg:text-left">Full-Stack Architect · Cloud Engineer</p>

                <div className="flex items-center gap-1.5 mt-3 text-gray-500 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  <span>Pakistan · Remote-first · Global Clients</span>
                </div>

                <div className="flex items-center gap-2.5 mt-4 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-colors">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    ))}
                  </div>
                  <span className="text-white font-bold text-sm font-mono">5.0</span>
                  <span className="text-gray-500 text-xs">· 56 reviews · Fiverr</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {SOCIALS.map(({ label, href, hover }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 text-xs font-medium transition-all duration-200 cursor-pointer ${hover}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      {label}
                    </a>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-6 w-full">
                  {STATS.map(({ value, label }, i) => (
                    <motion.div key={label}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-teal-500/15 transition-colors text-center"
                    >
                      <div className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">{value}</div>
                      <div className="text-[0.6rem] text-gray-500 uppercase tracking-wider mt-0.5">{label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 w-full space-y-2">
                  {[
                    { icon: GraduationCap, text: "COMSATS University — B.Sc. CS, 2023" },
                    { icon: Award,         text: "GDSC Islamabad — Web Dev, 2023" },
                    { icon: Award,         text: "Fiverr — Freelancing Essentials, 2024" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <Icon className="w-3.5 h-3.5 text-teal-400/70 flex-shrink-0" />
                      <span className="text-xs text-gray-400 leading-snug">{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Details */}
              <div className="space-y-10 pt-4 lg:pt-32">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
                  <p className="text-gray-200 text-lg leading-relaxed">
                    I'm a{" "}
                    <span className="text-white font-semibold">Software Engineer specializing in scalable backend architectures</span>{" "}
                    and high-performance full-stack ecosystems. I don't just build applications — I engineer secure,
                    data-driven systems that solve complex business problems.
                  </p>
                  <p className="text-gray-400 text-base leading-relaxed">
                    As the <span className="text-teal-400 font-medium">Founder & CEO of DevoraX</span>, I lead a
                    multidisciplinary team delivering production-grade web and mobile solutions to global clients.
                    With <span className="text-white font-medium">5+ years</span> and{" "}
                    <span className="text-white font-medium">100+ projects delivered</span> — from real-time fitness
                    platforms to GDPR-compliant enterprise systems — I bring depth across the MERN stack, Next.js,
                    cloud infrastructure, and high-performance mobile apps.
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    My approach combines <span className="text-gray-300">clean, maintainable code</span> with
                    robust cloud infrastructure on AWS — ensuring every product is lightning-fast, scalable, and built to last.
                  </p>
                </motion.div>

                {/* Tech stack */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">Tech Stack</span>
                  <div className="mt-4 space-y-3">
                    {SKILLS.map(({ group, items }) => (
                      <div key={group} className="flex flex-wrap items-start gap-2">
                        <span className="text-[0.6rem] text-gray-600 uppercase tracking-widest mt-1.5 w-20 flex-shrink-0">{group}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((skill) => (
                            <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-gray-400 hover:border-teal-500/25 hover:text-teal-400 transition-all duration-150 cursor-default">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Notable projects */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">Notable Projects</span>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
                    {PROJECTS.map(({ icon: Icon, name, desc, stack, accent, glow }, i) => (
                      <motion.div key={name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.06 }}
                        style={{ "--glow": glow } as React.CSSProperties}
                        className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden cursor-default"
                      >
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                          style={{ background: `radial-gradient(ellipse at 30% 50%, var(--glow) 0%, transparent 70%)` }} />
                        <div className={`relative w-9 h-9 rounded-xl bg-gradient-to-br ${accent} p-[1.5px] mb-3`}>
                          <div className="w-full h-full rounded-[10px] bg-[#080808] flex items-center justify-center">
                            <Icon className="w-4 h-4 text-white/80" />
                          </div>
                        </div>
                        <div className="relative">
                          <div className="font-bold text-white text-sm mb-1">{name}</div>
                          <div className="text-gray-500 text-xs leading-relaxed mb-2.5">{desc}</div>
                          <div className="text-[0.6rem] font-mono text-teal-500/60 tracking-wide">{stack}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            TEAM SECTION
        ════════════════════════════════════════════════ */}
        <section className="py-28 bg-[#020202] border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-900/6 blur-[140px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
                The Team
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
                The People Behind{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  Every Build
                </span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
                A tight-knit, senior-only team of engineers, designers, and cloud architects — each a specialist in their domain.
              </p>
            </motion.div>

            {/* Team grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEAM.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative p-6 rounded-2xl bg-[#080808] border border-white/5 hover:border-teal-500/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Top shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Avatar + name */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} flex-shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-bold text-white text-base leading-tight">{member.name}</div>
                      <div className="text-xs text-teal-400/80 mt-0.5 font-medium">{member.role}</div>
                      <div className="flex items-center gap-1 mt-1.5 text-gray-600 text-[0.65rem]">
                        <MapPin className="w-3 h-3" />
                        {member.location}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-500 text-xs leading-relaxed mb-5">{member.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {member.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[0.65rem] font-medium bg-white/[0.03] border border-white/5 text-gray-500">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[0.6rem] text-gray-600 uppercase tracking-wider font-mono">
                      With DevoraX since {member.since}
                    </span>
                    <div className="flex gap-2">
                      {[Github, Linkedin, Twitter].map((Icon, idx) => (
                        <button key={idx} className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-600 hover:text-teal-400 hover:border-teal-500/30 transition-all duration-150 cursor-pointer">
                          <Icon className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Hiring CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-16 text-center p-10 rounded-2xl bg-gradient-to-b from-teal-900/10 to-transparent border border-teal-500/10"
            >
              <h3 className="text-2xl font-bold text-white mb-3">Want to join the team?</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                We're always looking for exceptional engineers and designers who care about craft. Drop us a line.
              </p>
              <a
                href="mailto:hello@thedevorax.tech"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-black text-sm font-bold hover:shadow-[0_0_25px_rgba(45,212,191,0.35)] transition-all duration-300"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
}
