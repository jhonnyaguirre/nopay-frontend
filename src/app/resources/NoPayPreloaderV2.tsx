'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useTransform } from 'framer-motion';

import { 
  Cpu, 
  CircuitBoard,  // Nombre corregido
  Network, 
  Binary, 
  Gavel, 
  ShieldCheck, 
  Landmark,
  Zap,
  BadgeCheck 
} from 'lucide-react';

export default function NoPayLegalMatrix() {
  const [activeModule, setActiveModule] = useState(0);
  const [defenseProgress, setDefenseProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 300 });

  // Efecto de seguimiento de mouse (parallax)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width * 20 - 10);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simulación de carga del sistema legal
  useEffect(() => {
    const interval = setInterval(() => {
      setDefenseProgress(prev => (prev >= 100 ? 0 : prev + 1));
      setActiveModule(prev => (prev >= 4 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Componente de partículas flotantes
  const FloatingParticle = ({ id }: { id: number }) => {
    const x = useTransform(smoothMouseX, [-10, 10], [-20 + (id * 5), 20 - (id * 5)]);
    const y = useSpring(Math.sin(id * 100) * 30, { damping: 20, stiffness: 100 });

    return (
      <motion.div
        className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
        style={{ x, y }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1]
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  };

  // Módulos del sistema legal (con icono corregido)
  const legalModules = [
    { icon: <ShieldCheck className="w-6 h-6 text-green-400" />, name: "Defensa Automatizada", status: "Activo" },
    { icon: <Gavel className="w-6 h-6 text-yellow-400" />, name: "Análisis de Multas", status: "Escaneando..." },
    { icon: <Landmark className="w-6 h-6 text-purple-400" />, name: "Base Legal", status: "Actualizado" },
    { icon: <CircuitBoard className="w-6 h-6 text-cyan-400" />, name: "Conexión Neural", status: "Estable" }, // Icono corregido
    { icon: <Binary className="w-6 h-6 text-red-400" />, name: "Cifrado Legal", status: "Protegido" }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Fondo Matrix */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yMCAzOC41NTdjLTEwLjI0NyAwLTE4LjU1Ny04LjMxLTE4LjU1Ny0xOC41NTdDOS40NDMgOS43NTEgMTcuNzUzIDEuNDQgMjggMS40NHMxOC41NTcgOC4zMSAxOC41NTcgMTguNTU3YzAgMTAuMjQ3LTguMzEgMTguNTU3LTE4LjU1NyAxOC41NTd6bTAtMzEuMTE0Yy02Ljk3IDAtMTIuNTQzIDUuNTc0LTEyLjU0MyAxMi41NTdzNS41NzQgMTIuNTQzIDEyLjU0MyAxMi41NDNjNi45NyAwIDEyLjU1Ny01LjU3NCAxMi41NTctMTIuNTQzIDAtNi45Ny01LjU4Ny0xMi41NTctMTIuNTU3LTEyLjU1N3oiIGZpbGw9IiMwMEZGRkYiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20">
        {[...Array(50)].map((_, i) => (
          <FloatingParticle key={i} id={i} />
        ))}
      </div>

      {/* Tarjeta Holográfica Principal */}
      <motion.div
        className="relative w-[90%] max-w-4xl h-[70vh] bg-gray-900/80 backdrop-blur-lg border border-cyan-400/20 rounded-xl shadow-2xl overflow-hidden p-6"
        style={{
          rotateY: smoothMouseX
        }}
      >
        {/* Barra de Estado */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-mono text-cyan-400">SISTEMA LEGAL AUTÓNOMO</span>
          </div>
          <div className="text-xs font-mono text-gray-400">
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Contenido Dinámico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Panel de Módulos */}
          <div className="col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 border-b border-cyan-400/30 pb-2">
              Módulos Activos
            </h3>
            <div className="space-y-3">
              {legalModules.map((module, index) => (
                <motion.div
                  key={index}
                  className={`p-3 rounded-lg border ${activeModule === index ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-700'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    {module.icon}
                    <div>
                      <h4 className="font-medium text-white">{module.name}</h4>
                      <p className="text-xs text-gray-400">{module.status}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Panel de Visualización */}
          <div className="col-span-2 bg-gray-900/50 rounded-xl p-4 border border-cyan-400/20">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">
              Matriz de Defensa Legal
            </h3>
            
            {/* Gráfico de Red Neuronal */}
            <div className="relative w-full h-48 mb-6">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9Im5vbmUiLz48ZyBzdHJva2U9InJnYmEoMCwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwJSIgeTI9IjEwMCUiLz48bGluZSB4MT0iMTAwJSIgeTE9IjAiIHgyPSIwIiB5Mj0iMTAwJSIvPjwvZz48L3N2Zz4=')] opacity-30" />
              
              {/* Nodos de conexión */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                  style={{
                    left: `${10 + (i * 15)}%`,
                    top: `${30 + Math.sin(i) * 20}%`
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Barra de Progreso */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Defensa en Progreso</span>
                <span>{defenseProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-green-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${defenseProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Log de Actividad */}
            <div className="mt-6 h-24 overflow-y-auto font-mono text-xs text-cyan-300">
              {[
                "> Iniciando análisis legal...",
                "> Conexión con base de datos establecida",
                "> Identificando inconsistencias...",
                "> Preparando argumentos legales",
                defenseProgress >= 50 && "> ¡Defensa optimizada con éxito!",
                defenseProgress >= 80 && "> Listo para impugnación automática"
              ].filter(Boolean).map((log, i) => (
                <p key={i} className="mb-1">{log}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-500 py-2 border-t border-cyan-400/10">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            NO PAY LEGAL AI v4.2.0 · Sistema de Defensa Automatizado
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}