import db from '../db';
import type { Person } from '@/lib/types';

interface Row { id: number; code: string | null; name: string; email: string | null; phone: string | null; team: string | null; role: string | null; is_active: number; created_at: string; discipline: string | null; hourly_rate: number; weekly_hours: number; classification: string; employment_type: string; compensation_model: string; resource_status: string; tax_or_vendor_id: string | null; overtime_multiplier: number; max_billable_hours: number | null; monthly_salary: number | null; payroll_schedule: string | null; allowance_limit: number | null; invoice_requirement: string | null; tax_document_kind: string | null; tax_document_status: string; tax_document_expires: string | null; payable_schedule: string | null; bank_account_ref: string | null; }

function hydrate(r: Row): Person {
  return { id: r.id, code: r.code, name: r.name, email: r.email, phone: r.phone, team: r.team, role: r.role, isActive: !!r.is_active, createdAt: r.created_at, discipline: r.discipline, hourlyRate: r.hourly_rate, weeklyHours: r.weekly_hours, classification: r.classification, employmentType: r.employment_type, compensationModel: r.compensation_model, resourceStatus: r.resource_status, taxOrVendorId: r.tax_or_vendor_id, overtimeMultiplier: r.overtime_multiplier, maxBillableHours: r.max_billable_hours, monthlySalary: r.monthly_salary, payrollSchedule: r.payroll_schedule, allowanceLimit: r.allowance_limit, invoiceRequirement: r.invoice_requirement, taxDocumentKind: r.tax_document_kind, taxDocumentStatus: r.tax_document_status, taxDocumentExpires: r.tax_document_expires, payableSchedule: r.payable_schedule, bankAccountRef: r.bank_account_ref };
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
  const info = db.prepare(`INSERT INTO people (code,name,email,phone,team,role,is_active,created_at,discipline,hourly_rate,weekly_hours,classification,employment_type,compensation_model,resource_status,tax_or_vendor_id,overtime_multiplier,max_billable_hours,monthly_salary,payroll_schedule,allowance_limit,invoice_requirement,tax_document_kind,tax_document_status,tax_document_expires,payable_schedule,bank_account_ref)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(input.code ?? null, input.name!, input.email ?? null, input.phone ?? null, input.team ?? null, input.role ?? null, input.isActive === false ? 0 : 1, ts, input.discipline ?? null, input.hourlyRate ?? 0, input.weeklyHours ?? 40, input.classification ?? 'internal', input.employmentType ?? 'full_time', input.compensationModel ?? 'hourly', input.resourceStatus ?? 'active', input.taxOrVendorId ?? null, input.overtimeMultiplier ?? 1.5, input.maxBillableHours ?? null, input.monthlySalary ?? null, input.payrollSchedule ?? null, input.allowanceLimit ?? null, input.invoiceRequirement ?? null, input.taxDocumentKind ?? null, input.taxDocumentStatus ?? 'missing', input.taxDocumentExpires ?? null, input.payableSchedule ?? null, input.bankAccountRef ?? null);
  return getPerson(Number(info.lastInsertRowid))!;
}
export function updatePerson(id: number, patch: Partial<Person>): Person | null {
  const fields: string[] = []; const params: Record<string, unknown> = { id };
  const map: Record<string,string> = { code:'code', name:'name', email:'email', phone:'phone', team:'team', role:'role', discipline:'discipline', taxOrVendorId:'tax_or_vendor_id', payrollSchedule:'payroll_schedule', invoiceRequirement:'invoice_requirement', taxDocumentKind:'tax_document_kind', taxDocumentStatus:'tax_document_status', taxDocumentExpires:'tax_document_expires', payableSchedule:'payable_schedule', bankAccountRef:'bank_account_ref', classification:'classification', employmentType:'employment_type', compensationModel:'compensation_model', resourceStatus:'resource_status' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(patch,k)) { fields.push(`${col}=@${col}`); params[col]=(patch as any)[k] ?? null; }
  if (patch.isActive !== undefined) { fields.push('is_active=@is_active'); params.is_active = patch.isActive ? 1 : 0; }
  if (patch.hourlyRate !== undefined) { fields.push('hourly_rate=@hourly_rate'); params.hourly_rate = patch.hourlyRate; }
  if (patch.weeklyHours !== undefined) { fields.push('weekly_hours=@weekly_hours'); params.weekly_hours = patch.weeklyHours; }
  if (patch.overtimeMultiplier !== undefined) { fields.push('overtime_multiplier=@overtime_multiplier'); params.overtime_multiplier = patch.overtimeMultiplier; }
  if (patch.maxBillableHours !== undefined) { fields.push('max_billable_hours=@max_billable_hours'); params.max_billable_hours = patch.maxBillableHours; }
  if (patch.monthlySalary !== undefined) { fields.push('monthly_salary=@monthly_salary'); params.monthly_salary = patch.monthlySalary; }
  if (patch.allowanceLimit !== undefined) { fields.push('allowance_limit=@allowance_limit'); params.allowance_limit = patch.allowanceLimit; }
  if (!fields.length) return getPerson(id);
  db.prepare(`UPDATE people SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getPerson(id);
}
export function deletePerson(id: number): void { db.prepare('DELETE FROM people WHERE id=?').run(id); }
