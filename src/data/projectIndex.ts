/**
 * Which project pages search engines may index, and what a project page is
 * called.
 *
 * Owner decision, 7 Nov 2026. About 35 templated project write-ups were in the
 * sitemap beside the pages that sell, on a domain search engines crawl rarely.
 * Only the projects the door pages rest on stay indexable. Every other
 * /projects/{id}, including any row added to the database later, is
 * `noindex, follow`: the page still renders and stays on /projects for
 * visitors, but it leaves the sitemap, llms.txt, the footer and the admin's
 * IndexNow ping. An id joins the list when its page has been rewritten around
 * what Sameem actually did; /23 joins once its rewrite ships, naming Pastel
 * only as Sameem's own employment.
 *
 * Labels. "Case Study" means work a client contracted DevoraX for: Koor (17),
 * since the owner's answer of 8 Nov 2026. Every other project page is an
 * "engineering write-up": in its title, its JSON-LD name, its byline and the
 * links to it. That includes orders through the Fiverr profile: they are
 * DevoraX client work too (the profile is in Sameem's name and sells the
 * studio's services), but the owner kept "Case Study" for 'devorax-client'
 * work alone (8 Nov 2026). Each engagement below is read from the attribution
 * sentence that opens the project's study in caseStudyContent.ts; change one
 * only when who the client contracted with is known to be different. A project
 * nobody has placed takes DEFAULT_ENGAGEMENT, which claims no engagement at all
 * and never renders "Case Study".
 *
 * No imports, so client components (the /projects grid) can use it without
 * pulling the long-form studies into the browser bundle.
 */

export type Engagement =
  | 'devorax-client' // a client contracted DevoraX; the only one labelled "Case Study"
  | 'sameem-direct' // the client hired Sameem directly
  | 'fiverr' // a client hired DevoraX through its Fiverr profile (in Sameem's name)
  | 'employer' // Sameem worked on it as an employee; it belongs to that company or its client
  | 'client-project' // a client project; the study names no platform and no client company
  | 'demo' // a demo build with sample data, made for no client
  | 'poc' // a proof of concept, with no live product
  | 'no-client' // a build with no public link and no named client
  | 'unstated'; // not placed: the page says only that Sameem worked on the build

/** The index allowlist, in the order the footer, the homepage and llms.txt show it. */
export const INDEXABLE_PROJECTS: readonly number[] = [34, 19, 25, 33, 37];

/**
 * Projects hidden from the site on the owner's instruction (8 Nov 2026): a
 * project with no video demo stays off the site, and these two have no video,
 * gallery or public link. Their database rows stay; the portfolio, the
 * homepage and the page route skip them, and their URLs return 404.
 */
export const HIDDEN_PROJECTS: readonly number[] = [2, 3];

export function isHiddenProject(id: number | string): boolean {
  return HIDDEN_PROJECTS.includes(Number(id));
}

/**
 * What a project nobody has placed is taken to be: no engagement, never "Case
 * Study". It used to be 'sameem-direct', which quietly said the client hired
 * Sameem directly.
 */
export const DEFAULT_ENGAGEMENT: Engagement = 'unstated';

