"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    Lock,
    CreditCard,
    BadgeCheck,
    Clock,
    HelpCircle,
} from "lucide-react";
import Image from "next/image";
import Footer from "app/resources/Footer";

import { SessionJWTManager } from "lib/seguridad/SessionJWTManager";
import { SessionPaymentManager } from "lib/seguridad/SessionPaymentManager";
import { Header } from "app/resources/Header";
import { API_BASE_URL } from "config/apiConfig";

type ErrorWithMessage = {
    message: string;
};

export default function ResumenPago() {
    useEffect(() => {
        const validar = async () => {
            const esValido = await SessionJWTManager.isValid();
            if (!esValido) {
                alert("Tu sesión ha expirado o es inválida. Serás redirigido.");
                window.location.href = "/";
                return;
            }

            // Obtener parámetros seguros
            const sessionData = SessionPaymentManager.obtener();
            if (!sessionData) {
                alert("Datos de pago no disponibles. Serás redirigido.");
                window.location.href = "/";
                return;
            }

            // Guardar en estado (para uso en el componente)
            setCitacion(sessionData.citacion);
            setItem(sessionData.item);
            setServicio(sessionData.servicio);
            setValor(sessionData.valor);
            setCedula(sessionData.cedula);

            setIsValidating(false);
        };

        validar();
    }, []);

    const router = useRouter();

    const [citacion, setCitacion] = useState("");
    const [item, setItem] = useState("");
    const [servicio, setServicio] = useState("");
    const [valor, setValor] = useState("");
    const [cedula, setCedula] = useState("");

    const [loading, setLoading] = useState(false);
    const [tipoCredito, setTipoCredito] = useState("00");
    const [cuotas, setCuotas] = useState(1);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);
    const [isValidating, setIsValidating] = useState(true);

    function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
        return (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as Record<string, unknown>).message === "string"
        );
    }

    function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
        if (isErrorWithMessage(maybeError)) return maybeError;

        try {
            return new Error(JSON.stringify(maybeError));
        } catch {
            return new Error(String(maybeError));
        }
    }

    const iniciarPago = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/pagos/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    monto: valor,
                    clienteId: cedula,
                    tipoCredito: tipoCredito,
                    cuotas: cuotas,
                    cantidad: 1,

                    nombre: "Juan",
                    segundoNombre: "Carlos",
                    apellido: "Pérez 8",
                    correo: "juanperez8@email.com",
                    telefono: "0999999999",
                    cedula: cedula,
                    ip: "190.12.48.178",

                    direccionEntrega: "N/A",
                    direccionCliente: "N/A",
                    paisEntrega: "EC",
                    paisCliente: "EC",

                    productoNombre: servicio,
                    productoDescripcion: `Transacción ${servicio} por ítem ${item}`,

                    valBase0: 0.0,
                    valBaseImp: parseFloat((parseFloat(valor) / 1.15).toFixed(2)),
                    valIva: parseFloat(
                        (parseFloat(valor) - parseFloat(valor) / 1.15).toFixed(2)
                    ),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error en el pago");
            }

            if (data.id) {
                router.push(`/pago?checkoutId=${data.id}`);
            } else {
                throw new Error("No se pudo iniciar el proceso de pago");
            }

            SessionPaymentManager.limpiar();
        } catch (error) {
            const errorWithMessage = toErrorWithMessage(error);
            alert(
                errorWithMessage.message || "No se pudo iniciar el pago. Intente nuevamente."
            );
            setLoading(false);
        }
    };

    if (isValidating) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-emerald-600"></div>
            </div>
        );
    }

    return (


        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F0F4F8] to-[#E0E7ED] px-4 py-10">
            <Header />
            <div className="h-14" />   {/* ← espacio en blanco de 2rem */}
            {/* Barra superior de seguridad */}
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white text-sm font-medium py-2 px-4 rounded-t-xl flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>PAGO 100% SEGURO - CERTIFICADO SSL</span>
            </div>

            {/* Contenedor principal con borde de gradiente */}
            <div className="max-w-2xl mx-auto p-px rounded-b-xl shadow-2xl">
                <div className="bg-white rounded-b-xl border border-gray-200 p-8 relative">
                    {/* Encabezado con protección */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#EC4899]/10 p-2 rounded-full">
                                <ShieldCheck className="text-[#EC4899] w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]">
                                Resumen de tu pago
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                            <Clock className="text-blue-600 w-4 h-4" />
                            <span className="text-blue-600 text-sm">Proceso rápido - 2 minutos</span>
                        </div>
                    </div>

                    {/* Detalles de la compra */}
                    <div className="space-y-4 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4 items-start sm:items-center mb-2">
                            <p className="text-gray-700 font-medium min-w-[80px]">Servicio:</p>
                            <p className="text-gray-800 font-semibold text-sm sm:text-base text-right sm:text-left leading-snug">
                                {servicio} de <span className="uppercase">{item}</span>
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">Subtotal:</p>
                            <p className="text-gray-800 font-medium">${valor}</p>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <p className="text-gray-800 font-semibold">Total a pagar:</p>
                            <p className="text-[#7F1D1D] text-xl font-bold">${valor}</p>
                        </div>
                    </div>

                    {/* Opciones de pago */}
                    <div className="mb-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                Tipo de Crédito
                                <button
                                    onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <HelpCircle className="w-4 h-4" />
                                </button>
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:border-transparent"
                                value={tipoCredito}
                                onChange={(e) => setTipoCredito(e.target.value)}
                            >
                                <option value="00">00 - Transacción corriente</option>
                                <option value="01">01 - Diferido corriente</option>
                                <option value="02">02 - Diferido con interés</option>
                                <option value="03">03 - Diferido sin interés</option>
                                <option value="07">07 - Diferido con interés + meses de gracia</option>
                                <option value="09">09 - Diferido sin interés + meses de gracia</option>
                                <option value="21">21 - Diferido Plus</option>
                                <option value="22">22 - Duplica tu plazo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad de Cuotas
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={24}
                                value={cuotas}
                                onChange={(e) => setCuotas(parseInt(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Información de seguridad expandible */}
                    {showSecurityInfo && (
                        <div className="mb-6 p-4 bg-[#F59E0B]/10 rounded-lg border border-[#EC4899]/20">
                            <h3 className="font-medium text-[#7F1D1D] mb-2 flex items-center gap-2">
                                <BadgeCheck className="w-5 h-5" />
                                Información sobre tipos de crédito (según Datafast)
                            </h3>
                            <ul className="text-sm text-[#7F1D1D] space-y-1 list-disc pl-5">
                                <li>
                                    <span className="font-medium">00 - Transacción corriente:</span>{" "}
                                    Pago total al vencimiento (consumo normal).
                                </li>
                                <li>
                                    <span className="font-medium">01 - Diferido corriente:</span>{" "}
                                    Se difiere el valor total con condiciones del emisor.
                                </li>
                                <li>
                                    <span className="font-medium">02 - Diferido con interés:</span>{" "}
                                    Pago en cuotas con intereses financieros.
                                </li>
                                <li>
                                    <span className="font-medium">03 - Diferido sin interés:</span>{" "}
                                    Cuotas iguales sin interés (promociones).
                                </li>
                                <li>
                                    <span className="font-medium">
                                        07 - Diferido con interés + gracia:
                                    </span>{" "}
                                    Cuotas con interés, incluye meses de gracia inicial.
                                </li>
                                <li>
                                    <span className="font-medium">
                                        09 - Diferido sin interés + gracia:
                                    </span>{" "}
                                    Cuotas sin interés, con período de gracia inicial.
                                </li>
                                <li>
                                    <span className="font-medium">21 - Diferido Plus:</span>{" "}
                                    Modalidad especial con beneficios ampliados (según banco).
                                </li>
                                <li>
                                    <span className="font-medium">22 - Duplica tu plazo:</span>{" "}
                                    Modalidad promocional donde el plazo se multiplica.
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Botón de pago */}
                    <button
                        className="w-full bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white px-6 py-4 rounded-xl text-lg font-semibold hover:from-[#EC4899] hover:to-[#F59E0B] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-pink-200 disabled:opacity-70"
                        onClick={iniciarPago}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                                Procesando tu pago...
                            </div>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                <span>Pagar ahora de forma segura</span>
                            </>
                        )}
                    </button>

                    {/* Garantías de seguridad */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#EC4899]" />
                            Tus datos están protegidos con las más altas medidas de seguridad
                        </h3>

                        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
                            <div className="flex flex-col items-center">
                                <Image
                                    src="https://store.positivessl.com/assets/img/logo.png"
                                    alt="SSL Secure"
                                    width={80}
                                    height={30}
                                    className="object-contain"
                                />
                                <span className="text-xs text-gray-500 mt-1">Cifrado SSL 256-bit</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Image
                                    src="https://www.pcisecuritystandards.org/wp-content/uploads/2022/03/pci-logo-teal.svg"
                                    alt="PCI Compliance"
                                    width={80}
                                    height={30}
                                    className="object-contain"
                                />
                                <span className="text-xs text-gray-500 mt-1">Certificado PCI DSS</span>
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
                                No almacenamos los datos de tu tarjeta. Todas las transacciones son
                                procesadas a través de una conexión segura.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Si necesitas ayuda, contáctanos a{" "}
                                <span className="text-blue-600">info@noopay.com</span>
                            </p>
                        </div>
                    </div>
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
