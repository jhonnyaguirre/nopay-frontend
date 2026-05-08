"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Filter,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
 import {
  listarAdminCasos,
  obtenerAdminCasoDetalle,
  obtenerAdminCasosResumen,
  listarEstadosAdminCaso,
} from "../../../../lib/adminApi";

type TipoCaso = "TODOS" | "MULTA" | "MARCA" | "PERMISO_SALIDA";

type AdminCaso = {
  idCaso: number;
  tipoCaso: "MULTA" | "MARCA" | "PERMISO_SALIDA";
  codigoTramite: string;
  titulo: string;
  cliente: string;
  usuarioId: number;
  cedula: string;
  email: string;
  telefono: string;
  estadoTramite: string;
  estadoPago: string;
  fechaCreacion: string;
  resumenPrincipal: string;
  resumenSecundario: string;
  detalleCorto: string;
  abogadoAsignado: string;
  requiereRevisionManual?: boolean;
  listoParaPago?: boolean;
  listoParaGestion?: boolean;
  listoParaDocumento?: boolean;
};

type Resumen = {
  total: number;
  multas: number;
  marcas: number;
  permisos: number;
  pendientes: number;
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
  
  const normalizarTexto = (value: any) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
	

export default function AdminCasosPage() {
  const [casos, setCasos] = useState<AdminCaso[]>([]);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipo, setTipo] = useState<TipoCaso>("TODOS");
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<any | null>(null);
  const [estadosAdmin, setEstadosAdmin] = useState<any[]>([]);
  type AdminCaso = {
  idCaso: number;
  tipoCaso: "MULTA" | "MARCA" | "PERMISO_SALIDA";
  codigoTramite: string;
  titulo: string;
  cliente: string;
  usuarioId: number;
  cedula: string;
  email: string;
  telefono: string;
  estadoTramite: string;
  estadoAdminNombre: string;
  estadoPago: string;
  fechaCreacion: string;
  resumenPrincipal: string;
  resumenSecundario: string;
  detalleCorto: string;
  abogadoAsignado: string;
  requiereRevisionManual?: boolean;
  listoParaPago?: boolean;
  listoParaGestion?: boolean;
  listoParaDocumento?: boolean;
};
  const cargar = async () => {
    try {
      setLoading(true);
      setError("");

      const [lista, resumenData] = await Promise.all([
        listarAdminCasos({
		  tipo,
		  q,
		}),
        obtenerAdminCasosResumen(),
      ]);

      setCasos(lista.casos || []);
      setResumen(resumenData);
    } catch (err: any) {
      setError(err.message || "No se pudo cargar la bandeja de casos");
    } finally {
      setLoading(false);
    }
  };
  
  const cargarEstadosAdmin = async () => {
  try {
    const data = await listarEstadosAdminCaso();
    setEstadosAdmin(data);
  } catch (err) {
    console.error("Error cargando estados admin", err);
  }
};

  useEffect(() => {
    cargar();
	 
	cargarEstadosAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);



const casosFiltrados = useMemo(() => {
  const term = normalizarTexto(q);
  const estadoFiltro = normalizarTexto(estado);

  return casos.filter((c) => {
    const estadoCaso = normalizarTexto(
      c.estadoAdminNombre || c.estadoTramite || ""
    );

    const cumpleEstado =
      !estadoFiltro || estadoCaso === estadoFiltro;

    const cumpleBusqueda =
      !term ||
      normalizarTexto(
        [
          c.codigoTramite,
          c.titulo,
          c.cliente,
          c.cedula,
          c.email,
          c.telefono,
          c.estadoAdminNombre,
          c.estadoTramite,
          c.estadoPago,
          c.resumenPrincipal,
          c.resumenSecundario,
        ].join(" ")
      ).includes(term);

    return cumpleEstado && cumpleBusqueda;
  });
}, [casos, q, estado]);


  const abrirDetalle = async (caso: AdminCaso) => {
    const key = `${caso.tipoCaso}-${caso.idCaso}`;

    if (expandedKey === key) {
      setExpandedKey(null);
      setDetalle(null);
      return;
    }

    try {
      setExpandedKey(key);
      setDetalle(null);
      setDetalleLoading(true);

      const data = await obtenerAdminCasoDetalle(caso.tipoCaso, caso.idCaso);
      setDetalle(data);
    } catch (err: any) {
      setDetalle({
        error: err.message || "No se pudo obtener el detalle",
      });
    } finally {
      setDetalleLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#111827] via-[#7F1D1D] to-[#EC4899] p-7 text-white shadow-2xl shadow-pink-900/20">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/75">
              <ShieldCheck className="h-4 w-4" />
              Bandeja operativa
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Centro de casos NoPay
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
              Visualiza, filtra y revisa los eventos generados por usuarios:
              multas, registros de marca y permisos de salida del país.
            </p>
          </div>

          <button
            onClick={cargar}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Actualizar
          </button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          title="Total"
          value={resumen?.total ?? 0}
          icon={BriefcaseBusiness}
          tone="default"
        />
        <KpiCard
          title="Multas"
          value={resumen?.multas ?? 0}
          icon={FileText}
          tone="rose"
        />
        <KpiCard
          title="Marcas"
          value={resumen?.marcas ?? 0}
          icon={BadgeCheck}
          tone="amber"
        />
        <KpiCard
          title="Permisos"
          value={resumen?.permisos ?? 0}
          icon={ShieldCheck}
          tone="blue"
        />
        <KpiCard
          title="Pendientes"
          value={resumen?.pendientes ?? 0}
          icon={Clock3}
          tone="slate"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Bandeja centralizada
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {casosFiltrados.length} casos encontrados.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoCaso)}
                  className="h-12 min-w-[180px] appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                >
                  <option value="TODOS">Todos</option>
                  <option value="MULTA">Multas</option>
                  <option value="MARCA">Marcas</option>
                  <option value="PERMISO_SALIDA">Permisos</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
               <select
				  value={estado}
				  onChange={(e) => setEstado(e.target.value)}
				  className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-5 pr-10 text-sm font-black text-slate-700 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
				>
				  <option value="">Todos los estados</option>

				  {estadosAdmin.map((item) => (
					<option key={item.secuencial} value={item.nombre}>
					  {item.nombre}
					</option>
				  ))}
				</select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative md:w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") cargar();
                  }}
                  placeholder="Buscar cliente, cédula, placa, marca..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-9 w-9 animate-spin text-pink-500" />
          </div>
        ) : error ? (
          <div className="p-8">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        ) : casosFiltrados.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <h3 className="text-lg font-black text-slate-900">
              No se encontraron casos
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Ajusta los filtros o actualiza la bandeja.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {casosFiltrados.map((caso) => {
              const key = `${caso.tipoCaso}-${caso.idCaso}`;
              const open = expandedKey === key;

              return (
                <article key={key} className="bg-white">
                  <button
                    onClick={() =>
						  window.location.href = `/admin/casos/${caso.tipoCaso}/${caso.idCaso}`
						}
                    className="grid w-full grid-cols-1 gap-4 p-5 text-left transition hover:bg-slate-50 xl:grid-cols-[220px_1.4fr_1fr_180px_48px]"
                  >
                    <div>
                      <TipoBadge tipo={caso.tipoCaso} />
                      <p className="mt-3 text-sm font-black text-slate-950">
                        {caso.codigoTramite}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        #{caso.idCaso} · {formatDate(caso.fechaCreacion)}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-black text-slate-950">
                        {caso.titulo}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {caso.resumenPrincipal}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {caso.resumenSecundario}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {caso.cliente || "Cliente sin nombre"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {caso.cedula || "Sin cédula"} · {caso.email || "Sin email"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {caso.telefono || "Sin teléfono"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-start gap-2">
                      <EstadoAdminListBadge estado={caso.estadoAdminNombre} />
                      <PagoBadge estado={caso.estadoPago} />
                    </div>

                    <div className="flex items-center justify-end text-slate-400">
                      {open ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </button>

                  {open && (
                    <div className="border-t border-slate-200 bg-slate-50/70 p-5">
                      {detalleLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                        </div>
                      ) : detalle?.error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                          {detalle.error}
                        </div>
                      ) : (
                        <DetalleCaso tipo={caso.tipoCaso} detalle={detalle} />
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function EstadoAdminListBadge({ estado }: { estado: string }) {
  const e = String(estado || "").toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide",
        e.includes("IA") && "border-cyan-200 bg-cyan-50 text-cyan-700",
        e.includes("EXPERTO") && "border-purple-200 bg-purple-50 text-purple-700",
        e.includes("EJECUCIÓN") && "border-amber-200 bg-amber-50 text-amber-700",
        e.includes("TERMINADO") && "border-emerald-200 bg-emerald-50 text-emerald-700",
        !e && "border-slate-200 bg-slate-50 text-slate-600"
      )}
    >
      {estado || "EN REVISIÓN POR IA"}
    </span>
  );
}



function KpiCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "default" | "rose" | "amber" | "blue" | "slate";
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
          tone === "default" && "bg-slate-950 text-white",
          tone === "rose" && "bg-rose-50 text-rose-600",
          tone === "amber" && "bg-amber-50 text-amber-600",
          tone === "blue" && "bg-blue-50 text-blue-600",
          tone === "slate" && "bg-slate-100 text-slate-700"
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  const label =
    tipo === "MULTA"
      ? "Multa"
      : tipo === "MARCA"
      ? "Marca"
      : "Permiso";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide",
        tipo === "MULTA" && "bg-rose-50 text-rose-700",
        tipo === "MARCA" && "bg-amber-50 text-amber-700",
        tipo === "PERMISO_SALIDA" && "bg-blue-50 text-blue-700"
      )}
    >
      {label}
    </span>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const e = (estado || "").toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
        e.includes("pend") || e.includes("borrador")
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : e.includes("valid") || e.includes("aprob") || e.includes("listo")
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-700"
      )}
    >
      {estado || "Sin estado"}
    </span>
  );
}

function PagoBadge({ estado }: { estado: string }) {
  const e = (estado || "").toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold",
        e.includes("succeeded") || e.includes("pagado")
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-700"
      )}
    >
      <Wallet className="h-3 w-3" />
      {estado || "Pendiente"}
    </span>
  );
}

