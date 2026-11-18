import { NextResponse } from 'next/server';
import * as reqs from '@/lib/server/requests';
import { parseBody, RequestSchema } from '@/lib/validation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const priority = url.searchParams.get('priority') || undefined;
  const businessId = url.searchParams.get('businessId') ? Number(url.searchParams.get('businessId')) : undefined;
  const serviceId = url.searchParams.get('serviceId') ? Number(url.searchParams.get('serviceId')) : undefined;
  const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : undefined;
  const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined;
  return NextResponse.json(reqs.listRequests({ search, status, priority, businessId, serviceId, page, limit }));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = parseBody(RequestSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  return NextResponse.json(reqs.createRequest(v.data), { status: 201 });
}