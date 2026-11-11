/**
 * The homepage's "Questions we always get": one tab per service, each with
 * that service's six questions, read from its page in data/solutions.ts.
 *
 * Owner's brief of 11 Nov 2026. The ten general questions that used to fill
 * this section (data/faqs.ts) still render on /contact and in llms.txt; only
 * the homepage moved to the services' questions. The tabs and the homepage's
 * FAQPage node are built here from the same arrays, so the structured data
 * always describes the questions on the page.
 *
 * Server code: it reads the solution pages.
 */
import { SITE_URL } from './brand';
import { DOORS, MARKETPLACE_BUILD } from './offer';
import { getSolution, isOffer } from './solutions';
import { plainText } from '@/lib/richText';

export type HomeFaqGroup = {
  /** The door's id from data/offer.ts. */
  id: string;
  /** The tab's label: the page's anchor text everywhere on the site. */
  label: string;
  href: string;
  faqs: { q: string; a: string }[];
};

/** The three doors, then the marketplace hub, in the order every list of them uses. */
export const HOME_FAQ_GROUPS: HomeFaqGroup[] = [...DOORS, MARKETPLACE_BUILD].map((door) => {
  const page = getSolution(door.slug);
  if (!page) throw new Error(`data/homeFaqs.ts: "${door.slug}" is not a page in data/solutions.ts`);
  return {
    id: door.id,
    label: isOffer(page) ? page.nav_label : page.title,
    href: `/solutions/${door.slug}`,
    faqs: page.faqs,
  };
});

/**
 * FAQPage node for the homepage graph. The @id is the homepage URL plus the
 * section's anchor, "faq", so it names a real location.
 */
export const homeFaqPageSchema = {
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: HOME_FAQ_GROUPS.flatMap((g) =>
    g.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: plainText(a) },
    }))
  ),
};
