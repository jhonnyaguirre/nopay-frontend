"use client";

import React, { useEffect, useState } from "react";
import AdminGuard from "./AdminGuard";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const abrirMenuMovil = () => {
    setMenuMovilAbierto(true);
  };

  const cerrarMenuMovil = () => {
    setMenuMovilAbierto(false);
  };

  /*
   * Evitamos que la página de fondo pueda desplazarse
   * cuando el menú lateral móvil está abierto.
   */
  useEffect(() => {
    if (!menuMovilAbierto) {
      document.body.style.overflow = "";
      return;
    }

    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [menuMovilAbierto]);

  /*
   * Si se cambia de tamaño de móvil/tablet a desktop
   * cerramos automáticamente cualquier drawer abierto.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuMovilAbierto(false);
      }
    };

    mediaQuery.addEventListener("change", handleDesktop);

    return () => {
      mediaQuery.removeEventListener("change", handleDesktop);
    };
  }, []);

  /*
   * Permitir cerrar el menú con ESC.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuMovilAbierto(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <AdminGuard>
      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-slate-950">
        <div className="flex min-h-screen w-full">
          {/* Sidebar desktop + drawer móvil */}
          <AdminSidebar
            mobileOpen={menuMovilAbierto}
            onMobileClose={cerrarMenuMovil}
          />

          {/* Área principal */}
          <div className="min-w-0 flex-1">
            <AdminHeader onOpenMobileMenu={abrirMenuMovil} />

            <section
              className="
                mx-auto
                w-full
                min-w-0
                max-w-[1800px]
                px-4
                py-5
                sm:px-5
                sm:py-6
                md:px-6
                lg:px-8
                lg:py-7
                2xl:px-10
              "
            >
              {children}
            </section>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}