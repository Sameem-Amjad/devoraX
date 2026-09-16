/**
 * Cross-links at the foot of a case study.
 *
 * The long-form pages carry 1,700–3,700 words each and, before this, one to four
 * internal links — all of them chrome (logo, back-link), none of them editorial.
 * A page that deep with no onward path is a leaf: it absorbs whatever authority
 * reaches it and passes none on, and a reader who finishes it has nowhere to go.
 *
 * Links are chosen by shared technology so they are genuinely related rather than
 * a random sample, and the anchor text names the destination.
 */
import Link from 'next/link';
import { CASE_STUDY_CONTENT } from '@/data/caseStudyContent';
import { SERVICE_CASE_STUDIES } from '@/data/serviceContent';
import { INSIGHTS } from '@/data/insights';

const SERVICE_LABEL: Record<number, string> = {
  1: 'Mobile App Development',
  2: 'AI & Full-Stack Web Development',
  3: 'Cloud Architecture & DevOps',
  4: 'UI/UX Design Systems',
};

function shortName(title: string) {
  const head = title.split(':')[0].trim();
  return head.length > 3 ? head : title;
}

/** Tokens shared between two studies, used to rank relatedness. */
function techTokens(text: string): Set<string> {
  const known = [
    'react native', 'flutter', 'next.js', 'react.js', 'node.js', 'nestjs',
    'typescript', 'python', 'aws', 'firebase', 'supabase', 'postgresql',
    'redis', 'socket.io', 'kubernetes', 'docker', 'serverless', 'lambda',
    'stripe', 'angular', 'graphql', 'elasticsearch',
  ];
  const lower = text.toLowerCase();
  return new Set(known.filter((k) => lower.includes(k)));
}

export function RelatedReading({ projectId }: { projectId: number | string }) {
  const id = Number(projectId);
  const current = CASE_STUDY_CONTENT[id];
  if (!current) return null;

  const currentTokens = techTokens(
    current.title + ' ' + current.summary_answer + ' ' + (current.stack_rationale || []).join(' ')
  );

  const siblings = Object.values(CASE_STUDY_CONTENT)
    .filter((c) => c.project_id !== id)
    .map((c) => {
      const t = techTokens(
        c.title + ' ' + c.summary_answer + ' ' + (c.stack_rationale || []).join(' ')
      );
      let shared = 0;
      for (const tok of currentTokens) if (t.has(tok)) shared++;
      return { study: c, shared };
    })
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 4)
    .filter((x) => x.shared > 0);

  // Which service practice does this project sit under?
  const serviceId = Object.entries(SERVICE_CASE_STUDIES).find(([, ids]) =>
    ids.includes(id)
  )?.[0];

  if (!siblings.length && !serviceId) return null;

  return (
    <aside className="mt-16 border-t border-white/5 pt-10" aria-labelledby="related-reading">
      <h2 id="related-reading" className="text-xl font-bold text-white">
        Related engineering work
      </h2>

      {siblings.length > 0 && (
        <ul className="mt-6 space-y-4">
          {siblings.map(({ study, shared }) => (
            <li key={study.project_id}>
              <Link
                href={`/projects/${study.project_id}`}
                className="font-medium text-teal-400 underline underline-offset-4 hover:text-teal-300"
              >
                {shortName(study.title)}
              </Link>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {study.summary_answer.split('. ')[0]}.
                {shared > 0 && (
                  <span className="text-gray-600">
                    {' '}
                    Shares {shared} {shared === 1 ? 'technology' : 'technologies'} with this
                    build.
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {serviceId && (
          <Link
            href={`/services/${serviceId}`}
            className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
          >
            {SERVICE_LABEL[Number(serviceId)]} service
          </Link>
        )}
        {INSIGHTS.slice(0, 2).map((a) => (
          <Link
            key={a.slug}
            href={`/insights/${a.slug}`}
            className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
          >
            {a.title}
          </Link>
        ))}
        <Link
          href="/case-study"
          className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
        >
          All case studies
        </Link>
      </div>
    </aside>
  );
}
