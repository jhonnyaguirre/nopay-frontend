'use client';

import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  UserPlus,
  Upload,
  Brain,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  Scale,
  FileCheck2,
} from 'lucide-react';

const SITE_URL = 'https://nopaylegal.com';

export const ProcessTimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
  });

  const items = useMemo(
    () => [
      {
        step: '01',
        title: 'Eliges el trámite legal que necesitas',
        description:
          'Selecciona el servicio que quieres iniciar: impugnación de multas de tránsito, permiso de salida de menores, registro de marca, constitución de SAS u otro proceso legal disponible.',
        icon: <UserPlus className="h-7 w-7" />,
        color: 'from-orange-500 to-rose-500',
      },
      {
        step: '02',
        title: 'Cargas tus datos y documentos',
        description:
          'NoPay te guía para subir la información necesaria, evidencia, citaciones, documentos personales o datos del caso, evitando errores comunes desde el inicio.',
        icon: <Upload className="h-7 w-7" />,
        color: 'from-rose-500 to-pink-600',
      },
      {
        step: '03',
        title: 'La tecnología ordena y analiza tu caso',
        description:
          'Nuestro sistema estructura la información, identifica datos relevantes y prepara el expediente digital para que el proceso avance con mayor claridad.',
        icon: <Brain className="h-7 w-7" />,
        color: 'from-fuchsia-500 to-purple-600',
      },
      {
        step: '04',
        title: 'Conoces la ruta, el costo y el siguiente paso',
        description:
          'Antes de continuar, recibes una experiencia clara sobre qué se puede hacer, qué información falta y cuál es el camino más adecuado para tu trámite.',
        icon: <Scale className="h-7 w-7" />,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        step: '05',
        title: 'Pagas y activas el servicio legal',
        description:
          'Cuando el sistema ya entiende tu caso, puedes activar el servicio correspondiente. El objetivo es que pagues por un proceso encaminado y no por incertidumbre.',
        icon: <FileCheck2 className="h-7 w-7" />,
        color: 'from-emerald-500 to-teal-500',
      },
      {
        step: '06',
        title: 'Recibes acompañamiento y seguimiento',
        description:
          'Dependiendo del servicio, el caso puede avanzar de forma automática o pasar a revisión profesional. NoPay combina tecnología con respaldo de abogados.',
        icon: <ShieldCheck className="h-7 w-7" />,
        color: 'from-slate-900 to-rose-600',
      },
    ],
    []
  );

  const howToSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Cómo iniciar un trámite legal online con NoPay en Ecuador',
      description:
        'Proceso guiado para iniciar servicios legales digitales en Ecuador como impugnación de multas, permiso de salida de menores, registro de marca y constitución de SAS.',
      totalTime: 'PT24H',
      supply: [
        {
          '@type': 'HowToSupply',
          name: 'Datos personales o del caso',
        },
        {
          '@type': 'HowToSupply',
          name: 'Documentos o evidencia del trámite',
        },
      ],
      tool: [
        {
          '@type': 'HowToTool',
          name: 'Plataforma digital NoPay',
        },
      ],
      step: items.map((item, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: item.title,
        text: item.description,
        url: `${SITE_URL}/#proceso-legal-nopay`,
      })),
    }),
    [items]
  );

  return (
    <section
      id="proceso-legal-nopay"
      ref={containerRef}
      aria-labelledby="proceso-nopay-title"
      className="relative w-full overflow-hidden bg-white py-24 md:py-32"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />

      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-rose-200 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.14, 0.24, 0.14] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-140px] right-[-120px] h-[460px] w-[460px] rounded-full bg-orange-200 blur-3xl"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.header
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="mb-24 text-center"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-rose-500">
            <Sparkles className="h-3.5 w-3.5" />
            Así funciona NoPay
          </span>

          <h2
            id="proceso-nopay-title"
            className="text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 md:text-7xl"
          >
            Iniciar un trámite legal
            <span className="block bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
              ahora es más claro
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            NoPay convierte procesos legales de Ecuador en una experiencia guiada: seleccionas el
            servicio, subes tu información, el sistema organiza tu caso y avanzas con una ruta más
            clara.
          </p>
        </motion.header>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute bottom-0 left-6 top-0 w-[3px] md:left-1/2 md:-translate-x-1/2">
            <div className="h-full w-full rounded-full bg-slate-100" />
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute top-0 h-full w-full rounded-full bg-gradient-to-b from-orange-500 via-rose-500 to-fuchsia-500"
            />
          </div>

          {items.map((item, i) => {
            const isLeft = i % 2 === 0;

            return (
              <article
                key={item.step}
                className={`relative mb-12 flex items-center md:mb-20 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 18 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="ml-16 w-full md:ml-0 md:w-[45%]"
                >
                  <div className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-rose-100 hover:shadow-[0_28px_80px_rgba(244,63,94,0.12)]">
                    <div
                      className="absolute right-0 top-0 h-28 w-28 rounded-bl-[4rem] bg-gradient-to-br from-rose-50 to-orange-50"
                      aria-hidden="true"
                    />

                    <div className="relative z-10 mb-6 flex items-center gap-4">
                      <div
                        className={`rounded-2xl bg-gradient-to-br ${item.color} p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </div>

                      <span className="text-5xl font-black tracking-[-0.06em] text-slate-200">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="relative z-10 mb-3 text-2xl font-black leading-tight tracking-[-0.04em] text-slate-950 md:text-3xl">
                      {item.title}
                    </h3>

                    <p className="relative z-10 text-base leading-7 text-slate-600 md:text-lg">
                      {item.description}
                    </p>
                  </div>
                </motion.div>

                <div className="absolute left-6 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center md:left-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className={`h-4 w-4 rounded-full bg-gradient-to-br ${item.color} shadow-lg ring-8 ring-white`}
                    aria-hidden="true"
                  />
                </div>

                <div className="hidden w-[45%] md:block" />
              </article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link
            href="/Servicios"
            className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-10 py-5 text-lg font-black text-white shadow-xl shadow-slate-300/60 transition hover:-translate-y-0.5 hover:shadow-rose-200"
            aria-label="Empezar un trámite legal en NoPay"
          >
            Empezar mi trámite legal
            <ArrowRight className="h-5 w-5" />
          </Link>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-500">
            Servicios disponibles para usuarios en Ecuador. La revisión profesional depende del tipo
            de trámite, la documentación enviada y la complejidad del caso.
          </p>
        </motion.div>
      </div>
    </section>
  );
};