export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'sparkle' | 'food' | 'explosion';
  emoji?: string;
}

export function createParticles(
  x: number,
  y: number,
  color: string,
  type: 'sparkle' | 'food' | 'explosion',
  emoji?: string
): Particle[] {
  const particles: Particle[] = [];
  const count = type === 'explosion' ? 20 : type === 'food' ? 15 : 8;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = type === 'explosion' ? 2 + Math.random() * 3 : 1 + Math.random() * 2;
    
    particles.push({
      id: `${Date.now()}-${i}`,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color,
      size: type === 'explosion' ? 4 + Math.random() * 4 : 3 + Math.random() * 3,
      type,
      emoji: type === 'food' ? emoji : undefined,
    });
  }

  return particles;
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.1, // gravity
      life: p.life - 0.02,
    }))
    .filter(p => p.life > 0);
}
