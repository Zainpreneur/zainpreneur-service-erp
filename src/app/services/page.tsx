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
import { Package, Plus, Search } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('card');

  const load = () => {
    setLoading(true);
    fetch(`/api/services${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then(r => r.json())
      .then(d => { setServices(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Services</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Service catalogue with variants, attributes and configuration.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus size={16} /> New Service
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-500" size={16} />
          <Input className="pl-9" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <Button variant="secondary" onClick={load}>Search</Button>
        <ViewSwitcher value={view} onChange={setView} options={['card', 'list', 'table', 'gallery']} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : services.length === 0 ? (
        <EmptyState title="No services found" description="Add a service to start building your catalogue." icon={Package} />
      ) : (
        <>
          {view === 'card' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {services.map((s: any) => (
                <Link key={s.id} href={`/services/${s.id}`}>
                  <Card className="h-full transition hover:border-indigo-600/40">
                    <CardHeader>
                      <div className="min-w-0">
                        <CardTitle className="truncate">{s.name}</CardTitle>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{s.code} • {s.categoryName}</p>
                      </div>
                      <Badge color={s.active ? 'emerald' : 'rose'}>{s.active ? 'Active' : 'Archived'}</Badge>
                    </CardHeader>
                    <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{s.summary}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                      <span>{s.serviceType}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{s.currency} {s.basePrice}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {view === 'list' && (
            <div className="space-y-2">
              {services.map((s: any) => (
                <Link key={s.id} href={`/services/${s.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 transition hover:border-indigo-600/40">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{s.name}</p>
                      <Badge color={s.active ? 'emerald' : 'rose'}>{s.active ? 'Active' : 'Archived'}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{s.code} • {s.categoryName} • {s.serviceType}</p>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{s.currency} {s.basePrice}</span>
                </Link>
              ))}
            </div>
          )}

          {view === 'table' && (
            <Card className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-500 dark:text-slate-500">
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s: any) => (
                      <tr key={s.id} className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3"><Link href={`/services/${s.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{s.code}</Link></td>
                        <td className="px-4 py-3 font-medium">{s.name}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.categoryName}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.serviceType}</td>
                        <td className="px-4 py-3"><Badge color={s.active ? 'emerald' : 'rose'}>{s.active ? 'Active' : 'Archived'}</Badge></td>
                        <td className="px-4 py-3 text-right font-semibold">{s.currency} {s.basePrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {view === 'gallery' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {services.map((s: any) => (
                <Link key={s.id} href={`/services/${s.id}`}>
                  <Card className="flex h-full flex-col items-center gap-2 p-4 text-center transition hover:border-indigo-600/40">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400">
                      <Package size={24} />
                    </div>
                    <p className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{s.currency} {s.basePrice}</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
