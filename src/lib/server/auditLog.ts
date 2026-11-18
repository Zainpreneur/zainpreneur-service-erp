import db from '../db';
import type { AuditLog } from '@/lib/types';

export interface AuditLogEntry {
  userId?: number | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export function addAuditLog(input: AuditLogEntry): void {
  db.prepare(
    `INSERT INTO audit_logs (user_id, action, resource, resource_id, details, ip_address, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    input.userId ?? null, input.action, input.resource, input.resourceId ?? null,
    input.details ? JSON.stringify(input.details) : null,
    input.ipAddress ?? null, input.userAgent ?? null, new Date().toISOString()
  );
}

interface Row {
  id: number; user_id: number | null; action: string; resource: string;
  resource_id: string | null; details: string | null; ip_address: string | null;
  user_agent: string | null; created_at: string;
}

export function listAuditLogs(filters: {
  userId?: number; resource?: string; action?: string; limit?: number; page?: number;
} = {}): AuditLog[] {
  const conds: string[] = []; const params: unknown[] = [];
  if (filters.userId !== undefined) { conds.push('user_id = ?'); params.push(filters.userId); }
  if (filters.resource) { conds.push('resource = ?'); params.push(filters.resource); }
  if (filters.action) { conds.push('action = ?'); params.push(filters.action); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit ? Number(filters.limit) : 50;
  const offset = (page - 1) * limit;
  const rows = db.prepare(
    `SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, limit, offset) as Row[];
  return rows.map(r => ({
    id: r.id, userId: r.user_id, action: r.action, resource: r.resource,
    resourceId: r.resource_id, details: r.details ? JSON.parse(r.details) : null,
    ipAddress: r.ip_address, userAgent: r.user_agent, createdAt: r.created_at,
  }));
}

export type AuditLog = {
  id: number;
  userId: number | null;
  action: string;
  resource: string;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};
