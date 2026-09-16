/**
 * Long-form body for the /services hub.
 *
 * The hub carried 165 words — a heading, a grid of four cards and a closing
 * paragraph — for a URL that has to compete on commercial queries. It also had no
 * question-form headings and no comparison table anywhere on the site, which are
 * the two structures generative engines extract most reliably.
 *
 * Every sentence here is assembled from `SERVICE_CONTENT`, which was already
 * written from the real `services` and `projects` rows and put through an
 * adversarial fact-check. Nothing new is asserted.
 */
import Link from 'next/link';
import { SERVICE_CONTENT } from '@/data/serviceContent';
import { SERVICE_CASE_STUDIES } from '@/data/serviceContent';
import { CASE_STUDY_CONTENT } from '@/data/caseStudyContent';

const SERVICE_ORDER = [1, 2, 3, 4];

/** Short, checkable summaries of what each practice covers. */
const AT_A_GLANCE: Record<
  number,
  { anchor: string; typical: string; stack: string }
> = {
  1: {
    anchor: 'Mobile App Development',
    typical: 'iOS and Android from one codebase',
    stack: 'React Native, Flutter, Node.js, Firebase',
  },
  2: {
    anchor: 'AI & Full-Stack Web Development',
    typical: 'Web platforms and AI-backed features',
    stack: 'Next.js, TypeScript, Python, Supabase',
  },
  3: {
    anchor: 'Cloud Architecture & DevOps',
    typical: 'Backend infrastructure and deployment',
    stack: 'AWS, Docker, Kubernetes, serverless',
  },
  4: {
    anchor: 'UI/UX Design Systems',
    typical: 'Interface design and design systems',
    stack: 'Figma, design tokens, component libraries',
  },
};

function shortName(title: string) {
  const head = title.split(':')[0].trim();
  return head.length > 3 ? head : title;
}

export function ServicesHubContent() {
  const services = SERVICE_ORDER.map((id) => SERVICE_CONTENT[id]).filter(Boolean);

  // Pick a spread of FAQs across the four services rather than all from one.
  const faqs = services.flatMap((s) => (s.faq || []).slice(0, 2)).slice(0, 8);

  return (
    <>
      {/* ── Comparison table ── */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Which service does your project need?
          </h2>
          <p className="mt-5 leading-relaxed text-gray-400">
            Most projects start in one practice and pull in a second. A mobile app
            needs a backend; a web platform needs infrastructure; both need an
            interface. The table below is the quickest way to find where yours
            starts.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                DevoraX services compared by typical build and core technology stack
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="py-3 pr-4 font-semibold text-white">
                    Service
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-white">
                    Typical build
                  </th>
                  <th scope="col" className="py-3 font-semibold text-white">
                    Core stack
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  const g = AT_A_GLANCE[s.service_id];
                  return (
                    <tr key={s.service_id} className="border-b border-white/5 align-top">
                      <th scope="row" className="py-4 pr-4 font-medium">
                        <Link
                          href={`/services/${s.service_id}`}
                          className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
                        >
                          {g.anchor}
                        </Link>
                      </th>
                      <td className="py-4 pr-4 text-gray-400">{g.typical}</td>
                      <td className="py-4 text-gray-400">{g.stack}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Per-service detail, each heading a question ── */}
      <section className="py-20 border-t border-white/5 bg-[#030303]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            What does each service cover?
          </h2>

          <div className="mt-12 space-y-14">
            {services.map((s) => {
              const g = AT_A_GLANCE[s.service_id];
              const studyIds = SERVICE_CASE_STUDIES[s.service_id] || [];
              return (
                <article key={s.service_id}>
                  <h3 className="text-xl font-bold text-white">
                    What is included in {g.anchor.toLowerCase()}?
                  </h3>
                  <p className="mt-4 leading-relaxed text-gray-400">{s.hero_answer}</p>

                  {s.deliverables?.length > 0 && (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {s.deliverables.slice(0, 6).map((d) => (
                        <li key={d} className="flex gap-2 text-sm text-gray-500">
                          <span aria-hidden="true" className="text-teal-500">
                            —
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <Link
                      href={`/services/${s.service_id}`}
                      className="font-semibold text-teal-400 underline underline-offset-4 hover:text-teal-300"
                    >
                      Full {g.anchor.toLowerCase()} details
                    </Link>
                    {studyIds.slice(0, 3).map((pid) => {
                      const study = CASE_STUDY_CONTENT[pid];
                      if (!study) return null;
                      return (
                        <Link
                          key={pid}
                          href={`/projects/${pid}`}
                          className="text-gray-500 underline underline-offset-4 hover:text-teal-400"
                        >
                          {shortName(study.title)} case study
                        </Link>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ, rendered with <details> so every answer is in the HTML ── */}
      {faqs.length > 0 && (
        <section className="py-20 border-t border-white/5">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Common questions about working with us
            </h2>
            <div className="mt-10 space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-white/5 bg-[#0a0a0a] p-6 open:border-teal-500/30"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-300 group-open:text-white [&::-webkit-details-marker]:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-gray-400">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** FAQPage schema for the hub, built from the same array the page renders. */
export function servicesHubFaqSchema(baseUrl: string) {
  const services = SERVICE_ORDER.map((id) => SERVICE_CONTENT[id]).filter(Boolean);
  const faqs = services.flatMap((s) => (s.faq || []).slice(0, 2)).slice(0, 8);
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}/services#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
