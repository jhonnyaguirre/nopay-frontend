"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-slate-200 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] shadow-lg shadow-pink-500/20">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>

            <div>
              <p className="text-lg font-black leading-none text-slate-950">
                NoPay Admin
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Legal Ops Platform
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                  active
                    ? "bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white shadow-lg shadow-pink-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-5 w-5",
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-700",
                  ].join(" ")}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-sm font-black">Operación segura</p>
            <p className="mt-2 text-xs leading-5 text-white/55">
              Acceso privado para atención de casos, observaciones y respuestas
              administrativas.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}