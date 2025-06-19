import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button'

interface CTAButtonProps {
  text: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

interface CTASectionProps {
  title?: string;
  highlightedText?: string;
  description?: string;
  button?: CTAButtonProps;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  highlightGradientFrom?: string;
  highlightGradientTo?: string;
  floatingCircles?: {
    count?: number;
    colors?: string[];
    sizes?: string[];
    positions?: { top: string; left: string }[];
  };
}

export class CTASection extends React.Component<CTASectionProps> {
  static defaultProps = {
    title: "¿Listo para",
    highlightedText: "revolucionar",
    description: "Únete a miles de usuarios que ya han resuelto sus multas con nuestra plataforma.",
    button: {
      text: "Comenzar ahora",
      variant: "secondary",
      size: "xl",
      icon: <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
    },
    gradientFrom: "from-[#7F1D1D]",
    gradientTo: "to-[#F59E0B]",
    highlightGradientFrom: "from-white",
    highlightGradientTo: "to-[#EC4899]",
    floatingCircles: {
      count: 2,
      colors: ["bg-white/5", "bg-[#EC4899]/10"],
      sizes: ["w-64 h-64", "w-80 h-80"],
      positions: [
        { top: "top-1/4", left: "left-1/4" },
        { top: "top-1/3", left: "right-1/4" }
      ]
    },
    className: ""
  };

  renderFloatingCircles() {
    const { floatingCircles } = this.props;
    const circles = [];

    for (let i = 0; i < (floatingCircles?.count || 0); i++) {
      circles.push(
        <div
          key={i}
          className={`absolute ${floatingCircles?.positions?.[i]?.top || ''} ${floatingCircles?.positions?.[i]?.left || ''} ${floatingCircles?.sizes?.[i] || ''} ${floatingCircles?.colors?.[i] || ''} rounded-full filter blur-3xl animate-float${i + 1}`}
        ></div>
      );
    }

    return circles;
  }

  render() {
    const {
      title,
      highlightedText,
      description,
      button,
      className,
      gradientFrom,
      gradientTo,
      highlightGradientFrom,
      highlightGradientTo
    } = this.props;

    return (
      <section
      className={`pt-16 pb-24 bg-gradient-to-r from-[#7F1D1D] via-[#EC4899] to-[#F59E0B] text-white relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        {this.renderFloatingCircles()}
      </div>
    
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {title}{' '}
          <span className={`bg-gradient-to-r ${highlightGradientFrom} ${highlightGradientTo} bg-clip-text text-transparent`}>
            {highlightedText}
          </span>{' '}
          tu defensa legal?
        </motion.h2>
    
        <motion.p
          className="text-xl text-white/90 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description}
        </motion.p>
    
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size={button?.size}
            className="group hover:scale-105 transition-transform bg-gradient-to-r from-[#EC4899] to-[#F59E0B] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-none"
          >
            {button?.text} {button?.icon}
          </Button>
        </motion.div>
      </div>
    </section>
    

    );
  }
}