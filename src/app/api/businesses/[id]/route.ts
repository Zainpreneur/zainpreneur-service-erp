import { NextResponse } from 'next/server';
import * as biz from '@/lib/server/businesses';
import { parseBody, BusinessSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = biz.getBusiness(id);
  if (!b) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(b);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(BusinessSchema.partial(), body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const b = biz.updateBusiness(id, v.data);
  if (!b) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(b);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    biz.deleteBusiness(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}