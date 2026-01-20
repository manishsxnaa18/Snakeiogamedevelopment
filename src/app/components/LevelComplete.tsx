import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';

interface LevelCompleteProps {
  level: number;
  score: number;
  onNextLevel: () => void;
}

export function LevelComplete({ level, score, onNextLevel }: LevelCompleteProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8 z-50">
      <motion.div
        className="bg-white rounded-3xl p-12 max-w-lg w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        {/* Celebration */}
        <motion.div
          className="text-center mb-8"
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <div className="text-8xl mb-4">🎉</div>
          <h2 className="text-5xl text-green-500 mb-2">Level Complete!</h2>
          <p className="text-2xl text-gray-600">You finished Level {level}!</p>
        </motion.div>

        {/* Stars Animation */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
            >
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Score Display */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
        >
          <div className="text-lg opacity-90 mb-2">Your Score</div>
          <motion.div
            className="text-6xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            {score}
          </motion.div>
        </motion.div>

        {/* Next Level Button */}
        <motion.button
          onClick={onNextLevel}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl py-5 px-8 flex items-center justify-center gap-3 text-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          animate-pulse="true"
        >
          Next Level
          <ArrowRight className="w-8 h-8" />
        </motion.button>

        {/* Confetti-like elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'][i % 4],
                left: `${Math.random() * 100}%`,
                top: '-10%',
              }}
              animate={{
                y: ['0vh', '110vh'],
                x: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}