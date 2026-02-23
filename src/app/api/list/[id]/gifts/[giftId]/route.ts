import { NextResponse } from 'next/server';
import { updateGiftStatus, updateGiftDetails, deleteGift, getListById, GiftStatus } from '@/lib/db';
import crypto from 'crypto';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string, giftId: string }> }
) {
  try {
    const { id, giftId } = await params;
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
      return NextResponse.json({ error: 'Unauthorized to edit' }, { status: 401 });
    }

    await updateGiftDetails(giftId, id, name, description, url);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error updating gift details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string, giftId: string }> }
) {
  try {
    const { id, giftId } = await params;
    const { status, password } = await request.json();

    // Validate status
    if (!['available', 'reserved', 'bought'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Certain status updates might require auth (like resetting to 'available'), 
    // but guests should be able to set to 'reserved' or 'bought' freely.
    // For simplicity: Guests can set to reserved/bought. Admin can do anything.
    if (status === 'available') {
      const list = await getListById(id);
      if (!list) return NextResponse.json({ error: 'List not found' }, { status: 404 });
      
      const providedHash = crypto.createHash('sha256').update(password || '').digest('hex');
      if (providedHash !== list.password_hash) {
        return NextResponse.json({ error: 'Unauthorized to reset status' }, { status: 401 });
      }
    }

    await updateGiftStatus(giftId, id, status as GiftStatus);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error updating gift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string, giftId: string }> }
) {
  try {
    const { id, giftId } = await params;
    const { password } = await request.json();

    // Authenticate owner
    const list = await getListById(id);
    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const providedHash = crypto.createHash('sha256').update(password || '').digest('hex');
    if (providedHash !== list.password_hash) {
      return NextResponse.json({ error: 'Unauthorized to delete' }, { status: 401 });
    }

    await deleteGift(giftId, id);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error deleting gift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
