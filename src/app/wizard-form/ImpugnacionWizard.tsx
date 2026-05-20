"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { marked } from "marked";
import { createWorker } from "tesseract.js";
import {
  AlertCircle,
  AlertTriangle,
  Building,
  Calendar,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Globe,
  Hash,
  Loader2,
  MapPin,
  Paperclip,
  Radar,
  Shield,
  ShieldCheck,
  UploadCloud,
  User,
  X,
  Lock,
  Fingerprint,
  ShieldEllipsis,
  Network,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Header } from "app/resources/Header";
import Footer from "app/resources/Footer";
import TermsModal from "app/resources/TermsModal";
import CargaDocumentosServicio from "app/documentos/page";
import NoPayBackground from "components/NoPayBackground";

import { API_BASE_URL, valorImpugnacionGl } from "config/apiConfig";
import { getWizardToken } from "lib/seguridad/sessionUtils";
import { SessionJWTManager } from "lib/seguridad/SessionJWTManager";
import { SessionPaymentManager } from "lib/seguridad/SessionPaymentManager";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { isJWTValid, useLogout } from "lib/seguridad/prevalidadorToken";

// ======================== TIPOS ========================
type OCRResult = {
  text: string;
  confidence: number;
  extractedData: {
    citationNumber?: string;
    licensePlate?: string;
    date?: string;
    agency?: string;
  };
};

type FileWithPreview = File & {
  preview?: string;
  ocrResult?: OCRResult;
};

type MultaDetectada = {
  secuencial: number;
  id_factura: string;
  ente: string;
  fecha_emision: string;
  total: number;
  rubro: string;
  secuencia_1: string;
  estado: string;
};

// ======================== FUNCIONES PURAS ========================
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const normalizeFecha = (fecha: string | null | undefined): string | null => {
  if (!fecha) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
  const dmy = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/;
  if (iso.test(fecha)) return fecha;
  const m = fecha.match(dmy);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
};

const preprocessImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, file.type);
    };
  });
};

const compressImage = async (file: File, maxSizeBytes: number): Promise<File> => {
  if (!file.type.startsWith("image/")) throw new Error("No es un archivo de imagen");
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener contexto de canvas");
  ctx.drawImage(bitmap, 0, 0);
  let quality = 0.9;
  let blob: Blob | null = null;
  while (quality > 0.1) {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    );
    if (!blob) break;
    if (blob.size <= maxSizeBytes) break;
    quality -= 0.1;
  }
  if (!blob || blob.size > maxSizeBytes) {
    throw new Error(
      `No se pudo comprimir imagen por debajo de ${(maxSizeBytes / 1024 / 1024).toFixed(1)} MB`
    );
  }
  return new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
    type: "image/jpeg",
  });
};

const extractStructuredData = (text: string) => {
  const cleanedText = text.replace(/\s+/g, " ").replace(/[|\\]/g, "").trim();
  const citationMatch = cleanedText.match(
    /(?:CITACI[ÓO]N|N[ÚU]MERO|CODIGO|No?\.?)[\s:]*([A-Z0-9-]{6,12})/i
  );
  const plateMatch = cleanedText.match(
    /(?:PLACA|MATR[ÍI]CULA|PATENTE)[\s:]*([A-Z]{2,3}-?\d{3,4})/i
  );
  const dateMatch = cleanedText.match(
    /(?:FECHA|F\.?H\.?)[\s:]*(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/i
  );
  return {
    citationNumber: citationMatch?.[1]?.trim(),
    licensePlate: plateMatch?.[1]?.replace(/-/g, "")?.toUpperCase(),
    date: dateMatch?.[1]?.replace(/\//g, "-")?.trim(),
  };
};

const processImageWithOCR = async (file: File, onProgress?: (progress: number) => void): Promise<OCRResult> => {
  try {
    const blob = await preprocessImage(file);
    const worker = await createWorker({
      logger: (m) => {
        if (m.status === "recognizing text" && m.progress !== undefined && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });
    await worker.loadLanguage("spa");
    await worker.initialize("spa");
    const { data } = await worker.recognize(blob);
    await worker.terminate();
    return {
      text: data.text,
      confidence: data.confidence,
      extractedData: extractStructuredData(data.text),
    };
  } catch {
    return { text: "", confidence: 0, extractedData: {} };
  }
};

export const generarPromptIAOptimista = (input: {
  nombre: string;
  cedula: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  tipoMulta: string;
  agencia: string;
  fechaCitacion: string;
  numeroCitacion: string;
  vehiculoDescripcion: string;
  archivos: FileWithPreview[];
  ocrResults: OCRResult[];
}): string => {
  const hoy = new Date().toISOString().split("T")[0];
  let prompt = `Fecha de análisis: ${hoy}\n\n`;
  prompt += `Eres una abogada ecuatoriana experta en tránsito, con orientación positiva y claridad didáctica. Analiza la impugnación de la multa de tránsito presentada a continuación, usando únicamente la legislación ecuatoriana vigente (COIP, Ley Orgánica de Transporte Terrestre, Tránsito y Seguridad Vial - LOTTTSV, Código Orgánico Administrativo - COA) y menciona siempre el artículo exacto.\n\n`;
  prompt += `Datos del ciudadano:\n`;
  prompt += `- Nombre: ${input.nombre}\n`;
  prompt += `- Cédula: ${input.cedula}\n`;
  prompt += `- Ubicación: ${input.direccion}, ${input.ciudad}, ${input.provincia}\n\n`;
  prompt += `Detalles de la citación:\n`;
  prompt += `- Tipo de sanción: ${input.tipoMulta}\n`;
  prompt += `- Agencia emisora: ${input.agencia}\n`;
  prompt += `- Fecha citación: ${input.fechaCitacion} (Días transcurridos: ${Math.floor(
    (new Date().getTime() - new Date(input.fechaCitacion).getTime()) / (1000 * 60 * 60 * 24)
  )})\n`;
  prompt += `- N° citación: ${input.numeroCitacion}\n`;
  prompt += `- Vehículo implicado: ${input.vehiculoDescripcion}\n\n`;
  prompt += `Documentación adjunta:\n`;
  input.archivos.forEach((file: FileWithPreview, idx: number) => {
    prompt += `▶ Documento ${idx + 1}: ${file.name}\n`;
    if (input.ocrResults[idx]) {
      const confidence = input.ocrResults[idx].confidence ?? 0;
      prompt += `   ▸ Reconocimiento OCR (${confidence}% confianza):\n`;
      prompt += `   "${input.ocrResults[idx].text.trim().replace(/\n+/g, " ")}"\n`;
      if (confidence < 70) prompt += `   ▸ Observación: La calidad de imagen sugiere revisión manual - oportunidad de complementar con mejor evidencia.\n`;
      if (input.ocrResults[idx].extractedData) {
        prompt += `   ▸ Datos estructurados: ${JSON.stringify(input.ocrResults[idx].extractedData)}\n`;
      }
    }
  });
  prompt += `\nLineamientos para tu análisis jurídico:\n`;
  prompt += `1. Calcula con precisión si el plazo para impugnación (Art. 644 COIP - 3 días hábiles desde la notificación) está vigente o vencido. Si está vencido, busca alternativas jurídicas válidas (acción de nulidad por vicios de forma, prescripción Art. 27 LOTTTSV, recursos administrativos según COA) y especifica cuándo y cómo procede cada una.\n\n`;
  prompt += `2. Evalúa la validez formal de la boleta: identifica posibles vicios sustanciales (datos erróneos, falta de firma, placa incorrecta, errores en nombres, documentos ilegibles), y sustenta toda recomendación con el artículo exacto, especialmente Art. 139 COIP para nulidad de actuaciones defectuosas.\n\n`;
  prompt += `3. Solo menciona recursos administrativos (reposición, revisión) si la sanción aún no está firme y según lo permite el COA. No cites el Art. 149 LOTTTSV para recursos, pues corresponde solo a descuentos por pronto pago.\n\n`;
  prompt += `4. En caso de haber vencido todos los plazos ordinarios, analiza la posibilidad de interponer acciones extraordinarias (acción de nulidad, revisión administrativa, prescripción), detallando bajo qué condiciones pueden prosperar, con base legal clara.\n\n`;
  prompt += `5. No generes falsas expectativas: aclara con honestidad los riesgos, probabilidades y posibles desenlaces. Explica al usuario los pasos concretos a seguir según el caso.\n\n`;
  prompt += `6. Usa un lenguaje humano, cálido y empático, pero siempre legalmente riguroso, directo y orientado a soluciones reales. Puedes extenderte más de 300 palabras si es necesario.\n\n`;
  prompt += `7. No incluyas artículos que no sean relevantes o que se presten a confusión con delitos de otra materia.\n\n`;
  prompt += `8. Antes de finalizar, resume tus conclusiones y sugiere al usuario el siguiente paso más adecuado.\n\n`;
  prompt += `Importante: No inventes plazos ni atribuyas plazos legales que no existen.\n\n`;
  prompt += `Redacta como una abogada ecuatoriana experta, orientando siempre a la mejor decisión legal posible para el usuario.`;
  return prompt;
};

// ======================== COMPONENTES AUXILIARES MEMOIZADOS ========================
const Notification = memo(({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 18, scale: 0.98 }}
    className="fixed bottom-4 right-4 z-[80] w-[calc(100%-2rem)] max-w-md"
  >
    <div className="rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          <Check className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Notificación</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{message}</p>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  </motion.div>
));
Notification.displayName = "Notification";

const SectionCard = memo(({ title, description, icon, children }: any) => (
  <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
    <div className="mb-8 flex items-start gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d4ed8] to-[#06b6d4] text-white shadow-lg shadow-cyan-500/20">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>}
      </div>
    </div>
    {children}
  </div>
));
SectionCard.displayName = "SectionCard";

const Field = memo(({ label, error, icon, children }: any) => (
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
      {icon && <span className="text-slate-400">{icon}</span>}
      {label}
    </label>
    {children}
    {error && <p className="mt-2 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{error}</p>}
  </div>
));
Field.displayName = "Field";

const TextInput = memo(({ value, onChange, placeholder, error, type = "text", disabled = false }: any) => (
  <input
    type={type}
    disabled={disabled}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={cn(
      "w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition sm:text-[15px]",
      "placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100",
      disabled && "cursor-not-allowed bg-slate-50 text-slate-400",
      error ? "border-red-300" : "border-slate-200"
    )}
  />
));
TextInput.displayName = "TextInput";

const SelectInput = memo(({ value, onChange, error, children, disabled = false }: any) => (
  <select
    disabled={disabled}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition sm:text-[15px]",
      "focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100",
      disabled && "cursor-not-allowed bg-slate-50 text-slate-400",
      error ? "border-red-300" : "border-slate-200"
    )}
  >
    {children}
  </select>
));
SelectInput.displayName = "SelectInput";

const SummaryItem = memo(({ label, value, icon }: any) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
    <div className="mb-2 flex items-center gap-2">
      {icon && <div className="text-slate-400">{icon}</div>}
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
    </div>
    <div className="text-sm font-medium text-slate-800 sm:text-[15px]">
      {value || <span className="italic text-slate-400">No especificado</span>}
    </div>
  </div>
));
SummaryItem.displayName = "SummaryItem";

