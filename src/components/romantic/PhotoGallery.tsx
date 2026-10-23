'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageOff,
  X,
} from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import type { GalleryItem } from '@/config/loveConfig';
import SectionHeading from './SectionHeading';

const SPANS = [
  'sm:col-span-2 sm:row-span-2',
  '',
  '',
  'sm:col-span-2',
  '',
  'sm:row-span-2',
];

interface PolaroidTileProps {
  item: GalleryItem;
  index: number;
  onOpen: () => void;
}

function PlaceholderArt() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#FCEFF5] via-[#FFF7FA] to-[#F8E9F5] text-dusty-pink/70">
      <Heart className="h-6 w-6 animate-breathe fill-soft-rose/30 text-soft-rose/50" />
      <span className="text-[9px] uppercase tracking-[0.18em]">add a photo</span>
    </div>
  );
}

function PolaroidTile({ item, index, onOpen }: PolaroidTileProps) {
  const [errored, setErrored] = useState(false);
  const rotate = index % 2 === 0 ? -1.5 : 1.5;
  const span = SPANS[index % SPANS.length];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 3) * 0.05,
      }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      style={{ rotate: `${rotate}deg` }}
      className={`group relative flex h-full w-full flex-col rounded-sm border border-pink-pastel/40 bg-white p-2 pb-3 shadow-[0_8px_22px_rgba(217,130,167,0.16)] sm:p-2.5 ${span}`}
      aria-label={item.caption ?? item.alt}
    >
      <div className="relative h-full min-h-[90px] w-full overflow-hidden rounded-sm">
        {item.src && !errored ? (
          <img
            src={item.src}
            alt={item.alt}
            onError={() => setErrored(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderArt />
        )}
      </div>
      {item.caption && (
        <p className="mt-1.5 line-clamp-1 text-center text-xs text-ink-soft sm:text-sm">
          {item.caption}
        </p>
      )}
    </motion.button>
  );
}

export default function PhotoGallery() {
  const { content } = useContent();
  const items = content.gallery;
  const [active, setActive] = useState<number | null>(null);
  const [lightboxErrored, setLightboxErrored] = useState(false);

  const total = items.length;
  const next = () => {
    setActive((i) => (i === null ? i : (i + 1) % total));
    setLightboxErrored(false);
  };
  const prev = () => {
    setActive((i) => (i === null ? i : (i - 1 + total) % total));
    setLightboxErrored(false);
  };
  const close = () => setActive(null);

  // Keyboard navigation
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, total]);

  // Body scroll lock
  useEffect(() => {
    if (active === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  const current = active !== null ? items[active] : null;

  return (
    <section
      id="gallery"
      className="relative bg-gradient-to-b from-[#FCEFF5] via-[#FFF7FA] to-[#FCE7F1] px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Memories"
          title="Our Little Gallery"
          subtitle="A handful of frames, a thousand feelings inside each one."
        />

        <div className="mt-14 grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[170px] sm:grid-cols-4 sm:gap-5">
          {items.map((item, index) => (
            <PolaroidTile
              key={`${item.src}-${index}`}
              item={item}
              index={index}
              onOpen={() => {
                setActive(index);
                setLightboxErrored(false);
              }}
            />
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {current && active !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
              className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md"
            >
              {/* Close */}
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Prev */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:scale-110 sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:scale-110 sm:right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl rounded-md border border-pink-pastel/40 bg-white p-3 pb-5 shadow-2xl"
              >
                <span
                  aria-hidden
                  className="tape left-1/2 -top-2 -rotate-2 -translate-x-1/2"
                />
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-gradient-to-br from-[#FCEFF5] via-[#FFF7FA] to-[#F8E9F5]">
                  {current.src && !lightboxErrored ? (
                    <img
                      src={current.src}
                      alt={current.alt}
                      onError={() => setLightboxErrored(true)}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-dusty-pink/60">
                      <ImageOff className="h-8 w-8" />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Image unavailable
                      </span>
                    </div>
                  )}
                </div>
                {current.caption && (
                  <p className="mt-3 text-center font-serif-romantic text-sm italic text-ink-soft">
                    {current.caption}
                  </p>
                )}
                <p className="mt-1 text-center text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                  {active + 1} / {total}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
