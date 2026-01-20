import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Particle, updateParticles } from './Particle';

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
  type: 'panda' | 'smiley' | 'bear' | 'tree' | 'football' | 'ball' | 'robot' | 'alien' | 'mud';
}

interface AISnake {
  segments: { x: number; y: number }[];
  direction: { x: number; y: number };
  color: string;
}

interface EnhancedGameCanvasProps {
  snake: { x: number; y: number }[];
  food: Food[];
  obstacles: Obstacle[];
  aiSnakes: AISnake[];
  gridSize: number;
  cellSize: number;
  particles: Particle[];
  level?: number; // Add level prop
}

export function EnhancedGameCanvas({ 
  snake, 
  food, 
  obstacles, 
  aiSnakes, 
  gridSize, 
  cellSize,
  particles,
  level = 1 // Default level to 1
}: EnhancedGameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [time, setTime] = useState(0);

  // Draw hexagon
  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, fill: string, stroke?: string) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationTime = 0;

    const animate = () => {
      animationTime += 0.05;
      setTime(animationTime);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw simple black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines for levels 1-10 only
      if (level <= 10) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)'; // Faint yellow grid lines
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= gridSize; x++) {
          ctx.beginPath();
          ctx.moveTo(x * cellSize, 0);
          ctx.lineTo(x * cellSize, canvas.height);
          ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= gridSize; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * cellSize);
          ctx.lineTo(canvas.width, y * cellSize);
          ctx.stroke();
        }
      }

      // Draw obstacles with different visual styles based on type
      obstacles.forEach(obstacle => {
        const x = obstacle.x * cellSize;
        const y = obstacle.y * cellSize;
        const w = obstacle.width * cellSize;
        const h = obstacle.height * cellSize;

        const centerX = x + w / 2;
        const centerY = y + h / 2;
        
        // Get emoji and colors based on type
        let emoji = '';
        let bgGradientStart = '';
        let bgGradientEnd = '';
        let glowColor = '';
        
        if (obstacle.type === 'tree') {
          emoji = '🌳';
          bgGradientStart = '#4ade80';
          bgGradientEnd = '#16a34a';
          glowColor = 'rgba(74, 222, 128, 0.6)';
        } else if (obstacle.type === 'panda') {
          emoji = '🐼';
          bgGradientStart = '#f0abfc';
          bgGradientEnd = '#c026d3';
          glowColor = 'rgba(240, 171, 252, 0.7)';
        } else if (obstacle.type === 'smiley') {
          emoji = '😄';
          bgGradientStart = '#fde047';
          bgGradientEnd = '#facc15';
          glowColor = 'rgba(253, 224, 71, 0.7)';
        } else if (obstacle.type === 'bear') {
          emoji = '🐻';
          bgGradientStart = '#fb923c';
          bgGradientEnd = '#ea580c';
          glowColor = 'rgba(251, 146, 60, 0.7)';
        } else if (obstacle.type === 'football') {
          emoji = '⚽';
          bgGradientStart = '#60a5fa';
          bgGradientEnd = '#2563eb';
          glowColor = 'rgba(96, 165, 250, 0.7)';
        } else if (obstacle.type === 'ball') {
          emoji = '🏀';
          bgGradientStart = '#f97316';
          bgGradientEnd = '#c2410c';
          glowColor = 'rgba(249, 115, 22, 0.7)';
        } else if (obstacle.type === 'robot') {
          emoji = '🤖';
          bgGradientStart = '#a78bfa';
          bgGradientEnd = '#7c3aed';
          glowColor = 'rgba(167, 139, 250, 0.7)';
        } else if (obstacle.type === 'alien') {
          emoji = '👽';
          bgGradientStart = '#34d399';
          bgGradientEnd = '#059669';
          glowColor = 'rgba(52, 211, 153, 0.7)';
        } else if (obstacle.type === 'mud') {
          emoji = '泥';
          bgGradientStart = '#9ca3af';
          bgGradientEnd = '#6b7280';
          glowColor = 'rgba(156, 163, 175, 0.7)';
        }

        // Draw animated glow
        const pulse = Math.sin(animationTime * 2) * 0.3 + 0.7;
        const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(w, h));
        glowGradient.addColorStop(0, glowColor);
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.globalAlpha = pulse * 0.4;
        ctx.fillStyle = glowGradient;
        ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
        ctx.globalAlpha = 1;

        // Draw rounded rectangle background with gradient
        const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
        gradient.addColorStop(0, bgGradientStart);
        gradient.addColorStop(1, bgGradientEnd);
        ctx.fillStyle = gradient;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15 * pulse;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 12);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Add border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 12);
        ctx.stroke();

        // Add highlight
        const highlightGradient = ctx.createLinearGradient(x, y, x, y + h / 3);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 4, w - 8, h / 3, 8);
        ctx.fill();

        // Draw emoji in center
        const emojiSize = Math.min(w, h) * 0.6;
        ctx.font = `${emojiSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add floating animation
        const float = Math.sin(animationTime * 3 + obstacle.x + obstacle.y) * 3;
        ctx.fillText(emoji, centerX, centerY + float);
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.globalAlpha = particle.life;
        
        if (particle.emoji) {
          ctx.font = `${particle.size * 2}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(particle.emoji, particle.x, particle.y);
        } else {
          const sparkleGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          sparkleGradient.addColorStop(0, particle.color);
          sparkleGradient.addColorStop(0.5, particle.color + '88');
          sparkleGradient.addColorStop(1, particle.color + '00');
          
          ctx.fillStyle = sparkleGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.globalAlpha = 1;
      });

      // Draw food with glow and bounce
      food.forEach((item, index) => {
        const x = item.x * cellSize + cellSize / 2;
        const y = item.y * cellSize + cellSize / 2;
        const bounce = Math.sin(animationTime * 2 + index) * 3;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(x, y - bounce, 0, x, y - bounce, cellSize * 1.2);
        glowGradient.addColorStop(0, item.color + 'aa');
        glowGradient.addColorStop(0.5, item.color + '44');
        glowGradient.addColorStop(1, item.color + '00');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y - bounce, cellSize * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y + cellSize / 4, cellSize / 3, cellSize / 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Food emoji
        const scale = 1 + Math.sin(animationTime * 2 + index) * 0.08;
        ctx.save();
        ctx.translate(x, y - bounce);
        ctx.scale(scale, scale);
        ctx.font = `${cellSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.emoji, 0, 0);
        ctx.restore();
      });

      // Draw AI snakes with 3D segmented style
      aiSnakes.forEach((aiSnake, snakeIndex) => {
        const snakeColors = [
          { light: '#60a5fa', mid: '#3b82f6', dark: '#2563eb' }, // Blue
          { light: '#a78bfa', mid: '#8b5cf6', dark: '#7c3aed' }, // Purple
          { light: '#fb923c', mid: '#f97316', dark: '#ea580c' }, // Orange
          { light: '#22d3ee', mid: '#06b6d4', dark: '#0891b2' }, // Cyan
        ];
        const colors = snakeColors[snakeIndex % snakeColors.length];

        aiSnake.segments.forEach((segment, index) => {
          const x = segment.x * cellSize + cellSize / 2;
          const y = segment.y * cellSize + cellSize / 2;
          const size = index === 0 ? cellSize - 4 : cellSize - 6;
          const radius = size / 2;

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.arc(x + 3, y + 5, radius, 0, Math.PI * 2);
          ctx.fill();

          // 3D gradient body
          const gradient = ctx.createRadialGradient(
            x - radius / 3,
            y - radius / 3,
            0,
            x,
            y,
            radius
          );
          
          if (index === 0) {
            // Head - slightly different color
            gradient.addColorStop(0, colors.light);
            gradient.addColorStop(0.6, colors.mid);
            gradient.addColorStop(1, colors.dark);
          } else {
            gradient.addColorStop(0, colors.light);
            gradient.addColorStop(0.6, colors.mid);
            gradient.addColorStop(1, colors.dark);
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();

          // Glossy highlight
          const highlightGradient = ctx.createRadialGradient(
            x - radius / 3,
            y - radius / 3,
            0,
            x - radius / 3,
            y - radius / 3,
            radius / 2
          );
          highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = highlightGradient;
          ctx.beginPath();
          ctx.arc(x - radius / 4, y - radius / 4, radius / 3, 0, Math.PI * 2);
          ctx.fill();

          // Inner ring for depth
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, radius - 2, 0, Math.PI * 2);
          ctx.stroke();

          // Eyes for head
          if (index === 0) {
            const eyeSize = radius / 4;
            const eyeOffsetX = radius / 2.5;
            const eyeOffsetY = radius / 3;
            
            // Left eye white
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x - eyeOffsetX, y - eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Left eye pupil
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.arc(x - eyeOffsetX + 1, y - eyeOffsetY, eyeSize / 1.8, 0, Math.PI * 2);
            ctx.fill();
            
            // Left eye shine
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x - eyeOffsetX - 1, y - eyeOffsetY - 1, eyeSize / 4, 0, Math.PI * 2);
            ctx.fill();

            // Right eye white
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x + eyeOffsetX, y - eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Right eye pupil
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.arc(x + eyeOffsetX + 1, y - eyeOffsetY, eyeSize / 1.8, 0, Math.PI * 2);
            ctx.fill();
            
            // Right eye shine
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x + eyeOffsetX - 1, y - eyeOffsetY - 1, eyeSize / 4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      // Draw player snake with 3D segmented style matching reference image
      snake.forEach((segment, index) => {
        const x = segment.x * cellSize + cellSize / 2;
        const y = segment.y * cellSize + cellSize / 2;
        const size = index === 0 ? cellSize - 2 : cellSize - 4;
        const radius = size / 2;
        
        const pulseEffect = Math.sin(animationTime * 3 + index * 0.3) * 0.05;
        const currentRadius = radius * (1 + pulseEffect);

        // Outer glow (prominent like reference)
        const glowGradient = ctx.createRadialGradient(x, y, currentRadius, x, y, currentRadius * 2);
        glowGradient.addColorStop(0, 'rgba(190, 242, 100, 0.8)');
        glowGradient.addColorStop(0.5, 'rgba(132, 204, 22, 0.4)');
        glowGradient.addColorStop(1, 'rgba(132, 204, 22, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, currentRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(x + 3, y + 5, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Main body - lime/green color with radial gradient
        const gradient = ctx.createRadialGradient(
          x - currentRadius / 3,
          y - currentRadius / 3,
          0,
          x,
          y,
          currentRadius
        );
        
        if (index === 0) {
          // Head - brighter
          gradient.addColorStop(0, '#bef264'); // lime-300
          gradient.addColorStop(0.6, '#84cc16'); // lime-500
          gradient.addColorStop(1, '#65a30d'); // lime-600
        } else {
          gradient.addColorStop(0, '#a3e635'); // lime-400
          gradient.addColorStop(0.6, '#84cc16'); // lime-500
          gradient.addColorStop(1, '#65a30d'); // lime-600
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Glossy highlight
        const highlightGradient = ctx.createRadialGradient(
          x - currentRadius / 3,
          y - currentRadius / 3,
          0,
          x - currentRadius / 3,
          y - currentRadius / 3,
          currentRadius / 2
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(x - currentRadius / 4, y - currentRadius / 4, currentRadius / 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Simple head details - like reference image
        if (index === 0) {
          // Simple dot eyes
          const eyeSize = currentRadius / 6;
          const eyeOffsetX = currentRadius / 2.5;
          const eyeOffsetY = currentRadius / 4;
          
          // Left eye - just a black dot
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(x - eyeOffsetX, y - eyeOffsetY, eyeSize, 0, Math.PI * 2);
          ctx.fill();

          // Right eye - just a black dot
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(x + eyeOffsetX, y - eyeOffsetY, eyeSize, 0, Math.PI * 2);
          ctx.fill();

          // Simple smile - curved line
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(x, y + eyeOffsetY, currentRadius / 3, 0.2, Math.PI - 0.2);
          ctx.stroke();
        }

        // Yellow length badge on middle segment (like reference image)
        if (index === Math.floor(snake.length / 2)) {
          const badgeRadius = currentRadius * 0.85;
          
          // Badge outer glow
          const badgeGlowGradient = ctx.createRadialGradient(x, y, badgeRadius, x, y, badgeRadius * 1.8);
          badgeGlowGradient.addColorStop(0, 'rgba(250, 204, 21, 0.6)');
          badgeGlowGradient.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = badgeGlowGradient;
          ctx.beginPath();
          ctx.arc(x, y, badgeRadius * 1.8, 0, Math.PI * 2);
          ctx.fill();
          
          // Badge background with gradient
          const badgeGradient = ctx.createRadialGradient(
            x - badgeRadius / 3,
            y - badgeRadius / 3,
            0,
            x,
            y,
            badgeRadius
          );
          badgeGradient.addColorStop(0, '#fef08a');
          badgeGradient.addColorStop(0.7, '#fde047');
          badgeGradient.addColorStop(1, '#facc15');
          ctx.fillStyle = badgeGradient;
          ctx.beginPath();
          ctx.arc(x, y, badgeRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Badge border
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(x, y, badgeRadius, 0, Math.PI * 2);
          ctx.stroke();
          
          // Length number
          ctx.fillStyle = '#000000';
          ctx.font = `bold ${badgeRadius * 1.2}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(snake.length.toString(), x, y);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [snake, food, obstacles, aiSnakes, gridSize, cellSize, particles, level]);

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        width={gridSize * cellSize}
        height={gridSize * cellSize}
        className="rounded-2xl shadow-2xl"
        style={{
          background: '#000000',
          border: '6px solid #fbbf24',
          boxShadow: '0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.3)'
        }}
      />
    </motion.div>
  );
}

function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}