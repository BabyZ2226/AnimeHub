import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EXPLORATION_TYPES } from '../data/journeyData';
import { EmotionalExplorer } from '../components/journey/EmotionalExplorer';
import { CulturalExplorer } from '../components/journey/CulturalExplorer';
import { OtakuDictionary } from '../components/journey/OtakuDictionary';
import { AnimeAI } from '../components/journey/AnimeAI';
import { BackgroundSpotlight } from '../components/ui/BackgroundSpotlight';

interface JourneyState {
  explorationType: string | null;
  mood: string | null;
}

export const Journey: React.FC = () => {
  const [state, setState] = useState<JourneyState>({
    explorationType: null,
    mood: null
  });

  const handleExplorationSelect = (type: string) => {
    setState(prev => ({ ...prev, explorationType: type }));
  };

  const handleMoodSelect = (mood: string) => {
    setState(prev => ({ ...prev, mood }));
  };

  const renderExplorationContent = () => {
    switch (state.explorationType) {
      case 'emotional':
        return <EmotionalExplorer mood={state.mood} onMoodSelect={handleMoodSelect} />;
      case 'cultural':
        return <CulturalExplorer />;
      case 'educational':
        return <OtakuDictionary />;
      case 'ai-assistant':
        return <AnimeAI />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPLORATION_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExplorationSelect(type.id)}
                  className="relative group overflow-hidden rounded-xl bg-gray-800 p-6 text-left hover:ring-2 hover:ring-primary-500 transition-all"
                >
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${type.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{type.name}</h3>
                    <p className="text-gray-400">{type.description}</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent pointer-events-none"
                  />
                </motion.button>
              );
            })}
          </div>
        );
    }
  };

  return (
    <BackgroundSpotlight className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Tu Viaje Anime
          </h1>
          <p className="text-xl text-gray-400">
            Explora el fascinante mundo del anime de formas únicas
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {state.explorationType ? (
            <motion.div
              key="exploration-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setState(prev => ({ ...prev, explorationType: null }))}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                Volver a Exploración
              </button>

              {renderExplorationContent()}
            </motion.div>
          ) : (
            <motion.div
              key="exploration-types"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderExplorationContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BackgroundSpotlight>
  );
};