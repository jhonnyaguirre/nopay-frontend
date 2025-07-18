"use client";

import { useEffect, useState } from "react";
import {
  FileCheck2,
  UploadCloud,
  FileText,
  Image,
  FileDigit,
  Loader2,
} from "lucide-react";
import { Header } from "app/resources/Header";
import Footer from "app/resources/Footer";
import NoPayChatLauncher from "app/resources/NoPayChatLauncher";
import { getWizardToken } from "lib/seguridad/sessionUtils";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Fusion from "app/resources/Fusion";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { API_BASE_URL } from "config/apiConfig";
import router from "next/router";

interface ServicioDocumentoAPI {
  secuencial: number;
  secuencialDocumento: number;
  nombreDocumento: string;
  descripcionDocumento: string;
  lado: string; // Podría dejar de usarse si ya no importa
}

interface DocumentoCargado {
  secuencial_documento: number;
  ruta_archivo: string;
  nombre_archivo: string;
  // lado y fecha opcionales, pero ya no los utilizaremos para validar
  lado?: string;
  fecha_carga?: string;
  id_unico: string;
}

interface DocumentoRequerido {
  secuencial: number; // Coincide con secuencialDocumento
  nombre: string;
  descripcion: string;
  lados: string[]; // Aunque tengamos array, lo ignoraremos en la validación
}


