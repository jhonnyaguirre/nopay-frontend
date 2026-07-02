"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  UserPlus,
  Upload,
  Brain,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --------------------------------------------------------------
// DATOS DEL PROCESO
// --------------------------------------------------------------
const PROCESS_STEPS = [
  {
    step: "01",
    title: "Eliges el problema legal que quieres resolver",
    description:
      "NoPay no te obliga a entender leyes: te muestra escenarios claros —multas, permisos, marcas y más— para que elijas qué necesitas solucionar.",
    icon: UserPlus,
    color: "from-orange-500 to-rose-500",
    shadow: "shadow-orange-500/10",
    benefit: "Sin rodeos",
  },
  {
    step: "02",
    title: "Cargas la información con asistencia inteligente",
    description:
      "Nuestra tecnología te guía, autocompleta y ordena tus datos, evita errores comunes y convierte información básica en un expediente digital listo para análisis.",
    icon: Upload,
    color: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/10",
    benefit: "Datos protegidos",
  },
  {
    step: "03",
    title: "Nuestra IA legal analiza el caso",
    description:
      "Un motor entrenado para detectar riesgos, inconsistencias, oportunidades y rutas de acción revisa la información antes de que el proceso avance.",
    icon: Brain,
    color: "from-fuchsia-500 to-purple-600",
    shadow: "shadow-fuchsia-500/10",
    benefit: "Análisis preciso",
  },
  {
    step: "04",
    title: "Pagas solo cuando el sistema ya entiende tu caso",
    description:
      "NoPay primero estructura tu necesidad legal y luego activa el servicio. Pagas por una solución encaminada, no por una promesa vacía.",
    icon: ShieldCheck,
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/10",
    benefit: "Pago seguro",
  },
  {
    step: "05",
    title: "El proceso termina en segundos u horas si requiere validación",
    description:
      "Algunos casos se resuelven casi al instante. Otros pasan por validación profesional para asegurar precisión, criterio jurídico y respaldo real.",
    icon: Award,
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/10",
    benefit: "Respuesta ágil",
  },
  {
    step: "06",
    title: "Cada caso está respaldado por abogados expertos",
    description:
      "La IA acelera. La tecnología ordena. Pero el respaldo legal humano sostiene la confianza: NoPay combina velocidad digital con criterio profesional.",
    icon: ShieldCheck,
    color: "from-slate-900 to-slate-800",
    shadow: "shadow-slate-900/10",
    benefit: "Respaldo real",
  },
];

