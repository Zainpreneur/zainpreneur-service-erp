import { NextResponse } from 'next/server';
import * as roles from '@/lib/server/roles';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(roles.listUserRoles(Number(id)));
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.roleIds || !Array.isArray(body.roleIds)) {
    return NextResponse.json({ error: 'roleIds array required' }, { status: 400 });
  }
  roles.setUserRoles(Number(id), body.roleIds);
  return NextResponse.json({ ok: true });
}