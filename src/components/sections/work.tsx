"use client";
import { ArrowRight, Code2, Loader2 } from "lucide-react"; // Added Loader icon
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define how many items you want to show initially and per click
const ITEMS_PER_LOAD = 5;

export const WorkSection = ({ projects }: { projects: any[] }) => {
  // State to track how many items are currently visible
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Optional: for button loading state

  const router = useRouter();

  // Note: I destructured props above. 
  // If 'projects' is the array passed from HomeClient, use it directly.

  const handleViewProject = (project: any) => {
    router.push(`/projects/${project.id}`);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate a tiny delay for UX (optional), or just set immediately
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
      setIsLoadingMore(false);
    }, 300);
  };

  // Slice the data based on visibleCount
  const visibleProjects = projects?.slice(0, visibleCount) || [];
  const hasMoreProjects = projects?.length > visibleCount;

  return (
    <section id="work" className="py-32 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Selected Works
            </h2>
            <p className="text-gray-400 max-w-xl">
              High-impact digital products delivered for global clients.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-teal-400 hover:text-white transition-colors mt-4 md:mt-0 font-mono text-sm">
            VIEW GITHUB <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {visibleProjects.map((item: any, idx: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }} // Reduced delay for smoother load more
              onClick={() => handleViewProject(item)}
              className="group rounded-2xl bg-[#080808] border border-white/5 overflow-hidden hover:border-teal-500/30 transition-all cursor-pointer"
            >
              <div
                className="h-56 w-full relative overflow-hidden"
              // style={{
              //     background: item.image ? `url(${item.image}) center/cover` : '#111' 
              // }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  // priority={idx < 3} // optional: boosts LCP for first cards
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#111]" />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent`} />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[0.6rem] font-bold text-white uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-8 relative -mt-10">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent || 'from-teal-500 to-emerald-600'} mb-6 flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300`}
                >
                  <Code2 className="text-black w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>
                <button className="text-sm font-bold text-white flex items-center gap-2 hover:gap-3 transition-all">
                  CASE STUDY <ArrowRight className="w-4 h-4 text-teal-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination / Load More Button */}
        {hasMoreProjects && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-mono text-sm transition-all disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                    LOADING...
                  </>
                ) : (
                  <>
                    SHOW MORE PROJECTS
                    <ArrowRight className="w-4 h-4 group-hover:translate-y-1 transition-transform" style={{ transform: 'rotate(90deg)' }} />
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};