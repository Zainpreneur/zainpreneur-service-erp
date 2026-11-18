'use client';
import { useCallback, useEffect, useState } from 'react';
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
import { Pagination } from '@/components/ui/Pagination';
import { Field, FormSection, FormFooter, TextInput, TextArea, Select, FormGrid } from '@/components/ui/Form';
import { FileText, Plus, Search, Trash2, Edit2 } from 'lucide-react';

const STATUSES = ['draft', 'new', 'in_progress', 'completed', 'cancelled'];
const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('table');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [form, setForm] = useState({
    businessId: '', serviceId: '', title: '', description: '', priority: 'normal',
    status: 'draft', contactName: '', contactEmail: '', contactRole: '', requestedBy: '',
    specialRequirements: '', requiredDate: '', basePrice: '0', variantPrice: '0',
    attributeExtras: '0', configurationCharges: '0', additionalServices: '0',
    discountType: '', discountValue: '0', discountAmount: '0', totalAmount: '0',
    finalAmount: '0', currency: 'USD', deployment: '', deliverySummary: '',
    scopeMode: 'single', preferredWindow: '',
  });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    fetch(`/api/requests?${params}`)
      .then(r => r.json())
      .then(d => { setRequests(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, status]);

  useEffect(() => {
    load();
    fetch('/api/businesses').then(r => r.json()).then((d) => setBusinesses(Array.isArray(d) ? d : []));
    fetch('/api/services').then(r => r.json()).then((d) => setServices(Array.isArray(d) ? d : []));
  }, [load]);

  const filtered = status ? requests.filter((r) => r.status === status) : requests;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { id: 'reference', header: 'Reference', cell: ({ value, row }) => <Link href={`/requests/${row.id}`} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{value}</Link> },
    { id: 'title', header: 'Title', cell: ({ value }) => <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{value}</div> },
    { id: 'businessName', header: 'Business', cell: ({ value }) => <span className="text-slate-600 dark:text-slate-400">{value}</span> },
    { id: 'status', header: 'Status', cell: ({ value }) => <Badge color={value === 'completed' ? 'success' : value === 'in_progress' ? 'cyan' : 'default'}>{value}</Badge> },
    { id: 'priority', header: 'Priority', cell: ({ value }) => <Badge color={value === 'urgent' || value === 'high' ? 'danger' : 'default'}>{value}</Badge> },
    { id: 'totalAmount', header: 'Amount', cell: ({ value, row }) => <span className="text-right font-semibold text-slate-900 dark:text-slate-100">{row.currency} {value}</span> },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => { const r = row.original; setForm({ businessId: String(r.businessId), serviceId: String(r.serviceId), title: r.title, description: r.description || '', priority: r.priority, status: r.status, contactName: r.contactName || '', contactEmail: r.contactEmail || '', contactRole: r.contactRole || '', requestedBy: r.requestedBy || '', specialRequirements: r.specialRequirements || '', requiredDate: r.requiredDate || '', basePrice: String(r.basePrice || 0), variantPrice: String(r.variantPrice || 0), attributeExtras: String(r.attributeExtras || 0), configurationCharges: String(r.configurationCharges || 0), additionalServices: String(r.additionalServices || 0), discountType: r.discountType || '', discountValue: String(r.discountValue || 0), discountAmount: String(r.discountAmount || 0), totalAmount: String(r.totalAmount || 0), finalAmount: String(r.finalAmount || 0), currency: r.currency, deployment: r.deployment || '', deliverySummary: r.deliverySummary || '', scopeMode: r.scopeMode || 'single', preferredWindow: r.preferredWindow || '' }); setEditing(r.id); setShow(true); }}><Edit2 size={16} /></Button>
        <Button variant="danger" size="sm" onClick={() => { if (window.confirm('Delete this request?')) { fetch(`/api/requests/${row.id}`, { method: 'DELETE' }).then(() => load()); } }}><Trash2 size={16} /></Button>
      </div>
    ) },
  ];

  const create = async () => {
    await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, businessId: Number(form.businessId), serviceId: Number(form.serviceId), basePrice: Number(form.basePrice) || 0, variantPrice: Number(form.variantPrice) || 0, attributeExtras: Number(form.attributeExtras) || 0, configurationCharges: Number(form.configurationCharges) || 0, additionalServices: Number(form.additionalServices) || 0, discountValue: Number(form.discountValue) || 0, discountAmount: Number(form.discountAmount) || 0, totalAmount: Number(form.totalAmount) || 0, finalAmount: Number(form.finalAmount) || 0 }) });
    setForm({ businessId: '', serviceId: '', title: '', description: '', priority: 'normal', status: 'draft', contactName: '', contactEmail: '', contactRole: '', requestedBy: '', specialRequirements: '', requiredDate: '', basePrice: '0', variantPrice: '0', attributeExtras: '0', configurationCharges: '0', additionalServices: '0', discountType: '', discountValue: '0', discountAmount: '0', totalAmount: '0', finalAmount: '0', currency: 'USD', deployment: '', deliverySummary: '', scopeMode: 'single', preferredWindow: '' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/requests/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, businessId: Number(form.businessId), serviceId: Number(form.serviceId), basePrice: Number(form.basePrice) || 0, variantPrice: Number(form.variantPrice) || 0, attributeExtras: Number(form.attributeExtras) || 0, configurationCharges: Number(form.configurationCharges) || 0, additionalServices: Number(form.additionalServices) || 0, discountValue: Number(form.discountValue) || 0, discountAmount: Number(form.discountAmount) || 0, totalAmount: Number(form.totalAmount) || 0, finalAmount: Number(form.finalAmount) || 0 }) });
    setEditing(null);
    setShow(false);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this request?')) return;
    await fetch(`/api/requests/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Requests"
        description="Track and manage service requests across businesses."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Requests', href: '/requests' }]}
        action={<Button onClick={() => { setForm({ businessId: '', serviceId: '', title: '', description: '', priority: 'normal', status: 'draft', contactName: '', contactEmail: '', contactRole: '', requestedBy: '', specialRequirements: '', requiredDate: '', basePrice: '0', variantPrice: '0', attributeExtras: '0', configurationCharges: '0', additionalServices: '0', discountType: '', discountValue: '0', discountAmount: '0', totalAmount: '0', finalAmount: '0', currency: 'USD', deployment: '', deliverySummary: '', scopeMode: 'single', preferredWindow: '' }); setEditing(null); setShow(true); }}><Plus size={16} /> New Request</Button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-500" size={16} />
          <input className="input-base pl-9" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <select className="input-base" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <Button variant="secondary" onClick={load}>Filter</Button>
        <ViewSwitcher value={view} onChange={setView} options={['table', 'list', 'card', 'board']} />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No requests found" description="Try adjusting filters or create a new request." icon={FileText} />
      ) : (
        <>
          {view === 'table' && (
            <>
              <DataTable columns={columns} data={paginated} onRowClick={(r) => { window.location.href = `/requests/${r.id}`; }} />
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </>
          )}

          {view === 'list' && (
            <ListView
              items={filtered}
              renderItem={(r) => (
                <ListItem
                  key={r.id}
                  leading={<div className="h-10 w-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><FileText size={20} /></div>}
                  trailing={<span className="font-semibold text-slate-900 dark:text-slate-100">{r.currency} {r.totalAmount}</span>}
                  badge={<Badge color={r.status === 'completed' ? 'emerald' : r.status === 'in_progress' ? 'cyan' : 'default'}>{r.status}</Badge>}
                  onClick={() => { window.location.href = `/requests/${r.id}`; }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{r.title}</p>
                      <Badge color={r.priority === 'urgent' || r.priority === 'high' ? 'danger' : 'default'}>{r.priority}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{r.reference} • {r.businessName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setForm({ businessId: String(r.businessId), serviceId: String(r.serviceId), title: r.title, description: r.description || '', priority: r.priority, status: r.status, contactName: r.contactName || '', contactEmail: r.contactEmail || '', contactRole: r.contactRole || '', requestedBy: r.requestedBy || '', specialRequirements: r.specialRequirements || '', requiredDate: r.requiredDate || '', basePrice: String(r.basePrice || 0), variantPrice: String(r.variantPrice || 0), attributeExtras: String(r.attributeExtras || 0), configurationCharges: String(r.configurationCharges || 0), additionalServices: String(r.additionalServices || 0), discountType: r.discountType || '', discountValue: String(r.discountValue || 0), discountAmount: String(r.discountAmount || 0), totalAmount: String(r.totalAmount || 0), finalAmount: String(r.finalAmount || 0), currency: r.currency, deployment: r.deployment || '', deliverySummary: r.deliverySummary || '', scopeMode: r.scopeMode || 'single', preferredWindow: r.preferredWindow || '' }); setEditing(r.id); setShow(true); }}><Edit2 size={16} /></Button>
                    <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); del(r.id); }}><Trash2 size={16} /></Button>
                  </div>
                </ListItem>
              )}
              emptyTitle="No requests found"
              emptyDescription="Try adjusting filters or create a new request."
            />
          )}

          {view === 'card' && (
            <CardGridView
              items={filtered}
              renderCard={(r) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{r.title}</p>
                      <Badge color={r.status === 'completed' ? 'emerald' : r.status === 'in_progress' ? 'cyan' : 'default'}>{r.status}</Badge>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{r.currency} {r.totalAmount}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.reference} • {r.businessName}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setForm({ businessId: String(r.businessId), serviceId: String(r.serviceId), title: r.title, description: r.description || '', priority: r.priority, status: r.status, contactName: r.contactName || '', contactEmail: r.contactEmail || '', contactRole: r.contactRole || '', requestedBy: r.requestedBy || '', specialRequirements: r.specialRequirements || '', requiredDate: r.requiredDate || '', basePrice: String(r.basePrice || 0), variantPrice: String(r.variantPrice || 0), attributeExtras: String(r.attributeExtras || 0), configurationCharges: String(r.configurationCharges || 0), additionalServices: String(r.additionalServices || 0), discountType: r.discountType || '', discountValue: String(r.discountValue || 0), discountAmount: String(r.discountAmount || 0), totalAmount: String(r.totalAmount || 0), finalAmount: String(r.finalAmount || 0), currency: r.currency, deployment: r.deployment || '', deliverySummary: r.deliverySummary || '', scopeMode: r.scopeMode || 'single', preferredWindow: r.preferredWindow || '' }); setEditing(r.id); setShow(true); }}><Edit2 size={14} /></Button>
                    <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); del(r.id); }}><Trash2 size={14} /></Button>
                    <Link href={`/requests/${r.id}`} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline ml-auto">View →</Link>
                  </div>
                </div>
              )}
              emptyTitle="No requests found"
              emptyDescription="Try adjusting filters or create a new request."
            />
          )}

          {view === 'board' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((st) => {
                const items = requests.filter((r) => r.status === st);
                return (
                  <div key={st} className="min-w-[260px] flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">{st.replace('_', ' ')}</h3>
                      <Badge color="default">{items.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {items.map((r: any) => (
                        <div key={r.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition hover:border-indigo-600/40">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{r.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{r.reference}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge color={r.priority === 'urgent' || r.priority === 'high' ? 'danger' : 'default'}>{r.priority}</Badge>
                            <div className="flex items-center gap-1">
                              <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setForm({ businessId: String(r.businessId), serviceId: String(r.serviceId), title: r.title, description: r.description || '', priority: r.priority, status: r.status, contactName: r.contactName || '', contactEmail: r.contactEmail || '', contactRole: r.contactRole || '', requestedBy: r.requestedBy || '', specialRequirements: r.specialRequirements || '', requiredDate: r.requiredDate || '', basePrice: String(r.basePrice || 0), variantPrice: String(r.variantPrice || 0), attributeExtras: String(r.attributeExtras || 0), configurationCharges: String(r.configurationCharges || 0), additionalServices: String(r.additionalServices || 0), discountType: r.discountType || '', discountValue: String(r.discountValue || 0), discountAmount: String(r.discountAmount || 0), totalAmount: String(r.totalAmount || 0), finalAmount: String(r.finalAmount || 0), currency: r.currency, deployment: r.deployment || '', deliverySummary: r.deliverySummary || '', scopeMode: r.scopeMode || 'single', preferredWindow: r.preferredWindow || '' }); setEditing(r.id); setShow(true); }}><Edit2 size={14} /></Button>
                              <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); del(r.id); }}><Trash2 size={14} /></Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {items.length === 0 && <p className="py-4 text-center text-xs text-slate-500 dark:text-slate-500">No items</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Request' : 'Create Request'} description={editing ? 'Update request details.' : 'Add a new service request.'}>
        <div className="space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); editing ? update(editing!) : create(); }}>
            <div className="space-y-5">
              <FormSection title="Request details">
                <FormGrid cols={4}>
                  <Field label="Business" required>
                    <Select id="req-business" value={form.businessId} onChange={value => setForm({ ...form, businessId: value })}>
                      <option value="">Select business</option>
                      {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select>
                  </Field>
                  <Field label="Service" required>
                    <Select id="req-service" value={form.serviceId} onChange={value => setForm({ ...form, serviceId: value })}>
                      <option value="">Select service</option>
                      {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                  </Field>
                  <Field label="Title" required>
                    <TextInput id="req-title" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </Field>
                  <Field label="Status">
                    <Select id="req-status" value={form.status} onChange={value => setForm({ ...form, status: value })}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </Select>
                  </Field>
                  <Field label="Priority">
                    <Select id="req-priority" value={form.priority} onChange={value => setForm({ ...form, priority: value })}>
                      {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </Select>
                  </Field>
                  <Field label="Requested By">
                    <TextInput id="req-requestedBy" placeholder="Requested by" value={form.requestedBy} onChange={e => setForm({ ...form, requestedBy: e.target.value })} />
                  </Field>
                  <Field label="Required Date" type="date">
                    <TextInput id="req-requiredDate" type="date" value={form.requiredDate} onChange={e => setForm({ ...form, requiredDate: e.target.value })} />
                  </Field>
                  <Field label="Deployment">
                    <TextInput id="req-deployment" placeholder="Deployment" value={form.deployment} onChange={e => setForm({ ...form, deployment: e.target.value })} />
                  </Field>
                  <Field label="Scope Mode">
                    <Select id="req-scopeMode" value={form.scopeMode} onChange={value => setForm({ ...form, scopeMode: value })}>
                      <option value="single">Single</option>
                      <option value="multi">Multi</option>
                    </Select>
                  </Field>
                  <Field label="Preferred Window">
                    <TextInput id="req-preferredWindow" placeholder="Preferred window" value={form.preferredWindow} onChange={e => setForm({ ...form, preferredWindow: e.target.value })} />
                  </Field>
                </FormGrid>
              </FormSection>

              <FormSection title="Contact">
                <FormGrid cols={4}>
                  <Field label="Contact Name">
                    <TextInput id="req-contactName" placeholder="Contact name" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
                  </Field>
                  <Field label="Contact Role">
                    <TextInput id="req-contactRole" placeholder="Role" value={form.contactRole} onChange={e => setForm({ ...form, contactRole: e.target.value })} />
                  </Field>
                  <Field label="Contact Email" type="email">
                    <TextInput id="req-contactEmail" type="email" placeholder="Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
                  </Field>
                  <Field label="Contact Phone" type="tel">
                    <TextInput id="req-contactPhone" type="tel" placeholder="Phone" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
                  </Field>
                </FormGrid>
              </FormSection>

              <FormSection title="Description & Requirements">
                <Field label="Description">
                  <TextArea id="req-description" rows={4} placeholder="Describe the service request..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </Field>
                <Field label="Special Requirements">
                  <TextArea id="req-specialRequirements" rows={3} placeholder="Special requirements..." value={form.specialRequirements} onChange={e => setForm({ ...form, specialRequirements: e.target.value })} />
                </Field>
              </FormSection>

              <FormSection title="Pricing">
                <FormGrid cols={4}>
                  <Field label="Base Price">
                    <TextInput id="req-basePrice" type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} />
                  </Field>
                  <Field label="Variant Price">
                    <TextInput id="req-variantPrice" type="number" value={form.variantPrice} onChange={e => setForm({ ...form, variantPrice: e.target.value })} />
                  </Field>
                  <Field label="Attribute Extras">
                    <TextInput id="req-attributeExtras" type="number" value={form.attributeExtras} onChange={e => setForm({ ...form, attributeExtras: e.target.value })} />
                  </Field>
                  <Field label="Configuration Charges">
                    <TextInput id="req-configurationCharges" type="number" value={form.configurationCharges} onChange={e => setForm({ ...form, configurationCharges: e.target.value })} />
                  </Field>
                  <Field label="Additional Services">
                    <TextInput id="req-additionalServices" type="number" value={form.additionalServices} onChange={e => setForm({ ...form, additionalServices: e.target.value })} />
                  </Field>
                  <Field label="Discount Type">
                    <Select id="req-discountType" value={form.discountType} onChange={value => setForm({ ...form, discountType: value })}>
                      <option value="">None</option>
                      <option value="percent">Percent</option>
                      <option value="fixed">Fixed</option>
                    </Select>
                  </Field>
                  <Field label="Discount Value">
                    <TextInput id="req-discountValue" type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} />
                  </Field>
                  <Field label="Discount Amount">
                    <TextInput id="req-discountAmount" type="number" value={form.discountAmount} onChange={e => setForm({ ...form, discountAmount: e.target.value })} />
                  </Field>
                  <Field label="Total Amount">
                    <TextInput id="req-totalAmount" type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} />
                  </Field>
                  <Field label="Final Amount">
                    <TextInput id="req-finalAmount" type="number" value={form.finalAmount} onChange={e => setForm({ ...form, finalAmount: e.target.value })} />
                  </Field>
                  <Field label="Currency">
                    <Select id="req-currency" value={form.currency} onChange={value => setForm({ ...form, currency: value })}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="SAR">SAR</option>
                      <option value="AED">AED</option>
                    </Select>
                  </Field>
                </FormGrid>
              </FormSection>
            </div>
            <FormFooter>
              <Button variant="secondary" type="button" onClick={() => setShow(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save Changes' : 'Create Request'}</Button>
            </FormFooter>
          </form>
        </div>
      </Modal>
    </div>
  );
}