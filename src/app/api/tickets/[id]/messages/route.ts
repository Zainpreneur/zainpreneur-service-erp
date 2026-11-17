import { NextResponse } from 'next/server';
import * as tks from '@/lib/server/tickets';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const msg = tks.addMessage(Number(id), body.author, body.authorRole, body.body, body.isInternal);
  tks.addTicketEvent(Number(id), 'message', body.author, body.body?.slice(0, 80));
  return NextResponse.json(msg, { status: 201 });
}