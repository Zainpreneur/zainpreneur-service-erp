import { NextResponse } from 'next/server';
import * as people from '@/lib/server/people';
import { parseBody, PersonSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = people.getPerson(Number(id));
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(p);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(PersonSchema.partial(), body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const p = people.updatePerson(Number(id), v.data);
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(p);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    people.deletePerson(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}