"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { exportarExpedientePDF } from "../../../../../../lib/adminPdfExport";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  FileText,
  ImageIcon,
  Loader2,
  Mail,
  MessageCircle,
  Pencil,
  RefreshCw,
  Save,
  ShieldCheck,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  obtenerAdminCasoDetalle,
  actualizarAdminCasoSeccion,
  listarEstadosAdminCaso,
} from "../../../../../../lib/adminApi";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type TabKey =
  | "resumen"
  | "datos"
  | "personas"
  | "documentos"
  | "historial"
  | "raw";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

type EstadoAdmin = {
  secuencial: number;
  nombre: string;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "resumen", label: "Resumen" },
  { key: "datos", label: "Datos del caso" },
  { key: "personas", label: "Personas" },
  { key: "documentos", label: "Documentos" },
  { key: "historial", label: "Historial" },
  { key: "raw", label: "Vista técnica" },
];


function EstadoAdminBadge({ estado }: { estado: string }) {
  const e = String(estado || "").toUpperCase();

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide shadow-sm backdrop-blur-sm",
        e.includes("IA") && "border-cyan-200/50 bg-cyan-100 text-cyan-800",
        e.includes("EXPERTO") && "border-purple-200/50 bg-purple-100 text-purple-800",
        e.includes("EJECUCIÓN") && "border-amber-200/50 bg-amber-100 text-amber-800",
        e.includes("TERMINADO") && "border-emerald-200/50 bg-emerald-100 text-emerald-800",
        !e && "border-white/20 bg-white/10 text-white"
      )}
    >
      {estado || "EN REVISIÓN POR IA"}
    </span>
  );
}



