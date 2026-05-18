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
  Github,
  Instagram,
  Send,
  CheckCircle,
  Lock,
  Award,
  MapPin,
} from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/593979937186';

const EliteFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
    { name: 'Twitter', href: '#', icon: <Twitter size={17} /> },
    { name: 'LinkedIn', href: '#', icon: <Linkedin size={17} /> },
    { name: 'Instagram', href: '#', icon: <Instagram size={17} /> },
    { name: 'GitHub', href: '#', icon: <Github size={17} /> },
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
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
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
                    className="text-[23px] font-black tracking-tight text-slate-950"
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

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              Tecnología legal en Ecuador pensada para simplificar trámites, reducir errores y
              acercar soluciones jurídicas digitales de forma clara, segura y profesional.
            </p>

            <span className="sr-only">
              NoPay es una plataforma LegalTech en Ecuador para iniciar trámites legales online como
              impugnación de multas de tránsito, permisos de salida de menores, registro de marcas,
              minutas legales y otros procesos digitales impulsados por inteligencia artificial y
              validación profesional.
            </span>

            <div className="mt-7 max-w-md rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Novedades legales
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-3 flex flex-col gap-3 sm:flex-row"
                aria-label="Suscripción a novedades legales de NoPay"
              >
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                  aria-label="Suscribirme a novedades legales de NoPay"
                >
                  {subscribed ? (
                    <CheckCircle size={17} aria-hidden="true" />
                  ) : (
                    <Send size={17} aria-hidden="true" />
                  )}
                  {subscribed ? 'Listo' : 'Suscribirme'}
                </button>
              </form>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <TrustPill icon={<Lock size={14} className="text-emerald-600" />} text="Datos protegidos" />
              <TrustPill icon={<ShieldCheck size={14} className="text-indigo-500" />} text="Procesos guiados" />
              <TrustPill icon={<Award size={14} className="text-rose-500" />} text="Legaltech Ecuador" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
              <FooterColumn title="Servicios" items={services} />
              <FooterColumn title="Empresa" items={company} />
              <FooterColumn title="Legal" items={legal} />
            </div>

            <div className="mt-10 rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    ¿Necesitas ayuda con un trámite?
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Escríbenos y te orientamos sobre el mejor camino para iniciar.
                  </p>
                </div>

                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar a NoPay por WhatsApp"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  Contactar por WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 border-t border-slate-200/80" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:gap-3">
            <span>
              © {currentYear} NoPay — Softcorp EC
              <span className="ml-2 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-500">
                {VERSION_APP}
              </span>
            </span>

            <span className="hidden sm:inline">•</span>

            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} aria-hidden="true" />
              Cuenca, Ecuador
            </span>

            <span className="hidden sm:inline">•</span>

            <a
              href="mailto:info@nopaylegal.com"
              className="transition hover:text-slate-700"
              aria-label="Enviar correo a NoPay"
            >
              softcorpecu@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-label={item.name}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              >
                {item.icon}
              </Link>
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

const FooterColumn = ({
  title,
  items,
}: {
  title: string;
  items: FooterItem[];
}) => {
  return (
    <nav aria-label={title}>
      <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
        {title}
      </h4>

      <ul className="space-y-3">
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

const TrustPill = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<{ 'aria-hidden'?: boolean }>, {
            'aria-hidden': true,
          })
        : icon}
      {text}
    </div>
  );
};

export default EliteFooter;