import db from '../db';
import type { BusinessContact } from '@/lib/types';

interface Row { id: number; business_id: number; name: string; role: string | null; email: string | null; phone: string | null; is_primary: number; notes: string | null; created_at: string; }

function hydrate(r: Row): BusinessContact {
  return { id: r.id, businessId: r.business_id, name: r.name, role: r.role, email: r.email, phone: r.phone, isPrimary: !!r.is_primary, notes: r.notes, createdAt: r.created_at };
}

export function listContacts(businessId: number): BusinessContact[] {
  return (db.prepare('SELECT * FROM business_contacts WHERE business_id=? ORDER BY is_primary DESC, name').all(businessId) as Row[]).map(hydrate);
}
export function getContact(id: number): BusinessContact | null {
  const r = db.prepare('SELECT * FROM business_contacts WHERE id=?').get(id) as Row | undefined;
  return r ? hydrate(r) : null;
}
export function createContact(input: Partial<BusinessContact> & { businessId: number }): BusinessContact {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO business_contacts (business_id,name,role,email,phone,is_primary,notes,created_at) VALUES (?,?,?,?,?,?,?,?)')
    .run(input.businessId, input.name!, input.role ?? null, input.email ?? null, input.phone ?? null, input.isPrimary ? 1 : 0, input.notes ?? null, ts);
  return getContact(Number(info.lastInsertRowid))!;
}
export function updateContact(id: number, patch: Partial<BusinessContact>): BusinessContact | null {
  const fields: string[] = []; const params: Record<string,unknown> = { id };
  const map: Record<string,string> = { name:'name', role:'role', email:'email', phone:'phone', notes:'notes' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.isPrimary !== undefined) { fields.push('is_primary=@is_primary'); params.is_primary = patch.isPrimary ? 1 : 0; }
  if (!fields.length) return getContact(id);
  db.prepare(`UPDATE business_contacts SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getContact(id);
}
export function deleteContact(id: number): void { db.prepare('DELETE FROM business_contacts WHERE id=?').run(id); }