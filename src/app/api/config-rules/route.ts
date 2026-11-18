import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';
import { parseBody, ConfigRuleSchema } from '@/lib/validation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serviceId = Number(url.searchParams.get('serviceId'));
  return NextResponse.json(svc.listConfigRules(serviceId));
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = parseBody(ConfigRuleSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  return NextResponse.json(svc.createConfigRule(v.data), { status: 201 });
}