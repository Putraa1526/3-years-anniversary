'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarHeart, Clock, Heart, Timer, type LucideIcon } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import { hasAnniversaryDate } from '@/config/loveConfig';
import SectionHeading from './SectionHeading';

interface TimeUnitProps {
  label: string;
  value: number | null;
  icon: LucideIcon;
  compact?: boolean;
}

interface Diff {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getDiff(from: Date, to: Date): Diff {
  let ms = Math.max(0, to.getTime() - from.getTime());
  const days = Math.floor(ms / 86_400_000);
  ms -= days * 86_400_000;
  const hours = Math.floor(ms / 3_600_000);
  ms -= hours * 3_600_000;
  const minutes = Math.floor(ms / 60_000);
  ms -= minutes * 60_000;
  const seconds = Math.floor(ms / 1000);
  return { days, hours, minutes, seconds };
}

function getNextAnniversary(base: Date, now: Date): Date {
  const next = new Date(base);
  next.setFullYear(now.getFullYear());
  if (next.getTime() < now.getTime()) {
    next.setFullYear(now.getFullYear() + 1);
  }
  return next;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function TimeUnit({ label, value, icon: Icon, compact = false }: TimeUnitProps) {
  const display =
    value === null
      ? '—'
      : label === 'Days'
        ? value.toLocaleString()
        : String(value).padStart(2, '0');
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-2xl bg-white/60 text-center backdrop-blur ${
        compact ? 'px-2 py-2.5' : 'px-3 py-3'
      }`}
    >
      <Icon
        className={
          compact
            ? 'h-3.5 w-3.5 text-dusty-pink/80'
            : 'h-4 w-4 text-dusty-pink/80'
        }
      />
      <span
        className={`font-serif-romantic font-bold tabular-nums text-ink ${
          compact ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'
        }`}
      >
        {display}
      </span>
      <span
        className={`uppercase tracking-[0.18em] text-ink-soft ${
          compact ? 'text-[9px]' : 'text-[11px]'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function PlaceholderDate() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
      <CalendarHeart className="h-12 w-12 animate-breathe text-dusty-pink/80" />
      <p className="font-serif-romantic text-xl text-ink">
        Our story is waiting for its special date ♡
      </p>
      <p className="max-w-md text-sm leading-relaxed text-ink-soft">
        Add your anniversary date in the Creator panel to start counting the
        days, hours, and seconds of your little universe together.
      </p>
    </div>
  );
}

export default function DaysTogether() {
  const { content } = useContent();
  const valid = hasAnniversaryDate(content.anniversaryDate);

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const anniversary = useMemo(() => {
    if (!valid) return new Date();
    const parsed = new Date(content.anniversaryDate);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [valid, content.anniversaryDate]);

  const nextAnniversary = useMemo(() => {
    if (!now) return anniversary;
    return getNextAnniversary(anniversary, now);
  }, [anniversary, now]);

  const diff = useMemo<Diff>(() => {
    if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return getDiff(anniversary, now);
  }, [anniversary, now]);

  const countdown = useMemo<Diff>(() => {
    if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return getDiff(now, nextAnniversary);
  }, [now, nextAnniversary]);

  return (
    <section
      id="days"
      className="relative bg-gradient-to-b from-[#FBECF6] via-[#F8E9F5] to-[#FCEFF5] px-6 py-24"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Days Together"
          title="Every Day With You Is Special"
          subtitle={content.anniversaryMessage}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-14 overflow-hidden rounded-[2rem] glass-card p-7"
        >
          {/* Floating hearts */}
          <Heart
            aria-hidden
            className="absolute -right-6 -top-6 h-16 w-16 animate-float-soft fill-soft-rose/10 text-soft-rose/10"
          />
          <Heart
            aria-hidden
            className="absolute -bottom-6 -left-6 h-14 w-14 animate-float-soft fill-dusty-pink/10 text-dusty-pink/10"
            style={{ animationDelay: '2s' }}
          />

          {valid ? (
            <div className="relative text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-soft">
                days of our little story
              </p>

              <div className="mt-3 font-serif-romantic text-7xl font-bold tabular-nums text-ink sm:text-8xl md:text-9xl">
                {mounted ? diff.days.toLocaleString() : '—'}
              </div>

              <p className="mt-2 font-sans-romantic text-sm text-ink-soft">
                since {formatDate(anniversary)}
              </p>

              {/* Live h:m:s */}
              <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
                <TimeUnit
                  label="Hours"
                  value={mounted ? diff.hours : null}
                  icon={Clock}
                />
                <TimeUnit
                  label="Minutes"
                  value={mounted ? diff.minutes : null}
                  icon={Heart}
                />
                <TimeUnit
                  label="Seconds"
                  value={mounted ? diff.seconds : null}
                  icon={Timer}
                />
              </div>

              {/* Toggle countdown */}
              <button
                type="button"
                onClick={() => setShowCountdown((v) => !v)}
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-dusty-pink/30 bg-white/70 px-4 py-2 text-sm text-ink backdrop-blur transition hover:bg-white"
              >
                <CalendarHeart className="h-4 w-4 text-dusty-pink" />
                {showCountdown ? 'Hide Countdown' : 'Our Next Anniversary'}
              </button>

              <AnimatePresence initial={false}>
                {showCountdown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 rounded-2xl bg-white/50 p-4 backdrop-blur">
                      <p className="mb-3 text-center text-xs uppercase tracking-[0.22em] text-ink-soft">
                        Counting down to {formatDate(nextAnniversary)}
                      </p>
                      <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        <TimeUnit
                          label="Days"
                          value={mounted ? countdown.days : null}
                          icon={CalendarHeart}
                          compact
                        />
                        <TimeUnit
                          label="Hours"
                          value={mounted ? countdown.hours : null}
                          icon={Clock}
                          compact
                        />
                        <TimeUnit
                          label="Min"
                          value={mounted ? countdown.minutes : null}
                          icon={Heart}
                          compact
                        />
                        <TimeUnit
                          label="Sec"
                          value={mounted ? countdown.seconds : null}
                          icon={Timer}
                          compact
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <PlaceholderDate />
          )}
        </motion.div>
      </div>
    </section>
  );
}
