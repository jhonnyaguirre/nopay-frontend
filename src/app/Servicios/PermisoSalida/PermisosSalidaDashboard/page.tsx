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
import { API_BASE_URL, valorPermisoSalida } from "config/apiConfig";

import {
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleSlash,
  Clock,
  Filter,
  List,
  MoreVertical,
  RefreshCw,
  Search,
  ShieldCheck,
  PlusCircle,
  CreditCard,
  Plane,
  Wallet,
  Calendar,
  MapPin,
  Users,
  Edit,
  FileText,
  Gauge,        // ← ícono correcto para "En ejecución"
} from "lucide-react";

import { Badge } from "components/Badge";

// ---------- Tipos ----------
interface PermisoSalida {
  secuencial: number;
  codigo_tramite: string;
  destino: string;
  fecha_salida: string;
  estado_tramite: string;
  listo_para_documento: boolean;
  fechacrea: string;
  estado_pago: string;
  estadoAdminNombre: string; // Valores reales: "ACTIVO", "EN REVISIÓN POR IA", "EXPERTO REVISANDO", "EN EJECUCIÓN", "TERMINADO"
}

interface Interviniente {
  tipo_persona: string;
  rol_funcional?: string;
  parentesco?: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string;
  lugar_nacimiento?: string;
  sexo?: string;
  nacionalidad?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  es_otorgante: boolean;
  autoriza_salida?: boolean;
}

interface DetallePermiso {
  secuencial: number;
  codigo_tramite: string;
  pais_destino_nombre: string;
  ciudad_destino: string;
  destino: string;
  fecha_salida: string;
  fecha_retorno?: string;
  salida_indefinida: boolean;
  descripcion_salida_indefinida?: string;
  viaja_con?: string;
  tiene_acompanante: boolean;
  motivo_viaje?: string;
  medio_transporte?: string;
  aerolinea_transporte?: string;
  observacion?: string;
  observacion_validacion_legal?: string;
  listo_para_documento: boolean;
  estado_tramite: string;
  estado_pago: string;
  ciudad_suscripcion?: string;
  provincia_suscripcion?: string;
  pais_suscripcion?: string;
  tiempo_estadia_descripcion?: string;
  direccion_estadia_exterior?: string;
  telefono_estadia_exterior?: string;
  responsable_gastos?: string;
  acepta_terminos_condiciones: boolean;
  declara_informacion_veraz: boolean;
  intervinientes: Interviniente[];
  estadoAdminNombre: string;
}

