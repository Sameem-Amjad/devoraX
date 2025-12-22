"use client";
import { useEffect, useState } from "react";
import Logo from "../global/logo";
import { Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
export const Navbar = ({ onOpenBooking, setView, activeView }: { onOpenBooking: () => void, setView: (view: string) => void, activeView: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (id: any) => {
    setView('home');
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Logo /></div>

        <div className="hidden md:flex items-center gap-8">
          {["About", "Work", "Services", "Pricing"].map((item) => (
            <a
              key={item}
              onClick={() => handleNav(item.toLowerCase())}
              className="
      relative cursor-pointer
      text-sm font-medium text-gray-400
      transition-colors duration-300
      hover:text-teal-400
      group
    "
            >
              {item}

              {/* Animated underline */}
              <span
                className="
        pointer-events-none
        absolute left-0 -bottom-1
        h-[2px] w-full
        origin-left scale-x-0
        bg-gradient-to-r from-cyan-400 to-emerald-400
        transition-transform duration-300 ease-out
        group-hover:scale-x-100
        drop-shadow-[0_0_8px_rgba(45,212,191,0.7)]
      "
              />
            </a>
          ))}

          <button
            onClick={onOpenBooking}
            className="bg-white/5 hover:bg-teal-500/10 text-white border border-white/10 hover:border-teal-500/50 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all group"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-teal-300 group-hover:to-emerald-300">Book a Call</span>
          </button>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {['About', 'Work', 'Services', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">
                  {item}
                </a>
              ))}
              <button onClick={() => { setIsOpen(false); onOpenBooking(); }} className="bg-teal-600 text-white w-full py-3 rounded-xl font-semibold mt-4">
                Book a Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};