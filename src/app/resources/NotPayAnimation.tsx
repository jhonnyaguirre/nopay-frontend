'use client';

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

export default function NoPayIntroAnimation() {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    const sequence = [800, 1500, 2200, 3000, 3800];
    sequence.forEach((delay, index) => {
      setTimeout(() => {
        setStep(index + 1);
        if (index === 3) setExplode(true);
      }, delay);
    });
    setTimeout(() => setShow(false), 5000);
  }, []);

  const steps = [
    { icon: <ShieldCheck className="w-6 h-6" />, text: 'Escaneando documento de multa...', effect: 'scale' },
    { icon: <Scale className="w-6 h-6" />, text: 'Analizando base legal aplicable...', effect: 'shake' },
    { icon: <Gavel className="w-6 h-6" />, text: 'Calculando reembolso estimado...', effect: 'pulse' },
    { icon: <Landmark className="w-6 h-6" />, text: 'Localizando inconsistencias legales...', effect: 'explode' },
    { icon: <BadgeCheck className="w-6 h-6 text-green-500" />, text: '¡Defensa lista con 92% de éxito!', effect: 'celebrate' }
  ];

  const getAnimation = (effect: string) => {
    switch (effect) {
      case 'scale':
        return { scale: [1, 1.1, 1], transition: { duration: 0.6 } };
      case 'shake':
        return { x: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } };
      case 'pulse':
        return { scale: [1, 1.05, 1], transition: { repeat: 2, duration: 0.3 } };
      case 'explode':
        return explode ? {
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
          transition: { duration: 0.4 }
        } : {};
      case 'celebrate':
        return {
          rotate: [0, -10, 10, -5, 5, 0],
          y: [0, -10, 0],
          transition: { duration: 0.6 }
        };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {explode && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#EC4899] to-[#F59E0B]"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    opacity: 0,
                    scale: [1, 1.5, 0]
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              ))}
            </>
          )}

          <motion.div
            className="relative w-[340px] h-[680px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-gray-700 flex flex-col"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          >
            {/* Fondo animado */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yMCAzOC41NTdjLTEwLjI0NyAwLTE4LjU1Ny04LjMxLTE4LjU1Ny0xOC41NTdDOS40NDMgOS43NTEgMTcuNzUzIDEuNDQgMjggMS40NHMxOC41NTcgOC4zMSAxOC41NTcgMTguNTU3YzAgMTAuMjQ3LTguMzEgMTguNTU3LTE4LjU1NyAxOC41NTd6bTAtMzEuMTE0Yy02Ljk3IDAtMTIuNTQzIDUuNTc0LTEyLjU0MyAxMi41NTdzNS41NzQgMTIuNTQzIDEyLjU0MyAxMi41NDNjNi45NyAwIDEyLjU1Ny01LjU3NCAxMi41NTctMTIuNTQzIDAtNi45Ny01LjU4Ny0xMi41NTctMTIuNTU3LTEyLjU1N3oiIGZpbGw9IiNGRkYiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] bg-repeat"></div>
            </div>

            {/* Top bar */}
            <div className="relative h-14 bg-gray-800 flex items-center justify-center px-6">
              <div className="absolute top-3 w-24 h-6 bg-gray-900 rounded-full"></div>
              <div className="flex justify-between w-full text-xs text-gray-400">
                <span>9:41</span>
                <div className="flex space-x-1">
                  <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6 space-y-6 overflow-hidden relative">
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.h1
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#F59E0B] mb-2"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'linear',
                  }}
                >
                  NO PAY LEGAL AI
                </motion.h1>
                <p className="text-gray-400 text-sm">Preparando defensa disruptiva</p>
              </motion.div>

              <div className="space-y-4">
                {steps.slice(0, step).map((s, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-gray-800/80 backdrop-blur-sm border border-gray-700 px-4 py-3 rounded-xl shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, ...getAnimation(s.effect) }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                  >
                    <motion.div className="mr-3" whileHover={{ scale: 1.1 }}>
                      {s.icon}
                    </motion.div>
                    <span className="text-sm font-medium text-gray-200">{s.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / steps.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </div>
                <motion.div
                  className="absolute -top-6 right-0 text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#F59E0B]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {Math.round((step / steps.length) * 100)}%
                </motion.div>
              </motion.div>

              {step >= 4 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899] to-[#F59E0B] mix-blend-overlay opacity-30"></div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <motion.div
              className="text-center text-xs text-gray-500 py-3 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Powered by NoPay Legal AI • v4.2.0
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
