"use client";

import React from "react";
import {
  Bell,
  BriefcaseBusiness,
  Clock3,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#111827] via-[#7F1D1D] to-[#EC4899] p-8 text-white shadow-2xl shadow-pink-900/20">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/75">
            <ShieldCheck className="h-4 w-4" />
            Backoffice protegido
          </div>

          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            Centro de control NoPay.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Desde aquí gestionaremos los eventos generados por usuarios:
            multas, registro de marcas y permisos de salida del país. Este será
            el núcleo operativo para atención, observaciones, estados y
            notificaciones.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Casos totales",
            value: "Próximo",
            icon: BriefcaseBusiness,
            desc: "Bandeja centralizada",
          },
          {
            title: "Pendientes",
            value: "Próximo",
            icon: Clock3,
            desc: "Sin respuesta inicial",
          },
          {
            title: "Usuarios internos",
            value: "Seguro",
            icon: Users,
            desc: "Admin y abogados",
          },
          {
            title: "Notificaciones",
            value: "Email",
            icon: Bell,
            desc: "Respuesta por caso",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Icon className="h-6 w-6" />
              </div>

              <p className="text-sm font-semibold text-slate-500">
                {item.title}
              </p>

              <p className="mt-2 text-2xl font-black">{item.value}</p>

              <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <LayoutDashboard className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-black">Siguiente módulo</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              El siguiente paso será construir la bandeja central de casos:
              pestañas por tipo de servicio, ordenamiento por fecha, detalle del
              caso, observaciones internas/visibles al cliente y envío de email
              por cada caso.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}