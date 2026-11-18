import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';
import { parseBody, AttributeValueSchema } from '@/lib/validation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const attrId = url.searchParams.get('attributeId');
  return NextResponse.json(svc.listAttributeValues(attrId ? Number(attrId) : undefined));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = parseBody(AttributeValueSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  return NextResponse.json(svc.createAttributeValue(v.data), { status: 201 });
}