interface MissingField {
  section: "cabecera" | "interviniente";
  intervinienteId?: string;
  field: string;
  label: string;
  type: "text" | "date" | "checkbox";
  currentValue: any;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// ---------- Funciones auxiliares ----------
function getMissingFields(detalle: DetallePermiso): MissingField[] {
  const missing: MissingField[] = [];

  // Cabecera
  if (!detalle.pais_destino_nombre) {
    missing.push({
      section: "cabecera",
      field: "pais_destino_nombre",
      label: "País de destino",
      type: "text",
      currentValue: "",
    });
  }
  if (!detalle.ciudad_destino) {
    missing.push({
      section: "cabecera",
      field: "ciudad_destino",
      label: "Ciudad de destino",
      type: "text",
      currentValue: "",
    });
  }
  if (!detalle.fecha_salida) {
    missing.push({
      section: "cabecera",
      field: "fecha_salida",
      label: "Fecha de salida",
      type: "date",
      currentValue: "",
    });
  }
  if (!detalle.salida_indefinida && !detalle.fecha_retorno) {
    missing.push({
      section: "cabecera",
      field: "fecha_retorno",
      label: "Fecha de retorno",
      type: "date",
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

  // Menor
  const menor = detalle.intervinientes.find((i) => i.tipo_persona === "MENOR");
  if (menor) {
    if (!menor.fecha_nacimiento) {
      missing.push({
        section: "interviniente",
        intervinienteId: menor.cedula,
        field: "fecha_nacimiento",
        label: "Fecha de nacimiento del menor",
        type: "date",
        currentValue: "",
      });
    }
    if (!menor.lugar_nacimiento) {
      missing.push({
        section: "interviniente",
        intervinienteId: menor.cedula,
        field: "lugar_nacimiento",
        label: "Lugar de nacimiento del menor",
        type: "text",
        currentValue: "",
      });
    }
  }

  // Progenitor 1
  const progenitor1 = detalle.intervinientes.find(
    (i) => i.tipo_persona === "PROGENITOR_1"
  );
  if (progenitor1 && !progenitor1.es_otorgante) {
    missing.push({
      section: "interviniente",
      intervinienteId: progenitor1.cedula,
      field: "es_otorgante",
      label: "¿El progenitor 1 otorga autorización?",
      type: "checkbox",
      currentValue: false,
    });
  }

  // Progenitor 2
  const progenitor2 = detalle.intervinientes.find(
    (i) => i.tipo_persona === "PROGENITOR_2"
  );
  if (progenitor2 && !progenitor2.es_otorgante) {
    missing.push({
      section: "interviniente",
      intervinienteId: progenitor2.cedula,
      field: "es_otorgante",
      label: "¿El progenitor 2 otorga autorización?",
      type: "checkbox",
      currentValue: false,
    });
  }

  return missing;
}

// ---------- Componentes UI ----------
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

function EmptyState() {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
        <FileText className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        No se encontraron permisos de salida
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Ajusta tus filtros de búsqueda o inicia un nuevo trámite.
      </p>
    </div>
  );
}

function EstadoBadge({
  estado,
  listoParaDocumento,
}: {
  estado: string;
  listoParaDocumento?: boolean;
}) {
  const estadoLower = (estado ?? "").toLowerCase();
  if (estadoLower.includes("pendiente")) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock className="mr-1 h-3 w-3" />
        {estado}
      </span>
    );
  }
  if (
    estadoLower.includes("validado") ||
    estadoLower.includes("listo_notaria") ||
    estadoLower.includes("documento_generado")
  ) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        {estado}
      </span>
    );
  }
  if (estadoLower.includes("anulado")) {
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

// ✅ Badge corregido usando los strings exactos del backend
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

function PagoBadge({ estado }: { estado: string }) {
  const estadoLower = (estado ?? "").toLowerCase();
  if (estadoLower === "pendiente") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Wallet className="mr-1 h-3 w-3" />
        Pendiente
      </span>
    );
  }
  if (estadoLower.includes("pagado") || estadoLower.includes("succeeded")) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Pagado
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

