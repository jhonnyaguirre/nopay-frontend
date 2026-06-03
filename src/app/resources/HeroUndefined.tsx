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
} from 'lucide-react';

const ROTATING_PHRASES = [
  'Impugna tu MULTA de tránsito hoy.',
  'Protege y registra tu MARCA.',
  'Permiso de SALIDA del país en minutos.',
];

const BENEFIT_CARDS = [
  {
    icon: <Clock3 strokeWidth={1.2} />,
    title: 'Más rápido',
    desc: 'Respuestas claras en minutos, no en días.',
    accent: 'from-amber-400 via-orange-500 to-rose-500',
  },
  {
    icon: <Wallet strokeWidth={1.2} />,
    title: 'Más económico',
    desc: 'Menos vueltas, menos costos, más control.',
    accent: 'from-orange-500 via-pink-500 to-violet-600',
  },
  {
    icon: <SmilePlus strokeWidth={1.2} />,
    title: 'Más simple',
    desc: 'Un proceso guiado, limpio y sin complicaciones.',
    accent: 'from-amber-400 via-rose-500 to-purple-600',
  },
  {
    icon: <Shield strokeWidth={1.2} />,
    title: 'Más seguro',
    desc: 'Tus datos protegidos y tu proceso ordenado.',
    accent: 'from-rose-500 via-orange-400 to-amber-500',
  },
  {
    icon: <BrainCircuit strokeWidth={1.2} />,
    title: 'Más inteligente',
    desc: 'IA que analiza, organiza y acelera tu trámite.',
    accent: 'from-violet-600 via-fuchsia-500 to-rose-500',
  },
  {
    icon: <GaugeCircle strokeWidth={1.2} />,
    title: 'Más directo',
    desc: 'Sin filas, sin confusión y sin perder tiempo.',
    accent: 'from-emerald-400 via-teal-500 to-indigo-600',
  },
];

const SlideToActionButton = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="
        relative group overflow-hidden rounded-full
        bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500
        px-10 py-4.5 text-center text-base font-bold text-white
        shadow-[0_12px_40px_rgba(244,108,29,0.35)] transition-all duration-300
        flex items-center justify-center gap-2 transform-gpu w-full sm:w-auto
      "
      style={{ cursor: 'pointer', backfaceVisibility: 'hidden' }}
    >
      <span className="relative z-10 flex items-center gap-2 tracking-tight">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <motion.div
        className="absolute inset-0 -z-0 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ opacity: 0 }}
      />
    </motion.a>
  );
};

