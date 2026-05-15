// app/Servicios/page.tsx
import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

const SITE_URL = 'https://nopaylegal.com';

export const metadata: Metadata = {
  title: 'NoPay | Impugnar multas, registrar marca y trámites legales en Ecuador',
  description:
    'NoPay es una plataforma LegalTech en Ecuador para impugnar multas de tránsito, registrar marcas, gestionar permisos de salida de menores y crear SAS online. Inicia tu trámite en minutos.',

  keywords: [
    'impugnar multa Ecuador',
    'impugnación de multas Quito',
    'registro de marca Ecuador',
    'permiso de salida menores Ecuador',
    'crear SAS Ecuador',
    'asesoría legal online Ecuador',
  ],

  authors: [{ name: 'NoPay LegalTech' }],
  creator: 'NoPay',

  metadataBase: new URL(SITE_URL),

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'NoPay | Servicios legales online en Ecuador',
    description:
      'Impugna multas, registra tu marca y gestiona trámites legales en Ecuador con tecnología + abogados.',
    url: SITE_URL,
    siteName: 'NoPay',
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 800,
        height: 600,
        alt: 'NoPay LegalTech Ecuador',
      },
    ],
    locale: 'es_EC',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'NoPay LegalTech Ecuador',
    description:
      'Trámites legales digitales en Ecuador: multas, marcas, permisos y más.',
    images: [`${SITE_URL}/images/logo.png`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <HomePageClient />;
}