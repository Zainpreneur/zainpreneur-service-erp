import db from '../db';
import type { Business } from '@/lib/types';

interface Row { id: number; reference: string; name: string; category: string | null; city: string | null; country: string | null; contact_name: string | null; contact_email: string | null; contact_phone: string | null; status: string; notes: string | null; created_at: string; updated_at: string; }

function hydrate(r: Row): Business {
  return { id: r.id, reference: r.reference, name: r.name, category: r.category, city: r.city, country: r.country, contactName: r.contact_name, contactEmail: r.contact_email, contactPhone: r.contact_phone, status: r.status, notes: r.notes, createdAt: r.created_at, updatedAt: r.updated_at };
}

export function listBusinesses(filters: { search?: string; status?: string } = {}): Business[] {
  const conds: string[] = []; const params: unknown[] = [];
  if (filters.search) { conds.push('(name LIKE ? OR reference LIKE ? OR contact_name LIKE ?)'); const q=`%${filters.search}%`; params.push(q,q,q); }
  if (filters.status) { conds.push('status = ?'); params.push(filters.status); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  return (db.prepare(`SELECT * FROM businesses ${where} ORDER BY name`).all(...params) as Row[]).map(hydrate);
}
export function getBusiness(idOrRef: string): Business | null {
  const isNum = /^\d+$/.test(idOrRef);
  const r = (isNum ? db.prepare('SELECT * FROM businesses WHERE id=?').get(Number(idOrRef)) : db.prepare('SELECT * FROM businesses WHERE reference=?').get(idOrRef)) as Row | undefined;
  return r ? hydrate(r) : null;
}
export function createBusiness(input: Partial<Business>): Business {
  const ts = new Date().toISOString();
  const ref = input.reference || `BIZ-${Date.now().toString().slice(-6)}`;
  const info = db.prepare('INSERT INTO businesses (reference,name,category,city,country,contact_name,contact_email,contact_phone,status,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(ref, input.name!, input.category ?? null, input.city ?? null, input.country ?? null, input.contactName ?? null, input.contactEmail ?? null, input.contactPhone ?? null, input.status ?? 'active', input.notes ?? null, ts, ts);
  return getBusiness(String(info.lastInsertRowid))!;
}
export function updateBusiness(idOrRef: string, patch: Partial<Business>): Business | null {
  const existing = getBusiness(idOrRef); if (!existing) return null;
  const fields: string[] = []; const params: Record<string,unknown> = { id: existing.id };
  const map: Record<string,string> = { name:'name', category:'category', city:'city', country:'country', contactName:'contact_name', contactEmail:'contact_email', contactPhone:'contact_phone', status:'status', notes:'notes' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (!fields.length) return existing;
  fields.push('updated_at=@updated_at'); params.updated_at = new Date().toISOString();
  db.prepare(`UPDATE businesses SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getBusiness(String(existing.id));
}
export function deleteBusiness(idOrRef: string): void {
  const existing = getBusiness(idOrRef); if (!existing) return;
  db.prepare('DELETE FROM businesses WHERE id=?').run(existing.id);
}
