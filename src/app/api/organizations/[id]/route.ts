import { NextResponse } from 'next/server';
import * as org from '@/lib/server/organizations';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = org.getOrganization(Number(id));
  if (!o) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(o);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const o = org.updateOrganization(Number(id), body ?? {});
  if (!o) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(o);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  org.deleteOrganization(Number(id));
  return NextResponse.json({ ok: true });
}