"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { Loader2 } from "lucide-react";
import { Header } from "app/resources/Header";
import Footer from "app/resources/Footer";
import NoPayChatLauncher from "app/resources/NoPayChatLauncher";

import NoPayBackground from "components/NoPayBackground";
import { SessionPaymentManager } from "lib/seguridad/SessionPaymentManager";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { getWizardToken } from "lib/seguridad/sessionUtils";
import { API_BASE_URL, valorRegistroMarcaPhase1, valorRegistroMarcaPhase2 } from "config/apiConfig";

import {
  AlertCircle,
  BadgeCheck,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleSlash,
  Clock,
  CreditCard,
  Edit,
  FileBadge2,
  FileText,
  Filter,
  Globe2,
  Layers3,
  List,
  LockKeyhole,
  MoreVertical,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
  Wallet,
  Info,
  Phone,
  Mail,
  SearchCheck,
} from "lucide-react";

type ResultadoTone =
  | "critical"
  | "danger"
  | "warning"
  | "info"
  | "success"
  | "neutral";

interface ResultadoMeta {
  tone: ResultadoTone;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ring: string;
  badge: string;
  softCard: string;
  dot: string;
  accent: string;
}

function normalizeResultado(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getResultadoMeta(
  resultado?: string,
  score?: number
): ResultadoMeta {
  const r = normalizeResultado(resultado);

  // 1. CRÍTICO ABSOLUTO
  if (
    r.includes("registro imposible") ||
    r.includes("imposible") ||
    r.includes("no registrable") ||
    r.includes("inviable") ||
    r.includes("marca mundialmente conocida") ||
    r.includes("prohibicion absoluta") ||
    r.includes("denegado") ||
    r.includes("rechazo casi seguro") ||
    r.includes("rechazado")
  ) {
    return {
      tone: "critical",
      label: "Crítico",
      icon: CircleSlash,
      ring: "ring-red-100",
      badge:
        "border-red-300 bg-gradient-to-r from-red-50 to-rose-50 text-red-800 shadow-[0_6px_20px_-10px_rgba(220,38,38,0.45)]",
      softCard: "border-red-200 bg-red-50/80",
      dot: "bg-red-500",
      accent: "from-red-500 to-rose-500",
    };
  }

  // 2. RIESGO ALTO
  if (
    r.includes("alto riesgo") ||
    r.includes("riesgo alto") ||
    r.includes("conflicto alto") ||
    r.includes("muy similar") ||
    r.includes("alta similitud") ||
    r.includes("riesgo de confusion") ||
    r.includes("confusion marcaria") ||
    r.includes("colision marcaria") ||
    r.includes("conflicto relevante")
  ) {
    return {
      tone: "danger",
      label: "Riesgo alto",
      icon: AlertCircle,
      ring: "ring-orange-100",
      badge:
        "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 shadow-[0_6px_20px_-10px_rgba(234,88,12,0.40)]",
      softCard: "border-orange-200 bg-orange-50/80",
      dot: "bg-orange-500",
      accent: "from-orange-500 to-amber-500",
    };
  }

  // 3. REVISIÓN / CONDICIONADO
  if (
    r.includes("observacion") ||
    r.includes("observado") ||
    r.includes("condicionado") ||
    r.includes("revision") ||
    r.includes("requiere analisis") ||
    r.includes("requiere revision") ||
    r.includes("riesgo medio") ||
    r.includes("medio") ||
    r.includes("viable con observaciones") ||
    r.includes("posible oposicion")
  ) {
    return {
      tone: "warning",
      label: "Revisión",
      icon: SearchCheck,
      ring: "ring-amber-100",
      badge:
        "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 shadow-[0_6px_20px_-10px_rgba(217,119,6,0.35)]",
      softCard: "border-amber-200 bg-amber-50/80",
      dot: "bg-amber-500",
      accent: "from-amber-500 to-yellow-500",
    };
  }

  // 4. PRELIMINAR / EN ESTUDIO
  if (
    r.includes("preliminar") ||
    r.includes("en analisis") ||
    r.includes("en estudio") ||
    r.includes("potencial") ||
    r.includes("posible") ||
    r.includes("evaluacion inicial") ||
    r.includes("analisis inicial")
  ) {
    return {
      tone: "info",
      label: "Preliminar",
      icon: Bot,
      ring: "ring-cyan-100",
      badge:
        "border-cyan-300 bg-gradient-to-r from-cyan-50 to-sky-50 text-cyan-800 shadow-[0_6px_20px_-10px_rgba(8,145,178,0.35)]",
      softCard: "border-cyan-200 bg-cyan-50/80",
      dot: "bg-cyan-500",
      accent: "from-cyan-500 to-sky-500",
    };
  }

  // 5. FAVORABLE
  if (
    r.includes("viable") ||
    r.includes("favorable") ||
    r.includes("registrable") ||
    r.includes("alto potencial de registro") ||
    r.includes("sin conflicto") ||
    r.includes("bajo riesgo") ||
    r.includes("riesgo bajo") ||
    r.includes("alta probabilidad de registro") ||
    r.includes("apto para registro")
  ) {
    return {
      tone: "success",
      label: "Favorable",
      icon: CheckCircle2,
      ring: "ring-emerald-100",
      badge:
        "border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 shadow-[0_6px_20px_-10px_rgba(5,150,105,0.35)]",
      softCard: "border-emerald-200 bg-emerald-50/80",
      dot: "bg-emerald-500",
      accent: "from-emerald-500 to-green-500",
    };
  }

  // 6. fallback apoyado por score
  if (typeof score === "number") {
    if (score >= 85) {
      return {
        tone: "success",
        label: "Favorable",
        icon: CheckCircle2,
        ring: "ring-emerald-100",
        badge:
          "border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 shadow-[0_6px_20px_-10px_rgba(5,150,105,0.35)]",
        softCard: "border-emerald-200 bg-emerald-50/80",
        dot: "bg-emerald-500",
        accent: "from-emerald-500 to-green-500",
      };
    }

    if (score >= 65) {
      return {
        tone: "warning",
        label: "Revisión",
        icon: SearchCheck,
        ring: "ring-amber-100",
        badge:
          "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 shadow-[0_6px_20px_-10px_rgba(217,119,6,0.35)]",
        softCard: "border-amber-200 bg-amber-50/80",
        dot: "bg-amber-500",
        accent: "from-amber-500 to-yellow-500",
      };
    }

    return {
      tone: "danger",
      label: "Riesgo alto",
      icon: AlertCircle,
      ring: "ring-orange-100",
      badge:
        "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 shadow-[0_6px_20px_-10px_rgba(234,88,12,0.40)]",
      softCard: "border-orange-200 bg-orange-50/80",
      dot: "bg-orange-500",
      accent: "from-orange-500 to-amber-500",
    };
  }

  return {
    tone: "neutral",
    label: "Sin clasificar",
    icon: Tag,
    ring: "ring-slate-100",
    badge: "border-slate-300 bg-slate-50 text-slate-700",
    softCard: "border-slate-200 bg-slate-50/80",
    dot: "bg-slate-400",
    accent: "from-slate-400 to-slate-500",
  };
}



interface MarcaRow {
  secuencial: number;
  codigo_tramite: string;
  nombre_marca: string;
  tipo_signo: string;
  actividad_economica: string;
  estado_tramite: string;
  estado_pago: string;
  tipo_resultado_diagnostico: string;
  score_confianza_ia: number;
  requiere_revision_manual: boolean;
  listo_para_pago: boolean;
  listo_para_gestion: boolean;
  abogado_asignado: string;
  fechacrea: string;
  estadoAdminNombre: string;
}

interface ClaseMarca {
  secuencial: number;
  numero_clase: number;
  descripcion_clase: string;
  productos_servicios: string;
  fuente: string;
  es_principal: boolean;
  estado_registro: string;
  observacion: string;
}

interface TitularMarca {
  secuencial: number;
  tipo_titular: string;
  es_principal: boolean;
  nombres: string;
  apellidos: string;
  razon_social: string;
  identificacion: string;
  tipo_identificacion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  pais: string;
  representante_legal: string;
  observacion: string;
}

interface ContactoMarca {
  secuencial: number;
  tipo_contacto: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  cargo: string;
  observacion: string;
}

interface DocumentoMarca {
  secuencial: number;
  tipo_documento: string;
  nombre_archivo: string;
  ruta_archivo: string;
  extension: string;
  mime_type: string;
  observacion: string;
}

interface HistorialMarca {
  secuencial: number;
  tipo_evento: string;
  estado_anterior: string;
  estado_nuevo: string;
  descripcion_evento: string;
  metadata: string;
  fechacrea: string;
  usuariocrea: string;
}

interface DetalleMarca {
  secuencial: number;
  secuencial_usuario: number;
  codigo_tramite: string;
  nombre_marca: string;
  nombre_marca_normalizado: string;
  tipo_signo: string;
  descripcion_signo: string;
  actividad_economica: string;
  descripcion_productos_servicios: string;
  cobertura_geografica: string;
  ya_usa_marca: boolean;
  fecha_primer_uso: string;
  tiene_logo: boolean;
  tiene_redes: boolean;
  tiene_sitio_web: boolean;
  dominio_web: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  observaciones_cliente: string;
  titular_principal_tipo: string;
  estado_tramite: string;
  subestado_tramite: string;
  estado_pago: string;
  tipo_resultado_diagnostico: string;
  score_confianza_ia: number;
  requiere_revision_manual: boolean;
  observacion_estado: string;
  explicacion_diagnostico: string;
  recomendacion_ia: string;
  listo_para_pago: boolean;
  listo_para_gestion: boolean;
  abogado_asignado: string;
  fecha_asignacion_abogado: string;
  fecha_contacto_cliente: string;
  numero_expediente_senadi: string;
  fecha_presentacion_senadi: string;
  acepta_terminos_condiciones: boolean;
  declara_informacion_veraz: boolean;
  fechacrea: string;
  clases: ClaseMarca[];
  titulares: TitularMarca[];
  contactos: ContactoMarca[];
  documentos: DocumentoMarca[];
  historial: HistorialMarca[];
  estadoAdminNombre: string;
}

interface MissingField {
  section: "cabecera" | "titular_principal" | "contacto_principal";
  field: string;
  label: string;
  type: "text" | "checkbox";
  currentValue: any;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const VALOR_REGISTRO_MARCA = valorRegistroMarcaPhase1;

function getTitularPrincipal(detalle: DetalleMarca | null) {
  return detalle?.titulares?.find((t) => t.es_principal) || null;
}

function getContactoPrincipal(detalle: DetalleMarca | null) {
  if (!detalle?.contactos?.length) return null;
  return (
    detalle.contactos.find((c) => c.tipo_contacto === "CLIENTE") ||
    detalle.contactos[0]
  );
}

function getMissingFields(detalle: DetalleMarca): MissingField[] {
  const missing: MissingField[] = [];

  if (!detalle.actividad_economica) {
    missing.push({
      section: "cabecera",
      field: "actividad_economica",
      label: "Actividad económica",
      type: "text",
      currentValue: "",
    });
  }

  if (!detalle.descripcion_productos_servicios) {
    missing.push({
      section: "cabecera",
      field: "descripcion_productos_servicios",
      label: "Descripción de productos o servicios",
      type: "text",
      currentValue: "",
    });
  }

  if (!detalle.cobertura_geografica) {
    missing.push({
      section: "cabecera",
      field: "cobertura_geografica",
      label: "Cobertura geográfica",
      type: "text",
      currentValue: "",
    });
  }

  if (!detalle.acepta_terminos_condiciones) {
    missing.push({
      section: "cabecera",
      field: "acepta_terminos_condiciones",
      label: "Acepta términos y condiciones",
      type: "checkbox",
      currentValue: false,
    });
  }

  if (!detalle.declara_informacion_veraz) {
    missing.push({
      section: "cabecera",
      field: "declara_informacion_veraz",
      label: "Declara información veraz",
      type: "checkbox",
      currentValue: false,
    });
  }

  const titular = getTitularPrincipal(detalle);
  if (titular) {
    if (titular.tipo_titular === "JURIDICA") {
      if (!titular.razon_social) {
        missing.push({
          section: "titular_principal",
          field: "razon_social",
          label: "Razón social del titular",
          type: "text",
          currentValue: "",
        });
      }
    } else {
      if (!titular.nombres) {
        missing.push({
          section: "titular_principal",
          field: "nombres",
          label: "Nombres del titular",
          type: "text",
          currentValue: "",
        });
      }
      if (!titular.apellidos) {
        missing.push({
          section: "titular_principal",
          field: "apellidos",
          label: "Apellidos del titular",
          type: "text",
          currentValue: "",
        });
      }
    }

    if (!titular.identificacion || titular.identificacion === "PENDIENTE") {
      missing.push({
        section: "titular_principal",
        field: "identificacion",
        label: "Identificación / RUC del titular",
        type: "text",
        currentValue: titular.identificacion === "PENDIENTE" ? "" : titular.identificacion,
      });
    }

    if (!titular.telefono) {
      missing.push({
        section: "titular_principal",
        field: "telefono",
        label: "Teléfono del titular",
        type: "text",
        currentValue: "",
      });
    }

    if (!titular.correo) {
      missing.push({
        section: "titular_principal",
        field: "correo",
        label: "Correo del titular",
        type: "text",
        currentValue: "",
      });
    }
  }

  const contacto = getContactoPrincipal(detalle);
  if (contacto) {
    if (!contacto.nombres) {
      missing.push({
        section: "contacto_principal",
        field: "nombres",
        label: "Nombre del contacto principal",
        type: "text",
        currentValue: "",
      });
    }

    if (!contacto.telefono) {
      missing.push({
        section: "contacto_principal",
        field: "telefono",
        label: "Teléfono del contacto principal",
        type: "text",
        currentValue: "",
      });
    }

    if (!contacto.correo) {
      missing.push({
        section: "contacto_principal",
        field: "correo",
        label: "Correo del contacto principal",
        type: "text",
        currentValue: "",
      });
    }
  }

  return missing;
}

function EmptyState() {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
        <FileText className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        No se encontraron trámites de marca
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Ajusta tu búsqueda o inicia un nuevo diagnóstico.
      </p>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const e = (estado || "").toLowerCase();

  if (e.includes("pagado")) {
    return (
      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        <BadgeCheck className="mr-1 h-3 w-3" />
        {estado}
      </span>
    );
  }

  if (e.includes("gestion") || e.includes("senadi") || e.includes("final")) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        {estado}
      </span>
    );
  }

  if (e.includes("pendiente") || e.includes("revision")) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock className="mr-1 h-3 w-3" />
        {estado}
      </span>
    );
  }

  if (e.includes("anulado") || e.includes("observado")) {
    return (
      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        <CircleSlash className="mr-1 h-3 w-3" />
        {estado}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      <CircleSlash className="mr-1 h-3 w-3" />
      {estado}
    </span>
  );
}

