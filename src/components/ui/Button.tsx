import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300";
  
  const variants = {
    default: "bg-gray-800 hover:bg-gray-700 text-white",
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-primary-500/20",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500/10",
    ghost: "hover:bg-gray-800/50 text-gray-300 hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {leftIcon}
          {children}
          {rightIcon}
        </div>
      )}
    </motion.button>
  );
};