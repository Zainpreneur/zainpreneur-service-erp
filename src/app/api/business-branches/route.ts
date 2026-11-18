import { NextResponse } from 'next/server';
import * as bb from '@/lib/server/businessBranches';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const businessId = Number(url.searchParams.get('businessId'));
  return NextResponse.json(bb.listBranches(businessId));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.businessId || !body?.name) return NextResponse.json({ error: 'businessId and name required' }, { status: 400 });
  return NextResponse.json(bb.createBranch(body), { status: 201 });
}
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  bb.deleteBranch(Number(body.id));
  return NextResponse.json({ ok: true });
}