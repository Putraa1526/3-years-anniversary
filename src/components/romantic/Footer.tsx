'use client';

import { ArrowUp, Heart, Lock, LogOut, Pencil, Star } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import { useAdmin } from '@/lib/romantic/admin-context';

function scrollTop() {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Footer() {
  const { content } = useContent();
  const { isAdmin, setLoginOpen, setPanelOpen, logout } = useAdmin();

  const year = new Date().getFullYear();

  return (
    <section className="mt-auto bg-gradient-to-b from-[#FFF7FA] to-[#FCE7F1] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Top divider */}
        <div
          aria-hidden
          className="mx-auto mb-10 flex max-w-md items-center gap-3"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-dusty-pink/40" />
          <Star className="h-3.5 w-3.5 animate-twinkle fill-dusty-pink/70 text-dusty-pink/70" />
          <Heart className="h-4 w-4 animate-float-soft fill-soft-rose/70 text-soft-rose/70" />
          <Star className="h-3.5 w-3.5 animate-twinkle fill-dusty-pink/70 text-dusty-pink/70" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-dusty-pink/40" />
        </div>

        <div className="flex flex-col items-center text-center">
          {/* Ornament */}
          <div className="mb-4 flex items-center gap-2" aria-hidden>
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-dusty-pink/60" />
            <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose" />
            <Heart className="h-3.5 w-3.5 fill-dusty-pink/70 text-dusty-pink/70" />
            <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-soft-rose to-dusty-pink" />
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-dusty-pink/60" />
          </div>

          <p className="font-serif-romantic text-2xl font-semibold text-ink sm:text-3xl">
            {content.footerMain}
          </p>
          <p className="mt-2 text-sm text-ink-soft">{content.footerSub}</p>

          <button
            type="button"
            onClick={scrollTop}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-dusty-pink/30 bg-white/70 px-4 py-2 text-sm text-ink backdrop-blur transition hover:bg-white"
          >
            <ArrowUp className="h-4 w-4 text-dusty-pink" />
            Back to Our World
          </button>

          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-ink-soft">
            {content.partnerOne} &amp; {content.partnerTwo} · {year}
          </p>

          {/* Creator entry */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => setPanelOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-dusty-pink/30 bg-white/70 px-4 py-2 text-xs text-ink backdrop-blur transition hover:bg-white"
                >
                  <Pencil className="h-3.5 w-3.5 text-dusty-pink" />
                  Edit this site
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-full border border-dusty-pink/20 bg-white/40 px-4 py-2 text-xs text-ink-soft backdrop-blur transition hover:bg-white/70 hover:text-ink"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-dusty-pink/20 bg-white/40 px-4 py-2 text-xs text-ink-soft backdrop-blur transition hover:bg-white/70 hover:text-ink"
              >
                <Lock className="h-3.5 w-3.5" />
                Creator
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
