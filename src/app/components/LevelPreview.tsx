import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface LevelPreviewProps {
  level: number;
  obstacleCount: number;
  aiSnakeCount: number;
  hasBoss: boolean;
  bestTime?: number;
  bestScore?: number;
  stars?: number;
  onStart: () => void;
  onBack: () => void;
}

export function LevelPreview({
  level,
  obstacleCount,
  aiSnakeCount,
  hasBoss,
  bestTime,
  bestScore,
  stars = 0,
  onStart,
  onBack,
}: LevelPreviewProps) {
  const isBossLevel = level % 10 === 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0a0a0f' }}>
      <motion.div
        className="max-w-2xl w-full rounded-3xl p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.1) 0%, rgba(101, 163, 13, 0.1) 100%)',
          border: '2px solid rgba(132, 204, 22, 0.3)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <motion.div className="text-center mb-8">
          <motion.div
            className="text-8xl mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isBossLevel ? '👹' : '🐍'}
          </motion.div>
          <h2
            className="text-5xl mb-2"
            style={{
              background: 'linear-gradient(90deg, #bef264 0%, #84cc16 50%, #65a30d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            {isBossLevel ? `BOSS LEVEL ${level}` : `Level ${level}`}
          </h2>
          <p className="text-xl text-gray-300">
            {isBossLevel ? '🔥 Defeat the Boss! 🔥' : 'Get Ready for the Challenge!'}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(132, 204, 22, 0.1)' }}>
            <div className="text-3xl mb-2">🧱</div>
            <div className="text-white text-lg" style={{ fontWeight: '600' }}>
              {obstacleCount} Obstacles
            </div>
          </div>

          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(132, 204, 22, 0.1)' }}>
            <div className="text-3xl mb-2">🐍</div>
            <div className="text-white text-lg" style={{ fontWeight: '600' }}>
              {aiSnakeCount} AI Snakes
            </div>
          </div>

          {bestTime && (
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(132, 204, 22, 0.1)' }}>
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-white text-lg" style={{ fontWeight: '600' }}>
                Best: {(bestTime / 1000).toFixed(1)}s
              </div>
            </div>
          )}

          {bestScore && (
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(132, 204, 22, 0.1)' }}>
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-white text-lg" style={{ fontWeight: '600' }}>
                Best: {bestScore}
              </div>
            </div>
          )}
        </div>

        {/* Stars */}
        {stars > 0 && (
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                className="text-5xl"
                animate={star <= stars ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                } : {}}
                transition={{ duration: 0.5, delay: star * 0.1 }}
              >
                {star <= stars ? '⭐' : '☆'}
              </motion.div>
            ))}
          </div>
        )}

        {/* Boss Warning */}
        {isBossLevel && (
          <motion.div
            className="rounded-xl p-6 mb-8 text-center"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
            }}
            animate={{
              borderColor: ['rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 0.5)'],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="text-2xl text-red-400" style={{ fontWeight: '600' }}>
              ⚠️ WARNING: Boss Battle Ahead! ⚠️
            </div>
            <p className="text-gray-300 mt-2">
              Collect all fruits while avoiding the powerful boss!
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <motion.button
            onClick={onBack}
            className="flex-1 rounded-2xl py-4 text-white text-xl"
            style={{
              background: 'rgba(107, 114, 128, 0.5)',
              border: '2px solid rgba(156, 163, 175, 0.3)',
              fontWeight: '600',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>

          <motion.button
            onClick={onStart}
            className="flex-1 rounded-2xl py-4 text-white text-xl flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              fontWeight: '600',
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(132, 204, 22, 0.6)' }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(132, 204, 22, 0.4)',
                '0 0 40px rgba(132, 204, 22, 0.6)',
                '0 0 20px rgba(132, 204, 22, 0.4)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Play className="w-6 h-6" />
            START LEVEL
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
