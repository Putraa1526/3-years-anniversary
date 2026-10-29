'use client';

/**
 * storage.ts — client-side persistence layer for static hosting
 * (GitHub Pages). Replaces the server API routes with localStorage so
 * the whole site works with zero backend.
 *
 *  What persists (per browser, via localStorage):
 *   - Site content (all editable text + photo URLs/base64)
 *   - Love notes (the guestbook)
 *   - The current song (URL or base64 data URL + title/artist)
 *
 *  Tradeoff: edits/notes are NOT shared across devices or visitors,
 *  because there is no server. To share, the creator can either rebuild
 *  with their edits baked into loveConfig.ts, or add a free backend
 *  later (e.g. Supabase) for cross-device persistence.
 *
 *  Quota note: localStorage is ~5MB per origin. Images are stored as
 *  base64 data URLs with a strict per-image cap; audio uploads are
 *  capped too. We catch quota errors and surface them as toasts.
 */

import {
  defaultContent,
  mergeContent,
  type SiteContent,
} from '@/config/loveConfig';

/**
 * Admin password (soft client-side gate for static hosting).
 * 🔑 Change this to your own secret. NOTE: this is visible in the
 * built JS bundle, so it is a soft gate, not real security. It's meant
 * to keep casual visitors out of the editor, nothing more.
 */
export const ADMIN_PASSWORD = 'ourlittleuniverse';

const KEYS = {
  content: 'diraa-pupaa:content',
  notes: 'diraa-pupaa:notes',
  song: 'diraa-pupaa:song',
} as const;

export interface LoveNote {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface SongState {
  url: string;
  title: string;
  artist: string;
  cover: string;
}

/* ---------- low-level helpers ---------- */

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): { ok: true } | { ok: false; error: string } {
  if (typeof window === 'undefined') return { ok: false, error: 'no localStorage' };
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (e) {
    const msg =
      e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        ? 'Storage is full — try smaller images or clear old ones.'
        : 'Could not save to local storage.';
    return { ok: false, error: msg };
  }
}

function cryptoId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}

/* ---------- content ---------- */

export function getContent(): SiteContent {
  return mergeContent(read<Partial<SiteContent> | null>(KEYS.content, null));
}

export function saveContent(content: SiteContent): { ok: true } | { ok: false; error: string } {
  return write(KEYS.content, content);
}

export function clearContent() {
  try {
    window.localStorage.removeItem(KEYS.content);
  } catch {
    // ignore
  }
}

/* ---------- love notes ---------- */

export function getNotes(): LoveNote[] {
  return read<LoveNote[]>(KEYS.notes, []);
}

export function addNote(author: string, body: string): LoveNote {
  const note: LoveNote = {
    id: cryptoId(),
    author,
    body,
    createdAt: new Date().toISOString(),
  };
  const notes = getNotes();
  notes.unshift(note);
  write(KEYS.notes, notes);
  return note;
}

export function deleteNote(id: string) {
  const notes = getNotes().filter((n) => n.id !== id);
  write(KEYS.notes, notes);
}

/* ---------- song ---------- */

export function getSong(): SongState {
  return read<SongState>(KEYS.song, {
    url: '',
    title: defaultContent ? 'Our Little Song' : 'Our Little Song',
    artist: 'Just for You',
    cover: '',
  });
}

export function saveSong(song: SongState): { ok: true } | { ok: false; error: string } {
  return write(KEYS.song, song);
}

/* ---------- uploads (base64 data URLs) ---------- */

/** Max image size for base64 storage in localStorage (~1.5MB to leave room). */
export const MAX_IMAGE_BYTES = 1_500_000;
/** Max audio size for base64 storage (~3MB). */
export const MAX_AUDIO_BYTES = 3_000_000;

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/') && !/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name)) {
    throw new Error('Only image files are supported (png, jpg, gif, webp, bmp, svg).');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`That image is a bit too big for in-browser storage (max ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB). Try a smaller one, or paste an image URL instead.`);
  }
  return fileToDataUrl(file);
}

export async function uploadAudio(file: File): Promise<string> {
  const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name);
  if (!isAudio) {
    throw new Error('Only audio files are supported (mp3, wav, ogg, m4a, aac, flac).');
  }
  if (file.size > MAX_AUDIO_BYTES) {
    throw new Error(`That song is a bit too big for in-browser storage (max ${Math.round(MAX_AUDIO_BYTES / 1024 / 1024)}MB). For larger songs, paste a public URL instead.`);
  }
  return fileToDataUrl(file);
}

/* ---------- admin auth (client-side soft gate) ---------- */

export function checkAdminPassword(password: string): boolean {
  return typeof password === 'string' && password === ADMIN_PASSWORD;
}
