'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { FileText, Ticket, Package, Building2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>({ services: [], requests: [], tickets: [], businesses: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(r => r.json()),
      fetch('/api/requests').then(r => r.json()),
      fetch('/api/tickets').then(r => r.json()),
      fetch('/api/businesses').then(r => r.json()),
    ]).then(([services, requests, tickets, businesses]) => {
      setData({ services, requests, tickets, businesses });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Services', value: data.services.length, icon: Package, color: 'primary' as const, href: '/services' },
    { label: 'Service Requests', value: data.requests.length, icon: FileText, color: 'accent' as const, href: '/requests' },
    { label: 'Help Desk Tickets', value: data.tickets.length, icon: Ticket, color: 'warning' as const, href: '/tickets' },
    { label: 'Businesses', value: data.businesses.length, icon: Building2, color: 'success' as const, href: '/businesses' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Service Catalogue to Service Request to Help Desk overview</p>
        </div>
        <Link href="/requests/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={16} /> New Request
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} href={s.href} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Service Requests</CardTitle>
            <Link href="/requests" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
          </CardHeader>
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
            ) : data.requests.length === 0 ? (
              <EmptyState title="No requests yet" description="Create your first service request to get started." icon={FileText} />
            ) : (
              data.requests.slice(0, 5).map((r: any) => (
                <Link key={r.id} href={`/requests/${r.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-3 transition hover:border-indigo-600/40 hover:bg-slate-100 dark:hover:bg-slate-800/40">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-slate-100">{r.title}</p>
                    <p className="truncate text-xs text-slate-600 dark:text-slate-400">{r.reference} • {r.businessName}</p>
                  </div>
                  <Badge color={r.status === 'completed' ? 'emerald' : r.priority === 'urgent' || r.priority === 'high' ? 'rose' : 'indigo'}>{r.status}</Badge>
                </Link>
              ))
            )}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <Link href="/tickets" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
          </CardHeader>
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
            ) : data.tickets.length === 0 ? (
              <EmptyState title="No tickets yet" description="Help desk tickets will appear here." icon={Ticket} />
            ) : (
              data.tickets.slice(0, 5).map((t: any) => (
                <Link key={t.id} href={`/tickets/${t.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-3 transition hover:border-indigo-600/40 hover:bg-slate-100 dark:hover:bg-slate-800/40">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-slate-100">{t.title}</p>
                    <p className="truncate text-xs text-slate-600 dark:text-slate-400">{t.reference} • {t.businessName}</p>
                  </div>
                  <Badge color={t.priority === 'urgent' ? 'rose' : t.status === 'resolved' || t.status === 'closed' ? 'emerald' : 'amber'}>{t.status}</Badge>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
