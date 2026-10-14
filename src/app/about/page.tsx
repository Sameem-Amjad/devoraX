import Link from 'next/link';
import {
  BRAND_FACTS_UPDATED,
  ENTITY_STATEMENT,
  FOUNDER_PROFILES,
  ORG_PROFILES,
} from '@/data/brand';
import { FIT, OFFER_LADDER, POSITIONING } from '@/data/offer';
import { TESTIMONIAL_STATS } from '@/data/testimonials';
import { ORGANIZATION_ID, breadcrumbNode, pageMetadata, webPageNode } from '@/lib/seo';
import { JsonLd } from '@/components/seo/structured-data';
import { BreadcrumbTrail } from '@/components/seo/breadcrumb-trail';
import { FactSheet } from '@/components/seo/fact-sheet';
import { BookCallCta } from '@/components/seo/book-call-cta';

/**
 * The entity home (SEO guide §11.1): the one page that says who DevoraX is.
 *
 * Search engines and AI assistants reconcile a company's facts across every
 * page and profile that describes it, and they weight the page the company
 * calls its own. So this page opens with the entity statement word for word,
 * shows the shared fact sheet, and links out to each profile the studio
 * controls. Every fact comes from data/brand.ts or data/offer.ts.
 */

const PATH = '/about';
const H1 = 'About DevoraX';
const DESCRIPTION =
  'Who DevoraX is: a two-person software studio, founded in 2022 and based in Pakistan. Fact sheet, the two engineers, how we work and who it is for.';
const TRAIL = [{ name: 'About', path: PATH }];

export const metadata = pageMetadata({
  title: 'About DevoraX: Who We Are and How We Work',
  description: DESCRIPTION,
  path: PATH,
  imageAlt: 'About DevoraX',
});

const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

/** "https://www.linkedin.com/in/sameem-amjad-dev/" → "linkedin.com/in/sameem-amjad-dev". */
function shortUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

/** The founder's profiles say whose they are, so they never read as the studio's. */
function founderLinkText(label: string) {
  return label === 'Personal site' ? "Sameem Amjad's personal site" : `Sameem Amjad on ${label}`;
}

export default function AboutPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            type: 'AboutPage',
            name: H1,
            description: DESCRIPTION,
            about: ORGANIZATION_ID,
            mainEntity: ORGANIZATION_ID,
            dateModified: BRAND_FACTS_UPDATED,
          }),
          breadcrumbNode(PATH, TRAIL),
        ]}
      />
      <main id="main-content" className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <BreadcrumbTrail trail={TRAIL} />
          <h1 className="text-4xl font-bold text-white md:text-5xl">{H1}</h1>

          {/* The entity statement, verbatim. Never paraphrase it here: this is
              the sentence every other description of DevoraX should match. */}
          <p className="mt-6 text-xl leading-relaxed text-gray-200">{ENTITY_STATEMENT}</p>
          <p className="mt-4 leading-relaxed text-gray-400">
            The people you talk to are the people writing the code.
          </p>

          <section aria-labelledby="fact-sheet" className="mt-14">
            <h2 id="fact-sheet" className="text-2xl font-bold text-white">
              DevoraX fact sheet
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              The same facts appear in the{' '}
              <Link href="/press" className={linkClass}>
                DevoraX press kit
              </Link>
              .
            </p>
            <div className="mt-6">
              <FactSheet />
            </div>
          </section>

          <section aria-labelledby="who-runs" className="mt-14">
            <h2 id="who-runs" className="text-2xl font-bold text-white">
              Who runs DevoraX?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              Two people: two senior engineers who build every project and bring in
              specialists when a scope needs them.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
                <p className="font-semibold text-white">
                  Sameem Amjad, Founder &amp; Lead Architect Engineer
                </p>
                <p className="mt-2 leading-relaxed text-gray-400">
                  A software engineer specializing in scalable backend architectures and
                  high-performance full-stack ecosystems.
                </p>
              </li>
              <li className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
                <p className="font-semibold text-white">Usman, CTO</p>
                <p className="mt-2 leading-relaxed text-gray-400">
                  A full-stack AI architect who leads architecture and DevOps across React
                  Native, Flutter and high-concurrency web on Kubernetes and AWS.
                </p>
              </li>
            </ul>
            <p className="mt-6 leading-relaxed text-gray-400">
              You talk directly to the engineers doing the work, Sameem or Usman. There is
              no account manager in between.{' '}
              <Link href="/team" className={linkClass}>
                Read Sameem&apos;s and Usman&apos;s profiles on the team page
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="engagement" className="mt-14">
            <h2 id="engagement" className="text-2xl font-bold text-white">
              How does an engagement work?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              For an app you already have, the work runs in steps, from a free call to
              monthly care after launch. Start at the top and stop wherever you like.
            </p>
            <ol className="mt-6 list-decimal space-y-4 pl-6 marker:font-mono marker:text-teal-500">
              {OFFER_LADDER.map((s) => (
                <li key={s.title} className="pl-2">
                  <p className="font-semibold text-white">{s.title}</p>
                  <p className="mt-1 leading-relaxed text-gray-400">{s.body}</p>
                  <p className="mt-2 text-sm font-semibold text-teal-400">{s.price}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 leading-relaxed text-gray-400">
              New builds from scratch use the fixed-price MVP packages (from $2,900 and from
              $7,500).{' '}
              <Link href="/pricing" className={linkClass}>
                See every price, and how the total is set
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="fit" className="mt-14">
            <h2 id="fit" className="text-2xl font-bold text-white">
              Who is DevoraX for, and who isn&apos;t it for?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">{POSITIONING.audience}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/[0.03] p-6">
                <h3 className="text-lg font-bold text-white">A good fit</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-gray-300 marker:text-teal-400">
                  {FIT.good.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
                <h3 className="text-lg font-bold text-white">Not a fit</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-gray-400 marker:text-gray-600">
                  {FIT.notFit.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="profiles" className="mt-14">
            <h2 id="profiles" className="text-2xl font-bold text-white">
              Where else can you find DevoraX?
            </h2>
            {/* Only while the studio has profiles of its own (data/brand.ts). */}
            {ORG_PROFILES.length > 0 && (
              <>
                <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
                  The studio&apos;s profiles
                </h3>
                <ul className="mt-3 space-y-2">
                  {ORG_PROFILES.map((p) => (
                    <li key={p.url}>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        DevoraX on {p.label}
                      </a>{' '}
                      <span className="text-sm text-gray-400">{shortUrl(p.url)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Sameem Amjad&apos;s profiles
            </h3>
            <ul className="mt-3 space-y-2">
              {FOUNDER_PROFILES.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {founderLinkText(p.label)}
                  </a>{' '}
                  <span className="text-sm text-gray-400">{shortUrl(p.url)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 leading-relaxed text-gray-400">
              For a description you can quote, logo files and bios, use the{' '}
              <Link href="/press" className={linkClass}>
                press kit
              </Link>
              . For what clients have said, read{' '}
              <Link href="/reviews" className={linkClass}>
                the {TESTIMONIAL_STATS.totalReviews} client reviews quoted from Fiverr
              </Link>
              .
            </p>
          </section>

          <BookCallCta />
        </div>
      </main>
    </>
  );
}
