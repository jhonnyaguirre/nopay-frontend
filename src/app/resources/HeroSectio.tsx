'use client';

import { motion } from 'framer-motion';

export default function HeroMockup() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] py-20 px-6 text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
        {/* Texto principal */}
        <div className="max-w-xl mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¿En qué podemos ayudarte hoy?
          </h1>
          <p className="text-lg text-white/90">
            Resuelve tus problemas legales o de consumo en minutos con inteligencia artificial.
          </p>
        </div>

        {/* Mockups animados */}
        <div className="relative flex items-center justify-center space-x-[-4rem]">
          {/* Mockup móvil */}
          <motion.img
            src="/mockup-mobile.png"
            alt="Mockup móvil"
            className="w-48 sm:w-60 z-20 shadow-2xl rounded-xl border border-white/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [20, 0, 20], opacity: 1 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Mockup escritorio */}
          <motion.img
            src="/mockup-desktop.png"
            alt="Mockup escritorio"
            className="w-72 sm:w-96 shadow-xl rounded-xl border border-white/20"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: [-20, 0, -20], opacity: 1 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-0 pointer-events-none" />
    </section>
  );
}