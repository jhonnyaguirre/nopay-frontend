"use client";

import { Suspense, useState, useEffect, ReactNode, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Fingerprint,
  Users,
  FileText,
  CheckCircle2,
  Sparkles,
  Plane,
  Globe2,
  Home,
  Search,
  Building2,
} from "lucide-react";
import { getWizardToken } from "lib/seguridad/sessionUtils";
import { API_BASE_URL } from "config/apiConfig";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { Header } from "app/resources/Header";
import Footer from "app/resources/Footer";
import NoPayBackground from "components/NoPayBackground";
import NoPayChatLauncher from "app/resources/NoPayChatLauncher";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// ==================== TIPOS ====================
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
  tipo_contacto: "CONTACTO_ECUADOR" | "RESPONSABLE_EXTERIOR" | "CONTACTO_EMERGENCIA";
  nombres: string;
  apellidos: string;
  parentesco: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  pais: string;
  identificacion: string;
  observacion: string;
};

interface DetallePermiso {
  secuencial: number;
  codigo_tramite: string;
  pais_destino_nombre: string;
  ciudad_destino: string;
  destino: string;
  fecha_salida: string;
  fecha_retorno?: string;
  salida_indefinida: boolean;
  descripcion_salida_indefinida?: string;
  viaja_con?: string;
  tiene_acompanante: boolean;
  motivo_viaje?: string;
  medio_transporte?: string;
  aerolinea_transporte?: string;
  observacion?: string;
  observacion_validacion_legal?: string;
  listo_para_documento: boolean;
  estado_tramite: string;
  estado_pago: string;
  ciudad_suscripcion?: string;
  provincia_suscripcion?: string;
  pais_suscripcion?: string;
  tiempo_estadia_descripcion?: string;
  direccion_estadia_exterior?: string;
  telefono_estadia_exterior?: string;
  responsable_gastos?: string;
  acepta_terminos_condiciones: boolean;
  declara_informacion_veraz: boolean;
  intervinientes: Array<{
    tipo_persona: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento?: string;
    lugar_nacimiento?: string;
    sexo?: string;
    nacionalidad?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
    es_otorgante: boolean;
    autoriza_salida?: boolean;
    parentesco?: string;
    rol_funcional?: string;
    pais_domicilio?: string;
    provincia_domicilio?: string;
    ciudad_domicilio?: string;
    referencia_domicilio?: string;
  }>;
  contactos?: Array<{
    tipo_contacto: string;
    nombres: string;
    apellidos: string;
    parentesco: string;
    telefono: string;
    correo: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    pais: string;
    identificacion?: string;
    observacion: string;
  }>;
}

const personaVacia = (): PersonaUI => ({
  cedula: "",
  nombres: "",
  apellidos: "",
  nombreCompleto: "",
  fechaNacimiento: "",
  lugarNacimiento: "",
  nacionalidad: "",
  estadoCivil: "",
  sexo: "",
  codigoDactilar: "",
  direccion: "",
  telefono: "",
  correo: "",
  parentesco: "",
  rolFuncional: "",
  paisDomicilio: "ECUADOR",
  provinciaDomicilio: "AZUAY",
  ciudadDomicilio: "CUENCA",
  referenciaDomicilio: "",
  pronto: false,
  edad: 0,
  error: "",
});

const contactoVacio = (
  tipo: ContactoUI["tipo_contacto"],
  pais = "",
  provincia = "",
  ciudad = ""
): ContactoUI => ({
  tipo_contacto: tipo,
  nombres: "",
  apellidos: "",
  parentesco: "",
  telefono: "",
  correo: "",
  direccion: "",
  ciudad,
  provincia,
  pais,
  identificacion: "",
  observacion: "",
});

// ==================== COMPONENTES AUXILIARES (sin cambios) ====================
function SectionTitle({ icon, title, description, dark = false }: any) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {icon}
      <div>
        <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{title}</h2>
        <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-500"}`}>{description}</p>
      </div>
    </div>
  );
}

function CedulaInput({
  title,
  value,
  onChange,
  fetching,
  dark = false,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  fetching?: boolean;
  dark?: boolean;
}) {
  return (
    <div>
      <label className={`mb-2 block text-xs font-black uppercase tracking-wide ${dark ? "text-slate-300" : "text-slate-500"}`}>
        {title}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value || ""}
          placeholder="Número de cédula"
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl p-4 pl-12 font-bold outline-none ${
            dark
              ? "border border-white/10 bg-white/5 text-white placeholder:text-slate-400"
              : "border-2 border-slate-100 bg-white text-slate-900 focus:border-cyan-400"
          }`}
        />
        <Fingerprint
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? "text-slate-400" : "text-slate-300"}`}
          size={18}
        />
        {fetching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-cyan-500" size={18} />}
      </div>
    </div>
  );
}

