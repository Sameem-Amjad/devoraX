import Link from "next/link";
import { OFFER_LADDER } from "@/data/offer";

/**
 * Compact offer ladder for the home pricing section: step, title and how it is
 * priced. The full version, with what each step covers and who it is for, is
 * on /services (src/components/seo/offer-ladder.tsx). Same data, one source.
 */
export const OfferSteps = () => (
  <div className="mb-20">
    <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none">
      {OFFER_LADDER.map((s, i) => (
        <li key={s.title} className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-teal-500/70">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-semibold text-white">{s.title}</span>
          </div>
          <p className="mt-2 text-xs text-teal-400">{s.price}</p>
        </li>
      ))}
    </ol>
    <p className="mt-5 text-center text-sm text-gray-500">
      <Link href="/services#how-we-work" className="text-teal-400 underline underline-offset-4 hover:text-teal-300">
        What each step covers, and who it is for
      </Link>
    </p>
  </div>
);
