const BASE_URL = 'https://thedevorax.tech';

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
    // Projects have no updated_at column, so modified === published rather than
    // inventing a fresher date than the content actually has.
    const published = project.created_at ?? undefined;

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${BASE_URL}/case-study` },
            { '@type': 'ListItem', position: 3, name: project.title, item: url },
        ],
    };

    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: project.title.slice(0, 110),
        description: project.description ?? undefined,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        image: project.image ? [project.image] : undefined,
        datePublished: published,
        dateModified: published,
        author: { '@type': 'Organization', name: 'DevoraX', url: BASE_URL },
        publisher: {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: 'DevoraX',
            url: BASE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
                width: 200,
                height: 60,
            },
        },
        keywords: Array.isArray(project.tags) ? project.tags.join(', ') : undefined,
        inLanguage: 'en-US',
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        </>
    );
}
