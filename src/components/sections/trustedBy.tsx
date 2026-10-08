"use client";
import { motion } from "framer-motion";
import { FIVERR_PROFILE_URL } from "@/data/testimonials";

// Checkable facts, not logos.
//
// This strip used to scroll eight product names (Dooz, Koor, Afriva, Pastel,
// WOD Pro League, TAL Services, Pathana, Loopedin) under "Trusted by ambitious
// companies worldwide". None of them is a DevoraX client: most are products
// Sameem worked on as an employee of other companies, and for the rest no client
// relationship is confirmed. Showing them as client logos claimed something that
// is not true. What a buyer can verify is the Fiverr record, so that is what this
// strip shows, with the link to check it.
const FACTS = [
  { value: "5.0", label: "Fiverr rating" },
  { value: "50+", label: "Fiverr projects since 2022" },
  { value: "US · UK · Canada · Hong Kong", label: "Where those clients are" },
];

export const TrustedBySection = () => {
  return (
    <section className="py-16 bg-[#020202] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-8"
        >
          Our client record, on Fiverr
        </motion.p>

        <div className="grid sm:grid-cols-3 gap-4">
          {FACTS.map((f) => (
            <div
              key={f.label}
              className="px-6 py-4 rounded-xl bg-white/[0.025] border border-white/[0.06]"
            >
              <div className="text-white font-semibold text-sm">{f.value}</div>
              <div className="text-gray-500 text-xs mt-1">{f.label}</div>
            </div>
          ))}
        </div>

        <a
          href={FIVERR_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 text-xs text-teal-400 underline underline-offset-4 hover:text-teal-300"
        >
          Check the profile on Fiverr
        </a>
      </div>
    </section>
  );
};
