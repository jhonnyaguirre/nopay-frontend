// app/components/BackgroundWithSideSvg.tsx
"use client";

import React, { ReactNode } from "react";

interface BackgroundWithSideSvgProps {
  /** Contenido principal (encima del fondo + SVG) */
  children: ReactNode;
  /** Altura mínima (por defecto: "min-h-screen") */
  minHeightClass?: string;
  /** ¿Mostrar curva blanca al final? */
  showBottomCurve?: boolean;
}

export default function BackgroundWithSideSvg({
  children,
  minHeightClass = "min-h-screen",
  showBottomCurve = true,
}: BackgroundWithSideSvgProps) {
  return (
    <section
      className={`
        relative
        ${minHeightClass}
        bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]
        text-white
        overflow-hidden
      `}
    >
      {/** 1) SVG degradado a la derecha */}
      <svg
        className="
          absolute
          right-0 top-0
          w-0 sm:w-1/3 md:w-[45%] lg:w-[55%]
          h-full
          object-cover
          z-0
          pointer-events-none
        "
        viewBox="0 0 600 1080"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="shapeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7F1D1D" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <path
          d={`
            M600,0 
            C520,120 580,240 480,320 
            C370,400 440,540 340,640 
            C240,740 360,840 200,900 
            C100,940 0,960 0,1080 
            L600,1080 
            Z
          `}
          fill="url(#shapeGradient)"
        />
      </svg>

      {/** 2) Curva blanca inferior (solo si showBottomCurve = true) */}
      {showBottomCurve && (
        <div
          className="
            absolute
            bottom-0 left-0
            w-full
            h-16 sm:h-20 md:h-24
            bg-white
            rounded-t-[100%]
            z-10
          "
        />
      )}

      {/** 3) Contenedor principal (z-index sobre la curva) */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        {children}
      </div>
    </section>
  );
}
