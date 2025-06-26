'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import { Building2, UserCog, FileText, BadgeCheck, ChevronRight } from 'lucide-react';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import EmpresaOverlay from 'app/resources/animaciones/ConstitucionEmpresas/page';

export default function ConstitucionEmpresasPage() {
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
            <EmpresaOverlay />
          </div>
        </div>
      )}

      <section className={`relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24 lg:flex lg:items-center lg:gap-12 ${isMobile && showOverlay ? 'hidden' : ''}`}>
        <div className="max-w-2xl mb-16 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full w-max mb-6 text-xs font-medium"
          >
            <Building2 className="h-4 w-4" />
            <span>Legal según la normativa ecuatoriana</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white to-[#FDE68A] bg-clip-text text-transparent">
              Constituye tu Empresa
            </span> en línea y sin complicaciones
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base opacity-90 mb-8"
          >
            Registra y formaliza tu emprendimiento en Ecuador con el respaldo legal que necesitas. Nuestro sistema te guía paso a paso, desde el acta constitutiva hasta el RUC.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/constitucion-empresas-form"
              className="inline-flex items-center justify-center bg-white text-[#7F1D1D] font-semibold px-6 py-2 rounded-xl shadow-lg hover:bg-[#EC4899] hover:text-white transition-all group text-sm"
            >
              CREAR EMPRESA
              <Building2 className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center border-2 border-white/50 text-white font-medium px-5 py-2 rounded-xl hover:bg-white/10 transition-all text-sm"
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
              { icon: <UserCog className="h-4 w-4" />, text: "Acompañamiento legal completo" },
              { icon: <BadgeCheck className="h-4 w-4" />, text: "Documentos oficiales listos para firmar" },
              { icon: <FileText className="h-4 w-4" />, text: "Cumple normativa de SRI y Supercias" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-medium">
                {item.icon}
                <span>{item.text}</span>
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
            {!isMobile && <EmpresaOverlay />}
          </div>
        </motion.div>
      </section>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-16 text-[#7F1D1D]"
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
                title: "Llena los datos básicos",
                description: "Nombre, socios, actividad económica y dirección de la empresa.",
                icon: <FileText className="h-6 w-6 text-[#EC4899]" />
              },
              {
                step: "2",
                title: "Generamos tu acta y estatutos",
                description: "Recibes documentos legales personalizados y revisados.",
                icon: <BadgeCheck className="h-6 w-6 text-[#F59E0B]" />
              },
              {
                step: "3",
                title: "Iniciamos tu registro oficial",
                description: "Gestionamos tu RUC y registro en entidades oficiales.",
                icon: <Building2 className="h-6 w-6 text-[#7F1D1D]" />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-2xl font-bold text-[#7F1D1D]">{item.step}</div>
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#7F1D1D] to-[#EC4899]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h3
            className="text-xl md:text-2xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ¿Listo para crear tu empresa hoy?
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link
              href="/constitucion-empresas-form"
              className="inline-flex items-center justify-center bg-white text-[#7F1D1D] font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition-all group text-sm"
            >
              CONSTITUIR AHORA
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <NoPayChatLauncher />
      <Footer />
    </main>
  );
}
