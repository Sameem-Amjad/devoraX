import Link from 'next/link';
import type { ChecklistItem, Insight } from '@/data/insights';
import { INSIGHTS, insightUpdated, isChecklist } from '@/data/insights';
import { Byline } from './byline';
import { DataTable } from './data-table';
import { InlineText, RichText } from './rich-text';

/**
 * Renders a research article or a checklist as a SERVER component.
 *
 * Tables are real <table> markup (data-table.tsx). The limitations and "what
 * this cannot answer" blocks are real content, not footnotes, for the same
 * reason: openly stating the bounds of a dataset is what makes it worth citing.
 *
 * A checklist's items come straight after its opening note, because they are
 * what the page is for; its sections (method, what a scan covers, the
 * due-diligence notes) follow them. Each item sits at #item-{id}: the door
 * pages and the checklist's GitHub repo link to those anchors, so an item's id
 * never changes once it is published.
 */

type ItemGroup = { name: string; anchor: string; first: number; items: ChecklistItem[] };

/** Items under their group headings, in order of first appearance, numbered 1..n across groups. */
function groupItems(items: ChecklistItem[]): ItemGroup[] {
  const groups: ItemGroup[] = [];
  for (const item of items) {
    const group = groups.find((g) => g.name === item.group);
    if (group) group.items.push(item);
    else {
      const anchor = item.group.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      groups.push({ name: item.group, anchor: `group-${anchor}`, first: 0, items: [item] });
    }
  }
  // Numbered in the order shown, which is grouped order, not data order.
  let n = 1;
  for (const g of groups) {
    g.first = n;
    n += g.items.length;
  }
  return groups;
}

function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <section aria-labelledby="checklist-heading" className="mt-12">
      <h2 id="checklist-heading" className="text-2xl font-bold text-white md:text-3xl">
        The checklist: {items.length} checks
      </h2>
      {groupItems(items).map((g) => (
        <div key={g.anchor} id={g.anchor} className="mt-10 scroll-mt-32">
          <h3 className="text-xl font-bold text-white">{g.name}</h3>
          {/* overflow-wrap: anywhere on each item, inherited by its check, why
              and test: a test quotes requests, URLs and code with nowhere to
              break, and at 320px one pushed the page sideways. Not on the
              whole article, whose tables scroll in their own box. */}
          <ol className="mt-5 list-none space-y-4">
            {g.items.map((item, i) => (
              <li
                key={item.id}
                id={`item-${item.id}`}
                className="scroll-mt-32 rounded-xl border border-white/10 bg-[#0a0a0a] p-6 [overflow-wrap:anywhere]"
              >
                <p className="font-semibold leading-relaxed text-white">
                  <span className="mr-2 font-mono text-sm text-teal-500/70">{g.first + i}.</span>
                  <InlineText text={item.check} />{' '}
                  <a
                    href={`#item-${item.id}`}
                    aria-label={`Link to check ${g.first + i}`}
                    className="font-normal text-gray-500 hover:text-teal-400"
                  >
                    #
                  </a>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  <span className="text-gray-300">Why it matters: </span>
                  <InlineText text={item.why} />
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  <span className="text-gray-300">How to test it: </span>
                  <InlineText text={item.test} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

export function InsightArticle({ insight }: { insight: Insight }) {
  const checklist = isChecklist(insight);
  const keyFindings = insight.key_findings ?? [];

  return (
    <article className="max-w-3xl">
      <Byline updated={insightUpdated(insight)} kind={checklist ? 'checklist' : 'research'} />
      <p className="mt-8 text-xl leading-relaxed text-gray-200">
        <InlineText text={insight.summary_answer} />
      </p>

      {insight.dataset_note && (
        <aside className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            {checklist ? 'About this checklist' : 'About this dataset'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            <InlineText text={insight.dataset_note} />
          </p>
        </aside>
      )}

      {keyFindings.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Key findings</h2>
          <ul className="mt-5 space-y-3">
            {keyFindings.map((f) => (
              <li key={f} className="flex gap-3 text-gray-200">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                <span className="leading-relaxed">
                  <InlineText text={f} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {checklist && <Checklist items={insight.items} />}

      {insight.sections.map((s) => (
        <section key={s.heading} id={s.id} className={s.id ? 'mt-12 scroll-mt-32' : 'mt-12'}>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{s.heading}</h2>
          <RichText text={s.body} />
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
                <span className="leading-relaxed">
                  <InlineText text={l} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {insight.cannot_answer && insight.cannot_answer.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            {checklist ? 'What this checklist cannot answer' : 'What this data cannot answer'}
          </h2>
          <ul className="mt-5 space-y-3">
            {insight.cannot_answer.map((c) => (
              <li key={c} className="flex gap-3 text-gray-400">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
                <span className="leading-relaxed">
                  <InlineText text={c} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Without this an article was a dead end: linked from the /insights index
          and nowhere else, with no onward path to the rest of the research. */}
      <nav aria-labelledby="more-research" className="mt-16 border-t border-white/5 pt-10">
        <h2 id="more-research" className="text-xl font-bold text-white">
          More research from DevoraX
        </h2>
        <ul className="mt-6 space-y-4">
          {INSIGHTS.filter((a) => a.slug !== insight.slug).map((a) => (
            <li key={a.slug}>
              <Link
                href={`/insights/${a.slug}`}
                className="font-medium text-teal-400 underline underline-offset-4 hover:text-teal-300"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
