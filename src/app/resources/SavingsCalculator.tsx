'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Calculator, ArrowRight } from 'lucide-react';

export default function SavingsCalculator() {
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
    }).format(amount);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-5xl mx-auto bg-white/10 p-10 md:p-14 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              <span className="bg-gradient-to-r from-white to-[#FDE68A] bg-clip-text text-transparent">
                Calculadora de Ahorro Legal
              </span>
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Descubre cuánto podrías ahorrar con nuestra defensa inteligente. Mueve la barra y sorpréndete.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Slider e input */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white/80 font-semibold text-lg">
                  Valor actual de tu multa
                </label>
                <span className="text-white font-bold text-xl">
                  {formatCurrency(fineAmount)}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={fineAmount}
                onChange={handleFineChange}
                className="w-full h-3 appearance-none rounded-full bg-white/30 outline-none focus:ring-2 focus:ring-[#EC4899] transition-all duration-300
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-5
    [&::-webkit-slider-thumb]:h-5
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-[#EC4899]
    [&::-webkit-slider-thumb]:shadow-md
    [&::-webkit-slider-thumb]:transition-all
    [&::-webkit-slider-thumb]:hover:scale-110
    [&::-moz-range-thumb]:bg-white"
              />

              <div className="flex justify-between text-sm text-white/60">
                <span>$100</span>
                <span>$5,000</span>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-white/80 hover:text-white underline flex items-center gap-1"
                >
                  <Calculator className="h-4 w-4" />
                  {showDetails ? 'Ocultar detalles de cálculo' : 'Ver detalles de cálculo'}
                </button>
              </div>
            </div>

            {/* Resultado */}
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl border border-white/30 shadow-xl">
              <h4 className="font-bold mb-2 text-white text-xl flex items-center gap-2">
                <PiggyBank className="w-6 h-6 text-[#FDE68A]" />
                Tu ahorro estimado:
              </h4>
              <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-[#EC4899] via-[#F59E0B] to-[#D97706] bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-tight">
                {formatCurrency(probableSavings)}
              </div>

              <p className="text-sm text-white/80 mt-2">
                Basado en nuestros datos reales con 92% de éxito promedio.
              </p>

              <button className="mt-6 w-full bg-white text-[#7F1D1D] hover:bg-[#EC4899] hover:text-white py-3 px-6 rounded-xl font-bold shadow-md transition-all">
                Iniciar mi apelación <ArrowRight className="inline-block ml-1" />
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}