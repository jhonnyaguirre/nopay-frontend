"use client";

import dynamic from "next/dynamic";

const PagoInner = dynamic(() => import("./PagoInner"), { ssr: false });

export default function Page() {
  return <PagoInner />;
}
