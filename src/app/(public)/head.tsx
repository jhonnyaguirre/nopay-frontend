// src/app/head.tsx  – ES SOLO SERVER COMPONENT  (sin "use client")
export default function RootHead() {
  return (
    <>
      {/* ─────  TITLE & DESCRIPTION  ───── */}
      <title>NoPay – Plataforma Legal Digital en Ecuador</title>
      <meta
        name="description"
        content="Impugna multas, matricula tu vehículo, gestiona trámites migratorios y más. Todo 100 % en línea con asesoría legal experta."
      />

      {/* ─────  CANONICAL  ───── */}
      <link rel="canonical" href="https://www.nopaylegal.com/" />

      {/* ─────  OPEN GRAPH  ───── */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="es_EC" />
      <meta property="og:site_name" content="NoPay" />
      <meta property="og:title" content="NoPay – Plataforma Legal Digital en Ecuador" />
      <meta
        property="og:description"
        content="Automatiza tus trámites legales: multas, matrículas, migración y más. Tecnología legal a tu alcance."
      />
      <meta property="og:url" content="https://www.nopaylegal.com/" />
      <meta
        property="og:image"
        content="https://www.nopaylegal.com/images/seo/home-og.jpg"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Ilustración de NoPay LegalTech" />

      {/* ─────  TWITTER CARD  ───── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="NoPay – LegalTech ecuatoriano" />
      <meta
        name="twitter:description"
        content="Resuelve tus trámites legales sin filas. Impugnaciones de multas, matrículas, migración y más."
      />
      <meta
        name="twitter:image"
        content="https://www.nopaylegal.com/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75"
      />

      {/* ─────  JSON-LD (Organization + WebSite + SearchAction + FAQ)  ───── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NoPay",
              url: "https://www.nopaylegal.com",
              logo: "https://www.nopaylegal.com/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
              sameAs: [
                "https://www.facebook.com/nopaylegal",
                "https://www.instagram.com/nopaylegal",
                "https://www.linkedin.com/company/nopaylegal"
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+593-99-000-0000",
                  contactType: "customer support",
                  areaServed: "EC",
                  availableLanguage: ["Spanish"]
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "NoPay",
              url: "https://www.nopaylegal.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.nopaylegal.com/buscar?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "¿Qué trámites puedo hacer con NoPay?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Impugnación de multas, matriculación vehicular, trámites migratorios y otros procesos legales en Ecuador."
                  }
                },
                {
                  "@type": "Question",
                  name: "¿Cómo funciona la impugnación de multas?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Subes tu citación, nuestro sistema genera la apelación y la presenta ante la autoridad competente."
                  }
                }
              ]
            }
          ])
        }}
      />
    </>
  );
}
