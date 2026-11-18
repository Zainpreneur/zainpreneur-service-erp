import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';
import { parseBody, SupportInfoSchema } from '@/lib/validation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serviceId = Number(url.searchParams.get('serviceId'));
  return NextResponse.json(svc.getSupportInfo(serviceId));
}
export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.serviceId) return NextResponse.json({ error: 'serviceId required' }, { status: 400 });
  const v = parseBody(SupportInfoSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  return NextResponse.json(svc.upsertSupportInfo(Number(body.serviceId), v.data));
}