'use client';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionPaymentManager } from 'lib/seguridad/SessionPaymentManager';
import {
  User, Car, ChevronRight, Check, Search, AlertCircle, Info, PlusCircle,
  Loader2, ShieldCheck, BadgeCheck, Mail, Phone, CalendarDays, CreditCard,
  CarFront, TrendingUp, DollarSign, X, Camera, FileText, TrendingDown,
  Receipt, Sparkles, Building2, Calendar, HelpCircle,
} from 'lucide-react';
import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import { createSessionNonce, getWizardToken } from '../../lib/seguridad/sessionUtils';
import { crearSesionJWT } from 'lib/seguridad/JwtSessionService';
import { SessionWizardData } from 'lib/seguridad/SessionWizardData';
import { getColorCode } from 'utils/ColorUtils';
import { getUserProfile, setUserProfile } from 'lib/seguridad/SessionUser';
import { API_BASE_URL, valorImpugnacionGl } from 'config/apiConfig';
import NoPayBackground from 'components/NoPayBackground';
import { isJWTValid, useLogout } from 'lib/seguridad/prevalidadorToken';

const CITACIONES_API_URL = '/api/citaciones';

// -------------------- Utilidades puras --------------------
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const formatDateToInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const validarPlacaEcuador = (placa: string) => {
  const regex = /^[A-Z]{3}-?\d{3,4}$/;
  const provinciasValidas = [
    'A','B','C','E','G','H','I','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
  ];
  if (!regex.test(placa)) return false;
  return provinciasValidas.includes(placa.charAt(0));
};

const validarCedulaEcuador = (cedula: string) => {
  if (!/^\d{10}$/.test(cedula)) return false;
  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;
  const digitos = cedula.split('').map(Number);
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

const mapearTipo = (clase: string): string => {
  if (!clase) return '';
  const lower = clase.toLowerCase();
  if (lower.includes('automovil')) return 'automovil';
  if (lower.includes('camioneta')) return 'camioneta';
  if (lower.includes('motocicleta') || lower.includes('moto')) return 'motocicleta';
  if (lower.includes('utilitario') || lower.includes('comercial')) return 'comercial';
  return '';
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);

// -------------------- Componentes auxiliares con tipos correctos --------------------
const Notification = memo(({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 18, scale: 0.98 }}
    className="fixed bottom-4 right-4 z-[80] w-[calc(100%-2rem)] max-w-md"
  >
    <div className="rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          <Check className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Notificación</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{message}</p>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          &times;
        </button>
      </div>
    </div>
  </motion.div>
));
Notification.displayName = 'Notification';

