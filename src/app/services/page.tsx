'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Package, Plus, Search } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(`/api/services${search ? `?search=${encodeURIComponent(search)}` : ''}`).then(r => r.json()).then(d => { setServices(d); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="mt-1 text-slate-400">Service catalogue with variants, attributes and configuration.</p>
        </div>
        <Button><Plus size={16} /> New Service</Button>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <Input className="pl-9" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <Button variant="secondary" onClick={load}>Search</Button>
      </div>
      {loading ? <p className="text-slate-400">Loading...</p> : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s: any) => (
            <Link key={s.id} href={`/services/${s.id}`}>
              <Card className="h-full transition hover:border-indigo-500/50">
                <CardHeader>
                  <div>
                    <CardTitle>{s.name}</CardTitle>
                    <p className="text-xs text-slate-500">{s.code} · {s.categoryName}</p>
                  </div>
                  <Badge color={s.active ? 'emerald' : 'rose'}>{s.active ? 'Active' : 'Archived'}</Badge>
                </CardHeader>
                <p className="line-clamp-2 text-sm text-slate-400">{s.summary}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{s.serviceType}</span>
                  <span className="font-semibold text-slate-200">{s.currency} {s.basePrice}</span>
                </div>
              </Card>
            </Link>
          ))}
          {services.length === 0 && <p className="col-span-full text-slate-500">No services found.</p>}
        </div>
      )}
    </div>
  );
}