"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CookieConsentManager,
  CookiePreferences,
} from "../../lib/cookies/CookieConsentManager";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const existing = CookieConsentManager.get();
    if (!existing) setVisible(true);
  }, []);

  const acceptAll = () => {
    CookieConsentManager.save({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    setVisible(false);
  };

  const rejectOptional = () => {
    CookieConsentManager.save({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    setVisible(false);
  };

  const savePreferences = () => {
    CookieConsentManager.save(preferences);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[99999]"
        >
          {/* Panel full‑width con borde superior sutil y sombra elegante */}
          <div className="w-full border-t border-slate-100 bg-white/95 backdrop-blur-sm shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
            <div className="mx-auto max-w-[1600px] px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                {/* Texto principal con icono de confianza */}
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-full bg-emerald-50 p-1.5">
                      <ShieldIcon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                      Privacidad y transparencia
                    </span>
                  </div>
                  <h3 className="text-[1.8rem] md:text-[2.2rem] font-black tracking-[-0.03em] text-slate-900 leading-tight">
                    Uso de cookies en NoPay
                  </h3>
                  <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-500 max-w-2xl">
                    Utilizamos cookies para garantizar el funcionamiento seguro de la plataforma,
                    mejorar nuestros servicios y comprender cómo los usuarios interactúan con
                    nuestras herramientas legales digitales.
                  </p>
                  <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                  >
                    {showConfig ? "Ocultar configuración" : "Configurar cookies"}
                    <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={rejectOptional}
                    className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:scale-95"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => setShowConfig(true)}
                    className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 active:scale-95"
                  >
                    Configurar
                  </button>
                  <button
                    onClick={acceptAll}
                    className="rounded-full bg-slate-900 px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-slate-200 transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
                  >
                    Aceptar y continuar
                  </button>
                </div>
              </div>

              {/* Panel de configuración desplegable (elegante y limpio) */}
              <AnimatePresence>
                {showConfig && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden mt-6"
                  >
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 md:p-6">
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">
                        Preferencias de cookies
                      </h4>
                      <div className="space-y-4">
                        <CookieOption
                          title="Cookies necesarias"
                          description="Requeridas para navegación, seguridad y funcionamiento básico."
                          checked={true}
                          disabled={true}
                          onChange={() => {}}
                        />
                        <CookieOption
                          title="Cookies analíticas"
                          description="Nos ayudan a medir visitas, rendimiento y mejorar continuamente."
                          checked={preferences.analytics}
                          onChange={(checked) =>
                            setPreferences((prev) => ({ ...prev, analytics: checked }))
                          }
                        />
                        <CookieOption
                          title="Cookies de marketing"
                          description="Permiten medir campañas y optimizar anuncios futuros."
                          checked={preferences.marketing}
                          onChange={(checked) =>
                            setPreferences((prev) => ({ ...prev, marketing: checked }))
                          }
                        />
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={savePreferences}
                          className="rounded-full bg-emerald-600 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
                        >
                          Guardar preferencias
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Componente auxiliar para cada opción de cookie
function CookieOption({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-emerald-500" : "bg-slate-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-pressed={checked}
        disabled={disabled}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

// Iconos simples (puedes importarlos de lucide-react si lo prefieres)
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}