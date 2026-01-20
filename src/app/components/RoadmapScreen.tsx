import { motion } from 'motion/react';
import { Lock, Star, ArrowLeft } from 'lucide-react';

interface RoadmapScreenProps {
  currentLevel: number;
  maxLevel: number;
  maxUnlockedLevel: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export function RoadmapScreen({ currentLevel, maxLevel, maxUnlockedLevel, onSelectLevel, onBack }: RoadmapScreenProps) {
  // Define colorful snake blobs positioned around the screen
  const snakeBlobs = [
    // Top cyan/turquoise snake
    { color: 'from-cyan-400 to-cyan-500', x: 30, y: 10, rotation: 45, size: 'large' },
    // Top right orange/red snake
    { color: 'from-orange-500 to-red-500', x: 70, y: 15, rotation: -30, size: 'large' },
    // Bottom right green snake
    { color: 'from-lime-400 to-green-500', x: 75, y: 70, rotation: 20, size: 'xlarge' },
    // Bottom left blue snake
    { color: 'from-sky-400 to-blue-500', x: 15, y: 75, rotation: -15, size: 'large' },
  ];

  // Generate planet positions in a winding horizontal pattern
  const generatePlanetPositions = () => {
    const positions = [];
    const cols = 7; // 7 levels per row for more spacing
    const rows = Math.ceil(maxLevel / cols);
    
    for (let i = 0; i < maxLevel; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      // Alternate direction for each row
      const isEvenRow = row % 2 === 0;
      const actualCol = isEvenRow ? col : (cols - 1 - col);
      
      const x = 12 + (actualCol * 12.5); // Even more spacing between columns
      const y = 15 + (row * 25); // Even more spacing between rows
      
      // Add wave effect
      const wave = Math.sin(actualCol * 0.8) * 3;
      
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-yellow-200"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ⭐
          </motion.div>
        ))}

