"use client";
import { motion } from "framer-motion";
import { useState } from "react";

type Tool = {
  name: string;
  icon: string;
  color: string;
};

type Category = {
  id: string;
  label: string;
  gradient: string;
  glow: string;
  tools: Tool[];
};

const TOOL_CATEGORIES: Category[] = [
  {
    id: "ai",
    label: "AI & Intelligence",
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.25)",
    tools: [
      { name: "OpenAI GPT-4o", icon: "🤖", color: "text-violet-400" },
      { name: "Claude API", icon: "🧠", color: "text-purple-400" },
      { name: "LangChain", icon: "🔗", color: "text-violet-300" },
      { name: "Hugging Face", icon: "🤗", color: "text-yellow-400" },
      { name: "Pinecone", icon: "🌲", color: "text-green-400" },
      { name: "LlamaIndex", icon: "🦙", color: "text-orange-400" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend & Mobile",
    gradient: "from-cyan-500 to-teal-500",
    glow: "rgba(6,182,212,0.25)",
    tools: [
      { name: "Next.js 15", icon: "▲", color: "text-white" },
      { name: "React 19", icon: "⚛️", color: "text-cyan-400" },
      { name: "React Native", icon: "📱", color: "text-cyan-300" },
      { name: "Flutter", icon: "🐦", color: "text-blue-400" },
      { name: "TypeScript", icon: "🔷", color: "text-blue-300" },
      { name: "Framer Motion", icon: "🎭", color: "text-pink-400" },
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    gradient: "from-emerald-500 to-green-600",
    glow: "rgba(16,185,129,0.25)",
    tools: [
      { name: "Node.js", icon: "🟢", color: "text-emerald-400" },
      { name: "Python", icon: "🐍", color: "text-yellow-400" },
      { name: "FastAPI", icon: "⚡", color: "text-teal-400" },
      { name: "GraphQL", icon: "◈", color: "text-pink-400" },
      { name: "tRPC", icon: "🔁", color: "text-blue-400" },
      { name: "Prisma ORM", icon: "🔺", color: "text-emerald-300" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    gradient: "from-orange-500 to-amber-500",
    glow: "rgba(249,115,22,0.25)",
    tools: [
      { name: "AWS", icon: "☁️", color: "text-orange-400" },
      { name: "Docker", icon: "🐳", color: "text-blue-400" },
      { name: "Kubernetes", icon: "☸️", color: "text-blue-300" },
      { name: "Terraform", icon: "🏗️", color: "text-violet-400" },
      { name: "GitHub Actions", icon: "🔄", color: "text-gray-300" },
      { name: "Vercel", icon: "▲", color: "text-white" },
    ],
  },
  {
    id: "database",
    label: "Databases & Storage",
    gradient: "from-sky-500 to-indigo-500",
    glow: "rgba(14,165,233,0.25)",
    tools: [
      { name: "PostgreSQL", icon: "🐘", color: "text-sky-400" },
      { name: "MongoDB", icon: "🍃", color: "text-green-400" },
      { name: "Redis", icon: "🔴", color: "text-red-400" },
      { name: "Supabase", icon: "⚡", color: "text-emerald-400" },
      { name: "Weaviate", icon: "🕸️", color: "text-indigo-400" },
      { name: "S3 / R2", icon: "🪣", color: "text-orange-300" },
    ],
  },
  {
    id: "design",
    label: "Design & UI",
    gradient: "from-pink-500 to-rose-500",
    glow: "rgba(236,72,153,0.25)",
    tools: [
      { name: "Figma", icon: "🎨", color: "text-pink-400" },
      { name: "Tailwind CSS", icon: "💨", color: "text-cyan-400" },
      { name: "shadcn/ui", icon: "🧩", color: "text-gray-300" },
      { name: "Radix UI", icon: "⚫", color: "text-white" },
      { name: "Lucide Icons", icon: "✦", color: "text-yellow-400" },
      { name: "Storybook", icon: "📖", color: "text-pink-300" },
    ],
  },
];

const ALL_ID = "all";

export const ToolsSection = () => {
  const [active, setActive] = useState<string>(ALL_ID);

  const displayedCategories =
    active === ALL_ID
      ? TOOL_CATEGORIES
      : TOOL_CATEGORIES.filter((c) => c.id === active);

  return (
    <section
      id="tools"
      className="py-32 bg-[#020202] border-t border-white/5 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,0.06),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            Our Toolbox
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Tools We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
              Master
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Best-in-class technologies for every layer of your product — from
            AI inference to pixel-perfect UI.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {[{ id: ALL_ID, label: "All" }, ...TOOL_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))].map(
            (tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  active === tab.id
                    ? "bg-teal-500/15 border-teal-500/40 text-teal-300"
                    : "bg-white/[0.03] border-white/[0.07] text-gray-500 hover:text-gray-300 hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            )
          )}
        </motion.div>

        {/* Categories grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((category, catIdx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.07 }}
              className="group relative rounded-2xl bg-[#080808] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 overflow-hidden"
              style={{
                boxShadow: `0 0 0 0 ${category.glow}`,
              }}
              whileHover={{
                boxShadow: `0 0 40px -10px ${category.glow}`,
              }}
            >
              {/* Top accent bar */}
              <div className={`h-[2px] w-full bg-gradient-to-r ${category.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />

              <div className="p-6">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.gradient} opacity-80 flex items-center justify-center`}>
                    <div className="w-3 h-3 bg-white/90 rounded-sm" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {category.label}
                  </h3>
                </div>

                {/* Tools grid */}
                <div className="grid grid-cols-2 gap-2">
                  {category.tools.map((tool, toolIdx) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIdx * 0.07 + toolIdx * 0.04 }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 cursor-default"
                    >
                      <span className="text-base leading-none">{tool.icon}</span>
                      <span className={`text-xs font-medium ${tool.color} truncate`}>
                        {tool.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 text-sm">
            Always adopting the best new tools —{" "}
            <span className="text-teal-500">
              so you don't have to track the landscape.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
