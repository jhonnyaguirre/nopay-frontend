'use client';

import type { LucideIcon } from "lucide-react";
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import {
  UserCheck,
  FileText,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Plane,
  Stamp,
  BadgeCheck,
  Clock3,
  ThumbsUp,
  BarChart3,
  AlertTriangle,
  HeartHandshake,
  Globe,
} from 'lucide-react';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import PermisoMenoresPhoneOverlay from 'app/resources/animaciones/PermisoSalida/page';

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


type AdvantageCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
};


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
//  MAIN PAGE (Permiso de Salida para Menores)
// ============================================================================
export default function PermisoSalidaMenoresPage() {
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
   <>
	<Head>
  <title>
    Permiso de Salida de Menores Ecuador | Minuta inmediata para notaría | NoPay
  </title>

  <meta
    name="description"
    content="Obtén online el permiso de salida del país para menores de edad en Ecuador. NoPay genera minutas legales válidas para notaría, con IA, validación de abogados y firma electrónica cuando corresponde."
  />

  <meta
    name="keywords"
    content="
    permiso salida menor Ecuador,
    permiso de salida del país menor de edad Ecuador,
    permiso salida menores notaría,
    minuta permiso salida menor Ecuador,
    autorización salida país menor Ecuador,
    permiso viaje menor Ecuador,
    permiso notarial salida menor,
    permiso salida menor con un solo padre,
    permiso salida menor padres separados,
    permiso salida menor padre ausente,
    permiso salida menor madre ausente,
    permiso salida menor al exterior Ecuador,
    autorización viaje menor al exterior Ecuador,
    permiso salida menor Cuenca,
    permiso salida menor Quito,
    permiso salida menor Guayaquil,
    abogados permiso salida menor Ecuador,
    NoPay permiso salida menor
    "
  />

  <link
    rel="canonical"
    href="https://nopaylegal.com/Servicios/PermisoSalida"
  />

  <meta
    property="og:title"
    content="Permiso de Salida de Menores en Ecuador | NoPay"
  />

  <meta
    property="og:description"
    content="Genera online minutas para permiso de salida del país de menores de edad en Ecuador. Proceso 24/7 con IA, abogados y firma electrónica cuando corresponde."
  />

  <meta
    property="og:url"
    content="https://nopaylegal.com/Servicios/PermisoSalida"
  />

  <meta property="og:type" content="website" />

  <meta
    property="og:image"
    content="https://nopaylegal.com/images/logo.png"
  />

  <meta name="twitter:card" content="summary_large_image" />

  <meta
    name="twitter:title"
    content="Permiso de Salida de Menores Ecuador | NoPay"
  />

  <meta
    name="twitter:description"
    content="Minutas legales para permiso de salida de menores en Ecuador. Proceso online 24/7 con NoPay."
  />

  <meta
    name="twitter:image"
    content="https://nopaylegal.com/images/logo.png"
  />

  <meta
    name="robots"
    content="index, follow, max-snippet:-1, max-image-preview:large"
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        name: 'Permiso de salida del país para menores de edad en Ecuador',
        provider: {
          '@type': 'Organization',
          name: 'NoPay',
          url: 'https://nopaylegal.com',
          logo: 'https://nopaylegal.com/images/logo.png',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Ecuador',
        },
        serviceType: [
          'Permiso de salida de menores',
          'Minuta notarial para salida del país',
          'Autorización de viaje para menor de edad',
          'Documento legal para notaría',
        ],
        description:
          'Servicio legal digital para generar o gestionar permisos de salida del país para menores de edad en Ecuador, incluyendo minutas notariales, validación profesional y firma electrónica cuando corresponde.',
        url: 'https://nopaylegal.com/Servicios/PermisoSalida',
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'USD',
        },
      }),
    }}
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Cómo obtener un permiso de salida del país para un menor en Ecuador?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Para obtener un permiso de salida del país para un menor de edad en Ecuador se debe contar con la autorización correspondiente de los representantes legales. NoPay permite iniciar el proceso online y generar una minuta legal para notaría cuando el caso cumple las condiciones.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Se puede generar una minuta para permiso de salida de menores online?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Sí. NoPay permite generar minutas legales para permiso de salida de menores de edad de forma online, con asistencia de IA y validación de abogados cuando corresponde.',
            },
          },
          {
            '@type': 'Question',
            name: '¿El permiso de salida de menores sirve para notaría?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'La minuta generada por NoPay está estructurada para ser presentada en notaría, siempre que el caso cumpla con las condiciones legales y documentales requeridas.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué pasa si uno de los padres no autoriza la salida del menor?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Cuando uno de los padres no autoriza, no puede ser ubicado o existe conflicto, el caso puede requerir una vía judicial o una revisión legal más profunda. NoPay ayuda a identificar la ruta correspondiente.',
            },
          },
          {
            '@type': 'Question',
            name: '¿NoPay puede entregar el documento inmediatamente?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'En casos compatibles con el flujo digital, NoPay puede generar la minuta inmediatamente después del pago. Algunos casos pueden requerir revisión profesional adicional en horas o días.',
            },
          },
        ],
      }),
    }}
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: 'https://nopaylegal.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Servicios',
            item: 'https://nopaylegal.com/Servicios',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Permiso de salida de menores',
            item: 'https://nopaylegal.com/Servicios/PermisoSalida',
          },
        ],
      }),
    }}
  />
