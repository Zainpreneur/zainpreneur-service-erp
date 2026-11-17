'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ViewSwitcher, type ViewMode } from '@/components/ui/ViewSwitcher';
import { FileText, Plus, Search } from 'lucide-react';

const STATUSES = ['draft', 'new', 'in_progress', 'completed', 'cancelled'];

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('table');

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    fetch(`/api/requests?${params}`)
      .then(r => r.json())
      .then(d => { setRequests(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = status ? requests.filter((r) => r.status === status) : requests;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Service Requests</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Track and manage service requests across businesses.</p>
        </div>
        <Link href="/requests/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={16} /> New Request
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-500" size={16} />
          <Input className="pl-9" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <select className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <Button variant="secondary" onClick={load}>Filter</Button>
        <ViewSwitcher value={view} onChange={setView} options={['table', 'list', 'card', 'board']} />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No requests found" description="Try adjusting filters or create a new request." icon={FileText} />
      ) : (
        <>
          {view === 'table' && (
            <Card className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-500 dark:text-slate-500">
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Business</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r: any) => (
                      <tr key={r.id} className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3"><Link href={`/requests/${r.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{r.reference}</Link></td>
                        <td className="px-4 py-3 font-medium">{r.title}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.businessName}</td>
                        <td className="px-4 py-3"><Badge color={r.status === 'completed' ? 'emerald' : r.status === 'in_progress' ? 'cyan' : 'default'}>{r.status}</Badge></td>
                        <td className="px-4 py-3"><Badge color={r.priority === 'urgent' || r.priority === 'high' ? 'rose' : 'default'}>{r.priority}</Badge></td>
                        <td className="px-4 py-3 text-right">{r.currency} {r.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {view === 'list' && (
            <div className="space-y-2">
              {filtered.map((r: any) => (
                <Link key={r.id} href={`/requests/${r.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 transition hover:border-indigo-600/40">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{r.title}</p>
                      <Badge color={r.status === 'completed' ? 'emerald' : r.status === 'in_progress' ? 'cyan' : 'default'}>{r.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{r.reference} • {r.businessName} • {r.priority}</p>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{r.currency} {r.totalAmount}</span>
                </Link>
              ))}
            </div>
          )}

          {view === 'card' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r: any) => (
                <Link key={r.id} href={`/requests/${r.id}`}>
                  <Card className="h-full transition hover:border-indigo-600/40">
                    <CardHeader>
                      <div className="min-w-0">
                        <CardTitle className="truncate">{r.title}</CardTitle>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{r.reference} • {r.businessName}</p>
                      </div>
                      <Badge color={r.status === 'completed' ? 'emerald' : r.status === 'in_progress' ? 'cyan' : 'default'}>{r.status}</Badge>
                    </CardHeader>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                      <Badge color={r.priority === 'urgent' || r.priority === 'high' ? 'rose' : 'default'}>{r.priority}</Badge>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{r.currency} {r.totalAmount}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {view === 'board' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((st) => {
                const items = requests.filter((r) => r.status === st);
                return (
                  <div key={st} className="min-w-[260px] flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">{st.replace('_', ' ')}</h3>
                      <Badge color="default">{items.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {items.map((r: any) => (
                        <Link key={r.id} href={`/requests/${r.id}`} className="block rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition hover:border-indigo-600/40">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{r.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{r.reference}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge color={r.priority === 'urgent' || r.priority === 'high' ? 'rose' : 'default'}>{r.priority}</Badge>
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{r.currency} {r.totalAmount}</span>
                          </div>
                        </Link>
                      ))}
                      {items.length === 0 && <p className="py-4 text-center text-xs text-slate-500 dark:text-slate-500">No items</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
