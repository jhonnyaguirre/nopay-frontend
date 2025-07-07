'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { FileText, ShieldCheck, Truck, PhoneCall } from 'lucide-react';

interface LegalPageProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, icon, children }) => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const particleCount = isMobile ? 10 : isTablet ? 15 : 20;
  const particles = useMemo(
    () => Array.from({ length: particleCount }).map(() => ({
      size: Math.random() * (isMobile ? 5 : 10) + 5,
      xPct: Math.random() * 100,
      yPct: Math.random() * 100,
      xOffset: Math.random() * (isMobile ? 30 : 100) - (isMobile ? 15 : 50),
      yOffset: Math.random() * (isMobile ? 30 : 100) - (isMobile ? 15 : 50),
      duration: Math.random() * 20 + 10,
    })),
    [particleCount, isMobile]
  );

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] overflow-x-hidden">
      {/* Animated background particles */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-pink-100 opacity-30"
              style={{ width: p.size, height: p.size, left: `${p.xPct}%`, top: `${p.yPct}%` }}
              animate={{ x: [0, p.xOffset], y: [0, p.yOffset], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: p.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* Decorative SVG blobs for desktop */}
      {!isMobile && (
        <>
          <motion.div className="absolute -left-20 top-1/4 w-48 h-48 opacity-20" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 120, ease: 'linear' }}>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#7F1D1D" d="M45.2,-58.3C58.3,-48.1,68.5,-32.8,71.9,-15.8C75.3,1.2,71.9,20,60.6,35.2C49.3,50.4,30.2,62,8.9,68.3C-12.4,74.6,-35.9,75.6,-52.5,64.9C-69.1,54.2,-78.8,31.8,-78.9,9.9C-79,-12,-69.5,-33.6,-54.3,-44.6C-39.1,-55.6,-18.3,-56.1,0.5,-56.6C19.3,-57.1,38.6,-57.6,45.2,-58.3Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
          <motion.div className="absolute -right-20 bottom-1/4 w-48 h-48 opacity-20" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 100, ease: 'linear' }}>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EC4899" d="M42.5,-54.1C55.1,-45.5,65.3,-32.6,68.4,-17.8C71.5,-3,67.5,13.7,58.3,28.3C49.1,42.9,34.7,55.4,17.4,63.9C0,72.4,-20.3,76.9,-36.5,69.1C-52.7,61.3,-64.7,41.2,-68.8,20.5C-72.9,-0.2,-69.1,-21.5,-57.7,-36.3C-46.3,-51.1,-27.3,-59.4,-8.8,-55.1C9.7,-50.8,19.4,-33.9,42.5,-54.1Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
        </>
      )}

      <div className="relative z-20 max-w-4xl px-6 py-28 mx-auto flex flex-col items-start">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10">
          <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full shadow-lg">
            <div className="text-white">{icon}</div>
            <span className="text-lg font-semibold text-white/90">{title}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} style={!isMobile ? { scale } : {}} className="prose prose-invert max-w-none text-white/90">
          {children}
        </motion.div>
      </div>
    </main>
  );
};

