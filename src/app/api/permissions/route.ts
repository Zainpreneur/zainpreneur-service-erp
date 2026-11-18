import { NextResponse } from 'next/server';
import * as roles from '@/lib/server/roles';

export async function GET() {
  return NextResponse.json(roles.listPermissions());
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.resource || !body?.action) return NextResponse.json({ error: 'resource and action required' }, { status: 400 });
  const p = roles.createPermission(body);
  if (!p) return NextResponse.json({ error: 'Permission already exists' }, { status: 409 });
  return NextResponse.json(p, { status: 201 });
}