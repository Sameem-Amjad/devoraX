import { MetadataRoute } from 'next';
import { createClient } from '@/lib/server';

const BASE_URL = 'https://thedevorax.tech';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: projects } = await supabase.from('projects').select('slug, created_at');
  const { data: services } = await supabase.from('services').select('slug, updated_at');

  const projectUrls = (projects || []).map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(project.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const serviceUrls = (services || []).map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/case-study`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...projectUrls, ...serviceUrls];
}
