'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import DecorativeBackground from './DecorativeBackground';

interface WelcomeScreenProps {
  onEnter: () => void;
}

interface EnvelopeProps {
  opening: boolean;
}

function Envelope({ opening }: EnvelopeProps) {
  return (
    <div className="relative h-40 w-56 sm:h-48 sm:w-64">
      {/* Letter peeking out */}
      <motion.div
        className="absolute left-1/2 top-3 z-10 h-32 w-44 -translate-x-1/2 rounded-md bg-white p-3 shadow-md sm:h-36 sm:w-52"
        style={{ opacity: 0 }}
        animate={opening ? { y: -34, opacity: 1 } : { y: 0, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
          <Heart className="h-4 w-4 fill-dusty-pink/70 text-dusty-pink/70" />
          <span className="font-serif-romantic text-sm text-ink">A little letter…</span>
        </div>
      </motion.div>

      {/* Envelope body */}
      <div className="absolute inset-0 rounded-lg bg-white shadow-lg" />
      <div className="absolute bottom-0 left-0 right-0 top-1/2 overflow-hidden rounded-b-lg">
        <svg viewBox="0 0 224 80" preserveAspectRatio="none" className="h-full w-full">
          <polygon points="0,0 224,0 112,72" fill="#FBE6F0" />
        </svg>
      </div>

      {/* Flap */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-1/2 w-full"
        style={{ transformOrigin: 'top' }}
        animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 224 80" preserveAspectRatio="none" className="h-full w-full">
          <polygon points="0,0 224,0 112,72" fill="#F8C8DC" />
        </svg>
      </motion.div>

      {/* Heart seal */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        animate={opening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-dusty-pink to-soft-rose text-white shadow-md">
          <Heart className="h-5 w-5 fill-current" />
        </div>
      </motion.div>

      {/* Hearts flying outward */}
      {opening &&
        Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const distance = 60 + (i % 3) * 22;
          return (
            <motion.div
              key={`fly-heart-${i}`}
              className="absolute left-1/2 top-1/2"
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: [0, 1, 0],
                scale: 1,
              }}
              transition={{ duration: 1, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
            >
              <Heart className="h-4 w-4 fill-dusty-pink text-dusty-pink" />
            </motion.div>
          );
        })}
    </div>
  );
}

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const { content } = useContent();
  const { partnerOne, partnerTwo } = content;
  const [opening, setOpening] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(() => setShowGreeting(true), 900);
    setTimeout(() => onEnter(), 2200);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="welcome"
        exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="grain fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-dreamy px-6"
      >
        <DecorativeBackground density="high" moon hearts stars sparkles />

        <button
          type="button"
          onClick={onEnter}
          className="absolute right-5 top-5 z-50 rounded-full border border-dusty-pink/30 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft backdrop-blur transition hover:text-ink"
        >
          Skip Intro
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-dusty-pink/80">
            Someone made a little world just for you…
          </p>

          <h1 className="mt-4 font-serif-romantic text-4xl font-semibold text-ink sm:text-5xl">
            <span>{partnerOne}</span>
            <Heart className="mx-3 inline-block h-7 w-7 fill-soft-rose text-soft-rose" />
            <span>{partnerTwo}</span>
          </h1>

          <div className="mt-8">
            <Envelope opening={opening} />
          </div>

          <AnimatePresence mode="wait">
            {!showGreeting ? (
              <motion.button
                key="cta"
                type="button"
                onClick={handleOpen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-7 py-3.5 text-white shadow-lg transition hover:scale-[1.03]"
              >
                <Sparkles className="h-4 w-4" />
                Open Our World
                <Heart className="h-4 w-4 fill-current" />
              </motion.button>
            ) : (
              <motion.p
                key="greeting"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 font-serif-romantic text-2xl text-ink"
              >
                Hi, {partnerOne} ♡
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
