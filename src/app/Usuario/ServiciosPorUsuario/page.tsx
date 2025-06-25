"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "app/resources/Header";
import Footer from "app/resources/Footer";
import NoPayChatLauncher from "app/resources/NoPayChatLauncher";

import { SessionPaymentManager } from "lib/seguridad/SessionPaymentManager";
import BackgroundWithSideSvg from "app/resources/BackgroundWithSideSvg";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { getWizardToken } from "lib/seguridad/sessionUtils";
import {
    ExclamationTriangleIcon,
    PhotoIcon,
    InformationCircleIcon,

    DocumentTextIcon,
    DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline'; // Iconos con contorno
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
    Printer,
    RefreshCw,
    Search,
    TruckIcon,
} from "lucide-react";
import { Badge } from "components/Badge";
import React from "react";
import { getColorCode } from "utils/ColorUtils";
import { API_BASE_URL, valorImpugnacionGl } from "config/apiConfig";

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
    estado: string;
    fechaCreacion?: string;
    monto?: number;
}

interface DetalleMulta {
    registri: string; // timestamp ISO
    citacion: string; // fecha ISO
    cedula: string;
    representado: string;
    placa: string;
    marca: string;
    modelo: string;
    color: string;
    imagenCitacion: string; // URL completa
    secuenciaEstado: number;
    estadoNombre: string;
    observaciones: string;
    estadoPago: string;
}

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
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    // **Estos tres estados sirven ambos, móvil y escritorio, para mostrar el detalle real:**
    const [detalle, setDetalle] = useState<DetalleMulta[] | null>(null);
    const [detalleLoading, setDetalleLoading] = useState<boolean>(false);
    const [detalleError, setDetalleError] = useState<string | null>(null);


    const handleClick = () => {
        router.push('/Servicios/Impugnacion');
    };

    // Detectar tamaño de pantalla
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    // Obtener secuencial del usuario
    useEffect(() => {
        const wizardData = SessionWizardData.obtener();
        if (wizardData) {
            setSecuencialUser(wizardData.secuencial?.toString() || "");
        } else {
            router.replace("/login");
        }
    }, [router]);

    // Fetch de servicios para llenar la lista principal
    useEffect(() => {
        if (!secuencialUser) return;

        const fetchServicios = async () => {
            try {
                setLoading(true);
                const token = getWizardToken();
                if (!token) {
                    setError("Token de autenticación no disponible");
                    setLoading(false);
                    return;
                }

                const res = await fetch(
                    `${API_BASE_URL}/servicios-requeridos/${secuencialUser}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                //console.log(`SE LLAMA A CONSUMIR ${API_BASE_URL}/servicios-requeridos/${secuencialUser}`);

                if (res.status === 401 || res.status === 403) {
                    setError("El tiempo de sesión ha expirado. Serás redirigido al inicio.");
                    setLoading(false);
                    setTimeout(() => router.replace("/"), 3000);
                    return;
                }

                if (res.status === 404) {
                    setServicios([]);
                    setFilteredServicios([]);
                    setLoading(false);
                    return;
                }

                if (!res.ok) {
                    throw new Error("Error al obtener servicios");
                }

                const data: Servicio[] = await res.json();

                // 1) Homologación / limpieza:
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
                    // Si el backend devuelve null, que caiga a "" para no romper en toLowerCase()
                    estado: s.estado ?? "",
                    // Estas dos sólo las llenas para los KPIs, no las toma el filtro
                    fechaCreacion: s.fechaCreacion ?? new Date().toISOString().split("T")[0],
                    monto: s.monto ?? Math.floor(Math.random() * 500) + 100,
                }));

                // 2) Asignar al state:
                setServicios(normalizados);
                setFilteredServicios(normalizados);

                setLoading(false);
            } catch (err: any) {
                setError(err.message || "Error desconocido");
                setLoading(false);
            }
        };

        fetchServicios();
    }, [secuencialUser, router]);

    // **Cuando cambie expandedRow, disparar fetch del detalle real**
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
                //console.log("EMPEZAMOS");
                const res = await fetch(
                    `${API_BASE_URL}/servicios-requeridos/${expandedRow}/detalle`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }


                );
                //console.log("ASE MANDA A CONSUTLAR: " + res);

                if (res.status === 401 || res.status === 403) {
                    setDetalleError("El tiempo de sesión ha expirado. Redirigiendo…");
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

                if (!res.ok) {
                    throw new Error("Error al obtener detalle de la multa");
                }

                const data: DetalleMulta[] = await res.json();
                setDetalle(data);
                setDetalleLoading(false);
            } catch (err: any) {
                setDetalleError(err.message || "Error desconocido");
                setDetalleLoading(false);
            }
        };

        fetchDetalle();
    }, [expandedRow, router]);

    // Filtrar y ordenar servicios (igual que antes)
    useEffect(() => {
        let result = servicios;

        if (activeFilter !== "all") {
            result = result.filter((s) => {
                const estadoStr = (s.estado ?? "").toLowerCase();
                if (activeFilter === "pending") {
                    return estadoStr.includes("pendiente");
                } else if (activeFilter === "Transaction succeeded") {
                    return estadoStr.includes("confirmado") || estadoStr.includes("pagado");
                } else {
                    return (
                        !estadoStr.includes("pendiente") &&
                        !estadoStr.includes("confirmado") &&
                        !estadoStr.includes("pagado")
                    );
                }
            });
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (s) =>
                    s.placa.toLowerCase().includes(q) ||
                    s.modelo.toLowerCase().includes(q) ||
                    (s.estado ?? "").toLowerCase().includes(q) ||
                    s.agencia.toLowerCase().includes(q)
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
            if (aValue < bValue) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
    }, [filteredServicios, sortConfig]);

    // Calcular KPIs
    const totalServicios = servicios.length;
    const pendientes = servicios.filter((s) =>
        (s.estado ?? "").toLowerCase().includes("pendiente")
    ).length;
    const completados = servicios.filter(
        (s) =>
            (s.estado ?? "").toLowerCase().includes("confirmado") ||
            (s.estado ?? "").toLowerCase().includes("pagado")
    ).length;
    const otros = totalServicios - pendientes - completados;

    // Función auxiliar de fechas
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("es-ES", options);
    };

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    // Componente de tarjeta KPI reutilizable (sin cambios)
    const KpiCard = ({
        title,
        value,
        percentage,
        icon: Icon,
        colorClass,
    }: {
        title: string;
        value: number;
        percentage: string;
        icon: React.ComponentType<{ className?: string }>;
        colorClass: string;
    }) => (
        <motion.div
            whileHover={{ y: -3 }}
            className={`rounded-xl shadow-lg p-5 border backdrop-blur-sm ${colorClass}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-300">{title}</p>
                    <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                        {value}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-400">{percentage}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-700">
                    <Icon className="h-5 w-5 text-white" />
                </div>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-gray-600" />
        </motion.div>
    );

    // ────────────────────────────────────────────────────────────────────────────
    // Versión móvil de la tarjeta de servicio — ahora recibiendo props correctas
    // ────────────────────────────────────────────────────────────────────────────

    interface MobileServiceCardProps {
        servicio: Servicio;
        idx: number;
        expandedRow: number | null;
        setExpandedRow: React.Dispatch<React.SetStateAction<number | null>>;
        detalle: DetalleMulta[] | null;
        detalleLoading: boolean;
        detalleError: string | null;
        formatDate: (dateString: string) => string;
    }

    const MobileServiceCard = ({
        servicio,
        idx,
        expandedRow,
        setExpandedRow,
        detalle,
        detalleLoading,
        detalleError,
        formatDate,
    }: MobileServiceCardProps) => (
        <motion.div
            key={servicio.secuencImpu}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
            className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700 shadow-md"
            onClick={() =>
                setExpandedRow(
                    expandedRow === servicio.secuencImpu
                        ? null
                        : servicio.secuencImpu
                )
            }
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[#7F1D1D] to-[#EC4899] flex items-center justify-center text-xs font-bold">
                            {servicio.modelo.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold text-white">{servicio.modelo}</p>
                            <p className="text-xs text-gray-400">{servicio.placa}</p>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="border-gray-600 bg-gray-700 text-white text-xs"
                    >
                        #{servicio.secuencImpu}
                    </Badge>
                </div>
                <div>{(() => {
                    const pago = servicio.estado ?? "";
                    const isSucceeded = pago === "Transaction succeeded";
                    return (
                        <>
                            <Badge
                                className={`${isSucceeded
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                    } px-2 py-0.5 rounded-full text-xs`}
                            >
                                <Clock className="h-3 w-3 inline-block mr-1" />
                                {pago || "-"}
                            </Badge>

                            {!isSucceeded && (
                                <button
                                    onClick={() => {
                                        // 1. Guardar en SessionPaymentManager:
                                        SessionPaymentManager.guardar({

                                            citacion: detalle![0].citacion, // o bien toma directamente d.citacion si iteras en detalle.map
                                            item: String(servicio.modelo) + ' - ' + String(servicio.placa) + ' ', // podrías usar el ID de la multa como "ítem"
                                            servicio: detalle![0].citacion,
                                            valor: String(valorImpugnacionGl), // asegúrate de pasar el monto correcto
                                            cedula: detalle![0].cedula      // cédula obtenida del detalle
                                        });
                                        // 2. Redirigir
                                        router.push("/resumenPago");
                                    }}
                                    className="ml-2 inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md transition"
                                >
                                    Procesar Pago
                                </button>

                            )}
                        </>
                    );
                })()}

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
                        className={`${idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} rounded-lg shadow-lg overflow-hidden`}
                    >
                        <div className="p-6">
                            {/* ─────────── Loading State ─────────── */}
                            {detalleLoading ? (
                                <div className="flex justify-center py-8">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="h-10 w-10 border-4 border-gray-600 border-t-[#EC4899] rounded-full"
                                    />
                                </div>
                            ) : detalleError ? (
                                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center text-red-300 text-sm">
                                    <ExclamationTriangleIcon className="mx-auto h-6 w-6 mb-2" />
                                    {detalleError}
                                </div>
                            ) : detalle && detalle.length > 0 ? (
                                detalle.map((d, i) => (
                                    <div
                                        key={`${d.registri}-${d.cedula}-${i}`}
                                        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                                    >
                                        {/* ─── Sección Imagen ─── */}
                                        <div className="md:col-span-1">
                                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                    <PhotoIcon className="h-4 w-4 mr-2" />
                                                    Imagen de la Multa
                                                </h4>
                                                <a
                                                    href={d.imagenCitacion}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group block"
                                                >
                                                    <div className="relative overflow-hidden rounded-lg aspect-square border-2 border-gray-600 group-hover:border-pink-500 transition-colors">
                                                        <img
                                                            src={d.imagenCitacion}
                                                            alt="Multa"
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                            <span className="text-xs text-white/90">Ver en tamaño completo</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>

                                        {/* ─── Sección Información ─── */}
                                        <div className="md:col-span-2 space-y-6">
                                            {/* Información General */}
                                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                    <InformationCircleIcon className="h-4 w-4 mr-2" />
                                                    Información General
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Fecha Registro</p>
                                                        <p className="text-white font-medium text-sm">
                                                            {new Date(d.registri).toLocaleDateString("es-ES", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Fecha Citación</p>
                                                        <p className="text-white font-medium text-sm">
                                                            {new Date(d.citacion).toLocaleDateString("es-ES", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Cédula</p>
                                                        <p className="text-white font-medium text-sm">{d.cedula}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Placa</p>
                                                        <p className="text-white font-medium text-sm">{d.placa}</p>
                                                    </div>
                                                    <div className="sm:col-span-2 space-y-1">
                                                        <p className="text-gray-400 text-xs">Representado</p>
                                                        <p className="text-white font-medium text-sm">{d.representado}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Detalles del Vehículo */}
                                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                    <TruckIcon className="h-4 w-4 mr-2" />
                                                    Detalles del Vehículo
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Marca</p>
                                                        <p className="text-white font-medium text-sm">{d.marca}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Modelo</p>
                                                        <p className="text-white font-medium text-sm">{d.modelo}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Color</p>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="inline-block h-4 w-4 rounded-full border border-gray-600"
                                                                style={{ backgroundColor: getColorCode(d.color ?? "") }}
                                                            />
                                                            <span className="text-white font-medium text-sm">{d.color}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Estado y Observaciones */}
                                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                                                    Estado y Observaciones
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Estado Multa</p>
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${d.estadoNombre.toLowerCase().includes("pendiente")
                                                                ? "bg-red-600/90 text-white"
                                                                : "bg-green-600/90 text-white"
                                                                }`}
                                                        >
                                                            {d.estadoNombre}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Estado Pago</p>
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${d.estadoPago.toLowerCase().includes("pendiente")
                                                                ? "bg-yellow-600/90 text-white"
                                                                : "bg-green-600/90 text-white"
                                                                }`}
                                                        >
                                                            {d.estadoPago}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-gray-400 text-xs">Observaciones</p>
                                                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                                            <p className="text-white text-sm">
                                                                {d.observaciones || "Sin observaciones registradas"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
                                    <DocumentMagnifyingGlassIcon className="mx-auto h-8 w-8 text-gray-500 mb-3" />
                                    <p className="text-gray-400 text-sm">No hay información de detalle disponible</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <BackgroundWithSideSvg>
            <Header />
            <div className="h-20" />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ───────────────────────────────────────────────────────────── Panel Principal ───────────────────────────────────────────────────────────── */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#EC4899] mb-4">
                        ⚖️ Impugnación de Multas
                    </h2>

                    {/* Título y Acciones */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                                Gestión de Servicios
                            </h3>
                            <p className="text-gray-400 mt-1 max-w-2xl">
                                Visualiza y gestiona tus solicitudes de impugnación de multas.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
                            <button
                                onClick={handleRefresh}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                            >
                                <RefreshCw
                                    size={16}
                                    className={loading ? "animate-spin text-gray-300" : "text-gray-300"}
                                />
                                <span className="hidden sm:inline">Actualizar</span>
                            </button>

                            <button
                                onClick={handleClick}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#EC4899] to-[#7F1D1D] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                            >
                                <FileText size={16} />
                                <span className="hidden sm:inline">Nuevo Servicio</span>
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                        <KpiCard
                            title="Total"
                            value={totalServicios}
                            percentage="Histórico"
                            icon={List}
                            colorClass="bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600"
                        />
                        <KpiCard
                            title="Pendientes"
                            value={pendientes}
                            percentage={
                                totalServicios > 0
                                    ? `${Math.round((pendientes / totalServicios) * 100)}%`
                                    : "0%"
                            }
                            icon={Clock}
                            colorClass="bg-gradient-to-br from-red-600 to-red-700 border-red-500"
                        />
                        <KpiCard
                            title="Completados"
                            value={completados}
                            percentage={
                                totalServicios > 0
                                    ? `${Math.round((completados / totalServicios) * 100)}%`
                                    : "0%"
                            }
                            icon={CheckCircle2}
                            colorClass="bg-gradient-to-br from-green-600 to-green-700 border-green-500"
                        />
                        <KpiCard
                            title="Otros"
                            value={otros}
                            percentage={
                                totalServicios > 0
                                    ? `${Math.round((otros / totalServicios) * 100)}%`
                                    : "0%"
                            }
                            icon={CircleSlash}
                            colorClass="bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500"
                        />
                    </div>

                    {/* ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── Panel de Control ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden"
                    >
                        {/* Header de la tabla */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <h2 className="text-base sm:text-lg font-semibold text-white">
                                Listado de Servicios
                            </h2>

                            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
                                {/* Filtros */}
                                <div className="relative w-full sm:w-auto">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Filter className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" />
                                    </div>
                                    <select
                                        value={activeFilter}
                                        onChange={(e) => setActiveFilter(e.target.value)}
                                        className="w-full bg-gray-700 text-white rounded-lg pl-9 sm:pl-10 pr-6 sm:pr-8 py-1.5 sm:py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-[#EC4899] text-xs sm:text-sm"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="pending">Pendientes</option>
                                        <option value="completed">Completados</option>
                                        <option value="others">Otros</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                        <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Búsqueda */}
                                <div className="relative w-full sm:w-auto">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-gray-700 text-white rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 focus:outline-none focus:ring-1 focus:ring-[#EC4899] text-xs sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contenido del Panel */}
                        {loading ? (
                            <div className="p-8 sm:p-10 flex justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="h-8 sm:h-10 w-8 sm:w-10 border-4 border-gray-600 border-t-[#EC4899] rounded-full"
                                />
                            </div>
                        ) : error ? (
                            <div className="p-4 sm:p-6 text-center">
                                <div className="inline-flex items-center gap-2 bg-red-900/30 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-red-800/50 text-sm">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            </div>
                        ) : sortedServicios.length === 0 ? (
                            <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center">
                                <FileText className="h-8 sm:h-10 w-8 sm:w-10 text-gray-400 mb-2 sm:mb-3" />
                                <h3 className="text-gray-400 font-medium text-sm sm:text-base">
                                    No se encontraron servicios
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                    Ajusta tus filtros de búsqueda
                                </p>
                            </div>
                        ) : isMobile ? (
                            /* ───────────────────────────────────────────────────────────────────── Cada item móvil ───────────────────────────────────────────────────────────────────── */
                            <div className="p-3 sm:p-4">
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
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* ──────────────────────────────────────────────────────────────────── Vista de escritorio: tabla ──────────────────────────────────────────────────────────────────── */
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="w-16 px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => requestSort("secuencImpu")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    ID
                                                    {sortConfig?.key === "secuencImpu" && (
                                                        sortConfig.direction === "ascending" ? (
                                                            <ChevronUp className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        ) : (
                                                            <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        )
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="w-20 px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => requestSort("placa")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Placa
                                                    {sortConfig?.key === "placa" && (
                                                        sortConfig.direction === "ascending" ? (
                                                            <ChevronUp className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        ) : (
                                                            <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        )
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="w-48 px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => requestSort("modelo")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Vehículo
                                                    {sortConfig?.key === "modelo" && (
                                                        sortConfig.direction === "ascending" ? (
                                                            <ChevronUp className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        ) : (
                                                            <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        )
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="w-32 px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => requestSort("agencia")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Agencia
                                                    {sortConfig?.key === "agencia" && (
                                                        sortConfig.direction === "ascending" ? (
                                                            <ChevronUp className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        ) : (
                                                            <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        )
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="w-24 px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => requestSort("estado")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Estado
                                                    {sortConfig?.key === "estado" && (
                                                        sortConfig.direction === "ascending" ? (
                                                            <ChevronUp className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        ) : (
                                                            <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4 text-gray-300" />
                                                        )
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="w-20 px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider"
                                            >
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                                        {sortedServicios.map((servicio, idx) => (
                                            <React.Fragment key={servicio.secuencImpu}>
                                                {/* ───────────────────────── Fila principal ───────────────────────── */}
                                                <motion.tr
                                                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                                                    className={
                                                        idx % 2 === 0
                                                            ? "bg-gray-800 border-b border-gray-700"
                                                            : "bg-gray-700 border-b border-gray-600"
                                                    }
                                                    onClick={() =>
                                                        setExpandedRow(
                                                            expandedRow === servicio.secuencImpu
                                                                ? null
                                                                : servicio.secuencImpu
                                                        )
                                                    }
                                                >
                                                    <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white">
                                                        #{servicio.secuencImpu}
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-200">
                                                        <Badge
                                                            variant="outline"
                                                            className="border-gray-600 bg-gray-700 text-white text-xs sm:text-sm"
                                                        >
                                                            {servicio.placa}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-white">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[#7F1D1D] to-[#EC4899] flex items-center justify-center text-xs font-bold">
                                                                {servicio.modelo.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white">{servicio.modelo}</span>
                                                                <span className="text-gray-400 text-xs">
                                                                    {servicio.color}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-300">
                                                        {servicio.agencia}
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                                                        {servicio.estado.toLowerCase().includes("pendiente") ? (
                                                            <Badge className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                                                                <Clock className="h-3 w-3 inline-block mr-1" />
                                                                {servicio.estado}
                                                            </Badge>
                                                        ) : servicio.estado
                                                            .toLowerCase()
                                                            .includes("confirmado") ||
                                                            servicio.estado.toLowerCase().includes("pagado") ? (
                                                            <Badge className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                                                                <CheckCircle2 className="h-3 w-3 inline-block mr-1" />
                                                                {servicio.estado}
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-gray-500 text-white px-2 py-0.5 rounded-full text-xs">
                                                                <CircleSlash className="h-3 w-3 inline-block mr-1" />
                                                                {servicio.estado}
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm font-medium text-gray-300">
                                                        <button
                                                            className="text-gray-400 hover:text-gray-100 transition"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Aquí podrías abrir un menú de acciones
                                                            }}
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </motion.tr>

                                                {/* ───────────────────────── Fila expandida ───────────────────────── */}
                                                <AnimatePresence>
                                                    {expandedRow === servicio.secuencImpu && (
                                                        <motion.tr
                                                            key={`expanded-${servicio.secuencImpu}`}
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className={`${idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} !border-b-0`}
                                                        >
                                                            <td colSpan={6} className="px-4 py-3">
                                                                <div className="p-4">
                                                                    {/* ─────────── Estados de carga ─────────── */}
                                                                    {detalleLoading ? (
                                                                        <div className="flex justify-center py-8">
                                                                            <motion.div
                                                                                animate={{ rotate: 360 }}
                                                                                transition={{
                                                                                    duration: 1.5,
                                                                                    repeat: Infinity,
                                                                                    ease: "linear",
                                                                                }}
                                                                                className="h-10 w-10 border-4 border-gray-600 border-t-[#EC4899] rounded-full"
                                                                            />
                                                                        </div>
                                                                    ) : detalleError ? (
                                                                        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center text-red-300 text-sm">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={1.5}
                                                                                stroke="currentColor"
                                                                                className="mx-auto h-6 w-6 mb-2"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                                                                />
                                                                            </svg>
                                                                            {detalleError}
                                                                        </div>
                                                                    ) : detalle && detalle.length > 0 ? (
                                                                        detalle.map((d, i) => (
                                                                            <div
                                                                                key={`${d.registri}-${d.cedula}-${i}`}
                                                                                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                                                                            >
                                                                                {/* ─── Columna Imagen (3 columnas) ─── */}
                                                                                <div className="lg:col-span-3">
                                                                                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 h-full">
                                                                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                strokeWidth={1.5}
                                                                                                stroke="currentColor"
                                                                                                className="h-4 w-4 mr-2"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                                                                                />
                                                                                            </svg>
                                                                                            Imagen de la Multa
                                                                                        </h4>
                                                                                        <a
                                                                                            href={d.imagenCitacion}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="group block"
                                                                                        >
                                                                                            <div className="relative overflow-hidden rounded-lg aspect-square border-2 border-gray-600 group-hover:border-pink-500 transition-colors">
                                                                                                <img
                                                                                                    src={d.imagenCitacion}
                                                                                                    alt="Multa"
                                                                                                    className="absolute inset-0 w-full h-full object-cover"
                                                                                                />
                                                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                                                                    <span className="text-xs text-white/90">Ver en tamaño completo</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </a>
                                                                                        <p className="mt-2 text-xs text-center text-gray-400">
                                                                                            Haz clic para ampliar
                                                                                        </p>
                                                                                    </div>
                                                                                </div>

                                                                                {/* ─── Columna Información (5 columnas) ─── */}
                                                                                <div className="lg:col-span-5">
                                                                                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 h-full">
                                                                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                strokeWidth={1.5}
                                                                                                stroke="currentColor"
                                                                                                className="h-4 w-4 mr-2"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                                                                                />
                                                                                            </svg>
                                                                                            Información General
                                                                                        </h4>
                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Fecha Registro</p>
                                                                                                <p className="text-white font-medium text-sm">
                                                                                                    {new Date(d.registri).toLocaleDateString("es-ES", {
                                                                                                        year: "numeric",
                                                                                                        month: "short",
                                                                                                        day: "numeric",
                                                                                                    })}
                                                                                                </p>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Fecha Citación</p>
                                                                                                <p className="text-white font-medium text-sm">
                                                                                                    {new Date(d.citacion).toLocaleDateString("es-ES", {
                                                                                                        year: "numeric",
                                                                                                        month: "short",
                                                                                                        day: "numeric",
                                                                                                    })}
                                                                                                </p>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Cédula</p>
                                                                                                <p className="text-white font-medium text-sm">{d.cedula}</p>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Placa</p>
                                                                                                <p className="text-white font-medium text-sm">{d.placa}</p>
                                                                                            </div>
                                                                                            <div className="md:col-span-2 space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Representado</p>
                                                                                                <p className="text-white font-medium text-sm">{d.representado}</p>
                                                                                            </div>
                                                                                        </div>

                                                                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-3 flex items-center">
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                strokeWidth={1.5}
                                                                                                stroke="currentColor"
                                                                                                className="h-4 w-4 mr-2"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                                                                                />
                                                                                            </svg>
                                                                                            Detalles del Vehículo
                                                                                        </h4>
                                                                                        <div className="grid grid-cols-3 gap-4">
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Marca</p>
                                                                                                <p className="text-white font-medium text-sm">{d.marca}</p>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Modelo</p>
                                                                                                <p className="text-white font-medium text-sm">{d.modelo}</p>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Color</p>
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span
                                                                                                        className="inline-block h-4 w-4 rounded-full border border-gray-600"
                                                                                                        style={{ backgroundColor: getColorCode(d.color ?? "") }}
                                                                                                    />
                                                                                                    <span className="text-white font-medium text-sm">{d.color}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* ─── Columna Estado (4 columnas) ─── */}
                                                                                {/* ─── Columna Estado y Observaciones (escritorio) ─── */}
                                                                                <div className="lg:col-span-4">
                                                                                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 h-full">
                                                                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                strokeWidth={1.5}
                                                                                                stroke="currentColor"
                                                                                                className="h-4 w-4 mr-2"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                                                                />
                                                                                            </svg>
                                                                                            Estado y Observaciones
                                                                                        </h4>
                                                                                        <div className="space-y-4">
                                                                                            {/* ─ Estado Multa (se conserva igual) ─ */}
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Estado Multa</p>
                                                                                                <span
                                                                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${(d.estadoNombre ?? "").toLowerCase().includes("pendiente")
                                                                                                        ? "bg-red-600/90 text-white"
                                                                                                        : "bg-green-600/90 text-white"
                                                                                                        }`}
                                                                                                >
                                                                                                    {d.estadoNombre || "-"}
                                                                                                </span>
                                                                                            </div>

                                                                                            {/* ─ Nuevo Bloque: Estado Pago con banderas verde/roja y botón ─ */}
                                                                                            <div className="space-y-1 flex items-center justify-between">
                                                                                                <div>
                                                                                                    <p className="text-gray-400 text-xs">Estado Pago</p>
                                                                                                    <span
                                                                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${d.estadoPago === "Transaction succeeded"
                                                                                                            ? "bg-green-600/90 text-white"
                                                                                                            : "bg-red-600/90 text-white"
                                                                                                            }`}
                                                                                                    >
                                                                                                        {d.estadoPago || "-"}
                                                                                                    </span>
                                                                                                </div>

                                                                                                {/* Si el estado pago NO es "Transaction succeeded", mostramos botón */}
                                                                                                {d.estadoPago !== "Transaction succeeded" && (
                                                                                                    <button
                                                                                                        onClick={() => {
                                                                                                            // 1. Guardar en SessionPaymentManager:
                                                                                                            SessionPaymentManager.guardar({
                                                                                                                citacion: "0",
                                                                                                                item: String(servicio.modelo) + ' - ' + String(servicio.placa) + ' ', // podrías usar el ID de la multa como "ítem"
                                                                                                                servicio: String(servicio.secuencImpu),
                                                                                                                valor: String(valorImpugnacionGl),
                                                                                                                cedula: d.cedula                // cédula del usuario
                                                                                                            });
                                                                                                            // 2. Redirigir a /ResumenPago
                                                                                                            router.push("/resumenPago");
                                                                                                        }}
                                                                                                        className="ml-4 inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-md transition"
                                                                                                    >
                                                                                                        Procesar Pago
                                                                                                    </button>

                                                                                                )}
                                                                                            </div>

                                                                                            {/* ─ Observaciones ─ */}
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-gray-400 text-xs">Observaciones</p>
                                                                                                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                                                                                    <p className="text-white text-sm">
                                                                                                        {d.observaciones || "Sin observaciones registradas"}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={1.5}
                                                                                stroke="currentColor"
                                                                                className="mx-auto h-8 w-8 text-gray-500 mb-3"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                                                                />
                                                                            </svg>
                                                                            <p className="text-gray-400 text-sm">No hay información de detalle disponible</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    )}
                                                </AnimatePresence>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* Footer a ancho completo */}
            <footer className="w-full bg-gradient-to-r from-[#EC4899] to-[#F59E0B]">
                <Footer />
            </footer>

            <NoPayChatLauncher />
        </BackgroundWithSideSvg>
    );
}
