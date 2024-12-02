import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  delay = 0
}) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-wrap", className)}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};