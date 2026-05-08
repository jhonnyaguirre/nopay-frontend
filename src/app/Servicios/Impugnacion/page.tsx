'use client';

import React from "react";
import { useState, useEffect } from 'react';
import type { LucideIcon } from "lucide-react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import {
  ShieldCheck,
  Zap,
  Gavel,
  ChevronRight,
  FileText,
  Sparkles,
  Clock3,
  Scale,
  ThumbsUp,
  BarChart3,
  BadgeCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import ImpugnacionPhoneOverlay from 'app/resources/animaciones/Impugnacion/page';

// ============================================================================
//  STANDARD DESIGN TOKENS
// ============================================================================
const DESIGN_TOKENS = {
  colors: {
    primary: '#D82465',
    secondary: '#F46C1D',
    dark: '#020617',
    white: '#ffffff',
    accent: {
      rose: '#e11d48',
      amber: '#f59e0b',
      emerald: '#10b981',
      slate: '#0f172a',
    },
  },
  spacing: {
    section: 'py-16 md:py-24',
    container: 'max-w-7xl mx-auto px-6',
  },
  typography: {
    heading: 'font-black tracking-[-0.04em]',
    subtitle: 'text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed',
    caption: 'text-[11px] font-black uppercase tracking-[0.22em]',
  },
  animation: {
    defaultTransition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================================================
//  ANIMATION VARIANTS
// ============================================================================
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: DESIGN_TOKENS.animation.defaultTransition,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

type SectionHeaderProps = {
  badge: string;
  title: string;
  description?: string;
  badgeIcon?: LucideIcon;
  align?: "left" | "center" | "right";
};


// ============================================================================
//  REUSABLE UI COMPONENTS
// ============================================================================
const SectionHeader = ({
  badge,
  title,
  description,
  badgeIcon: Icon = Sparkles,
  align = "center",
}: SectionHeaderProps) => (

  <motion.div
    className={`text-${align} mb-14`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={fadeUp}
  >
    <div className={`inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-rose-600 mb-5 ${align === 'center' ? 'mx-auto' : ''}`}>
      {Icon && <Icon className="h-4 w-4" />}
      {badge}
    </div>
    <h2 className={`text-3xl md:text-4xl ${DESIGN_TOKENS.typography.heading} text-slate-950`}>
      {title}
    </h2>
    {description && (
      <p className={`mt-4 ${DESIGN_TOKENS.typography.subtitle} ${align === 'center' ? 'mx-auto' : ''}`}>{description}</p>
    )}
  </motion.div>
);

type FeatureCardProps = {
  step: string | number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
};


type AdvantageCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
};

type StatCardProps = {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
};

type GradientBackgroundProps = {
  children: React.ReactNode;
  className?: string;
};

type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};



const FeatureCard = ({
  step,
  title,
  description,
  icon,
  delay = 0,
}: FeatureCardProps) => (
  <motion.div
    variants={fadeUp}
    transition={{ delay }}
    className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
  >
    <div className="flex items-center justify-between mb-6">
      <span className="text-xs font-black tracking-[0.24em] text-slate-400">{step}</span>
      <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-black text-slate-950 mb-3">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </motion.div>
);

const AdvantageCard = ({
  title,
  description,
  icon,
  delay = 0,
}: AdvantageCardProps) => (
  <motion.div
    variants={fadeUp}
    transition={{ delay }}
    className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl group"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-black text-slate-950 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const StatCard = ({
  value,
  label,
  icon,
  delay = 0,
}: StatCardProps) => (

  <motion.div
    variants={fadeUp}
    transition={{ delay }}
    className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100"
  >
    <div className="flex justify-center mb-3">{icon}</div>
    <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{value}</div>
    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div>
  </motion.div>
);

const GradientBackground = ({
  children,
  className = "",
}: GradientBackgroundProps) => (

  <div className={`relative bg-[#020617] overflow-hidden ${className}`}>
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_34%,#020617_82%)] opacity-[0.68]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/5 via-[#020617]/45 to-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.16)_0%,transparent_38%)]" />
    </div>
    <div className="relative z-30">{children}</div>
  </div>
);

