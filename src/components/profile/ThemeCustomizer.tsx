import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import type { UserProfile } from '../../types/user';

interface ThemeCustomizerProps {
  currentTheme: UserProfile['theme'];
  onClose: () => void;
}

const PRESET_THEMES = [
  {
    name: 'Default Red',
    primary: '#ef4444',
    background: '#111827',
    accent: '#3b82f6'
  },
  {
    name: 'Ocean Blue',
    primary: '#3b82f6',
    background: '#0f172a',
    accent: '#06b6d4'
  },
  {
    name: 'Forest Green',
    primary: '#22c55e',
    background: '#064e3b',
    accent: '#fbbf24'
  },
  {
    name: 'Purple Night',
    primary: '#a855f7',
    background: '#1e1b4b',
    accent: '#ec4899'
  }
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ currentTheme, onClose }) => {
  const { updateTheme } = useUserStore();
  const [theme, setTheme] = React.useState(currentTheme);

  const handleColorChange = (key: keyof UserProfile['theme'], value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateTheme(theme);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-xl p-6 w-96 max-w-full mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Customize Theme</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <input
              type="color"
              value={theme.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <input
              type="color"
              value={theme.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <input
              type="color"
              value={theme.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-4">Preset Themes</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_THEMES.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setTheme(preset)}
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  style={{ backgroundColor: preset.background }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span>{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};