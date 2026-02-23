import { NextResponse } from 'next/server';
import { getListById, getGiftsForList } from '@/lib/db';
import crypto from 'crypto';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const list = await getListById(id);

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const gifts = await getGiftsForList(id);

    // Never return the password hash to the client
    const { password_hash, ...safeList } = list;

    return NextResponse.json({ list: safeList, gifts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** 
 * Verify owner password for a specific list 
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { password } = await request.json();
    const list = await getListById(id);

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const providedHash = crypto.createHash('sha256').update(password).digest('hex');

    if (providedHash === list.password_hash) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error verifying owner:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
