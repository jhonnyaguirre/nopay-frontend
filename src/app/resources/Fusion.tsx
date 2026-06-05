'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Mail,
  ShieldCheck,
  Clock3,
  Scale,
  Car,
  Landmark,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import NoPayBackground from 'components/NoPayBackground';

// --------------------------------------------------------------
// CONSTANTES (datos centralizados)
// --------------------------------------------------------------
const BENEFITS = [
  { icon: Clock3, title: 'Rápido', text: 'Empieza tu trámite en minutos.', color: 'from-amber-500 to-orange-500' },
  { icon: ShieldCheck, title: 'Seguro', text: 'Tus datos se manejan con privacidad.', color: 'from-rose-500 to-pink-500' },
  { icon: Scale, title: 'Legaltech', text: 'IA + enfoque legal profesional.', color: 'from-purple-500 to-indigo-500' },
];

const SERVICES = [
  { icon: Car, title: 'Impugnar multa', href: '/Servicios/Impugnacion', description: 'Recurre tu multa de tránsito en línea.' },
  { icon: Landmark, title: 'Registrar marca', href: '/Servicios/Marcas', description: 'Protege tu marca con respaldo legal.' },
  { icon: UserCheck, title: 'Permiso de salida', href: '/Servicios/PermisoSalida', description: 'Autorización para menores al exterior.' },
];

// --------------------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------------------
export default function EliteLegalFooterFusion() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
      // Aquí puedes agregar lógica de envío a tu API
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="relative w-full bg-white" aria-labelledby="footer-cta-title">
      {/* Contenedor del fondo con máscara (efecto de aparición gradual) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
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
        {/* Curva superior integradora (sincronizada con el fondo blanco) */}
        <div className="absolute top-0 left-0 w-full z-20 leading-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[60px] md:h-[100px]"
            aria-hidden="true"
          >
            <path
              d="M0,0 C300,120 400,-20 600,60 C800,140 900,20 1200,80 L1200,0 L0,0 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Capas de diseño internas */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_40%,#f8fafc_85%)] opacity-[0.16]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent h-40" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L60 30 L80 30 L70 50 L80 70 L60 70 L50 90 L40 70 L20 70 L30 50 L20 30 L40 30 Z' fill='%23000000'/%3E%3C/svg%3E")`,
              backgroundSize: '80px',
            }}
          />
        </div>

        {/* Contenido principal */}
        <div className="relative z-30 max-w-7xl px-6 mx-auto pt-28 pb-14 md:pt-40 md:pb-20 flex flex-col items-center">
          {/* Badde superior */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200 px-4 py-1.5 rounded-full mb-6 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-[0.28em]">
              Tu próximo trámite puede ser más simple
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.h2
            id="footer-cta-title"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-center text-4xl md:text-[5rem] font-[950] text-slate-950 leading-[0.95] mb-6 tracking-[-0.06em]"
          >
            Resuelve lo legal.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F46C1D] via-[#D82465] to-purple-600">
              Sin perder tiempo.
            </span>
          </motion.h2>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-slate-500 max-w-2xl text-base md:text-xl leading-relaxed mb-10"
          >
            Empieza con el servicio que necesitas y deja que NoPay te guíe paso a paso:
            multas, marcas, permisos y soluciones legales digitales.
          </motion.p>

          {/* Formulario / CTA principal */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-2xl mb-10"
          >
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3 p-2 bg-white/70 backdrop-blur-3xl border border-slate-200 rounded-2xl md:rounded-full shadow-xl shadow-slate-200/50 transition-all hover:border-rose-200">
              <div className="flex items-center flex-1 px-4 w-full">
                <Mail className="w-5 h-5 text-slate-400 mr-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo para orientación inicial"
                  className="w-full py-3 bg-transparent border-none outline-none text-slate-900 text-base placeholder:text-slate-400"
                  required
                  aria-label="Correo electrónico"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-slate-950 text-white hover:bg-rose-600 font-black px-8 py-3 rounded-xl md:rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-900/20"
              >
                Resolver mi caso <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Mensaje de éxito temporal */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm text-emerald-600 mt-3"
                >
                  ✅ ¡Gracias! Te contactaremos pronto.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Grid de Beneficios con mejor contraste visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mb-10">
            {BENEFITS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index }}
                  className="group rounded-[2rem] bg-white/80 border border-slate-100 p-5 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-100"
                >
                  <div className={`mx-auto mb-3 w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Enlaces rápidos a servicios con descripción */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group relative inline-flex flex-col items-center gap-1 rounded-2xl bg-white/80 border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {service.title}
                  </div>
                  <span className="text-[10px] font-normal text-slate-400 group-hover:text-rose-400 transition">
                    {service.description}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mensaje de confianza final */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center text-xs text-slate-400 border-t border-slate-200 pt-8 mt-4"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center gap-1">✅ 100% digital</span>
              <span className="inline-flex items-center gap-1">🔒 Datos protegidos</span>
              <span className="inline-flex items-center gap-1">⚖️ Respaldo legal humano</span>
            </div>
            <p className="mt-3">
              NoPay LegalTech · Más de 1,000+ casos resueltos en Ecuador
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Componente auxiliar para animaciones de presencia
const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};