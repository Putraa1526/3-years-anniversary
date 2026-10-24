import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    const { password } = (payload ?? {}) as { password?: unknown };
    const expected = process.env.ADMIN_PASSWORD || 'ourlittleuniverse';

    if (typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { error: 'Please enter the creator password.' },
        { status: 400 }
      );
    }

    if (password !== expected) {
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        { error: 'That password is not quite right ♡' },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, token: expected });
  } catch (err) {
    console.error('POST /api/auth/admin failed', err);
    return NextResponse.json(
      { error: 'Could not sign you in right now.' },
      { status: 500 }
    );
  }
}
