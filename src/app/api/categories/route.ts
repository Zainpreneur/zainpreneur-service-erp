import { NextResponse } from 'next/server';
import * as svc from '@/lib/server/services';

export async function GET() { return NextResponse.json(svc.listCategories()); }
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(svc.createCategory(body), { status: 201 });
}