'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Wrench, ArrowLeft } from 'lucide-react';

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl px-10 py-16 text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white"
          >
            <Wrench className="w-14 h-14" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-extrabold mb-4">Página en construcción</h1>
        <p className="text-lg text-white/80 mb-8">
          Estamos trabajando en el motor de este servicio. Pronto estará listo para rodar.
        </p>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#7F1D1D] font-semibold px-6 py-3 rounded-full flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
}
