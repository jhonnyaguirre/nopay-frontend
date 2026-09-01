"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ChevronRight,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

type AdminSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

const menu = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Casos",
    href: "/admin/casos",
    icon: BriefcaseBusiness,
  },
  {
    label: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
];

export default function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  /*
   * Si Next cambia la ruta por cualquier motivo,
   * cerramos el drawer móvil.
   */
  useEffect(() => {
    onMobileClose();
  }, [pathname]);

  const esRutaActiva = (href: string) => {
    /*
     * Dashboard debe coincidir exactamente.
     *
     * Para los otros módulos permitimos subrutas:
     * /admin/casos
     * /admin/casos/123
     * /admin/casos/detalle/123
     */
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const MenuItems = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <nav
      className="
        flex-1
        space-y-1.5
        overflow-y-auto
        overscroll-contain
        px-3
        py-4
        sm:px-4
        sm:py-5
      "
    >
      {menu.map((item) => {
        const Icon = item.icon;
        const active = esRutaActiva(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (mobile) {
                onMobileClose();
              }
            }}
            className={[
              `
                group
                relative
                flex
                min-h-[48px]
                items-center
                gap-3
                overflow-hidden
                rounded-2xl
                px-4
                py-3
                text-sm
                font-bold
                transition-all
                duration-200
              `,
              active
                ? `
                  bg-gradient-to-r
                  from-[#7F1D1D]
                  via-[#EC4899]
                  to-[#F59E0B]
                  text-white
                  shadow-lg
                  shadow-pink-500/20
                `
                : `
                  text-slate-600
                  hover:bg-slate-100
                  hover:text-slate-950
                `,
            ].join(" ")}
          >
            {/* Icono */}
            <div
              className={[
                `
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  transition-all
                  duration-200
                `,
                active
                  ? "bg-white/15"
                  : "bg-slate-100 group-hover:bg-white",
              ].join(" ")}
            >
              <Icon
                className={[
                  "h-[18px] w-[18px] shrink-0",
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-700",
                ].join(" ")}
              />
            </div>

            {/* Texto */}
            <span className="min-w-0 flex-1 truncate">
              {item.label}
            </span>

            {/* Indicador */}
            <ChevronRight
              className={[
                `
                  h-4
                  w-4
                  shrink-0
                  transition-all
                  duration-200
                `,
                active
                  ? "translate-x-0 text-white/80"
                  : `
                    -translate-x-1
                    text-slate-300
                    opacity-0
                    group-hover:translate-x-0
                    group-hover:opacity-100
                  `,
              ].join(" ")}
            />
          </Link>
        );
      })}
    </nav>
  );

  const Brand = ({
    showClose = false,
  }: {
    showClose?: boolean;
  }) => (
    <div
      className="
        flex
        min-h-[88px]
        items-center
        justify-between
        gap-3
        border-b
        border-slate-200
        px-5
        py-5
        sm:px-6
        sm:py-6
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-[#7F1D1D]
            via-[#EC4899]
            to-[#F59E0B]
            shadow-lg
            shadow-pink-500/20
            sm:h-12
            sm:w-12
          "
        >
          <ShieldCheck className="h-6 w-6 text-white sm:h-7 sm:w-7" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-black leading-none text-slate-950 sm:text-lg">
            NoPay Admin
          </p>

          <p className="mt-1.5 truncate text-[11px] font-semibold text-slate-500 sm:text-xs">
            Legal Ops Platform
          </p>
        </div>
      </div>

      {showClose && (
        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Cerrar menú"
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
            bg-slate-50
            text-slate-600
            transition-all
            duration-200
            hover:bg-slate-100
            hover:text-slate-950
            active:scale-95
          "
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  const Footer = () => (
    <div className="border-t border-slate-200 p-3 sm:p-4">
      <div
        className="
          relative
          overflow-hidden
          rounded-[1.4rem]
          bg-slate-950
          p-4
          text-white
          sm:rounded-3xl
          sm:p-5
        "
      >
        {/* Decoración */}
        <div
          className="
            pointer-events-none
            absolute
            -right-8
            -top-8
            h-24
            w-24
            rounded-full
            bg-pink-500/10
            blur-2xl
          "
        />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-white/10
              "
            >
              <ShieldCheck className="h-4 w-4 text-pink-300" />
            </div>

            <p className="text-sm font-black">
              Operación segura
            </p>
          </div>

          <p className="text-xs leading-5 text-white/55">
            Acceso privado para atención de casos, observaciones y respuestas
            administrativas.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* =========================================================
          SIDEBAR DESKTOP
      ========================================================== */}
      <aside
        className="
          hidden
          min-h-screen
          w-72
          shrink-0
          border-r
          border-slate-200
          bg-white
          lg:block
        "
      >
        <div className="sticky top-0 flex h-screen flex-col">
          <Brand />

          <MenuItems />

          <Footer />
        </div>
      </aside>

      {/* =========================================================
          OVERLAY MÓVIL / TABLET
      ========================================================== */}
      <div
        aria-hidden="true"
        onClick={onMobileClose}
        className={[
          `
            fixed
            inset-0
            z-50
            bg-slate-950/45
            backdrop-blur-[2px]
            transition-opacity
            duration-300
            lg:hidden
          `,
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* =========================================================
          DRAWER MÓVIL / TABLET
      ========================================================== */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menú de administración"
        className={[
          `
            fixed
            bottom-0
            left-0
            top-0
            z-[60]
            flex
            w-[86vw]
            max-w-[320px]
            flex-col
            border-r
            border-slate-200
            bg-white
            shadow-2xl
            transition-transform
            duration-300
            ease-out
            lg:hidden
          `,
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        <Brand showClose />

        <MenuItems mobile />

        <Footer />
      </aside>
    </>
  );
}