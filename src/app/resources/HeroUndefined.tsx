'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock3,
  Wallet,
  Shield,
  SmilePlus,
  BrainCircuit,
  GaugeCircle,
  MousePointer2,
} from 'lucide-react';

// --------------------------------------------------------------
// SlideToActionButton: efecto slide y navegación suave
// --------------------------------------------------------------
const SlideToActionButton = ({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group overflow-hidden rounded-full
        bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500
        px-6 md:px-8 py-3 md:py-4 text-center text-sm md:text-base font-bold text-white shadow-lg
        transition-all duration-300 hover:shadow-2xl
        flex items-center justify-center gap-2
        ${className}
      `}
      style={{ cursor: 'pointer' }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.span>
      </span>
      <motion.div
        className="absolute inset-0 -z-0 bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500"
        initial={{ x: '-100%' }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.a>
  );
};

// --------------------------------------------------------------
// RotatingText: textos rotativos nítidos y responsivos
// --------------------------------------------------------------
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
    const interval = window.setInterval(
      () => setIndex((prev) => (prev + 1) % phrases.length),
      intervalTime
    );
    return () => window.clearInterval(interval);
  }, [startRotation, phrases.length, intervalTime]);

  return (
    <span className="relative inline-flex min-h-[1.2em] items-center justify-center overflow-hidden align-baseline will-change-transform">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={{ opacity: 0, y: 24, scale: 0.92, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -24, scale: 0.96, filter: 'blur(6px)' }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            scale: { type: 'spring', stiffness: 300, damping: 25 },
          }}
          style={{ backfaceVisibility: 'hidden' }}
          className="
            inline-block
            whitespace-normal sm:whitespace-nowrap
            break-words
            bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#EAB308]
            bg-clip-text text-transparent
            drop-shadow-[0_8px_24px_rgba(234,179,8,0.25)]
            font-black tracking-[-0.02em]
          "
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// --------------------------------------------------------------
// Componente principal
// --------------------------------------------------------------
const EliteLegalHeroFusion = () => {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [activeBenefit, setActiveBenefit] = useState(2);
  const [offsetMultiplier, setOffsetMultiplier] = useState(220);

  const yBg = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.98]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setOffsetMultiplier(window.innerWidth >= 768 ? 270 : 210);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % benefitCards.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const textReveal = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const rotatingPhrases = [
    'Impugna tu MULTA de tránsito hoy.',
    'Protege y registra tu MARCA.',
    'Permiso de SALIDA del país en minutos.',
  ];

  const benefitCards = [
    {
      icon: <Clock3 strokeWidth={1.5} />,
      title: 'Más rápido',
      desc: 'Respuestas claras en minutos, no en días.',
      accent: 'from-lime-300 via-amber-300 to-rose-400',
    },
    {
      icon: <Wallet strokeWidth={1.5} />,
      title: 'Más económico',
      desc: 'Menos vueltas, menos costos, más control.',
      accent: 'from-amber-300 via-pink-400 to-violet-500',
    },
    {
      icon: <SmilePlus strokeWidth={1.5} />,
      title: 'Más simple',
      desc: 'Un proceso guiado, limpio y sin complicaciones.',
      accent: 'from-lime-300 via-fuchsia-400 to-violet-600',
    },
    {
      icon: <Shield strokeWidth={1.5} />,
      title: 'Más seguro',
      desc: 'Tus datos protegidos y tu proceso ordenado.',
      accent: 'from-rose-400 via-orange-300 to-amber-300',
    },
    {
      icon: <BrainCircuit strokeWidth={1.5} />,
      title: 'Más inteligente',
      desc: 'IA que analiza, ordena y acelera tu trámite.',
      accent: 'from-violet-500 via-fuchsia-500 to-rose-400',
    },
    {
      icon: <GaugeCircle strokeWidth={1.5} />,
      title: 'Más directo',
      desc: 'Sin filas, sin confusión y sin perder tiempo.',
      accent: 'from-lime-300 via-emerald-300 to-violet-500',
    },
  ];

  const nextBenefit = useCallback(
    () => setActiveBenefit((prev) => (prev + 1) % benefitCards.length),
    [benefitCards.length]
  );
  const prevBenefit = useCallback(
    () => setActiveBenefit((prev) => (prev - 1 + benefitCards.length) % benefitCards.length),
    [benefitCards.length]
  );

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
        h1, h2, h3, .font-black, .font-bold {
          text-rendering: geometricPrecision;
        }
        @media (max-width: 768px) {
          button, [role="button"] {
            touch-action: manipulation;
          }
        }
      `}</style>

      <main className="relative w-full bg-white font-['Inter',system-ui] antialiased selection:bg-rose-500 selection:text-white">
        {/* ==================== HERO SECTION ==================== */}
        <div className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col overflow-hidden bg-[#020617]">
          <motion.div
            style={{ y: yBg, willChange: 'transform' }}
            className="absolute top-[-25%] left-0 w-full h-[150%] z-0"
          >
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 30%, #D82465 0%, #F46C1D 40%, #020617 85%)',
                  'radial-gradient(circle at 80% 70%, #D82465 0%, #F46C1D 35%, #020617 85%)',
                  'radial-gradient(circle at 40% 50%, #D82465 0%, #F46C1D 40%, #020617 85%)',
                ],
              }}
              transition={{ duration: 16, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
              className="absolute inset-0 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
          </motion.div>

          <motion.div
            style={{ opacity: opacityHero, scale: scaleHero }}
            className="relative z-20 max-w-7xl px-6 pt-12 md:pt-32 pb-40 mx-auto flex flex-col items-center"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textReveal}
              whileHover={{ scale: 1.02 }}
              className="group cursor-default inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 px-4 py-1.5 rounded-full mb-8 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              </motion.div>
              <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-[0.3em]">
                Sin trámites. Sin vueltas. Sin estrés.
              </span>
            </motion.div>

            <h1 className="text-center text-5xl md:text-[5.0rem] font-black text-white leading-[0.9] mb-8 tracking-[-0.02em]">
              <div className="overflow-hidden">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={textReveal}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col md:flex-row md:flex-wrap justify-center items-baseline gap-x-4 gap-y-2"
                >
                  <span>Resuelve lo legal</span>
                  <motion.span
                    initial="hidden"
                    animate="visible"
                    variants={textReveal}
                    transition={{ delay: 0.4 }}
                    className="relative inline-flex items-center justify-center font-black text-[clamp(2rem,6vw,4rem)]"
                  >
                    <RotatingText phrases={rotatingPhrases} />
                  </motion.span>
                </motion.div>
              </div>
            </h1>

            <div className="text-center text-base md:text-xl text-slate-400 max-w-2xl mb-12 font-light leading-relaxed">
              <motion.div variants={textReveal} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                NoPay resuelve trámites legales{' '}
                <span className="text-white font-medium">sin filas y sin perder tiempo.</span>
              </motion.div>
              <motion.div
                variants={textReveal}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
                className="mt-2"
              >
                Convertimos leyes complejas en{' '}
                <span className="text-white italic">acciones claras, rápidas y definitivas</span>.
              </motion.div>
            </div>

            <motion.div
              variants={textReveal}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.0 }}
              className="w-full max-w-xl"
            >
              <div className="flex flex-col md:flex-row items-center gap-3 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-full shadow-2xl">
                <SlideToActionButton href="/Servicios" className="shadow-md w-full md:w-auto">
                  Resolver mi caso ahora
                </SlideToActionButton>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mt-8 mb-12">
                {['Inmediatez', 'Cero Riesgos', 'Respaldo de Expertos'].map((text, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    whileHover={{ scale: 1.08, opacity: 1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-300 cursor-default"
                  >
                    {text}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Ola decorativa inferior */}
          <div className="absolute bottom-[-1px] left-0 w-full z-30 pointer-events-none">
            <motion.svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-[120px] md:h-[220px]"
              fill="white"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <path d="M0,0 C300,120 400,-20 600,60 C800,140 900,20 1200,80 L1200,120 L0,120 Z" />
            </motion.svg>
          </div>
        </div>

        {/* ==================== SECCIÓN BENEFICIOS ==================== */}
        <section className="relative bg-white -mt-1 pt-10 md:pt-16 pb-24 md:pb-32 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ x: ['-10%', '10%', '-5%'], y: ['-5%', '5%', '-2%'] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.035)_0%,rgba(245,158,11,0.025)_34%,transparent_72%)] blur-[90px]"
            />
          </div>

          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-5xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 shadow-sm backdrop-blur-xl">
                <MousePointer2 className="h-4 w-4 text-rose-500" strokeWidth={1.5} />
                <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.28em] text-slate-600">
                  LegalTech Ecuador
                </span>
              </div>

              <h2 className="mt-7 text-[2.2rem] md:text-[3.8rem] font-black tracking-[-0.045em] leading-[0.92] text-slate-950">
                NoPay transforma
                <span className="block bg-gradient-to-r from-[#F46C1D] via-[#D82465] to-purple-600 bg-clip-text text-transparent">
                  lo legal en simple
                </span>
              </h2>

              <p className="mt-5 max-w-xl mx-auto text-sm md:text-base text-slate-500 leading-relaxed">
                IA + Abogados Expertos. Más rápido. Más claro.
              </p>
            </motion.div>

            {/* Carrusel de beneficios mejorado */}
            <div className="relative mt-16 md:mt-20">
              <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-20 bg-gradient-to-r from-white to-transparent md:block" />
              <div className="pointer-events-none absolute right-0 top-0 z-20 hidden h-full w-20 bg-gradient-to-l from-white to-transparent md:block" />

              <motion.button
                onClick={prevBenefit}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-0 md:left-2 top-1/2 z-30 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-lime-300"
                aria-label="Anterior"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
              </motion.button>

              <motion.button
                onClick={nextBenefit}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 md:right-2 top-1/2 z-30 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-violet-300"
                aria-label="Siguiente"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
              </motion.button>

              <div className="mx-auto flex min-h-[390px] max-w-6xl items-center justify-center overflow-hidden px-10 md:px-16">
                {benefitCards.map((card, index) => {
                  const total = benefitCards.length;
                  let offset = index - activeBenefit;
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;
                  const isActive = offset === 0;
                  const isNear = Math.abs(offset) <= 2;
                  if (!isNear) return null;

                  return (
                    <motion.div
                      key={card.title}
                      animate={{
                        x: offset * offsetMultiplier,
                        scale: isActive ? 1.08 : 0.86,
                        rotate: offset * 2.4,
                        opacity: isActive ? 1 : 0.48,
                        zIndex: 20 - Math.abs(offset),
                        y: isActive ? [0, -6, 0] : 0,
                      }}
                      transition={{
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="absolute w-[210px] md:w-[270px] will-change-transform"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <motion.div
                        whileHover={isActive ? { scale: 1.02 } : {}}
                        className={[
                          'group relative h-[315px] md:h-[350px] overflow-hidden rounded-[2.1rem] border bg-white p-6 md:p-7 text-center transition-all duration-500',
                          isActive
                            ? 'border-transparent shadow-[0_30px_90px_rgba(15,23,42,0.14)]'
                            : 'border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)]',
                        ].join(' ')}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeGradient"
                            className={`absolute inset-0 rounded-[2.1rem] bg-gradient-to-br ${card.accent} opacity-100`}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                          <motion.div
                            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                            className={[
                              'grid h-24 w-24 md:h-28 md:w-28 place-items-center rounded-full transition-all duration-500',
                              isActive
                                ? `bg-gradient-to-br ${card.accent} text-white shadow-[0_18px_45px_rgba(168,85,247,0.28)]`
                                : 'bg-slate-100 text-slate-700',
                            ].join(' ')}
                          >
                            {React.cloneElement(card.icon, { className: 'h-11 w-11 md:h-12 md:w-12', strokeWidth: 1.5 })}
                          </motion.div>
                          <h3 className="mt-7 text-2xl md:text-3xl font-black tracking-[-0.02em] text-slate-950">
                            {card.title}
                          </h3>
                          <p className="mt-3 max-w-[190px] text-sm md:text-base leading-relaxed text-slate-500">
                            {card.desc}
                          </p>
                          <motion.div
                            animate={isActive ? { width: 64 } : { width: 36 }}
                            className={`mt-7 h-1.5 rounded-full transition-all duration-500 ${
                              isActive ? `bg-gradient-to-r ${card.accent}` : 'bg-lime-300'
                            }`}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                {benefitCards.map((card, index) => (
                  <motion.button
                    key={card.title}
                    onClick={() => setActiveBenefit(index)}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
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

            {/* Comparativa final */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-16 md:mt-20 grid gap-5 md:grid-cols-3"
            >
              {[
                { label: 'Antes', value: 'Filas · Papeleo · Incertidumbre', muted: true },
                { label: 'Ahora con NoPay', value: 'Claridad · Velocidad · Control', muted: false },
                { label: 'Resultado', value: 'Decides mejor y avanzas seguro', muted: false },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                  <p
                    className={[
                      'mt-3 text-lg md:text-xl font-black tracking-tight',
                      item.muted
                        ? 'text-slate-400 line-through decoration-slate-300'
                        : 'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent',
                    ].join(' ')}
                  >
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default EliteLegalHeroFusion;