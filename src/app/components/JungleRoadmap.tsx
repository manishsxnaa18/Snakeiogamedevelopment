import { motion } from 'motion/react';
import { Lock, Star } from 'lucide-react';

interface JungleRoadmapProps {
  currentLevel: number;
  maxLevel: number;
  onSelectLevel?: (level: number) => void;
}

export function JungleRoadmap({ currentLevel, maxLevel, onSelectLevel }: JungleRoadmapProps) {
  // Generate planet positions in a winding horizontal pattern
  const generatePlanetPositions = () => {
    const positions = [];
    const cols = 8; // 8 levels per row
    const rows = Math.ceil(maxLevel / cols);
    
    for (let i = 0; i < maxLevel; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      // Alternate direction for each row
      const isEvenRow = row % 2 === 0;
      const actualCol = isEvenRow ? col : (cols - 1 - col);
      
      const x = 10 + (actualCol * 11.5); // Spread across width
      const y = 20 + (row * 25); // Vertical spacing
      
      // Add wave effect
      const wave = Math.sin(actualCol * 0.8) * 5;
      
      positions.push({ x, y: y + wave, level: i + 1 });
    }
    
    return positions;
  };

  const planetPositions = generatePlanetPositions();

  // Planet colors for different levels
  const getPlanetStyle = (level: number, isCompleted: boolean, isCurrent: boolean, isLocked: boolean) => {
    if (isLocked) {
      return {
        gradient: 'from-purple-900 to-purple-950',
        glow: 'rgba(147, 51, 234, 0.4)',
      };
    }
    
    const colorSets = [
      { gradient: 'from-blue-400 to-blue-600', glow: 'rgba(96, 165, 250, 0.6)' },
      { gradient: 'from-green-400 to-green-600', glow: 'rgba(74, 222, 128, 0.6)' },
      { gradient: 'from-yellow-400 to-orange-500', glow: 'rgba(251, 191, 36, 0.6)' },
      { gradient: 'from-pink-400 to-pink-600', glow: 'rgba(244, 114, 182, 0.6)' },
      { gradient: 'from-cyan-400 to-cyan-600', glow: 'rgba(34, 211, 238, 0.6)' },
      { gradient: 'from-red-400 to-red-600', glow: 'rgba(248, 113, 113, 0.6)' },
      { gradient: 'from-purple-400 to-purple-600', glow: 'rgba(192, 132, 252, 0.6)' },
      { gradient: 'from-lime-400 to-lime-600', glow: 'rgba(163, 230, 53, 0.6)' },
    ];
    
    return colorSets[(level - 1) % colorSets.length];
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-950 via-green-950 to-gray-950 overflow-auto">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`bigstar-${i}`}
            className="absolute text-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 8}px`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* Ground silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-gray-900 to-transparent pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={`hill-${i}`}
            className="absolute bottom-0 bg-gradient-to-t from-gray-950 to-gray-900 rounded-t-full opacity-80"
            style={{
              left: `${i * 15}%`,
              width: `${150 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 40}px`,
            }}
          />
        ))}
      </div>

      {/* Map content */}
      <div className="relative p-8" style={{ minWidth: '1400px', minHeight: '800px' }}>
        {/* SVG for dotted path */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {planetPositions.slice(0, -1).map((pos, index) => {
            const next = planetPositions[index + 1];
            const isOnPath = index < currentLevel - 1;
            
            return (
              <motion.line
                key={`path-${index}`}
                x1={`${pos.x}%`}
                y1={`${pos.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke={isOnPath ? '#4ade80' : '#ffffff'}
                strokeWidth="3"
                strokeDasharray="8 8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: isOnPath ? 0.8 : 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{
                  filter: isOnPath ? 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.6))' : 'none',
                }}
              />
            );
          })}
        </svg>

        {/* Planet level badges */}
        {planetPositions.map((pos) => {
          const level = pos.level;
          const isCompleted = level < currentLevel;
          const isCurrent = level === currentLevel;
          const isLocked = level > currentLevel;
          const planetStyle = getPlanetStyle(level, isCompleted, isCurrent, isLocked);

          return (
            <motion.div
              key={level}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: level * 0.03,
                type: 'spring',
                stiffness: 200,
              }}
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  width: '140px',
                  height: '140px',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                  border: '3px solid',
                  borderColor: isLocked ? 'rgba(147, 51, 234, 0.4)' : planetStyle.glow,
                  boxShadow: `0 0 30px ${planetStyle.glow}`,
                }}
                animate={isCurrent ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 1, 0.6],
                } : {}}
                transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
              />

              {/* Planet button */}
              <motion.button
                onClick={() => !isLocked && onSelectLevel && onSelectLevel(level)}
                disabled={isLocked}
                className={`relative rounded-full flex items-center justify-center cursor-pointer ${
                  isLocked ? 'opacity-80' : ''
                }`}
                style={{
                  width: '110px',
                  height: '110px',
                  background: `linear-gradient(135deg, ${isLocked ? '#581c87, #3b0764' : ''})`,
                  boxShadow: `0 10px 40px ${planetStyle.glow}, inset 0 -5px 15px rgba(0, 0, 0, 0.5)`,
                }}
                whileHover={!isLocked ? { scale: 1.1 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
              >
                {/* Planet surface */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${planetStyle.gradient}`}
                  style={{
                    boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Planet highlight */}
                  <div
                    className="absolute bg-white/30 rounded-full blur-xl"
                    style={{
                      width: '50px',
                      height: '50px',
                      top: '15%',
                      left: '25%',
                    }}
                  />

                  {/* Planet spots/texture */}
                  {!isLocked && [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-black/20"
                      style={{
                        width: `${15 + Math.random() * 20}px`,
                        height: `${15 + Math.random() * 20}px`,
                        left: `${20 + Math.random() * 50}%`,
                        top: `${20 + Math.random() * 50}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Content - lock or star */}
                {isLocked ? (
                  <Lock className="w-12 h-12 text-purple-200 z-10 relative" />
                ) : (
                  <motion.div
                    className="z-10 relative"
                    animate={isCurrent ? { rotate: [0, 360] } : {}}
                    transition={isCurrent ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
                  >
                    <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                )}
              </motion.button>

              {/* Level number badge below planet */}
              <motion.div
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: level * 0.03 + 0.2 }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
                  style={{
                    background: isCurrent
                      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs" style={{ fontWeight: 'bold' }}>
                      {level}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  )}
                  {isCurrent && (
                    <motion.div
                      className="flex gap-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full" />
                      ))}
                    </motion.div>
                  )}
                  {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
              </motion.div>

              {/* Pulsing rings for current level */}
              {isCurrent && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-yellow-300 pointer-events-none"
                    style={{
                      width: '130px',
                      height: '130px',
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-orange-300 pointer-events-none"
                    style={{
                      width: '130px',
                      height: '130px',
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                  />
                </>
              )}

              {/* Sparkles for completed levels */}
              {isCompleted && Math.random() > 0.7 && (
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl pointer-events-none"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: level * 0.1,
                  }}
                >
                  ✨
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