export const PoliticasPrivacidad = () => (
  <LegalPage title="Políticas de Privacidad" icon={<ShieldCheck className="h-6 w-6 text-white" />}>
    <p>
      En <strong>NoPay Legal</strong>, nos comprometemos a proteger la
      privacidad y los datos personales de nuestros usuarios, de acuerdo con lo
      establecido en la Ley Orgánica de Protección de Datos Personales del
      Ecuador y demás normativa aplicable.
    </p>

    <h2>1. Responsable del Tratamiento</h2>
    <p>
      El responsable del tratamiento de los datos personales es NoPay Legal,
      plataforma digital operada por Softcorp, dedicada a la automatización de
      trámites legales y recursos administrativos.
    </p>

    <h2>2. Datos Recopilados</h2>
    <p>
      Podemos recopilar y procesar los siguientes datos: nombres, apellidos,
      cédula de identidad, correo electrónico, número telefónico, dirección,
      datos del vehículo, imágenes, y cualquier otra información ingresada
      voluntariamente por el usuario para el uso de nuestros servicios.
    </p>

    <h2>3. Finalidad del Tratamiento</h2>
    <p>
      Los datos personales serán utilizados exclusivamente para la prestación de
      servicios relacionados con la impugnación de multas, validación de
      identidad, contacto legal, análisis jurídico automatizado, emisión de
      comprobantes, y cumplimiento de obligaciones legales.
    </p>

    <h2>4. Consentimiento</h2>
    <p>
      El usuario otorga su consentimiento libre, informado e inequívoco para el
      tratamiento de sus datos al aceptar los términos y condiciones de la
      plataforma y utilizar nuestros servicios.
    </p>

    <h2>5. Derechos del Usuario</h2>
    <p>
      El usuario tiene derecho a acceder, rectificar, eliminar, oponerse,
      limitar y portar sus datos personales en cualquier momento. Para ejercer
      estos derechos, puede comunicarse a soporte@nopay.ec.
    </p>

    <h2>6. Seguridad y Confidencialidad</h2>
    <p>
      NoPay Legal implementa medidas técnicas, organizativas y legales para
      garantizar la seguridad de los datos personales. Los datos no serán
      vendidos ni compartidos con terceros sin consentimiento expreso del
      usuario, salvo obligación legal.
    </p>

    <h2>7. Transferencias Internacionales</h2>
    <p>
      En caso de requerir servicios en la nube u otros servicios con
      procesamiento fuera del Ecuador, se garantizará que dichos proveedores
      cumplan con estándares adecuados de protección de datos.
    </p>

    <h2>8. Conservación de Datos</h2>
    <p>
      Los datos serán conservados durante el tiempo necesario para cumplir con
      la finalidad del tratamiento y mientras existan obligaciones legales o
      contractuales aplicables.
    </p>

    <h2>9. Cambios a esta Política</h2>
    <p>
      Nos reservamos el derecho de actualizar esta política en cualquier
      momento. Se notificará a los usuarios sobre cambios relevantes mediante la
      plataforma.
    </p>

    <p className="mt-6 font-semibold">Última actualización: agosto 2025</p>
  </LegalPage>
);

export const TerminosCondiciones = () => (
  <LegalPage title="Términos y Condiciones" icon={<FileText className="h-6 w-6 text-white" />}>
    <p>
      Por favor, lea y acepte los términos antes de continuar con el uso de la
      plataforma NoPay Legal. A continuación se detallan las condiciones de uso,
      limitaciones de responsabilidad y demás disposiciones legales.
    </p>
  </LegalPage>
);

export const PoliticasEnvioEntrega = () => (
  <LegalPage title="Políticas de Envío y Entrega" icon={<Truck className="h-6 w-6 text-white" />}>
    <p>
      En caso de aplicar servicios que involucren documentación física o
      notificaciones formales, el envío se realizará mediante mensajería
      certificada dentro de los tiempos establecidos por el cliente y el
      proveedor legal asignado.
    </p>
    <p>
      Para servicios digitales, se notificará vía correo electrónico o a través
      del panel de usuario en nuestra plataforma.
    </p>
  </LegalPage>
);

export const Contacto = () => (
  <LegalPage title="Contáctanos" icon={<PhoneCall className="h-6 w-6 text-white" />}>
    <p>
      Si tienes dudas, sugerencias o necesitas ayuda personalizada, contáctanos:
    </p>
    <ul className="list-disc ml-6">
      <li>
        📞 Teléfono:{' '}
        <a
          href="https://wa.me/593979937186?text=Hola,%20quiero%20asistencia%20con%20un%20tema%20legal."
          className="underline text-green-200"
        >
          +593 97 9937186
        </a>
      </li>
      <li>
        📧 Correo:{' '}
        <a href="mailto:soporte@nopay.ec" className="underline text-blue-200">
          soporte@nopay.ec
        </a>
      </li>
    </ul>
    <p>
      Estamos aquí para asistirte con todo el respaldo de los abogados expertos
      de NoPay.
    </p>
  </LegalPage>
);

export { LegalPage };
