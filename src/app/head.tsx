// app/head.tsx
export default function RootHead() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/images/favIcon.png" />

      {/* OrganizaciÃ³n */}
      <script
        type="application/ld+json"
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
              "https://www.linkedin.com/company/nopaylegal",
            ],
          }),
        }}
      />
    </>
  )
}

