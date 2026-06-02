"use client";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Users, BarChart3, RefreshCcw, HeartHandshake } from "lucide-react";

const DIFFERENTIATORS = [
  {
    icon: Zap,
    title: "Speed Without Compromise",
    description:
      "Most agencies choose between fast and good. We choose both. Our battle-tested boilerplates, CI/CD pipelines, and agile sprints cut delivery time by 40% while keeping code quality at enterprise level.",
    gradient: "from-yellow-500 to-orange-500",
    glow: "rgba(234,179,8,0.2)",
  },
  {
    icon: ShieldCheck,
    title: "Security-First by Default",
    description:
      "Security isn't a checkbox at the end. Every line of code we write follows OWASP standards, zero-trust principles, and is reviewed for vulnerabilities before it ever reaches production.",
    gradient: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.2)",
  },
  {
    icon: Users,
    title: "Dedicated Senior Teams",
    description:
      "You won't be handed off to juniors after the sale. Your project gets a dedicated pod of senior engineers, a product manager, and a designer — all accountable to you.",
    gradient: "from-cyan-500 to-blue-500",
    glow: "rgba(6,182,212,0.2)",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    description:
      "We instrument every product we build with analytics from day one. Our team reads the data, runs experiments, and optimizes continuously so your product gets better after launch.",
    gradient: "from-violet-500 to-purple-500",
    glow: "rgba(139,92,246,0.2)",
  },
  {
    icon: RefreshCcw,
    title: "Iterative & Transparent",
    description:
      "Weekly demos, shared Jira boards, real-time Slack updates. You always know exactly where your project stands. No surprises, no black boxes, no excuses.",
    gradient: "from-pink-500 to-rose-500",
    glow: "rgba(236,72,153,0.2)",
  },
  {
    icon: HeartHandshake,
    title: "Long-Term Partnership",
    description:
      "70% of our clients have worked with us on 3+ projects. We don't disappear after launch — we become your embedded tech team, scaling with you as your business grows.",
    gradient: "from-teal-500 to-emerald-500",
    glow: "rgba(20,184,166,0.2)",
  },
];

export const WhyUsSection = () => {
  return (
    <section className="py-32 bg-[#030303] border-t border-white/5 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.05)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(20,184,166,0.05)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            Why Devora
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            We're not like other{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              agencies.
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We've shipped 100+ products and learned exactly what separates great agencies
            from forgettable ones. Here's how we're different.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIFFERENTIATORS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/12 transition-all duration-300 overflow-hidden"
                style={{ "--glow": item.glow } as React.CSSProperties}
              >
                {/* Gradient top border on hover */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                {/* Subtle bg glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${item.glow}, transparent 70%)` }}
                />

                <div
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${item.gradient} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}
                  style={{ background: `linear-gradient(135deg, ${item.glow}, transparent)`, border: `1px solid ${item.glow}` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3 relative z-10">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
