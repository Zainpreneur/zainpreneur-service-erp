import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';
import { parseBody, ConfigRuleSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = svc.getConfigRule(Number(id));
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(c);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(ConfigRuleSchema.partial(), body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const c = svc.updateConfigRule(Number(id), v.data);
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(c);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    svc.deleteConfigRule(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}