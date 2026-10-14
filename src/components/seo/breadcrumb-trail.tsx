/**
 * The visible breadcrumb for a page.
 *
 * Pass it the same trail the page passes to breadcrumbNode() (lib/seo), so the
 * BreadcrumbList in the JSON-LD always describes the trail a reader actually
 * sees. Home is prepended in both places. Markup and classes match /services.
 */
import { Fragment } from 'react';
import Link from 'next/link';

export type Crumb = { name: string; path: string };

export function BreadcrumbTrail({ trail }: { trail: Crumb[] }) {
  const items: Crumb[] = [{ name: 'Home', path: '/' }, ...trail];
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
        {items.map((c, i) => (
          <Fragment key={c.path}>
            {i > 0 && <li aria-hidden="true">/</li>}
            {i === items.length - 1 ? (
              <li aria-current="page" className="text-teal-400">
                {c.name}
              </li>
            ) : (
              <li>
                <Link href={c.path} className="hover:text-teal-400 transition-colors">
                  {c.name}
                </Link>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
