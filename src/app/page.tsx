'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, Ticket, Package, Building2 } from 'lucide-react';
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
    });
  }, []);
  const stats = [
    { label: 'Services', value: data.services.length, icon: Package, color: 'indigo', href: '/services' },
    { label: 'Service Requests', value: data.requests.length, icon: FileText, color: 'cyan', href: '/requests' },
    { label: 'Help Desk Tickets', value: data.tickets.length, icon: Ticket, color: 'amber', href: '/tickets' },
    { label: 'Businesses', value: data.businesses.length, icon: Building2, color: 'emerald', href: '/businesses' },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-slate-400">Service Catalogue → Service Request → Help Desk overview</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="transition hover:border-indigo-500/50 hover:shadow-indigo-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{s.label}</p>
                    <p className="mt-2 text-3xl font-bold">{loading ? '—' : s.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${s.color === 'indigo' ? 'bg-indigo-600/20 text-indigo-300' : s.color === 'cyan' ? 'bg-cyan-600/20 text-cyan-300' : s.color === 'amber' ? 'bg-amber-600/20 text-amber-300' : 'bg-emerald-600/20 text-emerald-300'}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent Service Requests</CardTitle></CardHeader>
          <div className="space-y-3">
            {data.requests.slice(0, 5).map((r: any) => (
              <Link key={r.id} href={`/requests/${r.id}`} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-indigo-500/40">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-slate-400">{r.reference} · {r.businessName}</p>
                </div>
                <Badge color={r.status === 'completed' ? 'emerald' : r.priority === 'urgent' || r.priority === 'high' ? 'rose' : 'indigo'}>{r.status}</Badge>
              </Link>
            ))}
            {!loading && data.requests.length === 0 && <p className="text-sm text-slate-500">No requests yet.</p>}
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Tickets</CardTitle></CardHeader>
          <div className="space-y-3">
            {data.tickets.slice(0, 5).map((t: any) => (
              <Link key={t.id} href={`/tickets/${t.id}`} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-indigo-500/40">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.reference} · {t.businessName}</p>
                </div>
                <Badge color={t.priority === 'urgent' ? 'rose' : t.status === 'resolved' || t.status === 'closed' ? 'emerald' : 'amber'}>{t.status}</Badge>
              </Link>
            ))}
            {!loading && data.tickets.length === 0 && <p className="text-sm text-slate-500">No tickets yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}