"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Clock, ArrowLeft, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { Header } from "app/resources/Header";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown } from "lucide-react"; // Nuevos iconos

declare global {
  interface Window {
    wpwlOptions?: any;
    paymentFormInterceptorAttached?: boolean;
  }
}

export default function PagoInner() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams?.get("checkoutId") || "";
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (checkoutId) {
		
		const savedSnapshot = localStorage.getItem("pago_snapshot");
		if (savedSnapshot) setSnapshot(JSON.parse(savedSnapshot));
	
      // ✅ Configurar opciones del widget con ESTILOS INYECTADOS
      window.wpwlOptions = {
        style: "card",
        locale: "es",
        labels: {
          cvv: "CVV",
          cardHolder: "Nombre del Titular",
        },
        onReady: function () {
          const button = document.querySelector("form.wpwl-form-card .wpwl-button");
          if (button) {
            const verifiedHtml = `
              <div style="text-align:center; margin-top: 20px;">
                <img src="https://www.datafast.com.ec/images/verified.png" style="width:180px; opacity:0.7;" alt="Datafast Verified" />
              </div>
            `;
            button.insertAdjacentHTML("afterend", verifiedHtml);
          }
        },
        // Esto intenta suavizar el diseño del iframe de Datafast
        registrations: { requireCvv: true, hideInitialPaymentForms: false }
      };

      const script = document.createElement("script");
      script.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
      script.async = true;
      script.onload = () => setLoading(false);
      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector(`script[src*="${checkoutId}"]`);
        if (existingScript) document.body.removeChild(existingScript);
      };
    }
  }, [checkoutId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] antialiased text-slate-900">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        
        {/* Botón de Volver */}
        
		<div className="relative inline-block mb-10 group">
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onMouseEnter={() => setShowSummary(true)}
    onMouseLeave={() => setShowSummary(false)}
    className="flex items-center gap-3 bg-white border border-slate-200 pl-2 pr-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
      <ShieldCheck size={20} />
    </div>
    <div className="text-left">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Resumen Protegido</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-700">Ver detalles de orden</span>
        <ChevronDown size={14} className={`text-indigo-500 transition-transform duration-500 ${showSummary ? 'rotate-180' : ''}`} />
      </div>
    </div>
  </motion.button>

  {/* EL SNAPSHOT: INGENIERÍA DE DISEÑO FINTECH */}
  <AnimatePresence>
    {showSummary && snapshot && (
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.94, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 10, scale: 0.94, filter: "blur(10px)" }}
        className="absolute left-0 top-full mt-5 w-[360px] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-white z-50 pointer-events-none overflow-hidden"
      >
        {/* Marca de Agua / Pattern de Seguridad */}
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-slate-900 pointer-events-none">
          <ShieldCheck size={120} />
        </div>

        {/* 1. Header: Contexto de Servicio */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em]">Resumen de tu compra</span>
          </div>
           
          <p className="text-slate-500 font-medium text-sm mt-1">Item de referencia: <span className="text-slate-800">#{snapshot.item}</span></p>
        </div>

        {/* 2. Body: Datos con Estructura de Relevancia */}
        <div className="px-8 space-y-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          
          <div className="grid grid-cols-2 gap-8">
            <section>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Titular</label>
              <p className="text-[13px] font-bold text-slate-800 leading-tight">{snapshot.titular}</p>
            </section>
            <section>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Documento</label>
              <p className="text-[13px] font-bold text-slate-800 leading-tight">{snapshot.cedula}</p>
            </section>
          </div>

          {/* 3. Footer: El "Big Number" (UX: Lo que más importa) */}
          <div className="bg-slate-900 rounded-[24px] p-6 mt-4 relative overflow-hidden group/card">
            {/* Glossy Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-50" />
            
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-indigo-300/70 text-[10px] font-black uppercase tracking-widest mb-1">Total Confirmado</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-indigo-400 font-bold text-lg">$</span>
                  <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
                    {snapshot.valor}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter">{snapshot.metodo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UX Tip: Refuerzo de Confianza */}
        <div className="p-8 pt-6 flex items-center gap-3">
          <Lock size={12} className="text-slate-400" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Datos cifrados en sesión local
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
		
		

        {/* Encabezado de Seguridad */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-100">
            <ShieldCheck size={14} />
            Conexión Cifrada de Extremo a Extremo
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Pasarela de Pago Segura</h1>
          <p className="text-slate-500 mt-2 text-sm">Ingresa los datos de tu tarjeta para procesar la transacción.</p>
        </header>

        {/* CONTENEDOR DEL FORMULARIO */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden relative">
          
          {/* Barra de estado de carga rápida */}
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Tiempo estimado: 45s</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1 w-6 rounded-full ${i <= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>

          <div className="p-8 lg:p-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-10 w-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Iniciando protocolo de seguridad...</p>
              </div>
            ) : checkoutId ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Estilos CSS personalizados para el Widget de Datafast */}
                <style dangerouslySetInnerHTML={{ __html: `
                  .wpwl-form { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
                  .wpwl-label { font-family: inherit !important; font-size: 12px !important; text-transform: uppercase !important; font-weight: 700 !important; color: #64748b !important; letter-spacing: -0.02em !important; margin-bottom: 8px !important; }
                  .wpwl-control { border-radius: 12px !important; border: 1px solid #e2e8f0 !important; background: #f8fafc !important; height: 48px !important; padding: 0 16px !important; font-size: 16px !important; }
                  .wpwl-control:focus { border-color: #4f46e5 !important; ring: 2px #4f46e5 !important; }
                  .wpwl-button-pay { background: #4f46e5 !important; border: none !important; border-radius: 16px !important; height: 56px !important; font-size: 14px !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; margin-top: 20px !important; transition: all 0.3s ease !important; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3) !important; }
                  .wpwl-button-pay:hover { background: #4338ca !important; transform: translateY(-1px) !important; }
                `}} />
                
                <form
                  id="payment-form"
                  key={checkoutId}
                  action="/pago/resultadoPago"
                  className="paymentWidgets"
                  data-brands="VISA MASTER AMEX DINERS DISCOVER"
                ></form>
              </div>
            ) : (
              <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
                <ShieldAlert className="mx-auto text-red-500 mb-4" size={40} />
                <p className="text-red-900 font-bold uppercase text-xs tracking-widest">Error de Sesión</p>
                <p className="text-red-700 text-sm mt-2">No se encontró un ID de transacción válido.</p>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges Minimalistas */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex flex-col items-center">
            <Image src="https://store.positivessl.com/assets/img/logo.png" alt="SSL" width={70} height={25} />
            <span className="text-[9px] font-bold text-slate-400 mt-2 tracking-widest">AES-256 BIT</span>
          </div>
          <div className="flex flex-col items-center">
            <Image src="https://www.pcisecuritystandards.org/wp-content/uploads/2022/03/pci-logo-teal.svg" alt="PCI" width={70} height={25} />
            <span className="text-[9px] font-bold text-slate-400 mt-2 tracking-widest">PCI COMPLIANT</span>
          </div>
          <div className="flex flex-col items-center col-span-2 md:col-span-1">
            <div className="bg-slate-800 px-3 py-1 rounded-md">
              <Image src="https://datafast.com.ec/images/logo.png" alt="Datafast" width={70} height={25} />
            </div>
            <span className="text-[9px] font-bold text-slate-400 mt-2 tracking-widest">OFFICIAL GATEWAY</span>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <div className="flex justify-center gap-4 text-slate-300 mb-6">
            <Lock size={16} />
            <ShieldCheck size={16} />
          </div>
          <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
            Esta es una conexión segura. Los datos de su tarjeta son encriptados y procesados directamente por la entidad financiera. **NooPay** no almacena información sensible de tarjetas.
          </p>
        </footer>
      </main>
    </div>
  );
}