const GlobalLoader = memo(({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 backdrop-blur-sm"
  >
    <div className="mx-4 w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/95 p-8 text-center shadow-2xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
      <p className="text-lg font-semibold text-slate-900">{message}</p>
      <p className="mt-2 text-sm text-slate-600">Esto puede tardar unos segundos.</p>
    </div>
  </motion.div>
));
GlobalLoader.displayName = 'GlobalLoader';

const SectionCard = memo(({ title, description, icon, children }: any) => (
  <div className="rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl relative">
    <div className="p-6 sm:p-8">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
          {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  </div>
));
SectionCard.displayName = 'SectionCard';

const Field = memo(({ label, hint, required, error, children }: any) => (
  <div>
    <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    {error && <p className="mt-2 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{error}</p>}
  </div>
));
Field.displayName = 'Field';

// --- Tipado correcto para InputBase y SelectBase ---
interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  right?: React.ReactNode;
}

const InputBase = memo(({ className = '', icon, right, ...props }: InputBaseProps) => (
  <div className="relative">
    {icon && <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
    <input
      {...props}
      className={cn(
        'w-full rounded-2xl border border-slate-200 bg-white py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 sm:text-[15px]',
        icon ? 'pl-11 pr-4' : 'px-4',
        right ? 'pr-11' : '',
        props.disabled ? 'cursor-not-allowed bg-slate-50 text-slate-500' : '',
        className
      )}
    />
    {right && <div className="absolute right-4 top-1/2 -translate-y-1/2">{right}</div>}
  </div>
));
InputBase.displayName = 'InputBase';

interface SelectBaseProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const SelectBase = memo(({ className = '', ...props }: SelectBaseProps) => (
  <select
    {...props}
    className={cn(
      'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 sm:text-[15px]',
      props.disabled ? 'cursor-not-allowed bg-slate-50 text-slate-500' : '',
      className
    )}
  />
));
SelectBase.displayName = 'SelectBase';

const SummaryMiniCard = memo(({ label, value, tone = 'default' }: any) => (
  <div className={cn(
    'rounded-2xl border p-4',
    tone === 'default' && 'border-slate-200 bg-white',
    tone === 'success' && 'border-emerald-200 bg-emerald-50/70',
    tone === 'info' && 'border-cyan-200 bg-cyan-50/70'
  )}>
    <p className={cn(
      'text-xs font-semibold uppercase tracking-[0.18em]',
      tone === 'default' && 'text-slate-500',
      tone === 'success' && 'text-emerald-700',
      tone === 'info' && 'text-cyan-700'
    )}>{label}</p>
    <p className={cn(
      'mt-2 text-2xl font-bold',
      tone === 'default' && 'text-slate-900',
      tone === 'success' && 'text-emerald-700',
      tone === 'info' && 'text-cyan-700'
    )}>{value}</p>
  </div>
));
SummaryMiniCard.displayName = 'SummaryMiniCard';

// -------------------- MODAL MULTAS (sin cambios funcionales, tipado implícito correcto) --------------------
const MultasModal = ({ isOpen, onClose, multas, placa }: { isOpen: boolean; onClose: () => void; multas: any[]; placa: string }) => {
  const totalMultas = multas.length;
  const totalMonto = useMemo(() => multas.reduce((acc, m) => {
    const val = parseFloat(m.total?.replace(/[^0-9.-]/g, '') || '0') / 100;
    return acc + (isNaN(val) ? 0 : val);
  }, 0), [multas]);

  const sessionWizard = SessionWizardData.obtener();
  const valorServicio = Number(valorImpugnacionGl);
  const totalConNoPay = totalMultas * valorServicio;
  const ahorro = totalMonto - totalConNoPay;
  const porcentajeAhorro = totalMonto > 0 ? ((ahorro / totalMonto) * 100).toFixed(0) : 0;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-md md:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.97, y: 18, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, y: 18, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-xl md:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1',
                totalMultas > 0 ? 'bg-rose-50 text-rose-600 ring-rose-100' : 'bg-emerald-50 text-emerald-600 ring-emerald-100'
              )}>
                {totalMultas > 0 ? <FileText className="h-6 w-6" /> : <Check className="h-6 w-6" />}
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Diagnóstico vehicular NoPay</span>
                </div>
                <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950 md:text-3xl">
                  {totalMultas > 0 ? 'Encontramos multas pendientes' : 'Tu vehículo está limpio'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Placa consultada: <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono font-black tracking-wider text-slate-800">{placa.toUpperCase()}</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-950 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Contenido (omitido por brevedad, es idéntico al original) */}
        <div className="relative flex-1 overflow-y-auto bg-[#FBFBFD] px-5 py-5 md:px-7 scrollbar-thin scrollbar-thumb-slate-300">
          {totalMultas > 0 ? (
            <div className="space-y-5">
              {/* Resumen */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500"><Receipt className="h-4 w-4" /><p className="text-[11px] font-black uppercase tracking-[0.17em]">Multas detectadas</p></div>
                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{totalMultas}</p>
                  <p className="mt-1 text-sm text-slate-500">Infracciones registradas.</p>
                </div>
                <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500"><DollarSign className="h-4 w-4" /><p className="text-[11px] font-black uppercase tracking-[0.17em]">Total original</p></div>
                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{formatCurrency(totalMonto)}</p>
                  <p className="mt-1 text-sm text-slate-500">Valor aproximado sin revisar.</p>
                </div>
                {ahorro > 0 && (
                  <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-700"><TrendingDown className="h-4 w-4" /><p className="text-[11px] font-black uppercase tracking-[0.17em]">Ahorro potencial</p></div>
                    <p className="mt-3 text-4xl font-black tracking-tight text-emerald-800">{formatCurrency(ahorro)}</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-700">Hasta {porcentajeAhorro}% menos.</p>
                  </div>
                )}
              </div>

              {/* Card principal NoPay */}
              <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-950 shadow-[0_18px_55px_rgba(15,23,42,0.18)]">
                <div className="relative p-5 text-white md:p-6">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(244,63,94,0.20),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(245,158,11,0.18),transparent_34%)]" />
                  <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15"><ShieldCheck className="h-6 w-6 text-amber-300" /></div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-200">Alternativa inteligente</p>
                        <h4 className="mt-1 text-2xl font-black tracking-[-0.04em] md:text-3xl">Con NoPay pagas {formatCurrency(totalConNoPay)} + IVA</h4>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">Revisamos tus multas, ordenamos la información y te guiamos para continuar con mayor claridad.</p>
                      </div>
                    </div>
                    <div className="w-fit rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Beneficio estimado</p>
                      <p className="mt-1 text-lg font-black text-white">Ahorra hasta 70%</p>
                    </div>
                  </div>
                  <div className="relative mt-5 grid gap-3 md:grid-cols-3">
                    {['Sin filas ni papeleo', 'Proceso claro', 'Pago fijo por infracción'].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/85">
                        <Check className="h-4 w-4 shrink-0 text-lime-300" /><span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón scroll a detalle */}
              <button type="button" onClick={() => document.getElementById('detalle-multas')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="group flex w-full items-center justify-between rounded-[1.3rem] border border-rose-100 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-rose-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-rose-50 text-rose-600"><ChevronRight className="h-4 w-4 rotate-90 transition-transform group-hover:translate-y-0.5" /></div>
                  <div><p className="text-sm font-black text-slate-900">Ver respaldo de la multa</p><p className="text-xs text-slate-500">Abajo está el detalle consultado: infracción, fecha, ente y valor.</p></div>
                </div>
                <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500 md:inline-flex">Deslizar abajo</span>
              </button>

              {/* Tabla detalle */}
              <div id="detalle-multas" className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div><p className="text-sm font-black text-slate-950">Detalle de multas encontradas</p><p className="text-xs text-slate-500">Información de respaldo para revisar antes de continuar.</p></div>
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200"><AlertCircle className="h-3.5 w-3.5 text-amber-500" />Consulta referencial</div>
                </div>
                <div className="overflow-x-auto">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
                        <tr className="border-b border-slate-200 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                          <th className="px-5 py-3">N° Infracción</th><th className="px-5 py-3">Ente</th><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Rubro</th><th className="px-5 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {multas.map((multa, idx) => (
                          <tr key={idx} className="transition-colors hover:bg-rose-50/40">
                            <td className="px-5 py-4 font-mono text-sm font-bold text-slate-800">{multa.id_factura || multa.secuencia_1}</td>
                            <td className="px-5 py-4"><div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-slate-400" /><span className="text-slate-600">{multa.ente}</span></div></td>
                            <td className="px-5 py-4"><div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-slate-400" /><span className="text-slate-600">{multa.fecha_emision}</span></div></td>
                            <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{multa.rubro}</span></td>
                            <td className="px-5 py-4 text-right font-black text-slate-900">{multa.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5">
                <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" /><p className="text-sm leading-relaxed text-slate-600"><strong className="font-black text-slate-950">¿Por qué hacerlo con NoPay?</strong> Te damos una lectura clara del problema y te ayudamos a avanzar con un proceso más simple, guiado y seguro.</p></div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <div className="relative mb-7"><div className="absolute inset-0 rounded-full bg-emerald-300/25 blur-2xl" /><div className="relative grid h-24 w-24 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-100"><Check className="h-12 w-12 text-emerald-600" /></div></div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2"><Check className="h-4 w-4 text-emerald-600" /><span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Buenas noticias</span></div>
              <h4 className="mt-5 text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-4xl">No encontramos multas pendientes</h4>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-500">Tu vehículo no registra multas en esta consulta. Si tienes una citación física, puedes cargarla para que NoPay la revise.</p>
              <div className="mt-8 max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm">
                <div className="flex gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white"><Camera className="h-6 w-6" /></div><div><p className="text-base font-black text-slate-950">¿Tienes una multa física?</p><p className="mt-1 text-sm leading-relaxed text-slate-500">Puedes cargar la citación en el siguiente paso para asociarla a tu vehículo e iniciar el proceso correspondiente.</p><button className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition-all hover:bg-rose-600">Cargar multa física <ChevronRight className="h-3.5 w-3.5" /></button></div></div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-xl md:px-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-relaxed text-slate-500">Esta información es referencial y será validada durante el proceso.</p>
            <button onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"><span>Entendido, continuar</span><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// -------------------- COMPONENTE PRINCIPAL OPTIMIZADO --------------------
const AdvancedForm = () => {
  const router = useRouter();
  const logout = useLogout();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Estados
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [cedulaBloqueada, setCedulaBloqueada] = useState(false);
  const [vehiculosUsuario, setVehiculosUsuario] = useState<any[]>([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string>('');
  const [mostrarNuevoVehiculo, setMostrarNuevoVehiculo] = useState(false);
  const [omitValidacionInicial, setOmitValidacionInicial] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [consultandoPlaca, setConsultandoPlaca] = useState(false);
  const [multas, setMultas] = useState<any[]>([]);
  const [errorPlaca, setErrorPlaca] = useState<string | null>(null);
  const [consultaExitosa, setConsultaExitosa] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [nombreParam, setNombreParam] = useState('');
  const [secuencialUser, setSecuencialUser] = useState('');

  const [showUserForm, setShowUserForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [fetchingUserData, setFetchingUserData] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [showCedulaDuplicada, setShowCedulaDuplicada] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showMultasModal, setShowMultasModal] = useState(false);
  const [modalMultas, setModalMultas] = useState<any[]>([]);
  const [modalPlaca, setModalPlaca] = useState('');

  const [wizardData, setWizardData] = useState<any>(null);

  const [userData, setUserData] = useState({
    secuencial: '', nombres: '', apellidos: '', genero: '', fechaNacimiento: null as Date | null,
    email: '', telefono: '',
  });

  const [vehicleData, setVehicleData] = useState({
    placa: '', marca: '', modelo: '', año: '', color: '', tipo: '', chasis: '', motor: '', cmv: '', cilindraje: '',
  });

  // Valores derivados memorizados
  const cedulaValida = useMemo(() => validarCedulaEcuador(cedula), [cedula]);
  const placaValida = useMemo(() => validarPlacaEcuador(vehicleData.placa || ''), [vehicleData.placa]);

  const puedeContinuar = useMemo(() => showUserForm && showVehicleForm && !!userData.telefono && !!userData.email && !!vehicleData.placa, [showUserForm, showVehicleForm, userData.telefono, userData.email, vehicleData.placa]);
  const progreso = useMemo(() => (Number(showUserForm) + Number(showVehicleForm && !!vehicleData.placa)) * 50, [showUserForm, showVehicleForm, vehicleData.placa]);

  // Validación de token
  const validateTokenAndAuth = useCallback(async () => {
    const token = getWizardToken();
    if (!token) {
      setLoading(false);
      router.replace('/login');
      return;
    }
    try {
      const isValid = await isJWTValid(token);
      if (!isValid) {
        setShowSessionExpired(true);
        setTimeout(() => { logout(); router.replace('/login'); }, 2000);
      }
      setLoading(false);
    } catch {
      logout();
      router.replace('/login');
    }
  }, [router, logout]);

  useEffect(() => {
    validateTokenAndAuth();
    intervalRef.current = setInterval(validateTokenAndAuth, 2 * 60 * 1000);
    const onVisibility = () => { if (document.visibilityState === 'visible') validateTokenAndAuth(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [validateTokenAndAuth]);

  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => { if (e.key === 'authTokenWizard') validateTokenAndAuth(); };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [validateTokenAndAuth]);

  useEffect(() => {
    setShowVehicleForm(mostrarNuevoVehiculo || placaValida);
  }, [mostrarNuevoVehiculo, placaValida]);

  useEffect(() => {
    const token = getWizardToken();
    if (!token) { setLoading(false); router.replace('/login'); return; }
    setCheckingAuth(false);
  }, [router]);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    const token = getWizardToken();
    if (!token) { router.replace('/login'); return; }
    const wizardDataNow = SessionWizardData.obtener();
    const cedulaObjetivo = cedula ? cedula.trim() : wizardDataNow?.cedula?.trim();
    const debeConsultar = omitValidacionInicial || (cedula.length === 10 && cedulaValida);
    if (!debeConsultar || !cedulaObjetivo) {
      setShowUserForm(false);
      if (cedula.length > 0 && cedula.length === 10 && !cedulaValida) setErrorMsg('La cédula no es válida. Verifica los dígitos.');
      return;
    }

    setFetchingUserData(true);
    setCedulaBloqueada(false);

    try {
      const url = `${API_BASE_URL}/usuariosid/${cedulaObjetivo}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok && response.status !== 403) { setShowUserForm(true); setFetchingUserData(false); return; }
      if (response.status === 403) return;

      let data: any = await response.json();
      if (!data.cedula) data = { cedula: '', email: '' };
      if (data.cedula && data.cedula !== cedula && cedula.length > 0) {
        setCedula(data.cedula);
        if (data.secuencial || data.cedula) setCedulaBloqueada(true);
      }

      if (wizardDataNow?.cedula !== data.email && typeof data.email === 'string' && data.email.length > 3 && wizardDataNow?.cedula !== data.cedula) {
        const userCedula = wizardDataNow?.cedula?.trim().toLowerCase() || '';
        const backendEmail = data.email?.trim().toLowerCase() || '';
        if (userCedula && backendEmail && userCedula !== backendEmail) {
          setErrorMsg('La cédula consultada corresponde a otra cuenta.');
          setShowCedulaDuplicada(true);
          return;
        }
      }

      if (wizardDataNow?.cedula) setCedula(wizardDataNow.cedula.trim());
      const emailFinal = data.email || wizardDataNow?.cedula || '';
      if (wizardDataNow && data.email != null) setCedula(wizardDataNow.cedula);
      setCedula(data.cedula || cedulaObjetivo);
      SessionWizardData.guardar({ cedula: data.cedula || cedulaObjetivo, secuencial: data.secuencial, nombres: data.nombres, apellidos: data.apellidos });
      setUserData({
        secuencial: data.secuencial?.toString() || '', nombres: data.nombres || '', apellidos: data.apellidos || '',
        genero: data.desSexo === 'HOMBRE' ? 'masculino' : data.desSexo === 'MUJER' ? 'femenino' : '',
        fechaNacimiento: data.fechaNacimiento ? new Date(Number(data.fechaNacimiento)) : null,
        email: emailFinal, telefono: data.celular || '',
      });
      if (data.cedula || data.secuencial) setCedulaBloqueada(true);
      const profile = getUserProfile();
      setUserProfile({ name: data.nombres, photoUrl: profile.photoUrl ? profile.photoUrl : '/images/avatar.png' });
      setShowUserForm(true);
    } catch {
      setShowUserForm(true);
    } finally {
      setFetchingUserData(false);
      setOmitValidacionInicial(false);
    }
  }, [cedula, cedulaValida, omitValidacionInicial, router]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // Fetch vehículos
  const fetchVehiculos = useCallback(async () => {
    const token = getWizardToken();
    const usuarioId = userData.secuencial;
    if (!usuarioId || usuarioId === '0' || isNaN(Number(usuarioId))) { setVehiculosUsuario([]); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/vehiculos/detalle/${usuarioId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 404) { setVehiculosUsuario([]); return; }
      if (!res.ok) throw new Error('Error al obtener vehículos');
      const data = await res.json();
      setVehiculosUsuario(data);
    } catch { /* ignore */ }
  }, [userData.secuencial]);

  useEffect(() => { fetchVehiculos(); }, [fetchVehiculos]);

  useEffect(() => {
    const wData = SessionWizardData.obtener();
    if (wData) {
      setCedula('');
      setSecuencialUser(wData.secuencial?.toString() || '');
      setNombreParam(`${wData.nombres || ''} ${wData.apellidos || ''}`);
      setEmail(wData.email || wData.cedula);
      setOmitValidacionInicial(true);
    }
  }, []);

  // Buscar placa
  const buscarPlaca = useCallback(async (placaConsultar?: string) => {
    const placaAUsar = (placaConsultar || vehicleData.placa || '').toUpperCase();
    if (!validarPlacaEcuador(placaAUsar)) {
      setErrorPlaca('Formato de placa inválido');
      setMultas([]);
      setConsultaExitosa(false);
      return;
    }
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setConsultandoPlaca(true);
    setErrorPlaca(null);
    setMultas([]);
    setConsultaExitosa(false);

    try {
      const token = getWizardToken();
      const url = `${CITACIONES_API_URL}?tipo=PLA&identificacion=${encodeURIComponent(placaAUsar)}&estado=pendientes`;
      const response = await fetch(url, { signal: controller.signal, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      if (controller.signal.aborted) return;
      if (data.meta?.error) {
        setErrorPlaca('No se encontró información para la placa ingresada');
        setConsultaExitosa(false);
      } else if (!data.cabecera || Object.keys(data.cabecera).length === 0) {
        setErrorPlaca('Placa no válida o sin información');
        setConsultaExitosa(false);
      } else {
        const cab = data.cabecera;
        setVehicleData(prev => ({
          ...prev, placa: placaAUsar, marca: cab.Marca || prev.marca, modelo: cab.Modelo || prev.modelo,
          color: cab.Color ? cab.Color.toLowerCase() : prev.color, año: cab['Año'] || cab['Año de Matrícula'] || prev.año,
          tipo: mapearTipo(cab.Clase) || prev.tipo,
        }));
        const nuevasMultas = data.rows && data.rows.length > 0 ? data.rows : [];
        setMultas(nuevasMultas);
        setConsultaExitosa(true);
        setModalMultas(nuevasMultas);
        setModalPlaca(placaAUsar);
        setShowMultasModal(true);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      setErrorPlaca('Error de conexión al consultar placa. Intente más tarde.');
      setConsultaExitosa(false);
    } finally {
      if (!controller.signal.aborted) setConsultandoPlaca(false);
    }
  }, [vehicleData.placa]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.telefono) { setAuthError('El número de teléfono es obligatorio para contactarte.'); return; }
    if (!userData.email) { setAuthError('El correo electrónico es obligatorio para comunicaciones legales.'); return; }
    if (!vehicleData.placa) { setAuthError('La placa del vehículo es obligatoria para continuar.'); return; }
    const token = getWizardToken();
    if (!token) { setAuthError('No hay token de autenticación disponible.'); return; }
    setSubmitting(true);
    const wizardDataNow = SessionWizardData.obtener();
    const payload = {
      nombres: userData.nombres, apellidos: userData.apellidos, cedula, fechaNacimiento: userData.fechaNacimiento?.toISOString().split('T')[0],
      email: userData.email ? userData.email : wizardDataNow ? wizardDataNow.cedula : '', usuarioCrea: 'admin', celular: userData.telefono,
      vehiculo: {
        placa: vehicleData.placa, marca: vehicleData.marca, modelo: vehicleData.modelo, anio: vehicleData.año ? parseInt(vehicleData.año.toString(), 10) : null,
        color: vehicleData.color, tipo: vehicleData.tipo, chasis: '', motor: '', cmv: '', cilindraje: null,
      },
      multas,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/regusuarios`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload),
      });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `Error HTTP: ${response.status}`); }
      const result = await response.json();
      createSessionNonce();
      await crearSesionJWT(cedula, result.secuencial_usuario, token);
      setNotificationMessage(result.mensaje || 'El primer paso está listo');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        SessionWizardData.guardar({ cedula, secuencial: result.secuencial_usuario, nombres: userData.nombres, apellidos: userData.apellidos });
        router.push('/wizard-form');
      }, 300);
    } catch (error: any) {
      setAuthError(error.message || 'Error al enviar el formulario');
    } finally {
      setSubmitting(false);
    }
  }, [userData, vehicleData, cedula, multas, router]);

  if (authError) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 p-4">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/95 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50"><AlertCircle className="h-8 w-8 text-red-500" /></div>
        <h3 className="text-xl font-semibold text-slate-900">No pudimos procesar tu solicitud</h3>
        <p className="mt-2 text-slate-600">{authError.includes('token') ? 'Tu sesión expiró. Por favor, inicia sesión nuevamente.' : authError}</p>
        <button onClick={() => window.location.reload()} className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl">Reintentar</button>
      </motion.div>
    </div>
  );

  if (checkingAuth || loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100">
      <div className="rounded-[28px] border border-slate-200/80 bg-white/95 px-8 py-10 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50"><Loader2 className="h-8 w-8 animate-spin text-cyan-600" /></div>
        <p className="text-lg font-semibold text-slate-900">Preparando tu sesión</p>
        <p className="mt-1 text-sm text-slate-600">Estamos verificando tu acceso seguro.</p>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {showSessionExpired && <Notification message="Tu sesión ha expirado, por favor inicia sesión nuevamente." onClose={() => setShowSessionExpired(false)} />}
        {showCedulaDuplicada && <Notification message="La cédula ingresada pertenece a otra cuenta." onClose={() => setShowCedulaDuplicada(false)} />}
        {consultandoPlaca && <GlobalLoader message="Buscando información del vehículo y multas..." />}
        {submitting && <GlobalLoader message="Guardando información, por favor espera..." />}
      </AnimatePresence>

      <NoPayBackground />
      <div className="relative z-10 px-4 pb-24 sm:px-6 lg:px-8">
        <Header />
        <main className="mx-auto max-w-7xl py-8">
          {/* Progress header */}
          <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Paso 1 de 3</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Completa tus datos</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Verificaremos tu información personal y la de tu vehículo para continuar de forma segura.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">1</span><span className="text-sm font-medium text-slate-700">Datos</span></div>
                <div className="h-px w-6 bg-slate-300" />
                <div className={`flex items-center gap-1 ${progreso >= 50 ? 'opacity-100' : 'opacity-40'}`}><span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${progreso >= 50 ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-500'} text-sm font-bold`}>2</span><span className="text-sm font-medium text-slate-700">Vehículo</span></div>
                <div className="h-px w-6 bg-slate-300" />
                <div className={`flex items-center gap-1 ${progreso >= 100 ? 'opacity-100' : 'opacity-40'}`}><span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${progreso >= 100 ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-500'} text-sm font-bold`}>3</span><span className="text-sm font-medium text-slate-700">Confirmar</span></div>
              </div>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500" style={{ width: `${progreso}%` }} /></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <SectionCard title="Iniciamos con la impugnación de tus multas" icon={<User className="h-7 w-7" />}>
                <form onSubmit={handleFormSubmit} className="space-y-8 pb-24">
                  {/* Campo cédula oculto (se mantiene funcional) */}
                  <div className="hidden grid grid-cols-1 gap-6">
                    <Field label="Cédula" hint="Ingresa tu número de identificación ecuatoriano de 10 dígitos." error={cedula.length === 10 && !cedulaValida ? 'La cédula no es válida. Verifica los dígitos.' : errorMsg}>
                      <InputBase type="text" value={cedula} onChange={(e) => { setCedula(e.target.value); setErrorMsg(null); }} placeholder="Ej: 1712345678" maxLength={10} disabled={cedulaBloqueada} icon={<CreditCard className="h-4 w-4" />} right={cedula.length === 10 ? (fetchingUserData ? <Loader2 className="h-5 w-5 animate-spin text-cyan-600" /> : cedulaValida ? <Check className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-500" />) : null} />
                    </Field>
                    <div className="mt-2 mb-4 flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs text-cyan-700 w-fit border border-cyan-100"><ShieldCheck className="h-3.5 w-3.5" /><span className="font-medium">Tus datos están protegidos con encriptación de grado bancario</span></div>
                  </div>

                  <AnimatePresence>
                    {showUserForm && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="hidden rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                        <div className="mb-6 flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><BadgeCheck className="h-6 w-6" /></div><div><h3 className="text-xl font-bold text-slate-900">Información personal</h3><p className="mt-1 text-sm text-slate-600">Revisa y completa tus datos antes de continuar.</p></div></div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <Field label="Nombres"><InputBase type="text" value={userData.nombres} onChange={(e) => setUserData({ ...userData, nombres: e.target.value })} placeholder="Ej: Juan Carlos" icon={<User className="h-4 w-4" />} disabled={cedulaBloqueada} right={userData.nombres ? <Check className="h-5 w-5 text-emerald-600" /> : null} /></Field>
                          <Field label="Apellidos"><InputBase type="text" value={userData.apellidos} onChange={(e) => setUserData({ ...userData, apellidos: e.target.value })} placeholder="Ej: Pérez Gómez" icon={<User className="h-4 w-4" />} disabled={cedulaBloqueada} right={userData.apellidos ? <Check className="h-5 w-5 text-emerald-600" /> : null} /></Field>
                          <Field label="Fecha de nacimiento"><InputBase type="date" value={userData.fechaNacimiento ? formatDateToInput(userData.fechaNacimiento) : ''} onChange={(e) => setUserData({ ...userData, fechaNacimiento: e.target.value ? new Date(e.target.value) : null })} icon={<CalendarDays className="h-4 w-4" />} right={userData.fechaNacimiento ? <Check className="h-5 w-5 text-emerald-600" /> : null} /></Field>
                          <Field label="Teléfono" required><InputBase type="tel" value={userData.telefono} onChange={(e) => setUserData({ ...userData, telefono: e.target.value })} required pattern="[0-9]{10,15}" placeholder="Ej: 0987654321" icon={<Phone className="h-4 w-4" />} right={userData.telefono ? <Check className="h-5 w-5 text-emerald-600" /> : null} /></Field>
                          <div className="md:col-span-2"><Field label="Correo electrónico" required hint="Este campo es informativo y viene asociado a tu sesión."><InputBase type="email" value={userData.email} disabled={cedulaBloqueada} readOnly required placeholder="Ej: ejemplo@correo.com" icon={<Mail className="h-4 w-4" />} right={userData.email ? <Check className="h-5 w-5 text-emerald-600" /> : null} /></Field></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Lista de vehículos existentes */}
                  {vehiculosUsuario.length > 0 && (
                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
                      <div className="mb-6 flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><CarFront className="h-6 w-6" /></div><div><h3 className="text-xl font-bold text-slate-900">Tus vehículos registrados</h3><p className="mt-1 text-sm text-slate-600">Selecciona uno de tus vehículos o agrega uno nuevo.</p></div></div>
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {vehiculosUsuario.map((vehiculo, index) => (
                          <motion.div key={index} whileHover={{ y: -3 }} className={cn('relative overflow-hidden rounded-[24px] border p-5 shadow-sm transition cursor-pointer', vehiculoSeleccionado === vehiculo.placa ? 'border-cyan-300 bg-cyan-50 ring-2 ring-cyan-100' : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white')} onClick={() => { setVehiculoSeleccionado(vehiculo.placa); setVehicleData({ placa: vehiculo.placa, marca: vehiculo.marca || '', modelo: vehiculo.modelo || '', año: vehiculo.anio?.toString() || '', color: vehiculo.color || '', tipo: vehiculo.tipo || '', chasis: vehiculo.chasis || '', motor: vehiculo.motor || '', cmv: vehiculo.cmv || '', cilindraje: vehiculo.cilindraje?.toString() || '' }); setMostrarNuevoVehiculo(false); buscarPlaca(vehiculo.placa); }}>
                            <div className="mb-4 flex items-start justify-between gap-3"><div><h4 className="text-xl font-bold tracking-wider text-slate-900">{vehiculo.placa}</h4><span className={cn('mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', vehiculo.tipo === 'motocicleta' && 'bg-blue-50 text-blue-700 border border-blue-200', vehiculo.tipo === 'camioneta' && 'bg-emerald-50 text-emerald-700 border border-emerald-200', vehiculo.tipo !== 'motocicleta' && vehiculo.tipo !== 'camioneta' && 'bg-purple-50 text-purple-700 border border-purple-200')}>{vehiculo.tipo || 'Vehículo'}</span></div>{vehiculoSeleccionado === vehiculo.placa && <div className="inline-flex items-center rounded-full border border-cyan-200 bg-white px-2.5 py-1 text-xs font-semibold text-cyan-700"><Check className="mr-1 h-3 w-3" />Seleccionado</div>}</div>
                            <div className="space-y-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Marca / Modelo</p><p className="mt-1 font-medium text-slate-800">{vehiculo.marca || 'Sin marca'} {vehiculo.modelo && `- ${vehiculo.modelo}`}</p></div><div className="grid grid-cols-2 gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Año</p><p className="mt-1 font-medium text-slate-800">{vehiculo.anio || 'N/A'}</p></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Color</p><div className="mt-1 flex items-center gap-2"><span className="inline-block h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: getColorCode(vehiculo.color) }} /><span className="font-medium capitalize text-slate-800">{vehiculo.color || 'N/A'}</span></div></div></div></div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-center"><button type="button" onClick={() => { setMostrarNuevoVehiculo(true); setShowVehicleForm(true); setVehiculoSeleccionado(''); setVehicleData({ placa: '', marca: '', modelo: '', año: '', color: '', tipo: '', chasis: '', motor: '', cmv: '', cilindraje: '' }); setTimeout(() => document.getElementById('nuevo-vehiculo-form')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"><PlusCircle className="h-4 w-4" />Agregar otro vehículo<span className="text-xs opacity-80">(si no ves el tuyo)</span></button></div>
                    </div>
                  )}

                  {(vehiculosUsuario.length === 0 || mostrarNuevoVehiculo) && (
                    <AnimatePresence>
                      <motion.div id="nuevo-vehiculo-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                        <div className="mb-6 flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><Car className="h-6 w-6" /></div><div><h3 className="text-xl font-bold text-slate-900">Datos del vehículo</h3><p className="mt-1 text-sm text-slate-600">Consulta la placa y completa los datos faltantes si es necesario.</p></div></div>
                        <div className="space-y-6">
                          <Field label="Placa" hint="Formato ecuatoriano: tres letras seguidas de tres o cuatro dígitos (ej: ABC1234)." error={vehicleData.placa.length >= 6 && !placaValida ? 'Formato de placa inválido.' : errorPlaca}>
                            <div className="flex gap-3"><InputBase type="text" value={vehicleData.placa} onChange={(e) => setVehicleData({ ...vehicleData, placa: e.target.value.toUpperCase() })} placeholder="Ej: ABC1234" maxLength={8} disabled={consultandoPlaca} icon={<Car className="h-4 w-4" />} right={vehicleData.placa.length >= 6 ? (placaValida ? <Check className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-500" />) : null} /><button type="button" onClick={() => buscarPlaca()} disabled={!placaValida || consultandoPlaca} className={cn('inline-flex items-center justify-center rounded-2xl px-5 py-3 shadow-lg transition', placaValida && !consultandoPlaca ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:translate-y-[-1px] hover:shadow-xl' : 'cursor-not-allowed bg-slate-200 text-slate-400')}><Search className="h-5 w-5" /></button></div>
                          </Field>
                          {consultaExitosa && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6"><div className="grid grid-cols-1 gap-5 md:grid-cols-2"><Field label="Marca"><InputBase type="text" value={vehicleData.marca} placeholder="Ej: Chevrolet" onChange={(e) => setVehicleData({ ...vehicleData, marca: e.target.value })} disabled /></Field><Field label="Modelo"><InputBase type="text" value={vehicleData.modelo} placeholder="Ej: Aveo Emotion" onChange={(e) => setVehicleData({ ...vehicleData, modelo: e.target.value })} disabled /></Field></div><div className="grid grid-cols-1 gap-5 md:grid-cols-3"><Field label="Año"><InputBase type="number" value={vehicleData.año} placeholder="Ej: 2020" onChange={(e) => setVehicleData({ ...vehicleData, año: e.target.value })} disabled /></Field><Field label="Color"><InputBase type="text" value={vehicleData.color} placeholder="Ej: Rojo" onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })} disabled /></Field><Field label="Tipo"><SelectBase value={vehicleData.tipo} onChange={(e) => setVehicleData({ ...vehicleData, tipo: e.target.value })} disabled><option value="">Seleccionar</option><option value="automovil">Automóvil</option><option value="camioneta">Camioneta</option><option value="motocicleta">Motocicleta</option><option value="comercial">Comercial</option></SelectBase></Field></div></motion.div>)}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {errorPlaca && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-red-200 bg-red-50/70 p-4 text-sm font-medium text-red-700 flex items-center gap-2"><AlertCircle className="h-5 w-5" />{errorPlaca}</motion.div>)}

                  <div className="sticky bottom-0 -mb-24 mt-8 pt-4 pb-6 bg-white/95 backdrop-blur-sm border-t border-slate-200 rounded-b-2xl z-20"><div className="flex justify-end"><button type="submit" disabled={!puedeContinuar || submitting} className={cn('inline-flex items-center gap-2 rounded-2xl px-8 py-3 font-semibold shadow-lg transition', puedeContinuar && !submitting ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:translate-y-[-1px] hover:shadow-xl' : 'cursor-not-allowed bg-slate-200 text-slate-400')}>{submitting ? <><Loader2 className="h-5 w-5 animate-spin" />Guardando...</> : <>Siguiente<ChevronRight className="h-5 w-5" /></>}</button></div></div>
                </form>
              </SectionCard>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Resumen rápido</p><h3 className="mt-2 text-lg font-bold text-slate-900">{nombreParam || 'Usuario'}</h3><p className="mt-1 text-sm text-slate-500">Cédula: {cedula || '-'}</p><div className="mt-5 space-y-4"><SummaryMiniCard label="Vehículos" value={vehiculosUsuario.length} tone="default" /><SummaryMiniCard label="Multas" value={multas.length} tone={multas.length > 0 ? 'info' : 'default'} /><SummaryMiniCard label="Estado" value={puedeContinuar ? 'Listo' : 'Pendiente'} tone={puedeContinuar ? 'success' : 'default'} /></div></div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl"><div className="flex items-start gap-3"><ShieldCheck className="h-6 w-6 text-cyan-600" /><div><h3 className="text-sm font-semibold text-slate-900">Garantía de seguridad legal</h3><p className="mt-1 text-xs text-slate-500">Todos los datos están protegidos bajo estándares de confidencialidad. No compartimos tu información con terceros sin tu autorización expresa.</p></div></div></div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl"><h3 className="text-lg font-bold text-slate-900">Consejo</h3><p className="mt-3 text-sm leading-6 text-slate-600">Verifica cuidadosamente tu teléfono, tu correo y la placa del vehículo. Esa será usada en el siguiente paso del proceso.</p></div>
            </aside>
          </div>

          <AnimatePresence>{showNotification && <Notification message={notificationMessage} onClose={() => setShowNotification(false)} />}</AnimatePresence>
        </main>
      </div>

      <MultasModal isOpen={showMultasModal} onClose={() => setShowMultasModal(false)} multas={modalMultas} placa={modalPlaca} />
      <NoPayChatLauncher />
      <Footer />
    </>
  );
};

export default AdvancedForm;