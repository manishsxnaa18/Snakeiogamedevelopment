import { motion } from 'motion/react';
import { ActivePowerUp } from '../types/game';
import { POWER_UP_CONFIGS } from '../types/game';

interface PowerUpDisplayProps {
  activePowerUps: ActivePowerUp[];
}

export function PowerUpDisplay({ activePowerUps }: PowerUpDisplayProps) {
  if (activePowerUps.length === 0) return null;

  return (
    <div className="fixed top-24 right-8 z-40 flex flex-col gap-2">
      {activePowerUps.map((powerUp, index) => {
        const config = POWER_UP_CONFIGS[powerUp.type as keyof typeof POWER_UP_CONFIGS];
        const timeLeft = Math.max(0, powerUp.endTime - Date.now());
        const progress = timeLeft / (config?.duration || 5000);

        return (
          <motion.div
            key={`${powerUp.type}-${index}`}
            className="rounded-xl p-3 flex items-center gap-3 backdrop-blur-md"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: `2px solid ${config?.color || '#84cc16'}`,
              minWidth: '200px',
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            {/* Icon */}
            <div className="text-3xl">{config?.emoji || '⚡'}</div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-white text-sm" style={{ fontWeight: '600' }}>
                {config?.name || powerUp.type}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: config?.color || '#84cc16' }}
                  initial={{ width: '100%' }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Time Left */}
            <div className="text-white text-xs" style={{ fontWeight: '600' }}>
              {Math.ceil(timeLeft / 1000)}s
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
