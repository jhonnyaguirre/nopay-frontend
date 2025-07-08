'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { Mail, PackageCheck, TimerReset, ClipboardList, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayBackground from 'components/NoPayBackground';

export default function PoliticasEnvioEntregaPage() {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  

  // Panel izquierdo: highlights de política de envío y entrega
  const highlights = [
    {
      icon: ClipboardList,
      label: 'Trazabilidad Total',
      desc: 'Cada envío está documentado y puede ser consultado por el usuario.',
    },
    {
      icon: TimerReset,
      label: 'Cumplimiento de Plazos',
      desc: 'El tiempo de entrega se pacta entre cliente y proveedor legal.',
    },
    {
      icon: PackageCheck,
      label: 'Mensajería Certificada',
      desc: 'Documentos físicos se envían con empresas reconocidas y seguimiento.',
    },
    {
      icon: Mail,
      label: 'Notificaciones Digitales',
      desc: 'Para servicios digitales, avisamos vía correo y panel online.',
    },
  ];

  // Panel derecho: tarjetas por ítem de la política
  const items = [
    {
      title: 'Documentación Física o Notificaciones Formales',
      icon: PackageCheck,
      text: 'En caso de servicios que requieran documentos físicos o notificaciones formales, el envío se realizará mediante mensajería certificada y seguimiento. Los tiempos se pactan entre cliente y proveedor legal.',
    },
    {
      title: 'Servicios Digitales',
      icon: Mail,
      text: 'Para servicios 100% digitales, la notificación se realiza por correo electrónico y dentro del panel de usuario en nuestra plataforma. Así garantizamos entrega inmediata y confirmación de recepción.',
    },
  ];

  // Scroll para habilitar botón
  const gridRef = useRef<HTMLDivElement>(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) setButtonEnabled(true);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleAccept = () => router.push('/');
  const handleCancel = () => router.back();

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] overflow-x-hidden">
      {/* Fondo partículas */}
      <NoPayBackground />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         
      </div>
      {/* SVG decorativos */}
      

      <Header />

      <div className="h-8" />   {/* Espacio en blanco vertical, puedes cambiar h-8 por h-12 o h-16 si quieres más */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 px-4 z-10"
      ></motion.div>

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
          Políticas de <span className="text-pink-600">Envío y Entrega</span>
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
          Consulta cómo gestionamos envíos, notificaciones y entrega de documentos.
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
                <PackageCheck className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Envío y Entrega
              </h2>
              <p className="text-gray-600 mb-8">
                Resumen de políticas para documentación y notificaciones.
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

        {/* Panel derecho (tarjetas por cada política) */}
        <motion.div className="w-full lg:w-2/3 flex flex-col h-full">
          <div className="h-[50vh] md:h-[65vh] overflow-y-auto pr-1" ref={gridRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ delay: idx * 0.12 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white shadow-sm hover:shadow-md rounded-xl border border-gray-100 hover:border-pink-200 overflow-hidden group relative transition-all duration-300">
                    <CardHeader className="pb-2 px-5 pt-5 flex flex-row gap-2 items-center">
                      <item.icon className="h-5 w-5 text-pink-600" />
                      <CardTitle className="text-base font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <p className="text-gray-700 text-sm">{item.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center font-medium text-gray-800 my-5">
              Estas políticas aplican a todos los servicios ofrecidos por NoPay Legal.
            </div>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-pink-50 to-pink-100 border-t border-pink-200 flex items-center justify-between">
            <Clock className="h-5 w-5 text-pink-700" />
            <span className="font-medium text-gray-800">Última actualización: Agosto 2025</span>
          </div>

        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
