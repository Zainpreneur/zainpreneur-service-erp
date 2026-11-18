'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Field, FormSection, FormFooter, TextInput, Select, FormGrid } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { Plus, Trash2, Edit2, Users } from 'lucide-react';

export default function PeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '', code: '', email: '', phone: '', team: '', role: '', discipline: '',
    classification: 'internal', employmentType: 'full_time', compensationModel: 'hourly',
    resourceStatus: 'active', hourlyRate: '', weeklyHours: '40', overtimeMultiplier: '1.5',
  });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => fetch('/api/people').then(r => r.json()).then((d) => setPeople(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/people', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : 0, weeklyHours: form.weeklyHours ? Number(form.weeklyHours) : 40, overtimeMultiplier: form.overtimeMultiplier ? Number(form.overtimeMultiplier) : 1.5 }) });
    setForm({ name: '', code: '', email: '', phone: '', team: '', role: '', discipline: '', classification: 'internal', employmentType: 'full_time', compensationModel: 'hourly', resourceStatus: 'active', hourlyRate: '', weeklyHours: '40', overtimeMultiplier: '1.5' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/people/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : 0, weeklyHours: form.weeklyHours ? Number(form.weeklyHours) : 40, overtimeMultiplier: form.overtimeMultiplier ? Number(form.overtimeMultiplier) : 1.5 }) });
    setEditing(null);
    setShow(false);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this person?')) return;
    await fetch(`/api/people/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="People"
        description="Staff and assignees."
        action={<Button onClick={() => { setForm({ name: '', code: '', email: '', phone: '', team: '', role: '', discipline: '', classification: 'internal', employmentType: 'full_time', compensationModel: 'hourly', resourceStatus: 'active', hourlyRate: '', weeklyHours: '40', overtimeMultiplier: '1.5' }); setEditing(null); setShow(true); }}><Plus size={16} /> New Person</Button>}
      />

      {people.length === 0 ? (
        <EmptyState title="No people yet" description="Add staff and assignees." icon={Users} />
      ) : (
        <ListView
          items={people}
          renderItem={(p) => (
            <ListItem
              key={p.id}
              leading={<div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"><Users size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Badge color={p.isActive ? 'success' : 'danger'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => { setForm({ name: p.name, code: p.code || '', email: p.email || '', phone: p.phone || '', team: p.team || '', role: p.role || '', discipline: p.discipline || '', classification: p.classification || 'internal', employmentType: p.employmentType || 'full_time', compensationModel: p.compensationModel || 'hourly', resourceStatus: p.resourceStatus || 'active', hourlyRate: String(p.hourlyRate || ''), weeklyHours: String(p.weeklyHours || ''), overtimeMultiplier: String(p.overtimeMultiplier || '') }); setEditing(p.id); setShow(true); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => del(p.id)}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{p.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{p.role || '—'} • {p.team || '—'}</div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-600 dark:text-slate-400">{p.email || '—'}</div>
                <div className="text-slate-500 dark:text-slate-500">{p.discipline || '—'}</div>
              </div>
            </ListItem>
          )}
          emptyTitle="No people yet"
          emptyDescription="Add staff and assignees."
        />
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Person' : 'Create Person'} description={editing ? 'Update staff details.' : 'Add a new staff member.'}>
        <div className="space-y-4">
          <FormSection title="Personal">
            <FormGrid cols={2}>
              <Field label="Name" required>
                <TextInput id="p-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Code">
                <TextInput id="p-code" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
              </Field>
              <Field label="Email" type="email">
                <TextInput id="p-email" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Phone" type="tel">
                <TextInput id="p-phone" type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </Field>
              <Field label="Team">
                <TextInput id="p-team" placeholder="Team" value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} />
              </Field>
              <Field label="Role">
                <TextInput id="p-role" placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              </Field>
              <Field label="Discipline">
                <TextInput id="p-discipline" placeholder="Discipline" value={form.discipline} onChange={e => setForm({ ...form, discipline: e.target.value })} />
              </Field>
            </FormGrid>
          </FormSection>

          <FormSection title="Workforce">
            <FormGrid cols={2}>
              <Field label="Classification">
                <Select id="p-classification" value={form.classification} onChange={value => setForm({ ...form, classification: value })}>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </Select>
              </Field>
              <Field label="Employment Type">
                <Select id="p-employmentType" value={form.employmentType} onChange={value => setForm({ ...form, employmentType: value })}>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="independent_contractor">Independent Contractor</option>
                  <option value="agency_partner">Agency Partner</option>
                  <option value="freelancer">Freelancer</option>
                </Select>
              </Field>
              <Field label="Compensation Model">
                <Select id="p-compensationModel" value={form.compensationModel} onChange={value => setForm({ ...form, compensationModel: value })}>
                  <option value="hourly">Hourly</option>
                  <option value="monthly">Monthly</option>
                  <option value="fixed_per_service">Fixed per Service</option>
                </Select>
              </Field>
              <Field label="Resource Status">
                <Select id="p-resourceStatus" value={form.resourceStatus} onChange={value => setForm({ ...form, resourceStatus: value })}>
                  <option value="active">Active</option>
                  <option value="assignable">Assignable</option>
                  <option value="on_leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </Field>
              <Field label="Hourly Rate">
                <TextInput id="p-hourlyRate" type="number" placeholder="Rate" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} />
              </Field>
              <Field label="Weekly Hours">
                <TextInput id="p-weeklyHours" type="number" placeholder="40" value={form.weeklyHours} onChange={e => setForm({ ...form, weeklyHours: e.target.value })} />
              </Field>
              <Field label="Overtime Multiplier">
                <TextInput id="p-overtimeMultiplier" type="number" placeholder="1.5" value={form.overtimeMultiplier} onChange={e => setForm({ ...form, overtimeMultiplier: e.target.value })} />
              </Field>
            </FormGrid>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={editing ? () => update(editing!) : create}>{editing ? 'Save Changes' : 'Create Person'}</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}