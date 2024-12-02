import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import type { AnimeCharacter } from '../../types/anime';

interface CharacterListProps {
  characters: AnimeCharacter[];
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop';

export const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
  if (characters.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No character information available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {characters.map((char, index) => (
        <motion.div
          key={char.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all"
        >
          <div className="flex p-4 gap-4">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-700">
                {char.attributes.character.image ? (
                  <img
                    src={char.attributes.character.image.original || char.attributes.character.image.small}
                    alt={char.attributes.character.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">
                {char.attributes.character.name}
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                {char.attributes.role}
              </p>
              {char.attributes.voiceActor && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                    {char.attributes.voiceActor.image ? (
                      <img
                        src={char.attributes.voiceActor.image.original || char.attributes.voiceActor.image.small}
                        alt={char.attributes.voiceActor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {char.attributes.voiceActor.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {char.attributes.voiceActor.language} Voice
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {char.attributes.character.description && (
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-300 line-clamp-3">
                {char.attributes.character.description}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};