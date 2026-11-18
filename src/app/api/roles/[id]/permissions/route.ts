import { NextResponse } from 'next/server';
import * as roles from '@/lib/server/roles';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(roles.listRolePermissionDetails(Number(id)));
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.permissionIds || !Array.isArray(body.permissionIds)) {
    return NextResponse.json({ error: 'permissionIds array required' }, { status: 400 });
  }
  roles.setRolePermissions(Number(id), body.permissionIds);
  return NextResponse.json({ ok: true });
}