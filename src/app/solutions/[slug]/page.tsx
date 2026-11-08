import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getSolution,
  allSolutionSlugs,
  isOffer,
  solutionTrail,
  solutionUpdated,
  type Solution,
} from '@/data/solutions';
import { SolutionPage } from '@/components/seo/solution-page';
import { OfferPage } from '@/components/seo/offer-page';
import { JsonLd } from '@/components/seo/structured-data';
import { ORG_REF, SITE_URL, absoluteUrl, breadcrumbNode, webPageNode } from '@/lib/seo';
import { ladderOffers } from '@/lib/offerPricing';
import { plainText } from '@/lib/richText';

/**
 * Statically generated: the content is in code, so there is nothing to fetch.
 * Hourly revalidation keeps the start date in a door page's terms current
 * (data/terms.ts).
 */
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
    keywords: isOffer(solution)
      ? [solution.primary_keyword, ...solution.secondary_keywords]
      : [solution.primary_keyword],
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

/**
 * The page's graph: WebPage, BreadcrumbList, Service and, where the page shows
 * questions, FAQPage. No Review or AggregateRating: reviews a business shows
 * about itself are not eligible, and the review cards stay plain content.
 */
function solutionGraph(solution: Solution) {
  const path = `/solutions/${solution.slug}`;
  const url = absoluteUrl(path);
  const updated = solutionUpdated(solution);

  // Page-level node, so the breadcrumb and Service hang off something real and
  // the whole graph resolves without a dangling reference. The page shows a
  // Byline ("Reviewed by Sameem Amjad"), so the node names the same reviewer
  // and date.
  const webPageLd = webPageNode({
    path,
    name: solution.h1,
    description: solution.meta_description,
    about: `${url}#service`,
    dateModified: updated,
    reviewedOn: updated,
  });

  // The same trail the visible breadcrumb renders.
  const breadcrumbLd = breadcrumbNode(path, solutionTrail(solution));

  // A door page sells ladder steps at published prices, so its Service carries
  // them as Offers, from the same helper /pricing uses. A vertical page has no
  // `offers`: its price is quoted per project after a call, and an Offer with
  // nothing to buy would be false.
  const offers = isOffer(solution) ? ladderOffers(solution.offer_steps) : [];
  const serviceLd = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: isOffer(solution) ? solution.nav_label : solution.h1,
    description: plainText(solution.hero_answer),
    provider: ORG_REF,
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    serviceType: solution.primary_keyword,
    ...(offers.length ? { offers } : {}),
  };

  // FAQPage only for the questions the page renders in its FAQ block. The terms
  // block is visible too, but it is the same on every door page, so it is not
  // marked up as each page's FAQ.
  const faqLd = solution.faqs.length
    ? {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: solution.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
        })),
      }
    : null;

  return [webPageLd, breadcrumbLd, serviceLd, faqLd];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return notFound();

  return (
    <>
      <JsonLd graph={solutionGraph(solution)} />
      {isOffer(solution) ? (
        <OfferPage offer={solution} />
      ) : (
        <SolutionPage solution={solution} />
      )}
    </>
  );
}
