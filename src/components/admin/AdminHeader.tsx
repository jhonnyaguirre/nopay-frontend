"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { AdminSession } from "../../lib/seguridad/AdminSession";

export default function AdminHeader() {
  const router = useRouter();
  const usuario = AdminSession.getUsuario();

  const cerrarSesion = () => {
    AdminSession.cerrarSesion();
    router.replace("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-5 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] shadow-lg shadow-pink-500/20 lg:hidden">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-950">
                Centro de operaciones
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Gestión, atención y respuesta de eventos NoPay
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white" />
          </button>

          <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-right shadow-sm sm:block">
            <p className="text-sm font-black text-slate-900">
              {usuario?.nombres} {usuario?.apellidos}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {usuario?.roles}
            </p>
          </div>

          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}