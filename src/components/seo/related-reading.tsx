/**
 * Cross-links at the foot of a project write-up.
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
import { INSIGHTS } from '@/data/insights';
import { isHiddenProject } from '@/data/projectIndex';

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

/**
 * The two research articles closest to this study, by the technologies and
 * topics named in each article's title. Ties (including every study that
 * matches nothing) rotate by project id, so the articles share the case
 * studies' links between them. This used to be `INSIGHTS.slice(0, 2)`, which
 * gave all 25 studies the same two articles and left the other three linked
 * from the /insights index alone.
 */
function relatedInsights(studyText: string, id: number) {
  const study = studyText.toLowerCase();
  const studyTokens = techTokens(study);
  return INSIGHTS.map((a, i) => {
    const title = a.title.toLowerCase();
    let score = 0;
    for (const tok of techTokens(title)) if (studyTokens.has(tok)) score++;
    for (const topic of ['marketplace', 'sharetribe', 'mvp']) {
      if (title.includes(topic) && study.includes(topic)) score++;
    }
    return { a, score, turn: (i + id) % INSIGHTS.length };
  })
    .sort((x, y) => y.score - x.score || x.turn - y.turn)
    .slice(0, 2)
    .map((x) => x.a);
}

export function RelatedReading({ projectId }: { projectId: number | string }) {
  const id = Number(projectId);
  const current = CASE_STUDY_CONTENT[id];
  if (!current) return null;

  const currentText =
    current.title + ' ' + current.summary_answer + ' ' + (current.stack_rationale || []).join(' ');
  const currentTokens = techTokens(currentText);

  const siblings = Object.values(CASE_STUDY_CONTENT)
    // Hidden projects (data/projectIndex.ts) 404, so they are never suggested.
    .filter((c) => c.project_id !== id && !isHiddenProject(c.project_id))
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

  // The services link below always renders, so the section does too. It used
  // to name the practice the project sat under ("Mobile App Development
  // service") and link its /services/{id} page; those pages redirect now
  // (next.config.ts), and /services lists every door page instead.

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
        <Link
          href="/services"
          className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
        >
          Services and prices
        </Link>
        {relatedInsights(currentText, id).map((a) => (
          <Link
            key={a.slug}
            href={`/insights/${a.slug}`}
            className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
          >
            {a.title}
          </Link>
        ))}
        {/* Was "All case studies" to /case-study, which now redirects to /projects. */}
        <Link
          href="/projects"
          className="text-gray-400 underline underline-offset-4 hover:text-teal-400"
        >
          See all work
        </Link>
      </div>
    </aside>
  );
}
