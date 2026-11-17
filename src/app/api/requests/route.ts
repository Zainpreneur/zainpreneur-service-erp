import { NextResponse } from 'next/server';
import * as reqs from '@/lib/server/requests';

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
  const body = await req.json();
  return NextResponse.json(reqs.createRequest(body), { status: 201 });
}