'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, Select, FormGrid } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { Building, Plus, Trash2, Edit2 } from 'lucide-react';

export default function BusinessBranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState<string>('');
  const [form, setForm] = useState({ businessId: '', name: '', city: '', country: '' });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => {
    fetch('/api/businesses').then(r => r.json()).then((d) => setBusinesses(Array.isArray(d) ? d : []));
    if (businessId) {
      fetch(`/api/business-branches?businessId=${businessId}`).then(r => r.json()).then((d) => setBranches(Array.isArray(d) ? d : []));
    }
  };
  useEffect(() => { load(); }, [businessId]);

  const create = async () => {
    await fetch('/api/business-branches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, businessId: Number(form.businessId) }) });
    setForm({ businessId: form.businessId, name: '', city: '', country: '' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/business-branches/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, businessId: Number(form.businessId) }) });
    setEditing(null);
    setShow(false);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this branch?')) return;
    await fetch(`/api/business-branches/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Branches"
        description="Manage branch locations per business."
        action={<Button onClick={() => { setForm({ businessId: businessId, name: '', city: '', country: '' }); setEditing(null); setShow(true); }}><Plus size={16} /> New Branch</Button>}
      />

      <div className="flex items-center gap-4">
        <Field label="Business">
          <Select id="bb-business" value={businessId} onChange={e => { setBusinessId(e.target.value); setBranches([]); }}>
            <option value="">Select business</option>
            {(businesses || []).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
        </Field>
      </div>

      {businessId && (!branches || branches.length === 0) ? (
        <EmptyState title="No branches yet" description="Create a branch for this business." icon={Building} />
      ) : (
        <ListView
          items={branches || []}
          renderItem={(b) => (
            <ListItem
              key={b.id}
              leading={<div className="h-10 w-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Building size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => { setForm({ businessId: String(b.businessId), name: b.name, city: b.city || '', country: b.country || '' }); setEditing(b.id); setShow(true); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => del(b.id)}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{b.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{b.city}{b.country ? `, ${b.country}` : ''}</div>
              </div>
            </ListItem>
          )}
          emptyTitle="No branches yet"
          emptyDescription="Create a branch for this business."
        />
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Branch' : 'Create Branch'} description={editing ? 'Update branch details.' : 'Add a new branch.'}>
        <div className="space-y-4">
          <FormSection>
<FormGrid cols={4}>
              <Field label="Business" required>
                <Select id="bb-form-business" value={form.businessId} onChange={value => setForm({ ...form, businessId: value })}>
                  <option value="">Select business</option>
                  {(businesses || []).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </Select>
              </Field>
              <Field label="Name" required>
                <TextInput id="bb-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="City">
                <TextInput id="bb-city" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </Field>
              <Field label="Country">
                <TextInput id="bb-country" placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              </Field>
            </FormGrid>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={editing ? () => update(editing!) : create}>{editing ? 'Save Changes' : 'Create Branch'}</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}