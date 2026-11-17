'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building2, Plus } from 'lucide-react';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', category: '', city: '', contactName: '', contactEmail: '' });
  const [show, setShow] = useState(false);

  const load = () => fetch('/api/businesses').then(r => r.json()).then(setBusinesses);
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/businesses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', category: '', city: '', contactName: '', contactEmail: '' });
    setShow(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Businesses</h1>
          <p className="mt-1 text-slate-400">Customers and accounts.</p>
        </div>
        <Button onClick={() => setShow(!show)}><Plus size={16} /> New Business</Button>
      </div>
      {show && (
        <Card>
          <CardHeader><CardTitle>Create Business</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="Contact Name" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
            <Input placeholder="Contact Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <Button className="mt-3" onClick={create}>Create</Button>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {businesses.map((b: any) => (
          <Card key={b.id}>
            <CardHeader>
              <div>
                <CardTitle>{b.name}</CardTitle>
                <p className="text-xs text-slate-500">{b.reference} · {b.category}</p>
              </div>
              <Badge color={b.status === 'active' ? 'emerald' : 'rose'}>{b.status}</Badge>
            </CardHeader>
            <div className="space-y-1 text-sm text-slate-400">
              <div>{b.city}{b.country ? `, ${b.country}` : ''}</div>
              <div>{b.contactName}</div>
              <div>{b.contactEmail}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}