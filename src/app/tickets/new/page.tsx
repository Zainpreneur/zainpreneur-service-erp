'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, TextArea, Select } from '@/components/ui/Form';

export default function NewTicketPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    businessId: '', serviceId: '', serviceRequestId: sp.get('requestId') || '', variantId: '',
    title: '', description: '', type: 'question', category: 'general', priority: 'normal',
    status: 'new', assignedTeam: '', contactName: '', contactEmail: '', contactPhone: '',
    contactRole: '', slaDueAt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/businesses').then(r => r.json()).then(setBusinesses);
    fetch('/api/services').then(r => r.json()).then(setServices);
    fetch('/api/requests').then(r => r.json()).then(setRequests);
  }, []);

  const submit = async () => {
    if (!form.businessId || !form.title?.trim() || !form.type || !form.category) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        businessId: Number(form.businessId),
        serviceId: form.serviceId ? Number(form.serviceId) : null,
        serviceRequestId: form.serviceRequestId ? Number(form.serviceRequestId) : null,
        variantId: form.variantId ? Number(form.variantId) : null,
      };
      const res = await fetch('/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      router.push(`/tickets/${data.id}`);
    } catch (error: any) {
      alert(error.message || 'Failed to create ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="New Ticket"
        back={{ href: '/tickets', label: 'Back to Tickets' }}
        action={<Button onClick={submit} disabled={isSubmitting} className="w-auto">{isSubmitting ? 'Creating...' : 'Create Ticket'}</Button>}
      />

      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="space-y-5">
          <FormSection title="Ticket details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <Field label="Variant (optional)">
                <Select id="tk-variant" value={form.variantId} onChange={value => setForm({ ...form, variantId: value })}>
                  <option value="">None</option>
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
            </div>
          </FormSection>

          <FormSection title="Contact">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </div>
          </FormSection>

          <FormSection title="Description">
            <Field label="Description">
              <TextArea id="tk-description" rows={4} placeholder="Describe the issue..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </Field>
          </FormSection>
        </div>
        <FormFooter>
          <Button variant="secondary" type="button" onClick={() => router.push('/tickets')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Ticket'}</Button>
        </FormFooter>
      </form>
    </div>
  );
}