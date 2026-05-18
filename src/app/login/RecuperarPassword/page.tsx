// app/recuperar/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from "config/apiConfig";

export default function RecuperarPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Site key de reCAPTCHA v2
  const siteKey = "6LfWeScrAAAAAA1_P74ST8cqqdeFfbiqIICOZCGD";

  // Efecto parallax para el fondo
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 100]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("El correo electrónico es obligatorio.");
      return;
    }
    if (!email.match(/^[\w.+\-]+@[a-zA-Z\d\-]+\.[a-zA-Z\d\-]{2,}$/)) {
      setErrorMsg("Formato de correo inválido.");
      return;
    }
    if (!captchaToken) {
      setErrorMsg("Por favor, verifica que no eres un robot.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/recuperar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });

      if (res.ok) {
        setSuccessMsg(
          "Hemos enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada."
        );
        setEmail("");
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        setTimeout(() => router.push("/login"), 5000);
        return;
      }

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (res.status === 400 || res.status === 404) {
          setErrorMsg(data.error || "No se pudo procesar la solicitud.");
        } else {
          setErrorMsg(`Error inesperado: ${data.error || res.statusText}`);
        }
      } catch (e) {
        setErrorMsg("El servidor respondió con un error inesperado.");
      }

      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } catch (err: any) {
      setErrorMsg("No se pudo conectar con el servidor. Intenta más tarde.");
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* PANEL INFORMATIVO IZQUIERDO - MISMO ESTILO QUE LOGIN Y HERO */}
      <section className="hidden lg:flex flex-col items-start justify-between px-10 xl:px-16 py-10 min-h-screen bg-[#020617] text-white relative overflow-hidden">
        {/* Gradientes radiales animados (idénticos al Hero) */}
        <motion.div
			  style={{ y: yBg }}
			  animate={{
				background: [
				  "radial-gradient(circle at 20% 30%, #D82465 0%, #F46C1D 40%, #020617 85%)",
				  "radial-gradient(circle at 80% 70%, #D82465 0%, #F46C1D 35%, #020617 85%)",
				  "radial-gradient(circle at 40% 50%, #D82465 0%, #F46C1D 40%, #020617 85%)",
				],
			  }}
			  transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
			  className="absolute inset-0 z-0 opacity-80"
			/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />

        {/* Contenido relativo */}
        <div className="relative z-10 w-full">
          <Link href="/Servicios">
            <Image
              src="/images/logoN.png"
              alt="Logo NoPay"
              width={90}
              height={90}
              className="opacity-95 cursor-pointer transition-transform hover:scale-105 drop-shadow-lg"
            />
          </Link>
        </div>

        <div className="flex-grow flex flex-col justify-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-tight mb-6">
              ¿Olvidaste tu{" "}
              <span className="bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#EAB308] bg-clip-text text-transparent drop-shadow-[0_8px_24px_rgba(234,179,8,0.25)]">
                contraseña?
              </span>
            </h1>
            <p className="text-base xl:text-lg font-light leading-relaxed text-slate-300">
              No te preocupes. Te enviaremos un enlace seguro a tu correo para que puedas restablecerla.
            </p>
            <p className="mt-3 text-base xl:text-lg font-medium text-white drop-shadow-sm">
              Recuerda revisar también la bandeja de spam.
            </p>

            {/* Badges decorativos */}
            <div className="flex flex-wrap gap-3 mt-8">
              {["Seguro", "Rápido", "Sin estrés"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-black uppercase tracking-wider bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <footer className="relative z-10 w-full text-sm text-slate-400 border-t border-white/20 pt-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <span>© {new Date().getFullYear()} NoPay - LegalTech Ecuador</span>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition">Términos</a>
              <a href="#" className="hover:text-white transition">Privacidad</a>
              <a href="#" className="hover:text-white transition">Ayuda</a>
            </div>
          </div>
        </footer>
      </section>

      {/* PANEL DERECHO: FORMULARIO DE RECUPERACIÓN - ESTILO CLARO CON ACENTOS NoPay */}
      <section className="relative flex flex-col justify-center items-center px-5 sm:px-8 py-12 bg-[#FBFBFE] lg:rounded-l-[48px] shadow-2xl">
        {/* Fondo decorativo con blur suave */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FCE7F3] rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FED7AA] rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/Servicios">
              <Image
                src="/images/logo.png"
                alt="Logo NoPay"
                width={70}
                height={70}
                className="cursor-pointer transition-transform hover:scale-105"
              />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-gray-200/80 bg-white/90 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FCE7F3] to-[#FED7AA] border border-[#FECDD3] px-4 py-1.5 text-[11px] font-black text-[#D82465] mb-5 shadow-sm">
                🔐 Recuperación segura
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-950">
                Restablecer contraseña
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-xs mx-auto">
                Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
              </p>
            </div>

            {/* Mensaje de éxito */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl"
              >
                <p className="font-medium">{successMsg}</p>
                <p className="text-xs mt-1">Serás redirigido al inicio de sesión en unos segundos...</p>
              </motion.div>
            )}

            {/* Mensaje de error */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
              >
                {errorMsg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-[#FCE7F3] focus:border-[#D82465] transition-all duration-200 text-sm pr-10"
                    placeholder="ejemplo@dominio.com"
                    autoComplete="email"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Google reCAPTCHA v2 */}
              <div className="flex justify-center scale-90 md:scale-100">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={siteKey}
                  onChange={handleCaptchaChange}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading || !!successMsg}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 text-white rounded-xl font-bold transition-all duration-200 shadow-md ${
                  loading || successMsg
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-105 active:scale-[0.98] shadow-[0_8px_20px_rgba(216,36,101,0.25)]"
                }`}
              >
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </motion.button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-4 text-gray-400 text-xs font-medium">o</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <div className="text-center space-y-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#D82465] hover:text-[#B91C4A] transition"
              >
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </Link>
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link href="/login/RegistroPage" className="font-semibold text-[#D82465] hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}