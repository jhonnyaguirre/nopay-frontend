"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  UserPlus,
  Upload,
  Brain,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// --------------------------------------------------------------
// DATOS DEL PROCESO (centralizados y tipados)
// --------------------------------------------------------------
const PROCESS_STEPS = [
  {
    step: "01",
    title: "Eliges el problema legal que quieres resolver",
    description:
      "NoPay no te obliga a entender leyes: te muestra escenarios claros —multas, permisos, marcas y más— para que elijas qué necesitas solucionar.",
    icon: UserPlus,
    color: "from-orange-500 to-rose-500",
    benefit: "Sin rodeos",
  },
  {
    step: "02",
    title: "Cargas la información con asistencia inteligente",
    description:
      "Nuestra tecnología te guía, autocompleta y ordena tus datos, evita errores comunes y convierte información básica en un expediente digital listo para análisis.",
    icon: Upload,
    color: "from-rose-500 to-pink-600",
    benefit: "Datos protegidos",
  },
  {
    step: "03",
    title: "Nuestra IA legal analiza el caso",
    description:
      "Un motor entrenado para detectar riesgos, inconsistencias, oportunidades y rutas de acción revisa la información antes de que el proceso avance.",
    icon: Brain,
    color: "from-fuchsia-500 to-purple-600",
    benefit: "Análisis preciso",
  },
  {
    step: "04",
    title: "Pagas solo cuando el sistema ya entiende tu caso",
    description:
      "NoPay primero estructura tu necesidad legal y luego activa el servicio. Pagas por una solución encaminada, no por una promesa vacía.",
    icon: ShieldCheck,
    color: "from-blue-500 to-cyan-500",
    benefit: "Pago seguro",
  },
  {
    step: "05",
    title:
      "El proceso termina en segundos si es automático, u horas si requiere validación humana",
    description:
      "Algunos casos se resuelven casi al instante. Otros pasan por validación profesional para asegurar precisión, criterio jurídico y respaldo real.",
    icon: Award,
    color: "from-emerald-500 to-teal-500",
    benefit: "Respuesta ágil",
  },
  {
    step: "06",
    title: "Cada caso está respaldado por abogados expertos",
    description:
      "La IA acelera. La tecnología ordena. Pero el respaldo legal humano sostiene la confianza: NoPay combina velocidad digital con criterio profesional.",
    icon: ShieldCheck,
    color: "from-slate-900 to-rose-600",
    benefit: "Respaldo real",
  },
];

// --------------------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------------------
export const ProcessTimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Decoraciones de fondo sutiles */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.14, 0.22, 0.14] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-rose-200 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-140px] right-[-120px] h-[460px] w-[460px] rounded-full bg-orange-200 blur-3xl"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="mb-20 text-center md:mb-24"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-rose-500">
            <Sparkles className="h-3.5 w-3.5" />
            Así opera NoPay
          </div>

          <h2 className="text-[2.2rem] font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-[2.8rem] md:text-[3.4rem] lg:text-[4rem] lg:leading-[0.96]">
            Cómo funciona{" "}
            <span className="block bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent sm:inline">
              NoPay
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-sm font-medium leading-relaxed text-slate-500 sm:text-base md:text-lg">
            Convertimos procesos legales confusos en una experiencia guiada,
            ordenada y accionable: menos incertidumbre, más control.
          </p>
        </motion.div>

        {/* Línea de tiempo */}
        <div className="relative mx-auto max-w-5xl">
          {/* Línea vertical central */}
          <div className="absolute bottom-0 left-6 top-0 w-[3px] md:left-1/2 md:-translate-x-1/2">
            <div className="h-full w-full rounded-full bg-slate-100" />
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute top-0 h-full w-full rounded-full bg-gradient-to-b from-orange-500 via-rose-500 to-fuchsia-500"
            />
          </div>

          {/* Pasos */}
          {PROCESS_STEPS.map((item, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div
                key={item.step}
                className={`relative mb-12 flex items-center md:mb-20 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -46 : 46, y: 18 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="ml-16 w-full md:ml-0 md:w-[45%]"
                >
                  <div className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-rose-100 hover:shadow-[0_28px_80px_rgba(244,63,94,0.11)]">
                    {/* Decoración esquina */}
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[4rem] bg-gradient-to-br from-rose-50 to-orange-50" />

                    <div className="relative z-10">
                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className={`rounded-2xl bg-gradient-to-br ${item.color} p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                        >
                          <item.icon className="h-7 w-7" />
                        </div>
                        <span className="text-5xl font-black italic leading-none tracking-[-0.05em] text-slate-200 sm:text-6xl">
                          {item.step}
                        </span>
                      </div>

                      <h3 className="mb-3 text-2xl font-black leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-3xl">
                        {item.title}
                      </h3>

                      <p className="mb-4 text-sm font-medium leading-relaxed text-slate-500 sm:text-base">
                        {item.description}
                      </p>

                      {/* Badge de beneficio */}
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        {item.benefit}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Punto central */}
                <div className="absolute left-6 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center md:left-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.22, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className={`h-4 w-4 rounded-full bg-gradient-to-br ${item.color} shadow-lg ring-8 ring-white`}
                  />
                </div>

                <div className="hidden w-[45%] md:block" />
              </div>
            );
          })}
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link href="/Servicios" aria-label="Empezar mi proceso legal">
            <motion.span
              whileHover={{ scale: 1.035, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-slate-300/60 transition hover:shadow-rose-200 sm:px-10"
            >
              Empezar mi proceso legal
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </Link>
        </motion.div>

        {/* Mensaje de confianza */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-center text-sm text-slate-400 border-t border-slate-200 pt-8"
        >
          ✅ Proceso 100% digital · Datos protegidos · Respaldo de abogados expertos
        </motion.div>
      </div>
    </section>
  );
};