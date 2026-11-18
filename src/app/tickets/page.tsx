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
import { Ticket, Plus, Search, Trash2, Edit2 } from 'lucide-react';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('table');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [form, setForm] = useState({
    businessId: '', serviceId: '', serviceRequestId: '', variantId: '',
    title: '', description: '', type: 'question', category: 'general', priority: 'normal',
    status: 'new', assignedTeam: '', contactName: '', contactEmail: '', contactPhone: '',
    contactRole: '', slaDueAt: '',
  });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    fetch(`/api/tickets?${params}`)
      .then(r => r.json())
      .then(d => { setTickets(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, status]);

  useEffect(() => {
    load();
    fetch('/api/businesses').then(r => r.json()).then((d) => setBusinesses(Array.isArray(d) ? d : []));
    fetch('/api/services').then(r => r.json()).then((d) => setServices(Array.isArray(d) ? d : []));
    fetch('/api/requests').then(r => r.json()).then((d) => setRequests(Array.isArray(d) ? d : []));
  }, [load]);

  const filtered = status ? tickets.filter((t) => t.status === status) : tickets;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { id: 'reference', header: 'Reference', cell: ({ value }) => <span className="text-indigo-600 dark:text-indigo-400 font-medium">{value}</span> },
    { id: 'title', header: 'Title', cell: ({ value }) => <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{value}</div> },
    { id: 'businessName', header: 'Business', cell: ({ value }) => <span className="text-slate-600 dark:text-slate-400">{value}</span> },
    { id: 'type', header: 'Type', cell: ({ value }) => <span className="text-slate-600 dark:text-slate-400 text-sm">{value}</span> },
    { id: 'status', header: 'Status', cell: ({ value }) => <Badge color={value === 'resolved' || value === 'closed' ? 'success' : value === 'in_progress' ? 'cyan' : 'warning'}>{value}</Badge> },
    { id: 'priority', header: 'Priority', cell: ({ value }) => <Badge color={value === 'urgent' ? 'danger' : 'default'}>{value}</Badge> },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => { const t = row.original; setForm({ businessId: String(t.businessId), serviceId: String(t.serviceId || ''), serviceRequestId: String(t.serviceRequestId || ''), variantId: String(t.variantId || ''), title: t.title, description: t.description || '', type: t.type, category: t.category, priority: t.priority, status: t.status, assignedTeam: t.assignedTeam || '', contactName: t.contactName || '', contactEmail: t.contactEmail || '', contactPhone: t.contactPhone || '', contactRole: t.contactRole || '', slaDueAt: t.slaDueAt || '' }); setEditing(t.id); setShow(true); }}><Edit2 size={16} /></Button>
        <Button variant="danger" size="sm" onClick={() => { if (window.confirm('Delete this ticket?')) { fetch(`/api/tickets/${row.id}`, { method: 'DELETE' }).then(() => load()); } }}><Trash2 size={16} /></Button>
      </div>
    ) },
  ];

  const create = async () => {
    await fetch('/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, businessId: Number(form.businessId), serviceId: form.serviceId ? Number(form.serviceId) : null, serviceRequestId: form.serviceRequestId ? Number(form.serviceRequestId) : null, variantId: form.variantId ? Number(form.variantId) : null }) });
    setForm({ businessId: '', serviceId: '', serviceRequestId: '', variantId: '', title: '', description: '', type: 'question', category: 'general', priority: 'normal', status: 'new', assignedTeam: '', contactName: '', contactEmail: '', contactPhone: '', contactRole: '', slaDueAt: '' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/tickets/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, businessId: Number(form.businessId), serviceId: form.serviceId ? Number(form.serviceId) : null, serviceRequestId: form.serviceRequestId ? Number(form.serviceRequestId) : null, variantId: form.variantId ? Number(form.variantId) : null }) });
    setEditing(null);
    setShow(false);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this ticket?')) return;
    await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help Desk Tickets"
        description="Track support conversations, SLA and resolution."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Tickets', href: '/tickets' }]}
        action={<Button onClick={() => { setForm({ businessId: '', serviceId: '', serviceRequestId: '', variantId: '', title: '', description: '', type: 'question', category: 'general', priority: 'normal', status: 'new', assignedTeam: '', contactName: '', contactEmail: '', contactPhone: '', contactRole: '', slaDueAt: '' }); setEditing(null); setShow(true); }}><Plus size={16} /> New Ticket</Button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-500" size={16} />
          <input className="input-base pl-9" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <select className="input-base" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <Button variant="secondary" onClick={load}>Filter</Button>
        <ViewSwitcher value={view} onChange={setView} options={['table', 'list', 'card', 'board']} />
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No tickets found" description="Create a ticket to start tracking support." icon={Ticket} />
      ) : (
        <>
          {view === 'table' && (
            <>
              <DataTable columns={columns} data={paginated} onRowClick={(t) => { window.location.href = `/tickets/${t.id}`; }} />
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </>
          )}

          {view === 'list' && (
            <ListView
              items={filtered}
              renderItem={(t) => (
                <ListItem
                  key={t.id}
                  leading={<div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"><Ticket size={20} /></div>}
                  trailing={<Badge color={t.priority === 'urgent' ? 'danger' : 'default'}>{t.priority}</Badge>}
                  badge={<Badge color={t.status === 'resolved' || t.status === 'closed' ? 'success' : t.status === 'in_progress' ? 'cyan' : 'warning'}>{t.status}</Badge>}
                  onClick={() => { window.location.href = `/tickets/${t.id}`; }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{t.title}</p>
                      <Badge color={t.type === 'incident' ? 'danger' : 'default'}>{t.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.reference} • {t.businessName} • {t.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setForm({ businessId: String(t.businessId), serviceId: String(t.serviceId || ''), serviceRequestId: String(t.serviceRequestId || ''), variantId: String(t.variantId || ''), title: t.title, description: t.description || '', type: t.type, category: t.category, priority: t.priority, status: t.status, assignedTeam: t.assignedTeam || '', contactName: t.contactName || '', contactEmail: t.contactEmail || '', contactPhone: t.contactPhone || '', contactRole: t.contactRole || '', slaDueAt: t.slaDueAt || '' }); setEditing(t.id); setShow(true); }}><Edit2 size={16} /></Button>
                    <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); del(t.id); }}><Trash2 size={16} /></Button>
                  </div>
                </ListItem>
              )}
              emptyTitle="No tickets found"
              emptyDescription="Create a ticket to start tracking support."
            />
          )}

          {view === 'card' && (
            <CardGridView
              items={filtered}
              renderCard={(t) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{t.title}</p>
                      <Badge color={t.priority === 'urgent' ? 'danger' : 'default'}>{t.priority}</Badge>
                    </div>
                    <Badge color={t.status === 'resolved' || t.status === 'closed' ? 'success' : t.status === 'in_progress' ? 'cyan' : 'warning'}>{t.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.reference} • {t.businessName}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>{t.type}</span> / <span>{t.category}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setForm({ businessId: String(t.businessId), serviceId: String(t.serviceId || ''), serviceRequestId: String(t.serviceRequestId || ''), variantId: String(t.variantId || ''), title: t.title, description: t.description || '', type: t.type, category: t.category, priority: t.priority, status: t.status, assignedTeam: t.assignedTeam || '', contactName: t.contactName || '', contactEmail: t.contactEmail || '', contactPhone: t.contactPhone || '', contactRole: t.contactRole || '', slaDueAt: t.slaDueAt || '' }); setEditing(t.id); setShow(true); }}><Edit2 size={14} /></Button>
                    <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); del(t.id); }}><Trash2 size={14} /></Button>
                    <Link href={`/tickets/${t.id}`} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline ml-auto">View →</Link>
                  </div>
                </div>
              )}
              emptyTitle="No tickets found"
              emptyDescription="Create a ticket to start tracking support."
            />
          )}

          {view === 'board' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((st) => {
                const items = tickets.filter((t) => t.status === st);
                return (
                  <div key={st} className="min-w-[260px] flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">{st.replace('_', ' ')}</h3>
                      <Badge color="default">{items.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {items.map((t: any) => (
                        <div key={t.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition hover:border-indigo-600/40">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{t.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{t.reference}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge color={t.priority === 'urgent' ? 'danger' : 'default'}>{t.priority}</Badge>
                            <div className="flex items-center gap-1">
                              <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setForm({ businessId: String(t.businessId), serviceId: String(t.serviceId || ''), serviceRequestId: String(t.serviceRequestId || ''), variantId: String(t.variantId || ''), title: t.title, description: t.description || '', type: t.type, category: t.category, priority: t.priority, status: t.status, assignedTeam: t.assignedTeam || '', contactName: t.contactName || '', contactEmail: t.contactEmail || '', contactPhone: t.contactPhone || '', contactRole: t.contactRole || '', slaDueAt: t.slaDueAt || '' }); setEditing(t.id); setShow(true); }}><Edit2 size={14} /></Button>
                              <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); del(t.id); }}><Trash2 size={14} /></Button>
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

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Ticket' : 'Create Ticket'} description={editing ? 'Update ticket details.' : 'Add a new help desk ticket.'}>
        <div className="space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); editing ? update(editing!) : create(); }}>
            <div className="space-y-5">
              <FormSection title="Ticket details">
                <FormGrid cols={4}>
                  <Field label="Business" required>
                    <Select id="tk-business" value={form.businessId} onChange={value => setForm({ ...form, businessId: value })}>
                      <option value="">Select business</option>
                      {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select>
                  </Field>
                  <Field label="Service (optional)">
                    <Select id="tk-service" value={form.serviceId} onChange={value => setForm({ ...form, serviceId: value })}>
                      <option value="">None</option>
                      {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                  </Field>
                  <Field label="Linked Request (optional)">
                    <Select id="tk-request" value={form.serviceRequestId} onChange={value => setForm({ ...form, serviceRequestId: value })}>
                      <option value="">None</option>
                      {requests.map((r: any) => <option key={r.id} value={r.id}>{r.reference} - {r.title}</option>)}
                    </Select>
                  </Field>
                  <Field label="Title" required>
                    <TextInput id="tk-title" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </Field>
                  <Field label="Type">
                    <Select id="tk-type" value={form.type} onChange={value => setForm({ ...form, type: value })}>
                      <option value="question">Question</option>
                      <option value="incident">Incident</option>
                      <option value="problem">Problem</option>
                      <option value="task">Task</option>
                    </Select>
                  </Field>
                  <Field label="Category">
                    <TextInput id="tk-category" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  </Field>
                  <Field label="Priority">
                    <Select id="tk-priority" value={form.priority} onChange={value => setForm({ ...form, priority: value })}>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </Field>
                  <Field label="Status">
                    <Select id="tk-status" value={form.status} onChange={value => setForm({ ...form, status: value })}>
                      <option value="new">New</option>
                      <option value="open">Open</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting">Waiting</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </Select>
                  </Field>
                </FormGrid>
              </FormSection>

              <FormSection title="Contact">
                <FormGrid cols={4}>
                  <Field label="Contact Name">
                    <TextInput id="tk-contactName" placeholder="Contact name" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
                  </Field>
                  <Field label="Contact Role">
                    <TextInput id="tk-contactRole" placeholder="Role" value={form.contactRole} onChange={e => setForm({ ...form, contactRole: e.target.value })} />
                  </Field>
                  <Field label="Contact Email" type="email">
                    <TextInput id="tk-contactEmail" type="email" placeholder="Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
                  </Field>
                  <Field label="Contact Phone" type="tel">
                    <TextInput id="tk-contactPhone" type="tel" placeholder="Phone" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
                  </Field>
                  <Field label="Assigned Team">
                    <TextInput id="tk-assignedTeam" placeholder="Team" value={form.assignedTeam} onChange={e => setForm({ ...form, assignedTeam: e.target.value })} />
                  </Field>
                  <Field label="SLA Due At" type="datetime-local">
                    <TextInput id="tk-slaDueAt" type="datetime-local" value={form.slaDueAt} onChange={e => setForm({ ...form, slaDueAt: e.target.value })} />
                  </Field>
                </FormGrid>
              </FormSection>

              <FormSection title="Description">
                <Field label="Description">
                  <TextArea id="tk-description" rows={4} placeholder="Describe the issue..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </Field>
              </FormSection>
            </div>
            <FormFooter>
              <Button variant="secondary" type="button" onClick={() => setShow(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save Changes' : 'Create Ticket'}</Button>
            </FormFooter>
          </form>
        </div>
      </Modal>
    </div>
  );
}