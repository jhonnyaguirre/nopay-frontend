// components/PopupInicial.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Lottie from "lottie-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  CheckCircle,
  MessageSquareWarning,
  X,
  Zap,
  Clock,
} from "lucide-react";
import hammerAnimation from "animations/hammer.json";

// Variantes para animación por secciones
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 120,
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
};

interface TimeLeft {
  hours: string;
  minutes: string;
  seconds: string;
}

const PopupInicial: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const { width, height } = useWindowSize();

  // Fecha objetivo para el contador (24h en el futuro; ajústalo si es necesario)
  const targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Maneja apertura, sonido, confetti y contador
  useEffect(() => {
    setIsOpen(true);

    // Bloquear scroll en el body
    document.body.style.overflow = "hidden";

    // Reproducir sonido breve
    const audio = new Audio("/sounds/notification.mp3");
    audio.volume = 0.25;
    audio.play().catch(() => {});

    // Confetti 2s
    const confettiTimer = setTimeout(() => setShowConfetti(false), 2000);

    // Contador regresivo cada segundo
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
      } else {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({
          hours: String(h).padStart(2, "0"),
          minutes: String(m).padStart(2, "0"),
          seconds: String(s).padStart(2, "0"),
        });
      }
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(interval);
      // Restaurar scroll al cerrar
      document.body.style.overflow = "";
    };
  }, [targetDate]);

  // Cerrar modal (y restablecer scroll)
  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  // Cierra con tecla ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Confetti inicial */}
          {showConfetti && (
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={400}
              colors={[
                "#7F1D1D",
                "#EC4899",
                "#F59E0B",
                "#22C55E",
                "#3B82F6",
                "#FBBF24",
              ]}
            />
          )}

          {/* Backdrop oscuro + blur */}
           

          {/* Contenedor principal del modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="popup-titulo"
              className="relative bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] rounded-[2rem] shadow-2xl max-w-3xl w-full overflow-hidden"
            >
              {/* Patrón SVG semitransparente */}
              <div className="absolute inset-0 opacity-15">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEyKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==\")",
                  }}
                />
              </div>

              {/* Botón de cierre */}
              <motion.button
                onClick={closeModal}
                aria-label="Cerrar modal"
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={28} strokeWidth={2.5} />
              </motion.button>

              {/* Contenido principal (animación por ítems) */}
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 px-6 py-8 sm:px-10 sm:py-12">
                {/* 1) Sección izquierda */}
                <motion.div
                  className="flex-1 text-center lg:text-left"
                  variants={itemVariants}
                  exit="exit"
                >
                  {/* Lottie con sombra pronunciada */}
                  <motion.div
                    className="w-[10rem] h-[10rem] mx-auto lg:mx-0 mb-4"
                    variants={itemVariants}
                  >
                    <Lottie
                      animationData={hammerAnimation}
                      loop
                      style={{
                        filter:
                          "drop-shadow(0 8px 30px rgba(0, 0, 0, 0.6))",
                      }}
                    />
                  </motion.div>

                  {/* Título principal */}
                  <motion.h2
                    id="popup-titulo"
                    className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight"
                    variants={itemVariants}
                  >
                    <span className="text-yellow-300">¡NO PAGUE</span>{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
                      ESA MULTA!
                    </span>
                  </motion.h2>

                  {/* Subtítulo */}
                  <motion.p
                    className="text-lg sm:text-xl text-white/90 mb-6"
                    variants={itemVariants}
                  >
                    Nuestros abogados{" "}
                    <span className="font-bold text-yellow-300">
                      anulan tu multa
                    </span>{" "}
                    en tiempo récord.
                  </motion.p>

                  {/* Lista de beneficios */}
                  <motion.ul
                    className="space-y-3 mb-8 text-white/90"
                    variants={itemVariants}
                  >
                    {[
                      "100% online - sin salir de casa",
                      "Éxito en el 92% de los casos",
                      "Solo pagas si ganamos",
                    ].map((texto, idx) => (
                      <motion.li
                        key={texto}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.3 + idx * 0.12,
                          duration: 0.35,
                          ease: "easeOut",
                        }}
                      >
                        <CheckCircle
                          className="text-green-300 animate-pulse"
                          size={20}
                        />
                        <span className="font-medium">{texto}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>

                {/* 2) Sección derecha: tarjeta de oferta */}
                <motion.div
                  className="w-full lg:w-96 bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20"
                  variants={itemVariants}
                  exit="exit"
                >
                  {/* Encabezado oferta */}
                  <motion.div
                    className="text-center mb-6"
                    variants={itemVariants}
                  >
                    <div className="inline-flex items-center gap-2 bg-yellow-300 text-[#7F1D1D] px-4 py-2 rounded-full text-sm font-bold mb-3">
                      <Zap className="stroke-[#7F1D1D]" size={18} />
                      <span>OFERTA POR TIEMPO LIMITADO</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      ¡Primera consulta{" "}
                      <span className="text-yellow-300">GRATIS</span>!
                    </h3>
                    <p className="text-white/80 text-sm">
                      Solo hoy: 30% de descuento en impugnaciones
                    </p>
                  </motion.div>

                  {/* Contador regresivo */}
                  <motion.div
                    className="flex justify-center gap-2 mb-6"
                    variants={itemVariants}
                  >
                    {[
                      { label: "Horas", value: timeLeft.hours },
                      { label: "Minutos", value: timeLeft.minutes },
                      { label: "Segundos", value: timeLeft.seconds },
                    ].map((item, idx) => (
                      <motion.div
                        key={item.label}
                        className="bg-black/30 rounded-lg p-2 text-center min-w-[65px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.5 + idx * 0.1,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock size={16} className="text-yellow-300" />
                          <span className="text-2xl font-bold text-yellow-300">
                            {item.value}
                          </span>
                        </div>
                        <div className="text-xs text-white/70 uppercase">
                          {item.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Botón CTA principal */}
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white font-extrabold text-lg py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border-2 border-transparent hover:border-yellow-300"
                    onClick={() => {
                      // Aquí rediriges a tu flujo de impugnación
                      // e.j.: router.push("/impugnacion");
                    }}
                  >
                    <MessageSquareWarning size={20} />
                    <span>¡QUIERO IMPUGNAR AHORA!</span>
                  </motion.button>

                  <motion.div
                    className="mt-4 text-center text-xs text-white/70"
                    variants={itemVariants}
                  >
                    +5,000 multas impugnadas con éxito
                  </motion.div>
                </motion.div>
              </div>

              {/* Sello de garantía con animación “pop” */}
              <motion.div
                className="absolute -bottom-8 -right-8 bg-yellow-300 text-[#7F1D1D] font-bold text-sm px-8 py-2 rounded-full transform rotate-12 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.1 }}
              >
                GARANTÍA DE SATISFACCIÓN
              </motion.div>

              {/* Pie de modal con atribución */}
              <motion.div
                className="absolute bottom-2 right-4 text-xs text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                Realizado por DeepSeek
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PopupInicial;
