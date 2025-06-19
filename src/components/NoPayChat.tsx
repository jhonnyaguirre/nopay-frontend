'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizonal, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getWizardToken } from 'lib/seguridad/sessionUtils';
import { API_BASE_URL } from 'config/apiConfig';

export default function NoPayChat({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarPregunta = async () => {
    if (!pregunta.trim()) return;
    setCargando(true);

    try {
      const token = getWizardToken(); // Obtener el token actual
      console.log('Se manda a llamar');
      const res = await fetch(`${API_BASE_URL}/nopaychat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pregunta })
      });

      const data = await res.json();
      setRespuesta(data.respuesta || 'No se pudo obtener respuesta.');
    } catch (error) {
      setRespuesta('Error al conectar con el asistente NoPay.');
    } finally {
      setCargando(false);
      setPregunta(''); // Limpiamos el texto de la pregunta después de enviar
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#7F1D1D] via-[#9F1D7F] to-[#B45309] text-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full relative flex flex-col h-[80vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Cerrar chat"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-full">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                Asistente Legal NoPay
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
              {respuesta && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-yellow-300 mb-2">NOPAY Responde:</p>
                      <div className="prose prose-invert prose-sm max-w-none text-white/90">
                        <ReactMarkdown>{respuesta}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-auto space-y-4">
              <textarea
                rows={3}
                className="w-full p-4 rounded-xl border-2 border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/30 transition-all resize-none"
                placeholder="Describe tu situación legal aquí..."
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                disabled={cargando}
              />

              <button
                onClick={enviarPregunta}
                disabled={cargando || !pregunta.trim()}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${cargando || !pregunta.trim()
                  ? 'bg-gray-500/30 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow-lg hover:shadow-yellow-400/20'
                  }`}
              >
                {cargando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Consultando...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="w-5 h-5" />
                    Consultar a NoPay
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}