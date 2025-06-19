'use client';

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/Card";

const TermsModalNoPay = ({
  onAccept,
  onCancel,
}: {
  onAccept: () => void;
  onCancel: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkIfScrolledToBottom = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
      if (atBottom) setButtonEnabled(true);
    };

    checkIfScrolledToBottom();
    el.addEventListener("scroll", checkIfScrolledToBottom);
    return () => el.removeEventListener("scroll", checkIfScrolledToBottom);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-8 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]">
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
              Términos y Condiciones
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Por favor, lea hasta el final para continuar.
            </CardDescription>
          </CardHeader>

          <CardContent
            ref={contentRef}
            className="px-8 py-6 max-h-[65vh] overflow-y-auto text-gray-700 text-sm leading-relaxed space-y-6 scroll-smooth"
          >
            <p>
              Bienvenido a <strong>NoPay Legal</strong>, una plataforma digital orientada a facilitar la gestión de trámites administrativos relacionados con la impugnación de multas de tránsito.
            </p>
            <p>
              Al acceder y utilizar nuestros servicios, usted acepta estos términos, los cuales se rigen por la legislación ecuatoriana, incluyendo el Código Civil, la Ley de Comercio Electrónico, y la Ley Orgánica de Protección de Datos Personales.
            </p>

            {[{
              title: "1. Objeto del Servicio",
              text: "NoPay Legal ofrece un servicio tecnológico para automatizar recursos legales administrativos. No garantiza una resolución favorable ni sustituye el patrocinio de un abogado."
            }, {
              title: "2. Limitación de Responsabilidad",
              text: (
                <ul className="list-disc pl-5 space-y-1">
                  <li>No garantizamos decisiones favorables de las autoridades.</li>
                  <li>No nos responsabilizamos por información errónea proporcionada por el usuario.</li>
                  <li>No ofrecemos asesoría jurídica directa ni representación legal.</li>
                </ul>
              )
            }, {
              title: "3. Fuerza Mayor",
              text: "No nos responsabilizamos por fallos causados por fuerza mayor, conforme al artículo 30 del Código Civil del Ecuador."
            }, {
              title: "4. Propiedad Intelectual",
              text: "Todo el contenido y tecnología de la plataforma es propiedad exclusiva de NoPay Legal. Su uso no autorizado está prohibido."
            }, {
              title: "5. Protección de Datos",
              text: "Los datos se gestionan según la Ley Orgánica de Protección de Datos Personales. El usuario puede ejercer sus derechos cuando lo desee."
            }, {
              title: "6. Jurisdicción",
              text: "Las disputas se resolverán bajo la jurisdicción del cantón Cuenca, Ecuador."
            }, {
              title: "7. Modificaciones",
              text: "NoPay Legal puede actualizar estos términos en cualquier momento. Revise esta sección periódicamente."
            }].map((item, idx) => (
              <div key={idx}>
                <h2 className="font-semibold text-base text-gray-900 mb-1">{item.title}</h2>
                <div>{item.text}</div>
              </div>
            ))}

            <p className="text-center font-medium text-gray-800 mt-6">
              Al aceptar estos términos, usted declara haberlos leído y comprendido en su totalidad.
            </p>
          </CardContent>

          <CardFooter className="px-8 py-5 border-t border-gray-200 bg-white/60 flex justify-between gap-4">
            <Button
              onClick={onCancel}
              className="px-6 py-2 text-sm font-semibold rounded-xl shadow-md bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={onAccept}
              disabled={!buttonEnabled}
              className={`px-6 py-2 text-sm font-semibold rounded-xl shadow-md transition-all ${buttonEnabled
                ? "bg-pink-600 text-white hover:bg-pink-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              {buttonEnabled ? "Aceptar Términos y Condiciones" : "Desplázate hasta el final"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default TermsModalNoPay;
