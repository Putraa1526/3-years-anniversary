'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/lib/romantic/admin-context';
import { useContent } from '@/lib/romantic/content-context';
import {
  type SiteContent, type StoryItem, type GalleryItem, type SurpriseCard, defaultContent,
} from '@/config/loveConfig';
import { Heart, Loader2, Plus, Trash2, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';

const TABS = [
  { id: 'brand', label: 'Brand & Hero' },
  { id: 'days', label: 'Days' },
  { id: 'story', label: 'Our Story' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'letter', label: 'Letter' },
  { id: 'surprise', label: 'Surprises' },
  { id: 'footer', label: 'Footer' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AdminPanel() {
  const { panelOpen, setPanelOpen, token, logout } = useAdmin();
  const { content, refresh } = useContent();
  const { toast } = useToast();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabId>('brand');
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [draft, content]);

  useEffect(() => { if (panelOpen) setDraft(content); }, [panelOpen, content]);

  useEffect(() => {
    if (!panelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanelOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [panelOpen, setPanelOpen]);

  if (!panelOpen) return null;

  const update = (patch: Partial<SiteContent>) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token ?? '' }, body: JSON.stringify(draft) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save.');
      await refresh();
      toast({ title: 'Your changes were saved ♡', description: 'The site has been updated.' });
    } catch (err) {
      toast({ title: 'Could not save', description: err instanceof Error ? err.message : 'Please try again in a moment.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const ok = window.confirm('Reset all content back to the original defaults? This will overwrite your edits on Save.');
    if (!ok) return;
    setDraft({ ...defaultContent });
    toast({ title: 'Reset to defaults', description: 'Press Save to keep them.' });
  };

  return (
    <Dialog open={panelOpen} onOpenChange={setPanelOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] rounded-3xl border-dusty-pink/30 bg-white/95 backdrop-blur p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-dusty-pink/15 shrink-0">
          <DialogTitle className="font-serif-romantic text-xl text-ink flex items-center gap-2"><Heart className="h-4 w-4 fill-dusty-pink text-dusty-pink" />Edit this little universe</DialogTitle>
          <DialogDescription className="text-ink-soft">Edit the text and photos. Save keeps them in the database and the whole site updates live.</DialogDescription>
        </DialogHeader>
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} className="flex-1 flex flex-col min-h-0">
          <div className="px-4 pt-3 shrink-0">
            <TabsList className="flex h-auto flex-wrap gap-1 bg-pink-pastel/15 p-1 rounded-2xl">
              {TABS.map((t) => (<TabsTrigger key={t.id} value={t.id} className="rounded-xl px-3 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-dusty-pink data-[state=active]:shadow-sm">{t.label}</TabsTrigger>))}
            </TabsList>
          </div>
          <div className="custom-scroll flex-1 overflow-y-auto px-5 py-5">
            <TabsContent value="brand" className="mt-0"><BrandTab draft={draft} update={update} /></TabsContent>
            <TabsContent value="days" className="mt-0"><DaysTab draft={draft} update={update} /></TabsContent>
            <TabsContent value="story" className="mt-0"><StoryTab draft={draft} update={update} token={token} toast={toast} /></TabsContent>
            <TabsContent value="gallery" className="mt-0"><GalleryTab draft={draft} update={update} token={token} toast={toast} /></TabsContent>
            <TabsContent value="letter" className="mt-0"><LetterTab draft={draft} update={update} /></TabsContent>
            <TabsContent value="surprise" className="mt-0"><SurpriseTab draft={draft} update={update} /></TabsContent>
            <TabsContent value="footer" className="mt-0"><FooterTab draft={draft} update={update} /></TabsContent>
          </div>
        </Tabs>
        <div className="shrink-0 border-t border-dusty-pink/15 bg-white/70 px-6 py-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-2 text-xs font-medium text-ink-soft border border-dusty-pink/20 transition hover:bg-white hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink"><RotateCcw className="h-3.5 w-3.5" />Reset to defaults</button>
            <button onClick={() => { logout(); setPanelOpen(false); }} className="text-[11px] text-ink-soft/70 underline-offset-2 hover:underline hover:text-dusty-pink">Sign out</button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] ${dirty ? 'text-dusty-pink' : 'text-ink-soft/60'}`}>{dirty ? 'Unsaved changes' : 'All saved'}</span>
            <DialogClose asChild><button className="rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-ink-soft border border-dusty-pink/20 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-dusty-pink">Close</button></DialogClose>
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-dusty-pink to-soft-rose px-5 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(217,130,167,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(217,130,167,0.45)] focus-visible:outline-2 focus-visible:outline-dusty-pink disabled:opacity-60">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className="h-3.5 w-3.5 fill-white" />}{saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (<label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>{children}{hint && <span className="mt-1 block text-[10px] text-ink-soft/70">{hint}</span>}</label>);
}
function inputCls() { return 'w-full rounded-2xl border border-dusty-pink/25 bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-dusty-pink focus:bg-white'; }
function textareaCls() { return 'custom-scroll w-full resize-y rounded-2xl border border-dusty-pink/25 bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-dusty-pink focus:bg-white'; }
function Card({ children }: { children: React.ReactNode }) { return <div className="rounded-2xl bg-pink-pastel/10 border border-dusty-pink/15 p-4">{children}</div>; }
function SectionLabel({ children }: { children: React.ReactNode }) { return <h4 className="mb-3 font-serif-romantic text-base font-semibold text-ink">{children}</h4>; }

function BrandTab({ draft, update }: { draft: SiteContent; update: (p: Partial<SiteContent>) => void }) {
  return (<div className="space-y-4"><Card><SectionLabel>The two of you</SectionLabel><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Partner one (the one the site is for)"><input className={inputCls()} value={draft.partnerOne} onChange={(e) => update({ partnerOne: e.target.value.slice(0, 40) })} /></Field><Field label="Partner two (the creator)"><input className={inputCls()} value={draft.partnerTwo} onChange={(e) => update({ partnerTwo: e.target.value.slice(0, 40) })} /></Field></div></Card><Card><SectionLabel>Hero</SectionLabel><div className="space-y-3"><Field label="Site title"><input className={inputCls()} value={draft.siteTitle} onChange={(e) => update({ siteTitle: e.target.value.slice(0, 80) })} /></Field><Field label="Tagline"><input className={inputCls()} value={draft.tagline} onChange={(e) => update({ tagline: e.target.value.slice(0, 120) })} /></Field><Field label="Hero subtitle"><textarea className={textareaCls()} rows={2} value={draft.heroSubtitle} onChange={(e) => update({ heroSubtitle: e.target.value.slice(0, 300) })} /></Field></div></Card></div>);
}

function DaysTab({ draft, update }: { draft: SiteContent; update: (p: Partial<SiteContent>) => void }) {
  return (<Card><SectionLabel>Days together</SectionLabel><div className="space-y-3"><Field label="Anniversary date" hint='Use the format YYYY-MM-DD (e.g. 2022-08-14). Leave "YYYY-MM-DD" to show the waiting message instead of a fake counter.'><input className={inputCls()} value={draft.anniversaryDate} placeholder="YYYY-MM-DD" onChange={(e) => update({ anniversaryDate: e.target.value.slice(0, 20) })} /></Field><Field label="Anniversary message"><textarea className={textareaCls()} rows={2} value={draft.anniversaryMessage} onChange={(e) => update({ anniversaryMessage: e.target.value.slice(0, 200) })} /></Field></div></Card>);
}

function StoryTab({ draft, update, token, toast }: { draft: SiteContent; update: (p: Partial<SiteContent>) => void; token: string | null; toast: ReturnType<typeof useToast>['toast'] }) {
  const items = draft.story;
  const setItem = (i: number, patch: Partial<StoryItem>) => update({ story: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const add = () => update({ story: [...items, { date: '', title: 'A new little moment', description: '', image: '', ornament: '✦' }] });
  const remove = (i: number) => update({ story: items.filter((_, idx) => idx !== i) });
  return (<div className="space-y-4"><p className="text-xs text-ink-soft">Each timeline entry shows a polaroid with a date, title, short description, and an optional photo.</p>{items.map((item, i) => (<Card key={i}><div className="mb-3 flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Moment {i + 1}</span><button onClick={() => remove(i)} className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 text-[11px] text-ink-soft border border-dusty-pink/20 transition hover:bg-white hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink"><Trash2 className="h-3 w-3" />Remove</button></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Date label"><input className={inputCls()} value={item.date} onChange={(e) => setItem(i, { date: e.target.value.slice(0, 60) })} placeholder="August 14, 2022" /></Field><Field label="Title"><input className={inputCls()} value={item.title} onChange={(e) => setItem(i, { title: e.target.value.slice(0, 120) })} /></Field></div><div className="mt-3"><Field label="Description"><textarea className={textareaCls()} rows={3} value={item.description} onChange={(e) => setItem(i, { description: e.target.value.slice(0, 600) })} /></Field></div><div className="mt-3"><PhotoInput label="Photo (optional)" value={item.image} onChange={(url) => setItem(i, { image: url })} token={token} toast={toast} /></div></Card>))}<button onClick={add} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-dusty-pink border border-dusty-pink/30 transition hover:bg-white hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-dusty-pink"><Plus className="h-3.5 w-3.5" />Add a moment</button></div>);
}

function GalleryTab({ draft, update, token, toast }: { draft: SiteContent; update: (p: Partial<SiteContent>) => void; token: string | null; toast: ReturnType<typeof useToast>['toast'] }) {
  const items = draft.gallery;
  const setItem = (i: number, patch: Partial<GalleryItem>) => update({ gallery: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const add = () => update({ gallery: [...items, { src: '', alt: 'A little memory.', caption: '' }] });
  const remove = (i: number) => update({ gallery: items.filter((_, idx) => idx !== i) });
  return (<div className="space-y-4"><p className="text-xs text-ink-soft">Upload a photo for each frame, or paste an image URL. Captions show under the polaroid.</p>{items.map((item, i) => (<Card key={i}><div className="mb-3 flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Photo {i + 1}</span><button onClick={() => remove(i)} className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 text-[11px] text-ink-soft border border-dusty-pink/20 transition hover:bg-white hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink"><Trash2 className="h-3 w-3" />Remove</button></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Caption"><input className={inputCls()} value={item.caption ?? ''} onChange={(e) => setItem(i, { caption: e.target.value.slice(0, 120) })} placeholder="the beginning of everything" /></Field><Field label="Alt text (for screen readers)"><input className={inputCls()} value={item.alt} onChange={(e) => setItem(i, { alt: e.target.value.slice(0, 200) })} /></Field></div><div className="mt-3"><PhotoInput label="Photo" value={item.src} onChange={(url) => setItem(i, { src: url })} token={token} toast={toast} /></div></Card>))}<button onClick={add} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-dusty-pink border border-dusty-pink/30 transition hover:bg-white hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-dusty-pink"><Plus className="h-3.5 w-3.5" />Add a photo</button></div>);
}

function LetterTab({ draft, update }: { draft: SiteContent; update: (p: Partial<SiteContent>) => void }) {
  const letter = draft.letter;
  const setLetter = (patch: Partial<SiteContent['letter']>) => update({ letter: { ...letter, ...patch } });
  return (<Card><SectionLabel>Love letter</SectionLabel><div className="space-y-3"><Field label="Greeting"><input className={inputCls()} value={letter.greeting} onChange={(e) => setLetter({ greeting: e.target.value.slice(0, 80) })} /></Field><div><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">Paragraphs</span><div className="space-y-2">{letter.paragraphs.map((p, i) => (<div key={i} className="flex gap-2"><textarea className={textareaCls()} rows={3} value={p} onChange={(e) => { const next = letter.paragraphs.map((x, idx) => (idx === i ? e.target.value.slice(0, 1000) : x)); setLetter({ paragraphs: next }); }} /><button onClick={() => setLetter({ paragraphs: letter.paragraphs.filter((_, idx) => idx !== i) })} className="shrink-0 self-start rounded-full bg-white/60 p-2 text-ink-soft border border-dusty-pink/20 transition hover:bg-white hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink" aria-label="Remove paragraph"><Trash2 className="h-3.5 w-3.5" /></button></div>))}<button onClick={() => setLetter({ paragraphs: [...letter.paragraphs, ''] })} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-medium text-dusty-pink border border-dusty-pink/30 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-dusty-pink"><Plus className="h-3 w-3" />Add a paragraph</button></div></div><Field label="Closing line"><input className={inputCls()} value={letter.closing} onChange={(e) => setLetter({ closing: e.target.value.slice(0, 120) })} /></Field><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Sign-off"><input className={inputCls()} value={letter.signOff} onChange={(e) => setLetter({ signOff: e.target.value.slice(0, 60) })} /></Field><Field label="Signature (name)"><input className={inputCls()} value={letter.signature} onChange={(e) => setLetter({ signature: e.target.value.slice(0, 60) })} /></Field></div></div></Card>);
}

function SurpriseTab({ draft, update }: { draft: SiteContent; update: (p: Partial<SiteContent>) => void }) {
  const cards = draft.surpriseCards;
  const setCard = (i: number, patch: Partial<SurpriseCard>) => update({ surpriseCards: cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  const removeCard = (i: number) => update({ surpriseCards: cards.filter((_, idx) => idx !== i) });
  const addCard = () => update({ surpriseCards: [...cards, { title: 'A Little Something', body: '' }] });
  const msgs = draft.surpriseMessages;
  const setMsg = (i: number, v: string) => update({ surpriseMessages: msgs.map((m, idx) => (idx === i ? v.slice(0, 400) : m)) });
  const removeMsg = (i: number) => update({ surpriseMessages: msgs.filter((_, idx) => idx !== i) });
  const addMsg = () => update({ surpriseMessages: [...msgs, ''] });
  return (<div className="space-y-4"><Card><SectionLabel>Surprise cards (the three revealable ones)</SectionLabel><div className="space-y-3">{cards.map((c, i) => (<div key={i} className="rounded-xl bg-white/60 p-3 border border-dusty-pink/15"><div className="mb-2 flex items-center justify-between"><span className="text-[11px] text-ink-soft">Card {i + 1}</span><button onClick={() => removeCard(i)} className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[10px] text-ink-soft border border-dusty-pink/20 hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink"><Trash2 className="h-3 w-3" />Remove</button></div><input className={inputCls() + ' mb-2'} value={c.title} placeholder="Title" onChange={(e) => setCard(i, { title: e.target.value.slice(0, 120) })} /><textarea className={textareaCls()} rows={3} value={c.body} placeholder="Body" onChange={(e) => setCard(i, { body: e.target.value.slice(0, 600) })} /></div>))}<button onClick={addCard} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-medium text-dusty-pink border border-dusty-pink/30 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-dusty-pink"><Plus className="h-3 w-3" />Add a card</button></div></Card><Card><SectionLabel>Random surprise messages</SectionLabel><div className="space-y-2">{msgs.map((m, i) => (<div key={i} className="flex gap-2"><textarea className={textareaCls()} rows={2} value={m} onChange={(e) => setMsg(i, e.target.value)} /><button onClick={() => removeMsg(i)} className="shrink-0 self-start rounded-full bg-white/60 p-2 text-ink-soft border border-dusty-pink/20 transition hover:bg-white hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink" aria-label="Remove message"><Trash2 className="h-3.5 w-3.5" /></button></div>))}<button onClick={addMsg} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-medium text-dusty-pink border border-dusty-pink/30 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-dusty-pink"><Plus className="h-3 w-3" />Add a message</button></div></Card></div>);
}

function FooterTab({ draft, update }: { draft: SiteContent; update: (p: Partial<SiteContent>) => void }) {
  return (<Card><SectionLabel>Footer text</SectionLabel><div className="space-y-3"><Field label="Main line"><input className={inputCls()} value={draft.footerMain} onChange={(e) => update({ footerMain: e.target.value.slice(0, 120) })} /></Field><Field label="Sub line"><input className={inputCls()} value={draft.footerSub} onChange={(e) => update({ footerSub: e.target.value.slice(0, 120) })} /></Field></div></Card>);
}

function PhotoInput({ label, value, onChange, token, toast }: { label: string; value: string; onChange: (url: string) => void; token: string | null; toast: ReturnType<typeof useToast>['toast'] }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      const res = await fetch('/api/upload', { method: 'POST', headers: { 'x-admin-token': token ?? '' }, body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');
      onChange(data.url as string);
      toast({ title: 'Photo uploaded ♡' });
    } catch (err) {
      toast({ title: 'Could not upload', description: err instanceof Error ? err.message : 'Please try again.' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };
  return (<div><span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span><div className="flex flex-col gap-3 sm:flex-row sm:items-start"><div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#FCE7F1] via-[#F8C8DC]/40 to-[#E8DDF8] border border-dusty-pink/20 flex items-center justify-center">{value ? (<img src={value} alt="Preview" className="h-full w-full object-cover" />) : (<ImageIcon className="h-6 w-6 text-dusty-pink/50" />)}</div><div className="flex-1 space-y-2"><input type="file" accept="image/*" ref={inputRef} onChange={handleFile} disabled={uploading} className="block w-full text-[11px] text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-dusty-pink file:to-soft-rose file:px-3 file:py-1.5 file:text-white file:font-medium file:cursor-pointer file:text-[11px] hover:file:-translate-y-0.5 file:transition-transform disabled:opacity-60" /><input className={inputCls()} value={value} placeholder="…or paste an image URL" onChange={(e) => onChange(e.target.value.slice(0, 500))} />{value && (<button onClick={() => onChange('')} className="inline-flex items-center gap-1 text-[11px] text-ink-soft hover:text-dusty-pink focus-visible:outline-2 focus-visible:outline-dusty-pink">{uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}{uploading ? 'Uploading…' : 'Clear photo'}</button>)}</div></div></div>);
}
