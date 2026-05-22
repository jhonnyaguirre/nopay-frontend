'use client';

import Head from 'next/head';
import { useRef } from 'react';

import { Header } from 'app/resources/Header';
import HeroUndefined from 'app/resources/HeroUndefined';
import ServicesCarousel from 'app/resources/carrousel';
import { ProcessTimelineSection } from '../resources/ProcessTimelineSection';
import Fusion from 'app/resources/Fusion';
import Footer from '../resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import NoPayPreloader from 'app/resources/NoPayPreloader';

export default function HomePageClient() {
  const mainRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <Head>
        <title>NoPay | LegalTech Ecuador | Trámites legales online con IA</title>

        <meta
          name="description"
          content="NoPay es una plataforma LegalTech en Ecuador desarrollada por Softcorp para resolver trámites legales online como impugnación de multas, registro de marcas, permisos de salida de menores y creación de SAS con IA y abogados."
        />

        <meta
          name="keywords"
          content="NoPay, NoPay LegalTech, LegalTech Ecuador, Softcorp, Johnny Enmanuel Aguirre, trámites legales online Ecuador, Registro de marcas, impugnar multas Ecuador, registro de marcas Ecuador, permiso salida menores Ecuador, crear SAS Ecuador, abogados online Ecuador"
        />

        <link rel="canonical" href="https://nopaylegal.com/" />

        <meta property="og:title" content="NoPay | LegalTech Ecuador" />
        <meta
          property="og:description"
          content="Plataforma LegalTech ecuatoriana desarrollada por Softcorp para resolver trámites legales online con IA y abogados."
        />
        <meta property="og:url" content="https://nopaylegal.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://nopaylegal.com/images/logo.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NoPay | LegalTech Ecuador" />
        <meta
          name="twitter:description"
          content="NoPay permite resolver trámites legales online en Ecuador con tecnología, IA y validación profesional."
        />
        <meta name="twitter:image" content="https://nopaylegal.com/images/logo.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'NoPay',
              legalName: 'NoPay LegalTech Ecuador',
              url: 'https://nopaylegal.com',
              logo: 'https://nopaylegal.com/images/logo.png',
              description:
                'NoPay es una plataforma LegalTech en Ecuador para resolver trámites legales online como impugnación de multas, registro de marcas, permisos de salida de menores y creación de SAS.',
              foundingLocation: {
                '@type': 'Place',
                name: 'Cuenca, Ecuador',
              },
              founder: {
                '@type': 'Person',
                name: 'Jhonny Aguirre',
                jobTitle: 'CEO y fundador',
              },
              parentOrganization: {
                '@type': 'Organization',
                name: 'Softcorp',
                url: 'https://www.softcorpbrieffing.com/',
              },
              areaServed: {
                '@type': 'Country',
                name: 'Ecuador',
              },
              sameAs: ['https://www.softcorpbrieffing.com/'],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Jhonny Aguirre',
              jobTitle: 'CEO y fundador de NoPay',
              worksFor: {
                '@type': 'Organization',
                name: 'Softcorp',
                url: 'https://www.softcorpbrieffing.com/',
              },
              founder: {
                '@type': 'Organization',
                name: 'NoPay',
                url: 'https://nopaylegal.com',
              },
              description:
                'Jhonny Aguirre es el fundador de NoPay, una plataforma LegalTech ecuatoriana desarrollada por Softcorp para digitalizar trámites legales en Ecuador.',
            }),
          }}
        />
      </Head>

      <main
        ref={mainRef}
        id="inicio-nopay"
        className="relative min-h-screen overflow-x-hidden bg-white text-slate-950"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <meta itemProp="name" content="NoPay | Servicios legales online en Ecuador" />
        <meta
          itemProp="description"
          content="NoPay es una plataforma LegalTech para iniciar trámites legales digitales en Ecuador: impugnación de multas, permisos de salida de menores, registro de marcas y constitución de SAS."
        />

        <Header />

        <div className="container mx-auto px-4 pt-24">
          <NoPayPreloader />
        </div>

        <section
          aria-label="Página principal de NoPay LegalTech Ecuador"
          className="relative"
        >
          <HeroUndefined />
          <ServicesCarousel />
          <ProcessTimelineSection />
          <Fusion />
        </section>

        <Footer />

        <NoPayChatLauncher />
      </main>
    </>
  );
}