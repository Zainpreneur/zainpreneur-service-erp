import { NextResponse } from 'next/server';
import * as reqs from '@/lib/server/requests';
import { parseBody, RequestSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = reqs.getRequest(id);
  if (!r) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(r);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(RequestSchema.partial(), body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  try {
    const r = reqs.updateRequest(id, v.data);
    return NextResponse.json(r);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    reqs.deleteRequest(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}