import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';
import { parseBody, ServiceSchema } from '@/lib/validation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || undefined;
  const categoryId = url.searchParams.get('categoryId') ? Number(url.searchParams.get('categoryId')) : undefined;
  const active = url.searchParams.get('active');
  return NextResponse.json(svc.listServices({ search, categoryId, active: active === null ? undefined : active === 'true' }));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = parseBody(ServiceSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  return NextResponse.json(svc.createService(v.data), { status: 201 });
}