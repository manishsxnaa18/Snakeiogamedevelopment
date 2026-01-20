import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface ComboDisplayProps {
  combo: number;
  multiplier: number;
}

export function ComboDisplay({ combo, multiplier }: ComboDisplayProps) {
  const [visible, setVisible] = useState(false);

  // Show for 5 seconds whenever combo changes and is > 0
  useEffect(() => {
    if (combo > 0) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [combo]);

  if (!visible || combo === 0) return null;

  const getComboMessage = () => {
    if (combo >= 10) return 'LEGENDARY!';
    if (combo >= 7) return 'INCREDIBLE!';
    if (combo >= 5) return 'AMAZING!';
    if (combo >= 3) return 'FANTASTIC!';
    return 'COMBO!';
  };

  const getComboColor = () => {
    if (combo >= 10) return '#a855f7'; // Purple
    if (combo >= 7) return '#ef4444'; // Red
    if (combo >= 5) return '#f59e0b'; // Orange
    if (combo >= 3) return '#fbbf24'; // Yellow
    return '#84cc16'; // Green
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {/* Combo Message */}
            <motion.div
              className="text-9xl mb-4"
              style={{
                color: getComboColor(),
                fontWeight: 'bold',
                textShadow: `0 0 30px ${getComboColor()}, 0 0 60px ${getComboColor()}, 0 0 90px ${getComboColor()}`,
                filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.8))',
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
            >
              {getComboMessage()}
            </motion.div>

            {/* Multiplier */}
            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-8xl" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}>
                🔥
              </span>
              <div
                className="text-7xl"
                style={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.5)',
                }}
              >
                {multiplier}x Points!
              </div>
              <span className="text-8xl" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}>
                🔥
              </span>
            </motion.div>

            {/* Flame particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-5xl"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(i * 30 * Math.PI / 180) * 150],
                    y: [0, Math.sin(i * 30 * Math.PI / 180) * 150],
                    opacity: [1, 0],
                    scale: [0.5, 2],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  {i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
