import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  hover = true
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        "backdrop-blur-md bg-white/10 dark:bg-black/10",
        "border border-white/20 dark:border-white/10",
        "rounded-xl shadow-xl",
        hover && "transition-all duration-300 hover:shadow-primary-500/20",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};