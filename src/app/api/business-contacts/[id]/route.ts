import { NextResponse } from 'next/server';
import * as bc from '@/lib/server/businessContacts';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const c = bc.updateContact(Number(id), body ?? {});
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(c);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    bc.deleteContact(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}