const STEPS = [
  { id: 1, label: "Ubicación", icon: MapPin },
  { id: 2, label: "Multa", icon: AlertTriangle },
  { id: 3, label: "Documentos", icon: FileText },
  { id: 4, label: "Vehículo", icon: Car },
  { id: 5, label: "Revisión", icon: ClipboardList },
  { id: 6, label: "Análisis IA", icon: ShieldCheck },
  { id: 7, label: "Confirmación", icon: Check },
];

const Stepper = memo(({ step, completedSteps }: { step: number; completedSteps: number[] }) => (
  <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6">
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Flujo de impugnación</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Sólo necesitamos un poco de información</h1>
        <p className="mt-1 text-sm text-slate-600">Completa cada etapa de forma clara y ordenada.</p>
      </div>
      <div className="inline-flex items-center rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
        Paso actual:&nbsp;<span className="font-bold text-slate-900">{step} de {STEPS.length}</span>
      </div>
    </div>

    {/* Desktop */}
    <div className="hidden lg:block">
      <div className="flex items-start justify-between gap-2">
        {STEPS.map((item, index) => {
          const Icon = item.icon;
          const isActive = step === item.id;
          const isCompleted = completedSteps.includes(item.id);
          const isPending = !isActive && !isCompleted;
          return (
            <React.Fragment key={item.id}>
              <div className="flex min-w-[110px] flex-1 flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300",
                    isCompleted && "border-emerald-200 bg-emerald-500 text-white shadow-lg shadow-emerald-200/60",
                    isActive && "border-cyan-200 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200/70 ring-4 ring-cyan-100",
                    isPending && "border-slate-200 bg-slate-50 text-slate-400"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={cn(
                    "absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold",
                    isCompleted && "border-emerald-200 bg-white text-emerald-600",
                    isActive && "border-cyan-200 bg-white text-cyan-700",
                    isPending && "border-slate-200 bg-white text-slate-400"
                  )}>{item.id}</div>
                </div>
                <p className={cn("text-sm font-semibold", isActive && "text-slate-900", isCompleted && "text-emerald-700", isPending && "text-slate-500")}>{item.label}</p>
                <p className={cn("mt-1 text-xs", isActive && "text-cyan-700", isCompleted && "text-emerald-600", isPending && "text-slate-400")}>
                  {isCompleted ? "Completado" : isActive ? "En curso" : "Pendiente"}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div className="mt-7 flex flex-1 items-center">
                  <div className="h-[3px] w-full rounded-full bg-slate-200">
                    <div className={cn("h-[3px] rounded-full transition-all duration-500", step > item.id ? "w-full bg-gradient-to-r from-emerald-400 to-cyan-500" : "w-0 bg-transparent")} />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>

    {/* Mobile */}
    <div className="lg:hidden">
      <div className="mb-4 flex items-center gap-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
        {(() => {
          const currentStep = STEPS.find((s) => s.id === step);
          if (!currentStep) return null;
          const CurrentIcon = currentStep.icon;
          return (
            <>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
                <CurrentIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Paso actual</p>
                <p className="truncate text-base font-bold text-slate-900">{currentStep.label}</p>
                <p className="text-sm text-slate-600">{step} de {STEPS.length}</p>
              </div>
            </>
          );
        })()}
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500" style={{ width: `${(step / STEPS.length) * 100}%` }} />
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {STEPS.map((item) => {
          const Icon = item.icon;
          const isActive = step === item.id;
          const isCompleted = completedSteps.includes(item.id);
          const isPending = !isActive && !isCompleted;
          return (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border transition-all",
                isCompleted && "border-emerald-200 bg-emerald-500 text-white",
                isActive && "border-cyan-200 bg-gradient-to-br from-cyan-500 to-blue-600 text-white ring-2 ring-cyan-100",
                isPending && "border-slate-200 bg-slate-50 text-slate-400"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn("text-center text-[11px] font-medium leading-tight", isActive && "text-slate-900", isCompleted && "text-emerald-700", isPending && "text-slate-500")}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
));
Stepper.displayName = "Stepper";

// ======================== SUBCOMPONENTES DE PASOS ========================
const Step1 = memo(({ formData, errors, setFormData }: any) => (
  <SectionCard title="Ubicación de la infracción" description="Ingresa la dirección donde ocurrió el hecho." icon={<MapPin className="h-7 w-7" />}>
    <div className="space-y-6">
      <div className="hidden">
        <Field label="Dirección" error={errors.direccion} icon={<MapPin className="h-4 w-4" />}>
          <TextInput value={formData.direccion} onChange={(value: string) => setFormData((prev: any) => ({ ...prev, direccion: value }))} placeholder="Ejemplo: Av. Solano y Av. 12 de Abril" error={errors.direccion} />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Provincia" error={errors.provincia} icon={<Globe className="h-4 w-4" />}>
          <SelectInput value={formData.provincia} onChange={(value: string) => setFormData((prev: any) => ({ ...prev, provincia: value }))} error={errors.provincia}>
            <option value="">Seleccione una opción</option>
            <option value="Azuay">Azuay</option>
          </SelectInput>
        </Field>
        <Field label="Ciudad" error={errors.ciudad} icon={<Building className="h-4 w-4" />}>
          <SelectInput value={formData.ciudad} onChange={(value: string) => setFormData((prev: any) => ({ ...prev, ciudad: value }))} error={errors.ciudad}>
            <option value="">Seleccione un cantón</option>
            {["Cuenca", "Camilo Ponce Enríquez", "Chordeleg", "El Pan", "Girón", "Guachapala", "Gualaceo", "Nabón", "Oña", "Paute", "Pucará", "San Fernando", "Santa Isabel", "Sevilla de Oro", "Sigsig"].map((canton) => (
              <option key={canton} value={canton}>{canton}</option>
            ))}
          </SelectInput>
        </Field>
      </div>
    </div>
  </SectionCard>
));
Step1.displayName = "Step1";

const Step2 = memo(({ formData, errors, setFormData }: any) => (
  <SectionCard title="Detalles principales de la multa" description="Selecciona cómo fue emitida la multa y la entidad que la generó." icon={<Radar className="h-7 w-7" />}>
    <div className="space-y-8">
      <Field label="¿Cómo fue multado?" error={errors.tipoMulta} icon={<AlertTriangle className="h-4 w-4" />}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {["Radar Móvil", "Radar Fijo", "Agente Tránsito", "Otro"].map((tipo) => (
            <button key={tipo} type="button" onClick={() => setFormData((prev: any) => ({ ...prev, tipoMulta: tipo }))} className={cn(
              "rounded-2xl border px-4 py-4 text-left transition",
              formData.tipoMulta === tipo ? "border-cyan-300 bg-cyan-50 ring-2 ring-cyan-100" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            )}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-800">{tipo}</span>
                <div className={cn("flex h-5 w-5 items-center justify-center rounded-full border", formData.tipoMulta === tipo ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-300")}>
                  {formData.tipoMulta === tipo && <Check className="h-3 w-3" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Field>
      <Field label="Agencia emisora" error={errors.agencia} icon={<Shield className="h-4 w-4" />}>
        <SelectInput value={formData.agencia} onChange={(value: string) => setFormData((prev: any) => ({ ...prev, agencia: value }))} error={errors.agencia}>
          <option value="">Seleccione la agencia</option>
          <option value="ANT">ANT</option>
          <option value="Agencia Municipal">Municipal</option>
        </SelectInput>
      </Field>
    </div>
  </SectionCard>
));
Step2.displayName = "Step2";

const Step3 = memo(({ errors }: any) => (
  <SectionCard title="Documentos requeridos" description="En esta sección puedes completar la carga documental obligatoria del servicio." icon={<FileText className="h-7 w-7" />}>
    <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <CargaDocumentosServicio />
    </div>
    {errors.archivos && <p className="mt-4 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{errors.archivos}</p>}
  </SectionCard>
));
Step3.displayName = "Step3";

// ======================== COMPONENTE PRINCIPAL ========================
const ImpugnacionWizard = () => {
  const router = useRouter();
  const logout = useLogout();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const multasPanelRef = useRef<HTMLDivElement>(null);
  const securityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingStep, setPendingStep] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [htmlIA, setHtmlIA] = useState("");
  const [respuestaIA, setRespuestaIA] = useState("");
  const [cargandoIA, setCargandoIA] = useState(false);
  const [errorIA, setErrorIA] = useState("");
  const [loading, setLoading] = useState(true);
  const [nombreParam, setNombreParam] = useState("");
  const [cedula, setCedula] = useState("");
  const [secuencialUser, setSecuencialUser] = useState("");
  const [vehiculosUsuario, setVehiculosUsuario] = useState<{ secuencial: number; descripcion: string }[]>([]);
  const [multasVehiculo, setMultasVehiculo] = useState<MultaDetectada[]>([]);
  const [multaSeleccionada, setMultaSeleccionada] = useState<MultaDetectada | null>(null);
  const [cargandoMultas, setCargandoMultas] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [securityStage, setSecurityStage] = useState(-1);
  const [formData, setFormData] = useState({
    direccion: "",
    provincia: "",
    ciudad: "",
    tipoMulta: "",
    agencia: "",
    fechaCitacion: "",
    numeroCitacion: "",
    vehiculo: "",
    archivos: [] as FileWithPreview[],
    comprobantePago: null as File | null,
    aceptaTerminos: false,
    aceptaTerminosUso: false,
    ocrResults: [] as OCRResult[],
  });

  const securityMessages = [
    { icon: Lock, text: "Preparando modo seguro", color: "cyan" },
    { icon: Fingerprint, text: "Cifrando datos personales", color: "indigo" },
    { icon: ShieldCheck, text: "Verificando integridad", color: "emerald" },
    { icon: Network, text: "Estableciendo canal seguro", color: "blue" },
    { icon: Check, text: "Redirigiendo a pago seguro", color: "green" },
  ];

  const progressPercent = useMemo(() => Math.round((step / 7) * 100), [step]);
  const hayMultas = useMemo(() => multasVehiculo.length > 0, [multasVehiculo]);
  const vehiculoDescripcion = useMemo(() => {
    const vehiculoObj = vehiculosUsuario.find((v) => v.secuencial.toString() === formData.vehiculo);
    return vehiculoObj ? vehiculoObj.descripcion : "No seleccionado";
  }, [vehiculosUsuario, formData.vehiculo]);

  const showTemporaryNotification = useCallback((message: string, duration = 5000) => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    setNotificationMessage(message);
    setShowNotification(true);
    notificationTimeoutRef.current = setTimeout(() => setShowNotification(false), duration);
  }, []);

  const validateTokenAndAuth = useCallback(async () => {
    const token = getWizardToken();
    if (!token) {
      setLoading(false);
      router.replace("/login");
      return;
    }
    try {
      const isValid = await isJWTValid(token);
      if (!isValid) {
        showTemporaryNotification("Tu sesión ha expirado. Serás redirigido al inicio de sesión.");
        setTimeout(() => { logout(); router.replace("/login"); }, 1800);
      }
      setLoading(false);
    } catch {
      logout();
      router.replace("/login");
    }
  }, [router, logout, showTemporaryNotification]);

  useEffect(() => {
    validateTokenAndAuth();
    intervalRef.current = setInterval(validateTokenAndAuth, 2 * 60 * 1000);
    const onVisibility = () => { if (document.visibilityState === "visible") validateTokenAndAuth(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [validateTokenAndAuth]);

  useEffect(() => {
    const validarJWT = async () => {
      const esValido = await SessionJWTManager.isValid();
      if (!esValido) {
        showTemporaryNotification("Tu sesión ha expirado o es inválida. Serás redirigido.");
        setTimeout(() => { window.location.href = "/"; }, 1800);
        return;
      }
      setLoading(false);
    };
    validarJWT();
  }, [showTemporaryNotification]);

  useEffect(() => {
    const wizardData = SessionWizardData.obtener();
    if (wizardData) {
      setCedula(wizardData.cedula || "");
      setSecuencialUser(wizardData.secuencial?.toString() || "");
      setNombreParam(`${wizardData.nombres || ""} ${wizardData.apellidos || ""}`.trim());
    }
  }, []);

  useEffect(() => {
    return () => {
      formData.archivos.forEach((file) => { if (file.preview) URL.revokeObjectURL(file.preview); });
    };
  }, [formData.archivos]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const fetchVehiculos = useCallback(async () => {
    if (!secuencialUser) return;
    try {
      const token = getWizardToken();
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/vehiculos/${secuencialUser}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setVehiculosUsuario(data || []);
    } catch { setVehiculosUsuario([]); }
  }, [secuencialUser]);

  useEffect(() => { fetchVehiculos(); }, [fetchVehiculos]);

  const fetchMultasVehiculo = useCallback(async () => {
    if (!formData.vehiculo) { setMultasVehiculo([]); setMultaSeleccionada(null); return; }
    setCargandoMultas(true);
    try {
      const token = getWizardToken();
      const res = await fetch(`${API_BASE_URL}/vehiculos/${formData.vehiculo}/multas`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Error al obtener multas");
      const data = await res.json();
      setMultasVehiculo(data || []);
    } catch { setMultasVehiculo([]); } finally { setCargandoMultas(false); }
  }, [formData.vehiculo]);

  useEffect(() => { fetchMultasVehiculo(); }, [fetchMultasVehiculo]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const MAX_SIZE = 5 * 1024 * 1024;
    const rawFiles = Array.from(e.target.files);
    const validFiles: File[] = [];
    const localErrors: string[] = [];
    for (let file of rawFiles) {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      if (!isImage && !isPdf) { localErrors.push(`${file.name}: solo imágenes o PDF.`); continue; }
      if (file.size > MAX_SIZE) {
        if (isImage) {
          try { file = await compressImage(file, MAX_SIZE); } catch (err: any) { localErrors.push(`${file.name}: ${err.message}`); continue; }
        } else { localErrors.push(`${file.name}: supera 5 MB y no es imagen.`); continue; }
      }
      validFiles.push(file);
    }
    if (localErrors.length > 0) showTemporaryNotification(localErrors.join(" "));
    if (validFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const processedFiles: FileWithPreview[] = [];
      const ocrResults: OCRResult[] = [];
      for (const file of validFiles) {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        processedFiles.push(fileWithPreview);
        if (file.type.startsWith("image/")) {
          const result = await processImageWithOCR(file, (p) => setOcrProgress(p));
          ocrResults.push(result);
        } else { ocrResults.push({ text: "", confidence: 0, extractedData: {} }); }
      }
      setFormData((prev) => {
        const newFiles = [...prev.archivos, ...processedFiles];
        const newOcrs = [...prev.ocrResults, ...ocrResults];
        const last = newOcrs[newOcrs.length - 1]?.extractedData || {};
        return { ...prev, archivos: newFiles, ocrResults: newOcrs, numeroCitacion: last.citationNumber || prev.numeroCitacion, fechaCitacion: last.date || prev.fechaCitacion, agencia: last.agency || prev.agencia };
      });
    } catch (error) { console.error(error); showTemporaryNotification("Error procesando archivos."); } finally { setIsProcessing(false); if (e.target) e.target.value = ""; }
  }, [showTemporaryNotification]);

  const removeFile = useCallback((index: number) => {
    setFormData((prev) => {
      const newFiles = [...prev.archivos];
      const newOcrResults = [...prev.ocrResults];
      if (newFiles[index]?.preview) URL.revokeObjectURL(newFiles[index].preview!);
      newFiles.splice(index, 1);
      newOcrResults.splice(index, 1);
      return { ...prev, archivos: newFiles, ocrResults: newOcrResults };
    });
  }, []);

  const scrollToMultas = useCallback(() => {
    if (multasPanelRef.current) multasPanelRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const validateStep = useCallback((stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};
    switch (stepNumber) {
      case 1:
        if (!formData.provincia) newErrors.provincia = "La provincia es requerida.";
        if (!formData.ciudad) newErrors.ciudad = "La ciudad es requerida.";
        break;
      case 2:
        if (!formData.tipoMulta) newErrors.tipoMulta = "Seleccione el tipo de multa.";
        if (!formData.agencia) newErrors.agencia = "Seleccione la agencia.";
        break;
      case 3:
        if (!(window as any).todosDocumentosCompletos) newErrors.archivos = "Debes subir todos los documentos requeridos.";
        break;
      case 4:
        if (!formData.vehiculo) newErrors.vehiculo = "Seleccione un vehículo.";
        if (!formData.numeroCitacion?.trim()) newErrors.numeroCitacion = "Ingrese o seleccione el número de citación.";
        if (!formData.fechaCitacion?.trim()) {
          newErrors.fechaCitacion = "Ingrese o seleccione la fecha de citación.";
        } else {
          const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!fechaRegex.test(formData.fechaCitacion)) newErrors.fechaCitacion = "Formato de fecha inválido. Use AAAA-MM-DD.";
          else if (isNaN(new Date(formData.fechaCitacion).getTime())) newErrors.fechaCitacion = "Fecha no válida.";
        }
        if (multasVehiculo.length === 0 && formData.archivos.length === 0) newErrors.archivos = "Debes cargar al menos una imagen de la citación porque no hay multas registradas para este vehículo.";
        break;
      case 5:
        if (!formData.aceptaTerminos) newErrors.aceptaTerminos = "Debes confirmar la veracidad de la información.";
        if (!formData.aceptaTerminosUso) newErrors.aceptaTerminosUso = "Debes aceptar los términos y condiciones de uso.";
        break;
      default: break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, multasVehiculo]);

  const validateAllData = useCallback((): { isValid: boolean; errors: Record<string, string>; firstErrorStep: number | null } => {
    const allErrors: Record<string, string> = {};
    let firstErrorStep: number | null = null;
    if (!formData.provincia) allErrors.provincia = "La provincia es requerida.";
    if (!formData.ciudad) allErrors.ciudad = "La ciudad es requerida.";
    if (Object.keys(allErrors).some(k => ["provincia", "ciudad"].includes(k)) && firstErrorStep === null) firstErrorStep = 1;
    if (!formData.tipoMulta) allErrors.tipoMulta = "Seleccione el tipo de multa.";
    if (!formData.agencia) allErrors.agencia = "Seleccione la agencia.";
    if (Object.keys(allErrors).some(k => ["tipoMulta", "agencia"].includes(k)) && firstErrorStep === null) firstErrorStep = 2;
    if (!(window as any).todosDocumentosCompletos) { allErrors.archivos = "Debes subir todos los documentos requeridos."; if (firstErrorStep === null) firstErrorStep = 3; }
    if (!formData.vehiculo) allErrors.vehiculo = "Seleccione un vehículo.";
    if (!formData.numeroCitacion?.trim()) allErrors.numeroCitacion = "Ingrese o seleccione el número de citación.";
    if (!formData.fechaCitacion?.trim()) allErrors.fechaCitacion = "Ingrese o seleccione la fecha de citación.";
    else {
      const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!fechaRegex.test(formData.fechaCitacion)) allErrors.fechaCitacion = "Formato de fecha inválido. Use AAAA-MM-DD.";
      else if (isNaN(new Date(formData.fechaCitacion).getTime())) allErrors.fechaCitacion = "Fecha no válida.";
    }
    if (multasVehiculo.length === 0 && formData.archivos.length === 0) { allErrors.archivos = "Debes cargar al menos una imagen de la citación porque no hay multas registradas para este vehículo."; if (firstErrorStep === null) firstErrorStep = 4; }
    if (Object.keys(allErrors).some(k => ["vehiculo", "numeroCitacion", "fechaCitacion", "archivos"].includes(k)) && firstErrorStep === null) firstErrorStep = 4;
    if (!formData.aceptaTerminos) allErrors.aceptaTerminos = "Debes confirmar la veracidad de la información.";
    if (!formData.aceptaTerminosUso) allErrors.aceptaTerminosUso = "Debes aceptar los términos y condiciones de uso.";
    if (Object.keys(allErrors).some(k => ["aceptaTerminos", "aceptaTerminosUso"].includes(k)) && firstErrorStep === null) firstErrorStep = 5;
    const enteValue = multaSeleccionada?.ente || formData.agencia;
    if (!enteValue) { allErrors.agencia = "No se pudo determinar la entidad emisora. Seleccione una agencia o una multa existente."; if (firstErrorStep === null) firstErrorStep = 2; }
    return { isValid: Object.keys(allErrors).length === 0, errors: allErrors, firstErrorStep };
  }, [formData, multasVehiculo, multaSeleccionada]);

  const markStepAsCompleted = useCallback((stepNumber: number) => {
    setCompletedSteps((prev) => prev.includes(stepNumber) ? prev : [...prev, stepNumber]);
  }, []);

  const nextStep = useCallback(() => {
    if (!validateStep(step)) return;
    markStepAsCompleted(step);
    if (step === 5) { setStep(6); return; }
    if (step === 6) { setShowTermsModal(true); setPendingStep(7); return; }
    if (step < 7) setStep(step + 1);
  }, [step, validateStep, markStepAsCompleted]);

  const prevStep = useCallback(() => { if (step > 1) setStep(step - 1); }, [step]);

  const handleFinalSubmit = useCallback(async () => {
    const { isValid, errors: globalErrors, firstErrorStep } = validateAllData();
    if (!isValid) {
      showTemporaryNotification("Faltan datos requeridos. Por favor completa los campos marcados en rojo.");
      setErrors(globalErrors);
      if (firstErrorStep !== null) { setStep(firstErrorStep); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100); }
      return;
    }
    try {
      const token = getWizardToken();
      if (!token) { showTemporaryNotification("No se encontró el token de sesión. Por favor inicia sesión nuevamente."); setTimeout(() => { window.location.href = "/"; }, 2500); return; }
      generarPromptIAOptimista({
        nombre: nombreParam || "", cedula: cedula || "", direccion: "", provincia: formData.provincia, ciudad: formData.ciudad, tipoMulta: formData.tipoMulta, agencia: formData.agencia, fechaCitacion: formData.fechaCitacion, numeroCitacion: formData.numeroCitacion, vehiculoDescripcion, archivos: formData.archivos, ocrResults: formData.ocrResults,
      });
      const formDataToSend = new FormData();
      formDataToSend.append("secuencial_usuario", secuencialUser);
      formDataToSend.append("secuencial_vehiculo", formData.vehiculo);
      const fechaNorm = normalizeFecha(formData.fechaCitacion);
      if (!fechaNorm) { setErrors((prev) => ({ ...prev, fechaCitacion: "Formato inválido. Use AAAA-MM-DD o DD/MM/AAAA." })); setStep(4); return; }
      formDataToSend.append("fecha_citacion", fechaNorm);
      formDataToSend.append("numero_citacion", formData.numeroCitacion);
      formDataToSend.append("observacion", "Impugnación tránsito");
      formDataToSend.append("secuencia_estado", "1");
      const detalleJson = [{ secuencia_origen: 1, secuencia_agencia: formData.agencia === "ANT" ? 2 : 1, tipo_documento: "foto_citacion", ente: multaSeleccionada?.ente || formData.agencia || "", secuencia_estado: 1 }];
      formDataToSend.append("detalleJson", JSON.stringify(detalleJson));
      formData.archivos.forEach((file) => { const blob = new Blob([file], { type: file.type }); formDataToSend.append("file", new File([blob], file.name, { type: file.type })); });
      const res = await fetch(`${API_BASE_URL}/regmultas`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formDataToSend });
      let responseData = null;
      try { responseData = await res.json(); } catch { responseData = null; }
      if (res.status === 401 || res.status === 403) { showTemporaryNotification("El tiempo de espera seguro ha expirado. Te redirigiremos a la pantalla de inicio."); setTimeout(() => { window.location.href = "/"; }, 2500); return; }
      if (!res.ok) { const customError = (responseData && (responseData.error || responseData.mensaje)) || "No se pudo enviar la impugnación."; showTemporaryNotification(customError); return; }
      const descripcionVehiculo = vehiculosUsuario.find((v) => v.secuencial.toString() === formData.vehiculo)?.descripcion || "";
      SessionPaymentManager.guardar({ citacion: formData.numeroCitacion, item: descripcionVehiculo, cedula: cedula, servicio: responseData.cabeceraId?.toString() || "", valor: responseData.costo?.toString() || valorImpugnacionGl });
      router.push("/resumenPago");
    } catch (error: any) { showTemporaryNotification(error?.message || "No se pudo conectar al servidor."); }
  }, [validateAllData, showTemporaryNotification, nombreParam, cedula, formData, vehiculoDescripcion, secuencialUser, vehiculosUsuario, multaSeleccionada, router]);

  useEffect(() => {
    if (step === 5) {
      const prompt = generarPromptIAOptimista({
        nombre: nombreParam || "", cedula: cedula || "", direccion: formData.direccion, provincia: formData.provincia, ciudad: formData.ciudad, tipoMulta: formData.tipoMulta, agencia: formData.agencia, fechaCitacion: formData.fechaCitacion, numeroCitacion: formData.numeroCitacion, vehiculoDescripcion, archivos: formData.archivos, ocrResults: formData.ocrResults,
      });
      setCargandoIA(true); setRespuestaIA(""); setErrorIA("");
      const fetchIA = async () => {
        try {
          const token = getWizardToken();
          const res = await fetch(`${API_BASE_URL}/nopaychatServices`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ pregunta: prompt }) });
          if (!res.ok) { setErrorIA("No se pudo obtener la respuesta de la IA. Intenta más tarde."); setCargandoIA(false); return; }
          const data = await res.json();
          setRespuestaIA(data.respuesta || "No se recibió respuesta de la IA.");
        } catch { setErrorIA("Error al conectar con la IA. Intenta nuevamente."); } finally { setCargandoIA(false); }
      };
      fetchIA();
    }
  }, [step, nombreParam, cedula, formData, vehiculoDescripcion]);

  useEffect(() => {
  if (respuestaIA) {
    const parseMarkdown = async () => {
      try {
        const result = await marked.parse(respuestaIA);
        setHtmlIA(result);
      } catch (err) {
        console.error('Error parsing markdown:', err);
        setHtmlIA('<p>Error al formatear la respuesta de la IA.</p>');
      }
    };
    parseMarkdown();
  }
}, [respuestaIA]);

  useEffect(() => {
    if (step === 7 && securityStage === -1) setSecurityStage(0);
  }, [step, securityStage]);

  useEffect(() => {
    if (securityStage >= 0 && securityStage < securityMessages.length) {
      if (securityTimeoutRef.current) clearTimeout(securityTimeoutRef.current);
      if (securityStage === securityMessages.length - 1) { securityTimeoutRef.current = setTimeout(() => handleFinalSubmit(), 1200); }
      else { securityTimeoutRef.current = setTimeout(() => setSecurityStage((prev) => prev + 1), 1200); }
    }
    return () => { if (securityTimeoutRef.current) clearTimeout(securityTimeoutRef.current); };
  }, [securityStage, securityMessages.length, handleFinalSubmit]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/90 px-8 py-10 text-center shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50"><Loader2 className="h-8 w-8 animate-spin text-cyan-600" /></div>
            <h2 className="text-xl font-bold text-slate-900">Cargando proceso</h2>
            <p className="mt-2 text-sm text-slate-600">Estamos preparando tu entorno seguro.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (step === 7) {
    const currentSecurityMessage =
      securityMessages[Math.max(0, Math.min(securityStage, securityMessages.length - 1))] || securityMessages[0];
    const CurrentSecurityIcon = currentSecurityMessage.icon;
    const currentProgress = Math.min(100, Math.max(20, ((Math.max(securityStage, 0) + 1) / securityMessages.length) * 100));

    return (
      <div className="fixed inset-0 z-[9999] overflow-hidden bg-slate-950 text-white">
        <NoPayBackground />

        <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-lg overflow-hidden rounded-[34px] border border-white/15 bg-white/[0.08] p-6 text-center shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/15 bg-white/10 shadow-2xl">
              <CurrentSecurityIcon className="h-10 w-10 text-cyan-200" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">Pago seguro NoPay</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Preparando tu redirección
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-200 sm:text-base">
              Estamos protegiendo tu información y creando el canal seguro para continuar con el pago.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-100">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{currentSecurityMessage.text}</p>
                  <p className="mt-1 text-xs text-slate-300">No cierres esta ventana durante el proceso.</p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showNotification && (
            <Notification message={notificationMessage} onClose={() => setShowNotification(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Stepper step={step} completedSteps={completedSteps} />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }}>
                    <Step1 formData={formData} errors={errors} setFormData={setFormData} />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }}>
                    <Step2 formData={formData} errors={errors} setFormData={setFormData} />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="step-3" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }}>
                    <Step3 errors={errors} />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div key="step-4" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }}>
                    <SectionCard title="Vehículo y evidencia de la multa" description="Selecciona el vehículo relacionado y, si lo deseas, adjunta imágenes de la citación para realizar lectura OCR automática." icon={<Car className="h-7 w-7" />}>
                      <div className="space-y-8">
                        <Field label="Vehículo" error={errors.vehiculo} icon={<Car className="h-4 w-4" />}>
                          <SelectInput value={formData.vehiculo} onChange={(value: string) => setFormData((prev: any) => ({ ...prev, vehiculo: value }))} error={errors.vehiculo}>
                            <option value="">Seleccione su vehículo</option>
                            {vehiculosUsuario.map((v) => (<option key={v.secuencial} value={v.secuencial}>{v.descripcion}</option>))}
                          </SelectInput>
                        </Field>
                        <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <div><h3 className="text-lg font-bold text-slate-900">Cargar imágenes de la citación</h3><p className="mt-1 text-sm text-slate-600">{hayMultas ? "Opcional. Formatos permitidos: JPG, JPEG, PNG o PDF. Máximo 5 MB por archivo." : "Obligatorio (no hay multas registradas)."}</p></div>
                            {hayMultas && (<button type="button" onClick={scrollToMultas} className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/70 px-5 py-2.5 text-sm font-semibold text-amber-800 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-amber-300 hover:from-amber-50 hover:to-amber-100 hover:shadow-md"><X className="h-4 w-4" />Omitir y seleccionar la detectada</button>)}
                          </div>
                          {isProcessing && (<div className="mb-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4"><div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-cyan-600" /><div className="h-2 flex-1 overflow-hidden rounded-full bg-cyan-100"><div className="h-full rounded-full bg-cyan-600 transition-all" style={{ width: `${ocrProgress}%` }} /></div><span className="text-sm font-semibold text-cyan-700">{ocrProgress}%</span></div><p className="mt-2 text-sm text-cyan-700">Procesando OCR y extrayendo datos de la imagen...</p></div>)}
                          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center transition hover:border-cyan-300 hover:bg-cyan-50/40">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 transition group-hover:bg-cyan-100"><UploadCloud className="h-8 w-8 text-cyan-600" /></div>
                            <p className="text-sm font-semibold text-slate-800">Haz clic para cargar archivos</p>
                            <p className="mt-1 text-sm text-slate-500">También puedes arrastrarlos aquí</p>
                            <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,application/pdf" onChange={handleFileChange} />
                          </label>
                        </div>
                        {cargandoMultas && (<div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-6"><Loader2 className="h-6 w-6 animate-spin text-cyan-600" /></div>)}
                        {multasVehiculo.length > 0 && !cargandoMultas && (
                          <div ref={multasPanelRef} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                            <div className="border-b border-slate-200 px-5 py-4"><h3 className="text-lg font-bold text-slate-900">Multas detectadas para este vehículo</h3><p className="mt-1 text-sm text-slate-600">Puedes seleccionar una multa para precargar la información.</p></div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm"><thead className="bg-slate-50"><tr className="text-left text-slate-600"><th className="px-4 py-3">Sel.</th><th className="px-4 py-3">N° Infracción</th><th className="px-4 py-3">Ente</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Rubro</th></tr></thead><tbody className="divide-y divide-slate-200">{multasVehiculo.map((multa) => (<tr key={multa.secuencial} onClick={() => { setMultaSeleccionada(multa); setFormData((prev: any) => ({ ...prev, numeroCitacion: multa.secuencia_1 || multa.id_factura, fechaCitacion: multa.fecha_emision.split(" ")[0] })); }} className={cn("cursor-pointer transition hover:bg-slate-50", multaSeleccionada?.secuencial === multa.secuencial && "bg-cyan-50")}><td className="px-4 py-3"><input type="radio" name="multaSeleccionada" checked={multaSeleccionada?.secuencial === multa.secuencial} onChange={() => {}} className="h-4 w-4 accent-cyan-600" /></td><td className="px-4 py-3 font-medium text-slate-800">{multa.secuencia_1 || multa.id_factura}</td><td className="px-4 py-3 text-slate-600">{multa.ente}</td><td className="px-4 py-3 text-slate-600">{multa.fecha_emision}</td><td className="px-4 py-3 font-semibold text-slate-800">${multa.total.toFixed(2)}</td><td className="px-4 py-3 text-slate-600">{multa.rubro}</td></tr>))}</tbody></table>
                            </div>
                          </div>
                        )}
                        {formData.archivos.length > 0 ? (
                          <div className="space-y-4">
                            {formData.archivos.map((file, index) => (
                              <div key={index} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-start gap-4 p-4 sm:p-5">
                                  {file.type.startsWith("image/") && file.preview ? (<img src={file.preview} alt="Previsualización" className="h-16 w-16 rounded-2xl border border-slate-200 object-cover" />) : (<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50"><FileText className="h-7 w-7 text-slate-400" />{file.type === "application/pdf" && <span className="absolute mt-8 text-[10px] font-bold text-slate-500">PDF</span>}</div>)}
                                  <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{file.name}</p><p className="mt-1 text-xs text-slate-500">{file.type === "application/pdf" ? "Documento PDF" : "Archivo de imagen"}</p></div><button type="button" onClick={() => removeFile(index)} className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button></div>
                                    {formData.ocrResults[index] && (<div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className={formData.ocrResults[index].confidence >= 70 ? "flex items-center gap-2 text-sm font-medium text-emerald-700" : "flex items-start gap-2 text-sm text-amber-700"}>{formData.ocrResults[index].confidence >= 70 ? <><Check className="h-4 w-4" /> Reconocimiento confiable ({formData.ocrResults[index].confidence}%)</> : <><AlertCircle className="mt-0.5 h-4 w-4" /> Algunos datos pueden requerir revisión manual.</>}</div><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"><div><label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Número de citación</label><div className="flex gap-2"><TextInput value={formData.numeroCitacion} onChange={(value: string) => setFormData((prev: any) => ({ ...prev, numeroCitacion: value }))} error={errors.numeroCitacion} /><button type="button" onClick={() => { const detected = formData.ocrResults[index].extractedData.citationNumber; if (detected) setFormData((prev: any) => ({ ...prev, numeroCitacion: detected })); }} className="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700">Usar</button></div></div><div><label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Fecha</label><div className="flex gap-2"><input type="date" value={formData.fechaCitacion} onChange={(e) => setFormData((prev: any) => ({ ...prev, fechaCitacion: e.target.value }))} className={cn("w-full rounded-2xl border bg-white px-4 py-3.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 sm:text-[15px]", errors.fechaCitacion ? "border-red-300" : "border-slate-200")} /><button type="button" onClick={() => { const detected = formData.ocrResults[index].extractedData.date; if (detected) setFormData((prev: any) => ({ ...prev, fechaCitacion: detected })); }} className="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700">Usar</button></div>{errors.fechaCitacion && <p className="mt-2 text-sm text-red-600">{errors.fechaCitacion}</p>}</div></div><details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer text-sm font-semibold text-cyan-700">Ver texto reconocido</summary><div className="mt-3 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-700">{formData.ocrResults[index].text}</div></details></div>)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : multaSeleccionada && (<div className="rounded-[24px] border border-slate-200 bg-white p-5"><h4 className="text-lg font-bold text-slate-900">Detalles de la multa seleccionada</h4><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"><SummaryItem label="N° Infracción" value={multaSeleccionada.secuencia_1 || multaSeleccionada.id_factura} icon={<Hash className="h-4 w-4" />} /><SummaryItem label="Ente" value={multaSeleccionada.ente} icon={<Shield className="h-4 w-4" />} /><SummaryItem label="Fecha emisión" value={multaSeleccionada.fecha_emision} icon={<Calendar className="h-4 w-4" />} /><SummaryItem label="Total" value={`$${multaSeleccionada.total.toFixed(2)}`} icon={<FileText className="h-4 w-4" />} /></div><div className="mt-4"><SummaryItem label="Rubro" value={multaSeleccionada.rubro} icon={<ClipboardList className="h-4 w-4" />} /></div></div>)}
                      </div>
                    </SectionCard>
                  </motion.div>
                )}
                {step === 5 && (
                  <motion.div key="step-5" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }}>
                    <SectionCard title="Revisión final antes del análisis" description="Revisa cuidadosamente toda la información antes de continuar con el diagnóstico jurídico generado por IA." icon={<ClipboardList className="h-7 w-7" />}>
                      <div className="space-y-6"><div className="grid grid-cols-1 gap-6 xl:grid-cols-3"><div className="xl:col-span-1"><div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5"><h3 className="text-lg font-bold text-slate-900">Datos del usuario</h3><div className="mt-4 space-y-3"><SummaryItem label="Nombre" value={nombreParam} icon={<User className="h-4 w-4" />} /><SummaryItem label="Cédula" value={cedula} icon={<Hash className="h-4 w-4" />} /><SummaryItem label="Dirección" value={formData.direccion} icon={<MapPin className="h-4 w-4" />} /><SummaryItem label="Ciudad" value={formData.ciudad} icon={<Building className="h-4 w-4" />} /><SummaryItem label="Provincia" value={formData.provincia} icon={<Globe className="h-4 w-4" />} /></div></div></div><div className="xl:col-span-2"><div className="rounded-[24px] border border-slate-200 bg-white p-5"><h3 className="text-lg font-bold text-slate-900">Resumen del caso</h3><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"><SummaryItem label="Tipo de multa" value={formData.tipoMulta} icon={<AlertTriangle className="h-4 w-4" />} /><SummaryItem label="Agencia" value={formData.agencia} icon={<Shield className="h-4 w-4" />} /><SummaryItem label="Fecha de citación" value={formData.fechaCitacion} icon={<Calendar className="h-4 w-4" />} /><SummaryItem label="Número de citación" value={formData.numeroCitacion} icon={<Hash className="h-4 w-4" />} /><SummaryItem label="Vehículo" value={vehiculoDescripcion} icon={<Car className="h-4 w-4" />} /><SummaryItem label="Archivos adjuntos" value={`${formData.archivos.length} archivo(s)`} icon={<Paperclip className="h-4 w-4" />} /></div><div className="mt-6 rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"><p className="text-sm font-semibold text-slate-800">Archivos cargados</p>{formData.archivos.length > 0 ? (<div className="mt-3 grid gap-3 sm:grid-cols-2">{formData.archivos.map((file, index) => (<div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"><FileText className="h-4 w-4 text-cyan-600" /><span className="truncate text-sm font-medium text-slate-700">{file.name}</span></div>))}</div>) : (<p className="mt-2 text-sm text-slate-500">No se adjuntaron archivos adicionales.</p>)}</div></div></div></div><div className="rounded-[24px] border border-slate-200 bg-white p-5"><div className="space-y-5"><label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"><input type="checkbox" checked={formData.aceptaTerminos} onChange={(e) => setFormData((prev: any) => ({ ...prev, aceptaTerminos: e.target.checked }))} className="mt-1 h-4 w-4 rounded accent-cyan-600" /><div><p className="text-sm font-semibold text-slate-900">Confirmo que la información proporcionada es verídica</p><p className="mt-1 text-sm text-slate-600">Declaro que los datos y documentos cargados corresponden al caso real.</p>{errors.aceptaTerminos && <p className="mt-2 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{errors.aceptaTerminos}</p>}</div></label><label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"><input type="checkbox" checked={formData.aceptaTerminosUso} onChange={(e) => setFormData((prev: any) => ({ ...prev, aceptaTerminosUso: e.target.checked }))} className="mt-1 h-4 w-4 rounded accent-cyan-600" /><div><p className="text-sm font-semibold text-slate-900">He leído y acepto los términos y condiciones de NoPay Legal</p><p className="mt-1 text-sm text-slate-600">Autorizo el tratamiento de datos y comprendo el alcance del servicio.</p>{errors.aceptaTerminosUso && <p className="mt-2 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{errors.aceptaTerminosUso}</p>}</div></label></div></div></div>
                    </SectionCard>
                  </motion.div>
                )}
                {step === 6 && (
                  <motion.div key="step-6" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }}>
                    {(cargandoIA || !respuestaIA) && !errorIA ? (
                      <SectionCard title="Análisis jurídico automatizado" description="Nuestra IA está revisando la información que has proporcionado para elaborar un diagnóstico legal claro y útil." icon={<ShieldCheck className="h-7 w-7" />}>
                        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-8 text-center">
                          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-lg"><Loader2 className="h-10 w-10 animate-spin text-cyan-600" /></div>
                          <h3 className="text-2xl font-bold text-slate-900">Analizando tu caso</h3>
                          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">Estamos interpretando tus datos, evaluando la documentación adjunta y preparando un diagnóstico legal personalizado.</p>
                          <div className="mt-6 w-full max-w-md overflow-hidden rounded-full bg-slate-200"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }} className="h-2 rounded-full bg-cyan-600" /></div>
                        </div>
                      </SectionCard>
                    ) : (
                      <SectionCard title="Diagnóstico IA Jurídica" description="Aquí tienes el análisis generado en base a la información que registraste." icon={<ShieldCheck className="h-7 w-7" />}>
                        {errorIA && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorIA}</div>}
                        {htmlIA && !cargandoIA && (
                          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-6 border-b border-slate-200 pb-5 text-center"><h3 className="text-2xl font-bold text-slate-900">Diagnóstico Jurídico de tu Multa de Tránsito</h3><p className="mt-2 text-sm font-medium text-cyan-700">IA Legal · NoPay</p><p className="mt-1 text-xs text-slate-500">{new Date().toLocaleDateString()}</p></div>
                            <div id="documento-ia-juridica" className="max-w-none text-[15px] leading-[1.75] text-slate-700 sm:text-[15.5px] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:tracking-[-0.03em] [&_h1]:text-slate-950 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:tracking-[-0.02em] [&_h2]:text-slate-950 [&_p]:mb-4 [&_p]:rounded-2xl [&_p]:border [&_p]:border-slate-100 [&_p]:bg-white [&_p]:px-5 [&_p]:py-4 [&_p]:shadow-[0_10px_28px_rgba(15,23,42,0.04)] [&_strong]:font-extrabold [&_strong]:text-slate-950 [&_em]:font-medium [&_em]:text-slate-600 [&_ul]:my-4 [&_ul]:space-y-3 [&_li]:rounded-2xl [&_li]:border [&_li]:border-slate-100 [&_li]:bg-white [&_li]:px-5 [&_li]:py-4 [&_li]:leading-7 [&_li]:shadow-[0_10px_28px_rgba(15,23,42,0.04)] [&_a]:font-bold [&_a]:text-cyan-700 [&_a]:no-underline" dangerouslySetInnerHTML={{ __html: htmlIA }} />
                          </div>
                        )}
                      </SectionCard>
                    )}
                  </motion.div>
                )}
                {step === 7 && (
                  <motion.div key="step-7" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.28 }}>
                    <SectionCard title="Protegiendo tu información" description="Estamos preparando un entorno seguro para finalizar el proceso. No cierres esta ventana." icon={<ShieldCheck className="h-7 w-7" />}>
                      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-[24px] bg-gradient-to-br from-slate-50 via-white to-cyan-50 p-8 text-center">
                        {securityStage >= 0 && securityStage < securityMessages.length ? (
                          <>
                            <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-cyan-100">
                              {React.createElement(securityMessages[securityStage].icon, { className: cn("h-12 w-12", `text-${securityMessages[securityStage].color}-600`) })}
                              <motion.div className="absolute inset-0 rounded-full border-2 border-cyan-200" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                            </div>
                            <motion.div key={securityStage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-md">
                              <p className="text-2xl font-bold text-slate-900">{securityMessages[securityStage].text}</p>
                              <p className="mt-2 text-sm text-slate-600">{securityStage === securityMessages.length - 1 ? "Serás redirigido en un momento..." : "Procesando en entorno seguro"}</p>
                            </motion.div>
                            <div className="mt-10 w-full max-w-md"><div className="flex justify-between text-xs text-slate-500">{securityMessages.map((_, idx) => (<div key={idx} className={cn("h-2 w-2 rounded-full transition-all", idx <= securityStage ? "bg-cyan-600" : "bg-slate-300")} />))}</div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" initial={{ width: 0 }} animate={{ width: `${((securityStage + 1) / securityMessages.length) * 100}%` }} transition={{ duration: 0.3 }} /></div></div>
                          </>
                        ) : (<div className="flex flex-col items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-cyan-600" /><p className="mt-4 text-lg font-semibold text-slate-900">Finalizando...</p></div>)}
                      </div>
                    </SectionCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <aside className="space-y-6">
              <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Usuario</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{nombreParam || "Sin nombre"}</h3>
                <p className="mt-1 text-sm text-slate-500">Cédula: {cedula || "No disponible"}</p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4"><div className="mb-2 flex items-center justify-between"><span className="text-sm font-medium text-slate-600">Progreso</span><span className="text-sm font-bold text-slate-900">{progressPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all" style={{ width: `${progressPercent}%` }} /></div></div>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                <h3 className="text-lg font-bold text-slate-900">Resumen rápido</h3>
                <div className="mt-4 space-y-3"><SummaryItem label="Vehículo" value={vehiculoDescripcion} icon={<Car className="h-4 w-4" />} /><SummaryItem label="Agencia" value={formData.agencia || "Pendiente"} icon={<Shield className="h-4 w-4" />} /><SummaryItem label="Citación" value={formData.numeroCitacion || "Pendiente"} icon={<Hash className="h-4 w-4" />} /><SummaryItem label="Archivos" value={`${formData.archivos.length} adjunto(s)`} icon={<Paperclip className="h-4 w-4" />} /></div>
              </div>
            </aside>
          </div>
          {step < 7 && (
            <div className="sticky bottom-4 z-20">
              <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                <div>{step > 1 ? (<button onClick={prevStep} type="button" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><ChevronLeft className="h-4 w-4" />Anterior</button>) : (<div />)}</div>
                <div><button onClick={nextStep} type="button" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:translate-y-[-1px] hover:shadow-xl">{step < 5 && "Siguiente"}{step === 5 && "Ver análisis IA"}{step === 6 && "Procesar y pagar"}<ChevronRight className="h-4 w-4" /></button></div>
              </div>
            </div>
          )}
        </div>
      </main>
      <AnimatePresence>{showTermsModal && <TermsModal onAccept={() => { setShowTermsModal(false); if (pendingStep) { markStepAsCompleted(step); setStep(pendingStep); setPendingStep(null); } }} onCancel={() => { setShowTermsModal(false); setPendingStep(null); }} />}</AnimatePresence>
      <AnimatePresence>{showNotification && <Notification message={notificationMessage} onClose={() => setShowNotification(false)} />}</AnimatePresence>
      <AnimatePresence>{showDocsModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.22 }} className="relative h-[80vh] w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl"><button onClick={() => setShowDocsModal(false)} className="absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2 text-slate-500 shadow transition hover:text-slate-800"><X className="h-5 w-5" /></button><iframe src="/documentos" className="h-full w-full border-none" title="Documentos" /></motion.div></motion.div>)}</AnimatePresence>
      <Footer />
    </>
  );
};

export default ImpugnacionWizard;