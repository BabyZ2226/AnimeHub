import React from 'react';
import { motion } from 'framer-motion';

export const GachaMachine: React.FC = () => {
  return (
    <div className="relative w-full aspect-video max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent"
      />
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="relative w-96 h-96">
          {/* Machine Base */}
          <div className="absolute inset-0 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/10 to-primary-500/20" />
            
            {/* Glass Dome */}
            <div className="absolute top-4 left-4 right-4 bottom-1/3 bg-gray-700/50 rounded-t-full overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              
              {/* Floating Cards Animation */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-8 flex items-center justify-center"
              >
                <div className="w-24 h-36 bg-white/10 rounded-lg transform rotate-12 absolute" />
                <div className="w-24 h-36 bg-white/10 rounded-lg transform -rotate-12 absolute" />
                <div className="w-24 h-36 bg-white/10 rounded-lg absolute" />
              </motion.div>
            </div>

            {/* Machine Base Details */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-900">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(239, 68, 68, 0.2)",
                      "0 0 40px rgba(239, 68, 68, 0.4)",
                      "0 0 20px rgba(239, 68, 68, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary-400" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative Lights */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary-500"
            />
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary-500"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};