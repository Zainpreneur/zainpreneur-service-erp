import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = svc.getAttribute(Number(id));
  if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(a);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const a = svc.updateAttribute(Number(id), body);
  if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(a);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    svc.deleteAttribute(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}