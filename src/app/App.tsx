import { useState, useEffect, useCallback, useRef } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { RoadmapScreen } from './components/RoadmapScreen';
import { EnhancedGameCanvas } from './components/EnhancedGameCanvas';
import { GameStats } from './components/GameStats';
import { GameOver } from './components/GameOver';
import { LevelComplete } from './components/LevelComplete';
import { Particle, createParticles, updateParticles } from './components/Particle';
import { ComboDisplay } from './components/ComboDisplay';
import { PowerUpDisplay } from './components/PowerUpDisplay';
import { LevelPreview } from './components/LevelPreview';
import { AchievementNotification } from './components/AchievementNotification';
import { calculateStars } from './utils/starRating';
import { checkAchievements, getNewlyUnlockedAchievements } from './utils/achievements';
import type { PlayerStats, Achievement, SnakeEmotion } from './types/game';
import { motion } from 'motion/react';
import { ArrowLeft, Pause, Play } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
  type: 'apple' | 'cherry' | 'banana' | 'grape';
  color: string;
  emoji: string;
  hasShield?: boolean; // Shield protection for higher levels
  shieldHealth?: number; // How many hits to break shield
}

interface PowerUp {
  x: number;
  y: number;
  type: 'speed' | 'slow' | 'grow' | 'shrink' | 'fire' | 'freeze';
  emoji: string;
  color: string;
  duration?: number; // Duration in milliseconds
}

interface ActivePowerUp {
  type: string;
  endTime: number;
}

interface FoodCount {
  apple: number;
  cherry: number;
  banana: number;
  grape: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'panda' | 'smiley' | 'bear' | 'tree' | 'football' | 'ball' | 'robot' | 'alien' | 'mud';
  vx?: number; // velocity x
  vy?: number; // velocity y
}

interface AISnake {
  segments: Position[];
  direction: Position;
  color: string;
}

type GameState = 'intro' | 'roadmap' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';

const GRID_SIZE = 25;
const CELL_SIZE = 35;
const INITIAL_SPEED = 500;
const MAX_LEVEL = 40;

