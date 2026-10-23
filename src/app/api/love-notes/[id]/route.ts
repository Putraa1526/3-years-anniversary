import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing note id.' }, { status: 400 });
    }
    await db.loveNote.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/love-notes/[id] failed', err);
    return NextResponse.json(
      { error: 'Could not delete that little note.' },
      { status: 500 }
    );
  }
}
