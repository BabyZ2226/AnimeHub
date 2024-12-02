import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  BookMarked, 
  Calendar, 
  Newspaper,
  Sparkles,
  Film
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Film, label: 'Home' },
  { path: '/browse', icon: Compass, label: 'Browse' },
  { path: '/lists', icon: BookMarked, label: 'Lists' },
  { path: '/seasonal', icon: Calendar, label: 'Seasonal' },
  { path: '/news', icon: Newspaper, label: 'News' },
  { path: '/entertainment', icon: Sparkles, label: 'Entertainment' }
];

interface SidebarProps {
  onCollapsedChange: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCollapsedChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Reduced sensor range: 10px for collapse, 100px for expand
      const shouldCollapse = e.clientX <= 10 ? false : e.clientX > 100;
      setIsCollapsed(shouldCollapse);
      onCollapsedChange(shouldCollapse);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [onCollapsedChange]);

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isCollapsed ? 80 : 256
      }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen bg-gray-900 shadow-xl z-50 pt-6"
    >
      <div className={`px-6 mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <Link to="/" className="flex items-center gap-3">
          <Film className="w-8 h-8 text-primary-500" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-bold overflow-hidden whitespace-nowrap"
              >
                AnimeHub
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <nav className="px-3">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-500/20 text-primary-500' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-400 text-center"
            >
              <p>AnimeHub v1.0.0</p>
              <p>© 2024 All rights reserved</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};