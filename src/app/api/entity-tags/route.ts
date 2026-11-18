import { NextResponse } from 'next/server';
import * as tags from '@/lib/server/tags';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const entity = url.searchParams.get('entity') as any;
  const entityId = Number(url.searchParams.get('entityId'));
  return NextResponse.json(tags.listEntityTags(entity, entityId));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.entity || !body?.entityId || !body?.tagId) return NextResponse.json({ error: 'entity, entityId, tagId required' }, { status: 400 });
  tags.addEntityTag(body.entity, Number(body.entityId), Number(body.tagId));
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.entity || !body?.entityId || !body?.tagId) return NextResponse.json({ error: 'entity, entityId, tagId required' }, { status: 400 });
  tags.removeEntityTag(body.entity, Number(body.entityId), Number(body.tagId));
  return NextResponse.json({ ok: true });
}