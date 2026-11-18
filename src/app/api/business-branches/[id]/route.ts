import { NextResponse } from 'next/server';
import * as bb from '@/lib/server/businessBranches';
import { parseBody, BusinessBranchSchema } from '@/lib/validation';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = bb.getBranch(Number(id));
  if (!b) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(b);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const v = parseBody(BusinessBranchSchema.partial(), body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const b = bb.updateBranch(Number(id), v.data);
  if (!b) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(b);
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    bb.deleteBranch(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Cannot delete: record is in use' }, { status: 409 });
  }
}