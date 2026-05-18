'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import { API_BASE_URL, valorRegistroMarcaPhase1, valorRegistroMarcaPhase2 } from "config/apiConfig";
import {
  Landmark,
  ScrollText,
  FileText,
  CheckCircle,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  SearchCheck,
  TrendingUp,
  CreditCard,
  Lock,
} from 'lucide-react';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import RegistroMarcasOverlay from 'app/resources/animaciones/Marcas/page';

export default function RegistroMarcasPage() {
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

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
  
	<>
  <Head>
    <title>
      Registrar Marca en Ecuador | SENADI, nombre comercial y logo | NoPay
    </title>

    <meta
      name="description"
      content="Registra tu marca en Ecuador con NoPay. Protege tu nombre comercial, logotipo, eslogan o identidad de negocio ante SENADI. Proceso legal online con IA y revisión de expertos."
    />

    <meta
      name="keywords"
      content="
      registrar marca Ecuador,
      registro de marca Ecuador,
      registrar marca SENADI,
      registrar logo Ecuador,
      registrar nombre comercial Ecuador,
      proteger marca Ecuador,
      propiedad intelectual Ecuador,
      registro de marca online Ecuador,
      registrar eslogan Ecuador,
      búsqueda fonética marca Ecuador,
      clases Niza Ecuador,
      oposición de marca Ecuador,
      abogados marcas Ecuador,
      NoPay registro de marca
      "
    />

    <link rel="canonical" href="https://nopaylegal.com/Servicios/Marcas" />

    <meta property="og:title" content="Registrar Marca en Ecuador | NoPay" />
    <meta
      property="og:description"
      content="Protege tu nombre comercial, logo o eslogan en Ecuador. Registro de marca online con NoPay, IA y expertos legales."
    />
    <meta property="og:url" content="https://nopaylegal.com/Servicios/Marcas" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://nopaylegal.com/images/logo.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Registrar Marca en Ecuador | NoPay" />
    <meta
      name="twitter:description"
      content="Inicia el registro de tu marca en Ecuador con NoPay: nombre comercial, logo, eslogan y protección de identidad."
    />
    <meta name="twitter:image" content="https://nopaylegal.com/images/logo.png" />

    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LegalService',
          name: 'Registro de Marcas en Ecuador',
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
            'Registro de marca',
            'Protección de nombre comercial',
            'Registro de logotipo',
            'Registro de eslogan',
            'Propiedad intelectual',
          ],
          description:
            'Servicio legal digital para iniciar el registro de marcas en Ecuador, incluyendo nombre comercial, logotipo, eslogan, búsqueda previa y acompañamiento profesional.',
          url: 'https://nopaylegal.com/Servicios/Marcas',
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
              name: '¿Cómo registrar una marca en Ecuador?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Para registrar una marca en Ecuador se debe identificar la marca, revisar su viabilidad, clasificarla según el tipo de producto o servicio y presentar la solicitud ante la autoridad competente. NoPay permite iniciar este proceso online con orientación legal y revisión profesional.',
              },
            },
            {
              '@type': 'Question',
              name: '¿Dónde se registra una marca en Ecuador?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'En Ecuador, el registro de marcas se gestiona ante la autoridad nacional de propiedad intelectual. NoPay ayuda a preparar la información inicial y guiar el proceso de registro de forma digital.',
              },
            },
            {
              '@type': 'Question',
              name: '¿Puedo registrar un logo o nombre comercial?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Sí. Una marca puede proteger elementos como nombre comercial, logotipo, signo distintivo, eslogan o identidad de negocio, según el caso y la clasificación aplicable.',
              },
            },
            {
              '@type': 'Question',
              name: '¿Qué pasa si otra persona ya usa una marca parecida?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Si existe una marca igual o similar, puede haber riesgo de rechazo u oposición. Por eso es recomendable realizar una revisión previa antes de presentar la solicitud.',
              },
            },
            {
              '@type': 'Question',
              name: '¿NoPay garantiza que la marca será aprobada?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'NoPay no garantiza aprobaciones administrativas. La plataforma ayuda a iniciar el proceso de forma ordenada, revisar información relevante y acompañar el trámite con criterio profesional.',
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
              name: 'Registro de Marcas',
              item: 'https://nopaylegal.com/Servicios/Marcas',
            },
          ],
        }),
      }}
    />
  </Head>

   
    
  
    <main className="min-h-screen bg-white text-white relative overflow-x-hidden font-sans antialiased text-[90%]">
      <Header />

      {/* OVERLAY MOBILE */}
      {isMobile && showOverlay && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#020617] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_36%,#020617_82%)] opacity-75" />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <RegistroMarcasOverlay />
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section
        className={`relative z-30 bg-[#020617] overflow-visible ${
          isMobile && showOverlay ? 'hidden' : ''
        }`}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_34%,#020617_82%)] opacity-[0.68]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/5 via-[#020617]/45 to-[#020617]" />
        </div>

        <div className="relative z-30 max-w-7xl mx-auto px-6 pt-20 md:pt-24 lg:pt-20 pb-20 lg:pb-5">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-center min-h-[600px] lg:min-h-[650px]">
            <div className="relative z-40 max-w-xl py-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-white/7 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                <span className="text-[10px] md:text-xs font-bold text-white/75 uppercase tracking-[0.24em]">
                  Protección de propiedad intelectual
                </span>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="text-[2.35rem] sm:text-[3.1rem] lg:text-[4rem] font-[900] leading-[0.98] tracking-[-0.055em] mb-6"
              >
                Registra tu marca
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-200">
                  sin trámites engorrosos
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.2 }}
                className="text-[15px] md:text-lg leading-relaxed text-slate-300 max-w-lg mb-8"
              >
                Protege tu nombre comercial, logotipo o eslogan con un proceso guiado,
                claro y profesional para iniciar tu registro de marca en Ecuador.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  href="/Servicios/Marcas/RegistroMarca"
                  className="group inline-flex items-center justify-center rounded-2xl bg-white text-[#7F1D1D] px-6 py-3.5 text-sm font-black uppercase tracking-[0.11em] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50"
                >
                  Registrar marca
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="#como-funciona"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl px-6 py-3.5 text-sm font-bold text-white/85 transition-all duration-300 hover:bg-white/[0.10]"
                >
                  Cómo funciona
                </Link>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.42 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                {[
                  { icon: <ShieldCheck className="h-4 w-4" />, text: 'Protegida' },
                  { icon: <SearchCheck className="h-4 w-4" />, text: 'Validada' },
                  { icon: <Landmark className="h-4 w-4" />, text: 'Legal' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/65 backdrop-blur-xl">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="relative z-[80] hidden md:flex justify-center lg:justify-end items-center min-h-[500px] overflow-visible">
              <div className="absolute right-8 top-10 w-[390px] h-[390px] rounded-full bg-white/10 blur-3xl opacity-40" />
              <div className="relative z-[90] w-full flex justify-center lg:justify-end overflow-visible">
                <RegistroMarcasOverlay />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-1px] left-0 w-full z-20 pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[70px] md:h-[120px]"
            fill="white"
          >
            <path d="M0,38 C260,100 420,18 635,68 C835,116 975,54 1200,82 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* NUEVA SECCIÓN: MODELO DE PAGO POR FASE APROBADA */}
       {/* NUEVA SECCIÓN: MODELO DE PAGO POR FASE APROBADA (solo dos fases) */}
<section className="relative z-10 bg-white py-16 md:py-24">
  <div className="max-w-7xl mx-auto px-6">
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700 mb-5">
        <Lock className="h-4 w-4" />
        Pago por éxito
      </div>
      <h2 className="text-3xl md:text-4xl font-black tracking-[-0.04em] text-slate-950">
        Sin riesgos. <span className="text-emerald-600">Pagas solo por fase aprobada</span>
      </h2>
      <p className="mt-4 text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
        En NoPay no arriesgas tu dinero en todo el proceso. Avanzamos por fases y solo
        cobramos cuando cada etapa es viable y tú das el visto bueno.
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Fase 1: Análisis de viabilidad (gratis hasta validación) */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.55 }}
        className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-black tracking-[0.24em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Fase 1
          </span>
          <SearchCheck className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-black text-slate-950 mb-2">Análisis de viabilidad</h3>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Realizamos búsqueda fonética y examen de antecedentes en el SENADI para determinar
          si tu marca es registrable.
        </p>
        <div className="border-t border-slate-100 pt-4 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Costo en esta fase:</span>
            <span className="text-sm font-black text-emerald-600">${valorRegistroMarcaPhase1} hasta validación</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>Solo cobramos si es viable</span>
          </div>
        </div>
      </motion.div>

      {/* Fase 2: Preparación, solicitud, seguimiento y concesión (fusionada) */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.55 }}
        className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-black tracking-[0.24em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Fase 2
          </span>
          <TrendingUp className="h-8 w-8 text-indigo-500" />
        </div>
        <h3 className="text-xl font-black text-slate-950 mb-2">Registro completo de tu marca</h3>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Preparamos y presentamos la solicitud ante el SENADI, monitoreamos la publicación,
          respondemos observaciones y gestionamos el certificado de registro.
        </p>
        <div className="border-t border-slate-100 pt-4 mt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Preparación y solicitud:</span>
              <span className="text-sm font-black text-slate-900">${valorRegistroMarcaPhase2}</span>
            </div>
             
            <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200 mt-1">
              <span className="text-xs font-bold text-slate-600">Total (pagadero en dos hitos):</span>
              <span className="text-base font-black text-slate-950"> ${Number(valorRegistroMarcaPhase1) + Number(valorRegistroMarcaPhase2)} + IVA</span>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <CheckCircle className="h-3.5 w-3.5 text-indigo-500" />
            <span>Se cobra solo después de aprobar la Fase 1</span>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Badge de confianza adicional */}
    <motion.div
      className="mt-12 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.55 }}
    >
      <div className="inline-flex items-center gap-3 rounded-full bg-slate-50 border border-slate-200 px-5 py-2.5 shadow-sm">
        <CreditCard className="h-5 w-5 text-emerald-600" />
        <span className="text-xs font-bold text-slate-700">
          Sin letra chica: <span className="text-emerald-700">pagos solo por hitos aprobados</span>
        </span>
      </div>
      <div className="mt-6">
        <Link
          href="/Servicios/Marcas/RegistroMarca"
          className="group inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
        >
          Comienza Ahora
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  </div>
</section>

      {/* SECCIÓN "CÓMO FUNCIONA" (Existente) */}
      <section id="como-funciona" className="relative z-0 pt-10 pb-20 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-rose-600 mb-5">
              <Sparkles className="h-4 w-4" />
              Proceso guiado
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.04em] text-slate-950">
              Tres pasos para registrar tu marca
            </h2>
            <p className="mt-4 text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Un proceso transparente, sin sorpresas y respaldado por especialistas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Valida tu marca',
                description: 'Ingresa el nombre o logotipo y nuestro sistema realiza la búsqueda fonética y de antecedentes.',
                icon: <SearchCheck className="h-7 w-7 text-emerald-500" />,
              },
              {
                step: '02',
                title: 'Completa el formulario',
                description: 'Indica los productos/servicios que protegerá tu marca. Nosotros preparamos la solicitud.',
                icon: <FileText className="h-7 w-7 text-amber-500" />,
              },
              {
                step: '03',
                title: 'Presentación y seguimiento',
                description: 'Envío oficial al SENADI y monitoreo constante hasta la concesión del título.',
                icon: <Landmark className="h-7 w-7 text-indigo-500" />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-black tracking-[0.24em] text-slate-400">
                    {item.step}
                  </span>
                  <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-950 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CIERRE (CTA final) */}
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
            ¿Tienes una idea o negocio que proteger?
          </motion.h3>
          <motion.p
            className="text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed text-sm md:text-base"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            Comienza hoy el registro de tu marca sin riesgo. Paga solo cuando cada fase sea aprobada.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22, duration: 0.55 }}
          >
            <Link
              href="/Servicios/Marcas/RegistroMarca"
              className="group inline-flex items-center justify-center rounded-2xl bg-white px-7 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-[#7F1D1D] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50"
            >
              Registrar marca ahora
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      <NoPayChatLauncher />
      <Footer />
    </main>
	 
</>
  );
}