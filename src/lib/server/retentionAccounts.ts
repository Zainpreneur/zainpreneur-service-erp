import db from '../db';

interface Row { id: number; business_id: number; name: string; account_ref: string; currency: string; primary_account: number; active: number; created_at: string; }

export function listAccounts(businessId: number) {
  return (db.prepare('SELECT * FROM retention_accounts WHERE business_id=? ORDER BY primary_account DESC, name').all(businessId) as Row[]).map(r => ({ id: r.id, businessId: r.business_id, name: r.name, accountRef: r.account_ref, currency: r.currency, primary: !!r.primary_account, active: !!r.active, createdAt: r.created_at }));
}
export function createAccount(input: { businessId: number; name: string; accountRef: string; currency?: string; primary?: boolean }) {
  const ts = new Date().toISOString();
  const info = db.prepare('INSERT INTO retention_accounts (business_id,name,account_ref,currency,primary_account,active,created_at) VALUES (?,?,?,?,?,?,?)')
    .run(input.businessId, input.name, input.accountRef, input.currency ?? 'USD', input.primary ? 1 : 0, 1, ts);
  return { id: Number(info.lastInsertRowid) };
}
export function getAccount(id: number): any | null {
  const r = db.prepare('SELECT * FROM retention_accounts WHERE id=?').get(id) as Row | undefined;
  if (!r) return null;
  return { id: r.id, businessId: r.business_id, name: r.name, accountRef: r.account_ref, currency: r.currency, primary: !!r.primary_account, active: !!r.active, createdAt: r.created_at };
}
export function updateAccount(id: number, input: { name?: string; accountRef?: string; currency?: string; primary?: boolean; active?: boolean }) {
  const fields: string[] = []; const params: Record<string,unknown> = { id };
  const map: Record<string,string> = { name:'name', accountRef:'account_ref', currency:'currency' };
  for (const [k,col] of Object.entries(map)) if (Object.prototype.hasOwnProperty.call(input,k)) { fields.push(`${col}=@${col}`); params[col]=(input as any)[k] ?? null; }
  if (input.primary !== undefined) { fields.push('primary_account=@primary_account'); params.primary_account = input.primary?1:0; }
  if (input.active !== undefined) { fields.push('active=@active'); params.active = input.active?1:0; }
  if (!fields.length) return getAccount(id);
  db.prepare(`UPDATE retention_accounts SET ${fields.join(',')} WHERE id=@id`).run(params);
  return getAccount(id);
}
export function deleteAccount(id: number) { db.prepare('DELETE FROM retention_accounts WHERE id=?').run(id); }