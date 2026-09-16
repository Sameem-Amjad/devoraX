import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSolution, allSolutionSlugs, SOLUTIONS_UPDATED } from '@/data/solutions';
import { SolutionPage } from '@/components/seo/solution-page';

const BASE_URL = 'https://thedevorax.tech';
const ORGANIZATION_ID = `${BASE_URL}/#organization`;

/** Statically generated — the content is in code, so there is nothing to fetch. */
export const revalidate = 3600;

export async function generateStaticParams() {
  return allSolutionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) {
    return {
      title: 'Solution Not Found',
      description: 'The requested page could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const url = `${BASE_URL}/solutions/${solution.slug}`;
  return {
    title: solution.title,
    description: solution.meta_description,
    keywords: [solution.primary_keyword],
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: 'DevoraX',
      title: `${solution.title} | DevoraX`,
      description: solution.meta_description,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: solution.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${solution.title} | DevoraX`,
      description: solution.meta_description,
      images: [{ url: `${BASE_URL}/og-image.jpg`, alt: solution.h1 }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return notFound();

  const url = `${BASE_URL}/solutions/${solution.slug}`;
  const hub = solution.hub;

  // Page-level node, so the breadcrumb and Service hang off something real and the
  // whole graph resolves without a dangling reference — same pattern as the rest
  // of the site.
  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: solution.h1,
    description: solution.meta_description,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${url}#service` },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    publisher: { '@id': ORGANIZATION_ID },
    dateModified: SOLUTIONS_UPDATED,
    inLanguage: 'en-US',
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
      ...(hub
        ? [{ '@type': 'ListItem', position: 3, name: 'Marketplace Development', item: `${BASE_URL}/solutions/${hub}` }]
        : []),
      { '@type': 'ListItem', position: hub ? 4 : 3, name: solution.h1, item: url },
    ],
  };

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: solution.h1,
    description: solution.hero_answer,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    serviceType: solution.primary_keyword,
    // No `offers` node: pricing here is quoted per project after a discovery call,
    // so there is no purchasable item to describe and an empty Offer asserting
    // product-inventory availability would be false.
  };

  // FAQPage only where the Q&A is actually rendered on this page, which it is.
  const faqLd = solution.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: solution.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <SolutionPage solution={solution} />
    </>
  );
}
