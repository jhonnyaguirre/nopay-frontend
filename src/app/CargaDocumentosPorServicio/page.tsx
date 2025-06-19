'use client';

import CargaDocumentosPorServicio from "./CargaDocumentosPorServicio";



export default function Page() {
  // Aquí podrías definir valores fijos de prueba, o usar contextos para pasar props
  const secuencialUsuario = 1; // ejemplo
  const secuencialServicio = 2; // ejemplo

  return (
    <CargaDocumentosPorServicio
      secuencialUsuario={secuencialUsuario}
      secuencialServicio={secuencialServicio}
      onClose={() => {
        // Acción al cerrar, como redirigir o navegar
        console.log('cerrado');
      }}
    />
  );
}