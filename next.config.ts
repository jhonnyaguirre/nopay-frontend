import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Desactiva errores de ESLint durante el build en Vercel
  },
  images: {
    domains: [
      'www.gob.ec',
      'procesosjudiciales.funcionjudicial.gob.ec',
      'www.emov.gob.ec',
      'store.positivessl.com',
      'www.pcisecuritystandards.org',
      'datafast.com.ec',
      'img.favpng.com',
      'graph.facebook.com',
      'lh3.googleusercontent.com',
      'upload.wikimedia.org',
    ],
  },
  // ✅ AÑADIDO: Proxy para evitar CORS al consultar el servicio de citaciones
  async rewrites() {
    return [
      {
        source: '/api/citaciones/:path*',
        destination: 'http://localhost:8085/ant/citaciones/:path*',
      },
    ];
  },
};

export default nextConfig;