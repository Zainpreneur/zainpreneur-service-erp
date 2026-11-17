'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Layers, FileText, Ticket, Building2, Users, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/services', label: 'Services', icon: Package },
  { href: '/attributes', label: 'Attributes', icon: Layers },
  { href: '/requests', label: 'Service Requests', icon: FileText },
  { href: '/tickets', label: 'Help Desk', icon: Ticket },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/people', label: 'People', icon: Users },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-800 bg-slate-900/95 backdrop-blur transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400" />
          <span className="text-lg font-semibold">Zainpreneur</span>
        </div>
        <nav className="space-y-1 p-4">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
            const Icon = n.icon;
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
                <Icon size={18} /> {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
          <div className="text-sm text-slate-400">Service Request Module</div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}