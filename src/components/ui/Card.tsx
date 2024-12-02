import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hover = true,
  animate = true
}) => {
  const Component = animate ? motion.div : 'div';

  return (
    <Component
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        "bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};