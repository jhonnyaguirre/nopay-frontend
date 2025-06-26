'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoPayChat from 'components/NoPayChat';

export default function NoPayChatLauncher() {
  const [showChat, setShowChat] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  return (
    <>
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <motion.button
          onClick={() => {
            setShowChat(true);
            setIsPulsing(false);
          }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
          className="relative group"
          animate={isHovering ? 'hover' : 'rest'}
          initial="rest"
        >
          {/* Burbuja principal con efecto de neón */}
          <div className="relative">
            {/* Efecto de pulso de neón */}
            <AnimatePresence>
              {isPulsing && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.3, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#AD00FF] blur-sm"
                />
              )}
            </AnimatePresence>

            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-[#00F5FF] via-[#0A1D3E] to-[#AD00FF] rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-2 border-white/20"
              variants={{
                rest: { rotate: 0 },
                hover: { rotate: 8 }
              }}
            >
              {/* Efecto de circuito digital interior */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full opacity-80"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Circuito base */}
                <path
                  d="M10,10 L90,10 L90,90 L10,90 Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  fill="none"
                />
                {/* Líneas de conexión */}
                <path
                  d="M20,20 Q50,5 80,20 T80,50"
                  stroke="#00F5FF"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="3,3"
                />
                <path
                  d="M20,80 Q50,95 80,80 T80,50"
                  stroke="#AD00FF"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="3,3"
                />
                {/* Nodos de conexión */}
                <circle cx="50" cy="50" r="4" fill="white" />
                <circle cx="30" cy="30" r="2" fill="#00F5FF" />
                <circle cx="70" cy="70" r="2" fill="#AD00FF" />
              </svg>

              {/* Icono de chatbot animado con efecto de latido */}
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M8 10h.01" fill="white"/>
                  <path d="M12 10h.01" fill="white"/>
                  <path d="M16 10h.01" fill="white"/>
                </svg>
              </motion.div>
            </motion.div>

            {/* Efecto de partículas digitales */}
            <AnimatePresence>
              {isHovering && (
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        opacity: 0, 
                        scale: 0,
                        x: Math.random() * 40 - 20,
                        y: Math.random() * 40 - 20
                      }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.2, 0],
                        x: Math.random() * 60 - 30,
                        y: Math.random() * 60 - 30
                      }}
                      transition={{
                        duration: 1.8,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: i % 2 === 0 ? '#00F5FF' : '#AD00FF',
                        originX: 0.5,
                        originY: 0.5
                      }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Etiqueta emergente con efecto de terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: isHovering ? 1 : 0,
              x: isHovering ? 0 : 20
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 px-4 py-2 bg-[#0A1D3E] text-white text-sm font-mono font-bold rounded-lg whitespace-nowrap shadow-lg border border-[#00F5FF]/30"
          >
            <div className="flex items-center">
              <span className="text-[#00F5FF] mr-2">$</span>
              <span>Iniciar Asistente Legal</span>
              <motion.span 
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="ml-1"
              >
                _
              </motion.span>
            </div>
          </motion.div>
        </motion.button>
      </motion.div>

      <NoPayChat visible={showChat} onClose={() => {
        setShowChat(false);
        setIsPulsing(true);
      }} />
    </>
  );
}