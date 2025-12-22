
"use client";
import { ArrowLeft, Code2, Cpu, Database, Server } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
const ProjectDetailClient = ({ project }: { project: any }) => {
  const router = useRouter();
  const onBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <button onClick={() => onBack()} className="flex items-center text-gray-400 hover:text-teal-400 mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {project?.tags?.map((tag: any) => (
              <span key={tag} className="px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-400 text-xs font-mono">{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{project?.title}</h1>
          <p className="text-xl text-gray-400 max-w-3xl">{project?.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden relative mb-16 border border-white/10"
        // style={{ background: project?.image }}
        >
          <div className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden">
            <Image
              src={project?.image}
              alt={project.title}
              fill
              className="object-cover"
            // priority // Load this immediately since it's at the top
            />
          </div>
          {/* Mock UI Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-md text-center">
              <div className="text-2xl font-bold text-white mb-2">{project?.category}</div>
              <div className="text-sm text-gray-300">High Fidelity Mockup View</div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">The Challenge & Solution</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{project?.content}</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-4">
                {project.techstack?.map((stack: { name: string; icon: any }, i: number) => {
                  const iconMap: Record<string, typeof Code2> = { Code2, Server, Database, Cpu };
                  const Icon = iconMap[stack.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 border border-white/10 group relative"
                    >
                      <Icon className="w-6 h-6" />
                      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded">
                        {stack.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-6 tracking-wider">Project Stats</h3>
              <div className="space-y-6">
                {Object.entries(project?.stats || {}).map(([key, val]: [string, any]) => (
                  <div key={key}>
                    <div className="text-3xl font-bold text-white mb-1">{val}</div>
                    <div className="text-sm text-teal-500 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors">
              Visit Live Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailClient;