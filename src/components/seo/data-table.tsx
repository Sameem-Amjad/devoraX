import type { InsightTable } from '@/data/insights';
import { InlineText } from './rich-text';

/**
 * A data table for the research articles, checklists and door pages.
 *
 * Real <table> markup rather than styled divs: tabular data is
 * disproportionately extracted and quoted by AI answer engines, and that only
 * works if the structure is semantic. Cells may carry links in the content
 * files' [anchor](url) form, for a source column.
 */
export function DataTable({ table }: { table: InsightTable }) {
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
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
