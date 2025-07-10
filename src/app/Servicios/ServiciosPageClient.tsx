'use client';


import Link from 'next/link';
import { ReactElement } from 'react';
import React, { useState, useEffect, useMemo, Children } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Scale, Car, FileText, BookOpen, Landmark, Factory, Home, Plane, Zap, ChevronRight, UserCheck, Copyright, LucideIcon } from 'lucide-react';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import NoPayBackground from 'components/NoPayBackground';

interface Service {
  title: string;
  description: string;
  href: string;
  color: string;
  icon: LucideIcon;
}


const services = [
  {
    title: 'Apelación Inteligente',
    description: 'Sistema AI para impugnar multas automáticamente',
    href: '/Servicios/Impugnacion',
    color: '#3b82f6',
    icon: <Car className="w-5 h-5" />,
  },
  {
    title: 'Matriculación vehicular',
    description: 'Gestión completa de trámites de matriculación vehicular',
    href: '/Servicios/Matriculacion',
    color: '#f59e0b',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: 'Asesor Legal AI',
    description: 'Chatbot jurídico entrenado en la constitución Ecuatoriana',
    href: '/Servicios/AsesoriaLegal',
    color: '#10b981',
    icon: <Scale className="w-5 h-5" />,
  },
  {
    title: 'Contratos Automatizados',
    description: 'Generación instantánea de documentos legales',
    href: '/Servicios/DocumentosLegales',
    color: '#6366f1',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: 'Registro de Marcas',
    description: 'Protege tu marca con nuestro servicio especializado',
    href: '/Servicios/Marcas',
    color: '#ec4899',
    icon: <Landmark className="w-5 h-5" />,
  },
  {
    title: 'Startup Legal Express',
    description: 'Constitución de empresas en 24h',
    href: '/Servicios/ConstitucionEmpresasPage',
    color: '#14b8a6',
    icon: <Factory className="w-5 h-5" />,
  },
  {
    title: 'Propiedad Intelectual',
    description: 'Tokenización de bienes inmuebles',
    href: '/Servicios/PropiedadIntelectual',
    color: '#6366f1',
    icon: <Copyright className="w-5 h-5" />,
  },
  {
    title: 'Permisos de Salida de Menores',
    description: 'Tramita los permisos necesarios para viajes de menores',
    href: '/Servicios/PermisoSalida',
    color: '#ec4899',
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    title: 'Regularización de Propiedades',
    description: 'Soluciones legales para regularizar tu propiedad',
    href: '/Servicios/Inmuebles',
    color: '#14b8a6',
    icon: <Home className="w-5 h-5" />,
  },
  {
    title: 'Migración',
    description: 'Asesoría completa para tus procesos migratorios',
    href: '/Servicios/TramitesMigratorios',
    color: '#0ea5e9',
    icon: <Plane className="w-5 h-5" />,
  }
];



type TechCardProps = {
  service: Service;
  index: number;
};


