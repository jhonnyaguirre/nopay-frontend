'use client';

import { useEffect, useState } from 'react';
import { UploadCloud, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import {  getWizardToken } from 'lib/seguridad/sessionUtils';
import { API_BASE_URL } from 'config/apiConfig';

interface DocumentoRequerido {
  secuencial: number;
  nombre: string;
  lado: 'frontal' | 'reverso' | 'único';
}

interface Props {
  secuencialUsuario: number;
  secuencialServicio: number;
  onClose: () => void;
}

const CargaDocumentosPorServicio = ({ secuencialUsuario, secuencialServicio, onClose }: Props) => {
  const [documentosRequeridos, setDocumentosRequeridos] = useState<DocumentoRequerido[]>([]);
  const [archivos, setArchivos] = useState<{ [key: string]: File | null }>({});
  const [estado, setEstado] = useState<{ [key: string]: 'pendiente' | 'subiendo' | 'exito' | 'error' }>({});

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
          const token = getWizardToken();

        const response = await axios.get(
          `${API_BASE_URL}/documentos/por-servicio/${secuencialServicio}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', // Si es necesario
              'X-NoPay-App': 'true' // 👈 Puedes agregar otros headers personalizados aquí
            }
          }
        );

        setDocumentosRequeridos(response.data);
      } catch (error) {
        //console.error('Error al obtener documentos requeridos:', error);
      }
    };
    fetchDocumentos();
  }, [secuencialServicio]);

  const handleArchivoChange = (doc: DocumentoRequerido, file: File | null) => {
    const key = `${doc.secuencial}_${doc.lado}`;
    setArchivos((prev) => ({ ...prev, [key]: file }));
    setEstado((prev) => ({ ...prev, [key]: 'pendiente' }));
  };

  const subirArchivo = async (doc: DocumentoRequerido) => {
    const key = `${doc.secuencial}_${doc.lado}`;
    const archivo = archivos[key];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('secuencial_usuario', secuencialUsuario.toString());
    formData.append('secuencial_documento', doc.secuencial.toString());
    formData.append('lado', doc.lado);
    formData.append('usuariocrea', 'admin');
    formData.append('file', archivo);

    setEstado((prev) => ({ ...prev, [key]: 'subiendo' }));

    try {
      await axios.post(`${API_BASE_URL}/usuario-documentos/upload`, formData, {
        headers: {
          'Authorization': localStorage.getItem('wizardToken') || '',
          'Content-Type': 'multipart/form-data',
        },
      });
      setEstado((prev) => ({ ...prev, [key]: 'exito' }));
    } catch (error) {
      //console.error('Error al subir archivo:', error);
      setEstado((prev) => ({ ...prev, [key]: 'error' }));
    }
  };

  const todosSubidos = Object.values(estado).every((val) => val === 'exito');

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-gray-800 max-w-3xl mx-auto my-6">
      <h3 className="text-xl font-bold mb-4">Carga de Documentos Requeridos</h3>

      {documentosRequeridos.map((doc, index) => {
        const key = `${doc.secuencial}_${doc.lado}`;
        const estadoActual = estado[key];
        return (
          <div key={index} className="mb-4 border p-4 rounded-lg">
            <p className="mb-2 font-semibold">{doc.nombre} ({doc.lado})</p>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleArchivoChange(doc, e.target.files?.[0] || null)}
              className="mb-2"
            />

            {archivos[key] && estadoActual !== 'exito' && (
              <button
                onClick={() => subirArchivo(doc)}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                <UploadCloud className="inline mr-1" size={16} /> Subir
              </button>
            )}

            {estadoActual === 'subiendo' && <Loader2 className="text-yellow-500 animate-spin ml-2 inline" />}
            {estadoActual === 'exito' && <CheckCircle className="text-green-500 ml-2 inline" />}
            {estadoActual === 'error' && <XCircle className="text-red-500 ml-2 inline" />}
          </div>
        );
      })}

      <div className="flex justify-between mt-6">
        <button onClick={onClose} className="text-gray-600 hover:text-black">Cancelar</button>
        {todosSubidos && (
          <button
            onClick={onClose}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
};

export default CargaDocumentosPorServicio;
