import { getCaseStudy, CASE_STUDY_CONTENT_UPDATED } from '@/data/caseStudyContent';
import { OG_IMAGE, ORG_REF, absoluteUrl, breadcrumbNode, webPageNode } from '@/lib/seo';
import { JsonLd } from './structured-data';

type Project = {
    id: number | string;
    title: string;
    description?: string | null;
    content?: string | null;
    image?: string | null;
    tags?: string[] | null;
    created_at?: string | null;
};

type Crumb = { name: string; path: string };

/**
 * The project's own image as an absolute http(s) URL, or null.
 *
 * The `image` column holds real URLs, empty strings and at least one literal
 * `""`, so the value is trimmed and unquoted before it is trusted. The page's
 * generateMetadata uses this too, so og:image and the Article image always
 * agree on whether a project has a picture.
 */
export function projectImageUrl(raw?: string | null): string | null {
    const url = (raw || '').trim().replace(/^"+|"+$/g, '');
    return /^https?:\/\//i.test(url) ? url : null;
}

/**
 * Structured data for a single project / case study: the WebPage, its
 * BreadcrumbList and the Article, as one graph.
 *
 * Uses `Article` rather than `CreativeWork`: a case study is editorial content
 * with an author, a publisher and a publication date, and `Article` is the type
 * search and AI engines actually consume for that. `CreativeWork` is a generic
 * parent type that carries no comparable support.
 *
 * `trail` is the same list of crumbs the page renders as its visible breadcrumb.
 */
export function ProjectJsonLd({ project, trail }: { project: Project; trail: Crumb[] }) {
    const path = `/projects/${project.id}`;
    const url = absoluteUrl(path);
    const published = project.created_at ?? undefined;
    // `created_at` is when the project row was added, not when the page content
    // changed. Studies that were substantively rewritten carry the real revision
    // date; the rest fall back to published rather than claiming false freshness.
    const study = getCaseStudy(project.id);
    const studyUpdated = study ? (study.updated ?? CASE_STUDY_CONTENT_UPDATED) : undefined;
    const modified = studyUpdated ?? published;
    const image = projectImageUrl(project.image);

    // Page-level node. Every node on these pages previously floated unattached —
    // the breadcrumb described a trail to nothing and the Article's
    // `mainEntityOfPage` pointed at a bare URL string rather than a declared node.
    const webPage = webPageNode({
        path,
        name: `${project.title} Case Study`,
        description: project.description ?? undefined,
        // Only an image the page shows. The site card stands in for the Article
        // below, but it is not on the page.
        primaryImage: image ?? undefined,
        // CaseStudyLongform renders a Byline ("Reviewed by Sameem Amjad", with
        // this date) only when the project has a study.
        reviewedOn: studyUpdated,
    });

    const article = {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: project.title.slice(0, 110),
        description: project.description ?? undefined,
        url,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        // Google expects an image on an Article. Projects without one get the
        // site card, the same fallback generateMetadata uses for og:image.
        image: [image ?? OG_IMAGE.url],
        datePublished: published,
        dateModified: modified,
        // Both author and publisher now reference the single Organization node
        // instead of re-declaring an inline copy of it with a subset of its
        // properties — two partial duplicates of one entity is exactly what the
        // @id graph exists to avoid.
        author: ORG_REF,
        publisher: ORG_REF,
        keywords: Array.isArray(project.tags) ? project.tags.join(', ') : undefined,
        inLanguage: 'en-US',
    };

    return <JsonLd graph={[webPage, breadcrumbNode(path, trail), article]} />;
}
