import { NextResponse } from 'next/server';
import * as tks from '@/lib/server/tickets';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const priority = url.searchParams.get('priority') || undefined;
  const type = url.searchParams.get('type') || undefined;
  const businessId = url.searchParams.get('businessId') ? Number(url.searchParams.get('businessId')) : undefined;
  return NextResponse.json(tks.listTickets({ search, status, priority, type, businessId }));
}
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(tks.createTicket(body), { status: 201 });
}