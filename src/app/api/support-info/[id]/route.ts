import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';
import { parseBody, SupportInfoSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = svc.getSupportInfo(Number(id));
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(s);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(SupportInfoSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const s = svc.upsertSupportInfo(Number(id), v.data);
  return NextResponse.json(s);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // support_info is upsert-only; soft-delete not supported
  return NextResponse.json({ error: 'Not supported' }, { status: 405 });
}