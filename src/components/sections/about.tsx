"use client";
import { motion } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";
import { Award, Globe, Users, Zap } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Globe,  label: "Global Reach",   sub: "Clients in 15+ countries" },
  { icon: Award,  label: "Top Rated",      sub: "Industry recognized" },
  { icon: Users,  label: "Expert Team",    sub: "15+ senior engineers" },
  { icon: Zap,    label: "Fast Delivery",  sub: "4–6 week avg. to launch" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-28 bg-[#030303] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left — copy */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-6 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20"
            >
              About the Agency
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight"
            >
              Behind the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Digital Evolution
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-5 text-gray-400 text-lg leading-relaxed"
            >
              <p>
                {CONSTANTS.AGENCY_NAME} was founded with a singular mission: to bridge the gap
                between complex engineering and intuitive design. We're not a freelancer collective
                — we're a{" "}
                <span className="text-white font-medium">
                  full-service product agency
                </span>{" "}
                with dedicated teams for every discipline.
              </p>
              <p>
                With 5+ years and 100+ shipped products across fintech, e-commerce, health-tech,
                and SaaS, we specialize in high-stakes environments where{" "}
                <span className="text-teal-400 font-medium">
                  uptime, scalability, and performance
                </span>{" "}
                aren't just goals — they're requirements.
              </p>
              <p>
                We don't just build apps. We build businesses.
              </p>
            </motion.div>

            {/* Highlights grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4 mt-10"
            >
              {HIGHLIGHTS.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-teal-500/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 p-1">
              <div className="w-full h-full rounded-xl bg-[#080808] overflow-hidden relative">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Floating stats cards */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-6 right-6 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3"
                >
                  <div className="text-2xl font-bold text-white font-mono">100+</div>
                  <div className="text-[0.6rem] text-gray-500 uppercase tracking-widest">Projects Shipped</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-6 left-6 bg-black/80 backdrop-blur-md border border-teal-500/20 rounded-xl px-4 py-3"
                >
                  <div className="text-2xl font-bold text-teal-400 font-mono">5+</div>
                  <div className="text-[0.6rem] text-gray-500 uppercase tracking-widest">Years of Excellence</div>
                </motion.div>

                {/* Code block */}
                <div className="absolute bottom-6 left-6 right-6 font-mono text-xs text-teal-400 bg-black/85 backdrop-blur-md p-4 rounded-xl border border-teal-500/20">
                  <div className="text-gray-600">// {CONSTANTS.AGENCY_NAME} Core Mission</div>
                  <div>
                    <span className="text-emerald-400">class</span>{" "}
                    <span className="text-white">FutureBuilder</span>{" "}
                    <span className="text-yellow-400">{"{"}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">build</span>() <span className="text-yellow-400">{"{"}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-blue-400">return</span>{" "}
                    <span className="text-orange-400">"world-class products"</span>;
                  </div>
                  <div className="pl-4"><span className="text-yellow-400">{"}"}</span></div>
                  <div><span className="text-yellow-400">{"}"}</span></div>
                </div>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -inset-4 rounded-3xl border border-teal-500/10 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
