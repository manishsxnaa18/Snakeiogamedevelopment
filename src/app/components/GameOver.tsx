import { motion } from 'motion/react';
import { RotateCcw, Home, Trophy } from 'lucide-react';

interface GameOverProps {
  score: number;
  level: number;
  onRestart: () => void;
  onMainMenu: () => void;
  reason: string;
}

export function GameOver({ score, level, onRestart, onMainMenu, reason }: GameOverProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8 z-50">
      <motion.div
        className="bg-white rounded-3xl p-12 max-w-lg w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        {/* Game Over Title */}
        <motion.div
          className="text-center mb-8"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          <div className="text-8xl mb-4">😢</div>
          <h2 className="text-5xl text-red-500 mb-2">Game Over!</h2>
          <p className="text-xl text-gray-600">{reason}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white text-center"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm opacity-90">Final Score</div>
            <div className="text-4xl">{score}</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-sm opacity-90">Level Reached</div>
            <div className="text-4xl">{level}</div>
          </motion.div>
        </div>

        {/* Encouragement Message */}
        <motion.div
          className="bg-blue-50 rounded-2xl p-4 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg text-gray-700">
            {score > 100 ? '🌟 Amazing job! You\'re a snake master!' : 
             score > 50 ? '👏 Great effort! Keep practicing!' :
             '💪 Don\'t give up! Try again!'}
          </p>
        </motion.div>

        {/* Buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl py-4 px-8 flex items-center justify-center gap-3 text-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <RotateCcw className="w-6 h-6" />
            Play Again
          </motion.button>

          <motion.button
            onClick={onMainMenu}
            className="w-full bg-gray-200 text-gray-700 rounded-2xl py-4 px-8 flex items-center justify-center gap-3 text-xl hover:bg-gray-300 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Home className="w-6 h-6" />
            Main Menu
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}