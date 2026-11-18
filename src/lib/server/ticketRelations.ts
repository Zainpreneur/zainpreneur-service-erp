import db from '../db';

export function listRelated(ticketId: number): number[] {
  const rows = db.prepare('SELECT related_id FROM ticket_relations WHERE ticket_id=?').all(ticketId) as { related_id: number }[];
  return rows.map(r => r.related_id);
}
export function addRelation(ticketId: number, relatedId: number): void {
  if (ticketId === relatedId) return;
  db.prepare('INSERT OR IGNORE INTO ticket_relations (ticket_id, related_id) VALUES (?,?)').run(ticketId, relatedId);
  db.prepare('INSERT OR IGNORE INTO ticket_relations (ticket_id, related_id) VALUES (?,?)').run(relatedId, ticketId);
}
export function removeRelation(ticketId: number, relatedId: number): void {
  db.prepare('DELETE FROM ticket_relations WHERE ticket_id=? AND related_id=?').run(ticketId, relatedId);
  db.prepare('DELETE FROM ticket_relations WHERE ticket_id=? AND related_id=?').run(relatedId, ticketId);
}