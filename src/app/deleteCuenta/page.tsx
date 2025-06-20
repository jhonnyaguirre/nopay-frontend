'use client';

import { motion } from 'framer-motion';
import { Trash2, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';

export default function DataDeletionInstructions() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] flex flex-col overflow-hidden">
      {/* Fondo decorativo: partículas dinámicas */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [0, Math.random() * 120 + 80],
              x: Math.random() * 100 - 50
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <Header />

      <div className="h-14" />   {/* ← espacio en blanco de 2rem */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative overflow-hidden"
        >
          {/* Efectos de luz internos */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#EC4899]/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#F59E0B]/20 rounded-full blur-[120px]"></div>

          {/* Encabezado */}
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="p-3 bg-gradient-to-br from-[#EC4899] to-[#F59E0B] rounded-xl shadow-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                Eliminación de Datos (Facebook Login)
              </h1>
              <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                <ShieldCheck className="w-4 h-4" />
                Tu privacidad es prioridad en NoPay
              </p>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="relative z-10">
            <p className="text-white/80 mb-8 leading-relaxed">
              En <span className="font-bold text-white">NoPay</span> valoramos profundamente tu privacidad y el manejo responsable de tus datos. Si deseas eliminar los datos vinculados a tu cuenta de Facebook, sigue estas sencillas instrucciones:
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-xl p-6 mb-8"
            >
              <h2 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-[#EC4899] rounded-full text-sm">1</span>
                ¿Cómo solicitar la eliminación?
              </h2>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-white mt-1" />
                  <span className="text-white/80">
                    Envía un correo a <span className="font-medium text-white">soporte@nopaylegal.com</span> con el asunto: <span className="px-2 py-1 bg-white/10 rounded text-white">Eliminar datos Facebook</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-white mt-1" />
                  <span className="text-white/80">
                    Incluye tu <span className="font-medium text-white">correo</span> o <span className="font-medium text-white">UID de Facebook</span> asociado a la cuenta.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-white mt-1" />
                  <span className="text-white/80">
                    Te confirmaremos la eliminación en un máximo de <span className="font-medium text-white">72 horas</span>.
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-3 bg-gradient-to-r from-[#EC4899]/10 to-[#F59E0B]/10 border border-[#EC4899]/20 rounded-lg p-4"
            >
              <div className="p-2 bg-gradient-to-br from-[#EC4899] to-[#F59E0B] rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Contacto directo</p>
                <p className="text-white font-medium">soporte@nopaylegal.com</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
      <NoPayChatLauncher />
    </div>
  );
}
