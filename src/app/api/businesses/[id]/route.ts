import { NextResponse } from 'next/server';
import * as biz from '@/lib/server/businesses';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = biz.getBusiness(id);
  if (!b) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(b);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const b = biz.updateBusiness(id, body);
  if (!b) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(b);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  biz.deleteBusiness(id);
  return NextResponse.json({ ok: true });
}