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
  ArrowRight,
  ChevronRight,
  Zap
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "app/resources/Header";
import { API_BASE_URL } from "config/apiConfig";
import { SessionPaymentManager } from "lib/seguridad/SessionPaymentManager";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";

// Tipado de errores
type ErrorWithMessage = { message: string };

export default function ResumenPago() {
  const router = useRouter();

  // Estados de Datos
  const [citacion, setCitacion] = useState("");
  const [item, setItem] = useState("");
  const [servicio, setServicio] = useState("");
  const [valor, setValor] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipoCredito, setTipoCredito] = useState("00");
  const [cuotas, setCuotas] = useState(1);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  const [primerNombre, segundoNombre] = nombres?.split(" ") ?? [];

  useEffect(() => {
    const validar = async () => {
      const sessionData = SessionPaymentManager.obtener();
      const sessionWizard = SessionWizardData.obtener();
	  
	  if (!sessionData || !sessionData.valor || !sessionData.cedula) {
        router.push("/Servicios/landingActivos");
        return; // Detenemos la ejecución aquí
      }

      if (sessionData) {
        setCitacion(sessionData.citacion || "");
        setItem(sessionData.item || "");
        setServicio(sessionData.servicio || "");
        setValor(sessionData.valor || "0.00");
        setCedula(sessionData.cedula || "");
        setApellidos(sessionData.apellido || "");
        setEmail(sessionData.displayName || "");
      }
      if (sessionWizard) setNombres(sessionWizard.nombres || "");
      setIsValidating(false);
    };
    validar();
  }, []);

  // Helpers de Error
  function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (maybeError && typeof maybeError === "object" && "message" in maybeError)
      return maybeError as ErrorWithMessage;
    return { message: String(maybeError) };
  }

  const iniciarPago = async () => {
    setLoading(true);
    const payload = {
      monto: valor,
      clienteId: cedula,
      tipoCredito,
      cuotas,
      cantidad: 1,
      nombre: primerNombre || "N/A",
      segundoNombre: segundoNombre || "",
      apellido: apellidos || "N/A",
      correo: email,
      telefono: "0999999999",
      cedula,
      ip: "127.0.0.1",
      direccionEntrega: "N/A",
      direccionCliente: "N/A",
      paisEntrega: "EC",
      paisCliente: "EC",
      productoNombre: servicio,
      productoDescripcion: `Transacción ${servicio} por ítem ${item}`,
      valBase0: 0.0,
      valBaseImp: parseFloat((parseFloat(valor) / 1.15).toFixed(2)),
      valIva: parseFloat((parseFloat(valor) - parseFloat(valor) / 1.15).toFixed(2)),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/pagos/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error del servidor");
      if (data.id) {
		  const snapshot = {
			servicio,
			item,
			valor,
			cedula,
			titular: `${nombres} ${apellidos}`,
			metodo: tipoCredito === "00" ? "Corriente" : `Diferido (${cuotas} meses)`,
			fecha: new Date().toLocaleDateString()
		  };
		  
		  localStorage.setItem("pago_snapshot", JSON.stringify(snapshot));
				  
        router.push(`/pago?checkoutId=${data.id}`);
        SessionPaymentManager.limpiar();
      }
    } catch (error) {
      const err = toErrorWithMessage(error);
      alert(err.message);
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans antialiased text-slate-900">
      <Header />
      
      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto px-4 pt-32 lg:pt-40">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          
          {/* LADO IZQUIERDO: DETALLES Y FORMULARIO */}
          <div className="space-y-6">
            <header className="mb-8">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <ShieldCheck size={20} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
              </div>
              <h1 className="text-4xl font-semibold tracking-tight">Finalizar tu solicitud</h1>
              <p className="text-slate-500 mt-2">Revisa los detalles de tu trámite antes de proceder al pago seguro.</p>
            </header>

            {/* CARD DETALLES */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Detalles del Servicio</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Producto</p>
                    <p className="text-lg font-bold text-slate-800">{servicio}</p>
                    <p className="text-sm text-indigo-600 font-medium">Ítem: {item}</p>
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase">Fase 01</div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Identificación</p>
                    <p className="text-sm font-semibold text-slate-700">{cedula}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Titular</p>
                    <p className="text-sm font-semibold text-slate-700">{nombres} {apellidos}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD CONFIGURACIÓN DE PAGO */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-slate-400" size={20} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Opciones de Financiamiento</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    Método de diferido
                    <button onClick={() => setShowSecurityInfo(!showSecurityInfo)} className="text-indigo-500">
                      <HelpCircle size={14} />
                    </button>
                  </label>
                  <select
                    value={tipoCredito}
                    onChange={(e) => setTipoCredito(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="00">Corriente (Pago Total)</option>
                    <option value="01">Diferido Corriente</option>
                    <option value="02">Diferido con Intereses</option>
                    <option value="03">Diferido sin Intereses</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Meses / Cuotas</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={cuotas}
                    onChange={(e) => setCuotas(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Info Expandible */}
              <AnimatePresence>
                {showSecurityInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                      <p className="font-bold mb-2 uppercase">Guía rápida de crédito:</p>
                      <ul className="space-y-1 opacity-80">
                        <li>• <b>Corriente:</b> Se carga el valor total en tu próximo estado.</li>
                        <li>• <b>Diferido:</b> Divide el pago según las cuotas elegidas.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* LADO DERECHO: TOTAL Y BOTÓN */}
          <aside className="lg:sticky lg:top-32 space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
              {/* Decoración sutil */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
              
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-4">Resumen de Orden</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-indigo-200/60 text-sm">
                  <span>Subtotal</span>
                  <span>${valor}</span>
                </div>
                <div className="flex justify-between text-indigo-200/60 text-sm pb-3 border-b border-white/10">
                  <span>Tasa administrativa</span>
                  <span className="text-emerald-400">Gratis</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-lg font-medium">Total</span>
                  <div className="text-right">
                    <span className="block text-3xl font-bold tracking-tighter">${valor}</span>
                    <span className="text-[10px] text-indigo-300/50 uppercase font-bold tracking-widest">USD Incl. IVA</span>
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={iniciarPago}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                   <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    Pagar mi Proceso
                  </>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-indigo-300/40 font-bold uppercase tracking-widest">
                <Zap size={12} />
                Activación inmediata
              </div>
            </div>

            {/* TRUST BADGES COMPACTOS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex justify-between items-center px-6">
               <Image src="https://datafast.com.ec/images/logo.png" alt="Datafast" width={60} height={20} className="grayscale opacity-50" />
               <div className="h-4 w-px bg-slate-200" />
               <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                 <ShieldCheck size={12} />
                 PCI DSS Compliant
               </div>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 px-6 leading-relaxed">
              Al hacer clic en el botón, serás redirigido a nuestra pasarela segura para completar la transacción.
            </p>
          </aside>
        </div>
      </main>

      {/* FOOTER OPCIONAL */}
      <div className="mt-20 border-t border-slate-200 bg-white py-10 text-center">
         <p className="text-xs font-medium text-slate-400">
           ¿Necesitas ayuda? Escríbenos a <span className="text-indigo-600 font-bold">info@nopaylegal.com</span>
         </p>
      </div>
    </div>
  );
}