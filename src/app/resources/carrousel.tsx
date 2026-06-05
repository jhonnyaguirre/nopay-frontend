'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  valorRegistroMarcaPhase1,
  valorImpugnacionGl,
  valorPermisoSalida,
} from 'config/apiConfig';
import {
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ArrowRight,
  Car,
  Landmark,
  UserCheck,
  Sparkles,
  Bell,
  ShieldCheck,
  Clock3,
  Star,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

// --------------------------------------------------------------
// CONSTANTES (datos centralizados y tipados)
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
    tags: ['Clasificación NIz', 'Búsqueda previa'],
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Auto-rotación cada 5 segundos
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
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
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          
          {/* COLUMNA IZQUIERDA: Texto, descripción y controles */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md border border-slate-100">
                <BadgeCheck className="h-4 w-4 text-rose-500" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Servicios legales digitales
                </span>
              </div>
            </motion.div>

            {/* Contenido dinámico con AnimatePresence */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentService.id}
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? -18 : 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: direction >= 0 ? 18 : -18, filter: 'blur(5px)' }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4 text-center lg:text-left"
              >
                <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                  Servicio {String(activeIndex + 1).padStart(2, '0')} / {SERVICE_ITEMS.length}
                </p>

                <h2
                  id="servicios-nopay-title"
                  className="mx-auto lg:mx-0 max-w-xl text-[2.2rem] sm:text-[2.8rem] md:text-[3.4rem] lg:text-[4rem] font-black leading-[1.02] lg:leading-[0.96] tracking-[-0.055em] text-slate-950"
                >
                  {currentService.title}
                  <span className={`block bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent mt-1`}>
                    {currentService.subtitle}
                  </span>
                </h2>

                <p className="mx-auto lg:mx-0 max-w-md text-sm sm:text-base md:text-lg font-medium leading-relaxed text-slate-500">
                  {currentService.description}
                </p>

                {/* Etiquetas de beneficios */}
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

          {/* COLUMNA DERECHA: Tarjeta interactiva */}
          <div
            className="relative order-1 flex justify-center lg:order-2 lg:justify-end w-full px-2 sm:px-0"
            onMouseMove={handleMouseMove}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentService.id}
                custom={direction}
                initial={{ opacity: 0, scale: 0.94, y: 16, rotate: direction * 1.5 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -16, rotate: direction * -1.5 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 115, damping: 20 }}
                className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[400px]"
              >
                {/* Resplandor de fondo */}
                <div
                  className={`absolute -inset-2 rounded-[2.5rem] bg-gradient-to-br ${currentService.color} opacity-10 blur-2xl transition-opacity duration-700`}
                />

                {/* Badge flotante de precio / fecha */}
                <motion.div
                  initial={{ x: 12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.18 }}
                  className="absolute right-2 top-6 sm:top-8 z-30 flex min-w-[90px] flex-col items-center rounded-2xl bg-white/95 border border-slate-100 p-2.5 shadow-xl backdrop-blur-sm sm:-right-4"
                >
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

                {/* Tarjeta principal */}
                <article className="group relative min-h-[450px] sm:min-h-[480px] flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 sm:p-10 shadow-2xl shadow-slate-200/80 transition-all duration-500 hover:shadow-xl hover:shadow-slate-300/60">
                  
                  {/* Decoraciones internas */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.04),transparent_70%)] pointer-events-none" />
                  <div
                    className={`absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${currentService.color} opacity-[0.05] blur-[50px] transition-opacity duration-700 group-hover:opacity-8 pointer-events-none`}
                  />

                  {/* Icono + número */}
                  <div className="relative z-10 flex items-start justify-between w-full">
                    <motion.div
                      key={currentService.id}
                      initial={{ rotate: -35, scale: 0.7 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.45, type: 'spring' }}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      className={`rounded-2xl bg-gradient-to-br ${currentService.color} p-4 text-white shadow-2xl ${currentService.glow}`}
                    >
                      <currentService.icon width={28} height={28} strokeWidth={2.2} aria-hidden="true" />
                    </motion.div>
                    <span className="select-none text-5xl sm:text-6xl font-black italic leading-none text-slate-100/70">
                      {String(currentService.id).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Contenido inferior */}
                  <div className="relative z-10 mt-8 w-full flex flex-col">
                    
                    {/* Paginación estilo dots */}
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
                            activeIndex === i
                              ? `w-8 bg-gradient-to-r ${currentService.color}`
                              : 'w-2 bg-slate-200 hover:bg-slate-300'
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

                    {/* Botón CTA con efecto */}
                    <div className="mt-6 sm:mt-8 w-full">
                      <Link href={currentService.href} aria-label={`Iniciar ${currentService.title} ${currentService.subtitle}`}>
                        <motion.span
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`group/btn relative flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-xs font-black uppercase tracking-widest transition-all ${
                            isSpecial
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-slate-950 text-white hover:bg-rose-600 shadow-md'
                          }`}
                        >
                          {isSpecial ? 'Recibir novedades' : 'Iniciar proceso'}
                          {isSpecial ? (
                            <Bell size={16} className="transition-transform group-hover/btn:rotate-12" />
                          ) : (
                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                          )}
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            className="absolute -top-1.5 -right-1.5"
                          >
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                          </motion.span>
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </article>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mensaje de confianza al final de la sección */}
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