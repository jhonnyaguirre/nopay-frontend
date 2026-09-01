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
  const cards = [
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
  ];

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6 lg:space-y-8">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        className="
          relative
          overflow-hidden
          rounded-[1.5rem]
          bg-gradient-to-br
          from-[#111827]
          via-[#7F1D1D]
          to-[#EC4899]
          px-5 py-6
          text-white
          shadow-xl
          shadow-pink-900/10
          sm:rounded-[1.75rem]
          sm:px-7
          sm:py-8
          lg:rounded-[2rem]
          lg:p-10
          lg:shadow-2xl
          lg:shadow-pink-900/20
        "
      >
        {/* Elementos decorativos */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-white/[0.06] blur-2xl sm:h-72 sm:w-72" />

        <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-pink-300/[0.07] blur-3xl sm:h-72 sm:w-72" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div
            className="
              mb-4
              inline-flex
              max-w-full
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-white/10
              px-3
              py-2
              text-xs
              font-medium
              text-white/80
              backdrop-blur-sm
              sm:px-4
              sm:text-sm
            "
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />

            <span className="truncate">Backoffice protegido</span>
          </div>

          {/* Título */}
          <h1
            className="
              max-w-2xl
              text-[1.75rem]
              font-black
              leading-[1.12]
              tracking-tight
              sm:text-3xl
              md:text-4xl
              lg:text-[2.75rem]
            "
          >
            Centro de control NoPay.
          </h1>

          {/* Descripción */}
          <p
            className="
              mt-4
              max-w-2xl
              text-[13px]
              leading-6
              text-white/75
              sm:text-sm
              sm:leading-7
              md:text-base
            "
          >
            Desde aquí gestionaremos los eventos generados por usuarios:
            multas, registro de marcas y permisos de salida del país. Este será
            el núcleo operativo para atención, observaciones, estados y
            notificaciones.
          </p>
        </div>
      </section>

      {/* =========================================================
          CARDS
      ========================================================= */}
      <section
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          sm:gap-5
          xl:grid-cols-4
        "
      >
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="
                group
                min-w-0
                rounded-[1.35rem]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:border-slate-300
                hover:shadow-lg
                sm:p-6
                lg:hover:-translate-y-0.5
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-rose-50
                  text-rose-600
                  transition
                  duration-300
                  group-hover:bg-rose-100
                  sm:mb-5
                  sm:h-12
                  sm:w-12
                "
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
                {item.title}
              </p>

              <p className="mt-1.5 break-words text-xl font-black tracking-tight text-slate-950 sm:mt-2 sm:text-2xl">
                {item.value}
              </p>

              <p className="mt-1.5 break-words text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm">
                {item.desc}
              </p>
            </article>
          );
        })}
      </section>

      {/* =========================================================
          SIGUIENTE MÓDULO
      ========================================================= */}
      <section
        className="
          overflow-hidden
          rounded-[1.5rem]
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          sm:rounded-[1.75rem]
          sm:p-6
          lg:rounded-[2rem]
        "
      >
        <div
          className="
            flex
            flex-col
            items-start
            gap-4
            sm:flex-row
            sm:gap-5
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-slate-950
              text-white
              shadow-sm
              sm:h-12
              sm:w-12
            "
          >
            <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              Siguiente módulo
            </h2>

            <p
              className="
                mt-2
                max-w-3xl
                break-words
                text-[13px]
                leading-6
                text-slate-600
                sm:text-sm
                sm:leading-7
              "
            >
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