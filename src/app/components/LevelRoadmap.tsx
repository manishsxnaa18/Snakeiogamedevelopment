import { motion } from 'motion/react';
import { Check, Lock, Star } from 'lucide-react';

interface LevelRoadmapProps {
  currentLevel: number;
  maxLevel: number;
}

export function LevelRoadmap({ currentLevel, maxLevel }: LevelRoadmapProps) {
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-indigo-200">
      <h3 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-500" />
        Level Roadmap
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {levels.map((level) => {
          const isCompleted = level < currentLevel;
          const isCurrent = level === currentLevel;
          const isLocked = level > currentLevel;

          return (
            <motion.div
              key={level}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${isCurrent ? 'border-green-500 bg-green-50 shadow-lg' : ''}
                ${isCompleted ? 'border-blue-400 bg-blue-50' : ''}
                ${isLocked ? 'border-gray-300 bg-gray-50 opacity-60' : ''}
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: level * 0.05 }}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
            >
              <div className="flex items-center gap-4">
                {/* Level Icon */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-white
                  ${isCurrent ? 'bg-gradient-to-br from-green-400 to-green-600 animate-pulse' : ''}
                  ${isCompleted ? 'bg-gradient-to-br from-blue-400 to-blue-600' : ''}
                  ${isLocked ? 'bg-gray-400' : ''}
                `}>
                  {isCompleted && <Check className="w-6 h-6" />}
                  {isCurrent && <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>⭐</motion.div>}
                  {isLocked && <Lock className="w-6 h-6" />}
                </div>

                {/* Level Info */}
                <div className="flex-1">
                  <div className="text-gray-800">
                    Level {level}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getLevelDescription(level)}
                  </div>
                </div>

                {/* Difficulty Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, level) }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        isLocked ? 'text-gray-300' : 'text-yellow-400 fill-yellow-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Current Level Indicator */}
              {isCurrent && (
                <motion.div
                  className="absolute -right-2 -top-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Playing Now!
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function getLevelDescription(level: number): string {
  const descriptions = [
    'Easy start - Learn the basics',
    'Getting warmer - More food to collect',
    'Watch out - First obstacles appear!',
    'Speed up - Snake moves faster',
    'AI Snakes join the game!',
    'Maze challenge - Navigate carefully',
    'Speed demon - Very fast pace',
    'Crowded field - Many AI snakes',
    'Obstacle course - Tricky navigation',
    'Master level - Ultimate challenge!',
  ];
  
  return descriptions[level - 1] || `Challenge ${level} - Expert difficulty`;
}
