'use client';

import { motion } from "framer-motion";
import React from "react";

interface CaseStudy {
  amount: string;
  description: string;
  delay: number;
}

const caseStudies: CaseStudy[] = [
  {
    amount: "$12,450",
    description: "Multa anulada en Guayaquil",
    delay: 0.2,
  },
  {
    amount: "$8,720",
    description: "Apelación exitosa en Quito",
    delay: 0.4,
  },
  {
    amount: "$15,300",
    description: "Recurso aceptado en Cuenca",
    delay: 0.6,
  },
];

const CaseStudiesSection: React.FC = () => {
  return (
    <section className="pb-24 bg-gradient-to-b from-transparent via-[#EC4899]/10 to-[#F59E0B]/10 text-white">
      <div className="container mx-auto px-6">
        <motion.h3
          className="text-4xl md:text-5xl font-bold text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-white text-[#7F1D1D] px-5 py-2 rounded-full shadow-md">
            Éxitos Reales
          </span>
          <span className="block mt-4 text-white/90 text-xl md:text-2xl">
            Resultados Comprobados
          </span>
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {caseStudies.map((caseStudy, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: caseStudy.delay }}
            >
              <div className="text-4xl font-extrabold text-white mb-4">
                {caseStudy.amount}
              </div>
              <p className="text-white/90 text-lg mb-4">
                {caseStudy.description}
              </p>
              <div className="h-1 bg-gradient-to-r from-[#EC4899] to-[#F59E0B] w-2/3 rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
