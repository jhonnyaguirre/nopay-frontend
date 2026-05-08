'use client';

import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
 
import { API_BASE_URL, valorRegistroMarcaPhase1, valorRegistroMarcaPhase2 } from "config/apiConfig";

import {
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  CircleAlert,
  FileCheck,
  Fingerprint,
  Globe2,
  Info,
  Layers3,
  Loader2,
  LockKeyhole,
  Palette,
  Phone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  UserRound,
  Wallet,
  Laptop2,
  Scale,
  Megaphone,
  GraduationCap,
  UtensilsCrossed,
  ShoppingBag,
  Gem,
  ScanSearch,
  ChevronRight,
  Shield,
  Lock,
  Eye,
} from 'lucide-react';

import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import { getWizardToken } from 'lib/seguridad/sessionUtils';
import { isJWTValid, useLogout } from 'lib/seguridad/prevalidadorToken';
 

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const SessionPaymentManager = {
  guardar: (datos: any) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('temp_payment_data', JSON.stringify(datos));
    }
  }
};

type SignType = 'NOMINATIVA' | 'MIXTA' | 'FIGURATIVA' | '';
type BusinessCategory =
  | 'TECNOLOGIA'
  | 'SERVICIOS_LEGALES'
  | 'RETAIL'
  | 'MODA_BISUTERIA'
  | 'ALIMENTOS'
  | 'EDUCACION'
  | 'MARKETING'
  | 'OTRO'
  | '';

type GrowthIntent = 'LOCAL' | 'NACIONAL' | 'INTERNACIONAL' | '';
type MainConcern = 'COPIA' | 'EXPANSION' | 'FORMALIZAR' | 'INVERSION' | '';

type DiagnosticResultLevel = 'ALTO' | 'MEDIO' | 'RIESGO' | 'INDETERMINADO';

type DiagnosticPayload = {
  score: number;
  result: DiagnosticResultLevel;
  badge: string;
  title: string;
  subtitle: string;
  strengths: string[];
  alerts: string[];
  suggestedClasses: Array<{
    classNumber: number;
    label: string;
    why: string;
  }>;
  recommendation: string;
  lawyerMessage: string;
};

type ContactLead = {
  fullName: string;
  phone: string;
  email: string;
  holderType: 'NATURAL' | 'JURIDICA';
};

const initialLead: ContactLead = {
  fullName: '',
  phone: '',
  email: '',
  holderType: 'NATURAL',
};

const PHASE1_PRICE = Number(valorRegistroMarcaPhase1);
const PHASE2_PRICE = Number(valorRegistroMarcaPhase2);
const TOTAL_REFERENCE_PRICE = PHASE1_PRICE + PHASE2_PRICE;

