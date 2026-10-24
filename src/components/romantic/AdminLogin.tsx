'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Heart, Loader2, X } from 'lucide-react';
import { useAdmin } from '@/lib/romantic/admin-context';

export default function AdminLogin() {
  const { loginOpen, setLoginOpen, login, setPanelOpen } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (loginOpen) {
      setPassword(''); setError(null); setBusy(false);
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [loginOpen]);

  useEffect(() => {
    if (!loginOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLoginOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [loginOpen, setLoginOpen]);

  if (!loginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const ok = await login(password);
    setBusy(false);
    if (ok) { setLoginOpen(false); setPanelOpen(true); }
    else { setError('That password is not quite right ♡'); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 backdrop-blur-md p-4" onClick={() => setLoginOpen(false)} role="dialog" aria-modal="true" aria-label="Creator sign-in">
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 10 }} transition={{ duration: 0.25, ease: 'easeOut' }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm rounded-3xl bg-white/95 glass-card p-6 sm:p-8 shadow-2xl">
        <button onClick={() => setLoginOpen(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-ink-soft transition hover:bg-white hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink" aria-label="Close sign-in"><X className="h-4 w-4" /></button>
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-dusty-pink to-soft-rose shadow-[0_8px_20px_rgba(217,130,167,0.4)]"><Lock className="h-6 w-6 text-white" /><Heart className="absolute -bottom-1 -right-1 h-4 w-4 fill-white text-white" /></div>
          <h2 className="mt-4 font-serif-romantic text-2xl font-semibold text-ink">Creator sign-in</h2>
          <p className="mt-1.5 max-w-xs text-sm text-ink-soft">Enter the creator password to edit this little universe — names, story, photos, letter and more.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input ref={inputRef} type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }} placeholder="Creator password" autoComplete="current-password" className="w-full rounded-2xl border border-dusty-pink/25 bg-white/80 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-dusty-pink focus:bg-white focus-visible:outline-2 focus-visible:outline-dusty-pink" />
          {error && <p className="text-center text-xs text-dusty-pink">{error}</p>}
          <button type="submit" disabled={busy || password.length === 0} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(217,130,167,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(217,130,167,0.45)] focus-visible:outline-2 focus-visible:outline-dusty-pink disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4 fill-white" />}{busy ? 'Checking…' : 'Enter editor'}
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-ink-soft/70">Tip: change the password in <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[10px] text-dusty-pink">.env</code> (<code className="font-mono text-[10px]">ADMIN_PASSWORD</code>).</p>
      </motion.div>
    </div>
  );
}
