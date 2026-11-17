'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [internal, setInternal] = useState(false);
  const [status, setStatus] = useState('');

  const load = () => {
    fetch(`/api/tickets/${id}`).then(r => r.json()).then(d => { setTicket(d); setStatus(d.status); });
  };
  useEffect(() => { load(); }, [id]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    await fetch(`/api/tickets/${id}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author: 'Agent', authorRole: 'agent', body: reply, isInternal: internal }) });
    setReply('');
    load();
  };
  const saveStatus = async () => {
    await fetch(`/api/tickets/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  if (!ticket) return <p className="text-slate-400">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tickets" className="text-slate-400 hover:text-slate-100"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="text-sm text-slate-400">{ticket.reference} · {ticket.businessName}{ticket.serviceName ? ` · ${ticket.serviceName}` : ''}</p>
        </div>
        <Badge color={ticket.priority === 'urgent' ? 'rose' : 'amber'} className="ml-auto">{ticket.priority}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Conversation</CardTitle></CardHeader>
          <div className="space-y-3">
            {ticket.messages?.map((m: any) => (
              <div key={m.id} className={`rounded-lg border p-3 ${m.isInternal ? 'border-amber-700/40 bg-amber-900/10' : 'border-slate-800 bg-slate-900/40'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.author} <span className="text-xs text-slate-500">({m.authorRole})</span></span>
                  <span className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{m.body}</p>
                {m.isInternal && <Badge color="amber" className="mt-2">Internal</Badge>}
              </div>
            ))}
            {(!ticket.messages || ticket.messages.length === 0) && <p className="text-slate-500">No messages yet.</p>}
          </div>
          <div className="mt-4 space-y-2">
            <Textarea rows={3} placeholder="Write a reply..." value={reply} onChange={e => setReply(e.target.value)} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input type="checkbox" checked={internal} onChange={e => setInternal(e.target.checked)} /> Internal note
              </label>
              <Button onClick={sendReply}>Send</Button>
            </div>
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <Select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="new">New</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>
            <Button className="mt-3 w-full" onClick={saveStatus}>Save</Button>
          </Card>
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <div className="space-y-2 text-sm">
              <div><span className="text-slate-500">Type:</span> {ticket.type}</div>
              <div><span className="text-slate-500">Category:</span> {ticket.category}</div>
              <div><span className="text-slate-500">Contact:</span> {ticket.contactName ?? '—'}</div>
              <div><span className="text-slate-500">Email:</span> {ticket.contactEmail ?? '—'}</div>
              <div><span className="text-slate-500">SLA Due:</span> {ticket.slaDueAt ? new Date(ticket.slaDueAt).toLocaleString() : '—'}</div>
              {ticket.serviceRequestId && <div><span className="text-slate-500">Request:</span> <Link href={`/requests/${ticket.serviceRequestId}`} className="text-indigo-400 hover:underline">#{ticket.serviceRequestId}</Link></div>}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <div className="space-y-2">
              {ticket.events?.map((e: any) => (
                <div key={e.id} className="border-l-2 border-slate-700 pl-3">
                  <p className="text-sm font-medium">{e.eventType}</p>
                  <p className="text-xs text-slate-500">{e.actor} · {new Date(e.createdAt).toLocaleString()}</p>
                  {e.note && <p className="text-xs text-slate-400">{e.note}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}