import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Trophy, 
  Film, 
  BarChart2, 
  Palette, 
  List, 
  Eye, 
  Clock, 
  BookmarkCheck,
  Settings,
  Bell,
  Shield,
  History,
  Heart
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { ThemeCustomizer } from '../components/profile/ThemeCustomizer';
import { UserStats } from '../components/profile/UserStats';
import { AchievementsList } from '../components/profile/AchievementsList';
import { UserReviews } from '../components/profile/UserReviews';
import { WatchHistory } from '../components/profile/WatchHistory';
import { Button } from '../components/ui/Button';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'history', label: 'Watch History', icon: History },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!profile) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
            <div className="space-y-8">
              <UserStats stats={profile.stats} />
              <UserReviews reviews={profile.reviews.slice(0, 3)} />
            </div>
            <AchievementsList achievements={profile.achievements} />
          </div>
        );
      case 'history':
        return <WatchHistory history={profile.watchHistory || []} />;
      case 'reviews':
        return <UserReviews reviews={profile.reviews} />;
      case 'achievements':
        return <AchievementsList achievements={profile.achievements} />;
      case 'favorites':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {profile.favorites?.map((anime) => (
              <motion.div
                key={anime.id}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/anime/${anime.id}`)}
              >
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold line-clamp-2">{anime.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <Button
                  leftIcon={<Shield className="w-5 h-5" />}
                  variant="outline"
                  className="w-full"
                >
                  Change Password
                </Button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                <Button
                  onClick={() => setShowThemeCustomizer(true)}
                  leftIcon={<Palette className="w-5 h-5" />}
                  variant="outline"
                  className="w-full"
                >
                  Customize Theme
                </Button>
                <Button
                  onClick={() => setShowNotifications(!showNotifications)}
                  leftIcon={<Bell className="w-5 h-5" />}
                  variant="outline"
                  className="w-full"
                >
                  Notification Settings
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12" style={{ backgroundColor: profile.theme.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.username} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Film className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
              <p className="text-gray-400">
                Joined {new Date(profile.joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-sm text-gray-400">Anime Watched</p>
                <p className="font-semibold">{profile.stats.totalAnimeWatched}</p>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
              <Star className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-sm text-gray-400">Average Rating</p>
                <p className="font-semibold">{profile.stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
              <List className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-sm text-gray-400">Total Reviews</p>
                <p className="font-semibold">{profile.stats.totalReviews}</p>
              </div>
            </div>
            <button
              onClick={() => setShowThemeCustomizer(true)}
              className="bg-gray-700 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-600 transition-colors"
            >
              <Palette className="w-5 h-5 text-primary-500" />
              <div className="text-left">
                <p className="text-sm text-gray-400">Theme</p>
                <p className="font-semibold">Customize</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <span className="text-lg font-bold">{profile.lists.watching}</span>
              </div>
              <p className="text-sm text-gray-400">Watching</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <BookmarkCheck className="w-4 h-4 text-primary-500" />
                <span className="text-lg font-bold">{profile.lists.completed}</span>
              </div>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <List className="w-4 h-4 text-primary-500" />
                <span className="text-lg font-bold">{profile.lists.planToWatch}</span>
              </div>
              <p className="text-sm text-gray-400">Plan to Watch</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Film className="w-4 h-4 text-primary-500" />
                <span className="text-lg font-bold">{profile.lists.dropped}</span>
              </div>
              <p className="text-sm text-gray-400">Dropped</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {showThemeCustomizer && (
        <ThemeCustomizer
          currentTheme={profile.theme}
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}
    </div>
  );
};