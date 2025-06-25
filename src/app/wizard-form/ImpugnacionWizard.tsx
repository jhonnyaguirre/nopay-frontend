"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  User,
  X,
  Radar,
  UploadCloud,
} from "lucide-react";
import { createWorker, RecognizeResult } from "tesseract.js";
import { Header } from "app/resources/Header";
import Footer from "app/resources/Footer";
import { useRouter } from "next/navigation";

import { ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/Card";
import { validarSesionSegura } from "lib/seguridad/validarSesion";
import { useValidarSesion } from "lib/hooks/useValidarSesion";
import { SessionJWTManager } from "lib/seguridad/SessionJWTManager";
import { SessionPaymentManager } from "lib/seguridad/SessionPaymentManager";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import TermsModal from "app/resources/TermsModal";
import BackgroundWithSideSvg from "app/resources/BackgroundWithSideSvg";
import CargaDocumentosServicio from "app/documentos/page";
import { API_BASE_URL } from "config/apiConfig";

// ** Importamos el componente de carga de documentos como un nuevo step **


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

const Notification = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-4 sm:bottom-8 right-2 sm:right-4 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-2xl border border-white/20 z-50 max-w-xs sm:max-w-sm w-[calc(100%-1rem)]"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="bg-green-500/20 p-2 rounded-full flex-shrink-0"
        >
          <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">¡Éxito!</h3>
          <p className="text-gray-600 mt-1 text-xs sm:text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg sm:text-xl"
        >
          &times;
        </button>
      </div>
    </motion.div>
  );
};

