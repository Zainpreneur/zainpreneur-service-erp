import db from '../db';
import type { Service, ServiceCategory, ServiceAttribute, ConfigurationRule, SupportInfo, Attribute, AttributeValue, ServiceVariant } from '@/lib/types';

interface SvcRow { id: number; code: string; name: string; category_id: number; service_type: string; summary: string; description: string; base_price: number; base_cost: number; currency: string; delivery_days: number; team: string; active: number; archived_at: string | null; created_at: string; updated_at: string; category_name?: string; }

function hydrateService(r: SvcRow): Service {
  return { id: r.id, code: r.code, name: r.name, categoryId: r.category_id, categoryName: r.category_name, serviceType: r.service_type, summary: r.summary, description: r.description, basePrice: r.base_price, baseCost: r.base_cost, currency: r.currency, deliveryDays: r.delivery_days, team: r.team, active: !!r.active, archivedAt: r.archived_at, createdAt: r.created_at, updatedAt: r.updated_at };
}

export function listCategories(): ServiceCategory[] {
  return (db.prepare('SELECT * FROM service_categories ORDER BY sequence, name').all() as any[]).map(r => ({ id: r.id, name: r.name, code: r.code, sequence: r.sequence, archivedAt: r.archived_at, createdAt: r.created_at }));
}
export function createCategory(input: Partial<ServiceCategory>): ServiceCategory {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO service_categories (name,code,sequence,created_at) VALUES (?,?,?,?)').run(input.name!, input.code!, input.sequence ?? 0, ts);
  return listCategories().find(c=>c.id===Number(info.lastInsertRowid))!;
}
export function getCategory(idOrCode: string): ServiceCategory | null {
  const isNum = /^\d+$/.test(idOrCode);
  const r = (isNum ? db.prepare('SELECT * FROM service_categories WHERE id=?').get(Number(idOrCode)) : db.prepare('SELECT * FROM service_categories WHERE code=?').get(idOrCode)) as any;
  if (!r) return null;
  return { id: r.id, name: r.name, code: r.code, sequence: r.sequence, archivedAt: r.archived_at, createdAt: r.created_at };
}
export function updateCategory(idOrCode: string, patch: Partial<ServiceCategory>): ServiceCategory | null {
  const existing = getCategory(idOrCode); if (!existing) return null;
  const fields: string[] = []; const params: Record<string,unknown> = { id: existing.id };
  const map: Record<string,string> = { name:'name', code:'code' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.sequence !== undefined) { fields.push('sequence=@sequence'); params.sequence = patch.sequence; }
  if (!fields.length) return existing;
  db.prepare(`UPDATE service_categories SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getCategory(String(existing.id));
}
export function deleteCategory(idOrCode: string): void { const e = getCategory(idOrCode); if(!e) return; db.prepare('DELETE FROM service_categories WHERE id=?').run(e.id); }

export function listServices(filters: { search?: string; categoryId?: number; active?: boolean } = {}): Service[] {
  const conds: string[] = []; const params: unknown[] = [];
  if (filters.search) { conds.push('(s.name LIKE ? OR s.code LIKE ? OR s.summary LIKE ?)'); const q=`%${filters.search}%`; params.push(q,q,q); }
  if (filters.categoryId) { conds.push('s.category_id = ?'); params.push(filters.categoryId); }
  if (filters.active !== undefined) { conds.push('s.active = ?'); params.push(filters.active?1:0); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT s.*, c.name AS category_name FROM services s JOIN service_categories c ON c.id=s.category_id ${where} ORDER BY s.name`).all(...params) as SvcRow[];
  return rows.map(hydrateService);
}
export function getService(idOrCode: string): Service | null {
  const isNum = /^\d+$/.test(idOrCode);
  const r = (isNum ? db.prepare('SELECT s.*, c.name AS category_name FROM services s JOIN service_categories c ON c.id=s.category_id WHERE s.id=?').get(Number(idOrCode)) : db.prepare('SELECT s.*, c.name AS category_name FROM services s JOIN service_categories c ON c.id=s.category_id WHERE s.code=?').get(idOrCode)) as SvcRow | undefined;
  return r ? hydrateService(r) : null;
}
export function createService(input: Partial<Service> & { categoryId: number }): Service {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO services (code,name,category_id,service_type,summary,description,base_price,base_cost,currency,delivery_days,team,active,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(input.code!, input.name!, input.categoryId, input.serviceType ?? 'standard', input.summary ?? '', input.description ?? '', input.basePrice ?? 0, input.baseCost ?? 0, input.currency ?? 'USD', input.deliveryDays ?? 5, input.team ?? 'General', input.active===false?0:1, ts, ts);
  return getService(String(info.lastInsertRowid))!;
}
export function updateService(idOrCode: string, patch: Partial<Service>): Service | null {
  const existing = getService(idOrCode); if (!existing) return null;
  const fields: string[] = []; const params: Record<string,unknown> = { id: existing.id };
  const map: Record<string,string> = { code:'code', name:'name', serviceType:'service_type', summary:'summary', description:'description', basePrice:'base_price', baseCost:'base_cost', currency:'currency', deliveryDays:'delivery_days', team:'team' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.categoryId !== undefined) { fields.push('category_id=@category_id'); params.category_id = patch.categoryId; }
  if (patch.active !== undefined) { fields.push('active=@active'); params.active = patch.active?1:0; }
  if (!fields.length) return existing;
  fields.push('updated_at=@updated_at'); params.updated_at = new Date().toISOString();
  db.prepare(`UPDATE services SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getService(String(existing.id));
}
export function deleteService(idOrCode: string): void { const e=getService(idOrCode); if(!e) return; db.prepare('DELETE FROM services WHERE id=?').run(e.id); }

// attributes
interface AttrRow { id: number; code: string; name: string; category: string; display_type: string; variant_creation: string; allow_custom_value: number; description: string | null; sequence: number; active: number; archived_at: string | null; }

function hydrateAttr(r: AttrRow): Attribute {
  return { id: r.id, code: r.code, name: r.name, category: r.category, displayType: r.display_type, variantCreation: r.variant_creation, allowCustomValue: !!r.allow_custom_value, description: r.description, sequence: r.sequence, active: !!r.active, archivedAt: r.archived_at };
}

export function listAttributes(): Attribute[] { return (db.prepare('SELECT * FROM attributes ORDER BY sequence, name').all() as AttrRow[]).map(hydrateAttr); }
export function getAttribute(id: number): Attribute | null { const r = db.prepare('SELECT * FROM attributes WHERE id=?').get(id) as AttrRow | undefined; return r?hydrateAttr(r):null; }
export function createAttribute(input: Partial<Attribute>): Attribute {
  const info = db.prepare('INSERT INTO attributes (code,name,category,display_type,variant_creation,allow_custom_value,description,sequence,active) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(input.code!, input.name!, input.category ?? 'general', input.displayType ?? 'select', input.variantCreation ?? 'no', input.allowCustomValue?1:0, input.description ?? null, input.sequence ?? 0, input.active===false?0:1);
  return getAttribute(Number(info.lastInsertRowid))!;
}
export function updateAttribute(id: number, patch: Partial<Attribute>): Attribute | null {
  const fields: string[] = []; const params: Record<string,unknown> = { id };
  const map: Record<string,string> = { code:'code', name:'name', category:'category', displayType:'display_type', variantCreation:'variant_creation', description:'description' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.allowCustomValue !== undefined) { fields.push('allow_custom_value=@allow_custom_value'); params.allow_custom_value = patch.allowCustomValue?1:0; }
  if (patch.active !== undefined) { fields.push('active=@active'); params.active = patch.active?1:0; }
  if (patch.sequence !== undefined) { fields.push('sequence=@sequence'); params.sequence = patch.sequence; }
  if (!fields.length) return getAttribute(id);
  db.prepare(`UPDATE attributes SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getAttribute(id);
}
export function deleteAttribute(id: number): void { db.prepare('DELETE FROM attributes WHERE id=?').run(id); }

// attribute values
interface AVRow { id: number; attribute_id: number; name: string; code: string; description: string | null; price_extra: number; color: string | null; is_custom: number; sequence: number; active: number; archived_at: string | null; }
function hydrateAV(r: AVRow): AttributeValue { return { id: r.id, attributeId: r.attribute_id, name: r.name, code: r.code, description: r.description, priceExtra: r.price_extra, color: r.color, isCustom: !!r.is_custom, sequence: r.sequence, active: !!r.active, archivedAt: r.archived_at }; }
export function listAttributeValues(attributeId?: number): AttributeValue[] {
  const rows = attributeId ? db.prepare('SELECT * FROM attribute_values WHERE attribute_id=? ORDER BY sequence,name').all(attributeId) : db.prepare('SELECT * FROM attribute_values ORDER BY attribute_id,sequence,name').all();
  return (rows as AVRow[]).map(hydrateAV);
}
export function createAttributeValue(input: Partial<AttributeValue> & { attributeId: number }): AttributeValue {
  const info = db.prepare('INSERT INTO attribute_values (attribute_id,name,code,description,price_extra,color,is_custom,sequence,active) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(input.attributeId, input.name!, input.code!, input.description ?? null, input.priceExtra ?? 0, input.color ?? null, input.isCustom?1:0, input.sequence ?? 0, input.active===false?0:1);
  const r = db.prepare('SELECT * FROM attribute_values WHERE id=?').get(info.lastInsertRowid) as AVRow;
  return hydrateAV(r);
}
export function updateAttributeValue(id: number, patch: Partial<AttributeValue>): AttributeValue | null {
  const fields: string[] = []; const params: Record<string,unknown> = { id };
  const map: Record<string,string> = { name:'name', code:'code', description:'description', color:'color' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.priceExtra !== undefined) { fields.push('price_extra=@price_extra'); params.price_extra = patch.priceExtra; }
  if (patch.active !== undefined) { fields.push('active=@active'); params.active = patch.active?1:0; }
  if (patch.sequence !== undefined) { fields.push('sequence=@sequence'); params.sequence = patch.sequence; }
  if (patch.isCustom !== undefined) { fields.push('is_custom=@is_custom'); params.is_custom = patch.isCustom?1:0; }
  if (!fields.length) { const r=db.prepare('SELECT * FROM attribute_values WHERE id=?').get(id) as AVRow|undefined; return r?hydrateAV(r):null; }
  db.prepare(`UPDATE attribute_values SET ${fields.join(',')} WHERE id=@id`).run(params);
  const r = db.prepare('SELECT * FROM attribute_values WHERE id=?').get(id) as AVRow | undefined;
  return r ? hydrateAV(r) : null;
}
export function deleteAttributeValue(id: number): void { db.prepare('DELETE FROM attribute_values WHERE id=?').run(id); }

// service attributes
export function listServiceAttributes(serviceId: number): ServiceAttribute[] {
  return (db.prepare('SELECT * FROM service_attributes WHERE service_id=? ORDER BY sequence').all(serviceId) as any[]).map(r => ({ serviceId: r.service_id, attributeId: r.attribute_id, required: !!r.required, variantCreating: !!r.variant_creating, sequence: r.sequence }));
}
export function setServiceAttribute(serviceId: number, attributeId: number, data: Partial<ServiceAttribute>): void {
  db.prepare('INSERT INTO service_attributes (service_id,attribute_id,required,variant_creating,sequence) VALUES (?,?,?,?,?) ON CONFLICT(service_id,attribute_id) DO UPDATE SET required=excluded.required, variant_creating=excluded.variant_creating, sequence=excluded.sequence')
    .run(serviceId, attributeId, data.required?1:0, data.variantCreating?1:0, data.sequence ?? 0);
}
export function removeServiceAttribute(serviceId: number, attributeId: number): void {
  db.prepare('DELETE FROM service_attributes WHERE service_id=? AND attribute_id=?').run(serviceId, attributeId);
}

// variants
interface VarRow { id: number; service_id: number; code: string; name: string; description: string | null; price: number; cost: number; currency: string; delivery_days: number; available: number; active: number; archived_at: string | null; generation: string; created_at: string; }
function hydrateVariant(r: VarRow): ServiceVariant {
  const vals = db.prepare('SELECT attribute_id, attribute_value_id FROM variant_values WHERE variant_id=?').all(r.id) as any[];
  return { id: r.id, serviceId: r.service_id, code: r.code, name: r.name, description: r.description, price: r.price, cost: r.cost, currency: r.currency, deliveryDays: r.delivery_days, available: !!r.available, active: !!r.active, archivedAt: r.archived_at, generation: r.generation, createdAt: r.created_at, values: vals.map(v=>({ attributeId: v.attribute_id, attributeValueId: v.attribute_value_id })) };
}
export function listVariants(serviceId?: number): ServiceVariant[] {
  const rows = serviceId ? db.prepare('SELECT * FROM service_variants WHERE service_id=? ORDER BY name').all(serviceId) : db.prepare('SELECT * FROM service_variants ORDER BY service_id,name').all();
  return (rows as VarRow[]).map(hydrateVariant);
}
export function getVariant(id: number): ServiceVariant | null { const r = db.prepare('SELECT * FROM service_variants WHERE id=?').get(id) as VarRow | undefined; return r ? hydrateVariant(r) : null; }
export function createVariant(input: Partial<ServiceVariant> & { serviceId: number }): ServiceVariant {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO service_variants (service_id,code,name,description,price,cost,currency,delivery_days,available,active,generation,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(input.serviceId, input.code!, input.name!, input.description ?? null, input.price ?? 0, input.cost ?? 0, input.currency ?? 'USD', input.deliveryDays ?? 5, input.available===false?0:1, input.active===false?0:1, input.generation ?? 'instantly', ts);
  const id = Number(info.lastInsertRowid);
  if (input.values) for (const v of input.values) db.prepare('INSERT INTO variant_values (variant_id,attribute_id,attribute_value_id) VALUES (?,?,?)').run(id, v.attributeId, v.attributeValueId);
  return getVariant(id)!;
}
export function updateVariant(id: number, patch: Partial<ServiceVariant>): ServiceVariant | null {
  const existing = getVariant(id); if (!existing) return null;
  const fields: string[] = []; const params: Record<string,unknown> = { id };
  const map: Record<string,string> = { code:'code', name:'name', description:'description', currency:'currency', generation:'generation' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.price !== undefined) { fields.push('price=@price'); params.price = patch.price; }
  if (patch.cost !== undefined) { fields.push('cost=@cost'); params.cost = patch.cost; }
  if (patch.deliveryDays !== undefined) { fields.push('delivery_days=@delivery_days'); params.delivery_days = patch.deliveryDays; }
  if (patch.available !== undefined) { fields.push('available=@available'); params.available = patch.available?1:0; }
  if (patch.active !== undefined) { fields.push('active=@active'); params.active = patch.active?1:0; }
  if (fields.length) db.prepare(`UPDATE service_variants SET ${fields.join(',')} WHERE id=@id`).run(params);
  if (patch.values) {
    db.prepare('DELETE FROM variant_values WHERE variant_id=?').run(id);
    for (const v of patch.values) db.prepare('INSERT INTO variant_values (variant_id,attribute_id,attribute_value_id) VALUES (?,?,?)').run(id, v.attributeId, v.attributeValueId);
  }
  return getVariant(id);
}
export function deleteVariant(id: number): void { db.prepare('DELETE FROM service_variants WHERE id=?').run(id); }

// configuration rules
export function listConfigRules(serviceId?: number): ConfigurationRule[] {
  if (serviceId !== undefined) {
    return (db.prepare('SELECT * FROM configuration_rules WHERE service_id=? ORDER BY id').all(serviceId) as any[]).map(r => ({ id: r.id, serviceId: r.service_id, code: r.code, name: r.name, description: r.description, fieldType: r.field_type, options: JSON.parse(r.options||'[]'), isRequired: !!r.is_required, priceExtra: r.price_extra, isActive: !!r.is_active, createdAt: r.created_at }));
  }
  return (db.prepare('SELECT * FROM configuration_rules ORDER BY id').all() as any[]).map(r => ({ id: r.id, serviceId: r.service_id, code: r.code, name: r.name, description: r.description, fieldType: r.field_type, options: JSON.parse(r.options||'[]'), isRequired: !!r.is_required, priceExtra: r.price_extra, isActive: !!r.is_active, createdAt: r.created_at }));
}
export function createConfigRule(input: Partial<ConfigurationRule> & { serviceId: number }): ConfigurationRule {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO configuration_rules (service_id,code,name,description,field_type,options,is_required,price_extra,is_active,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .run(input.serviceId, input.code!, input.name!, input.description ?? null, input.fieldType ?? 'text', JSON.stringify(input.options ?? []), input.isRequired?1:0, input.priceExtra ?? 0, input.isActive===false?0:1, ts);
  return listConfigRules(input.serviceId).find(r=>r.id===Number(info.lastInsertRowid))!;
}
export function getConfigRule(id: number): ConfigurationRule | null {
  const r = db.prepare('SELECT * FROM configuration_rules WHERE id=?').get(id) as any;
  if (!r) return null;
  return { id: r.id, serviceId: r.service_id, code: r.code, name: r.name, description: r.description, fieldType: r.field_type, options: JSON.parse(r.options||'[]'), isRequired: !!r.is_required, priceExtra: r.price_extra, isActive: !!r.is_active, createdAt: r.created_at };
}
export function updateConfigRule(id: number, patch: Partial<ConfigurationRule>): ConfigurationRule | null {
  const existing = getConfigRule(id); if (!existing) return null;
  const fields: string[] = []; const params: Record<string,unknown> = { id };
  const map: Record<string,string> = { code:'code', name:'name', description:'description', fieldType:'field_type', options:'options', priceExtra:'price_extra' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.options !== undefined) params.options = JSON.stringify(patch.options);
  if (patch.isRequired !== undefined) { fields.push('is_required=@is_required'); params.is_required = patch.isRequired?1:0; }
  if (patch.isActive !== undefined) { fields.push('is_active=@is_active'); params.is_active = patch.isActive?1:0; }
  if (!fields.length) return existing;
  db.prepare(`UPDATE configuration_rules SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getConfigRule(id);
}
export function deleteConfigRule(id: number): void { db.prepare('DELETE FROM configuration_rules WHERE id=?').run(id); }

// support info
export function getSupportInfo(serviceId: number): SupportInfo | null {
  const r = db.prepare('SELECT * FROM support_info WHERE service_id=?').get(serviceId) as any;
  if (!r) return null;
  return { id: r.id, serviceId: r.service_id, supportEmail: r.support_email, supportPhone: r.support_phone, supportHours: r.support_hours, slaResponseTime: r.sla_response_time, createdAt: r.created_at, updatedAt: r.updated_at };
}
export function upsertSupportInfo(serviceId: number, input: Partial<SupportInfo>): SupportInfo {
  const existing = getSupportInfo(serviceId); const ts = new Date().toISOString();
  if (existing) {
    db.prepare('UPDATE support_info SET support_email=?,support_phone=?,support_hours=?,sla_response_time=?,updated_at=? WHERE service_id=?')
      .run(input.supportEmail ?? existing.supportEmail, input.supportPhone ?? existing.supportPhone, input.supportHours ?? existing.supportHours, input.slaResponseTime ?? existing.slaResponseTime, ts, serviceId);
  } else {
    db.prepare('INSERT INTO support_info (service_id,support_email,support_phone,support_hours,sla_response_time,created_at,updated_at) VALUES (?,?,?,?,?,?,?)')
      .run(serviceId, input.supportEmail ?? null, input.supportPhone ?? null, input.supportHours ?? null, input.slaResponseTime ?? null, ts, ts);
  }
  return getSupportInfo(serviceId)!;
}
