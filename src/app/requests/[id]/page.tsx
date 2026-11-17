'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [req, setReq] = useState<any>(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  const load = () => {
    fetch(`/api/requests/${id}`).then(r => r.json()).then(d => { setReq(d); setStatus(d.status); });
  };
  useEffect(() => { load(); }, [id]);

  const updateStatus = async () => {
    await fetch(`/api/requests/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  if (!req) return <p className="text-slate-400">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/requests" className="text-slate-400 hover:text-slate-100"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold">{req.title}</h1>
          <p className="text-sm text-slate-400">{req.reference} · {req.businessName} · {req.serviceName}</p>
        </div>
        <Badge color={req.status === 'completed' ? 'emerald' : req.priority === 'urgent' ? 'rose' : 'cyan'} className="ml-auto">{req.status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Priority:</span> {req.priority}</div>
            <div><span className="text-slate-500">Assigned:</span> {req.assignedToName ?? 'Unassigned'}</div>
            <div><span className="text-slate-500">Required:</span> {req.requiredDate ?? '—'}</div>
            <div><span className="text-slate-500">Total:</span> {req.currency} {req.totalAmount}</div>
            <div><span className="text-slate-500">Contact:</span> {req.contactName ?? '—'}</div>
            <div><span className="text-slate-500">Email:</span> {req.contactEmail ?? '—'}</div>
          </div>
          {req.description && <p className="mt-4 text-slate-300">{req.description}</p>}
          {req.addOns?.length ? (
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-400">Add-ons</p>
              <ul className="mt-2 space-y-1 text-sm">{req.addOns.map((a: any, i: number) => <li key={i}>{a.name} × {a.quantity} — {a.price}</li>)}</ul>
            </div>
          ) : null}
        </Card>
        <Card>
          <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
          <Select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Button className="mt-3 w-full" onClick={updateStatus}>Save</Button>
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-400">Create Ticket</p>
            <Button variant="secondary" className="mt-2 w-full" onClick={() => router.push(`/tickets/new?requestId=${req.id}`)}>Open Help Desk Ticket</Button>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
        <div className="space-y-3">
          {req.events?.map((e: any) => (
            <div key={e.id} className="flex gap-3 border-l-2 border-slate-700 pl-4">
              <div>
                <p className="text-sm font-medium">{e.eventType}</p>
                <p className="text-xs text-slate-500">{e.actor} · {new Date(e.createdAt).toLocaleString()}</p>
                {e.note && <p className="text-sm text-slate-400">{e.note}</p>}
              </div>
            </div>
          ))}
          {(!req.events || req.events.length === 0) && <p className="text-slate-500">No events.</p>}
        </div>
      </Card>
    </div>
  );
}