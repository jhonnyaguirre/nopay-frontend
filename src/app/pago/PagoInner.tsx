"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Clock } from "lucide-react";
import Image from "next/image";
import { Header } from "app/resources/Header";

declare global {
  interface Window {
    wpwlOptions?: any;
    paymentFormInterceptorAttached?: boolean;
  }
}

export default function PagoInner() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams?.get("checkoutId") || "";
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checkoutId) {
      // ✅ Configurar opciones del widget de pago
      window.wpwlOptions = {
        onReady: function () {
          const button = document.querySelector(
            "form.wpwl-form-card .wpwl-button"
          );
          if (button) {
            const imageHtml = `
              <br/>
              <img 
                src="https://www.datafast.com.ec/images/verified.png" 
                style="display:block;margin:0 auto;width:100%;max-width:220px;" 
                alt="Powered by Datafast"
              />
            `;
            button.insertAdjacentHTML("beforebegin", imageHtml);
          }
        },
        style: "card",
        locale: "es",
        labels: {
          cvv: "CVV",
          cardHolder: "Nombre (igual que en la tarjeta)",
        },
      };

      // ✅ Cargar el script de Datafast producción
      const script = document.createElement("script");
      script.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
      script.async = true;

      script.onload = () => {
        setScriptLoaded(true);
        setLoading(false);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [checkoutId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F0F4F8] to-[#E0E7ED] px-4 py-10">
      <Header />
      <div className="h-14" />   {/* ← espacio en blanco de 2rem */}
      {/* Barra superior de seguridad con gradiente de NoPay */}
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white text-sm font-medium py-2 px-4 rounded-t-xl flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        <span>PAGO 100% SEGURO - CERTIFICADO SSL</span>
      </div>

      {/* Contenedor principal con borde en gradiente */}
      <div className="max-w-2xl mx-auto p-px rounded-b-xl shadow-2xl">
        <div className="bg-white rounded-b-xl border border-gray-200 p-8 relative">
          {/* Espacio en blanco después del header */}
          <div className="h-8" />

          {/* Encabezado con estilo financiero y toque NoPay */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-[#EC4899]/10 p-2 rounded-full">
                <ShieldCheck className="text-[#EC4899] w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]">
                Completa tu pago
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Clock className="text-blue-600 w-4 h-4" />
              <span className="text-blue-600 text-sm">Proceso rápido - 2 minutos</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="animate-spin text-[#EC4899] w-8 h-8 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-700">Cargando formulario de pago seguro...</p>
            </div>
          ) : checkoutId ? (
            <>
              <form
                id="payment-form"
                key={checkoutId}
                action="/pago/resultadoPago"
                className="paymentWidgets space-y-6"
                data-brands="VISA MASTER AMEX DINERS DISCOVER"
              ></form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#EC4899]" />
                  Tus datos están protegidos con las más altas medidas de seguridad
                </h3>

                <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Image
                        src="https://store.positivessl.com/assets/img/logo.png"
                        alt="SSL Secure"
                        width={80}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      Cifrado SSL 256-bit
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Image
                        src="https://www.pcisecuritystandards.org/wp-content/uploads/2022/03/pci-logo-teal.svg"
                        alt="PCI Compliance"
                        width={80}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      Certificado PCI DSS
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-800 p-2 rounded-lg">
                      <Image
                        src="https://datafast.com.ec/images/logo.png"
                        alt="Datafast"
                        width={80}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      Pasarela de pago segura
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    No almacenamos los datos de tu tarjeta. Todas las transacciones son procesadas a través de una conexión segura.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Si necesitas ayuda, contáctanos a{" "}
                    <span className="text-blue-600">soporte@nopay.com</span>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">No se pudo cargar el formulario de pago</p>
              <p className="text-gray-700">
                Por favor, verifica tu conexión e intenta nuevamente
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-10 flex flex-col items-center text-center">
        <Lock className="w-10 h-10 text-[#7F1D1D] mb-2" />
        <p className="text-gray-700 text-sm">
          Tu pago está protegido con cifrado de nivel bancario. Realiza tu
          transacción con total seguridad.
        </p>
      </div>

    </div>
  );
}
