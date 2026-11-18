import { NextResponse } from 'next/server';
import * as tr from '@/lib/server/ticketRelations';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ticketId = Number(url.searchParams.get('ticketId'));
  return NextResponse.json(tr.listRelated(ticketId));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.ticketId || !body?.relatedId) return NextResponse.json({ error: 'ticketId and relatedId required' }, { status: 400 });
  tr.addRelation(Number(body.ticketId), Number(body.relatedId));
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.ticketId || !body?.relatedId) return NextResponse.json({ error: 'ticketId and relatedId required' }, { status: 400 });
  tr.removeRelation(Number(body.ticketId), Number(body.relatedId));
  return NextResponse.json({ ok: true });
}