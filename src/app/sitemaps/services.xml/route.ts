import { serviceEntries, urlsetXml, xmlResponse } from '@/lib/sitemap';

export const revalidate = 3600;

// /services and the solution pages, all from code: nothing to query.
export async function GET() {
  return xmlResponse(urlsetXml(serviceEntries()));
}
