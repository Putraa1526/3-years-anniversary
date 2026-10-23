'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Heart, Menu, X } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#story' },
  { label: 'Days', href: '#days' },
  { label: 'Memories', href: '#gallery' },
  { label: 'Letter', href: '#letter' },
  { label: 'Music', href: '#music' },
  { label: 'Notes', href: '#notes' },
];

export default function Navigation() {
  const { content } = useContent();
  const { partnerOne, partnerTwo } = content;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('#home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setShowTop(y > 600);

      let current = '#home';
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.href.replace('#', ''));
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = item.href;
            break;
          }
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass-card' : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => handleNav('#home')}
            className="inline-flex items-center gap-2 font-serif-romantic text-lg font-semibold text-ink"
          >
            <span>{partnerOne}</span>
            <Heart className="h-3.5 w-3.5 fill-soft-rose text-soft-rose" />
            <span>{partnerTwo}</span>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className={`relative rounded-full px-3 py-1.5 text-sm transition ${
                    isActive ? 'text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm md:hidden"
              />
              <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                className="fixed right-0 top-0 z-50 h-full w-64 bg-white p-6 shadow-2xl md:hidden"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-serif-romantic text-lg text-ink">Menu</span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full p-1.5 text-ink-soft"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleNav(item.href)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                        active === item.href
                          ? 'bg-gradient-to-r from-dusty-pink to-soft-rose text-white'
                          : 'text-ink-soft hover:bg-blush'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Back-to-top floating button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="back-to-top"
            type="button"
            onClick={scrollTop}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-dusty-pink to-soft-rose text-white shadow-lg transition hover:scale-110"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
