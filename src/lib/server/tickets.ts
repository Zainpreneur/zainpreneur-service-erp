import db from '../db';
import type { HelpdeskTicket, TicketMessage, TicketEvent, TicketInput } from '@/lib/types';

interface Row { id: number; reference: string; business_id: number; service_id: number | null; service_request_id: number | null; title: string; description: string | null; type: string; category: string; priority: string; status: string; assigned_to: number | null; contact_name: string | null; contact_email: string | null; contact_phone: string | null; sla_due_at: string | null; resolved_at: string | null; closed_at: string | null; created_at: string; updated_at: string; business_name?: string; service_name?: string; request_reference?: string; assigned_to_name?: string | null; }

function hydrate(r: Row): HelpdeskTicket {
  return { id: r.id, reference: r.reference, businessId: r.business_id, businessName: r.business_name, serviceId: r.service_id, serviceName: r.service_name, serviceRequestId: r.service_request_id, requestReference: r.request_reference, title: r.title, description: r.description, type: r.type, category: r.category, priority: r.priority, status: r.status, assignedTo: r.assigned_to, assignedToName: r.assigned_to_name, contactName: r.contact_name, contactEmail: r.contact_email, contactPhone: r.contact_phone, slaDueAt: r.sla_due_at, resolvedAt: r.resolved_at, closedAt: r.closed_at, createdAt: r.created_at, updatedAt: r.updated_at };
}

const SELECT = `SELECT t.*, b.name AS business_name, s.name AS service_name, sr.reference AS request_reference, p.name AS assigned_to_name FROM helpdesk_tickets t JOIN businesses b ON b.id=t.business_id LEFT JOIN services s ON s.id=t.service_id LEFT JOIN service_requests sr ON sr.id=t.service_request_id LEFT JOIN people p ON p.id=t.assigned_to`;

export function listTickets(filters: { search?: string; status?: string; priority?: string; type?: string; businessId?: number } = {}): HelpdeskTicket[] {
  const conds: string[] = []; const params: unknown[] = [];
  if (filters.search) { conds.push('(t.title LIKE ? OR t.reference LIKE ? OR t.contact_name LIKE ?)'); const q=`%${filters.search}%`; params.push(q,q,q); }
  if (filters.status) { conds.push('t.status = ?'); params.push(filters.status); }
  if (filters.priority) { conds.push('t.priority = ?'); params.push(filters.priority); }
  if (filters.type) { conds.push('t.type = ?'); params.push(filters.type); }
  if (filters.businessId) { conds.push('t.business_id = ?'); params.push(filters.businessId); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const rows = db.prepare(`${SELECT} ${where} ORDER BY t.created_at DESC`).all(...params) as Row[];
  return rows.map(hydrate);
}

export function getTicket(idOrRef: string): HelpdeskTicket | null {
  const isNum = /^\d+$/.test(idOrRef);
  const row = (isNum ? db.prepare(`${SELECT} WHERE t.id = ?`).get(Number(idOrRef)) : db.prepare(`${SELECT} WHERE t.reference = ?`).get(idOrRef)) as Row | undefined;
  if (!row) return null;
  const t = hydrate(row);
  t.messages = (db.prepare('SELECT * FROM ticket_messages WHERE ticket_id=? ORDER BY created_at').all(t.id) as any[]).map(r => ({ id: r.id, ticketId: r.ticket_id, author: r.author, authorRole: r.author_role, body: r.body, isInternal: !!r.is_internal, createdAt: r.created_at }));
  t.events = (db.prepare('SELECT * FROM ticket_events WHERE ticket_id=? ORDER BY created_at').all(t.id) as any[]).map(r => ({ id: r.id, ticketId: r.ticket_id, eventType: r.event_type, actor: r.actor, note: r.note, createdAt: r.created_at }));
  return t;
}

export function createTicket(input: TicketInput): HelpdeskTicket {
  const ts = new Date().toISOString();
  const info = db.prepare(`INSERT INTO helpdesk_tickets (reference,business_id,service_id,service_request_id,title,description,type,category,priority,status,assigned_to,contact_name,contact_email,contact_phone,sla_due_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run('tmp', input.businessId, input.serviceId ?? null, input.serviceRequestId ?? null, input.title, input.description ?? null, input.type, input.category, input.priority ?? 'normal', input.status ?? 'new', input.assignedTo ?? null, input.contactName ?? null, input.contactEmail ?? null, input.contactPhone ?? null, input.slaDueAt ?? null, ts, ts);
  const id = Number(info.lastInsertRowid);
  const ref = `TKT-${String(id).padStart(5,'0')}`;
  db.prepare('UPDATE helpdesk_tickets SET reference=? WHERE id=?').run(ref, id);
  db.prepare('INSERT INTO ticket_events (ticket_id,event_type,actor,note,created_at) VALUES (?,?,?,?,?)').run(id, 'created', 'system', 'Ticket created', ts);
  return getTicket(String(id))!;
}

export function updateTicket(idOrRef: string, patch: Partial<TicketInput> & Record<string,unknown>): HelpdeskTicket {
  const existing = getTicket(idOrRef); if (!existing) throw new Error('Ticket not found');
  const fields: string[] = []; const params: Record<string,unknown> = { id: existing.id };
  const map: Record<string,string> = {
    businessId:'business_id', serviceId:'service_id', serviceRequestId:'service_request_id', title:'title', description:'description', type:'type', category:'category', priority:'priority', status:'status', assignedTo:'assigned_to', contactName:'contact_name', contactEmail:'contact_email', contactPhone:'contact_phone', slaDueAt:'sla_due_at',
  };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.resolvedAt !== undefined) { fields.push('resolved_at=@resolved_at'); params.resolved_at = patch.resolvedAt; }
  if (patch.closedAt !== undefined) { fields.push('closed_at=@closed_at'); params.closed_at = patch.closedAt; }
  if (!fields.length) return existing;
  fields.push('updated_at=@updated_at'); params.updated_at = new Date().toISOString();
  db.prepare(`UPDATE helpdesk_tickets SET ${fields.join(',')} WHERE id=@id`).run(params);
  db.prepare('INSERT INTO ticket_events (ticket_id,event_type,actor,note,created_at) VALUES (?,?,?,?,?)').run(existing.id, 'updated', 'system', 'Ticket updated', new Date().toISOString());
  return getTicket(String(existing.id))!;
}

export function deleteTicket(idOrRef: string): void { const e = getTicket(idOrRef); if(!e) return; db.prepare('DELETE FROM helpdesk_tickets WHERE id=?').run(e.id); }

export function addMessage(ticketId: number, author: string, authorRole: string, body: string, isInternal = false): TicketMessage {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO ticket_messages (ticket_id,author,author_role,body,is_internal,created_at) VALUES (?,?,?,?,?,?)').run(ticketId, author, authorRole, body, isInternal?1:0, ts);
  const r = db.prepare('SELECT * FROM ticket_messages WHERE id=?').get(info.lastInsertRowid) as any;
  return { id: r.id, ticketId: r.ticket_id, author: r.author, authorRole: r.author_role, body: r.body, isInternal: !!r.is_internal, createdAt: r.created_at };
}

export function addTicketEvent(ticketId: number, eventType: string, actor: string, note?: string): void {
  db.prepare('INSERT INTO ticket_events (ticket_id,event_type,actor,note,created_at) VALUES (?,?,?,?,?)').run(ticketId, eventType, actor, note ?? null, new Date().toISOString());
}
