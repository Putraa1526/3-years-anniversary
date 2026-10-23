'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import type { StoryItem } from '@/config/loveConfig';
import SectionHeading from './SectionHeading';

interface StoryEntryProps {
  item: StoryItem;
  index: number;
}

function PlaceholderArt() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-dusty-pink/70">
      <Heart className="h-7 w-7 animate-breathe fill-soft-rose/30 text-soft-rose/50" />
      <span className="text-[10px] uppercase tracking-[0.18em]">add a photo</span>
      <div className="flex gap-1" aria-hidden>
        <span className="h-1 w-1 rounded-full bg-dusty-pink/40" />
        <span className="h-1 w-1 rounded-full bg-dusty-pink/40" />
        <span className="h-1 w-1 rounded-full bg-dusty-pink/40" />
      </div>
    </div>
  );
}

function PolaroidCard({ item, index }: { item: StoryItem; index: number }) {
  const rotate = index % 2 === 0 ? -2 : 2;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotate * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[260px]"
    >
      <div className="relative rounded-sm border border-pink-pastel/40 bg-white p-3 pb-5 shadow-[0_10px_30px_rgba(217,130,167,0.18)]">
        {/* Tape at top */}
        <span
          aria-hidden
          className="tape left-1/2 -top-2 -rotate-2 -translate-x-1/2"
        />
        {/* Photo area */}
        <div className="relative h-40 w-full overflow-hidden rounded-sm bg-gradient-to-br from-[#FCEFF5] via-[#FFF7FA] to-[#F8E9F5] sm:h-48">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <PlaceholderArt />
          )}
          {/* Date stamp bottom-right */}
          <span className="absolute bottom-2 right-2 rounded-full bg-white/85 px-2.5 py-1 text-[10px] text-dusty-pink shadow-sm backdrop-blur">
            {item.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function CaptionBlock({ item }: { item: StoryItem }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-serif-romantic text-xl font-semibold text-ink">
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-ink-soft">
        {item.description}
      </p>
      {item.ornament && (
        <span className="mt-1 inline-flex items-center gap-1.5 text-dusty-pink/80">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs">{item.ornament}</span>
        </span>
      )}
    </div>
  );
}

function StoryEntry({ item, index }: StoryEntryProps) {
  const isEven = index % 2 === 0;
  return (
    <li className="relative">
      {/* Node dot on spine */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
        className="absolute left-4 top-3 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-dusty-pink/40 bg-white shadow-[0_4px_14px_rgba(217,130,167,0.25)] ring-1 ring-dusty-pink/20 sm:left-1/2"
      >
        <Heart className="h-3.5 w-3.5 fill-soft-rose/70 text-soft-rose/70" />
      </motion.span>

      <div className="ml-14 grid grid-cols-1 gap-6 sm:ml-0 sm:grid-cols-2 sm:gap-16">
        {isEven ? (
          <>
            <div className="sm:flex sm:justify-end sm:pr-2">
              <PolaroidCard item={item} index={index} />
            </div>
            <div className="sm:flex sm:flex-col sm:justify-center sm:pl-2 sm:pt-6">
              <CaptionBlock item={item} />
            </div>
          </>
        ) : (
          <>
            <div className="sm:order-2 sm:flex sm:flex-col sm:justify-center sm:pr-2 sm:pt-6">
              <CaptionBlock item={item} />
            </div>
            <div className="sm:order-1 sm:flex sm:justify-start sm:pl-2">
              <PolaroidCard item={item} index={index} />
            </div>
          </>
        )}
      </div>
    </li>
  );
}

export default function OurStory() {
  const { content } = useContent();
  const items = content.story;

  return (
    <section
      id="story"
      className="relative bg-gradient-to-b from-[#FFF7FA] via-[#FCEFF5] to-[#FBECF6] px-6 py-24 sm:py-32"
    >
      {/* Top divider line */}
      <div
        aria-hidden
        className="mx-auto mb-16 flex max-w-md items-center gap-3 sm:mb-20"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-dusty-pink/40" />
        <Heart className="h-4 w-4 fill-dusty-pink/60 text-dusty-pink/60" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-dusty-pink/40" />
      </div>

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Our Story"
          title="Little Moments, Big Feelings"
          subtitle="Every page of our story is a small universe of its own. Here are a few we want to keep forever."
        />

        {/* Timeline */}
        <div className="relative mt-16 sm:mt-24">
          {/* Center spine */}
          <div
            aria-hidden
            className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-dusty-pink/40 to-transparent sm:left-1/2"
          />

          <ul className="space-y-12 sm:space-y-20">
            {items.map((item, index) => (
              <StoryEntry
                key={`${item.title}-${index}`}
                item={item}
                index={index}
              />
            ))}

            {/* Closing entry */}
            <li className="relative">
              <span
                aria-hidden
                className="absolute left-4 top-2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-dusty-pink/40 bg-white shadow-[0_4px_14px_rgba(217,130,167,0.25)] ring-1 ring-dusty-pink/20 sm:left-1/2"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-dusty-pink to-soft-rose" />
              </span>
              <div className="ml-14 sm:ml-0 sm:mx-auto sm:max-w-md sm:text-center">
                <p className="font-serif-romantic text-lg italic text-ink-soft">
                  and the best chapters are still unwritten.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
