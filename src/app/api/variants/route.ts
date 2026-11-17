import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serviceId = url.searchParams.get('serviceId');
  return NextResponse.json(svc.listVariants(serviceId ? Number(serviceId) : undefined));
}
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(svc.createVariant(body), { status: 201 });
}