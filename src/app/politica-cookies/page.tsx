export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20">

        <h1 className="text-5xl font-black text-slate-900">
          Política de Cookies
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          Última actualización: Junio 2026
        </p>

        <div className="mt-12 space-y-8 text-slate-700">

          <section>
            <h2 className="mb-3 text-2xl font-bold">
              ¿Qué son las cookies?
            </h2>

            <p>
              Las cookies son pequeños archivos almacenados en tu
              dispositivo que permiten mejorar la experiencia de
              navegación, recordar preferencias y analizar el uso
              de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">
              Cookies necesarias
            </h2>

            <p>
              Son indispensables para el funcionamiento correcto
              de NoPay y no pueden desactivarse.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">
              Cookies analíticas
            </h2>

            <p>
              Permiten obtener estadísticas anónimas sobre el uso
              de la plataforma con el fin de mejorar nuestros
              servicios.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">
              Cookies de marketing
            </h2>

            <p>
              Pueden utilizarse para medir campañas publicitarias
              y mostrar contenido relevante para los usuarios.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">
              Gestión del consentimiento
            </h2>

            <p>
              El usuario puede aceptar, rechazar o configurar sus
              preferencias de cookies en cualquier momento.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}