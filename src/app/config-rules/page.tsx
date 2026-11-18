'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, Select, FormGrid } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { SlidersHorizontal, Plus, Trash2, Edit2 } from 'lucide-react';

export default function ConfigRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    serviceId: '', code: '', name: '', description: '', fieldType: 'text',
    options: '', isRequired: 'false', priceExtra: '', isActive: 'true',
  });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => {
    fetch('/api/config-rules').then(r => r.json()).then((d) => setRules(Array.isArray(d) ? d : []));
    fetch('/api/services').then(r => r.json()).then((d) => setServices(Array.isArray(d) ? d : []));
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/config-rules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, serviceId: Number(form.serviceId), isRequired: form.isRequired === 'true', priceExtra: Number(form.priceExtra) || 0, isActive: form.isActive === 'true', options: form.options ? form.options.split(',').map(s => s.trim()).filter(Boolean) : [] }) });
    setForm({ serviceId: '', code: '', name: '', description: '', fieldType: 'text', options: '', isRequired: 'false', priceExtra: '', isActive: 'true' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/config-rules/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, serviceId: Number(form.serviceId), isRequired: form.isRequired === 'true', priceExtra: Number(form.priceExtra) || 0, isActive: form.isActive === 'true', options: form.options ? form.options.split(',').map(s => s.trim()).filter(Boolean) : [] }) });
    setEditing(null);
    setShow(false);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this config rule?')) return;
    await fetch(`/api/config-rules/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration Rules"
        description="Define configurable fields for services."
        action={<Button onClick={() => { setForm({ serviceId: '', code: '', name: '', description: '', fieldType: 'text', options: '', isRequired: 'false', priceExtra: '', isActive: 'true' }); setEditing(null); setShow(true); }}><Plus size={16} /> New Rule</Button>}
      />

      {rules.length === 0 ? (
        <EmptyState title="No config rules yet" description="Create configuration rules for your services." icon={SlidersHorizontal} />
      ) : (
        <ListView
          items={rules}
          renderItem={(r) => (
            <ListItem
              key={r.id}
              leading={<div className="h-10 w-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><SlidersHorizontal size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Badge color={r.isActive ? 'success' : 'danger'}>{r.isActive ? 'Active' : 'Inactive'}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => { setForm({ serviceId: String(r.serviceId), code: r.code, name: r.name, description: r.description || '', fieldType: r.fieldType, options: Array.isArray(r.options) ? r.options.join(', ') : '', isRequired: String(r.isRequired), priceExtra: String(r.priceExtra), isActive: String(r.isActive) }); setEditing(r.id); setShow(true); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => del(r.id)}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{r.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{r.code} • {r.fieldType}</div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-600 dark:text-slate-400">{r.isRequired ? 'Required' : 'Optional'}</div>
                <div className="text-slate-500 dark:text-slate-500">+{r.priceExtra}</div>
              </div>
            </ListItem>
          )}
          emptyTitle="No config rules yet"
          emptyDescription="Create configuration rules for your services."
        />
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Config Rule' : 'Create Config Rule'} description={editing ? 'Update rule details.' : 'Add a new configuration rule.'}>
        <div className="space-y-4">
          <FormSection>
<FormGrid cols={4}>
              <Field label="Service" required>
                <Select id="cfg-serviceId" value={form.serviceId} onChange={value => setForm({ ...form, serviceId: value })}>
                  <option value="">Select service</option>
                  {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </Field>
              <Field label="Code" required>
                <TextInput id="cfg-code" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
              </Field>
              <Field label="Name" required>
                <TextInput id="cfg-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Description">
                <TextInput id="cfg-description" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Field label="Field Type">
                <Select id="cfg-fieldType" value={form.fieldType} onChange={value => setForm({ ...form, fieldType: value })}>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="multi_select">Multi Select</option>
                  <option value="boolean">Boolean</option>
                  <option value="date">Date</option>
                </Select>
              </Field>
              <Field label="Options (comma-separated)">
                <TextInput id="cfg-options" placeholder="opt1, opt2, opt3" value={form.options} onChange={e => setForm({ ...form, options: e.target.value })} />
              </Field>
              <Field label="Is Required">
                <Select id="cfg-isRequired" value={form.isRequired} onChange={value => setForm({ ...form, isRequired: value })}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </Field>
              <Field label="Price Extra">
                <TextInput id="cfg-priceExtra" type="number" placeholder="0" value={form.priceExtra} onChange={e => setForm({ ...form, priceExtra: e.target.value })} />
              </Field>
              <Field label="Active">
                <Select id="cfg-isActive" value={form.isActive} onChange={value => setForm({ ...form, isActive: value })}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </Field>
            </FormGrid>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={editing ? () => update(editing!) : create}>{editing ? 'Save Changes' : 'Create Rule'}</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}