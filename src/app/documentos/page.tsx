"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileCheck2,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileDigit,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Check,
} from "lucide-react";
import { getWizardToken } from "lib/seguridad/sessionUtils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { API_BASE_URL } from "config/apiConfig";
import router from "next/router";

interface ServicioDocumentoAPI {
  secuencial: number;
  secuencialDocumento: number;
  nombreDocumento: string;
  descripcionDocumento: string;
  lado: string;
}

interface DocumentoCargado {
  secuencial_documento: number;
  ruta_archivo: string;
  nombre_archivo: string;
  lado?: string;
  fecha_carga?: string;
  id_unico: string;
}

interface DocumentoRequerido {
  secuencial: number;
  nombre: string;
  descripcion: string;
  lados: string[];
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function SummaryMiniCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "success" | "info";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        tone === "default" && "border-slate-200 bg-white",
        tone === "success" && "border-emerald-200 bg-emerald-50/70",
        tone === "info" && "border-cyan-200 bg-cyan-50/70"
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.18em]",
          tone === "default" && "text-slate-500",
          tone === "success" && "text-emerald-700",
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
    <div className="rounded-[26px] border border-amber-200 bg-amber-50/80 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
        <AlertCircle className="h-8 w-8 text-amber-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        No se encontraron documentos requeridos
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Verifica la configuración del servicio o inténtalo nuevamente.
      </p>
    </div>
  );
}

