'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { VERSION_APP } from 'config/apiConfig';
import {
  Scale,
  ChevronRight,
  Mail,
  MessageCircle,
  ShieldCheck,
  Twitter,
  Linkedin,
  Facebook,
  Github,
  Instagram,
  Send,
  CheckCircle,
  Lock,
  Award,
  MapPin,
  ChevronDown,
} from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/593979937186';

const EliteFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    servicios: false,
    empresa: false,
    legal: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim()) {
      setSubscribed(true);
      setEmail('');

      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  const services = [
    { name: 'Impugnación de Multas', href: '/Servicios/Impugnacion' },
    { name: 'Permisos de Salida de Menores', href: '/Servicios/PermisoSalida' },
    { name: 'Registro de Marcas', href: '/Servicios/Marcas' },
    { name: 'Matriculación Vehicular', href: '/Servicios/Matriculacion' },
  ];

  const company = [
    { name: 'Servicios', href: '/Servicios' },
    { name: 'Guía Legal Ecuador', href: '/guia-legal-ecuador' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Seguridad de Datos', href: '/SeguridadDatos' },
    { name: 'Acceso Abogados', href: '/logInSocio' },
  ];

  const legal = [
    { name: 'Términos y Condiciones', href: '/terminos-condiciones' },
    { name: 'Políticas de Privacidad', href: '/politicas-privacidad' },
    { name: 'Política de Envío', href: '/politicas-envio-entrega' },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/nopay-legaltech-ecuador/',
      icon: <Linkedin size={17} />,
      external: true,
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61590484204919',
      icon: <Facebook size={17} />,
      external: true,
    },
    {
      name: 'GitHub',
      href: '#',
      icon: <Github size={17} />,
      external: true,
    },
    {
      name: 'WhatsApp',
      href: WHATSAPP_URL,
      icon: <MessageCircle size={17} />,
      external: true,
    },
  ];

  return (
    <footer
      className="relative w-full border-t border-slate-200/80 bg-white"
      aria-labelledby="footer-nopay-title"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12 lg:py-16">
        {/* Main grid - Reorganizado para mejor responsive */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Columna izquierda - información de marca */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Ir al inicio de NoPay">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <img
                  src="/images/logo.png"
                  alt="NoPay Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="leading-none">
                <div className="flex items-center gap-2">
                  <span
                    id="footer-nopay-title"
                    className="text-2xl font-black tracking-tight text-slate-950 md:text-[23px]"
                  >
                    NoPay
                  </span>
                  <span className="hidden rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:inline-flex">
                    Legal AI
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Justicia más simple
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500 md:mt-5 md:leading-7">
              Tecnología legal en Ecuador pensada para simplificar trámites, reducir errores y
              acercar soluciones jurídicas digitales de forma clara, segura y profesional.
            </p>

            {/* Trust pills - más compactas en móvil */}
            <div className="mt-4 flex flex-wrap gap-2 md:mt-5">
              <TrustPill icon={<Lock size={13} className="text-emerald-600" />} text="Datos protegidos" />
              <TrustPill icon={<ShieldCheck size={13} className="text-indigo-500" />} text="Procesos guiados" />
              <TrustPill icon={<Award size={13} className="text-rose-500" />} text="Legaltech Ecuador" />
            </div>

            {/* Newsletter - más compacto en móvil */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 md:mt-7 md:p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 md:text-[11px]">
                Novedades legales
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-2 flex flex-col gap-2 md:mt-3 md:gap-3 sm:flex-row"
                aria-label="Suscripción a novedades legales de NoPay"
              >
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 md:h-4 md:w-4"
                    aria-hidden="true"
                  />

                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Correo electrónico para recibir novedades legales
                  </label>

                  <input
                    id="footer-newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    autoComplete="email"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 md:h-11 md:rounded-2xl md:pl-10 md:pr-4"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 md:h-11 md:gap-2 md:rounded-2xl md:px-5"
                  aria-label="Suscribirme a novedades legales de NoPay"
                >
                  {subscribed ? (
                    <CheckCircle size={15} aria-hidden="true" />
                  ) : (
                    <Send size={15} aria-hidden="true" />
                  )}
                  {subscribed ? 'Listo' : 'Suscribirme'}
                </button>
              </form>
            </div>
          </div>

          {/* Columnas derechas - con acordeón en móvil */}
          <div className="lg:col-span-7">
            {/* Versión desktop: grid normal */}
            <div className="hidden grid-cols-1 gap-8 sm:grid-cols-3 md:flex md:gap-12 lg:grid">
              <FooterColumn title="Servicios" items={services} />
              <FooterColumn title="Empresa" items={company} />
              <FooterColumn title="Legal" items={legal} />
            </div>

            {/* Versión móvil: acordeón */}
            <div className="space-y-3 md:hidden">
              <MobileAccordionSection
                title="Servicios"
                items={services}
                isOpen={openSections.servicios}
                onToggle={() => toggleSection('servicios')}
              />
              <MobileAccordionSection
                title="Empresa"
                items={company}
                isOpen={openSections.empresa}
                onToggle={() => toggleSection('empresa')}
              />
              <MobileAccordionSection
                title="Legal"
                items={legal}
                isOpen={openSections.legal}
                onToggle={() => toggleSection('legal')}
              />
            </div>

            {/* Tarjeta de contacto simplificada en móvil */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-3 md:mt-10 md:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    ¿Necesitas ayuda con un trámite?
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 md:mt-1 md:text-sm">
                    Escríbenos y te orientamos sobre el mejor camino para iniciar.
                  </p>
                </div>

                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar a NoPay por WhatsApp"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 md:px-5 md:py-2.5"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Contactar por WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="my-6 border-t border-slate-200/80 md:my-8 lg:my-10" />

        {/* Barra inferior - mejor responsive */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1.5 text-xs text-slate-400 sm:flex-row sm:items-center sm:gap-2 md:gap-3">
            <span className="flex flex-wrap items-center gap-1">
              © {currentYear} NoPay —{' '}
              <a
                href="https://www.softcorpai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-transparent transition hover:border-slate-300 hover:text-slate-700"
                aria-label="Plataforma desarrollada por Softcorp (abre en nueva ventana)"
              >
                Plataforma desarrollada por Softcorp
              </a>
              <span className="ml-1 rounded-full border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-slate-500 md:ml-2 md:px-2">
                {VERSION_APP}
              </span>
            </span>

            <span className="hidden sm:inline">•</span>

            <span className="inline-flex items-center gap-1">
              <MapPin size={12} aria-hidden="true" />
              Cuenca, Ecuador
            </span>

            <span className="hidden sm:inline">•</span>

            <a
              href="mailto:info@nopaylegal.com"
              className="transition hover:text-slate-700"
              aria-label="Enviar correo a NoPay"
            >
              info@nopaylegal.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-slate-700"
                aria-label={`Síguenos en ${item.name}`}
              >
                {React.cloneElement(item.icon, { 'aria-hidden': true, size: 16 })}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

type FooterItem = {
  name: string;
  href: string;
};

// Componente para columnas en desktop
const FooterColumn = ({ title, items }: { title: string; items: FooterItem[] }) => {
  return (
    <nav aria-label={title}>
      <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
        {title}
      </h4>

      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              <ChevronRight
                size={14}
                className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Componente acordeón para móvil
const MobileAccordionSection = ({
  title,
  items,
  isOpen,
  onToggle,
}: {
  title: string;
  items: FooterItem[];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border-b border-slate-200 pb-2">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left font-medium text-slate-700"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="mt-2 space-y-2 pb-2">
          {items.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-950"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TrustPill = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500 md:gap-2 md:px-3 md:py-1.5">
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<{ 'aria-hidden'?: boolean }>, {
            'aria-hidden': true,
          })
        : icon}
      <span className="text-[11px] md:text-xs">{text}</span>
    </div>
  );
};

export default EliteFooter;