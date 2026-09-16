import { getCaseStudy, CASE_STUDY_CONTENT_UPDATED } from '@/data/caseStudyContent';

const BASE_URL = 'https://thedevorax.tech';
const ORGANIZATION_ID = `${BASE_URL}/#organization`;

type Project = {
    id: number | string;
    title: string;
    description?: string | null;
    content?: string | null;
    image?: string | null;
    tags?: string[] | null;
    created_at?: string | null;
};

/**
 * Structured data for a single project / case study.
 *
 * Uses `Article` rather than `CreativeWork`: a case study is editorial content
 * with an author, a publisher and a publication date, and `Article` is the type
 * search and AI engines actually consume for that. `CreativeWork` is a generic
 * parent type that carries no comparable support.
 */
export function ProjectJsonLd({ project }: { project: Project }) {
    const url = `${BASE_URL}/projects/${project.id}`;
    const published = project.created_at ?? undefined;
    // `created_at` is when the project row was added, not when the page content
    // changed. Studies that were substantively rewritten carry the real revision
    // date; the rest fall back to published rather than claiming false freshness.
    const study = getCaseStudy(project.id);
    const modified = study ? (study.updated ?? CASE_STUDY_CONTENT_UPDATED) : published;

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${BASE_URL}/case-study` },
            { '@type': 'ListItem', position: 3, name: project.title, item: url },
        ],
    };

    // Page-level node. Every node on these pages previously floated unattached —
    // the breadcrumb described a trail to nothing and the Article's
    // `mainEntityOfPage` pointed at a bare URL string rather than a declared node.
    const webPageLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${project.title} Case Study`,
        description: project.description ?? undefined,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        primaryImageOfPage: project.image ? { '@type': 'ImageObject', url: project.image } : undefined,
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: 'en-US',
    };

    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: project.title.slice(0, 110),
        description: project.description ?? undefined,
        url,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        image: project.image ? [project.image] : undefined,
        datePublished: published,
        dateModified: modified,
        // Both author and publisher now reference the single Organization node
        // instead of re-declaring an inline copy of it with a subset of its
        // properties — two partial duplicates of one entity is exactly what the
        // @id graph exists to avoid.
        author: { '@id': ORGANIZATION_ID },
        publisher: { '@id': ORGANIZATION_ID },
        keywords: Array.isArray(project.tags) ? project.tags.join(', ') : undefined,
        inLanguage: 'en-US',
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        </>
    );
}
