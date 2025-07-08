'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayBackground from 'components/NoPayBackground';

export default function ContactoPage() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  // Fondo partículas animadas
   
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Solo genera partículas cuando está montado en cliente
   


  // Panel izquierdo: Highlights de atención y confianza
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

  // Panel derecho: Tarjetas de contacto
  const contacts = [
    {
      title: 'WhatsApp',
      icon: Phone,
      desc: (
        <>
          <div className="font-semibold text-pink-600">+593 97 9937186</div>
          <div className="text-xs text-gray-600">Escríbenos las 24 horas, 7 días a la semana</div>
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

  // Botón (si lo necesitas, puedes hacer un callback aquí)
  const gridRef = useRef<HTMLDivElement>(null);
  const [buttonEnabled, setButtonEnabled] = useState(true); // Siempre true para contacto

  const handleAccept = () => window.open('https://wa.me/593979937186', '_blank');

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] overflow-x-hidden">
      <NoPayBackground />
      {/* Fondo partículas */}
       
      {/* SVG decorativos */}
       

      <Header />

      <div className="h-8" />   {/* Espacio en blanco vertical, puedes cambiar h-8 por h-12 o h-16 si quieres más */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 px-4 z-10"
      >


      </motion.div>

      {/* Hero */}
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

      {/* Paneles */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col lg:flex-row gap-8 lg:gap-12 container mx-auto px-4 sm:px-6 mb-16 z-10"
      >
        {/* Panel izquierdo */}
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
                {highlights.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{
                      x: 5,
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-pink-200"
                  >
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-2 rounded-lg shadow-inner">
                      <item.icon className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{item.label}</span>
                      <div className="text-gray-500 text-sm">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Panel derecho (tarjetas de contacto) */}
        <motion.div className="w-full lg:w-2/3 flex flex-col h-full">
          <div className="h-[50vh] md:h-[60vh] overflow-y-auto pr-1" ref={gridRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {contacts.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ delay: idx * 0.13 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white shadow-sm hover:shadow-md rounded-xl border border-gray-100 hover:border-pink-200 overflow-hidden group relative transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5 flex flex-row gap-2 items-center">
                      <item.icon className="h-5 w-5 text-pink-600" />
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
          <CardFooter className="px-8 py-5 border-t border-gray-200 bg-white/60 flex justify-end gap-4">
            <Button
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-semibold rounded-xl transition-all bg-pink-600 text-white hover:bg-pink-500"
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
