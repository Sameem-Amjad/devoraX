import { MetadataRoute } from 'next';
import { createClient } from '@/lib/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = '[https://thedevorax.tech](https://thedevorax.tech)';

    // 1. Fetch Dynamic Routes
    const { data: projects } = await supabase.from('projects').select('slug, created_at');
    const { data: services } = await supabase.from('services').select('slug');

    // 2. Map Projects
    const projectUrls = (projects || []).map((project) => ({
        url: `${baseUrl}/work/${project.slug}`,
        lastModified: new Date(project.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 3. Map Services
    const serviceUrls = (services || []).map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    // 4. Combine with Static Routes
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/work`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...projectUrls,
        ...serviceUrls,
    ];
}
