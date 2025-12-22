import { CircuitBackground } from "../ui/circuitBackground";
import { motion } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";
import { Mail } from "lucide-react";
export const Hero = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
      <CircuitBackground />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20 mb-10 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="text-sm font-medium text-teal-200 tracking-wide uppercase text-[0.7rem]">AI-Powered Development Agency</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1] mb-8"
        >
          We build the <br />
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${CONSTANTS.PRIMARY_GRADIENT} drop-shadow-[0_0_25px_rgba(45,212,191,0.3)]`}>
            Future of Tech
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          I’m <strong className="text-white">{CONSTANTS.CEO_NAME}</strong>. We fuse <span className="text-teal-400">AI innovation</span> with scalable engineering. 
          Expertise in React Native, Flutter, and Next.js to transform your vision into reality.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button 
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-black rounded-lg font-bold transition-all shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:shadow-[0_0_50px_rgba(45,212,191,0.6)] hover:scale-105"
          >
            Start Your Project
          </button>
          <a 
            href={`mailto:hello@devorax.com`}
            className="w-full sm:w-auto px-10 py-4 bg-black text-white border border-white/10 rounded-lg font-bold transition-all flex items-center justify-center gap-2 hover:bg-white/5 hover:border-teal-500/50 group"
          >
            <Mail className="w-5 h-5 group-hover:text-teal-400 transition-colors" /> Email Me
          </a>
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            { label: 'Projects Shipped', val: '100+' },
            { label: 'Years Leading', val: '5+' },
            { label: 'Client Success', val: '100%' },
            { label: 'Team Experts', val: '15+' },
          ].map((stat, i) => (
             <div key={i} className="text-center md:text-left">
                <div className="text-3xl font-bold text-white mb-1 font-mono">{stat.val}</div>
                <div className="text-[0.65rem] text-gray-500 uppercase tracking-[0.2em]">{stat.label}</div>
             </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};