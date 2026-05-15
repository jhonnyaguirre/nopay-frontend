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
      className="relative overflow-hidden bg-white px-5 py-16 md:px-8 md:py-20 lg:py-24"
    >
      {/* Fondo blanco puro sin bordes - eliminados los círculos difuminados */}
      
      {/* Elementos mágicos sutiles: partículas brillantes flotantes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-amber-300/30 blur-[1px] animate-pulse" />
        <div className="absolute right-[15%] top-[40%] h-1.5 w-1.5 rounded-full bg-rose-300/20 blur-[1px] animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-[25%] left-[20%] h-2 w-2 rounded-full bg-indigo-300/20 blur-[1px] animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-[15%] right-[25%] h-1 w-1 rounded-full bg-purple-300/30 blur-[1px] animate-pulse [animation-delay:0.5s]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* Columna izquierda: texto y controles */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md"
            >
              <BadgeCheck className="h-4 w-4 text-rose-500" aria-hidden="true" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Servicios legales digitales
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentService.id}
                initial={{ opacity: 0, x: direction >= 0 ? -18 : 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: direction >= 0 ? 18 : -18, filter: 'blur(5px)' }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                  Servicio {String(index + 1).padStart(2, '0')} / {services.length}
                </p>

                <h2
                  id="servicios-nopay-title"
                  className="max-w-xl text-[2.45rem] font-black leading-[0.96] tracking-[-0.055em] text-slate-950 sm:text-[3rem] md:text-[3.55rem] lg:text-[4rem]"
                >
                  {currentService.title}
                  <span
                    className={`block bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent`}
                  >
                    {currentService.subtitle}
                  </span>
                </h2>

                <p className="max-w-md text-base font-medium leading-relaxed text-slate-500 md:text-lg">
                  {currentService.desc}
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <InfoPill icon={<Clock3 />} text={isSpecial ? 'Próximamente' : 'Inicio rápido'} />
                  <InfoPill icon={<ShieldCheck />} text="Proceso guiado" />
                  <InfoPill icon={<Sparkles />} text="IA + expertos" />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex gap-3">
                <NavButton onClick={prev} icon={<ChevronLeft size={22} />} label="Servicio anterior" />
                <NavButton onClick={next} icon={<ChevronRight size={22} />} label="Siguiente servicio" />
              </div>

              <div className="hidden h-10 w-px bg-slate-100 sm:block" />

              <div className="hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  NoPay LegalTech
                </p>
                <p className="text-sm font-bold text-slate-700">
                  Trámites online en Ecuador
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha: tarjeta mágica interactiva */}
          <div 
            className="relative order-1 flex justify-center lg:order-2 lg:justify-end"
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
                className="relative w-full max-w-[360px] sm:max-w-[390px] md:max-w-[410px]"
              >
                {/* Resplandor mágico que sigue al mouse (solo en hover) */}
                <div
                  className="absolute -inset-3 rounded-[3rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(99,102,241,0.15), transparent 70%)`,
                  }}
                />
                
                <div
                  className={`absolute -inset-3 rounded-[3rem] bg-gradient-to-br ${currentService.color} opacity-10 blur-2xl transition-opacity duration-700`}
                />

                <motion.div
                  initial={{ x: 16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.18 }}
                  className="absolute -right-2 top-24 z-30 flex min-w-[94px] flex-col items-center rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur-sm sm:-right-5 sm:top-28"
                >
                  {isSpecial ? (
                    <>
                      <span className="text-[8px] font-black uppercase tracking-tight text-amber-500">
                        Próximamente
                      </span>
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-lg font-black text-transparent">
                        {getCurrentQuarter()}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-[8px] font-black uppercase tracking-tight text-slate-400">
                        Desde
                      </span>
                      <div
                        className={`bg-gradient-to-br ${currentService.color} bg-clip-text text-2xl font-black text-transparent`}
                      >
                        ${currentService.price}
                      </div>
                    </>
                  )}
                </motion.div>

                <article className="group relative aspect-[4/5] overflow-hidden rounded-[2.6rem] bg-white/95 p-8 shadow-2xl shadow-slate-200/60 transition-all duration-500 hover:shadow-xl hover:shadow-slate-300/50 sm:p-10">
                  {/* Fondo sutil con patrón de puntos mágicos */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.05),transparent_70%)]" />
                  <div
                    className={`absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${currentService.color} opacity-[0.06] blur-[50px] transition-opacity duration-700 group-hover:opacity-10`}
                  />

                  <div className="relative z-10 flex items-start justify-between">
                    <motion.div
                      key={currentService.id}
                      initial={{ rotate: -35, scale: 0.7 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.45, type: 'spring' }}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      className={`rounded-[1.7rem] bg-gradient-to-br ${currentService.color} p-5 text-white shadow-2xl ${currentService.glow}`}
                    >
                      {React.cloneElement(
                        currentService.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                        {
                          width: 32,
                          height: 32,
                          strokeWidth: 2.4,
                          'aria-hidden': true,
                        }
                      )}
                    </motion.div>

                    <span className="select-none text-6xl font-black italic leading-none text-slate-50">
                      {String(currentService.id).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="relative z-10 mt-auto flex h-full flex-col justify-end pt-12">
                    <div className="mb-6 flex flex-wrap gap-1.5" aria-hidden="true">
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
                              ? `w-10 bg-gradient-to-r ${currentService.color}`
                              : 'w-2 bg-slate-200 hover:bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">
                      {isSpecial ? 'Lanzamiento trimestral' : 'Smart Legal Experience'}
                    </p>

                    <h3 className="max-w-[270px] text-3xl font-black leading-[0.95] tracking-[-0.045em] text-slate-900 sm:text-[2.15rem]">
                      {currentService.title}{' '}
                      <span
                        className={`bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent`}
                      >
                        {currentService.subtitle}
                      </span>
                    </h3>

                    <Link
                      href={currentService.href}
                      aria-label={`Iniciar ${currentService.title} ${currentService.subtitle}`}
                      className="mt-8 block"
                    >
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group/btn flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-all ${
                          isSpecial
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-slate-950 text-white hover:bg-rose-600'
                        }`}
                      >
                        {isSpecial ? 'Recibir novedades' : 'Iniciar proceso'}
                        {isSpecial ? (
                          <Bell size={18} className="transition-transform group-hover/btn:rotate-12" />
                        ) : (
                          <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1.5" />
                        )}
                        {/* Estrella mágica que aparece en hover */}
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                        </motion.span>
                      </motion.span>
                    </Link>
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
      whileHover={{ y: -2 }}
      className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-md transition-all hover:shadow-lg"
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
      whileHover={{ scale: 1.08, backgroundColor: '#ffffff', y: -2 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-md transition-colors hover:text-slate-950 active:bg-slate-50"
    >
      {icon}
    </motion.button>
  );
}