// app/login/page.tsx
// ------------------
// Página de login actualizada para llamar al backend con email/password.
// Se integra la llamada a POST ${API_BASE_URL}/usuarios/login
// (ajusta la URL según tu contexto) y gestiona el JWT resultante.

"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from 'config/apiConfig';


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

  // ------------------------------
  // LOGIN TRADICIONAL (EMAIL/PASS)
  // ------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin(null);

    if (!email.trim() || !password.trim()) {
      setErrorLogin("Email y contraseña son obligatorios.");
      return;
    }

    setLoadingLogin(true);
    try {
      console.log("Se llama al servicio: " + `${API_BASE_URL}/creaUsuarios/login`);
      const res = await fetch(`${API_BASE_URL}/creaUsuarios/login`, {
        //const res = await fetch(`http://localhost:8080/creaUsuarios/login`, {
        //const res = await fetch(`${API_BASE_URL}/creaUsuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("se ha dado paso 1")
      if (res.status === 200) {
        console.log("se ha dado paso 2")
        const { token, secuencial } = await res.json();

        // Guardar JWT en sesión/frontend
        console.log("se ha dado paso 3")
        setWizardToken(token);
        //setGlobalToken(token);
        console.log("se ha dado paso 4")
        const secuencialUsuario = secuencial || 0;
        console.log("se ha dado paso 5")
        // Paso opcional: crear sesión en backend local si tienes otro endpoint
        await crearSesionJWT(email, "0", token); // si tu backend quiere cedula y secuencial, ajusta
        console.log("se ha dado paso 6")
        // Construir perfil mínimo a partir del email
        const nombres = email.split("@")[0];
        SessionWizardData.guardar({
          cedula: email,
          secuencial: secuencialUsuario,
          nombres: nombres,
          apellidos: "",
          displayName: nombres,
          photoURL: "",
        });

        console.log("se ha dado paso 7")
        setUserProfile({ name: nombres, photoUrl: "" });
        console.log("se ha dado paso 8")
        // Redirigir a formulario principal (ajusta la ruta según tu flujo)
        router.push("/register-form");
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

  // ------------------------------
  // LOGIN CON FACEBOOK
  // ------------------------------
  const handleFacebookLogin = async () => {
    try {
      const facebookProvider = new FacebookAuthProvider();
      facebookProvider.addScope("public_profile");
      facebookProvider.addScope("email");
      const result = await signInWithPopup(auth, facebookProvider);
      const userData = result.user;

      const nonce = createSessionNonce();
      //console.log("🔐 sessionNonce generado:", nonce);
      const facebookPhotoURL = `https://graph.facebook.com/${userData.providerData[0]?.uid
        }/picture?type=large&width=200&height=200`;

      // Llamada al backend para generar JWT con credenciales de Facebook
      const tokenResponse = await fetch(
        `${API_BASE_URL}/generaToken/loginFacebook`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: userData.uid,
            email: userData.email,
            displayName: userData.displayName,
          }),
        }
      );
      if (!tokenResponse.ok) throw new Error("No se pudo autenticar en backend");

      const { token: backendToken } = await tokenResponse.json();
      setWizardToken(backendToken);
      //setGlobalToken(backendToken);

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
      setUserProfile({ name: userData.displayName || "", photoUrl: facebookPhotoURL });

      router.push("/register-form");
    } catch (error) {
      //console.error("🚫 Error al iniciar sesión con Facebook:", error);
      alert("Hubo un problema al iniciar sesión con Facebook.");
    }
  };

  // -----------------------------
  // LOGIN CON GOOGLE
  // -----------------------------
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;
      setUser(userData);

      const nonce = createSessionNonce();
      //console.log("🔐 sessionNonce generado:", nonce);
      //console.log("🔐 SE PASA A GENERAR EL CONSUMO");
      console.log("Se llama al servicio: " + `${API_BASE_URL}/generaToken/loginGoogle`);
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
      //setGlobalToken(backendToken);

      const safeCedula = userData.email || "";
      const safeSecuencial = userData.uid || "";
      const [nombrePrincipal, ...apellidoResto] = (userData.displayName || "").split(" ");

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
      //console.log("✅ JWT personalizado creado y guardado");

      const [nombres, ...apellidos] = (userData.displayName || "").split(" ");
      SessionWizardData.guardar({
        cedula: safeCedula,
        secuencial: parseInt(safeSecuencial),
        nombres: nombres || "",
        apellidos: apellidos.join(" ") || "",
        displayName: userData.displayName || "",
        photoURL: userData.photoURL || "",
      });
      setUserProfile({ name: userData.displayName || "", photoUrl: userData.photoURL || "" });

      router.push("/register-form");
    } catch (error) {
      //console.error("🚫 Error al iniciar sesión con Google:", error);
      alert("Hubo un problema al iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white">
      {/* Panel informativo */}
      <section className="hidden lg:flex flex-col items-start justify-between px-16 py-10 min-h-screen bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white">
        {/* Membrete superior con logo */}
        <div className="w-full flex justify-start items-center mb-6">
          <Link href="/servicios">
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

      {/* Panel de login */}
      <section className="flex flex-col justify-center items-center px-8 py-12 bg-white text-gray-800 rounded-l-3xl shadow-2xl">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Inicia sesión en tu cuenta</h2>

          {/* Mensaje de error de login tradicional */}
          {errorLogin && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
              {errorLogin}
            </div>
          )}

          {/* Formulario de login tradicional */}
          <form onSubmit={handleLogin} className="space-y-5">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              className={`w-full py-2 text-white rounded-lg font-medium transition duration-200 ${loadingLogin ? "bg-gray-400 cursor-not-allowed" : "bg-[#EC4899] hover:bg-[#DB2777]"
                }`}
            >
              {loadingLogin ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t"></div>
            <span className="mx-4 text-gray-500 text-sm">o</span>
            <div className="flex-grow border-t"></div>
          </div>

          <div className="space-y-4">
            {/* Botón Google */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm"
            >
              <FcGoogle className="text-2xl" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">
                Continuar con Google
              </span>
            </motion.button>

            {/* Botón Facebook */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 shadow-sm"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="FB"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-medium text-blue-700 text-sm sm:text-base">
                Continuar con Facebook
              </span>
            </motion.button>
          </div>

          {user && (
            <div className="mt-8 text-center border border-yellow-300 bg-yellow-50 p-4 rounded-xl shadow-md">
              <p className="text-sm text-yellow-800">⚠️ Ya tienes una sesión iniciada como:</p>
              <p className="text-lg font-semibold text-yellow-900 mt-2">{user.displayName}</p>

              <div className="w-16 h-16 mx-auto mt-3 relative">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Foto de perfil"
                    width={64}
                    height={64}
                    className="rounded-full shadow-md border object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-profile.png";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-semibold text-gray-500">
                      {user.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => router.push("/register-form")}
                  className="bg-[#EC4899] text-white px-4 py-2 rounded-lg hover:bg-[#DB2777] transition"
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
                  className="text-sm text-gray-500 hover:text-red-500 mt-1"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link href="/login/RegistroPage" className="text-[#EC4899] hover:underline">
              Crea una aquí
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
