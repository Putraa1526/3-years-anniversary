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
 * editor. The password is checked against ADMIN_PASSWORD on the server
 * via POST /api/auth/admin, and the returned token is kept in
 * sessionStorage (cleared when the tab closes). Content edits + uploads
 * send the token as the `x-admin-token` header to authorize changes.
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
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not sign in.');
      }
      const t = data.token as string;
      setToken(t);
      try {
        window.sessionStorage.setItem(SESSION_KEY, t);
      } catch {
        // ignore
      }
      return true;
    } catch {
      return false;
    }
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
