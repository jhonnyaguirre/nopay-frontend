'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    id: 1,
    title: 'Impugnación de Multas',
    subtitle: 'de Tránsito',
    price: valorImpugnacionGl,
    desc: 'Impugna tu multa con un proceso claro, rápido y guiado.',
    color: 'from-blue-600 to-indigo-600',
    glow: 'shadow-blue-500/20',
    icon: <Car />,
    href: '/Servicios/Impugnacion',
  },
  {
    id: 2,
    title: 'Registro',
    subtitle: 'de Marcas',
    price: valorRegistroMarcaPhase1,
    desc: 'Protege tu marca con una experiencia legal simple y segura.',
    color: 'from-pink-600 to-purple-600',
    glow: 'shadow-pink-500/20',
    icon: <Landmark />,
    href: '/Servicios/Marcas',
  },
  {
    id: 3,
    title: 'Permisos de Salida',
    subtitle: 'para Menores',
    price: valorPermisoSalida,
    desc: 'Genera documentos y minutas para permisos de salida del país.',
    color: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/20',
    icon: <UserCheck />,
    href: '/Servicios/PermisoSalida',
  },
  {
    id: 4,
    title: 'Nuevos',
    subtitle: 'Servicios',
    price: null,
    desc: 'Cada trimestre lanzamos nuevas soluciones legales digitales.',
    color: 'from-amber-400 to-orange-600',
    glow: 'shadow-amber-500/20',
    icon: <Sparkles />,
    href: '/Novedades',
    special: true,
  },
];

