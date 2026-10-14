import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSolution, allSolutionSlugs, SOLUTIONS_UPDATED } from '@/data/solutions';
import { SolutionPage } from '@/components/seo/solution-page';
import { JsonLd } from '@/components/seo/structured-data';
import { ORG_REF, SITE_URL, absoluteUrl, breadcrumbNode, webPageNode } from '@/lib/seo';

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

  const url = `${SITE_URL}/solutions/${solution.slug}`;
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
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: solution.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${solution.title} | DevoraX`,
      description: solution.meta_description,
      images: [{ url: `${SITE_URL}/og-image.jpg`, alt: solution.h1 }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return notFound();

  const path = `/solutions/${solution.slug}`;
  const url = absoluteUrl(path);
  const hub = solution.hub;

  // Page-level node, so the breadcrumb and Service hang off something real and the
  // whole graph resolves without a dangling reference — same pattern as the rest
  // of the site. The page shows a Byline ("Reviewed by Sameem Amjad"), so the
  // node names the same reviewer and date.
  const webPageLd = webPageNode({
    path,
    name: solution.h1,
    description: solution.meta_description,
    about: `${url}#service`,
    dateModified: SOLUTIONS_UPDATED,
    reviewedOn: SOLUTIONS_UPDATED,
  });

  const breadcrumbLd = breadcrumbNode(path, [
    { name: 'Services', path: '/services' },
    ...(hub ? [{ name: 'Marketplace Development', path: `/solutions/${hub}` }] : []),
    { name: solution.h1, path },
  ]);

  const serviceLd = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: solution.h1,
    description: solution.hero_answer,
    provider: ORG_REF,
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
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: solution.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <>
      <JsonLd graph={[webPageLd, breadcrumbLd, serviceLd, faqLd]} />
      <SolutionPage solution={solution} />
    </>
  );
}
