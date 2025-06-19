"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Briefcase } from "lucide-react";
import { getWizardToken } from "lib/seguridad/sessionUtils";
import { API_BASE_URL } from "config/apiConfig";

interface Servicio {
    secuencial: number;
    nombre: string;
    descripcion: string;
    fechacrea: string;
    usuariocrea: string;
    estaactivo: number;
}

interface ServiciosPanelProps {
    searchQuery: string;
    onError: (msg: string | null) => void;
    onNuevoServicio: () => void;
}

export const ServiciosPanel = ({
    searchQuery,
    onError,
    onNuevoServicio
}: ServiciosPanelProps) => {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [servicioEnEdicion, setServicioEnEdicion] = useState<Servicio | null>(null);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [cargando, setCargando] = useState(false);

    const cargarServicios = async () => {
        try {
            const token = getWizardToken();
            const res = await fetch(`${API_BASE_URL}/servicios`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setServicios(data);
        } catch (e) {
            onError("Error al cargar servicios");
        }
    };

    useEffect(() => {
        cargarServicios();
    }, []);

    const iniciarEdicion = (servicio: Servicio) => {
        setModoEdicion(true);
        setServicioEnEdicion(servicio);
        setNombre(servicio.nombre);
        setDescripcion(servicio.descripcion);
    };

    const cancelar = () => {
        setModoEdicion(false);
        setServicioEnEdicion(null);
        setNombre("");
        setDescripcion("");
    };

    const crearServicio = async () => {
        if (!nombre.trim()) return onError("El nombre es obligatorio.");

        setCargando(true);
        const token = getWizardToken();
        try {
            const res = await fetch(`${API_BASE_URL}/servicios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    usuariocrea: "admin"
                })
            });

            if (!res.ok) throw new Error("Error al crear servicio");

            await cargarServicios();
            setNombre("");
            setDescripcion("");
            onNuevoServicio();
        } catch (e) {
            onError("Error al crear servicio");
        } finally {
            setCargando(false);
        }
    };


    const actualizarServicio = async () => {
        if (!servicioEnEdicion) return;
        setCargando(true);
        const token = getWizardToken();
        try {
            const res = await fetch(`${API_BASE_URL}/servicios/${servicioEnEdicion.secuencial}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    usuariocrea: servicioEnEdicion.usuariocrea
                })
            });

            if (!res.ok) throw new Error("Error al actualizar");

            await cargarServicios();
            cancelar();
            onNuevoServicio();
        } catch (e) {
            onError("Error al actualizar servicio");
        } finally {
            setCargando(false);
        }
    };

    const desactivarServicio = async (id: number) => {
        const token = getWizardToken();
        try {
            await fetch(`${API_BASE_URL}/servicios/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await cargarServicios();
        } catch (e) {
            onError("Error al desactivar");
        }
    };

    const filtrados = servicios.filter((s) =>
        s.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.section className="space-y-6">
            {modoEdicion && (
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold mb-2">Editar Servicio</h3>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value.toUpperCase())}
                        placeholder="Nombre del servicio"
                        className="uppercase w-full px-4 py-2 mb-2 rounded-lg bg-white/10 text-white"
                    />
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
                        placeholder="Descripción"
                        className="uppercase w-full px-4 py-2 mb-4 rounded-lg bg-white/10 text-white"
                    />
                    <div className="flex gap-2">
                        <button onClick={actualizarServicio} className="bg-yellow-500 px-4 py-2 rounded-lg">
                            Guardar
                        </button>
                        <button onClick={cancelar} className="bg-gray-600 px-4 py-2 rounded-lg">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {!modoEdicion && (
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold mb-2">Nuevo Servicio</h3>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value.toUpperCase())}
                        placeholder="Nombre del servicio"
                        className="uppercase w-full px-4 py-2 mb-2 rounded-lg bg-white/10 text-white"
                    />
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
                        placeholder="Descripción"
                        className="uppercase w-full px-4 py-2 mb-4 rounded-lg bg-white/10 text-white"
                    />
                    <button
                        onClick={crearServicio}
                        className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                        Guardar Servicio
                    </button>
                </div>
            )}


            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Briefcase className="text-[#F59E0B]" />
                    Catálogo de Servicios
                </h2>
                <button className="text-sm flex items-center gap-1 text-white/70 hover:text-white">
                    <Settings className="w-4 h-4" />
                    Configuración
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtrados.map((s) => (
                    <motion.div
                        key={s.secuencial}
                        whileHover={{ y: -5 }}
                        className="bg-white/10 rounded-xl p-5 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg">{s.nombre}</h3>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${s.estaactivo === 1
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                    }`}
                            >
                                {s.estaactivo === 1 ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        <p className="text-sm text-white/70 mb-4">{s.descripcion}</p>
                        <div className="flex gap-2">
                            <button onClick={() => iniciarEdicion(s)} className="bg-white/10 px-3 py-1 rounded-lg">
                                Editar
                            </button>
                            <button
                                onClick={() => desactivarServicio(s.secuencial)}
                                className="bg-red-500/20 px-3 py-1 rounded-lg"
                            >
                                {s.estaactivo === 1 ? "Desactivar" : "Activar"}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};
