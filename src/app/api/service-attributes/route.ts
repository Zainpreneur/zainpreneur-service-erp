import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';
import { parseBody, ServiceAttributeSchema } from '@/lib/validation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serviceId = Number(url.searchParams.get('serviceId'));
  return NextResponse.json(svc.listServiceAttributes(serviceId));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = parseBody(ServiceAttributeSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  svc.setServiceAttribute(v.data.serviceId, v.data.attributeId, v.data);
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.serviceId || !body?.attributeId) return NextResponse.json({ error: 'serviceId and attributeId required' }, { status: 400 });
    svc.removeServiceAttribute(body.serviceId, body.attributeId);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}