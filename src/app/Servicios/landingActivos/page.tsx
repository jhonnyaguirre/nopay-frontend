'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Plane,
  Sparkles,
  Fingerprint,
  Globe2,
  Zap,
  Gavel,
  BadgeCheck,
  User,
  CreditCard,
  Mail,
  Phone,
  CalendarDays,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lock,
  Shield,
} from 'lucide-react';

import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import { SessionWizardData } from 'lib/seguridad/SessionWizardData';
import { getWizardToken } from 'lib/seguridad/sessionUtils';
import { getUserProfile, setUserProfile } from 'lib/seguridad/SessionUser';
import { API_BASE_URL } from 'config/apiConfig';
import { isJWTValid, useLogout } from 'lib/seguridad/prevalidadorToken';

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const Badge = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50/50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-pink-600 backdrop-blur-md">
    <Sparkles size={12} className="animate-pulse" /> {children}
  </div>
);

const Notification = ({
  message,
  tone = 'success',
  onClose,
}: {
  message: string;
  tone?: 'success' | 'error' | 'info';
  onClose: () => void;
}) => {
  const toneMap = {
    success: {
      wrap: 'border-emerald-200 bg-white/95',
      iconBox: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      title: 'Notificación',
    },
    error: {
      wrap: 'border-red-200 bg-white/95',
      iconBox: 'bg-red-50',
      iconColor: 'text-red-600',
      title: 'Atención',
    },
    info: {
      wrap: 'border-cyan-200 bg-white/95',
      iconBox: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      title: 'Información',
    },
  };

  const styles = toneMap[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      className="fixed bottom-4 right-4 z-[80] w-[calc(100%-2rem)] max-w-md"
    >
      <div
        className={cn(
          'rounded-2xl p-4 shadow-2xl backdrop-blur-xl border',
          styles.wrap
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              styles.iconBox
            )}
          >
            {tone === 'error' ? (
              <AlertCircle className={cn('h-5 w-5', styles.iconColor)} />
            ) : tone === 'info' ? (
              <Shield className={cn('h-5 w-5', styles.iconColor)} />
            ) : (
              <Check className={cn('h-5 w-5', styles.iconColor)} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900">{styles.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            &times;
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const GlobalLoader = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 backdrop-blur-sm"
  >
    <div className="mx-4 w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/95 p-6 text-center shadow-2xl">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50">
        <Loader2 className="h-7 w-7 animate-spin text-pink-600" />
      </div>
      <p className="text-base font-semibold text-slate-900">{message}</p>
      <p className="mt-1 text-xs text-slate-600">
        Estamos preparando tu acceso de forma segura.
      </p>
    </div>
  </motion.div>
);

const Field = ({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) => (
  <div>
    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    {error && (
      <p className="mt-1 flex items-center gap-2 text-xs text-red-600">
        <AlertCircle className="h-3.5 w-3.5" />
        {error}
      </p>
    )}
  </div>
);

function InputBase({
  className = '',
  icon,
  right,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100',
          icon ? 'pl-9 pr-3' : 'px-3',
          right ? 'pr-9' : '',
          props.disabled ? 'cursor-not-allowed bg-slate-50 text-slate-500' : '',
          className
        )}
      />
      {right && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
      )}
    </div>
  );
}

type ServiceCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  delay: number;
  isNew?: boolean;
  disabled?: boolean;
};



