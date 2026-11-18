import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const v = svc.updateAttributeValue(Number(id), body);
  if (!v) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(v);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    svc.deleteAttributeValue(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}