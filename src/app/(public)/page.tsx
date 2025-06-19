'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Header } from 'app/resources/Header';
import EliteLegalHero from '../resources/HeroSection';
import { LegalTechnologySection } from '../resources/FeaturesSection';
import { ProcessTimelineSection } from '../resources/ProcessTimelineSection';
import { CTASection } from '../resources/CTASection';
import CaseStudiesSection from '../resources/CaseStudy';
import ComparisonSection from '../resources/ComparisonSection';
import ConnectedOrganizationsSection from '../resources/ConnectedOrganizationsSection';
import SavingsCalculator from '../resources/SavingsCalculator';
import Footer from '../resources/Footer';
import Fusion from 'app/resources/Fusion';
import HeroUndefined from 'app/resources/HeroUndefined';
import { useState } from 'react';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import DoNotPayAnimation from 'app/resources/NotPayAnimation';
import NoPayPreloader from 'app/resources/NoPayPreloader';
import UnderConstructionPage from 'app/resources/build';
import ServicesCarousel from 'app/resources/carrousel';



export default function HomePage() {
  const [showChat, setShowChat] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  return (
    <main
  ref={ref}
  className="min-h-screen bg-transparent overflow-x-hidden relative text-white"
 

    >
      {/* Navbar */}
      <Header />


      <div className="container mx-auto p-4">
        <NoPayPreloader />
         
      </div>


      {/* Process Timeline */}
      <section className="py-12">
        <HeroUndefined />
          
        <ProcessTimelineSection /> 
        <ServicesCarousel />  
        
        <Fusion />
        <NoPayChatLauncher />
        <Footer />
      </section>
 

    </main>
  );
}
