"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { adminLogin } from "../../../../lib/adminApi";
import { AdminSession } from "../../../../lib/seguridad/AdminSession";
export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@nopay.ec");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu email y contraseña administrativa.");
      return;
    }

    try {
      setLoading(true);

      const data = await adminLogin({
        email: email.trim().toLowerCase(),
        password,
      });

      AdminSession.guardar(data.token, data.usuario);

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070A] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.18),transparent_32%),linear-gradient(135deg,#07070A_0%,#111018_45%,#1a0d12_100%)]" />

      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />

      <section className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="hidden items-center justify-center px-12 lg:flex">
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Backoffice Legal Operations
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Centro de control{" "}
              <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                administrativo
              </span>{" "}
              NoPay.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/65">
              Acceso seguro para gestionar casos legales, revisar eventos de
              usuarios, responder observaciones y operar la plataforma con
              trazabilidad profesional.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                ["Casos", "Centralizados"],
                ["Roles", "Seguros"],
                ["Auditoría", "Activa"],
              ].map(([title, subtitle]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
                >
                  <p className="text-sm text-white/45">{subtitle}</p>
                  <p className="mt-1 text-xl font-bold">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.08] p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] shadow-lg shadow-pink-500/20">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                Acceso administrativo
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Ingresa con tus credenciales internas para operar el panel
                privado de NoPay.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Email administrativo
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nopay.ec"
                    className="w-full rounded-2xl border border-white/10 bg-black/25 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pink-300/50 focus:ring-4 focus:ring-pink-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Contraseña
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña segura"
                    className="w-full rounded-2xl border border-white/10 bg-black/25 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pink-300/50 focus:ring-4 focus:ring-pink-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-pink-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Validando acceso...
                  </>
                ) : (
                  <>
                    Entrar al panel
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-white/45">
              Este acceso es exclusivo para personal autorizado de NoPay. Toda
              actividad administrativa podrá ser registrada para fines de
              seguridad y auditoría.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}