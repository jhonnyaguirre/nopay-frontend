'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, valorRegistroMarcaPhase1, valorRegistroMarcaPhase2, valorImpugnacionGl, valorPermisoSalida } from "config/apiConfig";
import { 
  ChevronLeft, ChevronRight, BadgeCheck, ArrowRight, 
  Car, Landmark, UserCheck, Sparkles, Bell
} from 'lucide-react';
import Link from 'next/link';

// Definición de servicios (el 4º es especial)
const services = [
  { 
    id: 1, 
    title: 'Impugnación de Multas de Tránsito', 
    price: valorImpugnacionGl, 
    desc: 'Impugna tu multa de tránsito con un proceso claro, rápido y guiado.', 
    color: 'from-blue-600 to-indigo-600', 
    icon: <Car />, 
    href: '/Servicios/Impugnacion' 
  },
  { 
    id: 2, 
    title: 'Registro de Marcas', 
    price: valorRegistroMarcaPhase1, 
    desc: 'Protege y registra tu marca con una experiencia legal simple y segura.', 
    color: 'from-pink-600 to-purple-600', 
    icon: <Landmark />, 
    href: '/Servicios/Marcas' 
  },
  { 
    id: 3, 
    title: 'Permisos de Salida del país', 
    price: valorPermisoSalida, 
    desc: 'Tramitación rápida de permisos de viaje para menores con validez notarial.', 
    color: 'from-purple-500 to-pink-500', 
    icon: <UserCheck />, 
    href: '/Servicios/PermisoSalida' 
  },
  { 
    id: 4, 
    title: 'Nuevos Servicios', 
    price: null, 
    desc: 'Cada trimestre lanzamos soluciones legales de vanguardia. Sé el primero en acceder a la próxima generación de justicia automatizada.', 
    color: 'from-amber-400 to-orange-600', 
    icon: <Sparkles />, 
    href: '/Novedades',
    special: true 
  },
];

export default function ServicesPureLightAuto() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % services.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + services.length) % services.length);
  }, []);

  // Auto-play cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(timer);
  }, [next]);

  // Función para obtener el trimestre actual (ej: "Q2 2026")
  const getCurrentQuarter = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `Q${quarter} ${now.getFullYear()}`;
  };

  const currentService = services[index];
  const isSpecial = currentService.special === true;

  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden py-20">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[5%] w-[40vw] h-[40vw] bg-slate-50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[35vw] h-[35vw] bg-blue-50 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-8 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-7xl mx-auto">
          
          {/* BLOQUE IZQUIERDO: TEXTO */}
          <div className="flex flex-col space-y-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-fit flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-100 bg-white shadow-sm"
            >
              <BadgeCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Legal Technology 2026</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="space-y-6"
              >
                {isSpecial ? (
                  // Título mágico para el servicio especial
                  <h2 className="text-6xl md:text-[5.5rem] font-[900] text-slate-900 leading-[0.90] tracking-tight">
                    <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                      Novedades<br/>Cada Trimestre
                    </span>
                  </h2>
                ) : (
                  <h2 className="text-6xl md:text-[5.5rem] font-[900] text-slate-900 leading-[0.90] tracking-tight">
                    {currentService.title.split(' ')[0]} <br/>
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentService.color}`}>
                      {currentService.title.split(' ').slice(1).join(' ')}
                    </span>
                  </h2>
                )}
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-md leading-relaxed h-24 italic">
                  "{currentService.desc}"
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex gap-3">
                <NavButton onClick={prev} icon={<ChevronLeft size={24} />} />
                <NavButton onClick={next} icon={<ChevronRight size={24} />} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Servicio</span>
                <div className="text-2xl font-black text-slate-900">
                  {String(index + 1).padStart(2, '0')} <span className="text-slate-200">/ {services.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BLOQUE DERECHO: TARJETA */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, scale: 0.8, rotateY: direction * 20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: direction * -20 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-full max-w-[420px] aspect-[4/5]"
              >
                {/* Etiqueta flotante (precio o trimestre) */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -right-4 top-32 z-30 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.1)] rounded-2xl p-4 border border-slate-50 flex flex-col items-center min-w-[100px]"
                >
                  {isSpecial ? (
                    <>
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">Próximamente</span>
                      <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                        {getCurrentQuarter()}
                      </div>
                      <div className="w-6 h-1 bg-amber-100 rounded-full mt-1" />
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Desde</span>
                      <div className={`text-3xl font-[1000] text-transparent bg-clip-text bg-gradient-to-br ${currentService.color}`}>
                        ${currentService.price}
                      </div>
                      <div className="w-6 h-1 bg-slate-100 rounded-full mt-1" />
                    </>
                  )}
                </motion.div>

                {/* Cuerpo de la tarjeta */}
                <div className={`h-full w-full bg-white border border-slate-50 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] p-12 flex flex-col justify-between overflow-hidden relative ${isSpecial ? 'bg-gradient-to-br from-amber-50 to-white' : ''}`}>
                  
                  {/* Icono y número */}
                  <div className="flex justify-between items-start">
                    <motion.div 
                      key={index}
                      initial={{ rotate: -45, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      className={`p-6 rounded-[2rem] bg-gradient-to-br ${currentService.color} text-white shadow-2xl shadow-blue-200/50 ${isSpecial ? 'animate-pulse-slow' : ''}`}
                    >
                      {isSpecial ? (
                        <Sparkles size={36} strokeWidth={2.5} />
                      ) : (
                        React.cloneElement(
							  currentService.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
							  {
								width: 36,
								height: 36,
								strokeWidth: 2.5,
							  }
							)
                      )}
                    </motion.div>
                    <span className="text-7xl font-black text-slate-50 italic select-none">
                      {String(currentService.id).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="space-y-8 relative z-10">
                    {/* Indicadores de página */}
                    <div className="flex gap-1.5 flex-wrap">
                      {services.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 rounded-full transition-all duration-700 ${index === i ? `w-10 bg-gradient-to-r ${currentService.color}` : 'w-1.5 bg-slate-100'}`} 
                        />
                      ))}
                    </div>
                    
                    {/* Título secundario */}
                    <div className="space-y-1">
                      <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                        {isSpecial ? 'Smart Legal Evolution' : 'Smart Legal Experience'}
                      </h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                        {isSpecial ? 'Lanzamiento trimestral · 2026' : 'Automated Protocol v2.6'}
                      </p>
                    </div>

                    {/* Botón de acción */}
                    <Link href={currentService.href} className="w-full">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 group transition-all ${
                          isSpecial 
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:shadow-amber-200/50' 
                            : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-200'
                        }`}
                      >
                        {isSpecial ? (
                          <>Recibir novedades <Bell size={20} className="group-hover:rotate-12 transition-transform" /></>
                        ) : (
                          <>Iniciar Proceso <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></>
                        )}
                      </motion.button>
                    </Link>
                  </div>

                  {/* Fondo decorativo animado (especial) */}
                  <div className={`absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-br ${currentService.color} opacity-[0.06] blur-[60px] transition-all duration-1000 ${isSpecial ? 'animate-pulse-slow' : ''}`} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Estilos globales para las animaciones personalizadas */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.18; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// Componente auxiliar para los botones de navegación
function NavButton({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "#f8fafc" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors bg-white shadow-sm active:bg-slate-100"
    >
      {icon}
    </motion.button>
  );
}