// Game Types and Interfaces

export interface Position {
  x: number;
  y: number;
}

export interface Food {
  x: number;
  y: number;
  type: 'apple' | 'cherry' | 'banana' | 'grape';
  color: string;
  emoji: string;
  hasShield?: boolean;
  shieldHealth?: number;
  isGolden?: boolean;
  spawnTime?: number;
}

export interface PowerUp {
  x: number;
  y: number;
  type: 'speed' | 'slow' | 'grow' | 'shrink' | 'fire' | 'freeze';
  emoji: string;
  color: string;
  duration: number;
}

export interface ActivePowerUp {
  type: string;
  endTime: number;
}

export interface FoodCount {
  apple: number;
  cherry: number;
  banana: number;
  grape: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'panda' | 'smiley' | 'bear' | 'tree' | 'football' | 'ball' | 'robot' | 'alien' | 'mud';
  vx?: number;
  vy?: number;
}

export interface AISnake {
  segments: Position[];
  direction: Position;
  color: string;
}

export interface Boss {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  pattern: 'horizontal' | 'vertical' | 'circle';
  speed: number;
  emoji: string;
}

export type GameState = 'intro' | 'menu' | 'roadmap' | 'playing' | 'paused' | 'gameOver' | 'levelComplete' | 'levelPreview' | 'tutorial';
export type GameMode = 'adventure' | 'endless' | 'timeTrial' | 'practice';

export interface SnakeSkin {
  id: string;
  name: string;
  emoji: string;
  headEmoji: string;
  color: string;
  trailColor: string;
  unlockLevel: number;
  unlocked?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (stats: PlayerStats) => boolean;
  unlocked?: boolean;
}

export interface PlayerStats {
  totalFruitsCollected: number;
  totalApples: number;
  totalCherries: number;
  totalBananas: number;
  totalGrapes: number;
  totalGoldenFruits: number;
  highestCombo: number;
  totalPlayTime: number;
  totalGamesPlayed: number;
  perfectLevels: number;
  totalCollisions: number;
  fastestLevelTime: Record<number, number>;
  levelStars: Record<number, number>;
  highScore: number;
  endlessHighScore: number;
  timeTrialBestTime: Record<number, number>;
}

export interface LevelData {
  level: number;
  stars: number;
  bestTime: number;
  bestScore: number;
  played: boolean;
}

export const SNAKE_SKINS: SnakeSkin[] = [
  { id: 'default', name: 'Classic Snake', emoji: '🟢', headEmoji: '🐍', color: '#84cc16', trailColor: '#bef264', unlockLevel: 1, unlocked: true },
  { id: 'rainbow', name: 'Rainbow Snake', emoji: '🌈', headEmoji: '🐍', color: '#ec4899', trailColor: '#f0abfc', unlockLevel: 5 },
  { id: 'dragon', name: 'Dragon Snake', emoji: '🔥', headEmoji: '🐉', color: '#ef4444', trailColor: '#fca5a5', unlockLevel: 10 },
  { id: 'unicorn', name: 'Unicorn Snake', emoji: '✨', headEmoji: '🦄', color: '#a855f7', trailColor: '#e9d5ff', unlockLevel: 15 },
  { id: 'robot', name: 'Robot Snake', emoji: '⚡', headEmoji: '🤖', color: '#06b6d4', trailColor: '#67e8f9', unlockLevel: 20 },
  { id: 'candy', name: 'Candy Snake', emoji: '🍬', headEmoji: '🍭', color: '#f472b6', trailColor: '#fbcfe8', unlockLevel: 25 },
  { id: 'neon', name: 'Neon Snake', emoji: '💡', headEmoji: '🐍', color: '#22d3ee', trailColor: '#a5f3fc', unlockLevel: 30 },
  { id: 'gold', name: 'Golden Snake', emoji: '👑', headEmoji: '🐍', color: '#fbbf24', trailColor: '#fde047', unlockLevel: 35 },
];

export type SnakeEmotion = 'neutral' | 'happy' | 'excited' | 'scared' | 'dizzy' | 'angry';

export const POWER_UP_CONFIGS = {
  speed: { emoji: '⚡', color: '#fbbf24', duration: 5000, name: 'Speed Boost' },
  slow: { emoji: '🐌', color: '#60a5fa', duration: 5000, name: 'Slow Motion' },
  grow: { emoji: '📏', color: '#a855f7', duration: 8000, name: 'Grow Bigger' },
  shrink: { emoji: '🔻', color: '#34d399', duration: 8000, name: 'Shrink Down' },
  fire: { emoji: '🔥', color: '#ef4444', duration: 6000, name: 'Fire Breath' },
  freeze: { emoji: '❄️', color: '#22d3ee', duration: 7000, name: 'Freeze Time' },
};
