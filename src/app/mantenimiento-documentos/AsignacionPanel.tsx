"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getWizardToken } from "lib/seguridad/sessionUtils";
import { LinkIcon, Settings } from "lucide-react";
import { API_BASE_URL } from "config/apiConfig";

interface Servicio {
    secuencial: number;
    nombre: string;
}

interface Documento {
    secuencial: number;
    nombre: string;
}

interface Asignacion {
    secuencial: number;
    secuencialServicio: number;
    secuencialDocumento: number;
    fechacrea: string;
    usuariocrea: string;
    estaactivo: number;
}

interface Props {
    onError: (msg: string | null) => void;
    onNuevaAsignacion: () => void;
}

export const AsignacionPanel = ({ onError, onNuevaAsignacion }: Props) => {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);

    const [servicioSel, setServicioSel] = useState("");
    const [documentoSel, setDocumentoSel] = useState("");
    const [cargando, setCargando] = useState(false);

    const cargarDatos = async () => {
        try {
            const token = getWizardToken();

            const [resServ, resDoc, resAsig] = await Promise.all([
                fetch(`${API_BASE_URL}/servicios`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/documentos`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/servicio-documentos`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const serv = await resServ.json();
            const doc = await resDoc.json();
            const asig = await resAsig.json();

            setServicios(serv);
            setDocumentos(doc);
            setAsignaciones(asig);
        } catch {
            onError("Error al cargar datos.");
        }
    };

    const guardarAsignacion = async () => {
        if (!servicioSel || !documentoSel) {
            onError("Selecciona un servicio y un documento.");
            return;
        }

        setCargando(true);
        try {
            const token = getWizardToken();
            const res = await fetch(`${API_BASE_URL}/servicio-documentos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    secuencialServicio: parseInt(servicioSel),
                    secuencialDocumento: parseInt(documentoSel),
                    usuariocrea: "admin"
                })
            });

            if (res.status === 409) {
                onError("Esta asignación ya existe.");
                return;
            }

            if (!res.ok) {
                throw new Error("No se pudo crear.");
            }

            setServicioSel("");
            setDocumentoSel("");
            await cargarDatos();
            onNuevaAsignacion();
        } catch {
            onError("Error al guardar asignación.");
        } finally {
            setCargando(false);
        }
    };

    const desactivarAsignacion = async (id: number) => {
        try {
            const token = getWizardToken();
            await fetch(`${API_BASE_URL}/servicio-documentos/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await cargarDatos();
        } catch {
            onError("Error al desactivar asignación.");
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const obtenerNombreServicio = (id: number) => {
        return servicios.find((s) => s.secuencial === id)?.nombre || `Servicio ID: ${id}`;
    };

    const obtenerNombreDocumento = (id: number) => {
        return documentos.find((d) => d.secuencial === id)?.nombre || `Documento ID: ${id}`;
    };


    return (
        <motion.section className="space-y-6">
            {/* Panel de asignación */}
            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Nueva Asignación Servicio-Documento</h3>

                <select
                    value={servicioSel}
                    onChange={(e) => setServicioSel(e.target.value)}
                    className="w-full mb-3 p-2 bg-white/10 text-black rounded-lg uppercase"
                >
                    <option value="">Seleccione un Servicio</option>
                    {servicios.map(s => (
                        <option key={s.secuencial} value={s.secuencial}>
                            {s.nombre}
                        </option>
                    ))}
                </select>

                <select
                    value={documentoSel}
                    onChange={(e) => setDocumentoSel(e.target.value)}
                    className="w-full mb-3 p-2 bg-white/10 text-black rounded-lg uppercase"
                >
                    <option value="">Seleccione un Documento</option>
                    {documentos.map(d => (
                        <option key={d.secuencial} value={d.secuencial}>
                            {d.nombre}
                        </option>
                    ))}
                </select>

                <button
                    onClick={guardarAsignacion}
                    disabled={cargando}
                    className="bg-gradient-to-r from-[#EC4899] to-[#F59E0B] px-6 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                    {cargando ? "Guardando..." : "Guardar Asignación"}
                </button>
            </div>

            {/* Título principal */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <LinkIcon className="text-[#F59E0B]" />
                    Relación Servicio - Documento
                </h2>
                <button className="text-sm flex items-center gap-1 text-white/70 hover:text-white">
                    <Settings className="w-4 h-4" />
                    Configuración
                </button>
            </div>

            {/* Agrupación por servicio */}
            <div className="space-y-6">
                {servicios.map((serv) => {
                    const relacionados = asignaciones.filter(
                        (a) => a.secuencialServicio === serv.secuencial && a.estaactivo === 1
                    );

                    if (relacionados.length === 0) return null;

                    return (
                        <div
                            key={serv.secuencial}
                            className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3"
                        >
                            <h3 className="text-xl font-bold uppercase text-yellow-300">{serv.nombre}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {relacionados.map((a) => (
                                    <motion.div
                                        key={a.secuencial}
                                        whileHover={{ y: -3 }}
                                        className="bg-white/10 text-white rounded-xl p-4 border border-white/10"
                                    >
                                        <p className="font-semibold mb-2">
                                            {obtenerNombreDocumento(a.secuencialDocumento)}
                                        </p>
                                        <button
                                            onClick={() => desactivarAsignacion(a.secuencial)}
                                            className="bg-red-500/20 text-sm px-4 py-1 rounded-lg hover:bg-red-500/40"
                                        >
                                            Desactivar
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );


};
