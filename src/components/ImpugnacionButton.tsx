'use client';

import { motion, useAnimation, Variants } from 'framer-motion';
import { Gavel, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const ImpugnacionButton = () => {
  const containerControls = useAnimation();
  const iconControls = useAnimation();
  const titleControls = useAnimation();
  const buttonControls = useAnimation();
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animación de entrada
    containerControls.start('visible');
    // Iniciamos el “flicker” del título desde que se monta
    titleControls.start('idle');
    // Iniciamos la animación pulsante del glow detrás de la tarjeta
    // (comienza automáticamente)
  }, [containerControls, titleControls]);

  // Variants para el contenedor (fade + slide + pop)
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 18, stiffness: 180, duration: 0.6 },
    },
  };

  // Variants para el título (flicker continuo + ligero lift en hover)
  const titleVariants: Variants = {
    idle: {
      opacity: [1, 0.92, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'mirror',
      },
    },
    hover: { y: -3, transition: { duration: 0.3 } },
  };

  // Variants para icono (pulso + swing en hover)
  const iconVariants: Variants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.15,
      rotate: [0, -8, 8, 0],
      transition: { type: 'spring', stiffness: 400, damping: 20, duration: 0.4 },
    },
  };

  // Variants para el botón (gradiente animado y scale en tap)
  const buttonVariants: Variants = {
    idle: { backgroundPosition: '0% 50%' },
    hover: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: { duration: 2.5, repeat: Infinity, ease: 'linear' },
    },
    tap: { scale: 0.95 },
  };

  // Efecto “ripple” en clic
  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = rippleRef.current;
    if (!button) return;

    // Remover ripple anterior si existe
    const existingRipple = button.getElementsByClassName('ripple')[0];
    if (existingRipple) existingRipple.remove();

    const rect = button.getBoundingClientRect();
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const circle = document.createElement('span');
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    button.appendChild(circle);
  };

  return (
    <section className="relative overflow-hidden py-32">
      {/* ============================================================ */}
      {/* 1) Glow pulsante siempre activo (detrás de la tarjeta)       */}
      {/* ============================================================ */}
      <motion.div
        className="absolute inset-0 flex justify-center items-center"
        initial={{ opacity: 0.1, scale: 1 }}
        animate={{
          opacity: [0.1, 0.18, 0.1],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
        }}
      />

      {/* ============================================================ */}
      {/* 2) Contenedor principal                                     */}
      {/* ============================================================ */}
      <motion.div
        className="relative z-10 px-6 max-w-3xl mx-auto"
        initial="hidden"
        animate={containerControls}
        variants={containerVariants}
      >
        <Link href="/Servicios/Impugnacion" className="relative block no-underline">
          {/* ======================================================== */}
          {/* 3) “Tarjeta” con gradiente animado + sombra              */}
          {/* ======================================================== */}
          <motion.div
            className="relative overflow-hidden rounded-3xl cursor-pointer"
            ref={rippleRef}
            onHoverStart={() => {
              iconControls.start('hover');
              titleControls.start('hover');
              buttonControls.start('hover');
            }}
            onHoverEnd={() => {
              iconControls.start('idle');
              titleControls.start('idle');
              buttonControls.start('idle');
            }}
            onClick={(e) => createRipple(e)}
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            style={{
              background: 'linear-gradient(135deg, #7F1D1D 0%, #EC4899 50%, #F59E0B 100%)',
              backgroundSize: '200% 200%',
              boxShadow:
                '0 8px 16px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            {/* Capa de blur + oscuridad para contraste */}
            <div className="absolute inset-0 rounded-3xl backdrop-blur-lg bg-black/30" />

            {/* ==================================================== */}
            {/* 4) Contenido interno (icono, título, subtítulo, CTA) */}
            {/* ==================================================== */}
            <div className="relative z-10 flex flex-col items-center justify-center px-8 py-14">
              {/* Icono con pulso                                     */}
              <motion.div
                className="mb-6 flex items-center justify-center p-5 bg-white/20 rounded-full border border-white/20"
                variants={iconVariants}
                initial="idle"
              >
                <Gavel className="h-10 w-10 text-amber-300" strokeWidth={2} />
              </motion.div>

              {/* Título con flicker continuo                        */}
              <motion.h2
                className="text-3xl md:text-4xl font-extrabold text-center tracking-wide leading-tight text-white"
                variants={titleVariants}
                initial="idle"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-pink-300">
                  Impugna tus Multas <br className="hidden sm:block" />
                  <span className="text-white">en Minutos</span>
                </span>
              </motion.h2>

              {/* Subtítulo informativo                                */}
              <motion.p
                className="mt-4 text-base md:text-lg font-medium text-white/85 text-center max-w-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                Sin abogados caros · Resultados en <strong>72 horas</strong>
              </motion.p>

              {/* Coller “dot” animado al lado del subtítulo (extra)   */}
              <motion.div
                className="mt-2 h-2 w-2 rounded-full bg-amber-300"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Espacio entre subtítulo y botón                      */}
              <div className="h-6" />

              {/* Botón CTA con “ripple” y gradiente animado            */}
              <motion.div
                className="relative inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base text-white overflow-hidden"
                style={{
                  background: 'linear-gradient(to right, #F59E0B, #EC4899)',
                  boxShadow:
                    '0 8px 20px rgba(236,72,153, 0.3), 0 12px 40px rgba(245,158,11, 0.25)',
                }}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => createRipple(e)}
              >
                {/* Texto del botón con ícono */}
                <span className="relative z-10 flex items-center gap-2">
                  ¡IMPUGNAR AHORA!
                  <ChevronRight className="h-5 w-5" />
                </span>
                {/* Capa oscura semitransparente para contraste */}
                <div className="absolute inset-0 bg-black/15 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* ================================= */}
      {/* Estilos CSS para el efecto ripple */}
      {/* ================================= */}
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          background-color: rgba(255, 255, 255, 0.4);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default ImpugnacionButton;
