/**
 * The body of the /services hub: the door sections and the market pages.
 *
 * Rebuilt on 7 Nov 2026 around the three door pages. The hub used to describe
 * four practices (mobile, web and AI, cloud, UI/UX), each with its own
 * /services/{id} page; those pages now redirect (next.config.ts), and a founder
 * with a stuck app was left to work out which practice their problem belonged
 * to. Each door section is two or three sentences from data/offer.ts, a price
 * line generated from the steps its page sells, and one link whose anchor text
 * is the page's nav_label, the name every link to it uses.
 *
 * Server components, so every link is in the initial HTML. Plain <div>s, never
 * <article>s: extractors such as trafilatura take the first <article> on a
 * page as its whole body.
 */
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DOOR_LINKS, MARKETPLACE_LINK, MARKET_LINKS, type WayIn } from '@/data/siteNav';

const linkClass =
  'inline-flex items-center gap-1.5 font-semibold text-teal-400 underline underline-offset-4 hover:text-teal-300';

function DoorLink({ door }: { door: WayIn }) {
  return (
    <Link href={door.href} className={linkClass}>
      {door.anchor}
      <ArrowRight aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
    </Link>
  );
}

/** The three doors, then new marketplace builds. Each block's id is an anchor. */
export function DoorSections() {
  return (
    <section aria-labelledby="doors-heading" className="py-20 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 id="doors-heading" className="text-3xl md:text-4xl font-bold text-white">
          Where is your app stuck?
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-gray-400">
          Three ways in for an app you already have. Each page sets out what we check and do,
          what it costs, the terms, and whose work stands behind it.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {DOOR_LINKS.map((d) => (
            <div
              key={d.id}
              id={d.id}
              className="scroll-mt-32 flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-8"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                {d.label}
              </span>
              <h3 className="mt-3 text-xl font-bold text-white">{d.title}</h3>
              <p className="mt-4 flex-grow leading-relaxed text-gray-400">{d.body}</p>
              {d.price && (
                <p className="mt-5 border-t border-white/5 pt-4 text-sm font-semibold text-gray-300">
                  {d.price}
                </p>
              )}
              <p className="mt-5">
                <DoorLink door={d} />
              </p>
            </div>
          ))}
        </div>

        <div
          id={MARKETPLACE_LINK.id}
          className="scroll-mt-32 mt-6 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 md:flex md:items-start md:gap-12"
        >
          <div className="md:w-1/3">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
              {MARKETPLACE_LINK.label}
            </span>
            <h3 className="mt-3 text-xl font-bold text-white">{MARKETPLACE_LINK.title}</h3>
          </div>
          <div className="mt-4 md:mt-0 md:flex-1">
            <p className="leading-relaxed text-gray-400">{MARKETPLACE_LINK.body}</p>
            <p className="mt-5">
              <DoorLink door={MARKETPLACE_LINK} />
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Another kind of app from scratch? New builds use the{' '}
              <Link
                href="/pricing#new-builds"
                className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
              >
                fixed-price MVP packages
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The vertical pages other than the hub. The footer used to link the first six
 * solution pages; it carries only the doors and the hub now, so this list is
 * what keeps every market page one click from a page linked site-wide.
 */
export function MarketPages() {
  if (!MARKET_LINKS.length) return null;
  return (
    <section aria-labelledby="markets-heading" className="py-20 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 id="markets-heading" className="text-3xl md:text-4xl font-bold text-white">
          Pages for specific markets
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-gray-400">
          Each one rests on a named product Sameem Amjad worked on, most of them as an employee
          of other companies, and says whose work it was.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MARKET_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-gray-300 underline underline-offset-4 hover:text-teal-400"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
