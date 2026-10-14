"use client";
import { Fragment } from "react";
import {
  ArrowLeft, Code2, Cpu, Database, Server, Monitor, Smartphone,
  Cloud, Zap, CreditCard, MapPin, ShieldCheck, Activity, Layout,
  Navigation, Globe, Star, ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ─── Icon map (matches what's stored in DB) ───────────────────────────────────

const ICON_MAP: Record<string, any> = {
  Code2, Server, Database, Cpu, Monitor, Smartphone, Cloud,
  Zap, CreditCard, MapPin, ShieldCheck, Activity, Layout, Navigation,
};

// ─── Safe JSON parse ─────────────────────────────────────────────────────────

function safeParse<T>(val: any, fallback: T): T {
  if (!val || val === "null" || val === '""') return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val as T;
}

const safeUrl = (val: any): string | null => {
  if (!val || val === "null" || val === '""') return null;
  const s = String(val).trim();
  return s.startsWith("http") ? s : null;
};

const isDemoHost = (url: string): boolean => {
  try { return new URL(url).hostname.endsWith(".vercel.app"); } catch { return false; }
};

/** The crumbs after Home; the page builds its BreadcrumbList from the same list. */
type Crumb = { name: string; path: string };

// ─── Component ────────────────────────────────────────────────────────────────

const ProjectDetailClient = ({ project, trail }: { project: any; trail: Crumb[] }) => {
  // Parse JSON fields (stored as text or JSONB)
  const tags      = safeParse<string[]>(project.tags, []);
  const techstack = safeParse<{ icon: string; name: string }[]>(project.techstack, []);
  const statsObj  = safeParse<Record<string, string>>(project.stats, {});
  const statsEntries = Object.entries(statsObj);

  const webUrl     = safeUrl(project.web);
  const androidUrl = safeUrl(project.android);
  const iosUrl     = safeUrl(project.ios);
  const hasImage   = !!(project.image && project.image !== "null" && project.image !== '""' && String(project.image).startsWith("http"));

  const hasPSR = project.problem || project.solution || project.result;

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back */}
        <Link
          href="/projects"
          className="flex items-center text-gray-400 hover:text-teal-400 mb-10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Inside the pt-24 area rather than above this component: the site
            header is fixed and 96px tall, and would cover it there. */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-gray-400">
            <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
            {trail.map((c, i) => (
              <Fragment key={c.path}>
                <li aria-hidden="true">/</li>
                {i < trail.length - 1 ? (
                  <li><Link href={c.path} className="hover:text-teal-400 transition-colors">{c.name}</Link></li>
                ) : (
                  <li className="text-teal-400" aria-current="page">{c.name}</li>
                )}
              </Fragment>
            ))}
          </ol>
        </nav>

        {/* ── Hero Header ── */}
        {/* Starts visible and only slides: a fade from opacity 0 kept the h1
            invisible in the server HTML until hydration, delaying LCP. */}
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {project.featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-400" /> Featured
              </span>
            )}
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-400 text-xs font-mono">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">{project.title}</h1>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">{project.description}</p>
        </motion.div>

        {/* ── Hero Image ── */}
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="w-full h-[380px] md:h-[560px] rounded-3xl overflow-hidden mb-14 border border-white/10 relative"
        >
          {hasImage ? (
            // The LCP element, so never lazy. `preload` replaces `priority`,
            // which Next 16 deprecates and which no longer sets fetchpriority.
            // Without `sizes`, a fill image defaults to 100vw and wide screens
            // fetch a bigger file than this 1280px-max box can show.
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              preload
              fetchPriority="high"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${project.accent || "from-teal-400 to-emerald-400"}`} />
          )}
        </motion.div>

        {/* ── Stats Strip ── */}
        {statsEntries.length > 0 && (
          <div className="mb-14">
            <div className={`grid gap-4 ${
              statsEntries.length <= 2 ? "grid-cols-2" :
              statsEntries.length === 3 ? "grid-cols-3" :
              "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            }`}>
              {statsEntries.map(([key, val]) => (
                <div key={key} className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{val}</div>
                  <div className="text-teal-400 text-xs uppercase tracking-wider capitalize">{key}</div>
                </div>
              ))}
            </div>
            {/* This strip used to carry usage, revenue and uptime figures
                labelled "reported by the client". Public data contradicted
                several and nothing backed the rest, so they were removed. It now
                holds facts about the build and who it was for, plus figures shown
                on a public store listing. */}
            <p className="mt-4 text-xs text-gray-500">
              Facts about the build and who it was for. Any figure here is shown on a public
              store listing or site linked on this page —{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-teal-400">
                how we present portfolio work
              </Link>
              .
            </p>
          </div>
        )}

        {/* ── Main Content ── */}
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left — 2/3 */}
          <div className="lg:col-span-2 space-y-12">

            {/* Problem / Solution / Result */}
            {hasPSR && (
              <section aria-labelledby="project-story">
                <h2 id="project-story" className="text-2xl font-bold text-white mb-6">Project Story</h2>
                <div className="space-y-4">
                  {project.problem && (
                    <div className="bg-[#0a0a0a] border-l-2 border-amber-500 pl-6 pr-4 py-5 rounded-r-2xl">
                      <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                        The Challenge
                      </div>
                      <p className="text-gray-300 leading-relaxed">{project.problem}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="bg-[#0a0a0a] border-l-2 border-blue-500 pl-6 pr-4 py-5 rounded-r-2xl">
                      <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                        What Was Built
                      </div>
                      <p className="text-gray-300 leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                  {project.result && (
                    <div className="bg-[#0a0a0a] border-l-2 border-teal-500 pl-6 pr-4 py-5 rounded-r-2xl">
                      <div className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                        The Result
                      </div>
                      <p className="text-gray-300 leading-relaxed">{project.result}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Detailed content */}
            {project.content && (
              <section aria-labelledby="project-details">
                <h2 id="project-details" className="text-2xl font-bold text-white mb-4">Project Details</h2>
                <p className="text-gray-400 leading-relaxed text-lg">{project.content}</p>
              </section>
            )}

            {/* Tech Stack */}
            {techstack.length > 0 && (
              <section aria-labelledby="project-tech-stack">
                <h2 id="project-tech-stack" className="text-2xl font-bold text-white mb-5">Tech Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {techstack.map((stack, i) => {
                    const Icon = ICON_MAP[stack.icon] ?? Code2;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 bg-white/5 border border-white/10 hover:border-teal-500/30 hover:bg-teal-500/5 px-4 py-2.5 rounded-xl transition-colors"
                      >
                        <Icon className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span className="text-gray-200 text-sm font-medium">{stack.name}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right — 1/3. These headings are h2, not h3: they head their own
              blocks rather than sitting under "Tech Stack", the h2 before them. */}
          <div className="space-y-5">

            {/* Platform Links */}
            <section aria-labelledby="project-links" className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
              <h2 id="project-links" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Where to See It</h2>
              <div className="space-y-3">
                {webUrl && (
                  <a
                    href={webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full py-3 px-4 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl transition-colors"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    {/* A *.vercel.app link here is a demo deployment, not the
                        product's own domain; say so on the button. */}
                    <span>{isDemoHost(webUrl) ? "View Demo Build" : "Visit Website"}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-60" />
                  </a>
                )}
                {androidUrl && (
                  <a
                    href={androidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Android App</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-40" />
                  </a>
                )}
                {iosUrl && (
                  <a
                    href={iosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>iOS App</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-40" />
                  </a>
                )}
                {!webUrl && !androidUrl && !iosUrl && (
                  <p className="text-gray-600 text-sm text-center py-2">No public link for this project</p>
                )}
              </div>
            </section>

            {/* Category */}
            <section aria-labelledby="project-category" className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
              <h2 id="project-category" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</h2>
              <span className="inline-block bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-300 text-sm font-mono">
                {project.category}
              </span>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailClient;
