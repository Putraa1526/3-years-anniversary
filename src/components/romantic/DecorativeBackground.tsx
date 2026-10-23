'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';

type Density = 'low' | 'medium' | 'high';

interface DecorativeBackgroundProps {
  density?: Density;
  hearts?: boolean;
  stars?: boolean;
  sparkles?: boolean;
  moon?: boolean;
  className?: string;
}

const DENSITY_COUNT: Record<Density, number> = {
  low: 6,
  medium: 10,
  high: 14,
};

interface Position {
  top: number;
  left: number;
  size: number;
  delay: number;
}

function makePositions(n: number): Position[] {
  return Array.from({ length: n }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 10 + Math.random() * 18,
    delay: Math.random() * 3,
  }));
}

export default function DecorativeBackground({
  density = 'medium',
  hearts = true,
  stars = true,
  sparkles = true,
  moon = false,
  className,
}: DecorativeBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = DENSITY_COUNT[density];
  const heartsCount = Math.max(4, Math.floor(count * 0.6));
  const sparklesCount = Math.max(3, Math.floor(count * 0.4));

  const starPositions = useMemo(() => makePositions(count), [count]);
  const heartPositions = useMemo(() => makePositions(heartsCount), [heartsCount]);
  const sparklePositions = useMemo(() => makePositions(sparklesCount), [sparklesCount]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
    >
      {moon && (
        <div className="absolute right-8 top-10 sm:right-16 sm:top-16">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFF6E0] to-[#F8C8DC] shadow-[0_0_40px_rgba(248,200,220,0.6)]" />
            <div className="absolute right-[-12px] top-[-8px] h-12 w-12 rounded-full bg-[#FFF7FA] sm:h-14 sm:w-14" />
          </div>
          <svg
            className="absolute -bottom-4 -left-12 h-9 w-28 opacity-80"
            viewBox="0 0 120 32"
            fill="white"
          >
            <ellipse cx="22" cy="20" rx="20" ry="11" />
            <ellipse cx="55" cy="14" rx="24" ry="14" />
            <ellipse cx="90" cy="20" rx="20" ry="11" />
          </svg>
        </div>
      )}

      {mounted && stars && (
        <>
          {starPositions.map((p, i) => (
            <Star
              key={`star-${i}`}
              fill="currentColor"
              className="absolute animate-twinkle text-dusty-pink/70"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </>
      )}

      {mounted && hearts && (
        <>
          {heartPositions.map((p, i) => (
            <Heart
              key={`heart-${i}`}
              fill="currentColor"
              className="absolute animate-float-soft text-soft-rose/60"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </>
      )}

      {mounted && sparkles && (
        <>
          {sparklePositions.map((p, i) => (
            <Sparkles
              key={`sparkle-${i}`}
              className="absolute animate-twinkle text-dusty-pink/50"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
