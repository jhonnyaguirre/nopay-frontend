'use client';

import { motion } from 'framer-motion';
import { PhoneCall, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';

const Contacto = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="w-full max-w-3xl"
        >
          <Card className="relative backdrop-blur-xl bg-white/90 border border-gray-100 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="px-8 pt-8 pb-4 border-b border-gray-200 bg-white/60 text-center">
              <PhoneCall className="h-10 w-10 text-pink-600 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold text-gray-800">
                Contáctanos
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Estamos aquí para ayudarte
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 py-6 text-gray-700 text-sm leading-relaxed space-y-6">
              <p>
                Si tienes dudas, necesitas asistencia con un trámite, o deseas comunicarte con nuestro equipo legal, puedes contactarnos directamente a través de los siguientes canales:
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <PhoneCall className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base text-gray-900 mb-1">WhatsApp</h2>
                    <p>las 24 horas, los 7 días de la semana</p>
                    <a
                      href="https://wa.me/593979937186?text=Hola,%20quiero%20asistencia%20con%20un%20tema%20legal."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 font-semibold hover:underline"
                    >
                      +593 97 9937186 — Escríbenos
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base text-gray-900 mb-1">Correo Electrónico</h2>
                    <p>Consultas generales o soporte técnico:</p>
                    <a
                      href="mailto:softcorpecu@gmail.com"
                      className="text-blue-700 font-semibold hover:underline"
                    >
                      softcorpecu@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-yellow-100">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base text-gray-900 mb-1">Dirección Legal</h2>
                    <p>Cuenca - Ecuador<br />Disponible solo con cita previa</p>
                  </div>
                </div>
              </div>

              <p className="text-center font-medium text-gray-800 mt-6">
                Todos nuestros canales están respaldados por los abogados expertos de NoPay.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Contacto;
