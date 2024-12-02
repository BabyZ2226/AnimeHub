import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '../../types/user';

interface AchievementsListProps {
  achievements: Achievement[];
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${
              achievement.unlockedAt ? 'bg-gray-700' : 'bg-gray-700/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      achievement.unlockedAt ? 'bg-primary-500' : 'bg-gray-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>{achievement.progress} / {achievement.requirement}</span>
                  {achievement.unlockedAt && (
                    <span>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};