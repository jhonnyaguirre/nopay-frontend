'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayBackground from 'components/NoPayBackground';

export default function ContactoPage() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    setMounted(true);

    const updateScreen = () => {
      const width = window.innerWidth;

      if (width <= 767) {
        setScreen('mobile');
      } else if (width >= 768 && width <= 1023) {
        setScreen('tablet');
      } else {
        setScreen('desktop');
      }
    };

    updateScreen();
    window.addEventListener('resize', updateScreen);

    return () => window.removeEventListener('resize', updateScreen);
  }, []);

  const isMobile = screen === 'mobile';

  const highlights = [
    {
      icon: ShieldCheck,
      label: 'Equipo Legal Calificado',
      desc: 'Atención directa por abogados expertos en cada consulta.',
    },
    {
      icon: Clock,
      label: 'Disponibilidad Total',
      desc: 'Respuesta inmediata en WhatsApp, 24/7.',
    },
    {
      icon: Mail,
      label: 'Soporte Personalizado',
      desc: 'Resolvemos dudas generales y técnicas por correo.',
    },
    {
      icon: MapPin,
      label: 'Atención Presencial',
      desc: 'Citas legales en Cuenca, solo previa coordinación.',
    },
  ];

  const contacts = [
    {
      title: 'WhatsApp',
      icon: Phone,
      desc: (
        <>
          <div className="font-semibold text-pink-600">+593 97 9937186</div>
          <div className="text-xs text-gray-600">
            Escríbenos las 24 horas, 7 días a la semana
          </div>
        </>
      ),
      extra: (
        <a
          href="https://wa.me/593979937186"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm bg-pink-600 text-white px-4 py-1.5 rounded-xl font-medium hover:bg-pink-500 transition"
        >
          Chatear por WhatsApp
        </a>
      ),
    },
    {
      title: 'Correo Electrónico',
      icon: Mail,
      desc: (
        <>
          <div className="font-semibold text-gray-800">softcorpecu@gmail.com</div>
          <div className="text-xs text-gray-600">Consultas generales o soporte técnico</div>
        </>
      ),
      extra: (
        <a
          href="mailto:softcorpecu@gmail.com"
          className="mt-3 inline-block text-sm bg-pink-50 text-pink-700 px-4 py-1.5 rounded-xl font-medium hover:bg-pink-100 transition"
        >
          Enviar Correo
        </a>
      ),
    },
    {
      title: 'Dirección Legal',
      icon: MapPin,
      desc: (
        <>
          <div className="font-semibold text-gray-800">Cuenca - Ecuador</div>
          <div className="text-xs text-gray-600">Disponible solo con cita previa</div>
        </>
      ),
      extra: (
        <span className="mt-3 inline-block text-xs text-gray-500 italic">
          Solicita tu cita para atención presencial.
        </span>
      ),
    },
  ];

  const gridRef = useRef<HTMLDivElement>(null);

  const handleAccept = () => {
    window.open('https://wa.me/593979937186', '_blank', 'noopener,noreferrer');
  };

  if (!mounted) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] overflow-x-hidden">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="h-10 w-72 max-w-full mx-auto rounded-xl bg-gray-200 animate-pulse mb-5" />
            <div className="h-5 w-full max-w-2xl mx-auto rounded-lg bg-gray-100 animate-pulse mb-12" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse"
                />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] overflow-x-hidden">
      <NoPayBackground />

      <Header />

      <div className="h-8" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 px-4 z-10"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 inline-block relative"
          whileHover={{ scale: 1.02 }}
        >
          Contáctanos

          <motion.div
            className="absolute -bottom-1 left-0 w-full h-2 bg-pink-100 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          />
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Estamos aquí para ayudarte. Elige tu canal favorito y recibe atención personalizada.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col lg:flex-row gap-8 lg:gap-12 container mx-auto px-4 sm:px-6 mb-16 z-10"
      >
        <motion.div className="w-full lg:w-1/3 flex flex-col justify-center space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden group">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-pink-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-pink-50 opacity-90" />
            </div>

            <div className="relative z-10 text-center">
              <motion.div
                className="bg-gradient-to-br from-pink-500 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Phone className="h-10 w-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Atención 100% Legal
              </h2>

              <p className="text-gray-600 mb-8">
                Todos nuestros canales están respaldados por los abogados expertos de NoPay.
              </p>

              <div className="space-y-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={`${item.label}-${index}`}
                    whileHover={
                      !isMobile
                        ? {
                            x: 5,
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                          }
                        : undefined
                    }
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-pink-200"
                  >
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-2 rounded-lg shadow-inner flex-shrink-0">
                      <item.icon className="h-5 w-5 text-pink-600" />
                    </div>

                    <div className="text-left">
                      <span className="font-medium text-gray-800">{item.label}</span>
                      <div className="text-gray-500 text-sm">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="w-full lg:w-2/3 flex flex-col h-full">
          <div
            className="h-auto md:h-[60vh] overflow-visible md:overflow-y-auto pr-1"
            ref={gridRef}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {contacts.map((item, index) => (
                <motion.div
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ delay: isMobile ? 0 : index * 0.13 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white shadow-sm hover:shadow-md rounded-xl border border-gray-100 hover:border-pink-200 overflow-hidden group relative transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5 flex flex-row gap-2 items-center">
                      <item.icon className="h-5 w-5 text-pink-600 flex-shrink-0" />

                      <CardTitle className="text-base font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-5 pb-5 flex flex-col items-start">
                      <div>{item.desc}</div>
                      {item.extra}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center font-medium text-gray-800 my-5">
              Responde un abogado experto en trámites y defensa legal.
            </div>
          </div>

          <CardFooter className="px-5 md:px-8 py-5 border border-gray-200 bg-white/70 rounded-xl mt-5 flex justify-center sm:justify-end gap-4">
            <Button
              onClick={handleAccept}
              className="w-full sm:w-auto px-6 py-2 text-sm font-semibold rounded-xl transition-all bg-pink-600 text-white hover:bg-pink-500"
            >
              Escribir por WhatsApp
            </Button>
          </CardFooter>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}