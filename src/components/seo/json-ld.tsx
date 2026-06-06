const BASE_URL = 'https://thedevorax.tech';

export function ProjectJsonLd({ project }: { project: any }) {
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${BASE_URL}/case-study` },
            { '@type': 'ListItem', position: 3, name: project.title, item: `${BASE_URL}/projects/${project.id}` },
        ],
    };

    const creativeWorkLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        url: `${BASE_URL}/projects/${project.id}`,
        image: project.image,
        author: {
            '@type': 'Organization',
            name: 'DevoraX',
            url: BASE_URL,
        },
        dateCreated: project.created_at,
        keywords: Array.isArray(project.tags) ? project.tags.join(', ') : '',
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }} />
        </>
    );
}