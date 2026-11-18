import { NextResponse } from 'next/server';
import * as people from '@/lib/server/people';
import { parseBody, PersonSchema } from '@/lib/validation';

export async function GET() {
  return NextResponse.json(people.listPeople());
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = parseBody(PersonSchema, body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const created = people.createPerson(v.data);
  return NextResponse.json(created, { status: 201 });
}