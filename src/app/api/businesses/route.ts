import { NextResponse } from 'next/server';
import * as biz from '@/lib/server/businesses';
import { parseBody, BusinessSchema } from '@/lib/validation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || undefined;
  const status = url.searchParams.get('status') || undefined;
  return NextResponse.json(biz.listBusinesses({ search, status }));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = parseBody(BusinessSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  return NextResponse.json(biz.createBusiness(v.data), { status: 201 });
}