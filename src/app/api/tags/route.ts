import { NextResponse } from 'next/server';
import * as tags from '@/lib/server/tags';

export async function GET() { return NextResponse.json(tags.listTags()); }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  return NextResponse.json(tags.createTag(body.name), { status: 201 });
}
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  tags.archiveTag(Number(body.id));
  return NextResponse.json({ ok: true });
}