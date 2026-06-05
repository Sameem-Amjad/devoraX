"use client";
import React, { useState, useRef } from "react";
import {
  ArrowUpRight,
  Code2,
  ArrowLeft,
  Zap,
  Globe,
  Smartphone,
  Cpu,
  Layout,
  ChevronRight,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/components/global/logo";

// ── helpers ──────────────────────────────────────────────────────────────────

function safeTags(val: any): string[] {
  if (!val || val === "null") return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

function safeImage(val: any): string | null {
  if (!val || val === "null" || val === '""') return null;
  const s = String(val).trim();
  return s.startsWith("http") ? s : null;
}

const CATEGORIES = ["All", "Web", "Mobile", "AI", "Design", "E-Commerce"];

const CAT_ICON: Record<string, React.ReactNode> = {
  Web: <Globe className="w-3.5 h-3.5" />,
  Mobile: <Smartphone className="w-3.5 h-3.5" />,
  AI: <Cpu className="w-3.5 h-3.5" />,
  Design: <Layout className="w-3.5 h-3.5" />,
  "E-Commerce": <Zap className="w-3.5 h-3.5" />,
};

// ── 3D tilt wrapper ───────────────────────────────────────────────────────────

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 400, damping: 40 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 400, damping: 40 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        ref={ref}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  idx,
  large = false,
}: {
  project: any;
  idx: number;
  large?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const tags = safeTags(project.tags).slice(0, 3);
  const imgSrc = safeImage(project.image);

  return (
    <TiltCard className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: idx * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => router.push(`/projects/${project.id}`)}
        className="group relative h-full cursor-pointer"
      >
        {/* Neon glow border */}
        <div
          className="absolute -inset-px rounded-2xl pointer-events-none transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background:
              "linear-gradient(135deg, rgba(45,212,191,0.8) 0%, rgba(16,185,129,0.5) 50%, rgba(6,182,212,0.7) 100%)",
            filter: "blur(1.5px)",
          }}
        />

        <div
          className={`relative h-full rounded-2xl bg-[#060606] border border-white/[0.05] overflow-hidden flex flex-col ${
            large ? "min-h-[480px]" : "min-h-[360px]"
          }`}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Ambient corner glow on hover */}
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)",
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* Image area */}
          <div className={`relative overflow-hidden flex-shrink-0 ${large ? "h-64" : "h-48"}`}>
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(10,10,10,1) 0%, rgba(20,60,50,0.35) 100%)",
                }}
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/25 to-transparent" />

            {/* Scan lines on hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(45,212,191,0.012) 3px, rgba(45,212,191,0.012) 4px)",
                opacity: hovered ? 1 : 0,
              }}
            />

            {/* Category badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-teal-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[0.6rem] font-bold text-teal-300 uppercase tracking-widest">
                {project.category}
              </span>
            </div>

            {/* Explore overlay on hover */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/90 backdrop-blur-sm text-black text-xs font-bold tracking-wide shadow-[0_0_30px_rgba(45,212,191,0.5)]">
                <span>EXPLORE CASE STUDY</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.accent || "from-teal-500 to-emerald-600"} flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:-translate-y-1`}
              style={{ transform: "translateZ(16px)" }}
            >
              <Code2 className="text-black w-4 h-4" />
            </div>

            <h3
              className={`font-bold text-white mb-2 leading-tight transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-300 group-hover:to-emerald-300 ${
                large ? "text-2xl" : "text-lg"
              }`}
            >
              {project.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-auto">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap mt-5 pt-4 border-t border-white/[0.05]">
              {tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-[0.55rem] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-600 font-mono uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-1 text-[0.6rem] font-mono text-teal-500 group-hover:text-teal-300 transition-colors">
                VIEW <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

// ── Bento grid layout ─────────────────────────────────────────────────────────

function BentoGrid({ projects }: { projects: any[] }) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-600">
        <Code2 className="w-10 h-10 mb-4 opacity-30" />
        <p className="font-mono text-sm">No projects found</p>
      </div>
    );
  }

  // Build rows: [large, small], [small, small, small], [large, small], ...
  const rows: React.ReactElement[] = [];
  let i = 0;
  let rowKey = 0;

  while (i < projects.length) {
    const isLargeRow = rowKey % 2 === 0;

    if (isLargeRow) {
      // 2-col: [large | small] or just [large]
      const a = projects[i];
      const b = projects[i + 1];
      rows.push(
        <div key={rowKey} className="grid md:grid-cols-3 gap-5">
          {a && (
            <div className="md:col-span-2">
              <ProjectCard project={a} idx={i} large />
            </div>
          )}
          {b && (
            <div className="md:col-span-1">
              <ProjectCard project={b} idx={i + 1} />
            </div>
          )}
        </div>
      );
      i += b ? 2 : 1;
    } else {
      // 3-col equal
      const slice = projects.slice(i, i + 3);
      rows.push(
        <div key={rowKey} className="grid md:grid-cols-3 gap-5">
          {slice.map((p, si) => (
            <ProjectCard key={p.id} project={p} idx={i + si} />
          ))}
        </div>
      );
      i += slice.length;
    }

    rowKey++;
  }

  return <div className="flex flex-col gap-5">{rows}</div>;
}

// ── Main client page ──────────────────────────────────────────────────────────

export default function CaseStudyClient({ projects }: { projects: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const router = useRouter();

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#040404] text-white selection:bg-teal-500/30 font-sans">
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="cursor-pointer">
            <Logo />
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <button
              onClick={() => router.push("/#work")}
              className="px-5 py-2 rounded-lg bg-teal-500/10 border border-teal-500/25 text-teal-300 text-sm font-semibold hover:bg-teal-500/20 transition-all"
            >
              View Work
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Glow blobs */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(45,212,191,0.08) 0%, rgba(16,185,129,0.04) 40%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(6,182,212,0.05) 0%, transparent 65%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-8"
          >
            <span
              className="hover:text-teal-400 cursor-pointer transition-colors"
              onClick={() => router.push("/")}
            >
              HOME
            </span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-teal-400">CASE STUDIES</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
              <span className="text-white">Case</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                Studies
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-gray-400 text-lg max-w-2xl mb-12"
          >
            Deep dives into{" "}
            <span className="text-white font-medium">
              {projects.length} projects
            </span>{" "}
            we&apos;ve shipped — real problems, real solutions, measurable results.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-6 mb-16"
          >
            {[
              { label: "Projects Shipped", value: `${projects.length}+` },
              { label: "Global Clients", value: "40+" },
              { label: "Industries", value: "12+" },
              { label: "Avg Delivery", value: "6 wks" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-bold text-white font-mono">{s.value}</span>
                <span className="text-xs text-gray-600 uppercase tracking-widest mt-0.5">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
      <section className="sticky top-20 z-40 bg-[#040404]/80 backdrop-blur-lg border-b border-white/[0.04] py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-teal-500 text-black shadow-[0_0_20px_rgba(45,212,191,0.4)]"
                    : "bg-white/[0.04] border border-white/[0.07] text-gray-500 hover:text-white hover:border-white/15"
                }`}
              >
                {CAT_ICON[cat] && (
                  <span className={activeCategory === cat ? "text-black" : "text-gray-600"}>
                    {CAT_ICON[cat]}
                  </span>
                )}
                {cat}
                {cat !== "All" && (
                  <span
                    className={`text-[0.5rem] px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat
                        ? "bg-black/20 text-black"
                        : "bg-white/5 text-gray-600"
                    }`}
                  >
                    {projects.filter(
                      (p) => p.category?.toLowerCase() === cat.toLowerCase()
                    ).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects grid ──────────────────────────────────────────────────── */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BentoGrid projects={filtered} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA Footer ─────────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(45,212,191,0.06) 0%, transparent 65%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-6 px-4 py-1.5 rounded-full bg-teal-500/[0.07] border border-teal-500/20">
              Ready to Build?
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Your project could be{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                next.
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Let's turn your vision into a world-class digital product. Start with a free 30-min discovery call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold text-sm transition-all hover:shadow-[0_0_40px_rgba(45,212,191,0.35)]"
              >
                Start Your Project
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/#work")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white font-semibold text-sm hover:border-teal-500/30 hover:bg-teal-500/[0.04] transition-all"
              >
                See More Work
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
