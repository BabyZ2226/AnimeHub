import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn("relative", sizes[size], className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0"
      >
        <div className="w-full h-full border-2 border-primary-500/30 border-t-primary-500 rounded-full" />
      </motion.div>
      <motion.div
        animate={{ scale: [0.8, 1, 0.8] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-2/3 h-2/3 bg-primary-500 rounded-full opacity-20 blur-sm" />
      </motion.div>
    </div>
  );
};