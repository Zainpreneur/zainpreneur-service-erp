'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, Select, FormGrid } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { Banknote, Plus, Trash2, Edit2 } from 'lucide-react';

export default function RetentionAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState<string>('');
  const [form, setForm] = useState({ businessId: '', name: '', accountRef: '', currency: 'USD', primary: 'false' });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => {
    fetch('/api/businesses').then(r => r.json()).then((d) => setBusinesses(Array.isArray(d) ? d : []));
    if (businessId) {
      fetch(`/api/retention-accounts?businessId=${businessId}`).then(r => r.json()).then((d) => setAccounts(Array.isArray(d) ? d : []));
    }
  };
  useEffect(() => { load(); }, [businessId]);

  const create = async () => {
    await fetch('/api/retention-accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, businessId: Number(form.businessId), primary: form.primary === 'true' }) });
    setForm({ businessId: form.businessId, name: '', accountRef: '', currency: 'USD', primary: 'false' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/retention-accounts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, businessId: Number(form.businessId), primary: form.primary === 'true' }) });
    setEditing(null);
    setShow(false);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this retention account?')) return;
    await fetch(`/api/retention-accounts/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Retention Accounts"
        description="Holding accounts for withheld payments per business."
        action={<Button onClick={() => { setForm({ businessId: businessId, name: '', accountRef: '', currency: 'USD', primary: 'false' }); setEditing(null); setShow(true); }}><Plus size={16} /> New Account</Button>}
      />

      <div className="flex items-center gap-4">
        <Field label="Business">
          <Select id="ra-business" value={businessId} onChange={e => { setBusinessId(e.target.value); setAccounts([]); }}>
            <option value="">Select business</option>
            {(businesses || []).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
        </Field>
      </div>

      {businessId && (!accounts || accounts.length === 0) ? (
        <EmptyState title="No retention accounts" description="Create a retention account for this business." icon={Banknote} />
      ) : (
        <ListView
          items={accounts || []}
          renderItem={(a) => (
            <ListItem
              key={a.id}
              leading={<div className="h-10 w-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Banknote size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Badge color={a.primary ? 'success' : 'default'}>{a.primary ? 'Primary' : 'Secondary'}</Badge>
                  <Badge color={a.active ? 'success' : 'danger'}>{a.active ? 'Active' : 'Inactive'}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => { setForm({ businessId: String(a.businessId), name: a.name, accountRef: a.accountRef, currency: a.currency, primary: String(a.primary) }); setEditing(a.id); setShow(true); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => del(a.id)}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{a.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{a.accountRef} • {a.currency}</div>
              </div>
            </ListItem>
          )}
          emptyTitle="No retention accounts"
          emptyDescription="Create a retention account for this business."
        />
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Retention Account' : 'Create Retention Account'} description={editing ? 'Update account details.' : 'Add a new retention account.'}>
        <div className="space-y-4">
          <FormSection>
<FormGrid cols={4}>
              <Field label="Business" required>
                <Select id="ra-form-business" value={form.businessId} onChange={value => setForm({ ...form, businessId: value })}>
                  <option value="">Select business</option>
                  {(businesses || []).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </Select>
              </Field>
              <Field label="Name" required>
                <TextInput id="ra-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Account Ref" required>
                <TextInput id="ra-accountRef" placeholder="Ref" value={form.accountRef} onChange={e => setForm({ ...form, accountRef: e.target.value })} />
              </Field>
              <Field label="Currency">
                <Select id="ra-currency" value={form.currency} onChange={value => setForm({ ...form, currency: value })}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                  <option value="AED">AED</option>
                </Select>
              </Field>
              <Field label="Primary Account">
                <Select id="ra-primary" value={form.primary} onChange={value => setForm({ ...form, primary: value })}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </Field>
            </FormGrid>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={editing ? () => update(editing!) : create}>{editing ? 'Save Changes' : 'Create Account'}</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}