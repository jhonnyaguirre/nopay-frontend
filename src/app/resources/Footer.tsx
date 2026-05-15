'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { VERSION_APP } from 'config/apiConfig';
import {
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
  FileText,
  Scale,
  Car,
  Landmark,
  UserCheck,
  Building2,
} from 'lucide-react';

const SITE_URL = 'https://nopaylegal.com';
const WHATSAPP_URL = 'https://wa.me/593979937186';

const EliteFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const services = [
    { name: 'Impugnar multa de tránsito', href: '/Servicios/Impugnacion', icon: Car },
    { name: 'Permiso de salida de menores', href: '/Servicios/PermisoSalida', icon: UserCheck },
    { name: 'Registro de marcas', href: '/Servicios/Marcas', icon: Landmark },
    { name: 'Constitución de SAS', href: '/Novedades', icon: Building2 },
  ];

  const company = [
    { name: 'Servicios legales online', href: '/Servicios' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Seguridad de Datos', href: '/SeguridadDatos' },
    { name: 'Acceso Abogados', href: '/logInSocio' },
	{ name: 'Guía Legal Ecuador', href: '/guia-legal-ecuador' },
  ];

  const legal = [
    { name: 'Términos y Condiciones', href: '/terminos-condiciones' },
    { name: 'Políticas de Privacidad', href: '/politicas-privacidad' },
    { name: 'Política de Envío', href: '/politicas-envio-entrega' },
  ];

  const localLinks = [
    { name: 'Impugnar multa en Quito', href: '/impugnar-multa-quito' },
    { name: 'Impugnar multa en Guayaquil', href: '/impugnar-multa-guayaquil' },
    { name: 'Impugnar multa en Cuenca', href: '/impugnar-multa-cuenca' },
    { name: 'Registro de marca en Ecuador', href: '/Servicios/Marcas' },
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

  const organizationSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      name: 'NoPay',
      alternateName: 'NoPay LegalTech',
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      image: `${SITE_URL}/images/logo.png`,
      description:
        'NoPay es una plataforma LegalTech en Ecuador para iniciar trámites legales digitales como impugnación de multas de tránsito, permiso de salida de menores, registro de marcas y constitución de SAS.',
      areaServed: {
        '@type': 'Country',
        name: 'Ecuador',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cuenca',
        addressCountry: 'EC',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['es'],
        areaServed: 'EC',
        url: WHATSAPP_URL,
      },
      sameAs: socialLinks.filter((item) => item.href !== '#').map((item) => item.href),
    }),
    []
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim()) {
      setSubscribed(true);
      setEmail('');

      window.setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer
      className="relative w-full border-t border-slate-200/80 bg-white"
      aria-labelledby="footer-nopay-title"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Inicio NoPay">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image
                  src="/images/logo.png"
                  alt="Logo de NoPay"
                  width={42}
                  height={42}
                  className="h-10 w-10 object-contain"
                />
              </div>

              <div className="leading-none">
                <div className="flex items-center gap-2">
                  <span id="footer-nopay-title" className="text-[23px] font-black tracking-tight text-slate-950">
                    NoPay
                  </span>
                  <span className="hidden rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:inline-flex">
                    LegalTech
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Asesoría legal online en Ecuador
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              NoPay simplifica trámites legales digitales en Ecuador con procesos guiados,
              tecnología y acompañamiento profesional cuando el caso lo requiere.
            </p>

            <div className="mt-7 max-w-md rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Novedades legales
              </p>

              <form onSubmit={handleSubscribe} className="mt-3 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Correo electrónico para novedades legales de NoPay
                </label>

                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

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
                >
                  {subscribed ? <CheckCircle size={17} /> : <Send size={17} />}
                  {subscribed ? 'Listo' : 'Suscribirme'}
                </button>
              </form>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <TrustPill icon={<Lock size={14} className="text-emerald-600" />} text="Datos protegidos" />
              <TrustPill icon={<ShieldCheck size={14} className="text-indigo-500" />} text="Procesos guiados" />
              <TrustPill icon={<Award size={14} className="text-rose-500" />} text="LegalTech Ecuador" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-4">
              <FooterColumn title="Servicios" items={services} withIcons />
              <FooterColumn title="Empresa" items={company} />
              <FooterColumn title="Legal" items={legal} />
              <FooterColumn title="SEO Local" items={localLinks} />
            </div>

            <div className="mt-10 rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    ¿Necesitas ayuda con un trámite legal?
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Escríbenos y te orientamos sobre el mejor camino para iniciar.
                  </p>
                </div>

                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <MessageCircle size={17} />
                  Contactar por WhatsApp
                </Link>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-start gap-3">
                <Scale className="mt-0.5 h-5 w-5 text-rose-500" />
                <p className="text-xs leading-6 text-slate-500">
                  La información publicada por NoPay tiene fines informativos y de orientación. La
                  disponibilidad, precio y tiempos de cada servicio pueden variar según la
                  documentación, ciudad, entidad competente y complejidad del caso. NoPay no promete
                  resultados administrativos, notariales o judiciales.
                </p>
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
              <MapPin size={13} />
              Cuenca, Ecuador
            </span>

            <span className="hidden sm:inline">•</span>

            <a href="mailto:softcorpecu@gmail.com" className="transition hover:text-slate-700">
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
  icon?: React.ElementType;
};

const FooterColumn = ({
  title,
  items,
  withIcons = false,
}: {
  title: string;
  items: FooterItem[];
  withIcons?: boolean;
}) => {
  return (
    <nav aria-label={title}>
      <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
        {title}
      </h4>

      <ul className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-950"
              >
                {withIcons && Icon ? (
                  <Icon size={14} className="text-slate-400 transition group-hover:text-rose-500" />
                ) : (
                  <ChevronRight
                    size={14}
                    className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                )}
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const TrustPill = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">
      {icon}
      {text}
    </div>
  );
};

export default EliteFooter;