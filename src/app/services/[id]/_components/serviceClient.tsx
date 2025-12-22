"use client";
import { ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import getIcon from "@/utils/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ServiceDetailClient = ({ service, initialProjects }: { service: any, initialProjects: any[] }) => {
  const router = useRouter();

  const handleViewProject = (project: any) => {
    router.push(`/projects/${project.id}`);
  };

  if (!service) return null;

  const onBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <button onClick={onBack} className="flex items-center text-gray-400 hover:text-teal-400 mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Services
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 border border-teal-500/20">
              {getIcon(service?.icon)}
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">{service?.title}</h1>
            <p className="text-md text-gray-400 leading-relaxed mb-8">{service?.desc_text}</p>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">{service?.desc_long}</p>
            <ul className="space-y-3">
              {service?.features?.map((feat: any) => (
                <li key={feat} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-teal-500" /> {feat}
                </li>
              ))}
            </ul>
          </motion.div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 h-[400px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="text-center relative z-10">
              <div className="text-6xl font-bold text-white mb-2">100%</div>
              <div className="text-teal-400 uppercase tracking-widest text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-8">Related Success Stories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialProjects.length > 0 ? initialProjects.map(p => (
            <div key={p.id} onClick={() => handleViewProject(p)} className="cursor-pointer group bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-teal-500/40 transition-all">
              <div className="h-48 relative overflow-hidden bg-gray-800">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#111]" />
                )}
              </div>

              <div className="p-6">
                <div className="text-xs font-bold text-teal-500 mb-2 uppercase">{p.category}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">{p.title}</h3>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-12 border border-dashed border-white/10 rounded-2xl text-gray-500">
              No specific case studies linked to this service yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailClient;