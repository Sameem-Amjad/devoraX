import type { ServiceContent } from '@/data/serviceContent';
import { SERVICE_CONTENT_UPDATED } from '@/data/serviceContent';
import { ORG_REF, absoluteUrl, breadcrumbNode, webPageNode } from '@/lib/seo';
import { JsonLd } from './structured-data';
import { serviceFaqNode } from './service-longform';

type Service = {
    id: number | string;
    title: string;
    desc_text?: string | null;
    desc_long?: string | null;
};

type Crumb = { name: string; path: string };

/**
 * Structured data for a service page, as one graph: the WebPage, its
 * BreadcrumbList, the Service, and an FAQPage for the long-form's questions.
 *
 * `content` is the object the page hands ServiceLongform and `trail` is the list
 * it renders as the visible breadcrumb, so the review date, the FAQ and the
 * crumbs are only claimed when the page shows them.
 */
export function ServiceJsonLd({
    service,
    content,
    trail,
}: {
    service: Service;
    content?: ServiceContent;
    trail: Crumb[];
}) {
    const path = `/services/${service.id}`;
    const url = absoluteUrl(path);

    /**
     * A page-level node so the breadcrumb and the Service have something to hang
     * off. Previously every node on this page floated free: there was no WebPage
     * anywhere on the site, so nothing tied the structured data to the URL it
     * described.
     */
    const webPage = webPageNode({
        path,
        // The same name generateMetadata puts in <title>.
        name: content?.seo_title || `${service.title} Services`,
        description: content?.meta_description || service.desc_text || undefined,
        about: `${url}#service`,
        // ServiceLongform opens with a Byline that says "Reviewed by Sameem
        // Amjad" and shows this date.
        reviewedOn: content ? SERVICE_CONTENT_UPDATED : undefined,
    });

    const serviceLd = {
        '@type': 'Service',
        // Stable id so the Organization's hasOfferCatalog can point at this exact
        // node instead of repeating a bare name.
        '@id': `${url}#service`,
        name: service.title,
        // Real columns are desc_long / desc_text — `description`/`desc` do not
        // exist on the services table, so this rendered an empty description.
        description: content?.hero_answer || service.desc_long || service.desc_text,
        // The provider used to be an inline anonymous node named "Devora" with no
        // @id, so it never resolved to the company this site is about — it read as
        // a fourth, unrelated organisation with a different name. Now it is a
        // reference to the one Organization node in the graph.
        provider: ORG_REF,
        areaServed: { '@type': 'Place', name: 'Worldwide' },
        url,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        serviceType: service.title,
        // NOTE: no `offers`. There was an Offer here carrying nothing but
        // priceCurrency and `availability: InStock` — product-inventory vocabulary
        // applied to a consulting engagement, asserting a purchasable item at no
        // stated price. Pricing here is quoted per project after a discovery call,
        // so there is no offer to describe and an empty one is worse than none.
        ...(content?.deliverables?.length
            ? {
                  hasOfferCatalog: {
                      '@type': 'OfferCatalog',
                      name: `${service.title} deliverables`,
                      itemListElement: content.deliverables.slice(0, 8).map((d) => ({
                          '@type': 'Service',
                          name: d,
                      })),
                  },
              }
            : {}),
    };

    return (
        <JsonLd
            graph={[webPage, breadcrumbNode(path, trail), serviceLd, serviceFaqNode(url, content)]}
        />
    );
}
