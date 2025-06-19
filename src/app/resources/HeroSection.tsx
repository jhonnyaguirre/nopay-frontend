'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { BadgeCheck, ArrowRight, Shield, BarChart2, Users, FileText, Headphones, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const EliteLegalHero = () => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 300], [0, 80]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = Array.from({ length: 30 }).map((_, i) => {
    const seed = i * 100;
    const x = (seed * 13) % 100;
    const y = (seed * 29) % 100;
    const size = 4 + (i % 7);
    const opacity = 0.1 + (i % 10) * 0.03;

    return {
      id: i,
      x,
      y,
      size,
      opacity,
      targetY: (y + 30) % 100,
      targetX: (x + 20) % 100,
      duration: 15 + (i % 10)
    };
  });

  return (
    <section className="relative bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white overflow-hidden">
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white/10"
              initial={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity
              }}
              animate={{
                y: [`${particle.y}%`, `${particle.targetY}%`, `${particle.y}%`],
                x: [`${particle.x}%`, `${particle.targetX}%`, `${particle.x}%`],
                transition: {
                  duration: particle.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full max-w-6xl px-4 py-32 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6 shadow border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <BadgeCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Automatiza tu defensa, con estilo NoPay</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#EC4899] to-[#F59E0B]">
              Resuelve tus trámites legales<br /> sin perder tiempo
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Apelaciones, reclamos y más en minutos. Nuestra tecnología acelera el proceso;<br className="hidden sm:inline" /> abogados expertos lo validan.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link href="/Servicios">
              <button className="bg-white text-[#7F1D1D] px-8 py-4 font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                Evaluar mi caso
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="#demo">
              <button className="border-2 border-white/50 text-white px-8 py-4 font-semibold rounded-xl hover:bg-white/10 transition-all">
                Ver demostración
              </button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-6 mt-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
          {[
            { icon: <BarChart2 className="h-8 w-8" />, title: "Procesos optimizados", desc: "Automatización guiada por datos reales" },
            { icon: <Shield className="h-8 w-8" />, title: "Seguridad Legal", desc: "Protección total y respaldo jurídico" },
            { icon: <Check className="h-8 w-8" />, title: "Efectividad Validada", desc: "Trámites con resultados comprobables" },
            { icon: <Users className="h-8 w-8" />, title: "Abogados Especialistas", desc: "Supervisión profesional en cada caso" },
            { icon: <FileText className="h-8 w-8" />, title: "Transparencia Absoluta", desc: "Sigue tu proceso paso a paso" },
            { icon: <Headphones className="h-8 w-8" />, title: "Asistencia en línea", desc: "Soporte sin burocracia, cuando lo necesitas" }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/10 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
            >
              <div className="bg-white/10 p-3 rounded-full w-max text-white mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white/90">{item.title}</h3>
              <p className="text-white/80 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default EliteLegalHero;
