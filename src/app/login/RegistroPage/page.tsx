// app/registro/page.tsx
// ----------------------
// Esta versión incluye un mensaje informativo previo al envío,
// recalcando la importancia de ingresar un correo electrónico válido.

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "config/apiConfig";

export default function RegistroPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tu site key de reCAPTCHA v2 en .env.local:
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfOasdasdFFgrAAAAAHdmuuGdHJegKB0wpA6KQf6AThJf";

  // Para verificar en consola que esté correctamente cargada:


  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    setErrorMsg(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones front-end
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }
    if (!email.match(/^[\w.+\-]+@[a-zA-Z\d\-]+\.[a-zA-Z\d\-]{2,}$/)) {
      setErrorMsg("Formato de correo inválido.");
      return;
    }
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
      setErrorMsg(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número."
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }
    if (!captchaToken) {
      setErrorMsg("Por favor, verifica que no eres un robot.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/creaUsuarios`, {
        //const res = await fetch("${API_BASE_URL}/api/creaUsuarios", {

        method: "POST",
        headers: {
          //'Authorization': `Bearer ${localStorage.getItem('wizardToken') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 201) {
        router.push("/login");
        return;
      }

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        // continuar normalmente


        if (res.status === 400 || res.status === 409) {
          setErrorMsg(data.error || "Error en el registro.");
        } else {
          setErrorMsg(`Error inesperado: ${data.error || res.statusText}`);
        }

        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } catch (e) {
        //console.error("⚠️ Respuesta no JSON:", text);
        setErrorMsg("El servidor respondió con una página no válida o HTML.");
      }
    } catch (err: any) {
      setErrorMsg("No se pudo conectar con el servidor. Intenta más tarde.");
      //console.error(err);
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
            <img src="/images/logo.png" alt="Logo NoPay" className="w-20 h-20 opacity-90" />
          </div>

          {/* Bienvenida e información */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 font-serif">
              Únete a <span className="text-[#FCD34D]">NoPay</span>
            </h1>
            <p className="text-lg font-light leading-relaxed text-white/90">
              Crea tu cuenta en segundos y comienza a automatizar tus trámites legales, impugnar multas y acceder
              a abogados expertos. <br />
              <span className="block mt-2 font-medium text-white">
                ¡Sin costo adicional, sin complicaciones!
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

      {/* Panel derecho: Formulario de registro */}
      <section className="flex flex-col justify-center items-center px-8 py-12 bg-white text-gray-800 rounded-l-3xl shadow-2xl">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Crear nueva cuenta</h2>

          {/* Mensaje informativo destacado */}
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-sm">
            <p className="font-medium">
              Importante: tu correo electrónico es fundamental para mantenerte al día con las actualizaciones
              de tus procesos. Asegúrate de ingresar uno válido al que tengas acceso.
            </p>
          </div>

          {/* Mensaje de error general */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                placeholder="ejemplo@dominio.com"
                required
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4899] pr-10"
                placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirmar Contraseña */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirmar contraseña
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4899] pr-10"
                placeholder="Repite la contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Google reCAPTCHA v2 */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={handleCaptchaChange}
              />
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white rounded-lg font-medium transition duration-200 ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#EC4899] hover:bg-[#DB2777]"
                }`}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t" />
            <span className="mx-4 text-gray-500 text-sm">o</span>
            <div className="flex-grow border-t" />
          </div>

          {/* Enlace a Login */}
          <p className="text-center text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#EC4899] hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
