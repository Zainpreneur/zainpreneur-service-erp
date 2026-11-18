import { NextResponse } from 'next/server';
import * as tags from '@/lib/server/tags';
import { parseBody, TagSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = tags.getTag(Number(id));
  if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(t);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(TagSchema.partial(), body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const existing = tags.getTag(Number(id));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated = tags.updateTag(Number(id), v.name ?? existing.name);
  return NextResponse.json(updated);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  tags.archiveTag(Number(id));
  return NextResponse.json({ ok: true });
}