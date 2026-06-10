'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  Car,
  FileText,
  Plane,
  CheckCircle2,
} from 'lucide-react';

// --------------------------------------------------------------
// CONSTANTES
// --------------------------------------------------------------
const ROTATING_PHRASES = [
  'Impugna tu multa de tránsito',
  'Registra y protege tu marca',
  'Permiso de salida del país',
];

const BENEFIT_CARDS = [
  { icon: <Clock3 strokeWidth={1.5} />, title: 'Más rápido', desc: 'Respuestas claras en minutos, no en días.', accent: 'from-lime-300 via-amber-300 to-rose-400' },
  { icon: <Wallet strokeWidth={1.5} />, title: 'Más económico', desc: 'Menos vueltas, menos costos, más control.', accent: 'from-amber-300 via-pink-400 to-violet-500' },
  { icon: <SmilePlus strokeWidth={1.5} />, title: 'Más simple', desc: 'Un proceso guiado, limpio y sin complicaciones.', accent: 'from-lime-300 via-fuchsia-400 to-violet-600' },
  { icon: <Shield strokeWidth={1.5} />, title: 'Más seguro', desc: 'Tus datos protegidos y tu proceso ordenado.', accent: 'from-rose-400 via-orange-300 to-amber-300' },
  { icon: <BrainCircuit strokeWidth={1.5} />, title: 'Más inteligente', desc: 'IA que analiza, ordena y acelera tu trámite.', accent: 'from-violet-500 via-fuchsia-500 to-rose-400' },
  { icon: <GaugeCircle strokeWidth={1.5} />, title: 'Más directo', desc: 'Sin filas, sin confusión y sin perder tiempo.', accent: 'from-lime-300 via-emerald-300 to-violet-500' },
];

const SERVICE_TAGS = [
  { icon: Car, label: 'Multas de tránsito', color: 'from-amber-500 to-orange-500' },
  { icon: FileText, label: 'Registro de marcas', color: 'from-rose-500 to-pink-500' },
  { icon: Plane, label: 'Permisos de salida', color: 'from-violet-500 to-purple-500' },
  { icon: Sparkles, label: 'Nuevos servicios', color: 'from-violet-500 to-purple-500' },
];

// --------------------------------------------------------------
// SUBCOMPONENTES
// --------------------------------------------------------------
const SlideToActionButton = ({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`
        relative group overflow-hidden rounded-full
        bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500
        px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 text-sm sm:text-base font-bold text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)]
        transition-all duration-300 hover:shadow-[0_15px_40px_rgba(244,63,94,0.45)]
        flex items-center justify-center gap-2 w-full sm:w-auto
        ${className}
      `}
      style={{ cursor: 'pointer' }}
    >
      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
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

const RotatingText = ({ phrases, initialDelay = 900, intervalTime = 2500 }: { phrases: string[]; initialDelay?: number; intervalTime?: number }) => {
  const [index, setIndex] = useState(0);
  const [startRotation, setStartRotation] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setStartRotation(true), initialDelay);
    return () => window.clearTimeout(timer);
  }, [initialDelay]);

  useEffect(() => {
    if (!startRotation || phrases.length <= 1) return;
    const interval = window.setInterval(() => setIndex((prev) => (prev + 1) % phrases.length), intervalTime);
    return () => window.clearInterval(interval);
  }, [startRotation, phrases.length, intervalTime]);

  return (
    <span className="relative inline-flex min-h-[1.2em] items-center justify-center overflow-hidden align-baseline will-change-transform text-center sm:text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{
            duration: 0.45,
            ease: [0.2, 0.9, 0.4, 1],
          }}
          className="bg-gradient-to-r from-[#4B5563] via-[#F8FAFC] via-[#E5E7EB] to-[#BFA46F] bg-clip-text text-transparent whitespace-normal break-words"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// --------------------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------------------
