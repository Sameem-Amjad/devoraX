"use client";
import { motion } from "framer-motion";
import {
  Cpu, Layout, Server, Smartphone,
  ShoppingCart, Database, GitBranch, Shield,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CONSTANTS from "@/utils/constants/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6" />,
  Cpu:        <Cpu className="w-6 h-6" />,
  Server:     <Server className="w-6 h-6" />,
  Layout:     <Layout className="w-6 h-6" />,
  ShoppingCart:<ShoppingCart className="w-6 h-6" />,
  Database:   <Database className="w-6 h-6" />,
  GitBranch:  <GitBranch className="w-6 h-6" />,
  Shield:     <Shield className="w-6 h-6" />,
};

interface Service {
  id?: string | number;
  icon: React.ReactNode | string;
  title: string;
  desc_text: string;
  tags?: string[];
  gradient?: string;
  glow?: string;
}

export const Services = ({
  services,
  setView,
  setActiveService,
}: {
  services: Service[];
  setView: React.Dispatch<React.SetStateAction<string>>;
  setActiveService: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const router = useRouter();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Merge DB services with extended metadata
  const merged = services?.map((svc, i) => {
    const ext = CONSTANTS.EXTENDED_SERVICES[i] ?? {};
    return { ...ext, ...svc };
  });

  // Fill remaining slots from EXTENDED_SERVICES if DB returned fewer than 8
  const displayServices: Service[] =
    merged?.length >= 8
      ? merged.slice(0, 8)
      : [
          ...(merged ?? []),
          ...CONSTANTS.EXTENDED_SERVICES.slice(merged?.length ?? 0, 8),
        ];

  const handleViewService = (service: any) => {
    if (!service.id) return;
    setView("services");
    setActiveService(service);
    router.push(`/services/${service.id}`);
  };

  return (
    <section id="services" aria-label="Our Services" className="py-32 bg-black relative border-t border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-900/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Services Engineered for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Scale
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We don't just write code. We build intelligent, scalable digital ecosystems
            that grow with your business.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayServices.map((service, idx) => {
            const ext = CONSTANTS.EXTENDED_SERVICES[idx] ?? CONSTANTS.EXTENDED_SERVICES[0];
            const gradient = ext.gradient ?? "from-teal-500 to-emerald-500";
            const glow = ext.glow ?? "rgba(20,184,166,0.3)";
            const tags = ext.tags ?? [];
            const iconNode =
              typeof service.icon === "string"
                ? ICON_MAP[service.icon] ?? ICON_MAP["Layout"]
                : service.icon ?? ICON_MAP["Layout"];

            return (
              <motion.div
                key={idx}
                onClick={() => handleViewService(service)}
                onHoverStart={() => setHoveredIdx(idx)}
                onHoverEnd={() => setHoveredIdx(null)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className="group relative p-7 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/15 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                style={
                  hoveredIdx === idx
                    ? { boxShadow: `0 0 40px ${glow}` }
                    : {}
                }
              >
                {/* Gradient top accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                  style={{ background: `linear-gradient(135deg, ${glow.replace("0.3", "0.2")}, transparent)`, border: `1px solid ${glow}` }}
                >
                  {iconNode}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-3 relative z-10 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10 flex-grow">
                  {service.desc_text}
                </p>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-5 relative z-10">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.65rem] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Arrow CTA */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-gray-600 group-hover:text-teal-400 transition-colors relative z-10">
                  <span>Learn more</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
