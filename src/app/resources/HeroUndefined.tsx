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
        px-8 py-4 text-center text-base font-bold text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)]
        transition-all duration-300 hover:shadow-[0_15px_40px_rgba(244,63,94,0.45)]
        flex items-center justify-center gap-2 mx-auto
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
    <span className="relative inline-flex min-h-[1.2em] items-center justify-center overflow-hidden align-baseline will-change-transform">
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
          className="bg-gradient-to-r from-[#4B5563] via-[#F8FAFC] via-[#E5E7EB] to-[#BFA46F] bg-clip-text text-transparent"
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
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const yBg = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.98]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setOffsetMultiplier(270);
      else if (width >= 1280) setOffsetMultiplier(240);
      else if (width >= 768) setOffsetMultiplier(210);
      else setOffsetMultiplier(175);
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
        }
      `}</style>

      <main className="relative w-full bg-white antialiased selection:bg-rose-500 selection:text-white">
        {/* ==================== HERO SECTION ==================== */}
        <div className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col overflow-hidden bg-[#020617]">
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

          <motion.div style={{ opacity: opacityHero, scale: scaleHero }} className="relative z-20 max-w-7xl px-6 pt-12 md:pt-32 pb-40 mx-auto flex flex-col items-center">
            <motion.div initial="hidden" animate="visible" variants={textReveal} className="group cursor-default inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 px-4 py-1.5 rounded-full mb-8 shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-[0.3em]">Sin trámites. Sin vueltas. Sin estrés.</span>
            </motion.div>

            <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-[-0.02em]">
              <div className="overflow-hidden">
                <motion.div initial="hidden" animate="visible" variants={textReveal} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-x-4 gap-y-2">
                  <span>Resuelve lo legal</span>
                  <span className="relative inline-flex items-center justify-center font-black">
                    <RotatingText phrases={ROTATING_PHRASES} />
                  </span>
                </motion.div>
              </div>
            </h1>

            <div className="text-center text-base md:text-xl text-slate-400 max-w-2xl mb-8 font-light leading-relaxed">
              <motion.div variants={textReveal} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                NoPay resuelve trámites legales <span className="text-white font-medium">sin filas y sin perder tiempo.</span>
              </motion.div>
              <motion.div variants={textReveal} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="mt-2">
                Convertimos leyes complejas en <span className="text-white italic">acciones claras, rápidas y definitivas</span>.
              </motion.div>
            </div>

            <motion.div variants={textReveal} initial="hidden" animate="visible" transition={{ delay: 1.0 }} className="w-full flex justify-center mb-10">
              <div className="p-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl flex items-center justify-center">
                <SlideToActionButton href="/Servicios">Resolver mi caso ahora</SlideToActionButton>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              {SERVICE_TAGS.map((service) => (
                <div
                  key={service.label}
                  className="group relative overflow-hidden flex items-center gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-md px-4 py-2 transition-all duration-500 hover:scale-[1.04] hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] "
                >
                  <service.icon className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-semibold text-white tracking-wide">{service.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="absolute bottom-[-1px] left-0 w-full z-30 pointer-events-none">
            <motion.svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[120px] md:h-[220px]" fill="white" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
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
            <div className="text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 shadow-sm backdrop-blur-xl">
                <MousePointer2 className="h-4 w-4 text-rose-500" strokeWidth={1.5} />
                <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.28em] text-slate-600">LegalTech Ecuador</span>
              </div>
              <h2 className="mt-7 text-[2.2rem] md:text-[3.8rem] font-black tracking-[-0.045em] leading-[0.92] text-slate-950">
                NoPay transforma{' '}
                <span className="block bg-gradient-to-r from-[#F46C1D] via-[#D82465] to-purple-600 bg-clip-text text-transparent">
                  lo legal en simple
                </span>
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-sm md:text-base text-slate-500 leading-relaxed">
                IA + Abogados Expertos. Más rápido. Más claro. Sin papeleo eterno.
              </p>
            </div>

            <div className="relative mt-16 md:mt-20" ref={carouselContainerRef}>
              <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-24 bg-gradient-to-r from-white to-transparent xl:block" />
              <div className="pointer-events-none absolute right-0 top-0 z-20 hidden h-full w-24 bg-gradient-to-l from-white to-transparent xl:block" />

              <motion.button
                onClick={prevBenefit}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-0 md:left-4 top-1/2 z-40 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Beneficio anterior"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
              </motion.button>

              <motion.button
                onClick={nextBenefit}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 md:right-4 top-1/2 z-40 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Siguiente beneficio"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
              </motion.button>

              <div className="relative flex min-h-[440px] items-center justify-center overflow-visible px-4 md:px-16">
                {BENEFIT_CARDS.map((card, index) => {
                  const total = BENEFIT_CARDS.length;
                  let offset = index - activeBenefit;
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;
                  const isActive = offset === 0;
                  
                  const isNear = Math.abs(offset) <= 2;
                  if (!isNear) return null;

                  const xOffset = offset * offsetMultiplier;

                  return (
                    <motion.div
                      key={card.title}
                      animate={{
                        x: `calc(-50% + ${xOffset}px)`,
                        scale: isActive ? 1.08 : 0.82,
                        rotate: offset * 2.2,
                        opacity: isActive ? 1 : Math.abs(offset) === 1 ? 0.65 : 0.25,
                        zIndex: 30 - Math.abs(offset),
                        y: isActive ? [0, -6, 0] : 0,
                      }}
                      transition={{
                        duration: 0.55,
                        ease: [0.25, 1, 0.5, 1],
                        y: isActive ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {},
                      }}
                      className="absolute left-1/2 w-[240px] md:w-[290px] will-change-transform"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div
                        className={[
                          'group relative h-[350px] md:h-[370px] overflow-hidden rounded-[2rem] border bg-white p-6 md:p-7 text-center transition-all duration-500',
                          isActive
                            ? 'border-transparent shadow-[0_25px_50px_rgba(244,63,94,0.18)]'
                            : 'border-slate-200/60 shadow-[0_15px_30px_rgba(15,23,42,0.04)]',
                        ].join(' ')}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeGradient"
                            className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${card.accent} opacity-100`}
                            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                          />
                        )}
                        <div
                          className={[
                            'absolute inset-[2px] rounded-[1.9rem]',
                            isActive ? 'bg-white/95 backdrop-blur-md' : 'bg-gradient-to-br from-white via-white to-slate-50',
                          ].join(' ')}
                        />

                        {/* UI/UX CRITICAL FIX: Capa de luz horizontal DORADA en cámara lenta (Efecto Escáner Premium) */}
                        {isActive && (
                          <motion.div
                            initial={{ y: '140%', opacity: 0 }}
                            animate={{ 
                              y: '-140%', 
                              opacity: [0, 0.45, 0.45, 0] // Alta opacidad visible pero elegante
                            }}
                            transition={{
                              duration: 4.8, // Barrido suave en cámara lenta
                              repeat: Infinity,
                              repeatDelay: 1.2,
                              ease: [0.25, 1, 0.5, 1] // Easing amortiguado fluido
                            }}
                            className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-amber-400/40 via-yellow-300/50 to-transparent h-[40%] w-full filter blur-[2px]"
                            style={{ mixBlendMode: 'color-burn' }}
                          />
                        )}

                        <div className="relative z-10 flex h-full flex-col items-center justify-center">
                          <div
                            className={[
                              'grid h-22 w-22 md:h-26 md:w-26 place-items-center rounded-full transition-all duration-500',
                              isActive
                                ? `bg-gradient-to-br ${card.accent} text-white shadow-lg`
                                : 'bg-slate-100 text-slate-500',
                            ].join(' ')}
                          >
                            {React.cloneElement(card.icon, { className: 'h-9 w-9 md:h-11 md:w-11' })}
                          </div>
                          <h3 className="mt-5 text-lg md:text-xl font-black tracking-[-0.02em] text-slate-950">
                            {card.title}
                          </h3>
                          <p className="mt-2.5 max-w-[190px] text-xs md:text-sm leading-relaxed text-slate-500">
                            {card.desc}
                          </p>
                          <div
                            className={`mt-5 h-1 w-10 rounded-full transition-all duration-500 ${
                              isActive ? `bg-gradient-to-r ${card.accent}` : 'bg-slate-100'
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-12 flex items-center justify-center gap-3">
                {BENEFIT_CARDS.map((card, index) => (
                  <button
                    key={card.title}
                    onClick={() => setActiveBenefit(index)}
                    aria-label={`Ver ${card.title}`}
                    className={[
                      'h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400',
                      activeBenefit === index
                        ? 'w-12 bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500'
                        : 'w-2 bg-slate-300 hover:bg-slate-400',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>

            <div className="mt-20 md:mt-28 grid gap-5 md:grid-cols-3">
              {[
                { label: 'Antes', value: 'Filas · Papeleo · Incertidumbre', muted: true },
                { label: 'Ahora con NoPay', value: 'Claridad · Velocidad · Control', muted: false },
                { label: 'Resultado', value: 'Decides mejor y avanzas seguro', muted: false },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
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
                  {!item.muted && (
                    <div className="mt-3 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs text-slate-500">Garantizado</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-sm text-slate-400 border-t border-slate-200 pt-8">
                🚀 Más de 1,000+ personas ya resolvieron sus trámites con NoPay. <br className="md:hidden" />
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