"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Layers3, Link2, Plus, Search, Settings, FileText, Box, Link as LinkIcon } from 'lucide-react';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import {  getWizardToken } from 'lib/seguridad/sessionUtils';
import { DocumentosPanel } from './DocumentosPanel';
import { ServiciosPanel } from './ServiciosPanel';
import { AsignacionPanel } from './AsignacionPanel';

import { useRouter } from 'next/navigation';
import { API_BASE_URL } from 'config/apiConfig';

export default function MantenimientoDocumentos() {
    const [tab, setTab] = useState("documentos");
    const [searchQuery, setSearchQuery] = useState("");
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaDescripcion, setNuevaDescripcion] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState(false);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { key: "documentos", label: "Documentos", icon: <FileText className="w-5 h-5" /> },
        { key: "servicios", label: "Servicios", icon: <Box className="w-5 h-5" /> },
        { key: "asignacion", label: "Asignación", icon: <LinkIcon className="w-5 h-5" /> },
    ];


    const crearDocumento = async () => {
        setCargando(true);
        setError(null);
        setExito(false);

        try {
            const token = getWizardToken();
            const response = await fetch(`${API_BASE_URL}/documentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || ''}`,
                },
                body: JSON.stringify({
                    nombre: nuevoNombre,
                    descripcion: nuevaDescripcion,
                    usuariocrea: 'admin',
                }),
            });

            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setError(data.error || 'Error al crear documento');
                } else {
                    const text = await response.text();
                    setError('Error del servidor: ' + text);
                }
                return;
            }

            setExito(true);
            setNuevoNombre('');
            setNuevaDescripcion('');
        } catch (e: any) {
            setError('Error de red o del servidor: ' + e.message);
        } finally {
            setCargando(false);
        }
    };

    const router = useRouter();
    const handleNuevoDocumento = () => {
        setExito(true);
        setTimeout(() => setExito(false), 2000);
    };

    useEffect(() => {
        const token = getWizardToken();
        if (!token) {
          router.replace('/login');
        } else {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
              router.replace('/login');
            } else {
              setLoading(false);
            }
          } catch (e) {
            router.replace('/login');
          }
        }
      }, []);



    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (exito) {
            const timer = setTimeout(() => {
                setExito(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [exito]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#1a0a0a] via-[#7F1D1D] to-[#EC4899] text-white font-sans">
            
            <Header />

            <section className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">
                        Panel de Administración
                    </h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Gestiona los documentos, servicios y sus relaciones de forma intuitiva
                    </p>
                </motion.div>

                <div className="flex justify-center mb-10">
                    <div className="flex gap-1 bg-black/20 rounded-xl p-1 backdrop-blur-sm shadow-lg border border-white/10">
                        {tabs.map((t) => (
                            <motion.button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex flex-col items-center px-6 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${tab === t.key
                                    ? 'bg-gradient-to-br from-[#EC4899] to-[#F59E0B] shadow-md'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                            >
                                <div className="mb-1">{t.icon}</div>
                                <span>{t.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <motion.div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:border-transparent placeholder-white/50"
                        />
                    </div>
                </motion.div>

                {/* Formulario de creación */}
                {tab === "documentos" && (
                    <div className="w-full mt-6 space-y-4 bg-white/5 p-5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-2">Nuevo Documento</h3>
                        <input
                            type="text"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            placeholder="Nombre del documento"
                            className="uppercase w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                        />
                        <textarea
                            value={nuevaDescripcion}
                            onChange={(e) => setNuevaDescripcion(e.target.value)}
                            placeholder="Descripción"
                            className="uppercase w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                        />
                        <button
                            onClick={crearDocumento}
                            disabled={cargando}
                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#F59E0B] hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50"
                        >
                            {cargando ? 'Guardando...' : 'Guardar Documento'}
                        </button>
                    </div>
                )}


                {/* Mensajes de estado */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {exito && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-lg text-center"
                    >
                        Operación realizada con éxito!
                    </motion.div>
                )}

                {/* Contenedor principal del panel */}
                <motion.div
                    className="rounded-xl bg-white/5 backdrop-blur-lg p-6 shadow-2xl border border-white/10 mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <AnimatePresence mode="wait">
                        {tab === "documentos" && (
                            <DocumentosPanel
                                searchQuery={searchQuery}
                                onError={setError}
                                onNuevoDocumento={handleNuevoDocumento}
                            />
                        )}
                        {tab === "servicios" && (
                            <ServiciosPanel
                                searchQuery={searchQuery}
                                onError={setError}
                                onNuevoServicio={handleNuevoDocumento} // puedes renombrar a `handleNuevoServicio` si prefieres
                            />
                        )}
                        {tab === "asignacion" && (
                            <AsignacionPanel
                                onError={setError}
                                onNuevaAsignacion={() => setExito(true)}
                            />
                        )}


                    </AnimatePresence>
                </motion.div>
            </section>

            <NoPayChatLauncher />
            <Footer />
        </main>
    );
}