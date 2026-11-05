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

/**
 * ContentProvider — loads editable site content from the server
 * (/api/content) and exposes it to every section. Mirrors the loaded
 * content to sessionStorage so quick back/forward navigations don't
 * flash the defaults. On Vercel (or any Node host), the content lives
 * in the database and is shared across all visitors + devices.
 */
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
        // ignore quota errors
      }
    } catch {
      // keep current defaults on failure
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
