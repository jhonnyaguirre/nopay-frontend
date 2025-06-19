'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Hammer, Construction, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl w-full px-8 py-12 rounded-3xl border border-white/20 shadow-2xl bg-white/10 backdrop-blur-lg"
      >
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: [ -10, 10, -10 ] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-6"
        >
          <Construction className="w-16 h-16 mx-auto text-[#FACC15]" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow">
          Página en construcción
        </h1>
        <p className="text-white/80 text-lg sm:text-xl mb-6">
          Estamos trabajando para traerte una experiencia impecable. Por favor, vuelve más tarde o regresa al inicio.
        </p>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FACC15] text-[#7F1D1D] font-bold px-6 py-3 rounded-full shadow-md flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Ir al inicio
          </motion.button>
        </Link>
      </motion.div>

      <p className="mt-10 text-xs text-white/60">© {new Date().getFullYear()} NoPay EC. Todos los derechos reservados.</p>
    </main>
  );
}
