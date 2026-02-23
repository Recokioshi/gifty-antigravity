import { NextResponse } from 'next/server';
import { createList } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json({ error: 'Name and password are required' }, { status: 400 });
    }

    // Hash the password before saving (since it's a simple app we use standard SHA-256)
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const listId = await createList(name, passwordHash);

    return NextResponse.json({ id: listId }, { status: 201 });
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
