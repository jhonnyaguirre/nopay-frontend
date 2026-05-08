"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

import { Header } from "app/resources/Header";
import Footer from "app/resources/Footer";
import NoPayChatLauncher from "app/resources/NoPayChatLauncher";

import NoPayBackground from "components/NoPayBackground";
import { SessionPaymentManager } from "lib/seguridad/SessionPaymentManager";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { getWizardToken } from "lib/seguridad/sessionUtils";
import { getColorCode } from "utils/ColorUtils";
import { API_BASE_URL, valorImpugnacionGl } from "config/apiConfig";

import {
  ExclamationTriangleIcon,
  PhotoIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";


import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleSlash,
  Clock,
  Download,
  FileText,
  Filter,
  List,
  MoreVertical,
  RefreshCw,
  Search,
  ShieldCheck,
  PlusCircle,
  CreditCard,
  Car,
  Building2,
  Eye,
  Wallet,
  FileSearch,
  FileQuestion,
  Users,          // ← Agrega esta línea
} from "lucide-react";


import { Badge } from "components/Badge";

// ---------- Tipos ----------
interface Servicio {
  usuario: number;
  secuencImpu: number;
  nombres: string;
  apellidos: string;
  secuenciaVehiculo: number;
  placa: string;
  modelo: string;
  color: string;
  agencia: string;
  estadoPago: string;
  estadoAdminNombre: string; // Valores reales: "ACTIVO", "EN REVISIÓN POR IA", "EXPERTO REVISANDO", "EN EJECUCIÓN", "TERMINADO"
  fechaCreacion?: string;
  monto?: number;
}

interface DetalleMulta {
  registri: string;
  citacion: string;
  cedula: string;
  representado: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  imagenCitacion: string;
  secuenciaEstado: number;
  estadoNombre: string;
  observaciones: string;
  estadoPago: string;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// ---------- Badge de estado administrativo (corregido con strings exactos) ----------
function EstadoAdminBadge({ estado }: { estado: string }) {
  const e = (estado || "").trim();

  if (e === "ACTIVO") {
    return (
      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
        ACTIVO
      </span>
    );
  }
  if (e === "EN REVISIÓN POR IA") {
    return (
      <span className="inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 border border-cyan-200">
        EN REVISIÓN POR IA
      </span>
    );
  }
  if (e === "EXPERTO REVISANDO") {
    return (
      <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
        EXPERTO REVISANDO
      </span>
    );
  }
  if (e === "EN EJECUCIÓN") {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
        EN EJECUCIÓN
      </span>
    );
  }
  if (e === "TERMINADO") {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
        TERMINADO
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
      {estado || "DESCONOCIDO"}
    </span>
  );
}

// ---------- Badge de estado de pago ----------
function EstadoPagoBadge({ estado }: { estado: string }) {
  const e = (estado || "").toLowerCase();

  if (e.includes("succeeded") || e.includes("pagado")) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
        Pagado
      </span>
    );
  }
  if (e.includes("pendiente")) {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
        Pendiente
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
      {estado || "Desconocido"}
    </span>
  );
}

// ---------- Badge de estado genérico (para el detalle de la multa) ----------
function EstadoBadge({ estado }: { estado: string }) {
  const estadoStr = (estado ?? "").toLowerCase();

  if (estadoStr.includes("pendiente")) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock className="mr-1 h-3 w-3" />
        {estado}
      </span>
    );
  }

  if (
    estadoStr.includes("confirmado") ||
    estadoStr.includes("pagado") ||
    estadoStr.includes("transaction succeeded")
  ) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="mr-1 h-3 w-3" />
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

