'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// SVG balanza legal responsive
const JusticeBalance = ({
  size = 44,
  colorA = "#EC4899",
  colorB = "#7F1D1D",
  opacity = 1,
  className = ""
}) => (
  <svg
    width={size}
    height={size}
    fill="none"
    className={className}
    style={{ opacity }}
    viewBox="0 0 44 44"
  >
    <defs>
      <linearGradient id="balance-grad" x1="0" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor={colorA} />
        <stop offset="1" stopColor={colorB} />
      </linearGradient>
    </defs>
    <g stroke="url(#balance-grad)" strokeWidth="2" strokeLinecap="round">
      <path d="M22 40V12" />
      <path d="M12 20a10 3 0 1 0 20 0" />
      <path d="M14 21l-5 9a6 6 0 0 0 10 0l-5-9" />
      <path d="M30 21l5 9a6 6 0 0 1-10 0l5-9" />
      <circle cx="22" cy="10" r="2" fill="url(#balance-grad)" />
      <path d="M10 20L22 13l12 7" />
    </g>
  </svg>
);

type NoPayBackgroundProps = {
  className?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark' | 'auto';
};

const NoPayBackground: React.FC<NoPayBackgroundProps> = ({
  className = '',
  style = {},
  theme = 'auto',
}) => {
  const [mounted, setMounted] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [dimensions, setDimensions] = useState({ width: 1024, height: 768 });

  // Responsive breakpoints
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateDims = () => setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      updateDims();
      window.addEventListener('resize', updateDims);
      return () => window.removeEventListener('resize', updateDims);
    }
  }, []);

  // Detect theme
  useEffect(() => {
    if (theme === 'auto' && typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedTheme(mq.matches ? 'dark' : 'light');
      const listener = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    } else if (theme === 'dark' || theme === 'light') {
      setResolvedTheme(theme);
    }
  }, [theme]);

  // Calcula la cantidad y tamaño según el ancho
  const isMobile = dimensions.width <= 767;
  const isTablet = dimensions.width > 767 && dimensions.width <= 1023;
  const isDesktop = dimensions.width > 1023;
  const balancesCount = isMobile ? 3 : isTablet ? 5 : 7;

  // Genera balanzas distribuidas, sin saturar ni tapar contenido
  const balances = useMemo(() => {
    return Array.from({ length: balancesCount }).map((_, i) => ({
      size: isMobile
        ? Math.random() * 16 + 26 // 26-42px en mobile
        : isTablet
        ? Math.random() * 20 + 36 // 36-56px tablet
        : Math.random() * 26 + 44, // 44-70px desktop
      xPct: isMobile
        ? Math.random() * 80 + 10
        : isTablet
        ? Math.random() * 80 + 8
        : Math.random() * 85 + 7,
      yPct: isMobile
        ? Math.random() * 65 + 12
        : Math.random() * 80 + 10,
      floatX: Math.random() * 14 - 7,
      floatY: Math.random() * 18 - 9,
      duration: Math.random() * 10 + 13,
      delay: Math.random() * 5,
      rotate: Math.random() * 22 - 11,
      opacity: resolvedTheme === 'dark' ? 0.24 : 0.14
    }));
    // eslint-disable-next-line
  }, [balancesCount, isMobile, isTablet, isDesktop, resolvedTheme, dimensions.width]);

  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={style}
      aria-hidden
    >
      {/* Balanzas animadas */}
      {mounted && (
        <div className="absolute inset-0">
          {balances.map((b, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${b.xPct}%`,
                top: `${b.yPct}%`,
                zIndex: 0,
                width: b.size,
                height: b.size
              }}
              initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
              animate={{
                y: [0, b.floatY, 0],
                x: [0, b.floatX, 0],
                rotate: [0, b.rotate, 0],
                opacity: [0, b.opacity, b.opacity],
              }}
              transition={{
                delay: b.delay,
                duration: b.duration,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            >
              <JusticeBalance
                size={b.size}
                colorA={resolvedTheme === 'dark' ? "#fff" : "#EC4899"}
                colorB={resolvedTheme === 'dark' ? "#F59E0B" : "#7F1D1D"}
                opacity={b.opacity}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* SVGs orgánicos animados y con gradiente NoPay */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute -left-28 top-1/4 w-72 h-72 md:w-96 md:h-96 opacity-20"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 120, ease: 'linear' }}
            style={{ zIndex: 0 }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="url(#svgGrad1)"
                d="M45.2,-58.3C58.3,-48.1,68.5,-32.8,71.9,-15.8C75.3,1.2,71.9,20,60.6,35.2C49.3,50.4,30.2,62,8.9,68.3C-12.4,74.6,-35.9,75.6,-52.5,64.9C-69.1,54.2,-78.8,31.8,-78.9,9.9C-79,-12,-69.5,-33.6,-54.3,-44.6C-39.1,-55.6,-18.3,-56.1,0.5,-56.6C19.3,-57.1,38.6,-57.6,45.2,-58.3Z"
                transform="translate(100 100)"
              />
              <defs>
                <linearGradient id="svgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7F1D1D" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <motion.div
            className="absolute -right-28 bottom-1/4 w-72 h-72 md:w-96 md:h-96 opacity-20"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 100, ease: 'linear' }}
            style={{ zIndex: 0 }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="url(#svgGrad2)"
                d="M42.5,-54.1C55.1,-45.5,65.3,-32.6,68.4,-17.8C71.5,-3,67.5,13.7,58.3,28.3C49.1,42.9,34.7,55.4,17.4,63.9C0,72.4,-20.3,76.9,-36.5,69.1C-52.7,61.3,-64.7,41.2,-68.8,20.5C-72.9,-0.2,-69.1,-21.5,-57.7,-36.3C-46.3,-51.1,-27.3,-59.4,-8.8,-55.1C9.7,-50.8,19.4,-33.9,42.5,-54.1Z"
                transform="translate(100 100)"
              />
              <defs>
                <linearGradient id="svgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default NoPayBackground;
