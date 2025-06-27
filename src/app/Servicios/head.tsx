// app/Servicios/head.tsx
export default function ServiciosHead() {
  return (
    <>
      {/* ─────────────────────  TITLE & META  ───────────────────── */}
      <title>Servicios Legales Digitales en Ecuador | NoPay</title>
      <meta
        name="description"
        content="Automatiza trámites legales: impugnación de multas, matrícula vehicular y más. 100 % en línea con NoPay."
      />

      {/* Canonical */}
      <link rel="canonical" href="https://www.nopaylegal.com/Servicios" />

      {/* ─────────────────────  OPEN GRAPH  ───────────────────── */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Servicios Legales Digitales | NoPay Ecuador" />
      <meta
        property="og:description"
        content="Conoce nuestros servicios: impugnación de multas, trámites migratorios, matriculación y más."
      />
      <meta property="og:url" content="https://www.nopaylegal.com/Servicios" />
      <meta
        property="og:image"
        content="https://www.nopaylegal.com/images/seo/servicios.jpg"
      />

      {/* ─────────────────────  TWITTER CARD  ───────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Servicios Legales Digitales | NoPay" />
      <meta
        name="twitter:description"
        content="Automatiza tus trámites legales con NoPay. Rápido, seguro y 100 % en línea."
      />
      <meta
        name="twitter:image"
        content="https://www.nopaylegal.com/images/seo/servicios.jpg"
      />

      {/* ─────────────────────  JSON-LD (Organization + Service + Breadcrumb + FAQ)  ───────────────────── */}
      <script
        type="application/ld+json"
        // Organization
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NoPay",
            url: "https://www.nopaylegal.com",
            logo: "https://www.nopaylegal.com/images/logo.png",
            sameAs: [
              "https://www.facebook.com/nopaylegal",
              "https://www.instagram.com/nopaylegal",
              "https://www.linkedin.com/company/nopaylegal"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        // Service
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Servicios Legales Digitales",
            provider: { "@type": "Organization", name: "NoPay", url: "https://www.nopaylegal.com" },
            areaServed: "Ecuador",
            description:
              "Automatiza trámites legales: impugnación de multas, matrícula vehicular, trámites migratorios y más.",
            serviceType: [
              "Impugnación de multas",
              "Matriculación vehicular",
              "Trámites migratorios"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        // BreadcrumbList
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.nopaylegal.com" },
              { "@type": "ListItem", position: 2, name: "Servicios", item: "https://www.nopaylegal.com/Servicios" }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        // FAQPage
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Cómo impugno una multa de tránsito?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Solo sube tu citación, completa el formulario y nuestro sistema generará la apelación legal automáticamente."
                }
              },
              {
                "@type": "Question",
                name: "¿Puedo matricular mi vehículo sin filas?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí. Con NoPay reservas tu cita y enviamos toda la documentación al ente correspondiente."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}
