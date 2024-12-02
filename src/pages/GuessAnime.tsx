import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { Trophy, Star, Timer, HelpCircle, Share2, Sparkles, Settings, TrendingUp, Flame, Compass, Hash } from 'lucide-react';
import { fetchPopularAnime, searchAnime, fetchTrendingAnime, fetchSeasonalAnime } from '../services/api';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { BackgroundSpotlight } from '../components/ui/BackgroundSpotlight';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Gradient } from '../components/ui/Gradient';
import { AnimatedText } from '../components/ui/AnimatedText';

interface GameState {
  score: number;
  currentRound: number;
  timeLeft: number;
  hintsUsed: number;
  gameOver: boolean;
  selectedAnswer: string | null;
  showHint: boolean;
}

interface GameSettings {
  category: 'all' | 'popular' | 'trending' | 'seasonal';
  rounds: number;
}

const CATEGORIES = [
  { id: 'all', name: 'All Anime', icon: Compass, description: 'Random selection from all anime' },
  { id: 'popular', name: 'Popular', icon: Flame, description: 'Most popular anime of all time' },
  { id: 'trending', name: 'Trending', icon: TrendingUp, description: 'Currently trending anime' },
  { id: 'seasonal', name: 'Seasonal', icon: Star, description: 'Current season anime' }
] as const;

const ROUND_OPTIONS = [5, 10, 15, 20];
const TIME_PER_ROUND = 20;
const POINTS_PER_CORRECT = 100;
const TIME_BONUS_MULTIPLIER = 5;
const HINT_PENALTY = 50;

