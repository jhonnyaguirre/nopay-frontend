'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Zap, Gavel, Check, X, PiggyBank, Calculator, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LegalCalculatorSection() {
  const [fineAmount, setFineAmount] = useState(2000);
  const [probableSavings, setProbableSavings] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const successRate = 0.92;
  const averageReduction = 0.85;
  const serviceFee = 0.15;

  useEffect(() => {
    const potentialReduction = fineAmount * averageReduction;
    const fee = potentialReduction * serviceFee;
    const netSavings = potentialReduction - fee;
    setProbableSavings(Math.round(netSavings * successRate));
  }, [fineAmount]);

  const handleFineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFineAmount(parseInt(e.target.value));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="relative py-16 md:py-24 min-h-screen bg-gradient-to-br from-[#FFD76F] via-[#F46C1D] to-[#D82465] text-white overflow-hidden">


      <svg
        className="absolute right-0 top-0 w-0 sm:w-1/3 md:w-[45%] lg:w-[55%] h-full object-cover z-0 pointer-events-none"
        viewBox="0 0 600 800"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >

        <defs>
          <linearGradient id="shapeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7F1D1D" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <path
          d="M600,0 C520,120 580,240 480,320 C370,400 440,540 340,640 C240,740 360,840 200,900 C100,940 0,960 0,1080 L600,1080 Z"
          fill="url(#shapeGradient)"
        />
      </svg>

 
      <div className="absolute bottom-0 left-0 w-full h-16 sm:h-20 md:h-24 bg-white rounded-t-[100%] z-10" />


 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {/* Calculator Section */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/20 px-6 py-2 rounded-full mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-medium">Calculadora de Ahorro</span>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-white to-[#FDE68A] bg-clip-text text-transparent">
                Descubre tu ahorro potencial
              </span>
            </motion.h2>

            <motion.p
              className="text-lg text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Nuestra tecnología analiza tu caso y estima cuánto podrías ahorrar
            </motion.p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 font-medium mb-3">
                    Valor de tu multa
                    <span className="float-right font-bold">{formatCurrency(fineAmount)}</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={fineAmount}
                    onChange={handleFineChange}
                    className="w-full h-2 bg-white/30 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                  />
                  <div className="flex justify-between text-sm text-white/60 mt-1">
                    <span>$100</span>
                    <span>$5,000</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                >
                  {showDetails ? (
                    <>
                      <X className="h-4 w-4" />
                      Ocultar detalles
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4" />
                      Ver detalles de cálculo
                    </>
                  )}
                </button>

                {showDetails && (
                  <motion.div
                    className="bg-white/5 p-4 rounded-lg border border-white/10 text-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white/90 mb-2">Nuestro cálculo considera:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-white/80">
                        <Check className="h-4 w-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                        <span>85% de reducción promedio en multas</span>
                      </li>
                      <li className="flex items-start gap-2 text-white/80">
                        <Check className="h-4 w-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                        <span>15% de honorarios por servicio exitoso</span>
                      </li>
                      <li className="flex items-start gap-2 text-white/80">
                        <Check className="h-4 w-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                        <span>92% de tasa de éxito en apelaciones</span>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Result Section */}
              <div className="bg-gradient-to-br from-[#7F1D1D]/50 to-[#EC4899]/50 p-6 rounded-xl border border-white/10 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <PiggyBank className="h-6 w-6 text-[#FDE68A]" />
                  <h3 className="text-xl font-bold">Tu ahorro estimado</h3>
                </div>

                <div className="text-4xl md:text-5xl font-extrabold mb-4">
                  {formatCurrency(probableSavings)}
                </div>

                <div className="h-px bg-white/20 my-4"></div>

                <p className="text-white/80 text-sm mb-6">
                  Basado en nuestro histórico de casos con 92% de éxito
                </p>

                <Link href="/Servicios" passHref>
                  <motion.button
                    className="w-full bg-white text-[#7F1D1D] hover:bg-[#EC4899] hover:text-white py-3 px-6 rounded-lg font-bold shadow-md transition-all flex justify-center items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Iniciar mi apelación <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Case Studies */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.h3
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-white text-[#7F1D1D] px-6 py-2 rounded-full shadow-lg">
                Casos de éxito
              </span>
            </motion.h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              Resultados reales obtenidos por nuestros clientes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { amount: 12450, description: 'Multa anulada en Guayaquil', delay: 0.2 },
              { amount: 8720, description: 'Apelación exitosa en Quito', delay: 0.4 },
              { amount: 15300, description: 'Recurso aceptado en Cuenca', delay: 0.6 },
            ].map((caseStudy, i) => (
              <motion.div
                key={i}
                className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-[#EC4899]/50 transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: caseStudy.delay }}
              >
                <div className="text-3xl font-extrabold text-white mb-3">
                  {formatCurrency(caseStudy.amount)}
                </div>
                <p className="text-white/90 mb-4">{caseStudy.description}</p>
                <div className="h-1 bg-gradient-to-r from-[#EC4899] to-[#F59E0B] w-1/2 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Section */}
        <motion.div
          className="mt-24 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.h3
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-white text-[#7F1D1D] px-6 py-2 rounded-full shadow-lg">
                Comparación
              </span>
            </motion.h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              Descubre la diferencia entre nuestro servicio y el método tradicional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white/5 p-6 rounded-xl border border-[#F59E0B]/30"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-[#F59E0B]" />
                <h4 className="text-xl font-bold">Con nuestro servicio</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/90">
                  <Check className="h-5 w-5 text-[#F59E0B] flex-shrink-0" />
                  <span>Resolución en 48 horas promedio</span>
                </li>
                <li className="flex items-start gap-2 text-white/90">
                  <Check className="h-5 w-5 text-[#F59E0B] flex-shrink-0" />
                  <span>95% de éxito en apelaciones</span>
                </li>
                <li className="flex items-start gap-2 text-white/90">
                  <Check className="h-5 w-5 text-[#F59E0B] flex-shrink-0" />
                  <span>Proceso 100% digital sin papeleo</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white/5 p-6 rounded-xl border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="h-6 w-6 text-white/70" />
                <h4 className="text-xl font-bold">Método tradicional</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/70">
                  <X className="h-5 w-5 text-red-300 flex-shrink-0" />
                  <span>2-6 meses de espera</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <X className="h-5 w-5 text-red-300 flex-shrink-0" />
                  <span>Solo 30% de éxito</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <X className="h-5 w-5 text-red-300 flex-shrink-0" />
                  <span>Trámites presenciales y burocráticos</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ShieldCheck className="h-5 w-5 text-white" />
            <span className="font-medium">Conectado con instituciones oficiales</span>
          </motion.div>

          <div className="relative z-20 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 max-w-6xl mx-auto">
            {[
              {
                logo: 'https://www.gob.ec/sites/default/files/styles/medium/public/2018-09/logo-ant%5B1%5D.png',
                alt: 'Agencia Nacional de Tránsito',
                link: 'https://www.gob.ec/ant'
              },
              {
                logo: 'https://procesosjudiciales.funcionjudicial.gob.ec/assets/logos/logoCJ_negro.png',
                alt: 'Función Judicial',
                link: 'https://www.funcionjudicial.gob.ec/'
              },
              {
                logo: 'https://www.emov.gob.ec/wp-content/uploads/2022/01/CABECERA_EMOV_2019-02-1.png',
                alt: 'EMOV EP',
                link: 'https://www.emov.gob.ec/'
              }
            ].map((partner, i) => (
              <motion.a
                key={i}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 p-2 sm:p-3 rounded-lg hover:bg-white/10 transition-all w-32 sm:w-36 md:w-40 flex justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <Image
                  src={partner.logo}
                  alt={partner.alt}
                  width={120}
                  height={60}
                  className="h-10 sm:h-12 object-contain"
                />
              </motion.a>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}