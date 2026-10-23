import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LOVE_CONFIG } from '@/config/loveConfig';

export async function GET() {
  try {
    let record = await db.songSetting.findUnique({ where: { id: 'singleton' } });
    if (!record) {
      record = await db.songSetting.create({
        data: {
          id: 'singleton',
          url: '',
          title: LOVE_CONFIG.music.title,
          artist: LOVE_CONFIG.music.artist,
          cover: '',
        },
      });
    }
    return NextResponse.json({
      url: record.url,
      title: record.title,
      artist: record.artist,
      cover: record.cover,
      updatedAt: record.updatedAt,
    });
  } catch (err) {
    console.error('GET /api/song failed', err);
    return NextResponse.json(
      { error: 'Could not load the song setting.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { url, title, artist, cover } = (payload ?? {}) as {
      url?: unknown;
      title?: unknown;
      artist?: unknown;
      cover?: unknown;
    };

    const urlStr = typeof url === 'string' ? url.trim() : '';
    const titleStr = typeof title === 'string' ? title.trim().slice(0, 120) : '';
    const artistStr = typeof artist === 'string' ? artist.trim().slice(0, 120) : '';
    const coverStr = typeof cover === 'string' ? cover.trim().slice(0, 500) : '';

    if (urlStr && !urlStr.startsWith('/') && !/^https?:\/\//i.test(urlStr)) {
      return NextResponse.json(
        { error: 'Song URL must start with / (a file on this site) or http(s)://.' },
        { status: 400 }
      );
    }

    const data = {
      url: urlStr,
      ...(titleStr ? { title: titleStr } : {}),
      ...(artistStr ? { artist: artistStr } : {}),
      cover: coverStr,
    };

    const record = await db.songSetting.upsert({
      where: { id: 'singleton' },
      update: data,
      create: {
        id: 'singleton',
        url: urlStr,
        title: titleStr || LOVE_CONFIG.music.title,
        artist: artistStr || LOVE_CONFIG.music.artist,
        cover: coverStr,
      },
    });

    return NextResponse.json({
      url: record.url,
      title: record.title,
      artist: record.artist,
      cover: record.cover,
      updatedAt: record.updatedAt,
    });
  } catch (err) {
    console.error('PUT /api/song failed', err);
    return NextResponse.json(
      { error: 'Could not update the song setting.' },
      { status: 500 }
    );
  }
}
