'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ViewSwitcher, type ViewMode } from '@/components/ui/ViewSwitcher';
import { DataTable } from '@/components/ui/Table';
import { ListView, ListItem } from '@/components/ui/ListView';
import { CardGridView } from '@/components/ui/CardGridView';
import { PageHeader } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal';
import { Field, FormSection, FormFooter, TextInput, TextArea, Select, FormGrid } from '@/components/ui/Form';
import { Package, Plus, Trash2, Edit2, Search } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('card');
  const [form, setForm] = useState({
    code: '', name: '', categoryId: '', serviceType: 'standard', summary: '', description: '',
    basePrice: '', baseCost: '', currency: 'USD', deliveryDays: '', team: 'General', active: 'true',
  });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/services${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then(r => r.json()).then(d => { setServices(Array.isArray(d) ? d : []); setLoading(false); });
    fetch('/api/categories').then(r => r.json()).then((d) => setCategories(Array.isArray(d) ? d : []));
  };
  useEffect(() => { const id = setTimeout(load, 0); return () => clearTimeout(id); }, []);

  const create = async () => {
    await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, basePrice: Number(form.basePrice) || 0, baseCost: Number(form.baseCost) || 0, deliveryDays: Number(form.deliveryDays) || 5, active: form.active === 'true', categoryId: Number(form.categoryId) || 1 }) });
    setForm({ code: '', name: '', categoryId: '', serviceType: 'standard', summary: '', description: '', basePrice: '', baseCost: '', currency: 'USD', deliveryDays: '', team: 'General', active: 'true' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/services/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, basePrice: Number(form.basePrice) || 0, baseCost: Number(form.baseCost) || 0, deliveryDays: Number(form.deliveryDays) || 5, active: form.active === 'true', categoryId: Number(form.categoryId) || 1 }) });
    setEditing(null);
    setShow(false);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    load();
  };

  const columns = [
    { id: 'code', header: 'Code', cell: ({ value }) => <span className="text-indigo-600 dark:text-indigo-400 font-medium">{value}</span> },
    { id: 'name', header: 'Name', cell: ({ value }) => <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{value}</div> },
    { id: 'categoryName', header: 'Category', cell: ({ value }) => <span className="text-slate-600 dark:text-slate-400">{value}</span> },
    { id: 'serviceType', header: 'Type', cell: ({ value }) => <span className="text-slate-600 dark:text-slate-400 text-sm">{value}</span> },
    { id: 'active', header: 'Status', cell: ({ value }) => <Badge color={value ? 'success' : 'danger'}>{value ? 'Active' : 'Archived'}</Badge> },
    { id: 'basePrice', header: 'Price', cell: ({ value, row }) => <span className="text-right font-semibold text-slate-900 dark:text-slate-100">{row.currency} {value}</span> },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => { const s = row.original; setForm({ code: s.code, name: s.name, categoryId: String(s.categoryId), serviceType: s.serviceType, summary: s.summary, description: s.description, basePrice: String(s.basePrice), baseCost: String(s.baseCost), currency: s.currency, deliveryDays: String(s.deliveryDays), team: s.team, active: String(s.active) }); setEditing(row.id); setShow(true); }}><Edit2 size={16} /></Button>
        <Button variant="danger" size="sm" onClick={() => del(row.id)}><Trash2 size={16} /></Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Service catalogue with variants, attributes and configuration."
        action={<Button onClick={() => { setForm({ code: '', name: '', categoryId: '', serviceType: 'standard', summary: '', description: '', basePrice: '', baseCost: '', currency: 'USD', deliveryDays: '', team: 'General', active: 'true' }); setEditing(null); setShow(true); }}><Plus size={16} /> New Service</Button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-500" size={16} />
          <input className="input-base pl-9" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <Button variant="secondary" onClick={load}>Search</Button>
        <ViewSwitcher value={view} onChange={setView} options={['card', 'list', 'table', 'gallery']} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : services.length === 0 ? (
        <EmptyState title="No services found" description="Add a service to start building your catalogue." icon={Package} />
      ) : (
        <>
          {view === 'card' && (
            <CardGridView
              items={services}
              renderCard={(s) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{s.name}</p>
                      <Badge color={s.active ? 'emerald' : 'rose'}>{s.active ? 'Active' : 'Archived'}</Badge>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{s.currency} {s.basePrice}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.code} • {s.categoryName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{s.summary}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>{s.serviceType}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="secondary" size="sm" onClick={() => { setForm({ code: s.code, name: s.name, categoryId: String(s.categoryId), serviceType: s.serviceType, summary: s.summary, description: s.description, basePrice: String(s.basePrice), baseCost: String(s.baseCost), currency: s.currency, deliveryDays: String(s.deliveryDays), team: s.team, active: String(s.active) }); setEditing(s.id); setShow(true); }}><Edit2 size={14} /></Button>
                      <Button variant="danger" size="sm" onClick={() => del(s.id)}><Trash2 size={14} /></Button>
                    </div>
                  </div>
                  <Link href={`/services/${s.id}`} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View service →</Link>
                </div>
              )}
              emptyTitle="No services found"
              emptyDescription="Add a service to start building your catalogue."
            />
          )}

          {view === 'list' && (
            <ListView
              items={services}
              renderItem={(s) => (
                <ListItem
                  key={s.id}
                  trailing={<span className="font-semibold text-slate-900 dark:text-slate-100">{s.currency} {s.basePrice}</span>}
                  badge={<Badge color={s.active ? 'emerald' : 'rose'}>{s.active ? 'Active' : 'Archived'}</Badge>}
                  onClick={() => { window.location.href = `/services/${s.id}`; }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{s.name}</p>
                      <Badge color="default">{s.serviceType}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.code} • {s.categoryName}</p>
                  </div>
                </ListItem>
              )}
              emptyTitle="No services found"
              emptyDescription="Add a service to start building your catalogue."
            />
          )}

          {view === 'table' && (
            <DataTable columns={columns} data={services} onRowClick={(s) => { window.location.href = `/services/${s.id}`; }} />
          )}

          {view === 'gallery' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {services.map((s: any) => (
                <Link key={s.id} href={`/services/${s.id}`}>
                  <div className="glass-card rounded-xl border p-4 flex h-full flex-col items-center gap-2 text-center transition hover:border-indigo-600/40">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400">
                      <Package size={24} />
                    </div>
                    <p className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{s.currency} {s.basePrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Service' : 'Create Service'} description={editing ? 'Update service details.' : 'Add a new service to the catalogue.'}>
        <div className="space-y-4">
          <FormSection title="Service details">
<FormGrid cols={4}>
              <Field label="Code" required>
                <TextInput id="svc-code" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
              </Field>
              <Field label="Name" required>
                <TextInput id="svc-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Category">
                <Select id="svc-category" value={form.categoryId} onChange={value => setForm({ ...form, categoryId: value })}>
                  <option value="">Select category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Service Type">
                <Select id="svc-type" value={form.serviceType} onChange={value => setForm({ ...form, serviceType: value })}>
                  <option value="standard">Standard</option>
                  <option value="project">Project</option>
                  <option value="managed_service">Managed Service</option>
                  <option value="support">Support</option>
                  <option value="subscription">Subscription</option>
                </Select>
              </Field>
              <Field label="Currency">
                <Select id="svc-currency" value={form.currency} onChange={value => setForm({ ...form, currency: value })}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                  <option value="AED">AED</option>
                </Select>
              </Field>
              <Field label="Base Price">
                <TextInput id="svc-basePrice" type="number" placeholder="0" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} />
              </Field>
              <Field label="Base Cost">
                <TextInput id="svc-baseCost" type="number" placeholder="0" value={form.baseCost} onChange={e => setForm({ ...form, baseCost: e.target.value })} />
              </Field>
              <Field label="Delivery Days">
                <TextInput id="svc-deliveryDays" type="number" placeholder="5" value={form.deliveryDays} onChange={e => setForm({ ...form, deliveryDays: e.target.value })} />
              </Field>
              <Field label="Team">
                <TextInput id="svc-team" placeholder="General" value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} />
              </Field>
              <Field label="Active">
                <Select id="svc-active" value={form.active} onChange={value => setForm({ ...form, active: value })}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </Field>
            </FormGrid>
          </FormSection>
          <Field label="Summary">
            <TextInput id="svc-summary" placeholder="Summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
          </Field>
          <Field label="Description">
            <TextArea id="svc-description" rows={3} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </Field>
          <FormFooter>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={editing ? () => update(editing!) : create}>{editing ? 'Save Changes' : 'Create Service'}</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}