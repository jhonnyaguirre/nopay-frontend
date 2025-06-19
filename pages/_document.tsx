// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicon SVG principal */}
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        {/* Fallback para Safari y navegadores antiguos */}
        <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
