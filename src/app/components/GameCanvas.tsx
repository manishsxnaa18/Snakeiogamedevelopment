import { useEffect, useRef } from 'react';

interface Food {
  x: number;
  y: number;
  type: 'apple' | 'cherry' | 'banana' | 'grape';
  color: string;
  emoji: string;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AISnake {
  segments: { x: number; y: number }[];
  direction: { x: number; y: number };
  color: string;
}

interface GameCanvasProps {
  snake: { x: number; y: number }[];
  food: Food[];
  obstacles: Obstacle[];
  aiSnakes: AISnake[];
  gridSize: number;
  cellSize: number;
}

export function GameCanvas({ snake, food, obstacles, aiSnakes, gridSize, cellSize }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw obstacles
    obstacles.forEach(obstacle => {
      const gradient = ctx.createLinearGradient(
        obstacle.x * cellSize,
        obstacle.y * cellSize,
        (obstacle.x + obstacle.width) * cellSize,
        (obstacle.y + obstacle.height) * cellSize
      );
      gradient.addColorStop(0, '#94a3b8');
      gradient.addColorStop(1, '#475569');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(
        obstacle.x * cellSize + 2,
        obstacle.y * cellSize + 2,
        obstacle.width * cellSize - 4,
        obstacle.height * cellSize - 4
      );
      
      // Add border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        obstacle.x * cellSize + 2,
        obstacle.y * cellSize + 2,
        obstacle.width * cellSize - 4,
        obstacle.height * cellSize - 4
      );
    });

    // Draw AI snakes
    aiSnakes.forEach(aiSnake => {
      aiSnake.segments.forEach((segment, index) => {
        const size = cellSize - 4;
        const x = segment.x * cellSize + 2;
        const y = segment.y * cellSize + 2;

        // 3D effect with gradient
        const gradient = ctx.createRadialGradient(
          x + size / 2,
          y + size / 2,
          size / 4,
          x + size / 2,
          y + size / 2,
          size / 2
        );
        
        if (index === 0) {
          // Head - lighter
          gradient.addColorStop(0, '#fbbf24');
          gradient.addColorStop(1, '#f59e0b');
        } else {
          gradient.addColorStop(0, aiSnake.color);
          gradient.addColorStop(1, adjustBrightness(aiSnake.color, -30));
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x + size / 3, y + size / 3, size / 5, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Draw food
    food.forEach(item => {
      const x = item.x * cellSize + cellSize / 2;
      const y = item.y * cellSize + cellSize / 2;
      
      // Draw emoji-style food
      ctx.font = `${cellSize - 8}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.emoji, x, y);
    });

    // Draw player snake with 3D effect
    snake.forEach((segment, index) => {
      const size = cellSize - 4;
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;

      // Create 3D gradient
      const gradient = ctx.createRadialGradient(
        x + size / 2,
        y + size / 2,
        size / 4,
        x + size / 2,
        y + size / 2,
        size / 2
      );

      if (index === 0) {
        // Head - bright green
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(1, '#22c55e');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + size / 3, y + size / 3, size / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 2 * size / 3, y + size / 3, size / 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + size / 3, y + size / 3, size / 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 2 * size / 3, y + size / 3, size / 12, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body - gradient from green to darker green
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#059669');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add shine/highlight for 3D effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(x + size / 3, y + size / 3, size / 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [snake, food, obstacles, aiSnakes, gridSize, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      width={gridSize * cellSize}
      height={gridSize * cellSize}
      className="border-4 border-purple-500 rounded-lg shadow-2xl"
    />
  );
}

function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
