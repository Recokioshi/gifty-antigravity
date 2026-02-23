import { NextResponse } from 'next/server';
import { addGift, getListById } from '@/lib/db';
import crypto from 'crypto';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, url, password } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Gift name is required' }, { status: 400 });
    }

    // Authenticate owner
    const list = await getListById(id);
    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const providedHash = crypto.createHash('sha256').update(password || '').digest('hex');
    if (providedHash !== list.password_hash) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const giftId = await addGift(id, name, description, url);

    return NextResponse.json({ id: giftId }, { status: 201 });
  } catch (error) {
    console.error('Error adding gift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
