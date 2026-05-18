'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Landmark, Zap, X } from 'lucide-react';

interface RegistroMarcasOverlayProps {
  onClose?: () => void;
}

const RegistroMarcasOverlay = ({ onClose }: RegistroMarcasOverlayProps) => {
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false); // ✅ Evita mismatch de hidratación SSR/CSR

  const steps = [
    {
      icon: <FileText className="w-5 h-5 text-white" />,
      text: 'Cargando datos de tu marca...'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      text: 'Verificando disponibilidad...'
    },
    {
      icon: <Landmark className="w-5 h-5 text-white animate-pulse" />,
      text: 'Enviando solicitud al SENADI'
    }
  ];

  useEffect(() => {
    setHydrated(true); // Indica que el componente se montó de forma segura en el cliente
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i + 1), 1300 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!hydrated) return null; // Evita parpadeos antes de la hidratación completa

  return (
    <motion.div
      className={`z-50 ${
        isMobile
          ? 'fixed inset-0 flex items-center justify-center w-full h-screen p-4 bg-slate-950/60 backdrop-blur-md'
          : 'fixed bottom-4 right-6 lg:right-16 w-full max-w-xs'
      }`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Botón de cierre adaptable */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:-top-2 md:-right-2 z-40 p-1.5 bg-gray-800/90 backdrop-blur-sm rounded-full border border-gray-600 text-white hover:bg-gray-700 transition-all duration-200 focus:outline-none shadow-lg"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Mockup del teléfono móvil con escalado inteligente */}
      <motion.div
        className="relative w-full max-w-[280px] sm:max-w-[310px] md:max-w-xs aspect-[9/18] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.2rem] shadow-2xl overflow-hidden border-[8px] border-gray-700/90 flex flex-col transform origin-center scale-90 sm:scale-95 md:scale-100 will-change-transform"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.2 }}
      >
        {/* Header del Teléfono (Dynamic Island / Notch Estilo Premium) */}
        <div className="relative h-9 bg-gray-800 flex items-center justify-between px-6 text-[10px] text-gray-400 font-medium select-none">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-gray-900 rounded-full z-10" />
          <span className="relative z-20">9:42</span>
          <div className="relative z-20 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-yellow-400 animate-bounce" />
            <span>100%</span>
          </div>
        </div>

        {/* Contenido / Proceso Interno */}
        <div className="flex-1 p-5 space-y-5 overflow-hidden flex flex-col justify-between">
          <div className="text-center pt-2">
            <motion.span
              className="block text-2xl font-black bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] bg-clip-text text-transparent tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              NoPay
            </motion.span>
            <h2 className="text-xs font-bold text-[#10B981] mb-0.5 tracking-wide">Registro de Marcas</h2>
            <p className="text-[9px] text-gray-400">Trámitación guiada automáticamente</p>
          </div>

          {/* Listado de Pasos con Animación Fluida */}
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {steps.slice(0, step).map((s, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-gray-800/60 backdrop-blur-sm border border-gray-700/70 px-3 py-2.5 rounded-xl shadow-sm"
                initial={{ opacity: 0, x: -16, y: 4 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 140, damping: 14, delay: index * 0.15 }}
              >
                <div className="mr-3 flex-shrink-0 bg-gray-900/40 p-1.5 rounded-lg border border-gray-700/40">{s.icon}</div>
                <span className="text-xs text-slate-100 font-semibold tracking-wide leading-tight">{s.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Barra de Progreso Inferior */}
          <div className="mb-2">
            <div className="w-full h-1 bg-gray-700/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
            </div>
            <div className="text-[9px] text-right text-white/70 mt-1 font-mono tracking-wider">
              {Math.round((step / steps.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Footer del Dispositivo */}
        <div className="text-center text-[9px] tracking-wide text-gray-500 py-2.5 border-t border-gray-800/80 bg-gray-900/60 backdrop-blur-sm select-none">
          <motion.span
            className="font-bold text-white/80"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            NoPay Registro de Marca
          </motion.span>{' '}
          · SENADI Ecuador
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Page() {
  return <RegistroMarcasOverlay />;
}