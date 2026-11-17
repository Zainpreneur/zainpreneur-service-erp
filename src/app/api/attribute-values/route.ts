import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const attrId = url.searchParams.get('attributeId');
  return NextResponse.json(svc.listAttributeValues(attrId ? Number(attrId) : undefined));
}
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(svc.createAttributeValue(body), { status: 201 });
}