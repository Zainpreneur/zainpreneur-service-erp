'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Plus, Building2 } from 'lucide-react';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', category: '', city: '', contactName: '', contactEmail: '' });
  const [show, setShow] = useState(false);

  const load = () => fetch('/api/businesses').then(r => r.json()).then((d) => setBusinesses(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/businesses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', category: '', city: '', contactName: '', contactEmail: '' });
    setShow(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Businesses</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Customers and accounts.</p>
        </div>
        <Button onClick={() => setShow(true)}><Plus size={16} /> New Business</Button>
      </div>

      <Modal open={show} onOpenChange={setShow} title="Create Business" description="Add a new customer account.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          <Input placeholder="Contact Name" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
          <Input placeholder="Contact Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={create}>Create</Button>
        </div>
      </Modal>

      {businesses.length === 0 ? (
        <EmptyState title="No businesses yet" description="Add your first customer account." icon={Building2} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {businesses.map((b: any) => (
            <Card key={b.id}>
              <CardHeader>
                <div className="min-w-0">
                  <CardTitle className="truncate">{b.name}</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{b.reference} • {b.category}</p>
                </div>
                <Badge color={b.status === 'active' ? 'emerald' : 'rose'}>{b.status}</Badge>
              </CardHeader>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <div>{b.city}{b.country ? `, ${b.country}` : ''}</div>
                <div>{b.contactName}</div>
                <div>{b.contactEmail}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
