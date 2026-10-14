import { insightEntries, urlsetXml, xmlResponse } from '@/lib/sitemap';

export const revalidate = 3600;

export function GET() {
  return xmlResponse(urlsetXml(insightEntries()));
}
