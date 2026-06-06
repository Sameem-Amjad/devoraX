"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    q: "How long does it take to build a product with Devora?",
    a: "It depends on scope, but our typical timeline is 4–6 weeks for an MVP, 8–16 weeks for a full-featured product, and 3–6 months for enterprise-grade platforms. After a free discovery call, we provide a detailed project timeline alongside a fixed-price proposal.",
  },
  {
    q: "How much does a project cost?",
    a: "Our MVP Starter package begins at $2,900, Growth projects from $7,500, and Enterprise work is custom-scoped. Every project gets a fixed-price proposal after the discovery call — no hourly billing, no surprise invoices. What we quote is what you pay.",
  },
  {
    q: "Do I own the code and IP when the project is done?",
    a: "100%. Full source code, all assets, and all intellectual property transfer to you on final payment. We also hand over clean documentation and onboarding materials so your internal team can take over confidently.",
  },
  {
    q: "Can you work with our existing codebase or team?",
    a: "Absolutely. We regularly embed within existing engineering teams as an extension squad — performing code reviews, adding new features, refactoring legacy systems, or taking over full ownership. We adapt to your workflow, not the other way around.",
  },
  {
    q: "What happens after launch?",
    a: "All plans include post-launch support. Starter gets 1 month, Growth gets 3 months, and Enterprise is covered by a long-term SLA. After the included period, we offer ongoing retainer packages for continued development, monitoring, and optimization.",
  },
  {
    q: "How do you handle project communication?",
    a: "You get direct Slack access to your team, weekly video demos of progress, a shared project board (Jira or Linear), and a dedicated project manager as your single point of contact. You'll never wonder what's happening — we over-communicate by design.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, on request before any discovery call. We treat every client's business model, technical specs, and proprietary information as strictly confidential, regardless of whether an NDA is in place.",
  },
  {
    q: "Can you help if we only have an idea — no specs yet?",
    a: "That's actually where we excel. Our Discovery Workshop is designed exactly for this: we help you define requirements, map user journeys, choose the right tech stack, and produce a full product spec — all before development starts.",
  },
];

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-32 bg-[#030303] border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(20,184,166,0.04)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Questions we{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              always get
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            No fluff — straight answers to the things every client asks before
            kicking off a project.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                openIdx === idx
                  ? "bg-[#0c0c0c] border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.08)]"
                  : "bg-[#080808] border-white/5 hover:border-white/12"
              }`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
              >
                <span
                  className={`font-semibold text-sm md:text-base transition-colors ${
                    openIdx === idx ? "text-white" : "text-gray-300"
                  }`}
                >
                  {faq.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIdx === idx
                      ? "bg-teal-500/20 text-teal-400"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {openIdx === idx ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIdx === idx && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-gray-600 text-sm">
            Still have questions?{" "}
            <a
              href="mailto:support@thedevorax.tech"
              className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
            >
              Email us directly →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
