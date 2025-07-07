'use client';

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  isOpen
}: {
  onAccept: () => void;
  onCancel: () => void;
  isOpen: boolean;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkIfScrolledToBottom = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
      setButtonEnabled(atBottom);
    };

    checkIfScrolledToBottom();
    el.addEventListener("scroll", checkIfScrolledToBottom);
    return () => el.removeEventListener("scroll", checkIfScrolledToBottom);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="px-8 pt-8 pb-4 border-b border-gray-200 text-center">
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
                className="px-8 py-6 flex-1 overflow-y-auto text-gray-700 text-sm leading-relaxed space-y-6"
              >
                {/* Contenido de los términos... */}
                <p>
                  Bienvenido a <strong>NoPay Legal</strong>, una plataforma digital orientada a facilitar la gestión de trámites administrativos relacionados con la impugnación de multas de tránsito.
                </p>
                {/* Resto del contenido... */}
              </CardContent>

              <CardFooter className="px-8 py-5 border-t border-gray-200 flex justify-between gap-4">
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={onAccept}
                  disabled={!buttonEnabled}
                  className={`px-6 py-2 ${!buttonEnabled ? "bg-gray-300 cursor-not-allowed" : ""}`}
                >
                  {buttonEnabled ? "Aceptar Términos" : "Desplázate hasta el final"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TermsModalNoPay;