const ImpugnacionWizard = () => {
  // —————————————————————————————
  // Sesión e initial state
  // —————————————————————————————
  useEffect(() => {
    const wizardData = SessionWizardData.obtener();
    if (wizardData) {
      setCedula(wizardData.cedula || "");
      setSecuencialUser(wizardData.secuencial?.toString() || "");
      setNombreParam(`${wizardData.nombres || ""} ${wizardData.apellidos || ""}`.trim());
    }
  }, []);

  const router = useRouter();

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [nombreParam, setNombreParam] = useState("");
  const [cedula, setCedula] = useState("");
  const [secuencialUser, setSecuencialUser] = useState("");

  // ** Ajustamos a 6 steps en lugar de 5 **
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingStep, setPendingStep] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  const [vehiculosUsuario, setVehiculosUsuario] = useState<
    { secuencial: number; descripcion: string }[]
  >([]);

  const [formData, setFormData] = useState({
    direccion: "Av. Ordóñez Laso",
    provincia: "Azuay",
    ciudad: "Cuenca",
    tipoMulta: "",
    agencia: "",
    fechaCitacion: "",
    numeroCitacion: "",
    vehiculo: "",
    archivos: [] as FileWithPreview[],
    comprobantePago: null as File | null,
    aceptaTerminos: false,
    ocrResults: [] as OCRResult[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // —————————————————————————————
  // Validar JWT al cargar
  // —————————————————————————————
  useEffect(() => {
    const validarJWT = async () => {
      const esValido = await SessionJWTManager.isValid();
      if (!esValido) {
        alert("Tu sesión ha expirado o es inválida. Serás redirigido.");
        window.location.href = "/";
        return;
      }
      setIsValidating(false);
    };
    validarJWT();
  }, []);

  // —————————————————————————————
  // Previsualización y limpieza de objetos URL
  // —————————————————————————————
  useEffect(() => {
    return () => {
      formData.archivos.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [formData.archivos]);

  // —————————————————————————————
  // Scroll to top on step change
  // —————————————————————————————
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // —————————————————————————————
  // Fetch vehículos del usuario
  // —————————————————————————————
  useEffect(() => {
    const fetchVehiculos = async () => {
      if (!secuencialUser) return;
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/vehiculos/${secuencialUser}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener vehículos");
        const data = await res.json();
        setVehiculosUsuario(data);
      } catch (err) {
        //console.error("Error cargando vehículos:", err);
      }
    };
    fetchVehiculos();
  }, [secuencialUser]);

  // —————————————————————————————
  // OCR Helpers
  // —————————————————————————————
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

  const processImageWithOCR = async (file: File): Promise<OCRResult> => {
    setIsProcessing(true);
    setOcrProgress(0);
    try {
      const blob = await preprocessImage(file);
      const worker = await createWorker({
        logger: (m) => {
          if (m.status === "recognizing text" && m.progress !== undefined) {
            setOcrProgress(Math.round(m.progress * 100));
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
    } catch (error) {
      //console.error("Error en OCR:", error);
      return {
        text: "",
        confidence: 0,
        extractedData: {},
      };
    } finally {
      setIsProcessing(false);
    }
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) {
      setNotificationMessage("Solo se aceptan imágenes (JPG, PNG)");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    setIsProcessing(true);
    try {
      const processedFiles: FileWithPreview[] = [];
      const ocrResults: OCRResult[] = [];
      for (const file of files) {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        processedFiles.push(fileWithPreview);
        const result = await processImageWithOCR(file);
        ocrResults.push(result);
      }
      setFormData((prev) => {
        const newFiles = [...prev.archivos, ...processedFiles];
        const newOcrResults = [...prev.ocrResults, ...ocrResults];
        const lastResult = ocrResults[ocrResults.length - 1]?.extractedData;
        return {
          ...prev,
          archivos: newFiles,
          ocrResults: newOcrResults,
          numeroCitacion: lastResult?.citationNumber || prev.numeroCitacion,
          vehiculo: lastResult?.licensePlate || prev.vehiculo,
          fechaCitacion: lastResult?.date || prev.fechaCitacion,
          agencia: lastResult?.agency || prev.agencia,
        };
      });
    } catch (error) {
      //console.error("Error procesando archivos:", error);
      setNotificationMessage("Error procesando imágenes");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => {
      const newFiles = [...prev.archivos];
      const newOcrResults = [...prev.ocrResults];
      if (newFiles[index]?.preview) URL.revokeObjectURL(newFiles[index].preview!);
      newFiles.splice(index, 1);
      newOcrResults.splice(index, 1);
      return {
        ...prev,
        archivos: newFiles,
        ocrResults: newOcrResults,
      };
    });
  };

  // —————————————————————————————
  // Validaciones de cada paso
  // —————————————————————————————
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};
    switch (stepNumber) {
      case 1:
        if (!formData.direccion) newErrors.direccion = "La dirección es requerida";
        if (!formData.provincia) newErrors.provincia = "La provincia es requerida";
        if (!formData.ciudad) newErrors.ciudad = "La ciudad es requerida";
        break;
      case 2:
        if (!formData.tipoMulta) newErrors.tipoMulta = "Seleccione el tipo de multa";
        if (!formData.agencia) newErrors.agencia = "Seleccione la agencia";
        if (!formData.fechaCitacion) newErrors.fechaCitacion = "Ingrese la fecha";
        if (!formData.numeroCitacion) newErrors.numeroCitacion = "Ingrese el número";
        break;
      case 3:
        // ** Validamos que window.todosDocumentosCompletos sea true **
        if (
          !(window as any).todosDocumentosCompletos
        ) {
          newErrors.archivos = "Debes subir todos los documentos requeridos";
        }
        break;
      case 4:
        if (!formData.vehiculo) newErrors.vehiculo = "Seleccione un vehículo";
        if (formData.archivos.length === 0) newErrors.archivos = "Suba al menos un archivo";
        break;
      case 5:
        if (!formData.aceptaTerminos) newErrors.aceptaTerminos = "Debe aceptar los términos";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    // Validamos según el número actual de step
    if (validateStep(step)) {
      // Si estamos en el paso 5 (Revisión Final), al hacer Siguiente abrimos modal de términos
      if (step === 6) {
        setShowTermsModal(true);
        setPendingStep(6);
        return;
      }
      // Marcamos como completado el step actual (si no estaba marcado)
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...completedSteps, step]);
      }
      // Avanzamos
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // —————————————————————————————
  // Enviar impugnación
  // —————————————————————————————
  const handleFinalSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const formDataToSend = new FormData();
      formDataToSend.append("secuencial_usuario", secuencialUser);
      formDataToSend.append("secuencial_vehiculo", formData.vehiculo);
      formDataToSend.append("fecha_citacion", formData.fechaCitacion);
      formDataToSend.append("numero_citacion", formData.numeroCitacion);
      formDataToSend.append("observacion", "Impugnación tránsito");
      formDataToSend.append("secuencia_estado", "1");
      const detalleJson = formData.archivos.map((file, index) => {
        return {
          secuencia_origen: 1,
          secuencia_agencia: formData.agencia === "ANT" ? 2 : 1,
          tipo_documento: "foto_citacion",
          secuencia_estado: 1,
        };
      });
      formDataToSend.append("detalleJson", JSON.stringify(detalleJson));
      formData.archivos.forEach((file) => {
        const blob = new Blob([file], { type: file.type });
        const namedFile = new File([blob], file.name, { type: file.type });
        formDataToSend.append("file", namedFile);
      });
      const res = await fetch(`${API_BASE_URL}/regmultas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      //console.log("se ha mandado a guardar la multa, se pespera 2 segundos");
      if (res.status === 401 || res.status === 403) {
        //console.log("algo falló se retorna todo");
        setNotificationMessage(
          "El tiempo de espera seguro ha expirado. Te redirigiremos a la pantalla de inicio."
        );
        setShowNotification(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
        return;
      }
      if (!res.ok) throw new Error("No se pudo enviar la impugnación");
      const data = await res.json();
      //console.log("Respuesta:", data);
      setStep(6);

      const descripcionVehiculo = vehiculosUsuario.find(
        (v) => v.secuencial.toString() === formData.vehiculo
      )?.descripcion || "";

      SessionPaymentManager.guardar({
        citacion: formData.numeroCitacion,
        item: descripcionVehiculo,
        cedula: cedula,
        //servicio: "Impugnación de Multas de Tránsito",
         servicio: data.cabeceraId?.toString() || "",
        valor: data.costo?.toString() || "20.00",
      });
      //console.log("se pasa a redirigir la multa par que sea pagado")
      router.push("/resumenPago");
    } catch (error: any) {
      //console.error("Error al enviar:", error);
      setNotificationMessage(error.message || "Error al enviar la impugnación");
      setShowNotification(true);
    }
  };

  // —————————————————————————————
  // NUEVO: Al entrar en step 6, mostrarse 2 segundos y luego ejecutar handleFinalSubmit
  // —————————————————————————————
  useEffect(() => {
    if (step === 6) {
      const timer = setTimeout(() => {
        handleFinalSubmit();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // —————————————————————————————
  // Modal de documentos: estado para mostrar/ocultar
  // —————————————————————————————
  const [showDocsModal, setShowDocsModal] = useState(false);

  // —————————————————————————————
  // JSX
  // —————————————————————————————
  return (
    <>
      <BackgroundWithSideSvg>
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <Header />
          <div className="h-20" />

          {/* ============================================= */}
          {/* Barra de progreso (círculos 1 a 6) */}
          {/* ============================================= */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 px-4 sm:px-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-0">
              Impugnación de Multa de {nombreParam}
            </h1>
            <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-between sm:justify-normal">
              {/* Ahora renderizamos de 1 a 6 pasos */}
              {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-base ${step === stepNumber
                      ? "bg-[#D4AF37] text-[#0A1D3E]"
                      : completedSteps.includes(stepNumber)
                        ? "bg-green-500 text-white"
                        : "bg-white/20 text-white/60"
                      }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 6 && (
                    <div
                      className={`w-4 sm:w-8 h-0.5 ${step > stepNumber ? "bg-green-500" : "bg-white/20"
                        }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {/* ————————————————————————————— STEP 1 ————————————————————————————— */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20"
                >
                  {/* Paso 1: Información Básica */}

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
                          <linearGradient id="luxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M421.3,281.2Q386,362,303.8,377.7Q221.6,393.3,149.4,358.5Q77.1,323.7,55.5,249.8Q33.9,175.8,83.5,115.3Q133.2,54.7,210.9,34.4Q288.5,14,346,64.6Q403.6,115.2,421.3,195.6Q439,276,421.3,281.2Z"
                          fill="url(#luxGrad)"
                        />
                      </svg>
                    </div>

                    <div className="relative z-10">
                      {/* ✦ Cabecera del Panel */}
                      <div className="flex items-center gap-4 mb-10">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-inner">
                          <User className="w-7 h-7 text-white drop-shadow-sm" />
                        </div>
                        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Datos de Domicilio</h2>
                      </div>

                      {/* ✦ Contenido del Formulario */}
                      <div className="space-y-8">
                        {/* Dirección */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Dirección
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.direccion}
                              onChange={(e) =>
                                setFormData({ ...formData, direccion: e.target.value })
                              }
                              placeholder="Av. Ordóñez Laso"
                              className={`w-full px-5 py-3 bg-gray-800/70 text-white placeholder-gray-400 border ${errors.direccion ? "border-red-500" : "border-gray-600"
                                } rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition`}
                            />
                            {errors.direccion && (
                              <p className="mt-1 text-sm text-red-400 flex items-center">
                                <AlertCircle className="mr-1 w-4 h-4" /> {errors.direccion}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Provincia y Ciudad en Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {/* Provincia */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Provincia
                            </label>
                            <div className="relative">
                              <select
                                value={formData.provincia}
                                onChange={(e) =>
                                  setFormData({ ...formData, provincia: e.target.value })
                                }
                                className={`w-full px-4 py-3 bg-gray-800/70 text-white border ${errors.provincia ? "border-red-500" : "border-gray-600"
                                  } rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 appearance-none transition`}
                              >
                                <option value="" disabled className="text-gray-400 bg-gray-900">
                                  Seleccione una opción
                                </option>
                                <option value="Azuay" className="bg-gray-900 text-white">
                                  Azuay
                                </option>
                                {/* …otras provincias… */}
                              </select>
                              {/* Flecha personalizada */}
                              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                            {errors.provincia && (
                              <p className="mt-1 text-sm text-red-400 flex items-center">
                                <AlertCircle className="mr-1 w-4 h-4" /> {errors.provincia}
                              </p>
                            )}
                          </div>

                          {/* Ciudad */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Ciudad
                            </label>
                            <div className="relative">
                              <select
                                value={formData.ciudad}
                                onChange={(e) =>
                                  setFormData({ ...formData, ciudad: e.target.value })
                                }
                                className={`w-full px-4 py-3 bg-gray-800/70 text-white border ${errors.ciudad ? "border-red-500" : "border-gray-600"
                                  } rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 appearance-none transition`}
                              >
                                <option value="" disabled className="text-gray-400 bg-gray-900">
                                  Seleccione un cantón
                                </option>
                                {[
                                  "Cuenca",
                                  "Camilo Ponce Enríquez",
                                  "Chordeleg",
                                  "El Pan",
                                  "Girón",
                                  "Guachapala",
                                  "Gualaceo",
                                  "Nabón",
                                  "Oña",
                                  "Paute",
                                  "Pucará",
                                  "San Fernando",
                                  "Santa Isabel",
                                  "Sevilla de Oro",
                                  "Sigsig",
                                ].map((canton) => (
                                  <option
                                    key={canton}
                                    className="bg-gray-900 text-white"
                                    value={canton}
                                  >
                                    {canton}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                            {errors.ciudad && (
                              <p className="mt-1 text-sm text-red-400 flex items-center">
                                <AlertCircle className="mr-1 w-4 h-4" /> {errors.ciudad}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </motion.div>
              )}

              {/* ————————————————————————————— STEP 2 ————————————————————————————— */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20"
                >
                  {/* Paso 2: Detalles de la Multa */}
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
                          <linearGradient id="luxGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M421.3,281.2Q386,362,303.8,377.7Q221.6,393.3,149.4,358.5Q77.1,323.7,55.5,249.8Q33.9,175.8,83.5,115.3Q133.2,54.7,210.9,34.4Q288.5,14,346,64.6Q403.6,115.2,421.3,195.6Q439,276,421.3,281.2Z"
                          fill="url(#luxGrad2)"
                        />
                      </svg>
                    </div>

                    <div className="relative z-10">
                      {/* ✦ Panel Interior */}
                      <div className="bg-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-8">
                        {/* ✦ Cabecera del Panel */}
                        <div className="flex items-center gap-4 mb-8">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-inner">
                            <Radar className="w-6 h-6 text-white drop-shadow-sm" />
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                            Detalles de la Multa
                          </h2>
                        </div>

                        {/* ✦ Contenido del Formulario */}
                        <div className="space-y-8">
                          {/* Cómo fue multado */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              ¿Cómo fue multado?
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {["Radar Móvil", "Radar Fijo", "Policía", "Otro"].map((tipo) => (
                                <label
                                  key={tipo}
                                  className={`flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2 cursor-pointer border ${formData.tipoMulta === tipo ? "border-cyan-400" : "border-gray-600"
                                    } hover:bg-gray-700/70 transition`}
                                >
                                  <input
                                    type="radio"
                                    name="tipoMulta"
                                    checked={formData.tipoMulta === tipo}
                                    onChange={() => setFormData({ ...formData, tipoMulta: tipo })}
                                    className="h-4 w-4 text-cyan-400 accent-cyan-400 focus:ring-cyan-400"
                                  />
                                  <span className="text-white text-xs sm:text-sm font-medium">
                                    {tipo}
                                  </span>
                                </label>
                              ))}
                            </div>
                            {errors.tipoMulta && (
                              <p className="mt-1 text-sm text-red-400 flex items-center">
                                <AlertCircle className="mr-1 h-4 w-4" /> {errors.tipoMulta}
                              </p>
                            )}
                          </div>

                          {/* Agencia que emitió la multa */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Agencia que emitió la multa
                            </label>
                            <div className="relative">
                              <select
                                value={formData.agencia}
                                onChange={(e) =>
                                  setFormData({ ...formData, agencia: e.target.value })
                                }
                                className={`w-full px-4 py-3 bg-gray-700/50 text-white border ${errors.agencia ? "border-red-500" : "border-gray-600"
                                  } rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 appearance-none transition`}
                              >
                                <option value="" disabled className="text-gray-400 bg-gray-800">
                                  Seleccione la Agencia
                                </option>
                                <option className="bg-gray-800 text-white" value="EMOV EP">
                                  EMOV EP
                                </option>
                                <option className="bg-gray-800 text-white" value="ANT">
                                  ANT
                                </option>
                                <option className="bg-gray-800 text-white" value="Municipal">
                                  Municipal
                                </option>
                              </select>
                              {/* Flecha personalizada */}
                              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                            {errors.agencia && (
                              <p className="mt-1 text-sm text-red-400 flex items-center">
                                <AlertCircle className="mr-1 h-4 w-4" /> {errors.agencia}
                              </p>
                            )}
                          </div>

                          {/* Fecha y Número de Citación */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Fecha de Citación */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Fecha de Citación
                              </label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={formData.fechaCitacion}
                                  max={new Date().toISOString().split("T")[0]}
                                  onChange={(e) =>
                                    setFormData({ ...formData, fechaCitacion: e.target.value })
                                  }
                                  className={`w-full px-4 py-3 bg-gray-700/50 text-white border ${errors.fechaCitacion ? "border-red-500" : "border-gray-600"
                                    } rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition`}
                                />
                              </div>
                              {errors.fechaCitacion && (
                                <p className="mt-1 text-sm text-red-400 flex items-center">
                                  <AlertCircle className="mr-1 h-4 w-4" /> {errors.fechaCitacion}
                                </p>
                              )}
                            </div>

                            {/* Número de Citación */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Número de Citación
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={formData.numeroCitacion}
                                  onChange={(e) =>
                                    setFormData({ ...formData, numeroCitacion: e.target.value })
                                  }
                                  placeholder="Ej: 2023-0012345"
                                  className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 border ${errors.numeroCitacion ? "border-red-500" : "border-gray-600"
                                    } rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition`}
                                />
                              </div>
                              {errors.numeroCitacion && (
                                <p className="mt-1 text-sm text-red-400 flex items-center">
                                  <AlertCircle className="mr-1 h-4 w-4" /> {errors.numeroCitacion}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ————————————————————————————— STEP 3 (NUEVO) ————————————————————————————— */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* ✦ Contenedor tech-style para el step 3 */}
                  <div className="relative isolate overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-2xl border border-gray-700 shadow-2xl p-8">
                    {/* Fondos decorativos secundarios */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl"></div>
                      <svg
                        className="absolute bottom-0 right-0 w-96 h-96 opacity-20"
                        viewBox="0 0 500 500"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="luxGradStep3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M421.3,281.2Q386,362,303.8,377.7Q221.6,393.3,149.4,358.5Q77.1,323.7,55.5,249.8Q33.9,175.8,83.5,115.3Q133.2,54.7,210.9,34.4Q288.5,14,346,64.6Q403.6,115.2,421.3,195.6Q439,276,421.3,281.2Z"
                          fill="url(#luxGradStep3)"
                        />
                      </svg>
                    </div>

                    {/* Contenido real del step 3 */}
                    <div className="relative z-10">
                      <CargaDocumentosServicio />
                    </div>
                  </div>
                </motion.div>
              )}


              {/* ————————————————————————————— STEP 4 (ANTES STEP 3) ————————————————————————————— */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20"
                >
                  {/* Paso 4: Documentación Requerida (antes era step 3) */}
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
                          <linearGradient id="luxGradDocReq" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M421.3,281.2Q386,362,303.8,377.7Q221.6,393.3,149.4,358.5Q77.1,323.7,55.5,249.8Q33.9,175.8,83.5,115.3Q133.2,54.7,210.9,34.4Q288.5,14,346,64.6Q403.6,115.2,421.3,195.6Q439,276,421.3,281.2Z"
                          fill="url(#luxGradDocReq)"
                        />
                      </svg>
                    </div>

                    {/* ✦ Contenedor Interior */}
                    <div className="relative z-10 bg-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-inner">
                          <FileText className="w-6 h-6 text-white drop-shadow-sm" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                          Documentación Requerida
                        </h2>
                        {/* -------- BOTÓN QUE ABRE EL MODAL DE /documentos ---------- */}
                        <Button
                          onClick={() => setShowDocsModal(true)}
                          className="ml-auto px-4 py-2 text-xs sm:text-sm bg-gray-700/80 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
                        >
                          Ver más documentos
                        </Button>
                      </div>

                      <div className="space-y-8">
                        {/* Campo Vehículo */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Vehículo
                          </label>
                          <div className="flex gap-2 items-center">
                            <select
                              value={formData.vehiculo}
                              onChange={(e) =>
                                setFormData({ ...formData, vehiculo: e.target.value })
                              }
                              className={`flex-1 px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 border ${errors.vehiculo ? "border-red-500" : "border-gray-600"
                                } rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 appearance-none transition`}
                            >
                              <option className="bg-gray-900 text-gray-400" value="">
                                Seleccione su vehículo
                              </option>
                              {vehiculosUsuario.map((v) => (
                                <option
                                  key={v.secuencial}
                                  className="bg-gray-900 text-white"
                                  value={v.secuencial}
                                >
                                  {v.descripcion}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => {
                                const lastPlate =
                                  formData.ocrResults[formData.ocrResults.length - 1]
                                    ?.extractedData.licensePlate;
                                if (lastPlate) {
                                  setFormData({ ...formData, vehiculo: lastPlate });
                                }
                              }}
                              className="px-3 py-2 bg-cyan-400/20 text-cyan-400 rounded-lg hover:bg-cyan-400/30 text-xs sm:text-sm transition"
                              disabled={!formData.ocrResults.length}
                            >
                              Usar detectado
                            </button>
                          </div>
                          {errors.vehiculo && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                              <AlertCircle className="mr-1 w-4 h-4" /> {errors.vehiculo}
                            </p>
                          )}
                        </div>

                        {/* Subida de imágenes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cargar Imágenes de la Citación
                          </label>

                          {isProcessing && (
                            <div className="mb-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600 shadow-md">
                              <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                                <div className="w-full bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-cyan-400 h-2 rounded-full"
                                    style={{ width: `${ocrProgress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-300">{ocrProgress}%</span>
                              </div>
                              <p className="mt-1 text-xs sm:text-sm text-gray-400">
                                Reconociendo texto en la imagen...
                              </p>
                            </div>
                          )}

                          <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:bg-gray-700/30 transition">
                            <UploadCloud className="w-8 h-8 text-cyan-400 mb-2" />
                            <p className="text-sm text-gray-300 text-center">
                              <span className="font-semibold">Haz clic para subir</span> o arrastra
                              aquí tus imágenes
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400">
                              JPG, JPEG, PNG (máx. 10MB)
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              multiple
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          {errors.archivos && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                              <AlertCircle className="mr-1 w-4 h-4" /> {errors.archivos}
                            </p>
                          )}
                        </div>

                        {/* Resultados OCR */}
                        {formData.archivos.length > 0 && (
                          <div className="space-y-4 mt-6">
                            {formData.archivos.map((file, index) => (
                              <div
                                key={index}
                                className="bg-gray-700/50 border border-gray-600 rounded-xl shadow-sm overflow-hidden"
                              >
                                <div className="flex items-center p-4">
                                  <img
                                    src={file.preview}
                                    alt="Previsualización"
                                    className="w-12 h-12 object-cover rounded-lg mr-4 border border-gray-600"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{file.name}</p>

                                    {formData.ocrResults[index] && (
                                      <div className="mt-1 p-3 bg-gray-700/40 rounded-lg border border-gray-600">
                                        {formData.ocrResults[index].confidence >= 70 ? (
                                          <div className="text-green-400 text-sm flex items-center">
                                            <Check className="mr-2 w-4 h-4" />
                                            Reconocimiento confiable ({formData.ocrResults[index].confidence}
                                            %)
                                          </div>
                                        ) : (
                                          <div className="text-yellow-300 text-sm flex items-start">
                                            <AlertCircle className="mr-2 w-5 h-5 mt-1" />
                                            <span>
                                              Procesamiento realizado. Algunos datos podrían requerir
                                              verificación. Nuestro equipo lo validará.
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="text-red-400 hover:text-red-300 ml-2 text-xl font-bold"
                                  >
                                    ×
                                  </button>
                                </div>

                                {/* Campos detectados */}
                                {formData.ocrResults[index] && (
                                  <div className="p-4 bg-gray-700/40 border-t border-gray-600">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                                      <div>
                                        <label className="text-xs text-gray-400 block mb-1">N° Citación</label>
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={formData.numeroCitacion}
                                            onChange={(e) =>
                                              setFormData({ ...formData, numeroCitacion: e.target.value })
                                            }
                                            className="flex-1 px-3 py-2 bg-gray-800/50 text-white text-sm border border-gray-600 rounded"
                                          />
                                          <button
                                            onClick={() => {
                                              const detected =
                                                formData.ocrResults[index].extractedData.citationNumber;
                                              if (detected) {
                                                setFormData({
                                                  ...formData,
                                                  numeroCitacion: detected,
                                                });
                                              }
                                            }}
                                            className="px-3 py-2 bg-cyan-400/20 text-cyan-400 rounded hover:bg-cyan-400/30 text-xs sm:text-sm"
                                          >
                                            Usar
                                          </button>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-400 block mb-1">Fecha</label>
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={formData.fechaCitacion}
                                            onChange={(e) =>
                                              setFormData({ ...formData, fechaCitacion: e.target.value })
                                            }
                                            className="flex-1 px-3 py-2 bg-gray-800/50 text-white text-sm border border-gray-600 rounded"
                                          />
                                          <button
                                            onClick={() => {
                                              const detected =
                                                formData.ocrResults[index].extractedData.date;
                                              if (detected) {
                                                setFormData({
                                                  ...formData,
                                                  fechaCitacion: detected,
                                                });
                                              }
                                            }}
                                            className="px-3 py-2 bg-cyan-400/20 text-cyan-400 rounded hover:bg-cyan-400/30 text-xs sm:text-sm"
                                          >
                                            Usar
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <details className="mt-2">
                                      <summary className="text-xs text-cyan-400 cursor-pointer">Ver texto reconocido</summary>
                                      <div className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-300 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                                        {formData.ocrResults[index].text}
                                      </div>
                                    </details>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ————————————————————————————— STEP 5 (ANTES STEP 4) ————————————————————————————— */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Paso 5: Revisión Final */}
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
                          <linearGradient id="luxGradFinal" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M367.952 256.814c250.946 24.661 375.994 152.533 375.142 383.617-1.277 346.625-356.944 302.013-358.51 751.042-1.565 449.029 478.798 368.77 478.798 730.552 0 241.188-89.933 378.432-269.798 411.73l1402.92 2.06V258.872l-1628.552-2.059Z"
                          fill="url(#luxGradFinal)"
                          transform="rotate(40 1182.228 1396.314)"
                        />
                      </svg>
                    </div>

                    {/* ✦ Contenedor Interior */}
                    <div className="relative z-10 bg-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-inner">
                          <Check className="w-6 h-6 text-white drop-shadow-sm" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg">
                          Revisión Final
                        </h2>
                      </div>

                      <div className="bg-gray-700/50 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-600 shadow-xl backdrop-blur-md">
                        <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-6 uppercase tracking-wider">
                          Resumen de la Impugnación
                        </h3>
                        <div className="space-y-8 text-white/90 text-sm">
                          <section>
                            <h4 className="text-white/70 font-bold uppercase mb-3 text-sm">
                              Datos Personales
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                              <div>
                                <p className="text-white/60 text-xs">Dirección</p>
                                <p className="font-medium">{formData.direccion}</p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs">Provincia</p>
                                <p className="font-medium">{formData.provincia}</p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs">Ciudad</p>
                                <p className="font-medium">{formData.ciudad}</p>
                              </div>
                            </div>
                          </section>
                          <section>
                            <h4 className="text-white/70 font-bold uppercase mb-3 text-sm">
                              Detalles de la Multa
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                              <div>
                                <p className="text-white/60 text-xs">Tipo</p>
                                <p className="font-medium">{formData.tipoMulta}</p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs">Agencia</p>
                                <p className="font-medium">{formData.agencia}</p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs">Fecha</p>
                                <p className="font-medium">{formData.fechaCitacion}</p>
                              </div>
                              <div>
                                <p className="text-white/60 text-xs">N° Citación</p>
                                <p className="font-medium">{formData.numeroCitacion}</p>
                              </div>
                            </div>
                          </section>
                          <section>
                            <h4 className="text-white/70 font-bold uppercase mb-3 text-sm">
                              Documentación Adjunta
                            </h4>
                            <p className="text-white font-semibold text-sm mb-3">
                              Vehículo:{" "}
                              <span className="text-cyan-400">
                                {vehiculosUsuario.find(
                                  (v) => v.secuencial.toString() === formData.vehiculo
                                )?.descripcion || "No seleccionado"}
                              </span>
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {formData.archivos.map((file, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-400/20 text-cyan-400 shadow-sm"
                                >
                                  {file.name}
                                </span>
                              ))}
                            </div>
                          </section>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-6 rounded-2xl border border-gray-600 flex items-start shadow-lg">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={formData.aceptaTerminos}
                          onChange={(e) =>
                            setFormData({ ...formData, aceptaTerminos: e.target.checked })
                          }
                          className="mt-1 h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-gray-500 rounded bg-gray-800/50"
                        />
                        <div className="ml-4 text-white text-sm">
                          <label htmlFor="terms" className="font-medium leading-snug">
                            Confirmo que toda la información proporcionada es verídica.
                          </label>
                          <p className="text-white/60 mt-1">
                            Al enviar este formulario, acepto los términos, condiciones de
                            impugnación y autorización de tratamiento de datos personales
                            conforme a la normativa vigente.
                          </p>
                          {errors.aceptaTerminos && (
                            <p className="mt-3 text-red-400 text-sm flex items-center">
                              <AlertCircle className="mr-1 w-4 h-4" />
                              {errors.aceptaTerminos}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ————————————————————————————— STEP 6 (ANTES STEP 5) ————————————————————————————— */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -60 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Paso 6: Confirmación */}
                  <div className="relative isolate overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-2xl border border-gray-700 shadow-2xl p-8 text-center">
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
                          <linearGradient id="luxGradFinal2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M367.952 256.814c250.946 24.661 375.994 152.533 375.142 383.617-1.277 346.625-356.944 302.013-358.51 751.042-1.565 449.029 478.798 368.77 478.798 730.552 0 241.188-89.933 378.432-269.798 411.73l1402.92 2.06V258.872l-1628.552-2.059Z"
                          fill="url(#luxGradFinal2)"
                          transform="rotate(40 1182.228 1396.314)"
                        />
                      </svg>
                    </div>

                    {/* ✦ Contenido Interior */}
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-14"
                    >
                      <div className="relative w-20 h-20 sm:w-28 sm:h-28 mb-6 sm:mb-8">
                        <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl animate-ping"></div>
                        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-blue-500/40 shadow-xl ring-1 ring-gray-800">
                          <Check className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight drop-shadow-sm">
                        ¡Tu impugnación fue enviada!
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
                        Hemos recibido tu solicitud y comenzamos el proceso de revisión. Pronto te
                        notificaremos por correo electrónico con las actualizaciones
                        correspondientes.
                      </p>
                      <div className="w-full max-w-2xl bg-gray-800/50 rounded-2xl border border-gray-600 shadow-xl p-6 md:p-8 backdrop-blur">
                        <h3 className="text-base sm:text-lg text-cyan-400 font-semibold mb-4 uppercase tracking-wide">
                          Resumen del Envío
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>
                            <p className="text-gray-500">Número de caso</p>
                            <p className="font-semibold">
                              2023-IMP-{Math.floor(100000 + Math.random() * 899999)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Fecha de registro</p>
                            <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Estado actual</p>
                            <p className="text-yellow-400 font-bold">En Revisión</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Verificación</p>
                            <p className="text-green-400 font-semibold">Validación inicial completada</p>
                          </div>
                        </div>
                      </div>
                     
                    </motion.div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ============================================= */}
          {/* Botones “Anterior” / “Siguiente” / “Enviar” */}
          {/* ============================================= */}
          {step < 6 && (
            <div className="relative isolate overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-2xl border-t border-gray-600 shadow-2xl max-w-4xl mx-auto w-full mt-6 px-6 py-4 flex justify-between">
              {/* ✦ Fondos Decorativos */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl"></div>
                <svg
                  className="absolute bottom-0 right-0 w-80 h-80 opacity-10"
                  viewBox="0 0 500 500"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M421.3,281.2Q386,362,303.8,377.7Q221.6,393.3,149.4,358.5Q77.1,323.7,55.5,249.8Q33.9,175.8,83.5,115.3Q133.2,54.7,210.9,34.4Q288.5,14,346,64.6Q403.6,115.2,421.3,195.6Q439,276,421.3,281.2Z"
                    fill="url(#navGrad)"
                  />
                </svg>
              </div>

              {/* Contenido de navegación */}
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  type="button"
                  className="relative z-10 flex items-center px-5 py-2 border border-cyan-400 text-white rounded-lg hover:bg-cyan-500/20 transition flex items-center"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Anterior
                </button>
              ) : (
                <div className="relative z-10 w-24"></div>
              )}

              {step < 5 ? (
                <button
                  onClick={nextStep}
                  type="button"
                  className="relative z-10 flex items-center px-6 py-2 bg-cyan-400 text-gray-900 rounded-lg hover:bg-cyan-500 transition flex items-center"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : step === 5 ? (
                <button
                  onClick={nextStep}
                  type="button"
                  className="relative z-10 flex items-center px-6 py-2 bg-cyan-400 text-gray-900 rounded-lg hover:bg-cyan-500 transition flex items-center"
                >
                  Aceptar Términos
                  <ShieldCheck className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <div className="relative z-10 w-24"></div>
              )}
            </div>

          )}

          <AnimatePresence>
            {showTermsModal && (
              <TermsModal
                onAccept={() => {
                  setShowTermsModal(false);
                  if (pendingStep) {
                    setCompletedSteps((prev) =>
                      !prev.includes(step) ? [...prev, step] : prev
                    );
                    setStep(pendingStep);
                    setPendingStep(null);
                  }
                }}
                onCancel={() => {
                  setShowTermsModal(false);
                  setPendingStep(null);
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showNotification && (
              <Notification
                message={notificationMessage}
                onClose={() => setShowNotification(false)}
              />
            )}
          </AnimatePresence>
        </main>

        {/* ————————————————————————————— */}
        {/* MODAL QUE MUESTRA /documentos EN UN IFRAME */}
        {/* ————————————————————————————— */}
        <AnimatePresence>
          {showDocsModal && (
            <motion.div
              key="docsModal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-3xl h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
              >
                <button
                  onClick={() => setShowDocsModal(false)}
                  className="absolute top-3 right-3 z-10 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
                <iframe
                  src="/documentos"
                  className="w-full h-full border-none"
                  title="Documentos"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </BackgroundWithSideSvg>
      <Footer />
    </>
  );
};

export default ImpugnacionWizard;
