import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const notes = await db.loveNote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ notes });
  } catch (err) {
    console.error('GET /api/love-notes failed', err);
    return NextResponse.json(
      { error: 'Could not load the little notes right now.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { author, body } = (payload ?? {}) as {
      author?: unknown;
      body?: unknown;
    };

    const authorStr = typeof author === 'string' ? author.trim() : '';
    const bodyStr = typeof body === 'string' ? body.trim() : '';

    if (!authorStr || authorStr.length > 50) {
      return NextResponse.json(
        { error: 'Please add your name (1–50 characters).' },
        { status: 400 }
      );
    }
    if (!bodyStr || bodyStr.length > 500) {
      return NextResponse.json(
        { error: 'Please write a little note (1–500 characters).' },
        { status: 400 }
      );
    }

    const note = await db.loveNote.create({
      data: { author: authorStr, body: bodyStr },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    console.error('POST /api/love-notes failed', err);
    return NextResponse.json(
      { error: 'Could not save your little note right now.' },
      { status: 500 }
    );
  }
}
