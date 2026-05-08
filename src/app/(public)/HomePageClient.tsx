'use client';

import { useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { Header } from 'app/resources/Header';
import { ProcessTimelineSection } from '../resources/ProcessTimelineSection';
import Footer from '../resources/Footer';
import Fusion from 'app/resources/Fusion';
import HeroUndefined from 'app/resources/HeroUndefined';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import NoPayPreloader from 'app/resources/NoPayPreloader';
import ServicesCarousel from 'app/resources/carrousel';

export default function HomePage() {
  const [showChat, setShowChat] = useState(false);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  return (
    <main ref={ref} className="min-h-screen bg-transparent overflow-x-hidden relative text-white">
      <Header />

      <div className="container mx-auto p-4">
        <NoPayPreloader />
      </div>

      <div
        style={{
          zoom: 0.76,
        }}
      >
        <section className="py-12">
          <HeroUndefined />
          <ServicesCarousel />
          <ProcessTimelineSection />
          <Fusion />
        </section>
      </div>

      <Footer />
      <NoPayChatLauncher />
    </main>
  );
}