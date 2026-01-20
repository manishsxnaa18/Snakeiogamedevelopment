import { motion } from 'motion/react';
import { Play, Info } from 'lucide-react';

interface GameMenuProps {
  onStart: () => void;
}

export function GameMenu({ onStart }: GameMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-8">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h1 className="text-7xl mb-4 drop-shadow-lg">🐍</h1>
          <h1 className="text-6xl text-white mb-4 drop-shadow-lg">
            Snake Adventure
          </h1>
          <p className="text-2xl text-white/90 drop-shadow">
            Eat, Grow, and Win!
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.button
          onClick={onStart}
          className="w-full bg-white text-purple-600 rounded-3xl py-6 px-12 mb-6 shadow-2xl flex items-center justify-center gap-4 text-2xl hover:bg-purple-50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: [
              '0 20px 50px rgba(0,0,0,0.3)',
              '0 25px 60px rgba(255,255,255,0.5)',
              '0 20px 50px rgba(0,0,0,0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Play className="w-8 h-8" />
          Start Game
        </motion.button>

        {/* Instructions */}
        <motion.div
          className="bg-white/90 rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl text-gray-800">How to Play</h2>
          </div>
          
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👆</span>
              <div>
                <strong>Tap/Click to Change Direction</strong>
                <p className="text-sm">Your snake runs automatically. Tap the screen to guide it toward food!</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">🍎</span>
              <div>
                <strong>Collect All Food</strong>
                <p className="text-sm">Eat apples, cherries, bananas, and grapes to grow and complete each level!</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <strong>Avoid Dangers</strong>
                <p className="text-sm">Don't hit walls, obstacles, yourself, or other snakes!</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <strong>Level Up</strong>
                <p className="text-sm">Complete levels to unlock harder challenges with more obstacles and AI snakes!</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Snake Preview */}
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
