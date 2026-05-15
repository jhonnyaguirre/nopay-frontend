'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { SlideToActionButton } from 'components/SlideToActionButton';
import {
  Shield,
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock3,
  Wallet,
  SmilePlus,
  MousePointer2,
  GaugeCircle,
  FileText,
  MapPin,
  Scale,
} from 'lucide-react';

const RotatingText = ({
  phrases,
  initialDelay = 900,
  intervalTime = 2300,
}: {
  phrases: string[];
  initialDelay?: number;
  intervalTime?: number;
}) => {
  const [index, setIndex] = useState(0);
  const [startRotation, setStartRotation] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setStartRotation(true), initialDelay);
    return () => window.clearTimeout(timer);
  }, [initialDelay]);

  useEffect(() => {
    if (!startRotation || phrases.length <= 1) return;

    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, intervalTime);

    return () => window.clearInterval(interval);
  }, [startRotation, phrases.length, intervalTime]);

  return (
    <span className="relative inline-flex min-h-[1.1em] items-center justify-center overflow-hidden align-baseline will-change-transform">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ backfaceVisibility: 'hidden' }}
          className="inline-block whitespace-nowrap bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#EAB308] bg-clip-text font-black tracking-[-0.02em] text-transparent drop-shadow-[0_8px_24px_rgba(234,179,8,0.2)]"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const EliteLegalHeroFusion = () => {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [activeBenefit, setActiveBenefit] = useState(2);

  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  const benefitCards = useMemo(
    () => [
      {
        icon: <Clock3 />,
        title: 'Más rápido',
        desc: 'Inicia tu trámite legal online sin filas, sin vueltas y desde cualquier ciudad del Ecuador.',
        accent: 'from-lime-300 via-amber-300 to-rose-400',
      },
      {
        icon: <Wallet />,
        title: 'Más claro',
        desc: 'Conoce el proceso, los requisitos y los costos antes de avanzar con tu caso.',
        accent: 'from-amber-300 via-pink-400 to-violet-500',
      },
      {
        icon: <SmilePlus />,
        title: 'Más simple',
        desc: 'Te guiamos paso a paso para subir información, documentos y evidencia de forma ordenada.',
        accent: 'from-lime-300 via-fuchsia-400 to-violet-600',
      },
      {
        icon: <Shield />,
        title: 'Más seguro',
        desc: 'Tus datos se gestionan con orden, privacidad y trazabilidad durante el proceso.',
        accent: 'from-rose-400 via-orange-300 to-amber-300',
      },
      {
        icon: <BrainCircuit />,
        title: 'Más inteligente',
        desc: 'La tecnología ayuda a organizar tu caso y los abogados de NoPay revisan lo importante.',
        accent: 'from-violet-500 via-fuchsia-500 to-rose-400',
      },
      {
        icon: <GaugeCircle />,
        title: 'Más directo',
        desc: 'Menos confusión, menos papeleo y una ruta más clara para resolver tu necesidad legal.',
        accent: 'from-lime-300 via-emerald-300 to-violet-500',
      },
    ],
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % benefitCards.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [benefitCards.length]);

  const textReveal = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const rotatingPhrases = [
    'Impugna multas de tránsito.',
    'Registra tu marca en Ecuador.',
    'Gestiona permisos de salida.',
  ];

  const seoServiceTags = [
    'Impugnación de multas',
    'Permiso de salida de menores',
    'Registro de marca',
    'Constitución de SAS',
    'Asesoría legal online',
  ];

  const trustItems = [
    {
      icon: <Scale className="h-4 w-4" />,
      text: 'Servicios legales digitales en Ecuador',
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      text: 'Atención para Quito, Guayaquil, Cuenca y más ciudades',
    },
    {
      icon: <FileText className="h-4 w-4" />,
      text: 'Procesos guiados con respaldo profesional',
    },
  ];

  const nextBenefit = () => {
    setActiveBenefit((prev) => (prev + 1) % benefitCards.length);
  };

  const prevBenefit = () => {
    setActiveBenefit((prev) => (prev - 1 + benefitCards.length) % benefitCards.length);
  };

  if (!mounted) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');

        * {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1,
        h2,
        h3,
        .font-black,
        .font-bold {
          text-rendering: geometricPrecision;
        }
      `}</style>

      <section
        aria-labelledby="nopay-hero-title"
        className="relative w-full bg-white font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] antialiased selection:bg-rose-500 selection:text-white"
      >
        <div className="relative flex min-h-[90vh] w-full flex-col overflow-hidden bg-[#020617] md:min-h-screen">
          <motion.div
            style={{ y: yBg, willChange: 'transform' }}
            className="absolute left-0 top-[-25%] z-0 h-[150%] w-full"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_40%,#020617_85%)] opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
          </motion.div>

          <motion.div
            style={{ opacity: opacityHero, willChange: 'opacity' }}
            className="relative z-20 mx-auto flex max-w-7xl flex-col items-center px-6 pb-40 pt-12 md:pt-32"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textReveal}
              className="group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-2xl"
            >
              <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 md:text-xs">
                LegalTech para trámites legales en Ecuador
              </span>
            </motion.div>

            <h1
              id="nopay-hero-title"
              className="mb-8 text-center text-5xl font-black leading-[0.9] tracking-[-0.02em] text-white md:text-[6.5rem]"
            >
              <span className="block overflow-hidden">
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={textReveal}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center gap-x-4 gap-y-2 md:flex-row md:flex-wrap md:items-baseline"
                >
                  <span>Resuelve trámites legales</span>

                  <motion.span
                    initial="hidden"
                    animate="visible"
                    variants={textReveal}
                    transition={{ delay: 0.4 }}
                    className="relative inline-flex items-center justify-center text-[clamp(2rem,6vw,4rem)] font-black tracking-[-0.02em]"
                  >
                    <RotatingText phrases={rotatingPhrases} />
                  </motion.span>
                </motion.span>
              </span>
            </h1>

            <div className="mb-10 max-w-3xl text-center text-base font-light leading-relaxed text-slate-400 md:text-xl">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={textReveal}
                transition={{ delay: 0.6 }}
              >
                NoPay es una plataforma legal digital para iniciar y gestionar servicios como{' '}
                <span className="font-medium text-white">impugnación de multas de tránsito</span>,{' '}
                <span className="font-medium text-white">permisos de salida de menores</span>,{' '}
                <span className="font-medium text-white">registro de marcas</span> y{' '}
                <span className="font-medium text-white">constitución de SAS en Ecuador</span>.
              </motion.p>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={textReveal}
                transition={{ delay: 0.8 }}
                className="mt-3"
              >
                Combinamos tecnología, procesos guiados y revisión profesional para que avances con
                claridad, sin filas y sin perder tiempo.
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={textReveal}
              transition={{ delay: 1.0 }}
              className="w-full max-w-xl"
            >
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-3xl transition-all hover:border-white/20 md:flex-row md:rounded-full">
                <SlideToActionButton href="/Servicios" className="shadow-md">
                  Iniciar mi trámite legal
                </SlideToActionButton>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-3">
                {seoServiceTags.map((text, i) => (
                  <span
                    key={text}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white opacity-70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:opacity-100 md:text-xs"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    {text}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 text-left md:grid-cols-3">
                {trustItems.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-snug text-white/75 backdrop-blur-xl"
                  >
                    <span className="mt-0.5 text-amber-300">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="pointer-events-none absolute bottom-[-1px] left-0 z-30 w-full" aria-hidden="true">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block h-[120px] w-full md:h-[220px]"
              fill="white"
              shapeRendering="geometricPrecision"
            >
              <path d="M0,0 C300,120 400,-20 600,60 C800,140 900,20 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </div>

        <section className="relative -mt-1 overflow-hidden bg-white px-6 pb-24 pt-10 md:pb-32 md:pt-16">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-32 left-1/2 h-[320px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.035)_0%,rgba(245,158,11,0.025)_34%,transparent_72%)] blur-[90px]" />
            <div className="absolute right-[-180px] top-40 h-[420px] w-[420px] rounded-full bg-violet-200/10 blur-[110px]" />
            <div className="absolute bottom-[-180px] left-[-140px] h-[420px] w-[420px] rounded-full bg-lime-200/10 blur-[110px]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-5xl text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 shadow-sm backdrop-blur-xl">
                <MousePointer2 className="h-4 w-4 text-rose-500" strokeWidth={1.5} />
                <span className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-600 md:text-xs">
                  Asesoría legal online con experiencia guiada
                </span>
              </div>

              <h2 className="mt-7 text-[2.8rem] font-black leading-[0.86] tracking-[-0.03em] text-slate-950 md:text-[6.5rem]">
                NoPay hace
                <span className="block bg-gradient-to-r from-lime-400 via-rose-500 to-violet-600 bg-clip-text text-transparent">
                  simple lo legal
                </span>
              </h2>

              <p className="mx-auto mt-7 max-w-3xl text-base leading-relaxed text-slate-500 md:text-xl">
                Una forma moderna de iniciar trámites legales en Ecuador: clara, rápida, digital y
                acompañada por profesionales cuando tu caso lo requiere.
              </p>
            </motion.div>

            <div className="relative mt-16 md:mt-20">
              <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-28 bg-gradient-to-r from-white to-transparent md:block" />
              <div className="pointer-events-none absolute right-0 top-0 z-20 hidden h-full w-28 bg-gradient-to-l from-white to-transparent md:block" />

              <button
                type="button"
                onClick={prevBenefit}
                className="absolute left-0 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-lime-300 md:left-2"
                aria-label="Anterior beneficio"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <button
                type="button"
                onClick={nextBenefit}
                className="absolute right-0 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-violet-300 md:right-2"
                aria-label="Siguiente beneficio"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <div className="mx-auto flex min-h-[390px] max-w-6xl items-center justify-center gap-4 overflow-hidden px-10 md:gap-6 md:px-16">
                {benefitCards.map((card, index) => {
                  const total = benefitCards.length;
                  let offset = index - activeBenefit;

                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;

                  const isActive = offset === 0;
                  const isNear = Math.abs(offset) <= 2;

                  if (!isNear) return null;

                  return (
                    <motion.article
                      key={card.title}
                      animate={{
                        x: offset * 245,
                        scale: isActive ? 1.08 : 0.86,
                        rotate: offset * 2.4,
                        opacity: isActive ? 1 : 0.48,
                        zIndex: 20 - Math.abs(offset),
                        filter: isActive ? 'blur(0px)' : 'blur(0.2px)',
                      }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute w-[230px] will-change-transform md:w-[270px]"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div
                        className={[
                          'group relative h-[315px] overflow-hidden rounded-[2.1rem] border bg-white p-6 text-center transition-all duration-500 md:h-[350px] md:p-7',
                          isActive
                            ? 'border-transparent shadow-[0_30px_90px_rgba(15,23,42,0.14)]'
                            : 'border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)]',
                        ].join(' ')}
                      >
                        {isActive && (
                          <div
                            className={`absolute inset-0 rounded-[2.1rem] bg-gradient-to-br ${card.accent} opacity-100`}
                          />
                        )}

                        <div
                          className={[
                            'absolute inset-[1px] rounded-[2rem]',
                            isActive
                              ? 'bg-white/94 backdrop-blur-xl'
                              : 'bg-gradient-to-br from-white via-white to-slate-50',
                          ].join(' ')}
                        />

                        <div className="relative z-10 flex h-full flex-col items-center justify-center">
                          <div
                            className={[
                              'grid h-24 w-24 place-items-center rounded-full transition-all duration-500 md:h-28 md:w-28',
                              isActive
                                ? `bg-gradient-to-br ${card.accent} text-white shadow-[0_18px_45px_rgba(168,85,247,0.28)]`
                                : 'bg-slate-100 text-slate-700',
                            ].join(' ')}
                          >
                            {React.cloneElement(card.icon, {
                              className: 'h-11 w-11 md:h-12 md:w-12',
                              strokeWidth: 1.5,
                            })}
                          </div>

                          <h3 className="mt-7 text-2xl font-black tracking-[-0.02em] text-slate-950 md:text-3xl">
                            {card.title}
                          </h3>

                          <p className="mt-3 max-w-[210px] text-sm leading-relaxed text-slate-500 md:text-base">
                            {card.desc}
                          </p>

                          <div
                            className={[
                              'mt-7 h-1.5 rounded-full transition-all duration-500',
                              isActive ? `w-16 bg-gradient-to-r ${card.accent}` : 'w-9 bg-lime-300',
                            ].join(' ')}
                          />
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                {benefitCards.map((card, index) => (
                  <button
                    key={card.title}
                    type="button"
                    onClick={() => setActiveBenefit(index)}
                    aria-label={`Ver ${card.title}`}
                    className={[
                      'h-2.5 rounded-full transition-all duration-300',
                      activeBenefit === index
                        ? 'w-16 bg-gradient-to-r from-lime-300 via-rose-500 to-violet-600'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 grid gap-5 md:mt-20 md:grid-cols-3"
            >
              {[
                { label: 'Antes', value: 'Filas · Papeleo · Incertidumbre', muted: true },
                { label: 'Ahora con NoPay', value: 'Claridad · Tecnología · Acompañamiento', muted: false },
                { label: 'Resultado', value: 'Avanzas con una ruta legal más ordenada', muted: false },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
                    {item.label}
                  </p>

                  <p
                    className={[
                      'mt-3 text-lg font-black tracking-tight md:text-xl',
                      item.muted
                        ? 'text-slate-400 line-through decoration-slate-300'
                        : 'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent',
                    ].join(' ')}
                  >
                    {item.value}
                  </p>
                </article>
              ))}
            </motion.div>
          </div>
        </section>
      </section>
    </>
  );
};

export default EliteLegalHeroFusion;