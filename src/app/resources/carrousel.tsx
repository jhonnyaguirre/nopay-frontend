'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  valorRegistroMarcaPhase1,
  valorImpugnacionGl,
  valorPermisoSalida,
} from 'config/apiConfig';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Car,
  Landmark,
  UserCheck,
  Sparkles,
  Bell,
  ShieldCheck,
  Clock3,
} from 'lucide-react';
import Link from 'next/link';

// --------------------------------------------------------------
// COMPONENTE VECTORIAL PREMIUM: ESTRELLA CINEMÁTICA MARQUETERA
// --------------------------------------------------------------
const CinematicStar = ({ className = "h-4 w-4 text-amber-400" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
  </svg>
);

// --------------------------------------------------------------
// CONSTANTES DE DATOS
// --------------------------------------------------------------
const SERVICE_ITEMS = [
  {
    id: 1,
    title: 'Impugnación de Multas',
    subtitle: 'de Tránsito',
    price: valorImpugnacionGl,
    description: 'Impugna tu multa con un proceso claro, rápido y guiado por IA.',
    color: 'from-blue-600 to-indigo-600',
    glow: 'shadow-blue-500/20',
    icon: Car,
    href: '/Servicios/Impugnacion',
    tags: ['Sin filas', 'Resolución en días'],
  },
  {
    id: 2,
    title: 'Registro',
    subtitle: 'de Marcas',
    price: valorRegistroMarcaPhase1,
    description: 'Protege tu marca con una experiencia legal simple, segura y eficiente.',
    color: 'from-pink-600 to-purple-600',
    glow: 'shadow-pink-500/20',
    icon: Landmark,
    href: '/Servicios/Marcas',
    tags: ['Clasificación Niza', 'Búsqueda previa'],
  },
  {
    id: 3,
    title: 'Permisos de Salida',
    subtitle: 'para Menores',
    price: valorPermisoSalida,
    description: 'Genera documentos y minutas para permisos de salida del país sin complicaciones.',
    color: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/20',
    icon: UserCheck,
    href: '/Servicios/PermisoSalida',
    tags: ['Minuta legal', 'Requisitos guiados'],
  },
  {
    id: 4,
    title: 'Nuevos',
    subtitle: 'Servicios',
    price: null,
    description: 'Cada trimestre lanzamos nuevas soluciones legales digitales. ¡Sé el primero en enterarte!',
    color: 'from-amber-400 to-orange-600',
    glow: 'shadow-amber-500/20',
    icon: Sparkles,
    href: '/Novedades',
    special: true,
    tags: ['Lanzamientos', 'Early access'],
  },
];

// --------------------------------------------------------------
// SUBCOMPONENTES REUTILIZABLES
// --------------------------------------------------------------
const InfoPill = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <motion.span
    whileHover={{ y: -1 }}
    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm border border-slate-100 transition-all hover:shadow-md"
  >
    <Icon className="h-3.5 w-3.5 text-rose-500" strokeWidth={2} aria-hidden="true" />
    {text}
  </motion.span>
);

