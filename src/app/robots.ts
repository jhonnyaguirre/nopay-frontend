// src/app/robots.ts
import { MetadataRoute } from 'next';

const SITE_URL = 'https://nopaylegal.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },

      // Bots de IA (CLAVE PARA SGE y ChatGPT)
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}