const TechCard: React.FC<TechCardProps> = ({ service, index }) => {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={service.href} className="block h-full group">
        <div className="
          relative h-full bg-white rounded-xl md:rounded-2xl border border-gray-100
          shadow-sm hover:shadow-xl overflow-hidden group transition-all duration-300
        ">
          {/* Barra vertical de color NoPay a la izquierda */}
          <div
            className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
            style={{
              background: `linear-gradient(to bottom, ${service.color}, #EC4899 90%)`,
            }}
          />
          {/* Glow gradiente al hacer hover */}
          <div
            className={`
              absolute inset-0 pointer-events-none transition-opacity duration-300
              ${hovered ? 'opacity-20' : 'opacity-0'}
            `}
            style={{
              background: `linear-gradient(135deg, ${service.color}10 30%, #EC489922 100%)`,
            }}
          />

          {/* Contenido */}
          <div className="flex flex-col h-full px-6 py-6 md:px-7 md:py-7 z-10 relative">
            {/* Icono con fondo suave NoPay */}
            <motion.div
              className="
                mb-4 rounded-lg shadow-inner w-11 h-11 flex items-center justify-center
                bg-gradient-to-br from-pink-100 to-pink-200
              "
              style={{
                background: hovered
                  ? `linear-gradient(135deg, ${service.color}30 50%, #EC489955 100%)`
                  : `linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)`
              }}
              animate={{
                rotate: hovered ? 7 : 0,
                scale: hovered ? 1.09 : 1,
              }}
              transition={{ duration: 0.21 }}
            >
              {React.cloneElement(service.icon as React.ReactElement, {
                className: "h-5 w-5 md:h-6 md:w-6",
                style: { color: service.color }
              })}
            </motion.div>

            {/* Título */}
            <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition-colors mb-2"
              style={{
                letterSpacing: "-0.5px",
              }}>
              {service.title}
            </h3>

            {/* Descripción */}
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-6 flex-grow">{service.description}</p>

            {/* Botón animado */}
            <motion.div
              className="mt-auto flex items-center gap-1 font-medium cursor-pointer"
              animate={{
                color: hovered ? service.color : '#6b7280'
              }}
              transition={{ duration: 0.22 }}
            >
              <span className="text-sm">Explorar</span>
              <motion.div
                animate={{
                  x: hovered ? 8 : 0
                }}
                transition={{ duration: 0.18 }}
              >
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};



export default function ServiciosPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <main className="relative min-h-screen w-full overflow-hidden white">
        <NoPayBackground />
        <Header />

        <motion.div style={{ scale }} className="relative z-10">
          <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-gray-300 text-sm font-mono mb-6"
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                LEGALTECH PLATFORM
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500"
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
              >
                <span className="block">Plataforma</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Jurídica Digital</span>
              </motion.h1>

              <motion.p
                className="text-lg text-gray-400 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
              >
                Integramos inteligencia artificial, blockchain y biometría para transformar tus procesos legales
              </motion.p>
            </motion.div>

            {/* Grid de servicios */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <AnimatePresence>
                {services.map((service, idx) => (
                  <TechCard key={idx} service={service} index={idx} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-20"
            >



              <div className="relative rounded-2xl overflow-hidden border-0 shadow-2xl group"
                style={{
                  background: "rgba(255,255,255,0.88)", // glass blanco
                  boxShadow: "0 6px 40px 8px #EC489950, 0 1.5px 8px #F59E0B22",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Borde gradiente animado */}
                <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
                  style={{
                    padding: 2,
                    background: "linear-gradient(90deg, #7F1D1D, #EC4899, #F59E0B)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    opacity: 0.85
                  }}
                ></div>

                {/* Fondo suave, textura opcional */}
                <div className="absolute inset-0 z-0 bg-white/60" />
                {/* Si quieres puedes dejar la textura noise, pero muy sutil */}
                <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>

                <div className="relative z-20 p-8 sm:p-12 text-center">
                  <h2
                    className="text-3xl sm:text-4xl font-bold mb-4"
                    style={{
                      background: "linear-gradient(90deg, #7F1D1D, #EC4899 60%, #F59E0B 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.5px"
                    }}
                  >
                    ¿Listo para el futuro del derecho?
                  </h2>
                  <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
                    Únete a cientos de clientes que ya automatizaron sus procesos legales con nuestra plataforma.
                  </p>
                  <motion.button
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white font-bold shadow-lg hover:scale-105 transition-all outline-none focus:ring-2 focus:ring-[#EC4899]/60"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 32px #EC4899bb" }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: ["0 0 24px #EC489980", "0 0 40px #F59E0B80"],
                      filter: ["brightness(1.08)", "brightness(1.0)"],
                    }}
                    transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <Zap className="w-5 h-5" />
                    Comenzar ahora
                  </motion.button>

                </div>
              </div>



            </motion.div>
          </section>
        </motion.div>

        <NoPayChatLauncher />
      </main>

      <Footer />
    </>
  );
}