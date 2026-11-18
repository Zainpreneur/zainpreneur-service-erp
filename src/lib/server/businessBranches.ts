import db from '../db';

interface Row { id: number; business_id: number; name: string; city: string | null; country: string | null; created_at: string; }

export function listBranches(businessId: number) {
  return (db.prepare('SELECT * FROM business_branches WHERE business_id=? ORDER BY name').all(businessId) as Row[]).map(r => ({ id: r.id, businessId: r.business_id, name: r.name, city: r.city, country: r.country, createdAt: r.created_at }));
}
export function createBranch(input: { businessId: number; name: string; city?: string; country?: string }) {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO business_branches (business_id,name,city,country,created_at) VALUES (?,?,?,?,?)').run(input.businessId, input.name, input.city ?? null, input.country ?? null, ts);
  return { id: Number(info.lastInsertRowid) };
}
export function getBranch(id: number): any | null {
  const r = db.prepare('SELECT * FROM business_branches WHERE id=?').get(id) as Row | undefined;
  if (!r) return null;
  return { id: r.id, businessId: r.business_id, name: r.name, city: r.city, country: r.country, createdAt: r.created_at };
}
export function updateBranch(id: number, input: { name?: string; city?: string; country?: string }) {
  const fields: string[] = []; const params: Record<string,unknown> = { id };
  const map: Record<string,string> = { name:'name', city:'city', country:'country' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(input,k)) { fields.push(`${col}=@${col}`); params[col]=(input as any)[k] ?? null; }
  if (!fields.length) return getBranch(id);
  db.prepare(`UPDATE business_branches SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getBranch(id);
}
export function deleteBranch(id: number) { db.prepare('DELETE FROM business_branches WHERE id=?').run(id); }