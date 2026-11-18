import { NextResponse } from 'next/server';
import * as ra from '@/lib/server/retentionAccounts';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const businessId = Number(url.searchParams.get('businessId'));
  return NextResponse.json(ra.listAccounts(businessId));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.businessId || !body?.name || !body?.accountRef) return NextResponse.json({ error: 'businessId, name, accountRef required' }, { status: 400 });
  return NextResponse.json(ra.createAccount(body), { status: 201 });
}
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  ra.deleteAccount(Number(body.id));
  return NextResponse.json({ ok: true });
}