        {/* Circles and bubbles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full border-2"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              borderColor: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Small dots */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Colorful Snake Blobs */}
      {snakeBlobs.map((blob, index) => {
        const sizes = {
          large: { width: 350, height: 280 },
          xlarge: { width: 420, height: 320 },
        };
        const size = sizes[blob.size as keyof typeof sizes];

        return (
          <motion.div
            key={`blob-${index}`}
            className="absolute pointer-events-none"
            style={{
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              transform: `translate(-50%, -50%) rotate(${blob.rotation}deg)`,
            }}
            initial={{ scale: 0, rotate: blob.rotation - 180 }}
            animate={{ 
              scale: 1, 
              rotate: blob.rotation,
              y: [0, -15, 0],
            }}
            transition={{ 
              scale: { duration: 0.8, delay: index * 0.15 },
              rotate: { duration: 0.8, delay: index * 0.15 },
              y: { duration: 3, repeat: Infinity, delay: index * 0.5 },
            }}
          >
            {/* Blob shape */}
            <div
              className={`relative bg-gradient-to-br ${blob.color} rounded-full`}
              style={{
                width: `${size.width}px`,
                height: `${size.height}px`,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Eyes */}
              <div className="absolute flex gap-4" style={{ top: '35%', left: '30%' }}>
                {/* Left eye */}
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <motion.div
                      className="w-6 h-6 bg-blue-600 rounded-full"
                      animate={{
                        x: [0, 3, 0, -3, 0],
                        y: [0, 2, 0, -2, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </div>
                </div>
                {/* Right eye */}
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <motion.div
                      className="w-6 h-6 bg-blue-600 rounded-full"
                      animate={{
                        x: [0, 3, 0, -3, 0],
                        y: [0, 2, 0, -2, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Highlight */}
              <div
                className="absolute bg-white/30 rounded-full blur-2xl"
                style={{
                  width: '120px',
                  height: '100px',
                  top: '20%',
                  left: '25%',
                }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Header */}
      <div className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="bg-white/90 hover:bg-white text-gray-800 rounded-full px-6 py-3 flex items-center gap-2 shadow-xl cursor-pointer"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontWeight: '600' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.h1
            className="text-6xl text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 30%, #6366f1 60%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 'bold',
              filter: 'drop-shadow(0 4px 10px rgba(168, 85, 247, 0.4))',
            }}
          >
            🌌 Space Adventure 🌌
          </motion.h1>

          <div className="w-32" />
        </div>
      </div>

      {/* Main scrollable map */}
      <div className="relative z-10 px-8 pb-8 overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="relative mx-auto" style={{ minWidth: '1400px', minHeight: '800px', maxWidth: '2000px' }}>
          {/* SVG for thick colorful path */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              {/* Gradient for unlocked path */}
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="25%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="75%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              
              {/* Gradient for locked path */}
              <linearGradient id="lockedPathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
              </linearGradient>
            </defs>
            
            {planetPositions.slice(0, -1).map((pos, index) => {
              const next = planetPositions[index + 1];
              const isUnlocked = index < maxUnlockedLevel - 1;
              
              return (
                <g key={`path-${index}`}>
                  {/* Outer glow */}
                  <motion.line
                    x1={`${pos.x}%`}
                    y1={`${pos.y}%`}
                    x2={`${next.x}%`}
                    y2={`${next.y}%`}
                    stroke={isUnlocked ? "url(#pathGradient)" : "url(#lockedPathGradient)"}
                    strokeWidth="24"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    style={{
                      filter: isUnlocked ? 'blur(8px)' : 'blur(6px)',
                    }}
                  />
                  
                  {/* Main thick path */}
                  <motion.line
                    x1={`${pos.x}%`}
                    y1={`${pos.y}%`}
                    x2={`${next.x}%`}
                    y2={`${next.y}%`}
                    stroke={isUnlocked ? "url(#pathGradient)" : "rgba(147, 51, 234, 0.4)"}
                    strokeWidth="16"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isUnlocked ? 0.9 : 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                  
                  {/* Inner highlight */}
                  <motion.line
                    x1={`${pos.x}%`}
                    y1={`${pos.y}%`}
                    x2={`${next.x}%`}
                    y2={`${next.y}%`}
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isUnlocked ? 0.6 : 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Planet level badges */}
          {planetPositions.map((pos) => {
            const level = pos.level;
            const isCompleted = level < currentLevel;
            const isCurrent = level === currentLevel;
            const isLocked = level > maxUnlockedLevel;
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
                    width: '100px',
                    height: '100px',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                    border: '2px solid',
                    borderColor: isLocked ? 'rgba(147, 51, 234, 0.4)' : planetStyle.glow,
                    boxShadow: `0 0 20px ${planetStyle.glow}`,
                  }}
                  // Removed blinking animation
                />

                {/* Planet button */}
                <motion.button
                  onClick={() => !isLocked && onSelectLevel(level)}
                  disabled={isLocked}
                  className={`relative rounded-full flex items-center justify-center cursor-pointer ${
                    isLocked ? 'opacity-80' : ''
                  }`}
                  style={{
                    width: '75px',
                    height: '75px',
                    background: `linear-gradient(135deg, ${isLocked ? '#581c87, #3b0764' : ''})`,
                    boxShadow: `0 8px 30px ${planetStyle.glow}, inset 0 -4px 12px rgba(0, 0, 0, 0.5)`,
                  }}
                  whileHover={!isLocked ? { scale: 1.1 } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  animate={isCurrent ? {
                    boxShadow: [
                      `0 8px 30px ${planetStyle.glow}`,
                      `0 8px 40px ${planetStyle.glow}`,
                      `0 8px 30px ${planetStyle.glow}`,
                    ],
                  } : {}}
                  transition={isCurrent ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  {/* Planet surface */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${planetStyle.gradient}`}
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {/* Planet highlight */}
                    <div
                      className="absolute bg-white/30 rounded-full blur-lg"
                      style={{
                        width: '30px',
                        height: '30px',
                        top: '15%',
                        left: '25%',
                      }}
                    />

                    {/* Planet spots/texture */}
                    {!isLocked && [...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-black/20"
                        style={{
                          width: `${10 + Math.random() * 12}px`,
                          height: `${10 + Math.random() * 12}px`,
                          left: `${20 + Math.random() * 50}%`,
                          top: `${20 + Math.random() * 50}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Content - lock or star */}
                  {isLocked ? (
                    <Lock className="w-8 h-8 text-purple-200 z-10 relative" />
                  ) : (
                    <motion.div
                      className="z-10 relative"
                      animate={isCurrent ? { rotate: [0, 360] } : {}}
                      transition={isCurrent ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
                    >
                      <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
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
                  {/* Removed all wave animations */}

                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg relative"
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
                    {/* Stars for completed levels */}
                    {isCompleted && (
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    )}
                    {/* Removed current level blinking dots */}
                    {/* Locked indicator */}
                    {isLocked && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </motion.div>

                {/* Pulsing rings for current level */}
                {isCurrent && (
                  <>
                    {/* Removed pulsing rings animation */}
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
    </div>
  );
}