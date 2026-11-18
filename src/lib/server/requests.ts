import db from '../db';
import type { ServiceRequest, RequestLineItem, RequestConfiguration, RequestEvent, ServiceRequestInput } from '@/lib/types';

interface Row {
  id: number; reference: string; business_id: number; service_id: number; variant_id: number | null; title: string; description: string | null; status: string; priority: string; assigned_to: number | null; assigned_team: string | null; contact_name: string | null; contact_email: string | null; contact_phone: string | null; contact_role: string | null; requested_by: string | null; requested_date: string | null; required_date: string | null; scheduled_date: string | null; special_requirements: string | null; completed_at: string | null; closed_at: string | null; delivered_at: string | null; fulfilled_at: string | null; selected_variants: string; configuration: string; add_ons: string; base_price: number; variant_price: number; variant_extra: number; attribute_extras: number; configuration_charges: number; additional_services: number; discount_type: string | null; discount_value: number; discount_amount: number; total_amount: number; final_amount: number; currency: string; snapshot: string; resources: string; deployment: string | null; delivery_summary: string | null; branch_id: number | null; scope_mode: string; parent_request_id: number | null; preferred_window: string | null; retention_account_id: number | null; created_at: string; updated_at: string; business_name?: string; service_name?: string; assigned_to_name?: string | null;
}

