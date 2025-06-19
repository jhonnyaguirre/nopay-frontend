"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Gavel,
  Zap,
  Scale,
  Landmark,
  BadgeCheck
} from 'lucide-react';

export default function NoPayPreloader() {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  const [explode, setExplode] = useState(false);

  // --- NUEVO: estado y efecto para la hora actual ---
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const actualizarHora = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formatted = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
      setCurrentTime(formatted);
    };

    actualizarHora();
    const intervaloHora = setInterval(actualizarHora, 60000); // cada minuto

    return () => clearInterval(intervaloHora);
  }, []);
  // --- FIN NUEVO ---

  useEffect(() => {
    const sequence = [500, 1000, 1600, 2200, 3000];
    sequence.forEach((delay, index) => {
      setTimeout(() => {
        setStep(index + 1);
        if (index === 3) setExplode(true);
      }, delay);
    });
    setTimeout(() => setShow(false), 4000);
  }, []);

  const steps = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: 'Inicializando módulo legal...', effect: 'scale' },
    { icon: <Scale className="w-5 h-5" />, text: 'Leyendo parámetros normativos...', effect: 'shake' },
    { icon: <Gavel className="w-5 h-5" />, text: 'Preparando motor de defensa...', effect: 'pulse' },
    { icon: <Landmark className="w-5 h-5" />, text: 'Cifrando tokens jurídicos...', effect: 'explode' },
    { icon: <BadgeCheck className="w-5 h-5 text-green-400" />, text: 'Listo para litigar.', effect: 'celebrate' }
  ];

  const getAnimation = (effect: string) => {
    switch (effect) {
      case 'scale':
        return { scale: [1, 1.1, 1], transition: { duration: 0.5 } };
      case 'shake':
        return { x: [0, -6, 6, -3, 3, 0], transition: { duration: 0.4 } };
      case 'pulse':
        return { scale: [1, 1.05, 1], transition: { repeat: 2, duration: 0.3 } };
      case 'explode':
        return explode ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1], transition: { duration: 0.4 } } : {};
      case 'celebrate':
        return { rotate: [0, -8, 8, -4, 4, 0], y: [0, -6, 0], transition: { duration: 0.6 } };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {explode && (
            <>
              {[...Array(14)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#EC4899] to-[#F59E0B]"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.random() * 360 - 180,
                    y: Math.random() * 360 - 180,
                    opacity: 0,
                    scale: [1, 1.3, 0]
                  }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />
              ))}
            </>
          )}

          <motion.div
            className="relative w-full max-w-[280px] h-auto min-h-[580px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border-[10px] border-gray-700 flex flex-col"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            style={{
              // Ajuste responsivo para pantallas más pequeñas
              maxHeight: '90vh',
              minHeight: 'min(580px, 90vh)'
            }}
          >
            <div className="relative h-12 bg-gray-800 flex items-center justify-center px-5">
              <div className="absolute top-2 w-20 h-5 bg-gray-900 rounded-full"></div>
              <div className="flex justify-between w-full text-[10px] text-gray-400">
                {/* AQUI SE MUESTRA LA HORA ACTUAL */}
                <span>{currentTime}</span>
                <div className="flex space-x-1">
                  <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-hidden relative flex flex-col">
              <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <motion.h1
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#F59E0B] mb-1"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                >
                  NoPay Legal Engine
                </motion.h1>
                <p className="text-gray-400 text-xs">Iniciando sistema legal inteligente...</p>
              </motion.div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {steps.slice(0, step).map((s, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-gray-800/80 backdrop-blur-sm border border-gray-700 px-3 py-2 rounded-xl shadow-md"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0, ...getAnimation(s.effect) }}
                    transition={{ delay: 0.25 + index * 0.2 }}
                  >
                    <motion.div className="mr-2" whileHover={{ scale: 1.1 }}>
                      {s.icon}
                    </motion.div>
                    <span className="text-xs font-medium text-gray-200">{s.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-6 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / steps.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </div>
                <motion.div
                  className="absolute -top-4 right-0 text-[10px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#F59E0B]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {Math.round((step / steps.length) * 100)}%
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="text-center text-[10px] text-gray-500 py-2 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
                Powered by NoPay AI · Sistema jurídico optimizado
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
