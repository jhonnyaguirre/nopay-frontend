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

export default function PoliticasEnvioEntregaPage() {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  // Partículas de fondo
  const particleCount = isMobile ? 14 : isTablet ? 22 : 32;
  const particles = useMemo(() =>
    Array.from({ length: particleCount }).map(() => ({
      size: Math.random() * (isMobile ? 4 : 8) + 3,
      xPct: Math.random() * 100,
      yPct: Math.random() * 100,
      xOffset: Math.random() * (isMobile ? 40 : 120) - (isMobile ? 20 : 60),
      yOffset: Math.random() * (isMobile ? 40 : 120) - (isMobile ? 20 : 60),
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    })),
    [particleCount, isMobile]);

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
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-pink-100"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.xPct}%`,
              top: `${p.yPct}%`,
              opacity: p.opacity,
            }}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, p.xOffset, 0],
              y: [0, p.yOffset, 0],
              opacity: [p.opacity, p.opacity * 0.5, p.opacity],
            }}
            transition={{
              delay: p.delay,
              duration: p.duration,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      {/* SVG decorativos */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute -left-20 top-1/4 w-48 h-48 opacity-20 z-0"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 120, ease: 'linear' }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#7F1D1D"
                d="M45.2,-58.3C58.3,-48.1,68.5,-32.8,71.9,-15.8C75.3,1.2,71.9,20,60.6,35.2C49.3,50.4,30.2,62,8.9,68.3C-12.4,74.6,-35.9,75.6,-52.5,64.9C-69.1,54.2,-78.8,31.8,-78.9,9.9C-79,-12,-69.5,-33.6,-54.3,-44.6C-39.1,-55.6,-18.3,-56.1,0.5,-56.6C19.3,-57.1,38.6,-57.6,45.2,-58.3Z"
                transform="translate(100 100)"
              />
            </svg>
          </motion.div>
          <motion.div
            className="absolute -right-20 bottom-1/4 w-48 h-48 opacity-20 z-0"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 100, ease: 'linear' }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#EC4899"
                d="M42.5,-54.1C55.1,-45.5,65.3,-32.6,68.4,-17.8C71.5,-3,67.5,13.7,58.3,28.3C49.1,42.9,34.7,55.4,17.4,63.9C0,72.4,-20.3,76.9,-36.5,69.1C-52.7,61.3,-64.7,41.2,-68.8,20.5C-72.9,-0.2,-69.1,-21.5,-57.7,-36.3C-46.3,-51.1,-27.3,-59.4,-8.8,-55.1C9.7,-50.8,19.4,-33.9,42.5,-54.1Z"
                transform="translate(100 100)"
              />
            </svg>
          </motion.div>
        </>
      )}

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