// ---------- Otros componentes UI (SummaryMiniCard, EmptyState, FilePreview, KpiCard) ----------
// Se mantienen igual que en el original, los incluyo pero sin cambios relevantes.
function SummaryMiniCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "success" | "warning" | "info" | "neutral";
}) {
  return (
    <div
      className={cn(
			  "rounded-[24px] border p-5 shadow-sm transition",
			  tone === "default" && "border-slate-200 bg-white",
			  tone === "warning" && "border-amber-200 bg-amber-50/70",
			  tone === "success" && "border-emerald-200 bg-emerald-50/70",
			  tone === "neutral" && "border-slate-200 bg-slate-50/80",
			  tone === "info" && "border-cyan-200 bg-cyan-50/70"
			)}
    >
      <p
        className={cn(
			  "rounded-2xl p-3",
			  tone === "default" && "bg-cyan-50 text-cyan-700",
			  tone === "warning" && "bg-amber-100 text-amber-700",
			  tone === "success" && "bg-emerald-100 text-emerald-700",
			  tone === "neutral" && "bg-slate-100 text-slate-700",
			  tone === "info" && "bg-cyan-100 text-cyan-700"
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

function EmptyState() {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
        <FileText className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        No se encontraron servicios
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Ajusta tus filtros de búsqueda o registra un nuevo servicio.
      </p>
    </div>
  );
}

interface FilePreviewProps {
  url: string;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ url, className = "" }) => {
  const getFileExtension = (fileUrl: string): string => {
    const match = fileUrl.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
    return match ? match[1].toLowerCase() : "";
  };

  const getFileName = (fileUrl: string): string => {
    const parts = fileUrl.split("/");
    return parts[parts.length - 1] || "archivo";
  };

  const ext = getFileExtension(url);
  const fileName = getFileName(url);

  const hasValidExtension = ext && ext.length > 0 && fileName.includes(".");
  const isNumericId = /^\d+$/.test(fileName);
  const isMissingAttachment =
    !hasValidExtension || (url.includes("/regmultas/download/") && isNumericId);

  if (isMissingAttachment) {
    return (
      <div className={cn("text-center", className)}>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <FileQuestion className="h-12 w-12 text-slate-300" />
        </div>
        <p className="mt-2 text-center text-xs text-slate-500">Multa sin adjunto</p>
      </div>
    );
  }

  const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
  const isPdf = ext === "pdf";
  const isDocument = [
    "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "rtf",
  ].includes(ext);

  if (isImage) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("group block", className)}
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <img
            src={url}
            alt="Vista previa"
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-xs font-medium text-white backdrop-blur">
              <Eye className="h-3.5 w-3.5" />
              Ver completo
            </span>
          </div>
        </div>
        <p className="mt-2 truncate text-center text-xs text-slate-500">{fileName}</p>
      </a>
    );
  }

  if (isPdf) {
    return (
      <div className={cn("text-center", className)}>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <FileText className="h-12 w-12 text-red-500" />
        </div>
        <p className="mt-2 truncate text-xs text-slate-500">{fileName}</p>
        <div className="mt-3 flex justify-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700"
          >
            Ver PDF
          </a>
          <a
            href={url}
            download
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Download size={12} />
            Descargar
          </a>
        </div>
      </div>
    );
  }

  if (isDocument) {
    return (
      <div className={cn("text-center", className)}>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <FileText className="h-12 w-12 text-blue-500" />
        </div>
        <p className="mt-2 truncate text-xs text-slate-500">{fileName}</p>
        <div className="mt-3 flex justify-center">
          <a
            href={url}
            download
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Download size={12} />
            Descargar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("text-center", className)}>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <FileSearch className="h-12 w-12 text-slate-400" />
      </div>
      <p className="mt-2 truncate text-xs text-slate-500">{fileName}</p>
      <div className="mt-3 flex justify-center">
        <a
          href={url}
          download
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Download size={12} />
          Descargar
        </a>
      </div>
    </div>
  );
};

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
  tone?: "default" | "warning" | "success" | "neutral" | "info";
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

