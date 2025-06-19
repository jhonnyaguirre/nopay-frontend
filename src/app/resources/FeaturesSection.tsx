import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, ShieldCheck, Zap } from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

interface LegalTechnologySectionProps {
  title?: string;
  highlightedText?: string;
  subtitle?: string;
  features?: FeatureItem[];
  className?: string;
}

export class LegalTechnologySection extends React.Component<LegalTechnologySectionProps> {
  static defaultProps = {
    title: "Tecnología legal",
    highlightedText: "sin precedentes",
    subtitle: "Nuestra plataforma combina inteligencia artificial con expertise legal para ofrecerte la mejor defensa",
    features: [
      {
        icon: <Gavel className="h-10 w-10" />,
        title: "Precisión Legal Avanzada",
        description: "Algoritmos entrenados con más de 50,000 fallos judiciales ecuatorianos",
        delay: 0.2
      },
      {
        icon: <ShieldCheck className="h-10 w-10" />,
        title: "95.3% de Éxito",
        description: "Tasa más alta de apelaciones aprobadas en el mercado",
        delay: 0.4
      },
      {
        icon: <Zap className="h-10 w-10" />,
        title: "Resolución Express",
        description: "48% de casos resueltos en menos de 24 horas",
        delay: 0.6
      }
    ],
    className: ""
  };

  render() {
    const { title, highlightedText, subtitle, features, className } = this.props;

    return (
      <section className={`py-24 text-white relative ${className}`}>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {title}{" "}
              <span className="bg-gradient-to-r from-white to-[#EC4899] bg-clip-text text-transparent">
                {highlightedText}
              </span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features?.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-2 shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
              >
                <div className="text-white mb-6 p-3 bg-white/10 rounded-full w-fit mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-white">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}
