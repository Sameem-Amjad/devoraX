import { fetchServices, serviceEntries, urlsetXml, xmlResponse } from '@/lib/sitemap';

export const revalidate = 3600;

export async function GET() {
  return xmlResponse(urlsetXml(serviceEntries(await fetchServices())));
}
