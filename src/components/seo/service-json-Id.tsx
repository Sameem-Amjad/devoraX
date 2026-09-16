import { getServiceContent } from '@/data/serviceContent';

const BASE_URL = 'https://thedevorax.tech';
const ORGANIZATION_ID = `${BASE_URL}/#organization`;

export function ServiceJsonLd({ service }: { service: any }) {
    const url = `${BASE_URL}/services/${service.id}`;
    const longform = getServiceContent(service.id);

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
            { '@type': 'ListItem', position: 3, name: service.title, item: url },
        ],
    };

    /**
     * A page-level node so the breadcrumb and the Service have something to hang
     * off. Previously every node on this page floated free: there was no WebPage
     * anywhere on the site, so nothing tied the structured data to the URL it
     * described.
     */
    const webPageLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${service.title} Services`,
        description: longform?.meta_description || service.desc_text || undefined,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${url}#service` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: 'en-US',
    };

    const serviceLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        // Stable id so the Organization's hasOfferCatalog can point at this exact
        // node instead of repeating a bare name.
        '@id': `${url}#service`,
        name: service.title,
        // Real columns are desc_long / desc_text — `description`/`desc` do not
        // exist on the services table, so this rendered an empty description.
        description: longform?.hero_answer || service.desc_long || service.desc_text,
        // The provider used to be an inline anonymous node named "Devora" with no
        // @id, so it never resolved to the company this site is about — it read as
        // a fourth, unrelated organisation with a different name. Now it is a
        // reference to the one Organization node in the graph.
        provider: { '@id': ORGANIZATION_ID },
        areaServed: { '@type': 'Place', name: 'Worldwide' },
        url,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        serviceType: service.title,
        // NOTE: no `offers`. There was an Offer here carrying nothing but
        // priceCurrency and `availability: InStock` — product-inventory vocabulary
        // applied to a consulting engagement, asserting a purchasable item at no
        // stated price. Pricing here is quoted per project after a discovery call,
        // so there is no offer to describe and an empty one is worse than none.
        ...(longform?.deliverables?.length
            ? {
                  hasOfferCatalog: {
                      '@type': 'OfferCatalog',
                      name: `${service.title} deliverables`,
                      itemListElement: longform.deliverables.slice(0, 8).map((d) => ({
                          '@type': 'Service',
                          name: d,
                      })),
                  },
              }
            : {}),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
        </>
    );
}
