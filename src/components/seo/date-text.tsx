/**
 * A data-file revision date ("2026-10-14T00:00:00.000Z") as "14 October 2026".
 *
 * Formatted in UTC: the dates are midnight UTC, and formatting them in the
 * build server's own time zone would print the day before anywhere west of
 * Greenwich.
 */
export function DateText({ iso }: { iso: string }) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return (
    <time dateTime={iso.slice(0, 10)}>
      {d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })}
    </time>
  );
}