export default function CargaDocumentosServicio() {
  const [documentosRequeridos, setDocumentosRequeridos] = useState<DocumentoRequerido[]>([]);
  const [documentosCargados, setDocumentosCargados] = useState<DocumentoCargado[]>([]);
  const [loading, setLoading] = useState(false);
  const [secuencialUsuario, setSecuencialUsuario] = useState<number | null>(null);

  const [wizardData, setWizardData] = useState<any>(null);

  useEffect(() => {
    const data = SessionWizardData.obtener();
    setWizardData(data);
  }, []);


  const idServicio = 1;
  const [todosCompletos, setTodosCompletos] = useState<boolean>(false);

  // Nuevo estado para el drag and drop
  const [isDragging, setIsDragging] = useState(false);
  const [activeDoc, setActiveDoc] = useState<number | null>(null);

  // Efecto para el temporizador de carga
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        toast.info("La carga puede tardar unos segundos...");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // 1) Inicializar secuencialUsuario al montar el componente
  useEffect(() => {
    const usuario = SessionWizardData.obtener();
    if (usuario?.secuencial) {
      setSecuencialUsuario(usuario.secuencial);
    }
  }, []);

  // 2) Obtener datos de ambos endpoints
  useEffect(() => {
    const token = getWizardToken();
    if (!token || !secuencialUsuario) return;

    const fetchData = async () => {
      try {
        // --- Documentos requeridos ---
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

        //console.log("🔍 Token:", token);
        //console.log("🔍 secuencialUsuario:", secuencialUsuario);

        // --- Documentos ya cargados ---
        const urlCargados = `${API_BASE_URL}/usuario-documentos/usuario/${secuencialUsuario}`;
        const res = await fetch(urlCargados, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 403) throw new Error("SESION_EXPIRED");
        if (!res.ok) throw new Error("Error al cargar documentos en servidor");

        const parsedRes: any[] = await res.json();

        //console.log("🧾 Respuesta RAW de documentos cargados:", JSON.stringify(parsedRes, null, 2));

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

        //console.log("🧾 Documentos cargados NORMALIZADOS:", documentosNormalizados);
        setDocumentosCargados(documentosNormalizados);
      } catch (err: any) {
        console.error("❌ Error en fetch de documentos:", err);

        if (err.message === "SESION_EXPIRED") {
          toast.error("Tu sesión ha caducado. Por favor inicia sesión nuevamente.");
          //   setWizardToken("");
          //  setGlobalToken("");
          // SessionWizardData.limpiar?.();
          router.push("/login");
          return;
        }

        toast.error("Error al cargar documentos");
      }
    };

    fetchData();
  }, [secuencialUsuario, idServicio]);


  // 3) Simplificar la validación ignorando 'lado'
  const documentoEstaCompleto = (doc: DocumentoRequerido): boolean => {
    return documentosCargados.some((d) => d.secuencial_documento === doc.secuencial);
  };

  useEffect(() => {
    const todos = documentosRequeridos.every((doc) => documentoEstaCompleto(doc));
    setTodosCompletos(todos);

    // ** Opcional: exponerlo en window para que sea “global” **
    // (Solo si realmente necesitas accederlo fuera de React)
    (window as any).todosDocumentosCompletos = todos;
  }, [documentosRequeridos, documentosCargados]);

  const renderVistaPrevia = (doc: DocumentoRequerido) => {
    const cargado = documentosCargados.find((d) => d.secuencial_documento === doc.secuencial);

    if (!cargado) return null;

    const getFileIcon = () => {
      if (cargado.ruta_archivo.match(/\.(jpeg|jpg|png|gif)$/i)) {
        return <Image className="w-5 h-5" />;
      } else if (cargado.ruta_archivo.match(/\.pdf$/i)) {
        return <FileText className="w-5 h-5" />;
      }
      return <FileDigit className="w-5 h-5" />;
    };

    return (
      <div className="flex items-center gap-3 mt-3 p-3 bg-white/5 rounded-lg">
        {cargado.ruta_archivo.match(/\.(jpeg|jpg|png|gif)$/i) ? (
          <img
            src={cargado.ruta_archivo}
            alt={`Vista previa ${doc.nombre}`}
            className="w-16 h-16 object-cover rounded-lg border-2 border-white/20 hover:border-blue-400 transition-all"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-lg">
            {getFileIcon()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{cargado.nombre_archivo}</p>
          <p className="text-xs text-white/60">
            {new Date(cargado.fecha_carga || "").toLocaleDateString()}
          </p>
          <a
            href={cargado.ruta_archivo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 text-xs underline mt-1 inline-block"
          >
            Ver documento completo
          </a>
        </div>
      </div>
    );
  };

  // —————————————————————————————
  // Helper: comprime imagen a JPEG <= maxSizeBytes
  // —————————————————————————————
  async function compressImage(
    file: File,
    maxSizeBytes: number
  ): Promise<File> {
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

    return new File(
      [blob],
      file.name.replace(/\.[^/.]+$/, "") + ".jpg",
      { type: "image/jpeg" }
    );
  }

  // —————————————————————————————
  // Función handleUpload mejorada
  // —————————————————————————————
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

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    // Validar tipos
    if (!isImage && !isPdf) {
      return toast.error("Solo se permiten imágenes o PDF.");
    }

    let fileToUpload = file;

    // Si es imagen y >5MB, comprimir
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

    // Validar tamaño final
    if (fileToUpload.size > MAX_SIZE) {
      return toast.error("El archivo supera los 5 MB.");
    }

    // Construir y enviar FormData
    const formData = new FormData();
    formData.append("secuencial_usuario", `${secuencialUsuario}`);
    formData.append("secuencial_documento", `${secuencialDocumento}`);
    formData.append("lado", lado || "");
    formData.append("usuariocrea", "NoPayFront");
    formData.append("file", fileToUpload, fileToUpload.name);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/usuario-documentos/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());

      // Actualizar estado con URL temporal
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
    }
  };



  const todosDocumentosCompletos = documentosRequeridos.every((doc) =>
    documentoEstaCompleto(doc)
  );

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-2xl border border-gray-700 shadow-2xl p-8">
      {/* ✦ Fondos Decorativos Flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Círculo radial suave */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl"></div>
        {/* Forma abstracta irregular */}
        <svg
          className="absolute bottom-0 right-0 w-96 h-96 opacity-20"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="luxGradBackground" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M421.3,281.2Q386,362,303.8,377.7Q221.6,393.3,149.4,358.5Q77.1,323.7,55.5,249.8Q33.9,175.8,83.5,115.3Q133.2,54.7,210.9,34.4Q288.5,14,346,64.6Q403.6,115.2,421.3,195.6Q439,276,421.3,281.2Z"
            fill="url(#luxGradBackground)"
          />
        </svg>

        {/* SVG a la derecha del contenido */}
        <svg
          className="absolute right-0 top-0 w-0 sm:w-1/3 md:w-[45%] lg:w-[55%] h-full object-cover opacity-10"
          viewBox="0 0 600 800"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="shapeGradientTech" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7F1D1D" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <path
            d="M600,0 C520,120 580,240 480,320 C370,400 440,540 340,640 C240,740 360,840 200,900 C100,940 0,960 0,1080 L600,1080 Z"
            fill="url(#shapeGradientTech)"
          />
        </svg>

        {/* Curva blanca inferior */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-white rounded-t-[100%]"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FileCheck2 className="text-cyan-400" />
              Documentación Requerida (Obligatoria)
            </h1>
            <p className="text-gray-300">
              Sube los documentos solicitados para continuar con tu impugnación en línea
            </p>

            <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-cyan-500/20 p-2 rounded-full">
                  <FileText className="text-cyan-300 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Importante</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Asegúrate de cargar imágenes o archivos claros, legibles y completos.
                    Formatos permitidos: JPG, PNG, PDF  ·  Tamaño máximo: 5 MB por archivo
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {todosDocumentosCompletos && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <FileCheck2 className="text-green-300 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">¡Todo listo!</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Has completado todos los documentos requeridos. Revisa que todo
                    esté correcto antes de confirmar.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentosRequeridos.map((doc) => (
              <motion.div
                key={doc.secuencial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                className={`bg-gray-800/60 rounded-xl border ${documentoEstaCompleto(doc) ? "border-green-500/30" : "border-gray-600"
                  } overflow-hidden`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {doc.nombre}
                        {documentoEstaCompleto(doc) && (
                          <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                            Completado
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">{doc.descripcion}</p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${documentoEstaCompleto(doc)
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-600/20 text-yellow-300"
                        }`}
                    >
                      {documentoEstaCompleto(doc) ? "Listo" : "Pendiente"}
                    </div>
                  </div>

                  {renderVistaPrevia(doc)}

                  <div
                    className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center transition-all ${isDragging && activeDoc === doc.secuencial
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-gray-600/40"
                      }`}
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
                      <div className="flex flex-col items-center justify-center gap-2">
                        {loading ? (
                          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 text-gray-400" />
                            <p className="text-sm text-gray-300">
                              Arrastra tu archivo aquí o{" "}
                              <span className="text-cyan-300 hover:text-cyan-200 underline">
                                selecciónalo
                              </span>
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
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>


      </div>

    </div>
  );
}
