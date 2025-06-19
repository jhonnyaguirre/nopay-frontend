// ✅ page.tsx (envuelve en Suspense)
"use client";
import { Suspense } from "react";
import ResultadoPagoInner from "./ResultadoPagoInner";
 

export default function ResultadoPagoPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando resultado del pago...</div>}>
      <ResultadoPagoInner />
    </Suspense>
  );
}
