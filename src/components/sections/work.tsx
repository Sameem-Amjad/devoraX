"use client";
import { ArrowUpRight, Code2, Loader2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ITEMS_PER_LOAD = 6;

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

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 400, damping: 40 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 400, damping: 40 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <div style={{ perspective: 1000 }} className={className}>
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

function ProjectCard({ item, idx, onClick }: { item: any; idx: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const tags = safeTags(item.tags).slice(0, 3);
  const imgSrc = safeImage(item.image);

  return (
    <TiltCard>
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: (idx % 3) * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        className="group relative h-full cursor-pointer"
      >
        {/* Neon glow border */}
        <div
          className="absolute -inset-px rounded-2xl transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            background: "linear-gradient(135deg, rgba(45,212,191,0.7) 0%, rgba(16,185,129,0.5) 50%, rgba(6,182,212,0.6) 100%)",
            filter: "blur(1px)",
          }}
        />

        <div className="relative h-full rounded-2xl bg-[#060606] border border-white/[0.06] overflow-hidden flex flex-col">
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Corner gradient blob */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none transition-opacity duration-500"
            style={{
              background: item.accent
                ? "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* Image */}
          <div className="relative h-52 overflow-hidden flex-shrink-0">
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, rgba(15,15,15,1) 0%, rgba(20,60,50,0.4) 100%)`,
                }}
              />
            )}

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/30 to-transparent" />

            {/* Scan-line shimmer on hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(45,212,191,0.015) 2px, rgba(45,212,191,0.015) 4px)",
                opacity: hovered ? 1 : 0,
              }}
            />

            {/* Category chip */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-teal-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[0.6rem] font-bold text-teal-300 uppercase tracking-widest">
                {item.category}
              </span>
            </div>

            {/* Index */}
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-white/[0.08]">
              <span className="text-[0.6rem] font-mono text-white/30">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-7 flex flex-col flex-grow">
            {/* Icon badge */}
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.accent || "from-teal-500 to-emerald-600"} flex items-center justify-center mb-5 shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-teal-500/20 group-hover:shadow-xl`}
              style={{ transform: "translateZ(20px)" }}
            >
              <Code2 className="text-black w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2.5 leading-tight transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-300 group-hover:to-emerald-300">
              {item.title}
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-auto">
              {item.description}
            </p>

            {/* Tags + CTA row */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.06]">
              <div className="flex gap-1.5 flex-wrap">
                {tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-[0.55rem] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-600 font-mono uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  hovered
                    ? "bg-gradient-to-br from-teal-400 to-emerald-500 shadow-[0_0_20px_rgba(45,212,191,0.5)]"
                    : "bg-white/[0.04] border border-white/10"
                }`}
              >
                <ArrowUpRight
                  className={`w-4 h-4 transition-colors duration-300 ${hovered ? "text-black" : "text-gray-500"}`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

export const WorkSection = ({ projects }: { projects: any[] }) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const router = useRouter();

  const handleViewProject = (project: any) => router.push(`/projects/${project.id}`);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
      setIsLoadingMore(false);
    }, 300);
  };

  const visibleProjects = projects?.slice(0, visibleCount) || [];
  const hasMoreProjects = projects?.length > visibleCount;

  return (
    <section id="work" className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(45,212,191,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-widest mb-5 px-4 py-1.5 rounded-full bg-teal-500/[0.07] border border-teal-500/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4"
            >
              Selected{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                Works
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="text-gray-500 max-w-lg text-base"
            >
              High-impact digital products delivered for global clients — every pixel crafted with purpose.
            </motion.p>
          </div>

          <motion.a
            href="/case-study"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-teal-400 transition-colors mt-4 md:mt-0 group border border-white/[0.06] px-5 py-2.5 rounded-full hover:border-teal-500/30"
          >
            VIEW ALL CASE STUDIES
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {visibleProjects.map((item: any, idx: number) => (
            <ProjectCard
              key={item.id}
              item={item}
              idx={idx}
              onClick={() => handleViewProject(item)}
            />
          ))}
        </div>

        {/* Load more */}
        {hasMoreProjects && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 text-white font-mono text-xs tracking-widest hover:border-teal-500/30 hover:bg-teal-500/[0.04] transition-all duration-300 disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  LOADING...
                </>
              ) : (
                <>
                  LOAD MORE PROJECTS
                  <ArrowUpRight
                    className="w-4 h-4 text-teal-500 rotate-90 group-hover:translate-y-0.5 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
