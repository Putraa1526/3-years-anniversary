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
import { checkAdminPassword } from '@/lib/storage';

const SESSION_KEY = 'diraa-pupaa:admin-token';

interface AdminContextValue {
  isAdmin: boolean;
  token: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
  panelOpen: boolean;
  setPanelOpen: (v: boolean) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

/**
 * AdminProvider — manages the creator's signed-in state for the in-site
 * editor. On static hosting (GitHub Pages) the password is checked
 * client-side against ADMIN_PASSWORD in src/lib/storage.ts. The token is
 * kept in sessionStorage (cleared when the tab closes).
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    try {
      const t = window.sessionStorage.getItem(SESSION_KEY);
      if (t) setToken(t);
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    // Tiny delay to feel like a real check (and keep the UI calm).
    await new Promise((r) => setTimeout(r, 200));
    if (!checkAdminPassword(password)) return false;
    // Use a fixed token string; real auth would be server-side.
    const t = 'admin';
    setToken(t);
    try {
      window.sessionStorage.setItem(SESSION_KEY, t);
    } catch {
      // ignore
    }
    return true;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setPanelOpen(false);
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      isAdmin: !!token,
      token,
      login,
      logout,
      loginOpen,
      setLoginOpen,
      panelOpen,
      setPanelOpen,
    }),
    [token, login, logout, loginOpen, panelOpen]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used inside <AdminProvider>');
  }
  return ctx;
}
