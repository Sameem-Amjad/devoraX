import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { INSIGHTS, getInsight, insightUpdated, isChecklist, type Insight } from '@/data/insights';
import { InsightArticle } from '@/components/seo/insight-article';
import { JsonLd } from '@/components/seo/structured-data';
import { OG_IMAGE, ORG_REF, absoluteUrl, breadcrumbNode, webPageNode } from '@/lib/seo';
import { countWords } from '@/lib/richText';

/** Fully static — these articles are files, not database rows. */
export function generateStaticParams() {
  return INSIGHTS.map((a) => ({ slug: a.slug }));
}

/**
 * First publication. A page added later carries its own `updated` and no
 * `published`, and must not borrow the research articles' older date.
 */
function publishedOn(article: Insight): string {
  return article.published ?? insightUpdated(article);
}

/** The stored count for the research; a checklist's is counted from what the page shows. */
function wordCount(article: Insight): number {
  if (article.word_count) return article.word_count;
  const tables = article.sections.flatMap((s) =>
    s.table ? [s.table.caption, ...s.table.headers, ...s.table.rows.flat()] : []
  );
  const items = isChecklist(article)
    ? [
        ...new Set(article.items.map((i) => i.group)),
        ...article.items.flatMap((i) => [i.check, i.why, i.test]),
      ]
    : [];
  return countWords(
    article.title,
    article.summary_answer,
    article.dataset_note ?? '',
    ...(article.key_findings ?? []),
    ...items,
    ...article.sections.flatMap((s) => [s.heading, s.body]),
    ...tables,
    ...article.limitations,
    ...(article.cannot_answer ?? [])
  );
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
      publishedTime: publishedOn(article),
      modifiedTime: insightUpdated(article),
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
  // First publication, per article. The revision date is the page's own
  // `updated`, or INSIGHTS_UPDATED for the research articles: the date the
  // Byline shows as "Last updated".
  const published = publishedOn(article);
  const updated = insightUpdated(article);

  const graph = [
    // The Byline says "Reviewed by Sameem Amjad", so the page node names the
    // same reviewer and the same date.
    webPageNode({
      path,
      name: article.title,
      description: article.meta_description,
      mainEntity: articleId,
      datePublished: published,
      dateModified: updated,
      reviewedOn: updated,
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
      dateModified: updated,
      // The Byline reads "Written by DevoraX", so the author is the company.
      // Sameem is named as the reviewer, on the page node, not as the author.
      author: ORG_REF,
      publisher: ORG_REF,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      isAccessibleForFree: true,
      inLanguage: 'en-US',
      wordCount: wordCount(article),
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
