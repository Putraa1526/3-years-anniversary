'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, Heart, Loader2, Pencil, Upload, Link2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LOVE_CONFIG } from '@/config/loveConfig';
import { useContent } from '@/lib/romantic/content-context';
import SectionHeading from './SectionHeading';

interface SongState {
  url: string;
  title: string;
  artist: string;
  cover: string;
}

export default function MusicPlayer() {
  const { toast } = useToast();
  const { content } = useContent();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [song, setSong] = useState<SongState | null>(null);
  const [songLoading, setSongLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const loadSong = useCallback(async () => {
    setSongLoading(true);
    try {
      const res = await fetch('/api/song', { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const data = (await res.json()) as SongState;
      setSong(data);
    } catch {
      setSong({
        url: LOVE_CONFIG.music.songUrl,
        title: LOVE_CONFIG.music.title,
        artist: LOVE_CONFIG.music.artist,
        cover: LOVE_CONFIG.music.cover,
      });
    } finally {
      setSongLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSong();
  }, [loadSong]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const songUrl = song?.url ?? '';
  const title = song?.title || LOVE_CONFIG.music.title;
  const artist = song?.artist || LOVE_CONFIG.music.artist;
  const cover = song?.cover || LOVE_CONFIG.music.cover;

  useEffect(() => {
    if (!songUrl) return;
    const audio = new Audio(songUrl);
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onLoaded = () => { setDuration(audio.duration || 0); setLoading(false); setFailed(false); };
    const onTime = () => setCurrent(audio.currentTime);
    const onEnd = () => { setIsPlaying(false); setCurrent(0); };
    const onError = () => { setFailed(true); setLoading(false); setIsPlaying(false); };
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.pause();
      audioRef.current = null;
    };
  }, [songUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || failed) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setLoading(true);
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => setIsPlaying(true)).catch(() => {
          setFailed(true); setIsPlaying(false); setLoading(false);
        });
      } else {
        setIsPlaying(true);
      }
    }
  }, [isPlaying, failed]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration || failed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrent(audio.currentTime);
  }, [duration, failed]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);
  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const showEmpty = !songLoading && (!songUrl || failed);

  const EditButton = (
    <button
      onClick={() => setEditOpen(true)}
      className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-dusty-pink backdrop-blur-sm border border-white/80 shadow-sm transition hover:bg-white hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-dusty-pink"
      aria-label={songUrl ? 'Edit our song' : 'Add our song'}
    >
      <Pencil className="h-3.5 w-3.5" />
      {songUrl ? 'Edit song' : 'Add our song'}
    </button>
  );

  return (
    <section id="music" className="relative overflow-hidden px-6 py-24 sm:py-32 bg-gradient-to-b from-[#FCEFF5] via-[#FBECF6] to-[#F8E9F5]">
      <div className="pointer-events-none absolute -top-10 right-1/4 h-64 w-64 rounded-full bg-pink-pastel/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-lavender/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Music Corner"
          title="Our Little Soundtrack"
          subtitle="Press play and let this play softly in the background as you wander through our little universe."
        />

        <div className="mt-6 flex justify-center">{EditButton}</div>

        {songLoading ? (
          <div className="mt-8 h-40 animate-pulse rounded-3xl bg-white/50 glass-card-soft" />
        ) : showEmpty ? (
          <EmptyState hasFile={failed && !!songUrl} onAdd={() => setEditOpen(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mt-6 rounded-3xl bg-white/65 glass-card p-5 sm:p-7"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative mx-auto sm:mx-0">
                <div className={`flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-pastel via-soft-rose to-lavender shadow-[0_12px_30px_rgba(217,130,167,0.3)] ${isPlaying ? 'animate-breathe' : ''}`}>
                  {cover ? (
                    <img src={cover} alt={title} className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <Music className="h-10 w-10 text-white/90" />
                  )}
                </div>
                {isPlaying && !reduceMotion && <Visualizer />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-serif-romantic text-xl sm:text-2xl text-ink truncate">{title}</h3>
                    <p className="text-sm text-ink-soft truncate">{artist}</p>
                  </div>
                  <button
                    onClick={togglePlay}
                    disabled={loading}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dusty-pink to-soft-rose text-white shadow-[0_8px_20px_rgba(217,130,167,0.4)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-dusty-pink disabled:opacity-70"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white translate-x-0.5" />}
                  </button>
                </div>

                <div className="mt-4">
                  <div
                    onClick={handleSeek}
                    role="slider"
                    tabIndex={0}
                    aria-label="Seek"
                    aria-valuemin={0}
                    aria-valuemax={Math.floor(duration) || 0}
                    aria-valuenow={Math.floor(current)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                        const audio = audioRef.current;
                        if (audio) audio.currentTime = Math.min(duration, audio.currentTime + 5);
                      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                        const audio = audioRef.current;
                        if (audio) audio.currentTime = Math.max(0, audio.currentTime - 5);
                      }
                    }}
                    className="group relative h-2 w-full cursor-pointer rounded-full bg-dusty-pink/15"
                  >
                    <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose" style={{ width: `${progress}%` }} />
                    <div className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow border border-dusty-pink/40 transition-transform group-hover:scale-110" style={{ left: `calc(${progress}% - 7px)` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-ink-soft">
                    <span>{formatTime(current)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button onClick={toggleMute} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-dusty-pink transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-dusty-pink" aria-label={muted ? 'Unmute' : 'Mute'}>
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={(e) => { const v = Number(e.target.value); setVolume(v); if (v > 0 && muted) setMuted(false); }} className="h-1.5 w-28 sm:w-32 cursor-pointer accent-dusty-pink" aria-label="Volume" />
                  <span className="text-xs text-ink-soft">{content.partnerOne} ♡ {content.partnerTwo}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <EditSongDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        current={song ?? { url: '', title: LOVE_CONFIG.music.title, artist: LOVE_CONFIG.music.artist, cover: '' }}
        onSaved={(updated) => { setSong(updated); setIsPlaying(false); setCurrent(0); setDuration(0); setFailed(false); }}
        toast={toast}
        onReload={loadSong}
      />
    </section>
  );
}

function EmptyState({ hasFile, onAdd }: { hasFile: boolean; onAdd: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mt-6 flex flex-col items-center rounded-3xl bg-white/65 glass-card p-8 text-center sm:p-12">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-pink-pastel/40">
        <Music className="h-9 w-9 text-dusty-pink" />
        <Heart className="absolute -bottom-1 -right-1 h-5 w-5 fill-soft-rose text-soft-rose" />
      </div>
      <p className="mt-5 font-serif-romantic text-2xl text-ink">{hasFile ? 'That song could not be played ♡' : 'Add your favorite song to make this moment complete ♡'}</p>
      <p className="mt-2 max-w-md text-sm text-ink-soft">Press "Add our song" above to upload an audio file or paste a song link. Your song will be saved and kept here for them.</p>
      <button onClick={onAdd} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(217,130,167,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(217,130,167,0.45)] focus-visible:outline-2 focus-visible:outline-dusty-pink">
        <Pencil className="h-4 w-4" />{hasFile ? 'Replace the song' : 'Add our song'}
      </button>
    </motion.div>
  );
}

interface EditSongDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  current: SongState;
  onSaved: (updated: SongState) => void;
  toast: ReturnType<typeof useToast>['toast'];
  onReload: () => void;
}

function EditSongDialog({ open, onOpenChange, current, onSaved, toast, onReload }: EditSongDialogProps) {
  const [url, setUrl] = useState(current.url);
  const [title, setTitle] = useState(current.title);
  const [artist, setArtist] = useState(current.artist);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) { setUrl(current.url); setTitle(current.title); setArtist(current.artist); setFile(null); }
  }, [open, current]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setUrl('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalUrl = url.trim();
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const upRes = await fetch('/api/song/upload', { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (!upRes.ok) throw new Error(upData.error || 'Upload failed.');
        finalUrl = upData.url as string;
      }
      const res = await fetch('/api/song', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl, title: title.trim(), artist: artist.trim(), cover: current.cover || '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save the song.');
      onSaved({ url: data.url, title: data.title, artist: data.artist, cover: data.cover });
      onReload();
      onOpenChange(false);
      toast({ title: 'Our song has been saved ♡', description: 'It will play here whenever you return.' });
    } catch (err) {
      toast({ title: 'Could not save the song', description: err instanceof Error ? err.message : 'Please try again in a moment.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    const ok = window.confirm('Remove the current song? You can add a new one anytime ♡');
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch('/api/song', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: '', title: title.trim(), artist: artist.trim(), cover: '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not remove the song.');
      onSaved({ url: '', title: data.title, artist: data.artist, cover: '' });
      onReload();
      onOpenChange(false);
      toast({ title: 'Song removed.' });
    } catch (err) {
      toast({ title: 'Could not remove the song', description: err instanceof Error ? err.message : 'Please try again in a moment.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-dusty-pink/30 bg-white/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="font-serif-romantic text-xl text-ink">{current.url ? 'Edit our song' : 'Add our song'}</DialogTitle>
          <DialogDescription className="text-ink-soft">Upload an audio file or paste a song link. It will be saved and kept for them.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft"><Upload className="h-3.5 w-3.5" />Upload an audio file</label>
            <input type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" onChange={handleFile} className="block w-full text-xs text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-dusty-pink file:to-soft-rose file:px-4 file:py-2 file:text-white file:font-medium file:cursor-pointer hover:file:-translate-y-0.5 file:transition-transform" />
            {file && <p className="mt-1.5 text-[11px] text-dusty-pink">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>}
          </div>
          <div>
            <label htmlFor="song-url" className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft"><Link2 className="h-3.5 w-3.5" />Or paste a song link</label>
            <input id="song-url" type="url" value={url} onChange={(e) => { setUrl(e.target.value); if (e.target.value && file) setFile(null); }} placeholder="https://…  or  /audio/our-song.mp3" className="w-full rounded-2xl border border-dusty-pink/25 bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-dusty-pink focus:bg-white" />
            <p className="mt-1 text-[10px] text-ink-soft/70">The link must start with / (a file on this site) or http(s)://</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label htmlFor="song-title" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">Title</label><input id="song-title" type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 120))} placeholder="Our Little Song" className="w-full rounded-2xl border border-dusty-pink/25 bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-dusty-pink focus:bg-white" /></div>
            <div><label htmlFor="song-artist" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">Artist</label><input id="song-artist" type="text" value={artist} onChange={(e) => setArtist(e.target.value.slice(0, 120))} placeholder="Just for You" className="w-full rounded-2xl border border-dusty-pink/25 bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-dusty-pink focus:bg-white" /></div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          {current.url ? (
            <button onClick={handleRemove} disabled={saving} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-ink-soft border border-dusty-pink/20 transition hover:bg-white hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" />Remove song</button>
          ) : (<span />)}
          <div className="flex gap-2">
            <DialogClose asChild><button disabled={saving} className="rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-ink-soft border border-dusty-pink/20 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-dusty-pink disabled:opacity-60">Cancel</button></DialogClose>
            <button onClick={handleSave} disabled={saving || (!file && !url.trim())} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-5 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(217,130,167,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(217,130,167,0.45)] focus-visible:outline-2 focus-visible:outline-dusty-pink disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className="h-3.5 w-3.5 fill-white" />}{saving ? 'Saving…' : 'Save song'}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Visualizer() {
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} className="w-1 rounded-full bg-dusty-pink/80" animate={{ height: [6, 14, 6, 10, 6] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }} style={{ height: 6 }} />
      ))}
    </div>
  );
}

function formatTime(sec: number): string {
  if (!sec || Number.isNaN(sec) || !Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
