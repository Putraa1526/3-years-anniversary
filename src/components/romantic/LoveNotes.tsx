'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, RefreshCw, Send, Trash2 } from 'lucide-react';
import { useContent } from '@/lib/romantic/content-context';
import { useToast } from '@/hooks/use-toast';
import { getNotes, addNote, deleteNote as removeNote } from '@/lib/storage';
import SectionHeading from './SectionHeading';

const MAX_AUTHOR = 50;
const MAX_BODY = 500;

interface LoveNote {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '♡';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const now = Date.now();
  const diffMs = now - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface NoteCardProps {
  note: LoveNote;
  onDelete: (note: LoveNote) => void;
}

function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: -1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-white/80 p-5 shadow-[0_8px_24px_rgba(217,130,167,0.12)] backdrop-blur sm:p-6"
    >
      {/* Top accent */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-dusty-pink via-soft-rose to-pink-pastel"
      />
      {/* Delete button */}
      <button
        type="button"
        onClick={() => onDelete(note)}
        aria-label="Delete this note"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-ink-soft opacity-0 shadow-sm backdrop-blur transition hover:bg-dusty-pink/10 hover:text-dusty-pink focus:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <p className="mt-1 whitespace-pre-wrap pr-8 text-sm leading-relaxed text-ink sm:text-base">
        {note.body}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-dusty-pink/30 to-soft-rose/30 text-xs font-semibold text-dusty-pink">
          {initials(note.author)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ink">{note.author}</span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            {formatRelative(note.createdAt)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}

function EmptyWall() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/40 px-6 py-10 text-center backdrop-blur">
      <p className="font-serif-romantic text-lg text-ink">
        Be the first to leave a little note ♡
      </p>
    </div>
  );
}

function SkeletonNotes() {
  return (
    <ul className="space-y-4">
      {[0, 1, 2].map((i) => (
        <li
          key={`sk-${i}`}
          className="rounded-2xl bg-white/60 p-6 shadow-sm backdrop-blur"
        >
          <div className="h-3 w-3/4 animate-pulse rounded bg-dusty-pink/20" />
          <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-dusty-pink/15" />
          <div className="mt-5 flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-dusty-pink/20" />
            <div className="h-3 w-24 animate-pulse rounded bg-dusty-pink/15" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function LoveNotes() {
  const { content } = useContent();
  const { toast } = useToast();

  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      setNotes(getNotes());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authorStr = author.trim();
    const bodyStr = body.trim();
    if (!authorStr) {
      toast({
        title: 'Add your name ♡',
        description: 'Please tell us who this little note is from.',
        variant: 'destructive',
      });
      return;
    }
    if (authorStr.length > MAX_AUTHOR) {
      toast({
        title: 'A shorter name, please ♡',
        description: `Names can be up to ${MAX_AUTHOR} characters.`,
        variant: 'destructive',
      });
      return;
    }
    if (!bodyStr) {
      toast({
        title: 'Write a little note ♡',
        description: 'A wish, a memory, or a kind word is perfect.',
        variant: 'destructive',
      });
      return;
    }
    if (bodyStr.length > MAX_BODY) {
      toast({
        title: 'A little shorter, please ♡',
        description: `Notes can be up to ${MAX_BODY} characters.`,
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const note = addNote(authorStr, bodyStr);
      setNotes((prev) => [note, ...prev]);
      setBody('');
      setAuthor('');
      toast({
        title: 'Note sent ♡',
        description: 'Your little note has been kept in this browser.',
      });
    } catch (err) {
      toast({
        title: 'Could not save your note',
        description:
          err instanceof Error ? err.message : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (note: LoveNote) => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm('Delete this little note? This cannot be undone.');
      if (!ok) return;
    }
    const snapshot = notes;
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    try {
      removeNote(note.id);
      toast({
        title: 'Note removed ♡',
        description: 'A little note has been gently let go.',
      });
    } catch {
      setNotes(snapshot);
      toast({
        title: 'Could not delete that note',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section
      id="notes"
      className="relative bg-gradient-to-b from-[#FFF7FA] via-[#FCEFF5] to-[#FBECF6] px-6 py-24"
    >
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="Love Notes"
          title="Little Notes for Us"
          subtitle={`Leave a little wish, a memory, or a kind word for ${content.partnerOne} & ${content.partnerTwo}. Your note will stay here, kept in their little universe.`}
        />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-2xl glass-card p-5 sm:p-6"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="love-note-author"
                className="block text-xs uppercase tracking-[0.22em] text-ink-soft"
              >
                Your name
              </label>
              <input
                id="love-note-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value.slice(0, MAX_AUTHOR))}
                maxLength={MAX_AUTHOR}
                placeholder="Sign with your name"
                className="mt-2 w-full rounded-xl border border-dusty-pink/25 bg-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-dusty-pink focus:outline-none focus:ring-2 focus:ring-dusty-pink/30"
              />
              <div className="mt-1 text-right text-[11px] text-ink-soft">
                {author.length}/{MAX_AUTHOR}
              </div>
            </div>

            <div>
              <label
                htmlFor="love-note-body"
                className="block text-xs uppercase tracking-[0.22em] text-ink-soft"
              >
                Your note
              </label>
              <textarea
                id="love-note-body"
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, MAX_BODY))}
                maxLength={MAX_BODY}
                rows={4}
                placeholder="A little wish, a memory, or a kind word..."
                className="custom-scroll mt-2 w-full resize-none rounded-xl border border-dusty-pink/25 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-dusty-pink focus:outline-none focus:ring-2 focus:ring-dusty-pink/30"
              />
              <div className="mt-1 text-right text-[11px] text-ink-soft">
                {body.length}/{MAX_BODY}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-6 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(217,130,167,0.3)] transition hover:shadow-[0_14px_36px_rgba(217,130,167,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? 'Sending...' : 'Send your note'}
            </button>
          </div>
        </form>

        {/* Wall */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink-soft">
              <span className="font-medium text-ink">{notes.length}</span>{' '}
              {notes.length === 1 ? 'little note' : 'little notes'} so far ♡
            </p>
            <button
              type="button"
              onClick={loadNotes}
              className="inline-flex items-center gap-1.5 rounded-full border border-dusty-pink/30 bg-white/60 px-3.5 py-1.5 text-xs text-ink backdrop-blur transition hover:bg-white"
            >
              <RefreshCw className="h-3.5 w-3.5 text-dusty-pink" />
              Refresh
            </button>
          </div>

          {loading ? (
            <SkeletonNotes />
          ) : notes.length === 0 ? (
            <EmptyWall />
          ) : (
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
