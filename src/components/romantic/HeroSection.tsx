'use client';

import { motion } from 'framer-motion';
import { BookHeart, Gift, Heart } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import DecorativeBackground from './DecorativeBackground';

interface HeroSectionProps {
  onExplore: () => void;
  onSurprise: () => void;
}

function OrbitingHearts() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      {/* Orbit ring */}
      <span className="absolute inset-0 rounded-full border border-dashed border-dusty-pink/40" />

      {/* Center heart */}
      <Heart className="relative h-9 w-9 animate-breathe fill-dusty-pink text-dusty-pink" />

      {/* Orbiting hearts via orbit-slow keyframe */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          ['--orbit-radius' as never]: '40px',
          animation: 'orbit-slow 10s linear infinite',
        }}
      >
        <Heart className="block h-5 w-5 -translate-x-1/2 -translate-y-1/2 fill-soft-rose text-soft-rose" />
      </div>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          ['--orbit-radius' as never]: '40px',
          animation: 'orbit-slow 10s linear infinite',
          animationDelay: '-5s',
        }}
      >
        <Heart className="block h-4 w-4 -translate-x-1/2 -translate-y-1/2 fill-dusty-pink/70 text-dusty-pink/70" />
      </div>
    </div>
  );
}

function FlowerCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      <g opacity="0.45">
        <circle cx="50" cy="35" r="11" fill="#EFA8C5" />
        <circle cx="50" cy="65" r="11" fill="#EFA8C5" />
        <circle cx="35" cy="50" r="11" fill="#EFA8C5" />
        <circle cx="65" cy="50" r="11" fill="#EFA8C5" />
        <circle cx="50" cy="50" r="8" fill="#F8C8DC" />
        <circle cx="50" cy="50" r="4" fill="#FFF6E0" />
      </g>
    </svg>
  );
}

export default function HeroSection({ onExplore, onSurprise }: HeroSectionProps) {
  const { content } = useContent();
  const { partnerOne, partnerTwo, heroSubtitle } = content;

  return (
    <section
      id="home"
      className="gradient-pan relative min-h-[100svh] overflow-hidden bg-dreamy"
    >
      <DecorativeBackground density="high" moon hearts stars sparkles />

      {/* Flower corner ornaments */}
      <FlowerCorner className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rotate-12 opacity-70" />
      <FlowerCorner className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 -rotate-12 opacity-70" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-dusty-pink/30 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft backdrop-blur"
        >
          A little gift, made with love
        </motion.span>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6"
        >
          <OrbitingHearts />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 font-serif-romantic text-5xl font-bold leading-tight sm:text-7xl md:text-8xl"
        >
          <span className="shimmer-text">Our Little</span>
          <br />
          <span className="shimmer-text">Universe</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-5 inline-flex items-center gap-3 rounded-full border border-dusty-pink/30 bg-white/70 px-5 py-2 backdrop-blur"
        >
          <span className="font-serif-romantic text-lg font-medium text-ink">{partnerOne}</span>
          <Heart className="h-4 w-4 animate-breathe fill-soft-rose text-soft-rose" />
          <span className="font-serif-romantic text-lg font-medium text-ink">{partnerTwo}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 max-w-xl font-sans-romantic text-base leading-relaxed text-ink-soft sm:text-lg"
        >
          {heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-6 py-3 text-white shadow-lg transition hover:scale-[1.03]"
          >
            <BookHeart className="h-4 w-4" />
            Explore Our Story
          </button>
          <button
            type="button"
            onClick={onSurprise}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-dusty-pink/40 bg-white/70 px-6 py-3 text-ink shadow-sm backdrop-blur transition hover:scale-[1.03]"
          >
            <Gift className="h-4 w-4" />
            A Little Surprise
          </button>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-soft"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-5 rounded-full border-2 border-dusty-pink/40"
          >
            <div className="mx-auto mt-1.5 h-1.5 w-1 rounded-full bg-dusty-pink/60" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
