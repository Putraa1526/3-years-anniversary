import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { LOVE_CONFIG } from '@/config/loveConfig';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please choose an audio file to upload.' },
        { status: 400 }
      );
    }

    const isAudio =
      file.type.startsWith('audio/') ||
      /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name);
    if (!isAudio) {
      return NextResponse.json(
        { error: 'Only audio files are supported (mp3, wav, ogg, m4a, aac, flac).' },
        { status: 400 }
      );
    }

    // 25MB cap — Vercel serverless allows larger bodies than static storage.
    const MAX = 25 * 1024 * 1024;
    if (file.size > MAX) {
      return NextResponse.json(
        { error: 'That file is a little too big (max 25MB). Try a smaller one ♡' },
        { status: 413 }
      );
    }

    const ext = path.extname(file.name) || '.mp3';
    const filename = `our-song${ext.toLowerCase()}`;
    const publicAudioDir = path.join(process.cwd(), 'public', 'audio');
    await mkdir(publicAudioDir, { recursive: true });
    const fullPath = path.join(publicAudioDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(fullPath, Buffer.from(bytes));

    const publicUrl = `/audio/${filename}`;

    await db.songSetting.upsert({
      where: { id: 'singleton' },
      update: { url: publicUrl },
      create: {
        id: 'singleton',
        url: publicUrl,
        title: LOVE_CONFIG.music.title,
        artist: LOVE_CONFIG.music.artist,
        cover: '',
      },
    });

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (err) {
    console.error('POST /api/song/upload failed', err);
    return NextResponse.json(
      { error: 'Could not save that audio file right now.' },
      { status: 500 }
    );
  }
}
