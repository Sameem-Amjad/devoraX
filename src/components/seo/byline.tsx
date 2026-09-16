/**
 * Visible attribution for long-form pages.
 *
 * The case studies, service pages and research articles carried no visible
 * author, no visible date and no statement of who produced the analysis — while
 * the Article structured data on the same pages asserted an author, a publisher
 * and a `dateModified`. Structured data is supposed to describe what is on the
 * page; when the page shows none of it, the markup is the only place those claims
 * exist, and a human assessor sees an unsigned, undated document.
 *
 * Everything here is checkable: the author is the organisation that did the work,
 * the date comes from the same constant the sitemap and the Article schema use,
 * and the reviewer link goes to the real profile.
 */
import Link from 'next/link';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function Byline({
  updated,
  kind = 'analysis',
}: {
  /** ISO date string — the same value the page's structured data reports. */
  updated: string;
  kind?: string;
}) {
  const date = formatDate(updated);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-white/5 pb-6 text-sm text-gray-500">
      <span>
        Written by the{' '}
        <Link
          href="/team"
          className="text-gray-300 underline underline-offset-4 hover:text-teal-400"
        >
          DevoraX engineering team
        </Link>
      </span>
      <span aria-hidden="true">·</span>
      <span>
        Reviewed by{' '}
        <Link
          href="/team"
          className="text-gray-300 underline underline-offset-4 hover:text-teal-400"
        >
          Sameem Amjad, Founder
        </Link>
      </span>
      {date && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Last updated <time dateTime={updated.slice(0, 10)}>{date}</time>
          </span>
        </>
      )}
      <span aria-hidden="true">·</span>
      <span className="text-gray-600">Based on our own delivery record ({kind})</span>
    </div>
  );
}
