import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface BackgroundSpotlightProps {
  className?: string;
  children: React.ReactNode;
}

export const BackgroundSpotlight: React.FC<BackgroundSpotlightProps> = ({
  className,
  children
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        animate={{
          opacity: [0.5, 0.3, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 bg-gradient-spotlight opacity-30"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};