/**
 * Shared structured-data ids and builders.
 *
 * Every page describes itself as nodes in one graph that point at each other by
 * @id: this WebPage is part of the WebSite, sits on this BreadcrumbList, is about
 * this Service, and is published by the Organization. The ids were string
 * literals repeated in a dozen files, and two of them had already drifted apart
 * once (the founder was `/#sameem-amjad` in one file and `/team#sameem-amjad` in
 * another, so the two never resolved to one person). They live here now.
 */
import type { Metadata } from 'next';
import { SITE_URL, BRAND_FACTS } from '@/data/brand';

export { SITE_URL };

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;
/** The full Person nodes live on /team under these ids. */
export const FOUNDER_ID = `${SITE_URL}/team#sameem-amjad`;
export const CTO_ID = `${SITE_URL}/team#usman`;

export const ORG_REF = { '@id': ORGANIZATION_ID } as const;
export const FOUNDER_REF = { '@id': FOUNDER_ID } as const;

/** The site-wide social card. Only its dimensions are known, so only it gets them. */
export const OG_IMAGE = { url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 } as const;

/** "/" → "https://thedevorax.tech", "/team" → "https://thedevorax.tech/team". */
export function absoluteUrl(path: string): string {
  return path === '/' || path === '' ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * The base a page's node ids hang off. The homepage's canonical URL has no
 * trailing slash, but its ids keep one, so they read like the site-wide ones
 * (`/#organization`, `/#website`): `/#webpage`, not `.tech#webpage`.
 */
function idBase(path: string): string {
  return path === '/' || path === '' ? `${SITE_URL}/` : absoluteUrl(path);
}

type Crumb = { name: string; path: string };

/** A BreadcrumbList for the page at `path`. Home is prepended; pass the rest. */
export function breadcrumbNode(path: string, trail: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${idBase(path)}#breadcrumb`,
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

type WebPageOptions = {
  path: string;
  name: string;
  description?: string;
  /** WebPage subtype: AboutPage, ContactPage, CollectionPage, ProfilePage… */
  type?: string;
  /** @id of the entity the page is about (a Service, an Article…). */
  about?: string;
  mainEntity?: string;
  primaryImage?: string;
  datePublished?: string;
  dateModified?: string;
  /**
   * The ISO date shown in the visible Byline, when the page has one. It says
   * "Reviewed by Sameem Amjad", so the page node says the same thing.
   */
  reviewedOn?: string;
  /** Set false on pages without a breadcrumb node. */
  breadcrumb?: boolean;
};

/** The page-level node every other node on a page hangs off. */
export function webPageNode(o: WebPageOptions) {
  const url = absoluteUrl(o.path);
  const id = idBase(o.path);
  return {
    '@type': o.type ?? 'WebPage',
    '@id': `${id}#webpage`,
    url,
    name: o.name,
    description: o.description,
    isPartOf: { '@id': WEBSITE_ID },
    ...(o.breadcrumb === false ? {} : { breadcrumb: { '@id': `${id}#breadcrumb` } }),
    ...(o.about ? { about: { '@id': o.about } } : {}),
    ...(o.mainEntity ? { mainEntity: { '@id': o.mainEntity } } : {}),
    ...(o.primaryImage
      ? { primaryImageOfPage: { '@type': 'ImageObject', url: o.primaryImage } }
      : {}),
    datePublished: o.datePublished,
    dateModified: o.dateModified,
    ...(o.reviewedOn ? { reviewedBy: FOUNDER_REF, lastReviewed: o.reviewedOn.slice(0, 10) } : {}),
    publisher: ORG_REF,
    inLanguage: 'en-US',
  };
}

type PageMetadataOptions = {
  /** Rendered through the root template as "<title> | DevoraX". */
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  imageAlt?: string;
};

/**
 * Metadata for a page with its own canonical, Open Graph and Twitter card.
 *
 * Next.js replaces, rather than merges, a parent's `openGraph` when a page sets
 * one, so a page that sets `openGraph` without `images` ships no image at all
 * (/book did). Building all three together keeps them complete and matching.
 */
export function pageMetadata(o: PageMetadataOptions): Metadata {
  const url = absoluteUrl(o.path);
  const image = { ...OG_IMAGE, alt: o.imageAlt ?? o.title };
  const socialTitle = `${o.title} | ${BRAND_FACTS.name}`;
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: url },
    openGraph: {
      type: o.type ?? 'website',
      locale: 'en_US',
      url,
      siteName: BRAND_FACTS.name,
      title: socialTitle,
      description: o.description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: o.description,
      images: [image],
    },
  };
}
