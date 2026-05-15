// src/app/sitemap.ts
import { MetadataRoute } from 'next';

const SITE_URL = 'https://nopaylegal.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // HOME
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },

    // SERVICIOS PRINCIPALES
    {
      url: `${SITE_URL}/Servicios`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/Servicios/Impugnacion`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/Servicios/Marcas`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/Servicios/PermisoSalida`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },

    // SEO LOCAL (CLAVE PARA ECUADOR)
    {
      url: `${SITE_URL}/impugnar-multa-cuenca`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/impugnar-multa-quito`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/impugnar-multa-guayaquil`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // LEGALES
    {
      url: `${SITE_URL}/terminos-condiciones`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/politicas-privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
	
	{
  url: `${SITE_URL}/guia-legal-ecuador`,
  lastModified: now,
  changeFrequency: 'daily',
  priority: 1,
},

    // CONTACTO
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}