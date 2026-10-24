import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  type SiteContent,
  defaultContent,
  mergeContent,
} from '@/config/loveConfig';

export async function GET() {
  try {
    const record = await db.siteContent.findUnique({ where: { id: 'singleton' } });
    let parsed: Partial<SiteContent> | null = null;
    if (record?.data) {
      try {
        parsed = JSON.parse(record.data) as Partial<SiteContent>;
      } catch {
        parsed = null;
      }
    }
    const merged = mergeContent(parsed);
    return NextResponse.json(merged);
  } catch (err) {
    console.error('GET /api/content failed', err);
    return NextResponse.json(
      { error: 'Could not load the content.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token');
    const expected = process.env.ADMIN_PASSWORD || 'ourlittleuniverse';
    if (token !== expected) {
      return NextResponse.json(
        { error: 'You need to sign in as the creator to edit this site.' },
        { status: 401 }
      );
    }

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const cleaned = sanitizeContent(payload);
    if (!cleaned) {
      return NextResponse.json(
        { error: 'The content you sent was not valid.' },
        { status: 400 }
      );
    }

    const json = JSON.stringify(cleaned);
    const record = await db.siteContent.upsert({
      where: { id: 'singleton' },
      update: { data: json },
      create: { id: 'singleton', data: json },
    });

    return NextResponse.json({
      ...cleaned,
      updatedAt: record.updatedAt,
    });
  } catch (err) {
    console.error('PUT /api/content failed', err);
    return NextResponse.json(
      { error: 'Could not save the content right now.' },
      { status: 500 }
    );
  }
}

function sanitizeContent(payload: unknown): SiteContent | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;

  const str = (v: unknown, max: number, fallback: string): string => {
    if (typeof v !== 'string') return fallback;
    const t = v.trim();
    return t.slice(0, max);
  };
  const strArr = (v: unknown, maxPer: number, fallback: string[]): string[] => {
    if (!Array.isArray(v)) return fallback;
    const out = v
      .map((x) => (typeof x === 'string' ? x.trim().slice(0, maxPer) : ''))
      .filter((x) => x.length > 0);
    return out.length > 0 ? out : fallback;
  };

  try {
    const base = mergeContent(null);

    const story = Array.isArray(p.story)
      ? (p.story as unknown[])
          .map((item) => {
            const o = (item ?? {}) as Record<string, unknown>;
            return {
              date: str(o.date, 60, ''),
              title: str(o.title, 120, ''),
              description: str(o.description, 600, ''),
              image: str(o.image, 500, ''),
              ornament: str(o.ornament, 4, '✦') || '✦',
            };
          })
          .filter((o) => o.title || o.description)
      : base.story;

    const gallery = Array.isArray(p.gallery)
      ? (p.gallery as unknown[])
          .map((item) => {
            const o = (item ?? {}) as Record<string, unknown>;
            return {
              src: str(o.src, 500, ''),
              alt: str(o.alt, 200, 'A little memory.'),
              caption: str(o.caption, 120, ''),
            };
          })
      : base.gallery;

    const surpriseCards = Array.isArray(p.surpriseCards)
      ? (p.surpriseCards as unknown[])
          .map((item) => {
            const o = (item ?? {}) as Record<string, unknown>;
            return {
              title: str(o.title, 120, ''),
              body: str(o.body, 600, ''),
            };
          })
          .filter((o) => o.title || o.body)
      : base.surpriseCards;

    const letterRaw = (p.letter ?? {}) as Record<string, unknown>;
    const letter = {
      greeting: str(letterRaw.greeting, 80, base.letter.greeting),
      paragraphs: strArr(letterRaw.paragraphs, 1000, base.letter.paragraphs),
      closing: str(letterRaw.closing, 120, base.letter.closing),
      signOff: str(letterRaw.signOff, 60, base.letter.signOff),
      signature: str(letterRaw.signature, 60, base.letter.signature),
    };

    return {
      partnerOne: str(p.partnerOne, 40, base.partnerOne),
      partnerTwo: str(p.partnerTwo, 40, base.partnerTwo),
      siteTitle: str(p.siteTitle, 80, base.siteTitle),
      tagline: str(p.tagline, 120, base.tagline),
      anniversaryDate: str(p.anniversaryDate, 20, base.anniversaryDate),
      anniversaryMessage: str(p.anniversaryMessage, 200, base.anniversaryMessage),
      heroSubtitle: str(p.heroSubtitle, 300, base.heroSubtitle),
      story,
      gallery,
      letter,
      surpriseCards,
      surpriseMessages: strArr(p.surpriseMessages, 400, base.surpriseMessages),
      footerMain: str(p.footerMain, 120, base.footerMain),
      footerSub: str(p.footerSub, 120, base.footerSub),
    };
  } catch {
    return null;
  }
}
