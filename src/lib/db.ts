import { sql } from '@vercel/postgres';

export type GiftStatus = 'available' | 'reserved' | 'bought';

export interface Gift {
  id: string;
  list_id: string;
  name: string;
  description?: string | null;
  url?: string | null;
  status: GiftStatus;
  created_at: Date;
}

export interface GiftList {
  id: string;
  name: string;
  password_hash: string;
  created_at: Date;
}

/**
 * Initializes the database tables if they do not exist.
 */
export async function setupDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS lists (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS gifts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        url TEXT,
        status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'bought')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Database tables verified/created successfully.');
  } catch (error) {
    console.error('Error setting up database schemas:', error);
    throw error;
  }
}

export async function createList(name: string, passwordHash: string): Promise<string> {
  const { rows } = await sql`
    INSERT INTO lists (name, password_hash)
    VALUES (${name}, ${passwordHash})
    RETURNING id;
  `;
  return rows[0].id;
}

export async function getListById(id: string): Promise<GiftList | null> {
  const { rows } = await sql<GiftList>`
    SELECT id, name, password_hash, created_at
    FROM lists
    WHERE id = ${id};
  `;
  return rows[0] || null;
}

export async function getGiftsForList(listId: string): Promise<Gift[]> {
  const { rows } = await sql<Gift>`
    SELECT id, list_id, name, description, url, status, created_at
    FROM gifts
    WHERE list_id = ${listId}
    ORDER BY created_at ASC;
  `;
  return rows as Gift[];
}

export async function addGift(listId: string, name: string, description?: string, url?: string): Promise<string> {
  const { rows } = await sql`
    INSERT INTO gifts (list_id, name, description, url, status)
    VALUES (${listId}, ${name}, ${description || null}, ${url || null}, 'available')
    RETURNING id;
  `;
  return rows[0].id;
}

export async function updateGiftStatus(giftId: string, listId: string, newStatus: GiftStatus): Promise<void> {
  await sql`
    UPDATE gifts
    SET status = ${newStatus}
    WHERE id = ${giftId} AND list_id = ${listId};
  `;
}

export async function deleteGift(giftId: string, listId: string): Promise<void> {
  await sql`
    DELETE FROM gifts
    WHERE id = ${giftId} AND list_id = ${listId};
  `;
}
