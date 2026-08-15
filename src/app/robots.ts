import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/siteUrl';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin',
          '/api/admin/*',
          '/api/auth',
          '/api/auth/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
