// src/app/sitemap.ts
import { MetadataRoute } from 'next';

const SITE_URL = 'https://nopaylegal.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/guia-legal-ecuador`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },

    // Servicios generales
    {
      url: `${SITE_URL}/Servicios`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },

    // Servicios transaccionales principales
    {
      url: `${SITE_URL}/Servicios/Impugnacion`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.98,
    },
    {
      url: `${SITE_URL}/Servicios/PermisoSalida`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.98,
    },
    {
      url: `${SITE_URL}/Servicios/Marcas`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.98,
    },
    {
      url: `${SITE_URL}/Servicios/ConstitucionEmpresasPage`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.98,
    },

    // Otros servicios reales existentes
    {
      url: `${SITE_URL}/Servicios/AsesoriaLegal`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.86,
    },
    {
      url: `${SITE_URL}/Servicios/DocumentosLegales`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.86,
    },
    {
      url: `${SITE_URL}/Servicios/Matriculacion`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/Servicios/PropiedadIntelectual`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/Servicios/TramitesMigratorios`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/Servicios/Inmuebles`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.72,
    },

    // Contacto y confianza
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/SeguridadDatos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.68,
    },

    // Legales
    {
      url: `${SITE_URL}/terminos-condiciones`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.45,
    },
    {
      url: `${SITE_URL}/politicas-privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.45,
    },
    {
      url: `${SITE_URL}/politicas-envio-entrega`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];
}