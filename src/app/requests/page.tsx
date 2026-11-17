'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileText, Plus, Search } from 'lucide-react';

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    fetch(`/api/requests?${params}`).then(r => r.json()).then(d => { setRequests(d); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="mt-1 text-slate-400">Track and manage service requests across businesses.</p>
        </div>
        <Link href="/requests/new"><Button><Plus size={16} /> New Request</Button></Link>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <Input className="pl-9" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Button variant="secondary" onClick={load}>Filter</Button>
      </div>
      {loading ? <p className="text-slate-400">Loading...</p> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr className="border-b border-slate-800">
                  <th className="py-3 pr-4">Reference</th>
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Business</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Priority</th>
                  <th className="py-3 pr-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-3 pr-4"><Link href={`/requests/${r.id}`} className="text-indigo-400 hover:underline">{r.reference}</Link></td>
                    <td className="py-3 pr-4">{r.title}</td>
                    <td className="py-3 pr-4 text-slate-400">{r.businessName}</td>
                    <td className="py-3 pr-4"><Badge color={r.status === 'completed' ? 'emerald' : r.status === 'in_progress' ? 'cyan' : 'default'}>{r.status}</Badge></td>
                    <td className="py-3 pr-4"><Badge color={r.priority === 'urgent' || r.priority === 'high' ? 'rose' : 'default'}>{r.priority}</Badge></td>
                    <td className="py-3 pr-4">{r.currency} {r.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {requests.length === 0 && <p className="py-6 text-center text-slate-500">No requests found.</p>}
        </Card>
      )}
    </div>
  );
}