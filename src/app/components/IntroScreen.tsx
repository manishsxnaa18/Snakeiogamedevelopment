import { motion } from 'motion/react';
import { useState } from 'react';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [playerName, setPlayerName] = useState('');

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

  const handleStart = () => {
    if (playerName.trim()) {
      onStart();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-yellow-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 1, 0.3],
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

      {/* Main Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <motion.div
          className="max-w-2xl w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Title with gradient text */}
          <motion.div
            className="text-center mb-12"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.h1
              className="text-8xl mb-4"
              style={{
                background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 30%, #6366f1 60%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                filter: 'drop-shadow(0 4px 10px rgba(168, 85, 247, 0.4))',
              }}
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              Snake Adventure
            </motion.h1>
          </motion.div>

          {/* Input and Button Container */}
          <motion.div
            className="flex items-center gap-4 justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 1 }}
          >
            {/* Name Input */}
            <motion.input
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              className="px-8 py-5 rounded-full text-xl text-gray-700 bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-white/50 outline-none transition-all"
              style={{
                width: '320px',
                fontWeight: '500',
              }}
              whileFocus={{ scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.5)' }}
            />

            {/* Start Button */}
            <motion.button
              onClick={handleStart}
              className="px-10 py-5 rounded-full text-xl text-white shadow-2xl cursor-pointer border-4 border-pink-400"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 40px rgba(236, 72, 153, 0.6)',
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 10px 30px rgba(236, 72, 153, 0.4)',
                  '0 10px 50px rgba(236, 72, 153, 0.6)',
                  '0 10px 30px rgba(236, 72, 153, 0.4)',
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity },
              }}
            >
              Start Game
            </motion.button>
          </motion.div>

          {/* Fun Info Cards */}
          <motion.div
            className="grid grid-cols-3 gap-4 mt-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[
              { emoji: '🍎', text: 'Eat & Grow', color: 'from-red-400 to-pink-500' },
              { emoji: '🏆', text: '40 Levels', color: 'from-yellow-400 to-orange-500' },
              { emoji: '⚡', text: 'Fast Action', color: 'from-cyan-400 to-blue-500' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-center text-white shadow-xl`}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.3 + index * 0.1, type: 'spring' }}
              >
                <div className="text-5xl mb-2">{item.emoji}</div>
                <div className="text-lg" style={{ fontWeight: '600' }}>{item.text}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* How to Play - Quick Tips */}
          <motion.div
            className="mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <h3 className="text-2xl text-white text-center mb-4" style={{ fontWeight: '600' }}>
              🎮 How to Play
            </h3>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">👆</div>
                <div>
                  <div style={{ fontWeight: '600' }}>Tap to Turn</div>
                  <div className="text-sm text-white/70">Click anywhere</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">🍎</div>
                <div>
                  <div style={{ fontWeight: '600' }}>Eat Food</div>
                  <div className="text-sm text-white/70">Grow bigger</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚠️</div>
                <div>
                  <div style={{ fontWeight: '600' }}>Avoid Walls</div>
                  <div className="text-sm text-white/70">Stay safe</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">🌟</div>
                <div>
                  <div style={{ fontWeight: '600' }}>Level Up</div>
                  <div className="text-sm text-white/70">Beat all levels</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}