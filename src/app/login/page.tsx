// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "config/apiConfig";

import { auth, provider } from "../../lib/firebase";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";

import {
  createSessionNonce,
  setWizardToken,
  getWizardToken,
} from "../../lib/seguridad/sessionUtils";

import { crearSesionJWT } from "lib/seguridad/JwtSessionService";
import { SessionWizardData } from "lib/seguridad/SessionWizardData";
import { getUserProfile, setUserProfile } from "lib/seguridad/SessionUser";

export default function LoginPage() {
  useEffect(() => {
    const token = getWizardToken();
    const profile = getUserProfile();

    if (token && profile?.name) {
      setUser({
        displayName: profile.name,
        photoURL: profile.photoUrl,
      });
    }
  }, []);

  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const router = useRouter();

  // Efecto parallax opcional para el fondo
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 100]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin(null);

    if (!email.trim() || !password.trim()) {
      setErrorLogin("Email y contraseña son obligatorios.");
      return;
    }

    setLoadingLogin(true);
    try {
      const res = await fetch(`${API_BASE_URL}/creaUsuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200) {
        const { token, secuencial } = await res.json();
        setWizardToken(token);
        const secuencialUsuario = secuencial || 0;
        await crearSesionJWT(email, "0", token);
        const nombres = email.split("@")[0];
        SessionWizardData.guardar({
          cedula: email,
          secuencial: secuencialUsuario,
          nombres: nombres,
          apellidos: "",
          displayName: nombres,
          photoURL: "",
          email: email,
        });
        setUserProfile({ name: nombres, photoUrl: "" });
        router.push("/Servicios/landingActivos");
        return;
      }

      if (res.status === 401) {
        setErrorLogin("Credenciales inválidas. Revisa tu email o contraseña.");
      } else {
        const data = await res.json().catch(() => null);
        setErrorLogin(data?.error || "Ocurrió un error inesperado.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setErrorLogin("No se pudo conectar con el servidor.");
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const facebookProvider = new FacebookAuthProvider();
      facebookProvider.addScope("public_profile");
      facebookProvider.addScope("email");
      const result = await signInWithPopup(auth, facebookProvider);
      const userData = result.user;
      createSessionNonce();
      const facebookPhotoURL = `https://graph.facebook.com/${userData.providerData[0]?.uid}/picture?type=large&width=200&height=200`;
      const tokenResponse = await fetch(`${API_BASE_URL}/generaToken/loginFacebook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
        }),
      });
      if (!tokenResponse.ok) throw new Error("No se pudo autenticar en backend");
      const { token: backendToken } = await tokenResponse.json();
      setWizardToken(backendToken);
      const safeCedula = userData.email || "";
      const safeSecuencial = userData.uid || "";
      const [nombres, ...apellidos] = (userData.displayName || "").split(" ");
      SessionWizardData.guardar({
        cedula: safeCedula,
        secuencial: parseInt(/^\d+$/.test(safeSecuencial) ? safeSecuencial : "0", 10),
        nombres: nombres || "",
        apellidos: apellidos.join(" ") || "",
        displayName: userData.displayName || "",
        photoURL: facebookPhotoURL,
      });
      setUserProfile({
        name: userData.displayName || "",
        photoUrl: facebookPhotoURL,
      });
      router.push("/Servicios/landingActivos");
    } catch (error) {
      alert("Hubo un problema al iniciar sesión con Facebook.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;
      setUser(userData);
      createSessionNonce();
      const tokenResponse = await fetch(`${API_BASE_URL}/generaToken/loginGoogle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
        }),
      });
      if (!tokenResponse.ok) throw new Error("No se pudo autenticar en backend");
      const { token: backendToken } = await tokenResponse.json();
      setWizardToken(backendToken);
      const safeCedula = userData.email || "";
      const safeSecuencial = userData.uid || "";
      if (!safeCedula || !safeSecuencial || !backendToken) {
        console.error("🚫 Faltan datos obligatorios:", {
          safeCedula,
          safeSecuencial,
          backendToken,
        });
        alert("Faltan datos necesarios para generar la sesión. Intenta nuevamente.");
        return;
      }
      await crearSesionJWT(safeCedula, safeSecuencial, backendToken);
      const [nombres, ...apellidos] = (userData.displayName || "").split(" ");
      SessionWizardData.guardar({
        cedula: safeCedula,
        secuencial: parseInt(safeSecuencial),
        nombres: nombres || "",
        apellidos: apellidos.join(" ") || "",
        displayName: userData.displayName || "",
        photoURL: userData.photoURL || "",
      });
      setUserProfile({
        name: userData.displayName || "",
        photoUrl: userData.photoURL || "",
      });
      router.push("/Servicios/landingActivos");
    } catch (error) {
      alert("Hubo un problema al iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* PANEL INFORMATIVO IZQUIERDO - FONDO OSCURO CON GRADIENTES RADIALES (estilo Hero) */}
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
          <Link href="/">
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
            {/* Título con gradiente dorado (como en Hero) */}
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-tight mb-6">
              Bienvenido a{" "}
              <span className="bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#EAB308] bg-clip-text text-transparent drop-shadow-[0_8px_24px_rgba(234,179,8,0.25)]">
                NoPay
              </span>
            </h1>

            <p className="text-base xl:text-lg font-light leading-relaxed text-slate-300">
              Automatiza tus trámites legales, impugna multas, accede a abogados expertos y mucho más.
            </p>
            <p className="mt-3 text-base xl:text-lg font-medium text-white drop-shadow-sm">
              ¡Hazlo todo desde un solo lugar, sin pagar de más!
            </p>

            {/* Badges decorativos con estilo Hero */}
            <div className="flex flex-wrap gap-3 mt-8">
              {["Sin vueltas", "100% digital", "Ahorro real"].map((tag) => (
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

      {/* PANEL DE LOGIN - FONDO CLARO CON ACENTOS NoPay (rosa, ámbar, naranja) */}
      <section className="relative flex flex-col justify-center items-center px-5 sm:px-8 py-12 bg-[#FBFBFE] lg:rounded-l-[48px] shadow-2xl">
        {/* Fondo decorativo con blur suave */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FCE7F3] rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FED7AA] rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
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
                ⚡ Regístrate en 10 segundos
              </div>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-950">
                Inicia sesión
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-xs mx-auto">
                Es necesario iniciar sesión o crear una cuenta para empezar tu proceso legal
                de forma segura.
              </p>
            </div>

            {errorLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
              >
                {errorLogin}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-[#FCE7F3] focus:border-[#D82465] transition-all duration-200 text-sm"
                  placeholder="ejemplo@dominio.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                    Contraseña
                  </label>

                  <Link
                    href="/login/RecuperarPassword"
                    className="text-xs font-semibold text-[#D82465] hover:text-[#B91C4A] transition"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-[#FCE7F3] focus:border-[#D82465] transition-all duration-200 text-sm"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loadingLogin}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 text-white rounded-xl font-bold transition-all duration-200 shadow-md ${
                  loadingLogin
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-105 active:scale-[0.98] shadow-[0_8px_20px_rgba(216,36,101,0.25)]"
                }`}
              >
                {loadingLogin ? "Iniciando sesión..." : "Entrar a mi cuenta"}
              </motion.button>
            </form>

            <div className="flex items-center my-7">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-xs font-medium">o continúa con</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm"
              >
                <FcGoogle className="text-xl" />
                <span className="font-semibold text-gray-700 text-sm">
                  Continuar con Google
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: "#EFF6FF" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-blue-100 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 shadow-sm"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                    alt="FB"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-semibold text-blue-700 text-sm">
                  Continuar con Facebook
                </span>
              </motion.button>
            </div>

            <div className="mt-7 rounded-2xl border border-[#FECDD3] bg-gradient-to-br from-[#FEF2F2] to-[#FFF7ED] p-5 text-center">
              <p className="text-sm font-black text-gray-900">
                ¿Aún no tienes cuenta?
              </p>

              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Créala en segundos y empieza tu proceso legal con una experiencia segura.
              </p>

              <Link
                href="/login/RegistroPage"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-black transition-all duration-200 active:scale-[0.98] shadow-md"
              >
                Crear mi cuenta en 10 segundos
              </Link>
            </div>
          </motion.div>

          {/* Sesión activa (si existe) */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center border border-amber-200 bg-amber-50 p-5 rounded-2xl shadow-md"
            >
              <p className="text-sm text-amber-800">
                ⚠️ Ya tienes una sesión iniciada como:
              </p>

              <p className="text-base font-black text-amber-900 mt-2">
                {user.displayName}
              </p>

              <div className="w-14 h-14 mx-auto mt-3 relative">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Foto de perfil"
                    width={56}
                    height={56}
                    className="rounded-full shadow-md border-2 border-amber-300 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-profile.png";
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-amber-200 flex items-center justify-center">
                    <span className="text-lg font-black text-amber-700">
                      {user.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => router.push("/Servicios/landingActivos")}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-2 rounded-xl hover:brightness-105 transition-all duration-200 font-bold text-sm shadow-md"
                >
                  Continuar con esta sesión
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("authTokenWizard");
                    localStorage.removeItem("sessionNonce");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userPhotoUrl");
                    SessionWizardData.limpiar();
                    setUser(null);
                  }}
                  className="text-xs text-gray-500 hover:text-red-500 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}