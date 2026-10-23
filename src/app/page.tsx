'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ContentProvider } from '@/lib/romantic/content-context';
import { AdminProvider } from '@/lib/romantic/admin-context';
import WelcomeScreen from '@/components/romantic/WelcomeScreen';
import Navigation from '@/components/romantic/Navigation';
import HeroSection from '@/components/romantic/HeroSection';
import OurStory from '@/components/romantic/OurStory';
import DaysTogether from '@/components/romantic/DaysTogether';
import PhotoGallery from '@/components/romantic/PhotoGallery';
import LoveLetter from '@/components/romantic/LoveLetter';
import MusicPlayer from '@/components/romantic/MusicPlayer';
import SurpriseSection from '@/components/romantic/SurpriseSection';
import LoveNotes from '@/components/romantic/LoveNotes';
import Footer from '@/components/romantic/Footer';
import AdminLogin from '@/components/romantic/AdminLogin';
import AdminPanel from '@/components/romantic/AdminPanel';

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (entered) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [entered]);

  const handleEnter = useCallback(() => setEntered(true), []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleExplore = useCallback(() => scrollTo('story'), [scrollTo]);
  const handleSurprise = useCallback(() => scrollTo('surprise'), [scrollTo]);

  return (
    <ContentProvider>
      <AdminProvider>
        <div className="relative flex min-h-screen flex-col bg-background text-foreground">
          {mounted && (
            <AnimatePresence>
              {!entered && <WelcomeScreen onEnter={handleEnter} />}
            </AnimatePresence>
          )}
          <Navigation />
          <main className="flex-1">
            <HeroSection onExplore={handleExplore} onSurprise={handleSurprise} />
            <OurStory />
            <DaysTogether />
            <PhotoGallery />
            <LoveLetter />
            <MusicPlayer />
            <SurpriseSection />
            <LoveNotes />
          </main>
          <Footer />
          <AdminLogin />
          <AdminPanel />
        </div>
      </AdminProvider>
    </ContentProvider>
  );
}
