'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  ornament?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  ornament = true,
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={
        isCenter
          ? 'flex flex-col items-center text-center'
          : 'flex flex-col items-start text-left'
      }
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-dusty-pink/80">
          <Heart className="h-3 w-3 fill-current" />
          {eyebrow}
        </span>
      )}

      <h2 className="mt-3 font-serif-romantic text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {ornament && (
        <div className="mt-4 flex items-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-dusty-pink/70" />
          <Heart className="h-3.5 w-3.5 fill-dusty-pink/70 text-dusty-pink/70" />
          <span className="h-px w-10 bg-gradient-to-r from-dusty-pink/70 to-transparent" />
        </div>
      )}

      {subtitle && (
        <p
          className={`mt-1 max-w-xl font-sans-romantic text-base leading-relaxed text-ink-soft sm:text-lg ${
            isCenter ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