function DetalleCaso({ tipo, detalle }: { tipo: string; detalle: any }) {
  if (!detalle) return null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard title="Cliente">
          <Info label="Nombre" value={`${detalle.cliente?.nombres || ""} ${detalle.cliente?.apellidos || ""}`} />
          <Info label="Cédula" value={detalle.cliente?.cedula} />
          <Info label="Email" value={detalle.cliente?.email} />
          <Info label="Teléfono" value={detalle.cliente?.telefono} />
        </InfoCard>

        {tipo === "MULTA" && (
          <InfoCard title="Vehículo">
            <Info label="Placa" value={detalle.vehiculo?.placa} />
            <Info label="Marca" value={detalle.vehiculo?.marca} />
            <Info label="Modelo" value={detalle.vehiculo?.modelo} />
            <Info label="Color" value={detalle.vehiculo?.color} />
          </InfoCard>
        )}

        {tipo === "MARCA" && (
          <InfoCard title="Marca">
            <Info label="Nombre" value={detalle.nombre_marca} />
            <Info label="Tipo signo" value={detalle.tipo_signo} />
            <Info label="Actividad" value={detalle.actividad_economica} />
            <Info label="Score IA" value={detalle.score_confianza_ia} />
          </InfoCard>
        )}

        {tipo === "PERMISO_SALIDA" && (
          <InfoCard title="Viaje">
            <Info label="Destino" value={detalle.destino} />
            <Info label="Salida" value={detalle.fecha_salida} />
            <Info label="Retorno" value={detalle.fecha_retorno} />
            <Info label="Transporte" value={detalle.medio_transporte} />
          </InfoCard>
        )}

        <InfoCard title="Gestión">
          <Info label="Estado trámite" value={detalle.estado_tramite} />
          <Info label="Estado pago" value={detalle.estado_pago} />
          <Info label="Código" value={detalle.codigo_tramite} />
          <Info label="Fecha creación" value={detalle.fechacrea} />
        </InfoCard>
      </div>

      {tipo === "MULTA" && (
        <ArrayBlock title="Documentos / Citaciones" data={detalle.documentos || []} />
      )}

      {tipo === "MARCA" && (
        <>
          <ArrayBlock title="Clases" data={detalle.clases || []} />
          <ArrayBlock title="Titulares" data={detalle.titulares || []} />
          <ArrayBlock title="Contactos" data={detalle.contactos || []} />
          <ArrayBlock title="Documentos" data={detalle.documentos || []} />
          <ArrayBlock title="Historial" data={detalle.historial || []} />
        </>
      )}

      {tipo === "PERMISO_SALIDA" && (
        <>
          <ArrayBlock title="Intervinientes" data={detalle.intervinientes || []} />
          <ArrayBlock title="Contactos" data={detalle.contactos || []} />
        </>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 md:flex-row">
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
          <Mail className="h-4 w-4" />
          Responder / observar
        </button>

        <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
          Cambiar estado
        </button>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-bold text-slate-900">
        {String(value || "—")}
      </span>
    </div>
  );
}

function ArrayBlock({ title, data }: { title: string; data: any[] }) {
  if (!data.length) return null;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
        {title}
      </h3>

      <div className="grid gap-3 lg:grid-cols-2">
        {data.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-2 text-sm">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="text-slate-500">{key}</span>
                  <span className="max-w-[260px] truncate text-right font-semibold text-slate-900">
                    {String(value || "—")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "Sin fecha";

  try {
    return new Date(value).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return value;
  }
}