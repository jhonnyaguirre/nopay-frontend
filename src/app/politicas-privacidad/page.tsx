'use client';

import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Truck, PhoneCall } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';

const PoliticasPrivacidad = () => {
  return (
     
    
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-8 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]">
    <Header />
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
              Políticas de Privacidad
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Declaración sobre el tratamiento de datos personales
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 py-6 max-h-[65vh] overflow-y-auto text-gray-700 text-sm leading-relaxed space-y-6 scroll-smooth">
            <p>
              En <strong>NoPay Legal</strong>, nos comprometemos a proteger la privacidad y los datos personales de nuestros usuarios, de acuerdo con lo establecido en la Ley Orgánica de Protección de Datos Personales del Ecuador y demás normativa aplicable.
            </p>

            {[{
              title: "1. Responsable del Tratamiento",
              text: "El responsable del tratamiento de los datos personales es NoPay Legal, plataforma digital operada por Softcorp, dedicada a la automatización de trámites legales y recursos administrativos."
            }, {
              title: "2. Datos Recopilados",
              text: "Podemos recopilar y procesar los siguientes datos: nombres, apellidos, cédula de identidad, correo electrónico, número telefónico, dirección, datos del vehículo, imágenes, y cualquier otra información ingresada voluntariamente por el usuario para el uso de nuestros servicios."
            }, {
              title: "3. Finalidad del Tratamiento",
              text: "Los datos personales serán utilizados exclusivamente para la prestación de servicios relacionados con la impugnación de multas, validación de identidad, contacto legal, análisis jurídico automatizado, emisión de comprobantes, y cumplimiento de obligaciones legales."
            }, {
              title: "4. Consentimiento",
              text: "El usuario otorga su consentimiento libre, informado e inequívoco para el tratamiento de sus datos al aceptar los términos y condiciones de la plataforma y utilizar nuestros servicios."
            }, {
              title: "5. Derechos del Usuario",
              text: "El usuario tiene derecho a acceder, rectificar, eliminar, oponerse, limitar y portar sus datos personales en cualquier momento. Para ejercer estos derechos, puede comunicarse a soporte@nopay.ec."
            }, {
              title: "6. Seguridad y Confidencialidad",
              text: "NoPay Legal implementa medidas técnicas, organizativas y legales para garantizar la seguridad de los datos personales. Los datos no serán vendidos ni compartidos con terceros sin consentimiento expreso del usuario, salvo obligación legal."
            }, {
              title: "7. Transferencias Internacionales",
              text: "En caso de requerir servicios en la nube u otros servicios con procesamiento fuera del Ecuador, se garantizará que dichos proveedores cumplan con estándares adecuados de protección de datos."
            }, {
              title: "8. Conservación de Datos",
              text: "Los datos serán conservados durante el tiempo necesario para cumplir con la finalidad del tratamiento y mientras existan obligaciones legales o contractuales aplicables."
            }, {
              title: "9. Cambios a esta Política",
              text: "Nos reservamos el derecho de actualizar esta política en cualquier momento. Se notificará a los usuarios sobre cambios relevantes mediante la plataforma."
            }].map((item, idx) => (
              <div key={idx}>
                <h2 className="font-semibold text-base text-gray-900 mb-1">{item.title}</h2>
                <p>{item.text}</p>
              </div>
            ))}

            <p className="text-center font-medium text-gray-800 mt-6">
              Última actualización: Mayo 2025
            </p>
          </CardContent>
        </Card>
         
      </motion.div>
      
    </div>

 
  );
};

export default PoliticasPrivacidad;