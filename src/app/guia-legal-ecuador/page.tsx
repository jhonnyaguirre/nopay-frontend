import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Car,
  Landmark,
  UserCheck,
  Building2,
  ShieldCheck,
  Scale,
  Clock3,
  CheckCircle2,
  MapPin,
  BrainCircuit,
  FileText,
  Gavel,
  BriefcaseBusiness,
  ScrollText,
  Fingerprint,
  BadgeDollarSign,
  Globe2,
} from 'lucide-react';

const SITE_URL = 'https://nopaylegal.com';

export const metadata: Metadata = {
  title: 'Guía Legal Ecuador | Trámites legales online con IA y abogados',
  description:
    'NoPay es una LegalTech en Ecuador para iniciar procesos legales online: permisos de salida de menores, minutas, impugnación de multas, registro de marcas, creación de SAS y más servicios legales digitales 24/7.',
  keywords: [
    'trámites legales online Ecuador',
    'LegalTech Ecuador',
    'abogados online Ecuador',
    'minutas legales Ecuador',
    'permiso salida menor Ecuador',
    'registro de marca Ecuador',
    'crear SAS Ecuador',
    'impugnar multa Ecuador',
    'asesoría legal online Ecuador',
    'servicios legales Cuenca',
  ],
  alternates: {
    canonical: '/guia-legal-ecuador',
  },
  openGraph: {
    title: 'Guía Legal Ecuador | NoPay LegalTech',
    description:
      'Procesos legales online en Ecuador con IA y revisión humana: minutas, permisos, marcas, SAS, multas y más.',
    url: `${SITE_URL}/guia-legal-ecuador`,
    siteName: 'NoPay',
    locale: 'es_EC',
    type: 'article',
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'NoPay LegalTech Ecuador',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const services = [
  {
    icon: UserCheck,
    title: 'Permiso de salida del país para menores',
    href: '/Servicios/PermisoSalida',
    description:
      'Generación guiada de minutas y documentos para permisos de salida de menores, con rutas notariales o judiciales según el caso.',
    highlight: 'Minuta inmediata después del pago, cuando el caso cumple condiciones.',
    keywords: ['permiso salida menor Ecuador', 'minuta notarial menor', 'autorización viaje menor'],
  },
  {
    icon: Landmark,
    title: 'Registro de marcas',
    href: '/Servicios/Marcas',
    description:
      'Proceso digital para iniciar el registro de marca, organizar información, evaluar datos básicos y avanzar con respaldo profesional.',
    highlight: 'Protección de identidad comercial para emprendedores y empresas.',
    keywords: ['registrar marca Ecuador', 'registro SENADI', 'proteger marca'],
  },
  {
    icon: Building2,
    title: 'Creación de SAS',
    href: '/Novedades',
    description:
      'Ruta digital para emprendedores que necesitan constituir una SAS, preparar información societaria y formalizar su actividad.',
    highlight: 'Pensado para negocios que quieren constituirse con rapidez y orden.',
    keywords: ['crear SAS Ecuador', 'constituir empresa online', 'empresa SAS Ecuador'],
  },
  {
    icon: Car,
    title: 'Impugnación de multas de tránsito',
    href: '/Servicios/Impugnacion',
    description:
      'Carga de citación, evidencia y datos relevantes para estructurar un expediente digital de impugnación.',
    highlight: 'Proceso guiado para reducir errores y ordenar mejor la defensa.',
    keywords: ['impugnar multa Ecuador', 'multa tránsito Cuenca', 'impugnación de multas'],
  },
  {
    icon: ScrollText,
    title: 'Minutas y documentos legales',
    href: '/Servicios',
    description:
      'Generación de documentos legales estructurados según el tipo de trámite, con validaciones y revisión profesional cuando corresponde.',
    highlight: 'Soluciones legales que pueden estar listas en minutos u horas.',
    keywords: ['minutas legales Ecuador', 'documentos legales online', 'minuta notarial Ecuador'],
  },
  {
    icon: Gavel,
    title: 'Asesoría legal digital',
    href: '/contacto',
    description:
      'Orientación inicial para identificar qué camino legal corresponde antes de iniciar un proceso o pagar por un servicio.',
    highlight: 'Tecnología para guiar; abogados para validar lo importante.',
    keywords: ['asesoría legal online Ecuador', 'abogado online Ecuador', 'consulta legal digital'],
  },
];

const platformStrengths = [
  {
    icon: BrainCircuit,
    title: 'Impulsado por IA',
    text: 'La plataforma ayuda a ordenar datos, identificar rutas posibles, reducir errores y acelerar la preparación del caso.',
  },
  {
    icon: ShieldCheck,
    title: 'Validado por expertos humanos',
    text: 'Cuando el trámite lo requiere, los abogados de NoPay revisan, validan o firman electrónicamente los documentos aplicables.',
  },
  {
    icon: Clock3,
    title: 'Disponible 24/7',
    text: 'El usuario puede iniciar procesos cualquier día del año, incluso fuera de horarios tradicionales de oficina.',
  },
  {
    icon: Fingerprint,
    title: 'Trazabilidad digital',
    text: 'Cada proceso se gestiona con información organizada, documentos cargados y una experiencia pensada para seguimiento.',
  },
];

const useCases = [
  'Necesitas una minuta para permiso de salida de menor y quieres evitar errores de forma.',
  'Quieres registrar una marca antes de que otro negocio use un nombre similar.',
  'Buscas constituir una SAS para formalizar tu emprendimiento.',
  'Recibiste una multa de tránsito y quieres saber si puedes impugnarla.',
  'Necesitas generar documentos legales con estructura profesional.',
  'Quieres iniciar un proceso legal desde el celular, sin filas y con acompañamiento.',
];

const faqs = [
  {
    q: '¿Qué es NoPay?',
    a: 'NoPay es una plataforma LegalTech ecuatoriana que permite iniciar procesos legales online mediante tecnología, inteligencia artificial y validación profesional humana cuando el trámite lo requiere.',
  },
  {
    q: '¿Qué tipo de procesos legales puedo iniciar?',
    a: 'Puedes iniciar servicios como permisos de salida de país para menores, generación de minutas legales, impugnación de multas de tránsito, registro de marcas, creación de SAS y otros procesos legales digitales disponibles en la plataforma.',
  },
  {
    q: '¿Puedo obtener una minuta de permiso de salida de menor inmediatamente?',
    a: 'En casos que cumplen las condiciones del flujo digital, NoPay puede generar una minuta legal estructurada inmediatamente después del pago, con validación y firma electrónica de abogados de NoPay cuando corresponda.',
  },
  {
    q: '¿NoPay funciona todos los días?',
    a: 'Sí. La plataforma está diseñada para operar 24/7, cualquier día del año. Algunos procesos pueden resolverse de forma inmediata, mientras otros requieren revisión profesional en horas o días.',
  },
  {
    q: '¿NoPay reemplaza a un abogado?',
    a: 'No. NoPay combina automatización, IA y experiencia legal humana. La tecnología acelera y ordena el proceso; los expertos humanos validan los casos o documentos cuando es necesario.',
  },
  {
    q: '¿NoPay garantiza resultados legales?',
    a: 'NoPay no promete resultados judiciales, administrativos o notariales. Su objetivo es entregar procesos más claros, documentos mejor estructurados y acompañamiento profesional según el tipo de trámite.',
  },
];

export default function GuiaLegalEcuadorPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Guía Legal Ecuador: procesos legales online con IA y abogados',
    description:
      'Guía sobre trámites legales digitales en Ecuador: permisos de salida de menores, minutas, registro de marcas, SAS, impugnación de multas y asesoría legal online.',
    image: `${SITE_URL}/images/logo.png`,
    author: {
      '@type': 'Organization',
      name: 'NoPay',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NoPay',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/guia-legal-ecuador`,
    inLanguage: 'es-EC',
    areaServed: {
      '@type': 'Country',
      name: 'Ecuador',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Servicios legales digitales de NoPay en Ecuador',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        url: `${SITE_URL}${service.href}`,
        provider: {
          '@type': 'LegalService',
          name: 'NoPay',
          url: SITE_URL,
          areaServed: {
            '@type': 'Country',
            name: 'Ecuador',
          },
        },
      },
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guía Legal Ecuador',
        item: `${SITE_URL}/guia-legal-ecuador`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FBFBFE] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.16),transparent_35%),radial-gradient(circle_at_left,rgba(245,158,11,0.14),transparent_35%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-rose-600 shadow-sm">
            <Scale className="h-4 w-4" />
            Guía Legal Ecuador · LegalTech 24/7
          </div>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">
            Procesos legales online en Ecuador, resueltos con IA y expertos humanos.
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            NoPay permite iniciar trámites legales digitales como permisos de salida de menores,
            minutas notariales, registro de marcas, creación de SAS, impugnación de multas y asesoría
            legal online. Una plataforma disponible 24/7, diseñada para entregar soluciones desde
            tiempos inmediatos hasta plazos cortos en horas o días, según el tipo de proceso.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/Servicios"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl transition hover:bg-rose-600"
            >
              Iniciar proceso legal
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:border-rose-200 hover:text-rose-600"
            >
              Hablar con NoPay
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ['Disponibilidad', '24/7, cualquier día del año'],
              ['Velocidad', 'Minutos, horas o días según el caso'],
              ['Modelo', 'IA + abogados de NoPay'],
              ['Cobertura', 'Ecuador, prioridad Cuenca'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
            Una plataforma para múltiples necesidades legales.
          </h2>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            NoPay no está pensado para un solo trámite. Su objetivo es convertirse en una plataforma
            legal integral para Ecuador, capaz de digitalizar procesos frecuentes, reducir tiempos,
            generar documentos útiles y conectar tecnología con revisión profesional.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.03em]">{service.title}</h3>

                  <p className="mt-3 text-base leading-7 text-slate-600">{service.description}</p>

                  <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-700">
                    {service.highlight}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-500"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={service.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-rose-600"
                  >
                    Ver servicio
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-rose-600">
                <BrainCircuit className="h-4 w-4" />
                IA + criterio humano
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Automatización legal, sin perder validación profesional.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                La inteligencia artificial permite acelerar la captura de información, ordenar
                documentos, detectar rutas posibles y reducir errores. Pero en NoPay, los procesos
                importantes no dependen solo de automatización: se complementan con expertos humanos
                y abogados cuando el trámite lo exige.
              </p>
            </div>

            <div className="grid gap-4">
              {platformStrengths.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-3xl border border-slate-200 bg-[#FBFBFE] p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-base leading-7 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white md:p-12">
            <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white/70">
                  <FileText className="h-4 w-4" />
                  Caso destacado
                </div>

                <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
                  Minutas para permiso de salida de menores, disponibles al instante.
                </h2>

                <p className="mt-5 text-lg leading-8 text-white/70">
                  Para casos que cumplen las condiciones del flujo digital, NoPay puede generar la
                  minuta correspondiente inmediatamente después del pago, con estructura legal,
                  orientación para notaría y validación profesional cuando corresponde.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  'Disponible 24/7, incluso fines de semana o feriados.',
                  'Generación inmediata cuando el caso es compatible con el flujo digital.',
                  'Documento estructurado para uso notarial según el tipo de trámite.',
                  'Validación y firma electrónica de abogados de NoPay cuando corresponde.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-3xl bg-white/10 p-5">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-rose-300" />
                    <p className="text-base font-semibold leading-7 text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
            ¿Cuándo usar NoPay?
          </h2>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            NoPay es útil cuando necesitas iniciar un proceso legal de forma rápida, ordenada y con
            menos fricción que los canales tradicionales.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {useCases.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-3xl border border-slate-200 bg-[#FBFBFE] p-5"
              >
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-rose-500" />
                <p className="text-base font-semibold leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Búsquedas legales que NoPay busca resolver.
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Esta guía está diseñada para responder preguntas reales de usuarios en Ecuador y
                para que buscadores e inteligencias artificiales comprendan qué procesos legales
                puede resolver NoPay.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Globe2, title: 'Trámites online', text: 'procesos legales online Ecuador' },
              { icon: BadgeDollarSign, title: 'Costos claros', text: 'cuánto cuesta una minuta legal' },
              { icon: BriefcaseBusiness, title: 'Empresas', text: 'crear SAS Ecuador online' },
              { icon: Landmark, title: 'Marcas', text: 'registrar marca en Ecuador' },
              { icon: UserCheck, title: 'Familia', text: 'permiso salida menor Ecuador' },
              { icon: Car, title: 'Tránsito', text: 'impugnar multa de tránsito Ecuador' },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6">
                  <Icon className="h-7 w-7 text-rose-500" />
                  <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm font-bold text-slate-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
            Preguntas frecuentes sobre NoPay y trámites legales online
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-[2rem] border border-slate-200 bg-[#FBFBFE] p-6">
                <h3 className="text-xl font-black tracking-[-0.02em]">{item.q}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white/70">
                <MapPin className="h-4 w-4" />
                Ecuador · Prioridad Cuenca · Atención digital
              </div>

              <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Empieza tu proceso legal desde ahora.
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
                NoPay está construido para usuarios que necesitan resolver rápido, entender el
                proceso y avanzar con documentos, pagos y seguimiento desde una sola plataforma.
              </p>
            </div>

            <Link
              href="/Servicios"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-slate-950 transition hover:bg-rose-100"
            >
              Iniciar ahora
              <Clock3 className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}