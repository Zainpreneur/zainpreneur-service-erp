import db from '../db';

export interface Tag { id: number; name: string; slug: string; archivedAt: string | null; createdAt: string; }

function hydrate(r: any): Tag { return { id: r.id, name: r.name, slug: r.slug, archivedAt: r.archived_at, createdAt: r.created_at }; }

export function listTags(): Tag[] { return (db.prepare('SELECT * FROM tags WHERE archived_at IS NULL ORDER BY name').all() as any[]).map(hydrate); }
export function getTag(id: number): Tag | null { const r = db.prepare('SELECT * FROM tags WHERE id=?').get(id) as any; return r ? hydrate(r) : null; }
export function createTag(name: string): Tag {
  const ts = new Date().toISOString();
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const info = db.prepare('INSERT INTO tags (name, slug, created_at) VALUES (?,?,?)').run(name, slug, ts);
  return getTag(Number(info.lastInsertRowid))!;
}
export function archiveTag(id: number): void { db.prepare('UPDATE tags SET archived_at=? WHERE id=?').run(new Date().toISOString(), id); }
export function updateTag(id: number, name: string): Tag | null {
  const existing = getTag(id); if (!existing) return null;
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  db.prepare('UPDATE tags SET name=?, slug=? WHERE id=?').run(name, slug, id);
  return getTag(id);
}

type Entity = 'service' | 'request' | 'ticket' | 'business' | 'person';
const tableMap: Record<Entity, { table: string; col: string }> = {
  service: { table: 'service_tags', col: 'service_id' },
  request: { table: 'request_tags', col: 'request_id' },
  ticket: { table: 'ticket_tags', col: 'ticket_id' },
  business: { table: 'business_tags', col: 'business_id' },
  person: { table: 'person_tags', col: 'person_id' },
};

export function listEntityTags(entity: Entity, entityId: number): Tag[] {
  const { table, col } = tableMap[entity];
  return (db.prepare(`SELECT t.* FROM tags t JOIN ${table} x ON x.tag_id=t.id WHERE x.${col}=? AND t.archived_at IS NULL ORDER BY t.name`).all(entityId) as any[]).map(hydrate);
}
export function addEntityTag(entity: Entity, entityId: number, tagId: number): void {
  const { table, col } = tableMap[entity];
  db.prepare(`INSERT OR IGNORE INTO ${table} (${col}, tag_id) VALUES (?,?)`).run(entityId, tagId);
}
export function removeEntityTag(entity: Entity, entityId: number, tagId: number): void {
  const { table, col } = tableMap[entity];
  db.prepare(`DELETE FROM ${table} WHERE ${col}=? AND tag_id=?`).run(entityId, tagId);
}