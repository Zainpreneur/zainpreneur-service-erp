'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, Select, FormGrid } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { Package, Plus, Trash2, Edit2 } from 'lucide-react';

export default function VariantsPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    serviceId: '', code: '', name: '', description: '', price: '', cost: '',
    currency: 'USD', deliveryDays: '5', available: 'true', active: 'true', generation: 'instantly',
  });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => {
    fetch('/api/variants').then(r => r.json()).then((d) => setVariants(Array.isArray(d) ? d : []));
    fetch('/api/services').then(r => r.json()).then((d) => setServices(Array.isArray(d) ? d : []));
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/variants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: Number(form.price) || 0, cost: Number(form.cost) || 0, deliveryDays: Number(form.deliveryDays) || 5, available: form.available === 'true', active: form.active === 'true', serviceId: Number(form.serviceId) }) });
    setForm({ serviceId: '', code: '', name: '', description: '', price: '', cost: '', currency: 'USD', deliveryDays: '5', available: 'true', active: 'true', generation: 'instantly' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/variants/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: Number(form.price) || 0, cost: Number(form.cost) || 0, deliveryDays: Number(form.deliveryDays) || 5, available: form.available === 'true', active: form.active === 'true', serviceId: Number(form.serviceId) }) });
    setEditing(null);
    setShow(false);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this variant?')) return;
    await fetch(`/api/variants/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Variants"
        description="Manage variants for each service (e.g. sizes, tiers, packages)."
        action={<Button onClick={() => { setForm({ serviceId: '', code: '', name: '', description: '', price: '', cost: '', currency: 'USD', deliveryDays: '5', available: 'true', active: 'true', generation: 'instantly' }); setEditing(null); setShow(true); }}><Plus size={16} /> New Variant</Button>}
      />

      {variants.length === 0 ? (
        <EmptyState title="No variants yet" description="Create variants for your services." icon={Package} />
      ) : (
        <ListView
          items={variants}
          renderItem={(v) => (
            <ListItem
              key={v.id}
              leading={<div className="h-10 w-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Package size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Badge color={v.active ? 'success' : 'danger'}>{v.active ? 'Active' : 'Inactive'}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => { setForm({ serviceId: String(v.serviceId), code: v.code, name: v.name, description: v.description || '', price: String(v.price), cost: String(v.cost), currency: v.currency, deliveryDays: String(v.deliveryDays), available: String(v.available), active: String(v.active), generation: v.generation }); setEditing(v.id); setShow(true); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => del(v.id)}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{v.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{v.code} • {v.currency} {v.price}</div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-600 dark:text-slate-400">{v.deliveryDays} days</div>
                <div className="text-slate-500 dark:text-slate-500">{v.generation}</div>
              </div>
            </ListItem>
          )}
          emptyTitle="No variants yet"
          emptyDescription="Create variants for your services."
        />
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Variant' : 'Create Variant'} description={editing ? 'Update variant details.' : 'Add a new service variant.'}>
        <div className="space-y-4">
          <FormSection>
<FormGrid cols={4}>
              <Field label="Service" required>
                <Select id="var-serviceId" value={form.serviceId} onChange={value => setForm({ ...form, serviceId: value })}>
                  <option value="">Select service</option>
                  {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </Field>
              <Field label="Code" required>
                <TextInput id="var-code" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
              </Field>
              <Field label="Name" required>
                <TextInput id="var-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Description">
                <TextInput id="var-description" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Field label="Price">
                <TextInput id="var-price" type="number" placeholder="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </Field>
              <Field label="Cost">
                <TextInput id="var-cost" type="number" placeholder="0" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
              </Field>
              <Field label="Currency">
                <Select id="var-currency" value={form.currency} onChange={value => setForm({ ...form, currency: value })}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                  <option value="AED">AED</option>
                </Select>
              </Field>
              <Field label="Delivery Days">
                <TextInput id="var-deliveryDays" type="number" placeholder="5" value={form.deliveryDays} onChange={e => setForm({ ...form, deliveryDays: e.target.value })} />
              </Field>
              <Field label="Generation">
                <Select id="var-generation" value={form.generation} onChange={value => setForm({ ...form, generation: value })}>
                  <option value="instantly">Instantly</option>
                  <option value="dynamically">Dynamically</option>
                  <option value="manual">Manual</option>
                </Select>
              </Field>
              <Field label="Available">
                <Select id="var-available" value={form.available} onChange={value => setForm({ ...form, available: value })}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </Field>
              <Field label="Active">
                <Select id="var-active" value={form.active} onChange={value => setForm({ ...form, active: value })}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </Field>
            </FormGrid>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={editing ? () => update(editing!) : create}>{editing ? 'Save Changes' : 'Create Variant'}</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}