import { caseStudyEntries, fetchProjects, urlsetXml, xmlResponse } from '@/lib/sitemap';

export const revalidate = 3600;

export async function GET() {
  return xmlResponse(urlsetXml(caseStudyEntries(await fetchProjects())));
}
