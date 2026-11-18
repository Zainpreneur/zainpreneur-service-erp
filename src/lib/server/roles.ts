import db from '../db';
import type { Role, Permission } from '@/lib/types';

export function listRoles(): Role[] {
  return (db.prepare('SELECT * FROM roles ORDER BY name').all() as any[]).map(r => ({
    id: r.id, name: r.name, description: r.description, isSystem: !!r.is_system,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }));
}
export function getRole(id: number): Role | null {
  const r = db.prepare('SELECT * FROM roles WHERE id = ?').get(id) as any;
  return r ? { id: r.id, name: r.name, description: r.description, isSystem: !!r.is_system, createdAt: r.created_at, updatedAt: r.updated_at } : null;
}
export function createRole(input: { name: string; description?: string; isSystem?: boolean }): Role {
  const ts = new Date().toISOString();
  const info = db.prepare(
    'INSERT INTO roles (name, description, is_system, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).run(input.name, input.description ?? null, input.isSystem ? 1 : 0, ts, ts);
  return getRole(Number(info.lastInsertRowid))!;
}
export function updateRole(id: number, patch: Partial<Role>): Role | null {
  const existing = getRole(id); if (!existing) return null;
  const fields: string[] = []; const params: Record<string, unknown> = { id };
  const map: Record<string, string> = { name: 'name', description: 'description' };
  for (const [k, col] of Object.entries(map)) {
    if (Object.prototype.hasOwnProperty.call(patch, k)) {
      fields.push(`${col}=@${col}`);
      params[col] = (patch as any)[k] ?? null;
    }
  }
  if (patch.isSystem !== undefined) {
    fields.push('is_system=@is_system');
    params.is_system = patch.isSystem ? 1 : 0;
  }
  if (!fields.length) return existing;
  fields.push('updated_at=@updated_at');
  params.updated_at = new Date().toISOString();
  db.prepare(`UPDATE roles SET ${fields.join(', ')} WHERE id=@id`).run(params);
  return getRole(id);
}
export function deleteRole(id: number): void {
  db.prepare('DELETE FROM roles WHERE id = ?').run(id);
}

export function listPermissions(): Permission[] {
  return (db.prepare('SELECT * FROM permissions ORDER BY resource, action').all() as any[]).map(r => ({
    id: r.id, resource: r.resource, action: r.action, description: r.description,
  }));
}
export function createPermission(input: { resource: string; action: string; description?: string }): Permission | null {
  const existing = db.prepare(
    'SELECT id FROM permissions WHERE resource = ? AND action = ?'
  ).get(input.resource, input.action) as any;
  if (existing) return null;
  const info = db.prepare(
    'INSERT INTO permissions (resource, action, description) VALUES (?, ?, ?)'
  ).run(input.resource, input.action, input.description ?? null);
  return { id: Number(info.lastInsertRowid), resource: input.resource, action: input.action, description: input.description ?? null };
}

export function listRolePermissions(roleId: number): number[] {
  return (db.prepare('SELECT permission_id FROM role_permissions WHERE role_id = ?').all(roleId) as any[])
    .map(r => r.permission_id);
}
export function setRolePermissions(roleId: number, permissionIds: number[]): void {
  db.prepare('DELETE FROM role_permissions WHERE role_id = ?').run(roleId);
  for (const pid of permissionIds) {
    db.prepare('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)').run(roleId, pid);
  }
}
export function listRolePermissionDetails(roleId: number): Permission[] {
  return (db.prepare(
    `SELECT p.id, p.resource, p.action, p.description FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = ?`
  ).all(roleId) as any[]).map(r => ({ id: r.id, resource: r.resource, action: r.action, description: r.description }));
}

export function listUserRoles(userId: number): number[] {
  return (db.prepare('SELECT role_id FROM user_roles WHERE user_id = ?').all(userId) as any[])
    .map(r => r.role_id);
}
export function setUserRoles(userId: number, roleIds: number[]): void {
  db.prepare('DELETE FROM user_roles WHERE user_id = ?').run(userId);
  for (const rid of roleIds) {
    db.prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)').run(userId, rid);
  }
}

export function getUserPermissions(userId: number): Permission[] {
  return (db.prepare(
    `SELECT DISTINCT p.id, p.resource, p.action, p.description FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     JOIN user_roles ur ON ur.role_id = rp.role_id
     WHERE ur.user_id = ?`
  ).all(userId) as any[]).map(r => ({ id: r.id, resource: r.resource, action: r.action, description: r.description }));
}

export function hasPermission(userId: number, resource: string, action: string): boolean {
  const r = db.prepare(
    `SELECT COUNT(*) AS cnt FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     JOIN user_roles ur ON ur.role_id = rp.role_id
     WHERE ur.user_id = ? AND p.resource = ? AND p.action = ?`
  ).get(userId, resource, action) as any;
  return (r.cnt || 0) > 0;
}
