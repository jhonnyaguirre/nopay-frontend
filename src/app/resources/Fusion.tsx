'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock3,
  Scale,
  Car,
  Landmark,
  UserCheck,
  Building2,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import NoPayBackground from 'components/NoPayBackground';

const SITE_URL = 'https://nopaylegal.com';

export default function EliteLegalFooterFusion() {
  const benefits = [
    {
      icon: Clock3,
      title: 'Inicio rápido',
      text: 'Empieza tu trámite legal online en minutos, desde el celular y sin filas.',
    },
    {
      icon: ShieldCheck,
      title: 'Proceso seguro',
      text: 'Tus datos y documentos se gestionan con orden, privacidad y trazabilidad.',
    },
    {
      icon: Scale,
      title: 'LegalTech + abogados',
      text: 'Tecnología para organizar tu caso y respaldo profesional cuando corresponde.',
    },
  ];

  const services = [
    {
      icon: Car,
      title: 'Impugnar multa',
      href: '/Servicios/Impugnacion',
      aria: 'Iniciar impugnación de multa de tránsito en Ecuador',
    },
    {
      icon: Landmark,
      title: 'Registrar marca',
      href: '/Servicios/Marcas',
      aria: 'Iniciar registro de marca en Ecuador',
    },
    {
      icon: UserCheck,
      title: 'Permiso de salida',
      href: '/Servicios/PermisoSalida',
      aria: 'Evaluar permiso de salida de menor en Ecuador',
    },
    {
      icon: Building2,
      title: 'Crear SAS',
      href: '/Novedades',
      aria: 'Recibir novedades sobre constitución de SAS en Ecuador',
    },
  ];

  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿NoPay atiende trámites legales en todo Ecuador?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'NoPay permite iniciar servicios legales digitales para usuarios en Ecuador, incluyendo ciudades como Quito, Guayaquil, Cuenca y otras localidades, según el tipo de trámite.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué trámites legales puedo iniciar en NoPay?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Puedes iniciar procesos como impugnación de multas de tránsito, registro de marcas, permiso de salida de menores y otros servicios legales digitales disponibles en la plataforma.',
          },
        },
        {
          '@type': 'Question',
          name: '¿NoPay reemplaza a un abogado?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'NoPay combina tecnología con acompañamiento profesional. La plataforma ayuda a organizar información, guiar el proceso y canalizar la revisión legal cuando el servicio lo requiere.',
          },
        },
      ],
    }),
    []
  );

  return (
    <section
      id="asesoria-legal-online-ecuador"
      aria-labelledby="fusion-nopay-title"
      className="relative w-full bg-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 150px)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 150px)',
        }}
      >
        <div className="absolute inset-0 opacity-40">
          <NoPayBackground />
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#f8fafc]">
        <div className="absolute left-0 top-0 z-20 w-full leading-none" aria-hidden="true">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block h-[60px] w-full md:h-[100px]"
          >
            <path
              d="M0,0 C300,120 400,-20 600,60 C800,140 900,20 1200,80 L1200,0 L0,0 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_40%,#f8fafc_85%)] opacity-[0.16]" />
          <div className="absolute inset-0 h-40 bg-gradient-to-b from-white via-transparent to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L60 30 L80 30 L70 50 L80 70 L60 70 L50 90 L40 70 L20 70 L30 50 L20 30 L40 30 Z' fill='%23000000'/%3E%3C/svg%3E")`,
              backgroundSize: '80px',
            }}
          />
        </div>

        <div className="relative z-30 mx-auto flex max-w-7xl flex-col items-center px-6 pb-16 pt-28 md:pb-24 md:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-600 md:text-xs">
              Asesoría legal online en Ecuador
            </span>
          </motion.div>

          <motion.h2
            id="fusion-nopay-title"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mb-6 text-center text-4xl font-[950] leading-[0.95] tracking-[-0.06em] text-slate-950 md:text-[5rem]"
          >
            Resuelve lo legal.
            <br />
            <span className="bg-gradient-to-r from-[#F46C1D] via-[#D82465] to-purple-600 bg-clip-text text-transparent">
              Sin perder tiempo.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 max-w-3xl text-center text-base leading-relaxed text-slate-500 md:text-xl"
          >
            NoPay te ayuda a iniciar trámites legales digitales en Ecuador con una experiencia clara,
            rápida y guiada: multas de tránsito, marcas, permisos de salida de menores, SAS y otros
            servicios legales.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.13 }}
            className="mb-10 flex flex-wrap justify-center gap-3"
          >
            {['Quito', 'Guayaquil', 'Cuenca', 'Ecuador'].map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm"
              >
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                {city}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mb-10 w-full max-w-2xl"
          >
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-2 shadow-xl shadow-slate-200/50 backdrop-blur-3xl transition-all hover:border-rose-200 md:flex-row md:rounded-full">
              <div className="flex w-full flex-1 items-center px-4">
                <CheckCircle2 className="mr-2 h-5 w-5 text-rose-500" />
                <span className="w-full py-3 text-sm font-bold text-slate-600 md:text-base">
                  Empieza con una evaluación digital de tu caso
                </span>
              </div>

              <Link
                href="/Servicios"
                aria-label="Iniciar trámite legal online en NoPay"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-8 py-3 font-black text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-rose-600 active:scale-95 md:w-auto md:rounded-full"
              >
                Resolver mi caso <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <div className="mb-8 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index }}
                  className="rounded-[2rem] border border-slate-100 bg-white/70 p-5 text-center shadow-sm backdrop-blur-xl"
                >
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-base font-black text-slate-950">{item.title}</h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.text}</p>
                </motion.article>
              );
            })}
          </div>

          <nav
            aria-label="Servicios legales principales de NoPay"
            className="flex flex-wrap justify-center gap-3"
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.title}
                  href={service.href}
                  aria-label={service.aria}
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition-all hover:border-rose-200 hover:text-[#D82465]"
                >
                  <Icon className="h-4 w-4" />
                  {service.title}
                </Link>
              );
            })}
          </nav>

          <p className="mt-8 max-w-3xl text-center text-xs leading-6 text-slate-500 md:text-sm">
            La disponibilidad, precio y tiempos pueden variar según el servicio, la documentación
            enviada y la complejidad del caso. NoPay no promete resultados judiciales o
            administrativos; facilita una ruta digital ordenada y profesional.
          </p>
        </div>
      </div>
    </section>
  );
}