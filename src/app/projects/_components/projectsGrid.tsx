'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { VideoBadge } from '@/components/ui/videoBadge';
import { INDUSTRIES, getIndustry } from '@/data/industries';

export type ProjectCard = {
  id: number | string;
  title: string;
  image: string | null;
  featured: boolean;
  video: unknown;
  category: string | null;
  description: string | null;
  industry: string | null;
};

const ALL = 'all';

/**
 * The project grid with industry filter chips.
 *
 * The chosen industry lives in ?industry=, so a filtered view can be linked to:
 * the homepage's industry cards and each project's industry chip do. Choosing a
 * chip calls history.replaceState, which Next.js syncs into useSearchParams, so
 * there is no navigation and no second copy of the state.
 *
 * useSearchParams makes the page render this part in the browser, so the
 * Suspense fallback is the same grid unfiltered: every card stays in the
 * server HTML for crawlers, and filtering only hides cards.
 */
export function ProjectsGrid({ projects }: { projects: ProjectCard[] }) {
  return (
    <Suspense fallback={<Grid projects={projects} active={ALL} />}>
      <FilteredGrid projects={projects} />
    </Suspense>
  );
}

function FilteredGrid({ projects }: { projects: ProjectCard[] }) {
  const params = useSearchParams();
  const wanted = params.get('industry');
  const active = wanted && getIndustry(wanted) ? wanted : ALL;

  const choose = (slug: string) => {
    const next = new URLSearchParams(params.toString());
    if (slug === ALL) next.delete('industry');
    else next.set('industry', slug);
    const query = next.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  };

  return <Grid projects={projects} active={active} onChoose={choose} />;
}

function Grid({
  projects,
  active,
  onChoose,
}: {
  projects: ProjectCard[];
  active: string;
  onChoose?: (slug: string) => void;
}) {

  const counts = new Map<string, number>();
  for (const p of projects) if (p.industry) counts.set(p.industry, (counts.get(p.industry) ?? 0) + 1);
  const chips = [
    { slug: ALL, label: 'All', count: projects.length },
    ...INDUSTRIES.filter((i) => counts.has(i.slug)).map((i) => ({ ...i, count: counts.get(i.slug) ?? 0 })),
  ];
  const visible = active === ALL ? projects : projects.filter((p) => p.industry === active);

  return (
    <>
      <div role="group" aria-label="Filter projects by industry" className="flex flex-wrap gap-2 mb-10">
        {chips.map((chip) => {
          const on = chip.slug === active;
          return (
            <button
              key={chip.slug}
              type="button"
              aria-pressed={on}
              onClick={() => onChoose?.(chip.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-colors ${
                on
                  ? 'bg-teal-500 border-teal-500 text-black'
                  : 'border-white/10 text-gray-400 hover:border-teal-500/40 hover:text-teal-300'
              }`}
            >
              {chip.label}
              <span className={on ? 'text-black/60' : 'text-gray-600'}>{chip.count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {active === ALL
          ? `Showing all ${projects.length} projects`
          : `Showing ${visible.length} ${getIndustry(active)?.label} projects`}
      </p>

      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
        {projects.map((project) => {
          const hasImage = project.image && project.image !== 'null' && String(project.image).startsWith('http');
          const industry = getIndustry(project.industry);

          return (
            <li key={project.id} hidden={active !== ALL && project.industry !== active}>
              <Link
                href={`/projects/${project.id}`}
                className="group block h-full rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-teal-500/30 transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="h-52 relative overflow-hidden bg-[#111]">
                  {hasImage ? (
                    <Image
                      src={project.image as string}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-black flex items-center justify-center">
                      <span className="text-4xl font-bold text-teal-500/20 font-mono">{project.title?.charAt(0)}</span>
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-[0.6rem] font-bold uppercase tracking-wide">
                      Featured
                    </span>
                  )}
                  <VideoBadge video={project.video} className="absolute top-3 right-3" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {project.category && (
                    <div className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-2">
                      {project.category}
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors line-clamp-2">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                  {industry && (
                    <span className="inline-block mb-4 px-2.5 py-0.5 rounded-full border border-white/10 text-[0.65rem] text-gray-400">
                      {industry.label}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 group-hover:gap-2.5 transition-all">
                    View case study
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