function PagoBadge({ estado }: { estado: string }) {
  const e = (estado || "").toLowerCase();

  if (e === "pagado") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <Wallet className="mr-1 h-3 w-3" />
        Pagado
      </span>
    );
  }

  if (e === "pendiente") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <CreditCard className="mr-1 h-3 w-3" />
        Pendiente
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      <CreditCard className="mr-1 h-3 w-3" />
      {estado}
    </span>
  );
}


function EstadoAdminBadge({ estado }: { estado: string }) {
  const e = (estado || "").trim();

  if (e === "ACTIVO") {
    return <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">ACTIVO</span>;
  }

  if (e === "EN REVISIÓN POR IA") {
    return <span className="inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 border border-cyan-200">EN REVISIÓN POR IA</span>;
  }

  if (e === "EXPERTO REVISANDO") {
    return <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">EXPERTO REVISANDO</span>;
  }

  if (e === "EN EJECUCIÓN") {
    return <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">EN EJECUCIÓN</span>;
  }

  if (e === "TERMINADO") {
    return <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">TERMINADO</span>;
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
      {estado || "DESCONOCIDO"}
    </span>
  );
}



function ResultadoBadge({ resultado }: { resultado: string }) {
  const raw = (resultado || "").trim();
  const r = raw.toLowerCase();

  const baseClass =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-4 shadow-sm";

  // ROJO = bloqueo fuerte / inviable / imposible / conflicto severo
  if (
    r.includes("imposible") ||
    r.includes("registro imposible") ||
    r.includes("no registrable") ||
    r.includes("inviable") ||
    r.includes("rechazado") ||
    r.includes("prohibido") ||
    r.includes("conflicto alto") ||
    r.includes("alto riesgo") ||
    r.includes("riesgo alto") ||
    r.includes("marca mundialmente conocida") ||
    r.includes("denegado")
  ) {
    return (
      <span
        className={cn(
          baseClass,
          "border-red-200 bg-red-50 text-red-700"
        )}
        title="Resultado crítico: alta probabilidad de rechazo o imposibilidad de registro"
      >
        <CircleSlash className="mr-1 h-3 w-3" />
        {raw || "Resultado crítico"}
      </span>
    );
  }

  // ÁMBAR = riesgo medio / observaciones / revisión
  if (
    r.includes("medio") ||
    r.includes("riesgo medio") ||
    r.includes("observado") ||
    r.includes("observación") ||
    r.includes("similar") ||
    r.includes("similitud") ||
    r.includes("confusión") ||
    r.includes("revisión") ||
    r.includes("revision") ||
    r.includes("condicionado") ||
    r.includes("advertencia")
  ) {
    return (
      <span
        className={cn(
          baseClass,
          "border-amber-200 bg-amber-50 text-amber-700"
        )}
        title="Resultado intermedio: requiere análisis, ajustes o revisión manual"
      >
        <AlertCircle className="mr-1 h-3 w-3" />
        {raw || "Riesgo medio"}
      </span>
    );
  }

  // AZUL = análisis preliminar / posible / en evaluación
  if (
    r.includes("preliminar") ||
    r.includes("en análisis") ||
    r.includes("en analisis") ||
    r.includes("posible") ||
    r.includes("potencial") ||
    r.includes("evaluación") ||
    r.includes("evaluacion")
  ) {
    return (
      <span
        className={cn(
          baseClass,
          "border-cyan-200 bg-cyan-50 text-cyan-700"
        )}
        title="Resultado preliminar: aún sujeto a validación o análisis complementario"
      >
        <Bot className="mr-1 h-3 w-3" />
        {raw || "En análisis"}
      </span>
    );
  }

  // VERDE = favorable / viable / registrable
  if (
    r.includes("viable") ||
    r.includes("favorable") ||
    r.includes("registrable") ||
    r.includes("aprobado") ||
    r.includes("sin conflicto") ||
    r.includes("bajo riesgo") ||
    r.includes("riesgo bajo") ||
    r.includes("alto potencial")
  ) {
    return (
      <span
        className={cn(
          baseClass,
          "border-emerald-200 bg-emerald-50 text-emerald-700"
        )}
        title="Resultado favorable: escenario positivo para continuar con el trámite"
      >
        <CheckCircle2 className="mr-1 h-3 w-3" />
        {raw || "Favorable"}
      </span>
    );
  }

  // GRIS = sin dato / desconocido
  return (
    <span
      className={cn(
        baseClass,
        "border-slate-200 bg-slate-100 text-slate-700"
      )}
      title="Resultado sin clasificar"
    >
      <Tag className="mr-1 h-3 w-3" />
      {raw || "Sin resultado"}
    </span>
  );
}


function SummaryMiniCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "success" | "warning" | "info";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        tone === "default" && "border-slate-200 bg-white",
        tone === "success" && "border-emerald-200 bg-emerald-50/70",
        tone === "warning" && "border-amber-200 bg-amber-50/70",
        tone === "info" && "border-cyan-200 bg-cyan-50/70"
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.18em]",
          tone === "default" && "text-slate-500",
          tone === "success" && "text-emerald-700",
          tone === "warning" && "text-amber-700",
          tone === "info" && "text-cyan-700"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-2xl font-bold",
          tone === "default" && "text-slate-900",
          tone === "success" && "text-emerald-700",
          tone === "warning" && "text-amber-700",
          tone === "info" && "text-cyan-700"
        )}
      >
        {value}
      </p>
    </div>
  );
}

const KpiCard = ({
  title,
  value,
  percentage,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  value: number;
  percentage: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "warning" | "success" | "neutral";
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    className={cn(
      "rounded-[24px] border p-5 shadow-sm transition",
      tone === "default" && "border-slate-200 bg-white",
      tone === "warning" && "border-amber-200 bg-amber-50/70",
      tone === "success" && "border-emerald-200 bg-emerald-50/70",
      tone === "neutral" && "border-slate-200 bg-slate-50/80"
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{percentage}</p>
      </div>
      <div
        className={cn(
          "rounded-2xl p-3",
          tone === "default" && "bg-cyan-50 text-cyan-700",
          tone === "warning" && "bg-amber-100 text-amber-700",
          tone === "success" && "bg-emerald-100 text-emerald-700",
          tone === "neutral" && "bg-slate-100 text-slate-700"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="mt-4 h-1 w-full rounded-full bg-slate-200" />
  </motion.div>
);

function DetalleExpandido({
  detalle,
  detalleLoading,
  detalleError,
  marca,
  onCompleteInfo,
  onEditClick,
}: {
  detalle: DetalleMarca | null;
  detalleLoading: boolean;
  detalleError: string | null;
  marca: MarcaRow;
  onCompleteInfo: () => void;
  onEditClick: (codigo: string) => void;
}) {
  const router = useRouter();

  if (detalleLoading) {
    return (
      <div className="flex justify-center py-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-cyan-600"
        />
      </div>
    );
  }

  if (detalleError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 text-center text-sm text-red-700">
        <AlertCircle className="mx-auto mb-2 h-6 w-6" />
        {detalleError}
      </div>
    );
  }

  if (!detalle) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
        <SearchCheck className="mx-auto mb-3 h-8 w-8 text-slate-400" />
        <p className="text-sm text-slate-600">
          No hay información de detalle disponible.
        </p>
      </div>
    );
  }

  const titular = getTitularPrincipal(detalle);
  const contacto = getContactoPrincipal(detalle);
  const isPaid = (detalle.estado_pago || "").toLowerCase() === "pagado";

  return (
  <div style={{ transform: 'scale(0.76)', transformOrigin: 'top left', width: 'calc(100% / 0.76)' }}>
  
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <FileBadge2 className="mr-2 h-4 w-4" />
            Identidad de la marca
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between gap-3">
              <span className="text-sm text-slate-500">Marca:</span>
              <span className="text-sm font-semibold text-slate-900 text-right">
                {detalle.nombre_marca || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-sm text-slate-500">Tipo de signo:</span>
              <span className="text-sm font-semibold text-slate-900 text-right">
                {detalle.tipo_signo || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-sm text-slate-500">Actividad:</span>
              <span className="text-sm font-semibold text-slate-900 text-right">
                {detalle.actividad_economica || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-sm text-slate-500">Cobertura:</span>
              <span className="text-sm font-semibold text-slate-900 text-right">
                {detalle.cobertura_geografica || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Bot className="mr-2 h-4 w-4" />
            Diagnóstico
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between gap-3">
              <span className="text-sm text-slate-500">Resultado:</span>
              <ResultadoBadge resultado={detalle.tipo_resultado_diagnostico} />
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-sm text-slate-500">Score IA:</span>
              <span className="text-sm font-semibold text-slate-900">
                {detalle.score_confianza_ia || 0}
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Recomendación:</p>
              <p className="mt-1 text-sm text-slate-700">
                {detalle.recomendacion_ia || "Sin recomendación registrada"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-4">
        <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <Layers3 className="mr-2 h-4 w-4" />
          Clases sugeridas / registradas
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {detalle.clases?.length ? (
            detalle.clases.map((clase) => (
              <div key={clase.secuencial} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">Clase {clase.numero_clase}</p>
                  {clase.es_principal && (
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-cyan-700">
                      Principal
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {clase.descripcion_clase || "Sin descripción"}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {clase.productos_servicios || "Sin detalle"}
                </p>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500">No hay clases registradas.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Building2 className="mr-2 h-4 w-4" />
            Titular principal
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Tipo:</span>
              <span className="font-semibold text-slate-900">
                {titular?.tipo_titular || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Nombre / razón social:</span>
              <span className="font-semibold text-slate-900 text-right">
                {titular?.tipo_titular === "JURIDICA"
                  ? titular?.razon_social || "—"
                  : `${titular?.nombres || ""} ${titular?.apellidos || ""}`.trim() || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Identificación:</span>
              <span className="font-semibold text-slate-900">
                {titular?.identificacion || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Teléfono:</span>
              <span className="font-semibold text-slate-900">
                {titular?.telefono || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Correo:</span>
              <span className="font-semibold text-slate-900 text-right">
                {titular?.correo || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Estado y acciones
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Estado del trámite:</span>
              <EstadoAdminBadge estado={detalle.estadoAdminNombre} />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Estado del pago:</span>
              <PagoBadge estado={detalle.estado_pago} />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Listo para gestión:</span>
              <span className="text-sm font-semibold text-slate-900">
                {detalle.listo_para_gestion ? "Sí" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Abogado asignado:</span>
              <span className="text-sm font-semibold text-slate-900 text-right">
                {detalle.abogado_asignado || "Pendiente"}
              </span>
            </div>

            {!isPaid && (
              <button
                onClick={() => {
                  SessionPaymentManager.guardar({
                    citacion: detalle.codigo_tramite,
                    servicio: String(detalle.secuencial),
                    item: `${detalle.nombre_marca} - PROTECCIÓN INTELIGENTE DE MARCA`,
                    valor: String(VALOR_REGISTRO_MARCA),
                    cedula: titular?.identificacion || "",
                  });
                  router.push("/resumenPago");
                }}
                className="w-full rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <Wallet className="mr-2 inline h-4 w-4" />
                Procesar pago
              </button>
            )}

            <button
              onClick={() => onEditClick(detalle.codigo_tramite)}
              className="w-full rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Edit className="mr-2 inline h-4 w-4" />
              Revisar / editar información
            </button>

            {!detalle.listo_para_gestion && (
              <button
                onClick={onCompleteInfo}
                className="w-full rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                <Info className="mr-2 inline h-4 w-4" />
                Completar información
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Phone className="mr-2 h-4 w-4" />
            Contacto principal
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Nombre:</span>
              <span className="font-semibold text-slate-900 text-right">
                {contacto ? `${contacto.nombres || ""} ${contacto.apellidos || ""}`.trim() || "—" : "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Teléfono:</span>
              <span className="font-semibold text-slate-900">
                {contacto?.telefono || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Correo:</span>
              <span className="font-semibold text-slate-900 text-right">
                {contacto?.correo || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Cargo:</span>
              <span className="font-semibold text-slate-900 text-right">
                {contacto?.cargo || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <FileText className="mr-2 h-4 w-4" />
            Documentos / historial
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Documentos cargados:</span>
              <span className="font-semibold text-slate-900">
                {detalle.documentos?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Eventos históricos:</span>
              <span className="font-semibold text-slate-900">
                {detalle.historial?.length || 0}
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Observación / explicación:</p>
              <p className="mt-1 text-sm text-slate-700">
                {detalle.explicacion_diagnostico || detalle.observacion_estado || "Sin observaciones registradas"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
	</div>
  );
}

interface MobileServiceCardProps {
  marca: MarcaRow;
  expandedRow: number | null;
  setExpandedRow: React.Dispatch<React.SetStateAction<number | null>>;
  detalle: DetalleMarca | null;
  detalleLoading: boolean;
  detalleError: string | null;
  onCompleteInfo: () => void;
  onEditClick: (codigo: string) => void;
}

const MobileServiceCard = ({
  marca,
  expandedRow,
  setExpandedRow,
  detalle,
  detalleLoading,
  detalleError,
  onCompleteInfo,
  onEditClick,
}: MobileServiceCardProps) => {
  const isExpanded = expandedRow === marca.secuencial;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="mb-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
    >
      <div
        className="cursor-pointer p-4"
        onClick={() => setExpandedRow(isExpanded ? null : marca.secuencial)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-sm font-bold text-white">
              {marca.nombre_marca?.charAt(0) || "M"}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {marca.nombre_marca}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">{marca.codigo_tramite}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
				  <ResultadoBadge resultado={marca.tipo_resultado_diagnostico} />
				  <EstadoAdminBadge estado={marca.estadoAdminNombre} />
				  <PagoBadge estado={marca.estado_pago} />
				</div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-slate-50/60 p-4"
          >
            <DetalleExpandido
              detalle={detalle}
              detalleLoading={detalleLoading}
              detalleError={detalleError}
              marca={marca}
              onCompleteInfo={onCompleteInfo}
              onEditClick={onEditClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function MarcasDashboard() {
  const [secuencialUser, setSecuencialUser] = useState<string>("");
  const [marcas, setMarcas] = useState<MarcaRow[]>([]);
  const [filteredMarcas, setFilteredMarcas] = useState<MarcaRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MarcaRow;
    direction: "ascending" | "descending";
  } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);
  const [detalle, setDetalle] = useState<DetalleMarca | null>(null);
  const [detalleLoading, setDetalleLoading] = useState<boolean>(false);
  const [detalleError, setDetalleError] = useState<string | null>(null);

  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [currentMarca, setCurrentMarca] = useState<MarcaRow | null>(null);
  const [currentDetalle, setCurrentDetalle] = useState<DetalleMarca | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleOpenEdit = (codigo: string) => {
    router.push(`/Servicios/RegistroMarca?codigo=${codigo}`);
  };

  const openCompleteDialog = (marca: MarcaRow, detalle: DetalleMarca) => {
    setCurrentMarca(marca);
    setCurrentDetalle(detalle);
    setShowCompleteDialog(true);
  };

  useEffect(() => {
    if (currentDetalle) {
      const missing = getMissingFields(currentDetalle);
      const initial: Record<string, any> = {};
      missing.forEach((m) => {
        const key = `${m.section}_${m.field}`;
        initial[key] = m.currentValue;
      });
      setFormValues(initial);
    }
  }, [currentDetalle]);

  const handleFormChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMarca || !currentDetalle) return;
    setSubmitting(true);

    const missing = getMissingFields(currentDetalle);
    const payload: any = {
      cabecera: {},
      titular_principal: {},
      contacto_principal: {},
      actor: "DASHBOARD_USER",
    };

    for (const m of missing) {
      const key = `${m.section}_${m.field}`;
      const value = formValues[key];

      if (m.section === "cabecera") {
        payload.cabecera[m.field] = value;
      } else if (m.section === "titular_principal") {
        payload.titular_principal[m.field] = value;
      } else if (m.section === "contacto_principal") {
        payload.contacto_principal[m.field] = value;
      }
    }

    const token = getWizardToken();
    try {
      const res = await fetch(
        `${API_BASE_URL}/marcas-dashboard/${currentMarca.secuencial}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setShowCompleteDialog(false);
        if (expandedRow === currentMarca.secuencial) {
          await fetchDetalle(currentMarca.secuencial);
        } else {
          await fetchMarcas();
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error: ${errorData.error || "No se pudo actualizar"}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMarcas = async () => {
    try {
      setLoading(true);
      const token = getWizardToken();
      const wizardData = SessionWizardData.obtener();

      if (!token) {
        setTimeout(() => router.replace("/login"), 1000);
        setLoading(false);
        return;
      }

      const url = `${API_BASE_URL}/marcas-dashboard/usuario/${
        secuencialUser || wizardData?.secuencial?.toString()
      }`;

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        setError("El tiempo de sesión ha expirado. Serás redirigido al inicio.");
        setLoading(false);
        setTimeout(() => router.replace("/login"), 1000);
        return;
      }

      if (res.status === 404) {
        setMarcas([]);
        setFilteredMarcas([]);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Error al obtener trámites de marca.");

      const data: MarcaRow[] = await res.json();
      setMarcas(data);
      setFilteredMarcas(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error desconocido.");
      setLoading(false);
    }
  };

  const fetchDetalle = async (secuencial: number) => {
    setDetalleLoading(true);
    setDetalleError(null);
    try {
      const token = getWizardToken();
      const url = `${API_BASE_URL}/marcas-dashboard/${secuencial}/detalle`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        setDetalleError("El tiempo de sesión ha expirado.");
        setDetalleLoading(false);
        setTimeout(() => router.replace("/login"), 3000);
        return;
      }

      if (res.status === 404) {
        setDetalleError("No existe detalle para este trámite.");
        setDetalle(null);
        setDetalleLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Error al obtener detalle.");

      const data: DetalleMarca = await res.json();
      setDetalle(data);
      setDetalleLoading(false);
    } catch (err: any) {
      setDetalleError(err.message || "Error desconocido.");
      setDetalleLoading(false);
    }
  };

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const wizardData = SessionWizardData.obtener();
    setSecuencialUser(wizardData?.secuencial?.toString() ?? "");
    if (!wizardData) router.replace("/login");
  }, [router]);

  useEffect(() => {
    if (secuencialUser) fetchMarcas();
  }, [secuencialUser]);

  useEffect(() => {
    if (expandedRow === null) {
      setDetalle(null);
      setDetalleError(null);
      setDetalleLoading(false);
      return;
    }
    fetchDetalle(expandedRow);
  }, [expandedRow]);
  
  
  const adminStateOptions = useMemo(() => {
  const states = new Set<string>();

  marcas.forEach((m) => {
    if (m.estadoAdminNombre) states.add(m.estadoAdminNombre);
  });

  return Array.from(states).sort();
}, [marcas]);
 
 
 
 useEffect(() => {
  let result = marcas;

  if (activeFilter !== "all") {
    result = result.filter((m) => m.estadoAdminNombre === activeFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();

    result = result.filter(
      (m) =>
        m.codigo_tramite.toLowerCase().includes(q) ||
        m.nombre_marca.toLowerCase().includes(q) ||
        m.actividad_economica.toLowerCase().includes(q) ||
        (m.estadoAdminNombre ?? "").toLowerCase().includes(q) ||
        (m.estado_pago ?? "").toLowerCase().includes(q) ||
        (m.tipo_resultado_diagnostico ?? "").toLowerCase().includes(q)
    );
  }

  setFilteredMarcas(result);
}, [searchQuery, marcas, activeFilter]);
  
   const [initialRedirectDone, setInitialRedirectDone] = useState<boolean>(false);
  useEffect(() => {
    if (!loading && !error && marcas.length === 0 && !initialRedirectDone) {
      setInitialRedirectDone(true);
      router.push("/Servicios/Marcas/RegistroMarca");
    }
  }, [loading, error, marcas, router, initialRedirectDone]); 

  const requestSort = (key: keyof MarcaRow) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedMarcas = useMemo(() => {
    if (!sortConfig) return filteredMarcas;
    return [...filteredMarcas].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredMarcas, sortConfig]);

  const total = marcas.length;
const enRevisionIA = marcas.filter((m) => m.estadoAdminNombre === "EN REVISIÓN POR IA").length;
const expertoRevisando = marcas.filter((m) => m.estadoAdminNombre === "EXPERTO REVISANDO").length;
const enEjecucion = marcas.filter((m) => m.estadoAdminNombre === "EN EJECUCIÓN").length;
const terminados = marcas.filter((m) => m.estadoAdminNombre === "TERMINADO").length;
  const pendientesPago = marcas.filter((m) => (m.estado_pago ?? "").toLowerCase() === "pendiente").length;
  const enGestion = marcas.filter((m) => {
    const e = (m.estado_tramite ?? "").toLowerCase();
    return e.includes("revision") || e.includes("gestion") || e.includes("pagado");
  }).length;
  const finalizados = marcas.filter((m) => {
    const e = (m.estado_tramite ?? "").toLowerCase();
    return e.includes("final") || e.includes("senadi");
  }).length;

  const handleRefresh = async () => {
    setLoading(true);
    await fetchMarcas();
    setLoading(false);
  };

  return (
    <>
      <NoPayBackground />
      <div className="relative z-10 min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200/60">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                      Trámites de propiedad intelectual
                    </p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      Dashboard de registro de marcas
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                      Gestiona tus diagnósticos y trámites de marca, revisa el estado
                      de pago, completa información pendiente y da seguimiento a la gestión.
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <RefreshCw
                      size={16}
                      className={loading ? "animate-spin text-slate-500" : "text-slate-500"}
                    />
                    Actualizar
                  </button>
                  <button
                    onClick={() => router.push("/Servicios/Marcas/RegistroMarca")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
                  >
                    <PlusCircle size={16} />
                    Nuevo diagnóstico
                  </button>
                </div>
              </div>

              
			  <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
  <KpiCard title="Total" value={total} percentage="Histórico" icon={List} tone="default" />

  <KpiCard
    title="En revisión IA"
    value={enRevisionIA}
    percentage={total > 0 ? `${Math.round((enRevisionIA / total) * 100)}%` : "0%"}
    icon={Bot}
    tone="warning"
  />

  <KpiCard
    title="Experto revisando"
    value={expertoRevisando}
    percentage={total > 0 ? `${Math.round((expertoRevisando / total) * 100)}%` : "0%"}
    icon={UserRound}
    tone="neutral"
  />

  <KpiCard
    title="En ejecución"
    value={enEjecucion}
    percentage={total > 0 ? `${Math.round((enEjecucion / total) * 100)}%` : "0%"}
    icon={Briefcase}
    tone="neutral"
  />

  <KpiCard
    title="Terminados"
    value={terminados}
    percentage={total > 0 ? `${Math.round((terminados / total) * 100)}%` : "0%"}
    icon={CheckCircle2}
    tone="success"
  />
</div>

			  
			  
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl"
            >
              <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Listado de trámites
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Revisa el estado, el detalle y las acciones disponibles para cada marca.
                    </p>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <div className="relative w-full sm:w-[220px]">
                      <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     
					 <select
					  value={activeFilter}
					  onChange={(e) => setActiveFilter(e.target.value)}
					  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
					>
					  <option value="all">Todos los estados</option>
					  {adminStateOptions.map((state) => (
						<option key={state} value={state}>
						  {state}
						</option>
					  ))}
					</select>

					 
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>

                    <div className="relative w-full sm:w-[280px]">
                      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por marca, código, actividad..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center p-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-cyan-600"
                  />
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                </div>
              ) : sortedMarcas.length === 0 ? (
                <div className="p-6">
                  <EmptyState />
                </div>
              ) : isMobile ? (
                <div className="p-4">
                  {sortedMarcas.map((marca) => (
                    <MobileServiceCard
                      key={marca.secuencial}
                      marca={marca}
                      expandedRow={expandedRow}
                      setExpandedRow={setExpandedRow}
                      detalle={detalle}
                      detalleLoading={detalleLoading}
                      detalleError={detalleError}
                      onCompleteInfo={() => {
                        if (detalle) openCompleteDialog(marca, detalle);
                      }}
                      onEditClick={handleOpenEdit}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th
                          className="w-20 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("secuencial")}
                        >
                          <div className="flex items-center gap-1">
                            ID
                            {sortConfig?.key === "secuencial" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>

                        <th
                          className="w-40 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("codigo_tramite")}
                        >
                          <div className="flex items-center gap-1">
                            Código
                            {sortConfig?.key === "codigo_tramite" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>

                        <th
                          className="w-48 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("nombre_marca")}
                        >
                          <div className="flex items-center gap-1">
                            Marca
                            {sortConfig?.key === "nombre_marca" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>

                        <th
                          className="w-32 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("tipo_resultado_diagnostico")}
                        >
                          <div className="flex items-center gap-1">
                            Resultado
                            {sortConfig?.key === "tipo_resultado_diagnostico" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>

                        <th
						  className="w-40 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
						  onClick={() => requestSort("estadoAdminNombre")}
						>
						  <div className="flex items-center gap-1">
							Estado trámite
							{sortConfig?.key === "estadoAdminNombre" &&
							  (sortConfig.direction === "ascending" ? (
								<ChevronUp className="h-4 w-4 text-slate-400" />
							  ) : (
								<ChevronDown className="h-4 w-4 text-slate-400" />
							  ))}
						  </div>
						</th>

                        <th
                          className="w-32 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("estado_pago")}
                        >
                          <div className="flex items-center gap-1">
                            Pago
                            {sortConfig?.key === "estado_pago" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>

                        <th className="w-24 px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white">
                      {sortedMarcas.map((marca) => {
                        const isExpanded = expandedRow === marca.secuencial;

                        return (
                          <React.Fragment key={marca.secuencial}>
                            <motion.tr
                              whileHover={{ backgroundColor: "rgba(248,250,252,1)" }}
                              className="cursor-pointer"
                              onClick={() =>
                                setExpandedRow(isExpanded ? null : marca.secuencial)
                              }
                            >
                              <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                #{marca.secuencial}
                              </td>

                              <td className="px-6 py-4 text-sm">
                                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                  {marca.codigo_tramite}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-700">
                                <div className="flex items-center gap-2">
                                  <Tag className="h-4 w-4 text-slate-400" />
                                  {marca.nombre_marca}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-sm">
                                <ResultadoBadge resultado={marca.tipo_resultado_diagnostico} />
                              </td>

                              <td className="px-6 py-4 text-sm">
							  <EstadoAdminBadge estado={marca.estadoAdminNombre} />
							</td>

                              <td className="px-6 py-4 text-sm">
                                <PagoBadge estado={marca.estado_pago} />
                              </td>

                              <td
                                className="px-6 py-4 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </td>
                            </motion.tr>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.tr
                                  key={`expanded-${marca.secuencial}`}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <td colSpan={7} className="bg-slate-50/70 px-6 py-5">
                                    <DetalleExpandido
                                      detalle={detalle}
                                      detalleLoading={detalleLoading}
                                      detalleError={detalleError}
                                      marca={marca}
                                      onCompleteInfo={() => {
                                        if (detalle) openCompleteDialog(marca, detalle);
                                      }}
                                      onEditClick={handleOpenEdit}
                                    />
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        <Footer />
        <NoPayChatLauncher />
      </div>

      {showCompleteDialog && currentDetalle && currentMarca && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="p-6">
              <h2 className="mb-2 text-xl font-bold">Completar información</h2>
              <p className="mb-4 text-sm text-slate-600">
                Completa estos datos mínimos para que el caso pueda pasar a gestión con mayor solidez.
              </p>

              <form onSubmit={handleSubmitComplete} className="space-y-4">
                {getMissingFields(currentDetalle).map((m, idx) => {
                  const key = `${m.section}_${m.field}`;
                  const value = formValues[key] ?? "";

                  return (
                    <div key={idx}>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {m.label}
                      </label>

                      {m.type === "text" && (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleFormChange(key, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                        />
                      )}

                      {m.type === "checkbox" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => handleFormChange(key, e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                          />
                          <span className="text-sm text-slate-700">Sí</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCompleteDialog(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-50"
                  >
                    {submitting ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}