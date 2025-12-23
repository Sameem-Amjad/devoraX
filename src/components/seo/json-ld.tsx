export function ProjectJsonLd({ project }: { project: any }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://thedevorax.tech',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Work',
                // Updated to point to your actual projects listing path (assuming /projects based on your folder structure)
                item: 'https://thedevorax.tech/projects',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: project.title,
                // Updated to use 'id' and 'projects' path to match your page.tsx
                item: `https://thedevorax.tech/projects/${project.id}`,
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}