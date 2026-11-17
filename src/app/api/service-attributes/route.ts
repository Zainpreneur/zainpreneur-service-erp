import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serviceId = Number(url.searchParams.get('serviceId'));
  return NextResponse.json(svc.listServiceAttributes(serviceId));
}
export async function POST(req: Request) {
  const body = await req.json();
  svc.setServiceAttribute(body.serviceId, body.attributeId, body);
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  const body = await req.json();
  svc.removeServiceAttribute(body.serviceId, body.attributeId);
  return NextResponse.json({ ok: true });
}