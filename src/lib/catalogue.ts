/**
 * Turns the catalogue's references (data/catalogue.ts) into the links the
 * homepage tabs and /services print, and checks them on the way.
 *
 * A reference that cannot be checked stops the build rather than shipping: a
 * project that is not in CATALOGUE_PROJECTS or is hidden (its page is a 404),
 * a Fiverr handle that is not in data/testimonials.ts, or a service slug that
 * is not a page in data/solutions.ts.
 *
 * Server code: it reads the solution pages for their anchor text.
 */
import {
  CATALOGUE,
  CATALOGUE_PROJECTS,
  OWN_SITE_LABEL,
  type CatalogueCategory,
  type CatalogueRef,
} from '@/data/catalogue';
import { getIndustry, industryHref } from '@/data/industries';
import { isHiddenProject } from '@/data/projectIndex';
import { getSolution, isOffer } from '@/data/solutions';
import { TESTIMONIALS } from '@/data/testimonials';
import { SITE_URL } from '@/data/brand';
import { plainText } from '@/lib/richText';

export type ResolvedRef = {
  href: string;
  /** The link's text: the project's or the page's name, the reviewer's handle. */
  text: string;
  /** Who the work was for, word for word, or what kind of evidence this is. */
  label: string;
  /** Which part shows the work, and what Sameem's part was where the record limits it. */
  note?: string;
  external?: boolean;
};

function fail(msg: string): never {
  throw new Error(`data/catalogue.ts: ${msg}`);
}

/** The anchor text every link to a service page uses: a door's nav_label, the hub's title. */
export function serviceAnchor(slug: string): { href: string; text: string } {
  const page = getSolution(slug) ?? fail(`"${slug}" is not a page in data/solutions.ts`);
  return { href: `/solutions/${slug}`, text: isOffer(page) ? page.nav_label : page.title };
}

export function resolveRef(ref: CatalogueRef): ResolvedRef {
  if ('project' in ref) {
    const p = CATALOGUE_PROJECTS[ref.project] ?? fail(`project ${ref.project} has no entry in CATALOGUE_PROJECTS`);
    if (isHiddenProject(ref.project)) fail(`project ${ref.project} is hidden and its page is a 404`);
    const note = [p.part, ref.note].filter(Boolean).join('; ');
    return { href: `/projects/${ref.project}`, text: p.name, label: p.label, ...(note ? { note } : {}) };
  }
  if ('review' in ref) {
    if (!TESTIMONIALS.some((t) => t.username === ref.review)) {
      fail(`review "${ref.review}" is not a Fiverr handle in data/testimonials.ts`);
    }
    return { href: '/reviews', text: ref.review, label: 'Fiverr review', note: ref.job };
  }
  if ('service' in ref) {
    return { ...serviceAnchor(ref.service), label: 'Our service' };
  }
  if ('site' in ref) {
    return { href: ref.site, text: ref.label, label: OWN_SITE_LABEL, external: true };
  }
  // The Monthly care step. Its price is on /pricing, never here.
  return { href: '/pricing#prices', text: 'Monthly care', label: 'Step of the offer ladder' };
}

/** An industry row of the last category: its label, its filtered portfolio link and its projects. */
export function resolveIndustry(slug: string, projects: number[]) {
  const industry = getIndustry(slug) ?? fail(`"${slug}" is not an industry in data/industries.ts`);
  return { label: industry.label, href: industryHref(industry.slug), refs: projects.map((id) => resolveRef({ project: id })) };
}

/** Every reference in the catalogue, resolved once at import, so a bad one fails the build. */
for (const c of CATALOGUE) {
  [...c.featured, ...c.sub_services.flatMap((s) => s.refs)].forEach(resolveRef);
  c.start_here.forEach(serviceAnchor);
  c.industries?.forEach((i) => resolveIndustry(i.slug, i.projects));
}

/** The anchor of a category's questions on /services. */
export const questionsAnchor = (c: CatalogueCategory) => `${c.id}-questions`;

/**
 * FAQPage node for /services, built from the same questions the page renders
 * in <details>. No @context: it is one node in the page's @graph.
 */
export function catalogueFaqPageNode(webPageId: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/services#catalogue-questions`,
    isPartOf: { '@id': webPageId },
    mainEntity: CATALOGUE.flatMap((c) =>
      c.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
      }))
    ),
  };
}
