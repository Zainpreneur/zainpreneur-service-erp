'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/ui/PageHeader';
import { FileText, Ticket, Package, Building2, Plus, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardPage() {
  const [data, setData] = useState<any>({ services: [], requests: [], tickets: [], businesses: [], people: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(r => r.json()),
      fetch('/api/requests').then(r => r.json()),
      fetch('/api/tickets').then(r => r.json()),
      fetch('/api/businesses').then(r => r.json()),
      fetch('/api/people').then(r => r.json()),
    ]).then(([services, requests, tickets, businesses, people]) => {
      setData({ services, requests, tickets, businesses, people });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Services', value: data.services.length, icon: Package, color: 'primary', href: '/services', trend: { direction: 'up', label: '+12%', value: 'vs last week' } },
    { label: 'Service Requests', value: data.requests.length, icon: FileText, color: 'accent', href: '/requests', trend: { direction: 'down', label: '-5%', value: 'vs last week' } },
    { label: 'Help Desk Tickets', value: data.tickets.length, icon: Ticket, color: 'warning', href: '/tickets', trend: { direction: 'up', label: '+8%', value: 'vs last week' } },
    { label: 'Businesses', value: data.businesses.length, icon: Building2, color: 'success', href: '/businesses', trend: { direction: 'neutral', label: '0%', value: 'vs last week' } },
    { label: 'People', value: data.people.length, icon: Users, color: 'secondary', href: '/people', trend: { direction: 'up', label: '+3%', value: 'vs last week' } },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Service Catalogue to Service Request to Help Desk overview"
        breadcrumbs={[{ label: 'Home', href: '/' }]}
        action={<Link href="/requests/new"><Button size="lg"><Plus size={16} /> New Request</Button></Link>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} href={s.href} loading={loading} trend={s.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent Service Requests</CardTitle>
            <Link href="/requests" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
          </CardHeader>
          <div className="space-y-2 p-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
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
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <Link href="/tickets" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
          </CardHeader>
          <div className="space-y-2 p-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
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