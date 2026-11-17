'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, Plus } from 'lucide-react';

export default function PeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', team: '', role: '' });
  const [show, setShow] = useState(false);

  const load = () => fetch('/api/people').then(r => r.json()).then(setPeople);
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/people', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', email: '', team: '', role: '' });
    setShow(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">People</h1>
          <p className="mt-1 text-slate-400">Staff and assignees.</p>
        </div>
        <Button onClick={() => setShow(!show)}><Plus size={16} /> New Person</Button>
      </div>
      {show && (
        <Card>
          <CardHeader><CardTitle>Create Person</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Team" value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} />
            <Input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          </div>
          <Button className="mt-3" onClick={create}>Create</Button>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {people.map((p: any) => (
          <Card key={p.id}>
            <CardHeader>
              <div>
                <CardTitle>{p.name}</CardTitle>
                <p className="text-xs text-slate-500">{p.role} · {p.team}</p>
              </div>
              <Badge color={p.isActive ? 'emerald' : 'rose'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
            </CardHeader>
            <div className="text-sm text-slate-400">{p.email}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}