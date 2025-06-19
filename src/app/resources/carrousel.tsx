'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ArrowRight,
  Car,
  FileText,
  Scale,
  BookOpen,
  Landmark,
  Factory,
  Home,
  Plane,
} from 'lucide-react';
import Link from 'next/link';

type Service = {
  title: string;
  description: string;
  href: string;
  enabled: boolean;
  color: string;
  icon: React.ReactNode;
  features: string[];
};

const services: Service[] = [
  {
    title: 'Apelación de Multas de Tránsito',
    description: 'Impugna multas injustas con nuestro apoyo legal especializado',
    href: '/Servicios/Impugnacion',
    enabled: true,
    color: 'from-[#0A1D3E] to-[#4F46E5]',
    icon: <Car className="w-8 h-8 text-[#0A1D3E]" />,
    features: ['92% de éxito', 'Respuesta en 24h', 'Sin costo inicial'],
  },
  {
    title: 'Matriculación vehicular',
    description: 'Gestión completa de trámites de matriculación vehicular',
    href: '/Servicios/Matriculacion',
    enabled: true,
    color: 'from-[#D97706] to-[#FBBF24]',
    icon: <FileText className="w-8 h-8 text-[#D97706]" />,
    features: ['Gestión integral', 'Ahorro de tiempo', 'Seguimiento paso a paso'],
  },
  {
    title: 'Asesoría Legal Automatizada',
    description: 'Respuestas inmediatas a tus consultas legales',
    href: '/Servicios/AsesoriaLegal',
    enabled: true,
    color: 'from-[#059669] to-[#10B981]',
    icon: <Scale className="w-8 h-8 text-[#059669]" />,
    features: ['Respuesta inmediata', 'Abogados certificados', 'Cobertura 24/7'],
  },
  {
    title: 'Redacción de Documentos Legales',
    description: 'Documentos profesionales adaptados a tus necesidades',
    href: '/Servicios/DocumentosLegales',
    enabled: true,
    color: 'from-[#1E40AF] to-[#6366F1]',
    icon: <BookOpen className="w-8 h-8 text-[#1E40AF]" />,
    features: ['Plantillas legales', 'Revisión profesional', 'Garantía de validez'],
  },
  {
    title: 'Registro de Marcas',
    description: 'Protege tu marca con nuestro servicio especializado',
    href: '/Servicios/Marcas',
    enabled: true,
    color: 'from-[#BE123C] to-[#E11D48]',
    icon: <Landmark className="w-8 h-8 text-[#BE123C]" />,
    features: ['Búsqueda previa', 'Gestión completa', 'Seguimiento continuo'],
  },
  {
    title: 'Propiedad Intelectual',
    description: 'Protección legal para tus creaciones e invenciones',
    href: '/Servicios/PropiedadIntelectual',
    enabled: true,
    color: 'from-[#4C1D95] to-[#8B5CF6]',
    icon: <span className="text-2xl text-[#4C1D95]">💡</span>,
    features: ['Asesoramiento experto', 'Registro completo', 'Protección internacional'],
  },
  {
    title: 'Constitución de Empresas',
    description: 'Crea tu empresa con todos los requisitos legales',
    href: '/Servicios/ConstitucionEmpresasPage',
    enabled: true,
    color: 'from-[#0F766E] to-[#14B8A6]',
    icon: <Factory className="w-8 h-8 text-[#0F766E]" />,
    features: ['Asesoría fiscal', 'Optimización legal', 'Compliance regulatorio'],
  },
  {
    title: 'Permisos de Salida de Menores',
    description: 'Tramita los permisos necesarios para viajes de menores',
    href: '/Servicios/PermisoSalida',
    enabled: true,
    color: 'from-[#7C3AED] to-[#C084FC]',
    icon: <span className="text-2xl text-[#7C3AED]">🧒</span>,
    features: ['Gestión rápida', 'Requisitos claros', 'Aprobación garantizada'],
  },
  {
    title: 'Regularización de Propiedades',
    description: 'Soluciones legales para regularizar tu propiedad',
    href: '/Servicios/Inmuebles',
    enabled: true,
    color: 'from-[#F43F5E] to-[#FB7185]',
    icon: <Home className="w-8 h-8 text-[#F43F5E]" />,
    features: ['Análisis jurídico', 'Solución de conflictos', 'Tramitación completa'],
  },
  {
    title: 'Trámites Migratorios',
    description: 'Asesoría completa para tus procesos migratorios',
    href: '/Servicios/TramitesMigratorios',
    enabled: true,
    color: 'from-[#0C4A6E] to-[#38BDF8]',
    icon: <Plane className="w-8 h-8 text-[#0C4A6E]" />,
    features: ['Visas y permisos', 'Reunificación familiar', 'Residencia permanente'],
  },
];

