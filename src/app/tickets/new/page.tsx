'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function NewTicketForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ businessId: '', serviceId: '', serviceRequestId: sp.get('requestId') || '', title: '', description: '', type: 'question', category: 'general', priority: 'normal', status: 'new', contactName: '', contactEmail: '', contactPhone: '', slaDueAt: '' });

  useEffect(() => {
    fetch('/api/businesses').then(r => r.json()).then(setBusinesses);
    fetch('/api/services').then(r => r.json()).then(setServices);
    fetch('/api/requests').then(r => r.json()).then(setRequests);
  }, []);

  const submit = async () => {
    const payload = { ...form, businessId: Number(form.businessId), serviceId: form.serviceId ? Number(form.serviceId) : null, serviceRequestId: form.serviceRequestId ? Number(form.serviceRequestId) : null };
    const res = await fetch('/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    router.push(`/tickets/${data.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tickets" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold">New Ticket</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Ticket Details</CardTitle></CardHeader>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Business</label>
            <Select value={form.businessId} onChange={e => setForm({ ...form, businessId: e.target.value })}>
              <option value="">Select business</option>
              {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Service (optional)</label>
              <Select value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}>
                <option value="">None</option>
                {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Linked Request (optional)</label>
              <Select value={form.serviceRequestId} onChange={e => setForm({ ...form, serviceRequestId: e.target.value })}>
                <option value="">None</option>
                {requests.map((r: any) => <option key={r.id} value={r.id}>{r.reference} - {r.title}</option>)}
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Title</label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Description</label>
            <Textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Type</label>
              <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="question">Question</option>
                <option value="incident">Incident</option>
                <option value="problem">Problem</option>
                <option value="task">Task</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Category</label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Priority</label>
              <Select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Contact Name</label>
              <Input value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Contact Email</label>
              <Input value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
            </div>
          </div>
          <Button onClick={submit} className="w-full">Create Ticket</Button>
        </div>
      </Card>
    </div>
  );
}

export default function NewTicketPage() {
  return <Suspense fallback={<p>Loading...</p>}><NewTicketForm /></Suspense>;
}