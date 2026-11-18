import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 });
  }

  const person = db.prepare('SELECT * FROM people WHERE email = ?').get(body.email) as any;
  if (!person) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = person.password_hash && verifyPassword(body.password, person.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const userRoles = db.prepare(
    `SELECT r.name FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ?`
  ).all(person.id) as any[];

  return NextResponse.json({
    id: person.id,
    name: person.name,
    email: person.email,
    role: person.role,
    team: person.team,
    roles: userRoles.map(r => r.name),
  });
}