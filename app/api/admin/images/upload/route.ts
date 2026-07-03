import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requirePermission, denied } from '@/lib/auth/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export async function POST(req: Request) {
  const gate = await requirePermission('vehicle:edit');
  if (denied(gate)) return gate;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'File upload is not configured yet. Paste an image URL instead, or add a Vercel Blob store (BLOB_READ_WRITE_TOKEN).' },
      { status: 400 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 });
  }
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image must be under 10 MB.' }, { status: 400 });
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, WebP, AVIF or GIF images are allowed.' }, { status: 400 });
  }

  const safeName = (file.name || 'image').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-60);
  try {
    const blob = await put(`vehicles/${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type || 'image/jpeg',
      token,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('[mit-mak] blob upload failed:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
