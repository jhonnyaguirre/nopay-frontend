'use client';

import React, { useMemo, useState, useEffect, useCallback, useRef, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import {
  ShieldCheck,
  CheckCircle2,
  Plane,
  Users,
  UserRound,
  UserRoundX,
  Sparkles,
  ArrowRight,
  Info,
  Fingerprint,
  Globe2,
  Loader2,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  PhoneCall,
  Mail,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

// --- Tipos y lógica ---
type TravelMode = 'both_parents' | 'one_parent' | 'alone' | 'third_party' | '';
type DiagnosticResult = 'NOTARIAL' | 'JUDICIAL' | 'NO_TRAMITE' | 'INDETERMINADO';

interface DiagnosticState {
  travelMode: TravelMode;
  bothParentsAgree: boolean | null;
  nonTravelingParentLocatable: boolean | null;
}

const initialState: DiagnosticState = {
  travelMode: '',
  bothParentsAgree: null,
  nonTravelingParentLocatable: null,
};

// Lógica legal sin impedimentos especiales
function evaluateCase(data: DiagnosticState): DiagnosticResult {
  const { travelMode, bothParentsAgree, nonTravelingParentLocatable } = data;

  if (!travelMode) return 'INDETERMINADO';

  // Ambos padres viajan juntos → nunca requiere permiso
  if (travelMode === 'both_parents') {
    return 'NO_TRAMITE';
  }

  // Casos donde viaja solo un padre, solo el menor, o con un tercero
  if (bothParentsAgree === false || nonTravelingParentLocatable === false) {
    return 'JUDICIAL';
  }

  if (bothParentsAgree === true && nonTravelingParentLocatable === true) {
    return 'NOTARIAL';
  }

  return 'INDETERMINADO';
}

function getResultMeta(result: DiagnosticResult) {
  switch (result) {
    case 'NOTARIAL':
      return {
        title: '✅ Trámite completamente viable',
        subtitle: 'Cumples con los requisitos legales. Podemos gestionar tu permiso de salida de forma 100% digital, rápida y segura.',
        badge: 'Permiso de salida – Vía notarial',
        color: 'emerald',
        cta: 'Iniciar trámite ahora',
        icon: FileCheck,
        details: [
          'Autorización del progenitor no viajero',
          'Minuta legal preparada por NoPay',
          'Firma electrónica avanzada (sin moverte de casa)',
          'Validez internacional y apostillado digital',
        ],
      };
    case 'JUDICIAL':
      return {
        title: '⚖️ Requiere intervención judicial',
        subtitle: 'Debido a desacuerdo o imposibilidad de localizar al otro progenitor, este caso debe ser resuelto por un Juez de Familia.',
        badge: 'Permiso de salida – Vía judicial',
        color: 'rose',
        cta: 'Obtener asesoría judicial experta',
        icon: AlertTriangle,
        details: [
          'Falta de acuerdo entre padres',
          'Progenitor no localizable',
          'Necesitas representación legal especializada',
        ],
      };
    case 'NO_TRAMITE':
      return {
        title: '✈️ ¡Viaje sin complicaciones!',
        subtitle: 'Al viajar con ambos padres, el control migratorio solo solicitará documentos de identidad. No requieres ningún permiso adicional.',
        badge: 'Sin trámite requerido',
        color: 'sky',
        cta: 'Ver checklist de viaje',
        icon: Globe2,
        details: [
          'Llevar DNI / pasaporte de cada persona',
          'Certificado de nacimiento del menor (recomendado)',
          'Verificar requisitos del país de destino',
          'Revisar vigencia de documentos',
        ],
      };
    default:
      return {
        title: 'Información insuficiente',
        subtitle: 'Por favor completa todas las preguntas para obtener un diagnóstico preciso.',
        badge: 'Diagnóstico pendiente',
        color: 'slate',
        cta: 'Volver al formulario',
        icon: HelpCircle,
        details: [],
      };
  }
}

// --- Componentes UI ---
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-xl bg-slate-800 px-3 py-2 text-center text-xs font-medium text-white shadow-lg"
          >
            {content}
            <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1 border-4 border-transparent border-t-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedCheck = ({ color = "#10b981" }: { color?: string }) => (
  <div className="flex justify-center mb-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 shadow-inner"
    >
      <svg className="h-16 w-16" viewBox="0 0 52 52">
        <motion.circle
          cx="26" cy="26" r="25"
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

const CrystalCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-3xl sm:rounded-[40px] border border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${className}`}>
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-500/5 blur-[80px]" />
    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px]" />
    <div className="relative z-10">{children}</div>
  </div>
);

interface ModeCardProps {
  active: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function ModeCard({ active, title, description, icon, onClick }: ModeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex w-full flex-col gap-3 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 text-left transition-all duration-300 ${
        active
          ? 'border-pink-500 bg-pink-50/60 shadow-md ring-2 ring-pink-200/50'
          : 'border-slate-200 bg-white hover:border-pink-300 hover:shadow-sm'
      }`}
    >
      <div
        className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border transition-all ${
          active
            ? 'border-pink-500 bg-pink-500 text-white shadow-md'
            : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:bg-pink-50'
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className={`text-sm sm:text-base font-bold ${active ? 'text-slate-900' : 'text-slate-700'}`}>{title}</h3>
        <p className={`mt-1 text-xs font-medium leading-relaxed ${active ? 'text-pink-700' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>
    </motion.button>
  );
}

interface YesNoCardProps {
  label: string;
  helper?: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  tooltip?: string;
}

function YesNoCard({ label, helper, value, onChange, tooltip }: YesNoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl sm:rounded-[32px] border border-slate-200 bg-slate-50/50 p-4 sm:p-6 transition-all hover:shadow-sm"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200 text-pink-600">
          {tooltip ? (
            <Tooltip content={tooltip}>
              <Info size={18} />
            </Tooltip>
          ) : (
            <Info size={18} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight">{label}</p>
          {helper && <p className="mt-1 text-xs text-slate-600 font-medium">{helper}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {[
          { value: true, label: 'SÍ, CORRECTO', color: 'emerald' },
          { value: false, label: 'NO, NO APLICA', color: 'rose' },
        ].map((option) => (
          <button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            className={`rounded-xl sm:rounded-2xl py-3 sm:py-4 text-xs sm:text-sm font-black transition-all border-2 ${
              value === option.value
                ? option.color === 'emerald'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// --- Componente principal ---
export default function PermisoSalidaDiagnosticoNoPay() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [form, setForm] = useState<DiagnosticState>(initialState);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });
  const resultContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    detectSize();
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  const result = useMemo(() => evaluateCase(form), [form]);
  const meta = useMemo(() => getResultMeta(result), [result]);

  const showParentalQuestions = form.travelMode !== '' && form.travelMode !== 'both_parents';

  const isValidStep1 = useMemo(() => {
    if (!form.travelMode) return false;
    if (form.travelMode === 'both_parents') {
      return true; // No hay preguntas adicionales
    }
    return form.bothParentsAgree !== null && form.nonTravelingParentLocatable !== null;
  }, [form]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartAnalysis = useCallback(() => {
    if (!isValidStep1) return;
    scrollToTop();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
      if (resultContainerRef.current) {
        resultContainerRef.current.focus();
      }
    }, 2000);
  }, [isValidStep1, scrollToTop]);

  const handleReset = useCallback(() => {
    setForm(initialState);
    setStep(1);
    setIsAnalyzing(false);
    setShowConfetti(false);
    scrollToTop();
  }, [scrollToTop]);

  const handleCtaClick = useCallback(() => {
    if (result === 'NOTARIAL') {
      startTransition(() => {
        router.push('/Servicios/PermisoSalida/PermisoSalidaProceso');
      });
    } else if (result === 'JUDICIAL') {
      window.location.href = '/contacto?motivo=asesoria-judicial-permiso-salida';
    } else if (result === 'NO_TRAMITE') {
      window.open('/guias/checklist-viaje-menores', '_blank');
    } else {
      handleReset();
    }
  }, [result, router, handleReset]);

  useEffect(() => {
    if (step === 2 && (result === 'NOTARIAL' || result === 'NO_TRAMITE')) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [step, result]);

  const confettiColors =
    result === 'NO_TRAMITE'
      ? ['#0EA5E9', '#7DD3FC', '#FFFFFF', '#BAE6FD']
      : ['#10B981', '#34D399', '#FFFFFF', '#A7F3D0'];

  const progressPercent = step === 1 ? 50 : 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FBFBFE] to-white relative overflow-hidden text-slate-900">
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={showConfetti}
          numberOfPieces={result === 'NO_TRAMITE' ? 200 : 180}
          gravity={0.12}
          colors={confettiColors}
        />
      )}

      <Header />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
        <header className="mb-8 sm:mb-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border-2 border-pink-200 bg-pink-50/80 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-pink-600 backdrop-blur-sm"
          >
            <ShieldCheck size={14} className="sm:h-4 sm:w-4" /> Evaluación Legal Inteligente
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 leading-[1.1]"
          >
            Validemos tu caso <br />
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent italic">
              en segundos.
            </span>
          </motion.h1>

          <motion.p className="text-base sm:text-xl font-medium leading-relaxed text-slate-700 max-w-2xl">
            NoPay analiza tu situación familiar y te guía por la ruta legal correcta para el permiso de salida de menores.
            Sin errores, sin papeleo innecesario.
          </motion.p>
        </header>

        {/* Barra de progreso */}
        <div className="mb-6 sm:mb-8 w-full max-w-3xl">
          <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-slate-500 mb-1">
            <span>Paso {step} de 2</span>
            <span>{progressPercent}% completado</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <main>
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-12 sm:p-20 text-center"
                >
                  <div className="relative mb-8 sm:mb-10">
                    <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-pink-500 stroke-[1.5]" />
                    <Sparkles className="absolute -right-3 -top-3 h-6 w-6 sm:h-8 sm:w-8 text-amber-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Procesando Diagnóstico</h3>
                  <p className="text-slate-500 font-bold tracking-tight text-sm sm:text-base">
                    Consultando normativa 2026 y jurisprudencia
                  </p>
                </motion.div>
              ) : step === 1 ? (
                <motion.div
                  key="st1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CrystalCard className="p-5 sm:p-8 lg:p-12 border-slate-200">
                    <div className="mb-6 sm:mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-5">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">Configuración del viaje</h2>
                      {form.travelMode && (
                        <button
                          onClick={handleReset}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-pink-600 transition-colors"
                        >
                          <RefreshCw size={14} /> Reiniciar
                        </button>
                      )}
                    </div>

                    <div className="space-y-8 sm:space-y-10">
                      <div>
                        <p className="mb-4 sm:mb-5 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                          <Plane size={16} /> 1. ¿Cómo viaja el menor?
                        </p>
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                          <ModeCard
                            active={form.travelMode === 'both_parents'}
                            title="Con ambos padres"
                            description="No requiere permiso."
                            icon={<Users size={20} className="sm:h-6 sm:w-6" />}
                            onClick={() => setForm({ ...initialState, travelMode: 'both_parents' })}
                          />
                          <ModeCard
                            active={form.travelMode === 'one_parent'}
                            title="Con un solo padre"
                            description="Requiere autorización del otro progenitor."
                            icon={<UserRound size={20} className="sm:h-6 sm:w-6" />}
                            onClick={() => setForm({ ...initialState, travelMode: 'one_parent' })}
                          />
                          <ModeCard
                            active={form.travelMode === 'alone'}
                            title="Viaja solo/a"
                            description="Requiere permiso firmado de ambos padres."
                            icon={<Plane size={20} className="sm:h-6 sm:w-6" />}
                            onClick={() => setForm({ ...initialState, travelMode: 'alone' })}
                          />
                          <ModeCard
                            active={form.travelMode === 'third_party'}
                            title="Con un tercero"
                            description="Requiere autorización de ambos padres."
                            icon={<UserRoundX size={20} className="sm:h-6 sm:w-6" />}
                            onClick={() => setForm({ ...initialState, travelMode: 'third_party' })}
                          />
                        </div>
                      </div>

                      {/* Preguntas dinámicas según modo de viaje */}
                      {showParentalQuestions && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5 sm:space-y-6"
                        >
                          <p className="mb-2 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                            <Fingerprint size={16} /> 2. Detalles legales
                          </p>

                          <YesNoCard
                            label="¿Existe acuerdo entre los padres?"
                            helper="Ambos están dispuestos a firmar voluntariamente el permiso."
                            value={form.bothParentsAgree}
                            onChange={(v) => setForm({ ...form, bothParentsAgree: v })}
                            tooltip="El desacuerdo obliga a recurrir a un juez de familia."
                          />
                          <YesNoCard
                            label="¿El progenitor que no viaja puede ser localizado?"
                            helper="¿Puede acudir a una notaría o tiene firma digital?"
                            value={form.nonTravelingParentLocatable}
                            onChange={(v) => setForm({ ...form, nonTravelingParentLocatable: v })}
                            tooltip="Si no se le puede ubicar, se necesita autorización judicial."
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 flex justify-end">
                      <button
                        disabled={!isValidStep1}
                        onClick={handleStartAnalysis}
                        className={`group flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-black transition-all shadow-xl ${
                          isValidStep1
                            ? 'bg-slate-900 text-white hover:bg-pink-600 hover:scale-105 active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        ANALIZAR CASO <ArrowRight size={18} className="sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </CrystalCard>
                </motion.div>
              ) : (
                <motion.div
                  key="st2"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  ref={resultContainerRef}
                  tabIndex={-1}
                  className="outline-none"
                >
                  <CrystalCard
                    className={`p-6 sm:p-8 lg:p-14 border-2 shadow-2xl transition-colors duration-500 ${
                      result === 'NO_TRAMITE'
                        ? 'border-sky-100 bg-gradient-to-br from-white to-sky-50/40'
                        : result === 'NOTARIAL'
                        ? 'border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30'
                        : result === 'JUDICIAL'
                        ? 'border-rose-100 bg-gradient-to-br from-white to-rose-50/30'
                        : ''
                    }`}
                  >
                    {(result === 'NOTARIAL' || result === 'NO_TRAMITE') && (
                      <AnimatedCheck color={result === 'NO_TRAMITE' ? '#0ea5e9' : '#10b981'} />
                    )}

                    {result === 'JUDICIAL' && (
                      <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-rose-100 p-4">
                          <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-rose-600" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border-2 px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] ${
                        meta.color === 'emerald'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : meta.color === 'sky'
                          ? 'border-sky-200 bg-sky-50 text-sky-700'
                          : 'border-rose-200 bg-rose-50 text-rose-700'
                      }`}
                    >
                      <Sparkles size={12} className="sm:h-3.5 sm:w-3.5 animate-pulse" /> {meta.badge}
                    </div>

                    <h2
                      className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 sm:mb-5 leading-tight ${
                        result === 'NO_TRAMITE'
                          ? 'text-sky-950'
                          : result === 'NOTARIAL'
                          ? 'text-emerald-900'
                          : result === 'JUDICIAL'
                          ? 'text-rose-900'
                          : 'text-slate-900'
                      }`}
                    >
                      {meta.title}
                    </h2>

                    <p className="text-base sm:text-lg lg:text-xl font-medium text-slate-700 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
                      {meta.subtitle}
                    </p>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-[32px] p-5 sm:p-6 mb-8 sm:mb-10 text-left border border-slate-100 max-w-xl mx-auto shadow-sm">
                      <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 sm:mb-5 flex items-center gap-2">
                        <CheckCircle2 size={14} /> Resumen legal
                      </h4>
                      <ul className="space-y-2 sm:space-y-3">
                        {meta.details.map((text, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700"
                          >
                            <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="text-emerald-600" size={12} />
                            </div>
                            {text}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center">
                      <button
                        onClick={handleCtaClick}
                        className={`flex-[2] flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl py-3 sm:py-5 px-4 text-sm sm:text-base font-black text-white transition-all shadow-xl hover:scale-[1.02] active:scale-95 ${
                          result === 'NO_TRAMITE'
                            ? 'bg-sky-600 hover:bg-sky-700'
                            : result === 'NOTARIAL'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : result === 'JUDICIAL'
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-slate-700'
                        }`}
                      >
                        <meta.icon size={18} className="sm:h-5 sm:w-5" /> {meta.cta}
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-5 text-sm sm:text-base font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={16} className="sm:h-4 sm:w-4" /> Reiniciar análisis
                      </button>
                    </div>
                  </CrystalCard>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <aside className="space-y-6 sm:space-y-8">
            <div className="bg-slate-900 rounded-3xl sm:rounded-[40px] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat"></div>
              <Fingerprint className="text-pink-400 mb-4 sm:mb-5 relative z-10" size={28} />
              <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3 tracking-tight relative z-10">Privacidad y seguridad</h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed relative z-10">
                Tus respuestas se procesan localmente en tu navegador. NoPay no almacena datos personales sin tu consentimiento explícito.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-3xl sm:rounded-[40px] p-6 sm:p-8 shadow-sm">
              <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-5 sm:mb-6 flex items-center gap-2">
                <Sparkles size={14} /> Beneficios exclusivos
              </h4>
              <div className="space-y-6 sm:space-y-8">
                {[
                  { t: 'Diagnóstico en tiempo real', d: 'Sin esperas, sin formularios eternos.', i: <Loader2 size={20} className="animate-pulse" /> },
                  { t: 'Precisión legal 2026', d: 'Actualizado con la última jurisprudencia y normas migratorias.', i: <ShieldCheck size={20} /> },
                  { t: 'Acompañamiento digital', d: 'Desde el diagnóstico hasta la obtención del permiso notarial o judicial.', i: <Globe2 size={20} /> },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4">
                    <div className="text-pink-600 bg-pink-50 h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 border border-pink-100">
                      {item.i}
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-black text-slate-900">{item.t}</p>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 leading-snug">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl sm:rounded-[32px] p-5 sm:p-6 border border-pink-100">
              <div className="flex items-start gap-3">
                <PhoneCall className="text-pink-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h5 className="font-black text-slate-800 text-sm sm:text-base">¿Caso complejo?</h5>
                  <p className="text-xs text-slate-600 mt-1">Contáctanos para una asesoría personalizada con abogados de familia.</p>
                  <a
                    href="mailto:info@nopaylegal.com"
                    className="inline-flex items-center gap-1 mt-3 text-xs sm:text-sm font-bold text-pink-600 hover:underline"
                  >
                    <Mail size={14} /> info@nopaylegal.com
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <NoPayChatLauncher />
      <Footer />
    </main>
  );
}