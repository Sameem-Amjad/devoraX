import Link from 'next/link';
import { SERVICE_CASE_STUDIES } from '@/data/serviceContent';
import { getCaseStudy } from '@/data/caseStudyContent';

/**
 * Links a service page to the long-form case studies that prove it.
 *
 * Without this, every service page's only outbound project links went to 10-65
 * word stubs, while the ten 1,200+ word studies received no internal links at
 * all — the strongest pages on the site were the least connected. Descriptive,
 * varied anchor text (the study's real title) rather than "read more".
 */
export function RelatedCaseStudies({ serviceId }: { serviceId: number | string }) {
  const ids = SERVICE_CASE_STUDIES[Number(serviceId)] ?? [];
  const studies = ids.map((id) => ({ id, study: getCaseStudy(id) })).filter((s) => s.study);

  if (!studies.length) return null;

  return (
    <section className="mt-16 border-t border-white/5 pt-12">
      <h2 className="text-2xl font-bold text-white md:text-3xl">
        Case studies behind this service
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-400">
        Full engineering write-ups of products we shipped in this practice, including
        the architecture decisions and the outcomes the client reported.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {studies.map(({ id, study }) => (
          <Link
            key={id}
            href={`/projects/${id}`}
            className="group rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 transition-all hover:border-teal-500/40"
          >
            <h3 className="font-bold text-white transition-colors group-hover:text-teal-400">
              {study!.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {study!.meta_description}
            </p>
            <span className="mt-4 block font-mono text-xs uppercase tracking-widest text-teal-500/70">
              {study!.word_count.toLocaleString('en-US')}-word case study
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
