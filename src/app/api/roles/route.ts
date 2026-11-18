import { NextResponse } from 'next/server';
import * as roles from '@/lib/server/roles';

export async function GET() {
  return NextResponse.json(roles.listRoles());
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  return NextResponse.json(roles.createRole(body), { status: 201 });
}