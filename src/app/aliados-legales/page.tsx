'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  UserRound,
  Building2,
  FileCheck2,
  BriefcaseBusiness,
  Handshake,
  ChevronDown
} from 'lucide-react';

import { Header } from 'app/resources/Header';
import Footer from 'app/resources/Footer';
import NoPayChatLauncher from 'app/resources/NoPayChatLauncher';
import { API_BASE_URL } from 'config/apiConfig';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

type FormState = {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  ciudad: string;
  provincia: string;
  especialidad: string;
  aniosExperiencia: string;
  numeroMatricula: string;
  tipoAliado: string;
  despachoJuridico: string;
  mensaje: string;
  aceptaContacto: boolean;
};

const initialForm: FormState = {
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  ciudad: '',
  provincia: '',
  especialidad: '',
  aniosExperiencia: '',
  numeroMatricula: '',
  tipoAliado: 'ABOGADO_INDEPENDIENTE',
  despachoJuridico: '',
  mensaje: '',
  aceptaContacto: true,
};

const especialidades = [
  'Tránsito y multas',
  'Familia, niñez y alimentos',
  'Migratorio',
  'Civil',
  'Laboral',
  'Mercantil / Societario',
  'Propiedad intelectual / marcas',
  'Penal',
  'Administrativo',
  'Otro',
];

const ciudades = [
  'Cuenca',
  'Quito',
  'Guayaquil',
  'Loja',
  'Ambato',
  'Manta',
  'Machala',
  'Riobamba',
  'Santo Domingo',
  'Otra ciudad',
];

export default function AliadosLegalesNoPayPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  const canSubmit = useMemo(() => {
    return (
      form.nombres.trim().length >= 2 &&
      form.email.trim().includes('@') &&
      form.telefono.trim().length >= 7 &&
      form.ciudad.trim().length >= 2 &&
      form.especialidad.trim().length >= 2 &&
      form.aceptaContacto
    );
  }, [form]);

  const update = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessData(null);

    if (!canSubmit) {
      setGeneralError('Completa los campos obligatorios para registrar tu postulación.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        ciudad: form.ciudad.trim(),
        provincia: form.provincia.trim(),
        especialidad: form.especialidad.trim(),
        aniosExperiencia: Number(form.aniosExperiencia || 0),
        numeroMatricula: form.numeroMatricula.trim(),
        tipoAliado: form.tipoAliado,
        despachoJuridico: form.despachoJuridico.trim(),
        aceptaContacto: form.aceptaContacto,
        mensaje: form.mensaje.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/aliados-legales/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'No se pudo registrar la postulación.');
      }

      setSuccessData(data);
      setForm(initialForm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      setGeneralError(error?.message || 'No se pudo completar el registro.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFD] text-slate-950 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      <Header />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <Background />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          
          {/* Columna Izquierda: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-rose-200/60 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600 shadow-sm backdrop-blur-sm">
              <Sparkles size={13} className="animate-pulse text-rose-500" />
              Aliados legales NoPay
            </div>

           
		   <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.05em] text-slate-900 md:text-7xl">
			  La transformación digital
			  <br />
			  <span className="bg-gradient-to-r from-[#111827] via-[#B68D40] to-[#E7C873] bg-clip-text text-transparent">
				del sector legal.
			  </span>
			</h1>

			<p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
			  En <span className="font-bold text-slate-900">NoPay</span> estamos construyendo una{" "}
			  <span className="font-semibold text-slate-800">
				plataforma tecnológica
			  </span>{" "}
			  que moderniza la forma en que las personas acceden a{" "}
			  <span className="font-semibold text-slate-800">
				servicios legales
			  </span>{" "}
			  en <span className="font-semibold text-slate-800">Ecuador</span>.
			  <br />
			  <br />
			  Buscamos{" "}
			  <span className="font-semibold text-slate-800">
				abogados y estudios jurídicos
			  </span>{" "}
			  que compartan esta{" "}
			  <span className="font-semibold text-[#B68D40]">
				visión de innovación
			  </span>.
			</p>

		   

            {/* Tarjetas de Beneficios Mejoradas */}
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <MiniBenefit title="Alta Demanda" text="Casos filtrados listos" />
              <MiniBenefit title="Cero Riesgo" text="Sin costos fijos de entrada" />
              <MiniBenefit title="Todo el País" text="Presencia digital nacional" />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#postulacion"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-slate-950/20 transition-all duration-300 hover:bg-slate-900 hover:shadow-2xl hover:shadow-slate-950/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Postular ahora
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/60 px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
              >
                Cómo funciona
              </a>
            </div>
          </motion.div>

          {/* Columna Derecha: Formulario de Registro Premium */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            id="postulacion"
            className="relative rounded-[2.5rem] border border-white bg-white/70 p-6 shadow-[0_32px_100px_-20px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-10"
          >
            {/* Efecto Glow sutil detrás del formulario */}
            <div className="absolute -inset-px -z-10 rounded-[2.5rem] bg-gradient-to-tr from-rose-100/40 via-orange-50/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-rose-500 bg-rose-50 px-3 py-1 rounded-md">
                Admisión Privada
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-900 md:text-4xl">
                Postula a la Red
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Completa tus datos profesionales. Analizaremos tu perfil en un plazo de 48 horas de forma estrictamente confidencial.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm font-medium text-rose-700 backdrop-blur-sm"
                >
                  {generalError}
                </motion.div>
              )}

              {successData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="rounded-full bg-emerald-500 p-1 text-white shadow-sm shadow-emerald-500/30">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">¡Postulación recibida con éxito!</p>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        Código interno de seguimiento: <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-emerald-700">{successData?.secuencial}</span>. Un asesor técnico se comunicará contigo próximamente.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submitForm} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputField icon={<UserRound size={18} />} label="Nombres *" value={form.nombres} onChange={(v) => update('nombres', v)} placeholder="Juan" />
                <InputField icon={<UserRound size={18} />} label="Apellidos" value={form.apellidos} onChange={(v) => update('apellidos', v)} placeholder="Pérez" />
                <InputField icon={<Mail size={18} />} label="Correo Electrónico *" value={form.email} onChange={(v) => update('email', v)} type="email" placeholder="juan@ejemplo.com" />
                <InputField icon={<Phone size={18} />} label="WhatsApp Profesional *" value={form.telefono} onChange={(v) => update('telefono', v)} placeholder="0987654321" />
                <SelectField icon={<MapPin size={18} />} label="Ciudad Principal *" value={form.ciudad} onChange={(v) => update('ciudad', v)} options={ciudades} />
                <InputField icon={<MapPin size={18} />} label="Provincia" value={form.provincia} onChange={(v) => update('provincia', v)} placeholder="Azuay" />
                <SelectField icon={<Scale size={18} />} label="Especialidad Fuerte *" value={form.especialidad} onChange={(v) => update('especialidad', v)} options={especialidades} />
                <InputField icon={<FileCheck2 size={18} />} label="Años de Experiencia" value={form.aniosExperiencia} onChange={(v) => update('aniosExperiencia', v)} type="number" placeholder="Ej. 5" />
                <InputField icon={<FileCheck2 size={18} />} label="Matrícula Profesional / Foro" value={form.numeroMatricula} onChange={(v) => update('numeroMatricula', v)} placeholder="N° de registro" />
                <InputField icon={<Building2 size={18} />} label="Firma / Despacho" value={form.despachoJuridico} onChange={(v) => update('despachoJuridico', v)} placeholder="Opcional" />
              </div>

              <div className="pt-2">
                <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Modelo de Práctica
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <ChoiceCard
                    active={form.tipoAliado === 'ABOGADO_INDEPENDIENTE'}
                    title="Independiente"
                    icon={<Scale size={18} />}
                    onClick={() => update('tipoAliado', 'ABOGADO_INDEPENDIENTE')}
                  />
                  <ChoiceCard
                    active={form.tipoAliado === 'ESTUDIO_JURIDICO'}
                    title="Estudio Jurídico"
                    icon={<BriefcaseBusiness size={18} />}
                    onClick={() => update('tipoAliado', 'ESTUDIO_JURIDICO')}
                  />
                  <ChoiceCard
                    active={form.tipoAliado === 'CONSULTOR_LEGAL'}
                    title="Consultor"
                    icon={<Handshake size={18} />}
                    onClick={() => update('tipoAliado', 'CONSULTOR_LEGAL')}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Mensaje o Presentación Breve
                </label>
                <textarea
                  value={form.mensaje}
                  onChange={(e) => update('mensaje', e.target.value)}
                  rows={3}
                  placeholder="Cuéntanos brevemente sobre tus fortalezas y por qué te interesa unirte a NoPay..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={form.aceptaContacto}
                  onChange={(e) => update('aceptaContacto', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-rose-600 transition-all cursor-pointer"
                />
                <span className="text-xs text-slate-500 leading-normal select-none">
                  Autorizo el tratamiento de mis datos comerciales para fines de validación y contacto de alianza por parte de NoPay.
                </span>
              </label>

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className={cn(
                  'w-full relative overflow-hidden flex items-center justify-center gap-3 rounded-2xl py-4.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 py-4',
                  canSubmit && !submitting
                    ? 'bg-gradient-to-r from-rose-600 via-pink-500 to-orange-500 text-white shadow-xl shadow-rose-500/20 hover:scale-[1.01] hover:shadow-2xl hover:shadow-rose-500/30 active:scale-[0.99]'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200/60'
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Validando Información
                  </>
                ) : (
                  <>
                    Enviar Postulación
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Sección "Cómo Funciona" Simplificada y Estilizada */}
      <section id="como-funciona" className="relative z-10 mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[3rem] border border-slate-200/70 bg-white/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur-xl md:p-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-900">Un ecosistema digital fluido</h2>
            <p className="text-slate-500 text-sm mt-2">Nuestra tecnología automatiza el funnel comercial legal.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
            <InfoCard
              number="01"
              title="Aplica en la Web"
              text="Ingresa tu perfil y el algoritmo segmentará tus campos de especialización preferidos."
            />
            <InfoCard
              number="02"
              title="Filtro de Idoneidad"
              text="Verificamos credenciales ante el Foro para garantizar la máxima seguridad del ecosistema."
            />
            <InfoCard
              number="03"
              title="Despacho de Casos"
              text="Comienza a recibir asignaciones y leads altamente cualificados de forma automatizada."
            />
          </div>
        </div>
      </section>

      {/* Sección "Importante" CTA con Estilo Ejecutivo */}
      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 text-white shadow-2xl md:p-16">
          {/* Luz de fondo sutil dentro del banner oscuro */}
          <div className="absolute right-[-10%] top-[-20%] h-[350px] w-[350px] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-300 backdrop-blur-sm">
                Transparencia total
              </div>
              <h2 className="text-3xl font-black tracking-[-0.03em] md:text-5xl leading-tight">
                Una red de colaboración, <br />no una subordinación.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-400 text-sm leading-relaxed">
                Este registro constituye una postulación comercial para prestación de servicios independientes. No genera vinculación laboral, sociedad comercial, ni derechos sobre la marca o tecnología de NoPay S.A.
              </p>
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-white/[0.03] p-6 border border-white/10 shadow-inner">
              <ShieldCheck className="text-rose-400" size={64} />
            </div>
          </div>
        </div>
      </section>

      <NoPayChatLauncher />
      <Footer />
    </main>
  );
}

// Subcomponentes Internos Mejorados con Animaciones

function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Luces Orgánicas */}
      <div className="absolute left-[-5%] top-[-5%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-rose-200/40 to-pink-200/30 blur-[130px]" />
      <div className="absolute right-[-5%] top-[15%] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-100/20 blur-[140px]" />
      <div className="absolute bottom-[-10%] left-[20%] h-[700px] w-[700px] rounded-full bg-pink-100/50 blur-[130px]" />
      
      {/* Grid Pattern Sutil Moderno */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-100" />
    </div>
  );
}

function MiniBenefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="group rounded-2xl border border-slate-200/60 bg-white/50 p-4.5 shadow-[0_4px_20px_rgba(15,23,42,0.01)] backdrop-blur-md transition-all duration-300 hover:bg-white hover:border-slate-300 hover:shadow-md p-4">
      <p className="font-extrabold text-slate-900 text-sm tracking-tight">{title}</p>
      <p className="mt-1 text-xs text-slate-400 leading-normal font-medium">{text}</p>
    </div>
  );
}

function InfoCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="group relative rounded-2xl bg-slate-50/50 border border-slate-100 p-6 transition-all duration-300 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/80">
      <div className="text-xs font-mono font-black text-rose-500 bg-rose-50 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-black tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-400 font-medium">{text}</p>
    </div>
  );
}

function InputField({
  icon,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 select-none">
        {label}
      </label>
      <div className="relative group/input">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300 group-focus-within/input:text-rose-500">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-11 py-3.5 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10 shadow-inner-sm"
        />
      </div>
    </div>
  );
}

function SelectField({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 select-none">
        {label}
      </label>
      <div className="relative group/select">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300 group-focus-within/select:text-rose-500 pointer-events-none">
          {icon}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/70 px-11 py-3.5 text-xs text-slate-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10 cursor-pointer"
        >
          <option value="" className="text-slate-400">Seleccionar</option>
          {options.map((item) => (
            <option key={item} value={item} className="text-slate-800">
              {item}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform duration-300 group-focus-within/select:rotate-180">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({
  active,
  title,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center sm:justify-start gap-2.5 rounded-2xl border p-3.5 text-left transition-all duration-300 w-full',
        active
          ? 'border-rose-400 bg-gradient-to-tr from-rose-50 to-pink-50 text-rose-700 shadow-sm font-bold ring-2 ring-rose-500/5'
          : 'border-slate-200/80 bg-slate-50/30 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
      )}
    >
      <span className={cn('transition-transform duration-300', active && 'scale-110 text-rose-500')}>{icon}</span>
      <span className="text-xs font-bold tracking-tight select-none">{title}</span>
    </button>
  );
}