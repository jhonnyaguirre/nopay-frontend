'use client';

import Image from "next/image";
import { Scale, ChevronRight, PhoneCall, Mail, FileText, Lock, MessageCircle, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/about", label: "Sobre Nosotros" },
    { href: "/how-it-works", label: "Cómo Funciona" },
    { href: "/success-cases", label: "Casos de Éxito" },
    { href: "/pricing", label: "Precios" },
    { href: "/blog", label: "Blog Legal" },
  ];

  const legalLinks = [
    { href: "/terminos-condiciones", label: "Términos de Servicio" },
    { href: "/politicas-privacidad", label: "Política de Privacidad" },
    { href: "/politicas-envio-entrega", label: "Política de Envío" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".15"
            className="fill-[#EC4899]"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-[#7F1D1D]" />
              <div className="text-xl font-bold text-[#7F1D1D]">NoPay</div>
            </div>
            <p className="text-sm text-gray-600">
              Plataforma líder en apelaciones automatizadas con tecnología de punta y expertise legal.
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-6 text-[#EC4899] border-b border-[#EC4899]/30 pb-2">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-600 hover:text-[#EC4899] transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-4 w-4 text-[#EC4899]/50 group-hover:text-[#EC4899] transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#EC4899] border-b border-[#EC4899]/30 pb-2">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-600 hover:text-[#EC4899] transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-4 w-4 text-[#EC4899]/50 group-hover:text-[#EC4899] transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#EC4899] border-b border-[#EC4899]/30 pb-2">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-600">

              <li className="flex items-start gap-2">
                <PhoneCall className="h-5 w-5 text-green-600 mt-1" />
                <a
                  href="https://wa.me/593979937186?text=Hola,%20quiero%20asistencia%20con%20un%20tema%20legal."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-700"
                >
                  WhatsApp: +593 97 9937186
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-blue-600 mt-1" />
                <a href="mailto:info@nopay.ec" className="hover:text-blue-700">
                  softcorpecu@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-yellow-600 mt-1" />
                <span>Av. Ordoñes Lasso, Cuenca, Ecuador</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500">
            © {currentYear} NoPay by Softcorp. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;