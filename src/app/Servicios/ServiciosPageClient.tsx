'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Car, FileText, BookOpen, Landmark, Factory, Home, Plane } from 'lucide-react';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';




interface Service {
  title: string;
  description: string;
  href: string;
  enabled: boolean;
  color: string;
  icon: React.ReactNode;
  delay: number;
}


const services: Service[] = [
  {
    title: 'Apelación de Multas de Tránsito',
    description: 'Impugna multas injustas con nuestro apoyo legal especializado',
    href: '/Servicios/Impugnacion',
    enabled: true,
    color: 'from-[#0A1D3E] to-[#4F46E5]',
    icon: <Car className="w-8 h-8" />,
    delay: 0.1
  },
  {
    title: 'Matriculación vehicular',
    description: 'Gestión completa de trámites de matriculación vehicular',
    href: '/Servicios/Matriculacion',
    enabled: true,
    color: 'from-[#D97706] to-[#FBBF24]',
    icon: <FileText className="w-8 h-8" />,
    delay: 0.2
  },
  {
    title: 'Asesoría Legal Automatizada',
    description: 'Respuestas inmediatas a tus consultas legales',
    href: '/Servicios/AsesoriaLegal',
    enabled: true,
    color: 'from-[#059669] to-[#10B981]',
    icon: <Scale className="w-8 h-8" />,
    delay: 0.3
  },
  {
    title: 'Redacción de Documentos Legales',
    description: 'Documentos profesionales adaptados a tus necesidades',
    href: '/Servicios/DocumentosLegales',
    enabled: true,
    color: 'from-[#1E40AF] to-[#6366F1]',
    icon: <BookOpen className="w-8 h-8" />,
    delay: 0.4
  },
  {
    title: 'Registro de Marcas',
    description: 'Protege tu marca con nuestro servicio especializado',
    href: '/Servicios/Marcas',
    enabled: true,
    color: 'from-[#BE123C] to-[#E11D48]',
    icon: <Landmark className="w-8 h-8" />,
    delay: 0.5
  },
  {
    title: 'Propiedad Intelectual',
    description: 'Protección legal para tus creaciones e invenciones',
    href: '/Servicios/PropiedadIntelectual',
    enabled: true,
    color: 'from-[#4C1D95] to-[#8B5CF6]',
    icon: <span className="text-2xl">💡</span>,
    delay: 0.6
  },
  {
    title: 'Constitución de Empresas',
    description: 'Crea tu empresa con todos los requisitos legales',
    href: '/Servicios/ConstitucionEmpresasPage',
    enabled: true,
    color: 'from-[#0F766E] to-[#14B8A6]',
    icon: <Factory className="w-8 h-8" />,
    delay: 0.7
  },
  {
    title: 'Permisos de Salida de Menores',
    description: 'Tramita los permisos necesarios para viajes de menores',
    href: '/Servicios/PermisoSalida',
    enabled: true,
    color: 'from-[#7C3AED] to-[#C084FC]',
    icon: <span className="text-2xl">🧒</span>,
    delay: 0.8
  },
  {
    title: 'Regularización de Propiedades',
    description: 'Soluciones legales para regularizar tu propiedad',
    href: '/Servicios/Inmuebles',
    enabled: true,
    color: 'from-[#F43F5E] to-[#FB7185]',
    icon: <Home className="w-8 h-8" />,
    delay: 0.9
  },
  {
    title: 'Trámites Migratorios',
    description: 'Asesoría completa para tus procesos migratorios',
    href: '/Servicios/TramitesMigratorios',
    enabled: true,
    color: 'from-[#0C4A6E] to-[#38BDF8]',
    icon: <Plane className="w-8 h-8" />,
    delay: 1.0
  }
];

const ServiceCard = ({ service }: { service: Service }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isMounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: service.delay }}
      whileHover={{ scale: 1.05 }}
      className={`rounded-2xl bg-gradient-to-br ${service.color} text-white p-6 flex flex-col shadow-lg transition-all duration-300 hover:shadow-2xl`}
    >
      {service.enabled ? (
        <Link href={service.href} className="block h-full">
          <div className="flex flex-col h-full">
            <div className="bg-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-6">
              {service.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 leading-snug">{service.title}</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">{service.description}</p>
            <div className="mt-auto">
              <span className="inline-flex items-center text-white/90 text-sm font-medium group">
                Ver detalles
                <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="opacity-50">
          <div className="bg-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-6">
            {service.icon}
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">{service.title}</h3>
          <p className="text-white/80 text-sm mb-6">{service.description}</p>
          <p className="text-sm italic text-white/70">Próximamente...</p>
        </div>
      )}
    </motion.div>
  );
};

export default function ServiciosPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (

    <>
      <main className="relative min-h-screen w-full bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white overflow-hidden">
        <svg
          className="absolute right-0 top-0 w-0 sm:w-1/3 md:w-[45%] lg:w-[55%] h-full object-cover z-0 pointer-events-none"
          viewBox="0 0 600 800"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="shapeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
          </defs>
          <path
            d="M600,0 C520,120 580,240 480,320 C370,400 440,540 340,640 C240,740 360,840 200,900 C100,940 0,960 0,1080 L600,1080 Z"
            fill="url(#shapeGradient)"
          />
        </svg>
        <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 bg-white rounded-t-[100%] z-10"></div>

        <Header />
        <section className="relative z-10 pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-sm font-medium tracking-wide mb-4"
              initial={{ opacity: 0 }}
              animate={isMounted ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Servicios Legales
            </motion.span>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Conoce todo lo que puedes automatizar
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isMounted ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              Elige entre nuestras soluciones legales inteligentes y comienza a resolver tu caso hoy mismo.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            {services.map((service, idx) => (
              <ServiceCard key={idx} service={service} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-20 bg-white text-[#7F1D1D] rounded-2xl shadow-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">¿No encuentras lo que necesitas?</h2>
            <p className="text-[#7F1D1D]/70 mb-6 text-sm sm:text-base">
              Contáctanos para una asesoría legal personalizada y encuentra una solución a tu medida.
            </p>
            <motion.button
              className="bg-gradient-to-r from-[#EC4899] to-[#F59E0B] text-white px-6 py-3 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              Solicitar Consulta
            </motion.button>
          </motion.div>
        </section>

        <NoPayChatLauncher />

      </main>
      <Footer />
    </>

  );
}