import { NextResponse } from 'next/server';
import * as bc from '@/lib/server/businessContacts';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const businessId = Number(url.searchParams.get('businessId'));
  return NextResponse.json(bc.listContacts(businessId));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.businessId || !body?.name) return NextResponse.json({ error: 'businessId and name required' }, { status: 400 });
  return NextResponse.json(bc.createContact(body), { status: 201 });
}