export default function ServicesPureLightAuto() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const currentService = services[index];
  const isSpecial = currentService.special === true;

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % services.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + services.length) % services.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(next, 4800);
    return () => window.clearInterval(timer);
  }, [next]);

  const getCurrentQuarter = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `Q${quarter} ${now.getFullYear()}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section
      id="servicios-legales-nopay"
      aria-labelledby="servicios-nopay-title"
      className="relative overflow-hidden bg-white px-4 py-12 md:px-8 md:py-20 lg:py-24"
    >
      {/* Elementos mágicos sutiles: partículas brillantes flotantes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-amber-300/30 blur-[1px] animate-pulse" />
        <div className="absolute right-[15%] top-[40%] h-1.5 w-1.5 rounded-full bg-rose-300/20 blur-[1px] animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-[25%] left-[20%] h-2 w-2 rounded-full bg-indigo-300/20 blur-[1px] animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-[15%] right-[25%] h-1 w-1 rounded-full bg-purple-300/30 blur-[1px] animate-pulse [animation-delay:0.5s]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          
          {/* Columna Izquierda: Texto y Controles */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <div className="flex justify-center lg:justify-start">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md border border-slate-100"
              >
                <BadgeCheck className="h-4 w-4 text-rose-500" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Servicios legales digitales
                </span>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentService.id}
                initial={{ opacity: 0, x: direction >= 0 ? -18 : 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: direction >= 0 ? 18 : -18, filter: 'blur(5px)' }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4 text-center lg:text-left"
              >
                <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                  Servicio {String(index + 1).padStart(2, '0')} / {services.length}
                </p>

                <h2
                  id="servicios-nopay-title"
                  className="mx-auto lg:mx-0 max-w-xl text-[2.2rem] sm:text-[2.8rem] md:text-[3.4rem] lg:text-[4rem] font-black leading-[1.02] lg:leading-[0.96] tracking-[-0.055em] text-slate-950"
                >
                  {currentService.title}
                  <span
                    className={`block bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent mt-1`}
                  >
                    {currentService.subtitle}
                  </span>
                </h2>

                <p className="mx-auto lg:mx-0 max-w-md text-sm sm:text-base md:text-lg font-medium leading-relaxed text-slate-500">
                  {currentService.desc}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                  <InfoPill icon={<Clock3 />} text={isSpecial ? 'Próximamente' : 'Inicio rápido'} />
                  <InfoPill icon={<ShieldCheck />} text="Proceso guiado" />
                  <InfoPill icon={<Sparkles />} text="IA + expertos" />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <div className="flex gap-3">
                <NavButton onClick={prev} icon={<ChevronLeft size={22} />} label="Servicio anterior" />
                <NavButton onClick={next} icon={<ChevronRight size={22} />} label="Siguiente servicio" />
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

          {/* Columna Derecha: Tarjeta Interactiva con Corrección de Altura */}
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
                {/* Resplandor mágico de fondo */}
                <div
                  className={`absolute -inset-2 rounded-[2.5rem] bg-gradient-to-br ${currentService.color} opacity-10 blur-2xl transition-opacity duration-700`}
                />

                {/* Badge de Precio / Fecha Flotante Responsivo */}
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

                {/* Contenedor de la Tarjeta con Corrección de Layout */}
                <article className="group relative min-h-[450px] sm:min-h-[480px] flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 sm:p-10 shadow-2xl shadow-slate-200/80 transition-all duration-500 hover:shadow-xl hover:shadow-slate-300/60">
                  
                  {/* Decoraciones internas */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.04),transparent_70%)] pointer-events-none" />
                  <div
                    className={`absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${currentService.color} opacity-[0.05] blur-[50px] transition-opacity duration-700 group-hover:opacity-8 pointer-events-none`}
                  />

                  {/* PARTE SUPERIOR: Icono y Número */}
                  <div className="relative z-10 flex items-start justify-between w-full">
                    <motion.div
                      key={currentService.id}
                      initial={{ rotate: -35, scale: 0.7 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.45, type: 'spring' }}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      className={`rounded-2xl bg-gradient-to-br ${currentService.color} p-4 text-white shadow-2xl ${currentService.glow}`}
                    >
                      {React.cloneElement(
                        currentService.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                        {
                          width: 28,
                          height: 28,
                          strokeWidth: 2.2,
                          'aria-hidden': true,
                        }
                      )}
                    </motion.div>

                    <span className="select-none text-5xl sm:text-6xl font-black italic leading-none text-slate-100/70">
                      {String(currentService.id).padStart(2, '0')}
                    </span>
                  </div>

                  {/* PARTE INFERIOR: Títulos, Paginación y Botón de Acción */}
                  <div className="relative z-10 mt-8 w-full flex flex-col">
                    
                    {/* Indicadores / Paginación en Barra */}
                    <div className="mb-4 flex flex-wrap gap-1.5" aria-hidden="true">
                      {services.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setDirection(i > index ? 1 : -1);
                            setIndex(i);
                          }}
                          className={`h-1 rounded-full transition-all duration-500 ${
                            index === i
                              ? `w-8 bg-gradient-to-r ${currentService.color}`
                              : 'w-2 bg-slate-200 hover:bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.26em] text-slate-400">
                      {isSpecial ? 'Lanzamiento trimestral' : 'Smart Legal Experience'}
                    </p>

                    <h3 className="max-w-[260px] text-2xl sm:text-3xl font-black leading-[1.05] tracking-[-0.045em] text-slate-900">
                      {currentService.title}{' '}
                      <span
                        className={`block sm:inline bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent`}
                      >
                        {currentService.subtitle}
                      </span>
                    </h3>

                    {/* Contenedor del Botón con espacio garantizado */}
                    <div className="mt-6 sm:mt-8 w-full">
                      <Link
                        href={currentService.href}
                        aria-label={`Iniciar ${currentService.title} ${currentService.subtitle}`}
                        className="block w-full"
                      >
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
                          
                          {/* Estrella decorativa en hover */}
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
      </div>
    </section>
  );
}

function InfoPill({
  icon,
  text,
}: {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <motion.span
      whileHover={{ y: -1 }}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm border border-slate-100 transition-all hover:shadow-md"
    >
      {React.cloneElement(icon, {
        className: 'h-3.5 w-3.5 text-rose-500',
        strokeWidth: 2,
        'aria-hidden': true,
      })}
      {text}
    </motion.span>
  );
}

function NavButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileHover={{ scale: 1.06, backgroundColor: '#ffffff', y: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm border border-slate-100 transition-colors hover:text-slate-950 active:bg-slate-50"
    >
      {icon}
    </motion.button>
  );
}