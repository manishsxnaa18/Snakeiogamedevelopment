// Calculate star rating based on performance
export function calculateStars(params: {
  timeInSeconds: number;
  score: number;
  level: number;
  hadCollision: boolean;
  totalFoodNeeded: number;
}): number {
  const { timeInSeconds, hadCollision, level } = params;
  
  // Base target time: 60 seconds for level 1, decreases slightly for higher levels
  const targetTime = Math.max(30, 60 - level);
  const fastTime = targetTime * 0.6; // 60% of target time = excellent
  const okTime = targetTime * 1.2; // 120% of target time = ok
  
  let stars = 1; // Always at least 1 star for completing
  
  // Star 2: Complete in reasonable time
  if (timeInSeconds <= okTime) {
    stars = 2;
  }
  
  // Star 3: Fast time AND no collisions (perfect run)
  if (timeInSeconds <= fastTime && !hadCollision) {
    stars = 3;
  }
  
  return stars;
}

export function getStarMessage(stars: number): string {
  switch (stars) {
    case 3:
      return 'PERFECT! ✨';
    case 2:
      return 'GREAT JOB! 🌟';
    case 1:
      return 'GOOD! ⭐';
    default:
      return 'COMPLETED! 🎉';
  }
}

export function getStarColor(index: number, totalStars: number): string {
  if (index < totalStars) {
    return '#fbbf24'; // Gold for earned stars
  }
  return '#4b5563'; // Gray for unearned stars
}
