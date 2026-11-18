import { NextResponse } from 'next/server';
import * as ra from '@/lib/server/retentionAccounts';
import { parseBody, RetentionAccountSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = ra.getAccount(Number(id));
  if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(a);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(RetentionAccountSchema.partial(), body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const a = ra.updateAccount(Number(id), v.data);
  if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(a);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    ra.deleteAccount(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}