export const GuessAnime: React.FC = () => {
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState<GameSettings>({
    category: 'all',
    rounds: 10,
  });

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentRound: 0,
    timeLeft: TIME_PER_ROUND,
    hintsUsed: 0,
    gameOver: false,
    selectedAnswer: null,
    showHint: false,
  });

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);

  const fetchAnimeByCategory = async () => {
    switch (settings.category) {
      case 'popular':
        return fetchPopularAnime();
      case 'trending':
        return fetchTrendingAnime();
      case 'seasonal':
        const currentSeason = ['winter', 'spring', 'summer', 'fall'][Math.floor((new Date().getMonth() / 12 * 4)) % 4];
        return fetchSeasonalAnime(currentSeason, new Date().getFullYear());
      case 'all':
      default:
        // For 'all' category, fetch a random page of anime
        const randomPage = Math.floor(Math.random() * 50) + 1;
        const response = await searchAnime('', {}, randomPage);
        return response.data;
    }
  };

  const { data: animes, isLoading, refetch } = useQuery(
    ['guessAnimeGame', settings.category],
    fetchAnimeByCategory,
    { enabled: false }
  );

  useEffect(() => {
    if (!showSettings) {
      refetch();
    }
  }, [showSettings, refetch]);

  useEffect(() => {
    if (animes && animes.length > 0) {
      const currentAnime = animes[gameState.currentRound];
      const otherAnimes = animes.filter((a: any) => a.id !== currentAnime.id);
      const randomOptions = otherAnimes
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((anime: any) => ({
          id: anime.id,
          title: anime.attributes.canonicalTitle,
          correct: false,
        }));

      const correctOption = {
        id: currentAnime.id,
        title: currentAnime.attributes.canonicalTitle,
        correct: true,
      };

      setShuffledOptions(
        [...randomOptions, correctOption].sort(() => 0.5 - Math.random())
      );
    }
  }, [animes, gameState.currentRound]);

  useEffect(() => {
    if (!gameState.gameOver && !gameState.selectedAnswer && gameState.timeLeft > 0) {
      const newTimer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
      setTimer(newTimer);

      return () => clearInterval(newTimer);
    }
  }, [gameState.timeLeft, gameState.gameOver, gameState.selectedAnswer]);

  useEffect(() => {
    if (gameState.timeLeft === 0) {
      handleAnswer(null);
    }
  }, [gameState.timeLeft]);

  const startNewGame = () => {
    setGameState({
      score: 0,
      currentRound: 0,
      timeLeft: TIME_PER_ROUND,
      hintsUsed: 0,
      gameOver: false,
      selectedAnswer: null,
      showHint: false,
    });
    setShowSettings(true);
  };

  const handleStartGame = () => {
    setShowSettings(false);
    setGameState({
      score: 0,
      currentRound: 0,
      timeLeft: TIME_PER_ROUND,
      hintsUsed: 0,
      gameOver: false,
      selectedAnswer: null,
      showHint: false,
    });
  };

  const handleAnswer = (answerId: string | null) => {
    if (timer) clearInterval(timer);

    const isCorrect = shuffledOptions.find(opt => opt.id === answerId)?.correct;
    const timeBonus = gameState.timeLeft * TIME_BONUS_MULTIPLIER;
    const points = isCorrect ? POINTS_PER_CORRECT + timeBonus : 0;

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      selectedAnswer: answerId,
    }));

    setTimeout(() => {
      if (gameState.currentRound + 1 >= settings.rounds) {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          currentRound: prev.currentRound + 1,
          timeLeft: TIME_PER_ROUND,
          selectedAnswer: null,
          showHint: false,
        }));
      }
    }, 2000);
  };

  const useHint = () => {
    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score - HINT_PENALTY),
      hintsUsed: prev.hintsUsed + 1,
      showHint: true,
    }));
  };

  const shareScore = async () => {
    const text = `¡Acabo de conseguir ${gameState.score} puntos en Guess the Anime (${settings.category})! ¿Puedes superarlo?`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mi puntuación en Guess the Anime',
          text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert('¡Puntuación copiada al portapapeles!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (showSettings) {
    return (
      <BackgroundSpotlight className="min-h-screen pt-20 px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Settings className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Game Settings</h1>
            <p className="text-gray-400">Customize your game experience</p>
          </motion.div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSettings(prev => ({ ...prev, category: category.id }))}
                      className={`p-4 rounded-lg text-left transition-all ${
                        settings.category === category.id
                          ? 'bg-primary-500/20 border-2 border-primary-500'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <h3 className="font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-400">{category.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Number of Questions</h2>
              <div className="flex flex-wrap gap-4">
                {ROUND_OPTIONS.map((rounds) => (
                  <motion.button
                    key={rounds}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSettings(prev => ({ ...prev, rounds }))}
                    className={`px-6 py-3 rounded-lg transition-all ${
                      settings.rounds === rounds
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {rounds}
                  </motion.button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleStartGame}
              variant="primary"
              size="lg"
              className="w-full"
              leftIcon={<Star className="w-5 h-5" />}
            >
              Start Game
            </Button>
          </div>
        </div>
      </BackgroundSpotlight>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!animes || animes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Error loading game data. Please try again.</p>
      </div>
    );
  }

  const currentAnime = animes[gameState.currentRound];
  const progress = ((gameState.currentRound + 1) / settings.rounds) * 100;

  const getScoreMessage = (score: number) => {
    const maxScore = settings.rounds * (POINTS_PER_CORRECT + TIME_PER_ROUND * TIME_BONUS_MULTIPLIER);
    const percentage = (score / maxScore) * 100;
    
    if (percentage <= 30) return "¡Puedes mejorar! ¿Listo para otro intento?";
    if (percentage <= 70) return "¡Buen trabajo! Eres un verdadero fan casual.";
    return "¡Increíble! ¡Eres un maestro del anime!";
  };

  return (
    <BackgroundSpotlight className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {!gameState.gameOver ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold">{gameState.score}</span>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Timer className="w-5 h-5 text-primary-500" />
                  <span className="font-bold">{gameState.timeLeft}s</span>
                </div>
              </div>
              <div className="text-gray-400">
                Ronda {gameState.currentRound + 1} de {settings.rounds}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
              />
            </div>

            {/* Anime Image */}
            <Card className="aspect-video relative overflow-hidden">
              <img
                src={currentAnime.attributes.posterImage.large}
                alt="Guess the anime"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              
              {gameState.showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-0 left-0 right-0 p-6 bg-black/80"
                >
                  <p className="text-gray-300">{currentAnime.attributes.synopsis}</p>
                </motion.div>
              )}
            </Card>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {shuffledOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !gameState.selectedAnswer && handleAnswer(option.id)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    gameState.selectedAnswer
                      ? option.correct
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : option.id === gameState.selectedAnswer
                        ? 'bg-red-500/20 border-2 border-red-500'
                        : 'bg-gray-800 opacity-50'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  disabled={!!gameState.selectedAnswer}
                >
                  {option.title}
                </motion.button>
              ))}
            </div>

            {/* Hint Button */}
            {!gameState.showHint && !gameState.selectedAnswer && (
              <div className="flex justify-center">
                <Button
                  onClick={useHint}
                  variant="ghost"
                  leftIcon={<HelpCircle className="w-5 h-5" />}
                >
                  Usar pista (-{HINT_PENALTY} puntos)
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto" />
            
            <div>
              <AnimatedText
                text="¡Juego Terminado!"
                className="text-4xl font-bold mb-4"
              />
              <Gradient variant="primary" className="text-6xl font-bold mb-4">
                {gameState.score}
              </Gradient>
              <p className="text-xl text-gray-300">
                {getScoreMessage(gameState.score)}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{gameState.hintsUsed}</div>
                  <div className="text-sm text-gray-400">Pistas usadas</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {Math.round((gameState.score / (settings.rounds * POINTS_PER_CORRECT)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-400">Precisión</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={startNewGame}
                  variant="primary"
                  size="lg"
                  leftIcon={<Star className="w-5 h-5" />}
                >
                  Jugar de nuevo
                </Button>
                <Button
                  onClick={shareScore}
                  variant="outline"
                  size="lg"
                  leftIcon={<Share2 className="w-5 h-5" />}
                >
                  Compartir
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </BackgroundSpotlight>
  );
};