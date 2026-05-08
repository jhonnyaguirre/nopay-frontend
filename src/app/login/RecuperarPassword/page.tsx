// app/recuperar/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";
import { API_BASE_URL } from "config/apiConfig";

export default function RecuperarPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tu site key de reCAPTCHA v2 (la misma del registro)
  const siteKey = "6LfWeScrAAAAAA1_P74ST8cqqdeFfbiqIICOZCGD";

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validaciones front-end
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, captchaToken }),
      });

      if (res.ok) {
        // Éxito: mostrar mensaje y opcionalmente redirigir después de unos segundos
        setSuccessMsg(
          "Hemos enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada."
        );
        setEmail("");
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        // Opcional: redirigir al login después de 5 segundos
        setTimeout(() => router.push("/login"), 5000);
        return;
      }

      // Manejo de errores según código de respuesta
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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Panel izquierdo: Información (solo en pantallas ≥ lg) */}
      <section className="hidden lg:flex flex-col justify-between px-16 py-10 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white">
        <div>
          {/* Logo en la parte superior */}
          <div className="flex items-center mb-6">
            <Link href="/Servicios">
              <img src="/images/logo.png" alt="Logo NoPay" className="w-20 h-20 opacity-90" />
            </Link>
          </div>

          {/* Mensaje de bienvenida */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 font-serif">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-lg font-light leading-relaxed text-white/90">
              No te preocupes. Te enviaremos un enlace seguro a tu correo para que puedas restablecerla.
              <br />
              <span className="block mt-2 font-medium text-white">
                Recuerda revisar también la bandeja de spam.
              </span>
            </p>
          </motion.div>
        </div>

        {/* Pie de página */}
        <footer className="text-sm text-white/80 border-t border-white/20 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <span>© {new Date().getFullYear()} NoPay</span>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                Términos
              </a>
              <a href="#" className="hover:text-white">
                Privacidad
              </a>
            </div>
          </div>
        </footer>
      </section>

      {/* Panel derecho: Formulario de recuperación */}
      <section className="flex flex-col justify-center items-center px-8 py-12 bg-white text-gray-800 rounded-l-3xl shadow-2xl">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Recuperar contraseña</h2>

          {/* Mensaje de éxito */}
          {successMsg && (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-400 text-green-800 rounded-lg shadow-sm">
              <p className="font-medium">{successMsg}</p>
              <p className="text-sm mt-1">Serás redirigido al inicio de sesión en unos segundos...</p>
            </div>
          )}

          {/* Mensaje de error */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Correo electrónico
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4899] pr-10"
                  placeholder="ejemplo@dominio.com"
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Google reCAPTCHA v2 */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={handleCaptchaChange}
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading || !!successMsg}
              className={`w-full py-2 text-white rounded-lg font-medium transition duration-200 ${
                loading || successMsg
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#EC4899] hover:bg-[#DB2777]"
              }`}
            >
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t" />
            <span className="mx-4 text-gray-500 text-sm">o</span>
            <div className="flex-grow border-t" />
          </div>

          {/* Enlaces auxiliares */}
          <div className="text-center space-y-2">
            <p className="text-sm">
              <Link href="/login" className="text-[#EC4899] hover:underline">
                Volver al inicio de sesión
              </Link>
            </p>
            <p className="text-sm">
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="text-[#EC4899] hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}