import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { INSIGHTS, getInsight, INSIGHTS_UPDATED } from '@/data/insights';
import { InsightArticle } from '@/components/seo/insight-article';

const BASE_URL = 'https://thedevorax.tech';

/** Fully static — these articles are files, not database rows. */
export function generateStaticParams() {
  return INSIGHTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const url = `${BASE_URL}/insights/${article.slug}`;
  return {
    title: article.title,
    description: article.meta_description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
    openGraph: {
      type: 'article',
      url,
      siteName: 'DevoraX',
      title: article.title,
      description: article.meta_description,
      publishedTime: INSIGHTS_UPDATED,
      modifiedTime: INSIGHTS_UPDATED,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@devorax_agency',
      title: article.title,
      description: article.meta_description,
      images: [{ url: `${BASE_URL}/og-image.jpg`, alt: article.title }],
    },
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return notFound();

  const url = `${BASE_URL}/insights/${article.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${BASE_URL}/insights` },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title.slice(0, 110),
    description: article.meta_description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: INSIGHTS_UPDATED,
    dateModified: INSIGHTS_UPDATED,
    author: { '@type': 'Organization', name: 'DevoraX', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'DevoraX',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png`, width: 200, height: 60 },
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <main className="min-h-screen bg-black pb-24 pt-28">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/insights"
            className="group mb-10 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-teal-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All insights
          </Link>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
            {article.title}
          </h1>

          <div className="mt-12">
            <InsightArticle insight={article} />
          </div>
        </div>
      </main>
    </>
  );
}