const ServiceCard = ({
  title,
  description,
  icon,
  route,
  delay,
  isNew,
  disabled = false,
}: ServiceCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    router.push(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={disabled ? undefined : { y: -6 }}
      onClick={handleClick}
      className={cn(
        'group relative',
        disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
      )}
    >
      {/* Borde exterior animado con gradiente (solo en hover) */}
      <div
        className={cn(
          'absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-xl transition duration-500 group-hover:opacity-40',
          disabled && 'opacity-0'
        )}
      />

      {/* Tarjeta principal con efecto glassmorfismo sutil */}
      <div
        className={cn(
          'relative flex h-full flex-col rounded-2xl border bg-white/90 p-6 backdrop-blur-sm transition-all duration-300',
          disabled
            ? 'border-slate-200 shadow-sm'
            : 'border-slate-200/80 shadow-lg group-hover:border-transparent group-hover:shadow-2xl'
        )}
      >
        {/* Línea de acento superior que se ilumina en hover */}
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-slate-300 to-transparent group-hover:via-pink-500 transition-all duration-500" />

        {/* Efecto de brillo sutil en toda la tarjeta al hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-pink-500/0 transition duration-500 group-hover:via-white/5 group-hover:to-pink-500/5" />

        {/* Etiqueta "Nuevo" minimalista (si aplica) */}
        {isNew && !disabled && (
          <div className="absolute right-5 top-5 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm">
              <Sparkles size={10} />
              Nuevo
            </span>
          </div>
        )}

        {/* Mensaje de bloqueo por perfil */}
        {disabled && (
          <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 shadow-sm backdrop-blur-sm">
            <Lock size={10} />
            Perfil requerido
          </div>
        )}

        {/* Contenedor del icono con degradado moderno y efecto 3D */}
        <div
          className={cn(
            'relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md transition-all duration-500',
            disabled
              ? 'bg-slate-100 text-slate-400'
              : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white group-hover:scale-110 group-hover:from-pink-600 group-hover:to-indigo-600'
          )}
        >
          {icon}
          {/* Pequeño brillo en el icono */}
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Título y descripción */}
        <div className="relative z-10 flex flex-1 flex-col">
          <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="mb-6 text-sm font-normal leading-relaxed text-slate-500">
            {description}
          </p>

          {/* Enlace de acción con flecha animada */}
          <div
            className={cn(
              'mt-auto flex items-center gap-2 text-sm font-semibold transition-colors',
              disabled ? 'text-slate-400' : 'text-slate-700 group-hover:text-pink-600'
            )}
          >
            <span className="text-xs uppercase tracking-wider">
              {disabled ? 'Completa tu perfil' : 'Acceder al servicio'}
            </span>
            <ArrowRight
              size={16}
              className={cn(
                'transition-transform duration-300',
                !disabled && 'group-hover:translate-x-1'
              )}
            />
          </div>
        </div>

        {/* Detalle de esquina inferior: sello de confianza (aparece en hover) */}
        {!disabled && (
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-slate-400">
              <ShieldCheck size={10} />
              <span>Plataforma Segura</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};



type UsuarioResponse = {
  secuencial?: number | string;
  cedula?: string;
  nombres?: string;
  apellidos?: string;
  desSexo?: string;
  fechaNacimiento?: string | number | null;
  email?: string;
  celular?: string;
};

export default function LandingServicios() {
  const router = useRouter();
  const logout = useLogout();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fetchingUserData, setFetchingUserData] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationTone, setNotificationTone] = useState<'success' | 'error' | 'info'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  const [showProfileDetails, setShowProfileDetails] = useState(true);
  const [profileReady, setProfileReady] = useState(false);
  const [cedulaBloqueada, setCedulaBloqueada] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState('');

  const [cedula, setCedula] = useState('');
  const [userData, setUserData] = useState({
    secuencial: '',
    nombres: '',
    apellidos: '',
    genero: '',
    fechaNacimiento: null as Date | null,
    email: '',
    telefono: '',
  });

  // ---------- FUNCIÓN PARA VERIFICAR SI EL PERFIL ESTÁ COMPLETO ----------
  const isProfileComplete = (data: typeof userData, currentCedula: string, emailSesion: string) => {
    const hasValidCedula = currentCedula && currentCedula.length === 10 && validarCedulaEcuador(currentCedula);
    const hasNombres = data.nombres.trim().length > 0;
    const hasApellidos = data.apellidos.trim().length > 0;
    const hasTelefono = data.telefono.trim().length > 0;
    const hasEmail = (data.email || emailSesion).trim().length > 0;
    return hasValidCedula && hasNombres && hasApellidos && hasTelefono && hasEmail;
  };

  // ---------- VALIDACIÓN DE CÉDULA ECUATORIANA ----------
  const validarCedulaEcuador = (value: string) => {
    if (!/^\d{10}$/.test(value)) return false;
    const provincia = parseInt(value.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false;

    const digitos = value.split('').map(Number);
    const verificador = digitos[9];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let valor = digitos[i];
      if (i % 2 === 0) {
        valor *= 2;
        if (valor > 9) valor -= 9;
      }
      suma += valor;
    }

    const decenaSuperior = Math.ceil(suma / 10) * 10;
    const digitoCalculado = decenaSuperior - suma;
    return digitoCalculado === verificador || (digitoCalculado === 10 && verificador === 0);
  };

  const cedulaValida = useMemo(() => validarCedulaEcuador(cedula), [cedula]);

  const nombreCompleto = useMemo(() => {
    return `${userData.nombres || ''} ${userData.apellidos || ''}`.trim();
  }, [userData.nombres, userData.apellidos]);

  const formatDateToInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getEmailSesionNormalizado = () => {
    const wizardData = SessionWizardData.obtener();
    return (
      userData.email ||
      sessionEmail ||
      wizardData?.email ||
		(typeof wizardData?.cedula === "string" && wizardData.cedula.includes("@")
		  ? wizardData.cedula
		  : "") ||
      ''
    )
      .trim()
      .toLowerCase();
  };

  const limpiarCamposSensibles = (preserveEmail?: string) => {
    setUserData({
      secuencial: '',
      nombres: '',
      apellidos: '',
      genero: '',
      fechaNacimiento: null,
      email: preserveEmail || sessionEmail || '',
      telefono: '',
    });
    setCedulaBloqueada(false);
    setProfileReady(false);
    setShowProfileDetails(true);
  };

  // ---------- APLICAR DATOS DEL BACKEND SIN ACTIVAR SERVICIOS ----------
  const aplicarUsuario = (data: UsuarioResponse, emailFinal: string) => {
    setCedula(data.cedula || '');
    setCedulaBloqueada(true);

  const newUserData = {
  secuencial: data.secuencial?.toString() || '',
  nombres: data.nombres || '',
  apellidos: data.apellidos || '',
  genero:
    data.desSexo === 'HOMBRE'
      ? 'masculino'
      : data.desSexo === 'MUJER'
      ? 'femenino'
      : '',
  fechaNacimiento: data.fechaNacimiento
    ? new Date(Number(data.fechaNacimiento))
    : null,
  email: emailFinal,
  telefono: data.celular || '',
};
    setUserData(newUserData);

    const wizardData = SessionWizardData.obtener() || {};
   SessionWizardData.guardar({
  ...wizardData,
  cedula: data.cedula || '',
  email: emailFinal,
  secuencial: Number(data.secuencial || 0),
  nombres: data.nombres || '',
  apellidos: data.apellidos || '',
  celular: data.celular || '',
  fechaNacimiento: data.fechaNacimiento ? String(data.fechaNacimiento) : '',
});

    const profile = getUserProfile();
    setUserProfile({
      name: `${data.nombres || ''} ${data.apellidos || ''}`.trim(),
      photoUrl: profile?.photoUrl ? profile.photoUrl : '/images/avatar.png',
    });

    setShowProfileDetails(true);
  };

  const verificarCuentaSegura = (data: UsuarioResponse) => {
    const emailSesion = getEmailSesionNormalizado();
    const emailBackend = (data.email || '').trim().toLowerCase();

    if (emailBackend && emailSesion && emailBackend !== emailSesion) {
      setNotificationTone('error');
      setNotificationMessage('Cédula registrada a otra cuenta');
      setShowNotification(true);
      setErrorMsg('Cédula registrada a otra cuenta');
      limpiarCamposSensibles(userData.email || sessionEmail);
      return false;
    }
    return true;
  };

  const consultarUsuario = async (identificador: string): Promise<UsuarioResponse | null> => {
    const token = getWizardToken();
    if (!token) {
      router.replace('/login');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/usuariosid/${identificador}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 403) {
      logout();
      router.replace('/login');
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data || null;
  };

  // ---------- GUARDADO SILENCIOSO (SOLO SINCRO, NO ACTIVA PERFIL) ----------
  const guardarPerfilSilencioso = async (datos: {
    nombres: string;
    apellidos: string;
    cedula: string;
    fechaNacimiento: Date | null;
    email: string;
    celular: string;
  }) => {
    const token = getWizardToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/perfil/guardar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombres: datos.nombres,
          apellidos: datos.apellidos,
          cedula: datos.cedula,
          fechaNacimiento: datos.fechaNacimiento
            ? datos.fechaNacimiento.toISOString().split('T')[0]
            : null,
          email: datos.email,
          usuarioCrea: 'admin',
          celular: datos.celular,
        }),
      });
    } catch (error) {
      console.error('Error en guardado silencioso:', error);
    }
  };

  // ---------- RECUPERAR DATOS POR CÉDULA ----------
  const buscarUsuarioPorCedula = async () => {
    const token = getWizardToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    if (!cedula || cedula.length !== 10 || !cedulaValida) {
      setErrorMsg('Ingresa una cédula ecuatoriana válida de 10 dígitos.');
      return;
    }

    setFetchingUserData(true);
    setErrorMsg(null);
    setProfileReady(false);
    setCedulaBloqueada(false);

    try {
      const response = await fetch(`${API_BASE_URL}/usuariosid/${cedula.trim()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 403) {
        logout();
        router.replace('/login');
        return;
      }

      if (!response.ok) {
        setNotificationTone('info');
        setNotificationMessage(
          'No encontramos un perfil registrado todavía. Completa tus datos y guárdalos para habilitar tus servicios.'
        );
        setShowNotification(true);

        setUserData((prev) => ({
          ...prev,
          secuencial: '',
          nombres: '',
          apellidos: '',
          genero: '',
          fechaNacimiento: null,
          email: prev.email || sessionEmail,
          telefono: '',
        }));
        setProfileReady(false);
        setShowProfileDetails(true);
        return;
      }

      const data: UsuarioResponse = await response.json();

      if (!verificarCuentaSegura(data)) {
        setCedula(cedula.trim());
        return;
      }

      const wizardData = SessionWizardData.obtener();
const emailFinal =
  data.email ||
  wizardData?.email ||
  sessionEmail ||
  '';

      aplicarUsuario(
        {
          ...data,
          cedula: data.cedula || cedula.trim(),
        },
        emailFinal
      );

      await guardarPerfilSilencioso({
        nombres: data.nombres || '',
        apellidos: data.apellidos || '',
        cedula: data.cedula || cedula.trim(),
        fechaNacimiento: data.fechaNacimiento ? new Date(Number(data.fechaNacimiento)) : null,
        email: emailFinal,
        celular: data.celular || '',
      });

      const updatedUserData = {
        ...userData,
        nombres: data.nombres || '',
        apellidos: data.apellidos || '',
        telefono: data.celular || '',
        email: emailFinal,
      };
      const isComplete = isProfileComplete(
        { ...updatedUserData, fechaNacimiento: data.fechaNacimiento ? new Date(Number(data.fechaNacimiento)) : null },
        cedula.trim(),
        emailFinal
      );

      if (isComplete) {
        setProfileReady(true);
        setShowProfileDetails(false);
        setNotificationTone('success');
        setNotificationMessage('Perfil completo. Tus servicios ya están disponibles.');
        setShowNotification(true);
      } else {
        setProfileReady(false);
        setShowProfileDetails(true);
        setNotificationTone('info');
        setNotificationMessage('Datos recuperados. Completa los campos obligatorios (especialmente teléfono) y guarda para habilitar los servicios.');
        setShowNotification(true);
      }
    } catch {
      setErrorMsg('No pudimos consultar tus datos en este momento.');
    } finally {
      setFetchingUserData(false);
    }
  };

  // ---------- GUARDADO MANUAL (ACTIVA SERVICIOS) ----------
  const guardarPerfil = async () => {
    if (!cedula || !cedulaValida) {
      setErrorMsg('Debes ingresar una cédula válida.');
      return;
    }

    if (!userData.nombres.trim()) {
      setErrorMsg('Los nombres son obligatorios.');
      return;
    }

    if (!userData.apellidos.trim()) {
      setErrorMsg('Los apellidos son obligatorios.');
      return;
    }

    if (!userData.telefono.trim()) {
      setErrorMsg('El teléfono es obligatorio.');
      return;
    }

    const token = getWizardToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    const emailFinal = (userData.email || sessionEmail).trim();
    if (!emailFinal) {
      setErrorMsg('No pudimos recuperar el correo de la sesión.');
      return;
    }

    const emailSesionNormalizado = getEmailSesionNormalizado();
    if (emailSesionNormalizado && emailFinal.toLowerCase() !== emailSesionNormalizado) {
      setErrorMsg('El correo del perfil no coincide con la sesión activa.');
      setNotificationTone('error');
      setNotificationMessage('Cédula registrada a otra cuenta');
      setShowNotification(true);
      return;
    }

    setSavingProfile(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_BASE_URL}/perfil/guardar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombres: userData.nombres.trim(),
          apellidos: userData.apellidos.trim(),
          cedula: cedula.trim(),
          fechaNacimiento: userData.fechaNacimiento
            ? userData.fechaNacimiento.toISOString().split('T')[0]
            : null,
          email: emailFinal,
          usuarioCrea: 'admin',
          celular: userData.telefono.trim(),
        }),
      });

      const rawText = await response.text();
      let result: any = {};
      try {
        result = rawText ? JSON.parse(rawText) : {};
      } catch {
        result = { mensaje: rawText };
      }

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.mensaje ||
            `No se pudo registrar el usuario. HTTP ${response.status}`
        );
      }

      const usuarioPersistido = await consultarUsuario(cedula.trim());
      if (!usuarioPersistido?.cedula) {
        throw new Error(
          'El servicio respondió correctamente, pero no fue posible confirmar el registro del usuario.'
        );
      }

      if (!verificarCuentaSegura(usuarioPersistido)) {
        return;
      }

      const emailPersistido = usuarioPersistido.email || emailFinal;
      aplicarUsuario(usuarioPersistido, emailPersistido);

      setProfileReady(true);
      setShowProfileDetails(false);
      setNotificationTone('success');
      setNotificationMessage(result?.mensaje || 'Tu perfil quedó registrado correctamente. ¡Servicios habilitados!');
      setShowNotification(true);
    } catch (error: any) {
      setNotificationTone('error');
      setNotificationMessage(error?.message || 'Ocurrió un problema al guardar tus datos.');
      setShowNotification(true);
    } finally {
      setSavingProfile(false);
    }
  };

  const abrirEdicionPerfil = () => {
    setShowProfileDetails(true);
    setProfileReady(false);
    setCedulaBloqueada(false);
  };

  // ---------- INICIALIZACIÓN AL CARGAR LA PÁGINA ----------
  useEffect(() => {
    const validateTokenAndAuth = async () => {
      const token = getWizardToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const isValid = await isJWTValid(token);
        if (!isValid) {
          logout();
          router.replace('/login');
          return;
        }
      } catch {
        logout();
        router.replace('/login');
        return;
      } finally {
        setCheckingAuth(false);
      }
    };

    validateTokenAndAuth();
  }, [logout, router]);

  useEffect(() => {
    if (checkingAuth) return;

    const inicializarPerfil = async () => {
      
	  
	  const wizardData = SessionWizardData.obtener();
const rawIdentity = (wizardData?.cedula || '').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const emailSesionInicial =
        (wizardData?.email || '').trim() ||
        (emailRegex.test(rawIdentity) ? rawIdentity : '');

      if (emailSesionInicial) {
        setSessionEmail(emailSesionInicial);
        setUserData((prev) => ({
          ...prev,
          email: emailSesionInicial,
        }));
      }

      const identityToQuery = (rawIdentity || emailSesionInicial).trim();

      if (!identityToQuery) {
        setProfileReady(false);
        setShowProfileDetails(true);
        return;
      }

      setFetchingUserData(true);
      setErrorMsg(null);

      try {
        const data = await consultarUsuario(identityToQuery);

        if (!data?.cedula) {
          setCedula(emailRegex.test(rawIdentity) ? '' : rawIdentity);
          setProfileReady(false);
          setShowProfileDetails(true);
          return;
        }

        if (!verificarCuentaSegura(data)) {
          setCedula(emailRegex.test(rawIdentity) ? '' : rawIdentity);
          return;
        }

        const emailFinal =
          data.email ||
          wizardData?.email ||
          emailSesionInicial ||
          '';

        aplicarUsuario(data, emailFinal);

        const isComplete = isProfileComplete(
          {
            nombres: data.nombres || '',
            apellidos: data.apellidos || '',
            telefono: data.celular || '',
            email: emailFinal,
            fechaNacimiento: data.fechaNacimiento ? new Date(Number(data.fechaNacimiento)) : null,
            secuencial: data.secuencial?.toString() || '',
            genero: '',
          },
          data.cedula || '',
          emailFinal
        );

        if (isComplete) {
          setProfileReady(true);
          setShowProfileDetails(false);
        } else {
          setProfileReady(false);
          setShowProfileDetails(true);
        }
      } catch {
        setCedula(emailRegex.test(rawIdentity) ? '' : rawIdentity);
        setProfileReady(false);
        setShowProfileDetails(true);
      } finally {
        setFetchingUserData(false);
      }
    };

    inicializarPerfil();
  }, [checkingAuth, logout, router]);

  // ---------- RENDER ----------
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FBFBFE]">
        <GlobalLoader message="Verificando tu acceso seguro..." />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {fetchingUserData && <GlobalLoader message="Recuperando tus datos personales..." />}
      </AnimatePresence>
      <AnimatePresence>
        {savingProfile && <GlobalLoader message="Guardando tu perfil y habilitando tus servicios..." />}
      </AnimatePresence>
      <AnimatePresence>
        {showNotification && (
          <Notification
            message={notificationMessage}
            tone={notificationTone}
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>

      <div className="text-[13px] sm:text-[14px]">
        <main className="min-h-screen bg-[#FBFBFE] text-slate-900">
          <Header />

          <section className="relative overflow-hidden px-5 pt-20 pb-8 lg:pt-28 lg:pb-12 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-full max-w-7xl opacity-40">
              <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-pink-200/50 blur-[120px]" />
              <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Badge>NoPay Legal Ecosystem</Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-4xl font-black leading-[1.1] tracking-tighter text-slate-900 sm:text-6xl lg:text-7xl"
              >
                Bienvenido a <br />
                <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 bg-clip-text text-transparent italic">
                  tu Centro de Soluciones.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg"
              >
                Primero validamos tu perfil de forma segura. Después podrás acceder a
                todos los servicios legales activos de NoPay.
              </motion.p>
            </div>
          </section>

          <section className="relative z-10 mx-auto max-w-7xl px-5 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-xl"
            >
              <div className="relative">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600" />

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-indigo-600 text-white shadow-md">
                        <ShieldCheck className="h-7 w-7" />
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-pink-600">
                          Validación de perfil
                        </p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                          {profileReady && nombreCompleto
                            ? `Hola, ${nombreCompleto}`
                            : 'Completa tus datos personales'}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                          {profileReady
                            ? 'Tu perfil ya está listo. Tus servicios se encuentran habilitados y puedes continuar.'
                            : 'Necesitamos validar o completar tus datos una sola vez para habilitar de forma segura los servicios legales.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]',
                          profileReady
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        )}
                      >
                        {profileReady ? <Check size={12} /> : <Lock size={12} />}
                        {profileReady ? 'Perfil activo' : 'Pendiente de completar'}
                      </div>

                      {!profileReady && (
                        <button
                          type="button"
                          onClick={() => setShowProfileDetails((prev) => !prev)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          {showProfileDetails ? 'Ocultar detalle' : 'Ver detalle'}
                          {showProfileDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      )}

                      {profileReady && (
                        <button
                          type="button"
                          onClick={abrirEdicionPerfil}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:translate-y-[-1px] hover:shadow-lg"
                        >
                          Editar perfil
                        </button>
                      )}
                    </div>
                  </div>

                  {!showProfileDetails && profileReady && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 grid gap-3 sm:grid-cols-3"
                    >
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Nombre
                        </p>
                        <p className="mt-1 text-base font-bold text-slate-900">
                          {nombreCompleto || 'Usuario'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Identificación
                        </p>
                        <p className="mt-1 text-base font-bold text-slate-900">
                          {cedula || '-'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Estado
                        </p>
                        <p className="mt-1 text-base font-bold text-emerald-700">
                          Servicios habilitados
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence initial={false}>
                    {showProfileDetails && (
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
                      >
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-pink-600 shadow-sm">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900">
                              Perfil personal
                            </h3>
                            <p className="text-xs text-slate-600">
                              Ingresa tu cédula para recuperar tus datos o completa tu perfil para habilitar los servicios.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                          <Field
                            label="Cédula"
                            hint="Ingresa tu número de identificación ecuatoriano de 10 dígitos."
                            error={
                              cedula.length === 10 && !cedulaValida
                                ? 'La cédula no es válida. Verifica los dígitos.'
                                : errorMsg
                            }
                          >
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <div className="flex-1">
                                <InputBase
                                  type="text"
                                  value={cedula}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setCedula(value);
                                    setErrorMsg(null);
                                    if (profileReady) setProfileReady(false);
                                  }}
                                  placeholder="Ej: 1712345678"
                                  maxLength={10}
                                  disabled={cedulaBloqueada}
                                  icon={<CreditCard className="h-3.5 w-3.5" />}
                                  right={
                                    cedula.length === 10 ? (
                                      cedulaValida ? (
                                        <Check className="h-4 w-4 text-emerald-600" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                      )
                                    ) : null
                                  }
                                />
                              </div>

                              <button
                                type="button"
                                onClick={buscarUsuarioPorCedula}
                                disabled={!cedulaValida || fetchingUserData}
                                className={cn(
                                  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition',
                                  cedulaValida && !fetchingUserData
                                    ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white hover:translate-y-[-1px] hover:shadow-lg'
                                    : 'cursor-not-allowed bg-slate-200 text-slate-400'
                                )}
                              >
                                {fetchingUserData ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    Recuperar datos
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </>
                                )}
                              </button>
                            </div>
                          </Field>

                          <div className="flex w-fit items-center gap-1.5 rounded-full border border-pink-100 bg-pink-50 px-3 py-1.5 text-xs text-pink-700">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span className="font-semibold text-[11px]">
                              Tus datos se usan únicamente para habilitar y proteger tus trámites legales.
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field label="Nombres" required>
                              <InputBase
                                type="text"
                                value={userData.nombres}
                                onChange={(e) =>
                                  setUserData((prev) => ({ ...prev, nombres: e.target.value }))
                                }
                                placeholder="Ej: Juan Carlos"
                                icon={<User className="h-3.5 w-3.5" />}
                                disabled={cedulaBloqueada && profileReady}
                                right={
                                  userData.nombres ? (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  ) : null
                                }
                              />
                            </Field>

                            <Field label="Apellidos" required>
                              <InputBase
                                type="text"
                                value={userData.apellidos}
                                onChange={(e) =>
                                  setUserData((prev) => ({ ...prev, apellidos: e.target.value }))
                                }
                                placeholder="Ej: Pérez Gómez"
                                icon={<User className="h-3.5 w-3.5" />}
                                disabled={cedulaBloqueada && profileReady}
                                right={
                                  userData.apellidos ? (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  ) : null
                                }
                              />
                            </Field>

                            <Field label="Fecha de nacimiento">
                              <InputBase
                                type="date"
                                value={
                                  userData.fechaNacimiento
                                    ? formatDateToInput(userData.fechaNacimiento)
                                    : ''
                                }
                                onChange={(e) =>
                                  setUserData((prev) => ({
                                    ...prev,
                                    fechaNacimiento: e.target.value
                                      ? new Date(`${e.target.value}T00:00:00`)
                                      : null,
                                  }))
                                }
                                icon={<CalendarDays className="h-3.5 w-3.5" />}
                                right={
                                  userData.fechaNacimiento ? (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  ) : null
                                }
                              />
                            </Field>

                            <Field label="Teléfono" required>
                              <InputBase
                                type="tel"
                                value={userData.telefono}
                                onChange={(e) =>
                                  setUserData((prev) => ({
                                    ...prev,
                                    telefono: e.target.value.replace(/[^\d+]/g, '').slice(0, 15),
                                  }))
                                }
                                placeholder="Ej: 0987654321"
                                icon={<Phone className="h-3.5 w-3.5" />}
                                right={
                                  userData.telefono ? (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  ) : null
                                }
                              />
                            </Field>

                            <div className="md:col-span-2">
                              <Field
                                label="Correo electrónico"
                                required
                                hint="Este correo se toma desde tu sesión actual."
                              >
                                <InputBase
                                  type="email"
                                  value={userData.email || sessionEmail}
                                  readOnly
                                  disabled
                                  icon={<Mail className="h-3.5 w-3.5" />}
                                  right={
                                    userData.email || sessionEmail ? (
                                      <Check className="h-4 w-4 text-emerald-600" />
                                    ) : null
                                  }
                                />
                              </Field>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs text-slate-500">
                              {profileReady ? (
                                <span className="font-semibold text-emerald-700">
                                  Perfil listo. Tus servicios ya están habilitados.
                                </span>
                              ) : (
                                <span>
                                  <span className="font-semibold text-amber-700">Campos obligatorios:</span> Nombres, Apellidos, Teléfono.
                                  Una vez guardados, las tarjetas de servicios se activarán automáticamente.
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={guardarPerfil}
                              disabled={
                                savingProfile ||
                                !cedulaValida ||
                                !userData.nombres.trim() ||
                                !userData.apellidos.trim() ||
                                !userData.telefono.trim() ||
                                !(userData.email || sessionEmail)
                              }
                              className={cn(
                                'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold shadow-md transition',
                                !savingProfile &&
                                  cedulaValida &&
                                  !!userData.nombres.trim() &&
                                  !!userData.apellidos.trim() &&
                                  !!userData.telefono.trim() &&
                                  !!(userData.email || sessionEmail)
                                  ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white hover:translate-y-[-1px] hover:shadow-lg'
                                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
                              )}
                            >
                              {savingProfile ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Guardando...
                                </>
                              ) : (
                                <>
                                  Guardar y habilitar servicios
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24">
            <div className="mb-8 flex flex-col items-center justify-between gap-5 border-b border-slate-100 pb-8 lg:flex-row">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Servicios Activos
                </h2>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {profileReady
                    ? 'Haz clic en una tarjeta para iniciar'
                    : 'Completa tu perfil para habilitar el acceso'}
                </p>
              </div>

              <div className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm sm:flex">
                {profileReady ? (
                  <>
                    <Zap size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      Procesamiento Prioritario Activo
                    </span>
                  </>
                ) : (
                  <>
                    <Lock size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">
                      Servicios bloqueados hasta validar perfil
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <ServiceCard
                title="Permiso de Salida del País de Menores"
                description="Gestiona la autorización notarial para el viaje de menores al exterior de forma digital. Validado con normativa 2026."
                icon={<Plane size={26} />}
                route="/Servicios/PermisoSalida/PermisosSalidaDashboard"
                delay={0.1}
                isNew={true}
                disabled={!profileReady}
              />

              <ServiceCard
                title="Apelación de Multas de Tránsito"
                description="Impugna fotomultas y citaciones injustas mediante nuestro motor de análisis legal automatizado. Alta tasa de éxito."
                icon={<Gavel size={26} />}
                route="/Usuario/ServiciosPorUsuario"
                delay={0.2}
                isNew={true}
                disabled={!profileReady}
              />

              <ServiceCard
                title="Registro de Marcas"
                description="Protege tu marca, logo o nombre comercial. Registro nacional ante el SENADI con respaldo legal y seguimiento digital."
                icon={<BadgeCheck size={26} />}
                route="/Servicios/Marcas/MarcasDashboard"
                delay={0.3}
                isNew={true}
                disabled={!profileReady}
              />
            </div>

            {!profileReady && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Antes de continuar
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-slate-700">
                      Para proteger tus trámites, NoPay habilita los servicios solo cuando el perfil del usuario ha sido validado o guardado correctamente.
                      Completa todos los campos obligatorios (Nombres, Apellidos, Teléfono) y haz clic en “Guardar y habilitar servicios”.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-16 grid grid-cols-1 gap-6 rounded-3xl border border-slate-200 bg-white/50 p-8 backdrop-blur-xl sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="mb-3 text-pink-600" size={26} />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                  Seguridad 256-bit
                </h4>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Tus datos legales están protegidos por encriptación de grado bancario.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <Fingerprint className="mb-3 text-indigo-600" size={26} />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                  Firma Electrónica
                </h4>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Integración nativa con firmas electrónicas certificadas.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <Globe2 className="mb-3 text-emerald-600" size={26} />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                  Validez Nacional
                </h4>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Documentos aceptados en aeropuertos y entidades de control.
                </p>
              </div>
            </div>
          </section>

          <NoPayChatLauncher />
          <Footer />
        </main>
      </div>
    </>
  );
}