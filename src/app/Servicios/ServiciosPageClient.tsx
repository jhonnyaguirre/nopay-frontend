'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Car,
  Landmark,
  UserCheck,
  Sparkles,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Scale,
  ArrowRight,
  Bot,
  CheckCircle2,
  FileCheck2,
  UsersRound,
  LockKeyhole,
  WandSparkles,
} from 'lucide-react';

import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';

import {
  valorImpugnacionGl,
  valorRegistroMarcaPhase1,
  valorPermisoSalida,
} from 'config/apiConfig';

interface Service {
  title: string;
  description: string;
  href: string;
  gradient: string;
  soft: string;
  price: string | number;
  icon: React.ReactElement;
  label: string;
}

interface StepItem {
  icon: React.ReactElement;
  title: string;
  text: string;
}

const services: Service[] = [
  {
    title: 'Impugnación de multas',
    label: 'Tránsito',
    description:
      'Impugna tu multa de tránsito con un proceso claro, rápido y guiado por NoPay.',
    href: '/Servicios/Impugnacion',
    gradient: 'from-rose-600 via-fuchsia-600 to-amber-500',
    soft: 'bg-rose-50 text-rose-600',
    price: valorImpugnacionGl,
    icon: <Car className="h-5 w-5" />,
  },
  {
    title: 'Registro de marcas',
    label: 'Negocios',
    description:
      'Protege y registra tu marca con una experiencia legal simple, segura y profesional.',
    href: '/Servicios/Marcas',
    gradient: 'from-lime-400 via-rose-500 to-violet-600',
    soft: 'bg-fuchsia-50 text-fuchsia-600',
    price: valorRegistroMarcaPhase1,
    icon: <Landmark className="h-5 w-5" />,
  },
  {
    title: 'Permiso de salida',
    label: 'Familia',
    description:
      'Gestiona permisos de salida del país para menores con claridad, orden y respaldo.',
    href: '/Servicios/PermisoSalida',
    gradient: 'from-violet-600 via-fuchsia-600 to-rose-500',
    soft: 'bg-violet-50 text-violet-600',
    price: valorPermisoSalida,
    icon: <UserCheck className="h-5 w-5" />,
  },
];

const steps: StepItem[] = [
  {
    icon: <FileCheck2 className="h-5 w-5" />,
    title: 'Subes tu caso',
    text: 'Completa la información clave y adjunta tus documentos desde una experiencia guiada.',
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: 'NoPay ordena y analiza',
    text: 'La IA estructura datos, identifica escenarios y reduce la complejidad operativa.',
  },
  {
    icon: <UsersRound className="h-5 w-5" />,
    title: 'Expertos revisan',
    text: 'Profesionales legales acompañan los puntos importantes del proceso.',
  },
];

const trustItems = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'IA + humanos',
    text: 'Automatización con respaldo profesional.',
  },
  {
    icon: <LockKeyhole className="h-5 w-5" />,
    title: 'Privacidad',
    text: 'Datos tratados con enfoque seguro.',
  },
  {
    icon: <Clock3 className="h-5 w-5" />,
    title: 'Menos fricción',
    text: 'Procesos más claros y rápidos.',
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: 'Enfoque legal',
    text: 'Soluciones pensadas para trámites reales.',
  },
];

const upcoming = ['Laborales', 'Migratorios', 'Familia', 'Tránsito'];

const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

