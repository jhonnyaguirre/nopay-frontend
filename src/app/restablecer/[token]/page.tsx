// app/restablecer/[token]/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "config/apiConfig";

export default function RestablecerPasswordPage() {
  const params = useParams<{ token: string }>();
	const token = typeof params?.token === "string" ? params.token : "";
	const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword || !confirmPassword) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }
    if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
      setErrorMsg("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/restablecer-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaPassword: newPassword }),
      });

      if (res.ok) {
        setSuccessMsg("Contraseña actualizada correctamente. Serás redirigido al inicio de sesión.");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setErrorMsg(data.error || "Error al restablecer la contraseña.");
      } catch {
        setErrorMsg("Error inesperado del servidor.");
      }
    } catch (err) {
      setErrorMsg("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Panel izquierdo (igual que en recuperar) */}
      <section className="hidden lg:flex flex-col justify-between px-16 py-10 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white">
        <div>
          <div className="flex items-center mb-6">
            <Link href="/Servicios">
              <img src="/images/logo.png" alt="Logo NoPay" className="w-20 h-20 opacity-90" />
            </Link>
          </div>
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 font-serif">
              Restablece tu contraseña
            </h1>
            <p className="text-lg font-light leading-relaxed text-white/90">
              Elige una nueva contraseña segura para tu cuenta. Asegúrate de recordarla.
            </p>
          </div>
        </div>
        <footer className="text-sm text-white/80 border-t border-white/20 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <span>© {new Date().getFullYear()} NoPay</span>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">Términos</a>
              <a href="#" className="hover:text-white">Privacidad</a>
            </div>
          </div>
        </footer>
      </section>

      {/* Panel derecho */}
      <section className="flex flex-col justify-center items-center px-8 py-12 bg-white text-gray-800 rounded-l-3xl shadow-2xl">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Ingresa tu nueva contraseña</h2>

          {successMsg && (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-400 text-green-800 rounded-lg">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nueva contraseña */}
            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm font-medium">
                Nueva contraseña
              </label>
              <input
                type={showNew ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4899] pr-10"
                placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirmar contraseña */}
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
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg}
              className={`w-full py-2 text-white rounded-lg font-medium transition duration-200 ${
                loading || successMsg
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#EC4899] hover:bg-[#DB2777]"
              }`}
            >
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t" />
            <span className="mx-4 text-gray-500 text-sm">o</span>
            <div className="flex-grow border-t" />
          </div>

          <p className="text-center text-sm">
            <Link href="/login" className="text-[#EC4899] hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}