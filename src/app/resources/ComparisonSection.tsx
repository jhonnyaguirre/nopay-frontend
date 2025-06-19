import { motion } from "framer-motion";
import { Zap, Gavel } from "lucide-react";
import React from "react";

const ComparisonSection: React.FC = () => {
  return (
    <section className="pt-0 pb-24 bg-gradient-to-b from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white">
      <div className="container mx-auto px-6">
        <motion.h3
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-white text-[#7F1D1D] px-6 py-2 rounded-full shadow-lg">
            Vs. Trámite Tradicional
          </span>
        </motion.h3>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Con NoPay */}
          <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <h4 className="text-2xl font-bold mb-5 text-white flex items-center gap-2">
              <Zap className="h-6 w-6 text-[#FBBF24]" />
              Con NoPay
            </h4>
            <ul className="space-y-4 text-white/90 text-lg font-medium">
              <li className="flex items-start gap-2">✓ 48 horas promedio</li>
              <li className="flex items-start gap-2">✓ 95% de éxito</li>
              <li className="flex items-start gap-2">✓ Sin papeleo</li>
            </ul>
          </motion.div>

          {/* Método Tradicional */}
          <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <h4 className="text-2xl font-bold mb-5 text-white flex items-center gap-2">
              <Gavel className="h-6 w-6 text-white/80" />
              Método Tradicional
            </h4>
            <ul className="space-y-4 text-white/70 text-lg">
              <li className="flex items-start gap-2">✗ 2-6 meses</li>
              <li className="flex items-start gap-2">✗ 30% de éxito</li>
              <li className="flex items-start gap-2">✗ Trámites presenciales</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
