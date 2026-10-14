import { buildAllSections, indexEntries, sitemapIndexXml, xmlResponse } from '@/lib/sitemap';

/**
 * The sitemap index robots.txt points at. The URLs themselves are in the child
 * sitemaps under /sitemaps/, built in src/lib/sitemap.ts. Refreshed hourly, and
 * at once when a project is saved in the admin dashboard.
 */
export const revalidate = 3600;

export async function GET() {
  return xmlResponse(sitemapIndexXml(indexEntries(await buildAllSections())));
}
