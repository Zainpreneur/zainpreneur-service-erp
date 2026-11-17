'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Plus, Users } from 'lucide-react';

export default function PeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', team: '', role: '' });
  const [show, setShow] = useState(false);

  const load = () => fetch('/api/people').then(r => r.json()).then((d) => setPeople(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/people', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', email: '', team: '', role: '' });
    setShow(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">People</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Staff and assignees.</p>
        </div>
        <Button onClick={() => setShow(true)}><Plus size={16} /> New Person</Button>
      </div>

      <Modal open={show} onOpenChange={setShow} title="Create Person" description="Add a new staff member.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Team" value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} />
          <Input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={create}>Create</Button>
        </div>
      </Modal>

      {people.length === 0 ? (
        <EmptyState title="No people yet" description="Add staff and assignees." icon={Users} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {people.map((p: any) => (
            <Card key={p.id}>
              <CardHeader>
                <div className="min-w-0">
                  <CardTitle className="truncate">{p.name}</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{p.role} • {p.team}</p>
                </div>
                <Badge color={p.isActive ? 'emerald' : 'rose'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
              </CardHeader>
              <div className="text-sm text-slate-600 dark:text-slate-400">{p.email}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