function PersonStatus({
  status,
  isFetching,
  isMenor = false,
  dark = false,
}: {
  status: PersonaUI;
  isFetching: boolean;
  isMenor?: boolean;
  dark?: boolean;
}) {
  if (isFetching) {
    return (
      <div className={`flex items-center gap-3 text-sm font-bold ${dark ? "text-cyan-400" : "text-cyan-600"}`}>
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
        className={`rounded-[22px] border p-4 ${dark ? "border-white/10 bg-white/5" : "border-emerald-100 bg-emerald-50"}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-base font-extrabold uppercase ${dark ? "text-white" : "text-slate-900"}`}>
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
              <p className={`mt-2 text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>{status.direccion}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
  return <p className="text-sm italic text-slate-400">Esperando consulta...</p>;
}

function QuickPersonCard({ title, persona, fetching, onCedulaChange, isMenor, silueta }: any) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className="absolute -bottom-4 -right-4 z-0 h-32 w-32 text-cyan-500/[0.07] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-cyan-500/[0.12]">
        {silueta}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</span>
          {fetching && <Loader2 className="animate-spin text-cyan-500" size={16} />}
        </div>
        <div className="space-y-4">
          <CedulaInput title="Cédula de Identidad" value={persona.cedula} onChange={onCedulaChange} fetching={fetching} />
          <div className="min-h-[60px]">
            <PersonStatus status={persona} isFetching={fetching} isMenor={isMenor} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleCard({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="pr-4 text-sm font-bold text-slate-700">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-xl px-4 py-2 text-sm font-black ${
            value ? "bg-slate-900 text-white" : "bg-white text-slate-500"
          }`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-xl px-4 py-2 text-sm font-black ${
            !value ? "bg-rose-600 text-white" : "bg-white text-slate-500"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================
function EditarPermisoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigoTramite = searchParams?.get("codigo") ?? "";

  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [secuencialPermiso, setSecuencialPermiso] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    menor: personaVacia(),
    p1: { ...personaVacia(), rolFuncional: "PADRE" },
    p2: { ...personaVacia(), rolFuncional: "MADRE" },
    acompanante: {
      ...personaVacia(),
      activo: false,
      rolFuncional: "TERCERO_ACOMPANANTE",
      parentesco: "TERCERO",
    },
  });

  const [viaje, setViaje] = useState({
    pais: "",
    paisNombre: "",
    paisApiName: "",
    ciudad: "",
    tieneRetorno: true,
    fechaSalida: "",
    fechaRetorno: "",
    ciudadSuscripcion: "Cuenca",
    provinciaSuscripcion: "Azuay",
    paisSuscripcion: "ECUADOR",
    tiempoEstadiaDescripcion: "",
    direccionEstadiaExterior: "",
    telefonoEstadiaExterior: "",
    motivoViaje: "",
    responsableGastos: "",
    medioTransporte: "AÉREO",
    aerolineaTransporte: "",
    observacion: "",
  });

  const [diagnostico, setDiagnostico] = useState({
    viajaCon: "TERCERO",
    ambosPadresEstanDeAcuerdo: true,
    progenitorNoViajanteLocalizable: true,
    existeCondicionLegalEspecial: false,
    detalleCondicionLegalEspecial: "",
    declaraInformacionVeraz: true,
    aceptaTerminosCondiciones: true,
  });

  const [contactos, setContactos] = useState({
    ecuador: contactoVacio("CONTACTO_ECUADOR", "ECUADOR", "Azuay", "Cuenca"),
    exterior: contactoVacio("RESPONSABLE_EXTERIOR"),
    emergencia: contactoVacio("CONTACTO_EMERGENCIA"),
  });

  const [showParentsExtras, setShowParentsExtras] = useState(true);
  const [showTravelExtras, setShowTravelExtras] = useState(true);
  const [showEssentialContacts, setShowEssentialContacts] = useState(true);

  // Estados para países y ciudades
  const [paises, setPaises] = useState<{ id: string; nombre: string; apiName: string; flag: string }[]>([]);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [searchPais, setSearchPais] = useState("");
  const [showPaisList, setShowPaisList] = useState(false);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [searchCiudad, setSearchCiudad] = useState("");
  const [showCiudadList, setShowCiudadList] = useState(false);

  // Cargar países al montar
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
            flag: p.flag || '🏳️'
          }))
          .filter((p: any) => p.nombre && p.apiName)
          .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
        setPaises(lista);
      } catch (error) {
        console.error('Error cargando países:', error);
      } finally {
        setLoadingPaises(false);
      }
    };
    cargarPaises();
  }, []);

  const cargarCiudadesPorPais = async (countryApiName: string) => {
    if (!countryApiName) {
      setCiudades([]);
      return;
    }
    setLoadingCiudades(true);
    setCiudades([]);
    setSearchCiudad("");
    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryApiName })
      });
      const data = await res.json();
      if (!res.ok || data?.error || !Array.isArray(data?.data)) {
        throw new Error(data?.msg || 'No se pudieron cargar las ciudades');
      }
      const lista = [...new Set((data.data as string[]).map(c => c.trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));
      setCiudades(lista);
    } catch (error) {
      console.error('Error cargando ciudades:', error);
      setCiudades([]);
    } finally {
      setLoadingCiudades(false);
    }
  };

  const seleccionarPais = async (pais: { id: string; nombre: string; apiName: string; flag: string }) => {
    setViaje(prev => ({ ...prev, pais: pais.id, paisNombre: pais.nombre, paisApiName: pais.apiName, ciudad: '' }));
    setSearchPais(pais.nombre);
    setShowPaisList(false);
    setSearchCiudad("");
    await cargarCiudadesPorPais(pais.apiName);
  };

  const splitNombre = (nombreCompleto?: string) => {
    const limpio = (nombreCompleto || "").trim().replace(/\s+/g, " ");
    if (!limpio) return { nombres: "", apellidos: "" };
    const partes = limpio.split(" ");
    if (partes.length === 1) return { nombres: partes[0], apellidos: "" };
    if (partes.length === 2) return { nombres: partes[0], apellidos: partes[1] };
    return {
      nombres: partes.slice(0, 2).join(" "),
      apellidos: partes.slice(2).join(" "),
    };
  };

  const calcularEdad = (fecha?: string) => {
    if (!fecha) return 0;
    const cumple = new Date(fecha);
    if (isNaN(cumple.getTime())) return 0;
    const hoy = new Date();
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
    return edad;
  };

  // Cargar datos del permiso usando el código de trámite
  useEffect(() => {
    if (!codigoTramite) return;

    const loadDetalle = async () => {
      setLoadingData(true);
      setError("");
      const token = getWizardToken();
      try {
        const res = await fetch(`${API_BASE_URL}/permisos-salida-dashboard/codigo/${codigoTramite}/detalle`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) {
          setError("Sesión expirada. Redirigiendo...");
          setTimeout(() => router.push("/login"), 1500);
          return;
        }
        if (!res.ok) throw new Error("No se pudo cargar el permiso");
        const data: DetallePermiso = await res.json();

        setSecuencialPermiso(data.secuencial);

        // Datos de viaje
        setViaje(prev => ({
          ...prev,
          paisNombre: data.pais_destino_nombre,
          ciudad: data.ciudad_destino,
          tieneRetorno: !data.salida_indefinida,
          fechaSalida: data.fecha_salida,
          fechaRetorno: data.fecha_retorno || "",
          ciudadSuscripcion: data.ciudad_suscripcion || "Cuenca",
          provinciaSuscripcion: data.provincia_suscripcion || "Azuay",
          paisSuscripcion: data.pais_suscripcion || "ECUADOR",
          tiempoEstadiaDescripcion: data.tiempo_estadia_descripcion || "",
          direccionEstadiaExterior: data.direccion_estadia_exterior || "",
          telefonoEstadiaExterior: data.telefono_estadia_exterior || "",
          motivoViaje: data.motivo_viaje || "",
          responsableGastos: data.responsable_gastos || "",
          medioTransporte: data.medio_transporte || "AÉREO",
          aerolineaTransporte: data.aerolinea_transporte || "",
          observacion: data.observacion || "",
        }));

        setDiagnostico({
          viajaCon: data.viaja_con || "TERCERO",
          ambosPadresEstanDeAcuerdo: true,
          progenitorNoViajanteLocalizable: true,
          existeCondicionLegalEspecial: false,
          detalleCondicionLegalEspecial: "",
          declaraInformacionVeraz: data.declara_informacion_veraz,
          aceptaTerminosCondiciones: data.acepta_terminos_condiciones,
        });

        // Intervinientes
        const menor = data.intervinientes.find((i) => i.tipo_persona === "MENOR");
        const p1 = data.intervinientes.find((i) => i.tipo_persona === "PROGENITOR_1");
        const p2 = data.intervinientes.find((i) => i.tipo_persona === "PROGENITOR_2");
        const acompanante = data.intervinientes.find((i) => i.tipo_persona === "ACOMPANANTE");

        if (menor) {
          setFormData(prev => ({
            ...prev,
            menor: {
              ...prev.menor,
              cedula: menor.cedula,
              nombres: menor.nombres,
              apellidos: menor.apellidos,
              fechaNacimiento: menor.fecha_nacimiento || "",
              lugarNacimiento: menor.lugar_nacimiento || "",
              nacionalidad: menor.nacionalidad || "",
              sexo: menor.sexo || "",
              direccion: menor.direccion || "",
              pronto: true,
              edad: calcularEdad(menor.fecha_nacimiento),
              error: "",
            },
          }));
        }
        if (p1) {
          setFormData(prev => ({
            ...prev,
            p1: {
              ...prev.p1,
              cedula: p1.cedula,
              nombres: p1.nombres,
              apellidos: p1.apellidos,
              fechaNacimiento: p1.fecha_nacimiento || "",
              lugarNacimiento: p1.lugar_nacimiento || "",
              nacionalidad: p1.nacionalidad || "",
              sexo: p1.sexo || "",
              telefono: p1.telefono || "",
              correo: p1.correo || "",
              direccion: p1.direccion || "",
              paisDomicilio: p1.pais_domicilio || "ECUADOR",
              provinciaDomicilio: p1.provincia_domicilio || "AZUAY",
              ciudadDomicilio: p1.ciudad_domicilio || "CUENCA",
              referenciaDomicilio: p1.referencia_domicilio || "",
              pronto: true,
              error: "",
            },
          }));
        }
        if (p2) {
          setFormData(prev => ({
            ...prev,
            p2: {
              ...prev.p2,
              cedula: p2.cedula,
              nombres: p2.nombres,
              apellidos: p2.apellidos,
              fechaNacimiento: p2.fecha_nacimiento || "",
              lugarNacimiento: p2.lugar_nacimiento || "",
              nacionalidad: p2.nacionalidad || "",
              sexo: p2.sexo || "",
              telefono: p2.telefono || "",
              correo: p2.correo || "",
              direccion: p2.direccion || "",
              paisDomicilio: p2.pais_domicilio || "ECUADOR",
              provinciaDomicilio: p2.provincia_domicilio || "AZUAY",
              ciudadDomicilio: p2.ciudad_domicilio || "CUENCA",
              referenciaDomicilio: p2.referencia_domicilio || "",
              pronto: true,
              error: "",
            },
          }));
        }
        if (acompanante) {
          setFormData(prev => ({
            ...prev,
            acompanante: {
              ...prev.acompanante,
              activo: true,
              cedula: acompanante.cedula,
              nombres: acompanante.nombres,
              apellidos: acompanante.apellidos,
              fechaNacimiento: acompanante.fecha_nacimiento || "",
              lugarNacimiento: acompanante.lugar_nacimiento || "",
              nacionalidad: acompanante.nacionalidad || "",
              sexo: acompanante.sexo || "",
              telefono: acompanante.telefono || "",
              correo: acompanante.correo || "",
              direccion: acompanante.direccion || "",
              parentesco: acompanante.parentesco || "",
              pronto: true,
              error: "",
            },
          }));
        }

        // Contactos - CORREGIDO
        if (data.contactos && Array.isArray(data.contactos)) {
          type TipoContactoPermiso =
				  | "CONTACTO_ECUADOR"
				  | "RESPONSABLE_EXTERIOR"
				  | "CONTACTO_EMERGENCIA";

				type ContactoPermiso = {
				  tipo_contacto: TipoContactoPermiso;
				  nombres: string;
				  apellidos: string;
				  parentesco: string;
				  telefono: string;
				  correo: string;
				  direccion: string;
				  ciudad: string;
				  provincia: string;
				  pais: string;
				  identificacion: string;
				  observacion: string;
				};

				const contactosMap: {
				  ecuador: ContactoPermiso | null;
				  exterior: ContactoPermiso | null;
				  emergencia: ContactoPermiso | null;
				} = {
				  ecuador: null,
				  exterior: null,
				  emergencia: null,
				};
          data.contactos.forEach((c: any) => {
            const contactoCompleto: ContactoPermiso = {
				tipo_contacto: c.tipo_contacto as TipoContactoPermiso,
              nombres: c.nombres || "",
              apellidos: c.apellidos || "",
              parentesco: c.parentesco || "",
              telefono: c.telefono || "",
              correo: c.correo || "",
              direccion: c.direccion || "",
              ciudad: c.ciudad || "",
              provincia: c.provincia || "",
              pais: c.pais || "",
              identificacion: c.identificacion || "",
              observacion: c.observacion || "",
            };
            if (c.tipo_contacto === "CONTACTO_ECUADOR") contactosMap.ecuador = contactoCompleto;
            else if (c.tipo_contacto === "RESPONSABLE_EXTERIOR") contactosMap.exterior = contactoCompleto;
            else if (c.tipo_contacto === "CONTACTO_EMERGENCIA") contactosMap.emergencia = contactoCompleto;
          });
          setContactos({
            ecuador: contactosMap.ecuador || contactoVacio("CONTACTO_ECUADOR", "ECUADOR", "Azuay", "Cuenca"),
            exterior: contactosMap.exterior || contactoVacio("RESPONSABLE_EXTERIOR"),
            emergencia: contactosMap.emergencia || contactoVacio("CONTACTO_EMERGENCIA"),
          });
        } else {
          setContactos({
            ecuador: contactoVacio("CONTACTO_ECUADOR", "ECUADOR", "Azuay", "Cuenca"),
            exterior: contactoVacio("RESPONSABLE_EXTERIOR"),
            emergencia: contactoVacio("CONTACTO_EMERGENCIA"),
          });
        }

        // Preseleccionar país después de cargar países
        if (data.pais_destino_nombre && paises.length > 0) {
          const paisEncontrado = paises.find(p => p.nombre === data.pais_destino_nombre);
          if (paisEncontrado) {
            setViaje(prev => ({ ...prev, pais: paisEncontrado.id, paisNombre: paisEncontrado.nombre, paisApiName: paisEncontrado.apiName }));
            setSearchPais(paisEncontrado.nombre);
            await cargarCiudadesPorPais(paisEncontrado.apiName);
          } else {
            setSearchPais(data.pais_destino_nombre || "");
          }
        } else {
          setSearchPais("");
        }
        if (data.ciudad_destino) {
          setSearchCiudad(data.ciudad_destino);
          setViaje(prev => ({ ...prev, ciudad: data.ciudad_destino }));
        } else {
          setSearchCiudad("");
        }

        setLoadingData(false);
      } catch (err: any) {
        setError(err.message);
        setLoadingData(false);
      }
    };
    loadDetalle();
  }, [codigoTramite, paises, router]);

  const updatePersona = (
    campo: "menor" | "p1" | "p2" | "acompanante",
    patch: Partial<PersonaUI>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: { ...prev[campo], ...patch },
    }));
  };

  const updateContacto = (
    campo: "ecuador" | "exterior" | "emergencia",
    patch: Partial<ContactoUI>
  ) => {
    setContactos((prev) => ({
      ...prev,
      [campo]: { ...prev[campo], ...patch },
    }));
  };

  const canGoStep2 = !!formData.menor.pronto && !!formData.p1.pronto && !!formData.p2.pronto;

  // Validación y navegación corregida (incluye identificación de contactos)
  const validateAndNavigate = () => {
    const issues: string[] = [];
    if (!formData.menor.pronto) issues.push('menor');
    if (!formData.p1.pronto) issues.push('p1');
    if (!formData.p2.pronto) issues.push('p2');
    if (!viaje.paisNombre) issues.push('pais');
    if (!viaje.ciudad) issues.push('ciudad');
    if (!viaje.fechaSalida) issues.push('fecha_salida');
    if (viaje.tieneRetorno && !viaje.fechaRetorno) issues.push('fecha_retorno');
    if (!viaje.ciudadSuscripcion) issues.push('ciudad_suscripcion');
    if (!viaje.provinciaSuscripcion) issues.push('provincia_suscripcion');
    if (!viaje.motivoViaje) issues.push('motivoViaje');
    if (!viaje.tiempoEstadiaDescripcion) issues.push('tiempoEstadia');
    if (!viaje.direccionEstadiaExterior) issues.push('direccionExterior');
    if (diagnostico.viajaCon === 'TERCERO' && (!formData.acompanante.pronto || !formData.acompanante.parentesco)) issues.push('acompanante');
    if (!diagnostico.declaraInformacionVeraz) issues.push('declaraVeraz');
    if (!diagnostico.aceptaTerminosCondiciones) issues.push('terminos');

    // Validación de identificación para contactos (si tienen nombre, deben tener identificación)
    if (contactos.ecuador.nombres && contactos.ecuador.nombres.trim() !== "" && !contactos.ecuador.identificacion) {
      issues.push('Identificación del contacto en Ecuador es requerida');
    }
    if (contactos.exterior.nombres && contactos.exterior.nombres.trim() !== "" && !contactos.exterior.identificacion) {
      issues.push('Identificación del contacto en el exterior es requerida');
    }
    if (contactos.emergencia.nombres && contactos.emergencia.nombres.trim() !== "" && !contactos.emergencia.identificacion) {
      issues.push('Identificación del contacto de emergencia es requerida');
    }

    if (issues.length === 0) return true;

    const step1Issues = ['menor', 'p1', 'p2', 'acompanante'];
    const step2Issues = ['pais', 'ciudad', 'fecha_salida', 'fecha_retorno', 'ciudad_suscripcion', 'provincia_suscripcion', 'motivoViaje', 'tiempoEstadia', 'direccionExterior'];
    const step3Issues = ['declaraVeraz', 'terminos', 'Identificación del contacto en Ecuador es requerida', 'Identificación del contacto en el exterior es requerida', 'Identificación del contacto de emergencia es requerida'];

    if (issues.some(i => step1Issues.includes(i))) {
      setCurrentStep(1);
    } else if (issues.some(i => step2Issues.includes(i))) {
      setCurrentStep(2);
    } else if (issues.some(i => step3Issues.includes(i))) {
      setCurrentStep(3);
    }
    setError('Por favor completa los datos faltantes resaltados.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
  };

  const buildIntervinientes = () => {
    const lista: any[] = [
      {
        tipo_persona: "MENOR",
        rol_funcional: "MENOR",
        cedula: formData.menor.cedula,
        nombres: formData.menor.nombres,
        apellidos: formData.menor.apellidos,
        fecha_nacimiento: formData.menor.fechaNacimiento,
        lugar_nacimiento: formData.menor.lugarNacimiento,
        nacionalidad: formData.menor.nacionalidad,
        sexo: formData.menor.sexo,
        direccion: formData.menor.direccion,
        es_otorgante: false,
      },
      {
        tipo_persona: "PROGENITOR_1",
        rol_funcional: "PADRE",
        parentesco: "PADRE",
        cedula: formData.p1.cedula,
        nombres: formData.p1.nombres,
        apellidos: formData.p1.apellidos,
        fecha_nacimiento: formData.p1.fechaNacimiento,
        lugar_nacimiento: formData.p1.lugarNacimiento,
        nacionalidad: formData.p1.nacionalidad,
        sexo: formData.p1.sexo,
        telefono: formData.p1.telefono,
        correo: formData.p1.correo,
        direccion: formData.p1.direccion,
        pais_domicilio: formData.p1.paisDomicilio,
        provincia_domicilio: formData.p1.provinciaDomicilio,
        ciudad_domicilio: formData.p1.ciudadDomicilio,
        referencia_domicilio: formData.p1.referenciaDomicilio,
        es_otorgante: true,
        autoriza_salida: true,
      },
      {
        tipo_persona: "PROGENITOR_2",
        rol_funcional: "MADRE",
        parentesco: "MADRE",
        cedula: formData.p2.cedula,
        nombres: formData.p2.nombres,
        apellidos: formData.p2.apellidos,
        fecha_nacimiento: formData.p2.fechaNacimiento,
        lugar_nacimiento: formData.p2.lugarNacimiento,
        nacionalidad: formData.p2.nacionalidad,
        sexo: formData.p2.sexo,
        telefono: formData.p2.telefono,
        correo: formData.p2.correo,
        direccion: formData.p2.direccion,
        pais_domicilio: formData.p2.paisDomicilio,
        provincia_domicilio: formData.p2.provinciaDomicilio,
        ciudad_domicilio: formData.p2.ciudadDomicilio,
        referencia_domicilio: formData.p2.referenciaDomicilio,
        es_otorgante: true,
        autoriza_salida: true,
      },
    ];
    if (diagnostico.viajaCon === "TERCERO" && formData.acompanante.activo && formData.acompanante.pronto) {
      lista.push({
        tipo_persona: "ACOMPANANTE",
        rol_funcional: "TERCERO_ACOMPANANTE",
        parentesco: formData.acompanante.parentesco || "TERCERO",
        cedula: formData.acompanante.cedula,
        nombres: formData.acompanante.nombres,
        apellidos: formData.acompanante.apellidos,
        fecha_nacimiento: formData.acompanante.fechaNacimiento,
        lugar_nacimiento: formData.acompanante.lugarNacimiento,
        nacionalidad: formData.acompanante.nacionalidad,
        sexo: formData.acompanante.sexo,
        telefono: formData.acompanante.telefono,
        correo: formData.acompanante.correo,
        direccion: formData.acompanante.direccion,
        pais_domicilio: formData.acompanante.paisDomicilio,
        provincia_domicilio: formData.acompanante.provinciaDomicilio,
        ciudad_domicilio: formData.acompanante.ciudadDomicilio,
        referencia_domicilio: formData.acompanante.referenciaDomicilio,
        es_otorgante: false,
        autoriza_salida: false,
      });
    }
    return lista;
  };

  // Función para construir contactos: solo incluye si tiene nombre
  const buildContactos = () => {
    const arr: ContactoUI[] = [];
    if (contactos.ecuador.nombres && contactos.ecuador.nombres.trim() !== "") {
      arr.push(contactos.ecuador);
    }
    if (contactos.exterior.nombres && contactos.exterior.nombres.trim() !== "") {
      arr.push(contactos.exterior);
    }
    if (contactos.emergencia.nombres && contactos.emergencia.nombres.trim() !== "") {
      arr.push(contactos.emergencia);
    }
    return arr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAndNavigate()) return;
    if (!secuencialPermiso) {
      setError("No se pudo identificar el permiso");
      return;
    }

    setSubmitting(true);
    const token = getWizardToken();
    const wizardData = SessionWizardData.obtener();
    const usuarioId = wizardData?.secuencial || 1;

    const form = new FormData();
    form.append("secuencial_usuario", String(usuarioId));
    form.append("pais_destino_codigo", viaje.pais);
    form.append("pais_destino_nombre", viaje.paisNombre);
    form.append("ciudad_destino", viaje.ciudad);
    form.append("fecha_salida", viaje.fechaSalida);
    form.append("fecha_retorno", viaje.tieneRetorno ? viaje.fechaRetorno : "");
    form.append("salida_indefinida", viaje.tieneRetorno ? "false" : "true");
    form.append("descripcion_salida_indefinida", viaje.tieneRetorno ? "" : "Salida indefinida");
    form.append("viaja_con", diagnostico.viajaCon);
    form.append("tiene_acompanante", diagnostico.viajaCon === "TERCERO" ? "true" : "false");
    form.append("ambos_padres_estan_de_acuerdo", diagnostico.ambosPadresEstanDeAcuerdo ? "true" : "false");
    form.append("progenitor_no_viajante_localizable", diagnostico.progenitorNoViajanteLocalizable ? "true" : "false");
    form.append("existe_condicion_legal_especial", diagnostico.existeCondicionLegalEspecial ? "true" : "false");
    form.append("detalle_condicion_legal_especial", diagnostico.detalleCondicionLegalEspecial || "");
    form.append("ciudad_suscripcion", viaje.ciudadSuscripcion);
    form.append("provincia_suscripcion", viaje.provinciaSuscripcion);
    form.append("pais_suscripcion", viaje.paisSuscripcion);
    form.append("tiempo_estadia_descripcion", viaje.tiempoEstadiaDescripcion);
    form.append("direccion_estadia_exterior", viaje.direccionEstadiaExterior);
    form.append("telefono_estadia_exterior", viaje.telefonoEstadiaExterior);
    form.append("motivo_viaje", viaje.motivoViaje);
    form.append("responsable_gastos", viaje.responsableGastos);
    form.append("medio_transporte", viaje.medioTransporte);
    form.append("aerolinea_transporte", viaje.aerolineaTransporte);
    form.append("observacion", viaje.observacion);
    form.append("acepta_terminos_condiciones", diagnostico.aceptaTerminosCondiciones ? "true" : "false");
    form.append("declara_informacion_veraz", diagnostico.declaraInformacionVeraz ? "true" : "false");
    form.append("intervinientesJson", JSON.stringify(buildIntervinientes()));
    form.append("contactosJson", JSON.stringify(buildContactos()));

    try {
      const res = await fetch(`${API_BASE_URL}/permisos-salida/${secuencialPermiso}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        let errorMsg = "Error al actualizar";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          const text = await res.text();
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }
      const result = await res.json();
      router.push("/Servicios/PermisoSalida/PermisosSalidaDashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
    ),
  };

  if (loadingData) {
    return (
      <>
        <NoPayBackground />
        <div className="relative z-10 min-h-screen">
          <Header />
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-12 w-12 text-cyan-600" />
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <NoPayBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-slate-900">Editar permiso de salida</h1>
              <button
                onClick={() => router.push("/Servicios/PermisoSalida/PermisosSalidaDashboard")}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Stepper */}
            <div className="mx-auto mb-8 flex max-w-2xl items-center gap-3">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-1 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl border-2 text-sm font-black transition-all",
                      currentStep >= step ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-400"
                    )}
                  >
                    {currentStep > step ? <Check size={18} /> : step}
                  </div>
                  {step < 3 && (
                    <div className={cn("h-1 flex-1 rounded-full", currentStep > step ? "bg-slate-900" : "bg-slate-200")} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className="space-y-8"
                  >
                    {/* ... paso 1 (sin cambios) ... */}
                    <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">
                      <SectionTitle
                        icon={<Sparkles className="text-cyan-600" />}
                        title="Identificación automática"
                        description="Ingresa las cédulas y el sistema completa gran parte de la información por ti."
                      />
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <QuickPersonCard
                          title="Menor de Edad"
                          persona={formData.menor}
                          fetching={false}
                          onCedulaChange={(v: string) => {
                            const val = v.replace(/\D/g, "").slice(0, 10);
                            updatePersona("menor", { cedula: val, pronto: false, error: "" });
                          }}
                          isMenor
                          silueta={SILUETAS.MENOR}
                        />
                        <QuickPersonCard
                          title="Padre / Otorgante"
                          persona={formData.p1}
                          fetching={false}
                          onCedulaChange={(v: string) => {
                            const val = v.replace(/\D/g, "").slice(0, 10);
                            updatePersona("p1", { cedula: val, pronto: false, error: "" });
                          }}
                          silueta={SILUETAS.PADRE}
                        />
                        <QuickPersonCard
                          title="Madre / Otorgante"
                          persona={formData.p2}
                          fetching={false}
                          onCedulaChange={(v: string) => {
                            const val = v.replace(/\D/g, "").slice(0, 10);
                            updatePersona("p2", { cedula: val, pronto: false, error: "" });
                          }}
                          silueta={SILUETAS.MADRE}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowParentsExtras(!showParentsExtras)}
                        className="mt-8 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700"
                      >
                        {showParentsExtras ? "Ocultar datos adicionales" : "Agregar teléfono, correo y referencia de padres"}
                      </button>

                      <AnimatePresence>
                        {showParentsExtras && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 grid gap-6 md:grid-cols-2"
                          >
                            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                              <h3 className="mb-4 font-bold text-slate-800">Datos del padre</h3>
                              <div className="grid gap-3">
                                <input
                                  type="text"
                                  value={formData.p1.telefono || ""}
                                  onChange={(e) => updatePersona("p1", { telefono: e.target.value })}
                                  placeholder="Teléfono"
                                  className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
                                />
                                <input
                                  type="email"
                                  value={formData.p1.correo || ""}
                                  onChange={(e) => updatePersona("p1", { correo: e.target.value })}
                                  placeholder="Correo"
                                  className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
                                />
                                <input
                                  type="text"
                                  value={formData.p1.referenciaDomicilio || ""}
                                  onChange={(e) => updatePersona("p1", { referenciaDomicilio: e.target.value })}
                                  placeholder="Referencia domicilio"
                                  className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
                                />
                              </div>
                            </div>
                            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                              <h3 className="mb-4 font-bold text-slate-800">Datos de la madre</h3>
                              <div className="grid gap-3">
                                <input
                                  type="text"
                                  value={formData.p2.telefono || ""}
                                  onChange={(e) => updatePersona("p2", { telefono: e.target.value })}
                                  placeholder="Teléfono"
                                  className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
                                />
                                <input
                                  type="email"
                                  value={formData.p2.correo || ""}
                                  onChange={(e) => updatePersona("p2", { correo: e.target.value })}
                                  placeholder="Correo"
                                  className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
                                />
                                <input
                                  type="text"
                                  value={formData.p2.referenciaDomicilio || ""}
                                  onChange={(e) => updatePersona("p2", { referenciaDomicilio: e.target.value })}
                                  placeholder="Referencia domicilio"
                                  className="rounded-xl border border-slate-200 bg-white p-3 font-semibold outline-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="rounded-[36px] bg-slate-900 p-8 text-white shadow-2xl">
                      <SectionTitle
                        icon={<Users className="text-cyan-400" />}
                        title="¿Con quién viaja el menor?"
                        description="Según tu selección, pediremos solo los datos realmente necesarios."
                        dark
                      />
                      <div className="grid gap-4 md:grid-cols-4">
                        {[
                          { value: "TERCERO", label: "Con tercero" },
                          { value: "PADRE", label: "Con el padre" },
                          { value: "MADRE", label: "Con la madre" },
                          { value: "AMBOS_PADRES", label: "Con ambos" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setDiagnostico((prev) => ({ ...prev, viajaCon: opt.value }))}
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
                        {diagnostico.viajaCon === "TERCERO" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-8 border-t border-white/10 pt-8"
                          >
                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-4">
                                <CedulaInput
                                  title="Cédula del acompañante"
                                  value={formData.acompanante.cedula}
                                  onChange={(v) => {
                                    const val = v.replace(/\D/g, "").slice(0, 10);
                                    updatePersona("acompanante", { cedula: val, pronto: false, error: "" });
                                  }}
                                  fetching={false}
                                  dark
                                />
                                <input
                                  type="text"
                                  value={formData.acompanante.parentesco || ""}
                                  onChange={(e) => updatePersona("acompanante", { parentesco: e.target.value.toUpperCase() })}
                                  placeholder="Relación con el menor"
                                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold text-white outline-none placeholder:text-slate-400"
                                />
                                <div className="grid gap-3 md:grid-cols-2">
                                  <input
                                    type="text"
                                    value={formData.acompanante.telefono || ""}
                                    onChange={(e) => updatePersona("acompanante", { telefono: e.target.value })}
                                    placeholder="Teléfono"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold text-white outline-none placeholder:text-slate-400"
                                  />
                                  <input
                                    type="email"
                                    value={formData.acompanante.correo || ""}
                                    onChange={(e) => updatePersona("acompanante", { correo: e.target.value })}
                                    placeholder="Correo"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold text-white outline-none placeholder:text-slate-400"
                                  />
                                </div>
                              </div>
                              <PersonStatus status={formData.acompanante} isFetching={false} dark />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
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
                    <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">
                      <SectionTitle
                        icon={<Plane className="text-blue-600" />}
                        title="Datos del viaje"
                        description="Primero te pedimos lo esencial, y luego los detalles complementarios."
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        {/* País destino con autocompletado */}
                        <div className="relative">
                          <input
                            type="text"
                            value={searchPais}
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
                              ) : paises.filter(p => p.nombre.toLowerCase().includes(searchPais.toLowerCase())).length === 0 ? (
                                <div className="p-3 text-sm text-slate-500">Sin coincidencias.</div>
                              ) : (
                                paises
                                  .filter(p => p.nombre.toLowerCase().includes(searchPais.toLowerCase()))
                                  .map(p => (
                                    <button
                                      key={p.id}
                                      type="button"
                                      onClick={() => seleccionarPais(p)}
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

                        {/* Ciudad destino con autocompletado */}
                        <div className="relative">
                          <input
                            type="text"
                            value={searchCiudad}
                            placeholder={viaje.paisNombre ? 'Ciudad destino' : 'Primero selecciona un país'}
                            disabled={!viaje.paisNombre}
                            onFocus={() => { if (viaje.paisNombre && ciudades.length > 0) setShowCiudadList(true); }}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSearchCiudad(val);
                              setViaje(prev => ({ ...prev, ciudad: val }));
                            }}
                            className="w-full rounded-2xl border-2 border-slate-100 p-4 pl-12 font-bold outline-none focus:border-blue-400 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          {showCiudadList && viaje.paisNombre && ciudades.length > 0 && (
                            <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                              {loadingCiudades ? (
                                <div className="p-3 text-sm text-slate-500">Cargando ciudades...</div>
                              ) : ciudades.filter(c => c.toLowerCase().includes(searchCiudad.toLowerCase())).length === 0 ? (
                                <div className="p-3 text-sm text-slate-500">No se encontraron ciudades. Puedes escribirla manualmente.</div>
                              ) : (
                                ciudades
                                  .filter(c => c.toLowerCase().includes(searchCiudad.toLowerCase()))
                                  .map(ciudad => (
                                    <button
                                      key={ciudad}
                                      type="button"
                                      onClick={() => {
                                        setViaje(prev => ({ ...prev, ciudad }));
                                        setSearchCiudad(ciudad);
                                        setShowCiudadList(false);
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
                            value={viaje.fechaSalida}
                            onChange={(e) => setViaje(prev => ({ ...prev, fechaSalida: e.target.value }))}
                            className="w-full rounded-2xl border-2 border-slate-100 p-4 font-bold outline-none focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-600">Fecha de retorno</label>
                          <input
                            type="date"
                            value={viaje.fechaRetorno}
                            onChange={(e) =>
                              setViaje((prev) => ({
                                ...prev,
                                fechaRetorno: e.target.value,
                                tieneRetorno: true,
                              }))
                            }
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
                        {showTravelExtras ? "Ocultar detalles adicionales" : "Agregar transporte, gastos y teléfono exterior"}
                      </button>

                      <AnimatePresence>
                        {showTravelExtras && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
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
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700"
                      >
                        <ArrowLeft size={18} />
                        Volver
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
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
                    {/* Contactos esenciales */}
                    <div className="mt-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all">
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
                            <p className="text-sm text-slate-500">
                              Información de respaldo en Ecuador y Exterior (Opcional).
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-transform duration-300",
                            showEssentialContacts ? "rotate-180 bg-slate-900 text-white" : "bg-white text-slate-400"
                          )}
                        >
                          <ChevronRight size={20} className="rotate-90" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {showEssentialContacts && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-100 bg-slate-50/30 p-8"
                          >
                            <div className="grid gap-10 md:grid-cols-2">
                              <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-700">
                                  <Home size={14} /> En Ecuador
                                </h3>
                                <div className="grid gap-3">
                                  <input
                                    type="text"
                                    placeholder="Nombres Completos"
                                    value={contactos.ecuador.nombres}
                                    onChange={(e) => updateContacto("ecuador", { nombres: e.target.value.toUpperCase() })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                  />
                                  <input
                                    type="tel"
                                    placeholder="Teléfono / Celular"
                                    value={contactos.ecuador.telefono}
                                    onChange={(e) => updateContacto("ecuador", { telefono: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Número de identificación (cédula, pasaporte)"
                                    value={contactos.ecuador.identificacion}
                                    onChange={(e) => updateContacto("ecuador", { identificacion: e.target.value.toUpperCase() })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Dirección Exacta"
                                    value={contactos.ecuador.direccion}
                                    onChange={(e) => updateContacto("ecuador", { direccion: e.target.value.toUpperCase() })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <input
                                      type="text"
                                      placeholder="Provincia"
                                      value={contactos.ecuador.provincia}
                                      onChange={(e) => updateContacto("ecuador", { provincia: e.target.value.toUpperCase() })}
                                      className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Ciudad"
                                      value={contactos.ecuador.ciudad}
                                      onChange={(e) => updateContacto("ecuador", { ciudad: e.target.value.toUpperCase() })}
                                      className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600">
                                  <Globe2 size={14} /> En el Exterior
                                </h3>
                                <div className="grid gap-3">
                                  <input
                                    type="text"
                                    placeholder="Nombres Completos"
                                    value={contactos.exterior.nombres}
                                    onChange={(e) => updateContacto("exterior", { nombres: e.target.value.toUpperCase() })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                  />
                                  <input
                                    type="tel"
                                    placeholder="Teléfono Internacional"
                                    value={contactos.exterior.telefono}
                                    onChange={(e) => updateContacto("exterior", { telefono: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Número de identificación (cédula, pasaporte)"
                                    value={contactos.exterior.identificacion}
                                    onChange={(e) => updateContacto("exterior", { identificacion: e.target.value.toUpperCase() })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Dirección en el Exterior"
                                    value={contactos.exterior.direccion}
                                    onChange={(e) => updateContacto("exterior", { direccion: e.target.value.toUpperCase() })}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <input
                                      type="text"
                                      placeholder="Estado / Prov"
                                      value={contactos.exterior.provincia}
                                      onChange={(e) => updateContacto("exterior", { provincia: e.target.value.toUpperCase() })}
                                      className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Ciudad"
                                      value={contactos.exterior.ciudad}
                                      onChange={(e) => updateContacto("exterior", { ciudad: e.target.value.toUpperCase() })}
                                      className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-cyan-500 shadow-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">
                      <SectionTitle
                        icon={<CheckCircle2 className="text-violet-600" />}
                        title="Confirmaciones finales"
                        description="Lo justo para cerrar el trámite con seguridad."
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <ToggleCard
                          label="Declaro que la información ingresada es veraz"
                          value={diagnostico.declaraInformacionVeraz}
                          onChange={(value) => setDiagnostico((prev) => ({ ...prev, declaraInformacionVeraz: value }))}
                        />
                        <ToggleCard
                          label="Acepto términos y condiciones"
                          value={diagnostico.aceptaTerminosCondiciones}
                          onChange={(value) => setDiagnostico((prev) => ({ ...prev, aceptaTerminosCondiciones: value }))}
                        />
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <ToggleCard
                          label="¿Ambos padres están de acuerdo?"
                          value={diagnostico.ambosPadresEstanDeAcuerdo}
                          onChange={(value) => setDiagnostico((prev) => ({ ...prev, ambosPadresEstanDeAcuerdo: value }))}
                        />
                        <ToggleCard
                          label="¿El progenitor no viajante es localizable?"
                          value={diagnostico.progenitorNoViajanteLocalizable}
                          onChange={(value) => setDiagnostico((prev) => ({ ...prev, progenitorNoViajanteLocalizable: value }))}
                        />
                      </div>
                      <div className="mt-4">
                        <ToggleCard
                          label="¿Existe una condición legal especial?"
                          value={diagnostico.existeCondicionLegalEspecial}
                          onChange={(value) => setDiagnostico((prev) => ({ ...prev, existeCondicionLegalEspecial: value }))}
                        />
                      </div>
                      {diagnostico.existeCondicionLegalEspecial && (
                        <textarea
                          value={diagnostico.detalleCondicionLegalEspecial}
                          onChange={(e) => setDiagnostico((prev) => ({ ...prev, detalleCondicionLegalEspecial: e.target.value }))}
                          placeholder="Describe brevemente la condición legal especial"
                          className="mt-4 min-h-[100px] w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-violet-400"
                        />
                      )}
                      <textarea
                        value={viaje.observacion}
                        onChange={(e) => setViaje((prev) => ({ ...prev, observacion: e.target.value }))}
                        placeholder="Observación adicional (opcional)"
                        className="mt-5 min-h-[100px] w-full rounded-2xl border-2 border-slate-100 p-4 font-semibold outline-none focus:border-violet-400"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700"
                      >
                        <ArrowLeft size={18} />
                        Volver
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex flex-1 items-center justify-center gap-3 rounded-[22px] bg-green-600 px-8 py-4 text-base font-black text-white hover:bg-green-700 disabled:opacity-35"
                      >
                        {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                        {submitting ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </main>
        <Footer />
        <NoPayChatLauncher />
      </div>
    </>
  );
}

export default function EditarPermisoPage() {
  return (
    <Suspense
      fallback={
        <>
          <NoPayBackground />
          <div className="relative z-10 min-h-screen">
            <Header />
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
            </div>
            <Footer />
          </div>
        </>
      }
    >
      <EditarPermisoPageContent />
    </Suspense>
  );
}

