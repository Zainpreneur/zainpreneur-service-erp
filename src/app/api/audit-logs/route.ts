import { NextResponse } from 'next/server';
import * as al from '@/lib/server/auditLog';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const resource = url.searchParams.get('resource');
  const action = url.searchParams.get('action');
  const limit = url.searchParams.get('limit');
  const page = url.searchParams.get('page');
  return NextResponse.json(al.listAuditLogs({
    userId: userId ? Number(userId) : undefined,
    resource,
    action,
    limit: limit ? Number(limit) : undefined,
    page: page ? Number(page) : undefined,
  }));
}