const FOOD_TYPES = [
  { type: 'apple' as const, color: '#ef4444', emoji: '🍎' },
  { type: 'cherry' as const, color: '#ec4899', emoji: '🍒' },
  { type: 'banana' as const, color: '#eab308', emoji: '🍌' },
  { type: 'grape' as const, color: '#a855f7', emoji: '🍇' },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [food, setFood] = useState<Food[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [aiSnakes, setAiSnakes] = useState<AISnake[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
  const [foodCounts, setFoodCounts] = useState<FoodCount>({ apple: 0, cherry: 0, banana: 0, grape: 0 });
  const [gameOverReason, setGameOverReason] = useState('');
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [baseSpeed, setBaseSpeed] = useState(INITIAL_SPEED);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [obstaclesFrozen, setObstaclesFrozen] = useState(false);
  const [fireBreath, setFireBreath] = useState<{ x: number; y: number; direction: Position } | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const particleAnimationRef = useRef<number>();

  // NEW: Combo system state
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  // NEW: Star rating & level tracking
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [hadCollision, setHadCollision] = useState(false);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [bestTimes, setBestTimes] = useState<Record<number, number>>({});
  const [bestScores, setBestScores] = useState<Record<number, number>>({});

  // NEW: Golden fruits state
  const [goldenFruits, setGoldenFruits] = useState<Set<number>>(new Set());

  // NEW: Snake emotion state
  const [snakeEmotion, setSnakeEmotion] = useState<SnakeEmotion>('neutral');

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('snakeAdventureProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setMaxUnlockedLevel(progress.maxUnlockedLevel || 1);
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever maxUnlockedLevel changes
  useEffect(() => {
    const progress = {
      maxUnlockedLevel,
    };
    localStorage.setItem('snakeAdventureProgress', JSON.stringify(progress));
  }, [maxUnlockedLevel]);

  // Calculate food needed for current level
  const totalFoodNeeded = 5 + level * 2;

  // Initialize level
  const initializeLevel = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    setFoodCounts({ apple: 0, cherry: 0, banana: 0, grape: 0 });
    
    // Generate food
    const newFood: Food[] = [];
    for (let i = 0; i < totalFoodNeeded; i++) {
      const foodType = FOOD_TYPES[i % FOOD_TYPES.length];
      newFood.push({
        ...generateRandomPosition(initialSnake, newFood, []),
        ...foodType,
      });
    }
    setFood(newFood);

    // Generate obstacles based on level
    const newObstacles: Obstacle[] = [];
    const obstacleCount = Math.floor(level / 2);
    for (let i = 0; i < obstacleCount; i++) {
      newObstacles.push(generateObstacle(initialSnake, newFood, newObstacles));
    }
    setObstacles(newObstacles);

    // Generate AI snakes for levels 3+
    const newAiSnakes: AISnake[] = [];
    if (level >= 3) {
      const aiCount = Math.floor((level - 2) / 2) + 1;
      for (let i = 0; i < aiCount; i++) {
        newAiSnakes.push(generateAISnake(initialSnake, newFood, newObstacles));
      }
    }
    setAiSnakes(newAiSnakes);

    // Adjust speed based on level
    setSpeed(Math.max(100, INITIAL_SPEED - level * 15));
    setBaseSpeed(Math.max(100, INITIAL_SPEED - level * 15));

    // NEW: Reset combo and multiplier
    setCombo(0);
    setMultiplier(1);

    // NEW: Reset level start time
    setLevelStartTime(Date.now());

    // NEW: Reset collision flag
    setHadCollision(false);
  }, [level, totalFoodNeeded]);

  // Start game - go to roadmap
  const startGame = () => {
    // Reset to level 1 when starting from intro
    setLevel(1);
    setGameState('roadmap');
  };

  // Select level from roadmap
  const handleSelectLevel = (selectedLevel: number) => {
    setLevel(selectedLevel);
    setCountdown(5); // Start countdown at 5 seconds
    setGameState('playing');
  };

  // Back to roadmap
  const handleBackToRoadmap = () => {
    setGameState('roadmap');
  };

  // Reset for current level
  useEffect(() => {
    if (gameState === 'playing') {
      initializeLevel();
    }
  }, [gameState, level, initializeLevel]);

  // Handle screen tap/click
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;

    const canvas = e.currentTarget.querySelector('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const cellX = Math.floor(clickX / CELL_SIZE);
    const cellY = Math.floor(clickY / CELL_SIZE);

    const head = snake[0];
    const dx = cellX - head.x;
    const dy = cellY - head.y;

    // Determine new direction based on click position
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal movement
      if (dx > 0 && direction.x !== -1) {
        setDirection({ x: 1, y: 0 });
      } else if (dx < 0 && direction.x !== 1) {
        setDirection({ x: -1, y: 0 });
      }
    } else {
      // Vertical movement
      if (dy > 0 && direction.y !== -1) {
        setDirection({ x: 0, y: 1 });
      } else if (dy < 0 && direction.y !== 1) {
        setDirection({ x: 0, y: -1 });
      }
    }
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || countdown !== null) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameState('gameOver');
          setGameOverReason('You hit the wall! 💥');
          setHadCollision(true); // NEW: Track collision
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameState('gameOver');
          setGameOverReason('You bumped into yourself! 🔄');
          setHadCollision(true); // NEW: Track collision
          return prevSnake;
        }

        // Check obstacle collision
        if (obstacles.some(obs => 
          newHead.x >= obs.x && 
          newHead.x < obs.x + obs.width && 
          newHead.y >= obs.y && 
          newHead.y < obs.y + obs.height
        )) {
          setGameState('gameOver');
          setGameOverReason('You crashed into an obstacle! 🧱');
          setHadCollision(true); // NEW: Track collision
          return prevSnake;
        }

        // Check AI snake collision
        if (aiSnakes.some(aiSnake => 
          aiSnake.segments.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        )) {
          setGameState('gameOver');
          setGameOverReason('You crashed into another snake! 🐍');
          setHadCollision(true); // NEW: Track collision
          return prevSnake;
        }

        // Check food collision
        const foodIndex = food.findIndex(f => f.x === newHead.x && f.y === newHead.y);
        if (foodIndex !== -1) {
          const eatenFood = food[foodIndex];
          
          // 25% chance to teleport fruit instead of eating it (for engagement)
          const shouldTeleport = Math.random() < 0.25;
          
          if (shouldTeleport) {
            // Teleport fruit to new location with particles
            const particleX = (eatenFood.x * CELL_SIZE) + (CELL_SIZE / 2);
            const particleY = (eatenFood.y * CELL_SIZE) + (CELL_SIZE / 2);
            setParticles(prev => [
              ...prev,
              ...createParticles(particleX, particleY, '#fbbf24', 'food', '✨')
            ]);
            
            // Move food to new position
            setFood(prev => prev.map((f, i) => {
              if (i === foodIndex) {
                const newPos = generateRandomPosition(prevSnake, prev, obstacles);
                return { ...f, ...newPos };
              }
              return f;
            }));
            
            // Don't grow snake, just continue moving
            return [newHead, ...prevSnake.slice(0, -1)];
          }
          
          // Normal food eating
          // Create particles
          const particleX = (eatenFood.x * CELL_SIZE) + (CELL_SIZE / 2);
          const particleY = (eatenFood.y * CELL_SIZE) + (CELL_SIZE / 2);
          setParticles(prev => [
            ...prev,
            ...createParticles(particleX, particleY, eatenFood.color, 'food', eatenFood.emoji)
          ]);

          // Update food count FIRST to get accurate total
          const currentTotal = Object.values(foodCounts).reduce((a, b) => a + b, 0);
          const newTotalCollected = currentTotal + 1;
          
          setFoodCounts(prev => ({
            ...prev,
            [eatenFood.type]: prev[eatenFood.type] + 1,
          }));

          // NEW: Progress-based combo system
          const halfwayPoint = Math.floor(totalFoodNeeded / 2);
          const almostDone = totalFoodNeeded - 1;
          
          let newCombo = 0;
          let newMultiplier = 1;
          
          if (newTotalCollected === 3) {
            // After eating 3 fruits
            newCombo = 3;
            newMultiplier = 2;
          } else if (newTotalCollected === halfwayPoint) {
            // At halfway point
            newCombo = 5;
            newMultiplier = 3;
          } else if (newTotalCollected === almostDone) {
            // One fruit left!
            newCombo = 7;
            newMultiplier = 3;
          } else if (newTotalCollected >= totalFoodNeeded) {
            // Level complete - LEGENDARY!
            newCombo = 10;
            newMultiplier = 5;
          }
          
          if (newCombo > 0) {
            setCombo(newCombo);
            setMultiplier(newMultiplier);
            
            console.log('🔥 COMBO TRIGGERED!', { newTotalCollected, newCombo, newMultiplier, totalFoodNeeded, halfwayPoint, almostDone });
            
            // Reset combo after 5 seconds so it can be triggered again
            setTimeout(() => {
              setCombo(0);
            }, 5000);
          }

          // NEW: Snake emotion - happy when eating!
          setSnakeEmotion('happy');
          setTimeout(() => setSnakeEmotion('neutral'), 500);

          // Remove eaten food
          setFood(prev => prev.filter((_, i) => i !== foodIndex));

          // Increase score with multiplier!
          setScore(prev => prev + (10 * level * newMultiplier));

          // Check if level complete
          if (newTotalCollected >= totalFoodNeeded) {
            setGameState('levelComplete');
          }

          // Grow snake
          return [newHead, ...prevSnake];
        }

        // Move snake
        return [newHead, ...prevSnake.slice(0, -1)];
      });

      // Move AI snakes
      setAiSnakes(prev => prev.map(aiSnake => {
        const head = aiSnake.segments[0];
        
        // Simple AI: randomly change direction occasionally
        let newDirection = aiSnake.direction;
        if (Math.random() < 0.1) {
          const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ].filter(d => !(d.x === -aiSnake.direction.x && d.y === -aiSnake.direction.y));
          newDirection = directions[Math.floor(Math.random() * directions.length)];
        }

        const newHead = {
          x: (head.x + newDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + newDirection.y + GRID_SIZE) % GRID_SIZE,
        };

        return {
          ...aiSnake,
          direction: newDirection,
          segments: [newHead, ...aiSnake.segments.slice(0, -1)],
        };
      }));
    }, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, direction, food, obstacles, aiSnakes, speed, foodCounts, totalFoodNeeded, level, countdown, combo]);

  // Handle next level
  const handleNextLevel = () => {
    if (level < MAX_LEVEL) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      // Unlock next level
      if (nextLevel > maxUnlockedLevel) {
        setMaxUnlockedLevel(nextLevel);
      }
      setGameState('playing');
    } else {
      setGameState('gameOver');
      setGameOverReason('🎉 Congratulations! You completed all levels! 🎉');
    }
  };

  // Handle restart
  const handleRestart = () => {
    // Restart current level, not level 1
    // Reset game state properly
    setScore(0); // Keep score, or reset to 0 depending on preference
    setFoodCounts({ apple: 0, cherry: 0, banana: 0, grape: 0 });
    setParticles([]);
    setCountdown(5);
    setGameState('playing');
  };

  // Handle main menu
  const handleMainMenu = () => {
    setGameState('menu');
    setLevel(1);
    setScore(0);
  };

  // Particle animation loop
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => updateParticles(prev));
      particleAnimationRef.current = requestAnimationFrame(animateParticles);
    };

    if (gameState === 'playing') {
      animateParticles();
    }

    return () => {
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current);
      }
    };
  }, [gameState]);

  // Countdown timer
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null); // Game starts when countdown reaches 0
    }
  }, [countdown]);

  // Move obstacles loop - slower speed that increases with level
  useEffect(() => {
    if (gameState !== 'playing' || countdown !== null || obstaclesFrozen) {
      return;
    }

    // Base speed is 2000ms (slow), decreases by 50ms per level
    // So level 1 = 2000ms, level 10 = 1550ms, level 20 = 1050ms
    const obstacleSpeed = Math.max(800, 2000 - (level * 50));

    const obstacleInterval = setInterval(() => {
      setObstacles(prev => prev.map(obs => {
        // Only move if has velocity
        if (!obs.vx && !obs.vy) return obs;

        let newX = obs.x + (obs.vx || 0);
        let newY = obs.y + (obs.vy || 0);

        // Bounce off walls (wrap around or reverse direction)
        let newVx = obs.vx;
        let newVy = obs.vy;

        if (newX <= 0 || newX + obs.width >= GRID_SIZE) {
          newVx = -(obs.vx || 0);
          newX = Math.max(0, Math.min(newX, GRID_SIZE - obs.width));
        }

        if (newY <= 0 || newY + obs.height >= GRID_SIZE) {
          newVy = -(obs.vy || 0);
          newY = Math.max(0, Math.min(newY, GRID_SIZE - obs.height));
        }

        return {
          ...obs,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      }));
    }, obstacleSpeed);

    return () => clearInterval(obstacleInterval);
  }, [gameState, countdown, obstaclesFrozen, level]);

  return (
    <div className="min-h-screen">
      {gameState === 'intro' && <IntroScreen onStart={startGame} />}

      {gameState === 'roadmap' && (
        <RoadmapScreen 
          currentLevel={level} 
          maxLevel={MAX_LEVEL}
          maxUnlockedLevel={maxUnlockedLevel}
          onSelectLevel={handleSelectLevel}
          onBack={() => setGameState('intro')}
        />
      )}

      {gameState === 'playing' && (
        <div className="min-h-screen p-8 relative overflow-hidden" style={{
          background: '#000000'
        }}>
          {/* Countdown Overlay */}
          {countdown !== null && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ background: 'rgba(0, 0, 0, 0.95)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative flex flex-col items-center gap-12">
                {/* Circular Countdown Loader */}
                <div className="relative" style={{ width: '400px', height: '400px' }}>
                  {/* Background circle */}
                  <svg className="absolute inset-0" width="400" height="400" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="200"
                      cy="200"
                      r="180"
                      fill="none"
                      stroke="rgba(132, 204, 22, 0.2)"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="200"
                      cy="200"
                      r="180"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '1130', strokeDashoffset: '1130' }}
                      animate={{
                        strokeDashoffset: `${1130 - (1130 * (5 - countdown)) / 5}`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#bef264" />
                        <stop offset="50%" stopColor="#84cc16" />
                        <stop offset="100%" stopColor="#65a30d" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Snake in the middle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-9xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      🐍
                    </motion.div>
                  </div>
                </div>

                {/* Countdown Number */}
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={countdown}
                >
                  <motion.div
                    className="text-8xl mb-4"
                    style={{
                      background: 'linear-gradient(90deg, #bef264 0%, #84cc16 50%, #65a30d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 'bold',
                      filter: 'drop-shadow(0 4px 20px rgba(132, 204, 22, 0.8))',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {countdown}
                  </motion.div>
                  <motion.p
                    className="text-3xl text-gray-300"
                    style={{ fontWeight: '500' }}
                    animate={{
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Get Ready!
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Animated floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  background: `rgba(${Math.random() > 0.5 ? '132, 204, 22' : '190, 242, 100'}, 0.6)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 10px rgba(132, 204, 22, 0.5)'
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* NEW: Combo Display */}
          <ComboDisplay combo={combo} multiplier={multiplier} />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header with Back Button */}
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                onClick={handleBackToRoadmap}
                className="rounded-2xl px-6 py-3 flex items-center gap-2 shadow-xl cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(132, 204, 22, 0.6)' }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-white" />
                <span className="text-white" style={{ fontWeight: '600' }}>Back to Map</span>
              </motion.button>

              <div className="text-center flex-1">
                <motion.h1
                  className="text-6xl mb-2"
                  style={{
                    background: 'linear-gradient(90deg, #bef264 0%, #84cc16 50%, #65a30d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 'bold',
                    filter: 'drop-shadow(0 4px 10px rgba(132, 204, 22, 0.5))',
                  }}
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(132, 204, 22, 0.5)',
                      '0 0 30px rgba(132, 204, 22, 0.8)',
                      '0 0 20px rgba(132, 204, 22, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🐍 Level {level}
                </motion.h1>
                <p className="text-xl text-gray-300" style={{ fontWeight: '500' }}>Collect all the food to advance!</p>
              </div>

              <div className="w-48" /> {/* Spacer for centering */}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
              {/* Left - Game Canvas */}
              <div className="flex flex-col items-center">
                <motion.div
                  onClick={handleScreenClick}
                  className="cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <EnhancedGameCanvas
                    snake={snake}
                    food={food}
                    obstacles={obstacles}
                    aiSnakes={aiSnakes}
                    gridSize={GRID_SIZE}
                    cellSize={CELL_SIZE}
                    particles={particles}
                    level={level}
                  />
                  <motion.div
                    className="mt-4 text-center rounded-xl p-4"
                    style={{
                      background: 'rgba(42, 42, 62, 0.8)',
                      border: '2px solid rgba(132, 204, 22, 0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                    animate={{
                      borderColor: ['rgba(132, 204, 22, 0.3)', 'rgba(132, 204, 22, 0.6)', 'rgba(132, 204, 22, 0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="text-lg" style={{ color: '#bef264', fontWeight: '600' }}>
                      👆 Tap anywhere to guide the snake!
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right - Stats */}
              <div>
                <GameStats
                  score={score}
                  level={level}
                  foodCounts={foodCounts}
                  totalFoodNeeded={totalFoodNeeded}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameOver' && (
        <GameOver
          score={score}
          level={level}
          reason={gameOverReason}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      {gameState === 'levelComplete' && (
        <LevelComplete
          level={level}
          score={score}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  );
}

// Helper functions
function generateRandomPosition(
  snake: Position[],
  food: Food[],
  obstacles: Obstacle[]
): Position {
  let position: Position;
  let isValid = false;

  while (!isValid) {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    isValid = 
      !snake.some(s => s.x === position.x && s.y === position.y) &&
      !food.some(f => f.x === position.x && f.y === position.y) &&
      !obstacles.some(obs => 
        position.x >= obs.x && 
        position.x < obs.x + obs.width && 
        position.y >= obs.y && 
        position.y < obs.y + obs.height
      );
  }

  return position!;
}

function generateObstacle(
  snake: Position[],
  food: Food[],
  existingObstacles: Obstacle[]
): Obstacle {
  const width = Math.floor(Math.random() * 3) + 2;
  const height = Math.floor(Math.random() * 3) + 2;
  
  let obstacle: Obstacle;
  let isValid = false;

  while (!isValid) {
    const types: Array<'panda' | 'smiley' | 'bear' | 'tree' | 'football' | 'ball' | 'robot' | 'alien' | 'mud'> = ['panda', 'smiley', 'bear', 'tree', 'football', 'ball', 'robot', 'alien', 'mud'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    // 60% chance of moving obstacles (not mud or tree)
    const isMoving = Math.random() < 0.6 && selectedType !== 'mud' && selectedType !== 'tree';
    
    obstacle = {
      x: Math.floor(Math.random() * (GRID_SIZE - width)),
      y: Math.floor(Math.random() * (GRID_SIZE - height)),
      width,
      height,
      type: selectedType,
      // Add velocity for moving obstacles
      vx: isMoving ? (Math.random() < 0.5 ? 1 : -1) : 0,
      vy: isMoving ? (Math.random() < 0.5 ? 1 : -1) : 0,
    };

    // Check if obstacle doesn't overlap with snake, food, or other obstacles
    isValid = true;
    
    for (let x = obstacle.x; x < obstacle.x + obstacle.width; x++) {
      for (let y = obstacle.y; y < obstacle.y + obstacle.height; y++) {
        if (
          snake.some(s => s.x === x && s.y === y) ||
          food.some(f => f.x === x && f.y === y) ||
          existingObstacles.some(obs =>
            x >= obs.x && x < obs.x + obs.width &&
            y >= obs.y && y < obs.y + obs.height
          )
        ) {
          isValid = false;
          break;
        }
      }
      if (!isValid) break;
    }
  }

  return obstacle!;
}

function generateAISnake(
  playerSnake: Position[],
  food: Food[],
  obstacles: Obstacle[]
): AISnake {
  const colors = ['#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const head = generateRandomPosition(playerSnake, food, obstacles);
  const length = 3;
  const segments: Position[] = [head];
  
  for (let i = 1; i < length; i++) {
    segments.push({ ...head });
  }

  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  const direction = directions[Math.floor(Math.random() * directions.length)];

  return { segments, direction, color };
}