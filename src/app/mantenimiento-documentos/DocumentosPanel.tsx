"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Settings } from 'lucide-react';
import { getWizardToken } from 'lib/seguridad/sessionUtils';
import { API_BASE_URL } from 'config/apiConfig';

interface Documento {
    id: number;
    secuencial: number;
    nombre: string;
    descripcion: string;
    estaactivo: number;
    fechacrea: string;
    usuariocrea: string;
}

interface DocumentosPanelProps {
    searchQuery: string;
    onError: (error: string | null) => void;
    onNuevoDocumento: () => void;
}

export const DocumentosPanel = ({
    searchQuery,
    onError,
    onNuevoDocumento
}: DocumentosPanelProps) => {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [docEnEdicion, setDocEnEdicion] = useState<Documento | null>(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cargando, setCargando] = useState(false);

    const cargarDocumentos = async () => {
        try {
            const token = getWizardToken();
            const response = await fetch(`${API_BASE_URL}/documentos`, {
                headers: {
                    'Authorization': `Bearer ${token || ''}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            setDocumentos(data);
        } catch (error) {
            //console.error("Error al cargar documentos:", error);
            onError('Error al cargar documentos');
        }
    };

    const iniciarEdicion = (doc: Documento) => {
        setModoEdicion(true);
        setDocEnEdicion(doc);
        setNombre(doc.nombre);
        setDescripcion(doc.descripcion);
    };

    const actualizarDocumento = async () => {

        if (!nombre.trim()) {
            onError("El nombre no puede estar vacío.");
            return;
        }
        if (!docEnEdicion) return;
        setCargando(true);

        try {
            const token = getWizardToken();
            const response = await fetch(`${API_BASE_URL}/documentos/${docEnEdicion.secuencial}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    usuariocrea: docEnEdicion.usuariocrea,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                onError('Error actualizando: ' + text);
                return;
            }

            setModoEdicion(false);
            setNombre('');
            setDescripcion('');
            setDocEnEdicion(null);
            await cargarDocumentos();
            onNuevoDocumento();
        } catch (e: any) {
            onError('Error al actualizar: ' + e.message);
        } finally {
            setCargando(false);
        }
    };

    const desactivarDocumento = async (id: number) => {
        const token = getWizardToken();

        try {
            const response = await fetch(`${API_BASE_URL}/documentos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const text = await response.text();
                onError('Error al desactivar: ' + text);
                return;
            }

            await cargarDocumentos();
            onNuevoDocumento();
        } catch (e: any) {
            onError('Error al desactivar documento: ' + e.message);
        }
    };

    useEffect(() => {
        cargarDocumentos();
    }, []);

    const documentosFiltrados = documentos.filter(doc =>
        doc.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.section
            key="documentos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Formulario de edición */}
            {modoEdicion && (
                <div className="w-full space-y-4 bg-white/5 p-5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">Editar Documento</h3>
                    <input
                        type="text"
                        value={nombre}

                        placeholder="Nombre del documento"
                        onChange={(e) => setNombre(e.target.value.toUpperCase())}
                        className="uppercase w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                    />
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
                        placeholder="Descripción"
                        className="uppercase w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={actualizarDocumento}
                            disabled={cargando}
                            className="px-6 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition-all text-sm font-semibold disabled:opacity-50"
                        >
                            {cargando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button
                            onClick={() => {
                                setModoEdicion(false);
                                setDocEnEdicion(null);
                                setNombre('');
                                setDescripcion('');
                            }}
                            className="px-6 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 transition-all text-sm font-semibold"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Listado de documentos */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FileText className="text-[#F59E0B]" />
                    Catálogo de Documentos
                </h2>
                <button className="text-sm flex items-center gap-1 text-white/70 hover:text-white">
                    <Settings className="w-4 h-4" />
                    Configuración
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentosFiltrados.map((doc) => (
                    <motion.div
                        key={doc.secuencial}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-5 border border-white/10 hover:border-[#EC4899]/30 transition-all shadow-md"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg">{doc.nombre}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${doc.estaactivo === 1 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                {doc.estaactivo === 1 ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        <p className="text-sm text-white/70 mb-4">{doc.descripcion}</p>
                        <div className="flex gap-2">
                            <button
                                className="text-xs px-3 py-1 bg-white/10 rounded-lg hover:bg-[#EC4899] transition-colors"
                                onClick={() => iniciarEdicion(doc)}
                            >
                                Editar
                            </button>
                            <button
                                className="text-xs px-3 py-1 bg-white/10 rounded-lg hover:bg-red-500/50 transition-colors"
                                onClick={() => desactivarDocumento(doc.secuencial)}
                            >
                                {doc.estaactivo === 1 ? "Desactivar" : "Activar"}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};