// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const SITE_URL = 'https://nopaylegal.com';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'NoPay | Servicios legales online en Ecuador',
    template: '%s | NoPay',
  },

  description:
    'NoPay es una plataforma LegalTech en Ecuador para iniciar trÃ¡mites legales digitales: impugnaciÃ³n de multas, permisos de salida de menores, registro de marcas y constituciÃ³n de SAS.',

  applicationName: 'NoPay',
  authors: [{ name: 'NoPay LegalTech' }],
  creator: 'NoPay',
  publisher: 'NoPay',

  keywords: [
    'NoPay',
    'LegalTech Ecuador',
    'asesorÃ­a legal online Ecuador',
    'impugnar multa Ecuador',
    'impugnaciÃ³n de multas de trÃ¡nsito',
    'permiso de salida de menores Ecuador',
    'registrar marca Ecuador',
    'crear SAS Ecuador',
    'abogados online Ecuador',
    'trÃ¡mites legales Cuenca',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: SITE_URL,
    siteName: 'NoPay',
    title: 'NoPay | Servicios legales online en Ecuador',
    description:
      'Impugna multas, registra marcas, gestiona permisos de salida de menores y otros trÃ¡mites legales en Ecuador con tecnologÃ­a y respaldo profesional.',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'NoPay LegalTech Ecuador',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'NoPay | Servicios legales online en Ecuador',
    description:
      'TrÃ¡mites legales digitales en Ecuador: multas, marcas, permisos de salida de menores y mÃ¡s.',
    images: ['/images/logo.png'],
  },

  icons: {
    icon: '/images/favIcon.png',
    shortcut: '/images/favIcon.png',
    apple: '/images/favIcon.png',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  verification: {
    other: {
      'facebook-domain-verification': 'n4qoqxcxl96qsxqydz417en6auf1fo',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NoPay',
    alternateName: 'NoPay LegalTech',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/logo.png`,
    description:
      'Plataforma LegalTech para iniciar trÃ¡mites legales digitales en Ecuador.',
    areaServed: {
      '@type': 'Country',
      name: 'Ecuador',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cuenca',
      addressCountry: 'EC',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NoPay',
    url: SITE_URL,
    inLanguage: 'es-EC',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/Servicios?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="es-EC">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

