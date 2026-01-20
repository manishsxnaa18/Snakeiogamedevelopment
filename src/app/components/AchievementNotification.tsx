import { motion, AnimatePresence } from 'motion/react';
import { Achievement } from '../types/game';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-24 right-8 z-50 rounded-2xl p-6 max-w-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.95) 0%, rgba(101, 163, 13, 0.95) 100%)',
          border: '3px solid #fbbf24',
          boxShadow: '0 20px 60px rgba(132, 204, 22, 0.6), 0 0 100px rgba(251, 191, 36, 0.4)',
        }}
        initial={{ x: 400, opacity: 0, scale: 0.8 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 400, opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        {/* Sparkles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        <div className="relative">
          {/* Header */}
          <motion.div
            className="text-center mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-yellow-300 text-sm mb-1" style={{ fontWeight: '700', letterSpacing: '2px' }}>
              🏆 ACHIEVEMENT UNLOCKED! 🏆
            </div>
          </motion.div>

          {/* Achievement Icon */}
          <motion.div
            className="text-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="text-7xl">{achievement.emoji}</div>
          </motion.div>

          {/* Achievement Info */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-white text-2xl mb-2" style={{ fontWeight: '700' }}>
              {achievement.name}
            </h3>
            <p className="text-green-50 text-sm">
              {achievement.description}
            </p>
          </motion.div>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="mt-4 w-full rounded-xl py-2 text-white text-sm"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              fontWeight: '600',
            }}
            whileHover={{ background: 'rgba(0, 0, 0, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Awesome!
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
