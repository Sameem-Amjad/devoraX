import { Hero } from "@/components/sections/hero";
import getIcon from "@/utils/utils";
import { motion } from "framer-motion";
import { ArrowRight, Check, Code2, Star } from "lucide-react";

interface LandingPageProps {
  onOpenBooking: () => void;
  onViewProject: (project: any) => void;
  onViewService: (service: any) => void;
  projects: any[];
  services: any[];
}
export const LandingPage = ({ onOpenBooking, onViewProject, onViewService, projects, services }:LandingPageProps) => (
    <>
        <Hero onOpenBooking={onOpenBooking} />
        
        {/* Work Section */}
        <section id="work" className="py-32 bg-[#050505] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Selected Works</h2>
                <p className="text-gray-400 max-w-xl">High-impact digital products delivered for global clients.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {projects.map((item, idx) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group rounded-2xl bg-[#080808] border border-white/5 overflow-hidden hover:border-teal-500/30 transition-all cursor-pointer"
                    onClick={() => onViewProject(item)}
                >
                    <div className="h-56 w-full relative overflow-hidden" style={{ background: item.image }}>
                        <div className={`absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent`} />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            <span className="text-[0.6rem] font-bold text-white uppercase tracking-wider">{item.category}</span>
                        </div>
                    </div>
                    <div className="p-8 relative -mt-10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} mb-6 flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300`}>
                           <Code2 className="text-black w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{item.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">{item.description}</p>
                        <button className="text-sm font-bold text-white flex items-center gap-2 hover:gap-3 transition-all">
                            CASE STUDY <ArrowRight className="w-4 h-4 text-teal-500" />
                        </button>
                    </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 bg-black relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-white mb-6">Engineered for Scale</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Click a service to explore our specialized solutions.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => onViewService(service)}
                    className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-300">
                      {getIcon(service.icon || 'Code2')}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{service.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
        </section>

        {/* Pricing Section - Static for preview */}
        <section id="pricing" className="py-32 bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold text-white mb-4">Investment Plans</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[].map((plan: any, idx) => (
                        <div key={idx} className={`p-8 rounded-2xl border flex flex-col ${plan.highlight ? 'bg-gradient-to-b from-teal-900/10 to-black border-teal-500/50 shadow-[0_0_30px_rgba(45,212,191,0.1)]' : 'bg-[#0a0a0a] border-white/5'}`}>
                            <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-6 text-white">{plan.price}<span className="text-sm text-gray-500 font-normal">{plan.period}</span></div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((f:any, i:any) => (
                                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                                        <Check className="w-5 h-5 text-teal-500 flex-shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-4 rounded-lg font-bold transition-all ${plan.highlight ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-black hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* About/Trust Section */}
        <section id="about" className="py-32 bg-[#020202]">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <h2 className="text-3xl font-bold text-white mb-16">Trusted by Innovators</h2>
             <div className="grid md:grid-cols-3 gap-6">
               {[].map((t:any, i:any) => (
                 <div key={i} className="p-10 rounded-2xl bg-[#080808] border border-white/5 text-left hover:border-teal-500/30 transition-colors">
                   <div className="flex gap-1 mb-6">
                     {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 text-emerald-500 fill-emerald-500" />)}
                   </div>
                   <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">"{t.text}"</p>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-800 to-emerald-900 flex items-center justify-center font-bold text-white text-lg">
                       {t.avatar}
                     </div>
                     <div>
                       <div className="font-bold text-white">{t.name}</div>
                       <div className="text-xs text-teal-400 uppercase tracking-wider">{t.role}</div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>
    </>
);