// ---------- Componente DetalleExpandido ----------
function DetalleExpandido({
  detalle,
  detalleLoading,
  detalleError,
  permiso,
  onCompleteInfo,
  onEditClick,
  onGenerarMinuta,
  generatingSecuencial,
}: {
  detalle: DetallePermiso | null;
  detalleLoading: boolean;
  detalleError: string | null;
  permiso: PermisoSalida;
  onCompleteInfo: () => void;
  onEditClick: (codigo: string) => void;
  onGenerarMinuta: (secuencial: number) => void;
  generatingSecuencial: number | null;
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

  if (!detalle) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
        <DocumentMagnifyingGlassIcon className="mx-auto mb-3 h-8 w-8 text-slate-400" />
        <p className="text-sm text-slate-600">
          No hay información de detalle disponible.
        </p>
      </div>
    );
  }

  const isSucceeded =
    (detalle.estado_pago ?? "").toLowerCase().includes("pagado") ||
    (detalle.estado_pago ?? "").toLowerCase().includes("succeeded");

  return (
    <div className="space-y-6">
      {/* Cabecera del permiso */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Calendar className="mr-2 h-4 w-4" />
            Fechas
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Salida:</span>
              <span className="text-sm font-semibold text-slate-900">
                {detalle.fecha_salida
                  ? new Date(detalle.fecha_salida).toLocaleDateString("es-ES")
                  : "—"}
              </span>
            </div>
            {!detalle.salida_indefinida && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Retorno:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {detalle.fecha_retorno
                    ? new Date(detalle.fecha_retorno).toLocaleDateString("es-ES")
                    : "—"}
                </span>
              </div>
            )}
            {detalle.salida_indefinida && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Salida indefinida:</span>
                <span className="text-sm font-semibold text-slate-900">Sí</span>
              </div>
            )}
            {detalle.descripcion_salida_indefinida && (
              <div className="mt-2 text-sm text-slate-600">
                <span className="block text-xs text-slate-400">Descripción:</span>
                {detalle.descripcion_salida_indefinida}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Plane className="mr-2 h-4 w-4" />
            Viaje
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Destino:</span>
              <span className="text-sm font-semibold text-slate-900">
                {detalle.destino || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Motivo:</span>
              <span className="text-sm font-semibold text-slate-900">
                {detalle.motivo_viaje || "No especificado"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Transporte:</span>
              <span className="text-sm font-semibold text-slate-900">
                {detalle.medio_transporte}
                {detalle.aerolinea_transporte && ` - ${detalle.aerolinea_transporte}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Viaja con:</span>
              <span className="text-sm font-semibold text-slate-900">
                {detalle.viaja_con || "No especificado"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Acompañante:</span>
              <span className="text-sm font-semibold text-slate-900">
                {detalle.tiene_acompanante ? "Sí" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Intervinientes */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-4">
        <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <Users className="mr-2 h-4 w-4" />
          Personas involucradas
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detalle.intervinientes.map((p, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 p-3">
              <p className="font-semibold text-slate-900">
                {p.nombres} {p.apellidos}
              </p>
              <p className="text-xs text-slate-500">
                {p.tipo_persona} {p.parentesco && `(${p.parentesco})`}
              </p>
              <p className="text-xs text-slate-500">Cédula: {p.cedula}</p>
              {p.es_otorgante && (
                <Badge
                  variant="outline"
                  className="mt-2 border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  Otorga autorización
                </Badge>
              )}
              {p.autoriza_salida === false && (
                <Badge
                  variant="outline"
                  className="mt-2 border-amber-200 bg-amber-50 text-amber-700"
                >
                  No autoriza
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional y pago */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <MapPin className="mr-2 h-4 w-4" />
            Suscripción y estadía
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Ciudad suscripción:</span>
              <span className="font-semibold">
                {detalle.ciudad_suscripcion || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Provincia:</span>
              <span className="font-semibold">
                {detalle.provincia_suscripcion || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">País suscripción:</span>
              <span className="font-semibold">
                {detalle.pais_suscripcion || "ECUADOR"}
              </span>
            </div>
            <div className="mt-3 border-t pt-2">
              <p className="text-slate-500">Tiempo estadía:</p>
              <p className="font-semibold">
                {detalle.tiempo_estadia_descripcion || "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Dirección en exterior:</p>
              <p className="font-semibold">
                {detalle.direccion_estadia_exterior || "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Teléfono exterior:</p>
              <p className="font-semibold">
                {detalle.telefono_estadia_exterior || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <h4 className="mb-4 flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <CreditCard className="mr-2 h-4 w-4" />
            Pago y estado legal
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

            {!isSucceeded && (
              <>
                <button
                  onClick={() => {
                    SessionPaymentManager.guardar({
                      citacion: String(permiso.secuencial),
                      servicio: String(detalle.secuencial),
                      item: `Autorización - ${detalle.destino} - PERMISO DE SALIDA`,
                      valor: String(valorPermisoSalida),
                      cedula:
                        detalle.intervinientes.find(
                          (i) => i.tipo_persona === "MENOR"
                        )?.cedula || "",
                    });
                    router.push("/resumenPago");
                  }}
                  className="w-full rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <Wallet className="mr-2 inline h-4 w-4" />
                  Procesar pago
                </button>

                <button
                  onClick={() => onEditClick(permiso.codigo_tramite)}
                  className="mt-2 w-full rounded-xl bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  <Edit className="mr-2 inline h-4 w-4" />
                  Revisar y confirmar información
                </button>

                {!detalle.listo_para_documento && (
                  <button
                    onClick={onCompleteInfo}
                    className="mt-2 w-full rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                  >
                    <Edit className="mr-2 inline h-4 w-4" />
                    Completar información
                  </button>
                )}
              </>
            )}

            {isSucceeded && detalle.listo_para_documento && (
              <div className="mt-2 rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-700">
                <CheckCircle2 className="mr-1 inline h-4 w-4" />
                Toda la información cargada está validada y completada
              </div>
            )}

            {detalle.listo_para_documento && (
              <button
                onClick={() => onGenerarMinuta(permiso.secuencial)}
                disabled={generatingSecuencial === permiso.secuencial}
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {generatingSecuencial === permiso.secuencial ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Generando minuta...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 inline h-4 w-4" />
                    Minuta Legal
                  </>
                )}
              </button>
            )}

            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Observaciones legales:</p>
              <p className="text-sm text-slate-700">
                {detalle.observacion_validacion_legal || "Sin observaciones"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Mobile Service Card ----------
interface MobileServiceCardProps {
  permiso: PermisoSalida;
  expandedRow: number | null;
  setExpandedRow: React.Dispatch<React.SetStateAction<number | null>>;
  detalle: DetallePermiso | null;
  detalleLoading: boolean;
  detalleError: string | null;
  onCompleteInfo: () => void;
  onEditClick: (codigo: string) => void;
onGenerarMinuta: (secuencial: number) => void;
generatingSecuencial: number | null;
}

const MobileServiceCard = ({
  permiso,
  expandedRow,
  setExpandedRow,
  detalle,
  detalleLoading,
  detalleError,
  onCompleteInfo,
onEditClick,
onGenerarMinuta,
generatingSecuencial,
}: MobileServiceCardProps) => {
  const router = useRouter();
  const isExpanded = expandedRow === permiso.secuencial;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="mb-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
    >
      <div
        className="cursor-pointer p-4"
        onClick={() => setExpandedRow(isExpanded ? null : permiso.secuencial)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-sm font-bold text-white">
              {permiso.codigo_tramite?.charAt(0) || "P"}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {permiso.codigo_tramite}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">{permiso.destino}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  #{permiso.secuencial}
                </span>
                <EstadoAdminBadge estado={permiso.estadoAdminNombre} />
                <PagoBadge estado={permiso.estado_pago} />
              </div>
            </div>
          </div>
          <div className="shrink-0">
            {permiso.estado_pago !== "Pagado" &&
              permiso.estado_pago !== "Transaction succeeded" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    SessionPaymentManager.guardar({
                      citacion: String(permiso.secuencial),
                      servicio: String(permiso.secuencial),
                      item: `Permiso de salida - ${permiso.codigo_tramite}`,
                      valor: String(valorPermisoSalida),
                      cedula: "",
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
              permiso={permiso}
              onCompleteInfo={onCompleteInfo}
              onEditClick={onEditClick}
              onGenerarMinuta={onGenerarMinuta}
              generatingSecuencial={generatingSecuencial}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------- KPI Card ----------
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

// ---------- Componente principal ----------
export default function PermisosSalidaDashboard() {
  const [secuencialUser, setSecuencialUser] = useState<string>("");
  const [permisos, setPermisos] = useState<PermisoSalida[]>([]);
  const [filteredPermisos, setFilteredPermisos] = useState<PermisoSalida[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PermisoSalida;
    direction: "ascending" | "descending";
  } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);
  const [detalle, setDetalle] = useState<DetallePermiso | null>(null);
  const [detalleLoading, setDetalleLoading] = useState<boolean>(false);
  const [detalleError, setDetalleError] = useState<string | null>(null);
  const [generatingMinuta, setGeneratingMinuta] = useState<number | null>(null);
  const [showMinutaDialog, setShowMinutaDialog] = useState<boolean>(false);

  // Diálogo de completar información
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [currentPermiso, setCurrentPermiso] = useState<PermisoSalida | null>(
    null
  );
  const [currentDetalle, setCurrentDetalle] = useState<DetallePermiso | null>(
    null
  );
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleGenerarMinuta = async (secuencial: number) => {
    setGeneratingMinuta(secuencial);
    setShowMinutaDialog(true);
    try {
      const token = getWizardToken();
      const url = `${API_BASE_URL}/minuta/generar-minuta/${secuencial}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al generar la minuta legal");
      }

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = `minuta_permiso_salida_${secuencial}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urlBlob);
    } catch (err: any) {
      alert(err.message || "Error al generar la minuta");
    } finally {
      setGeneratingMinuta(null);
      setShowMinutaDialog(false);
    }
  };

  const handleClick = () => router.push("/Servicios/PermisoSalida/PermisoSalidaDiagnostico");

  const handleOpenEdit = (codigo: string) => {
    router.push(`/Servicios/PermisoSalida/EditarPermisoDialog?codigo=${codigo}`);
  };

  const openCompleteDialog = (permiso: PermisoSalida, detalle: DetallePermiso) => {
    setCurrentPermiso(permiso);
    setCurrentDetalle(detalle);
    setShowCompleteDialog(true);
  };

  useEffect(() => {
    if (currentDetalle) {
      const missing = getMissingFields(currentDetalle);
      const initial: Record<string, any> = {};
      missing.forEach((m) => {
        const key = `${m.section}_${
          m.intervinienteId ? m.intervinienteId + "_" : ""
        }${m.field}`;
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
    if (!currentPermiso || !currentDetalle) return;
    setSubmitting(true);

    const missing = getMissingFields(currentDetalle);
    const payload: any = { cabecera: {}, intervinientes: [] };

    for (const m of missing) {
      const key = `${m.section}_${
        m.intervinienteId ? m.intervinienteId + "_" : ""
      }${m.field}`;
      const value = formValues[key];
      if (m.section === "cabecera") {
        payload.cabecera[m.field] = value;
      } else if (m.section === "interviniente") {
        let inter = payload.intervinientes.find(
          (i: any) => i.cedula === m.intervinienteId
        );
        if (!inter) {
          inter = { cedula: m.intervinienteId };
          payload.intervinientes.push(inter);
        }
        inter[m.field] = value;
      }
    }

    const token = getWizardToken();
    try {
      const res = await fetch(
        `${API_BASE_URL}/permisos-salida-dashboard/${currentPermiso.secuencial}`,
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
        if (expandedRow === currentPermiso.secuencial) {
          await fetchDetalle(currentPermiso.secuencial);
        } else {
          await fetchPermisos();
        }
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "No se pudo actualizar"}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchPermisos = async () => {
    try {
      setLoading(true);
      const token = getWizardToken();
      const wizardData = SessionWizardData.obtener();
      if (!token) {
        setTimeout(() => router.replace("/login"), 1000);
        setLoading(false);
        return;
      }

      const url = `${API_BASE_URL}/permisos-salida-dashboard/usuario/${
        secuencialUser || wizardData?.secuencial?.toString()
      }`;

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        setError(
          "El tiempo de sesión ha expirado. Serás redirigido al inicio."
        );
        setLoading(false);
        setTimeout(() => router.replace("/login"), 3000);
        return;
      }

      if (res.status === 404) {
        setPermisos([]);
        setFilteredPermisos([]);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Error al obtener permisos.");

      const data: PermisoSalida[] = await res.json();
      setPermisos(data);
      setFilteredPermisos(data);
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
      const url = `${API_BASE_URL}/permisos-salida-dashboard/${secuencial}/detalle`;
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
        setDetalleError("No existe detalle para este permiso.");
        setDetalle(null);
        setDetalleLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Error al obtener detalle.");

      const data: DetallePermiso = await res.json();
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
    if (secuencialUser) fetchPermisos();
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

  // Obtener valores únicos de estadoAdminNombre para el filtro
  const adminStateOptions = useMemo(() => {
    const states = new Set<string>();
    permisos.forEach(p => {
      if (p.estadoAdminNombre) states.add(p.estadoAdminNombre);
    });
    return Array.from(states).sort();
  }, [permisos]);

  // Filtrar por estadoAdminNombre y búsqueda
  useEffect(() => {
    let result = permisos;
    if (activeFilter !== "all") {
      result = result.filter((p) => p.estadoAdminNombre === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.codigo_tramite.toLowerCase().includes(q) ||
          p.destino.toLowerCase().includes(q) ||
          (p.estadoAdminNombre && p.estadoAdminNombre.toLowerCase().includes(q)) ||
          p.estado_pago.toLowerCase().includes(q)
      );
    }
    setFilteredPermisos(result);
  }, [searchQuery, permisos, activeFilter]);

  const requestSort = (key: keyof PermisoSalida) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending")
      direction = "descending";
    setSortConfig({ key, direction });
  };

  const sortedPermisos = useMemo(() => {
    if (!sortConfig) return filteredPermisos;
    return [...filteredPermisos].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredPermisos, sortConfig]);

  const total = permisos.length;
  const enRevisionIA = permisos.filter(p => p.estadoAdminNombre === "EN REVISIÓN POR IA").length;
  const expertoRevisando = permisos.filter(p => p.estadoAdminNombre === "EXPERTO REVISANDO").length;
  const enEjecucion = permisos.filter(p => p.estadoAdminNombre === "EN EJECUCIÓN").length;
  const terminados = permisos.filter(p => p.estadoAdminNombre === "TERMINADO").length;

  const handleRefresh = async () => {
    setLoading(true);
    await fetchPermisos();
    setLoading(false);
  };

  const [initialRedirectDone, setInitialRedirectDone] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !error && permisos.length === 0 && !initialRedirectDone) {
      setInitialRedirectDone(true);
      router.push("/Servicios/PermisoSalida/PermisoSalidaDiagnostico");
    }
  }, [loading, error, permisos, router, initialRedirectDone]);

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
                      Trámites legales
                    </p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      Permisos de salida del país
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                      Gestiona todos tus permisos de salida para menores. Revisa
                      el estado de cada trámite, accede a los detalles y realiza
                      el pago correspondiente.
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
                      className={
                        loading
                          ? "animate-spin text-slate-500"
                          : "text-slate-500"
                      }
                    />
                    Actualizar
                  </button>
                  <button
                    onClick={handleClick}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
                  >
                    <PlusCircle size={16} />
                    Nuevo permiso
                  </button>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <KpiCard
                  title="Total"
                  value={total}
                  percentage="Histórico"
                  icon={List}
                  tone="default"
                />
                <KpiCard
                  title="En revisión IA"
                  value={enRevisionIA}
                  percentage={total > 0 ? `${Math.round((enRevisionIA / total) * 100)}%` : "0%"}
                  icon={Clock}
                  tone="warning"
                />
                <KpiCard
                  title="Experto revisando"
                  value={expertoRevisando}
                  percentage={total > 0 ? `${Math.round((expertoRevisando / total) * 100)}%` : "0%"}
                  icon={Users}
                  tone="info"
                />
                <KpiCard
                  title="En ejecución"
                  value={enEjecucion}
                  percentage={total > 0 ? `${Math.round((enEjecucion / total) * 100)}%` : "0%"}
                  icon={Gauge}
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

            {/* Listado */}
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
                      Revisa el estado, detalle y acciones disponibles para cada
                      permiso.
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <div className="relative w-full sm:w-[200px]">
                      <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    <div className="relative w-full sm:w-[240px]">
                      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por código, destino, estado..."
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
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
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
              ) : sortedPermisos.length === 0 ? (
                <div className="p-6">
                  <EmptyState />
                </div>
              ) : isMobile ? (
                <div className="p-4">
                  {sortedPermisos.map((permiso) => (
                    <MobileServiceCard
                      key={permiso.secuencial}
                      permiso={permiso}
                      expandedRow={expandedRow}
                      setExpandedRow={setExpandedRow}
                      detalle={detalle}
                      detalleLoading={detalleLoading}
                      detalleError={detalleError}
                      onCompleteInfo={() => {
                        if (detalle) openCompleteDialog(permiso, detalle);
                      }}
                      onEditClick={handleOpenEdit}
					onGenerarMinuta={handleGenerarMinuta}
					generatingSecuencial={generatingMinuta}
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
                          className="w-32 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("codigo_tramite")}
                        >
                          <div className="flex items-center gap-1">
                            Código trámite
                            {sortConfig?.key === "codigo_tramite" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>
                        <th
                          className="w-40 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("destino")}
                        >
                          <div className="flex items-center gap-1">
                            Destino
                            {sortConfig?.key === "destino" &&
                              (sortConfig.direction === "ascending" ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ))}
                          </div>
                        </th>
                        <th
                          className="w-32 cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                          onClick={() => requestSort("fecha_salida")}
                        >
                          <div className="flex items-center gap-1">
                            Salida
                            {sortConfig?.key === "fecha_salida" &&
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
                            Estado pago
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
                      {sortedPermisos.map((permiso) => {
                        const isExpanded = expandedRow === permiso.secuencial;
                        return (
                          <React.Fragment key={permiso.secuencial}>
                            <motion.tr
                              whileHover={{ backgroundColor: "rgba(248,250,252,1)" }}
                              className="cursor-pointer"
                              onClick={() =>
                                setExpandedRow(isExpanded ? null : permiso.secuencial)
                              }
                            >
                              <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                #{permiso.secuencial}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                  {permiso.codigo_tramite}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-700">
                                <div className="flex items-center gap-2">
                                  <Plane className="h-4 w-4 text-slate-400" />
                                  {permiso.destino}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-700">
                                {new Date(permiso.fecha_salida).toLocaleDateString(
                                  "es-ES"
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <EstadoAdminBadge estado={permiso.estadoAdminNombre} />
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <PagoBadge estado={permiso.estado_pago} />
                              </td>
                              <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <button className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </td>
                            </motion.tr>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.tr
                                  key={`expanded-${permiso.secuencial}`}
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
                                      permiso={permiso}
                                      onCompleteInfo={() => {
                                        if (detalle) openCompleteDialog(permiso, detalle);
                                      }}
                                      onEditClick={handleOpenEdit}
                                      onGenerarMinuta={handleGenerarMinuta}
                                      generatingSecuencial={generatingMinuta}
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

      {/* Diálogo para completar información */}
      {showCompleteDialog && currentDetalle && currentPermiso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="p-6">
              <h2 className="mb-2 text-xl font-bold">Completar información</h2>
              <p className="mb-4 text-sm text-slate-600">
                Por favor completa los siguientes datos para que el trámite pueda
                ser validado.
              </p>
              <form onSubmit={handleSubmitComplete} className="space-y-4">
                {getMissingFields(currentDetalle).map((m, idx) => {
                  const key = `${m.section}_${
                    m.intervinienteId ? m.intervinienteId + "_" : ""
                  }${m.field}`;
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
                      {m.type === "date" && (
                        <input
                          type="date"
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

      {/* Diálogo de carga para la generación de la minuta legal */}
      {showMinutaDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Procesando tu minuta legal
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Nuestra IA está generando el documento y nuestro experto legal en línea lo está firmando electrónicamente...
            </p>
          </div>
        </div>
      )}
    </>
  );
}