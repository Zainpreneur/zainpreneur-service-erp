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
  const [resolution, setResolution] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [relatedIds, setRelatedIds] = useState<number[]>([]);
  const [selectedRelated, setSelectedRelated] = useState('');
  const [allTags, setAllTags] = useState<any[]>([]);
  const [ticketTags, setTicketTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState('');

  const load = () => {
    fetch(`/api/tickets/${id}`).then(r => r.json()).then(d => { setTicket(d); setStatus(d.status); setResolution(d.resolution ?? ''); setResolutionSummary(d.resolutionSummary ?? ''); });
    fetch('/api/tickets').then(r => r.json()).then((d) => setAllTickets(Array.isArray(d) ? d : []));
    fetch(`/api/ticket-relations?ticketId=${id}`).then(r => r.json()).then((d) => setRelatedIds(Array.isArray(d) ? d : []));
    fetch('/api/tags').then(r => r.json()).then((d) => setAllTags(Array.isArray(d) ? d : []));
    fetch(`/api/entity-tags?entity=ticket&entityId=${id}`).then(r => r.json()).then((d) => setTicketTags(Array.isArray(d) ? d : []));
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
  const saveResolution = async () => {
    await fetch(`/api/tickets/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resolution, resolutionSummary }) });
    load();
  };
  const addRelated = async () => {
    if (!selectedRelated) return;
    await fetch('/api/ticket-relations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId: Number(id), relatedId: Number(selectedRelated) }) });
    setSelectedRelated('');
    load();
  };
  const removeRelated = async (rid: number) => {
    await fetch('/api/ticket-relations', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId: Number(id), relatedId: rid }) });
    load();
  };
  const addTag = async () => {
    if (!selectedTag) return;
    await fetch('/api/entity-tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entity: 'ticket', entityId: Number(id), tagId: Number(selectedTag) }) });
    setSelectedTag('');
    load();
  };
  const removeTag = async (tid: number) => {
    await fetch('/api/entity-tags', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entity: 'ticket', entityId: Number(id), tagId: tid }) });
    load();
  };

  if (!ticket) return <p className="text-slate-600 dark:text-slate-400">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tickets" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{ticket.reference} · {ticket.businessName}{ticket.serviceName ? ` · ${ticket.serviceName}` : ''}</p>
        </div>
        <Badge color={ticket.priority === 'urgent' ? 'rose' : 'amber'} className="ml-auto">{ticket.priority}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Conversation</CardTitle></CardHeader>
          <div className="space-y-3">
            {ticket.messages?.map((m: any) => (
              <div key={m.id} className={`rounded-lg border p-3 ${m.isInternal ? 'border-amber-700/40 bg-amber-900/10' : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.author} <span className="text-xs text-slate-500 dark:text-slate-500">({m.authorRole})</span></span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{m.body}</p>
                {m.isInternal && <Badge color="amber" className="mt-2">Internal</Badge>}
              </div>
            ))}
            {(!ticket.messages || ticket.messages.length === 0) && <p className="text-slate-500 dark:text-slate-500">No messages yet.</p>}
          </div>
          <div className="mt-4 space-y-2">
            <Textarea rows={3} placeholder="Write a reply..." value={reply} onChange={e => setReply(e.target.value)} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
              <div><span className="text-slate-500 dark:text-slate-500">Type:</span> {ticket.type}</div>
              <div><span className="text-slate-500 dark:text-slate-500">Category:</span> {ticket.category}</div>
              <div><span className="text-slate-500 dark:text-slate-500">Contact:</span> {ticket.contactName ?? '—'}</div>
              <div><span className="text-slate-500 dark:text-slate-500">Contact Role:</span> {ticket.contactRole ?? '—'}</div>
              <div><span className="text-slate-500 dark:text-slate-500">Email:</span> {ticket.contactEmail ?? '—'}</div>
              <div><span className="text-slate-500 dark:text-slate-500">Assigned Team:</span> {ticket.assignedTeam ?? '—'}</div>
              <div><span className="text-slate-500 dark:text-slate-500">Resolution:</span> {ticket.resolution ?? '—'}</div>
              {ticket.resolutionSummary && <div><span className="text-slate-500 dark:text-slate-500">Resolution Summary:</span> {ticket.resolutionSummary}</div>}
              <div><span className="text-slate-500 dark:text-slate-500">SLA Due:</span> {ticket.slaDueAt ? new Date(ticket.slaDueAt).toLocaleString() : '—'}</div>
              {ticket.serviceRequestId && <div><span className="text-slate-500 dark:text-slate-500">Request:</span> <Link href={`/requests/${ticket.serviceRequestId}`} className="text-indigo-400 hover:underline">#{ticket.serviceRequestId}</Link></div>}
            </div>
            <div className="mt-3 space-y-2">
              <label className="block text-sm text-slate-600 dark:text-slate-400">Resolution</label>
              <Input value={resolution} onChange={e => setResolution(e.target.value)} />
              <label className="block text-sm text-slate-600 dark:text-slate-400">Resolution Summary</label>
              <Textarea rows={3} value={resolutionSummary} onChange={e => setResolutionSummary(e.target.value)} />
              <Button variant="secondary" className="w-full" onClick={saveResolution}>Save Resolution</Button>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Related Tickets</CardTitle></CardHeader>
            <div className="space-y-2">
              {relatedIds.map((rid) => (
                <div key={rid} className="flex items-center justify-between text-sm">
                  <Link href={`/tickets/${rid}`} className="text-indigo-400 hover:underline">#{rid}</Link>
                  <Button variant="danger" onClick={() => removeRelated(rid)}>Remove</Button>
                </div>
              ))}
              {relatedIds.length === 0 && <p className="text-slate-500 dark:text-slate-500 text-sm">No related tickets.</p>}
              <div className="flex gap-2">
                <Select value={selectedRelated} onChange={e => setSelectedRelated(e.target.value)}>
                  <option value="">Select ticket</option>
                  {allTickets.filter((t: any) => String(t.id) !== String(id) && !relatedIds.includes(t.id)).map((t: any) => <option key={t.id} value={t.id}>{t.reference} - {t.title}</option>)}
                </Select>
                <Button onClick={addRelated}>Link</Button>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {ticketTags.map((t: any) => (
                  <Badge key={t.id} color="indigo">
                    {t.name} <button onClick={() => removeTag(t.id)} className="ml-1 text-xs">×</button>
                  </Badge>
                ))}
                {ticketTags.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-500">No tags.</p>}
              </div>
              <div className="flex gap-2">
                <Select value={selectedTag} onChange={e => setSelectedTag(e.target.value)}>
                  <option value="">Select tag</option>
                  {allTags.filter((t: any) => !ticketTags.some((x: any) => x.id === t.id)).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
                <Button onClick={addTag}>Add</Button>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <div className="space-y-2">
              {ticket.events?.map((e: any) => (
                <div key={e.id} className="border-l-2 border-slate-300 dark:border-slate-700 pl-3">
                  <p className="text-sm font-medium">{e.eventType}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{e.actor} · {new Date(e.createdAt).toLocaleString()}</p>
                  {e.note && <p className="text-xs text-slate-600 dark:text-slate-400">{e.note}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}