const EliteLegalHeroFusion = () => {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [activeBenefit, setActiveBenefit] = useState(2);
  const [offsetMultiplier, setOffsetMultiplier] = useState(250);
  const [cardWidth, setCardWidth] = useState(290);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const yBg = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.98]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      // Ajustes responsivos para el desplazamiento y tamaño de tarjetas
      if (width < 480) {
        setOffsetMultiplier(70);
        setCardWidth(200);
      } else if (width < 640) {
        setOffsetMultiplier(100);
        setCardWidth(220);
      } else if (width < 768) {
        setOffsetMultiplier(140);
        setCardWidth(240);
      } else if (width < 1024) {
        setOffsetMultiplier(190);
        setCardWidth(260);
      } else if (width < 1280) {
        setOffsetMultiplier(220);
        setCardWidth(280);
      } else {
        setOffsetMultiplier(260);
        setCardWidth(300);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % BENEFIT_CARDS.length);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  const nextBenefit = useCallback(() => setActiveBenefit((prev) => (prev + 1) % BENEFIT_CARDS.length), []);
  const prevBenefit = useCallback(() => setActiveBenefit((prev) => (prev - 1 + BENEFIT_CARDS.length) % BENEFIT_CARDS.length), []);

  const textReveal = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
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
        h1, h2, h3, .font-black, .font-bold {
          text-rendering: geometricPrecision;
        }
        body {
          font-family: 'Inter', system-ui, sans-serif;
          overflow-x: hidden;
          width: 100%;
        }
        html {
          overflow-x: hidden;
          width: 100%;
        }
      `}</style>

      <main className="relative w-full bg-white antialiased selection:bg-rose-500 selection:text-white overflow-x-hidden">
        {/* ==================== HERO SECTION ==================== */}
        <div className="relative w-full min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex flex-col overflow-hidden bg-[#020617]">
          <motion.div style={{ y: yBg, willChange: 'transform' }} className="absolute top-[-25%] left-0 w-full h-[150%] z-0">
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

          <motion.div style={{ opacity: opacityHero, scale: scaleHero }} className="relative z-20 w-full max-w-7xl px-5 sm:px-6 pt-10 sm:pt-12 md:pt-32 pb-32 sm:pb-40 mx-auto flex flex-col items-center">
            <motion.div initial="hidden" animate="visible" variants={textReveal} className="group cursor-default inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 px-3 sm:px-4 py-1.5 rounded-full mb-6 sm:mb-8 shadow-lg">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap">Sin trámites. Sin vueltas. Sin estrés.</span>
            </motion.div>

            <h1 className="text-center text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.15] sm:leading-[1.1] mb-6 sm:mb-8 tracking-[-0.02em] px-2">
              <div className="overflow-hidden">
                <motion.div initial="hidden" animate="visible" variants={textReveal} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-x-3 sm:gap-x-4 gap-y-2">
                  <span className="whitespace-nowrap">Resuelve lo legal</span>
                  <span className="relative inline-flex items-center justify-center font-black max-w-full px-1">
                    <RotatingText phrases={ROTATING_PHRASES} />
                  </span>
                </motion.div>
              </div>
            </h1>

            <div className="text-center text-sm sm:text-base md:text-xl text-slate-400 max-w-2xl mb-6 sm:mb-8 font-light leading-relaxed px-3">
              <motion.div variants={textReveal} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                NoPay resuelve trámites legales <span className="text-white font-medium">sin filas y sin perder tiempo.</span>
              </motion.div>
              <motion.div variants={textReveal} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="mt-1 sm:mt-2">
                Convertimos leyes complejas en <span className="text-white italic">acciones claras, rápidas y definitivas</span>.
              </motion.div>
            </div>

            <motion.div variants={textReveal} initial="hidden" animate="visible" transition={{ delay: 1.0 }} className="w-full max-w-xs sm:max-w-md flex justify-center mb-8 sm:mb-10">
              <div className="p-0.5 sm:p-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl w-full">
                <SlideToActionButton href="/Servicios">Resolver mi caso ahora</SlideToActionButton>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 px-2"
            >
              {SERVICE_TAGS.map((service) => (
                <div
                  key={service.label}
                  className="group relative overflow-hidden flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-500 hover:scale-[1.04] hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                >
                  <service.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                  <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide whitespace-nowrap">{service.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="absolute bottom-[-1px] left-0 w-full z-30 pointer-events-none">
            <motion.svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 xs:h-20 sm:h-28 md:h-[180px] lg:h-[220px]" fill="white" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
              <path d="M0,0 C300,120 400,-20 600,60 C800,140 900,20 1200,80 L1200,120 L0,120 Z" />
            </motion.svg>
          </div>
        </div>

        {/* ==================== SECCIÓN BENEFICIOS ==================== */}
        <section className="relative bg-white -mt-1 pt-8 sm:pt-10 md:pt-16 pb-16 sm:pb-20 md:pb-32 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ x: ['-10%', '10%', '-5%'], y: ['-5%', '5%', '-2%'] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] sm:w-[680px] h-[280px] sm:h-[320px] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.035)_0%,rgba(245,158,11,0.025)_34%,transparent_72%)] blur-[90px]"
            />
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center max-w-5xl mx-auto px-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 sm:px-5 sm:py-2 shadow-sm backdrop-blur-xl">
                <MousePointer2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500" strokeWidth={1.5} />
                <span className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.28em] text-slate-600">LegalTech Ecuador</span>
              </div>
              <h2 className="mt-5 sm:mt-7 text-[1.8rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[3.8rem] font-black tracking-[-0.045em] leading-[1.1] sm:leading-[0.92] text-slate-950 px-2">
                NoPay transforma{' '}
                <span className="block bg-gradient-to-r from-[#F46C1D] via-[#D82465] to-purple-600 bg-clip-text text-transparent">
                  lo legal en simple
                </span>
              </h2>
              <p className="mt-4 sm:mt-5 max-w-xl mx-auto text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed px-4">
                IA + Abogados Expertos. Más rápido. Más claro. Sin papeleo eterno.
              </p>
            </div>

            <div className="relative mt-12 sm:mt-16 md:mt-20 overflow-x-clip" ref={carouselContainerRef}>
              <div className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block h-full w-16 sm:w-24 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-20 hidden md:block h-full w-16 sm:w-24 bg-gradient-to-l from-white to-transparent" />

              <motion.button
                onClick={prevBenefit}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-0 sm:left-2 md:left-4 top-1/2 z-40 -translate-y-1/2 grid h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Beneficio anterior"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
              </motion.button>

              <motion.button
                onClick={nextBenefit}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 sm:right-2 md:right-4 top-1/2 z-40 -translate-y-1/2 grid h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Siguiente beneficio"
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
              </motion.button>

              <div className="relative flex min-h-[380px] sm:min-h-[420px] md:min-h-[460px] items-center justify-center overflow-visible px-2 sm:px-4 md:px-16">
                {BENEFIT_CARDS.map((card, index) => {
                  const total = BENEFIT_CARDS.length;
                  let offset = index - activeBenefit;
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;
                  const isActive = offset === 0;
                  
                  const isNear = Math.abs(offset) <= 2;
                  if (!isNear) return null;

                  const xOffset = offset * offsetMultiplier;
                  // Rotación más sutil en móviles
                  const rotateAmount = window.innerWidth < 640 ? offset * 1.2 : offset * 2;

                  return (
                    <motion.div
                      key={card.title}
                      animate={{
                        x: `calc(-50% + ${xOffset}px)`,
                        scale: isActive ? 1.05 : 0.8,
                        rotate: rotateAmount,
                        opacity: isActive ? 1 : Math.abs(offset) === 1 ? 0.6 : 0.2,
                        zIndex: 30 - Math.abs(offset),
                        y: isActive ? [0, -4, 0] : 0,
                      }}
                      transition={{
                        duration: 0.55,
                        ease: [0.25, 1, 0.5, 1],
                        y: isActive ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {},
                      }}
                      className="absolute left-1/2 will-change-transform"
                      style={{ 
                        width: `${cardWidth}px`,
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <div
                        className={[
                          'group relative h-[330px] sm:h-[360px] md:h-[380px] overflow-hidden rounded-[1.8rem] sm:rounded-[2rem] border bg-white p-5 sm:p-6 md:p-7 text-center transition-all duration-500',
                          isActive
                            ? 'border-transparent shadow-[0_25px_50px_rgba(244,63,94,0.18)]'
                            : 'border-slate-200/60 shadow-[0_15px_30px_rgba(15,23,42,0.04)]',
                        ].join(' ')}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeGradient"
                            className={`absolute inset-0 rounded-[1.8rem] sm:rounded-[2rem] bg-gradient-to-br ${card.accent} opacity-100`}
                            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                          />
                        )}
                        <div
                          className={[
                            'absolute inset-[2px] rounded-[1.75rem] sm:rounded-[1.9rem]',
                            isActive ? 'bg-white/95 backdrop-blur-md' : 'bg-gradient-to-br from-white via-white to-slate-50',
                          ].join(' ')}
                        />

                        {/* Efecto escáner premium solo en activo */}
                        {isActive && (
                          <motion.div
                            initial={{ y: '140%', opacity: 0 }}
                            animate={{ 
                              y: '-140%', 
                              opacity: [0, 0.45, 0.45, 0]
                            }}
                            transition={{
                              duration: 4.8,
                              repeat: Infinity,
                              repeatDelay: 1.2,
                              ease: [0.25, 1, 0.5, 1]
                            }}
                            className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-amber-400/40 via-yellow-300/50 to-transparent h-[40%] w-full filter blur-[2px]"
                            style={{ mixBlendMode: 'color-burn' }}
                          />
                        )}

                        <div className="relative z-10 flex h-full flex-col items-center justify-center">
                          <div
                            className={[
                              'grid h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 place-items-center rounded-full transition-all duration-500',
                              isActive
                                ? `bg-gradient-to-br ${card.accent} text-white shadow-lg`
                                : 'bg-slate-100 text-slate-500',
                            ].join(' ')}
                          >
                            {React.cloneElement(card.icon, { className: 'h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11' })}
                          </div>
                          <h3 className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl font-black tracking-[-0.02em] text-slate-950">
                            {card.title}
                          </h3>
                          <p className="mt-2 max-w-[180px] sm:max-w-[190px] text-xs sm:text-sm leading-relaxed text-slate-500 px-2">
                            {card.desc}
                          </p>
                          <div
                            className={`mt-4 sm:mt-5 h-1 w-8 sm:w-10 rounded-full transition-all duration-500 ${
                              isActive ? `bg-gradient-to-r ${card.accent}` : 'bg-slate-100'
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-10 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {BENEFIT_CARDS.map((card, index) => (
                  <button
                    key={card.title}
                    onClick={() => setActiveBenefit(index)}
                    aria-label={`Ver ${card.title}`}
                    className={[
                      'h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 touch-manipulation',
                      activeBenefit === index
                        ? 'w-8 sm:w-12 bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500'
                        : 'w-2 bg-slate-300 hover:bg-slate-400',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>

            <div className="mt-16 sm:mt-20 md:mt-28 grid gap-4 sm:gap-5 md:grid-cols-3 px-2">
              {[
                { label: 'Antes', value: 'Filas · Papeleo · Incertidumbre', muted: true },
                { label: 'Ahora con NoPay', value: 'Claridad · Velocidad · Control', muted: false },
                { label: 'Resultado', value: 'Decides mejor y avanzas seguro', muted: false },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl sm:rounded-[1.6rem] border border-slate-200 bg-white/80 p-5 sm:p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.28em] text-slate-400">{item.label}</p>
                  <p
                    className={[
                      'mt-2 sm:mt-3 text-base sm:text-lg md:text-xl font-black tracking-tight break-words',
                      item.muted
                        ? 'text-slate-400 line-through decoration-slate-300'
                        : 'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent',
                    ].join(' ')}
                  >
                    {item.value}
                  </p>
                  {!item.muted && (
                    <div className="mt-2 sm:mt-3 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                      <span className="text-[11px] sm:text-xs text-slate-500">Garantizado</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 sm:mt-16 text-center px-4">
              <p className="text-xs sm:text-sm text-slate-400 border-t border-slate-200 pt-6 sm:pt-8">
                🚀 Más de 1,000+ personas ya resolvieron sus trámites con NoPay. <br className="sm:hidden" />
                <span className="font-medium text-slate-600">Sin filas, sin abogados costosos, 100% digital.</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default EliteLegalHeroFusion;