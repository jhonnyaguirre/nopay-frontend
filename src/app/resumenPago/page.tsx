"use client";
import dynamic from "next/dynamic";

// IMPORTAR DINÁMICAMENTE Y DESACTIVAR SSR (obligatorio en Next 15 si usas useSearchParams)
const ResumenPagoInner = dynamic(() => import("./ResumenPagoInner"), { ssr: false });

export default function Page() {
  return <ResumenPagoInner />;
}
