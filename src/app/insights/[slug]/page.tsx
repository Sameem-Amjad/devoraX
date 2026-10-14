import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { INSIGHTS, getInsight, INSIGHTS_UPDATED } from '@/data/insights';
import { InsightArticle } from '@/components/seo/insight-article';
import { JsonLd } from '@/components/seo/structured-data';
import { OG_IMAGE, ORG_REF, absoluteUrl, breadcrumbNode, webPageNode } from '@/lib/seo';

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

  const url = absoluteUrl(`/insights/${article.slug}`);
  // The full titles run past the ~60 characters a results page shows, so the
  // <title> and the social cards use the short one. The H1 keeps the full title.
  const title = article.seo_title ?? article.title;
  return {
    title,
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
      title,
      description: article.meta_description,
      publishedTime: article.published ?? INSIGHTS_UPDATED,
      modifiedTime: INSIGHTS_UPDATED,
      images: [{ ...OG_IMAGE, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: article.meta_description,
      images: [{ url: OG_IMAGE.url, alt: article.title }],
    },
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return notFound();

  const path = `/insights/${article.slug}`;
  const url = absoluteUrl(path);
  const articleId = `${url}#article`;
  // First publication, per article. INSIGHTS_UPDATED is the last substantive
  // revision of them all, the date the Byline shows as "Last updated".
  const published = article.published ?? INSIGHTS_UPDATED;

  const graph = [
    // The Byline says "Reviewed by Sameem Amjad", so the page node names the
    // same reviewer and the same date.
    webPageNode({
      path,
      name: article.title,
      description: article.meta_description,
      mainEntity: articleId,
      datePublished: published,
      dateModified: INSIGHTS_UPDATED,
      reviewedOn: INSIGHTS_UPDATED,
    }),
    breadcrumbNode(path, [
      { name: 'Insights', path: '/insights' },
      { name: article.title, path },
    ]),
    {
      '@type': 'Article',
      '@id': articleId,
      // The visible H1, in full. The slice only guards a future title past the
      // 110 characters some consumers cut headlines at.
      headline: article.title.slice(0, 110),
      description: article.meta_description,
      image: [OG_IMAGE.url],
      url,
      datePublished: published,
      dateModified: INSIGHTS_UPDATED,
      // The Byline reads "Written by DevoraX", so the author is the company.
      // Sameem is named as the reviewer, on the page node, not as the author.
      author: ORG_REF,
      publisher: ORG_REF,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      isAccessibleForFree: true,
      inLanguage: 'en-US',
      wordCount: article.word_count,
    },
  ];

  return (
    <>
      <JsonLd graph={graph} />

      <main id="main-content" className="min-h-screen bg-black pb-24 pt-28">
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
