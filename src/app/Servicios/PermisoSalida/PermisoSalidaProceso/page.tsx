'use client';

import type { ReactNode } from 'react';
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Fingerprint,
  Search,
  ShieldCheck,
  Wallet,
  MapPin,
  Users,
  FileText,
  CheckCircle2,
  Sparkles,
  Plane,
  Info,
  Phone,
  Globe2,
  UserCheck,
  Building2,
  CalendarDays,
  Home,
  BadgeCheck, 
  Baby, // <--- AGREGAR ESTO
  User  // <--- AGREGAR ESTO
} from 'lucide-react';

import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import { getWizardToken } from 'lib/seguridad/sessionUtils';
import { isJWTValid, useLogout } from 'lib/seguridad/prevalidadorToken';
import { API_BASE_URL, valorPermisoSalida } from "config/apiConfig";

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const SILUETAS = {
  MENOR: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="h-full w-full">
      <circle cx="12" cy="8" r="5" />
      <path d="M8 15c-2 0-4 2-4 5v1h16v-1c0-3-2-5-4-5H8Z" />
    </svg>
  ),
  PADRE: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="h-full w-full">
      <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4Z" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  ),
  MADRE: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="h-full w-full">
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21l2-9c.3-1.5 1.5-2.5 3-2.5h2c1.5 0 2.7 1 3 2.5l2 9H6z" />
    </svg>
  )
};
const SessionPaymentManager = {
  guardar: (datos: any) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('temp_payment_data', JSON.stringify(datos));
    }
  }
};

type PersonaUI = {
  activo?: boolean;
  cedula: string;
  nombres: string;
  apellidos: string;
  nombreCompleto?: string;
  fechaNacimiento?: string;
  lugarNacimiento?: string;
  nacionalidad?: string;
  estadoCivil?: string;
  sexo?: string;
  codigoDactilar?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  parentesco?: string;
  rolFuncional?: string;
  paisDomicilio?: string;
  provinciaDomicilio?: string;
  ciudadDomicilio?: string;
  referenciaDomicilio?: string;
  pronto: boolean;
  edad?: number;
  error: string;
};

type ContactoUI = {
  tipo_contacto: 'CONTACTO_ECUADOR' | 'RESPONSABLE_EXTERIOR' | 'CONTACTO_EMERGENCIA';
  nombres: string;
  apellidos: string;
  parentesco: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  pais: string;
  observacion: string;
};

const personaVacia = (): PersonaUI => ({
  cedula: '',
  nombres: '',
  apellidos: '',
  nombreCompleto: '',
  fechaNacimiento: '',
  lugarNacimiento: '',
  nacionalidad: '',
  estadoCivil: '',
  sexo: '',
  codigoDactilar: '',
  direccion: '',
  telefono: '',
  correo: '',
  parentesco: '',
  rolFuncional: '',
  paisDomicilio: 'ECUADOR',
  provinciaDomicilio: 'AZUAY',
  ciudadDomicilio: 'CUENCA',
  referenciaDomicilio: '',
  pronto: false,
  edad: 0,
  error: ''
});

const contactoVacio = (
  tipo: ContactoUI['tipo_contacto'],
  pais = '',
  provincia = '',
  ciudad = ''
): ContactoUI => ({
  tipo_contacto: tipo,
  nombres: '',
  apellidos: '',
  parentesco: '',
  telefono: '',
  correo: '',
  direccion: '',
  ciudad,
  provincia,
  pais,
  observacion: ''
});

export default function WizardSalidaPais() {
  const router = useRouter();
  const logout = useLogout();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState('');
  const [usuarioId, setUsuarioId] = useState<number>(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false); // ✅ dentro del componente
  const [paymentMessage, setPaymentMessage] = useState('');         // ✅ dentro del componente

  const [searchPais, setSearchPais] = useState('');
  const [showPaisList, setShowPaisList] = useState(false);
  const [paises, setPaises] = useState<{ id: string; nombre: string; apiName: string; flag: string }[]>([]);
  const [loadingPaises, setLoadingPaises] = useState(true);

  const [searchCiudad, setSearchCiudad] = useState('');
  const [showCiudadList, setShowCiudadList] = useState(false);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);

  const [showParentsExtras, setShowParentsExtras] = useState(false);
  const [showTravelExtras, setShowTravelExtras] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);

  const [formData, setFormData] = useState({
  menores: [personaVacia()],
  p1: { ...personaVacia(), rolFuncional: 'PADRE' },
  p2: { ...personaVacia(), rolFuncional: 'MADRE' },
  acompanante: {
    ...personaVacia(),
    activo: false,
    rolFuncional: 'TERCERO_ACOMPANANTE',
    parentesco: 'TERCERO'
  }
	});

  const [viaje, setViaje] = useState({
  pais: '',
  paisNombre: '',
  paisApiName: '',
  ciudad: '',
  tieneRetorno: true,
  fechaSalida: '',
  fechaRetorno: '',
  ciudadSuscripcion: 'Cuenca',
  provinciaSuscripcion: 'Azuay',
  paisSuscripcion: 'ECUADOR',
  tiempoEstadiaDescripcion: '',
  direccionEstadiaExterior: '',
  telefonoEstadiaExterior: '',
  motivoViaje: '',
  responsableGastos: '',
  medioTransporte: 'AÉREO',
  aerolineaTransporte: '',
  observacion: ''
});

const [showEssentialContacts, setShowEssentialContacts] = useState(false);
  const [diagnostico, setDiagnostico] = useState({
    viajaCon: 'TERCERO',
    ambosPadresEstanDeAcuerdo: true,
    progenitorNoViajanteLocalizable: true,
    existeCondicionLegalEspecial: false,
    detalleCondicionLegalEspecial: '',
    declaraInformacionVeraz: true,
    aceptaTerminosCondiciones: true
  });

  const [contactos, setContactos] = useState<{
    ecuador: ContactoUI;
    exterior: ContactoUI;
    emergencia: ContactoUI;
  }>({
    ecuador: contactoVacio('CONTACTO_ECUADOR', 'ECUADOR', 'Azuay', 'Cuenca'),
    exterior: contactoVacio('RESPONSABLE_EXTERIOR'),
    emergencia: contactoVacio('CONTACTO_EMERGENCIA')
  });

  const hoyStr = new Date().toISOString().split('T')[0];