export default function RegistroMarcaDiagnosticoNoPay() {
  const router = useRouter();
  const logout = useLogout();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(true);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  const [usuarioId, setUsuarioId] = useState<number>(1);
  const [generalError, setGeneralError] = useState('');
  const [fetching, setFetching] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [checkoutReady, setCheckoutReady] = useState(false);

  const [brandName, setBrandName] = useState('');
  const [signType, setSignType] = useState<SignType>('MIXTA');

  const [businessCategory, setBusinessCategory] = useState<BusinessCategory>('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [growthIntent, setGrowthIntent] = useState<GrowthIntent>('');

  const [alreadyUsingBrand, setAlreadyUsingBrand] = useState<boolean | null>(null);
  const [hasLogo, setHasLogo] = useState<boolean | null>(null);
  const [hasDigitalPresence, setHasDigitalPresence] = useState<boolean | null>(null);
  const [mainConcern, setMainConcern] = useState<MainConcern>('');

  const [lead, setLead] = useState<ContactLead>(initialLead);

  const [diagnostic, setDiagnostic] = useState<DiagnosticPayload | null>(null);
  const [createdCase, setCreatedCase] = useState<{ secuencial?: number; codigo_tramite?: string } | null>(null);

  const categoryMeta = {
    TECNOLOGIA: {
      title: 'Tecnología / Software',
      desc: 'Apps, plataformas, SaaS, automatización, software.',
      icon: <Laptop2 size={24} />
    },
    SERVICIOS_LEGALES: {
      title: 'Servicios Legales',
      desc: 'Despachos, legal-tech, asesoría, defensa, trámites.',
      icon: <Scale size={24} />
    },
    RETAIL: {
      title: 'Retail / Comercio',
      desc: 'Tiendas, productos, venta física o ecommerce.',
      icon: <Store size={24} />
    },
    MODA_BISUTERIA: {
      title: 'Moda / Bisutería',
      desc: 'Accesorios, joyería, ropa, marcas de estilo.',
      icon: <Gem size={24} />
    },
    ALIMENTOS: {
      title: 'Alimentos',
      desc: 'Restaurantes, snacks, cafeterías, marcas gastronómicas.',
      icon: <UtensilsCrossed size={24} />
    },
    EDUCACION: {
      title: 'Educación',
      desc: 'Cursos, capacitaciones, academia, enseñanza.',
      icon: <GraduationCap size={24} />
    },
    MARKETING: {
      title: 'Marketing / Publicidad',
      desc: 'Agencias, branding, medios, gestión digital.',
      icon: <Megaphone size={24} />
    },
    OTRO: {
      title: 'Otro',
      desc: 'Un negocio distinto que igual necesita protección.',
      icon: <Briefcase size={24} />
    },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    detectSize();
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  useEffect(() => {
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
        setUsuarioId(100);
      }

       

      setLoading(false);
    };

    validate();
  }, [logout, router]);

  useEffect(() => {
    if (step === 4 && diagnostic && (diagnostic.result === 'ALTO' || diagnostic.result === 'MEDIO')) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [step, diagnostic]);

  const canAnalyze = useMemo(() => {
    return (
      !!brandName.trim() &&
      !!signType &&
      !!businessCategory &&
      !!businessDescription.trim() &&
      !!growthIntent &&
      alreadyUsingBrand !== null &&
      hasLogo !== null &&
      hasDigitalPresence !== null &&
      !!mainConcern
    );
  }, [
    brandName,
    signType,
    businessCategory,
    businessDescription,
    growthIntent,
    alreadyUsingBrand,
    hasLogo,
    hasDigitalPresence,
    mainConcern
  ]);

  const canCreateCase = useMemo(() => {
    return (
      !!lead.fullName.trim() &&
      !!lead.phone.trim() &&
      !!lead.email.trim() &&
      !!lead.holderType &&
      !!diagnostic
    );
  }, [lead, diagnostic]);

  const heroTitle = useMemo(() => {
    if (!brandName.trim()) return 'Descubre si tu marca tiene potencial de protección legal';
    return `Veamos si "${brandName.trim()}" tiene buen potencial para ser protegida`;
  }, [brandName]);

  const goToStep = (nextStep: 1 | 2 | 3 | 4 | 5) => {
    setStep(nextStep);
    setGeneralError('');
    scrollToTop();
  };

  const runDiagnostic = async () => {
    if (!canAnalyze) {
      setGeneralError('Completa las respuestas mínimas para generar el diagnóstico.');
      return;
    }

    setGeneralError('');
    setFetching('diagnostic');
    setIsAnalyzing(true);
    scrollToTop();

    try {
      const token = getWizardToken();

      const body = new FormData();
      body.append('secuencial_usuario', String(usuarioId));
      body.append('nombre_marca', brandName.trim().toUpperCase());
      body.append('tipo_signo', signType);
      body.append('actividad_categoria', businessCategory);
      body.append('descripcion_negocio', businessDescription.trim());
      body.append('alcance_comercial', growthIntent);
      body.append('ya_usa_marca', String(alreadyUsingBrand));
      body.append('tiene_logo', String(hasLogo));
      body.append('tiene_presencia_digital', String(hasDigitalPresence));
      body.append('preocupacion_principal', mainConcern);

      await sleep(500);

      const response = await fetch(`${API_BASE_URL}/marcas/diagnostico-preview`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.msg || data?.error || 'No se pudo generar el diagnóstico preliminar.');
      }

      const normalized: DiagnosticPayload = {
        score: Number(data?.score ?? 0),
        result: (data?.result || 'INDETERMINADO') as DiagnosticResultLevel,
        badge: data?.badge || 'Diagnóstico preliminar',
        title: data?.title || 'Resultado preliminar generado',
        subtitle: data?.subtitle || 'La IA ha completado una primera evaluación del signo.',
        strengths: Array.isArray(data?.strengths) ? data.strengths : [],
        alerts: Array.isArray(data?.alerts) ? data.alerts : [],
        suggestedClasses: Array.isArray(data?.suggestedClasses) ? data.suggestedClasses : [],
        recommendation: data?.recommendation || '',
        lawyerMessage: data?.lawyerMessage || '',
      };

      setDiagnostic(normalized);
      setStep(4);
    } catch (error: any) {
      setGeneralError(error?.message || 'No se pudo generar el diagnóstico.');
    } finally {
      setIsAnalyzing(false);
      setFetching(null);
    }
  };



	const createCaseAndGoToOffer = async () => {
		
	const wizardData = SessionWizardData.obtener();
const cedulaUsuario = wizardData?.cedula || '';
const apellidoUsuario = wizardData?.apellidos || '';
const nombresUsuario = wizardData?.nombres || '';
const emailUsuario = wizardData?.email || lead.email;


  if (!canCreateCase || !diagnostic) {
    setGeneralError('Completa tu nombre, teléfono y correo para continuar.');
    return;
  }

  setGeneralError('');
  setFetching('create-case');
  setPaymentProcessing(true);
  setPaymentMessage('Preparando tu expediente inicial...');

  try {
    const token = getWizardToken();

    const body = new FormData();
    body.append('secuencial_usuario', String(usuarioId));
    body.append('nombre_marca', brandName.trim().toUpperCase());
    body.append('tipo_signo', signType);
    body.append(
      'actividad_economica',
      String(categoryMeta[businessCategory as keyof typeof categoryMeta]?.title || businessCategory)
    );
    body.append('descripcion_productos_servicios', businessDescription.trim());
    body.append('cobertura_geografica', growthIntent);
    body.append('ya_usa_marca', String(alreadyUsingBrand));
    body.append('tiene_logo', String(hasLogo));
    body.append('tiene_redes', String(hasDigitalPresence));
    body.append('tiene_sitio_web', 'false');
    body.append('dominio_web', '');
    body.append('instagram', '');
    body.append('facebook', '');
    body.append('tiktok', '');
    body.append('observaciones_cliente', `Preocupación principal: ${mainConcern}`);
    body.append('recomendacion_ia', diagnostic.recommendation);
    body.append('mensaje_abogado', diagnostic.lawyerMessage);
    body.append('diagnostico_completo', JSON.stringify(diagnostic));

    const clasesJson = JSON.stringify(
      (diagnostic.suggestedClasses || []).map((item: any, idx: number) => ({
        numero_clase: Number(item.classNumber),
        descripcion_clase: item.label || '',
        productos_servicios: item.why || businessDescription.trim(),
        fuente: 'IA',
        es_principal: idx === 0,
        estado_registro: 'PROPUESTA',
        observacion: 'Clase sugerida preliminarmente por IA desde wizard'
      }))
    );

    const nombreSeparado = splitFullName(lead.fullName.trim().toUpperCase());

    const titularesJson = JSON.stringify([
      {
        tipo_titular: lead.holderType,
        es_principal: true,
        nombres: lead.holderType === 'NATURAL' ? nombreSeparado.nombres : '',
        apellidos: lead.holderType === 'NATURAL' ? nombreSeparado.apellidos : '',
        razon_social: lead.holderType === 'JURIDICA' ? lead.fullName.trim().toUpperCase() : '',
        identificacion: 'PENDIENTE',
        tipo_identificacion: 'OTRO',
        telefono: lead.phone.trim(),
        correo: lead.email.trim(),
        direccion: '',
        ciudad: '',
        provincia: '',
        pais: 'ECUADOR',
        representante_legal: '',
        observacion: 'Titular preliminar capturado desde wizard corto'
      }
    ]);

    const contactosJson = JSON.stringify([
      {
        tipo_contacto: 'CLIENTE',
        nombres: lead.fullName.trim().toUpperCase(),
        apellidos: '',
        telefono: lead.phone.trim(),
        correo: lead.email.trim(),
        cargo:
          lead.holderType === 'JURIDICA'
            ? 'REPRESENTANTE / CONTACTO INICIAL'
            : 'TITULAR / CONTACTO INICIAL',
        observacion: 'Lead capturado desde wizard inteligente'
      }
    ]);

    body.append('titular_principal_tipo', lead.holderType);
    body.append('clasesJson', clasesJson);
    body.append('titularesJson', titularesJson);
    body.append('contactosJson', contactosJson);
    body.append('acepta_terminos_condiciones', 'true');
    body.append('declara_informacion_veraz', 'true');
    body.append('tipo_resultado_diagnostico', diagnostic.title);

    await sleep(700);
    setPaymentMessage('Cifrando datos y validando consistencia...');
    await sleep(700);
    setPaymentMessage('Asignando revisión legal inicial...');
    await sleep(650);

    const response = await fetch(`${API_BASE_URL}/marcas`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.msg || data?.error || 'No se pudo crear el trámite.');
    }

    setCreatedCase({
      secuencial: data?.secuencial,
      codigo_tramite: data?.codigo_tramite,
    });

    const resumen = {
      citacion: data?.codigo_tramite || `MR-${Date.now()}`,
      item: `${brandName.trim().toUpperCase()} - REGISTRO DE MARCA`,
      servicio: String(data?.secuencial || ''),
      valor: String(PHASE1_PRICE),
      displayName: 'BÚSQUEDA FONÉTICA DE MARCA',
      estado: data?.estado || 'DIAGNOSTICO_GENERADO',
      score_confianza_ia: String(diagnostic.score),
      resultado: diagnostic.result,
      titular: lead.fullName.trim().toUpperCase(),
      tipoPago: 'FASE_1',
      fase1_valor: String(PHASE1_PRICE),
      fase2_valor: String(PHASE2_PRICE),
      valor_total_referencial: String(TOTAL_REFERENCE_PRICE),
      fase2_descripcion:
        'Carga de solicitud, seguimiento profesional legal, tasas estatales y acompañamiento hasta registro', 
	  cedula: cedulaUsuario,      // ← clave para evitar redirección
	  apellido: apellidoUsuario,
	  nombres: nombresUsuario,
	  email: emailUsuario,   // (opcional pero mejora la experiencia)
    };

    try {
      localStorage.setItem('pagoResumenDatos', JSON.stringify(resumen));
    } catch {}

    SessionPaymentManager.guardar(resumen);

    setCheckoutReady(true);
    setPaymentProcessing(false);
    setFetching(null);
    goToStep(5);
  } catch (error: any) {
    setPaymentProcessing(false);
    setFetching(null);
    setGeneralError(error?.message || 'No se pudo crear el trámite.');
  }
};


