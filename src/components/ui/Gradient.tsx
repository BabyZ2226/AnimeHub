import React from 'react';
import { cn } from '../../utils/cn';

interface GradientProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  animate?: boolean;
}

export const Gradient: React.FC<GradientProps> = ({
  children,
  className,
  variant = 'primary',
  animate = true
}) => {
  const variants = {
    primary: "from-primary-500 via-rose-500 to-amber-500",
    secondary: "from-blue-500 via-purple-500 to-pink-500",
    accent: "from-green-500 via-emerald-500 to-teal-500"
  };

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r",
        variants[variant],
        animate && "animate-gradient bg-[length:200%_auto]",
        className
      )}
    >
      {children}
    </span>
  );
};