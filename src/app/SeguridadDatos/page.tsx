'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { ShieldCheck, Lock, FileText, UserCheck, Globe, PhoneCall, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from 'components/ui/Button';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';

export default function SeguridadDatosPage() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const router = useRouter();

  // Partículas de fondo mejoradas
  const particleCount = isMobile ? 15 : isTablet ? 25 : 40;
  const particles = useMemo(
    () =>
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
    [particleCount, isMobile]
  );

  // Características premium para panel izquierdo
  const premiumFeatures = [
    { icon: FileText, label: 'Transparencia total', desc: 'Acceso claro a cómo usamos tus datos' },
    { icon: ShieldCheck, label: 'Encriptación AES-256', desc: 'Protección bancaria para tu información' },
    { icon: PhoneCall, label: 'Soporte exclusivo', desc: 'Asesoría personalizada en privacidad' },
    { icon: Globe, label: 'Cumplimiento global', desc: 'Normativas GDPR y más' },
  ];

  // Principios de seguridad para panel derecho
  const securityPrinciples = [
    {
      title: 'Principio de Confidencialidad',
      icon: <Lock className="h-5 w-5 text-pink-600" />, 
      content:
        'Toda información ingresada en la plataforma es tratada con estricta confidencialidad. Implementamos protocolos de seguridad para evitar accesos no autorizados y garantizamos que ningún dato será compartido sin consentimiento expreso del usuario, salvo disposición legal.',
    },
    {
      title: 'Cifrado y Seguridad Tecnológica',
      icon: <ShieldCheck className="h-5 w-5 text-pink-600" />, 
      content:
        'NoPay utiliza cifrado AES-256 y conexiones HTTPS para proteger la información durante el tránsito y almacenamiento. Nuestros servidores están monitoreados permanentemente y aplicamos prácticas de desarrollo seguro.',
    },
    {
      title: 'Derechos de los Usuarios',
      icon: <UserCheck className="h-5 w-5 text-pink-600" />, 
      content:
        'Conforme al artículo 66 numeral 19 de la Constitución, y la Ley de Protección de Datos, nuestros usuarios tienen derecho a acceder, rectificar, actualizar, eliminar, oponerse y portar sus datos personales. Este ejercicio puede realizarse enviando una solicitud a soporte@nopay.ec.',
    },
    {
      title: 'Custodia de Evidencia Legal',
      icon: <FileText className="h-5 w-5 text-pink-600" />, 
      content:
        'En los casos de impugnación, los documentos subidos, imágenes y datos adjuntos se almacenan de forma segura y se conservan conforme a las obligaciones legales o contractuales vigentes, como respaldo de la trazabilidad del proceso legal automatizado.',
    },
    {
      title: 'Uso Ético y Legal',
      icon: <Globe className="h-5 w-5 text-pink-600" />, 
      content:
        'La plataforma ha sido diseñada conforme a principios de legalidad, proporcionalidad y minimización de datos. Únicamente se recaban los datos necesarios para el cumplimiento del servicio solicitado por el usuario.',
    },
  ];

  const handleAccept = () => router.push('/');
  const handleCancel = () => router.back();

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] overflow-x-hidden">
      {/* Fondo de partículas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-pink-100"
            style={{ width: p.size, height: p.size, left: `${p.xPct}%`, top: `${p.yPct}%`, opacity: p.opacity }}
            initial={{ y: 0, x: 0 }}
            animate={{ y: [0, p.yOffset, 0], x: [0, p.xOffset, 0], opacity: [p.opacity, p.opacity * 0.5, p.opacity] }}
            transition={{ delay: p.delay, duration: p.duration, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Blobs SVG decorativos */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute -left-20 top-1/4 w-48 h-48 opacity-20"
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
            className="absolute -right-20 bottom-1/4 w-48 h-48 opacity-20"
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

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 lg:py-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 px-2"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 inline-block relative group"
            whileHover={{ scale: 1.02 }}
          >
            Seguridad y <span className="text-pink-600">Protección de Datos</span>
            <motion.div
              className="absolute -bottom-1 left-0 w-full h-2 bg-pink-100 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            />
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Comprometidos con tu privacidad y la seguridad jurídica de tu información.
            <motion.span
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-pink-200 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            />
          </motion.p>
        </motion.div>

        {/* Layout Panels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-stretch"
        >
          {/* Panel Izquierdo — Premium Card */}
          <motion.div
            style={!isMobile ? { scale } : {}}
            className="w-full lg:w-1/3 flex flex-col justify-center space-y-6 md:space-y-8 h-full"
          >
            <div className="bg-white p-6 sm:p-8 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border border-gray-100 h-full flex flex-col justify-between relative overflow-hidden group">
              {/* Efectos de fondo premium */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-6 -top-6 w-20 h-20 md:-right-10 md:-top-10 md:w-32 md:h-32 bg-pink-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute -left-6 -bottom-6 w-24 h-24 md:-left-10 md:-bottom-10 md:w-40 md:h-40 bg-pink-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-pink-50 opacity-90" />
              </div>
              <div className="relative z-10">
                <motion.div
                  className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-md"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </motion.div>
                <motion.h2
                  className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-2"
                  whileHover={{ scale: 1.02 }}
                >
                  Protección de Datos <span className="text-pink-600">Premium</span>
                </motion.h2>
                <motion.p
                  className="text-gray-600 text-center text-sm md:text-base mb-6 md:mb-8"
                  whileHover={{ scale: 1.01 }}
                >
                  Implementamos los más altos estándares de seguridad para proteger tu información.
                </motion.p>
                <motion.div
                  className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg md:rounded-xl p-3 md:p-4 mb-6 md:mb-8 border border-pink-200 shadow-inner"
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-center text-xs md:text-sm text-pink-700 font-medium">
                    <span className="inline-block bg-white px-2 py-1 rounded-md shadow-sm">🔒 Certificado</span> bajo estándares internacionales de protección de datos
                  </p>
                </motion.div>
              </div>
              <div className="mt-6 md:mt-8 space-y-4 md:space-y-5 relative z-10">
                {premiumFeatures.map((f, i) => (
                  <motion.div
                    key={i}
                    whileHover={!isMobile ? { x: 5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' } : {}}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="flex items-start gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-gray-100 hover:border-pink-200 transition-colors"
                  >
                    <motion.div
                      className="bg-gradient-to-br from-pink-100 to-pink-200 p-2 md:p-2.5 rounded-md md:rounded-lg shadow-inner flex-shrink-0"
                      whileHover={{ rotate: 5 }}
                    >
                      <f.icon className="h-4 w-4 md:h-5 md:w-5 text-pink-600" />
                    </motion.div>
                    <div>
                      <span className="text-gray-800 font-medium block text-sm md:text-base">{f.label}</span>
                      <span className="text-gray-500 text-xs md:text-sm block mt-0.5 md:mt-1">{f.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Panel Derecho — Grid de Principios */}
          <motion.div className="w-full lg:w-2/3 flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-grow">
              <AnimatePresence>
                {securityPrinciples.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: isMobile ? '0px' : '50px' }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={!isMobile ? { y: -5, boxShadow: '0 10px 25px -5px rgba(236,72,153,0.1)' } : {}}
                    className="h-full"
                  >
                    <Card className="h-full bg-white shadow-sm hover:shadow-md rounded-xl md:rounded-2xl border border-gray-100 hover:border-pink-200 overflow-hidden group relative transition-all duration-300">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-pink-600"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white to-pink-50 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <CardHeader className="pb-2 px-5 md:px-6 pt-5 md:pt-6">
                        <div className="flex items-center gap-3 md:gap-4">
                          <motion.div className="bg-gradient-to-br from-pink-100 to-pink-200 p-2 rounded-lg shadow-inner" whileHover={{ rotate: 5 }}>
                            {item.icon}
                          </motion.div>
                          <CardTitle className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 md:px-6 pb-5 md:pb-6">
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{item.content}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Banner de actualización y acciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-pink-50 to-pink-100 p-5 md:p-6 rounded-xl md:rounded-2xl mt-8 md:mt-12 border border-pink-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <motion.div className="bg-gradient-to-br from-pink-200 to-pink-300 p-2 rounded-lg shadow-inner" whileHover={{ rotate: 10 }}>
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-pink-700" />
                </motion.div>
                <p className="font-medium text-sm md:text-base text-gray-800">
                  Última actualización: <span className="text-pink-600 font-semibold">Agosto 2025</span>
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleCancel} className="text-xs md:text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-pink-200 text-pink-600 font-medium hover:bg-pink-50 transition-colors">Cancelar</Button>
                <Button onClick={handleAccept} className="text-xs md:text-sm bg-gradient-to-br from-pink-600 to-pink-500 text-white px-4 py-2 rounded-lg shadow-sm font-medium hover:from-pink-500 hover:to-pink-400 transition-all">Aceptar y Continuar</Button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
