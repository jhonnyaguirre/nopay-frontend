import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItem {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  position: 'left' | 'right';
}

interface ProcessTimelineSectionProps {
  title?: string;
  highlightedText?: string;
  subtitle?: string;
  items?: TimelineItem[];
  className?: string;
  topBgColor?: string;
  titleColor?: string;
  textColor?: string;
}

export class ProcessTimelineSection extends React.Component<ProcessTimelineSectionProps> {
  static defaultProps = {
    title: "El",
    highlightedText: "Proceso Legal",
    subtitle: "Desde el registro hasta la resolución, te acompañamos en cada paso",
    topBgColor: "bg-[#0A1D3E]",
    titleColor: "text-[#0A1D3E]",
    textColor: "text-[#0A1D3E]/90",
    items: [
      {
        step: "1",
        title: "Crea tu Cuenta",
        description: "Regístrate en segundos y accede a tu panel personal",
        icon: <AccountIcon />,
        color: "from-[#9C27B0] to-[#E91E63]",
        position: "left"
      },
      {
        step: "2",
        title: "Carga Inteligente",
        description: "Selecciona el servicio y danos el contexto",
        icon: <UploadIcon />,
        color: "from-[#E63946] to-[#FF6B6B]",
        position: "right"
      },
      {
        step: "3",
        title: "Análisis con IA",
        description: "Nuestros algoritmos detectan errores procesales automáticamente",
        icon: <AnalysisIcon />,
        color: "from-[#4E6BFF] to-[#6DD5FA]",
        position: "left"
      },
      {
        step: "4",
        title: "Revisión Expertos",
        description: "Abogados especializados validan cada caso personalmente",
        icon: <ReviewIcon />,
        color: "from-[#D4AF37] to-[#FFEE58]",
        position: "right"
      },
      {
        step: "5",
        title: "Resultado Garantizado",
        description: "Recibe la resolución en tiempo récord con nuestro seguimiento",
        icon: <ResultIcon />,
        color: "from-[#0A1D3E] to-[#1E88E5]",
        position: "left"
      }
    ],
    className: ""
  };

  renderConnectorLines() {
    return (
      <div className="hidden md:block">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 h-16 w-1 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent -translate-x-1/2"
            style={{ top: `${20 + i * 20}%` }}
            initial={{ height: 0 }}
            whileInView={{ height: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.3 }}
          />
        ))}
      </div>
    );
  }

  renderTimelineItem(item: TimelineItem, index: number) {
    return (
      <motion.div
        key={index}
        className={`relative mb-16 sm:mb-20 md:mb-32 w-full md:w-1/2 ${
          item.position === 'left' 
            ? 'md:pr-8 lg:pr-16 md:mr-auto pl-10 sm:pl-16 md:pl-0' 
            : 'md:pl-8 lg:pl-16 md:ml-auto pl-10 sm:pl-16 md:pr-0'
        } group`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
      >
        <div className={`bg-gradient-to-r ${item.color} p-0.5 sm:p-1 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl`}>
          <div className="bg-white backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`bg-gradient-to-r ${item.color} p-2 sm:p-3 rounded-full text-white shadow-md`}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0A1D3E]">
                  {item.title}
                </h3>
                <p className="text-[#0A1D3E]/80 mt-1 sm:mt-2 text-sm sm:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute top-4 sm:top-6 ${
          item.position === 'left' 
            ? '-right-3 sm:-right-4' 
            : '-left-3 sm:-left-4'
        } w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${
          item.color
        } flex items-center justify-center text-white font-bold shadow-lg text-xs sm:text-sm`}>
          {item.step}
        </div>
      </motion.div>
    );
  }

  render() {
    const {
      title,
      highlightedText,
      subtitle,
      items,
      className,
      topBgColor,
      titleColor,
      textColor
    } = this.props;

    return (
      <section className={`py-16 sm:py-24 md:py-32 relative backdrop-blur-sm bg-white ${className}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${titleColor}`}>
              {title}{" "}
              <span className="bg-gradient-to-r from-[#EC4899] to-[#F59E0B] bg-clip-text text-transparent">
                {highlightedText}
              </span>
            </h2>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${textColor} max-w-3xl mx-auto`}>
              {subtitle}
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            <div className="absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-[#9C27B0] via-[#E63946] via-[#D4AF37] to-[#0A1D3E] -translate-x-1/2 hidden md:block" />

            {items?.map((item, index) => this.renderTimelineItem(item, index))}

            {this.renderConnectorLines()}
          </div>
        </div>
      </section>
    );
  }
}

// Icon components (mantenidos igual)
function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  )
}

function AnalysisIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <line x1="7" y1="10" x2="17" y2="10"></line>
      <line x1="7" y1="14" x2="13" y2="14"></line>
      <line x1="7" y1="18" x2="11" y2="18"></line>
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  )
}

function ReviewIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  )
}

function ResultIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}