// ---------- Detalle expandido ----------
function DetalleExpandido({
  detalle,
  detalleLoading,
  detalleError,
  servicio,
}: {
  detalle: DetalleMulta[] | null;
  detalleLoading: boolean;
  detalleError: string | null;
  servicio: Servicio;
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
        <ExclamationTriangleIcon className="mx-auto mb-2 h-6 w-6" />
        {detalleError}
      </div>
    );
  }

  if (!detalle || detalle.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
        <DocumentMagnifyingGlassIcon className="mx-auto mb-3 h-8 w-8 text-slate-400" />
        <p className="text-sm text-slate-600">No hay información de detalle disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {detalle.map((d: DetalleMulta, i: number) => (
        <div key={`${d.registri}-${d.cedula}-${i}`} className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-3">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 h-full">
              <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <PhotoIcon className="mr-2 h-4 w-4" />
                Archivo adjunto
              </h4>
              <FilePreview url={d.imagenCitacion} />
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 h-full">
              <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <InformationCircleIcon className="mr-2 h-4 w-4" />
                Información general
              </h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Fecha registro</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {new Date(d.registri).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Fecha citación</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {new Date(d.citacion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Cédula</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{d.cedula}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Placa</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{d.placa}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-slate-500">Representado</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{d.representado}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 h-full">
              <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <DocumentTextIcon className="mr-2 h-4 w-4" />
                Estado y observaciones
              </h4>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Estado multa</p>
                  <div className="mt-2">
                    <EstadoBadge estado={d.estadoNombre || "-"} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Estado pago</p>
                    <div className="mt-2">
                      <EstadoPagoBadge estado={d.estadoPago || "-"} />
                    </div>
                  </div>

                  {d.estadoPago !== "Transaction succeeded" && (
                    <button
                      onClick={() => {
                        SessionPaymentManager.guardar({
                          citacion: d.citacion,
                          item: `${servicio.modelo} - ${servicio.placa} - TIPO 1`,
                          servicio: String(servicio.secuencImpu),
                          valor: String(valorImpugnacionGl),
                          cedula: d.cedula,
                        });
                        router.push("/resumenPago");
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                    >
                      <Wallet className="h-4 w-4" />
                      Procesar pago
                    </button>
                  )}
                </div>

                <div>
                  <p className="text-xs text-slate-500">Observaciones</p>
                  <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-700">
                      {d.observaciones || "Sin observaciones registradas"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Mobile Service Card (corregido) ----------
interface MobileServiceCardProps {
  servicio: Servicio;
  idx: number;
  expandedRow: number | null;
  setExpandedRow: React.Dispatch<React.SetStateAction<number | null>>;
  detalle: DetalleMulta[] | null;
  detalleLoading: boolean;
  detalleError: string | null;
}

const MobileServiceCard = ({
  servicio,
  idx,
  expandedRow,
  setExpandedRow,
  detalle,
  detalleLoading,
  detalleError,
}: MobileServiceCardProps) => {
  const router = useRouter();

  const isPagoSucceeded = (servicio.estadoPago ?? "").toLowerCase().includes("succeeded") ||
                          (servicio.estadoPago ?? "").toLowerCase().includes("pagado");

  return (
    <motion.div
      key={servicio.secuencImpu}
      whileHover={{ y: -2 }}
      className="mb-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
    >
      <div
        className="cursor-pointer p-4"
        onClick={() =>
          setExpandedRow(expandedRow === servicio.secuencImpu ? null : servicio.secuencImpu)
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-sm font-bold text-white">
              {servicio.modelo?.charAt(0) || "V"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{servicio.modelo}</p>
              <p className="mt-0.5 text-sm text-slate-500">{servicio.placa}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  #{servicio.secuencImpu}
                </span>
                <EstadoAdminBadge estado={servicio.estadoAdminNombre} />
                <EstadoPagoBadge estado={servicio.estadoPago} />
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {!isPagoSucceeded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  SessionPaymentManager.guardar({
                    citacion: detalle?.[0]?.citacion || "",
                    item: `${servicio.modelo} - ${servicio.placa}`,
                    servicio: detalle?.[0]?.citacion || "",
                    valor: String(valorImpugnacionGl),
                    cedula: detalle?.[0]?.cedula || "",
                  });
                  router.push("/resumenPago");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
              >
                <Wallet className="h-4 w-4" />
                Pagar
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expandedRow === servicio.secuencImpu && (
          <motion.div
            key={`expanded-mobile-${servicio.secuencImpu}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 bg-slate-50/60 p-4"
          >
            <DetalleExpandido
              detalle={detalle}
              detalleLoading={detalleLoading}
              detalleError={detalleError}
              servicio={servicio}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------- Componente principal ----------
export default function ServiciosDashboard() {
  const [secuencialUser, setSecuencialUser] = useState<string>("");
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [filteredServicios, setFilteredServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Servicio;
    direction: "ascending" | "descending";
  } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);
  const [detalle, setDetalle] = useState<DetalleMulta[] | null>(null);
  const [detalleLoading, setDetalleLoading] = useState<boolean>(false);
  const [detalleError, setDetalleError] = useState<string | null>(null);
  const [initialRedirectDone, setInitialRedirectDone] = useState<boolean>(false);

  const router = useRouter();

  const handleClick = () => {
    router.push("/register-form");
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const wizardData = SessionWizardData.obtener();
    setSecuencialUser(wizardData?.secuencial?.toString() ?? "");
    if (!wizardData) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        const token = getWizardToken();
        const wizardData = SessionWizardData.obtener();

        if (!token) {
          router.replace("/login");
          setLoading(false);
          return;
        }

        const url = `${API_BASE_URL}/servicios-requeridos/${
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
          setServicios([]);
          setFilteredServicios([]);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Error al obtener servicios.");

        const data: Servicio[] = await res.json();
        const normalizados: Servicio[] = data.map((s) => ({
          usuario: s.usuario,
          secuencImpu: s.secuencImpu,
          nombres: s.nombres ?? "",
          apellidos: s.apellidos ?? "",
          secuenciaVehiculo: s.secuenciaVehiculo,
          placa: s.placa ?? "",
          modelo: s.modelo ?? "",
          color: s.color ?? "",
          agencia: s.agencia ?? "",
          estadoPago: s.estadoPago ?? "",
          estadoAdminNombre: s.estadoAdminNombre ?? "",
          fechaCreacion: s.fechaCreacion ?? new Date().toISOString().split("T")[0],
          monto: s.monto ?? Math.floor(Math.random() * 500) + 100,
        }));

        setServicios(normalizados);
        setFilteredServicios(normalizados);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Error desconocido.");
        setLoading(false);
      }
    };

    fetchServicios();
  }, [secuencialUser, router]);

  useEffect(() => {
    if (!loading && !error && servicios.length === 0 && !initialRedirectDone) {
      setInitialRedirectDone(true);
      router.push("/register-form");
    }
  }, [loading, error, servicios, router, initialRedirectDone]);

  useEffect(() => {
    if (expandedRow === null) {
      setDetalle(null);
      setDetalleError(null);
      setDetalleLoading(false);
      return;
    }

    const fetchDetalle = async () => {
      setDetalleLoading(true);
      setDetalleError(null);

      try {
        const token = getWizardToken();
        const url = `${API_BASE_URL}/servicios-requeridos/${expandedRow}/detalle`;

        const res = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          setDetalleError("El tiempo de sesión ha expirado.");
          setDetalleLoading(false);
          setTimeout(() => router.replace("/"), 3000);
          return;
        }

        if (res.status === 404) {
          setDetalleError("No existe detalle para esta impugnación.");
          setDetalle(null);
          setDetalleLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Error al obtener detalle de la multa.");

        const data: DetalleMulta[] = await res.json();
        setDetalle(data);
        setDetalleLoading(false);
      } catch (err: any) {
        setDetalleError(err.message || "Error desconocido.");
        setDetalleLoading(false);
      }
    };

    fetchDetalle();
  }, [expandedRow, router]);

  // Obtener valores únicos de estadoAdminNombre para el filtro
  const adminStateOptions = useMemo(() => {
    const states = new Set<string>();
    servicios.forEach(s => {
      if (s.estadoAdminNombre) states.add(s.estadoAdminNombre);
    });
    return Array.from(states).sort();
  }, [servicios]);

  // Filtrar por estadoAdminNombre y búsqueda
  useEffect(() => {
    let result = servicios;
    if (activeFilter !== "all") {
      result = result.filter((s) => s.estadoAdminNombre === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.placa.toLowerCase().includes(q) ||
          s.modelo.toLowerCase().includes(q) ||
          (s.estadoPago ?? "").toLowerCase().includes(q) ||
          s.agencia.toLowerCase().includes(q) ||
          (s.estadoAdminNombre && s.estadoAdminNombre.toLowerCase().includes(q))
      );
    }
    setFilteredServicios(result);
  }, [searchQuery, servicios, activeFilter]);

  const requestSort = (key: keyof Servicio) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedServicios = useMemo(() => {
    if (!sortConfig) return filteredServicios;

    return [...filteredServicios].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredServicios, sortConfig]);

  // KPIs basados en estado administrativo
  const totalServicios = servicios.length;
  const enRevisionIA = servicios.filter(s => s.estadoAdminNombre === "EN REVISIÓN POR IA").length;
  const expertoRevisando = servicios.filter(s => s.estadoAdminNombre === "EXPERTO REVISANDO").length;
  const enEjecucion = servicios.filter(s => s.estadoAdminNombre === "EN EJECUCIÓN").length;
  const terminados = servicios.filter(s => s.estadoAdminNombre === "TERMINADO").length;

  const handleRefresh = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <>
      <NoPayBackground />

      <div className="relative z-10 min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header principal */}
            <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200/60">
                    <ShieldCheck className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                      Servicios legales
                    </p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      Impugnación de multas
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                      Visualiza, revisa y gestiona todas tus solicitudes de impugnación
                      de multas desde un solo panel.
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
                    onClick={handleClick}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
                  >
                    <PlusCircle size={16} />
                    Nueva Impugnación
                  </button>
                </div>
              </div>

              {/* KPIs basados en estado administrativo */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KpiCard
                  title="Total"
                  value={totalServicios}
                  percentage="Histórico"
                  icon={List}
                  tone="default"
                />
                <KpiCard
                  title="En revisión IA"
                  value={enRevisionIA}
                  percentage={totalServicios > 0 ? `${Math.round((enRevisionIA / totalServicios) * 100)}%` : "0%"}
                  icon={Clock}
                  tone="warning"
                />
                <KpiCard
                  title="Experto revisando"
                  value={expertoRevisando}
                  percentage={totalServicios > 0 ? `${Math.round((expertoRevisando / totalServicios) * 100)}%` : "0%"}
                  icon={Users}
                  tone="info"
                />
                <KpiCard
                  title="En ejecución"
                  value={enEjecucion}
                  percentage={totalServicios > 0 ? `${Math.round((enEjecucion / totalServicios) * 100)}%` : "0%"}
                  icon={Car}
                  tone="neutral"
                />
                <KpiCard
                  title="Terminados"
                  value={terminados}
                  percentage={totalServicios > 0 ? `${Math.round((terminados / totalServicios) * 100)}%` : "0%"}
                  icon={CheckCircle2}
                  tone="success"
                />
              </div>
            </div>

            {/* Bloque listado */}
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
                      Listado de servicios
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Revisa el estado, detalle y acciones disponibles para cada solicitud.
                    </p>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <div className="relative w-full sm:w-[200px]">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Filter className="h-4 w-4 text-slate-400" />
                      </div>
                      <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                      >
                        <option value="all">Todos los estados</option>
                        {adminStateOptions.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="relative w-full sm:w-[240px]">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por placa, modelo, agencia o estado..."
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
              ) : sortedServicios.length === 0 ? (
                <div className="p-6">
                  <EmptyState />
                </div>
              ) : isMobile ? (
                <div className="p-4">
                  {sortedServicios.map((servicio, idx) => (
                    <MobileServiceCard
                      key={servicio.secuencImpu}
                      servicio={servicio}
                      idx={idx}
                      expandedRow={expandedRow}
                      setExpandedRow={setExpandedRow}
                      detalle={detalle}
                      detalleLoading={detalleLoading}
                      detalleError={detalleError}
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
                          onClick={() => requestSort("secuencImpu")}
                        >
                          <div className="flex items-center gap-1">
                            ID
                            {sortConfig?.key === "secuencImpu" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>

                        <th
                          className="w-28 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("placa")}
                        >
                          <div className="flex items-center gap-1">
                            Placa
                            {sortConfig?.key === "placa" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>

                        <th
                          className="w-72 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("modelo")}
                        >
                          <div className="flex items-center gap-1">
                            Vehículo
                            {sortConfig?.key === "modelo" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>

                        <th
                          className="w-40 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("agencia")}
                        >
                          <div className="flex items-center gap-1">
                            Agencia
                            {sortConfig?.key === "agencia" &&
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
                          onClick={() => requestSort("estadoPago")}
                        >
                          <div className="flex items-center gap-1">
                            Estado pago
                            {sortConfig?.key === "estadoPago" &&
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
                      {sortedServicios.map((servicio, idx) => {
                        const isExpanded = expandedRow === servicio.secuencImpu;

                        return (
                          <React.Fragment key={servicio.secuencImpu}>
                            <motion.tr
                              whileHover={{ backgroundColor: "rgba(248,250,252,1)" }}
                              className="cursor-pointer"
                              onClick={() =>
                                setExpandedRow(
                                  expandedRow === servicio.secuencImpu
                                    ? null
                                    : servicio.secuencImpu
                                )
                              }
                            >
                              <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                #{servicio.secuencImpu}
                              </td>

                              <td className="px-6 py-4 text-sm">
                                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                  {servicio.placa}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-700">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-xs font-bold text-white">
                                    {servicio.modelo?.charAt(0) || "V"}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">
                                      {servicio.modelo}
                                    </span>
                                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                      <span
                                        className="inline-block h-3 w-3 rounded-full border border-slate-300"
                                        style={{ backgroundColor: getColorCode(servicio.color) }}
                                      />
                                      {servicio.color}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-700">
                                <div className="inline-flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-slate-400" />
                                  {servicio.agencia}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-sm">
                                <EstadoAdminBadge estado={servicio.estadoAdminNombre} />
                              </td>

                              <td className="px-6 py-4 text-sm">
                                <EstadoPagoBadge estado={servicio.estadoPago} />
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
                                  key={`expanded-${servicio.secuencImpu}`}
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
                                      servicio={servicio}
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

        <footer className="w-full">
          <Footer />
        </footer>

        <NoPayChatLauncher />
      </div>
    </>
  );
}