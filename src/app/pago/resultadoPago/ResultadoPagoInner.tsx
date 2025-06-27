"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "app/resources/Header";
import { API_BASE_URL } from "config/apiConfig";

export default function ResultadoPagoInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourcePath = searchParams?.get("resourcePath");
  const [estado, setEstado] = useState("");
  const [detalle, setDetalle] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  useEffect(() => {
    if (!resourcePath) return;

    setLoading(true);
    fetch(
      `${API_BASE_URL}/pagos/estado?resourcePath=${encodeURIComponent(
        resourcePath
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        const estadoTransaccion = data.result?.description || "Sin respuesta";
        const codigo = data.result?.code || "";
        setEstado(estadoTransaccion);

        if (codigo.startsWith("000.")) {
          setDetalle("¡Tu pago fue procesado exitosamente!");
          setPagoExitoso(true);
        } else {
          setDetalle("Hubo un problema al procesar tu pago.");
          setPagoExitoso(false);
        }
      })
      .catch(() => {
        setEstado("Error al verificar el estado del pago");
        setDetalle("Por favor verifica tu conexión o intenta nuevamente.");
        setPagoExitoso(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [resourcePath]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F0F4F8] to-[#E0E7ED] px-4 py-10 text-[80%]">

      <Header />
      <div className="h-14" />   {/* ← espacio en blanco de 2rem */}
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white text-sm font-medium py-2 px-4 rounded-t-xl flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        <span>TRANSACCIÓN {pagoExitoso ? "COMPLETADA" : "PROCESADA"} - NOPAY</span>
      </div>

      {/* Espacio en blanco después del header */}
      <div className="h-8" />

      <div className="max-w-2xl mx-auto bg-white rounded-b-xl shadow-2xl border border-gray-200 p-8 relative">
        <div className="flex flex-col items-center text-center mb-8">
          {loading ? (
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Clock className="text-blue-600 w-8 h-8 animate-pulse" />
            </div>
          ) : pagoExitoso ? (
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle2 className="text-green-600 w-8 h-8" />
            </div>
          ) : (
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <XCircle className="text-red-600 w-8 h-8" />
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {loading
              ? "Verificando tu pago..."
              : pagoExitoso
                ? "¡Pago Completado!"
                : "Pago No Procesado"}
          </h1>
          <p className="text-gray-600">
            {loading
              ? "Estamos confirmando el estado de tu transacción"
              : estado}
          </p>
        </div>

        <div
          className={`p-6 rounded-lg mb-8 text-center ${loading
            ? "bg-blue-50"
            : pagoExitoso
              ? "bg-green-50"
              : "bg-red-50"
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-600 w-5 h-5" />
              <p className="text-blue-800">Procesando resultado del pago...</p>
            </div>
          ) : (
            <p
              className={`text-lg font-medium ${pagoExitoso ? "text-green-800" : "text-red-800"
                }`}
            >
              {detalle}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {pagoExitoso && (
            <button
              onClick={() => router.push("/Usuario/ServiciosPorUsuario")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver mi compra
            </button>
          )}
          <button
            onClick={() => router.push("/Usuario/ServiciosPorUsuario")}
            className={`flex-1 ${pagoExitoso
              ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              } px-6 py-3 rounded-lg font-medium transition-colors`}
          >
            {pagoExitoso ? "Volver al inicio" : "Intentar nuevamente"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            {pagoExitoso
              ? "Transacción completada con seguridad"
              : "Tus datos están protegidos"}
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
              {pagoExitoso
                ? "Hemos recibido tu pago correctamente. Recibirás un comprobante por correo electrónico."
                : "No almacenamos los datos de tu tarjeta. Todas las transacciones son seguras."}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Si necesitas ayuda, contáctanos a{" "}
              <span className="text-blue-600">info@nopay.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sección adicional al final para generar confianza */}
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

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
