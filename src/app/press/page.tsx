import Image from 'next/image';
import { BRAND_FACTS, BRAND_FACTS_UPDATED, ENTITY_STATEMENT } from '@/data/brand';
import { POSITIONING } from '@/data/offer';
import { ORGANIZATION_ID, breadcrumbNode, pageMetadata, webPageNode } from '@/lib/seo';
import { JsonLd } from '@/components/seo/structured-data';
import { BreadcrumbTrail } from '@/components/seo/breadcrumb-trail';
import { FactSheet } from '@/components/seo/fact-sheet';
import { BookCallCta } from '@/components/seo/book-call-cta';

/**
 * The press kit (SEO guide §8.2.1): boilerplate, fact sheet, logo files, bios
 * and photos, and a contact, so a journalist or directory editor can describe
 * DevoraX without guessing.
 *
 * There is deliberately no "as featured in" strip and no coverage list: there
 * is no coverage to list, and the guide names bought "as featured in" logos as
 * a common mistake. Add a coverage log here when there is real coverage.
 */

const PATH = '/press';
const H1 = 'DevoraX press kit';
const DESCRIPTION =
  'The DevoraX press kit: a short and a long company description, the fact sheet, logo files, bios and photos of the two engineers, and the press contact.';
const TRAIL = [{ name: 'Press kit', path: PATH }];

export const metadata = pageMetadata({
  title: 'Press Kit: DevoraX Brand Facts and Logos',
  description: DESCRIPTION,
  path: PATH,
  imageAlt: 'DevoraX press kit',
});

const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

/** "For founders whose…" → "for founders whose…", to set a sentence into another. */
function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// Composed only from data/brand.ts and data/offer.ts, so it changes when they do
// and cannot drift from the fact sheet beneath it.
const LONG_BOILERPLATE =
  `DevoraX finishes and ships stuck apps ${lowerFirst(POSITIONING.audience)} ` +
  `The work covers ${lowerFirst(POSITIONING.promise)} ` +
  `Founded in ${BRAND_FACTS.founded} and based in ${BRAND_FACTS.basedIn}, ` +
  `DevoraX is ${lowerFirst(BRAND_FACTS.team)}. ` +
  `Its public track record is ${BRAND_FACTS.trackRecord}, for clients in the ${BRAND_FACTS.clientCountries}.`;

// Both files are the mark as served elsewhere on the site: /logo.png is the
// Organization schema's logo, and /favicon.svg is the site icon.
const LOGOS = [
  {
    src: '/logo.png',
    download: 'devorax-logo.png',
    format: 'PNG, 512 × 512 pixels',
    alt: 'The DevoraX mark: a cyan-to-green X on a black square',
    linkText: 'Download the PNG logo',
  },
  {
    src: '/favicon.svg',
    download: 'devorax-mark.svg',
    format: 'SVG, scales to any size',
    alt: 'The DevoraX mark: a cyan-to-green X on a rounded black square',
    linkText: 'Download the SVG logo',
  },
];

// Bios restate what /team already publishes about each person, in the third person.
const PEOPLE = [
  {
    name: 'Sameem Amjad',
    role: 'Founder & Lead Architect Engineer',
    photo: { src: '/images/profile_image.jpg', width: 1254, height: 1254 },
    alt: 'Sameem Amjad, Founder and Lead Architect Engineer of DevoraX',
    bio: [
      'Sameem Amjad founded DevoraX and is its Lead Architect Engineer. He is a software engineer specializing in scalable backend architectures and high-performance full-stack ecosystems, and runs the two-person studio with Usman, its CTO. He works remotely from Pakistan, with clients in the US, UK, Canada and Hong Kong.',
      'He has taken 50+ projects on Fiverr since 2022, where his profile holds a 5.0 rating. As an engineer at Zencloud and Webrange Solutions, he worked on real-time fitness leaderboards, marketplaces and a Danish power-of-attorney service built to GDPR requirements, across the MERN stack, Next.js, cloud infrastructure and mobile apps. He holds a B.Sc. in Computer Science from COMSATS University (2023).',
    ],
  },
  {
    name: 'Usman',
    role: 'CTO',
    photo: { src: '/images/usman_cto.jpeg', width: 1182, height: 1600 },
    alt: 'Usman, CTO of DevoraX',
    bio: [
      'Usman is the CTO of DevoraX. A full-stack AI architect with 5+ years building scalable generative-AI systems, custom web apps and SaaS platforms, he leads architecture and DevOps across React Native, Flutter and high-concurrency web on Kubernetes and AWS. He works remotely from Pakistan.',
    ],
  },
];

