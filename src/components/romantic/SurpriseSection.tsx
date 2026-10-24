'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Heart, RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import type { SurpriseCard } from '@/config/loveConfig';
import SectionHeading from './SectionHeading';
import DecorativeBackground from './DecorativeBackground';

interface RevealCardProps {
  card: SurpriseCard;
  index: number;
  open: boolean;
  onToggle: () => void;
}

function SurpriseCardItem({ card, index, open, onToggle }: RevealCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`relative flex h-full w-full flex-col items-start gap-3 rounded-2xl p-5 text-left transition-colors ${
        open
          ? 'bg-gradient-to-br from-[#FCEFF5] to-[#F8C8DC]/50 border border-dusty-pink/40'
          : 'glass-card-soft border border-white/60'
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
          open
            ? 'bg-dusty-pink/15 text-dusty-pink'
            : 'bg-white/70 text-soft-rose'
        }`}
      >
        {open ? (
          <Heart className="h-5 w-5 fill-dusty-pink/60 text-dusty-pink" />
        ) : (
          <Gift className="h-5 w-5" />
        )}
      </div>
      <h4 className="font-serif-romantic text-lg font-semibold text-ink">
        {card.title}
      </h4>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden text-sm leading-relaxed text-ink-soft"
          >
            {card.body}
          </motion.p>
        )}
      </AnimatePresence>
      {!open && (
        <span className="mt-auto text-xs uppercase tracking-[0.22em] text-ink-soft/80">
          tap to reveal ♡
        </span>
      )}
    </motion.button>
  );
}

function GiftBox({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="group flex flex-col items-center gap-4"
      aria-label="Open your little surprise"
    >
      <div className="relative h-28 w-32">
        {/* Box body */}
        <div className="absolute bottom-0 left-0 h-24 w-32 rounded-md bg-gradient-to-br from-[#F8C8DC] via-[#EFA8C5] to-[#D982A7] shadow-[0_14px_36px_rgba(217,130,167,0.35)]" />
        {/* Vertical ribbon */}
        <div className="absolute bottom-0 left-1/2 h-24 w-5 -translate-x-1/2 bg-dusty-pink/80" />
        {/* Lid */}
        <div className="absolute -top-2 left-1/2 h-7 w-36 -translate-x-1/2 rounded-md bg-gradient-to-br from-[#EFA8C5] to-[#D982A7] shadow-[0_6px_18px_rgba(217,130,167,0.3)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:-translate-x-1/2 group-hover:rotate-6" />
        {/* Bow */}
        <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1">
          <Heart className="h-4 w-4 fill-dusty-pink text-dusty-pink" />
          <Heart className="h-4 w-4 fill-soft-rose text-soft-rose" />
        </div>
      </div>
      <span className="text-sm font-medium text-ink-soft">
        Tap to open ♡
      </span>
    </motion.button>
  );
}

export default function SurpriseSection() {
  const { content } = useContent();
  const messages = content.surpriseMessages;
  const cards = content.surpriseCards;
  const partnerTwo = content.partnerTwo;

  const [opened, setOpened] = useState(false);
  const [openedCards, setOpenedCards] = useState<Record<number, boolean>>({});
  const [randomMsg, setRandomMsg] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const handleOpenGift = () => setOpened(true);

  const toggleCard = (idx: number) =>
    setOpenedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const handleAnotherSurprise = () => {
    if (messages.length === 0) return;
    if (messages.length === 1) {
      setRandomMsg(messages[0]);
      return;
    }
    let next = randomMsg;
    let guard = 0;
    while ((next === null || next === randomMsg) && guard < 12) {
      next = messages[Math.floor(Math.random() * messages.length)];
      guard += 1;
    }
    setRandomMsg(next);
  };

  const confettiHearts = useMemo(() => {
    if (reduceMotion || !opened) return [];
    return Array.from({ length: 18 }, () => ({
      x: (Math.random() - 0.5) * 320,
      y: -120 - Math.random() * 220,
      delay: Math.random() * 0.5,
      scale: 0.6 + Math.random() * 0.8,
      rotate: (Math.random() - 0.5) * 120,
    }));
  }, [opened, reduceMotion]);

  return (
    <section
      id="surprise"
      className="relative bg-gradient-to-b from-[#F8E9F5] via-[#FBECF6] to-[#FFF7FA] px-6 py-24"
    >
      <DecorativeBackground density="medium" hearts stars sparkles />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="A Little Surprise"
          title="One More Little Thing..."
          subtitle="Some feelings are kept for a moment like this. Here is a little something, just for you."
        />

        <div className="mt-14">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="gift"
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                <GiftBox onClick={handleOpenGift} />
              </motion.div>
            ) : (
              <motion.div
                key="opened"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                {/* Confetti hearts */}
                <div
                  aria-hidden
                  className="pointer-events-none relative flex justify-center"
                >
                  {confettiHearts.map((c, i) => (
                    <motion.div
                      key={`conf-${i}`}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 0.6, rotate: 0 }}
                      animate={{
                        opacity: [1, 1, 0],
                        x: c.x,
                        y: c.y,
                        scale: c.scale,
                        rotate: c.rotate,
                      }}
                      transition={{
                        duration: 2.4,
                        delay: c.delay,
                        ease: 'easeOut',
                        times: [0, 0.7, 1],
                      }}
                      className="absolute top-0"
                    >
                      <Heart className="h-5 w-5 fill-soft-rose/70 text-soft-rose/70" />
                    </motion.div>
                  ))}
                </div>

                {/* Main message */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative mx-auto max-w-xl rounded-2xl glass-card p-6 text-center sm:p-8"
                >
                  <Sparkles className="mx-auto mb-3 h-6 w-6 text-dusty-pink" />
                  <p className="font-serif-romantic text-xl leading-relaxed text-ink sm:text-2xl">
                    {messages[0]}
                  </p>
                  <p className="mt-4 text-sm text-ink-soft">
                    — a little something from {partnerTwo} ♡
                  </p>
                </motion.div>

                {/* Reveal cards grid */}
                {cards.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {cards.map((card, idx) => (
                      <SurpriseCardItem
                        key={`surprise-card-${idx}`}
                        card={card}
                        index={idx}
                        open={!!openedCards[idx]}
                        onToggle={() => toggleCard(idx)}
                      />
                    ))}
                  </div>
                )}

                {/* Action row */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleAnotherSurprise}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(217,130,167,0.3)] transition hover:shadow-[0_14px_36px_rgba(217,130,167,0.4)]"
                  >
                    <Shuffle className="h-4 w-4" />
                    Another Little Surprise
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpened(false);
                      setOpenedCards({});
                      setRandomMsg(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-dusty-pink/30 bg-white/70 px-5 py-2.5 text-sm text-ink backdrop-blur transition hover:bg-white"
                  >
                    <RotateCcw className="h-4 w-4 text-dusty-pink" />
                    Close &amp; start over
                  </button>
                </div>

                {/* Random message display */}
                <AnimatePresence mode="wait">
                  {randomMsg && (
                    <motion.div
                      key={randomMsg}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.97 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="mx-auto max-w-xl rounded-2xl bg-pink-pastel/25 p-5 text-center"
                    >
                      <p className="font-serif-romantic text-lg italic leading-relaxed text-ink sm:text-xl">
                        “{randomMsg}”
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
