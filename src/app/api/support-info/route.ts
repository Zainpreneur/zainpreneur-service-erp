import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serviceId = Number(url.searchParams.get('serviceId'));
  return NextResponse.json(svc.getSupportInfo(serviceId));
}
export async function PUT(req: Request) {
  const body = await req.json();
  return NextResponse.json(svc.upsertSupportInfo(body.serviceId, body));
}