function EstadoAdminField({
  value,
  nombre,
  estados,
  editMode,
  onChange,
}: {
  value: any;
  nombre: string;
  estados: EstadoAdmin[];
  editMode: boolean;
  onChange: (value: number | "", nombre: string) => void;
}) {
  const siguiente = obtenerSiguienteEstadoAdmin(estados, value);

  if (!editMode) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Estado visible para seguimiento
        </p>

        <div className="mt-3">
          <EstadoAdminInline estado={nombre} />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Activa edición para cambiar manualmente o avanzar el estado operativo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
          Estado visible para seguimiento
        </span>

        <select
          value={value || ""}
          onChange={(e) => {
            const selected = estados.find(
              (x) => String(x.secuencial) === e.target.value
            );

            onChange(
              e.target.value ? Number(e.target.value) : "",
              selected?.nombre || ""
            );
          }}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
        >
          <option value="">Seleccione estado</option>
          {estados.map((estado) => (
            <option key={estado.secuencial} value={estado.secuencial}>
              {estado.nombre}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        disabled={!siguiente}
        onClick={() => {
          if (!siguiente) return;
          onChange(siguiente.secuencial, siguiente.nombre);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RefreshCw className="h-4 w-4" />
        {siguiente ? `Pasar a: ${siguiente.nombre}` : "No hay siguiente estado"}
      </button>

      <p className="text-xs leading-5 text-slate-500">
        Luego de cambiar el estado, pulsa <b>Guardar cambios</b>.
      </p>
    </div>
  );
}







function EstadoAdminInline({ estado }: { estado: string }) {
  const e = String(estado || "").toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide",
        e.includes("IA") && "bg-cyan-50 text-cyan-700",
        e.includes("EXPERTO") && "bg-purple-50 text-purple-700",
        e.includes("EJECUCIÓN") && "bg-amber-50 text-amber-700",
        e.includes("TERMINADO") && "bg-emerald-50 text-emerald-700",
        !e && "bg-slate-100 text-slate-700"
      )}
    >
      {estado || "EN REVISIÓN POR IA"}
    </span>
  );
}

function obtenerSiguienteEstadoAdmin(estados: EstadoAdmin[], value: any) {
  if (!estados || estados.length === 0) return null;

  const actual = Number(value || 0);

  if (!actual) {
    return estados[0];
  }

  const index = estados.findIndex((x) => Number(x.secuencial) === actual);

  if (index < 0) {
    return estados[0];
  }

  if (index >= estados.length - 1) {
    return null;
  }

  return estados[index + 1];
}



export default function AdminCasoDetallePage() {
  const router = useRouter();
  const params = useParams();
  
  

  
  
  const cargarEstadosAdmin = async () => {
  try {
    const data = await listarEstadosAdminCaso();
    setEstadosAdmin(data);
  } catch (err: any) {
    showToast("error", err.message || "No se pudieron cargar los estados");
  }
};

  const tipo = String(params?.tipo || "");
  const id = Number(params?.id || 0);

  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<any | null>(null);
  const [formData, setFormData] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("resumen");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [estadosAdmin, setEstadosAdmin] = useState<EstadoAdmin[]>([]);

  const isDirty = useMemo(() => {
    if (!editMode || !detalle || !formData) return false;
    return JSON.stringify(detalle) !== JSON.stringify(formData);
  }, [detalle, formData, editMode]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const idToast = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id: idToast, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== idToast));
    }, 4200);
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await obtenerAdminCasoDetalle(tipo, id);
      setDetalle(data);
      setFormData(JSON.parse(JSON.stringify(data)));
    } catch (err: any) {
      setError(err.message || "No se pudo cargar el expediente");
      showToast("error", err.message || "Error al cargar el expediente");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
  if (tipo && id) {
    cargar();
    cargarEstadosAdmin();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [tipo, id]);

  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        if (editMode && isDirty && !saving) {
          e.preventDefault();
          handleGuardarCambios();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, isDirty, saving, formData, detalle, activeTab]);

  const dataView = formData || detalle || {};
  const cliente = dataView?.cliente || {};

  const updateField = (path: Array<string | number>, value: any) => {
    setFormData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      let ref = copy;

      for (let i = 0; i < path.length - 1; i++) {
        if (ref[path[i]] === undefined || ref[path[i]] === null) {
          ref[path[i]] = typeof path[i + 1] === "number" ? [] : {};
        }

        ref = ref[path[i]];
      }

      ref[path[path.length - 1]] = value;
      return copy;
    });
  };

  const handleCancelarEdicion = () => {
    if (isDirty) {
      const confirmar = confirm(
        "Tienes cambios sin guardar. ¿Deseas descartarlos?"
      );

      if (!confirmar) return;
    }

    setFormData(JSON.parse(JSON.stringify(detalle || {})));
    setEditMode(false);
    showToast("info", "Edición cancelada");
  };

  const guardarRegistros = async (seccion: string, registros: any[]) => {
    const registrosValidos = registrosActualizables(registros);

    if (registrosValidos.length === 0) return;

    await actualizarAdminCasoSeccion({
      tipo,
      id,
      seccion,
      payload: { registros: registrosValidos },
    });
  };

  const guardarCampos = async (seccion: string, campos: any) => {
    const camposLimpios = limpiarObjetoPlano(campos);

    if (Object.keys(camposLimpios).length === 0) return;

    await actualizarAdminCasoSeccion({
      tipo,
      id,
      seccion,
      payload: { campos: camposLimpios },
    });
  };

  const handleGuardarCambios = async () => {
    if (!formData) return;

    try {
      setSaving(true);

      const tipoNormalizado = String(tipo).toUpperCase();

      if (activeTab === "resumen" || activeTab === "datos") {
        if (tipoNormalizado === "MULTA") {
          await actualizarAdminCasoSeccion({
            tipo,
            id,
            seccion: "cabecera",
            payload: {
              campos: {
				  numero_citacion: formData.codigo_tramite || "",
				  fecha_citacion: formData.fecha_citacion || "",
				  observacion: formData.observacion_cabecera || "",
				  secuencial_estado_admin:
					formData.secuencial_estado_admin === "" ||
					formData.secuencial_estado_admin === null ||
					formData.secuencial_estado_admin === undefined
					  ? null
					  : Number(formData.secuencial_estado_admin),
				},
            },
          });

          if (formData.vehiculo) {
            await guardarCampos("vehiculo", formData.vehiculo);
          }
        } else {
          await guardarCampos("cabecera", formData);
        }
      }

      if (activeTab === "personas") {
        if (formData.cliente) {
          await guardarCampos("cliente", formData.cliente);
        }

        if (
          tipoNormalizado === "PERMISO_SALIDA" ||
          tipoNormalizado === "PERMISO"
        ) {
          if (Array.isArray(formData.intervinientes)) {
            await guardarRegistros("intervinientes", formData.intervinientes);
          }

          if (Array.isArray(formData.contactos)) {
            await guardarRegistros("contactos", formData.contactos);
          }
        }

        if (tipoNormalizado === "MARCA") {
          if (Array.isArray(formData.titulares)) {
            await guardarRegistros("titulares", formData.titulares);
          }

          if (Array.isArray(formData.contactos)) {
            await guardarRegistros("contactos", formData.contactos);
          }
        }
      }

      if (activeTab === "documentos") {
        if (tipoNormalizado === "MULTA" && Array.isArray(formData.documentos)) {
          await guardarRegistros("detalle", formData.documentos);
        }

        if (tipoNormalizado === "MARCA" && Array.isArray(formData.documentos)) {
          await guardarRegistros("documentos", formData.documentos);
        }
      }

      await cargar();
      setEditMode(false);
      showToast("success", "Cambios guardados correctamente");
    } catch (err: any) {
      showToast("error", err.message || "No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleExportarPDF = async () => {
    if (!detalle) return;

    try {
      setExportingPdf(true);

      await exportarExpedientePDF({
        detalle: formData || detalle,
        tipo,
        id,
      });

      showToast("success", "PDF exportado correctamente");
    } catch (err: any) {
      showToast("error", err.message || "No se pudo exportar el expediente PDF");
    } finally {
      setExportingPdf(false);
    }
  };

  const telefonoWhatsapp = useMemo(() => {
    const raw = String(cliente?.telefono || cliente?.celular || "").replace(
      /\D/g,
      ""
    );

    if (!raw) return "";
    if (raw.startsWith("593")) return raw;
    if (raw.startsWith("0")) return `593${raw.substring(1)}`;
    if (raw.length === 9) return `593${raw}`;

    return raw;
  }, [cliente]);

  const whatsappUrl = telefonoWhatsapp
    ? `https://wa.me/${telefonoWhatsapp}?text=${encodeURIComponent(
        `Hola ${cliente?.nombres || ""}, te contactamos desde NoPay respecto a tu caso ${
          dataView?.codigo_tramite || ""
        }.`
      )}`
    : "";

  const mailUrl = cliente?.email
    ? `mailto:${cliente.email}?subject=${encodeURIComponent(
        `Seguimiento caso NoPay ${dataView?.codigo_tramite || ""}`
      )}`
    : "";

  if (loading) return <LoadingSkeleton />;

  if (error || !detalle) {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
        <AlertCircle className="mb-4 h-10 w-10" />
        <p className="text-xl font-black">No se pudo cargar el expediente</p>
        <p className="mt-2 text-sm">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-6 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-md transition hover:bg-red-700"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7 px-1 pb-10">
      <ToastContainer toasts={toasts} />

      <section className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-[#0F172A] via-[#7F1D1D] to-[#EC4899] p-6 text-white shadow-2xl shadow-pink-900/20 md:p-7">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-400/25 blur-3xl" />
        <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
          <div className="min-w-0">
            <button
              onClick={() => router.push("/admin/casos")}
              className="group mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/85 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              Volver a casos
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <TipoBadge tipo={dataView.tipoCaso || tipo} />
              <EstadoBadge estado={dataView.estado_tramite} />
				<PagoBadge estado={dataView.estado_pago} />
				<EstadoAdminBadge estado={dataView.estado_admin_nombre} />

              {editMode && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-pink-700 shadow-sm">
                  Modo edición
                </span>
              )}

              {editMode && isDirty && (
                <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-950 shadow-sm">
                  Cambios sin guardar
                </span>
              )}
            </div>

            <h1 className="mt-5 max-w-5xl break-words text-3xl font-black leading-[0.98] tracking-tight drop-shadow-sm md:text-4xl xl:text-5xl">
              {tituloExpediente(dataView, tipo)}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
              Expediente digital completo para revisión, seguimiento,
              comunicación con cliente, edición administrativa y generación PDF.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <ActionButton
              icon={MessageCircle}
              label="WhatsApp"
              disabled={!whatsappUrl}
              onClick={() => window.open(whatsappUrl, "_blank")}
              tooltip="Abrir conversación en WhatsApp"
            />
            <ActionButton
              icon={Mail}
              label="Email"
              disabled={!mailUrl}
              onClick={() => window.open(mailUrl, "_blank")}
              tooltip="Redactar correo electrónico"
            />
            <ActionButton
              icon={RefreshCw}
              label="Actualizar"
              onClick={cargar}
              tooltip="Recargar datos del servidor"
            />
            <ActionButton
              icon={exportingPdf ? Loader2 : Download}
              label={exportingPdf ? "Generando..." : "Exportar PDF"}
              disabled={exportingPdf}
              onClick={handleExportarPDF}
              tooltip="Generar expediente PDF"
            />
            <ActionButton
              icon={editMode ? X : Pencil}
              label={editMode ? "Cancelar" : "Editar expediente"}
              onClick={editMode ? handleCancelarEdicion : () => setEditMode(true)}
              tooltip={editMode ? "Descartar cambios" : "Activar modo edición"}
              className="sm:col-span-2 xl:col-span-1 2xl:col-span-2"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[390px_minmax(0,1fr)]">
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <InfoPanel title="Cliente" icon={User}>
            <Info
              label="Nombre"
              value={`${cliente.nombres || ""} ${cliente.apellidos || ""}`}
            />
            <Info label="Cédula" value={cliente.cedula} />
            <Info label="Email" value={cliente.email} copy />
            <Info
              label="Teléfono"
              value={cliente.telefono || cliente.celular}
              copy
            />

            {whatsappUrl && (
              <button
                onClick={() => window.open(whatsappUrl, "_blank")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                Contactar por WhatsApp
              </button>
            )}
          </InfoPanel>

          <InfoPanel title="Caso" icon={ShieldCheck}>
            <Info label="Código" value={dataView.codigo_tramite} copy />
            <Info label="Tipo" value={dataView.tipoCaso || tipo} />
            <Info label="Estado trámite" value={dataView.estado_tramite} />
			<Info label="Estado admin" value={dataView.estado_admin_nombre} />
            <Info label="Estado pago" value={dataView.estado_pago} />
            <Info
              label="Fecha creación"
              value={dataView.fechacrea || dataView.fecha_registro}
            />
          </InfoPanel>

          <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Acciones del expediente
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={handleGuardarCambios}
                disabled={!editMode || !isDirty || saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-45"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  showToast("info", "Función en desarrollo: enviar observación")
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Mail className="h-4 w-4" />
                Enviar observación
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
              {editMode ? (
                isDirty ? (
                  <span>
                    Hay cambios pendientes. Puedes guardar con{" "}
                    <b className="text-slate-800">Ctrl + S</b>.
                  </span>
                ) : (
                  <span>Modo edición activo. Aún no hay cambios pendientes.</span>
                )
              ) : (
                <span>Activa edición para modificar datos del expediente.</span>
              )}
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-md">
            <div className="border-b border-slate-200 bg-slate-50/70 px-3 py-3">
              <div className="flex min-w-0 flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm font-black transition",
                      activeTab === tab.key
                        ? "bg-slate-950 text-white shadow-md"
                        : "text-slate-500 hover:bg-white hover:text-slate-950"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 md:p-6 lg:p-7">
              {activeTab === "resumen" && (
                <ResumenTab
				  detalle={dataView}
				  tipo={tipo}
				  editMode={editMode}
				  updateField={updateField}
				  estadosAdmin={estadosAdmin}
				/>
              )}

              {activeTab === "datos" && (
                <DatosTab
                  detalle={dataView}
                  editMode={editMode}
                  updateField={updateField}
                />
              )}

              {activeTab === "personas" && (
                <PersonasTab
                  detalle={dataView}
                  editMode={editMode}
                  updateField={updateField}
                />
              )}

              {activeTab === "documentos" && (
                <DocumentosTab
                  detalle={dataView}
                  tipo={tipo}
                  editMode={editMode}
                  updateField={updateField}
                />
              )}

              {activeTab === "historial" && <HistorialTab detalle={dataView} />}

              {activeTab === "raw" && <RawTab detalle={dataView} />}
			  
			  
			  

            </div>
          </div>
        </main>
      </section>
    </div>
  );
}




function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 rounded-2xl px-5 py-4 text-sm font-bold shadow-2xl backdrop-blur-md",
            toast.type === "success" && "bg-emerald-600 text-white",
            toast.type === "error" && "bg-red-600 text-white",
            toast.type === "info" && "bg-blue-600 text-white"
          )}
        >
          {toast.type === "success" && (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          {toast.type === "info" && (
            <RefreshCw className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7 px-1 pb-10">
      <div className="h-64 animate-pulse rounded-[2rem] bg-slate-200" />
      <div className="grid gap-7 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="h-72 animate-pulse rounded-[1.7rem] bg-slate-100" />
          <div className="h-56 animate-pulse rounded-[1.7rem] bg-slate-100" />
        </div>
        <div className="h-[520px] animate-pulse rounded-[2rem] bg-slate-100" />
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  tooltip,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          label.includes("Generando") && "animate-spin"
        )}
      />
      <span className="truncate">{label}</span>
    </button>
  );
}

function InfoPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({
  label,
  value,
  copy,
}: {
  label: string;
  value: any;
  copy?: boolean;
}) {
  const text = String(value || "—");

  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-b border-slate-100 pb-3 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="flex min-w-0 items-start justify-end gap-2 text-right font-bold text-slate-900">
        <span className="min-w-0 break-words">{text}</span>
        {copy && value && (
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="mt-0.5 shrink-0 text-slate-400 transition hover:text-slate-900"
            title="Copiar"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: any;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="mb-4 h-6 w-6 text-pink-600" />
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 break-words text-2xl font-black leading-tight text-slate-950">
        {String(value || "—")}
      </p>
    </div>
  );
}

function EditableCard({
  title,
  editMode,
  children,
}: {
  title: string;
  editMode: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          {title}
        </h3>

        {editMode && (
          <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
            Editable
          </span>
        )}
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SmartField({
  label,
  value,
  type,
  editMode,
  onChange,
}: {
  label: string;
  value: any;
  type: "text" | "textarea" | "date" | "datetime" | "number" | "boolean";
  editMode: boolean;
  onChange?: (value: any) => void;
}) {
  if (!editMode) {
    return <Info label={label} value={formatValue(value, type)} />;
  }

  if (type === "textarea") {
    return (
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <textarea
          value={String(value || "")}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
        />
      </label>
    );
  }

  if (type === "boolean") {
    return (
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50">
        <span className="text-sm font-bold text-slate-600">{label}</span>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange?.(e.target.checked)}
          className="h-5 w-5 shrink-0 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        type={type === "datetime" ? "datetime-local" : type}
        value={inputValue(value, type)}
        onChange={(e) => {
          if (type === "number") {
            onChange?.(e.target.value === "" ? "" : Number(e.target.value));
          } else {
            onChange?.(e.target.value);
          }
        }}
        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
      />
    </label>
  );
}

function ResumenTab({
  detalle,
  tipo,
  editMode,
  updateField,
  estadosAdmin,
}: {
  detalle: any;
  tipo: string;
  editMode: boolean;
  updateField: (path: Array<string | number>, value: any) => void;
  estadosAdmin: EstadoAdmin[];
}) {
  const tipoNormalizado = String(tipo).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          label="Estado"
          value={detalle.estado_tramite || "—"}
          icon={CheckCircle2}
        />
        <MetricCard
          label="Pago"
          value={detalle.estado_pago || "Pendiente"}
          icon={Wallet}
        />
        <MetricCard
          label="Código"
          value={detalle.codigo_tramite || "—"}
          icon={FileText}
        />
      </div>
	  
	  <EditableCard title="Estado operativo NoPay" editMode={editMode}>
				  <EstadoAdminField
					value={detalle.secuencial_estado_admin}
					nombre={detalle.estado_admin_nombre}
					estados={estadosAdmin}
					editMode={editMode}
					onChange={(value, nombre) => {
					  updateField(["secuencial_estado_admin"], value);
					  updateField(["estado_admin_nombre"], nombre);
					}}
				  />
				</EditableCard>
				

      {tipoNormalizado === "MULTA" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <EditableCard title="Datos de multa" editMode={editMode}>
            <SmartField
              label="Número citación"
              value={detalle.codigo_tramite}
              type="text"
              editMode={editMode}
              onChange={(v) => updateField(["codigo_tramite"], v)}
            />
            <SmartField
              label="Fecha citación"
              value={detalle.fecha_citacion}
              type="date"
              editMode={editMode}
              onChange={(v) => updateField(["fecha_citacion"], v)}
            />
            <SmartField
              label="Observación"
              value={detalle.observacion_cabecera}
              type="textarea"
              editMode={editMode}
              onChange={(v) => updateField(["observacion_cabecera"], v)}
            />
          </EditableCard>

          <EditableCard title="Vehículo" editMode={editMode}>
            <SmartField
              label="Placa"
              value={detalle.vehiculo?.placa}
              type="text"
              editMode={editMode}
              onChange={(v) => updateField(["vehiculo", "placa"], v)}
            />
            <SmartField
              label="Marca"
              value={detalle.vehiculo?.marca}
              type="text"
              editMode={editMode}
              onChange={(v) => updateField(["vehiculo", "marca"], v)}
            />
            <SmartField
              label="Modelo"
              value={detalle.vehiculo?.modelo}
              type="text"
              editMode={editMode}
              onChange={(v) => updateField(["vehiculo", "modelo"], v)}
            />
            <SmartField
              label="Color"
              value={detalle.vehiculo?.color}
              type="text"
              editMode={editMode}
              onChange={(v) => updateField(["vehiculo", "color"], v)}
            />
          </EditableCard>
        </div>
      )}

      {tipoNormalizado === "MARCA" && (
        <EditableCard title="Resumen de marca" editMode={editMode}>
          <SmartField
            label="Nombre marca"
            value={detalle.nombre_marca}
            type="text"
            editMode={editMode}
            onChange={(v) => updateField(["nombre_marca"], v)}
          />
          <SmartField
            label="Tipo signo"
            value={detalle.tipo_signo}
            type="text"
            editMode={editMode}
            onChange={(v) => updateField(["tipo_signo"], v)}
          />
          <SmartField
            label="Actividad económica"
            value={detalle.actividad_economica}
            type="text"
            editMode={editMode}
            onChange={(v) => updateField(["actividad_economica"], v)}
          />
          <SmartField
            label="Diagnóstico IA"
            value={detalle.explicacion_diagnostico}
            type="textarea"
            editMode={editMode}
            onChange={(v) => updateField(["explicacion_diagnostico"], v)}
          />
          <SmartField
            label="Recomendación IA"
            value={detalle.recomendacion_ia}
            type="textarea"
            editMode={editMode}
            onChange={(v) => updateField(["recomendacion_ia"], v)}
          />
        </EditableCard>
      )}

      {(tipoNormalizado === "PERMISO_SALIDA" ||
        tipoNormalizado === "PERMISO") && (
        <EditableCard title="Resumen de permiso" editMode={editMode}>
          <SmartField
            label="País destino"
            value={detalle.pais_destino_nombre}
            type="text"
            editMode={editMode}
            onChange={(v) => updateField(["pais_destino_nombre"], v)}
          />
          <SmartField
            label="Ciudad destino"
            value={detalle.ciudad_destino}
            type="text"
            editMode={editMode}
            onChange={(v) => updateField(["ciudad_destino"], v)}
          />
          <SmartField
            label="Fecha salida"
            value={detalle.fecha_salida}
            type="date"
            editMode={editMode}
            onChange={(v) => updateField(["fecha_salida"], v)}
          />
          <SmartField
            label="Fecha retorno"
            value={detalle.fecha_retorno}
            type="date"
            editMode={editMode}
            onChange={(v) => updateField(["fecha_retorno"], v)}
          />
          <SmartField
            label="Motivo viaje"
            value={detalle.motivo_viaje}
            type="text"
            editMode={editMode}
            onChange={(v) => updateField(["motivo_viaje"], v)}
          />
          <SmartField
            label="Observación legal"
            value={detalle.observacion_validacion_legal}
            type="textarea"
            editMode={editMode}
            onChange={(v) => updateField(["observacion_validacion_legal"], v)}
          />
        </EditableCard>
      )}
    </div>
  );
}

function DatosTab({
  detalle,
  editMode,
  updateField,
}: {
  detalle: any;
  editMode: boolean;
  updateField: (path: Array<string | number>, value: any) => void;
}) {
  const hidden = new Set([
    "cliente",
    "vehiculo",
    "documentos",
    "clases",
    "titulares",
    "contactos",
    "historial",
    "intervinientes",
  ]);

  const fields = Object.entries(detalle || {}).filter(
    ([key]) => !hidden.has(key)
  );

  return (
    <EditableCard title="Todos los campos principales" editMode={editMode}>
      <div className="grid gap-5 lg:grid-cols-2">
        {fields.map(([key, value]) => (
          <SmartField
            key={key}
            label={humanize(key)}
            value={value}
            type={detectType(key, value)}
            editMode={editMode}
            onChange={(v) => updateField([key], v)}
          />
        ))}
      </div>
    </EditableCard>
  );
}

function PersonasTab({
  detalle,
  editMode,
  updateField,
}: {
  detalle: any;
  editMode: boolean;
  updateField: (path: Array<string | number>, value: any) => void;
}) {
  const grupos = [
    {
      title: "Cliente",
      key: "cliente",
      data: detalle.cliente ? [detalle.cliente] : [],
      isObject: true,
    },
    {
      title: "Intervinientes",
      key: "intervinientes",
      data: detalle.intervinientes || [],
      isObject: false,
    },
    {
      title: "Titulares",
      key: "titulares",
      data: detalle.titulares || [],
      isObject: false,
    },
    {
      title: "Contactos",
      key: "contactos",
      data: detalle.contactos || [],
      isObject: false,
    },
  ];

  return (
    <div className="space-y-6">
      {grupos.map((g) => (
        <ArrayEditableSection
          key={g.title}
          title={g.title}
          data={g.data}
          editMode={editMode}
          onChange={(rowIndex, field, value) => {
            if (g.isObject) {
              updateField([g.key, field], value);
            } else {
              updateField([g.key, rowIndex, field], value);
            }
          }}
        />
      ))}
    </div>
  );
}

function DocumentosTab({
  detalle,
  tipo,
  editMode,
  updateField,
}: {
  detalle: any;
  tipo: string;
  editMode: boolean;
  updateField: (path: Array<string | number>, value: any) => void;
}) {
  const documentos = detalle.documentos || [];

  if (!documentos.length) {
    return (
      <EmptyBox
        icon={FileText}
        title="Sin documentos registrados"
        text="Este expediente aún no tiene documentos asociados."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {documentos.map((doc: any, index: number) => {
        const url = buildDocumentoUrl(doc, tipo);
        const isImage = String(doc.mime_type || "").startsWith("image/");

        return (
          <div
            key={index}
            className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex h-64 items-center justify-center bg-slate-100">
              {url && isImage ? (
                <img
                  src={url}
                  alt={doc.nombre_original || "Documento"}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  {isImage ? (
                    <ImageIcon className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                  ) : (
                    <FileText className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                  )}
                  <p className="text-sm font-bold text-slate-600">
                    Vista previa no disponible
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 p-5">
              <p className="break-words font-black text-slate-950">
                {doc.nombre_original ||
                  doc.nombre_archivo ||
                  `Documento ${index + 1}`}
              </p>

              <SmartField
                label="Tipo"
                value={doc.tipo_documento}
                type="text"
                editMode={editMode}
                onChange={(v) =>
                  updateField(["documentos", index, "tipo_documento"], v)
                }
              />

              <SmartField
                label="Observación"
                value={doc.observaciones || doc.observacion}
                type="textarea"
                editMode={editMode}
                onChange={(v) => {
                  if ("observaciones" in doc) {
                    updateField(["documentos", index, "observaciones"], v);
                  } else {
                    updateField(["documentos", index, "observacion"], v);
                  }
                }}
              />

              <Info label="MIME" value={doc.mime_type} />
              <Info label="Ruta" value={doc.ruta_archivo} />
              <Info label="Agencia" value={doc.agencia} />

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  disabled={!url}
                  onClick={() => url && window.open(url, "_blank")}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </button>

                <button
                  disabled={!url}
                  onClick={() => {
                    if (!url) return;

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = doc.nombre_original || "documento";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HistorialTab({ detalle }: { detalle: any }) {
  const historial = detalle.historial || [];

  if (!historial.length) {
    return (
      <EmptyBox
        icon={CalendarDays}
        title="Sin historial registrado"
        text="Aún no existe historial operativo para este caso."
      />
    );
  }

  return (
    <div className="space-y-5">
      {historial.map((h: any, i: number) => (
        <div
          key={i}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="font-black text-slate-950">
            {h.tipo_evento || `Evento ${i + 1}`}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {h.descripcion_evento || h.observacion || "Sin descripción"}
          </p>
          <p className="mt-3 text-xs font-semibold text-slate-400">
            {h.fechacrea || "Sin fecha"} · {h.usuariocrea || "Sistema"}
          </p>
        </div>
      ))}
    </div>
  );
}

function RawTab({ detalle }: { detalle: any }) {
  return (
    <pre className="max-h-[700px] overflow-auto rounded-[1.5rem] bg-slate-950 p-5 text-xs leading-relaxed text-slate-100">
      {JSON.stringify(detalle, null, 2)}
    </pre>
  );
}

function ArrayEditableSection({
  title,
  data,
  editMode,
  onChange,
}: {
  title: string;
  data: any[];
  editMode: boolean;
  onChange?: (rowIndex: number, field: string, value: any) => void;
}) {
  if (!data?.length) {
    return (
      <EmptyBox
        icon={Users}
        title={`${title}: sin registros`}
        text="No existen datos en esta sección."
      />
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {title}
      </h3>

      <div className="space-y-5">
        {data.map((row, idx) => (
          <div
            key={idx}
            className="rounded-[1.3rem] border border-slate-200 bg-slate-50/60 p-5"
          >
            <p className="mb-4 font-black text-slate-950">
              Registro {idx + 1}
            </p>

            <div className="grid gap-5 lg:grid-cols-2">
              {Object.entries(row).map(([key, value]) => (
                <SmartField
                  key={key}
                  label={humanize(key)}
                  value={value}
                  type={detectType(key, value)}
                  editMode={editMode && key !== "secuencial"}
                  onChange={(v) => onChange?.(idx, key, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyBox({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
      <Icon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  const t = String(tipo || "").toUpperCase();

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide shadow-sm",
        t.includes("MULTA") && "bg-rose-100 text-rose-800",
        t.includes("MARCA") && "bg-amber-100 text-amber-800",
        t.includes("PERMISO") && "bg-blue-100 text-blue-800"
      )}
    >
      {t.includes("MULTA") ? "Multa" : t.includes("MARCA") ? "Marca" : "Permiso"}
    </span>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white backdrop-blur-sm shadow-sm">
      {estado || "Sin estado"}
    </span>
  );
}

function PagoBadge({ estado }: { estado: string }) {
  return (
    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white backdrop-blur-sm shadow-sm">
      {estado || "Pago pendiente"}
    </span>
  );
}

function limpiarObjetoPlano(obj: any) {
  const out: any = {};

  Object.entries(obj || {}).forEach(([key, value]) => {
    if (
      [
        "secuencial",
        "uid",
        "fechacrea",
        "usuariocrea",
        "fechamodifica",
        "usuariomodifica",
        "hash_documento",
        "transaccion_id",
        "tipoCaso",
        "destino",
        "datos_crudos_fuente",
        "representa_a",
        "fuente_maestra",
        "secuencial_persona_maestra",
        "fecha_consulta_fuente",
      ].includes(key)
    ) {
      return;
    }

    if (Array.isArray(value)) return;
    if (value && typeof value === "object") return;

    out[key] = value;
  });

  return out;
}

function registrosActualizables(arr: any[]) {
  return (arr || [])
    .filter((x) => Number(x.secuencial) > 0)
    .map((x) => ({
      secuencial: Number(x.secuencial),
      campos: limpiarObjetoPlano(x),
    }))
    .filter((x) => Object.keys(x.campos || {}).length > 0);
}

function buildDocumentoUrl(doc: any, tipo: string) {
  const ruta = String(doc?.ruta_archivo || "");

  if (!ruta) return "";
  if (ruta.startsWith("http")) return ruta;

  if (String(tipo).toUpperCase().includes("MULTA")) {
    const filename = ruta.split("/").pop();
    return filename ? `${API_BASE}/regmultas/download/${filename}` : "";
  }

  return "";
}

function tituloExpediente(detalle: any, tipo: string) {
  const t = String(tipo || detalle?.tipoCaso || "").toUpperCase();

  if (t.includes("MULTA")) {
    return `Expediente de multa ${
      detalle?.vehiculo?.placa || detalle?.codigo_tramite || ""
    }`;
  }

  if (t.includes("MARCA")) {
    return `Expediente de marca ${
      detalle?.nombre_marca || detalle?.codigo_tramite || ""
    }`;
  }

  return `Expediente permiso de salida ${detalle?.codigo_tramite || ""}`;
}

function detectType(
  key: string,
  value: any
): "text" | "textarea" | "date" | "datetime" | "number" | "boolean" {
  const k = key.toLowerCase();

  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (k.includes("fecha") && String(value || "").includes(":")) {
    return "datetime";
  }
  if (k.includes("fecha")) return "date";

  if (
    k.includes("observacion") ||
    k.includes("descripcion") ||
    k.includes("explicacion") ||
    k.includes("recomendacion") ||
    k.includes("documento_generado") ||
    String(value || "").length > 120
  ) {
    return "textarea";
  }

  return "text";
}

function inputValue(value: any, type: string) {
  if (!value) return "";

  const raw = String(value);

  if (type === "date") return raw.substring(0, 10);

  if (type === "datetime") {
    return raw.substring(0, 16).replace(" ", "T");
  }

  return raw;
}

function formatValue(value: any, type: string) {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "boolean") return value ? "Sí" : "No";
  return String(value);
}

function humanize(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