// --------------------------------------------------------------
// TARJETA DE PASO
// --------------------------------------------------------------
const ProcessStepCard = ({
  item,
  isLeft,
  index,
}: {
  item: typeof PROCESS_STEPS[0];
  isLeft: boolean;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 0.95],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 0.95],
    [60, 0, 0, -40]
  );
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [isLeft ? 8 : -8, 0, 0, isLeft ? -5 : 5]
  );
  const numberParallax = useTransform(scrollYProgress, [0, 1], [-20, 40]);

  return (
    <div
      ref={cardRef}
      className={`relative mb-16 flex items-center md:mb-28 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      style={{ perspective: 1500 }}
    >
      <motion.div
        style={{ opacity, y, rotateY, transformStyle: "preserve-3d" }}
        className="ml-14 w-full md:ml-0 md:w-[46%] will-change-transform"
      >
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100/80 bg-white p-8 sm:p-10 shadow-[0_30px_70px_rgba(15,23,42,0.03)] transition-all duration-500 hover:-translate-y-2 hover:border-rose-200/50 hover:shadow-[0_40px_90px_rgba(244,63,94,0.08)]">
          <motion.div
            style={{
              y: numberParallax,
              WebkitTextStroke: "1px rgba(226, 232, 240, 0.8)",
            }}
            className="absolute -right-4 -top-6 z-0 select-none p-4 text-[7.5rem] sm:text-[9.5rem] font-black italic leading-none text-transparent opacity-70 transition-colors duration-500 group-hover:opacity-100 tracking-tighter [text-stroke:1px_rgba(226,232,240,0.8)]"
          >
            {item.step}
          </motion.div>

          <motion.div
            initial={{ y: "150%", opacity: 0 }}
            animate={{ y: "-150%", opacity: [0, 0.45, 0.45, 0] }}
            transition={{
              duration: 4,
              ease: [0.25, 1, 0.5, 1],
              repeat: Infinity,
              repeatDelay: 3 + index * 0.2,
            }}
            className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-amber-400/25 via-yellow-300/35 to-transparent h-[30%] w-full filter blur-[4px]"
            style={{ mixBlendMode: "color-burn" }}
          />

          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-2xl" />

          <div className="relative z-10 flex flex-col items-start">
            <div
              className="mb-8 flex items-center justify-between w-full"
              style={{ transform: "translateZ(30px)" }}
            >
              <div
                className={`rounded-2xl bg-gradient-to-br ${item.color} p-4 text-white shadow-xl ${item.shadow} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
              >
                <item.icon className="h-6 w-6" strokeWidth={2.2} />
              </div>

              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  IA Active
                </span>
              </div>
            </div>

            <div className="space-y-4" style={{ transform: "translateZ(20px)" }}>
              <h3 className="text-2xl sm:text-3xl font-black leading-[1.08] tracking-[-0.04em] text-slate-950 transition-colors duration-300 group-hover:text-slate-900">
                {item.title}
              </h3>

              <p className="text-sm font-medium leading-relaxed text-slate-400 group-hover:text-slate-500 transition-colors duration-300">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-2" style={{ transform: "translateZ(10px)" }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50/80 border border-slate-100/70 px-4 py-2 text-[11px] font-bold text-slate-600 transition-all duration-300 group-hover:bg-rose-50/50 group-hover:border-rose-100/60 group-hover:text-rose-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 group-hover:text-rose-500 transition-colors duration-300" />
                {item.benefit}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute left-6 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center md:left-1/2">
        <motion.div
          whileInView={{ scale: [1, 1.3, 1] }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className={`h-4 w-4 rounded-full bg-gradient-to-br ${item.color} shadow-lg ring-8 ring-white transition-all duration-300`}
        />
        <span
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-[1px] animate-ping`}
          style={{ animationDuration: "3.5s" }}
        />
      </div>

      <div className="hidden w-[45%] md:block" />
    </div>
  );
};

// --------------------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------------------
export const ProcessTimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.5,
  });

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Luces de fondo */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.08, 1], x: [0, 15, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-100px] top-[15%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-rose-100/30 to-orange-100/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[-100px] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-fuchsia-100/20 to-purple-100/30 blur-3xl"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 35, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          className="mb-24 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50/60 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-rose-500 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 fill-rose-500/10" />
            Así opera NoPay
          </div>

          <h2 className="text-[2.5rem] font-black leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-[3.2rem] md:text-[3.8rem] lg:text-[4.5rem] lg:leading-[0.94]">
            Cómo funciona{" "}
            <span className="block bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent sm:inline">
              NoPay
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-slate-500 sm:text-base md:text-lg">
            Convertimos procesos legales confusos en una experiencia guiada,
            ordenada y accionable: menos incertidumbre, más control.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute bottom-0 left-6 top-0 w-[3px] md:left-1/2 md:-translate-x-1/2">
            <div className="h-full w-full rounded-full bg-slate-100" />
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute top-0 h-full w-full rounded-full bg-gradient-to-b from-orange-500 via-rose-500 via-fuchsia-500 to-emerald-500 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
            />
          </div>

          {PROCESS_STEPS.map((item, i) => (
            <ProcessStepCard
              key={item.step}
              item={item}
              isLeft={i % 2 === 0}
              index={i}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 text-center"
        >
          <Link href="/Servicios" aria-label="Empezar mi proceso legal">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-10 py-4.5 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-slate-400/40 transition-all duration-300 hover:bg-rose-600 hover:shadow-rose-500/20"
            >
              Empezar mi proceso legal
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </Link>
        </motion.div>

        {/* Micro-copy */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-center text-sm text-slate-400 border-t border-slate-100 pt-8"
        >
          ✅ Proceso 100% digital · Datos protegidos · Respaldo de abogados
          expertos
        </motion.div>

        {/* ============================================================ */}
        {/* BLOQUE DE VÍDEO CON MARCA DE AGUA */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto mt-16 max-w-4xl w-full"
        >
          {/* Badge */}
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50/60 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 backdrop-blur-sm">
              <Play className="h-3 w-3 fill-rose-500" />
              Mira el proceso en acción
            </span>
          </div>

          {/* Contenedor del video */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50/50 to-orange-50/50 p-1 shadow-2xl shadow-slate-200/60 backdrop-blur-sm group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-300/20 via-transparent to-orange-300/20 pointer-events-none" />
            <div className="relative overflow-hidden rounded-xl bg-black/5">
              <video
                ref={videoRef}
                src="/images/proceso.mp4"
                controls
                playsInline
                preload="metadata"
                loading="lazy"
                poster="/images/portadaV.png"
                className="block w-full h-auto rounded-xl"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                Tu navegador no soporta la reproducción de vídeos.
              </video>

             

              {/* Overlay de play (solo si no está reproduciendo) */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/10 via-black/20 to-black/30 backdrop-blur-[2px] transition-opacity duration-300 cursor-pointer group-hover:backdrop-blur-[4px]"
                  onClick={handlePlay}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl shadow-rose-500/30 transition-all duration-300 hover:bg-white hover:shadow-rose-500/50"
                  >
                    <div
                      className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping"
                      style={{ animationDuration: "1.5s" }}
                    />
                    <Play
                      className="ml-1 h-8 w-8 md:h-10 md:w-10 text-rose-600"
                      fill="currentColor"
                    />
                  </motion.button>
                  <p className="mt-3 md:mt-4 text-xs font-medium text-white/90 tracking-[0.15em] uppercase drop-shadow-lg bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Reproducir
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};