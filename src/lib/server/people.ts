import db from '../db';
import type { Person } from '@/lib/types';

interface Row { id: number; code: string | null; name: string; email: string | null; phone: string | null; team: string | null; role: string | null; is_active: number; created_at: string; }

function hydrate(r: Row): Person {
  return { id: r.id, code: r.code, name: r.name, email: r.email, phone: r.phone, team: r.team, role: r.role, isActive: !!r.is_active, createdAt: r.created_at };
}

export function listPeople(): Person[] {
  return (db.prepare('SELECT * FROM people ORDER BY name').all() as Row[]).map(hydrate);
}
export function getPerson(id: number): Person | null {
  const r = db.prepare('SELECT * FROM people WHERE id = ?').get(id) as Row | undefined;
  return r ? hydrate(r) : null;
}
export function createPerson(input: Partial<Person>): Person {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO people (code, name, email, phone, team, role, is_active, created_at) VALUES (?,?,?,?,?,?,?,?)')
    .run(input.code ?? null, input.name!, input.email ?? null, input.phone ?? null, input.team ?? null, input.role ?? null, input.isActive === false ? 0 : 1, ts);
  return getPerson(Number(info.lastInsertRowid))!;
}
export function updatePerson(id: number, patch: Partial<Person>): Person | null {
  const fields: string[] = []; const params: Record<string, unknown> = { id };
  const map: Record<string,string> = { code:'code', name:'name', email:'email', phone:'phone', team:'team', role:'role' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.isActive !== undefined) { fields.push('is_active=@is_active'); params.is_active = patch.isActive ? 1 : 0; }
  if (!fields.length) return getPerson(id);
  db.prepare(`UPDATE people SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getPerson(id);
}
export function deletePerson(id: number): void { db.prepare('DELETE FROM people WHERE id=?').run(id); }