export const PROJECT_ENGAGEMENT: Record<number, Engagement> = {
  // "No public link and no named client", in each study's own words.
  1: 'no-client',
  2: 'no-client',
  3: 'no-client',
  11: 'no-client',
  12: 'no-client',
  // Sameem as an engineer at another company: Webrange Solutions (8, 10, 28,
  // 32), Zencloud (14, 26, 27, 29, 31), Fleact Tech (20), Pastel, his employer
  // since April 2026 (23), and ivector (24).
  8: 'employer',
  10: 'employer',
  14: 'employer',
  20: 'employer',
  23: 'employer',
  24: 'employer',
  26: 'employer',
  27: 'employer',
  28: 'employer',
  29: 'employer',
  31: 'employer',
  32: 'employer',
  // Hired Sameem directly: Three28, Dooz and JUJU, and iDecorwala ("for
  // iDecorwala"). Hear With You (34) has no study yet; its project page says
  // "direct client work", as did Sameem's answers of 9 Oct 2026.
  19: 'sameem-direct',
  25: 'sameem-direct',
  30: 'sameem-direct',
  34: 'sameem-direct',
  38: 'sameem-direct',
  // "A client hired DevoraX through its Fiverr profile, which is in Sameem's
  // name": ConstrAction, Pianissimo Online, VoiceDesk.
  33: 'fiverr',
  39: 'fiverr',
  40: 'fiverr',
  // DevoraX client work, the client not named (owner decision, 8 Nov 2026): Koor.
  // Triagely and Tallyfile too, on the owner's answers of 11 Nov 2026.
  17: 'devorax-client',
  49: 'devorax-client',
  50: 'devorax-client',
  // "A client project: Sameem worked on it as a <role> for a client".
  41: 'client-project',
  42: 'client-project',
  43: 'client-project',
  44: 'client-project',
  46: 'client-project',
  47: 'client-project',
  48: 'client-project',
  // "A demo build with sample data": SiteWrite, FirstPass.
  36: 'demo',
  37: 'demo',
  // "A proof of concept": AR Lip Filler Preview, whose study says so from the
  // demo's own description, and CAD Interior Studio, which was built for a
  // client.
  35: 'poc',
  45: 'poc',
  // CEDMAT, Augment Fit and Waitmate: which of them were client work and which
  // demo builds is not recorded (8 Nov 2026), so their pages assert neither and
  // say only "Sameem Amjad worked on this build."
  18: 'unstated',
  21: 'unstated',
  22: 'unstated',
};

/**
 * The names of allowlisted projects that have no study in caseStudyContent.ts
 * yet, as the projects table titles them. The footer needs a name without a
 * database round trip.
 */
export const PROJECT_NAMES: Record<number, string> = {
  34: 'Hear With You',
};

export function projectEngagement(id: number | string): Engagement {
  return PROJECT_ENGAGEMENT[Number(id)] ?? DEFAULT_ENGAGEMENT;
}

export function isIndexable(id: number | string): boolean {
  return INDEXABLE_PROJECTS.includes(Number(id));
}

export type ProjectLabel = 'Case Study' | 'engineering write-up';

/** "Case Study" only for work a client contracted DevoraX for. */
export function projectLabel(id: number | string): ProjectLabel {
  return projectEngagement(id) === 'devorax-client' ? 'Case Study' : 'engineering write-up';
}

/** The label inside a sentence: "Read the engineering write-up". */
export function projectLabelText(id: number | string): string {
  return projectLabel(id).toLowerCase();
}

/** For a link to several projects: "case studies" only if every one is DevoraX client work. */
export function projectsLabelText(ids: readonly (number | string)[]): string {
  return ids.length > 0 && ids.every((id) => projectEngagement(id) === 'devorax-client')
    ? 'case studies'
    : 'engineering write-ups';
}

/** The house limit of 60 characters, less the 10 that " | DevoraX" adds. */
const TITLE_BUDGET = 50;

/**
 * The <title> before the template's " | DevoraX": "Afriva E-Commerce Platform:
 * Engineering Write-up". Titles stay within 60 characters with the suffix, so
 * a long name takes the short label instead: "Predictive Analytics Dashboard:
 * Write-up".
 */
export function projectPageTitle(id: number | string, title: string): string {
  if (projectEngagement(id) === 'devorax-client') return `${title} Case Study`;
  const full = `${title}: Engineering Write-up`;
  return full.length <= TITLE_BUDGET ? full : `${title}: Write-up`;
}

/** The page's name in its JSON-LD WebPage node and in image alt text. */
export function projectPageName(id: number | string, title: string): string {
  return projectEngagement(id) === 'devorax-client'
    ? `${title} Case Study`
    : `${title}: engineering write-up`;
}
