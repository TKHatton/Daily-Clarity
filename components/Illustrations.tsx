import React from 'react';
import { motion } from 'framer-motion';

const defaultTransition = { duration: 2, repeat: Infinity, ease: "easeInOut" };

export const HeroIllustration = () => (
  <motion.svg 
    width="400" height="300" viewBox="0 0 400 300" fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    {/* Abstract Background Shapes */}
    <motion.circle 
      cx="200" cy="150" r="100" fill="#FAF8F5" 
      animate={{ scale: [1, 1.05, 1] }}
      transition={defaultTransition}
    />
    <path d="M300 220C300 242.091 282.091 260 260 260H140C117.909 260 100 242.091 100 220V120C100 97.9086 117.909 80 140 80H260C282.091 80 300 97.9086 300 120V220Z" fill="white" stroke="#E5E5E5" strokeWidth="1.5"/>
    
    {/* "Clutter to Clarity" Lines */}
    <motion.path 
      d="M140 120L170 140M140 140L170 120M140 160C140 160 150 150 160 160C170 170 180 160 180 160" 
      stroke="#E8956B" strokeWidth="2" strokeLinecap="round"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={defaultTransition}
    />
    
    <motion.path 
      d="M220 120H260M220 140H260M220 160H260" 
      stroke="#7AB8B8" strokeWidth="2" strokeLinecap="round"
      animate={{ x: [0, 5, 0] }}
      transition={defaultTransition}
    />
    
    {/* Central Focus Element */}
    <circle cx="200" cy="200" r="30" fill="#E8956B" fillOpacity="0.1" />
    <circle cx="200" cy="200" r="15" fill="#E8956B" />
  </motion.svg>
);

export const EmptyHistoryIllustration = () => (
  <div className="flex flex-col items-center">
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
      <rect x="50" y="40" width="100" height="120" rx="8" stroke="#E5E5E5" strokeWidth="1.5" />
      <path d="M70 70H130M70 90H130M70 110H100" stroke="#E5E5E5" strokeWidth="1.5" strokeLinecap="round" />
      <motion.circle 
        cx="150" cy="150" r="30" fill="#FAF8F5" stroke="#7AB8B8" strokeWidth="1.5" strokeDasharray="4 4"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <path d="M145 150L150 155L155 145" stroke="#7AB8B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export const ToolConceptIllustration = ({ type }: { type: string }) => {
  switch (type) {
    case 'mind-dump':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="40" fill="#FAF8F5" />
          <motion.path 
            d="M40 40L50 50M70 40L60 50M40 80L50 70" 
            stroke="#E8956B" strokeWidth="2" strokeLinecap="round"
            animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={defaultTransition}
          />
          <path d="M50 90H70" stroke="#3A3A3A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'find-words':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <motion.path 
            d="M30 60C30 43.4315 43.4315 30 60 30C76.5685 30 90 43.4315 90 60" 
            stroke="#7AB8B8" strokeWidth="1.5" strokeLinecap="round"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <rect x="40" y="55" width="40" height="20" rx="4" fill="white" stroke="#3A3A3A" strokeWidth="1.5" />
          <path d="M50 65H70" stroke="#7AB8B8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};
