'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, PenTool, FileSignature, Zap } from 'lucide-react';

const RedaccionDocumentosOverlay = () => {
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const steps = [
    { icon: <FileText className="w-5 h-5 text-white" />, text: 'Seleccionando tipo de documento' },
    { icon: <PenTool className="w-5 h-5 text-white" />, text: 'Completando datos legales' },
    { icon: <FileSignature className="w-5 h-5 text-white animate-pulse" />, text: 'Documento generado con éxito' }
  ];

  useEffect(() => {
    setHydrated(true);
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

  if (!hydrated) return null;

  return (
    <motion.div
      className={`z-50 ${
        isMobile
          ? 'fixed inset-0 flex items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]'
          : 'fixed bottom-1 right-6 lg:right-16 w-full max-w-xs'
      }`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div
        className="relative w-full aspect-[9/18] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border-[10px] border-gray-700 flex flex-col"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 0.9, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.3 }}
      >
        {/* Header */}
        <div className="relative h-10 bg-gray-800 flex items-center justify-center px-5 text-[10px] text-gray-400">
          <div className="absolute top-2 w-16 h-4 bg-gray-900 rounded-full"></div>
          <span>9:42</span>
          <div className="absolute right-4 flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400 animate-bounce" />
            <span>100%</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-4 overflow-hidden">
          <div className="text-center">
            <motion.span
              className="block text-xl font-black bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              NoPay
            </motion.span>
            <h2 className="text-sm font-bold text-[#10B981] mb-1">Redactor Legal Inteligente</h2>
            <p className="text-[10px] text-gray-400">Documentos validados en Ecuador</p>
          </div>

          <div className="space-y-3">
            {steps.slice(0, step).map((s, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-gray-800/80 backdrop-blur-sm border border-gray-700 px-3 py-2 rounded-xl shadow-sm"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.3 }}
              >
                <div className="mr-2">{s.icon}</div>
                <span className="text-xs text-white font-medium">{s.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-4">
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
            </div>
            <div className="text-[10px] text-right text-white/80 mt-1">
              {Math.round((step / steps.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-gray-500 py-2 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <motion.span
            className="font-semibold text-white/80"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            NoPay Redacción Legal
          </motion.span>{' '}
          · Ecuador LegalTech
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RedaccionDocumentosOverlay;