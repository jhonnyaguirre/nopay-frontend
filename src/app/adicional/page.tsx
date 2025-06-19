'use client';

import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Truck, PhoneCall } from 'lucide-react';

const LegalPage = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white overflow-hidden">
      <svg
        className="absolute right-0 top-0 w-[55%] h-full object-cover z-0"
        viewBox="0 0 600 800"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="shapeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
        <path
          d="M600,0 C520,120 580,240 480,320 C370,400 440,540 340,640 C240,740 360,840 200,900 C100,940 0,960 0,1080 L600,1080 Z"
          fill="url(#shapeGradient)"
        />
      </svg>

      <div className="relative z-20 max-w-4xl px-6 py-28 mx-auto flex flex-col items-start justify-center text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full shadow-lg">
            <div className="text-white">{icon}</div>
            <span className="text-lg font-semibold text-white/90">{title}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="prose prose-invert max-w-none text-white/90"
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
};

// Página de Políticas de Privacidad
export const PoliticasPrivacidad = () => (
  <LegalPage title="Políticas de Privacidad" icon={<ShieldCheck />}>
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

// Página de Términos y Condiciones
export const TerminosCondiciones = () => (
  <LegalPage title="Términos y Condiciones" icon={<FileText />}>
    <p>[Contenido de términos y condiciones aquí]</p>
  </LegalPage>
);

// Página de Políticas de Envío
export const PoliticasEnvioEntrega = () => (
  <LegalPage title="Políticas de Envío y Entrega" icon={<Truck />}>
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

// Página de Contacto
export const Contacto = () => (
  <LegalPage title="Contáctanos" icon={<PhoneCall />}>
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

// ✅ Exportaciones individuales necesarias para Next.js
export {
  LegalPage
};
