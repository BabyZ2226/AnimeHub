import React, { useEffect } from 'react';
import { useThemeStore } from '../../store/useThemeStore';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }, [theme]);

  return <>{children}</>;
};