const continueToResumenPago = async () => {
  setGeneralError('');
  setPaymentProcessing(true);

  try {
    setPaymentMessage('Preparando fase 1 del servicio...');
    await sleep(650);

    setPaymentMessage('Generando orden de pago segura...');
    await sleep(650);

    setPaymentMessage('Redirigiendo al resumen de pago...');
    await sleep(500);

    window.location.href = '/resumenPago';
  } catch (error: any) {
    setGeneralError(error?.message || 'No se pudo continuar al resumen de pago.');
  } finally {
    setPaymentProcessing(false);
  }
};


  if (loading) return null;

  const resultMeta = getResultMeta(diagnostic?.result || 'INDETERMINADO');

  // Progress indicator helper
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className="flex items-center">
          <div className={cn(
            "h-2 w-8 rounded-full transition-all duration-300",
            step >= s ? "bg-pink-500 shadow-sm" : "bg-slate-200"
          )} />
          {s < 4 && <ChevronRight size={14} className="text-slate-300 mx-1" />}
        </div>
      ))}
    </div>
  );

  return (
    
	<main className="min-h-screen bg-[#FBFBFE] relative overflow-hidden text-slate-900">
      {/* Background premium pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {showConfetti && diagnostic && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={showConfetti}
          numberOfPieces={diagnostic.result === 'ALTO' ? 200 : 140}
          gravity={0.12}
          colors={['#FFD700', '#FFFFFF', '#F472B6', '#FDF2F8', '#A7F3D0', '#2DD4BF']}
        />
      )}

      <Header />
	  
	  <div style={{ transform: 'scale(0.76)', transformOrigin: 'top left', width: 'calc(100% / 0.76)' }}>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <header className="mb-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/60 backdrop-blur-sm px-5 py-1.5 text-xs font-black uppercase tracking-widest text-pink-600 shadow-sm"
          >
            <ShieldCheck size={16} /> Evaluación de Marca Inteligente
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl mb-8 leading-[1.06]"
          >
            {heroTitle.split('protegida').length > 1 ? (
              <>
                {heroTitle.replace('protegida', '')}
                <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent italic">
                  protegida
                </span>
              </>
            ) : (
              <>
                {heroTitle}
                <br />
                <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent italic">
                  en menos de 1 minuto.
                </span>
              </>
            )}
          </motion.h1>

          <motion.p className="text-xl font-medium leading-relaxed text-slate-700 max-w-3xl">
            NoPay recopila lo mínimo necesario, activa un diagnóstico con IA desde backend y luego
            conecta tu caso con un abogado real para darle continuidad profesional.
          </motion.p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <main>
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-16 sm:p-20 text-center"
                >
                  <div className="relative mb-10">
                    <Loader2 className="h-20 w-20 animate-spin text-pink-500 stroke-[1.5]" />
                    <Sparkles className="absolute -right-3 -top-3 h-8 w-8 text-amber-400 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Procesando Diagnóstico...</h3>
                  <p className="text-slate-500 font-bold tracking-tight">
                    Consultando tu backend inteligente y preparando la evaluación legal preliminar
                  </p>
                </motion.div>
              ) : step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CrystalCard className="p-10 lg:p-14 border-slate-200 shadow-2xl">
                    <StepIndicator />
                    <div className="mb-12 flex items-center justify-between border-b border-slate-100 pb-6">
                      <h2 className="text-2xl font-black text-slate-900">Identidad de la marca</h2>
                      <span className="text-xs font-bold text-pink-500 tracking-widest uppercase bg-pink-50 px-3 py-1 rounded-full">
                        Paso 01 / 04
                      </span>
                    </div>

                    <div className="space-y-10">
                      <div>
                        <label className="mb-3 block text-sm font-black uppercase tracking-widest text-slate-800">
                          Nombre de la marca
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value.toUpperCase())}
                            placeholder="Ej: NOPAY, MIA, SOFTCORP..."
                            className="w-full rounded-3xl border-2 border-slate-200 bg-white px-6 py-5 pl-14 text-lg font-black text-slate-900 outline-none transition-all focus:border-pink-400 focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)]"
                          />
                          <BadgeCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition" size={22} />
                        </div>
                      </div>

                      <div>
                        <p className="mb-6 text-sm font-black uppercase tracking-widest text-slate-800">
                          ¿Qué tipo de signo quieres proteger?
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <ModeCard
                            active={signType === 'NOMINATIVA'}
                            title="Solo nombre"
                            description="Protección del nombre como signo principal."
                            icon={<Tag size={24} />}
                            onClick={() => setSignType('NOMINATIVA')}
                          />
                          <ModeCard
                            active={signType === 'MIXTA'}
                            title="Nombre + logo"
                            description="La opción más común y muchas veces más fuerte."
                            icon={<Palette size={24} />}
                            onClick={() => setSignType('MIXTA')}
                          />
                          <ModeCard
                            active={signType === 'FIGURATIVA'}
                            title="Solo logo"
                            description="Cuando la identidad visual pesa más que el nombre."
                            icon={<Fingerprint size={24} />}
                            onClick={() => setSignType('FIGURATIVA')}
                          />
                        </div>
                      </div>
                    </div>

                    {generalError && <div className="mt-8"><ErrorBox>{generalError}</ErrorBox></div>}

                    <div className="mt-12 pt-10 flex justify-end">
                      <button
                        disabled={!brandName.trim() || !signType}
                        onClick={() => goToStep(2)}
                        className={cn(
                          'group flex items-center gap-4 rounded-2xl px-12 py-5 text-base font-black transition-all shadow-xl',
                          brandName.trim() && signType
                            ? 'bg-slate-900 text-white hover:bg-pink-600 hover:scale-[1.02] active:scale-95 hover:shadow-pink-500/20'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        )}
                      >
                        CONTINUAR <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                      </button>
                    </div>
                  </CrystalCard>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CrystalCard className="p-10 lg:p-14 border-slate-200 shadow-2xl">
                    <StepIndicator />
                    <div className="mb-12 flex items-center justify-between border-b border-slate-100 pb-6">
                      <h2 className="text-2xl font-black text-slate-900">Negocio y categoría</h2>
                      <span className="text-xs font-bold text-pink-500 tracking-widest uppercase bg-pink-50 px-3 py-1 rounded-full">
                        Paso 02 / 04
                      </span>
                    </div>

                    <div className="space-y-10">
                      <div>
                        <p className="mb-6 text-sm font-black uppercase tracking-widest text-slate-800">
                          ¿En qué tipo de negocio encaja mejor tu marca?
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {Object.entries(categoryMeta).map(([key, meta]) => (
                            <ModeCard
                              key={key}
                              active={businessCategory === key}
                              title={meta.title}
                              description={meta.desc}
                              icon={meta.icon}
                              onClick={() => setBusinessCategory(key as BusinessCategory)}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-black uppercase tracking-widest text-slate-800">
                          En una frase, ¿qué vendes o qué hace tu negocio?
                        </label>
                        <textarea
                          value={businessDescription}
                          onChange={(e) => setBusinessDescription(e.target.value)}
                          placeholder="Ej: Plataforma legal-tech que automatiza trámites y documentos jurídicos para usuarios en Ecuador."
                          className="min-h-[140px] w-full rounded-3xl border-2 border-slate-200 bg-white px-6 py-5 text-base font-semibold text-slate-900 outline-none transition-all focus:border-pink-400 focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)]"
                        />
                      </div>

                      <div>
                        <p className="mb-6 text-sm font-black uppercase tracking-widest text-slate-800">
                          ¿Cuál es tu intención de crecimiento?
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <ModeCard
                            active={growthIntent === 'LOCAL'}
                            title="Local"
                            description="Me interesa operar en mi ciudad o zona cercana."
                            icon={<Store size={24} />}
                            onClick={() => setGrowthIntent('LOCAL')}
                          />
                          <ModeCard
                            active={growthIntent === 'NACIONAL'}
                            title="Nacional"
                            description="Quiero crecer y protegerme en todo Ecuador."
                            icon={<ShoppingBag size={24} />}
                            onClick={() => setGrowthIntent('NACIONAL')}
                          />
                          <ModeCard
                            active={growthIntent === 'INTERNACIONAL'}
                            title="Internacional"
                            description="Quiero dejar abierta la puerta a expansión futura."
                            icon={<Globe2 size={24} />}
                            onClick={() => setGrowthIntent('INTERNACIONAL')}
                          />
                        </div>
                      </div>
                    </div>

                    {generalError && <div className="mt-8"><ErrorBox>{generalError}</ErrorBox></div>}

                    <div className="mt-12 pt-10 flex items-center justify-between">
                      <button
                        onClick={() => goToStep(1)}
                        className="flex items-center gap-2 rounded-2xl border-2 border-slate-200 px-6 py-4 text-sm font-black text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300"
                      >
                        <ArrowLeft size={18} /> VOLVER
                      </button>

                      <button
                        disabled={!businessCategory || !businessDescription.trim() || !growthIntent}
                        onClick={() => goToStep(3)}
                        className={cn(
                          'group flex items-center gap-4 rounded-2xl px-12 py-5 text-base font-black transition-all shadow-xl',
                          businessCategory && businessDescription.trim() && growthIntent
                            ? 'bg-slate-900 text-white hover:bg-pink-600 hover:scale-[1.02] active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        )}
                      >
                        CONTINUAR <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                      </button>
                    </div>
                  </CrystalCard>
                </motion.div>
              ) : step === 3 ? (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CrystalCard className="p-10 lg:p-14 border-slate-200 shadow-2xl">
                    <StepIndicator />
                    <div className="mb-12 flex items-center justify-between border-b border-slate-100 pb-6">
                      <h2 className="text-2xl font-black text-slate-900">Señales rápidas del caso</h2>
                      <span className="text-xs font-bold text-pink-500 tracking-widest uppercase bg-pink-50 px-3 py-1 rounded-full">
                        Paso 03 / 04
                      </span>
                    </div>

                    <div className="space-y-6">
                      <YesNoCard
                        label="¿Ya estás usando esta marca comercialmente?"
                        helper="Esto ayuda a darle contexto a la estrategia del caso."
                        value={alreadyUsingBrand}
                        onChange={(v: boolean) => setAlreadyUsingBrand(v)}
                      />

                      <YesNoCard
                        label="¿Ya tienes logo o identidad visual?"
                        helper="Esto puede fortalecer una marca mixta."
                        value={hasLogo}
                        onChange={(v: boolean) => setHasLogo(v)}
                      />

                      <YesNoCard
                        label="¿Ya tienes presencia digital asociada?"
                        helper="Redes, página web, marketplace o huella digital visible."
                        value={hasDigitalPresence}
                        onChange={(v: boolean) => setHasDigitalPresence(v)}
                      />

                      <div className="rounded-[32px] border border-slate-200 bg-slate-50/50 p-6 transition-all">
                        <div className="mb-4 flex gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200 text-pink-600">
                            <Info size={18} />
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-800 leading-tight">
                              ¿Qué te preocupa más en este momento?
                            </p>
                            <p className="mt-1 text-xs text-slate-600 font-medium">
                              Elegimos esto para enfocar mejor el diagnóstico.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {[
                            { value: 'COPIA', label: 'Que alguien me copie' },
                            { value: 'EXPANSION', label: 'Crecer bien protegido' },
                            { value: 'FORMALIZAR', label: 'Formalizar mi marca' },
                            { value: 'INVERSION', label: 'Invertir con más seguridad' },
                          ].map((item) => (
                            <button
                              key={item.value}
                              onClick={() => setMainConcern(item.value as MainConcern)}
                              className={cn(
                                'rounded-2xl py-4 text-sm font-black transition-all border-2',
                                mainConcern === item.value
                                  ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                              )}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {generalError && <div className="mt-8"><ErrorBox>{generalError}</ErrorBox></div>}

                    <div className="mt-12 pt-10 flex items-center justify-between">
                      <button
                        onClick={() => goToStep(2)}
                        className="flex items-center gap-2 rounded-2xl border-2 border-slate-200 px-6 py-4 text-sm font-black text-slate-600 transition-all hover:bg-slate-50"
                      >
                        <ArrowLeft size={18} /> VOLVER
                      </button>

                      <button
                        disabled={!canAnalyze || fetching === 'diagnostic'}
                        onClick={runDiagnostic}
                        className={cn(
                          'group flex items-center gap-4 rounded-2xl px-12 py-5 text-base font-black transition-all shadow-xl',
                          canAnalyze
                            ? 'bg-slate-900 text-white hover:bg-pink-600 hover:scale-[1.02] active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        )}
                      >
                        GENERAR DIAGNÓSTICO <ScanSearch size={20} className="group-hover:rotate-12 transition" />
                      </button>
                    </div>
                  </CrystalCard>
                </motion.div>
              ) : step === 4 ? (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CrystalCard
                    className={cn(
                      'p-10 lg:p-16 border-2 shadow-2xl transition-colors duration-500',
                      resultMeta.wrapperClass
                    )}
                  >
                    {(diagnostic?.result === 'ALTO' || diagnostic?.result === 'MEDIO') && (
                      <AnimatedCheck color={resultMeta.checkColor} />
                    )}

                    <div className={cn(
                      'mb-10 inline-flex items-center gap-2 rounded-full border-2 px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-sm',
                      resultMeta.badgeClass
                    )}>
                      <Sparkles size={14} className="animate-pulse" /> {diagnostic?.badge || 'Diagnóstico preliminar'}
                    </div>

                    <h2 className={cn('text-5xl font-black tracking-tight mb-6 leading-tight', resultMeta.titleClass)}>
                      {diagnostic?.title || 'Resultado generado'}
                    </h2>

                    <p className="text-xl font-medium text-slate-700 leading-relaxed mb-12 max-w-3xl">
                      {diagnostic?.subtitle || 'La evaluación preliminar ya está lista.'}
                    </p>

                    <div className="grid gap-8 lg:grid-cols-2 mb-12">
                      <div className="bg-white/80 backdrop-blur-sm rounded-[32px] p-8 text-left border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                          Fortalezas detectadas
                        </h4>
                        <ul className="space-y-4">
                          {(diagnostic?.strengths || []).length > 0 ? (
                            diagnostic!.strengths.map((text, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.08 * i }}
                                className="flex items-start gap-4 text-sm font-bold text-slate-700"
                              >
                                <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <CheckCircle2 className="text-emerald-500" size={14} />
                                </div>
                                <span>{text}</span>
                              </motion.li>
                            ))
                          ) : (
                            <li className="text-sm font-semibold text-slate-500">No hay fortalezas destacables aún.</li>
                          )}
                        </ul>
                      </div>

                      <div className="bg-white/80 backdrop-blur-sm rounded-[32px] p-8 text-left border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                          Alertas preliminares
                        </h4>
                        <ul className="space-y-4">
                          {(diagnostic?.alerts || []).length > 0 ? (
                            diagnostic!.alerts.map((text, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.08 * i }}
                                className="flex items-start gap-4 text-sm font-bold text-slate-700"
                              >
                                <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <CircleAlert className="text-amber-500" size={14} />
                                </div>
                                <span>{text}</span>
                              </motion.li>
                            ))
                          ) : (
                            <li className="text-sm font-semibold text-slate-500">No se detectaron alertas relevantes.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[34px] p-8 mb-10 text-white shadow-xl border border-white/10">
                      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                        <div>
                          <div className="mb-5 flex items-center gap-3">
                            <Bot className="text-pink-300" size={22} />
                            <h3 className="text-xl font-black">Recomendación IA</h3>
                          </div>
                          <p className="text-sm font-medium leading-7 text-slate-200">
                            {diagnostic?.recommendation || 'Sin recomendación disponible.'}
                          </p>
                        </div>

                        <div>
                          <div className="mb-5 flex items-center gap-3">
                            <ShieldCheck className="text-cyan-300" size={22} />
                            <h3 className="text-xl font-black">Mensaje del abogado</h3>
                          </div>
                          <p className="text-sm font-medium leading-7 text-slate-200">
                            {diagnostic?.lawyerMessage || 'Un abogado de NoPay revisará este diagnóstico y ajustará la estrategia antes de llevarlo a gestión.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {(diagnostic?.suggestedClasses || []).length > 0 && (
                      <div className="mb-12">
                        <h3 className="mb-5 text-lg font-black text-slate-900">Clases sugeridas preliminarmente</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {diagnostic!.suggestedClasses.map((item, i) => (
                            <div key={i} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-pink-600">
                                <Layers3 size={12} /> Clase {item.classNumber}
                              </div>
                              <h4 className="text-base font-black text-slate-900">{item.label}</h4>
                              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{item.why}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-[34px] border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-8 mb-12 shadow-md">
                      <div className="mb-6 flex items-center gap-3">
                        <Lock className="text-pink-600" size={22} />
                        <h3 className="text-xl font-black text-slate-900">Déjanos lo mínimo para seguir contigo</h3>
                      </div>

                      <p className="mb-6 text-sm font-medium leading-6 text-slate-600 flex items-center gap-2">
                        <Shield size={14} /> Información segura – solo para seguimiento legal
                      </p>

                      <div className="grid gap-5 md:grid-cols-2">
                        <QuickInput
                          label="Nombre o razón social"
                          value={lead.fullName}
                          onChange={(v) => setLead(prev => ({ ...prev, fullName: v.toUpperCase() }))}
                          placeholder="Tu nombre o el de tu empresa"
                          icon={<UserRound size={18} />}
                        />

                        <QuickSelect
                          label="¿Quién sería el titular?"
                          value={lead.holderType}
                          onChange={(v) => setLead(prev => ({ ...prev, holderType: v as 'NATURAL' | 'JURIDICA' }))}
                          options={[
                            { value: 'NATURAL', label: 'Persona natural' },
                            { value: 'JURIDICA', label: 'Empresa / persona jurídica' }
                          ]}
                          icon={<Building2 size={18} />}
                        />

                        <QuickInput
                          label="Teléfono"
                          value={lead.phone}
                          onChange={(v) => setLead(prev => ({ ...prev, phone: v }))}
                          placeholder="0999999999"
                          icon={<Phone size={18} />}
                        />

                        <QuickInput
                          label="Correo"
                          value={lead.email}
                          onChange={(v) => setLead(prev => ({ ...prev, email: v }))}
                          placeholder="correo@ejemplo.com"
                          icon={<Globe2 size={18} />}
                        />
                      </div>
                    </div>

                    {generalError && <div className="mb-8"><ErrorBox>{generalError}</ErrorBox></div>}

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <button
                        onClick={() => goToStep(3)}
                        className="flex-1 rounded-2xl border-2 border-slate-200 px-8 py-5 text-lg font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-tighter"
                      >
                        Ajustar respuestas
                      </button>

                      <button
					  disabled={!canCreateCase || fetching === 'create-case'}
					  onClick={createCaseAndGoToOffer}
                        className={cn(
                          'flex-[2] flex items-center justify-center gap-3 rounded-2xl py-5 text-lg font-black text-white transition-all shadow-2xl hover:scale-[1.02] active:scale-95',
                          canCreateCase
                            ? 'bg-slate-900 hover:bg-pink-600'
                            : 'bg-slate-300 cursor-not-allowed'
                        )}
                      >
                        {fetching === 'create-case' ? <Loader2 className="animate-spin" /> : <FileCheck size={22} />}
                        Continuar con mi caso
                      </button>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-10 flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2"><Lock size={12} /> SSL 256-bit</div>
                      <div className="flex items-center gap-2"><ShieldCheck size={12} /> LegalTech Auditado</div>
                      <div className="flex items-center gap-2"><Eye size={12} /> Datos cifrados</div>
                    </div>
                  </CrystalCard>
                </motion.div>
			
			) : (
			
			
			<motion.div
  key="step5"
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.98 }}
  transition={{ duration: 0.4, ease: "circOut" }}
  className="max-w-6xl mx-auto"
>
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
    <div className="grid lg:grid-cols-[1fr_400px]">
      
      {/* SECCIÓN IZQUIERDA: CONTENIDO */}
      <div className="p-8 lg:p-14 bg-slate-50/50">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-4">
            <Sparkles size={12} className="animate-pulse" />
            Estrategia de Inversión Inteligente
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
            Valida primero, <br />
            <span className="text-slate-400">invierte después.</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-md leading-relaxed">
            Hemos dividido el proceso para proteger tu capital. Solo avanzas a la fase legal completa si la marca es viable.
          </p>
        </header>

        {/* BENEFICIOS COMPACTOS */}
        <div className="grid gap-6">
          {[
            { icon: <SearchCheck className="text-indigo-500" />, t: "Filtro Preventivo", d: "Análisis fonético profundo antes de cualquier tasa oficial." },
            { icon: <ShieldCheck className="text-emerald-500" />, t: "Riesgo Mitigado", d: "No arriesgas el costo total del registro sin garantías." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start group">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-200 transition-colors">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{item.t}</h4>
                <p className="text-sm text-slate-500 leading-snug">{item.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* STEPPER VERTICAL SUTIL */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">1</div>
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 border-2 border-white">2</div>
            </div>
            <p className="text-xs font-medium text-slate-500 italic">
              "Estás a un paso de asegurar la prioridad legal de tu nombre."
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: CHECKOUT (LA TARJETA DE PAGO) */}
      <div className="p-8 lg:p-10 bg-white border-l border-slate-100 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Resumen de Orden</p>
            <h3 className="text-xl font-bold text-slate-900">Registro de Marca</h3>
          </div>

          <div className="space-y-3">
            {/* FASE 1 - ACTIVA */}
            <div className="relative p-5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/30">
              <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                Pagar ahora
              </div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Fase 01</p>
              <div className="flex justify-between items-end mt-1">
                <span className="font-bold text-slate-800">Búsqueda Fonética</span>
                <span className="text-2xl font-light text-slate-900">${PHASE1_PRICE.toFixed(2)}</span>
              </div>
            </div>

            {/* FASE 2 - DESACTIVADA */}
            <div className="p-5 rounded-2xl border border-dashed border-slate-200 opacity-60">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fase 02</p>
              <div className="flex justify-between items-end mt-1">
                <span className="font-medium text-slate-500 text-sm">Registro Completo</span>
                <span className="text-sm font-medium text-slate-400">${PHASE2_PRICE.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={continueToResumenPago}
            disabled={!checkoutReady}
            className={cn(
              "group relative w-full overflow-hidden rounded-xl py-4 transition-all duration-300",
              checkoutReady 
                ? "bg-slate-900 text-white hover:bg-black hover:shadow-xl active:scale-[0.98]" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <span className="relative z-10 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2">
              Iniciar validación experta
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <div className="mt-6 flex items-center justify-center gap-4 border-t border-slate-50 pt-6">
            <Lock size={14} className="text-slate-300" />
            <div className="flex gap-2">
              <div className="h-4 w-6 bg-slate-100 rounded-sm" /> 
              <div className="h-4 w-6 bg-slate-100 rounded-sm" />
              <div className="h-4 w-6 bg-slate-100 rounded-sm" />
            </div>
          </div>
          
          <p className="mt-4 text-[10px] text-center text-slate-400 font-medium leading-relaxed uppercase tracking-tighter">
            Trámite seguro bajo normativa de propiedad intelectual.
          </p>
        </div>
      </div>

    </div>
  </div>
  
  {/* BOTÓN VOLVER SUTIL */}
  <button
    onClick={() => goToStep(4)}
    className="mt-6 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-widest mx-auto lg:mx-0"
  >
    <ArrowLeft size={14} />
    Atrás
  </button>
</motion.div>
			
			)
			
			  
			  

			  
			  
			  
			  }
            </AnimatePresence>
          </main>

          <aside className="space-y-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat"></div>
              <LockKeyhole className="text-pink-400 mb-6 relative z-10" size={40} />
              <h3 className="text-2xl font-black mb-4 tracking-tight relative z-10">Privacidad NoPay</h3>
              <p className="text-slate-300 text-sm font-medium leading-relaxed relative z-10">
                Capturamos solo la información esencial para generar el diagnóstico y dar continuidad real a tu caso.
                Nunca compartimos tus datos.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-md">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 italic">
                Por qué este flujo convierte mejor
              </h4>
              <div className="space-y-10">
                {[
                  {
                    t: 'Pocas preguntas',
                    d: 'No agotamos al usuario antes de mostrarle valor.',
                    i: <Sparkles size={24} />
                  },
                  {
                    t: 'IA visible',
                    d: 'El sistema realmente analiza y devuelve un resultado útil.',
                    i: <Bot size={24} />
                  },
                  {
                    t: 'Abogado real',
                    d: 'La automatización orienta, pero la gestión final tiene respaldo humano.',
                    i: <ShieldCheck size={24} />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="text-pink-600 bg-pink-50 h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-pink-100">
                      {item.i}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900">{item.t}</p>
                      <p className="text-sm font-medium text-slate-500 leading-snug">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {diagnostic && (
              <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-md">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 italic">
                  Resumen rápido
                </h4>

                <div className="space-y-4">
                  <MiniData label="Marca" value={brandName || '—'} />
                  <MiniData
                    label="Categoría"
                    value={businessCategory ? categoryMeta[businessCategory].title : '—'}
                  />
                  <MiniData label="Score preliminar" value={String(diagnostic.score)} />
                  <MiniData label="Resultado" value={diagnostic.title} />
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
	  </div>

      {paymentProcessing && (

		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
  <motion.div
    initial={{ scale: 0.95, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="relative w-full max-w-[380px] overflow-hidden rounded-[32px] bg-white p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
  >
    {/* Efecto de luz ambiental superior */}
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

    <div className="relative flex flex-col items-center">
      {/* Icono con Animatica de Pulso */}
      <div className="relative mb-8">
        <motion.div 
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-indigo-100/50"
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm">
          <ShieldCheck className="h-9 w-9 text-indigo-600" />
        </div>
        
        {/* Spinner perimetral minimalista */}
        <svg className="absolute -inset-2 h-24 w-24 animate-[spin_3s_linear_infinite]">
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-indigo-600/20"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray="280"
            strokeDashoffset="210"
            className="text-indigo-600"
          />
        </svg>
      </div>

      {/* Textos */}
      <h3 className="text-lg font-bold tracking-tight text-slate-900">
        {paymentMessage}
      </h3>
      
      <div className="mt-3 flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-slate-500">
          Preparando expediente legal
        </p>
        <div className="flex items-center gap-1.5 mt-4">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Conexión Segura SSL
          </span>
        </div>
      </div>

      {/* Barra de progreso sutil */}
      <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-full w-1/3 bg-indigo-600"
        />
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-slate-400">
        No refresques la página. Este proceso asegura tu <br />
        prioridad en el registro ante la entidad oficial.
      </p>
    </div>
  </motion.div>
</div>

	  )}

      <NoPayChatLauncher />
      <Footer />
    </main>
  );
}

/* =========================
   META DEL RESULTADO
========================= */

function getResultMeta(result: DiagnosticResultLevel) {
  switch (result) {
    case 'ALTO':
      return {
        wrapperClass: 'border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40',
        badgeClass: 'border-emerald-200 bg-emerald-50/80 text-emerald-700',
        titleClass: 'text-slate-900',
        checkColor: '#10b981',
      };
    case 'MEDIO':
      return {
        wrapperClass: 'border-sky-100 bg-gradient-to-br from-white to-sky-50/40',
        badgeClass: 'border-sky-200 bg-sky-50/80 text-sky-700',
        titleClass: 'text-slate-900',
        checkColor: '#0ea5e9',
      };
    case 'RIESGO':
      return {
        wrapperClass: 'border-rose-100 bg-gradient-to-br from-white to-rose-50/40',
        badgeClass: 'border-rose-200 bg-rose-50/80 text-rose-700',
        titleClass: 'text-slate-900',
        checkColor: '#f43f5e',
      };
    default:
      return {
        wrapperClass: 'border-slate-100 bg-white',
        badgeClass: 'border-slate-200 bg-slate-50/80 text-slate-700',
        titleClass: 'text-slate-900',
        checkColor: '#64748b',
      };
  }
}

/* =========================
   UI REUTILIZABLE
========================= */

const AnimatedCheck = ({ color = '#10b981' }: { color?: string }) => (
  <div className="flex justify-center mb-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 shadow-inner"
    >
      <svg className="h-16 w-16" viewBox="0 0 52 52">
        <motion.circle
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        />
      </svg>
    </motion.div>
  </div>
);

const CrystalCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl ${className}`}>
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-500/5 blur-[80px]" />
    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px]" />
    <div className="relative z-10">{children}</div>
  </div>
);

function ModeCard({
  active,
  title,
  description,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full flex-col gap-3 rounded-3xl border p-6 text-left transition-all duration-300 ${
        active
          ? 'border-pink-500 bg-pink-50/50 shadow-md scale-[1.02]'
          : 'border-slate-200 bg-white hover:border-pink-300 hover:shadow-sm'
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
          active ? 'border-pink-500 bg-pink-500 text-white' : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:bg-pink-50'
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className={`text-base font-bold ${active ? 'text-slate-900' : 'text-slate-700'}`}>{title}</h3>
        <p className={`mt-1 text-xs font-medium leading-relaxed ${active ? 'text-pink-700' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>
    </button>
  );
}

function YesNoCard({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-slate-50/50 p-6 transition-all">
      <div className="mb-4 flex gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200 text-pink-600">
          <Info size={18} />
        </div>
        <div>
          <p className="text-base font-bold text-slate-800 leading-tight">{label}</p>
          {helper && <p className="mt-1 text-xs text-slate-600 font-medium">{helper}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[true, false].map((option) => (
          <button
            key={String(option)}
            onClick={() => onChange(option)}
            className={`rounded-2xl py-4 text-sm font-black transition-all border-2 ${
              value === option
                ? option
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {option ? 'SÍ, CORRECTO' : 'NO, NO APLICA'}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 pl-12 text-sm font-bold text-slate-900 outline-none transition-all focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition">
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickSelect({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  icon: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 pl-12 text-sm font-bold text-slate-900 outline-none transition-all focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniData({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-bold text-slate-800 leading-snug">{value || '—'}</p>
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

function splitFullName(fullName: string) {
  const clean = (fullName || '').trim().replace(/\s+/g, ' ');
  if (!clean) {
    return { nombres: '', apellidos: '' };
  }

  const parts = clean.split(' ');

  if (parts.length === 1) {
    return { nombres: parts[0], apellidos: '' };
  }

  if (parts.length === 2) {
    return {
      nombres: parts[0],
      apellidos: parts[1],
    };
  }

  if (parts.length === 3) {
    return {
      nombres: `${parts[0]} ${parts[1]}`,
      apellidos: parts[2],
    };
  }

  return {
    nombres: parts.slice(0, 2).join(' '),
    apellidos: parts.slice(2).join(' '),
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}