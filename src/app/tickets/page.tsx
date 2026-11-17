'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ticket, Plus, Search } from 'lucide-react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    fetch(`/api/tickets?${params}`).then(r => r.json()).then(d => { setTickets(d); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Help Desk</h1>
          <p className="mt-1 text-slate-400">Support tickets linked to businesses and service requests.</p>
        </div>
        <Link href="/tickets/new"><Button><Plus size={16} /> New Ticket</Button></Link>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <Input className="pl-9" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="open">Open</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting">Waiting</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <Button variant="secondary" onClick={load}>Filter</Button>
      </div>
      {loading ? <p className="text-slate-400">Loading...</p> : (
        <div className="space-y-3">
          {tickets.map((t: any) => (
            <Link key={t.id} href={`/tickets/${t.id}`}>
              <Card className="transition hover:border-indigo-500/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.reference} · {t.businessName}{t.serviceName ? ` · ${t.serviceName}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={t.priority === 'urgent' ? 'rose' : t.priority === 'high' ? 'amber' : 'default'}>{t.priority}</Badge>
                    <Badge color={t.status === 'resolved' || t.status === 'closed' ? 'emerald' : t.status === 'new' ? 'cyan' : 'indigo'}>{t.status}</Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {tickets.length === 0 && <p className="text-slate-500">No tickets found.</p>}
        </div>
      )}
    </div>
  );
}