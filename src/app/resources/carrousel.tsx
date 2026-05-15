'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  valorRegistroMarcaPhase1,
  valorImpugnacionGl,
  valorPermisoSalida,
} from 'config/apiConfig';
import {
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ArrowRight,
  Car,
  Landmark,
  UserCheck,
  Sparkles,
  Bell,
  Scale,
  MapPin,
  Clock3,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

const SITE_URL = 'https://nopaylegal.com';
const LOGO_URL = 'https://nopaylegal.com/images/logo.png';

type ServiceItem = {
  id: number;
  title: string;
  seoTitle: string;
  price: number | string | null;
  desc: string;
  seoDesc: string;
  keywords: string[];
  color: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  href: string;
  cta: string;
  estimatedTime: string;
  special?: boolean;
};

const services: ServiceItem[] = [
  {
    id: 1,
    title: 'Impugnación de Multas de Tránsito',
    seoTitle: 'Impugnar multa de tránsito en Ecuador',
    price: valorImpugnacionGl,
    desc: 'Impugna tu multa de tránsito con un proceso claro, rápido y guiado.',
    seoDesc:
      'Servicio legal online para impugnar multas de tránsito en Ecuador. Sube tu citación, recibe orientación inicial y avanza con respaldo profesional.',
    keywords: [
      'impugnar multa Ecuador',
      'impugnación de multas de tránsito',
      'multa de tránsito Quito',
      'multa de tránsito Guayaquil',
      'multa de tránsito Cuenca',
    ],
    color: 'from-blue-600 to-indigo-600',
    icon: <Car />,
    href: '/Servicios/Impugnacion',
    cta: 'Impugnar multa',
    estimatedTime: 'Respuesta inicial en 24h',
  },
  {
    id: 2,
    title: 'Registro de Marcas',
    seoTitle: 'Registrar marca en Ecuador',
    price: valorRegistroMarcaPhase1,
    desc: 'Protege y registra tu marca con una experiencia legal simple y segura.',
    seoDesc:
      'Servicio digital para iniciar el registro de marca en Ecuador, revisar disponibilidad, preparar información y avanzar con asesoría legal.',
    keywords: [
      'registrar marca Ecuador',
      'registro de marca Guayaquil',
      'registro de marca Quito',
      'registro de marca Cuenca',
      'proteger marca Ecuador',
    ],
    color: 'from-pink-600 to-purple-600',
    icon: <Landmark />,
    href: '/Servicios/Marcas',
    cta: 'Registrar marca',
    estimatedTime: 'Evaluación inicial guiada',
  },
  {
    id: 3,
    title: 'Permiso de Salida de Menores',
    seoTitle: 'Permiso de salida de menores Ecuador',
    price: valorPermisoSalida,
    desc: 'Tramitación guiada de permisos de viaje para menores según el tipo de caso.',
    seoDesc:
      'Diagnóstico legal digital para permiso de salida del país de menores en Ecuador, con ruta notarial o judicial según corresponda.',
    keywords: [
      'permiso de salida de menores Ecuador',
      'permiso salida menor Quito',
      'permiso salida menor Guayaquil',
      'permiso salida menor Cuenca',
      'autorización viaje menor Ecuador',
    ],
    color: 'from-purple-500 to-pink-500',
    icon: <UserCheck />,
    href: '/Servicios/PermisoSalida',
    cta: 'Evaluar permiso',
    estimatedTime: 'Diagnóstico en minutos',
  },
  {
    id: 4,
    title: 'Constitución de SAS',
    seoTitle: 'Crear SAS en Ecuador online',
    price: null,
    desc: 'Muy pronto podrás iniciar la creación de tu SAS con una experiencia digital.',
    seoDesc:
      'Servicio legal digital para constitución de SAS en Ecuador. Ideal para emprendedores que buscan formalizar su negocio de manera ordenada.',
    keywords: [
      'crear SAS Ecuador',
      'constituir SAS online',
      'crear empresa Ecuador',
      'SAS Ecuador requisitos',
      'constitución de empresa Ecuador',
    ],
    color: 'from-amber-400 to-orange-600',
    icon: <Building2 />,
    href: '/Novedades',
    cta: 'Recibir novedades',
    estimatedTime: 'Próximamente',
    special: true,
  },
];

export default function ServicesPureLightAuto() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentService = services[index];
  const isSpecial = currentService.special === true;

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % services.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + services.length) % services.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      next();
    }, 5200);

    return () => window.clearInterval(timer);
  }, [next]);

  const getCurrentQuarter = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `Q${quarter} ${now.getFullYear()}`;
  };

  const serviceSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Servicios legales digitales de NoPay en Ecuador',
      description:
        'Servicios LegalTech para impugnación de multas, registro de marcas, permiso de salida de menores y constitución de SAS en Ecuador.',
      url: SITE_URL,
      itemListElement: services.map((service, position) => ({
        '@type': 'ListItem',
        position: position + 1,
        item: {
          '@type': 'Service',
          name: service.seoTitle,
          description: service.seoDesc,
          url: `${SITE_URL}${service.href}`,
          provider: {
            '@type': 'LegalService',
            name: 'NoPay',
            url: SITE_URL,
            logo: LOGO_URL,
            areaServed: {
              '@type': 'Country',
              name: 'Ecuador',
            },
          },
          areaServed: [
            { '@type': 'City', name: 'Quito' },
            { '@type': 'City', name: 'Guayaquil' },
            { '@type': 'City', name: 'Cuenca' },
            { '@type': 'Country', name: 'Ecuador' },
          ],
          offers: service.price
            ? {
                '@type': 'Offer',
                price: String(service.price),
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: `${SITE_URL}${service.href}`,
              }
            : undefined,
        },
      })),
    }),
    []
  );

  return (
    <section
      id="servicios-legales-nopay"
      aria-labelledby="servicios-nopay-title"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white py-20"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute -left-[5%] -top-[10%] h-[40vw] w-[40vw] rounded-full bg-slate-50 blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[35vw] w-[35vw] rounded-full bg-blue-50 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[28vw] w-[28vw] rounded-full bg-rose-50 blur-[110px]" />
      </div>

      <div className="container relative z-10 mx-auto px-8 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="order-2 flex flex-col space-y-10 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55 }}
              className="flex w-fit items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-1.5 shadow-sm"
            >
              <BadgeCheck className="h-4 w-4 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Servicios legales online en Ecuador
              </span>
            </motion.div>

            <div className="space-y-5">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                LegalTech · Trámites digitales · Asesoría guiada
              </p>

              <h2
                id="servicios-nopay-title"
                className="max-w-3xl text-5xl font-[900] leading-[0.92] tracking-tight text-slate-950 md:text-[5.5rem]"
              >
                Servicios legales
                <span className="block bg-gradient-to-r from-rose-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent">
                  simples y digitales
                </span>
              </h2>

              <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-500 md:text-xl">
                Inicia trámites legales en Ecuador con una experiencia clara, rápida y mobile-first:
                multas de tránsito, marcas, permisos de salida de menores y nuevos servicios para
                emprendedores.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                key={currentService.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: 'circOut' }}
                className="space-y-6"
              >
                <h3 className="text-4xl font-[900] leading-[0.95] tracking-tight text-slate-900 md:text-6xl">
                  {currentService.title.split(' ')[0]} <br />
                  <span
                    className={`bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent`}
                  >
                    {currentService.title.split(' ').slice(1).join(' ')}
                  </span>
                </h3>

                <p className="max-w-xl text-base font-medium leading-relaxed text-slate-500 md:text-lg">
                  {currentService.seoDesc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentService.keywords.slice(0, 4).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="grid max-w-xl gap-3 sm:grid-cols-3">
                  <InfoPill icon={<Clock3 />} label={currentService.estimatedTime} />
                  <InfoPill icon={<MapPin />} label="Cobertura Ecuador" />
                  <InfoPill icon={<ShieldCheck />} label="Proceso guiado" />
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="flex items-center gap-8 pt-2">
              <div className="flex gap-3">
                <NavButton onClick={prev} icon={<ChevronLeft size={24} />} label="Servicio anterior" />
                <NavButton onClick={next} icon={<ChevronRight size={24} />} label="Siguiente servicio" />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Servicio
                </span>
                <div className="text-2xl font-black text-slate-900">
                  {String(index + 1).padStart(2, '0')}{' '}
                  <span className="text-slate-200">/ {services.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentService.id}
                custom={direction}
                initial={{ opacity: 0, scale: 0.86, rotateY: direction * 16 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.86, rotateY: direction * -16 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
                className="relative aspect-[4/5] w-full max-w-[420px]"
              >
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="absolute -right-4 top-32 z-30 flex min-w-[112px] flex-col items-center rounded-2xl border border-slate-50 bg-white p-4 shadow-[0_15px_45px_rgba(0,0,0,0.1)]"
                >
                  {isSpecial ? (
                    <>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-amber-500">
                        Próximamente
                      </span>
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-xl font-black text-transparent">
                        {getCurrentQuarter()}
                      </div>
                      <div className="mt-1 h-1 w-6 rounded-full bg-amber-100" />
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">
                        Desde
                      </span>
                      <div
                        className={`bg-gradient-to-br ${currentService.color} bg-clip-text text-3xl font-[1000] text-transparent`}
                      >
                        ${currentService.price}
                      </div>
                      <div className="mt-1 h-1 w-6 rounded-full bg-slate-100" />
                    </>
                  )}
                </motion.div>

                <div
                  className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[3.5rem] border border-slate-50 bg-white p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] ${
                    isSpecial ? 'bg-gradient-to-br from-amber-50 to-white' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <motion.div
                      key={currentService.id}
                      initial={{ rotate: -45, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      className={`rounded-[2rem] bg-gradient-to-br ${currentService.color} p-6 text-white shadow-2xl shadow-blue-200/50 ${
                        isSpecial ? 'animate-pulse-slow' : ''
                      }`}
                    >
                      {React.cloneElement(currentService.icon, {
                        width: 36,
                        height: 36,
                        strokeWidth: 2.5,
                        'aria-hidden': true,
                      })}
                    </motion.div>

                    <span className="select-none text-7xl font-black italic text-slate-50">
                      {String(currentService.id).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-8">
                    <div className="flex flex-wrap gap-1.5">
                      {services.map((service, i) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            setDirection(i > index ? 1 : -1);
                            setIndex(i);
                          }}
                          aria-label={`Ver servicio: ${service.title}`}
                          className={`h-1 rounded-full transition-all duration-700 ${
                            index === i
                              ? `w-10 bg-gradient-to-r ${currentService.color}`
                              : 'w-2 bg-slate-100 hover:bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Scale className="h-4 w-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.25em]">
                          Servicio LegalTech
                        </p>
                      </div>

                      <h3 className="text-3xl font-black leading-none tracking-tight text-slate-800">
                        {isSpecial ? 'Smart Legal Evolution' : 'Smart Legal Experience'}
                      </h3>

                      <p className="text-sm leading-relaxed text-slate-500">
                        {currentService.desc}
                      </p>
                    </div>

                    <Link
                      href={currentService.href}
                      aria-label={`${currentService.cta}: ${currentService.title}`}
                      className="block w-full"
                    >
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group flex w-full items-center justify-center gap-3 rounded-3xl py-5 text-xs font-black uppercase tracking-widest transition-all ${
                          isSpecial
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:shadow-amber-200/50'
                            : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-200'
                        }`}
                      >
                        {isSpecial ? (
                          <>
                            {currentService.cta}
                            <Bell size={20} className="transition-transform group-hover:rotate-12" />
                          </>
                        ) : (
                          <>
                            {currentService.cta}
                            <ArrowRight
                              size={20}
                              className="transition-transform group-hover:translate-x-2"
                            />
                          </>
                        )}
                      </motion.span>
                    </Link>
                  </div>

                  <div
                    className={`absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-gradient-to-br ${currentService.color} opacity-[0.06] blur-[60px] transition-all duration-1000 ${
                      isSpecial ? 'animate-pulse-slow' : ''
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.06;
          }
          50% {
            opacity: 0.18;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}



function InfoPill({
  icon,
  label,
}: {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
      {React.cloneElement(icon, {
        className: 'h-4 w-4 text-rose-500',
        strokeWidth: 2,
        'aria-hidden': true,
      })}
      <span>{label}</span>
    </div>
  );
}


function NavButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1, backgroundColor: '#f8fafc' }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={label}
      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:text-slate-900 active:bg-slate-100"
    >
      {icon}
    </motion.button>
  );
}