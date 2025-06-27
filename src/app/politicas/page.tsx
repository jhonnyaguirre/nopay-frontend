"use client";
export const dynamic = "force-dynamic";


import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import { Header } from "app/resources/Header";
import Footer from "../resources/Footer";

import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/Card";

const TermsAndConditions = () => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });

    const handleScroll = () => {
      const el = contentRef.current;
      if (el) {
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setButtonEnabled(true);
        }
      }
    };

    const el = contentRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAccept = () => {
    router.back(); // o router.push('/wizard')
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] overflow-hidden text-[80%]">
      <Header />

      <section className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-5xl"
        >
          <Card className="relative backdrop-blur-xl bg-white/80 border border-gray-100 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="px-10 pt-8 pb-4 border-b border-gray-200 bg-white/60 backdrop-blur-sm flex flex-col items-center text-center space-y-2">
              <ShieldCheck className="h-10 w-10 text-blue-600" />
              <CardTitle className="text-3xl font-bold text-gray-800">
                Términos y Condiciones
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Última actualización:{" "}
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                  5 de mayo de 2025
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent
              ref={contentRef}
              className="px-10 py-6 max-h-[70vh] overflow-y-auto text-gray-700 text-base leading-relaxed space-y-6 scroll-smooth"
            >
              <p>
                Bienvenido a <strong>NoPay Legal</strong>, una plataforma digital orientada a facilitar la gestión de trámites administrativos relacionados con la impugnación de multas de tránsito.
              </p>
              <p>
                Al acceder y utilizar nuestros servicios, usted acepta estos términos, los cuales se rigen por la legislación ecuatoriana, incluyendo el Código Civil, la Ley de Comercio Electrónico, y la Ley Orgánica de Protección de Datos Personales.
              </p>

              {[
                {
                  title: "1. Objeto del Servicio",
                  text: "NoPay Legal ofrece un servicio tecnológico para automatizar recursos legales administrativos. No garantiza una resolución favorable ni sustituye el patrocinio de un abogado.",
                },
                {
                  title: "2. Limitación de Responsabilidad",
                  text: (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>No garantizamos decisiones favorables de las autoridades.</li>
                      <li>No nos responsabilizamos por información errónea proporcionada por el usuario.</li>
                      <li>No ofrecemos asesoría jurídica directa ni representación legal.</li>
                    </ul>
                  ),
                },
                {
                  title: "3. Fuerza Mayor",
                  text:
                    "No nos responsabilizamos por fallos causados por fuerza mayor, conforme al artículo 30 del Código Civil del Ecuador.",
                },
                {
                  title: "4. Propiedad Intelectual",
                  text:
                    "Todo el contenido y tecnología de la plataforma es propiedad exclusiva de Apelaya Legal. Su uso no autorizado está prohibido.",
                },
                {
                  title: "5. Protección de Datos",
                  text:
                    "Los datos se gestionan según la Ley Orgánica de Protección de Datos Personales. El usuario puede ejercer sus derechos cuando lo desee.",
                },
                {
                  title: "6. Jurisdicción",
                  text:
                    "Las disputas se resolverán bajo la jurisdicción del cantón Cuenca, Ecuador.",
                },
                {
                  title: "7. Modificaciones",
                  text:
                    "Apelaya Legal puede actualizar estos términos en cualquier momento. Revise esta sección periódicamente.",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <h2 className="font-semibold text-lg text-gray-900">{item.title}</h2>
                  <div>{item.text}</div>
                </div>
              ))}

              <p className="text-center font-medium text-gray-800 mt-6">
                Al aceptar estos términos, usted declara haberlos leído y comprendido en su totalidad.
              </p>
            </CardContent>

            <CardFooter className="px-10 py-6 border-t border-gray-200 bg-white/60 backdrop-blur-sm flex justify-center">
              <Button
                disabled={!buttonEnabled}
                onClick={handleAccept}
                className={`px-8 py-3 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl ${
                  buttonEnabled
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:brightness-110"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {buttonEnabled ? "Aceptar Términos y Condiciones" : "Desplázate hasta el final"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsAndConditions;
