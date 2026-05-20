"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Clock,
  HelpCircle,
  Zap,
  ReceiptText,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileBadge2,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "app/resources/Header";
import { API_BASE_URL } from "config/apiConfig";
import { SessionPaymentManager } from "lib/seguridad/SessionPaymentManager";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { getWizardToken } from "lib/seguridad/sessionUtils";

// Tipado de errores
type ErrorWithMessage = { message: string };

type DatosFacturacion = {
  secuencial?: number;
  secuencialUsuario: number;
  tipoIdentificacion: string;
  identificacion: string;
  razonSocial: string;
  direccion: string;
  email: string;
  telefono: string;
  obligadoContabilidad: string;
  estaActivo: number;
  usuarioCrea: string;
};

type BillingFieldErrors = {
  tipoIdentificacion?: string;
  identificacion?: string;
  razonSocial?: string;
  direccion?: string;
  email?: string;
  telefono?: string;
};

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

  // Usuario logueado / sesión
  const [usuarioSecuencial, setUsuarioSecuencial] = useState<number>(0);

  // Datos de facturación
  const [billing, setBilling] = useState<DatosFacturacion>({
    secuencialUsuario: 0,
    tipoIdentificacion: "C",
    identificacion: "",
    razonSocial: "",
    direccion: "",
    email: "",
    telefono: "",
    obligadoContabilidad: "N",
    estaActivo: 1,
    usuarioCrea: "",
  });

  const [billingExists, setBillingExists] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingSaving, setBillingSaving] = useState(false);
  const [billingSuccess, setBillingSuccess] = useState("");
  const [billingError, setBillingError] = useState("");
  const [billingFieldErrors, setBillingFieldErrors] = useState<BillingFieldErrors>({});

  const [primerNombre, segundoNombre] = nombres?.split(" ") ?? [];
  
  
  useEffect(() => {
    const raw = sessionStorage.getItem('temp_payment_data');
    console.log('=== DIAGNÓSTICO ResumenPago ===');
    console.log('1. Contenido RAW de sessionStorage (temp_payment_data):', raw);
    
    const sessionData = SessionPaymentManager.obtener();
    console.log('2. sessionData parseado:', sessionData);
    
    const sessionWizard = SessionWizardData.obtener();
    console.log('3. sessionWizard completo:', sessionWizard);
    
    console.log('4. ¿Existe sessionData?', !!sessionData);
    console.log('5. sessionData.valor:', sessionData?.valor);
    console.log('6. sessionData.cedula:', sessionData?.cedula);
    
     
  }, []);
  
  

  useEffect(() => {
    const validar = async () => {
      const sessionData = SessionPaymentManager.obtener();
      const sessionWizard = SessionWizardData.obtener();

      if (!sessionData || !sessionData.valor || !sessionData.cedula) {
        router.push("/Servicios/landingActivos");
        return;
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

      if (sessionWizard) {
        setNombres(sessionWizard.nombres || "");
        setUsuarioSecuencial(Number(sessionWizard.secuencial || 0));

        const nombreCompleto = [sessionWizard.nombres || "", sessionData?.apellido || ""]
          .join(" ")
          .trim();

        setBilling((prev) => ({
          ...prev,
          secuencialUsuario: Number(sessionWizard.secuencial || 0),
          tipoIdentificacion: inferTipoIdentificacion(sessionData?.cedula || ""),
          identificacion: sessionData?.cedula || "",
          razonSocial: nombreCompleto,
          direccion: prev.direccion || "",
          email: sessionData?.displayName || "",
          telefono: sessionWizard.celular || sessionData?.celular || "",
          obligadoContabilidad: prev.obligadoContabilidad || "N",
          estaActivo: 1,
          usuarioCrea:
            sessionWizard.nombres ||
            sessionData?.displayName ||
            sessionData?.cedula ||
            "NOPAY",
        }));
      }

      setIsValidating(false);
    };

    validar();
  }, [router]);

  useEffect(() => {
    if (!usuarioSecuencial || usuarioSecuencial <= 0) return;

    const cargarDatosFacturacion = async () => {
      setBillingLoading(true);
      setBillingError("");
      setBillingSuccess("");

      try {
        const token = getWizardToken();

        const response = await fetch(`${API_BASE_URL}/datosfacturacion/${usuarioSecuencial}`, {
          method: "GET",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        const data = await response.json().catch(() => null);

        if (response.status === 404) {
          setBillingExists(false);
          setBilling((prev) => ({
            ...prev,
            secuencialUsuario: usuarioSecuencial,
            tipoIdentificacion: prev.tipoIdentificacion || inferTipoIdentificacion(cedula),
            identificacion: prev.identificacion || cedula || "",
            razonSocial:
              prev.razonSocial ||
              [nombres || "", apellidos || ""].join(" ").trim(),
            email: prev.email || email || "",
            telefono: prev.telefono || "",
            obligadoContabilidad: prev.obligadoContabilidad || "N",
            estaActivo: 1,
          }));
          return;
        }

        if (!response.ok) {
          throw new Error(data?.error || data?.message || "No se pudo consultar la información de facturación.");
        }

        setBillingExists(true);
        setBilling({
          secuencial: Number(data?.secuencial || 0),
          secuencialUsuario: Number(data?.secuencial_usuario || usuarioSecuencial),
          tipoIdentificacion: data?.tipo_identificacion || "C",
          identificacion: data?.identificacion || "",
          razonSocial: data?.razon_social || "",
          direccion: data?.direccion || "",
          email: data?.email || "",
          telefono: data?.telefono || "",
          obligadoContabilidad: data?.obligado_contabilidad || "N",
          estaActivo: Number(data?.esta_activo ?? 1),
          usuarioCrea: data?.usuario_crea || nombres || "NOPAY",
        });
      } catch (error) {
        const err = toErrorWithMessage(error);
        setBillingError(err.message || "No se pudo cargar la información de facturación.");
      } finally {
        setBillingLoading(false);
      }
    };

    cargarDatosFacturacion();
  }, [usuarioSecuencial, cedula, nombres, apellidos, email]);

  const billingCompletion = useMemo(() => {
    const requiredValues = [
      billing.tipoIdentificacion,
      billing.identificacion,
      billing.razonSocial,
      billing.direccion,
      billing.email,
      billing.telefono,
    ];

    const filled = requiredValues.filter((v) => String(v || "").trim().length > 0).length;
    return Math.round((filled / requiredValues.length) * 100);
  }, [billing]);

  function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (maybeError && typeof maybeError === "object" && "message" in maybeError) {
      return maybeError as ErrorWithMessage;
    }
    return { message: String(maybeError) };
  }

  function inferTipoIdentificacion(value: string) {
    const clean = String(value || "").replace(/\D/g, "");
    if (!clean) return "C";
    if (clean.length === 13) return "R";
    if (clean.length === 10) return "C";
    return "P";
  }

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function sanitizeBillingForApi(data: DatosFacturacion): DatosFacturacion {
    return {
      ...data,
      secuencialUsuario: Number(data.secuencialUsuario || 0),
      tipoIdentificacion: String(data.tipoIdentificacion || "").trim().toUpperCase(),
      identificacion: String(data.identificacion || "").trim(),
      razonSocial: String(data.razonSocial || "").trim(),
      direccion: String(data.direccion || "").trim(),
      email: String(data.email || "").trim(),
      telefono: String(data.telefono || "").trim(),
      obligadoContabilidad: String(data.obligadoContabilidad || "N").trim().toUpperCase(),
      estaActivo: Number(data.estaActivo ?? 1),
      usuarioCrea: String(data.usuarioCrea || nombres || "NOPAY").trim(),
    };
  }

  function validateBillingForm(data: DatosFacturacion): {
    ok: boolean;
    errors: BillingFieldErrors;
    normalized: DatosFacturacion;
  } {
    const normalized = sanitizeBillingForApi(data);
    const errors: BillingFieldErrors = {};

    if (!normalized.tipoIdentificacion) {
      errors.tipoIdentificacion = "Selecciona el tipo de identificación.";
    } else if (!["C", "R", "P"].includes(normalized.tipoIdentificacion)) {
      errors.tipoIdentificacion = "Tipo de identificación inválido.";
    }

    if (!normalized.identificacion) {
      errors.identificacion = "La identificación es obligatoria.";
    } else {
      if (normalized.tipoIdentificacion === "C" && normalized.identificacion.replace(/\D/g, "").length !== 10) {
        errors.identificacion = "La cédula debe tener 10 dígitos.";
      }
      if (normalized.tipoIdentificacion === "R" && normalized.identificacion.replace(/\D/g, "").length !== 13) {
        errors.identificacion = "El RUC debe tener 13 dígitos.";
      }
      if (normalized.tipoIdentificacion === "P" && normalized.identificacion.length < 5) {
        errors.identificacion = "El pasaporte no parece válido.";
      }
    }

    if (!normalized.razonSocial) {
      errors.razonSocial = "La razón social o nombres son obligatorios.";
    }

    if (!normalized.direccion) {
      errors.direccion = "La dirección es obligatoria para facturación.";
    }

    if (!normalized.email) {
      errors.email = "El correo es obligatorio.";
    } else if (!validateEmail(normalized.email)) {
      errors.email = "Ingresa un correo válido.";
    }

    if (!normalized.telefono) {
      errors.telefono = "El teléfono es obligatorio.";
    } else if (normalized.telefono.replace(/\D/g, "").length < 7) {
      errors.telefono = "Ingresa un teléfono válido.";
    }

    if (!normalized.secuencialUsuario || normalized.secuencialUsuario <= 0) {
      errors.identificacion = errors.identificacion || "No se pudo identificar al usuario logueado.";
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors,
      normalized,
    };
  }

  const onBillingChange = (field: keyof DatosFacturacion, value: string | number) => {
    setBillingSuccess("");
    setBillingError("");

    setBilling((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "tipoIdentificacion") {
      setBillingFieldErrors((prev) => ({
        ...prev,
        tipoIdentificacion: undefined,
        identificacion: undefined,
      }));
      return;
    }

    if (field === "identificacion") {
      setBillingFieldErrors((prev) => ({
        ...prev,
        identificacion: undefined,
      }));
      return;
    }

    if (field === "razonSocial") {
      setBillingFieldErrors((prev) => ({
        ...prev,
        razonSocial: undefined,
      }));
      return;
    }

    if (field === "direccion") {
      setBillingFieldErrors((prev) => ({
        ...prev,
        direccion: undefined,
      }));
      return;
    }

    if (field === "email") {
      setBillingFieldErrors((prev) => ({
        ...prev,
        email: undefined,
      }));
      return;
    }

    if (field === "telefono") {
      setBillingFieldErrors((prev) => ({
        ...prev,
        telefono: undefined,
      }));
    }
  };

  const guardarDatosFacturacion = async () => {
    setBillingSuccess("");
    setBillingError("");

    const validation = validateBillingForm({
      ...billing,
      secuencialUsuario: usuarioSecuencial,
      usuarioCrea: billing.usuarioCrea || nombres || "NOPAY",
    });

    setBillingFieldErrors(validation.errors);

    if (!validation.ok) {
      throw new Error("Completa correctamente los datos de facturación antes de continuar.");
    }

    setBillingSaving(true);

    try {
      const token = getWizardToken();

      const response = await fetch(`${API_BASE_URL}/datosfacturacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(validation.normalized),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "No se pudieron guardar los datos de facturación."
        );
      }

      setBillingExists(true);
      setBillingSuccess(
        data?.mensaje ||
          "Tus datos de facturación quedaron guardados correctamente."
      );

      if (data?.secuencial) {
        setBilling((prev) => ({
          ...prev,
          secuencial: Number(data.secuencial),
        }));
      }

      return true;
    } catch (error) {
      const err = toErrorWithMessage(error);
      setBillingError(err.message || "No se pudieron guardar los datos de facturación.");
      throw error;
    } finally {
      setBillingSaving(false);
    }
  };

  const iniciarPago = async () => {
    setLoading(true);

    try {
      // 1. Primero guarda/actualiza facturación
      await guardarDatosFacturacion();

      // 2. Luego mantiene exactamente el flujo actual
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
        telefono: billing.telefono || "0999999999",
        cedula,
        ip: "127.0.0.1",
        direccionEntrega: billing.direccion || "N/A",
        direccionCliente: billing.direccion || "N/A",
        paisEntrega: "EC",
        paisCliente: "EC",
        productoNombre: servicio,
        productoDescripcion: `Transacción ${servicio} por ítem ${item}`,
        valBase0: 0.0,
        valBaseImp: parseFloat((parseFloat(valor) / 1.15).toFixed(2)),
        valIva: parseFloat((parseFloat(valor) - parseFloat(valor) / 1.15).toFixed(2)),
      };

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
          fecha: new Date().toLocaleDateString(),
          datosFacturacion: {
            tipoIdentificacion: billing.tipoIdentificacion,
            identificacion: billing.identificacion,
            razonSocial: billing.razonSocial,
            direccion: billing.direccion,
            email: billing.email,
            telefono: billing.telefono,
            obligadoContabilidad: billing.obligadoContabilidad,
          },
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
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Verificando sesión...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans antialiased text-slate-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-32 lg:pt-40">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          <div className="space-y-6">
            <header className="mb-8">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <ShieldCheck size={20} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                  Secure Checkout
                </span>
              </div>
              <h1 className="text-4xl font-semibold tracking-tight">
                Finalizar tu solicitud
              </h1>
              <p className="text-slate-500 mt-2">
                Revisa los detalles de tu trámite antes de proceder al pago seguro.
              </p>
            </header>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
                Detalles del Servicio
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      Producto
                    </p>
                    <p className="text-lg font-bold text-slate-800">{servicio}</p>
                    <p className="text-sm text-indigo-600 font-medium">Ítem: {item}</p>
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                    Fase 01
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      Identificación
                    </p>
                    <p className="text-sm font-semibold text-slate-700">{cedula}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      Titular
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {nombres} {apellidos}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-slate-400" size={20} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Opciones de Financiamiento
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    Método de diferido
                    <button
                      onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                      className="text-indigo-500"
                    >
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
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Meses / Cuotas
                  </label>
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
                        <li>
                          • <b>Corriente:</b> Se carga el valor total en tu próximo estado.
                        </li>
                        <li>
                          • <b>Diferido:</b> Divide el pago según las cuotas elegidas.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ReceiptText className="text-slate-400" size={20} />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      Datos de Facturación
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Completa estos datos una sola vez. Al pulsar <b>Pagar mi Proceso</b>,
                    el sistema los guardará automáticamente antes de continuar al pago.
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
                      Completado {billingCompletion}%
                    </span>
                  </div>
                </div>
              </div>

              {billingLoading && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4 text-sm font-medium text-indigo-900">
                  <Loader2 size={18} className="animate-spin" />
                  Cargando información de facturación del usuario...
                </div>
              )}

              <AnimatePresence>
                {!!billingError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 text-sm text-rose-800"
                  >
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Revisa tus datos de facturación</p>
                      <p className="opacity-90">{billingError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {!!billingSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-800"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">
                        {billingExists ? "Información actualizada" : "Información registrada"}
                      </p>
                      <p className="opacity-90">{billingSuccess}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <FileBadge2 size={14} />
                    Tipo de identificación
                  </label>
                  <select
                    value={billing.tipoIdentificacion}
                    onChange={(e) => onBillingChange("tipoIdentificacion", e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                      billingFieldErrors.tipoIdentificacion
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="C">Cédula</option>
                    <option value="R">RUC</option>
                    <option value="P">Pasaporte</option>
                  </select>
                  {billingFieldErrors.tipoIdentificacion && (
                    <p className="text-[11px] font-semibold text-rose-600">
                      {billingFieldErrors.tipoIdentificacion}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <FileBadge2 size={14} />
                    Número de identificación
                  </label>
                  <input
                    type="text"
                    value={billing.identificacion}
                    onChange={(e) => onBillingChange("identificacion", e.target.value)}
                    placeholder="Ingresa la identificación para facturación"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                      billingFieldErrors.identificacion
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200"
                    }`}
                  />
                  {billingFieldErrors.identificacion && (
                    <p className="text-[11px] font-semibold text-rose-600">
                      {billingFieldErrors.identificacion}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Building2 size={14} />
                    Razón social / nombres completos
                  </label>
                  <input
                    type="text"
                    value={billing.razonSocial}
                    onChange={(e) => onBillingChange("razonSocial", e.target.value)}
                    placeholder="Nombre o razón social para la factura"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                      billingFieldErrors.razonSocial
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200"
                    }`}
                  />
                  {billingFieldErrors.razonSocial && (
                    <p className="text-[11px] font-semibold text-rose-600">
                      {billingFieldErrors.razonSocial}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <MapPin size={14} />
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={billing.direccion}
                    onChange={(e) => onBillingChange("direccion", e.target.value)}
                    placeholder="Dirección fiscal o domicilio para la factura"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                      billingFieldErrors.direccion
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200"
                    }`}
                  />
                  {billingFieldErrors.direccion && (
                    <p className="text-[11px] font-semibold text-rose-600">
                      {billingFieldErrors.direccion}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Mail size={14} />
                    Correo para factura
                  </label>
                  <input
                    type="email"
                    value={billing.email}
                    onChange={(e) => onBillingChange("email", e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                      billingFieldErrors.email
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200"
                    }`}
                  />
                  {billingFieldErrors.email && (
                    <p className="text-[11px] font-semibold text-rose-600">
                      {billingFieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Phone size={14} />
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={billing.telefono}
                    onChange={(e) => onBillingChange("telefono", e.target.value)}
                    placeholder="0999999999"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                      billingFieldErrors.telefono
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200"
                    }`}
                  />
                  {billingFieldErrors.telefono && (
                    <p className="text-[11px] font-semibold text-rose-600">
                      {billingFieldErrors.telefono}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Obligado a llevar contabilidad
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Déjalo en <b>No</b> si no aplica a tu caso.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-1">
                    <button
                      type="button"
                      onClick={() => onBillingChange("obligadoContabilidad", "N")}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                        billing.obligadoContabilidad === "N"
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => onBillingChange("obligadoContabilidad", "S")}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                        billing.obligadoContabilidad === "S"
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      Sí
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                <Clock size={14} />
                {billingExists
                  ? "Se reutilizará tu información de facturación"
                  : "Se registrará tu información de facturación al continuar"}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />

              <p className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-4">
                Resumen de Orden
              </p>

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
                    <span className="block text-3xl font-bold tracking-tighter">
                      ${valor}
                    </span>
                    <span className="text-[10px] text-indigo-300/50 uppercase font-bold tracking-widest">
                      USD Incl. IVA
                    </span>
                  </div>
                </div>
              </div>

              <button
                disabled={loading || billingSaving || billingLoading}
                onClick={iniciarPago}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading || billingSaving ? (
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

            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex justify-between items-center px-6">
              <Image
                src="https://datafast.com.ec/images/logo.png"
                alt="Datafast"
                width={60}
                height={20}
                className="grayscale opacity-50"
              />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <ShieldCheck size={12} />
                PCI DSS Compliant
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400 px-6 leading-relaxed">
              Al hacer clic en el botón, serás redirigido a nuestra pasarela segura
              para completar la transacción.
            </p>
          </aside>
        </div>
      </main>

      <div className="mt-20 border-t border-slate-200 bg-white py-10 text-center">
        <p className="text-xs font-medium text-slate-400">
          ¿Necesitas ayuda? Escríbenos a{" "}
          <span className="text-indigo-600 font-bold">info@nopaylegal.com</span>
        </p>
      </div>
    </div>
  );
}