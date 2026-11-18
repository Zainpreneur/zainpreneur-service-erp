import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';
import { parseBody, AttributeSchema } from '@/lib/validation';

export async function GET() { return NextResponse.json(svc.listAttributes()); }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = parseBody(AttributeSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  return NextResponse.json(svc.createAttribute(v.data), { status: 201 });
}