export default function ServicesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3); // Estado para controlar cuántas tarjetas se muestran

  // Efecto para determinar el número de tarjetas visibles según el tamaño de pantalla
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    // Ejecutar al montar y al cambiar el tamaño de la ventana
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);

    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Activar animación al montar
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-rotación cada 5 segundos
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === services.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, visibleCards]);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (visibleCards === 1) {
        return prev === services.length - 1 ? 0 : prev + 1;
      } else if (visibleCards === 2) {
        return prev >= services.length - 2 ? 0 : prev + 1;
      } else {
        return prev === services.length - 1 ? 0 : prev + 1;
      }
    });
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (visibleCards === 1) {
        return prev === 0 ? services.length - 1 : prev - 1;
      } else if (visibleCards === 2) {
        return prev <= 0 ? services.length - 2 : prev - 1;
      } else {
        return prev === 0 ? services.length - 1 : prev - 1;
      }
    });
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  // Función para obtener los índices de las tarjetas visibles
  const getVisibleIndices = () => {
    if (visibleCards === 1) {
      return [currentIndex];
    } else if (visibleCards === 2) {
      return [
        currentIndex,
        currentIndex === services.length - 1 ? 0 : currentIndex + 1,
      ];
    } else {
      return [
        currentIndex === 0 ? services.length - 1 : currentIndex - 1,
        currentIndex,
        currentIndex === services.length - 1 ? 0 : currentIndex + 1,
      ];
    }
  };

  return (
    <main className="relative w-full bg-white text-gray-800 overflow-hidden">
      {/* SVG decorativo al lado derecho */}
      <svg
        className="absolute right-0 top-0 w-full md:w-[55%] h-full object-cover z-0 opacity-20"
        viewBox="0 0 600 800"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="shapeGradientLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
        <path
          d="M600,0 C520,120 580,240 480,320 C370,400 440,540 340,640 C240,740 360,840 200,900 C100,940 0,960 0,1080 L600,1080 Z"
          fill="url(#shapeGradientLight)"
        />
      </svg>

      {/* Cierre inferior blanco */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-white z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Encabezado del carrusel */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isMounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EC4899] to-[#FBBF24] px-4 py-2 rounded-full mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-white"
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Servicios Legales NoPay</span>
          </motion.div>

          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Conoce todo lo que puedes{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#FBBF24]">
              automatizar
            </span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Elige entre nuestras soluciones legales inteligentes y comienza a
            resolver tu caso hoy mismo.
          </motion.p>
        </motion.div>

        {/* Controles del carrusel */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 px-4 sm:px-0">
          <button
            onClick={prevSlide}
            className="p-1 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="flex gap-1 sm:gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all ${
                  currentIndex === index
                    ? 'bg-gradient-to-r from-[#EC4899] to-[#FBBF24] h-2 w-4 sm:h-3 sm:w-6'
                    : 'bg-gray-300 h-1.5 w-1.5 sm:h-2 sm:w-2'
                }`}
                aria-label={`Ir al servicio ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-1 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Carrusel */}
        <div className="relative px-2 sm:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className={`grid grid-cols-1 ${visibleCards >= 2 ? 'md:grid-cols-2' : ''} ${visibleCards >= 3 ? 'lg:grid-cols-3' : ''} gap-4 sm:gap-6 md:gap-8`}>
                {/* Mostrar las tarjetas visibles según el tamaño de pantalla */}
                {getVisibleIndices().map((idx) => {
                  const service = services[idx];
                  return (
                    <motion.div
                      key={service.title}
                      className={`rounded-xl sm:rounded-2xl overflow-hidden border transition-all ${
                        idx === currentIndex
                          ? 'border-transparent shadow-md sm:shadow-lg scale-[1.02] sm:scale-105 z-10'
                          : 'border-gray-200 opacity-80 scale-95'
                      }`}
                      whileHover={{
                        scale: idx === currentIndex ? (visibleCards === 1 ? 1.05 : 1.08) : (visibleCards === 1 ? 1.02 : 1.02),
                      }}
                    >
                      <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${service.color}`}></div>

                      <div className="p-4 sm:p-6 md:p-8 bg-white h-full flex flex-col">
                        <div
                          className={`bg-gradient-to-r ${service.color} p-2 sm:p-3 rounded-lg sm:rounded-xl w-max mb-4 sm:mb-6 text-white`}
                        >
                          {service.icon}
                        </div>

                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                          {service.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                          {service.description}
                        </p>

                        <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-8 flex-1">
                          {service.features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center text-xs sm:text-sm text-gray-600"
                            >
                              <div
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2 sm:mr-3 bg-gradient-to-r ${service.color}`}
                              ></div>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={service.href}
                          className="mt-auto inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-800 hover:text-[#EC4899] transition-colors font-medium"
                        >
                          Ver detalles <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicador de progreso */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="w-20 sm:w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#EC4899] to-[#FBBF24]"
              animate={{
                width: `${((currentIndex + 1) / services.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isMounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-12 md:mt-16 bg-gray-100 text-gray-800 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-6 sm:p-8 md:p-10 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
            ¿No encuentras lo que necesitas?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6">
            Contáctanos para una asesoría legal personalizada y encuentra una
            solución a tu medida.
          </p>
          <motion.button
            className="bg-gradient-to-r from-[#EC4899] to-[#FBBF24] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-semibold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Solicitar Consulta
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}