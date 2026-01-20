import { Achievement, PlayerStats } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first level',
    emoji: '👶',
    condition: (stats) => stats.totalGamesPlayed >= 1,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 5 levels in under 30 seconds each',
    emoji: '⚡',
    condition: (stats) => {
      const fastLevels = Object.values(stats.fastestLevelTime).filter(time => time < 30000);
      return fastLevels.length >= 5;
    },
  },
  {
    id: 'fruit_master',
    name: 'Fruit Master',
    description: 'Collect 100 fruits',
    emoji: '🍎',
    condition: (stats) => stats.totalFruitsCollected >= 100,
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete 10 levels without hitting obstacles',
    emoji: '🛡️',
    condition: (stats) => stats.perfectLevels >= 10,
  },
  {
    id: 'snake_charmer',
    name: 'Snake Charmer',
    description: 'Reach level 20',
    emoji: '🎵',
    condition: (stats) => Object.keys(stats.levelStars).length >= 20,
  },
  {
    id: 'combo_king',
    name: 'Combo King',
    description: 'Achieve a 10x combo',
    emoji: '🔥',
    condition: (stats) => stats.highestCombo >= 10,
  },
  {
    id: 'golden_hunter',
    name: 'Golden Hunter',
    description: 'Collect 10 golden fruits',
    emoji: '⭐',
    condition: (stats) => stats.totalGoldenFruits >= 10,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get 3 stars on 15 levels',
    emoji: '💎',
    condition: (stats) => {
      const threeStarLevels = Object.values(stats.levelStars).filter(stars => stars === 3);
      return threeStarLevels.length >= 15;
    },
  },
  {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Play for 1 hour total',
    emoji: '🏃',
    condition: (stats) => stats.totalPlayTime >= 3600000,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete all 40 levels',
    emoji: '🏆',
    condition: (stats) => Object.keys(stats.levelStars).length >= 40,
  },
];

export function checkAchievements(stats: PlayerStats): Achievement[] {
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: achievement.condition(stats),
  }));
}

export function getNewlyUnlockedAchievements(
  oldStats: PlayerStats,
  newStats: PlayerStats
): Achievement[] {
  const oldAchievements = checkAchievements(oldStats);
  const newAchievements = checkAchievements(newStats);
  
  return newAchievements.filter((newAch, index) => {
    return newAch.unlocked && !oldAchievements[index].unlocked;
  });
}
