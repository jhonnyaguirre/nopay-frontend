'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, UserCheck, Zap } from 'lucide-react';

const PermisoMenoresPhoneOverlay = () => {
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false); // ✅ Evita desajustes de hidratación (mismatch)

  const steps = [
    {
      icon: <FileText className="w-5 h-5 text-white" />,
      text: 'Registrando datos del menor y acompañantes'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      text: 'Generando documento con validez legal'
    },
    {
      icon: <UserCheck className="w-5 h-5 text-white animate-pulse" />,
      text: 'Documento listo para firmar y presentar'
    }
  ];

  useEffect(() => {
    setHydrated(true); // Indica que el componente ya se montó en el cliente
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i + 1), 1300 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!hydrated) return null; // Evita parpadeos de renderizado del lado del servidor

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
      <motion.div
        className="relative w-full max-w-[280px] sm:max-w-[310px] md:max-w-xs aspect-[9/18] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.2rem] shadow-2xl overflow-hidden border-[8px] border-gray-700/90 flex flex-col transform origin-center scale-90 sm:scale-95 md:scale-100 will-change-transform"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.2 }}
      >
        {/* Header del Teléfono (Notch / Barra de Estado) */}
        <div className="relative h-9 bg-gray-800 flex items-center justify-between px-6 text-[10px] text-gray-400 font-medium select-none">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-gray-900 rounded-full z-10" />
          <span className="relative z-20">9:42</span>
          <div className="relative z-20 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-yellow-400 animate-bounce" />
            <span>100%</span>
          </div>
        </div>

        {/* Contenido de la Pantalla del Dispositivo */}
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
            <h2 className="text-xs font-bold text-[#10B981] mb-0.5 tracking-wide">Permiso de Salida</h2>
            <p className="text-[9px] text-gray-400">LegalTech Ecuador · Migración</p>
          </div>

          {/* Pasos de Simulación Animados */}
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

          {/* Indicador de Porcentaje / Progreso */}
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
            NoPay Menores
          </motion.span>{' '}
          · Autorización Legal Ecuador
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PermisoMenoresPhoneOverlay;