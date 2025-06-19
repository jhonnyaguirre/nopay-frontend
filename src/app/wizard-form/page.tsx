// /app/wizard-form/page.tsx
"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const ImpugnacionWizard = dynamic(() => import("./ImpugnacionWizard"));

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Cargando formulario...</div>}>
      <ImpugnacionWizard />
    </Suspense>
  );
}
