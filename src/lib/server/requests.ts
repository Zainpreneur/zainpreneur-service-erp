import db from '../db';
import type { ServiceRequest, RequestLineItem, RequestConfiguration, RequestEvent, ServiceRequestInput } from '@/lib/types';

interface Row {
  id: number; reference: string; business_id: number; service_id: number; variant_id: number | null; title: string; description: string | null; status: string; priority: string; assigned_to: number | null; assigned_team: string | null; contact_name: string | null; contact_email: string | null; contact_phone: string | null; requested_date: string | null; required_date: string | null; scheduled_date: string | null; completed_at: string | null; selected_variants: string; configuration: string; add_ons: string; base_price: number; variant_price: number; attribute_extras: number; configuration_charges: number; discount_type: string | null; discount_value: number; total_amount: number; currency: string; created_at: string; updated_at: string; business_name?: string; service_name?: string; assigned_to_name?: string | null;
}

function hydrate(r: Row): ServiceRequest {
  return {
    id: r.id, reference: r.reference, businessId: r.business_id, businessName: r.business_name, serviceId: r.service_id, serviceName: r.service_name, variantId: r.variant_id, title: r.title, description: r.description, status: r.status, priority: r.priority, assignedTo: r.assigned_to, assignedToName: r.assigned_to_name, assignedTeam: r.assigned_team, contactName: r.contact_name, contactEmail: r.contact_email, contactPhone: r.contact_phone, requestedDate: r.requested_date, requiredDate: r.required_date, scheduledDate: r.scheduled_date, completedAt: r.completed_at, selectedVariants: JSON.parse(r.selected_variants || '[]'), configuration: JSON.parse(r.configuration || '{}'), addOns: JSON.parse(r.add_ons || '[]'), basePrice: r.base_price, variantPrice: r.variant_price, attributeExtras: r.attribute_extras, configurationCharges: r.configuration_charges, discountType: r.discount_type, discountValue: r.discount_value, totalAmount: r.total_amount, currency: r.currency, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

const SELECT = `SELECT r.*, b.name AS business_name, s.name AS service_name, p.name AS assigned_to_name FROM service_requests r JOIN businesses b ON b.id=r.business_id JOIN services s ON s.id=r.service_id LEFT JOIN people p ON p.id=r.assigned_to`;

export function listRequests(filters: { search?: string; status?: string; priority?: string; businessId?: number; serviceId?: number; limit?: number; page?: number } = {}): ServiceRequest[] {
  const conds: string[] = []; const params: unknown[] = [];
  if (filters.search) { conds.push('(r.title LIKE ? OR r.reference LIKE ? OR r.contact_name LIKE ?)'); const q=`%${filters.search}%`; params.push(q,q,q); }
  if (filters.status) { conds.push('r.status = ?'); params.push(filters.status); }
  if (filters.priority) { conds.push('r.priority = ?'); params.push(filters.priority); }
  if (filters.businessId) { conds.push('r.business_id = ?'); params.push(filters.businessId); }
  if (filters.serviceId) { conds.push('r.service_id = ?'); params.push(filters.serviceId); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit ? Number(filters.limit) : 50;
  const offset = (page - 1) * limit;
  const rows = db.prepare(`${SELECT} ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset) as Row[];
  return rows.map(hydrate);
}

export function getRequest(idOrRef: string): ServiceRequest | null {
  const isNum = /^\d+$/.test(idOrRef);
  const row = (isNum ? db.prepare(`${SELECT} WHERE r.id = ?`).get(Number(idOrRef)) : db.prepare(`${SELECT} WHERE r.reference = ?`).get(idOrRef)) as Row | undefined;
  if (!row) return null;
  const req = hydrate(row);
  // load line items, config, events
  req.lineItems = (db.prepare('SELECT * FROM request_line_items WHERE request_id=? ORDER BY id').all(req.id) as any[]).map(r => ({ id: r.id, requestId: r.request_id, serviceId: r.service_id, variantId: r.variant_id, description: r.description, quantity: r.quantity, unitPrice: r.unit_price, lineTotal: r.line_total, createdAt: r.created_at }));
  req.configEntries = (db.prepare('SELECT * FROM request_configuration WHERE request_id=? ORDER BY id').all(req.id) as any[]).map(r => ({ id: r.id, requestId: r.request_id, attributeId: r.attribute_id, attributeValueId: r.attribute_value_id, customValue: r.custom_value, priceExtra: r.price_extra, createdAt: r.created_at }));
  req.events = (db.prepare('SELECT * FROM request_events WHERE request_id=? ORDER BY created_at').all(req.id) as any[]).map(r => ({ id: r.id, requestId: r.request_id, eventType: r.event_type, actor: r.actor, note: r.note, createdAt: r.created_at }));
  return req;
}

export function createRequest(input: ServiceRequestInput): ServiceRequest {
  const ts = new Date().toISOString();
  const info = db.prepare(`INSERT INTO service_requests (reference,business_id,service_id,variant_id,title,description,status,priority,assigned_to,assigned_team,contact_name,contact_email,contact_phone,requested_date,required_date,scheduled_date,selected_variants,configuration,add_ons,base_price,variant_price,attribute_extras,configuration_charges,discount_type,discount_value,total_amount,currency,created_at,updated_at)
    VALUES (@reference,@business_id,@service_id,@variant_id,@title,@description,@status,@priority,@assigned_to,@assigned_team,@contact_name,@contact_email,@contact_phone,@requested_date,@required_date,@scheduled_date,@selected_variants,@configuration,@add_ons,@base_price,@variant_price,@attribute_extras,@configuration_charges,@discount_type,@discount_value,@total_amount,@currency,@created_at,@updated_at)`)
    .run({
      reference:'tmp', business_id: input.businessId, service_id: input.serviceId, variant_id: input.variantId ?? null, title: input.title, description: input.description ?? null, status: input.status ?? 'draft', priority: input.priority ?? 'normal', assigned_to: input.assignedTo ?? null, assigned_team: input.assignedTeam ?? null, contact_name: input.contactName ?? null, contact_email: input.contactEmail ?? null, contact_phone: input.contactPhone ?? null, requested_date: input.requestedDate ?? null, required_date: input.requiredDate ?? null, scheduled_date: input.scheduledDate ?? null, selected_variants: JSON.stringify(input.selectedVariants ?? []), configuration: JSON.stringify(input.configuration ?? {}), add_ons: JSON.stringify(input.addOns ?? []), base_price: input.basePrice ?? 0, variant_price: input.variantPrice ?? 0, attribute_extras: input.attributeExtras ?? 0, configuration_charges: input.configurationCharges ?? 0, discount_type: input.discountType ?? null, discount_value: input.discountValue ?? 0, total_amount: input.totalAmount ?? 0, currency: input.currency ?? 'USD', created_at: ts, updated_at: ts
    });
  const id = Number(info.lastInsertRowid);
  const ref = `REQ-${String(id).padStart(5,'0')}`;
  db.prepare('UPDATE service_requests SET reference=? WHERE id=?').run(ref, id);
  // config entries
  const cfg = input.configuration ?? {};
  // if provided as flat? We'll just store JSON; also create request_configuration rows? For simplicity store JSON.
  db.prepare('INSERT INTO request_events (request_id,event_type,actor,note,created_at) VALUES (?,?,?,?,?)').run(id, 'created', 'system', 'Request created', ts);
  return getRequest(String(id))!;
}

export function updateRequest(idOrRef: string, patch: Partial<ServiceRequestInput> & Record<string,unknown>): ServiceRequest {
  const existing = getRequest(idOrRef); if (!existing) throw new Error('Request not found');
  const fields: string[] = []; const params: Record<string,unknown> = { id: existing.id };
  const map: Record<string,string> = {
    businessId:'business_id', serviceId:'service_id', variantId:'variant_id', title:'title', description:'description', status:'status', priority:'priority', assignedTo:'assigned_to', assignedTeam:'assigned_team', contactName:'contact_name', contactEmail:'contact_email', contactPhone:'contact_phone', requestedDate:'requested_date', requiredDate:'required_date', scheduledDate:'scheduled_date', completedAt:'completed_at', basePrice:'base_price', variantPrice:'variant_price', attributeExtras:'attribute_extras', configurationCharges:'configuration_charges', discountType:'discount_type', discountValue:'discount_value', totalAmount:'total_amount', currency:'currency',
  };
  for (const [k,col] of Object.entries(map)) {
    if (Object.prototype.hasOwnProperty.call(patch,k)) {
      fields.push(`${col}=@${col}`);
      params[col] = (patch as any)[k] ?? null;
    }
  }
  if (patch.selectedVariants !== undefined) { fields.push('selected_variants=@selected_variants'); params.selected_variants = JSON.stringify(patch.selectedVariants); }
  if (patch.configuration !== undefined) { fields.push('configuration=@configuration'); params.configuration = JSON.stringify(patch.configuration); }
  if (patch.addOns !== undefined) { fields.push('add_ons=@add_ons'); params.add_ons = JSON.stringify(patch.addOns); }
  if (!fields.length) return existing;
  fields.push('updated_at=@updated_at'); params.updated_at = new Date().toISOString();
  db.prepare(`UPDATE service_requests SET ${fields.join(',')} WHERE id=@id`).run(params);
  // event
  db.prepare('INSERT INTO request_events (request_id,event_type,actor,note,created_at) VALUES (?,?,?,?,?)').run(existing.id, 'updated', 'system', 'Request updated', new Date().toISOString());
  return getRequest(String(existing.id))!;
}

export function deleteRequest(idOrRef: string): void {
  const existing = getRequest(idOrRef); if (!existing) return;
  db.prepare('DELETE FROM service_requests WHERE id=?').run(existing.id);
}

export function addRequestLineItem(requestId: number, item: Partial<RequestLineItem>): RequestLineItem {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO request_line_items (request_id,service_id,variant_id,description,quantity,unit_price,line_total,created_at) VALUES (?,?,?,?,?,?,?,?)')
    .run(requestId, item.serviceId!, item.variantId ?? null, item.description!, item.quantity ?? 1, item.unitPrice ?? 0, item.lineTotal ?? 0, ts);
  const r = db.prepare('SELECT * FROM request_line_items WHERE id=?').get(info.lastInsertRowid) as any;
  return { id: r.id, requestId: r.request_id, serviceId: r.service_id, variantId: r.variant_id, description: r.description, quantity: r.quantity, unitPrice: r.unit_price, lineTotal: r.line_total, createdAt: r.created_at };
}
export function addRequestEvent(requestId: number, eventType: string, actor: string, note?: string): void {
  db.prepare('INSERT INTO request_events (request_id,event_type,actor,note,created_at) VALUES (?,?,?,?,?)').run(requestId, eventType, actor, note ?? null, new Date().toISOString());
}
