import { NextResponse } from 'next/server';
import * as org from '@/lib/server/organizations';

export async function GET() {
  return NextResponse.json(org.listOrganizations());
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  return NextResponse.json(org.createOrganization(body), { status: 201 });
}