type ServiceCardProps = {
  service: Service;
  index: number;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={service.href} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.055)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.10)]">
          <div
            className={`absolute -right-24 -top-24 h-52 w-52 rounded-full bg-gradient-to-br ${service.gradient} opacity-[0.07] blur-3xl transition-opacity duration-300 group-hover:opacity-[0.14]`}
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.soft}`}
              >
                {service.icon}
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${service.soft}`}
              >
                {service.label}
              </span>
            </div>

            <h3 className="mb-3 text-2xl font-black leading-[0.95] tracking-[-0.045em] text-slate-950">
              {service.title}
            </h3>

            <p className="mb-8 text-sm leading-relaxed text-slate-500 md:text-[15px]">
              {service.description}
            </p>

            <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">
                  Desde
                </p>
                <p className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                  ${service.price}
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm font-black text-slate-500 transition-colors group-hover:text-rose-600">
                Iniciar
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function ServiciosPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');

        * {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1,
        h2,
        h3,
        .font-black,
        .font-bold {
          text-rendering: geometricPrecision;
        }
      `}</style>

      <main className="relative min-h-screen w-full overflow-hidden bg-white font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] antialiased selection:bg-rose-500 selection:text-white">
        <Header />

        <section className="relative min-h-[82svh] w-full overflow-hidden bg-[#020617]">
          <div className="absolute inset-0">
            <Image
              src="/images/servicios.png"
              alt="NoPay LegalTech con inteligencia artificial y expertos legales"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[68%_center] md:object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/72 to-[#020617]/22" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-transparent to-white" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(216,36,101,0.22),transparent_32%),radial-gradient(circle_at_42%_76%,rgba(245,158,11,0.14),transparent_34%),radial-gradient(circle_at_6%_66%,rgba(127,29,29,0.22),transparent_34%)]" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[82svh] max-w-7xl items-center px-5 pb-28 pt-32 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={mounted ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[720px]"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
              >
                <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 md:text-xs">
                  LegalTech impulsada por IA
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.18 }}
                className="text-[3.25rem] font-black leading-[0.9] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl lg:text-[5.7rem]"
              >
                Tus trámites legales,
                <span className="block bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#EAB308] bg-clip-text text-transparent drop-shadow-[0_8px_24px_rgba(234,179,8,0.2)]">
                  en manos de NoPay.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.28 }}
                className="mt-8 max-w-xl text-base font-light leading-relaxed text-slate-300 sm:text-lg md:text-xl"
              >
                Delegas el proceso. Nuestra inteligencia artificial organiza el caso y
                expertos legales humanos acompañan la revisión para que avances con más
                claridad, seguridad y tranquilidad.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.38 }}
                className="mt-10 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="#servicios"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-[0_24px_70px_rgba(255,255,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]"
                >
                  Delegar mi trámite
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Ver cómo funciona
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="mt-10 flex flex-wrap gap-2"
              >
                {['IA aplicada al caso', 'Revisión humana', 'Proceso seguro', 'Menos estrés legal'].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 backdrop-blur-xl"
                    >
                      {item}
                    </span>
                  )
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8">
          <motion.section
            id="como-funciona"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-rose-600">
                IA + expertos legales
              </p>
              <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-5xl">
                No solo te guiamos.
                <span className="block bg-gradient-to-r from-lime-400 via-rose-500 to-violet-600 bg-clip-text text-transparent">
                  Nos encargamos contigo.
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500">
                La plataforma reduce el trabajo pesado, ordena el caso y conecta
                el proceso con intervención humana cuando corresponde.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.055)]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      {step.icon}
                    </div>
                    <span className="text-xs font-black text-slate-300">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-black tracking-[-0.035em] text-slate-950">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="servicios"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="mx-auto mt-24 max-w-6xl"
          >
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-rose-600">
                  Servicios disponibles
                </p>
                <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-5xl">
                  Delega el trámite que
                  <span className="block bg-gradient-to-r from-rose-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent">
                    necesitas resolver.
                  </span>
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                Empezamos con servicios de alta demanda donde la tecnología puede
                ahorrar tiempo, ordenar evidencia y reducir confusión.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {services.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="mx-auto mt-24 max-w-6xl"
          >
            <div className="relative overflow-hidden rounded-[2.4rem] bg-[#020617] px-7 py-10 shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-10 lg:px-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,36,101,0.34),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.24),transparent_34%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.45),rgba(2,6,23,0.96))]" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5">
                    <WandSparkles className="h-4 w-4 text-amber-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">
                      Nueva experiencia legal
                    </span>
                  </div>

                  <h2 className="max-w-3xl text-3xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                    La inteligencia artificial llegó a los servicios legales.
                  </h2>

                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68">
                    NoPay no reemplaza abogados: potencia el trabajo legal con
                    automatización, análisis y una experiencia digital mucho más clara
                    para el usuario.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="rounded-[1.5rem] bg-white p-5">
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                      Modelo NoPay
                    </p>

                    <div className="space-y-3">
                      {[
                        'IA para reducir complejidad',
                        'Expertos legales para dar respaldo',
                        'Plataforma para delegar el proceso',
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600"
                        >
                          <CheckCircle2 className="h-4 w-4 text-rose-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="mx-auto mt-24 max-w-6xl"
          >
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.055)] sm:p-8">
              <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-600">
                      Próximamente
                    </span>
                  </div>

                  <h2 className="text-3xl font-black tracking-[-0.045em] text-slate-950">
                    Nuevas soluciones legales en camino.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                    NoPay crecerá por etapas, priorizando servicios donde podamos
                    combinar tecnología, eficiencia y respaldo humano.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {upcoming.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4 text-sm font-black text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="mx-auto mt-24 max-w-4xl text-center"
          >
            <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/80 bg-white px-7 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.055)]">
              <div className="absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-amber-400 opacity-[0.10] blur-3xl" />

              <BadgeCheck className="relative z-10 mx-auto mb-5 h-8 w-8 text-rose-600" />

              <h2 className="relative z-10 text-3xl font-black leading-[0.98] tracking-[-0.05em] text-slate-950 sm:text-4xl">
                Deja que NoPay se encargue del proceso.
              </h2>

              <p className="relative z-10 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
                Impulsado por IA. Respaldado por expertos legales. Diseñado para
                personas que quieren resolver, no perderse en trámites.
              </p>

              <div className="relative z-10 mt-7">
                <Link
                  href="#servicios"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] px-8 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(236,72,153,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_65px_rgba(236,72,153,0.36)]"
                >
                  Elegir un servicio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.section>
        </section>

        <NoPayChatLauncher />
      </main>

      <Footer />
    </>
  );
}