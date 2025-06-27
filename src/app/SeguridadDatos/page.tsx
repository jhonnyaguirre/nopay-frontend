'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../../components/ui/Card';
import { Header } from 'app/resources/Header';
import { Button } from 'components/ui/Button';
import Footer from 'app/resources/Footer';

export default function SeguridadDatosPage() {
  const [showCard, setShowCard] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowCard(true);
  }, []);

  const handleAccept = () => {
    setShowCard(false);
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  const handleCancel = () => {
    setShowCard(false);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] pt-20 pb-20 flex items-center justify-center px-4 transform origin-top scale-[0.80]">
        {showCard && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="w-full max-w-3xl"
          >
            <Card className="relative backdrop-blur-xl bg-white/90 border border-gray-100 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="px-8 pt-8 pb-4 border-b border-gray-200 bg-white/60 text-center">
                <ShieldCheck className="h-10 w-10 text-pink-600 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Seguridad y Protección de Datos
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Comprometidos con tu privacidad
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 py-6 max-h-[65vh] overflow-y-auto text-gray-700 text-sm leading-relaxed space-y-6 scroll-smooth">
                <p>
                  En <strong>NoPay Legal</strong>, la protección de los datos personales y la seguridad de la información jurídica que nuestros usuarios nos confían es una prioridad absoluta. Nuestro compromiso se fundamenta en la <strong>Constitución de la República del Ecuador</strong>, la <strong>Ley Orgánica de Protección de Datos Personales</strong> y demás normativa vigente.
                </p>

                <h2 className="font-semibold text-base text-gray-900 mb-1">1. Principio de Confidencialidad</h2>
                <p>
                  Toda información ingresada en la plataforma es tratada con estricta confidencialidad. Implementamos protocolos de seguridad para evitar accesos no autorizados y garantizamos que ningún dato será compartido sin consentimiento expreso del usuario, salvo disposición legal.
                </p>

                <h2 className="font-semibold text-base text-gray-900 mb-1">2. Cifrado y Seguridad Tecnológica</h2>
                <p>
                  NoPay utiliza cifrado AES-256 y conexiones HTTPS para proteger la información durante el tránsito y almacenamiento. Nuestros servidores están monitoreados permanentemente y aplicamos prácticas de desarrollo seguro.
                </p>

                <h2 className="font-semibold text-base text-gray-900 mb-1">3. Derechos de los Usuarios</h2>
                <p>
                  Conforme al artículo 66 numeral 19 de la Constitución, y la Ley de Protección de Datos, nuestros usuarios tienen derecho a acceder, rectificar, actualizar, eliminar, oponerse y portar sus datos personales. Este ejercicio puede realizarse enviando una solicitud a <strong>soporte@nopay.ec</strong>.
                </p>

                <h2 className="font-semibold text-base text-gray-900 mb-1">4. Custodia de Evidencia Legal</h2>
                <p>
                  En los casos de impugnación, los documentos subidos, imágenes y datos adjuntos se almacenan de forma segura y se conservan conforme a las obligaciones legales o contractuales vigentes, como respaldo de la trazabilidad del proceso legal automatizado.
                </p>

                <h2 className="font-semibold text-base text-gray-900 mb-1">5. Uso Ético y Legal</h2>
                <p>
                  La plataforma ha sido diseñada conforme a principios de legalidad, proporcionalidad y minimización de datos. Únicamente se recaban los datos necesarios para el cumplimiento del servicio solicitado por el usuario.
                </p>

                <p className="text-center font-medium text-gray-800 mt-6">
                  Última actualización: agosto 2025
                </p>
              </CardContent>

              <CardFooter className="px-8 py-5 border-t border-gray-200 bg-white/60 flex justify-between gap-4">
                <Button
                  onClick={handleCancel}
                  className="px-6 py-2 text-sm font-semibold rounded-xl shadow-md bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAccept}
                  className="px-6 py-2 text-sm font-semibold rounded-xl shadow-md bg-pink-600 text-white hover:bg-pink-500"
                >
                  Aceptar y Continuar
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </main>

      <Footer />
    </>
  );
}