import db from '../db';
import type { Organization } from '@/lib/types';

interface Row {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

function hydrate(r: Row): Organization {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    category: r.category ?? 'services',
    address: r.address,
    phone: r.phone,
    email: r.email,
    logo: r.logo,
    isActive: !!r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function listOrganizations(): Organization[] {
  return (db.prepare('SELECT * FROM organizations ORDER BY name').all() as Row[]).map(hydrate);
}
export function getOrganization(id: number): Organization | null {
  const r = db.prepare('SELECT * FROM organizations WHERE id = ?').get(id) as Row | undefined;
  return r ? hydrate(r) : null;
}
export function getOrganizationBySlug(slug: string): Organization | null {
  const r = db.prepare('SELECT * FROM organizations WHERE slug = ?').get(slug) as Row | undefined;
  return r ? hydrate(r) : null;
}
export function createOrganization(input: {
  name: string; slug?: string; category?: string; address?: string; phone?: string; email?: string; logo?: string;
}): Organization {
  const ts = new Date().toISOString();
  const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const info = db.prepare(
    'INSERT INTO organizations (name, slug, category, address, phone, email, logo, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    input.name, slug, input.category ?? 'services', input.address ?? null,
    input.phone ?? null, input.email ?? null, input.logo ?? null, 1, ts, ts
  );
  return getOrganization(Number(info.lastInsertRowid))!;
}
export function updateOrganization(id: number, patch: Partial<Organization>): Organization | null {
  const existing = getOrganization(id); if (!existing) return null;
  const fields: string[] = []; const params: Record<string, unknown> = { id };
  const map: Record<string, string> = {
    name: 'name', slug: 'slug', category: 'category', address: 'address',
    phone: 'phone', email: 'email', logo: 'logo',
  };
  for (const [k, col] of Object.entries(map)) {
    if (Object.prototype.hasOwnProperty.call(patch, k)) {
      fields.push(`${col}=@${col}`);
      params[col] = (patch as any)[k] ?? null;
    }
  }
  if (patch.isActive !== undefined) {
    fields.push('is_active=@is_active');
    params.is_active = patch.isActive ? 1 : 0;
  }
  if (!fields.length) return existing;
  fields.push('updated_at=@updated_at');
  params.updated_at = new Date().toISOString();
  db.prepare(`UPDATE organizations SET ${fields.join(', ')} WHERE id=@id`).run(params);
  return getOrganization(id);
}
export function deleteOrganization(id: number): void {
  db.prepare('DELETE FROM organizations WHERE id = ?').run(id);
}
export function addOrganizationUser(orgId: number, userId: number, roleInOrg: string = 'MEMBER'): void {
  db.prepare(
    'INSERT INTO organization_users (organization_id, user_id, role_in_org, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).run(orgId, userId, roleInOrg, new Date().toISOString(), new Date().toISOString());
}
export function listOrganizationUsers(orgId: number): any[] {
  return (db.prepare(
    `SELECT u.id, u.code, u.name, u.email, u.phone, u.role, ou.role_in_org
     FROM organization_users ou
     JOIN people u ON u.id = ou.user_id
     WHERE ou.organization_id = ?`
  ).all(orgId) as any[]);
}
export function removeOrganizationUser(orgId: number, userId: number): void {
  db.prepare(
    'DELETE FROM organization_users WHERE organization_id = ? AND user_id = ?'
  ).run(orgId, userId);
}