function hydrate(r: Row): ServiceRequest {
  return {
    id: r.id, reference: r.reference, businessId: r.business_id, businessName: r.business_name, serviceId: r.service_id, serviceName: r.service_name, variantId: r.variant_id, title: r.title, description: r.description, status: r.status, priority: r.priority, assignedTo: r.assigned_to, assignedToName: r.assigned_to_name, assignedTeam: r.assigned_team, contactName: r.contact_name, contactEmail: r.contact_email, contactPhone: r.contact_phone, contactRole: r.contact_role, requestedBy: r.requested_by, requestedDate: r.requested_date, requiredDate: r.required_date, scheduledDate: r.scheduled_date, specialRequirements: r.special_requirements, completedAt: r.completed_at, closedAt: r.closed_at, deliveredAt: r.delivered_at, fulfilledAt: r.fulfilled_at, selectedVariants: JSON.parse(r.selected_variants || '[]'), configuration: JSON.parse(r.configuration || '{}'), addOns: JSON.parse(r.add_ons || '[]'), basePrice: r.base_price, variantPrice: r.variant_price, variantExtra: r.variant_extra, attributeExtras: r.attribute_extras, configurationCharges: r.configuration_charges, additionalServices: r.additional_services, discountType: r.discount_type, discountValue: r.discount_value, discountAmount: r.discount_amount, totalAmount: r.total_amount, finalAmount: r.final_amount, currency: r.currency, snapshot: JSON.parse(r.snapshot || '{}'), resources: JSON.parse(r.resources || '[]'), deployment: r.deployment, deliverySummary: r.delivery_summary, branchId: r.branch_id, scopeMode: r.scope_mode, parentRequestId: r.parent_request_id, preferredWindow: r.preferred_window, retentionAccountId: r.retention_account_id, createdAt: r.created_at, updatedAt: r.updated_at,
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
  const info = db.prepare(`INSERT INTO service_requests (reference,business_id,service_id,variant_id,title,description,status,priority,assigned_to,assigned_team,contact_name,contact_email,contact_phone,contact_role,requested_by,requested_date,required_date,scheduled_date,special_requirements,selected_variants,configuration,add_ons,base_price,variant_price,variant_extra,attribute_extras,configuration_charges,additional_services,discount_type,discount_value,discount_amount,total_amount,final_amount,currency,snapshot,resources,deployment,delivery_summary,branch_id,scope_mode,parent_request_id,preferred_window,retention_account_id,created_at,updated_at)
    VALUES (@reference,@business_id,@service_id,@variant_id,@title,@description,@status,@priority,@assigned_to,@assigned_team,@contact_name,@contact_email,@contact_phone,@contact_role,@requested_by,@requested_date,@required_date,@scheduled_date,@special_requirements,@selected_variants,@configuration,@add_ons,@base_price,@variant_price,@variant_extra,@attribute_extras,@configuration_charges,@additional_services,@discount_type,@discount_value,@discount_amount,@total_amount,@final_amount,@currency,@snapshot,@resources,@deployment,@delivery_summary,@branch_id,@scope_mode,@parent_request_id,@preferred_window,@retention_account_id,@created_at,@updated_at)`)
    .run({
      reference:`tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`, business_id: input.businessId, service_id: input.serviceId, variant_id: input.variantId ?? null, title: input.title, description: input.description ?? null, status: input.status ?? 'draft', priority: input.priority ?? 'normal', assigned_to: input.assignedTo ?? null, assigned_team: input.assignedTeam ?? null, contact_name: input.contactName ?? null, contact_email: input.contactEmail ?? null, contact_phone: input.contactPhone ?? null, contact_role: input.contactRole ?? null, requested_by: input.requestedBy ?? 'Zainpreneur', requested_date: input.requestedDate ?? null, required_date: input.requiredDate ?? null, scheduled_date: input.scheduledDate ?? null, special_requirements: input.specialRequirements ?? null, selected_variants: JSON.stringify(input.selectedVariants ?? []), configuration: JSON.stringify(input.configuration ?? {}), add_ons: JSON.stringify(input.addOns ?? []), base_price: input.basePrice ?? 0, variant_price: input.variantPrice ?? 0, variant_extra: input.variantExtra ?? 0, attribute_extras: input.attributeExtras ?? 0, configuration_charges: input.configurationCharges ?? 0, additional_services: input.additionalServices ?? 0, discount_type: input.discountType ?? null, discount_value: input.discountValue ?? 0, discount_amount: input.discountAmount ?? 0, total_amount: input.totalAmount ?? 0, final_amount: input.finalAmount ?? 0, currency: input.currency ?? 'USD', snapshot: JSON.stringify(input.snapshot ?? {}), resources: JSON.stringify(input.resources ?? []), deployment: input.deployment ?? null, delivery_summary: input.deliverySummary ?? null, branch_id: input.branchId ?? null, scope_mode: input.scopeMode ?? 'single', parent_request_id: input.parentRequestId ?? null, preferred_window: input.preferredWindow ?? null, retention_account_id: input.retentionAccountId ?? null, created_at: ts, updated_at: ts
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
    businessId:'business_id', serviceId:'service_id', variantId:'variant_id', title:'title', description:'description', status:'status', priority:'priority', assignedTo:'assigned_to', assignedTeam:'assigned_team', contactName:'contact_name', contactEmail:'contact_email', contactPhone:'contact_phone', contactRole:'contact_role', requestedBy:'requested_by', requestedDate:'requested_date', requiredDate:'required_date', scheduledDate:'scheduled_date', specialRequirements:'special_requirements', completedAt:'completed_at', closedAt:'closed_at', deliveredAt:'delivered_at', fulfilledAt:'fulfilled_at', basePrice:'base_price', variantPrice:'variant_price', variantExtra:'variant_extra', attributeExtras:'attribute_extras', configurationCharges:'configuration_charges', additionalServices:'additional_services', discountType:'discount_type', discountValue:'discount_value', discountAmount:'discount_amount', totalAmount:'total_amount', finalAmount:'final_amount', currency:'currency', deployment:'deployment', deliverySummary:'delivery_summary', branchId:'branch_id', scopeMode:'scope_mode', parentRequestId:'parent_request_id', preferredWindow:'preferred_window', retentionAccountId:'retention_account_id',
  };
  for (const [k,col] of Object.entries(map)) {
    if (Object.prototype.hasOwnProperty.call(patch,k)) {
      fields.push(`${col}=@${col}`);
      params[col] = (patch as any)[k] ?? null;
    }
  }
  if (patch.selectedVariants !== undefined) { fields.push('selected_variants=@selected_variants'); params.selected_variants = JSON.stringify(patch.selectedVariants); }
  if (patch.status === 'completed' && !('completedAt' in patch)) { fields.push('completed_at=@completed_at'); params.completed_at = new Date().toISOString(); }
  if (patch.configuration !== undefined) { fields.push('configuration=@configuration'); params.configuration = JSON.stringify(patch.configuration); }
  if (patch.addOns !== undefined) { fields.push('add_ons=@add_ons'); params.add_ons = JSON.stringify(patch.addOns); }
  if (patch.snapshot !== undefined) { fields.push('snapshot=@snapshot'); params.snapshot = JSON.stringify(patch.snapshot); }
  if (patch.resources !== undefined) { fields.push('resources=@resources'); params.resources = JSON.stringify(patch.resources); }
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
