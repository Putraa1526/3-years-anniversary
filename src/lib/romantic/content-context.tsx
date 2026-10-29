'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  type SiteContent,
  defaultContent,
  mergeContent,
} from '@/config/loveConfig';
import { getContent } from '@/lib/storage';

interface ContentContextValue {
  content: SiteContent;
  isLoading: boolean;
  refresh: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

/**
 * ContentProvider — loads editable site content from localStorage (so it
 * works on static hosting like GitHub Pages) and exposes it to every
 * section component. Falls back to defaultContent if nothing is stored.
 *
 * Also keeps an in-memory mirror so the site renders instantly without
 * a flash, then refreshes from localStorage on mount (and after saves).
 */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        return getContent();
      } catch {
        // ignore
      }
    }
    return defaultContent;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Re-read from localStorage on mount (in case it changed in another tab).
  const refresh = useCallback(() => {
    try {
      setContent(getContent());
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Sync across tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'diraa-pupaa:content') refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  const value = useMemo<ContentContextValue>(
    () => ({ content, isLoading, refresh }),
    [content, isLoading, refresh]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used inside <ContentProvider>');
  }
  return ctx;
}

/** Used by mergeContent / consumers — keep the export for convenience. */
export { mergeContent };
