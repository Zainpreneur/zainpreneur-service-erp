import { NextResponse } from 'next/server';
import * as biz from '@/lib/server/businesses';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || undefined;
  const status = url.searchParams.get('status') || undefined;
  return NextResponse.json(biz.listBusinesses({ search, status }));
}
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(biz.createBusiness(body), { status: 201 });
}