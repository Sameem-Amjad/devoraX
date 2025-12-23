export function ServiceJsonLd({ service }: { service: any }) {
    // 1. Breadcrumb Structure
    const breadcrumbLd = {
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
                name: 'Services',
                item: 'https://thedevorax.tech/services',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: service.title,
                item: `https://thedevorax.tech/services/${service.id}`, // Matches your ID-based routing
            },
        ],
    };

    // 2. Service Rich Snippet (The "Extreme SEO" part)
    const serviceLd = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService', // Or 'Service', 'SoftwareApplication'
        name: service.title,
        description: service.description || service.desc,
        provider: {
            '@type': 'Organization',
            name: 'Devora',
            url: 'https://thedevorax.tech',
        },
        areaServed: 'Global',
        url: `https://thedevorax.tech/services/${service.id}`,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            // If you have pricing in the DB, add it here:
            // price: service.price 
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
            />
        </>
    );
}