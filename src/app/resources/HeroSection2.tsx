'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const PremiumHeroSection = () => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityBg = useTransform(scrollY, [0, 300], [1, 0.8]);

  const features = [
    "Defensa Corporativa",
    "Procesos Burocráticos",
    "Recuperación Financiera",
    "Gestión de Subscripciones",
    "Protección Laboral",
    "Derechos del Consumidor",
    "Apelaciones de Tránsito",
    "Asesoría Legal 24/7",
  ];

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* Fondo con efecto parallax */}
      <motion.div
        className="absolute inset-0 bg-[url('/images/portada.png')] bg-cover bg-center will-change-transform"
        style={{ y: yBg, opacity: opacityBg, scale: 1.05 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent" />
      </motion.div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#E63946]/10 rounded-full blur-3xl animate-float1" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#0A1D3E]/10 rounded-full blur-3xl animate-float2" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl animate-float3" />
      </div>

      {/* Panel principal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full px-6 max-w-5xl mx-auto"
      >
        <div className="relative bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E63946] to-[#D4AF37] px-5 py-2 rounded-full shadow-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white tracking-wide">
                CERTIFICACIÓN LEGAL
              </span>
            </div>
          </div>

          {/* Título y subtítulo */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              <span className="block">Revolucionamos la</span>
              <span className="bg-gradient-to-r from-[#E63946] to-[#D4AF37] bg-clip-text text-transparent">
                defensa legal automatizada
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Nuestra inteligencia artificial especializada en legislación ecuatoriana aumenta en un 92% tus probabilidades de éxito en apelaciones de tránsito.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="flex flex-col items-center">
                    <Check className="h-5 w-5 text-[#E63946]" />
                    <span className="mt-2 text-sm font-medium text-white text-center">
                      {item}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/appeal">
                <button className="bg-gradient-to-r from-[#E63946] to-[#D4AF37] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-[1.02] transition flex items-center gap-2">
                  Analizar mi caso
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 hover:scale-[1.02] transition">
                Ver demostración
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PremiumHeroSection;
