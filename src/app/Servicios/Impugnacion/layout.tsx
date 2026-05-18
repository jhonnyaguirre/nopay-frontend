import type { Metadata } from 'next';

const SITE_URL = 'https://nopaylegal.com';
const PAGE_URL = `${SITE_URL}/Servicios/Impugnacion`;

export const metadata: Metadata = {
  title: 'Impugnar Multas de Tránsito en Ecuador | ANT, EMOV, AMT, ATM | NoPay',
  description:
    'Impugna multas de tránsito en Ecuador con NoPay. Revisión de multas ANT, EMOV Cuenca, AMT Quito, ATM Guayaquil, CTE y agencias municipales. Proceso legal online con IA y abogados expertos.',

  keywords: [
    'impugnar multa Ecuador',
    'impugnar multa de tránsito Ecuador',
    'impugnación de multas de tránsito',
    'apelación multa tránsito Ecuador',
    'reclamar multa de tránsito Ecuador',
    'abogado multas tránsito Ecuador',
    'impugnar multa ANT',
    'multas ANT Ecuador',
    'impugnar multa EMOV',
    'multas EMOV Cuenca',
    'impugnar multa AMT Quito',
    'multas AMT Quito',
    'impugnar multa ATM Guayaquil',
    'multas ATM Guayaquil',
    'impugnar multa CTE',
    'multas CTE Ecuador',
    'multa radar Ecuador',
    'multa fotorradar Ecuador',
    'multa exceso velocidad Ecuador',
    'multa mal estacionado Ecuador',
    'multa licencia Ecuador',
    'NoPay multas',
    'NoPay impugnación multas',
  ],

  alternates: {
    canonical: '/Servicios/Impugnacion',
  },

  openGraph: {
    title: 'Impugnar Multas de Tránsito en Ecuador | NoPay',
    description:
      'Impugna multas ANT, EMOV, AMT, ATM, CTE y agencias de tránsito en Ecuador con un proceso legal online guiado por IA y abogados.',
    url: PAGE_URL,
    siteName: 'NoPay',
    locale: 'es_EC',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'NoPay LegalTech Ecuador - Impugnación de multas de tránsito',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Impugnar Multas de Tránsito en Ecuador | NoPay',
    description:
      'Impugna multas ANT, EMOV, AMT, ATM y CTE con NoPay. Proceso legal online con IA y abogados.',
    images: [`${SITE_URL}/images/logo.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function ImpugnacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}