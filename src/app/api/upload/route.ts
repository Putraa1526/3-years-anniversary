import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token');
    const expected = process.env.ADMIN_PASSWORD || 'ourlittleuniverse';
    if (token !== expected) {
      return NextResponse.json(
        { error: 'You need to sign in as the creator to upload.' },
        { status: 401 }
      );
    }

    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please choose an image file to upload.' },
        { status: 400 }
      );
    }

    const isImage =
      file.type.startsWith('image/') ||
      /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name);
    if (!isImage) {
      return NextResponse.json(
        { error: 'Only image files are supported (png, jpg, gif, webp, bmp, svg).' },
        { status: 400 }
      );
    }

    const MAX = 10 * 1024 * 1024;
    if (file.size > MAX) {
      return NextResponse.json(
        { error: 'That image is a little too big (max 10MB).' },
        { status: 413 }
      );
    }

    const ext = (path.extname(file.name) || '.png').toLowerCase();
    const id = randomBytes(6).toString('hex');
    const filename = `mem-${id}${ext}`;
    const publicDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    await mkdir(publicDir, { recursive: true });
    const fullPath = path.join(publicDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(fullPath, Buffer.from(bytes));

    const publicUrl = `/images/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (err) {
    console.error('POST /api/upload failed', err);
    return NextResponse.json(
      { error: 'Could not save that image right now.' },
      { status: 500 }
    );
  }
}
