'use client'

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
 
import type { HTMLMotionProps } from "framer-motion";

// Tus variantes de botón
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-[#0A1D3E] to-[#1E3A8A] text-white hover:from-[#0A1D3E]/90 hover:to-[#1E3A8A]/90 shadow-lg hover:shadow-xl',
        secondary: 'bg-gradient-to-r from-[#E63946] to-[#EF4444] text-white hover:from-[#E63946]/90 hover:to-[#EF4444]/90 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-[#0A1D3E] text-[#0A1D3E] hover:bg-[#0A1D3E]/5 hover:border-[#0A1D3E]/80',
        ghost: 'text-[#0A1D3E] hover:bg-[#0A1D3E]/5 hover:text-[#0A1D3E]/90'
      },
      size: {
        default: 'h-10 py-2 px-6 text-sm',
        sm: 'h-9 px-4 text-sm rounded-lg',
        lg: 'h-11 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-lg rounded-xl'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

// 👇 Aquí corregimos los tipos para motion.button
interface ButtonProps extends HTMLMotionProps<'button'>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, children, ...props }, ref) => {
    return (
      <motion.button
         className={`${buttonVariants({ variant, size, className })}`}

        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}  
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Procesando...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
