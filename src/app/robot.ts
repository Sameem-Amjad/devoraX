import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'], // Hide admin/api from Google
        },
        sitemap: '[https://thedevorax.tech/sitemap.xml](https://thedevorax.tech/sitemap.xml)',
    };
}