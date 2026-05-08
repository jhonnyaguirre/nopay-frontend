// EliteLegalHeroFusion.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BadgeCheck, ArrowRight, Shield, BarChart2, Users, FileText, Headphones, Check,
  Gavel, ShieldCheck, Zap, Scale, BookOpen, ChevronRight, Landmark, Briefcase, FileSearch
} from 'lucide-react';
import Link from 'next/link';
import ImpugnacionButton from 'components/ImpugnacionButton';

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

const EliteLegalHeroFusion = () => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 300], [0, 80]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative w-full bg-gradient-to-br from-[#D82465] via-[#F46C1D] to-[#FFD76F] text-white overflow-hidden">
      <svg
        className="absolute right-0 top-0 w-full md:w-[55%] h-full object-cover z-0"
        viewBox="0 0 600 800"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="shapeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
        <path
          d="M600,0 C520,120 580,240 480,320 C370,400 440,540 340,640 C240,740 360,840 200,900 C100,940 0,960 0,1080 L600,1080 Z"
          fill="url(#shapeGradient)"
        />
      </svg>

      <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-white rounded-t-[100%] z-10" />

      <div className="relative z-20 max-w-6xl px-4 sm:px-6 py-16 md:py-28 mx-auto flex flex-col items-start justify-center md:pl-12 lg:pl-28 text-left">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EC4899] to-[#F59E0B] px-4 py-1 md:px-6 md:py-2 rounded-full mb-4 md:mb-6 shadow-lg text-xs md:text-sm"
            custom={1}
            variants={textVariants}
          >
            <BadgeCheck className="h-4 w-4 md:h-5 md:w-5" />
            <span className="font-medium">¿Te detiene el papeleo? Dale “play” a tu defensa legal</span>
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight mb-4 md:mb-6 drop-shadow-md"
              custom={2}
              variants={textVariants}
            >
              Tu defensa legal en piloto automático, 
              <br />
              <span className="text-white">lista en 5 minutos</span>
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-xs md:text-base text-white/90 mb-6 md:mb-8 max-w-xl"
            custom={3}
            variants={textVariants}
          >
            Desde multas y apelaciones hasta reclamos complejos: Nuestra <span className="text-[#F59E0B] font-bold">plataforma combina IA</span> con abogados de élite  <span className="text-[#F59E0B] font-extrabold">para que nunca </span> vuelvas a perder un día en trámites.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row w-full max-w-lg gap-2 mb-6 md:mb-0"
          >
            <input
              type="email"
              placeholder="Email or phone number"
              className="flex-1 px-4 py-2 md:px-5 md:py-3 text-gray-800 placeholder-gray-400 bg-white focus:outline-none rounded-full sm:rounded-l-full sm:rounded-r-none text-xs md:text-sm"
            />
            <Link href="/Servicios" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 md:px-6 md:py-3 transition-all rounded-full sm:rounded-r-full sm:rounded-l-none w-full text-xs md:text-sm"
              >
                Ver Servicios
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 md:mt-10"
          >
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white text-xs md:text-sm font-medium">
              {[
                "🔍 Seguimiento 24/7",
                "🤖 Automatización inteligente",
                "💼 Abogados de élite",
                "🔒 Transparencia total",
                "🤝 Soporte ilimitado",
                "💻 Asistencia en línea"
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 md:h-5 md:w-5 text-[#F59E0B]" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-24 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {[
              { icon: <BarChart2 className="h-6 w-6 md:h-8 md:w-8" />, title: "Automatización inteligente", desc: "Acelera tus trámites con tecnología de punta.", color: "from-[#F59E0B] to-[#EC4899]" },
              { icon: <Shield className="h-6 w-6 md:h-8 md:w-8" />, title: "Respaldo jurídico integral", desc: "Protección legal precisa en cada etapa.", color: "from-[#EC4899] to-[#7F1D1D]" },
              { icon: <Check className="h-6 w-6 md:h-8 md:w-8" />, title: "Eficacia demostrada", desc: "Casos resueltos con resultados medibles.", color: "from-[#7F1D1D] to-[#F59E0B]" },
              { icon: <Users className="h-6 w-6 md:h-8 md:w-8" />, title: "Abogados Especialistas", desc: "Abogados con experiencia específica en tu tipo de trámite.", color: "from-[#EC4899] to-[#F59E0B]" },
              { icon: <FileText className="h-6 w-6 md:h-8 md:w-8" />, title: "Transparencia Absoluta", desc: "Visibilidad completa de tu expediente en tiempo real.", color: "from-[#7F1D1D] to-[#EC4899]" },
              { icon: <Headphones className="h-6 w-6 md:h-8 md:w-8" />, title: "Soporte inmediato", desc: "Atención legal 24/7 sin demoras ni burocracia.", color: "from-[#F59E0B] to-[#7F1D1D]" }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden bg-white/5 p-4 md:p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all backdrop-blur-sm hover:-translate-y-1 group"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`bg-gradient-to-r ${item.color} p-2 md:p-3 rounded-full w-max text-white mb-3 md:mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2 text-white">{item.title}</h3>
                  <p className="text-white/80 leading-relaxed text-xs md:text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <section id="tecnologia" className="relative py-16 md:py-28 overflow-hidden w-full">
            <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
               
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {[
                  {
                    icon: <Gavel className="h-8 w-8 md:h-10 md:w-10" />,
                    title: "Precisión Legal",
                    description: "Algoritmos entrenados con jurisprudencia actualizada para máxima exactitud",
                    color: "from-[#F59E0B] to-[#EC4899]",
                    delay: 0.2,
                    features: ["Jurisprudencia actualizada", "Análisis predictivo", "Resultados precisos"]
                  },
                  {
                    icon: <ShieldCheck className="h-8 w-8 md:h-10 md:w-10" />,
                    title: "Seguridad Máxima",
                    description: "Protección de datos con encriptación avanzada y protocolos estrictos",
                    color: "from-[#EC4899] to-[#7F1D1D]",
                    delay: 0.4,
                    features: ["Encriptación AES-256", "Cumplimiento RGPD", "Auditorías periódicas"]
                  },
                  {
                    icon: <Zap className="h-8 w-8 md:h-10 md:w-10" />,
                    title: "Velocidad",
                    description: "Respuestas en tiempo récord sin sacrificar calidad ni precisión",
                    color: "from-[#7F1D1D] to-[#F59E0B]",
                    delay: 0.6,
                    features: ["Procesamiento en minutos", "Automatización inteligente", "Actualizaciones en tiempo real"]
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay, duration: 0.6 }}
                    className="group relative overflow-hidden bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/10 hover:border-[#F59E0B]/50 transition-all hover:-translate-y-2 h-full"
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500`}></div>
                    <div className="relative z-10 h-full flex flex-col">
                      <div className={`bg-gradient-to-r ${item.color} p-2 md:p-3 rounded-full w-max mb-4 md:mb-6 mx-auto`}>
                        {item.icon}
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-center mb-3 md:mb-4">{item.title}</h3>
                      <p className="text-white/80 text-center mb-4 md:mb-6 text-xs md:text-sm">{item.description}</p>
                      <div className="mt-auto">
                        <ul className="space-y-1 md:space-y-2">
                          {item.features.map((feature, j) => (
                            <li key={j} className="flex items-center text-[11px] md:text-xs text-white/90">
                              <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-[#F59E0B]" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </main>
  );
};

export default EliteLegalHeroFusion;
