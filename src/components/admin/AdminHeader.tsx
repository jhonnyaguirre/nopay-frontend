"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { AdminSession } from "../../lib/seguridad/AdminSession";

type AdminHeaderProps = {
  onOpenMobileMenu: () => void;
};

export default function AdminHeader({
  onOpenMobileMenu,
}: AdminHeaderProps) {
  const router = useRouter();
  const usuario = AdminSession.getUsuario();

  const cerrarSesion = () => {
    AdminSession.cerrarSesion();
    router.replace("/admin/login");
  };

  const nombreUsuario = `${usuario?.nombres ?? ""} ${
    usuario?.apellidos ?? ""
  }`.trim();

  return (
    <header
      className="
        sticky
        top-0
        z-40
        w-full
        border-b
        border-slate-200/70
        bg-white/90
        backdrop-blur-xl
        supports-[backdrop-filter]:bg-white/80
      "
    >
      <div
        className="
          flex
          h-16
          w-full
          min-w-0
          items-center
          justify-between
          gap-2
          px-3
          sm:h-18
          sm:px-4
          md:h-20
          md:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            IZQUIERDA
        ====================================================== */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {/* Botón hamburguesa: solo móvil/tablet */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Abrir menú de navegación"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition-all
              duration-200
              hover:border-slate-300
              hover:bg-slate-50
              active:scale-95
              lg:hidden
            "
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo móvil */}
          <div
            className="
              hidden
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-[#7F1D1D]
              via-[#EC4899]
              to-[#F59E0B]
              shadow-lg
              shadow-pink-500/20
              xs:flex
              lg:hidden
            "
          >
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>

          {/* Título */}
          <div className="min-w-0">
            <h1
              className="
                truncate
                text-sm
                font-black
                tracking-tight
                text-slate-950
                sm:text-base
                md:text-lg
              "
            >
              Centro de operaciones
            </h1>

            <p
              className="
                mt-0.5
                hidden
                truncate
                text-xs
                font-medium
                text-slate-500
                sm:block
              "
            >
              Gestión, atención y respuesta de eventos NoPay
            </p>
          </div>
        </div>

        {/* =====================================================
            DERECHA
        ====================================================== */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          {/* Notificaciones */}
          <button
            type="button"
            aria-label="Notificaciones"
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-sm
              transition-all
              duration-200
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-950
              active:scale-95
              sm:h-11
              sm:w-11
              sm:rounded-2xl
            "
          >
            <Bell className="h-[18px] w-[18px] sm:h-5 sm:w-5" />

            <span
              className="
                absolute
                right-[7px]
                top-[7px]
                h-2
                w-2
                rounded-full
                bg-pink-500
                ring-2
                ring-white
                sm:right-2
                sm:top-2
                sm:h-2.5
                sm:w-2.5
              "
            />
          </button>

          {/* Usuario */}
          <div
            className="
              hidden
              min-w-0
              max-w-[240px]
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-2
              text-right
              shadow-sm
              md:block
            "
          >
            <p className="truncate text-sm font-black text-slate-900">
              {nombreUsuario || "Administrador"}
            </p>

            <p className="truncate text-xs font-medium text-slate-500">
              {usuario?.roles || "Usuario administrativo"}
            </p>
          </div>

          {/* Salir */}
          <button
            type="button"
            onClick={cerrarSesion}
            aria-label="Cerrar sesión"
            className="
              flex
              h-10
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-950
              px-3
              text-sm
              font-bold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:bg-slate-800
              active:scale-[0.97]
              sm:h-11
              sm:rounded-2xl
              sm:px-4
            "
          >
            <LogOut className="h-4 w-4" />

            <span className="hidden sm:inline">
              Salir
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}