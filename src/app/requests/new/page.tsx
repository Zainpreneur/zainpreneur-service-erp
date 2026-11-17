'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewRequestPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ businessId: '', serviceId: '', title: '', description: '', priority: 'normal', status: 'draft', contactName: '', contactEmail: '', requiredDate: '', basePrice: 0, totalAmount: 0, currency: 'USD' });

  useEffect(() => {
    fetch('/api/businesses').then(r => r.json()).then(setBusinesses);
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  const onServiceChange = (sid: string) => {
    const s = services.find((x: any) => String(x.id) === sid);
    setForm((f: any) => ({ ...f, serviceId: sid, basePrice: s?.basePrice ?? 0, totalAmount: s?.basePrice ?? 0, currency: s?.currency ?? 'USD' }));
  };

  const submit = async () => {
    const payload = { ...form, businessId: Number(form.businessId), serviceId: Number(form.serviceId), basePrice: Number(form.basePrice), totalAmount: Number(form.totalAmount) };
    const res = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    router.push(`/requests/${data.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/requests" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold">New Service Request</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Request Details</CardTitle></CardHeader>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Business</label>
            <Select value={form.businessId} onChange={e => setForm({ ...form, businessId: e.target.value })}>
              <option value="">Select business</option>
              {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Service</label>
            <Select value={form.serviceId} onChange={e => onServiceChange(e.target.value)}>
              <option value="">Select service</option>
              {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Title</label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Description</label>
            <Textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Priority</label>
              <Select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Status</label>
              <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
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
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Required Date</label>
            <Input type="date" value={form.requiredDate} onChange={e => setForm({ ...form, requiredDate: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Base Price</label>
              <Input type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Total Amount</label>
              <Input type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} />
            </div>
          </div>
          <Button onClick={submit} className="w-full">Create Request</Button>
        </div>
      </Card>
    </div>
  );
}