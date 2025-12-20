import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={hoverEffect ? { 
        y: -3, 
        shadow: "0 6px 16px rgba(0,0,0,0.06)",
        transition: { duration: 0.15 }
      } : {}}
      onClick={onClick}
      className={`
        bg-white border border-[#E5E5E5] rounded-xl p-8 
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        ${hoverEffect ? 'cursor-pointer active:scale-[0.99] transition-transform duration-100' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
