/**
 * The brand fact sheet: BRAND_FACTS as a definition list.
 *
 * /about (the entity home) and /press both render this one component, so the
 * two pages cannot disagree with each other, or with the Organization schema
 * and llms.txt, which read the same object. Journalists and directory editors
 * copy from it, so every value is printed exactly as data/brand.ts states it.
 */
import type { ReactNode } from 'react';
import { BRAND_FACTS, BRAND_FACTS_UPDATED } from '@/data/brand';
import { FIVERR_PROFILE_URL } from '@/data/testimonials';
import { DateText } from './date-text';

const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

const FACTS: { label: string; value: ReactNode }[] = [
  { label: 'Name', value: BRAND_FACTS.name },
  { label: 'Founded', value: BRAND_FACTS.founded },
  { label: 'Based in', value: BRAND_FACTS.basedIn },
  { label: 'Team', value: BRAND_FACTS.team },
  { label: 'What we do', value: BRAND_FACTS.whatWeDo },
  { label: "Who it's for", value: BRAND_FACTS.whoItIsFor },
  {
    label: 'Track record',
    value: (
      <>
        {BRAND_FACTS.trackRecord}{' '}
        {/* The one fact here a reader can check in a click, so it gets the link. */}
        <a
          href={FIVERR_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-1 block w-fit text-sm ${linkClass}`}
        >
          Check the profile on Fiverr
        </a>
      </>
    ),
  },
  // From the Fiverr record. Direct clients are wider (Dooz, in Jordan, hired
  // Sameem directly), so the label says whose countries these are.
  { label: 'Fiverr clients in', value: BRAND_FACTS.clientCountries },
  { label: 'Certifications', value: BRAND_FACTS.certifications },
  { label: 'Discovery-call hours', value: BRAND_FACTS.callHours },
  {
    label: 'Email',
    value: (
      <a href={`mailto:${BRAND_FACTS.salesEmail}`} className={linkClass}>
        {BRAND_FACTS.salesEmail}
      </a>
    ),
  },
];

export function FactSheet() {
  return (
    <>
      <dl className="divide-y divide-white/5 border-y border-white/10">
        {FACTS.map((f) => (
          <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="text-sm font-semibold text-white">{f.label}</dt>
            <dd className="leading-relaxed text-gray-400">{f.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-gray-400">
        Facts last updated <DateText iso={BRAND_FACTS_UPDATED} />.
      </p>
    </>
  );
}
