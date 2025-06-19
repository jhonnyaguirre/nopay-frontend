'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, Lock, User, Gavel } from 'lucide-react';
import Link from 'next/link';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';

export default function LoginAbogadosPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulación de validación
    setTimeout(() => {
      setError('Credenciales incorrectas. Por favor verifique sus datos.');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#7F1D1D]/90 via-[#EC4899]/80 to-[#F59E0B]/90 text-white">
      <Header />

      <section className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/15 rounded-3xl p-10 shadow-2xl shadow-[#EC4899]/20 relative overflow-hidden"
        >
          {/* Efecto de acento decorativo */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#F59E0B]/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#EC4899]/20 rounded-full filter blur-3xl"></div>

          {/* Encabezado premium */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="p-3 bg-gradient-to-br from-[#7F1D1D] to-[#EC4899] rounded-full shadow-lg mb-4">
              <Gavel className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
              <span className="bg-gradient-to-r from-white via-[#F3F4F6] to-white bg-clip-text text-transparent">
                Acceso Exclusivo
              </span>
            </h1>
            <p className="text-sm text-white/70 mt-2">Panel profesional para abogados</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Campo Usuario */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">Usuario</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#7F1D1D]/30 to-[#EC4899]/30 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-50"></div>
                <div className="relative flex items-center bg-white/5 border border-white/15 rounded-xl group-hover:border-[#F59E0B]/50 transition-all">
                  <User className="absolute left-4 text-white/70 h-4 w-4" />
                  <input
                    type="text"
                    className="w-full bg-transparent py-3 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-0"
                    placeholder="usuario@dominio.com"
                  />
                </div>
              </div>
            </motion.div>

            {/* Campo Contraseña */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#EC4899]/30 to-[#F59E0B]/30 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-50"></div>
                <div className="relative flex items-center bg-white/5 border border-white/15 rounded-xl group-hover:border-[#EC4899]/50 transition-all">
                  <Lock className="absolute left-4 text-white/70 h-4 w-4" />
                  <input
                    type="password"
                    className="w-full bg-transparent py-3 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-0"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </motion.div>

            {/* Mensaje de error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 bg-[#7F1D1D]/30 border border-[#EC4899]/30 rounded-lg p-3 text-sm"
                >
                  <AlertCircle className="h-4 w-4 text-[#EC4899] mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón de acceso */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-500 shadow-lg ${isSubmitting
                    ? 'bg-[#7F1D1D]/70 text-white/70'
                    : 'bg-gradient-to-r from-[#7F1D1D] to-[#EC4899] hover:from-[#EC4899] hover:to-[#F59E0B] text-white hover:shadow-xl hover:shadow-[#EC4899]/30'
                  } relative overflow-hidden`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Verificando...
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    ACCEDER AL SISTEMA
                  </span>
                )}
                <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </motion.div>
          </form>

          {/* Enlace de recuperación */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <Link
              href="#"
              className="text-sm text-white/70 hover:text-white transition-colors relative inline-block"
            >
              <span>¿Problemas con el acceso?</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.div>
        </motion.div>
      </section>
      <NoPayChatLauncher />
      <Footer />
    </main>
  );
}