export default function PressPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: PATH,
            name: H1,
            description: DESCRIPTION,
            about: ORGANIZATION_ID,
            dateModified: BRAND_FACTS_UPDATED,
          }),
          breadcrumbNode(PATH, TRAIL),
        ]}
      />
      <main id="main-content" className="min-h-screen bg-black pb-24 pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <BreadcrumbTrail trail={TRAIL} />
          <h1 className="text-4xl font-bold text-white md:text-5xl">{H1}</h1>
          <p className="mt-6 text-xl leading-relaxed text-gray-200">
            This is the DevoraX press kit: the company description in a short and a long
            version, the fact sheet, logo files, bios and photos of the two people who run
            the studio, and the email address for press questions.
          </p>

          <section aria-labelledby="boilerplate" className="mt-14">
            <h2 id="boilerplate" className="text-2xl font-bold text-white">
              How should DevoraX be described?
            </h2>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Short description
            </h3>
            <p className="mt-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-5 leading-relaxed text-gray-300">
              {ENTITY_STATEMENT}
            </p>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Long description
            </h3>
            <p className="mt-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-5 leading-relaxed text-gray-300">
              {LONG_BOILERPLATE}
            </p>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-gray-400">
              The name
            </h3>
            <p className="mt-3 leading-relaxed text-gray-400">
              Write it <strong className="text-white">{BRAND_FACTS.name}</strong>: one word,
              with a capital D and a capital X.
            </p>
          </section>

          <section aria-labelledby="fact-sheet" className="mt-14">
            <h2 id="fact-sheet" className="text-2xl font-bold text-white">
              DevoraX fact sheet
            </h2>
            <div className="mt-6">
              <FactSheet />
            </div>
          </section>

          <section aria-labelledby="logos" className="mt-14">
            <h2 id="logos" className="text-2xl font-bold text-white">
              Logo files
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {LOGOS.map((l) => (
                <li key={l.src} className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
                  {/* A plain <img>, not next/image: the preview is the exact file
                      the link below downloads, not a re-encoded copy of it. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.src} width={128} height={128} alt={l.alt} loading="lazy" className="h-32 w-32" />
                  <p className="mt-4 text-sm text-gray-400">{l.format}</p>
                  <a href={l.src} download={l.download} className={`mt-2 inline-block ${linkClass}`}>
                    {l.linkText}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="bios" className="mt-14">
            <h2 id="bios" className="text-2xl font-bold text-white">
              Who runs DevoraX?
            </h2>
            {/* <div>s, not <article>s: extractors such as trafilatura take the
                first <article> as the page's whole body, which would reduce this
                page to one bio. */}
            <div className="mt-6 space-y-8">
              {PEOPLE.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col gap-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-6 sm:flex-row"
                >
                  <Image
                    src={p.photo.src}
                    width={p.photo.width}
                    height={p.photo.height}
                    alt={p.alt}
                    loading="lazy"
                    sizes="144px"
                    className="h-auto w-36 shrink-0 self-start rounded-xl"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-teal-400">{p.role}</p>
                    {p.bio.map((para) => (
                      <p key={para.slice(0, 32)} className="mt-3 leading-relaxed text-gray-400">
                        {para}
                      </p>
                    ))}
                    {/* The original file, not the resized preview above. */}
                    <a href={p.photo.src} download className={`mt-4 inline-block text-sm ${linkClass}`}>
                      Download {p.name}&apos;s photo (JPEG, {p.photo.width} × {p.photo.height})
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="contact" className="mt-14">
            <h2 id="contact" className="text-2xl font-bold text-white">
              How can journalists reach DevoraX?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              Email{' '}
              <a href={`mailto:${BRAND_FACTS.salesEmail}`} className={linkClass}>
                {BRAND_FACTS.salesEmail}
              </a>{' '}
              with press questions.
            </p>
          </section>

          <BookCallCta />
        </div>
      </main>
    </>
  );
}
