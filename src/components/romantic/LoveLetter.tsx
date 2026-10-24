'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Heart, MailOpen } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import SectionHeading from './SectionHeading';

function SealedEnvelope({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-8"
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Open the letter"
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative h-56 w-72 cursor-pointer select-none outline-none"
      >
        {/* Envelope body */}
        <div className="absolute inset-x-0 bottom-0 h-44 rounded-b-lg rounded-t-md bg-gradient-to-br from-[#F8C8DC] via-[#EFA8C5] to-[#D982A7] shadow-[0_18px_45px_rgba(217,130,167,0.35)]" />

        {/* Address lines */}
        <div className="absolute bottom-4 left-1/2 w-48 -translate-x-1/2 space-y-2 text-center">
          <p className="handwriting text-base text-white/95">To my love</p>
          <div className="mx-auto h-px w-40 bg-white/60" />
          <div className="mx-auto h-px w-32 bg-white/40" />
          <div className="mx-auto h-px w-36 bg-white/30" />
        </div>

        {/* Stamp */}
        <div className="absolute right-3 top-3 flex h-12 w-10 items-center justify-center rounded-sm border border-white/70 bg-white/85 shadow-sm">
          <Heart className="h-5 w-5 fill-dusty-pink/80 text-dusty-pink/80" />
        </div>

        {/* Heart seal */}
        <motion.div
          aria-hidden
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-24 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_6px_18px_rgba(217,130,167,0.45)] ring-2 ring-dusty-pink/30"
        >
          <Heart className="h-6 w-6 fill-dusty-pink text-dusty-pink" />
        </motion.div>

        {/* Flap (SVG triangle) */}
        <svg
          aria-hidden
          viewBox="0 0 288 112"
          className="absolute inset-x-0 top-0 h-24 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCEFF5" />
              <stop offset="100%" stopColor="#EFA8C5" />
            </linearGradient>
          </defs>
          <path
            d="M0 0 L288 0 L144 104 Z"
            fill="url(#env-flap)"
            className="drop-shadow-[0_-4px_10px_rgba(217,130,167,0.18)]"
          />
        </svg>

        {/* Subtle hover hint */}
        <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.22em] text-ink-soft/80 transition-opacity group-hover:opacity-0">
          tap to open ♡
        </span>
      </motion.div>

      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-6 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(217,130,167,0.35)] transition hover:shadow-[0_14px_36px_rgba(217,130,167,0.45)]"
      >
        <MailOpen className="h-4 w-4" />
        Open My Letter
      </button>
    </motion.div>
  );
}

function LetterPaper({
  greeting,
  paragraphs,
  closing,
  signOff,
  signature,
  visibleParagraphs,
  revealed,
  onShowAll,
}: {
  greeting: string;
  paragraphs: string[];
  closing: string;
  signOff: string;
  signature: string;
  visibleParagraphs: number;
  revealed: boolean;
  onShowAll: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-2xl"
    >
      {/* Corner hearts */}
      <Heart
        aria-hidden
        className="absolute -left-3 -top-3 h-6 w-6 fill-soft-rose/40 text-soft-rose/40"
      />
      <Heart
        aria-hidden
        className="absolute -bottom-3 -right-3 h-6 w-6 fill-dusty-pink/40 text-dusty-pink/40"
      />

      <div
        className="relative rounded-2xl bg-[#FDF8F3] px-7 py-10 shadow-[0_20px_60px_rgba(217,130,167,0.18)] sm:px-12 sm:py-14"
        style={{
          backgroundImage:
            'repeating-linear-gradient(transparent, transparent 31px, rgba(217,130,167,0.18) 32px)',
        }}
      >
        <p className="handwriting text-2xl text-ink sm:text-3xl">{greeting}</p>

        <div className="mt-6 space-y-5">
          <AnimatePresence initial={false}>
            {paragraphs.slice(0, visibleParagraphs).map((p, i) => (
              <motion.p
                key={`letter-p-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans-romantic text-base leading-relaxed text-ink sm:text-lg"
              >
                {p}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-right"
          >
            <p className="font-sans-romantic text-base text-ink-soft">
              {closing}
            </p>
            <p className="handwriting mt-2 text-2xl text-dusty-pink sm:text-3xl">
              {signOff} {signature}
            </p>
          </motion.div>
        )}

        {!revealed && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onShowAll}
              className="inline-flex items-center gap-2 rounded-full border border-dusty-pink/40 bg-white/70 px-5 py-2.5 text-sm text-ink backdrop-blur transition hover:bg-white"
            >
              <Eye className="h-4 w-4 text-dusty-pink" />
              Show the whole letter
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function LoveLetter() {
  const { content } = useContent();
  const letter = content.letter;
  const total = letter.paragraphs.length;

  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const skipReveal = useRef(false);

  useEffect(() => {
    if (!opened) return;
    if (skipReveal.current) {
      setVisibleParagraphs(total);
      setRevealed(true);
      return;
    }
    if (visibleParagraphs >= total) {
      setRevealed(true);
      return;
    }
    const id = setInterval(() => {
      setVisibleParagraphs((v) => {
        if (v + 1 >= total) {
          clearInterval(id);
          setRevealed(true);
          return total;
        }
        return v + 1;
      });
    }, 1100);
    return () => clearInterval(id);
  }, [opened, visibleParagraphs, total]);

  const handleShowAll = () => {
    skipReveal.current = true;
    setVisibleParagraphs(total);
    setRevealed(true);
  };

  return (
    <section
      id="letter"
      className="relative bg-gradient-to-b from-[#FCE7F1] via-[#FBECF6] to-[#FCEFF5] px-6 py-24"
    >
      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-[#F8C8DC]/40 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-[#E8DDF8]/40 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#FCEFF5]/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Love Letter"
          title="A Little Letter for You"
          subtitle="Some feelings are better written from the heart."
        />

        {/* Screen reader full letter */}
        <div className="sr-only">
          <p>{letter.greeting}</p>
          {letter.paragraphs.map((p, i) => (
            <p key={`sr-${i}`}>{p}</p>
          ))}
          <p>{letter.closing}</p>
          <p>
            {letter.signOff} {letter.signature}
          </p>
        </div>

        <div className="mt-14">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="sealed"
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <SealedEnvelope onOpen={() => setOpened(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <LetterPaper
                  greeting={letter.greeting}
                  paragraphs={letter.paragraphs}
                  closing={letter.closing}
                  signOff={letter.signOff}
                  signature={letter.signature}
                  visibleParagraphs={visibleParagraphs}
                  revealed={revealed}
                  onShowAll={handleShowAll}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
