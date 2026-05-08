'use client';

import React from 'react';
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
} from 'lucide-react';
import Link from 'next/link';
import NoPayBackground from 'components/NoPayBackground';

export default function EliteLegalFooterFusion() {
  const benefits = [
    { icon: Clock3, title: 'Rápido', text: 'Empieza tu trámite en minutos.' },
    { icon: ShieldCheck, title: 'Seguro', text: 'Tus datos se manejan con privacidad.' },
    { icon: Scale, title: 'Legaltech', text: 'IA + enfoque legal profesional.' },
  ];

  const services = [
    { icon: Car, title: 'Impugnar multa', href: '/Servicios/Impugnacion' },
    { icon: Landmark, title: 'Registrar marca', href: '/Servicios/Marcas' },
    { icon: UserCheck, title: 'Permiso de salida', href: '/Servicios/PermisoSalida' },
  ];

  return (
    /* 1. SECCIÓN PRINCIPAL: Totalmente transparente para dejar ver el fondo fixed */
    <section className="relative w-full bg-transparent">
      
      {/* 2. EL FONDO INMUTABLE: Lo llamamos aquí para que viva en esta sección 
          o asegúrate de que esté en tu layout.tsx con z-index negativo. 
      */}
      <NoPayBackground />

      <div className="relative overflow-hidden">
        
        {/* 3. CURVA INTEGRADORA BLANCA: 
            Dibuja el color blanco SOLO en la parte superior para empatar 
            con la sección de arriba y se vuelve transparente hacia abajo.
        */}
        <div className="absolute top-0 left-0 w-full z-20 leading-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[60px] md:h-[100px]"
          >
            <path
              d="M0,0 C300,120 400,-20 600,60 C800,140 900,20 1200,80 L1200,0 L0,0 Z"
              fill="white" 
            />
          </svg>
        </div>

        {/* 4. CAPAS DE DISEÑO: Usamos opacidades bajas para no tapar las balanzas */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D82465_0%,#F46C1D_40%,transparent_85%)] opacity-[0.12]" />
          {/* Degradado que nace desde el blanco de la curva y se vuelve transparente */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent h-64" />
        </div>

        {/* CONTENIDO PRINCIPAL (Z-30) */}
        <div className="relative z-30 max-w-7xl px-6 mx-auto pt-32 pb-14 md:pt-48 md:pb-20 flex flex-col items-center">
          
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

          <motion.h2
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

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-slate-600 max-w-2xl text-base md:text-xl leading-relaxed mb-10"
          >
            Empieza con el servicio que necesitas y deja que NoPay te guíe paso a paso.
          </motion.p>

          {/* Formulario con Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-2xl mb-10"
          >
            <div className="flex flex-col md:flex-row items-center gap-3 p-2 bg-white/60 backdrop-blur-3xl border border-white/40 rounded-2xl md:rounded-full shadow-2xl shadow-slate-200/50 transition-all hover:border-rose-200">
              <div className="flex items-center flex-1 px-4 w-full">
                <Mail className="w-5 h-5 text-slate-400 mr-2" />
                <input
                  type="email"
                  placeholder="Tu correo para orientación inicial"
                  className="w-full py-3 bg-transparent border-none outline-none text-slate-900 text-base placeholder:text-slate-400"
                />
              </div>

              <Link
                href="/Servicios"
                className="w-full md:w-auto bg-slate-950 text-white hover:bg-rose-600 font-black px-8 py-3 rounded-xl md:rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-900/20"
              >
                Resolver mi caso <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Grid de Beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
            {benefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index }}
                  className="rounded-[2rem] bg-white/50 backdrop-blur-sm border border-white/40 p-5 shadow-sm text-center hover:bg-white/80 transition-all"
                >
                  <div className="mx-auto mb-3 w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Accesos rápidos */}
          <div className="flex flex-wrap justify-center gap-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 px-5 py-3 text-sm font-black text-slate-700 hover:text-[#D82465] hover:border-rose-200 transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                  {service.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}