// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
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
	  console.log("Firebase userData:", userData);
console.log("Token backend status:", tokenResponse.status);
console.log("Token backend response:", await tokenResponse.clone().text());
      const userData = result.user;

      createSessionNonce();

      const facebookPhotoURL = `https://graph.facebook.com/${
        userData.providerData[0]?.uid
      }/picture?type=large&width=200&height=200`;

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
	  console.log("Firebase userData:", userData);
console.log("Token backend status:", tokenResponse.status);
console.log("Token backend response:", await tokenResponse.clone().text());
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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FBFBFE] text-white overflow-hidden">
      {/* Panel informativo - Mejorado con tipografía más equilibrada */}
      
	  
	   <section className="hidden lg:flex flex-col items-start justify-between px-16 py-10 min-h-screen bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white">
        {/* Membrete superior con logo */}
        <div className="w-full flex justify-start items-center mb-6">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo NoPay"
              width={80}
              height={80}
              className="opacity-90 cursor-pointer"
            />
          </Link>
        </div>

        {/* Contenido principal centrado */}
        <div className="flex-grow flex flex-col justify-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 max-w-xl"
          >
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-6 font-serif">
              Bienvenido a <span className="text-[#FCD34D]">NoPay</span>
            </h1>

            <p className="text-lg font-light leading-relaxed text-white/90">
              Automatiza tus trámites legales, impugna multas, accede a abogados expertos y mucho más.
              <br />
              <span className="block mt-2 font-medium text-white">
                ¡Hazlo todo desde un solo lugar, sin pagar de más!
              </span>
            </p>
          </motion.div>
        </div>

        {/* Pie de página fijo */}
        <footer className="w-full text-sm text-white/80 border-t border-white/20 pt-6 mt-6">
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

      {/* Panel de login - Tipografía refinada y espaciado mejorado */}
      <section className="relative flex flex-col justify-center items-center px-5 sm:px-8 py-12 bg-[#FBFBFE] text-gray-900 lg:rounded-l-[42px] shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-60" />

        <div className="relative z-10 w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Logo NoPay"
                width={68}
                height={68}
                className="cursor-pointer transition-transform hover:scale-105"
              />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-gray-200/80 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.12)] p-6 sm:p-8"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center rounded-full bg-pink-50 border border-pink-100 px-3.5 py-1.5 text-[11px] font-bold text-[#EC4899] mb-5">
                Regístrate en 10 segundos
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
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {errorLogin}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-[#EC4899] transition-all duration-200 text-sm"
                  placeholder="ejemplo@dominio.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Contraseña
                  </label>

                  <Link
                    href="/login/RecuperarPassword"
                    className="text-xs font-semibold text-[#EC4899] hover:text-[#DB2777] hover:underline transition"
                  >
                    He olvidado mi contraseña
                  </Link>
                </div>

                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-[#EC4899] transition-all duration-200 text-sm"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingLogin}
                className={`w-full py-3 text-white rounded-xl font-bold transition-all duration-200 shadow-md shadow-pink-500/20 ${
                  loadingLogin
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#EC4899] to-[#F59E0B] hover:brightness-105 active:scale-[0.98]"
                }`}
              >
                {loadingLogin ? "Iniciando sesión..." : "Entrar a mi cuenta"}
              </button>
            </form>

            <div className="flex items-center my-7">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-xs">o continúa con</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm"
              >
                <FcGoogle className="text-xl" />
                <span className="font-medium text-gray-700 text-sm">
                  Continuar con Google
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
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
                <span className="font-medium text-blue-700 text-sm">
                  Continuar con Facebook
                </span>
              </motion.button>
            </div>

            <div className="mt-7 rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-orange-50 p-5 text-center">
              <p className="text-sm font-bold text-gray-900">
                ¿Aún no tienes cuenta?
              </p>

              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Créala en segundos y empieza tu proceso legal con una experiencia segura.
              </p>

              <Link
                href="/login/RegistroPage"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-black transition-all duration-200 active:scale-[0.98]"
              >
                Crear mi cuenta en 10 segundos
              </Link>
            </div>
          </motion.div>

          {user && (
            <div className="mt-6 text-center border border-yellow-200 bg-yellow-50 p-5 rounded-2xl shadow-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Ya tienes una sesión iniciada como:
              </p>

              <p className="text-base font-bold text-yellow-900 mt-2">
                {user.displayName}
              </p>

              <div className="w-14 h-14 mx-auto mt-3 relative">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Foto de perfil"
                    width={56}
                    height={56}
                    className="rounded-full shadow-md border object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-profile.png";
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-500">
                      {user.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => router.push("/Servicios/landingActivos")}
                  className="bg-[#EC4899] text-white px-4 py-2 rounded-xl hover:bg-[#DB2777] transition-all duration-200 font-semibold text-sm"
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
            </div>
          )}
        </div>
      </section>
    </main>
  );
}