const CTAButton = ({
  href,
  children,
  variant = "primary",
}: CTAButtonProps) => {
  const baseClasses = "group inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-black uppercase tracking-[0.11em] shadow-xl transition-all duration-300 hover:-translate-y-0.5";
  if (variant === 'primary') {
    return (
      <Link href={href} className={`${baseClasses} bg-white text-[#7F1D1D] hover:bg-amber-50`}>
        {children}
        <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>
    );
  }
  return (
    <Link href={href} className={`${baseClasses} border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/85 hover:bg-white/[0.10]`}>
      {children}
    </Link>
  );
};

// ============================================================================
//  MAIN PAGE
// ============================================================================
export default function ImpugnacionIntroPage() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => setShowOverlay(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  return (
    <main className="min-h-screen bg-white text-white relative overflow-x-hidden font-sans antialiased">
      <Header />

      {/* Mobile overlay */}
      {isMobile && showOverlay && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#020617] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_36%,#020617_82%)] opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/35 to-[#020617]" />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <ImpugnacionPhoneOverlay />
          </div>
        </div>
      )}

      {/* HERO */}
      <GradientBackground className={`${isMobile && showOverlay ? 'hidden' : ''}`}>
        <div className={`${DESIGN_TOKENS.spacing.container} pt-28 md:pt-32 lg:pt-28 pb-28 lg:pb-10`}>
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-center min-h-[760px] lg:min-h-[790px]">
            <div className="relative z-40 max-w-xl pb-8 lg:pb-28">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-white/7 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                <span className="text-[10px] md:text-xs font-bold text-white/75 uppercase tracking-[0.24em]">
                  Impugnación inteligente
                </span>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="text-[2.35rem] sm:text-[3.1rem] lg:text-[4rem] font-[900] leading-[0.98] tracking-[-0.055em] mb-6"
              >
                Impugna tu multa
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-200">
                  sin complicarte
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.2 }}
                className="text-[15px] md:text-lg leading-relaxed text-slate-300 max-w-lg mb-8"
              >
                NoPay te guía paso a paso para revisar tu citación, detectar posibles errores y
                preparar una defensa más clara, rápida y ordenada.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <CTAButton href="/register-form" variant="primary">
                  Impugnar ahora
                </CTAButton>
                <CTAButton href="#como-funciona" variant="secondary">
                  Cómo funciona
                </CTAButton>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.42 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                {[
                  { icon: <Clock3 className="h-4 w-4" />, text: 'Rápido' },
                  { icon: <ShieldCheck className="h-4 w-4" />, text: 'Seguro' },
                  { icon: <Scale className="h-4 w-4" />, text: 'Legal' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/65 backdrop-blur-xl"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="relative z-[80] hidden md:flex justify-center lg:justify-end items-start min-h-[720px] lg:min-h-[760px] overflow-visible">
              <div className="absolute right-8 top-24 w-[390px] h-[390px] rounded-full bg-white/10 blur-3xl opacity-40" />
              <div className="relative z-[90] w-full flex justify-center lg:justify-end overflow-visible">
                <ImpugnacionPhoneOverlay />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-1px] left-0 w-full z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[90px] md:h-[145px]" fill="white">
            <path d="M0,38 C260,100 420,18 635,68 C835,116 975,54 1200,82 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </GradientBackground>

      {/* CÓMO FUNCIONA (3 pasos) */}
      <section id="como-funciona" className="relative z-0 pt-16 pb-20 bg-white text-slate-900">
        <div className={DESIGN_TOKENS.spacing.container}>
          <SectionHeader
            badge="Proceso guiado"
            title="Tres pasos para iniciar tu defensa"
            description="Una experiencia simple, clara y diseñada para que avances sin perder tiempo."
            badgeIcon={Sparkles}
          />

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <FeatureCard
              step="01"
              title="Sube tu multa"
              description="Carga una foto o documento de tu citación. Nuestro sistema la analiza automáticamente."
              icon={<FileText className="h-7 w-7 text-rose-500" />}
              delay={0}
            />
            <FeatureCard
              step="02"
              title="Analizamos tu caso"
              description="Revisamos datos, fechas y posibles inconsistencias. Detectamos errores comunes que invalidan la multa."
              icon={<Zap className="h-7 w-7 text-amber-500" />}
              delay={0.1}
            />
            <FeatureCard
              step="03"
              title="Preparamos tu ruta"
              description="Te entregamos un informe claro y los pasos a seguir para impugnar con fundamentos sólidos."
              icon={<Gavel className="h-7 w-7 text-[#7F1D1D]" />}
              delay={0.2}
            />
          </motion.div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: VENTAJAS DIFERENCIALES (marketing elegante) */}
      <section className="relative z-0 py-16 bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className={DESIGN_TOKENS.spacing.container}>
          <SectionHeader
            badge="¿Por qué NoPay?"
            title="Impugnar con tecnología y respaldo legal"
            description="No dejamos tu caso al azar. Combinamos inteligencia artificial con experiencia jurídica para maximizar tus posibilidades."
            badgeIcon={BadgeCheck}
          />

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <AdvantageCard
              title="Sin costo si no avanzas"
              description="Pagas solo cuando el análisis determina que tu caso tiene méritos. Si no es viable, no pagas nada."
              icon={<ShieldCheck className="h-6 w-6" />}
              delay={0}
            />
            <AdvantageCard
              title="Análisis en 24 horas"
              description="Sube tu multa hoy y recibe el diagnóstico al siguiente día hábil. Sin filas ni esperas."
              icon={<Clock3 className="h-6 w-6" />}
              delay={0.1}
            />
            <AdvantageCard
              title="Reporte ejecutable"
              description="No solo te decimos si hay errores, te damos el texto listo para tu impugnación y los plazos clave."
              icon={<FileText className="h-6 w-6" />}
              delay={0.2}
            />
            <AdvantageCard
              title="Datos en tiempo real"
              description="Acceso a jurisprudencia actualizada y criterios de tribunales para respaldar tu defensa."
              icon={<BarChart3 className="h-6 w-6" />}
              delay={0.3}
            />
            <AdvantageCard
              title="Confidencialidad total"
              description="Tus documentos y datos están protegidos bajo estándares de seguridad de nivel bancario."
              icon={<ShieldCheck className="h-6 w-6" />}
              delay={0.4}
            />
            <AdvantageCard
              title="Soporte humano"
              description="Detrás del algoritmo hay un equipo legal que revisa cada caso. Chat y correo directo."
              icon={<ThumbsUp className="h-6 w-6" />}
              delay={0.5}
            />
          </motion.div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: ESTADÍSTICAS Y RESULTADOS (prueba social) */}
      <section className="relative z-0 py-16 bg-white">
        <div className={DESIGN_TOKENS.spacing.container}>
          <SectionHeader
            badge="Resultados que hablan"
            title="Datos reales de nuestros usuarios"
            description="Miles de conductores ya han identificado oportunidades para impugnar con NoPay."
            badgeIcon={BarChart3}
          />

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <StatCard
              value="92%"
              label="de multas revisadas"
              icon={<CheckCircle2 className="h-8 w-8 text-emerald-500" />}
              delay={0}
            />
            <StatCard
              value="+2.300"
              label="casos analizados"
              icon={<BarChart3 className="h-8 w-8 text-rose-500" />}
              delay={0.1}
            />
            <StatCard
              value="48h"
              label="tiempo promedio de respuesta"
              icon={<Clock3 className="h-8 w-8 text-amber-500" />}
              delay={0.2}
            />
            <StatCard
              value="4.8★"
              label="satisfacción del usuario"
              icon={<ThumbsUp className="h-8 w-8 text-slate-500" />}
              delay={0.3}
            />
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-100 px-4 py-2 text-xs font-bold text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              El 68% de las multas contienen al menos un error de forma o fondo
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL (reforzado) */}
      <section className="relative py-20 bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,36,101,0.34),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.18),transparent_34%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.h3
            className="text-2xl md:text-4xl font-black tracking-[-0.04em] mb-5 text-white"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            ¿Tu multa tiene errores?
          </motion.h3>
          <motion.p
            className="text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed text-sm md:text-base"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            Descúbrelo en minutos. Sube tu citación y recibe un análisis preliminar sin compromiso.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22, duration: 0.55 }}
          >
            <Link
              href="/register-form"
              className="group inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-black uppercase tracking-[0.12em] text-[#7F1D1D] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50"
            >
              Comenzar ahora
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <p className="text-xs text-slate-500 mt-6">Sin registros largos. Solo sube tu multa.</p>
        </div>
      </section>

      <NoPayChatLauncher />
      <Footer />
    </main>
  );
}