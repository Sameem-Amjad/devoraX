import { motion } from "framer-motion";
import { Cpu, Layout, Server, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
interface Service {
  icon: React.ReactNode;
  title: string;
  desc_text: string;
}

export const Services = ({ services ,setView,setActiveService}: { services: Service[], setView: React.Dispatch<React.SetStateAction<string>>, setActiveService: React.Dispatch<React.SetStateAction<any>> }) => {
  const router = useRouter();

  const handleViewService = (service: any) => {
    setView('services');
    setActiveService(service);
    router.push(`/services/${service.id}`);
  };

  return (
    
      <div className="py-32 bg-black relative border-t border-white/5">
      
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-6">Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Scale</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We don't just write code. We build intelligent, scalable digital ecosystems.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services?.map((service, idx) => (
            <motion.div 
              key={idx}
              onClick={() => handleViewService(service)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-300">
                {service.icon ==="Smartphone"?<Smartphone className="w-6 h-6" />:service.icon==="Cpu"?<Cpu className="w-6 h-6" />:service.icon==="Server"?<Server className="w-6 h-6" />:<Layout className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{service.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed relative z-10">{service.desc_text}</p>
            </motion.div>
          ))}
        </div>
        </div>
        </div>
    
  );
};