import { NextResponse } from 'next/server';
import * as people from '@/lib/server/people';

export async function GET() {
  return NextResponse.json(people.listPeople());
}
export async function POST(req: Request) {
  const body = await req.json();
  const created = people.createPerson(body);
  return NextResponse.json(created, { status: 201 });
}