useEffect(() => {
    const cargarPaises = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag,translations');
        const data = await res.json();

        const lista = data
          .map((p: any) => ({
            id: p.cca2,
            nombre: p.translations?.spa?.common || p.name?.common || '',
            apiName: p.name?.common || p.translations?.spa?.common || '',
            flag: p.flag || '🌍'
          }))
          .filter((p: any) => p.nombre && p.apiName)
          .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));

        setPaises(lista);
      } catch (error) {
        console.error('Error cargando países:', error);
        setPaises([{ id: 'DZ', nombre: 'Argelia', apiName: 'Algeria', flag: '🇩🇿' }]);
      } finally {
        setLoadingPaises(false);
      }
    };

    const validate = async () => {
      const token = getWizardToken();
      if (!token || !(await isJWTValid(token))) {
        logout();
        router.replace('/login');
        return;
      }

      try {
        const data = SessionWizardData.obtener();
			setUsuarioId(Number(data?.secuencial || 1));
      } catch {
        setUsuarioId(1);
      }
      setLoading(false);
    };

    cargarPaises();
    validate();
  }, [logout, router]);

  useEffect(() => {
    if (diagnostico.viajaCon === 'TERCERO') {
      setFormData(prev => ({
        ...prev,
        acompanante: {
          ...prev.acompanante,
          activo: true
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        acompanante: {
          ...prev.acompanante,
          activo: false
        }
      }));
    }
  }, [diagnostico.viajaCon]);

  const paisesFiltrados = useMemo(() => {
    return paises.filter(p =>
      p.nombre.toLowerCase().includes((searchPais || '').toLowerCase())
    );
  }, [searchPais, paises]);

  const ciudadesFiltradas = useMemo(() => {
    return ciudades.filter(c =>
      c.toLowerCase().includes((searchCiudad || viaje.ciudad || '').toLowerCase())
    );
  }, [ciudades, searchCiudad, viaje.ciudad]);

  const splitNombre = (nombreCompleto?: string) => {
    const limpio = (nombreCompleto || '').trim().replace(/\s+/g, ' ');
    if (!limpio) return { nombres: '', apellidos: '' };
    const partes = limpio.split(' ');
    if (partes.length === 1) return { nombres: partes[0], apellidos: '' };
    if (partes.length === 2) return { nombres: partes[0], apellidos: partes[1] };
    return {
      nombres: partes.slice(0, 2).join(' '),
      apellidos: partes.slice(2).join(' ')
    };
  };

  const calcularEdad = (fechaInput?: string) => {
    if (!fechaInput) return 0;
    const cumple = new Date(fechaInput);
    if (isNaN(cumple.getTime())) return 0;
    const hoy = new Date();
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
    return edad;
  };



const updatePersona = (
  campo: 'p1' | 'p2' | 'acompanante',
  patch: Partial<PersonaUI>
) => {
  setFormData(prev => ({
    ...prev,
    [campo]: {
      ...prev[campo],
      ...patch
    }
  }));
};

  
		  const updateMenor = (index: number, patch: Partial<PersonaUI>) => {
		  setFormData(prev => ({
			...prev,
			menores: prev.menores.map((m, i) => (i === index ? { ...m, ...patch } : m))
		  }));
		};

		const agregarMenor = () => {
		  setFormData(prev => ({
			...prev,
			menores: [...prev.menores, personaVacia()]
		  }));
		};

		const eliminarMenor = (index: number) => {
		  setFormData(prev => {
			if (prev.menores.length === 1) return prev;
			return {
			  ...prev,
			  menores: prev.menores.filter((_, i) => i !== index)
			};
		  });
		};
		
		
		const obtenerCedulasRegistradas = (exclude?: { tipo: string; index?: number }) => {
  const cedulas: { tipo: string; index?: number; cedula: string }[] = [];

  formData.menores.forEach((m, i) => {
    if (m.cedula) cedulas.push({ tipo: 'menor', index: i, cedula: m.cedula });
  });

  if (formData.p1.cedula) cedulas.push({ tipo: 'p1', cedula: formData.p1.cedula });
  if (formData.p2.cedula) cedulas.push({ tipo: 'p2', cedula: formData.p2.cedula });
  if (formData.acompanante.cedula) cedulas.push({ tipo: 'acompanante', cedula: formData.acompanante.cedula });

  return cedulas.filter(item => {
    if (!exclude) return true;
    if (item.tipo !== exclude.tipo) return true;
    return item.index !== exclude.index;
  });
};

const cedulaEstaRepetida = (cedula: string, exclude?: { tipo: string; index?: number }) => {
  if (!cedula || cedula.length !== 10) return false;
  const otras = obtenerCedulasRegistradas(exclude);
  return otras.some(item => item.cedula === cedula);
};



  const updateContacto = (
    campo: 'ecuador' | 'exterior' | 'emergencia',
    patch: Partial<ContactoUI>
  ) => {
    setContactos(prev => ({
      ...prev,
      [campo]: {
        ...prev[campo],
        ...patch
      }
    }));
  };

	const fetchPersona = async (
  cedula: string,
  campo: 'menor' | 'p1' | 'p2' | 'acompanante',
  indexMenor?: number
) => {
  setFetching(campo === 'menor' && typeof indexMenor === 'number' ? `menor_${indexMenor}` : campo);
  setGeneralError('');

  try {
    const exclude =
      campo === 'menor'
        ? { tipo: 'menor', index: indexMenor }
        : { tipo: campo };

    if (cedulaEstaRepetida(cedula, exclude)) {
      const mensaje = 'Esta c��dula ya fue ingresada en otro interviniente del formulario.';
      if (campo === 'menor' && typeof indexMenor === 'number') {
        updateMenor(indexMenor, {
          pronto: false,
          error: mensaje,
          nombres: '',
          apellidos: '',
          nombreCompleto: ''
        });
      } else if (campo === 'p1' || campo === 'p2' || campo === 'acompanante') {
		  updatePersona(campo, {
			pronto: false,
			error: mensaje,
			nombres: '',
			apellidos: '',
			nombreCompleto: ''
		  });
		}
      return;
    }

    const token = getWizardToken();
    const res = await fetch(`${API_BASE_URL}/permisos-salida/persona/${cedula}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data?.error || 'No se encontr�� la persona');

    const partido = splitNombre(data.nombres_completos);
    const edadCalculada = campo === 'menor' ? calcularEdad(data.fecha_nacimiento) : 0;

    if (campo === 'menor' && edadCalculada >= 18) {
      if (typeof indexMenor === 'number') {
        updateMenor(indexMenor, {
          pronto: false,
          error: 'La persona consultada es mayor de edad.',
          nombres: '',
          apellidos: '',
          nombreCompleto: ''
        });
      }
      return;
    }

    const patch = {
      nombres: partido.nombres.toUpperCase(),
      apellidos: partido.apellidos.toUpperCase(),
      nombreCompleto: (data.nombres_completos || '').toUpperCase(),
      fechaNacimiento: data.fecha_nacimiento || '',
      lugarNacimiento: data.lugar_nacimiento || '',
      nacionalidad: data.nacionalidad || '',
      estadoCivil: data.estado_civil || '',
      sexo: data.sexo || '',
      codigoDactilar: data.codigo_dactilar || '',
      direccion: data.direccion || '',
      pronto: true,
      edad: edadCalculada,
      error: ''
    };

    if (campo === 'menor' && typeof indexMenor === 'number') {
		  updateMenor(indexMenor, patch);
		} else if (campo === 'p1' || campo === 'p2' || campo === 'acompanante') {
		  updatePersona(campo, patch);
		}
  } catch (error: any) {
    const patch = {
      pronto: false,
      error: error?.message || 'No se pudo consultar la c��dula'
    };

    if (campo === 'menor' && typeof indexMenor === 'number') {
		  updateMenor(indexMenor, patch);
		} else if (campo === 'p1' || campo === 'p2' || campo === 'acompanante') {
		  updatePersona(campo, patch);
		}

  } finally {
    setFetching(null);
  }
};


	 const cargarCiudadesPorPais = async (countryApiName: string) => {
		  if (!countryApiName) {
			setCiudades([]);
			return;
		  }

		  setLoadingCiudades(true);
		  setCiudades([]);
		  setViaje(prev => ({ ...prev, ciudad: '' }));
		  setSearchCiudad('');

		  try {
			const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ country: countryApiName })
			});

			const data = await res.json().catch(() => ({}));

			if (!res.ok || data?.error || !Array.isArray(data?.data)) {
			  throw new Error(data?.msg || 'No se pudieron cargar las ciudades');
			}

			const lista = [...new Set((data.data as string[]).map(c => c.trim()).filter(Boolean))]
			  .sort((a, b) => a.localeCompare(b));

			setCiudades(lista);
		  } catch (error) {
			console.error('Error cargando ciudades:', error);
			setGeneralError(`No se pudieron cargar ciudades para ${countryApiName}. Puedes escribir la ciudad manualmente.`);
			setCiudades([]);
		  } finally {
			setLoadingCiudades(false);
		  }
		};
  
  

const onCedulaChange = (
  campo: 'menor' | 'p1' | 'p2' | 'acompanante',
  value: string,
  indexMenor?: number
) => {
  const v = value.replace(/\D/g, '').slice(0, 10);

  if (campo === 'menor' && typeof indexMenor === 'number') {
    updateMenor(indexMenor, {
      cedula: v,
      pronto: false,
      error: '',
      nombres: '',
      apellidos: '',
      nombreCompleto: ''
    });

    if (v.length === 10) {
      fetchPersona(v, 'menor', indexMenor);
    }
    return;
  }

  if (campo === 'p1' || campo === 'p2' || campo === 'acompanante') {
  updatePersona(campo, {
    cedula: v,
    pronto: false,
    error: '',
    nombres: '',
    apellidos: '',
    nombreCompleto: ''
  });

  if (v.length === 10) {
    fetchPersona(v, campo);
  }
}
};


  const handleNextStep = (step: number) => {
    setCurrentStep(step);
    setGeneralError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canGoStep2 =
  formData.menores.length > 0 &&
  formData.menores.every(m => !!m.pronto) &&
  !!formData.p1.pronto &&
  !!formData.p2.pronto;
  
  const missingCritical = useMemo(() => {
    const issues: string[] = [];

    if (formData.menores.length === 0) {
		  issues.push('Debes registrar al menos un menor');
		}

		formData.menores.forEach((m, i) => {
		  if (!m.pronto) issues.push(`Valida al menor #${i + 1}`);
		});
    if (!formData.p1.pronto) issues.push('Valida al padre');
    if (!formData.p2.pronto) issues.push('Valida a la madre');

    if (!viaje.paisNombre) issues.push('Selecciona país destino');
    if (!viaje.ciudad) issues.push('Selecciona ciudad destino');
    if (!viaje.fechaSalida) issues.push('Ingresa fecha de salida');
    if (viaje.tieneRetorno && !viaje.fechaRetorno) issues.push('Ingresa fecha de retorno');

    if (!viaje.ciudadSuscripcion) issues.push('Ingresa ciudad de suscripción');
    if (!viaje.provinciaSuscripcion) issues.push('Ingresa provincia de suscripción');

    if (!viaje.motivoViaje) issues.push('Ingresa motivo del viaje');
    if (!viaje.tiempoEstadiaDescripcion) issues.push('Ingresa tiempo de estadía');
    if (!viaje.direccionEstadiaExterior) issues.push('Ingresa dirección en el exterior');

    //if (!viaje.telefonoEstadiaExterior) issues.push('Ingresa teléfono en el exterior');
    //if (!viaje.responsableGastos) issues.push('Ingresa responsable de gastos');
    if (!viaje.medioTransporte) issues.push('Ingresa medio de transporte');
    //if (!viaje.aerolineaTransporte) issues.push('Ingresa aerolínea o transporte');

    if (diagnostico.viajaCon === 'TERCERO') {
      if (!formData.acompanante.activo) issues.push('Activa el acompañante');
      if (!formData.acompanante.pronto) issues.push('Valida al acompañante');
      if (!formData.acompanante.parentesco) issues.push('Indica relación del acompañante');
    }

   // if (!contactos.ecuador.nombres) issues.push('Ingresa contacto en Ecuador');
    //if (!contactos.ecuador.telefono) issues.push('Ingresa teléfono del contacto en Ecuador');
    //if (!contactos.ecuador.ciudad) issues.push('Ingresa ciudad del contacto en Ecuador');
    //if (!contactos.ecuador.pais) issues.push('Ingresa país del contacto en Ecuador');

    //if (!contactos.exterior.nombres) issues.push('Ingresa responsable en el exterior');
    //if (!contactos.exterior.telefono) issues.push('Ingresa teléfono del responsable en el exterior');
    //if (!contactos.exterior.direccion) issues.push('Ingresa dirección del responsable en el exterior');
    //if (!contactos.exterior.ciudad) issues.push('Ingresa ciudad del responsable en el exterior');
    //if (!contactos.exterior.pais) issues.push('Ingresa país del responsable en el exterior');

    if (!diagnostico.declaraInformacionVeraz) issues.push('Debes declarar que la información es veraz');
    if (!diagnostico.aceptaTerminosCondiciones) issues.push('Debes aceptar términos y condiciones');

    return issues;
  }, [formData, viaje, diagnostico, contactos]);

  const canSubmit = missingCritical.length === 0;

  const goToStepWhereErrorLives = () => {
    const errorInStep1 =
	  formData.menores.length === 0 ||
	  formData.menores.some(m => !m.pronto) ||
	  !formData.p1.pronto ||
	  !formData.p2.pronto ||
	  (diagnostico.viajaCon === 'TERCERO' &&
		(!formData.acompanante.activo ||
		  !formData.acompanante.pronto ||
		  !formData.acompanante.parentesco));

    if (errorInStep1) {
      setCurrentStep(1);
      setGeneralError('Completa primero la identificación de intervinientes.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    const errorInStep2 =
      !viaje.paisNombre ||
      !viaje.ciudad ||
      !viaje.fechaSalida ||
      (viaje.tieneRetorno && !viaje.fechaRetorno) ||
      !viaje.ciudadSuscripcion ||
      !viaje.provinciaSuscripcion ||
      !viaje.motivoViaje ||
      !viaje.tiempoEstadiaDescripcion ||
      !viaje.direccionEstadiaExterior ||
      !viaje.telefonoEstadiaExterior ||
      !viaje.responsableGastos ||
      !viaje.medioTransporte ||
      !viaje.aerolineaTransporte;

    if (errorInStep2) {
      setCurrentStep(2);
      setShowTravelExtras(true);
      setGeneralError('Completa los datos esenciales del viaje.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    const errorInStep3 =
      !contactos.ecuador.nombres ||
      !contactos.ecuador.telefono ||
      !contactos.exterior.nombres ||
      !contactos.exterior.telefono ||
      !diagnostico.declaraInformacionVeraz ||
      !diagnostico.aceptaTerminosCondiciones;

    if (errorInStep3) {
      setCurrentStep(3);
      setGeneralError('Completa contactos y confirmaciones finales.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    return true;
  };


	const buildIntervinientes = () => {
  const menores = formData.menores.map((menor, index) => ({
    tipo_persona: 'MENOR',
    rol_funcional: 'MENOR',
    orden: index + 1,
    cedula: menor.cedula,
    nombres: menor.nombres,
    apellidos: menor.apellidos,
    fecha_nacimiento: menor.fechaNacimiento || '',
    lugar_nacimiento: menor.lugarNacimiento || '',
    nacionalidad: menor.nacionalidad || '',
    sexo: menor.sexo || '',
    estado_civil: menor.estadoCivil || '',
    codigo_dactilar: menor.codigoDactilar || '',
    direccion: menor.direccion || '',
    es_compareciente: false,
    es_otorgante: false,
    comparece_por_derecho_propio: false,
    es_apoderado: false,
    declara_veracidad: true
  }));

  const p1 = {
    tipo_persona: 'PROGENITOR_1',
    rol_funcional: 'PADRE',
    parentesco: 'PADRE',
    cedula: formData.p1.cedula,
    nombres: formData.p1.nombres,
    apellidos: formData.p1.apellidos,
    fecha_nacimiento: formData.p1.fechaNacimiento || '',
    lugar_nacimiento: formData.p1.lugarNacimiento || '',
    nacionalidad: formData.p1.nacionalidad || '',
    sexo: formData.p1.sexo || '',
    estado_civil: formData.p1.estadoCivil || '',
    codigo_dactilar: formData.p1.codigoDactilar || '',
    direccion: formData.p1.direccion || '',
    telefono: formData.p1.telefono || '',
    correo: formData.p1.correo || '',
    pais_domicilio: formData.p1.paisDomicilio || 'ECUADOR',
    provincia_domicilio: formData.p1.provinciaDomicilio || 'AZUAY',
    ciudad_domicilio: formData.p1.ciudadDomicilio || 'CUENCA',
    referencia_domicilio: formData.p1.referenciaDomicilio || '',
    es_compareciente: true,
    es_otorgante: true,
    comparece_por_derecho_propio: true,
    es_apoderado: false,
    autoriza_salida: true,
    declara_veracidad: true
  };

  const p2 = {
    tipo_persona: 'PROGENITOR_2',
    rol_funcional: 'MADRE',
    parentesco: 'MADRE',
    cedula: formData.p2.cedula,
    nombres: formData.p2.nombres,
    apellidos: formData.p2.apellidos,
    fecha_nacimiento: formData.p2.fechaNacimiento || '',
    lugar_nacimiento: formData.p2.lugarNacimiento || '',
    nacionalidad: formData.p2.nacionalidad || '',
    sexo: formData.p2.sexo || '',
    estado_civil: formData.p2.estadoCivil || '',
    codigo_dactilar: formData.p2.codigoDactilar || '',
    direccion: formData.p2.direccion || '',
    telefono: formData.p2.telefono || '',
    correo: formData.p2.correo || '',
    pais_domicilio: formData.p2.paisDomicilio || 'ECUADOR',
    provincia_domicilio: formData.p2.provinciaDomicilio || 'AZUAY',
    ciudad_domicilio: formData.p2.ciudadDomicilio || 'CUENCA',
    referencia_domicilio: formData.p2.referenciaDomicilio || '',
    es_compareciente: true,
    es_otorgante: true,
    comparece_por_derecho_propio: true,
    es_apoderado: false,
    autoriza_salida: true,
    declara_veracidad: true
  };

  const lista: any[] = [...menores, p1, p2];

  if (diagnostico.viajaCon === 'TERCERO') {
    lista.push({
      tipo_persona: 'ACOMPANANTE',
      rol_funcional: 'TERCERO_ACOMPANANTE',
      parentesco: formData.acompanante.parentesco || 'TERCERO',
      cedula: formData.acompanante.cedula,
      nombres: formData.acompanante.nombres,
      apellidos: formData.acompanante.apellidos,
      fecha_nacimiento: formData.acompanante.fechaNacimiento || '',
      lugar_nacimiento: formData.acompanante.lugarNacimiento || '',
      nacionalidad: formData.acompanante.nacionalidad || '',
      sexo: formData.acompanante.sexo || '',
      estado_civil: formData.acompanante.estadoCivil || '',
      codigo_dactilar: formData.acompanante.codigoDactilar || '',
      direccion: formData.acompanante.direccion || '',
      telefono: formData.acompanante.telefono || '',
      correo: formData.acompanante.correo || '',
      pais_domicilio: formData.acompanante.paisDomicilio || 'ECUADOR',
      provincia_domicilio: formData.acompanante.provinciaDomicilio || '',
      ciudad_domicilio: formData.acompanante.ciudadDomicilio || '',
      referencia_domicilio: formData.acompanante.referenciaDomicilio || '',
      es_compareciente: false,
      es_otorgante: false,
      comparece_por_derecho_propio: true,
      es_apoderado: false,
      autoriza_salida: false,
      declara_veracidad: true
    });
  }

  return lista;
};


  const buildContactos = () => {
    return [contactos.ecuador, contactos.exterior, ...(showEmergencyContact ? [contactos.emergencia] : [])]
      .filter(c => c.nombres || c.telefono || c.correo || c.direccion);
  };

  const enviarFormulario = async () => {
    if (!canSubmit) {
      const ok = goToStepWhereErrorLives();
      if (!ok) return;
      setGeneralError('Completa los datos obligatorios para continuar.');
      return;
    }

	  setPaymentProcessing(true);
	  setPaymentMessage('Cifrando datos de pago...');
	  setFetching('enviando');
	  setGeneralError('');
	  

    try {
      const token = getWizardToken();
      const backendData = new FormData();

      backendData.append('secuencial_usuario', String(usuarioId));
      backendData.append('pais_destino_codigo', viaje.pais);
      backendData.append('pais_destino_nombre', viaje.paisNombre);
      backendData.append('ciudad_destino', viaje.ciudad);
      backendData.append('fecha_salida', viaje.fechaSalida);
      backendData.append('fecha_retorno', viaje.tieneRetorno ? viaje.fechaRetorno : '');
      backendData.append('salida_indefinida', viaje.tieneRetorno ? 'false' : 'true');
      backendData.append('descripcion_salida_indefinida', viaje.tieneRetorno ? '' : 'Salida indefinida');

      backendData.append('viaja_con', diagnostico.viajaCon);
      backendData.append('tiene_acompanante', diagnostico.viajaCon === 'TERCERO' ? 'true' : 'false');
      backendData.append('ambos_padres_estan_de_acuerdo', diagnostico.ambosPadresEstanDeAcuerdo ? 'true' : 'false');
      backendData.append('progenitor_no_viajante_localizable', diagnostico.progenitorNoViajanteLocalizable ? 'true' : 'false');
      backendData.append('existe_condicion_legal_especial', diagnostico.existeCondicionLegalEspecial ? 'true' : 'false');
      backendData.append('detalle_condicion_legal_especial', diagnostico.detalleCondicionLegalEspecial || '');

      backendData.append('ciudad_suscripcion', viaje.ciudadSuscripcion);
      backendData.append('provincia_suscripcion', viaje.provinciaSuscripcion);
      backendData.append('pais_suscripcion', viaje.paisSuscripcion);
      backendData.append('tiempo_estadia_descripcion', viaje.tiempoEstadiaDescripcion);
      backendData.append('direccion_estadia_exterior', viaje.direccionEstadiaExterior);
      backendData.append('telefono_estadia_exterior', viaje.telefonoEstadiaExterior);
      backendData.append('motivo_viaje', viaje.motivoViaje);
      backendData.append('responsable_gastos', viaje.responsableGastos);
      backendData.append('medio_transporte', viaje.medioTransporte);
      backendData.append('aerolinea_transporte', viaje.aerolineaTransporte);
      backendData.append('observacion', viaje.observacion);

      backendData.append('acepta_terminos_condiciones', diagnostico.aceptaTerminosCondiciones ? 'true' : 'false');
      backendData.append('declara_informacion_veraz', diagnostico.declaraInformacionVeraz ? 'true' : 'false');

      backendData.append('intervinientesJson', JSON.stringify(buildIntervinientes()));
      backendData.append('contactosJson', JSON.stringify(buildContactos()));

      const response = await fetch(`${API_BASE_URL}/permisos-salida`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: backendData
      });

      const resData = await response.json().catch(() => ({}));
 
	 
      if (!response.ok) {
        throw new Error(resData?.error || 'No se pudo registrar el trámite');
      }
	  
	  

      const nombresMenores = formData.menores
		  .map(m => `${m.nombres} ${m.apellidos}`.trim().toUpperCase())
		  .filter(Boolean);

		const nombreResumen =
		  nombresMenores.length === 1
			? nombresMenores[0]
			: `${nombresMenores[0]} Y ${nombresMenores.length - 1} MENOR(ES) M��S`;

      const resumen = {
        citacion: resData.codigo_tramite || `AUT-${formData.menores[0]?.cedula || "SIN-CEDULA"}-${Date.now()}`,
        item: `${nombreResumen} A ${viaje.paisNombre.toUpperCase()} - PERMISO DE SALIDA`,
		cedula: formData.menores[0]?.cedula || '',
		apellido: formData.menores[0]?.apellidos || '', 
        servicio: String(resData.secuencial),
        valor: String(valorPermisoSalida),
         
        displayName: "SOPORTE LEGALTECH",
        estado: resData.estado || 'BORRADOR',
        listo_para_documento: !!resData.listo_para_documento
      };

			  localStorage.setItem("pagoResumenDatos", JSON.stringify(resumen));
			  setPaymentMessage('Redirigiendo al portal de pago seguro...');
			setTimeout(() => {
			  window.location.href = "/resumenPago";
			}, 500);
		  } catch (error: unknown) {
			setPaymentProcessing(false);
			setGeneralError(error instanceof Error ? error.message : 'No se pudo procesar la solicitud.');
		  } finally {
			setFetching(null);
		  }
		};
    
  

  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <Header />

      <div className="mx-auto max-w-6xl px-6 pt-12">
        <header className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-xl"
          >
            {currentStep === 1 && <ShieldCheck size={32} />}
            {currentStep === 2 && <Plane size={32} />}
            {currentStep === 3 && <FileText size={32} />}
          </motion.div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Permiso de Salida de Menor
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Un flujo claro, guiado y rápido para dejar tu trámite completo sin hacerlo pesado.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-1 items-center gap-3">
                <div className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl border-2 text-sm font-black transition-all",
                  currentStep >= step ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-400"
                )}>
                  {currentStep > step ? <Check size={18} /> : step}
                </div>
                {step < 3 && (
                  <div className={cn("h-1 flex-1 rounded-full", currentStep > step ? "bg-slate-900" : "bg-slate-200")} />
                )}
              </div>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="space-y-8"
            >
              <section className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionTitle
                  icon={<Sparkles className="text-cyan-600" />}
                  title="Identificación automática"
                  description="Ingresa las cédulas y el sistema completa gran parte de la información por ti."
                />

               
			   
			   {/* Paso 1: Identificación Automática */}
 
 
				<div className="space-y-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-extrabold text-slate-900">Menores de edad</h3>
      <p className="text-sm text-slate-500">
        Puedes registrar uno o varios hijos de los mismos padres dentro del mismo trámite.
      </p>
    </div>

    <button
      type="button"
      onClick={agregarMenor}
      className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-black text-white hover:bg-cyan-700"
    >
      + Agregar menor
    </button>
  </div>

  <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
    {formData.menores.map((menor, index) => (
      <div key={index} className="relative">
        <QuickPersonCard
          title={`Menor de Edad #${index + 1}`}
          persona={menor}
          fetching={fetching === `menor_${index}`}
          onCedulaChange={(v: string) => onCedulaChange('menor', v, index)}
          isMenor
          silueta={SILUETAS.MENOR}
        />

        {formData.menores.length > 1 && (
          <button
            type="button"
            onClick={() => eliminarMenor(index)}
            className="absolute right-4 top-4 rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 hover:bg-rose-100"
          >
            Eliminar
          </button>
        )}
      </div>
    ))}
  </div>

  <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
    <QuickPersonCard
      title="Padre / Otorgante"
      persona={formData.p1}
      fetching={fetching === 'p1'}
      onCedulaChange={(v: string) => onCedulaChange('p1', v)}
      silueta={SILUETAS.PADRE}
    />

    <QuickPersonCard
      title="Madre / Otorgante"
      persona={formData.p2}
      fetching={fetching === 'p2'}
      onCedulaChange={(v: string) => onCedulaChange('p2', v)}
      silueta={SILUETAS.MADRE}
    />
  </div>
</div>
 
			   

                <button
                  type="button"
                  onClick={() => setShowParentsExtras(!showParentsExtras)}
                  className="mt-8 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700"
                >
                  {showParentsExtras ? 'Ocultar datos adicionales' : 'Agregar teléfono, correo y referencia de padres'}
                </button>

                <AnimatePresence>
                  {showParentsExtras && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 grid gap-6 md:grid-cols-2"
                    >
                      <CompactExtraFields
                        title="Datos del padre"
                        persona={formData.p1}
                        onChange={(patch) => updatePersona('p1', patch)}
                      />
                      <CompactExtraFields
                        title="Datos de la madre"
                        persona={formData.p2}
                        onChange={(patch) => updatePersona('p2', patch)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section className="rounded-[36px] bg-slate-900 p-8 text-white shadow-2xl">
                <SectionTitle
                  icon={<Users className="text-cyan-400" />}
                  title="¿Con quién viaja el menor?"
                  description="Según tu selección, pediremos solo los datos realmente necesarios."
                  dark
                />

                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { value: 'TERCERO', label: 'Con tercero' },
                    { value: 'PADRE', label: 'Con el padre' },
                    { value: 'MADRE', label: 'Con la madre' },
                    { value: 'AMBOS_PADRES', label: 'Con ambos' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setDiagnostico(prev => ({ ...prev, viajaCon: opt.value }))}
                      className={cn(
                        "rounded-2xl border px-4 py-4 text-sm font-black transition-all",
                        diagnostico.viajaCon === opt.value
                          ? "border-cyan-400 bg-cyan-500 text-white"
                          : "border-white/10 bg-white/5 text-slate-200"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {diagnostico.viajaCon === 'TERCERO' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8 border-t border-white/10 pt-8"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <CedulaInput
                            title="Cédula del acompañante"
                            value={formData.acompanante.cedula}
                            onChange={(v: string) => onCedulaChange('acompanante', v)}
                            fetching={fetching === 'acompanante'}
                            dark
                          />
                          <input
                            type="text"
                            value={formData.acompanante.parentesco || ''}
                            onChange={(e) => updatePersona('acompanante', { parentesco: e.target.value.toUpperCase() })}
                            placeholder="Relación con el menor"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold text-white outline-none placeholder:text-slate-400"
                          />
                          <div className="grid gap-3 md:grid-cols-2">
                            <input
                              type="text"
                              value={formData.acompanante.telefono || ''}
                              onChange={(e) => updatePersona('acompanante', { telefono: e.target.value })}
                              placeholder="Teléfono"
                              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold text-white outline-none placeholder:text-slate-400"
                            />
                            <input
                              type="email"
                              value={formData.acompanante.correo || ''}
                              onChange={(e) => updatePersona('acompanante', { correo: e.target.value })}
                              placeholder="Correo"
                              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold text-white outline-none placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        <PersonStatus status={formData.acompanante} isFetching={fetching === 'acompanante'} dark />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {generalError && currentStep === 1 && (
                <ErrorBox>{generalError}</ErrorBox>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => handleNextStep(2)}
                  disabled={!canGoStep2}
                  className="flex items-center gap-3 rounded-[22px] bg-cyan-600 px-8 py-4 text-base font-black text-white hover:bg-cyan-700 disabled:opacity-35"
                >
                  Continuar
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="space-y-8"
            >
              <section className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionTitle
                  icon={<Plane className="text-blue-600" />}
                  title="Datos del viaje"
                  description="Primero te pedimos lo esencial, y luego los detalles complementarios."
                />

                {generalError && currentStep === 2 && (
                  <div className="mb-5">
                    <ErrorBox>{generalError}</ErrorBox>
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchPais || viaje.paisNombre}
                      placeholder="País destino"
                      onFocus={() => setShowPaisList(true)}
                      onChange={(e) => setSearchPais(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-100 p-4 pl-12 font-bold outline-none focus:border-blue-400"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />

                    {showPaisList && (
                      <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                        {loadingPaises ? (
                          <div className="p-3 text-sm text-slate-500">Cargando países...</div>
                        ) : paisesFiltrados.length === 0 ? (
                          <div className="p-3 text-sm text-slate-500">Sin coincidencias.</div>
                        ) : (
                          paisesFiltrados.map((p) => (
                            <button
                              key={p.id}
                              
							  onClick={async () => {
								  setViaje(prev => ({
									...prev,
									pais: p.id,
									paisNombre: p.nombre,
									paisApiName: p.apiName,
									ciudad: ''
								  }));

								  setSearchPais(p.nombre);
								  setShowPaisList(false);

								  updateContacto('exterior', {
									pais: p.nombre,
									ciudad: ''
								  });

								  await cargarCiudadesPorPais(p.apiName);
								}}
							  
                              className="flex w-full items-center gap-3 rounded-xl p-3 text-left font-semibold hover:bg-blue-50"
                            >
                              <span>{p.flag}</span>
                              {p.nombre}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                   <div className="relative">
					  <input
						type="text"
						value={searchCiudad || viaje.ciudad}
						placeholder={viaje.paisNombre ? 'Ciudad destino' : 'Primero selecciona un país'}
						disabled={!viaje.paisNombre}
						onFocus={() => {
						  if (viaje.paisNombre && ciudades.length > 0) setShowCiudadList(true);
						}}
						onChange={(e) => {
						  setSearchCiudad(e.target.value);
						  setViaje(prev => ({ ...prev, ciudad: e.target.value }));
						}}
						className="w-full rounded-2xl border-2 border-slate-100 p-4 pl-12 font-bold outline-none focus:border-blue-400 disabled:bg-slate-100 disabled:text-slate-400"
					  />
					  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />

					  {showCiudadList && viaje.paisNombre && ciudades.length > 0 && (
						<div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
						  {loadingCiudades ? (
							<div className="p-3 text-sm text-slate-500">Cargando ciudades...</div>
						  ) : ciudadesFiltradas.length === 0 ? (
							<div className="p-3 text-sm text-slate-500">No se encontraron ciudades. Puedes escribirla manualmente.</div>
						  ) : (
							ciudadesFiltradas.map((ciudad) => (
							  <button
								key={ciudad}
								type="button"
								onClick={() => {
								  setViaje(prev => ({ ...prev, ciudad }));
								  setSearchCiudad(ciudad);
								  setShowCiudadList(false);
								  updateContacto('exterior', { ciudad });
								}}
								className="block w-full rounded-xl p-3 text-left font-semibold hover:bg-blue-50"
							  >
								{ciudad}
							  </button>
							))
						  )}
						</div>
					  )}
					</div>

                  <input
                    type="text"
                    value={viaje.motivoViaje}
                    onChange={(e) => setViaje(prev => ({ ...prev, motivoViaje: e.target.value }))}
                    placeholder="Motivo del viaje"
                    className="w-full rounded-2xl border-2 border-slate-100 p-4 font-bold outline-none focus:border-blue-400"
                  />

                  <input
                    type="text"
                    value={viaje.tiempoEstadiaDescripcion}
                    onChange={(e) => setViaje(prev => ({ ...prev, tiempoEstadiaDescripcion: e.target.value }))}
                    placeholder="Tiempo de estadía (ej: 20 días)"
                    className="w-full rounded-2xl border-2 border-slate-100 p-4 font-bold outline-none focus:border-blue-400"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-600">Fecha de salida</label>
                    <input
                      type="date"
                      min={hoyStr}
                      value={viaje.fechaSalida}
                      onChange={(e) => setViaje(prev => ({ ...prev, fechaSalida: e.target.value }))}
                      className="w-full rounded-2xl border-2 border-slate-100 p-4 font-bold outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-600">Fecha de retorno</label>
                    <input
                      type="date"
                      min={viaje.fechaSalida || hoyStr}
                      value={viaje.fechaRetorno}
                      onChange={(e) => setViaje(prev => ({ ...prev, fechaRetorno: e.target.value, tieneRetorno: true }))}
                      className="w-full rounded-2xl border-2 border-slate-100 p-4 font-bold outline-none focus:border-blue-400"
                    />
                  </div>

                  <input
                    type="text"
                    value={viaje.direccionEstadiaExterior}
                    onChange={(e) => setViaje(prev => ({ ...prev, direccionEstadiaExterior: e.target.value }))}
                    placeholder="Dirección donde estará el menor en el exterior"
                    className="w-full rounded-2xl border-2 border-slate-100 p-4 font-bold outline-none focus:border-blue-400 md:col-span-2"
                  />

                  <div className="grid gap-5 md:col-span-2 md:grid-cols-2">
                    <input
                      type="text"
                      value={viaje.ciudadSuscripcion}
                      onChange={(e) => setViaje(prev => ({ ...prev, ciudadSuscripcion: e.target.value }))}
                      placeholder="Ciudad de suscripción"
                      className="w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-blue-400"
                    />
                    <input
                      type="text"
                      value={viaje.provinciaSuscripcion}
                      onChange={(e) => setViaje(prev => ({ ...prev, provinciaSuscripcion: e.target.value }))}
                      placeholder="Provincia de suscripción"
                      className="w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTravelExtras(!showTravelExtras)}
                  className="mt-6 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700"
                >
                  {showTravelExtras ? 'Ocultar detalles adicionales' : 'Agregar transporte, gastos y teléfono exterior'}
                </button>

                <AnimatePresence>
                  {showTravelExtras && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 grid gap-5 md:grid-cols-2"
                    >
                      <input
                        type="text"
                        value={viaje.telefonoEstadiaExterior}
                        onChange={(e) => setViaje(prev => ({ ...prev, telefonoEstadiaExterior: e.target.value }))}
                        placeholder="Teléfono en el exterior"
                        className="w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-blue-400"
                      />
                      <input
                        type="text"
                        value={viaje.responsableGastos}
                        onChange={(e) => setViaje(prev => ({ ...prev, responsableGastos: e.target.value }))}
                        placeholder="Responsable de gastos"
                        className="w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-blue-400"
                      />
                      <input
                        type="text"
                        value={viaje.medioTransporte}
                        onChange={(e) => setViaje(prev => ({ ...prev, medioTransporte: e.target.value }))}
                        placeholder="Medio de transporte"
                        className="w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-blue-400"
                      />
                      <input
                        type="text"
                        value={viaje.aerolineaTransporte}
                        onChange={(e) => setViaje(prev => ({ ...prev, aerolineaTransporte: e.target.value }))}
                        placeholder="Aerolínea / transporte"
                        className="w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-blue-400"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleNextStep(1)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700"
                >
                  <ArrowLeft size={18} />
                  Volver
                </button>

                <button
                  onClick={() => handleNextStep(3)}
                  className="flex items-center gap-3 rounded-[22px] bg-slate-900 px-8 py-4 text-base font-black text-white hover:bg-black"
                >
                  Revisar y enviar
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            
			
			<motion.div
              key="step3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="space-y-8"
            >
              
			  
			   {/* PANEL DE CONTACTOS - SIEMPRE DISPONIBLE PERO REPLEGADO */}
<section className="mt-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all">
  <button
    type="button"
    onClick={() => setShowEssentialContacts(!showEssentialContacts)}
    className="flex w-full items-center justify-between p-8 hover:bg-slate-50 transition-colors"
  >
    <div className="flex items-center gap-4 text-left">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
        <Users size={24} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">Contactos Esenciales</h2>
        <p className="text-sm text-slate-500">Información de respaldo en Ecuador y Exterior (Opcional).</p>
      </div>
    </div>
    <div className={cn(
      "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-transform duration-300",
      showEssentialContacts ? "rotate-180 bg-slate-900 text-white" : "bg-white text-slate-400"
    )}>
      <ChevronRight size={20} className="rotate-90" />
    </div>
  </button>

  <AnimatePresence>
    {showEssentialContacts && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="border-t border-slate-100 bg-slate-50/30 p-8"
      >
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* CONTACTO EN ECUADOR */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-700">
              <Home size={14} /> En Ecuador
            </h3>
            <div className="grid gap-3">
              <input
                type="text"
                placeholder="Nombres Completos"
                value={contactos.ecuador.nombres}
                onChange={(e) => updateContacto('ecuador', { nombres: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
              />
              <input
                type="tel"
                placeholder="Teléfono / Celular"
                value={contactos.ecuador.telefono}
                onChange={(e) => updateContacto('ecuador', { telefono: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
              />
              <input
                type="text"
                placeholder="Dirección Exacta"
                value={contactos.ecuador.direccion}
                onChange={(e) => updateContacto('ecuador', { direccion: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Provincia"
                  value={contactos.ecuador.provincia}
                  onChange={(e) => updateContacto('ecuador', { provincia: e.target.value.toUpperCase() })}
                  className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={contactos.ecuador.ciudad}
                  onChange={(e) => updateContacto('ecuador', { ciudad: e.target.value.toUpperCase() })}
                  className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* RESPONSABLE EN EL EXTERIOR */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600">
              <Globe2 size={14} /> En el Exterior
            </h3>
            <div className="grid gap-3">
              <input
                type="text"
                placeholder="Nombres Completos"
                value={contactos.exterior.nombres}
                onChange={(e) => updateContacto('exterior', { nombres: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
              />
              <input
                type="tel"
                placeholder="Teléfono Internacional"
                value={contactos.exterior.telefono}
                onChange={(e) => updateContacto('exterior', { telefono: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
              />
              <input
                type="text"
                placeholder="Dirección en el Exterior"
                value={contactos.exterior.direccion}
                onChange={(e) => updateContacto('exterior', { direccion: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Estado / Prov"
                  value={contactos.exterior.provincia}
                  onChange={(e) => updateContacto('exterior', { provincia: e.target.value.toUpperCase() })}
                  className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={contactos.exterior.ciudad}
                  onChange={(e) => updateContacto('exterior', { ciudad: e.target.value.toUpperCase() })}
                  className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</section>

              <section className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionTitle
                  icon={<CheckCircle2 className="text-violet-600" />}
                  title="Confirmaciones finales"
                  description="Lo justo para cerrar el trámite con seguridad."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <ToggleCard
                    label="Declaro que la información ingresada es veraz"
                    value={diagnostico.declaraInformacionVeraz}
                    onChange={(value) => setDiagnostico(prev => ({ ...prev, declaraInformacionVeraz: value }))}
                  />
                  <ToggleCard
                    label="Acepto términos y condiciones"
                    value={diagnostico.aceptaTerminosCondiciones}
                    onChange={(value) => setDiagnostico(prev => ({ ...prev, aceptaTerminosCondiciones: value }))}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <ToggleCard
                    label="¿Ambos padres están de acuerdo?"
                    value={diagnostico.ambosPadresEstanDeAcuerdo}
                    onChange={(value) => setDiagnostico(prev => ({ ...prev, ambosPadresEstanDeAcuerdo: value }))}
                  />
                  <ToggleCard
                    label="¿El progenitor no viajante es localizable?"
                    value={diagnostico.progenitorNoViajanteLocalizable}
                    onChange={(value) => setDiagnostico(prev => ({ ...prev, progenitorNoViajanteLocalizable: value }))}
                  />
                </div>

                <div className="mt-4">
                  <ToggleCard
                    label="¿Existe una condición legal especial?"
                    value={diagnostico.existeCondicionLegalEspecial}
                    onChange={(value) => setDiagnostico(prev => ({ ...prev, existeCondicionLegalEspecial: value }))}
                  />
                </div>

                {diagnostico.existeCondicionLegalEspecial && (
                  <textarea
                    value={diagnostico.detalleCondicionLegalEspecial}
                    onChange={(e) => setDiagnostico(prev => ({ ...prev, detalleCondicionLegalEspecial: e.target.value }))}
                    placeholder="Describe brevemente la condición legal especial"
                    className="mt-4 min-h-[100px] w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-violet-400"
                  />
                )}

                <textarea
                  value={viaje.observacion}
                  onChange={(e) => setViaje(prev => ({ ...prev, observacion: e.target.value }))}
                  placeholder="Observación adicional (opcional)"
                  className="mt-5 min-h-[100px] w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-violet-400"
                />
              </section>

              <section className="rounded-[30px] border border-amber-100 bg-amber-50 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Info className="text-amber-700" size={18} />
                  <h3 className="font-black text-amber-900">Revisión final</h3>
                </div>

                {missingCritical.length === 0 ? (
                  <p className="text-sm font-semibold text-emerald-700">
                    Todo listo. La información mínima crítica ya está completa.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm font-semibold text-amber-800">
                    {missingCritical.map((item, i) => (
                      <li key={i}>�?{item}</li>
                    ))}
                  </ul>
                )}
              </section>

              <div className="flex gap-4">
                <button
                  onClick={() => handleNextStep(2)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700"
                >
                  <ArrowLeft size={18} />
                  Volver
                </button>

                <button
                  disabled={!canSubmit || fetching === 'enviando'}
                  onClick={enviarFormulario}
                  className="flex flex-1 items-center justify-center gap-3 rounded-[22px] bg-green-600 px-8 py-4 text-base font-black text-white hover:bg-green-700 disabled:opacity-35"
                >
                  {fetching === 'enviando' ? <Loader2 className="animate-spin" /> : <Wallet />}
                  {fetching === 'enviando' ? 'Procesando...' : 'Procesar pago'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
	  
	  
	  
	  {paymentProcessing && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
    >
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-50">
        <ShieldCheck className="h-10 w-10 text-cyan-600" />
      </div>
      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-cyan-600" />
      <h3 className="text-xl font-black text-slate-900">{paymentMessage}</h3>
      <p className="mt-2 text-sm text-slate-500">
        No cierres esta ventana mientras procesamos tu solicitud de forma segura.
      </p>
    </motion.div>
  </div>
)}



      <Footer />
      <NoPayChatLauncher />
    </main>
  );
}

function SectionTitle({
  icon,
  title,
  description,
  dark = false
}: {
  icon: ReactNode;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {icon}
      <div>
        <h2 className={cn("text-xl font-bold", dark ? "text-white" : "text-slate-900")}>{title}</h2>
        <p className={cn("text-sm", dark ? "text-slate-300" : "text-slate-500")}>{description}</p>
      </div>
    </div>
  );
}

function ErrorBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
      {children}
    </div>
  );
}



// --- COMPONENTE AUXILIAR MODIFICADO (UI PREMIUM CON FONDO) ---

// --- COMPONENTE AUXILIAR MODIFICADO (UI PREMIUM CON FONDO VECTORIAL) ---
function QuickPersonCard({ title, persona, fetching, onCedulaChange, isMenor, silueta }: any) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-5 sm:p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-cyan-200/50">
      
      {/* CAPA TECH: Silueta Holográfica Adaptable */}
      {/* En móviles es más pequeña (-bottom-4), en desktop crece (-bottom-8) */}
      <div className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 z-0 h-32 w-32 sm:h-48 sm:w-48 text-cyan-500/[0.07] transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:text-cyan-500/[0.12]">
        {silueta}
        {/* Máscara de degradado para fundir la silueta con el fondo */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            {title}
          </span>
          {fetching && (
            <Loader2 className="animate-spin text-cyan-500" size={16} />
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <CedulaInput
            title="Cédula de Identidad"
            value={persona.cedula}
            onChange={onCedulaChange}
            fetching={fetching}
          />
          
          {/* El estado de la persona debe ser compacto en móvil */}
          <div className="min-h-[60px]">
            <PersonStatus status={persona} isFetching={fetching} isMenor={isMenor} />
          </div>
        </div>
      </div>
    </div>
  );
}


function CompactExtraFields({
  title,
  persona,
  onChange
}: {
  title: string;
  persona: PersonaUI;
  onChange: (patch: Partial<PersonaUI>) => void;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <h3 className="mb-4 font-bold text-slate-800">{title}</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={persona.telefono || ''}
          onChange={(e) => onChange({ telefono: e.target.value })}
          placeholder="Teléfono"
          className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
        />
        <input
          type="email"
          value={persona.correo || ''}
          onChange={(e) => onChange({ correo: e.target.value })}
          placeholder="Correo"
          className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
        />
        <input
          type="text"
          value={persona.referenciaDomicilio || ''}
          onChange={(e) => onChange({ referenciaDomicilio: e.target.value })}
          placeholder="Referencia domicilio"
          className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
        />
      </div>
    </div>
  );
}

function MiniContactCard({
  title,
  data,
  onChange,
  required = false,
  icon
}: {
  title: string;
  data: ContactoUI;
  onChange: (patch: Partial<ContactoUI>) => void;
  required?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="font-bold text-slate-800">
          {title} {required && <span className="text-rose-500">*</span>}
        </h3>
      </div>

      <div className="grid gap-3">
        <input
          type="text"
          value={data.nombres}
          onChange={(e) => onChange({ nombres: e.target.value.toUpperCase() })}
          placeholder="Nombres"
          className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
        />
        <input
          type="text"
          value={data.apellidos}
          onChange={(e) => onChange({ apellidos: e.target.value.toUpperCase() })}
          placeholder="Apellidos"
          className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
        />
        <input
          type="text"
          value={data.telefono}
          onChange={(e) => onChange({ telefono: e.target.value })}
          placeholder="Teléfono"
          className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
        />
        <input
          type="text"
          value={data.direccion}
          onChange={(e) => onChange({ direccion: e.target.value })}
          placeholder="Dirección"
          className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            value={data.ciudad}
            onChange={(e) => onChange({ ciudad: e.target.value })}
            placeholder="Ciudad"
            className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
          />
          <input
            type="text"
            value={data.pais}
            onChange={(e) => onChange({ pais: e.target.value })}
            placeholder="País"
            className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function CedulaInput({
  title,
  value,
  onChange,
  fetching,
  dark = false
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  fetching?: boolean;
  dark?: boolean;
}) {
  return (
    <div>
      <label className={cn("mb-2 block text-xs font-black uppercase tracking-wide", dark ? "text-slate-300" : "text-slate-500")}>
        {title}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          placeholder="Número de cédula"
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-2xl p-4 pl-12 font-bold outline-none",
            dark
              ? "border border-white/10 bg-white/5 text-white placeholder:text-slate-400"
              : "border-2 border-slate-100 bg-white text-slate-900 focus:border-cyan-400"
          )}
        />
        <Fingerprint className={cn("absolute left-4 top-1/2 -translate-y-1/2", dark ? "text-slate-400" : "text-slate-300")} size={18} />
        {fetching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-cyan-500" size={18} />}
      </div>
    </div>
  );
}

function ToggleCard({
  label,
  value,
  onChange
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="pr-4 text-sm font-bold text-slate-700">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-black",
            value ? "bg-slate-900 text-white" : "bg-white text-slate-500"
          )}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-black",
            !value ? "bg-rose-600 text-white" : "bg-white text-slate-500"
          )}
        >
          No
        </button>
      </div>
    </div>
  );
}

function PersonStatus({
  status,
  isFetching,
  isMenor = false,
  dark = false
}: {
  status: PersonaUI;
  isFetching: boolean;
  isMenor?: boolean;
  dark?: boolean;
}) {
  if (isFetching) {
    return (
      <div className={cn("flex items-center gap-3 text-sm font-bold", dark ? "text-cyan-400" : "text-cyan-600")}>
        <Loader2 className="animate-spin" size={18} />
        Consultando...
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-500">
        <AlertCircle size={18} />
        {status.error}
      </div>
    );
  }

  if (status.pronto) {
    return (
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("rounded-[22px] border p-4", dark ? "border-white/10 bg-white/5" : "border-emerald-100 bg-emerald-50")}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("text-base font-extrabold uppercase", dark ? "text-white" : "text-slate-900")}>
              {status.nombres} {status.apellidos}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {isMenor && (
                <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-black text-cyan-700">
                  {status.edad} años
                </span>
              )}
              {!!status.nacionalidad && (
                <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-black text-slate-700">
                  {status.nacionalidad}
                </span>
              )}
            </div>
            {!!status.direccion && (
              <p className={cn("mt-2 text-xs", dark ? "text-slate-300" : "text-slate-500")}>
                {status.direccion}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return <p className="text-sm italic text-slate-400">Esperando consulta...</p>;
}