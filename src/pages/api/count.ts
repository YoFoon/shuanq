import type { APIRoute } from 'astro';
import { db, initDB } from '../../lib/db';

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await initDB();
    initialized = true;
  }
}

export const GET: APIRoute = async () => {
  await ensureInit();
  const result = await db.execute('SELECT count FROM counter WHERE id = 1');
  const count = (result.rows[0]?.count as number) ?? 12847;
  return new Response(JSON.stringify({ count }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async () => {
  await ensureInit();
  await db.execute('UPDATE counter SET count = count + 1 WHERE id = 1');
  const result = await db.execute('SELECT count FROM counter WHERE id = 1');
  const count = result.rows[0]?.count as number;
  return new Response(JSON.stringify({ count }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
