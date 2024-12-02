import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 text-gray-800" />
      ) : (
        <Sun className="w-6 h-6 text-white" />
      )}
    </motion.button>
  );
};