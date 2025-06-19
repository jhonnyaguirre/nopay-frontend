'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import { ShieldCheck, MessageCircleCode, FileText, UserCheck, Lightbulb, ChevronRight } from 'lucide-react';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import AsesoriaPhoneOverlay from 'app/resources/animaciones/AsesoriaLegal/page';

export default function AsesoriaLegalPage() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => setShowOverlay(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white relative overflow-hidden">
      <Header />

      {isMobile && showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]">
          <div className="w-full h-full flex items-center justify-center">
            <AsesoriaPhoneOverlay />
          </div>
        </div>
      )}

      <section className={`relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24 lg:flex lg:items-center lg:gap-12 ${isMobile && showOverlay ? 'hidden' : ''}`}>
        <div className="max-w-2xl mb-16 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full w-max mb-6"
          >
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Basado en legislación ecuatoriana</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white to-[#FDE68A] bg-clip-text text-transparent">
              Asesoría Legal Automatizada
            </span> con respaldo profesional
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg opacity-90 mb-8"
          >
            Accede a una plataforma inteligente que responde tus consultas legales en lenguaje claro, guiada por la normativa vigente en Ecuador y validada por abogados expertos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="../../build"
              className="inline-flex items-center justify-center bg-white text-[#7F1D1D] font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-[#EC4899] hover:text-white transition-all group"
            >
              CONSULTAR AHORA
              <MessageCircleCode className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center border-2 border-white/50 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
            >
              Cómo funciona
            </Link>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { icon: <Lightbulb className="h-5 w-5" />, text: "Orientación clara y confiable" },
              { icon: <UserCheck className="h-5 w-5" />, text: "Validado por abogados" },
              { icon: <FileText className="h-5 w-5" />, text: "Basado en normativa actual" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative w-full max-w-xl mx-auto lg:mx-0"
        >
          <div className="relative w-full h-auto">
            {!isMobile && <AsesoriaPhoneOverlay />}
          </div>
        </motion.div>
      </section>

      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#7F1D1D]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-[#EC4899] to-[#F59E0B] text-white px-6 py-2 rounded-full shadow-lg">
              Cómo funciona
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Haz tu consulta",
                description: "Escribe tu duda legal en lenguaje natural.",
                icon: <MessageCircleCode className="h-8 w-8 text-[#EC4899]" />
              },
              {
                step: "2",
                title: "Analizamos tu situación",
                description: "La IA evalúa tu caso según normativa vigente en Ecuador.",
                icon: <Lightbulb className="h-8 w-8 text-[#F59E0B]" />
              },
              {
                step: "3",
                title: "Te damos una respuesta clara",
                description: "Recibes asesoría comprensible y revisada por expertos.",
                icon: <UserCheck className="h-8 w-8 text-[#7F1D1D]" />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-[#7F1D1D]">{item.step}</div>
                  <div className="p-3 rounded-full bg-white shadow-sm">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#7F1D1D] to-[#EC4899]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ¿Necesitas asesoría legal confiable en segundos?
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link
              href="/UnderConstructionPage"
              className="inline-flex items-center justify-center bg-white text-[#7F1D1D] font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all group text-lg"
            >
              CONSULTAR AHORA
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
      <NoPayChatLauncher />
      <Footer />
    </main>
  );
}