export default function CargaDocumentosServicio() {
  const [documentosRequeridos, setDocumentosRequeridos] = useState<DocumentoRequerido[]>([]);
  const [documentosCargados, setDocumentosCargados] = useState<DocumentoCargado[]>([]);
  const [loading, setLoading] = useState(false);
  const [secuencialUsuario, setSecuencialUsuario] = useState<number | null>(null);
  const [wizardData, setWizardData] = useState<any>(null);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const idServicio = 1;
  const [todosCompletos, setTodosCompletos] = useState<boolean>(false);

  const [isDragging, setIsDragging] = useState(false);
  const [activeDoc, setActiveDoc] = useState<number | null>(null);
  const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);

  useEffect(() => {
    const data = SessionWizardData.obtener();
    setWizardData(data);
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        toast.info("La carga puede tardar unos segundos...");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const usuario = SessionWizardData.obtener();
    if (usuario?.secuencial) {
      setSecuencialUsuario(usuario.secuencial);
    }
  }, []);

  useEffect(() => {
    const token = getWizardToken();
    if (!token || !secuencialUsuario) return;

    const fetchData = async () => {
      setLoadingDocs(true);
      try {
        const urlServicio = `${API_BASE_URL}/servicio-documentos/${idServicio}`;
        const req = await fetch(urlServicio, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (req.status === 403) throw new Error("SESION_EXPIRED");

        const parsedDocs: ServicioDocumentoAPI[] = await req.json();

        const agrupados: Record<string, DocumentoRequerido> = {};
        for (const item of parsedDocs) {
          const key = item.secuencialDocumento.toString();
          if (!agrupados[key]) {
            agrupados[key] = {
              secuencial: item.secuencialDocumento,
              nombre: item.nombreDocumento,
              descripcion: item.descripcionDocumento,
              lados: item.lado ? [item.lado] : [],
            };
          } else if (item.lado && !agrupados[key].lados.includes(item.lado)) {
            agrupados[key].lados.push(item.lado);
          }
        }

        setDocumentosRequeridos(Object.values(agrupados));

        const urlCargados = `${API_BASE_URL}/usuario-documentos/usuario/${secuencialUsuario}`;
        const res = await fetch(urlCargados, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 403) throw new Error("SESION_EXPIRED");
        if (!res.ok) throw new Error("Error al cargar documentos en servidor");

        const parsedRes: any[] = await res.json();

        const documentosNormalizados = (
          parsedRes
            .map((doc) => {
              const rawPath: string | undefined = doc.ruta_archivo ?? doc.rutaArchivo;
              if (!rawPath) return null;

              const partes = rawPath.split(/[/\\]/);
              const nombreArchivo = partes[partes.length - 1];
              if (!nombreArchivo) return null;

              const secuencial = doc.secuencial_documento ?? doc.secuencialDocumento;
              if (!secuencial) return null;

              return {
                secuencial_documento: secuencial,
                ruta_archivo: `${API_BASE_URL}/usuario-documentos/download/${nombreArchivo}`,
                nombre_archivo: nombreArchivo,
                lado: doc.lado,
                fecha_carga: doc.fecha_carga ?? doc.fechaCarga,
                id_unico: `${secuencial}-${doc.lado ?? "unico"}`,
              } as DocumentoCargado;
            })
            .filter((d) => d !== null)
        ) as DocumentoCargado[];

        setDocumentosCargados(documentosNormalizados);
      } catch (err: any) {
        console.error("❌ Error en fetch de documentos:", err);

        if (err.message === "SESION_EXPIRED") {
          toast.error("Tu sesión ha caducado. Por favor inicia sesión nuevamente.");
          router.push("/login");
          return;
        }

        toast.error("Error al cargar documentos");
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchData();
  }, [secuencialUsuario, idServicio]);

  const documentoEstaCompleto = (doc: DocumentoRequerido): boolean => {
    return documentosCargados.some((d) => d.secuencial_documento === doc.secuencial);
  };

  useEffect(() => {
    const todos = documentosRequeridos.every((doc) => documentoEstaCompleto(doc));
    setTodosCompletos(todos);
    (window as any).todosDocumentosCompletos = todos;
  }, [documentosRequeridos, documentosCargados]);

  const totalDocumentos = documentosRequeridos.length;
  const totalCompletados = useMemo(() => {
    return documentosRequeridos.filter((doc) => documentoEstaCompleto(doc)).length;
  }, [documentosRequeridos, documentosCargados]);

  const progreso = totalDocumentos > 0 ? Math.round((totalCompletados / totalDocumentos) * 100) : 0;

  const renderVistaPrevia = (doc: DocumentoRequerido) => {
    const cargado = documentosCargados.find((d) => d.secuencial_documento === doc.secuencial);
    if (!cargado) return null;

    const isImageFile =
      cargado.nombre_archivo?.match(/\.(jpeg|jpg|png|gif|webp)$/i) ||
      cargado.ruta_archivo?.match(/\.(jpeg|jpg|png|gif|webp)$/i);

    const isPdfFile =
      cargado.nombre_archivo?.match(/\.pdf$/i) ||
      cargado.ruta_archivo?.match(/\.pdf$/i);

    const getFileIcon = () => {
      if (isImageFile) return <ImageIcon className="h-5 w-5" />;
      if (isPdfFile) return <FileText className="h-5 w-5" />;
      return <FileDigit className="h-5 w-5" />;
    };

    return (
      <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-start gap-4">
          {isImageFile ? (
            <img
              src={cargado.ruta_archivo}
              alt={`Vista previa ${doc.nombre}`}
              className="h-20 w-20 rounded-2xl border border-slate-200 object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
              {getFileIcon()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-semibold text-slate-900">Documento cargado</p>
            </div>

            <p className="mt-2 truncate text-sm font-medium text-slate-700">
              {cargado.nombre_archivo}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {cargado.fecha_carga
                ? new Date(cargado.fecha_carga).toLocaleDateString()
                : "Fecha no disponible"}
            </p>

            <a
              href={cargado.ruta_archivo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-xs font-semibold text-cyan-700 underline-offset-4 transition hover:text-cyan-800 hover:underline"
            >
              Ver documento completo
            </a>
          </div>
        </div>
      </div>
    );
  };

  async function compressImage(file: File, maxSizeBytes: number): Promise<File> {
    if (!file.type.startsWith("image/")) {
      throw new Error("No es un archivo de imagen");
    }

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
  }

  const handleUpload = async (
    secuencialDocumento: number,
    lado: string,
    file: File
  ) => {
    if (!secuencialUsuario) {
      return toast.error("Usuario no disponible");
    }

    const token = getWizardToken();
    if (!token) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      return toast.error("Solo se permiten imágenes o PDF.");
    }

    let fileToUpload = file;

    if (isImage && file.size > MAX_SIZE) {
      toast.info("Comprimiendo imagen...");
      try {
        fileToUpload = await compressImage(file, MAX_SIZE);
        toast.success("Imagen comprimida correctamente");
      } catch (err: any) {
        console.error(err);
        return toast.error(err.message);
      }
    }

    if (fileToUpload.size > MAX_SIZE) {
      return toast.error("El archivo supera los 5 MB.");
    }

    const formData = new FormData();
    formData.append("secuencial_usuario", `${secuencialUsuario}`);
    formData.append("secuencial_documento", `${secuencialDocumento}`);
    formData.append("lado", lado || "");
    formData.append("usuariocrea", "NoPayFront");
    formData.append("file", fileToUpload, fileToUpload.name);

    try {
      setLoading(true);
      setUploadingDocId(secuencialDocumento);

      const res = await fetch(`${API_BASE_URL}/usuario-documentos/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      const nuevoDocumento: DocumentoCargado = {
        secuencial_documento: secuencialDocumento,
        ruta_archivo: URL.createObjectURL(fileToUpload),
        nombre_archivo: fileToUpload.name,
        lado: lado || undefined,
        fecha_carga: new Date().toISOString(),
        id_unico: `${secuencialDocumento}-${lado || "unico"}`,
      };

      setDocumentosCargados((prev) => {
        const sinViejo = prev.filter(
          (d) => d.secuencial_documento !== secuencialDocumento
        );
        return [...sinViejo, nuevoDocumento];
      });

      toast.success("Archivo subido con éxito");
    } catch (err) {
      console.error("Error al subir archivo:", err);
      toast.error("Error al subir archivo");
    } finally {
      setLoading(false);
      setUploadingDocId(null);
    }
  };

  const todosDocumentosCompletos = documentosRequeridos.every((doc) =>
    documentoEstaCompleto(doc)
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200/60">
                <FileCheck2 className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Documentación obligatoria
                </p>
                 
 
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Usuario
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                #{secuencialUsuario ?? "-"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Aviso */}
        <div className="mb-8 rounded-[24px] border border-cyan-200 bg-cyan-50/70 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Importante</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Asegúrate de cargar archivos claros, legibles y completos. Formatos permitidos:
                imágenes y PDF. Tamaño máximo: <span className="font-semibold">5 MB por archivo</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Estado completado */}
        {todosDocumentosCompletos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-[24px] border border-emerald-200 bg-emerald-50/80 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">¡Todo listo!</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Has completado todos los documentos requeridos. Ya puedes continuar con mayor seguridad en el flujo.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Resumen superior */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryMiniCard label="Requeridos" value={totalDocumentos} />
          <SummaryMiniCard label="Completados" value={totalCompletados} tone="success" />
          <SummaryMiniCard label="Progreso" value={`${progreso}%`} tone="info" />
        </div>

        {/* Barra progreso */}
        <div className="mb-8 rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Avance documental</p>
              <p className="text-sm text-slate-600">
                {totalCompletados} de {totalDocumentos} documento(s) cargado(s)
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              {progreso}%
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        {/* Grid documentos */}
        {loadingDocs ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[26px] border border-slate-200 bg-slate-50/70 p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cargando documentos</h3>
            <p className="mt-2 text-sm text-slate-600">
              Estamos obteniendo los requisitos documentales del servicio.
            </p>
          </div>
        ) : documentosRequeridos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {documentosRequeridos.map((doc) => {
              const completo = documentoEstaCompleto(doc);
              const isActiveDrop = isDragging && activeDoc === doc.secuencial;
              const isUploadingThis = uploadingDocId === doc.secuencial && loading;

              return (
                <motion.div
                  key={doc.secuencial}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  className={cn(
                    "overflow-hidden rounded-[26px] border bg-white shadow-sm transition hover:shadow-md",
                    completo ? "border-emerald-200" : "border-slate-200"
                  )}
                >
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {doc.nombre}
                          </h3>
                          {completo && (
                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <Check className="mr-1 h-3 w-3" />
                              Completado
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {doc.descripcion}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                          completo
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-amber-200 bg-amber-50 text-amber-700"
                        )}
                      >
                        {completo ? "Listo" : "Pendiente"}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    {renderVistaPrevia(doc)}

                    <div
                      className={cn(
                        "mt-5 rounded-[24px] border-2 border-dashed p-6 text-center transition-all",
                        isActiveDrop
                          ? "border-cyan-300 bg-cyan-50"
                          : "border-slate-300 bg-slate-50/60 hover:border-cyan-200 hover:bg-cyan-50/40"
                      )}
                      onDragEnter={() => {
                        setIsDragging(true);
                        setActiveDoc(doc.secuencial);
                      }}
                      onDragLeave={() => {
                        setIsDragging(false);
                        setActiveDoc(null);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        setActiveDoc(null);
                        if (e.dataTransfer.files[0]) {
                          handleUpload(doc.secuencial, "", e.dataTransfer.files[0]);
                        }
                      }}
                    >
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                            {isUploadingThis ? (
                              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                            ) : (
                              <UploadCloud className="h-8 w-8 text-cyan-600" />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {isUploadingThis
                                ? "Subiendo archivo..."
                                : "Arrastra tu archivo aquí"}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              o{" "}
                              <span className="font-semibold text-cyan-700 underline underline-offset-4">
                                selecciónalo desde tu equipo
                              </span>
                            </p>
                          </div>

                          <p className="text-xs text-slate-500">
                            Formatos permitidos: JPG, PNG, PDF · Máx. 5 MB
                          </p>

                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            disabled={loading}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleUpload(doc.secuencial, "", e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}