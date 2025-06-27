// src/app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

/* ➊  Usa “default / template” en vez de un título fijo */
export const metadata: Metadata = {
  title: {
    default: 'NoPay – LegalTech',
    template: '%s | NoPay',   //  <title>de la ruta</title> | NoPay
  },
  description:
    'Plataforma legal digital para trámites en Ecuador. Automatiza multas, matrículas y más.',
  icons: { icon: '/images/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* ➋  Deja el <head> abierto; Next añadirá aquí lo de cada ruta */}
      <head>
        <link rel="icon" href="/images/fav.png" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="facebook-domain-verification" content="n4qoqxcxl96qsxqydz417en6auf1fo" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
