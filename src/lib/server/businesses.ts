import db from '../db';
import type { Business } from '@/lib/types';

interface Row { id: number; reference: string; code: string | null; name: string; category: string | null; city: string | null; country: string | null; contact_name: string | null; contact_email: string | null; contact_phone: string | null; contact_role: string | null; status: string; notes: string | null; relationship: string | null; parent_business_id: number | null; is_customer: number; is_portfolio: number; relationships: string | null; industry: string | null; social_linkedin: string | null; social_twitter: string | null; social_facebook: string | null; social_instagram: string | null; social_website: string | null; tier: string | null; health_score: number | null; created_at: string; updated_at: string; }

function hydrate(r: Row): Business {
  return { id: r.id, reference: r.reference, code: r.code ?? r.reference, name: r.name, category: r.category, city: r.city, country: r.country, contactName: r.contact_name, contactEmail: r.contact_email, contactPhone: r.contact_phone, contactRole: r.contact_role, status: r.status, notes: r.notes, relationship: r.relationship, parentBusinessId: r.parent_business_id, isCustomer: !!r.is_customer, isPortfolio: !!r.is_portfolio, relationships: JSON.parse(r.relationships || '[]'), industry: r.industry, social: { linkedin: r.social_linkedin, twitter: r.social_twitter, facebook: r.social_facebook, instagram: r.social_instagram, website: r.social_website }, tier: r.tier, healthScore: r.health_score, createdAt: r.created_at, updatedAt: r.updated_at };
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
  const ref = input.reference || input.code || `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const info = db.prepare(`INSERT INTO businesses (reference,code,name,category,city,country,contact_name,contact_email,contact_phone,contact_role,status,notes,relationship,parent_business_id,is_customer,is_portfolio,relationships,industry,social_linkedin,social_twitter,social_facebook,social_instagram,social_website,tier,health_score,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(ref, input.code ?? ref, input.name!, input.category ?? null, input.city ?? null, input.country ?? null, input.contactName ?? null, input.contactEmail ?? null, input.contactPhone ?? null, input.contactRole ?? null, input.status ?? 'active', input.notes ?? null, input.relationship ?? 'client', input.parentBusinessId ?? null, input.isCustomer ? 1 : 0, input.isPortfolio ? 1 : 0, JSON.stringify(input.relationships ?? []), input.industry ?? null, input.social?.linkedin ?? null, input.social?.twitter ?? null, input.social?.facebook ?? null, input.social?.instagram ?? null, input.social?.website ?? null, input.tier ?? null, input.healthScore ?? null, ts, ts);
  const id = Number(info.lastInsertRowid);
  if (!input.reference && !input.code) db.prepare('UPDATE businesses SET reference=?, code=? WHERE id=?').run(`BIZ-${String(id).padStart(5,'0')}`, `BIZ-${String(id).padStart(5,'0')}`, id);
  return getBusiness(String(id))!;
}
export function updateBusiness(idOrRef: string, patch: Partial<Business>): Business | null {
  const existing = getBusiness(idOrRef); if (!existing) return null;
  const fields: string[] = []; const params: Record<string,unknown> = { id: existing.id };
  const map: Record<string,string> = { name:'name', category:'category', city:'city', country:'country', contactName:'contact_name', contactEmail:'contact_email', contactPhone:'contact_phone', contactRole:'contact_role', status:'status', notes:'notes', relationship:'relationship', industry:'industry', tier:'tier' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.code !== undefined) { fields.push('code=@code'); params.code = patch.code; }
  if (patch.parentBusinessId !== undefined) { fields.push('parent_business_id=@parent_business_id'); params.parent_business_id = patch.parentBusinessId; }
  if (patch.isCustomer !== undefined) { fields.push('is_customer=@is_customer'); params.is_customer = patch.isCustomer ? 1 : 0; }
  if (patch.isPortfolio !== undefined) { fields.push('is_portfolio=@is_portfolio'); params.is_portfolio = patch.isPortfolio ? 1 : 0; }
  if (patch.relationships !== undefined) { fields.push('relationships=@relationships'); params.relationships = JSON.stringify(patch.relationships); }
  if (patch.healthScore !== undefined) { fields.push('health_score=@health_score'); params.health_score = patch.healthScore; }
  if (patch.social !== undefined) {
    if (patch.social.linkedin !== undefined) { fields.push('social_linkedin=@social_linkedin'); params.social_linkedin = patch.social.linkedin; }
    if (patch.social.twitter !== undefined) { fields.push('social_twitter=@social_twitter'); params.social_twitter = patch.social.twitter; }
    if (patch.social.facebook !== undefined) { fields.push('social_facebook=@social_facebook'); params.social_facebook = patch.social.facebook; }
    if (patch.social.instagram !== undefined) { fields.push('social_instagram=@social_instagram'); params.social_instagram = patch.social.instagram; }
    if (patch.social.website !== undefined) { fields.push('social_website=@social_website'); params.social_website = patch.social.website; }
  }
  if (!fields.length) return existing;
  fields.push('updated_at=@updated_at'); params.updated_at = new Date().toISOString();
  db.prepare(`UPDATE businesses SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getBusiness(String(existing.id));
}
export function deleteBusiness(idOrRef: string): void {
  const existing = getBusiness(idOrRef); if (!existing) return;
  db.prepare('DELETE FROM businesses WHERE id=?').run(existing.id);
}
