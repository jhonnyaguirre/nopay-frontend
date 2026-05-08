'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronRight, Gavel, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SlideToActionButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SlideToActionButton = ({ href, children, className = '' }: SlideToActionButtonProps) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);

  // Calcular el ancho disponible dinámicamente
  useEffect(() => {
    if (containerRef.current) {
      // 64px es el ancho del thumb (h-full aspect-square en un contenedor de 64-72px)
      setMaxWidth(containerRef.current.offsetWidth - 76); 
    }
  }, []);

  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 400, damping: 40 });

  // Transformaciones visuales
  const opacity = useTransform(x, [0, maxWidth * 0.5], [1, 0]);
  const scaleText = useTransform(x, [0, maxWidth * 0.8], [1, 0.9]);
  const bgWidth = useTransform(x, (value) => value + 64);
  
  // Color dinámico: de naranja/rosa a cyan cuando está por completar
  const glowColor = useTransform(x, [0, maxWidth], ["rgba(244, 108, 29, 0)", "rgba(216, 36, 101, 0.4)"]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > maxWidth * 0.7) {
      x.set(maxWidth);
      setIsComplete(true);
      // Simular un proceso de "validación" antes de navegar
      setTimeout(() => router.push(href), 600);
    } else {
      x.set(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-[68px] w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 overflow-hidden select-none ${className}`}
    >
      {/* Fondo de Progreso Dinámico */}
      <motion.div
        style={{ width: bgWidth }}
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-600/20 via-orange-500/30 to-rose-500/50 border-r border-rose-400/50 z-0"
      />

      {/* Texto Guía con Máscara */}
      <motion.div
        style={{ opacity, scale: scaleText }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-sm font-bold text-white/40 tracking-[0.2em] uppercase flex items-center gap-2">
          {children}
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </span>
      </motion.div>

      {/* Thumb (El botón que se desliza) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxWidth }}
        dragElastic={0.02}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={{ cursor: 'grabbing' }}
        className="relative z-20 h-full aspect-square bg-slate-950 rounded-xl flex items-center justify-center cursor-grab border border-white/20 shadow-xl group"
      >
        {/* Efecto de Brillo Interno del Thumb */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-rose-400"
            >
              <Sparkles className="h-6 w-6 fill-rose-400" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <Gavel className="h-6 w-6 text-white group-hover:text-rose-400 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Partículas de rastro (opcional) */}
        <motion.div 
           style={{ opacity: useTransform(x, [0, 50], [0, 1]) }}
           className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500/50 blur-md"
        />
      </motion.div>

      {/* Indicador de meta final */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
          <Sparkles className="h-5 w-5 text-white" />
      </div>

      {/* Overlay de brillo general */}
      <motion.div 
        style={{ backgroundColor: glowColor }}
        className="absolute inset-0 pointer-events-none transition-colors duration-300"
      />
    </div>
  );
};