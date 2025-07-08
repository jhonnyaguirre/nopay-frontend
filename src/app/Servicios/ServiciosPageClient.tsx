'use client';

 
import Link from 'next/link';

import React, { useState, useEffect, useMemo, Children } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Scale, Car, FileText, BookOpen, Landmark, Factory, Home, Plane, Zap, ChevronRight, UserCheck, Copyright } from 'lucide-react';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import NoPayBackground from 'components/NoPayBackground';

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
    icon: <Copyright  className="w-5 h-5" />,
  },
  {
    title: 'Permisos de Salida de Menores',
    description: 'Tramita los permisos necesarios para viajes de menores',
    href: '/Servicios/PermisoSalida',
    color: '#ec4899',
    icon: <UserCheck  className="w-5 h-5" />,
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

const TechCard = ({ service, index }: { service: typeof services[0], index: number }) => {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={service.href} className="block h-full group">
        <div className="h-full rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden border border-gray-700/50 shadow-2xl">
          {/* Efecto de iluminación */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
              animate={{
                opacity: hovered ? 0.15 : 0,
                backgroundPosition: hovered ? '100% 100%' : '0% 0%'
              }}
              transition={{ duration: 0.6 }}
            />
          </div>

          {/* Borde animado */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: `0 0 0 1px ${service.color}20`,
            }}
            animate={{
              boxShadow: hovered ? `0 0 0 1px ${service.color}80, 0 0 30px ${service.color}30` : `0 0 0 1px ${service.color}20`
            }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative h-full flex flex-col p-6 z-10">
            {/* Icono con efecto */}
            <motion.div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm`}
              style={{ backgroundColor: `${service.color}20` }}
              animate={{
                backgroundColor: hovered ? `${service.color}30` : `${service.color}20`,
                boxShadow: hovered ? `0 0 0 1px ${service.color}50` : 'none'
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{
                  color: hovered ? service.color : 'white',
                  scale: hovered ? 1.15 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {service.icon}
              </motion.div>
            </motion.div>
            
            {/* Contenido */}
            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-gray-400 text-sm mb-6">{service.description}</p>
            
            {/* Botón animado */}
            <motion.div
              className="mt-auto flex items-center"
              animate={{
                color: hovered ? service.color : '#9ca3af'
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm font-medium">Explorar</span>
              <motion.div
                animate={{
                  x: hovered ? 5 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-4 h-4 ml-2" />
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
              <div className="relative rounded-2xl overflow-hidden border border-gray-700/50">
                {/* Efecto de fondo */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                </div>
                
                <div className="relative z-10 p-8 sm:p-12 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    ¿Listo para el futuro del derecho?
                  </h2>
                  
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    Únete a cientos de clientes que ya automatizaron sus procesos legales con nuestra plataforma.
                  </p>
                  
                  <motion.button
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
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