</Head>
  
  
    <main className="min-h-screen bg-white text-white relative overflow-x-hidden font-sans antialiased text-[90%]">
      <Header />

      {/* Mobile overlay */}
      {isMobile && showOverlay && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#020617] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_36%,#020617_82%)] opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/35 to-[#020617]" />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <PermisoMenoresPhoneOverlay />
          </div>
        </div>
      )}

      {/* HERO */}
      <GradientBackground className={`${isMobile && showOverlay ? 'hidden' : ''}`}>
        <div className={`${DESIGN_TOKENS.spacing.container} pt-10 md:pt-14 lg:pt-10 pb-16 lg:pb-0`}>
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-center min-h-[620px] lg:min-h-[660px]">
            <div className="relative z-40 max-w-xl pb-4 lg:pb-10 -mt-6 lg:-mt-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-white/7 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                <span className="text-[10px] md:text-xs font-bold text-white/75 uppercase tracking-[0.24em]">
                  Permiso de salida inteligente
                </span>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="text-[2.35rem] sm:text-[3.1rem] lg:text-[4rem] font-[900] leading-[0.98] tracking-[-0.055em] mb-6"
              >
                Permiso de salida
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-200">
                  para menores
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.2 }}
                className="text-[15px] md:text-lg leading-relaxed text-slate-300 max-w-lg mb-8"
              >
                Valida tu caso, identifica si necesitas autorización notarial o judicial y avanza con
                un proceso claro, seguro y diseñado para evitar errores antes del viaje.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <CTAButton href="PermisoSalida/PermisoSalidaDiagnostico" variant="primary">
                  Generar permiso
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
                  { icon: <FileText className="h-4 w-4" />, text: 'Documento' },
                  { icon: <ShieldCheck className="h-4 w-4" />, text: 'Seguro' },
                  { icon: <Stamp className="h-4 w-4" />, text: 'Legal' },
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
                <PermisoMenoresPhoneOverlay />
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
            title="Tres pasos para preparar el permiso"
            description="Una experiencia clara para validar el caso del menor y preparar la documentación necesaria antes de viajar."
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
              title="Valida el caso"
              description="Indica si el menor viaja con un padre, con terceros o solo. Determinamos el tipo de autorización que necesitas."
              icon={<Plane className="h-7 w-7 text-rose-500" />}
              delay={0}
            />
            <FeatureCard
              step="02"
              title="Completa los datos"
              description="Registra información del menor, padres, acompañantes y destino. Todo encriptado y seguro."
              icon={<FileText className="h-7 w-7 text-amber-500" />}
              delay={0.1}
            />
            <FeatureCard
              step="03"
              title="Prepara el documento"
              description="Generamos una ruta clara con el formato legal correcto: autorización notarial o solicitud judicial."
              icon={<UserCheck className="h-7 w-7 text-[#7F1D1D]" />}
              delay={0.2}
            />
          </motion.div>
        </div>
      </section>

      {/* VENTAJAS DIFERENCIALES (full marketing elegante) */}
      <section className="relative z-0 py-16 bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className={DESIGN_TOKENS.spacing.container}>
          <SectionHeader
            badge="¿Por qué NoPay?"
            title="Tecnología al servicio de tu tranquilidad"
            description="Evita revisiones rechazadas o documentos incompletos. Te guiamos con precisión legal y respaldo digital."
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
              title="Diagnóstico en minutos"
              description="Responde un breve cuestionario y obtén al instante qué tipo de permiso necesitas."
              icon={<Clock3 className="h-6 w-6" />}
              delay={0}
            />
            <AdvantageCard
              title="Formato legal garantizado"
              description="Generamos el texto exacto que requiere la notaría o el juzgado según tu caso."
              icon={<FileText className="h-6 w-6" />}
              delay={0.1}
            />
            <AdvantageCard
              title="Sin errores comunes"
              description="Detectamos automáticamente inconsistencias en nombres, fechas o documentos adjuntos."
              icon={<ShieldCheck className="h-6 w-6" />}
              delay={0.2}
            />
            <AdvantageCard
              title="Actualización legal continua"
              description="Seguimos los cambios en normativas migratorias y de familia para mantener todo vigente."
              icon={<Globe className="h-6 w-6" />}
              delay={0.3}
            />
            <AdvantageCard
              title="Soporte con abogados"
              description="Si tu caso es complejo, accede a asesoría legal adicional desde el mismo panel."
              icon={<HeartHandshake className="h-6 w-6" />}
              delay={0.4}
            />
            <AdvantageCard
              title="Privacidad asegurada"
              description="Tus datos familiares están protegidos con cifrado de extremo a extremo."
              icon={<ShieldCheck className="h-6 w-6" />}
              delay={0.5}
            />
          </motion.div>
        </div>
      </section>

      {/* ESTADÍSTICAS Y CONFIABILIDAD */}
      <section className="relative z-0 py-16 bg-white">
        <div className={DESIGN_TOKENS.spacing.container}>
          <SectionHeader
            badge="Confianza respaldada"
            title="Números que nos avalan"
            description="Miles de familias ya han preparado sus permisos sin complicaciones."
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
              value="98%"
              label="documentos válidos"
              icon={<CheckCircle className="h-8 w-8 text-emerald-500" />}
              delay={0}
            />
            <StatCard
              value="+1.200"
              label="permisos generados"
              icon={<FileText className="h-8 w-8 text-rose-500" />}
              delay={0.1}
            />
            <StatCard
              value="24h"
              label="preparación promedio"
              icon={<Clock3 className="h-8 w-8 text-amber-500" />}
              delay={0.2}
            />
            <StatCard
              value="4.9★"
              label="satisfacción familiar"
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
              El 35% de los permisos notariales son observados por errores de forma
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
            ¿El menor necesita salir del país?
          </motion.h3>
          <motion.p
            className="text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed text-sm md:text-base"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            Realiza un diagnóstico inicial y conoce qué tipo de autorización corresponde según tu caso. Sin compromiso.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22, duration: 0.55 }}
          >
            <Link
              href="PermisoSalida/PermisoSalidaDiagnostico"
              className="group inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-black uppercase tracking-[0.12em] text-[#7F1D1D] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50"
            >
              Generar permiso ahora
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <p className="text-xs text-slate-500 mt-6">Sin registros complicados. Solo responde el diagnóstico.</p>
        </div>
      </section>

      <NoPayChatLauncher />
      <Footer />
    </main>
	
	 </>
	
  );
}