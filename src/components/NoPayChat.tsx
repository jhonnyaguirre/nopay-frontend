'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizonal, X, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getWizardToken } from 'lib/seguridad/sessionUtils';
import { API_BASE_URL } from 'config/apiConfig';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const STORAGE_KEY = 'nopay_chat_messages';
const MAX_AI_CONTEXT_MESSAGES = 3;

export default function NoPayChat({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[];
        setMessages(
          parsed.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setMessages([
      {
        id: 'welcome',
        content:
          '¡Hola! Soy tu asistente legal NoPay. ¿En qué proceso legal te puedo asistir?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, [visible]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const buildPreguntaConContexto = (
    historialActual: Message[],
    preguntaActual: string
  ) => {
    const historialSinBienvenida = historialActual.filter(
      (m) => m.id !== 'welcome'
    );

    const ultimasRespuestasIA = historialSinBienvenida
      .filter((m) => !m.isUser)
      .slice(-MAX_AI_CONTEXT_MESSAGES);

    const contextoTexto = ultimasRespuestasIA
      .map((m, index) => `Respuesta previa IA ${index + 1}: ${m.content}`)
      .join('\n\n');

    if (!contextoTexto) {
      return preguntaActual;
    }

    return `
Contexto previo de esta conversación:
${contextoTexto}

Pregunta actual del usuario:
${preguntaActual}

Instrucción:
Responde considerando el contexto previo, pero enfócate principalmente en la pregunta actual.
`.trim();
  };

  const sendMessage = async () => {
    const preguntaActual = input.trim();

    if (!preguntaActual || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: preguntaActual,
      isUser: true,
      timestamp: new Date(),
    };

    const historialActualizado = [...messages, userMessage];

    setMessages(historialActualizado);
    setInput('');
    setLoading(true);
    setIsTyping(true);

    try {
      const token = getWizardToken();

      const preguntaParaApi = buildPreguntaConContexto(
        messages,
        preguntaActual
      );

      const res = await fetch(`${API_BASE_URL}/nopaychat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pregunta: preguntaParaApi,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data = await res.json();

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: data.respuesta || 'No se pudo obtener respuesta.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: 'Error al conectar con el asistente NoPay.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);

    setMessages([
      {
        id: 'welcome',
        content:
          '¡Hola! Soy tu asistente legal NoPay. ¿En qué proceso legal te puedo asistir?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative flex flex-col h-[80vh] border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-pink-600 to-pink-500 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 5,
                    duration: 1.5,
                  }}
                  className="p-2 bg-white/20 rounded-full"
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>

                <div>
                  <h1 className="text-xl font-bold text-white">
                    Asistente Legal NoPay
                  </h1>
                  <p className="text-xs text-white/80">
                    {isTyping ? 'Escribiendo...' : 'En línea'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Limpiar
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
                  aria-label="Cerrar chat"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.isUser
                        ? 'bg-pink-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && (
                        <div className="flex-shrink-0 mt-1 p-1.5 bg-pink-100 rounded-full">
                          <Bot className="w-4 h-4 text-pink-600" />
                        </div>
                      )}

                      <div className="flex-1">
                        {!message.isUser && (
                          <p className="text-xs font-semibold text-pink-600 mb-1">
                            NOPAY Asistente
                          </p>
                        )}

                        <div
                          className={`prose ${
                            message.isUser ? 'prose-invert' : 'text-black'
                          } prose-sm max-w-none`}
                        >
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>

                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {message.isUser && (
                        <div className="flex-shrink-0 mt-1 p-1.5 bg-pink-700 rounded-full">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
              <div className="relative">
                <textarea
                  rows={2}
                  className="w-full p-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe tu situación legal aquí..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`absolute right-3 bottom-3 p-2 rounded-full ${
                    loading || !input.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-pink-600 text-white hover:bg-pink-700 shadow-md hover:shadow-lg transition-all'
                  }`}
                  aria-label="Enviar mensaje"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <SendHorizonal className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">
                NoPay Legal protege tu privacidad. Las consultas son
                confidenciales.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}