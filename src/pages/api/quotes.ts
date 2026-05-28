import type { APIRoute } from 'astro';
import { db, initDB } from '../../lib/db';
import { PRESET_QUOTES } from '../../lib/quotes';

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await initDB();
    initialized = true;
  }
}

export const GET: APIRoute = async () => {
  await ensureInit();

  const result = await db.execute(
    'SELECT content FROM quotes WHERE approved = 1 ORDER BY created_at DESC LIMIT 100'
  );

  const userQuotes = result.rows.map(r => r.content as string);
  const allQuotes = [...userQuotes, ...PRESET_QUOTES];

  return new Response(JSON.stringify({ quotes: allQuotes }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  await ensureInit();

  const body = await request.json();
  const content = (body.content ?? '').trim();

  if (!content || content.length > 80) {
    return new Response(JSON.stringify({ error: '内容为空或超过80字' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const ipHash = await hashIP(ip);

  const recent = await db.execute({
    sql: `SELECT COUNT(*) as c FROM quotes WHERE ip_hash = ? AND created_at > datetime('now', '-1 minutes')`,
    args: [ipHash],
  });

  if ((recent.rows[0].c as number) > 0) {
    return new Response(JSON.stringify({ error: '手速太快了，歇会儿再栓' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await db.execute({
    sql: 'INSERT INTO quotes (content, ip_hash) VALUES (?, ?)',
    args: [content, ipHash],
  });

  await db.execute('UPDATE counter SET count = count + 1 WHERE id = 1');

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'shuanq-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}