const RotatingText = ({ phrases }: { phrases: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const interval = window.setInterval(
      () => setIndex((prev) => (prev + 1) % phrases.length),
      2800
    );
    return () => window.clearInterval(interval);
  }, [phrases.length]);

  return (
    <span className="relative inline-flex min-h-[1.2em] py-1 items-center justify-center overflow-visible transform-gpu">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
          className="
            inline-block leading-none pb-1 text-center
            bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400
            bg-clip-text text-transparent font-black tracking-tight
          "
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
  const [offsetMultiplier, setOffsetMultiplier] = useState(280);
  
  const touchStartX = useRef<number | null>(null);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const yBg = useTransform(scrollY, [0, 1000], [0, 120]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  // Manejo del Autoplay del Carrusel
  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    autoplayTimer.current = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % BENEFIT_CARDS.length);
    }, 4000); // Cambio fluido automático cada 4 segundos
  }, []);

  const nextBenefit = useCallback(() => {
    setActiveBenefit((prev) => (prev + 1) % BENEFIT_CARDS.length);
    startAutoplay(); // Resetear temporizador tras interacción del usuario
  }, [startAutoplay]);

  const prevBenefit = useCallback(() => {
    setActiveBenefit((prev) => (prev - 1 + BENEFIT_CARDS.length) % BENEFIT_CARDS.length);
    startAutoplay(); // Resetear temporizador tras interacción del usuario
  }, [startAutoplay]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setOffsetMultiplier(window.innerWidth >= 1024 ? 315 : window.innerWidth >= 768 ? 265 : 225);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    startAutoplay();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [startAutoplay]);

  if (!mounted) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #020617;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .blur-fix {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      <main className="relative w-full bg-[#020617] antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white">
        
        {/* ==================== HERO SECTION ==================== */}
        <div className="relative w-full min-h-[95vh] md:h-[calc(100vh-70px)] flex flex-col justify-center items-center overflow-hidden bg-[#020617]">
          
          {/* Fondo Orgánico Avanzado Big Tech */}
          <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 pointer-events-none blur-fix">
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 30%, #D82465 0%, #F46C1D 40%, #020617 85%)',
                  'radial-gradient(circle at 80% 60%, #D82465 0%, #F46C1D 35%, #020617 85%)',
                  'radial-gradient(circle at 30% 50%, #D82465 0%, #F46C1D 40%, #020617 85%)',
                ],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
              className="absolute inset-0 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/40 to-[#020617]" />
          </motion.div>

          {/* Contenedor Limpio y Simétrico (Sin los 3 botones inferiores) */}
          <motion.div 
            style={{ opacity: opacityHero }} 
            className="relative z-20 max-w-5xl px-6 pt-16 pb-28 mx-auto flex flex-col items-center justify-center text-center blur-fix"
          >
            {/* Badge Superior */}
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] px-4 py-1.5 rounded-full mb-8 shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.25em]">
                NoPay significa menos trámites, menos vueltas y menos estrés.
              </span>
            </motion.div>

            {/* Título Principal */}
            <h1 className="text-4xl sm:text-6xl md:text-[4.5rem] font-extrabold text-white leading-[1.15] tracking-tight max-w-4xl mb-6">
              Resuelve lo legal <br />
              <RotatingText phrases={ROTATING_PHRASES} />
            </h1>

            {/* Subtítulo */}
            <p className="text-base md:text-xl text-zinc-300 max-w-2xl mb-12 font-normal leading-relaxed">
              NoPay resuelve trámites legales <span className="text-white font-medium">sin filas y sin perder tiempo.</span> <br />
              <span className="text-zinc-400 font-light">Convertimos leyes complejas en acciones claras, rápidas y definitivas.</span>
            </p>

            {/* Botón CTA - Completamente Limpio y Centrado */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="w-full flex justify-center items-center px-4"
            >
              <SlideToActionButton href="/Servicios">
                Resolver mi caso ahora
              </SlideToActionButton>
            </motion.div>

          </motion.div>

          {/* Divisor de Transición Continua */}
          <div className="absolute bottom-[-1px] left-0 w-full z-30 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px]" fill="#ffffff">
              <path d="M0,0 C300,150 400,-20 600,60 C800,140 900,20 1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </div>

        {/* ==================== SECCIÓN BENEFICIOS CON CURVAS PRONUNCIADAS ==================== */}
        <section className="relative bg-white pt-24 pb-36 px-6 overflow-hidden">
          <div className="relative max-w-7xl mx-auto">
            
            {/* Encabezado */}
            <div className="text-center max-w-3xl mx-auto mb-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 shadow-sm">
                <MousePointer2 className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  NOPAY - LEGALTECH
                </span>
              </div>
              <h2 className="mt-6 text-3xl md:text-[3.2rem] font-bold tracking-tight text-slate-950 leading-tight">
                Hacemos que lo complejo se vuelva{' '}
                <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent font-extrabold">
                  increíblemente simple
                </span>
              </h2>
            </div>

            {/* Carrusel Automático Anti-Blur */}
            <div className="relative" onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }} onTouchEnd={(e) => {
              if (!touchStartX.current) return;
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 50) diff > 0 ? nextBenefit() : prevBenefit();
              touchStartX.current = null;
            }}>
              
              {/* Flechas Laterales */}
              <button onClick={prevBenefit} className="absolute left-0 lg:left-4 top-1/2 z-40 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white/95 shadow-md text-slate-700 hover:bg-slate-50 transition-all blur-fix">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button onClick={nextBenefit} className="absolute right-0 lg:right-4 top-1/2 z-40 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white/95 shadow-md text-slate-700 hover:bg-slate-50 transition-all blur-fix">
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Contenedor del Slider */}
              <div className="mx-auto flex min-h-[400px] max-w-5xl items-center justify-center overflow-hidden relative px-4">
                {BENEFIT_CARDS.map((card, index) => {
                  const total = BENEFIT_CARDS.length;
                  let offset = index - activeBenefit;
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;
                  
                  const isActive = offset === 0;
                  if (Math.abs(offset) > 2) return null;

                  return (
                    <motion.div
                      key={card.title}
                      animate={{
                        x: offset * offsetMultiplier,
                        scale: isActive ? 1.02 : 0.93, 
                        opacity: isActive ? 1 : 0.45,
                        zIndex: 20 - Math.abs(offset),
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute w-[245px] md:w-[285px] blur-fix"
                    >
                      {/* CURVAS MÁS PRONUNCIADAS: rounded-[2.5rem] */}
                      <div className={`
                        relative h-[360px] rounded-[2.5rem] border bg-white p-8 flex flex-col justify-between transition-all duration-300
                        ${isActive ? 'border-orange-500/30 shadow-[0_25px_60px_rgba(244,108,29,0.14)]' : 'border-slate-100 shadow-sm'}
                      `}>
                        <div className="flex flex-col items-center text-center">
                          {/* Contenedor de Íconos con curvas pronunciadas: rounded-[1.5rem] */}
                          <div className={`inline-flex p-4 rounded-[1.5rem] bg-gradient-to-br ${card.accent} text-white shadow-sm mb-5 blur-fix`}>
                            {React.cloneElement(card.icon, { className: 'h-6 w-6' })}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{card.title}</h3>
                          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-[210px]">{card.desc}</p>
                        </div>
                        <div className="w-full flex justify-center">
                          <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${card.accent}`} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Indicadores Inferiores Dinámicos */}
              <div className="mt-12 flex items-center justify-center gap-2">
                {BENEFIT_CARDS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setActiveBenefit(index); startAutoplay(); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeBenefit === index ? 'w-8 bg-slate-900' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </div>

            </div>

          </div>
        </section>
      </main>
    </>
  );
};

export default EliteLegalHeroFusion;