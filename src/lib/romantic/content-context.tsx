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

interface ContentContextValue {
  content: SiteContent;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);
const STORAGE_KEY = 'diraa-pupaa:content';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = window.sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          return mergeContent(JSON.parse(cached) as Partial<SiteContent>);
        }
      } catch {
        // ignore
      }
    }
    return defaultContent;
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const data = (await res.json()) as SiteContent;
      const merged = mergeContent(data);
      setContent(merged);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
    } catch {
      // keep defaults on failure
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
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
