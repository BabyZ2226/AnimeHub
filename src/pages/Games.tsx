import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Puzzle, 
  Diamond, 
  Brain,
  ArrowRight
} from 'lucide-react';
import { PersonalityMatch } from '../components/games/PersonalityMatch';
import { Animedle } from '../components/games/Animedle';
import { GuessAnime } from '../components/games/GuessAnime';
import { Gacha } from '../components/games/Gacha';

type GameType = 'personality' | 'animedle' | 'guess' | 'gacha' | null;

const games = [
  {
    id: 'personality',
    name: 'Personality Match',
    description: 'Find your perfect anime based on your personality',
    icon: Brain,
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'animedle',
    name: 'Animedle',
    description: 'Daily anime guessing game',
    icon: Puzzle,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'guess',
    name: 'Guess Anime',
    description: 'Test your anime knowledge',
    icon: Gamepad2,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'gacha',
    name: 'Gacha',
    description: 'Collect your favorite anime cards',
    icon: Diamond,
    color: 'from-pink-500 to-rose-500'
  }
];

export const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case 'personality':
        return <PersonalityMatch onBack={() => setSelectedGame(null)} />;
      case 'animedle':
        return <Animedle onBack={() => setSelectedGame(null)} />;
      case 'guess':
        return <GuessAnime onBack={() => setSelectedGame(null)} />;
      case 'gacha':
        return <Gacha onBack={() => setSelectedGame(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-6 px-6 pb-12">
      <AnimatePresence mode="wait">
        {!selectedGame ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold mb-4"
              >
                Anime Games
              </motion.h1>
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-400"
              >
                Choose your game and start playing!
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games.map((game, index) => {
                const Icon = game.icon;
                return (
                  <motion.button
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedGame(game.id as GameType)}
                    className="relative group overflow-hidden rounded-xl bg-gray-800 p-6 text-left hover:ring-2 hover:ring-primary-500 transition-all"
                  >
                    <div className="relative z-10">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${game.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                      <p className="text-gray-400 mb-4">{game.description}</p>
                      <div className="flex items-center text-primary-500 group-hover:translate-x-2 transition-transform">
                        <span className="mr-2">Play Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            {renderGame()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};