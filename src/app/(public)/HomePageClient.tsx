'use client';

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
  );
}