const NavButton = ({ onClick, icon: Icon, label }: { onClick: () => void; icon: React.ElementType; label: string }) => (
  <motion.button
    type="button"
    aria-label={label}
    whileHover={{ scale: 1.06, backgroundColor: '#ffffff', y: -1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm border border-slate-100 transition-colors hover:text-slate-950 active:bg-slate-50"
  >
    <Icon size={22} />
  </motion.button>
);

// --------------------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------------------
export default function ServicesPureLightAuto() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-7, 7]);

  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const currentService = SERVICE_ITEMS[activeIndex];
  const isSpecial = currentService.special === true;

  const next = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % SERVICE_ITEMS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + SERVICE_ITEMS.length) % SERVICE_ITEMS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getCurrentQuarter = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `Q${quarter} ${now.getFullYear()}`;
  };

  return (
    <section
      id="servicios-legales-nopay"
      aria-labelledby="servicios-nopay-title"
      className="relative overflow-hidden bg-white px-4 py-12 md:px-8 md:py-20 lg:py-24"
    >
      {/* Fondo con partículas sutiles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300/20 blur-[1px] animate-pulse"
            style={{
              left: `${10 + (i * 15) % 80}%`,
              top: `${20 + (i * 12) % 60}%`,
              width: i % 2 === 0 ? '4px' : '2px',
              height: i % 2 === 0 ? '4px' : '2px',
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl" ref={containerRef}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          
          {/* COLUMNA IZQUIERDA: Textos y Títulos con Estrellas Cinematográficas */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <div className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-white via-rose-50/80 to-white px-5 py-2.5 shadow-md border border-rose-200/60 transition-all hover:shadow-lg hover:border-rose-300">
                <div className="rounded-full bg-rose-100 p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="text-xs md:text-sm font-black uppercase tracking-[0.15em] bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Resuelve Servicios legales · en{' '}
                  <span className="text-rose-600 text-base md:text-lg mx-0.5 inline-block transform transition-all group-hover:scale-105">
                    5
                  </span>{' '}
                  minutos
                </span>
                <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400 opacity-70 group-hover:animate-pulse" />
              </div>
            </motion.div>

            {/* Contenido dinámico principal */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentService.id}
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? -18 : 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: direction >= 0 ? 18 : -18, filter: 'blur(5px)' }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5 text-center lg:text-left relative"
              >
                <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                  Servicio {String(activeIndex + 1).padStart(2, '0')} / {SERVICE_ITEMS.length}
                </p>

                {/* CONTENEDOR DEL NOMBRE: Estrellas asíncronas con destellos fluidos */}
                <div className="relative inline-block w-full group/title">
                  
                  {/* Estrella Dorada Superior Izquierda */}
                  <motion.div 
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5], rotate: [0, 90, 180] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -left-1 hidden lg:block"
                  >
                    <CinematicStar className="h-5 w-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  </motion.div>
                  
                  {/* Estrella Rosada Inferior Derecha (al final del texto) */}
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4], rotate: [180, 90, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-1 right-2 hidden lg:block"
                  >
                    <CinematicStar className="h-4 w-4 text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                  </motion.div>

                  <h2
                    id="servicios-nopay-title"
                    className="relative z-10 mx-auto lg:mx-0 max-w-xl text-[2.2rem] sm:text-[2.8rem] md:text-[3.4rem] lg:text-[3.8rem] font-black leading-[1.02] lg:leading-[0.98] tracking-[-0.05em] text-slate-950"
                  >
                    {currentService.title}
                    <span className={`block bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent mt-1.5`}>
                      {currentService.subtitle}
                    </span>
                  </h2>
                </div>

                <p className="mx-auto lg:mx-0 max-w-md text-sm sm:text-base md:text-lg font-medium leading-relaxed text-slate-500">
                  {currentService.description}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                  <InfoPill icon={Clock3} text={isSpecial ? 'Próximamente' : 'Inicio rápido'} />
                  <InfoPill icon={ShieldCheck} text="Proceso guiado" />
                  <InfoPill icon={Sparkles} text="IA + expertos" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controles de navegación */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <div className="flex gap-3">
                <NavButton onClick={prev} icon={ChevronLeft} label="Servicio anterior" />
                <NavButton onClick={next} icon={ChevronRight} label="Siguiente servicio" />
              </div>

              <div className="hidden h-10 w-px bg-slate-100 sm:block" />

              <div className="text-center sm:text-left hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  NoPay LegalTech
                </p>
                <p className="text-sm font-bold text-slate-700">
                  Trámites online en Ecuador
                </p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Tarjeta interactiva con Perspectiva 3D */}
          <div
            className="relative order-1 flex justify-center lg:order-2 lg:justify-end w-full px-2 sm:px-0"
            style={{ perspective: 1200 }} 
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentService.id}
                custom={direction}
                initial={{ opacity: 0, scale: 0.94, y: 16, rotateY: direction * 4 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -16, rotateY: direction * -4 }}
                transition={{ duration: 0.55, cubicBezier: [0.25, 1, 0.5, 1] }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[400px] will-change-transform"
              >
                {/* Resplandor ambiental de fondo */}
                <div
                  className={`absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br ${currentService.color} opacity-[0.12] blur-3xl transition-opacity duration-700`}
                />

                {/* Badge flotante de precio / fecha */}
                <motion.div
                  initial={{ x: 12, opacity: 0, translateZ: 40 }}
                  animate={{ x: 0, opacity: 1, translateZ: 40 }}
                  transition={{ delay: 0.22 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="absolute right-3 top-20 sm:top-24 z-30 flex min-w-[95px] flex-col items-center rounded-2xl bg-white/95 border border-slate-100 p-2.5 shadow-xl backdrop-blur-sm group/badge"
                >
                  <div className="absolute -top-1.5 -left-1.5 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300">
                    <CinematicStar className="h-3 w-3 text-amber-400" />
                  </div>
                  {isSpecial ? (
                    <>
                      <span className="text-[8px] font-black uppercase tracking-tight text-amber-500">
                        Próximamente
                      </span>
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-base font-black text-transparent">
                        {getCurrentQuarter()}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-[8px] font-black uppercase tracking-tight text-slate-400">
                        Desde
                      </span>
                      <div
                        className={`bg-gradient-to-br ${currentService.color} bg-clip-text text-xl sm:text-2xl font-black text-transparent`}
                      >
                        ${currentService.price}
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Tarjeta Principal */}
                <article 
                  className="group/card relative min-h-[450px] sm:min-h-[480px] flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 sm:p-10 shadow-2xl shadow-slate-200/80 transition-shadow duration-500 hover:shadow-[0_30px_60px_rgba(15,23,42,0.08)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  
                  {/* Escáner de luz dorada lineal */}
                  <motion.div
                    initial={{ y: '150%', opacity: 0 }}
                    animate={{ y: '-150%', opacity: [0, 0.45, 0.45, 0] }}
                    transition={{ duration: 3.2, ease: [0.25, 1, 0.5, 1], repeat: Infinity, repeatDelay: 2.5 }}
                    className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-amber-400/30 via-yellow-300/40 to-transparent h-[35%] w-full filter blur-[2px]"
                    style={{ mixBlendMode: 'color-burn' }}
                  />

                  {/* Reflejo interactivo según el cursor */}
                  <motion.div
                    className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(255,215,0,0.07),transparent_50%)] transition-opacity duration-300 opacity-0 group-hover/card:opacity-100"
                    style={{ '--x': glowX, '--y': glowY } as any}
                  />

                  {/* Número indicador de fondo e Icono del servicio */}
                  <div className="relative flex items-start justify-between w-full" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
                    <div className="relative -mt-2 select-none">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="90" height="90" viewBox="0 0 100 100" className="text-amber-400/30 drop-shadow-md">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
                        </svg>
                      </div>
                      <span className="relative z-10 block text-center text-5xl sm:text-6xl font-black italic leading-none text-slate-800/15 px-2 py-1">
                        {String(currentService.id).padStart(2, '0')}
                      </span>
                    </div>

                    <motion.div
                      key={currentService.id}
                      initial={{ rotate: -35, scale: 0.7 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.45, type: 'spring' }}
                      whileHover={{ scale: 1.08, rotate: 4 }}
                      className={`rounded-2xl bg-gradient-to-br ${currentService.color} p-4 text-white shadow-2xl ${currentService.glow}`}
                    >
                      <currentService.icon width={28} height={28} strokeWidth={2.2} aria-hidden="true" />
                    </motion.div>
                  </div>
                  
                  {/* Cuerpo Inferior */}
                  <div className="relative z-10 mt-8 w-full flex flex-col" style={{ transform: 'translateZ(25px)' }}>
                    
                    {/* Dots del Slider */}
                    <div className="mb-4 flex flex-wrap gap-1.5" aria-hidden="true">
                      {SERVICE_ITEMS.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setDirection(i > activeIndex ? 1 : -1);
                            setActiveIndex(i);
                          }}
                          className={`h-1 rounded-full transition-all duration-500 ${
                            activeIndex === i ? `w-8 bg-gradient-to-r ${currentService.color}` : 'w-2 bg-slate-200 hover:bg-slate-300'
                          }`}
                          aria-label={`Ir al servicio ${i + 1}`}
                        />
                      ))}
                    </div>

                    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.26em] text-slate-400">
                      {isSpecial ? 'Lanzamiento trimestral' : 'Smart Legal Experience'}
                    </p>

                    <h3 className="max-w-[260px] text-2xl sm:text-3xl font-black leading-[1.05] tracking-[-0.045em] text-slate-900">
                      {currentService.title}{' '}
                      <span className={`block sm:inline bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent`}>
                        {currentService.subtitle}
                      </span>
                    </h3>

                    {/* Botón CTA principal */}
                    <div className="mt-6 sm:mt-8 w-full">
                      <Link href={currentService.href} aria-label={`Iniciar ${currentService.title} ${currentService.subtitle}`}>
                        <motion.span
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className={`group/btn relative flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-xs font-black uppercase tracking-widest transition-all ${
                            isSpecial
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-slate-950 text-white hover:bg-rose-600 shadow-md'
                          }`}
                        >
                          {isSpecial ? 'Recibir novedades' : 'Quiero Resolver esto ahora'}
                          {isSpecial ? (
                            <Bell size={16} className="transition-transform group-hover/btn:rotate-12" />
                          ) : (
                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                          )}
                          
                          {/* Micro estrella que salta visualmente al hacer hover en el botón */}
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                            <CinematicStar className="h-3.5 w-3.5 text-amber-400" />
                          </div>
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </article>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer social proof */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400 border-t border-slate-200 pt-8">
            ✅ Más de 1,000+ personas ya resolvieron sus trámites con NoPay.{' '}
            <span className="font-medium text-slate-600">Sin filas, 100% digital y con respaldo legal.</span>
          </p>
        </div>
      </div>
    </section>
  );
}