import { motion } from 'motion/react';
import { Trophy, Target, Zap } from 'lucide-react';

interface FoodCount {
  apple: number;
  cherry: number;
  banana: number;
  grape: number;
}

interface GameStatsProps {
  score: number;
  level: number;
  foodCounts: FoodCount;
  totalFoodNeeded: number;
}

export function GameStats({ score, level, foodCounts, totalFoodNeeded }: GameStatsProps) {
  const totalCollected = Object.values(foodCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Score and Level */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="rounded-2xl p-6 text-white shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(251, 191, 36, 0.4)'
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(251, 191, 36, 0.6)' }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90" style={{ fontWeight: '500' }}>Score</div>
              <motion.div
                className="text-3xl"
                style={{ fontWeight: 'bold' }}
                key={score}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
              >
                {score}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl p-6 text-white shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)'
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(139, 92, 246, 0.6)' }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90" style={{ fontWeight: '500' }}>Level</div>
              <motion.div
                className="text-3xl"
                style={{ fontWeight: 'bold' }}
                key={level}
                initial={{ scale: 1.5, rotate: 360 }}
                animate={{ scale: 1, rotate: 0 }}
              >
                {level}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Food Collection Progress */}
      <motion.div
        className="rounded-2xl p-6 shadow-xl"
        style={{
          background: 'rgba(42, 42, 62, 0.9)',
          border: '2px solid rgba(132, 204, 22, 0.3)',
          backdropFilter: 'blur(10px)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6" style={{ color: '#84cc16' }} />
          <h3 className="text-lg text-white" style={{ fontWeight: '600' }}>Food Collection</h3>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2" style={{ fontWeight: '500' }}>
            <span>{totalCollected} collected</span>
            <span>{totalFoodNeeded} needed</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(30, 30, 46, 0.8)' }}>
            <motion.div
              className="h-full"
              style={{
                background: 'linear-gradient(90deg, #84cc16 0%, #65a30d 100%)',
                boxShadow: '0 0 10px rgba(132, 204, 22, 0.5)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(totalCollected / totalFoodNeeded) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Food Items */}
        <div className="grid grid-cols-2 gap-3">
          <FoodItem emoji="🍎" name="Apple" count={foodCounts.apple} color="from-red-400 to-red-600" />
          <FoodItem emoji="🍒" name="Cherry" count={foodCounts.cherry} color="from-pink-400 to-pink-600" />
          <FoodItem emoji="🍌" name="Banana" count={foodCounts.banana} color="from-yellow-400 to-yellow-600" />
          <FoodItem emoji="🍇" name="Grape" count={foodCounts.grape} color="from-purple-400 to-purple-600" />
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(42, 42, 62, 0.6)',
          border: '2px solid rgba(190, 242, 100, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-white mb-3" style={{ fontWeight: '600' }}>How to Play:</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span style={{ color: '#84cc16' }}>•</span>
            <span>Tap anywhere to guide your snake</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#84cc16' }}>•</span>
            <span>Collect all food to complete the level</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#84cc16' }}>•</span>
            <span>Avoid walls, obstacles, and other snakes</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#84cc16' }}>•</span>
            <span>Don't bump into yourself!</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

function FoodItem({ emoji, name, count, color }: { emoji: string; name: string; count: number; color: string }) {
  return (
    <motion.div
      className={`bg-gradient-to-br ${color} rounded-xl p-3 text-white shadow-lg`}
      style={{
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}
      whileHover={{ scale: 1.05 }}
      animate={count > 0 ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="text-xs opacity-90" style={{ fontWeight: '500' }}>{name}</div>
          <motion.div
            className="text-xl"
            style={{ fontWeight: 'bold' }}
            key={count}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
          >
            {count}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
