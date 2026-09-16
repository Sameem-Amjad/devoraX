import type { Insight, InsightTable } from '@/data/insights';

/**
 * Renders a research article as a SERVER component.
 *
 * Tables are rendered as real <table> markup rather than styled divs: tabular
 * data is disproportionately extracted and quoted by AI answer engines, and that
 * only works if the structure is semantic. Same reason the limitations and
 * "what this cannot answer" blocks are real content, not footnotes — openly
 * stating the bounds of a dataset is what makes it worth citing.
 */
function DataTable({ table }: { table: InsightTable }) {
  return (
    <figure className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="mb-3 text-left text-xs uppercase tracking-widest text-teal-400">
          {table.caption}
        </caption>
        <thead>
          <tr className="border-b border-white/15">
            {table.headers.map((h) => (
              <th key={h} scope="col" className="py-3 pr-6 font-semibold text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5">
              {row.map((cell, j) => (
                <td key={j} className="py-3 pr-6 align-top text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function InsightArticle({ insight }: { insight: Insight }) {
  const paragraphs = (body: string) =>
    body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

  return (
    <article className="max-w-3xl">
      <p className="text-xl leading-relaxed text-gray-200">{insight.summary_answer}</p>

      <aside className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          About this dataset
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">{insight.dataset_note}</p>
      </aside>

      {insight.key_findings?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Key findings</h2>
          <ul className="mt-5 space-y-3">
            {insight.key_findings.map((f) => (
              <li key={f} className="flex gap-3 text-gray-200">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insight.sections.map((s) => (
        <section key={s.heading} className="mt-12">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{s.heading}</h2>
          {paragraphs(s.body).map((p, i) => (
            <p key={i} className="mt-4 leading-relaxed text-gray-400">
              {p}
            </p>
          ))}
          {s.table && <DataTable table={s.table} />}
        </section>
      ))}

      {insight.limitations?.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Limitations</h2>
          <ul className="mt-5 space-y-3">
            {insight.limitations.map((l) => (
              <li key={l} className="flex gap-3 text-gray-400">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
                <span className="leading-relaxed">{l}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {insight.cannot_answer && insight.cannot_answer.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            What this data cannot answer
          </h2>
          <ul className="mt-5 space-y-3">
            {insight.cannot_answer.map((c) => (
              <li key={c} className="flex gap-3 text-gray-400">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
