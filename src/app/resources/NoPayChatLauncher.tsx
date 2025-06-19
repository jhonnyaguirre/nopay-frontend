'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoPayChat from 'components/NoPayChat';

export default function NoPayChatLauncher() {
  const [showChat, setShowChat] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <motion.button
          onClick={() => setShowChat(true)}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
          className="relative group"
          animate={isHovering ? 'hover' : 'rest'}
          initial="rest"
        >
          {/* Burbuja principal con efecto de partículas */}
          <div className="relative">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-[#FF3E9D] via-[#0A1D3E] to-[#F9C74F] rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
              variants={{
                rest: { rotate: 0 },
                hover: { rotate: 8 }
              }}
            >
              {/* Efecto de circuito interior */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full opacity-70"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20,20 L80,20 L80,80 L20,80 Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  fill="none"
                />
                <path
                  d="M30,30 Q50,10 70,30 T90,50"
                  stroke="#F9C74F"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="50" cy="50" r="5" fill="#FF3E9D" />
              </svg>

              {/* Icono de IA animado */}
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 13a8 8 0 0 1 7 7 6 6 0 0 0 3-5 9 9 0 0 0 6-8 3 3 0 0 0-3-3 9 9 0 0 0-8 6 6 6 0 0 0-5 3"/>
                  <path d="M7 14a6 6 0 0 0-3 6 6 6 0 0 0 6-3"/>
                  <path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/>
                </svg>
              </motion.div>
            </motion.div>

            {/* Efecto de partículas flotantes */}
            <AnimatePresence>
              {isHovering && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0],
                        x: Math.random() * 40 - 20,
                        y: Math.random() * 40 - 20
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        repeat: Infinity
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                      style={{
                        originX: 0.5,
                        originY: 0.5
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Etiqueta emergente */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: isHovering ? 1 : 0,
              x: isHovering ? 0 : 20
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 px-3 py-1.5 bg-[#0A1D3E] text-white text-sm font-bold rounded-full whitespace-nowrap shadow-lg"
          >
            Asistente Legal IA
          </motion.div>
        </motion.button>
      </motion.div>

      <NoPayChat visible={showChat} onClose={() => setShowChat(false)} />
    </>
  );
}