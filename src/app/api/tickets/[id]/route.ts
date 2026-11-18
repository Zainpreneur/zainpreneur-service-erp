import { NextResponse } from 'next/server';
import * as tks from '@/lib/server/tickets';
import { parseBody, TicketSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = tks.getTicket(id);
  if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(t);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(TicketSchema.partial(), body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  try {
    const t = tks.updateTicket(id, v.data);
    return NextResponse.json(t);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    tks.deleteTicket(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}