import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

const ConnectedOrganizationsSection: React.FC = () => {
  const logos = [
    "ant-logo.png",
    "municipio-quito-logo.png",
    "municipio-guayaquil-logo.png",
  ];

  return (
    <section className="pt-0 pb-20 bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ShieldCheck className="h-5 w-5 text-white" />
          <span className="font-medium text-white text-sm tracking-wide">
            Conectado directamente con
          </span>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-14 mt-10">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              className="bg-white/10 p-4 rounded-xl shadow-md backdrop-blur-sm hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.4 }}
            >
              <Image
                src={`/logos/${logo}`}
                alt="Organismo oficial"
                width={120}
                height={80}
                className="h-16 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectedOrganizationsSection;
